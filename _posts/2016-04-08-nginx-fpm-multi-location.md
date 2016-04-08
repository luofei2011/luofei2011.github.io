---
layout: post
title: "nginx+fpm多location配置"
description: "nginx,php-fpm,multi-location"
category: "nginx"
tags:
  - nginx
---

#### 干嘛要多location配置

如此多的端口，为啥还要搞个多location呢？因为服务器限制了端口映射的个数，为了资源的合理运用。不过还有一些场景，如：beta版本、测试版本就可以和生产版本挂在同一host、同一port下；方便记忆。

#### google搜索

关键字：`nginx php multiple locations`, `nginx php multiple locations become download`, `nginx php fpm multiple location`, `nginx php fpm multiple location become download`

这几篇搜索结果中，前几条结果我基本都研究了。但是并没有成功。综合了一下，如下配置是比较靠谱的。

{%highlight conf lineons%}
location /beta/ {
	root /var/www/someApp; # 注意，这里实际访问的地址是：/var/www/someApp/beta/
	try_files $uri $uri/ /index.php?$query_string;
	
	location ~ \.php$ {
		fastcgi_split_path_info ^(.+\.php)(/.+)$;
		# NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
			
		# With php5-cgi alone:
		# fastcgi_pass 127.0.0.1:9000;
		# With php5-fpm:
		fastcgi_pass unix:/var/run/php5-fpm.sock;
		include fastcgi_params;
		
		# 某些nginx版本中，这句是没有加上的
		fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
		fastcgi_index index.php;
	}   
}
{%endhighlight%}

__参考链接__

* [nginx-multiple-sites-in-subdirectories](http://programmersjunk.blogspot.jp/2013/11/nginx-multiple-sites-in-subdirectories.html)

#### 写在最后

如果上面的配置还是不能成功，比如。访问就变成下载文件。。。

__修改`/etc/php5/fpm/php.ini`__

{%highlight conf lineons%}
cgi.fix_pathinfo=0 # 设置为0
{%endhighlight%}
