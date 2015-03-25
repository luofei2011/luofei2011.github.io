---
layout: post
title: "Javascript 笔记(1)----函数"
description: "javascript中最基本的概念"
category: javascript
tags: ['function']
---
{% include JB/setup %}

##### parseInt:

    parseInt('123dsfsd');
    // 123
    parseInt('abc1.33');
    // NaN
    parseInt('12dsfds333');
    // 12

parseInt(arg1,arg2):arg2是需要转换的进制如:8/10/16

省略arg2的情况下:

    parseInt('0x...'):hexadecimal
    parseInt('0...'):octal(8)

一般的认为是10进制
<!--more--> 

##### parseFloat: only one parameter

used likes parseInt

    parseFloat('s.bb2.33')
    // NaN
    parseFloat('1.33dfs3.222')
    // 1.33

特别地:parseFloat()understands exponents(指数) in the input (unlike paeseInt())

    parseFloat(123e-2)
    // 1.23

##### isNaN

用于检验输入的值是否是一个能用于算术运算的合法值,常用来检验parseInt,parseFloat的转换结果

    isNaN(isNaN)
    // true
    isNaN(233)
    // false //是一个合法的指
    isNaN(parseInt('abc123'))
    // true

特别的:

    NaN === NaN; // is false

##### isFinite:是否是无穷大
    
    isFinite(Infinity);// false
    isFinite(-Infinity)
    // false
    isFinite(23)
    // true
    isFinite(1e308)
    // true
    isFinite(1e309)
    // false
    //The biggest number of Javascript is 1.79e+308.

##### encodeURI/decodeURI...encodeURIComponent/decodeURIComponent

对url中特定的内容进行转义.注意:escape/unescape have been deprecated(废弃)

##### alert

在用户关闭它以前,浏览器中的js都会停止执行,在ajax中,这样做是不好的.

##### Gloabl & local variable:

    var a = 123;
    function f() {
        alert(a);
        var a = 1;
        alert(a);
    }
    //undefined
    //1

局部的优先级大于全局,在这里,局部的a重写了全局的a,导致地一个alert的时候未定义,但a在这个函数的局部是确实存在的.

##### function are Data

可以像一般变量一样对函数进行复制和删除

    var sum = function (a,b) { return a+b;}
    var add = sum
    delete sum
    // true
    typeof sum  //返回变量类型array/object/function
    // "undefined"
    typeof add
    // "function"
    add(3,5)
    // 8
##### Anonynous Functions(匿名)

1. You can pass an anonymous function as a parameter to another function. The receiving function can do something useful with the function that you pass.
2. You can define an anonymous function and execute it right away.

Callback Functions

Advantages:

1. They let you pass functions withot the need to name them(which means there are less global variables)更少的全部变量
2. You can delegate the responsibility of calling a function to another function(which means there is less code to write)你能指派一个回调函数给另一个函数,意味着你可以写更少的代码
3. they can help with performance

    function multiplyByTwo(a, b, c) {
        var i, ar = [];
        for(i = 0; i < 3; i++) {
            ar[i] = arguments[i] * 2;
        }
        return ar;
    }

    function addOne(a) {
        return a + 1;
    }

    var myarr = [];

    myarr = multiplyByTwo(10.20,30);

    // [20,40,60]

    for(var i=0; i<3; i++){myarr[i] = addNoe(myarr[i]);}

    // myarr = [21, 41, 61]

**Loops can be expensive if they go through a lot or repetitions**

匿名函数的改进:

    myarr = mulitiplybyTwo(1,2,3,function(a){return a+1;});
    // [4,6,8]

##### Slef-invoking functions

calling this functinon right after it was defined.

    ()();

    (
        function() {
            alert('hello');
        }
    )();

_you simply place an anonymous function definition inside parentheses(括号)
followed by another set of parentheses. The second set basically says
"execute now" and is also the place to put any parameters that your
anonymous function might accept._

One good reason for using self-invoking anonymous functions is to have some work done without creating global variables. A drawback(缺陷), of course, is that you cannot execute the same function twice (unless you put it inside a loop or another function). This makes the anonymous self-invoking functions best suited for one-off(一次性) or initialization tasks.

1. Inner (Private) Functions

Bearing in mind that a function is just like any other value.

    function a() {
         function b() {......}
    }

a() is gloable function, and then b() is a local function, which canot accessible outside a(); likes a private function

Advantage

* You keep the global namespace clean (smaller chance of naming collisions).减少命名空间的冲突
* Privacy—you expose(暴露) only the functions you decide to the "outside world"(外部接口),keeping to yourself functionality that is not meant to be consumed(消耗) by the rest of the application.(让自己的功能不至于被外界的程序或则应用猜测到)

2. Function that Return Functions

前面说过,指明return的时候函数会返回相应的值/或则数组.当没指明时通常是undefined.同样,我们可以返回一个函数!

    function a(){
        alert('A');
        return function () {
            alert('B');
        };
    }
    var newFunc = a();
    newFunc();
    //A
    //B

若想立即执行返回的函数,还可以这么做

    a()();

##### Function

Rewrite Thyself(你自己)!

Countiuing with the previous example:

    a = a();
    //A   (consider this as being the one-off preparatory work)
    //B   (Redefine the global variable a,assigning a new function to it)

This is usefull when a function has some initial one-off woek to do, The function overwrites itself after the first it back to the function.

    var a = function () {  //最重要的,a在执行一次后就变样了,便成了a -> actualWork();
        function someSetup() { //private
            var setup = 'done';
        }
        function actualWork() { //private
            alert('Work-worky');
        }
       someSetup(); //调用私有函数
       return actualWork;  //return actualWork();区别在于前者返回的是一个函数,后者返回的是函数执行的结果
    }(); //self-invoking function  only excute once

好处:在解决浏览器的兼容性的问题中,根据不同的浏览器选择不同的环境,就像上面一样,在执行一次后a就变了.


