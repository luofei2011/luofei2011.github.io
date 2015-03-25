---
layout: post
title: "jquery内核学习(3)--作用域分割(下)"
description: ""
category: jquery
tags: ['jquery内核']
---
{% include JB/setup %}

上篇已经介绍了由于this指向的一些困扰带来的问题.现在分析怎么实现init的this和原型对象中的this分开.

## 实例化init

如下的修改过程:

    var $ = jQuery = function() {
        return new jQuery.fn.init();    //实例化init,分割作用域
    }

这里通过返回init的一个实例,想一下.如果现在调用init实例,this指向谁?jQuery.fn中的this又指向谁?

就上面的两个问题,init中的this肯定是指向当前所构造的对象实例(this总是指向类的实例).通俗的讲this目前的"活动范围"就是init这一块!

通过下面的测试,我们会发现一些隐藏的问题:

    console.log($().author);    //undefined
    console.log($().test());    //0
    console.log($().size());    //error

分析上面的结果,除了第二个在我们意料之中以外,另外两个都不是我们想看到的!分析原因:

1. 对于第一个, 就如上面所提到的$()构造一个实例的时候this的区域限定在init()的上下文中,在这个环境中并没有一个叫author的属性.故undefined

2. 对于第三个,同样的思路,当前的this指向环境中并没有一个叫size()的方法!

综上:通过返回一个实例的方式确实解决了this指向混淆的问题,但确实有带来了另一个挑战,如此构造的实例却没法访问原型对象中的属性和方法!
<!--more--> 

## 经典的跨域访问

有没有一个好的方法:技能让this的指向分离,而且使构造的实例又能访问到原型对象中的方法和属性,答案肯定是有的...

对于这个完整的例子.

    var $ = jQuery = function() {
        return new jQuery.fn.init();
    }

    jQuery.fn = jQuery.prototype = {
        init: function() {
            this.length = 0;
            this.test = function() {
                return this.length;
            }
            return this;
        },
        length: 88,
        author: 'Poised-flw',
        size: function() {
            return this.length;
        }
    }

加上下面一句建设性的代码,一切OK!

    jQuery.fn.init.prototype = jQuery.fn;    //使用jQuery的原型对象覆盖掉init的原型对象

这里多说两句,关于`prototype`.

原意是"原型对象"----引用老师的一句话可以这么说,这个就是父亲,能诞生许许多多富有个性的"儿子".但有一点"儿子"的血脉是不能变的,那啥变了就说不清楚了...

上面的代码要传达一个什么样的意思呢?给init找个干爹----jQuery.fn,然后init屌丝逆袭高富帅...把干爹的东西全继承了.

如此以来通过init构造的实例不就顺理成章的访问到jQuery.fn中的所有方法和属性了嘛.

下面测试一下:

    console.log($().author);    //'Poised-flw'
    console.log($().test());    //0
    console.log($().size());    //0

结果全在我们意料之中!多么奇妙的想法,再一次膜拜John Resig.22岁开发的jquery框架...狂汗中. 

## 知识拓展

其实原生的js里也有这么一个要求,就是你在重写一个构造函数的原型对象的时候,必须要修改原型对象的constructor指向构造函数本身!以免造成继承链的紊乱!

    var obj = new Object();
    obj.prototype = {
        //some
    } //完全重写了obj的原型对象

    //因此手动修改一下原型对象的constructor是很有必要的!
    obj.prototype.constructor = obj;

接下来将介绍如何给咱们的$()构造函数传递参数!


