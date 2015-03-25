---
layout: post
title: "性能优化之--Apache开启gzip压缩"
description: "web前端性能优化"
category: "性能优化"
tags: ['Apache', '性能优化']
---

{% include JB/setup %}

本系列文章可以在这里查看：[性能优化系列](http://www.poised-flw.com/categories.html#性能优化-ref)

#### Apache下开启gzip压缩方法

开启一些模块即可。

	# 去掉这两个模块前面的注释
	LoadModule deflate_module modules/mod_deflate.so
	LoadModule headers_module modules/mod_headers.so
	
	# 在文件后添加
	<IfModule deflate_module>
	SetOutputFilter DEFLATE
	SetEnvIfNoCase Request_URI .(?:gif|jpe?g|png)$ no-gzip dont-vary
	SetEnvIfNoCase Request_URI .(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
	SetEnvIfNoCase Request_URI .(?:pdf|doc|avi|mov|mp3|rm)$ no-gzip dont-vary
	AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
	AddOutputFilterByType DEFLATE application/x-javascript
	</IfModule>
	
#### 检测是否成功

随意访问服务器上的静态文件（js、css、txt等），用调试工具查看网络请求。
<!--more-->
	# Response Headers下有Content-Encoding：gzip即代表成功
	Response Headersview source
	Accept-Ranges:bytes
	Connection:Keep-Alive
	Content-Encoding:gzip  # gzip开启成功
	Content-Length:2159
	Content-Type:application/javascript
	Date:Thu, 30 Oct 2014 09:29:21 GMT
	ETag:"1b8264-1850-500f5b7d91cc0"
	Keep-Alive:timeout=5, max=99
	Last-Modified:Tue, 19 Aug 2014 06:37:15 GMT
	Server:Apache/2.2.23 (Unix) mod_ssl/2.2.23 OpenSSL/1.0.1h DAV/2 PHP/5.5.15
	Vary:Accept-Encoding
	
#### 总结

gzip压缩针对js、css等文本文件压缩比特别高，效果特别明显。但是图片基本就没啥效果。。。一个6.1kb的js文件压缩传输后为2.5kb，提升非常明显啊！
