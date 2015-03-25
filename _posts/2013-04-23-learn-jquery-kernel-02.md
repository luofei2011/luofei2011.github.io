---
layout: post
title: "jquery内核学习(2)--作用域分割(上)"
description: ""
category: jquery
tags: ['jquery内核']
---
{% include JB/setup %}

通过上篇文章的介绍,我们已经能在不使用new关键字的情况下返回一个实例,并且这个实例也拥有了自己的属性和方法.

下面就这个简单的框架发现其中的不足

## this指向谁?

若我们把原型对象里面的init函数也视为构造函数,则当前的this该指向谁?

    var $ = jQuery = function() {
        return jQuery.fn.init();
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

    //test
    console.log($().author);    
    console.log($().test());
    console.log($().size());
<!--more--> 

**考虑几个问题:**

1. init里面的this该如何解释?

2. init中this跟size函数里面this有区别?　

我想,解决上面两个问题得从实际入手.

1. 从上面可知,在jQuery的原型对象中有一个length属性.在构造函数init中也有一个length属性和一个test方法.当调用的时候:

    $().author;

运行这个实例的时候,init中的this指向调用init的对象!此时:

    $().test();

肯定是输出0!

2. 现在该具体分析this到底指向了谁,到底引用了谁.

从init开始,this指向了调用它的对象---jQuery,事实是:this同样能指向jQuery的原型对象.故this还能访问到原型对象中的方法和属性.如:

    $().size();

## this.length为多少

接着前面的例子.三个测试输出的结果应该为多少?

    console.log($().author);    //'Poised-flw'
    console.log($().test());      //0
    console.log($().size());     //0 

第一个没什么好说的,下面来说说二三个为什么都是0而不是88.

要悟透这个问题:得了解js中变量或者方法的寻找过程:比如说:

    $().poised();

js该怎么解释和执行呢?首先肯定是在构造函数$()中去找poised()这个方法,发现没有----->接着去__proto__(原型对象)中寻找一个叫poised()的方法,发现也没有,最终报错error!

知道这个流程了问题就简单了(变量的寻找同样是这个顺序).

现在返回到上面的例子.对于test()方法

    test: function() {
        return this.length;
    }

首先在this的环境中搜寻一下是否有length这个属性,诶,发现一找还真有,那就直接返回!及结果0.

再来看看size()这个方法

    size: function() {
        return this.length;
    }

同样的,记住.当前的this的环境!也是在这个环境中寻找length属性,发现也找到了(找到后就不会再去原型对象中寻找),故返回.结果也为0!

## 带来的问题

通过上面的分析发现,jQuery与它的原型对象相互影响...这并不是我们想看到的结果,因为jQuery和其原型对象的作用域混淆在一起!

怎么解决?当然是分割两者的作用域,下一篇将介绍作用域的分割...
