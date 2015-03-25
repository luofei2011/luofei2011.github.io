---
layout: post
title: "HTML5-postMessage实现跨域"
description: "cross-domain-with-html5-postMessage"
category: javascript
tags: 
  - 跨域
---

{% include JB/setup %}

## 跨域

只要在同一域名下，即使在不同的文件中；js是不存在跨域问题的，当然其它情况夏就涉及到js的跨域问题
网上有很多方法，JSONP，代理iframe等等……

看了网上关于利用HTML5的`postMessage`来进行跨域, 参照自己写了一个demo。

## Domo

[demo地址](http://poised-flw.com/demo/index.html)

该页面上有两个frame，第一个加载的是[http://www.poised-flw.tk/demo/iframe.html](http://www.poised-flw.tk/demo/iframe.html)；
另一个加载的是当前目录下的iframe.html。

第一个frame中会持续的调用`postMessage`发送信息；然后在第二个frame中会监听`message`事件收到第一个frame发送的信息！

#### 发送信息

    window.setInterval(function() {
        var message = "你好！我是http://www.poised-flw.tk的页面" + (new Date());

        /* 接受第二个参数：代表目标窗口的源地址，只是源地址!
         * '*'代表哪儿都能发
         * '/'代表只能给处在同一目录下的窗口发
         * 若给定地址，如http://www.poised-flw.com;
         * 则只能向src为这个地址的frame发。
         */
        window.parent.frames[1].postMessage(message, "*");
    }, 1000);

#### 接受信息
<!--more-->
    window.addEventListener('message', function(e) {
        /*
         * e.data {string} 发送的信息
         * e.origin {string} 发送的源地址，可以与postMessage的第二个参数一起使用
         * */
        console.log(e.data);
    }, false);
