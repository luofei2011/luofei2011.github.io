---
layout: post
title: "jquery内核学习(11)--事件模型(下)"
description: ""
category: jquery
tags: 
  - jquery内核
  - 学习笔记
---
{% include JB/setup %}

在事件模型中, 上一节介绍了原生的js事件模型. 但是在不同浏览器间规范还是有一定的区
别(IE), 因此为了更好地兼容不同类型的浏览器, jquery在js的基础上进一步封装了不同的
事件模型. 考虑到IE不支持捕获阶段触发; 且开发者也很少适用这个阶段, 故jquery事件流
中也不支持该阶段, 除了这一点以外其它的功能都与DOM 2级事件模型相似.

## 绑定事件

#### bind()

    bind('click', [data], fn);

与`addEventListener`类似, 第一个是无前缀`on`的事件类型, fn也是事件处理函数;
`data`比较特殊, 可选参数. 在fn可通过`event.data`访问到传递的数据对象.

    // 给处理函数传递参数
    $('p').bind('click', {a:'A', b:'B'}, function(event) {
        $(this).text(event.data.a + event.data.b);  // AB
    });

若想阻止默认行为的发生, 或者是阻止事件冒泡. 在事件处理函数中返回false.

    // 如上的例子
    $('p').bind('click', {a:'A', b:'B'}, function(event) {
        $(this).text(event.data.a + event.data.b);  // AB
        return false;
    });

    // 其它方法.
    event.stopPropagation();
    event.preventDefault();
<!--more--> 

除了bind以外, jquery还有[20给快捷方法](http://www.w3school.com.cn/jquery/jquery_ref_events.asp)为特定的事件绑定事件处理程序.

    $("p").bind('click', function() {
        alert($(this).text());
    });

    // 更直接地
    $("p").click(function() {
        alert($(this).text());
    });

> 注意: 当适用如上的快捷方式时, 无法想event.data属性传递额外的数据.

    // 当不给这些方法传递处理函数时
    <div>test</div>

    $('div').bind('click', function() {
        alert($(this).text());
    });

    $('div').click();   // 直接触发click事件.

#### 使用one()绑定

> 使用方法和bind一样, 唯一的区别的one在执行一次后就自动销毁.

#### 销毁事件

`unbind`方法用来销毁事件, 能够从每一个匹配的元素中删除绑定的事件. 若无参数则删除
所有的绑定事件, 包括自定义事件.

    // 为p绑定一堆事件
    <p>text</p>

    $("p").click(f);
    $('p').mouseover(f);
    $('p').mouseout(f);

    // 销毁绑定的所有事件
    $('p').dbclick(function() {
        $('p').unbind();
    });

    function f(event) {
        this.innerHTML = "event type: " + event.type;
    }

    // 删除某一类型的事件
    $('p').unbind('click'); // 只删除所有的点击事件

    $('p').unbind('click', f);  // 只删除某一类型事件的某一个处理函数

关于Event对象的更多属性和方法, 点击[这里](http://api.jquery.com/category/events/event-object/)了解.

## jquery事件触发

    trigger('click', [data]);

即触发特定类型的事件, 而不需要用户真正的去点击什么的. 这样触发的事件会有冒泡过程
, 并且也会触发浏览器的默认行为.

    triggerHandler('click', [data]);

与上面的主要区别在于: 不会触发浏览器的默认行为, 只触发jquery对象集合中第一个元素
的事件处理函数. 返回的是事件处理函数的返回值而不是jquery对象.

除了上面两个函数以外, jquery还提供了很多[快捷触发方法](http://www.w3school.com.cn/jquery/jquery_ref_events.asp).

## 事件切换

- toggle()

可包含多个处理函数, 当点击事件发生以后. 依次轮流执行这些函数.

    $('input').toggle(
        function() {
            this.value = "first";
        },
        function() {
            this.value = "second";
        },
        function() {
            this.value = "third";
        }
    );

    //
    <input type="button" value="value">

#### hover()

包含两个参数, 第一个是鼠标移动到元素上要触发的函数, 第二个是鼠标移除时触发的函数
.

    // html
    <input type="button" value="hover">

    $('input').hover(
        function() {
            this.value = "mouseover";
        },
        function() {
            this.value = "mouseout";
        }
    );

> mouseout事件有个BUG, 即当鼠标移动到当前元素包含的子元素上时, 会触发当前元素的
> mouseout和mouseover事件. 故使用jquery的bind, mouseout(), mouseover()方法也会有
> 相同的问题. 故使用hover()能有效避免上面情况的出现.

## jquery事件委派

#### live()

用法和bind相同, 但是live()方法能够给当前以及未来将会匹配的元素绑定一个事件处理函
数. 而bind则对后面加入的元素无效.

> live()只支持使用选择器选择的元素, 如: `$('li a').live(...)`, 但不支持类似于:
> `$('a', someElement).live()`或者`$('a').parent().live()`等.

live的事件冒泡和传统事件略有不同, 部分支持`stopPropagation`. 若内外元素都用live
事件绑定, 则可以通过`return false`来阻止冒泡, 若外部父元素是不同事件而内部是live
事件则无法通过`return false`阻止冒泡.

> 通过`die`来移除绑定, 使用方法和`unbind`类似.

## jquery事件命名空间

可以给绑定的相同事件取别名, 方便后面的管理或者销毁. 如`click.a`. a就是click当前
事件的别名, 即事件命名空间.

    $('div').bind('click.a', function() {});
    $('div').bind('click.b', function() {});
    $('div').bind('dbclick.a', function() {});

    // 这样销毁特定的事件
    $('div').unbind('.a');  // 删除所有别名是a的事件

    // 对于trigger()方法
    $('div').trigger('click!'); // 加!, 表示触发没有命名空间的click事件

## 在js中自定义bind方法

    // DOMextend的定义在前面第9讲有介绍
    DOMextend('bind', function(type, data, fn) {

        var _this = this;
        if ( _this.addEventListener ) { // 非IE
            _this.addEventListener(type, function(event) {
                event.datas = data; // 传递用户的自定义数据对象
                fn(event);  // 执行事件处理函数
            }, false);  // 冒泡阶段触发
        } else { // IE
            _this.attachEvent('on' + type, function() {
                var event = window.event;
                event.datas = data;
                fn(event);
            });
        }

        return _this;
    });

    // 在使用的时候使用event.datas获取用户传递的数据对象

## 自定义one方法

    // DOMextend的定义在前面第9讲有介绍
    DOMextend('bind', function(type, data, fn) {

        var _this = this;
        if ( _this.addEventListener ) { // 非IE
            _this.addEventListener(type, function(event) {
                _this.removeEventListener(type, arguments.callee, false);   //
                触发一次后就注销事件
                event.datas = data; // 传递用户的自定义数据对象
                fn(event);  // 执行事件处理函数
            }, false);  // 冒泡阶段触发
        } else { // IE
            _this.attachEvent('on' + type, function() {
                _this.detachEvent('on' + type, arguments.callee);   // 注销事件
                var event = window.event;
                event.datas = data;
                fn(event);
            });
        }

        return _this;
    });

    // 在使用的时候使用event.datas获取用户传递的数据对象

> arguments.callee

    function test() {
        alert(arguments.callee);
    }
    
    test(); // 返回函数体
    /*
     function test() {
         alert(arguments.callee);
     }
    */
