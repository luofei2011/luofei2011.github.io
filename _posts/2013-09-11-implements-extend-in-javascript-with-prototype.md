---
layout: post
title: "javascript继承机制的实现"
description: "implements extends in javascript with prototype"
category: javascript 
tags:
  - 设计模式
  - OOP
---

{% include JB/setup %}

## 为什么要在一个非严格OOP的语言上实现继承

或许在一些小应用中利用函数式编程已经能够满足我们的需求，但是复杂的框架，大量重复的工作不断的驱使着我们要把js这个
伪OOP语言实现成真正意义上的面向对象编程;
就继承特性来说，我们关注的是js的重用性和多态！

当然我们都是希望写少量的代码做更多的事！继承的目的就是让通用的，共同的代码都放到一个地方，然后需要用到这些方法的时候
只需要继承至这个通用类就可以，这里称这个通用类为抽象类；理论上，抽象类是不需要进行实例化的，但既然js是非严格意义的OOP
则我们也不去过多的计较，只要做到重复的代码只出现一次，代码优化的目的就达到了！

## 如何创建一个类

假设有给叫Person的类如下：

    var Person = function(name, age) {
        this.name = name;
        this.age = age;
    }

    Person.prototype.getName = function() {
        return this.name;
    }

如上：Person代表地球上所有的人，每个人都有这两个基本属性：name和age；现在我们要实现一个学生类，然后我们知道了；
学生也是一个人，及学生也有name和age等属性；现在的问题是怎么能把这个关系给搭起来？

先来看看纯面向对象的语言是如何做到的(如：Actionscrpt3)

    class Students extend Person {}; //很简单，一行代码；更确切的说是一个单词--extend

换成js如何能做到？

<!--more-->
在讲解js的继承机制实现之前，先了解一下js的原型链：

    var person = new Person('Poised-flw', 21);
    person.getName(); // "Poised-flw"

就上面的`getName()`方法来说，是如何执行的？首先会在Person这个函数里面找是否有getName（）这个方法，发现没有；然后就转到
`Person.prototype`中寻找，发现有！然后就调用，若没有呢？继续按照相同的方法一直沿着`prototype`寻找下去，直到找到方法或者
达到原型链的顶端为止！

所以：__继承的思想： 通过js特有的原型链来实现继承机制！__

## 基于原型链的继承

####1.直接继承实现

    var Students = function(name, age, sid) {
        Person.call(this, name, age);
        this.sid = sid;
    }

    Students.prototype = new Person(); //把Person放到Students的原型链上实现继承机制
    Students.prototype.constructor = Students;

    Students.prototype.getResults = function() {
        // 得到学生的成绩
    }

一定不要少了`Students.prototype.constructor =
Students`这一行！，定义一个构造函数的时候，它默认的prototype是一个Object实例，然后prototype的constructor属性自动被设置成该函数本身
！！！若手工将prototype设置为另一个对象的时候，则新对象自然不会具有原对象的contructor值，故需要重新设置其constructor属性。如：

    var Test = function() {
        this.time = "now";
    }

    console.log(Test.prototype); // Object {} 一个空对象
    console.log(Test.prototype.constructor); // function() {this.time = "now";},及函数本身

    // 若手工改变Test的prototype属性
    Test.prototype = {
        someFunc: function() {
            console.log('hello world!');
        }
    };
    console.log(Test.prototype.constructor); // function Object() { [native code] }
    // 然后你会发现完全指错了，故手动更改prototype属性的时候需要更改它的constructor指向;

经过上面的测试就知道为什么要修改constructor值了。

#### 2.封装继承的函数extend

    function extend(subClass, superClass) {
        var F = function() {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
    }

其实这个函数的功能只是对上面继承过程的一个封装，不同的有：

1. 只继承了`superClass`的`prototype`属性，并没有继承`superClass`构造函数中的属性;
2. 这样做的优点在于：减少去new一个构造函数的开销！
3. 当然随之的问题是不能单一的通过这个函数就能让`subClass`继承`superClass`的所有属性

__改进：__

    // 在Students构造函数中继续添加一行代码：
    Person.call(this, name, age);

## 小结

利用js的原型链原理，我们可以很容易的实现js的继承机制，尽管不是非常的严格，但是我的目的达到了：
重复的代码尽量出现一次！
