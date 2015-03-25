---
layout: post
title: "node.js初窥--模拟登录"
description: "第一天接触node.js写的一个小应用, 碰见了一些小问题. 中文乱码"
category: node.js
tags: 
  - 模拟登录
---
{% include JB/setup %}

## 一. 模拟登录

顾名思义, 就是用程序模拟浏览器的行为, 如平时的登录网站或者是向特定网址请求数据等
行为. 当然, 原始的模拟可以照搬浏览器发送的数据格式. 这里就得提到ie9+和chrome的调
试工具--F12了. 不会用的可以先去搜索一下, 都有非常详细的网络抓包适用介绍.

##### 1. 如何模拟

我们模拟的出发点是向特定的服务器地址请求数据或者是发送数据期待得到响应等. 从一次
请求来讲, 浏览器向服务器发出的请求(这里的请求我们称它为request)包括请求头部信息
(request headers), 若请求方式(post & get)是`post`时还包括发送的数据(Form Data).

对应地, 对用户的一次请求服务器会作出相应的响应(response). 包括响应头(response
headers),以及响应内容(response body).

<!--more-->

##### 2. 具体实现

下面以一次post请求为例:

    var http = require('http'),
        querystring = require('querystring');

    // 这就是post发送的数据
    var contents = querystring.stringify({
        uid: "XXXX",
        pwd: "XXXX"
    });
    // 通过querystring.stringify处理过的数据基本就是这个格式:
    // uid=XXXX&pwd=XXXX 很熟悉对吧...

    // 创建http请求的配置参数, 下面的请求地址都是我自己YY的, 基本都是这个格式
    var options = {
        host: 'www.baidu.com', // 这个不用说了, 请求地址
        path: '/login', // 具体路径, 必须以'/'开头, 是相对于host而言的
        method: 'post', // 请求方式, 这里以post为例
        headers: { // 必选信息, 如果不知道哪些信息是必须的, 建议用抓包工具看一下, 都写上也无妨...

            "Content-Type":"application/x-www-form-urlencoded; charset=utf8", // 可以设置一下编码
            "Content-Length":contents.length, // 请求长度, 通过上面计算得到		
            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        
            // 这些都是用抓包程序看到的..就都写上了, 若想少写, 可以一个一个删除试试
            "Accept-Encoding": "gzip,deflate,sdch",
            "Accept-Language":"zh-CN, zh;q=0.8",
            "Cache-Control":"max-age=0",
            "Connection":"Keep-Alive",	
            "Host":"www.baidu.com",
            "Origin":"http://www.baidu.com",
            "Referer":"http://www.baidu.com/login",
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.92 Safari/537.1 LBBROWSER"

            // 最后 有些网站的某些功能是需要附带cookie信息的. 因此在这里还需加一行
            // "Cookie":"some cookie message"
        }
    };

    // 接下来就是创建http请求
    var req=http.request(options,function(res){
        res.setEncoding("utf8"); // 设置编码, 如果目标网址的编码是gbk/gbk2312神码的, 就别设置了, 下面就专门讲解

        var result = "",
            resData = "",
            headers = res.headers, // 像上面所说的, 获取响应的头信息
            cookies = headers["set-cookie"]; // 获得服务器返回的cookie信息, 以后某些功能或许会需要将这些信息一起发送, 因此最好保存下来

        cookies.forEach(function(cookie) {
            result += cookie.replace(/path=\//g,'');
        });

        // 比如把cookie写入文件等, 具体怎么写我就不讲啦...

        // 数据很多的情况下, 并非一次发送完毕. 因此需要记录下整个过程中发送的数据
        res.on("data",function(data){
            resData += data;
        });

        // 在数据发送完毕后触发
        res.on("end", function() {
            // querystring.parse功能: 就是解析...比如一个object会把它解析成object
            console.log(querystring.parse(resData));
        });
    });


    req.write(contents); // xhr.send(). 感觉跟这个差不多
    req.end(); // 这个必须有, 不然就一直等待结束

好吧, 上面基本就是模拟登录的主要架构, 其实不同的请求都是大同小异的. 按照上面的修
秀改改就能OK.

## 二. 遇到的问题

有点js的经验, 所以对node来说不能算完全的不懂..至少js独有的功能我还是游刃有余的啊
...但是涉及涉及到一些node独有的就不行了..

##### 1. 中文乱码

这个相当的蛋疼, 由于node不支持gbk, gbk2312等格式, 所以处理源网址是gbk神马的就坑
了, 一堆乱码. 上网查了下, 大概有两种方法. `iconv`和`iconv-lite`.

我采用的是`iconv`

    # 安装
    sudo npm install -g iconv

    # 或者直接编译源码
    git clone git://github.com/bnoordhuis/node-iconv.git
    node-gyp configure build # 前提需要安装node-gyp. npm install -g node-gyp
    npm install . # 注意后面的'.'

    # 使用
    var iconv = require('iconv').Iconv;

    var req = http.request(options, function(res) {
        res.setEncoding('binary');

        var buffers = "";

        res.on('data', function(chunk) {
            buffers += chunk;
        });
        res.on('end', function() {
            // 这样就转码了
            var arr = (new iconv('GBK', 'UTF-8')).convert(new Buffer(buffers, 'binary')).toString();
        });
    });

若不出现意外, 上面的过程下来gbk神码的都浮云了, 但我的又悲剧了. 明明都已经安装好
了, 可是require的时候还说not found! 网上给的方法有:
在该文件中加入:require.paths.join('/path_to_node_modules'); 貌似是这么写的, 记不
清了, 这种方法在node>0.8的版本中已经摒弃了.所以换用新的方法:

    # 把node的路径写入环境变量
    # 根据自己的shell版本自行放地方, 我的是zsh. 所以修改.zshrc. 对应地有.bashrc等
    export NODE_PATH=/path_to_node_modules # 特别注意, 这个的=号两边千万不要留空格
    # 留空格就会跟我一样悲剧

    # 然后重载一下
    source ~/.zshrc

    # 测试一下有没有修改
    echo $NODE_PATH
    # 若一切正常的话能在终端中输出正确的路径

##### 2. 复杂应用

有了node的基石, 更多的发挥就是js的事了...把你在浏览器中的技术都搬到服务器来吧,
感觉很好的样子...初学它, 感觉很有意思. 这样边实践边学习才有动力!
