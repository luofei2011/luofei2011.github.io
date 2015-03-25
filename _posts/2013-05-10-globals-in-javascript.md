---
layout: post
title: "javascript中的全局变量"
description: "尽量避免使用全局变量和全局的函数"
category: javascript
tags: 
  - 全局变量
  - 翻译
  - 学习笔记
---
{% include JB/setup %}

## window对象

在浏览器中, `window`就是一个全局对象. 所有任何在`window`范围内定义的变量或者函
数都是它的属性.

    var color = "red";

    function sayColor() {
        alert( color );
    }

    console.log( window.color );    // "red"
    console.log( typeof window.sayColor );  // "function"

在这个代码片段中, 定义了一个全局变量`color`和一个全局的函数`sayColor`. 并且他
们都被变成了`window`对象的一个属性.

## 全局变量带来的问题

> - 命名空间的冲突

在一个项目中, 当越来越多的全局变量被声明的时候很可能会导致命名的冲突, 因此把变
量放在局部中声明对维护来说是非常容易的.

以上面一个例子的`sayColor`方法为例, 它的执行需要依赖于全局变量`color`的存在,
当color未声明的时候, 这里就会产生一个`error`.

总之一点: 像`color`这样的普通名词, 声明为全局变量后很可能影响到别的开发人员的
工作

> - 脆弱的代码

一个依靠于全局变量的函数, 必须跟所处的环境紧密结合. 当环境改变的时候, 函数将不
能正常的工作, 并且全局变量能被任何函数改变, 可想而知可靠性不足. 做以下改进:

    function sayColor( color ) {
        alert( color );
    }
<!--more--> 

此时将不再依赖全局变量, 因此在环境改变的时候也不会发生像之前那样的错误. 现在
`sayColor`关心的只是传递给它的`arguments`.

**故**: 当定义一个函数的时候, 最好把需要的数据定义到局部环境中, 任何来自于外界
的数据都通过函数的参数进行传递.

> - 测试困难

我也有过相同的感受, 在我们的编译原理实验中, 我们写编译器的顺序是: `词法分析`->
`语法分析`->`语义分析`->`汇编代码生成`. 当我做完`语法分析`的时候, 这时候已经有
了很多的全局变量, 有所有的产生式, 项目集范族集合, 还有两张表(action & goto).
这给我后面的测试带来了很大的困难, 每次运行测试样例的时候都需要从头跑一遍程序以
生成全局变量...

所以说, 为了提高代码的测试效率, 最好确保你的函数并不依赖于全局变量. 当然, 函数
或许会依赖一些`Javascript`提供的原生对象, 如:`Date`, `Array`等. 但他们都是js引
擎提供的, 你能在任何时候访问他们.

> - 偶然产生的全局变量

忽略关键字`var`

    function doSomething() {
        var count = 10;
            title = "Maintaintable JavaScript"; // Bad: global
    }

这是产生全局变量中一个比较典型的错误, coder本来想声明两个局部变量的, 把第一行
的逗号写成分号就成这样了.

一个好的风格是, 在声明一个变量的时候, 不管这个变量是不是全局变量, 都最好加上关
键字`var`.

> - 避免意外产生的全局变量

当你不加关键字`var`产生一个全局变量的时候, JavaScript不会提醒. 但是像JSLint和
JSHint这样的工具会给出相应的提醒.

    foo = 10;

JSHint和JSLint都会提醒: "'foo' is not defined" 来让你知道变量`foo`的声明没有通
过关键字`var`.

并且, 当你试图改变一个全局变量值的时候, 以上两个工具也会给出相应的提醒. 如修改
window或者document的时候.

> - 使用严格模式

在函数的顶部加上`"use strict"`, JS引擎就会进行更多的错误处理和语法检查. 如:

    "use strict"
    foo = 10;   // ReferenceError: foo is not defined

JS引擎将会报错!

## 一个全局途径

在团队开发中, 最典型的就是大量的文件被加载到不同的环境中, 但是对于分离的两部分
代码之间是需要沟通的, 就像前面介绍UI松耦合时说过, 任何两个模块之间是不可能完全
独立的, 他们一定存在某种联系, 而这种联系我们可以通过一个共有的全局对象来实现.

一个全局的方法被应用于一些流行的`javascript`库开发.

   - YUI定义了一个`YUI`的全局变量
   - jQuery定义了两个全局变量, `$`和`jQuery`
   - Dojo定义了一个`dojo`的全局变量
   - Closure库定义了一个`goog`的全局对象

一个全局对象的思想: 用一个唯一的名字创建一个全局对象, 然后通过这个全局对象能访
问到所有内部实现的方法和属性.

假如我们需要定义一个对象来表示一本书中的每一章节.

    function Book( title ) {    // 构造函数名尽量大写第一个字母
        this.title = title;
        this.page = 1;
    }

    // 扩展Book的原型对象
    Book.prototype.turnPage = function( direction ) {
        this.page += direction;
    }

    var Chapter1 = new Book('Introduction to Style Guidelines');
    var Chapter2 = new Book('Basic Formatting');
    var Chapter3 = new Book('Comments');

创建了四个变量, `Book`, `Chapter1`, `Chapter2`, `Chapter3`. 根据一个全局对象的
思想进行修改:

    // 一个全局对象
    var MaintainableJS = {};

    // 这个全局对象有一个Book()的方法. 但这个方法比较特殊, 是构造函数
    MaintainableJS.Book = function( title ) {
        this.title = title;
        this.page = 1;
    }

    // 任何通过Book()构造函数生成的实例都具备`turnPage`方法.
    MaintainableJS.Book.prototype.turnPage = function( direction ) {
        this.page += direction;
    }

    // 创建的章节实例都是全局变量`MaintainableJS`的一个属性
    MaintainableJS.Chapter1 = new MaintainableJS.Book("Introduction to Style Guidelines");
    MaintainableJS.Chapter2 = new MaintainableJS.Book("Basic Formatting");
    MaintainableJS.Chapter3 = new MaintainableJS.Book("Comments");

这样做的好处就是, 你可以随意向这个全局对象里面添加方法和属性, 而不用顾虑别的库
文件相同方法或者属性带来的冲突.

## 0-全局对象 

在一些特殊的环境中, 把一个没有任何全局变量的代码片段注入到一个页面中是非常有用
的, 如: 页面的一些初始化工作, 以及一些只需要执行一次的代码片段.

往往是通过立即执行函数实现的, 例如:

    (function( win ) {
        
        var doc = win.document; // 缓存document对象

        // declare other variables here

        // other code goes here

    }(window));

上面这个立即执行函数中传递了一个`window`对象, 所以在这个封闭环境中能访问到
`window`中的一切属性, 但是这个封闭环境以外的代码却不能访问到封闭环境里面的属性
和方法. 只要里面的变量声明都有`var`关键字(你可以使用`"use strict"`来避免),那么
就不会产生任何的全局变量.


    (function(win) {

        "use strict";

        var doc = win.document;
        
        // declare other variables here

        // other code goes here

    }(window));

这种封闭的环境很多应用中是非常有用的.
