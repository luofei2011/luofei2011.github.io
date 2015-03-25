---
layout: post
title: "javascript事件处理"
description: "编写可维护性强的js代码需要注意的事件处理方法"
category: javascript
tags:
  - 编码风格
  - 翻译
  - 学习笔记
---
{% include JB/setup %}

## 典型的用法

`event`对象包含跟事件处理相关的所有信息, 有事件的目标以及基于事件类型的数据.
`event`对象上的`Mouse`事件还有额外的位置信息; `keyboard`事件还包含哪个键被传递
; `touch`事件包括触摸的位置和方向信息; 所有的这些信息都能让UI做出相应的反应.

然而, 在很多情况下, 你只使用了`event`中的很少一部分信息. 例如:

    // Bad
    function handleClick(event) {

        var popup = document.getElementById("popup");

        popup.style.left = event.clientX + "px";
        popup.style.top = event.clientY + "px";
        popup.className = "reveal";
    }

    // addListener()
    addListener(element, "click", handleClick);

上面的代码只用到了`event`对象的两个属性: `clientX`和`clientY`. 在将效果展示给
用户前, 这些属性被用来定位一个元素在页面上的位置.

## 分离逻辑层

上一个例子中, 事件处理方法包含了逻辑层; 上面是逻辑层? 逻辑层跟应用程序有关, 而
跟用户的行为无关, 以上面例子为例: 事实上, 逻辑层只负责元素`popup`弹出的效果, 但是并不
关心你用户是怎么去触发它的. 但是这个例子中却把用户的行为和应用程序关联到一起.
因为实际需求中, 很可能有这样的需求: 我不但能通过点击某个元素触发这个处理事件,
我还能通过像鼠标移动, 按键等这样的事件触发它. 怎么做? 只能把相同的事件处理拷贝
绑定给不同的事件操作.
<!--more--> 

上面例子还有一个测试上的缺点, 测试只想通过单独的函数调用来模拟事件驱动, 而不必真正的去点击一
个元素让它触发. 像这样把逻辑层放在事件处理方法中的程序, 测试的唯一方法就是去触
发这个事件...

因此, 应该把逻辑层从事件处理方法中分离出来. 如下:


    // Better - separate application logic
    var MyApplication = {

        handleClick: function(event) {
            this.showPopup(event);
        },

        showPopup: function(event) {
            var popup = document.getElementById("popup");
            popup.style.left = event.clientX + "px";
            popup.style.top = event.clientY + "px";
            popup.className = "reveal";
        }
    };

    addListener(element, "click", function(event) {
        MyApplication.handleClick(event);
    });

现在, `MyApplication.showPopup()`方法包含了在上面例子事件处理方法中的逻辑层,
`MyApplication.handleClick()`方法只是调用了`MyApplication.showPopup()`方法, 由
于把逻辑层从事件处理方法中分离了出去, 测试的时候只需要调用以下函数就行, 而不用
特意的去触发某一个事件.

## 分离逻辑层的第二步

#### 不要传递整个的`event`对象

从上面的例子中可看出: `event`对象从匿名函数传递到
`MyApplication.handleClick()`, 然后再传到`MyApplication.showPopup()`. 前面提到
过, `event`对象里面实质上是包含很多信息的, 但是我们这里只是需要里面的两个坐标
信息.

一个好的方法就是让事件处理方法用`event`来处理事件, 而只把需要的信息传递到逻辑
层. 如下:


    // Good
    var MyApplication = {

        handleClick: function(event) {
            this.showPopup(event.clientX, event.clientY);
        },

        showPopup: function(x, y) {

            var popup = document.getElementById("popup");

            popup.style.left = x + "px";
            popup.style.top = y + "px";
            popup.className = "reveal";
        }
    };

    addListener(element, "click", function(event) {
        MyApplication.handleClick(event); // this is okay
    });

这样传递给逻辑层的只是需要的信息, 这样的好处是测试方便, 并且把它放到任何的环境
下都能正常使用.

    // Great victory!
    MyApplication.showPopup(10, 10);

综上: 当处理事件的时候, 最好让事件处理方法成为唯一接触到`event`对象的途径. 在
把事件委托给一些逻辑层之前, 事件处理方法应该用`event`对象处理一些必须的事情.
如: 阻止事件冒泡, 或者阻止默认的行为(如通过js阻止a的href属性).

    // Good
    var MyApplication = {
        handleClick: function(event) {

            // assume DOM Level 2 events support
            event.preventDefault();
            event.stopPropagation();

            // pass to application logic
            this.showPopup(event.clientX, event.clientY);
        },

        showPopup: function(x, y) {

            var popup = document.getElementById("popup");

            popup.style.left = x + "px";
            popup.style.top = y + "px";
            popup.className = "reveal";
        }
    };

    addListener(element, "click", function(event) {
        MyApplication.handleClick(event);   // this is okay
    });

`MyApplication.handleClick()`在给逻辑层传递参数之前调用两个方法阻止事件的默认行为.

> _由于没有一些具体的经验, 这篇文章翻译起来相对比较吃力, 先这样吧, 兴许以后有
  用得着的地方_
