---
layout: post
title: "jquery内核学习(10)--事件模型(上)"
description: ""
category: jquery
tags: 
  - jquery内核
  - 学习笔记
---
{% include JB/setup %}

## 介绍

事件模型, 亦或是事件驱动模式; 是面向对象设计的一个核心概念, 它以信息为基础, 以事
件来驱动. 当文档发生了特定事情时, 浏览器自动生成一个事件对象(Event), 以响应该事
件, 并执行对应的JavaScript脚本.

## 0级事件模型

由于是在Navigator浏览器中最早引入事件驱动模型的, 因此人们习惯上称之为0级事件模型
. 所有现代浏览器都支持这种模型.

在0级事件模型中, 事件处理程序先被定义为函数实例, 然后绑定到DOM元素的事件属性上面
, 从而实现事件注册.

    var btn = document.getElementsByTagName('input')[0];
    btn.onclick = function() {
        console.log(this.nodeName);
    }

    // html
    <input type="button" value="0级事件模型">

给input绑定一个点击事件, 当点击发生的时候调用这个处理函数打印当前点击的节点元素
名字.
<!--more--> 

## 事件模型中的Event对象

浏览器在事件被触发时, 会自动创建一个Event对象, 在默认状态下它会被作为参数传递给
事件处理函数; 在IE中, 浏览器把Event视为独立的对象, 通过window对象进行访问.

    // 兼容的写法
    var event = event || window.event;

event对象包含了属性和方法, 利用这些属性和方法可以动态存储与当前事件相关的信息;
如: 事件类型, 按下的鼠标键, 键盘键或者光标指针位置等.

    // 绑定不同的处理事件
    var btn = document.getElementsByTagName('input')[0];

    btn.onclick = function(event) {
        var event = event || window.event;
        btn.value = event.type; // click
    } 

    btn.ondbclick = function(event) {
        var event = event || window.event;
        btn.value = event.type; // dbclick
    } 

    // html
    <input type="button"  value="Event对象"/>

> IE和标准DOM之间的event属性方法有差异; 如IE通过srcElement属性来记录当前事件作用
> 的元素, 而标准DOM使用target来记录; 还有button属性(表示鼠标的哪个部分按下), IE的button返回值是
> 1,2,4;而DOM标准返回0,2,1; 分别代表左, 右, 中键.

## 事件冒泡

从DOM标准角度分析, 事件流一般分为三个阶段: 捕捉阶段, 目标阶段, 冒泡阶段.

事件冒泡: 在目标元素获取机会处理事件之后, 事件模型会检查目标元素的父元素是否也注
册了相同类型的事件, 如此迭代向上继续直到DOM树的顶部的过程.

    // 举个例子
    // html & css
    div {
        margin: auto;
        border: 1px solid #000; /*默认是黑色边框*/
    }

    <div style="width:200px; height: 200px;">
      <div style="width: 150px; height: 150px;">
        <div style="width: 100px; height: 100px;">
          <div style="width: 50px; height: 50px;"> click here </div>
        </div>
      </div>
    </div>

    // js
    window.onload = function() {
        var div = document.getElementsByTagName('div');

        for ( var i = 0; i < div.length; i++ ) {
            div[i].onclick = (function(i) {
                return function() {
                    div[i].style.borderColor = 'red';
                };
            })(i);  // 利用闭包给每个div注册click事件
        }
    }

    // 效果
    // 当你点击里面层的div时, 对应父辈元素边框也变成红色
    
## 事件流控制与默认事件动作

在DOM标准事件模型中, 使用event对象的`stopPropagation()`方法可以中止事件继续向上级层次传播. 对于
IE浏览器, 可以使用event对象的`cancelBubble()`属性来阻止. 设置该属性的值为true即可. 另外对于一些设定了默认事件
的元素: 如a有默认的导航功能, 但我们可以通过在事件处理函数中返回false来阻止默认事件的发生.

    var a = document.getElementsByTagName('a')[0];
    a.onclick = function() {
        console.log(a.getAttribute('href'));
        return false;   // 将不会按连接进行跳转
    }

    // html
    <a href="http://www.poised-flw.com">我的博客</a>

## 2级DOM标准事件模型

0级事件模型存在缺陷: 元素属性被用来存储事件处理函数的引用, 所以每个元素对于任何特定事件模型每次只能
注册一个事件处理程序; 后面若注册了相同的事件类型则会重写.

#### 注册事件

2级事件模型定义了`addEventListener()`方法.

    addEventListener('click', function, useCapture(default = false));

第一参数表示绑定的事件类型, 没有前缀`on`, 第二个参数表示要调用的事件处理函数, 该函数自带一个默认参数引用`event`对象
第三个是boolean值, `true`表示在事件传播的捕获阶段触发响应; `false`表示在事件传播的冒泡阶段触发.

#### 事件传播

在2级事件模型中, 一旦事件被触发, 事件流首先从DOM树顶部向下传播, 直到目标节点, 然后再从目标节点冒泡到DOM树顶. 前阶段称为
捕获阶段, 后阶段称为冒泡阶段.

`addEventListener()`方法可以通过第三个参数的设定, 设置事件响应的阶段.

    // true捕获阶段发生
    // html
    <input type="button" value="Event对象">
    <p>捕获阶段的过程:</p>

    // js
    window.onload = function() {
        var btn = document.getElementsByTagName('input')[0];
        var p = document.getElementsByTagName('p')[0];
        var i = 1;
        do {
            btn.addEventListener('click', function() {
                p.innerHTML += "</br>(" + i++ + ") " + this.nodeName;
            }, true);

            btn = btn.parentNode;
        } while(btn);
    }

    // 结果
    // (1) #document
    // (2) html
    // (3) body
    // (4) input
   
    // false冒泡阶段发生 
    // 相同的程序, 只是js的第三个参数是false
    // (1) input
    // (2) body
    // (3) html
    // (4) #document

#### 销毁事件

`removeEventListener()`方法用来销毁事件, 用法和`addEventListener()`相对. 且两者第三个参数必须
一致才能正确的销毁事件.

    // 为上面的input销毁click事件
    this.removeEventListener('click', arguments.callee, false); // this指向input, arguments.callee引用当前的事件
    处理函数

## IE事件模型

IE7及以下不支持2级事件模型, IE8以上才开始支持, IE有自己的事件模型. 与2级事件模型相似.

#### 注册事件

    attachEvent('onclick', function);

第一个是带前缀`on`的事件模型, 第二个是事件处理函数. 没有第三个参数, 只支持毛破型事件传播, 不支持捕获阶段的响应.

> `attachEvent`的事件处理函数中的this指针指向的是window对象, 0级事件模型中this指向当前注册事件的对象; DOM 2级事件模型中this
> 会指向触发当前事件的对象. 因此在IE中若函数处理函数是一个引用的时候需要注意this的指向, 一般推荐第二个参数直接调用函数,
> 然后通过返回闭包函数的形式实现传递事件处理函数.

    // 如用IE事件模型为上面的input注册事件
    btn.attachEvent('onclick', (function() {
        return function() {
            p.innerHTML += "</br>(" + i++ + ") " + btn.nodeName;
        };
    })(btn));   // 把btn作为参数传进去

#### 事件传播

如上介绍的, IE不支持事件流中的捕获阶段, 只支持冒泡型事件传播方式. IE中通过`cancelBubble`属性来中止事件流冒泡

    window.event.cancelBubble = true;

> `cancelBubble`只适用于当前事件, 当新事件发生时, 它将被赋予新的event对象. 即此时`cancelBubble`的值为false.

#### 注销事件

通过`detachEvent()`方法来注销事件, 两个参数, 第一个是注销的事件属性名, 第二个是事件处理函数.

    // 销毁上面的事件, 发生一次后立即销毁
    btn.detachEvent('onclick', arguments.callee);
