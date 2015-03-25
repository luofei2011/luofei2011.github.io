---
layout: post
title: "Javascript 笔记(4)----继承与原型链"
description: ""
category: javascript
tags: []
---
{% include JB/setup %}

转载自:[这里](https://developer.mozilla.org/zh-CN/docs/JavaScript/Guide/Inheritance_and_the_prototype_chain)

对于那些熟悉基于类的面向对象语言(java或者c++)的开发者来说,JavaScript的语法是比较怪异的, 这是由于javascript是一门动态语言,而且它没有类的概念 (虽然class是个保留字,不能作为变量名来使用).

继承方面,javascript中的每个对象都有一个内部私有的链接指向另一个对象 (或者为 null),这个对象就是原对象的原型. 这个原型也有自己的原型, 直到对象的原型为null为止. 这种一级一级的链结构就称为原型链.

## 基于原型链的继承

### 继承属性

javascript对象有两种不同的属性,一种是对象自身的属性,另外一种是继承于原型链上的属性.下面的代码演示了当访问一个对象的属性时,到底发生了什么.

    // 假定我们有个对象o,并且o所在的原型链如下:
     // {a:1, b:2} ---> {b:3, c:4} ---> null
     // 'a'和'b'是o自身的属性.
     
     // 该例中,用"对象.[[Prototype]]"来表示这个对象的原型.
     // 这只是一个纯粹的符号表示(ECMAScript标准中也这样使用),不能在实际代码中使用.
     
     console.log(o.a); // 1
     // a是o的自身属性吗?是的,该属性的值为1
     
     console.log(o.b); // 2
     // b是o的自身属性吗?是的,该属性的值为2
     // o.[[Prototype]]上还有一个'b'属性,但是它不会被访问到.这种情况称为"属性遮蔽".

     console.log(o.c); // 4
     // c是o的自身属性吗?不是,那看看o.[[Prototype]]上有没有.
     // c是o.[[Prototype]]的自身属性吗?是的,该属性的值为4
     console.log(o.d); // undefined
     // d是o的自身属性吗?不是,那看看o.[[Prototype]]上有没有.
     // d是o.[[Prototype]]的自身属性吗?不是,那看看o.[[Prototype]].[[Prototype]]上有没有.
     // o.[[Prototype]].[[Prototype]]为null,原型链已到顶端,没有d属性,返回undefined
<!--more--> 
## 继承方法

JavaScript并没有真正的"方法". JavaScript只有函数,而且一个对象的属性值可以为一个函数. 属性为函数的情况和属性为其他值的情况基本没有差别, 包括"属性遮蔽" (这种情况相当于其他语言的方法重写).

一个函数作为对象的属性和独立使用的主要区别是,当函数被调用时, this的值不同.

    var o = {
       a: 2,
       m: function(b){
         return this.a + 1;
       }
     };
     
     console.log(o.m()); // 3
     // 当调用 o.m 时,'this'指向了o.
     
     var p = Object.create(o);
     // p是一个对象, p.[[Prototype]]是o.
     
     p.a = 12; // 创建p的自身属性a.
     console.log(p.m()); // 13
     // 调用p.m时, 'this'指向 p. 'this.a'则是12.

## 使用不同的方法来创建对象和生成原型链

### 使用普通语法创建对象

    var o = {a: 1};
     
     // o这个对象继承了Object.prototype上面的所有属性
     // 所以可以这样使用 o.hasOwnProperty('a').
     // hasOwnProperty 是Object.prototype的自身属性.
     // Object.prototype的原型为null,如下:
     // o ---> Object.prototype ---> null
     
     var a = ["yo", "whadup", "?"];
     
     // 数组都继承于Array.prototype (indexOf, forEach,等方法都是从它继承而来).
     // 原型链如下:
     // a ---> Array.prototype ---> Object.prototype ---> null
     
     function f(){
       return 2;
     }
     
     // 函数都继承于Function.prototype(call, bind,等方法都是从它继承而来):
     // f ---> Function.prototype ---> Object.prototype ---> null

## 使用构造方法创建对象

在javascript中,构造方法其实就是一个普通的函数.当使用new 操作符来作用这个函数时,它就可以被称为构造方法(构造函数).

    function Graph() {
       this.vertexes = [];
       this.edges = [];
     }
     
     Graph.prototype = {
       addVertex: function(v){
         this.vertexes.push(v);
       }
     };
     
     var g = new Graph();
     // g是生成的对象,他的自身属性有'vertexes'和'edges'.
     // 在g被实例化时,g.[[Prototype]]指向了Graph.prototype.

## 使用Object.create创建对象 

ECMAScript 5中引入了一个新方法: Object.create. 可以调用这个方法来创建一个新对象. 新对象的原型就是调用create方法时传入的第一个参数:

    var a = {a: 1}; 
     // a ---> Object.prototype ---> null
     
     var b = Object.create(a);
     // b ---> a ---> Object.prototype ---> null
     console.log(b.a); // 1 (继承而来)
     
     var c = Object.create(b);
     // c ---> b ---> a ---> Object.prototype ---> null
     
     var d = Object.create(null);
     // d ---> null
     console.log(d.hasOwnProperty); // undefined, 因为d没有继承Object.prototype
