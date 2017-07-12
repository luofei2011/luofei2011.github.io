---
layout: post
title: 'Nginx配合CI框架如何做文件上传 & 下载'
description: 'nginx location;codeigniter file download'
category: 'php'
tags: ['nginx', 'ci', 'php']
---

#### 需求提示

由于项目中相关附件管理都是用的OSS服务（七牛、阿里云等）；某些客户考虑到安全原因，附件需要保存到自己的服务器上（可以理解为局域网）。但是之前的代码又不想动，怎么办？

> 之前的附件上传 & 下载逻辑

```
1. 前端上传文件前去服务器获取上传Token及相关配置信息
2. 从配置信息中读取和当前http协议相同的上传地址（避免跨协议）
3. 上传成功后再把返回中的数据写入自有数据库
4. 下载时：直接到第三方去下载
```

#### 兼容方案

从上面的逻辑可看出，token可以随意返回，保证逻辑能走通。然后在具体存储的函数中，用md5的方式重新生成存储的文件名

```php
<?php

class File extends CI_Controller {
	public function getToken() {
		return $this->input->get('filename', true);
	}
	
	public function upload() {
		$file = $_FILES['file'];
		$filename = $file['name'];
		
		$exts = explode('.', $filename);
		$ext = '';
		if (count($exts) > 1) {
			$ext = '.' . end($exts);
		}
		$storeKey = md5($filename . microtime() . rand(0, 1000)) . $ext;
		
		// ... 具体的存储逻辑
		
		# 一个返回json串的函数
		$this->response(array(
			'hash' => $storeKey,
			'mimeType' => $file['type'],
			'name' => $filename,
			'size' => $file['size'],
		));
	}
}
```

#### 文件下载

主要是考虑到安全的因素。两个方面

1. `/uploads/`这个上传目录不能直接访问，即下载均通过`file/download`这样的方式
2. 考虑到`/file/download/xxx.php`这种下载路径，会被nginx识别为文件请求，因此需要添加对应的location选项

* Nginx配置

```
# 该目录直接禁止访问
location /uploads/ {
	deny all;
}

# 针对下载路径的php请求 - 同理，如果nginx中有针对别的后缀的处理，也需要添加。这里只是php后缀
location ~ /file/download/.*\.php$ {
	try_files $uri $uri/ /index.php?$query_string;
}
```

* 下载函数实现

```php
<?php

# 这里的filename可以是任何文件名
public function download($filename) {
	# 下载后保存的文件名
	$attname = $this->input->get('attname', true);
	
	// ...
}
```

#### Nginx Location说明 & 优先级

* `~`

波浪线表示执行一个正则匹配，区分大小写

* `~*`

表示执行一个正则匹配，不区分大小写

* `^~`

`^~`表示普通字符匹配，如果该选项匹配，只匹配该选项，不匹配别的选项，一般用来匹配目录

* `=`

进行普通字符精确匹配

* `@`

定义一个命名的 location，使用在内部定向时，例如 `error_page`, `try_files`

> 优先级
> 
> `=` 精确匹配会第一个被处理。如果发现精确匹配，nginx停止搜索其他匹配。
普通字符匹配，正则表达式规则和长的块规则将被优先和查询匹配，也就是说如果该项匹配还需去看有没有正则表达式匹配和更长的匹配。
>
`^~` 则只匹配该规则，nginx停止搜索其他匹配，否则nginx会继续处理其他location指令。
最后匹配理带有"~"和"~*"的指令，如果找到相应的匹配，则nginx停止搜索其他匹配；当没有正则表达式或者没有正则表达式被匹配的情况下，那么匹配程度最高的逐字匹配指令会被使用。

#### 搬运工

* [nginx location 匹配正则](http://www.nginx.cn/115.html)
