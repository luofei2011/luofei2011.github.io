---
layout: post
title: "浏览器检测"
description: "浏览器的检测方法"
category: javascript
tags: 
  - 学习笔记
  - 翻译
  - 兼容性检测
  - 编码风格
---
{% include JB/setup %}

## 浏览器检测的历史

一切都始于网景浏览器, 在当时是最受欢迎并且被广泛使用的浏览器. 它的2.0版本在当时
远远超过其它任何可用的浏览器. 所以在网站中都会检测浏览器的`user-agent`来返回一个
合理的内容. 这些都强制的要求浏览器厂商(如:Microsoft)包含这些特别的信息在他们浏览
器的`user-agent`中来通过浏览器的检测.

由于网景浏览器的`user-agent`中包含有这么一段信息:

> Mozilla/2.0 (Win95; I)

所以IE浏览器发布的时候也把这段信息复制到IE的`user-agent`中:

> Mozilla/2.0 (compatible; MSIE 3.0; Windows 95)

然后依次的...

Firefox复制网景, 然后Safari复制Firefox, 再接下来就是Chrome复制Safari...

直到2005年, 在JavaScript中引入了`navigator.userAgent`对浏览器的`user-agent`进行
检测.

    navigator.userAgent;    // 返回
    "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.22 (KHTML, like Gecko) Ubuntu Chromium/25.0.1364.160 Chrome/25.0.1364.160 Safari/537.22"

## 基于特征的检测

特征检测就是利用一些浏览器特有的性质进行检测. 如:

    // Bad
    if ( navigator.userAgent.indexOf("MSIE 7") > -1 ) {
        // do someting
    }

    // 应该用如下的特征进行检测
    if ( document.getElementById ) {
        // do someting
    }
<!--more--> 

这两种方法不能相提并论, 前者只能检测出是否是IE7, 而后者却能检测出所有支持
`document.getElementById`的浏览器.

由于在一些非常古老的浏览器上是不支持`document.getElementById`方法的. 因此:

    // Good
    function getById (id) {

        var element = null;

        if (document.getElementById) {  // DOM
            element = document.getElementById(id);
        } else if (document.all) {  // IE
            element = document.all[id];
        } else if (document.layers) {   // Netscape <= 4
            element = document.layers[id];
        }

        return element;
    }

上面例子给出了特征检测中几个重要的部分:

1. 先测试标准的情况

2. 然后在测试不同浏览器特有的特征, 如IE的`document.all`

3. 最后是在不满足任何情况的情形下给一个合理的返回值. 如上面的`null`

如对于`requestAnimationFrame()`方法, 不同的浏览器厂商有不同的名字:

    // Good
    function setAnimation (callback) {

        if (window.requestAnimationFrame) { // standard
            return requestAnimationFrame(callback);
        } else if (window.mozRequestAnimationFrame) {   // Firefox
            return mozRequestAnimationFrame(callback);
        } else if (window.webkitRequestAnimationFrame) {    // Webkit
            return webkitRequestAnimationFrame(callback);
        } else if (window.oRequestAnimationFrame) {     // Opera
            return oRequestAnimationFrame(callback);
        } else if (window.msRequestAnimationFrame) {    // IE
            return msRequestAnimationFrame(callback);
        } else {
            return setTimeout(callback, 0); // default
        }
    }

当然这只是一个利用特征检测的例子, 在开发中完全可以直接用`setTimeout`代替.

    var ie = !!document.all;    // IE

## 最后

检测浏览器的的目的在于, 区别出古老的浏览器而不是找出当前流行的版本. 作者推荐在可
能的情况下都使用特征进行浏览器的检测.

