---
layout: post
title: "设计模式-装饰者模式"
description: "设计模式，装饰者"
category: "设计模式"
tags: 
  - 设计模式
---

装饰者模式：用待装饰的对象（方法）来装饰被装饰的对象。

- 得到组装电脑的价格：这个价格包含了CPU、GPU、主板等等配件的价格合。对应上面的理解，就是用配件来装饰电脑，所以电脑的最终价格等于配件价格之和。
- 装修房子：配件包括电器、家具等等。

#### 原理理解

{%highlight javascript lineons%}
// 这个是要装饰的对象(方法)
function Computor(price) {
    // 200 块的运费
    this.price = price || 200;
}
Computor.prototype.getPrice = function() {
    return this.price;
}

/*
 * 配件一：CPU
 * @params {Object} decorate 待装饰者
 */
function CPU(decorate) {
    this.getPrice = function() {
        return decorate.getPrice() + 1200;
    }
}

/*
 * 配件二：GPU
 */
function GPU(decorate) {
    this.getPrice = function() {
        return decorate.getPrice() + 1000;
    }
}

/*
 * 配件三：主板
 */
function MainBoard(decorate) {
    this.getPrice = function() {
        return decorate.getPrice() + 1500;
    }
}

// 开始组装电脑
// 从以上配件来看花费为：200+1200+1000+1500=3900
var computor = new MainBoard(new GPU(new CPU(new Computor())));
console.log(computor.getPrice()); // 3900
{%endhighlight%}

__换一种更直观的方法__
{%highlight javascript lineons%}
function Computor(price) {
    this.price = price || 200;
}

Computor.prototype.getPrice = function() {
    return this.price;
}

/*
 * 装饰方法
 * @params {Object} decorator 用于进行装饰的对象
 */
Computor.prototype.decorate = function(decorator) {
    this.price += decorator.getPrice();
}

function GPU() {
    this.getPrice = function() {
        return 1000;
    }
}

function CPU() {
    this.getPrice = function() {
        return 1200;
    }
}

function MainBoard() {
    this.getPrice = function() {
        return 1500;
    }
}

// 更直观的调用
var computor = new Computor();
// 添加GPU
var gpu = new GPU();
computor.decorate(gpu);
// 添加CPU
var cpu = new CPU();
computor.decorate(cpu);
// 添加主板
var mainBoard = new MainBoard();
computor.decorate(mainBoard);
// 最后得到总价
computor.getPrice(); // 3900
{%endhighlight%}

#### 总结
装饰者动态将修饰方法加到对象上，若要扩展功能，装饰者提供了比继承更具弹性的方案。
