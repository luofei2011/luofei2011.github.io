---
layout: post
title: "javascript类型检测"
description: "想通过和null的比较来判断一个变量是否被赋值合适的值"
category: javascript
tags: 
  - 翻译
  - 学习笔记
  - 编码风格
---
{% include JB/setup %}

在Javascript中, 测试一个变量是否为`null`很普遍, 但是却有问题. 如:

    var Controller = {
        process: function(items) {
            if (items !== null) { // Bad

                items.sort();

                items.forEach(function(item) {
                    // do something
                });
            }
        }
    };

上面的例子中, 目的很明确. 那就是只有items是数组的时候才在`process`方法中对它进行
排序和遍历. 但是当items是`Number`(不为0)或者非空的`string`的时候不为`null`的条件
照样满足, 因此在执行`sort()`方法的时候就会报错!

## 检测原始值

在javascript中有5中原始类型: string, number, boolean, null, undefined. 可以用
`typeof`来检测一个变量的类型. 如:

    var str = "poised-flw";

    typeof str; // "string"
<!--more--> 

由于不同的对象具有不同的方法, 因此在调用这些方法前检测以下变量的类型能避免一些错
误的产生:

    // detect a string
    if (typeof name === "string") {
        anotherName = name.substring(3);
    }

    // detect a number
    if (typeof count === "number") {
        updateCount(count);
    }

    // detect a boolean
    if (typeof found === "boolean" && found) {
        message("Found!");
    }

    // detect undefined
    if (typeof MyApp === "undefined") {
        MyApp = {
        // code
        };
    }

当用`typeof`检测一个未声明的变量时, 都返回"undefined".

    typeof nondeclared_var; // "undefined"

对于`null`这个类型, 简单的比较一个变量是否为`null`并不能给你关于这个变量的足够信
息. 当使用`!==`和`===`的时候能判断一个变量是否真的为`null`.

    // If you must test for null, this is the way to do it
    var element = document.getElementById("my-div");

    if (element !== null) {
        element.className = "found";
    }

由于:
    
    typeof null;    // "object"

因此若想真正比较一个变量是否为null的时候应该使用`!==`或者`===`.

## 检测引用值

在javascript中, 引用是比较有名的. 如两个对象的赋值只是引用并非真正的赋值, 他两指
向同一片内存区域. 因此一个对象的修改将会导致另一个对象的改变.

    var obj = {
        name: 'poised-flw'
    }

    var _obj = obj;

    _obj.name = 'javascript';

    obj.name;   // 'javascript'

因此在javascript中, 任何值的定义都是一个指向. 对于js一些内建的对象Object, Array,
Date, Error等. 虽然名字不一样但是执行typeof后的结果都是一样的.

    console.log( typeof {} );   // "object"
    console.log( typeof [] );   // "object"
    console.log( typeof new Date() );   // "object"
    console.log( typeof new RegExp() );   // "object"
    console.log( typeof null ); // "object"

当然, 这个时候我们就需要换一种方法了.

`instanceof`是检测引用类型的有效途径. 例如:

    // detect a Date
    if (value instanceof Date) {
        console.log(value.getFullYear());
    }

    // detect a RegExp
    if (value instanceof RegExp) {
        if (value.test(anotherValue)) {
            console.log("Matches");
        }
    }

    // detect an Error
    if (value instanceof Error) {
        throw value;
    }

`instanceof`不但用来检测构造这个实例的`constructor`, 而且还能用与检测原型链.
原型链包括通过继承得到的属性. 对于继承, 每个对象都继承自`Object`. 所以对于每个对
象, 执行`value instanceof Object`都会返回`true`.

    var now = new Date();

    console.log( now instanceof object );   // true
    console.log( now instanceof Date ); // true

`instanceof`的另一使用场景, 对于自定义的一些构造函数和实例之间:


    function Person(name) {
        this.name = name;
    }

    var me = new Person("Nicholas");
    console.log(me instanceof Object); // true
    console.log(me instanceof Person);  // true

因为me是Person的一个实例, 并且上面提到, 任何对象都是Object的实例. 故两个都返回
true.

## 检测函数

函数是javascript中典型的类型, 有一个`Function`构造函数, 每个函数都是它的实例.

    function test() {}

    // Bad
    console.log( test instanceof Function );  // true

然而, 上面的这个方法对于跨越`frames`间的检测是没用的, 因为每个`frame`都有它自己
的`Function`构造函数, 但是我们能通过typeof来判断.

    console.log( typeof test === "function" );  // true

使用typeof唯一的限制是, 在IE8和更早的版本中, 属于DOM的函数都会返回"object"而不是
"function".

    // Internet Explorer 8 and earlier
    console.log(typeof document.getElementById); // "object"
    console.log(typeof document.createElement);  // "object"
    console.log(typeof document.getElementsByTagName);  // "object"

因此, 在处理浏览器兼容性的时候. 对于一些非共有的方法在使用的时候要确定当前浏览器
是否支持它.

    // detect DOM method
    if ("querySelectorAll" in document) {
        images = document.querySelectorAll("img");
    }

在调用`querySelectorAll`前, 检测当前的浏览器中是否支持`querySelectorAll`方法.

## 检测数组

由于在frames中, 和函数一样, 每个frame都有自己的Array对象, 因此在一个frame中声明
的数组在另一个frame中并不能通过instanceof检测出来. 因此有了如下的几种方法:

> - 大牛Douglas Crockford提出的:

    // Duck typing arrays
    function isArray( value ) {
        return typeof value.sort === "function";
    }

因为只有数组才具有`sort`方法, 因此不管变量的声明地方都能被正确的检测到, 但是这个
方法使用的限制是检测的非数组对象中没有`sort`这个方法.

> - Kangax提出的, 目前很多流行的库采用这种方法:

    function isArray( value ) {
        return Object.prototype.toString.call( value ) === "[object Array]";
    }

对于一个给定的值, 当调用它的原生方法toString()的时候, 在所有浏览器中都会返回一个
标准的字符串. 如对于JSON对象会返回"[object JSON]".

基于以上的原因, 在ECMAScript5中引入了Array.isArray()方法, 思想都是基于上面的.

    function isArray(value) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    }

## 检测属性

当检查一个对象是否含有某个属性的时候通常有以下几种方法:

    // Bad: Checking falsyness
    if (object[propertyName]) {
        // do something
    }
    // Bad: Compare against null
    if (object[propertyName] != null) {
        // do something
    }
    // Bad: Compare against undefined
    if (object[propertyName] != undefined) {
        // do something
    }

上面的方法都存在缺点, 当这个属性本身存在, 但是值为0,"", false, null, undefined的时候.

所有要准确的判断一个对象是否有某个属性, 应该使用`in`操作符. 它只是简单检查这个对
象是否有这个属性, 而不去读这个属性的值, 从而避免了如上的不足.

    var object = {
    count: 0,
           related: null
    };

    // Good
    if ("count" in object) {
        // this executes
    }

    // Bad: Checking falsy values
    if (object["count"]) {
        // this doesn't execute
    }

    // Good
    if ("related" in object) {
        // this executes
    }

    // Bad: Checking against null
    if (object["related"] != null) {
        // doesn't execute
    }

如果你只想检测对象直接继承的属性而不管原型链上的属性, 使用`hasOwnProperty`方法.

    // Good for all non-DOM objects
    if (object.hasOwnProperty("related")) {
        //this executes
    }
    // Good when you are not sure
    if ("hasOwnProperty" in object && object.hasOwnProperty("related")) {
        //this executes
    }

由于IE8的存在... 在使用之前应该先检查一下. 
