---
layout: post
title: "[译]es6基础篇--箭头函数"
description: "es6;arrow functions"
category: "翻译"
tags: 
  - es6
  - javascript
  - 翻译
---

>申明：本系列文章均来自[网络](https://github.com/nzakas/understandinges6)，内容按照自己的理解进行翻译，并不是照搬英文。如果想执行文章中的代码，请确保node版本大于0.11+；或者去[在线网站](http://babeljs.io/repl)

箭头函数，顾名思义，用一种新语法（即箭头`=>`）来定义的函数，箭头函数和传统的js函数有一些重要的不同：

+ this作用域：函数中this关键字代表的是定义时的执行环境而不是执行时的上下文环境
+ 不能使用new关键字调用函数：箭头函数没有[[Construct]]方法，因此就不能被用作构造函数，当使用new关键字调用箭头函数的时候会抛出错误
+ this只读：函数中的this不能被改变
+ 没有arguments对象：函数中不能用arguments对象得到参数列表，你应该用形参名或者es6的rest参数去获取参数列表

这里有一些为什么这些不同存在的原因

首先、this绑定是js中错误出现最常见的情景，非常容易搞错一个函数中的this值，从而导致一些意想不到的结果。
其次、在箭头函数中，通过限制this值的只读且不变性，js解析器能更容易优化很多操作（不同于可用作构造函数或者其它方面的普通函数）

> PS: 箭头函数也有name属性，和其它函数的规则相同

#### 语法

箭头函数的语法有多种，具体取决于你自己的用法。但所有的用法都是以函数参数开始，紧接着是箭头，然后是函数体。参数和函数体根据使用方式的不同有多种变集。例如下面的箭头函数：只有一个参数和一个简单的返回值

{%highlight javascript%}
var reflect = value => value;

// 等价于
var reflect = function (value) {
    return value;
}
{%endhighlight%}

当一个箭头函数的参数只有一个时，该参数可以直接使用而不需要别的任何高级语法。箭头的右侧是被计算执行后需要返回的值，尽管这里并没有显示上的return语句。

如果你要传递一个以上的参数，那么你需要把这些参数包含在一堆括号中。

{%highlight javascript%}
var sum = (num1, num2) => num1 + num2;

// 等价于
var sum = function (num1, num2) {
    return num1 + num2;
}
{%endhighlight%}

这个sum函数仅仅是把两个参数放到一起然后然后他们的和， 不同之处参数被包含在两个括号中，这点和传统的js函数类似。

如果你想创建一个空参数的函数，那么你必须要使用一堆空括号。

{%highlight javascript%}
var getName = () => 'test';

// 等价于
var getName = function () {
    return 'test';
}
{%endhighlight%}

如果你的函数体并不能在一行或者一个表达式中完成，那么你应该将你的函数体内容放到大括号中。就像传统函数一样：

{%highlight javascript%}
var getMin = (num1, num2) => {
    let local = 10;
    return Math.min(local, num1, num2);
}

// 等价于
var getMin = function (num1, num2) {
    var local = 10;
    return Math.min(local, num1, num2);
}
{%endhighlight%}

构造空函数

{%highlight javascript%}
var noop = () => {};

// 等价于
var noop = function () {};
{%endhighlight%}

由于函数体是被包含在大括号中的，因此如果你想在箭头函数中返回一个对象，则你应该把他们放到小括号中。

{%highlight javascript%}
var getTempItem = id => ({id: id, name: 'Temp'});

// 等价于
var getTempItem = function (id) {
    return {
        id: id,
        name: 'Temp'
    };
}
{%endhighlight%}

#### 立即执行函数

js中函数的一个常用方法就是立即执行函数，立即执行函数允许你定义一个匿名函数来立即调用而不用保存该函数的引用。这种模式对于想在程序中创建一个隔离执行区域非常有用。

{%highlight javascript%}
let person = (function (name) {
    return {
        getName() {
            return name;
        }
    };
})('test');

console.log(person.getName()); // 'test'
{%endhighlight%}

上面代码中，立即执行函数执行后创建了一个包含getName方法的对象，getName方法用name参数作为他的返回值。

你完全可以用箭头函数来改造上面的代码

{%highlight javascript%}
let person = ((name) => {
    return {
        getName() {
            return name;
        }
    };
})('test');

console.log(person.getName()); // 'test'
{%endhighlight%}

#### this绑定

js中最容易发生错误的地方就是函数中的this绑定，因为this是根据函数的执行环境动态改变的。如下面的例子：

{%highlight javascript%}
var PageHandler = {

    id: "123456",

    init: function() {
        document.addEventListener("click", function(event) {
            this.doSomething(event.type);     // error
        }, false);
    },

    doSomething: function(type) {
        console.log("Handling " + type  + " for " + this.id);
    }
};
{%endhighlight%}

上面的代码中，PageHandler被用来处理页面中的用户交互。init方法用来绑定交互处理事件，当用户发生点击的时候该事件会调用doSomething方法。然而该方法并不能如愿以偿的得到结果，因为事件处理函数中的this指向的是当前发生点击的DOM节点，而该DOM节点上并没有一个叫做doSomething的方法。

你可以使用bind来把this指向PageHandler：

{%highlight javascript%}
var PageHandler = {

    id: "123456",

    init: function() {
        document.addEventListener("click", (function(event) {
            this.doSomething(event.type);     // error
        }).bind(this), false);
    },

    doSomething: function(type) {
        console.log("Handling " + type  + " for " + this.id);
    }
};
{%endhighlight%}

然而箭头函数中的this是在定义时就确定的，不会根据执行环境改变而改变。所以改造如下：

{%highlight javascript%}
var PageHandler = {

    id: "123456",

    init: function() {
        document.addEventListener("click",
                event => this.doSomething(event.type), false);
    },

    doSomething: function(type) {
        console.log("Handling " + type  + " for " + this.id);
    }
};
{%endhighlight%}

事件回调函数中的this在定义的时候就是指向的PageHandler，所以并不用担心后续的执行会出错。

箭头函数不能使用new关键字

{%highlight javascript%}
var MyType = () => {};

var object = new MyType(); // error 
{%endhighlight%}

对于回调函数，可以用箭头函数进行优化

{%highlight javascript%}
var result = values.sort((a, b) => a -b);
{%endhighlight%}

#### 识别箭头函数

尽管箭头函数的声明语法和普通函数不同，但最终还是一个函数。

{%highlight javascript%}
var comparator = (a, b) => a -b;

console.log(typeof comparator); // 'function'
console.log(comparator instanceof Function); // true
{%endhighlight%}

`typeof`和`instanceof`的行为和普通函数都保持一致，想普通函数一样，箭头函数也支持使用`call()`、`apply()`和`bind()`方法，但是这些方法并不能改变箭头函数中的this指向。

{%highlight javascript%}
var sum = (num1, num2) => num1 + num2;

console.log(sum.call(null, 1, 2)); // 3
console.log(sum.apply(null, [1, 2])); // 3

var boundSum = sum.bind(null, 1, 2);

console.log(boundSum()); // 3
{%endhighlight%}
