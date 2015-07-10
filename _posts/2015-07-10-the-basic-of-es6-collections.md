---
layout: post
title: "[译]es6基础篇--Collections"
description: "es6;collections"
category: "翻译"
tags: 
  - es6
  - javascript
  - 翻译
---

>申明：本系列文章均来自[网络](https://github.com/nzakas/understandinges6)，内容按照自己的理解进行翻译，并不是照搬英文。如果想执行文章中的代码，请确保node版本大于0.11+；或者去[在线网站](http://babeljs.io/repl)

纵观js的历时，只有Array一种数据类型用于表示集合，js中的数组使用和别的语言没有区别，但是在js中却需要付出更多的工作基于数组来实验堆栈或队列的功能。由于js中的数组都是数字下标，所以对于非数字下标的情况，开发人员就只能采用对象来实现了。对象也有自己的局限性，对象的所有属性名都必须是字符串。幸好es6中引入了几种新的数据类型用于处理这些序列数据。

#### Sets

如果你熟悉Java、Ruby或Python之类的语言，那你对Sets一定不会陌生。Set是不包含重复数据的有序数值列表。你不能像使用数组一样去获取Set中的某一项，通常你只能去检查Set中某值是否存在。

es6中引入了set类型，你可以通过`add()`向set中添加值，还可以通过`size`来获取当前set的大小

{%highlight javascript%}
var items = new Set();
items.add(5);
items.add('5');

console.log(items.size); // 2
{%endhighlight%}

set并不会对存入其中的值进行强制类型转换来判断两个值是否相等，所以上面的数字5和字符串5是不相等的。如果在set上重复的调用`add()`来插入相同的值，那么后面的插入将会被忽略。

{%highlight javascript%}
var items = new Set();
items.add(5);
items.add('5');
items.add(5); // 插入相同的值，将会被忽略

console.log(items.size); // 2
{%endhighlight%}

你还可以用一个数组来初始化set，Set构造函数会确保值的唯一性。

{%highlight javascript%}
var items = new Set([1, 2, 3, 4, 5, 5, 5]);

console.log(items.size); // 5
{%endhighlight%}

`has()`方法用于判断Set中是否包含某一项值

{%highlight javascript%}
var items = new Set();
items.add(5);
items.add('5');

console.log(items.has(5)); // true
console.log(items.has(6)); // false
{%endhighlight%}

`delete()`方法用于删除Set中的某一项值

{%highlight javascript%}
var items = new Set();
items.add(5);
items.add('5');

console.log(items.has(5)); // true

items.delete(5);

console.log(items.has(5)); // false
{%endhighlight%}

尽管不能像数组一样通过下标随机的去获取Set中的某一项，但还是可用`for-of`语句去迭代Set的所有值。`for-of`语句可以迭代一个数组，或者类数组的集合。

{%highlight javascript%}
var items = new Set([1, 2, 3, 4, 5]);

for (let num of items) {
    console.log(num);
}
{%endhighlight%}

如上的代码将会按照Set添加的顺序输出Set中的每一项值

`Array.from()`用于讲Set转换成数组

{%highlight javascript%}
var items = new Set([1, 2, 3]);
var array = Array.from(items);
{%endhighlight%}

所以，利用以上的便利，可以很方便的实现数组去重功能。

{%highlight javascript%}
function dedupe(array) {
    return Array.from(new Set(array));
}
{%endhighlight%}

#### Maps

Map的中心思想是给一个值映射一个唯一的key，这样你在后面使用的时候就可以用O(1)的时间复杂度去得到该值。js中，传统的方法是用对象来模拟。但是存在的限制是：key只能是字符串，即使给了一个非字符串的类型，也会被强制转换成字符串。比如：

{%highlight javascript%}
var data = {};
var ele = document.getElementById('test');

data[ele] = 'some';
{%endhighlight%}

存进去之后你会发现data中多了一项`"[Object HTMLDivElemtn]"`之类的key，所以你如果后面继续向data中插入别的div结点，那么它只会覆盖之前的值，而达不到预期的效果。

es6中，Map是一个新的类型，类似于Object，也是key-value这样的键值对，但是key、value均可以是任意类型的数据。Map不会对key或者value做任何类型转换，比如数字5和字符串5就代表了不同的key。可以用`set()`和`get()`来存储和获取Map中的值。

{%highlight javascript%}
var map = new Map();
map.set('name', 'test');
map.set(document.getElementById('test'), {flagged: false});

// later
var name = map.get('name');
var meta = map.get(document.getElementById('test'));
{%endhighlight%}

和Set一样，还可以使用`has()`、`delete()`和`size`方法和属性。

{%highlight javascript%}
var map = new Map();
map.set("name", "Nicholas");

console.log(map.has("name"));   // true
console.log(map.get("name"));   // "Nicholas"
console.log(map.size);        // 1

map.delete("name");
console.log(map.has("name"));   // false
console.log(map.get("name"));   // undefined
console.log(map.size);        // 0
{%endhighlight%}

可以已这样的方式来创建Map集合，一个二维数组，每个二维的数组小项包含两项值，第一个是key，另一个是value

{%highlight javascript%}
var map = new Map([ ["name", "Nicholas"], ["title", "Author"]]);

console.log(map.has("name"));   // true
console.log(map.get("name"));   // "Nicholas"
console.log(map.has("title"));  // true
console.log(map.get("title"));  // "Author"
console.log(map.size);        // 2
{%endhighlight%}

Map的迭代方式，有keys迭代；values迭代、entries整体迭代、for-of迭代

{%highlight javascript%}
for (let key of map.keys()) {
    console.log("Key: %s", key);
}

for (let value of map.values()) {
    console.log("Value: %s", value);
}

for (let item of map.entries()) {
    console.log("Key: %s, Value: %s", item[0], item[1]);
}

// same as using map.entries()
for (let item of map) {
    console.log("Key: %s, Value: %s", item[0], item[1]);
}
{%endhighlight%}

`forEach()`迭代方式，可绑定回调函数中的this指向

{%highlight javascript%}
var reporter = {
    report: function(key, value) {
        console.log("Key: %s, Value: %s", key, value);
    }
};

map.forEach(function(value, key, map) {
    this.report(key, value);
}, reporter);
{%endhighlight%}

`for-in`迭代方式，同Object

{%highlight javascript%}
for (let key in object) {

    // make sure it's not from the prototype!
    if (object.hasOwnProperty(key)) {
        console.log("Key: %s, Value: %s", key, object[key]);
    }

}
{%endhighlight%}

#### WeakSets

和Set唯一的区别：Weaksets中存储的只是对象的引用，因此如果该对象被垃圾回收的时候Weaksets中的引用相应的也会被清理掉。

{%highlight javascript%}
var set = new WeakSet(),
    obj = {};

// add the object to the set
set.add(obj);

console.log(set.has(obj));      // true

set.delete(obj);

console.log(set.has(obj));      // false
{%endhighlight%}

对于Set有如下的不同：

+ `add()`、`has()`、`delete()`方法在传递非对象参数的时候会报错

+ Weaksets是不可迭代的，因此不能用`for-of`对其进行循环迭代

+ Weaksets也不会暴露`keys()`、`values()`之类的迭代器，因此没有方式来获取一个Weaksets的所有内容

#### Weakmaps

Weakmaps中的key只允许是对象而不能是一个原始值，这个听起来有点怪。但事实是这就是map和weakmap的不同。

Weakmaps和Weaksets一样，key也是一个对象的引用，因此。当key代表的对象被垃圾回收之后，key引用相应的也会被移除掉。

es6的WeakMap是一个无序键值对，并且key不能是null，value可以是任何类型的数据。WeakMap和Map具有相同的set和get接口。

{%highlight javascript%}
var map = new WeakMap(),
    element = document.querySelector(".element");

map.set(element, "Original");

// later
var value = map.get(element);
console.log(value);             // "Original"

// later still - remove reference
element.parentNode.removeChild(element);
element = null;

value = map.get(element);
console.log(value);             // undefined
{%endhighlight%}

> Weakmap的set方法只能接受object作为key，不然会报错，如果想用非对象的值作为key，那么建议用map

Weakmap同样有has方法用于判断一个key是否存在，delete用于删除一个键值对

{%highlight javascript%}
var map = new WeakMap(),
    element = document.querySelector(".element");

map.set(element, "Original");

console.log(map.has(element));   // true
console.log(map.get(element));   // "Original"

map.delete(element);
console.log(map.has(element));   // false
console.log(map.get(element));   // undefined
{%endhighlight%}
