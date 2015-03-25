---
layout: post
title: "Node.js中创建UDP服务器和客户端的例子"
description: "node.js UDP server and client example"
category: node.js
tags: 
  - 网络编程
  - 翻译
---
{% include JB/setup %}

[译自][http://www.hacksparrow.com/node-js-udp-server-and-client-example.html](http://www.hacksparrow.com/node-js-udp-server-and-client-example.html)

## 一. 创建UDP服务器

    var PORT = 33333;
    var HOST = '127.0.0.1';

    var dgram = require('dgram'); // UDP需要引入该模块
    var server = dgram.createSocket('udp4'); // ipv4

    // 给server绑定'listening'事件处理函数
    server.on('listening', function () {
        var address = server.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    // 给server绑定'message'事件处理函数
    server.on('message', function (message, remote) {
        console.log(remote.address + ':' + remote.port +' - ' + message);

    });

    // 监听地址及端口
    server.bind(PORT, HOST);

<!--more-->

#### 注意事项

1. `server.bind()`中的`HOST`是可选的, 若忽略则监听`0.0.0.0`.

2. 当有UDP包到达服务器的时候, `message`事件被触发.

3. 当`server`被初始化并且准备好接收UDP包的时候, `listening`事件被触发.

4. `dgrm.createSocket()`能接收`udp4`和`udp6`, 前者使用IPv4, 后者使用IPv6.

## 二. 创建UDP客户端

一个简单的UDP客户端例子

    var PORT = 33333;
    var HOST = '127.0.0.1';

    var dgram = require('dgram');
    var message = new Buffer('some thing you send');

    var client = dgram.createSocket('udp4'); // ipv4
    client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + HOST +':'+ PORT);
        client.close();
    });

#### 注意事项

1. `client.send()`接收的是正确的__Buffer对象__, 并非普通的字符串或者数字.

2. 第二个参数0代表buffer中UDP包开始的偏移地址.

3. `message.length`是从偏移地址开始的字节数. 在上面的例子中, 开始的偏移地址是0,
然后长度是19字节. 当然, 这点东西能在一个UDP包中直接发送(UDP包大小范围:
46-1500bytes). 然而事实是, 对于大数据, 就必须遍历buffer缓冲区把数据分割成小块的
UPD包进行发送.

4. 数据超出允许的大小也不会发生错误, UDP协议的特点, 超出就直接丢弃.

5. 确保HOST/IP地址和IP版本的一致性, 否则你的数据包将不会到达目的地.
