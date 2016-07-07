---
layout: post
title: "设计模式-外观模式"
description: "设计模式，外观模式"
category: "设计模式"
tags: 
  - 设计模式
---

外观(Facade)模式，日常在应用开发中也多有用到，就是对一些有“歧义”的API进行封装，减少开发时候的分支和特征判断，如常用的`XMLHttpRequest`、事件绑定等。如果你用jquery这样的类库可能感觉不明显，但当你脱离这些类库的时候就会发现各种兼容性的处理是多么的蛋疼。SO，外观模式就是保护蛋的。

#### 直观印象

{%highlight javascript lineons%}
/*
 * 兼容多浏览器的事件绑定方法
 * @params {HTML-Object} node DOM节点
 * @params {String} type 事件名
 * @params {Function} callback 回调函数
 */
function addEvent(node, type, callback) {
    if (window.addEventListener) {
        node.addEventListener(type, callback, false);
    } else if (window.attachEvent) {
        node.attachEvent('on' + type, callback);
    } else {
        node['on' + type] = callback;
    }
}

// use
var btn = document.getElementById('test');
addEvent(btn, 'click', function() {
    console.log('Event: click!');
});
{%endhighlight%}
