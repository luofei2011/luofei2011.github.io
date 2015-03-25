---
layout: post
title: "浅析node中的回调函数"
description: "callback in node.js setInterval"
category: node.js
tags: 
  - node.js
  - 回调函数
---
{% include JB/setup %}

## 一. node是单线程

写过js代码的都清楚, js是单线程的, 就是只能按照一定的顺序执行, 即使后面的代码有多
重要也不得不等到前面的事件完成才能进行. 举个都熟悉的例子:

    var lock = true;

    var oTimer = setTimeout(function() {
        lock = false;
        console.log('lock changed!');
    }, 100);

    while(lock) {

    };

    console.log('end');

`console`中的两句话永远也不会打印出来的. 因为程序刚以运行, cpu就在持续做一件事.
即while循环, 进行假死状态. 由于单线程的原因其它的事件不可能被触发.

## 二. 回调函数

因为单线程中一个事件的发生必须要等到它之前的都结束了才能进行, 想象这样一种情况.
在程序中我们需要去读一个文件, 但是这个文件又非常大. 若用js的观点来看待的话我们就
必须得等到读文件这个操作执行完了才能进行下面的任务. 在实际应用中这肯定是不可取的
, 读文件的时候cpu空着, 造成资源的浪费! 

<!--more-->

解决上面的问题----回调函数, 什么意思呢? 在一些耗时的事件中(如读文件, 查询, http
请求等)我们不必等到事件执行完才进行下一项任务, 我们给它绑定一个监视器. 让他们在
耗时任务完成以后自动去触发它. 这就是回调函数. 就是在一项任务完成以后触发一个事先
设定好的事件.

    var fs = require('fs');

    fs.readFile('test.txt', 'utf8', function(err, result) {
        if(err) throw err;
        
        // result 就是读取出来的数据
    });

    console.log('我比readFile先执行');

如上的例子, 假设test.txt是一个非常大的文件, 我们在读文件的时候不必等到读文件操作
完成以后再进行下面的任务, 而是给它一个回调函数, 继续进行下面的任务. 等读文件操作
完成以后它会自动触发绑定的回调函数.

## 三. 回调的`陷阱`

有了上面的概念, 下面进行一项具体的任务. 搭建一个中间代理服务器, 即创建一个服务器
, 接收数据请求, 然后本服务器代理去请求目标网站的数据并返回给用户.

###### 1. 创建服务器

    var http = require('http'),
        querystring = require('querystring'),
        url = require('url');

    // 接收get方式请求
    function onRequest(req, res) {
        var query = querystring.parse(url.parse(req.url).query), // 得到查询参数

            // 加入目标网站需要验证用户id和密码
            uid = query.uid,
            upwd = query.password,

            // 这个代理查询的返回数据
            data = "";

        if ( uid !== '' && upwd !== '' ) {
            // 这个函数下面实现, 目的就是去目标网址爬数据
            proxy_query(uid, upwd, data);

            // 响应得到的数据
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.write(JSON.stringify(data));
        // 若数据不合法, 直接返回
        } else {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.write('404 NOT FOUND!');
            res.end();
        }
    }

    // 监听8888端口
    http.createServer(onRequest).listen(8888);

##### 2. 爬取数据

    function proxy_query(uid, upwd, data) {
        var contents = querystring.parse({
            uid: uid,
            password: upwd
        });

        var options = {
            host: '',
            path: '',
            method: 'post',
            headers: {
                ...一堆头, 不同的网站具体要求不一样, 有些要cookie. 有些啥都不要..
            }
        };

        var req = http.request(options, function(res) {
            var result = "";

            res.on('data', function(chunk) {
                result += chunk;
            });
            res.on('end', function() {
                data = result; // 最简单的就是把响应的数据全部返回给用户
            });
        });
        req.write(contents);
        req.end();
    }

流程都敲完了, 但是运行起来的效果真像我们预料的这样吗? 答案是no, 用户什么也得不到
!

因为在请求中, proxy_query()函数执行完成以后就完了..真的就完了, 什么也不管, 具体
的去目标网址爬去数据它交给了回调函数...它的使命已经完成. 但是此时的data并没有数
据, 它不知道proxy_query()中的回调已经完成...

## 四. 解决方案

##### 1. 设置全局锁

    var lock = true,
        oTimer; // 基于定时器实现

    // 在onRequest()中设置一把锁
    if(uid !== '' && upwd !== '') {
        oTimer = setTimeout(function() {
            setTimeout(arguments.callee, 50); // 每隔50ms轮询一次
            if (!lock) {
                // 响应数据
            }
        }, 50);
    }
    // 修改proxy_query()函数
    res.on('end', function() {
        data = result;
        lock = false;
    });

这样做的意思就是, 只有在数据响应完成以后, 才把锁打开. 然后再把数据展示给用户, 但
是这样效率应该不怎么高! 毕竟是轮询. 时间上并不及时.

##### 2. 把响应放到回调函数中

既然是要等到获取数据完成以后再反馈给用户, 那就直接把响应数据放到end里面

    res.on('end', function() {
        data = result;
        // 在这里响应数据
    });

这样很简洁, 不用去设置全局锁, 设置计时器什么的. 所以要利用好回调函数这种特有的机
制!
