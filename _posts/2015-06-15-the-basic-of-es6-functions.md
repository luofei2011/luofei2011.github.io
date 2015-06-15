---
layout: post
title: "[译]es6基础篇--函数"
description: "es6;functions"
category: "翻译"
tags: 
  - es6
  - javascript
  - 翻译
---

>申明：本系列文章均来自[网络](https://github.com/nzakas/understandinges6)，内容按照自己的理解进行翻译，并不是照搬英文。如果想执行文章中的代码，请确保node版本大于0.11+；或者去[在线网站](http://babeljs.io/repl)

函数是任何编程语言中都非常重要的一部分；js的函数至创建以来没有太大的改动。这些固有的特性遗留了一些积压的问题和细微的行为导致我们在实现一些非常常用的功能时产生错误或者需要更多的代码(这里多指无用代码)。

考虑到js开发人员多年来的建议和要求，es6中的函数有了很大的飞跃。es6基于es5做了大量的改进和提升，使得js开发较之前错误更少而且更强大。

#### 默认参数

js中的函数比较特殊；他允许函数执行时传递的参数和函数申明时参数的个数不一致。这就允许开发者定义能处理不固定参数个数的函数。通常来讲，当实参未传递时会使用默认参数（至少PHP之类的语言是这些的），但是es5之前（包括es5）没有强制默认参数的行为。所以大部分的兼容方式都是这样的：

{%highlight javascript%}
function makeRequest(url, timeout, callback) {

    timeout = timeout || 2000;
    callback = callback || function() {};

    // the rest of the function

}
{%endhighlight%}

另一种检测参数是否传递的方法：利用`arguments.length`对实参进行迭代来和函数的形参进行比较，如果为`undefined`就代表未传递。

es6提供了一种便捷的途径来申明一个函数中的默认参数

{%highlight javascript%}
function makeRequest(url, timeout = 2000, callback = function () {}) {
    // the function body
}
{%endhighlight%}

和大多数支持默认参数的语言一样，如果对应的形参位置没有传递参数，或者传递的参数转换成布尔值后是false。则使用创建函数时定义的默认参数。
{%highlight javascript%}
// uses default timeout and callback
makeRequest("/foo");

// uses default callback
makeRequest("/foo", 500);

// doesn't use defaults
makeRequest("/foo", 500, function(body) {
    doSomething(body);
});
{%endhighlight%}

__有趣的用法__

js函数中的默认参数除了一些固定的值外还支持动态执行结果，如：

{%highlight javascript%}
function getCallback() {
    return function() {
        // some code
    };
}

function makeRequest(url, timeout = 2000, callback = getCallback()) {

    // the rest of the function

}
{%endhighlight%}

如果调用makeRequest的时候不提供callback， 则callback就会去执行getCallback函数返回一个默认的函数作为默认参数，这个特性开创了许多有趣的可能性来为函数执行时插入动态信息。

#### rest参数

由于js函数不严格限定实参和形参的个数，所以执行的时候往往需要开发者去手动保证，比如一个简单的求和函数。

{%highlight javascript%}
function sum(first) {
    let result = first,
    i = 1,
    len = arguments.length;

    while (i < len) {
        result += arguments[i];
        i++;
    }

    return result;
}
{%endhighlight%}

函数定义的时候只定义了一个形参，但在调用的时候可以传递很多参数。如`sum(1)`、`sum(1, 2, 3)`。为了求和，我们需要初始化结果为第一个参数，然后遍历之后的参数（注意，遍历的时候我们需要从位置1开始），而这些操作都是基于`arguments`这个类数组对象来进行的。

es6中引入了rest参数的定义，用三个点(...)加一个形参名来代替除了前面形参之外的所有参数。在执行过程中，rest参数名就是一个真正的数组（包含后续所有的参数），重写上面的sum函数

{%highlight javascript%}
function sum(first, ...numbers) {
    let result = first,
    i = 0,
    len = numbers.length;

    while (i < len) {
        result += numbers[i];
        i++;
    }

    return result;
}
{%endhighlight%}

例子中，numbers代表除了第一个参数外的所有参数，所以遍历的时候就不再需要从1开始; 而且这时的numbers是一个真正的数组（区别于arguments）。

> 注意：rest参数后面不能再添加形参，不然会报错: `function sum(first, ...numbers, last) {}`

#### 扩展运算符

基于上面的rest参数，我们以`Math.max()`为例

{%highlight javascript%}
let value1 = 25;
let value2 = 50;

console.log(Math.max(value1, value2));
{%endhighlight%}

上面的代码仅仅是获取了value1和value2中的最大值。试想，如果需要进行比较的变量很多，如：`Math.max(value1, value2, value3, value4, ...)`如果靠人工去维护这个调用，成本太大。当然，熟悉`call`或者`apply`借用的人会去这样使用：

{%highlight javascript%}
let values = [25, 50, 75, 100, 200];

console.log(Math.max.apply(Math, values)); // 200
{%endhighlight%}

es6提供了更加便捷的方法去实现同样的功能。

{%highlight javascript%}
let values = [25, 50, 75, 100, 200];

console.log(Math.max(...values));

// 等价于
// console.log(Math.max(25, 50, 75, 100, 200));
// console.log(Math.max.apply(Math, values));
{%endhighlight%}

上面的代码不管从可读性还是维护性上考虑都比之前的两种要优雅、方便！当然， 下面的这些用法也是可以的。

{%highlight javascript%}
let values = [25, 50, 75, 100, 200];
let others = [10, 300];

console.log(Math.max(...values, ...others, 400)); // 400
{%endhighlight%}

> PS: apply的本质是借用，改变当前函数的执行环境（this指向），但是这里使用apply仅仅是用了apply的参数为数组的特性。和设计之初的用法不一致，所以在某些环境下完全可以用上面的方法代替它。

#### 函数的name属性

和现有的函数name属性保持一致，扩展了部分特性。es6确保所有函数都有自己合适的名字。

{%highlight javascript%}
var doSomething = function doSomethingElse() {
    // ...
};

var person = {
    get firstName() {
        return "Nicholas"
    },
    sayName: function() {
        console.log(this.name);
    }
}

console.log(doSomething.name);      // "doSomethingElse"
console.log(person.sayName.name);   // "sayName"
console.log(person.firstName.name); // "get firstName"
{%endhighlight%}

第一个没什么好说的，和现有的特性保持一致；第二个也可以理解，对于第三个。由于这是es6的特性，即该函数是一个getter方法（相比较于setter方法）所以有一个get前缀，相应的setter方法会有一个set前缀。

对于函数的name属性，这里还有几种特殊的例子

{%highlight javascript%}
var doSomething = function () {
    // ...
};

console.log(doSomething.bind().name); // 'bound doSomething'
console.log((new Function()).name); // 'anonymous'
{%endhighlight%}

对于一个“限制函数”，它的name属性会有一个bound前缀，而匿名函数统称为anonymous

#### new.target, [[Call]], [[Construct]]

在es5之前，函数的调用方式有两种：使用new和不使用new关键字；当使用new关键字的时候，函数中的this属性指向一个新对象并被返回。

{%highlight javascript%}
function Person(name) {
    this.name = name;
}

var person = new Person('test');
var notAPerson = Person('test');

console.log(person); // 一个含有name属性的对象
console.log(notAPerson); // undefined
{%endhighlight%}

不使用关键字new调用函数时，其返回值为undefined，并且name属性被注册到了全局的对象上（如果是在浏览器中，则注册到window对象上）；从代码层面来看目的很明确，那就是创建一个带有name属性的Person对象，这种双重结果的困惑在es6中将会得到改善。

首先、规范上给每个函数定义了两个内部的方法：`[[Call]]`和`[[Construct]]`，当一个函数被直接调用时（不实用关键字new），`[[Call]]`方法将会被调用（仅仅是按序执行方法体中的代码）；当使用关键字new去调用函数时，`[[Construct]]`方法被调用。`[[Construct]]`方法负责创建一个叫做新目标的新对象，并且把this指向该对象。含有`[[Construct]]`方法的函数被称为构造函数。

> 注意：不是所有的函数都有`[[Construct]]`方法，即代表不是所有的函数都能用关键字new来调用，稍后要讨论的箭头函数就没有`[[Construct]]`方法

在es5中，`instanceof`常用来判断一个函数是否是被关键字new调用的。

{%highlight javascript%}
function Person(name) {
    if (this instanceof Person) {
        this.name = name; // using new
    }
    else {
        throw new Error('You must use new with Person.');
    }
}

var person = new Person('test');
var notAPerson = Person('test'); // throws error
{%endhighlight%}

上面例子中，this被用来检测是否是构造函数Person的实例，如果是就正常执行（相当于调用[[Construct]]方法）；如果不是就抛出错误。正如上面提到的，[[Construct]]方法创建一个Person的实例并用this指向它。然而不幸的是，这种方法并不靠谱，因为this可以不通过关键字new也能成为Person的实例。。。

{%highlight javascript%}
function Person(name) {
    if (this instanceof Person) {
        this.name = name;   // using new
    } else {
        throw new Error("You must use new with Person.")
    }
}

var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael");    // works!
{%endhighlight%}

`Person.call`传递了`person`实例作为第一个参数，意味着构造函数中的this被设置成了person，由于person确实是Person的实例，所以并不能区别构造函数是否是用new来调用的。

为了解决上面的问题，es6引入了一个`new.target`属性，当函数的[[Construct]]方法被调用的时候，`new.target`指向最新的构造函数实例，即在函数体中和this等价。但是如果是[[Call]]方法被调用，则这时候的`new.target`是undefined。 这就意味着你能很安全的检测一个方法是否是被new调用的（检测new.target是否被定义即可）

{%highlight javascript%}
function Person(name) {
    if (typeof new.target !== "undefined") {
        this.name = name;   // using new
    } else {
        throw new Error("You must use new with Person.")
    }
}

var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael");    // error!
{%endhighlight%}

> 注意：在函数外使用`new.target`是会报错的

#### 块级函数

{%highlight javascript%}
"use strict";

if (true) {

    console.log(typeof doSomething);        // "function"

    function doSomething() {
        // ...
    }

    doSomething();
}

console.log(typeof doSomething);            // "undefined"
{%endhighlight%}

在if这个块儿中申明的函数，在`use strict`模式下只会在当前块儿中有用；并且函数在当前块儿被提升了。

在块作用域中，用let申明的函数功能也和上面类似，但是。let申明的函数只有在执行时才会生效，并不会被提升。

{%highlight javascript%}
'use strict';

if (true) {
    console.log(typeof doSomething); // throws error

    let doSomething = function () {
        // ...
    };

    doSomething();
}

console.log(typeof doSomething); // throws error
{%endhighlight%}

> PS: 以上的行为都是限制到`use strict`模式下，不然并不会存在块级作用域（除let外）

{%highlight javascript%}
// ECMAScript 6 behavior
if (true) {

    console.log(typeof doSomething);        // "function"

    function doSomething() {
        // ...
    }

    doSomething();
}

console.log(typeof doSomething);            // "function"
{%endhighlight%}
