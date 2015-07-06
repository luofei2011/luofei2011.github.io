---
layout: post
title: "[译]es6基础篇--对象"
description: "es6;objects"
category: "翻译"
tags: 
  - es6
  - javascript
  - 翻译
---

>申明：本系列文章均来自[网络](https://github.com/nzakas/understandinges6)，内容按照自己的理解进行翻译，并不是照搬英文。如果想执行文章中的代码，请确保node版本大于0.11+；或者去[在线网站](http://babeljs.io/repl)

由于js中几乎所有变量都是object的缘故，大量es6的特性改动都专注于提高对象的实用性。此外，大量对象的使用在js编程中持续增加，意味着开发者多数工作都和对象相关，因此提高对象的实用性非常有必要。

es6从更简单的语法，到新的操作和维护对象方法来提高对象的实用性。

#### 对象分类

es6详细介绍了几种新的方法来区别不同类别的对象。与浏览器之类的执行环境相反，js一直有一些不同的术语用于描述标准的对象。es6特地清楚的定义了每个对象的分类，而且重要的是，理解了这些描述对象的专业术语有助于理解整个js语言。这些对象的分类有：

+ 普通对象：具有js中对象的所有内部行为

+ 扩展对象：在某些场景下，内部行为和普通对象有所区别

+ 标准对象：在es6中被定义，如：`Array`, `Date`等。标准对象可以是普通对象和扩展对象

+ 内置对象：存在于js脚本一开始执行时的执行环境， 所有的标准对象都是内置对象

这部分的基础知识贯穿整个es6系列，用于解释es6中定义的不同类别的对象

#### 对象属性初始化简写

在es5中，对于初始化一个key和value字面量为一样的对象时，方式是这样的：

{%highlight javascript%}
function createPerson(name, age) {
    return {
        name: name,
        age: age
    };
}
{%endhighlight%}

实际上，name和age两个变量是方法createPerson的两个局部变量，所以在es6中可以这样简写

{%highlight javascript%}
function createPerson(name, age) {
    return {
        name,
        age
    };
}
{%endhighlight%}

es6中，你可以忽略掉属性名和局部变量一样的key，而直接使用局部变量的名。当js引擎发现一个对象只有key而没有value时，js引擎会在当前的上下文环境中查找一个名字和key相同的局部变量，如果找到。则把该局部变量的值作为当前key的值。

这样的简写方式对于创建对象更为便捷。

#### 对象方法初始化简写

如上面的属性简写，对象中的方法也是可以简写的。如

{%highlight javascript%}
var person = {
    name: 'test',
    sayName: function () {
        console.log(this.name);
    }
}
{%endhighlight%}

在es6中可以直接省略掉function关键字和`:`，减少你在代码中输入无用字符的次数。

{%highlight javascript%}
var person = {
    name: 'test',
    sayName() {
      console.log(this.name);
    }
}
{%endhighlight%}

这两种写法的最终效果是完全一致的，不会改变sayName中this的指向。

#### 可计算的属性名

直接看代码

{%highlight javascript%}
var lastName = 'last name';
var suffix = 'suffix';

var person = {
    'first name': 'test',
    [lastName]: 'last name',
    ['test' + suffix]: 'test test'
};

person['last-name']; // 'last name'
person['testsuffix']; // 'test test'
{%endhighlight%}

#### Object.assign(target, ...sources)

`Object.assign()`功能上类似`mixin`和`extend`， 它只会拷贝sources对象上属性为`enumerable`和`hasOwnProperty`的属性到target上。对于存取器方法的处理是：在sources上[[Get]]，然后[[put]]到target上，即会把存取器的返回值放到target上，而并不是存取器本身。

{%highlight javascript%}
var receiver = {};
var supplier = {
    get name() {
        return 'getter';
    }
}

Object.assign(receiver, supplier, {
    test: 'test'
});

console.log(receiver.name); // 'getter'
console.log(receiver.test); // 'test'
{%endhighlight%}

#### 可重复的key

{%highlight javascript%}
var person = {
    name: 'first name',
    name: 'last name'
}

console.log(person.name); // 'last name'
{%endhighlight%}

重复的key在es6中并不会报错（在es5的严格模式下是会报语法错误的），后面出现的key会重写之前的值。

#### 动态改变对象的prototype

原型链是js中实现继承的基础，es6中让原型链的功能更加强大。

es5添加了`Object.getPrototypeOf()`方法来得到任何一个给定对象的原型对象；es6添加一个配对的方法：`Object.setPrototypeOf()`用于改变任何对象的原型链。

通常，一个对象的原型链在他被创建的时候就指明了，不管是通过构造函数方法还是`Object.create()`方法。 在es6之前，没有一个标准的方法用于在一个对象被创建后动态改变他的原型链。

`Object.setPrototypeOf()`方法接受两个参数，第一个是需要被重置原型链的对象，第二个参数是用来替换新原型链的对象。

{%highlight javascript%}
let person = {
    getGreeting() {
        return "Hello";
    }
};

let dog = {
    getGreeting() {
        return "Woof";
    }
};

// prototype is person
let friend = Object.create(person);
console.log(friend.getGreeting());                      // "Hello"
console.log(Object.getPrototypeOf(friend) === person);  // true

// set prototype to dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting());                      // "Woof"
console.log(Object.getPrototypeOf(friend) === dog);     // true
{%endhighlight%}

对象的原型对象是被存储在一个私有对象`[[Prototype]]`上，`Object.getPrototypeOf()`仅仅是返回存储在[[Prototype]]上的值，相反的。`Object.setPrototypeOf()`只是改变了[[Prototype]]上存储的值。但是这里除了存取器的方法，并没有一个直接的途径去获取[[Prototype]]上存储的值。

es5标准完成后，几个js引擎已经实现了一个通用的属性`__proto__`来直接操作[[Prototype]]，实际上，`__proto__``是`Object.setPrototypeOf()`和`Object.getPrototypeOf()`的早期版本，它不切实际的希望所有js引擎都移除掉这些属性，所以es6中规范化了`__proto__`的行为。

在es6中。`Object.prototype.__proto__`属性完全可以实现和`Object.getPrototypeOf()`和`Object.setPrototypeOf()`一样的效果。

{%highlight javascript%}
let person = {
    getGreeting() {
        return "Hello";
    }
};

let dog = {
    getGreeting() {
        return "Woof";
    }
};

// prototype is person
let friend = {
    __proto__: person
};
console.log(friend.getGreeting());                      // "Hello"
console.log(Object.getPrototypeOf(friend) === person);  // true
console.log(friend.__proto__ === person);               // true

// set prototype to dog
friend.__proto__ = dog;
console.log(friend.getGreeting());                      // "Woof"
console.log(friend.__proto__ === dog);                  // true
console.log(Object.getPrototypeOf(friend) === dog);     // true
{%endhighlight%}

注意：

1. 在对象字面量中`__proto__`仅能出现一次，出现多次会报错误

2. 尽量用`__proto__`而不是`['__proto__']`

#### `Super`引用

`super`直接指向当前对象的原型链

{%highlight javascript%}
let person = {
    getGreeting() {
        return "Hello";
    }
};

// prototype is person
let friend = {
    __proto__: person,
    getGreeting() {
        return super.getGreeting() + ", hi!";
    }
};

// prototype is friend
let relative = {
    __proto__: friend
};

console.log(person.getGreeting());                  // "Hello"
console.log(friend.getGreeting());                  // "Hello, hi!"
console.log(relative.getGreeting());                // "Hello, hi!"
{%endhighlight%}

#### 对象的方法

在es6前，“方法”有一个非正式的定义：方法就是对象中属性为函数而不是纯数据的项。es6中正式定义了对象的方法，即如果属性有一个私有对象`[[HomeObject]]`，那它就是对象的方法而不是属性，`[[HomeObject]]`指向当前方法所属的对象。

{%highlight javascript%}
let person = {

    // method
    getGreeting() {
        return "Hello";
    }
};

// not a method
function shareGreeting() {
    return "Hi!";
}
{%endhighlight%}

如上的例子中定一个了只有一个方法`getGreeting()`的`person`对象，`getGreeting()`方法的`[[HomeObject]]`指向`person`，而`shareGreeting()`并没有设置`[[HomeObject]]`，所以他就不是一个对象的方法. 在大多数场景下，这个特性看起来没什么用，但是结合`super`，这就是一个非常了不起的功能，可以判断当前方法是不是一个对象的方法，就可以决定是不是可以使用`super`的相同方法。

所有的`super`引用都用`[[HomeObject]]`来决定怎么做，首先在`[[HomeObject]]`上调用`Object.getPrototypeOf()`来得到当前实例的原型链，接下来，原型链去查找一个名字和当前执行函数一样的方法；最后，绑定执行函数的this环境，并执行该函数。如果一个方法没有`[[HomeObject]]`或者跟期望的不同，那该过程就不会正常工作，例如：

{%highlight javascript%}
ilet person = {
    getGreeting() {
        return "Hello";
    }
};

// prototype is person
let friend = {
    __proto__: person,
    getGreeting() {
        return super() + ", hi!";
    }
};

function getGlobalGreeting() {
    return super.getGreeting() + ", yo!";
}

console.log(friend.getGreeting());  // "Hello, hi!"

getGlobalGreeting();                      // throws error
{%endhighlight%}

上面的例子中，由于`getGlobalGreeting()`方法并没有`[[HomeObject]]`，所以在上面调用`super`是会报错的。做如下改动：

{%highlight javascript%}
// prototype is person
let friend = {
    __proto__: person,
    getGreeting() {
        return super() + ", hi!";
    }
};

function getGlobalGreeting() {
    return super.getGreeting() + ", yo!";
}

console.log(friend.getGreeting());  // "Hello, hi!"

// assign getGreeting to the global function
friend.getGreeting = getGlobalGreeting;

friend.getGreeting();               // throws error
{%endhighlight%}

这是由于`[[HomeObject]]`只有在一个方法被定义的时候才会指定

#### 相关阅读

+ [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
