---
layout: post
title: "Node.js中的TCP套接字编程"
description: "tcp socket programming in node.js"
category: node.js
tags: 
  - 网络编程
  - 翻译
---
{% include JB/setup %}

[译自][http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html](http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html)

## 一. Node.js中的TCP套接字编程

Node中有三种`scoket`: `TCP`, `UDP`, `UNIX`域, 本篇文章中主要介绍Node.js中的TCP套
接字基础编程知识.

我们需要写两类TCP套接字程序: 一个`server`服务端的, 另一个是`client`客户端的. 
服务端监听来自客户端的请求并返回数据给客户端, 客户端和服务端通过套接字进行双向通信.

在Node中进行TCP编程需要引入`net`模块, 该模块是异步编程的封装--能做很多事, 但是本
文仅限于如何创建一个客户端和服务端的TCP套接字.

<!--more-->

##### 1. 创建TCP服务端

下面是创建TCP服务端套接字创建的一个简单例子, 注释有详细说明.

    var net = require('net');

    var HOST = '127.0.0.1';
    var PORT = 6969;

    // 创建一个TCP服务器实例, 然后调用监听函数listen
    // 传入net.createServer()的回调函数作为connection事件的处理函数
    // 每一次连接创建一个唯一的sock对象
    net.createServer(function(sock) {
        
        // 创建了一个与socket对象自动关联的连接
        console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
        
        // 给sock添加一个'data'事件, 表示持续从客户端接收到的数据
        sock.on('data', function(data) {
            
            console.log('DATA ' + sock.remoteAddress + ': ' + data);
            // 给sock回发数据, 客户端将收到来自服务端的数据, 假设客户端只发送一
            // 段字符串, 然后我们把字符串处理成大写再返回给客户端
            sock.write('You said "' + data.toUpperCase() + '"');
            
        });
        
        // 给sock添加一个'close'事件
        sock.on('close', function(data) {
            console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
        });
        
    }).listen(PORT, HOST);

    console.log('Server listening on ' + HOST +':'+ PORT);

我们可以用非回调的方式完成同样的功能.

    var server = net.createServer(); 
    server.listen(PORT, HOST);
    console.log('Server listening on ' + server.address().address +':'+ server.address().port);

    // 给server绑定'connection'事件
    server.on('connection', function(sock) {
        
        console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
        // 其它部分与上相同
    });

两种方法只是实现的方式不同, 第一个例子中是把`connection`事件的处理函数传递到`net.createServer`中然后用`listen`函数
来监听指定的地址和端口, 而第二个只是用了更常规的方法. 即先创建, 然后再给它绑定`connection`事件.

##### 2. 创建TCP客户端

接下来就是创建一个客户端的TCP来连接到上面创建的服务器上, 下面的例子创建了一个简单的TCP客户端来连接到服务器
, 它发送一条信息, 然后在得到服务器的响应后关掉连接. 详情见注释..

    var net = require('net');

    var HOST = '127.0.0.1';
    var PORT = 6969;

    var client = new net.Socket();
    client.connect(PORT, HOST, function() {

        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
        // 给服务器发送信息
        client.write('I am Chuck Norris!');

    });

    // 添加'data'事件, 数据是从服务器发送过来的
    client.on('data', function(data) {
        
        console.log('DATA: ' + data);
        // 得到数据后关掉连接, 不过貌似数据很多的情况下, 一次是不够的.
        client.destroy();
        
    });

    // 给client添加'close'事件处理函数
    client.on('close', function() {
        console.log('Connection closed');
    });

如上就是node.js中最基本的TCP套接字编程, 希望能对你有所帮助. 真正的TCP套接字编程远比
这个复杂, 当你需要交换大数据并且想处理复杂事情的时候, 你需要用到`Streams`和`Buffers`等相关模块.

## 二. 阅读相关

1. [Node.js net Module](http://nodejs.org/docs/v0.4.12/api/net.html])

2. [Node.js Streams](http://nodejs.org/docs/v0.4.12/api/streams.html)

3. [Node.js Buffers](http://nodejs.org/docs/v0.4.12/api/buffers.html)
