---
layout: post
title: "[译]es6基础篇--字符串api改动"
description: "es6;string change"
category: "翻译"
tags: 
  - es6
  - javascript
  - 翻译
---

>申明：本系列文章均来自[网络](https://github.com/nzakas/understandinges6)，内容按照自己的理解进行翻译，并不是照搬英文。

js的字符串总是落后于其它语言的类似功能或特性，在es5中string类最终也仅仅增加了一个`trim()`方法；但是es6中增加扩展了不少新功能。

#### includes(), startsWith(), endsWith()

开发者刚接触js的时候都是用的`indexOf()`来判断一个字符串是否在另一个字符串中；es6增加了以下3个新的用来判断一个字符串片段是否在另一个字符串中。

+ `includes()` - 如果给定查询的字符串片段在目标字符串中则返回`true`，否则返回`false`
+ `startsWith()` - 如果目标字符串是以给定的字符串开头的，则返回`true`，否则`false`
+ `endsWith()` - 如果目标字符串是以给定字符串结尾的，则返回`true`，否则`false`

以上的每个方法都接受两个参数，要查找的字符串片段和一个可选的搜索起始位置参数。当第二个参数忽略的时候，`includes()`和`startsWith()`从起始位置开发搜索；而`endsWith()`从字符串尾部开始搜索；第二个参数存在的意义在于减少搜索的范围，提高性能。

{%highlight javascript%}
var msg = "Hello world!";

console.log(msg.startsWith("Hello"));       // true
console.log(msg.endsWith("!"));             // true
console.log(msg.includes("o"));             // true

console.log(msg.startsWith("o"));           // false
console.log(msg.endsWith("world!"));        // true
console.log(msg.includes("x"));             // false

console.log(msg.startsWith("o", 4));        // true
console.log(msg.endsWith("o", 8));          // true
console.log(msg.includes("o", 8));          // false
{%endhighlight%}

这三个方法能很容易的找出一个字符串是否包含某子串而不用关心子串出现的具体位置。
由于这些方法的返回值都是布尔值，因此你如果想要得到具体的位置，则你需要使用`indexOf()`或者`lastIndexOf()`

> PS: 如果给以上三个方法传递一个正则表达式，是会报错的；不同于indexof和lastIndexOf，这两个方法会把正则表达式转成字符串然后进行搜索。

#### repeat()

es6还给字符串添加了一个`repeat()`方法，该方法只接受一个参数，用于表示需要重复的次数。最终返回把原始串重复多次后的结果。

{%highlight javascript%}
console.log("x".repeat(3));         // "xxx"
console.log("hello".repeat(2));     // "hellohello"
console.log("abc".repeat(4));       // "abcabcabcabc"
{%endhighlight%}

该方法在维护文本缩进的时候特别有用

{%highlight javascript%}
// 用空格来进行缩进
var indent = ' '.repeat(size),
    indentLevel = 0;

// 当需要进一步缩进的时候
var newIndent = indent.repeat(++indentLevel);
{%endhighlight%}

> PS: 如果只是纯JSON的数据格式化输出，用`JSON.stringify(obj, null, 4)`就够了。
