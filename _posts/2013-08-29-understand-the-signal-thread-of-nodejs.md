---
layout: post
title: "理解node.js的单线程"
description: "how to understand the signal thread of node.js"
category: node.js
tags: 
  - node.js
---
{% include JB/setup %}

## 一、node是单线程？ why！

很简单的一个验证方法，不知合理性。但认为应该是正确的； 直接贴代码吧。

	var http = require("http"),
		_global = 0;
	
	http.createServer(function(req, res) {
		_global += 1;
		console.log(_global);
		
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end();
	}).listen(8000);
	
想法很简单：node搭一个服务器，然后大量的请求发向该端口；观察`_global`全局变量是否会顺序增加，下面的测试代码：

	var http = require("http"),
		num = 0;
		
	var options = {
		host: "localhost",
		path: "/",
		method: "get",
		port: "8000",
		headers: {
			"Content-Type":"application/x-www-form-urlencoded; charset=utf8"
		}
	}
	
	var oTimer = setInterval(function() {
		var req=http.request(options,function(res){
			res.on("end", function() {
				console.log(num++);
			});
		});
		
		req.end();
	}, 4);

<!--more-->	
测试程序也很简单，利用定时器；每4ms向服务器发送一次请求，然后开了20个这样定时器；每秒大概就会产生：20 * (1000 / 4) = 5000次请求！

## 测试结果

服务器中的变量`_global`依次增加，并无出现差错。

PS：不知道这个测试能说明什么，或许什么也不能说明；算是自己对node的一点点测试吧。至少知道这种情况下不会出现修改同一块内存的情况！