---
layout: post
title: "jquery内核学习(1)--原型分析"
description: ""
category: jquery
tags: ['jquery内核']
---
{% include JB/setup %}

用jquery一段时间了,也该了解了解内部的具体实现,算是对javascript的高级应用积累点经验.

## "外观"实现

比如说如下代码就是选择一个id为test的DOM节点:

    var test = $("#test")

单从js的语法来分析这个语句,我们能知道$应该一个构造函数,恰好test是$的一个实例!当然#test是构造函数$的参数.

这里留下一个小疑问,实例test的创建不需要new关键字???

先抛开其他的不管,现在只写$这么一个构造函数:

    var jQuery = function() {
        //do something
    }

当然,这个函数表达式的名字嘛也是可以随便取的.比如我想让它叫"$":

    var $ = jQuery = function() {
        //do something
    }
<!--more--> 

现在理论上是可以用这个构造函数进行实例的创建了

    var my$ = $();

当然这是可以的,不过这个构造函数什么也不能做,没有自己的属性,没有自己或者继承来的方法.

下一步肯定是要给他添加属性或者方法:这里还有个问题,属性或者方法是添加构造函数里面还是添加到原型对象里面?

    //方法一
    var $ = jQuery = function() {
        this.version =  '0.1';
        this.author: = 'Poised-flw';
    }

    //方法二
    var $ = jQuery = function() {
        //do something
    }

    jQuery.prototype = {
        version: '0.1',
        author: 'Poised-flw',
        size: function () {
             return this.length;
        }
    }

显然,方法二是我们的选择!当然也可以给jQuery.prototype起一个别名:jQuery.fn.那么最终的版本将是这样:

    var $ = jQuery = function() {};

    jQuery.fn = jQuery.prototype = {
        version: '0.1',
        author: 'Poised-flw',
        size: function() {
            return this.length;
        }
    }

## 生成实例

利用上面的构造函数我们就可以生成实例并且调用它:

    var my$ = new $();
    console.log(my$.version);    //'0.1'
    console.log(my$.author);     //'Poised-flw'
    console.log(my$.size());     //undefined

发现一个问题...实例的生成没摆脱关键字new.

而且通过使用也知道,$()是能直接返回一个实例的!如何实现?

其实想法很简单,让构造函数返回自己的实例不就OK了嘛!

    var $ = jQuery = function() {
        return new jQuery();
    }

真正运行的时候会发现这样的错误:Maximum call stack size exceeded

出现了内存外溢,说明出现了循环应用!

## 返回一个实例

对于这样的一条语句,内部都发生了什么?

    var my$ = new $();

利用构造函数$创建一个实例my$,这时my$就获得了jQuery.prototype中的所有属性和方法!此时prototype里面的this关键字就自动指向my$

tips:

1. 咱们在prototype里面返回一下this,这时的this指向jQuery($),注意啊,这就是一个实例...

    jQuery.fn = jQuery.prototype = {
        init: function() {
            return this;    //this 指向jQuery　　
        }
    }

2. 咋调用这个返回实例的方法?很简单,直接调用

    var $ = jQuery = function() {
        return jQuery.fn.init();    //调用原型的init方法.
    }

 确实,这个技术是如此的神奇....大牛就是大牛.大概的jQuery框架就这么建起来了,接下来就是各种扩展!
