---
layout: post
title: "js事件冒泡的高级应用"
description: "javascript事件代理"
category: javascript
tags: 
  - js事件代理
---
{% include JB/setup %}

## 事件冒泡

[前面](http://www.poised-flw.com/jquery/2013/05/14/learn-jquery-kernel-10/)这篇
文章介绍了js的事件冒泡过程.

利用事件的冒泡阶段, 我们可以轻松的实现事件代理.

过程如下:

    <!--给这个结构的a绑定点击事件-->
    <div id="box">
        <ul>
          <li>
            <a></a>
          </li>
          <li>
            <a></a>
          </li>
          <li>
            <a></a>
          </li>
          <li>
            <a></a>
          </li>
          <li>
            <a></a>
          </li>
        </ul>
    </div>

    // 传统的我们这么做
    var box = document.getElementById('box'),
        oA = box.getElementsByTagName('a'),
        len = oA.length, i = 0;

    for ( ; i < len; i++ ) {
        oA[i].onclick = function() {
            // doSomething
        }
    }
<!--more--> 

当然,从功能的角度来说. 上面的做法没有任何问题, 但是假如盒子里面的内容是动态的,
实时改变的. 我们需要怎么做? 每次都遍历绑定? 再说, 这样一个一个的去绑定确实太费事
. 遇到绑定事件中需要用到变量i的情况还要去使用闭包...

    oA[i].onclick = (function(i) {
        // doSomething
    })(i);

## 事件代理

既然事件的传播过程是向上冒泡的, 为啥不设置一个监听器, 让所有在它之下的元素的事件
响应都让这个监听器来做呢? 我们要做的只是在响应过程中判断一下事件源不就OK了!

    // 对上面的代码进行优化, 把事件都绑定到box盒子上
    var box = document.getElementById('box');

    box.onclick = function() {
        var target = e.srcElement ? e.srcElement : e.target; // 前者是ie, 后者标准DOM

        // 这样就获取了真正请求点击事件的源dom元素.
    }

还有一个问题就是, 在box下面的元素有很多, 怎么才能确定是从a发出的呢? 这就涉及到事
件源的过滤.

    box.onclick = function() {
        var target = e.srcElement ? e.srcElement : e.target, // 前者是ie, 后者标准DOM
            tNodeName = target.nodeName.toLowerCase(); 

        switch(tNodeName) {
            case a:
                // doSomething
                break;
            case ...:
                break;
            default:
                break;
        }
    }

这样的好处是在这个监听器下的所有点击事件都能通过box进行代理. 而我们不必去为每个
元素都绑定一下点击事件. 
