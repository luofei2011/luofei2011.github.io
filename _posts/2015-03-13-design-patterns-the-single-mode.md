---
layout: post
title: "设计模式-单体模式"
description: "设计模式，单体模式"
category: "设计模式"
tags: 
  - 设计模式
---

最近闲来无事，刚好第三次重温下《Javascript 模式》这本书。

#### 应用场景

“单体”即一个类的所有实例都返回的是同一个引用。这点和Javascript中对象的创建完全不同，即使创建两个属性完全一样的对象，但二者还是不相同的。

{%highlight javascript linenos%}
var obj1 = {name: 'poised-flw.com'};
var obj2 = {name: 'poised-flw.com'};

obj1 === obj2; // false

// BTW 如何来判断两个对象是否“相等”呢？

function isObjectEqual(obj1, obj2) {
    var o;
    for (o in obj1) {
        if (obj1.hasOwnProperty(o)) {
            if (obj1[o] !== obj2[o]) return false;
        }
    }

    for (o in obj2) {
        if (obj2.hasOwnProperty(o)) {
            if (obj1[o] !== obj2[o]) return false;
        }
    }

    return true;
}

isObjectEqual(obj1, obj2); // true
{%endhighlight%}
<!--more-->

__SO__ 用处在哪儿呢？

最简单除暴的例子：浏览器的特性检测，这种检测只需要执行一次，后面直接使用即可。（接下来有具体实现）

#### 方法一--属性标记

{%highlight javascript linenos%}
function Browser() {
    if (this.instance) {
        return this.instance;
    }

    var ua = navigator.userAgent.toLowerCase();
    var platform = "windows",
        browser = "ie",
        version = 8,
        match;

    if (ua.indexOf('windows') !== -1) {
        platform = "windows";
    }
    // linux, osx...

    if (ua.indexOf('chrome') !== -1) {
        browser = "chrome";
        match = ua.match(/Chrome\/(\d+)/i);

        version = match && match[1];
    }
    // ie, firefox, 360, QQ...
    
    this.platform = platform;
    this.version = version;
    this.browser = browser;

    Browser.prototype.instance = this;
}
Browser.prototype.instance = null;

// Test
var b1 = new Browser();
var b2 = new Browser();

b1 === b2; // true
{%endhighlight%}

如果你不是强迫症晚期，那么这个方法已经完全能满足需求。唯一不足的地方在于：`instance`属性可以被外界修改。

#### 方法二--闭包

目的就是解决方法一中属性暴露的问题。所以我们把是否初始化的标记放到闭包中来管理。

{%highlight javascript linenos%}
(function(win) {
    var instance = null;
    var Browser = function() {
        if (instance) {
            return instance;
        }

        var ua = navigator.userAgent.toLowerCase();
        var platform = "windows",
            browser = "ie",
            version = 8,
            match;

        if (ua.indexOf('windows') !== -1) {
            platform = "windows";
        }
        // linux, osx...

        if (ua.indexOf('chrome') !== -1) {
            browser = "chrome";
            match = ua.match(/Chrome\/(\d+)/i);

            version = match && match[1];
        }
        // ie, firefox, 360, QQ...
        
        this.platform = platform;
        this.version = version;
        this.browser = browser;

        instance = this;
    }

    win.Browser = Browser;
})(this);
{%endhighlight%}

还等什么，赶紧在项目中试试吧~
