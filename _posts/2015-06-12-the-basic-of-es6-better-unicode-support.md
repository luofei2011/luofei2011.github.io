---
layout: post
title: "[译]es6基础篇--更友好的编码支持"
description: "es6;better unicode support"
category: "翻译"
tags: 
  - es6
  - javascript
  - 翻译
---

>申明：本系列文章均来自[网络](https://github.com/nzakas/understandinges6)，内容按照自己的理解进行翻译，并不是照搬英文。

在es6之前，js的字符都是基于`16-bit`进行编码的。所有字符串的属性或者方法（如：`length`、`charAt()`）都是基于每16位序列代表一个字符的思想来设计的。es5中允许js解析器来决定使用`UCS-2`或者`UTF-16`两种编码。不过、两种编码都是用的16位编码单元（即16bit代表一个字符）,然而事实是，用16位的编码来表示世界上所有的字符显然是不可能的。。。

既然16位的编码不能为所有的字符提供一个唯一的标识(这里姑且将这个标识称之为“编码点”)，编码点的表示就是一串从0开始的数字。一个字符的编码就是就是将编码点转成编码单元的过程(之前提到的16位编码单元)。 当然，事实是：`UCS-2`有一个有一个从编码点到编码单元的一对一映射关系；然后`UTF-16`情况就不是这么简单。

在`UTF-16`中，用单个的16位编码单元代表前`2^16`个字符；这部分字符称之为`基本多语言平面(BMP)`。而超过这个范围的字符称为`补充平面`，补充平面上的字符就不能单单用一个16位的编码单元来表示，所以`UTF-16`解决这种问题的办法是：引入一个代理对，用两个16位编码单元来表示一个补充平面上的字符。这就意味着一个字符串中的每个字符都有可能是两种编码（只有16位编码的BMP、或者是具有32位编码的补充平面UTF-16）。

es5保证所有的操作都工作在16位的编码单元上，这就意味着对于那些处于补充平面的字符会产生一些意想不到的结果。

{%highlight javascript%}
var text = "𠮷";

console.log(text.length);           // 2
console.log(/^.$/.test(text));      // false
console.log(text.charAt(0));        // ""
console.log(text.charAt(1));        // ""
console.log(text.charCodeAt(0));    // 55362
console.log(text.charCodeAt(1));    // 57271
{%endhighlight%}

在这个例子中，`text`的值是一个在补充平面上的字符，因此js的字符串操作会把它当成是两个16位编码的字符，所以它的长度就是2. 接下来是一个正则表达式像匹配一个单个字符，但结果是`false`。这时候`charAt()`也不能得到合法的字符串。只有`charCodeAt()`方法能得到2个16位编码单元的数据。

es6强制用`UTF-16`对字符进行编码，标准化字符编码意味着新语言能支持一些功能性的设计来针对这种需要2个16位编码的字符。

#### codePointAt()方法

该方法是一个完全支持`UTF-16`编码的方法，用于获取一个字符在给定位置上的编码单元（16位的序列），注意是编码单元位置而不是字符串的位置。

{%highlight javascript%}
var text = "𠮷a";

console.log(text.charCodeAt(0));    // 55362
console.log(text.charCodeAt(1));    // 57271
console.log(text.charCodeAt(2));    // 97

console.log(text.codePointAt(0));   // 134071
console.log(text.codePointAt(1));   // 57271
console.log(text.codePointAt(2));   // 97
{%endhighlight%}

上面例子中，text的长度其实为3. `charCodeAt`和`codePointAt`在除了非BMP编码的字符上效果是一样的。`codePointAt`位置0返回了第一个字符的2个编码单元。有计算器的可以算一下，第一个字符的16进制表示为：`\u20bb7`，但是从位置1起，`codePointAt`和`charCodeAt`得到的结果又是一致的，都是当前点的编码值。

这个方法可以用于判断一个字符是否由两个编码点组成。

{%highlight javascript%}
function is32Bit(c) {
    return c.codePointAt(0) > 0xFFFF; // 由于codePointAt方法的位置0返回的是整个字符的编码值
}

console.log(is32Bit('a')); // false
console.log(is32Bit('𠮷')); // true
{%endhighlight%}

#### String.fromCodePoint()

es规范中的原则是，方法一定是配对出现的，有set就一定会有get。。。所以你可以用`codePointAt`来得到一个点的编码值，当然也可以用`String.fromCodePoint`将编码值转成字符串。

该方法和`String.fromCharCode`类似，在BMP编码下效果是完全一致的，你可以理解为`String.fromCodePoint`是`String.fromCodePoint`在UTF-16编码下的升级版。

{%highlight javascript%}
console.log(String.fromCodePoint(134071)); // '𠮷'
{%endhighlight%}

#### 转码非BMP字符

es5中允许用特殊的转码序列来表示16位的编码字符，`\u`后面的4个16进制数就是一个转码序列。如：

{%highlight javascript%}
console.log('\u0061'); // 'a'
{%endhighlight%}

当尝试超过4位的转码序列时：

{%highlight javascript%}
console.log('\u00617'); // 'a7'
{%endhighlight%}

es5的解析规则是，把前4个认为是一个字符，后面的单独算另一个字符。所以解析出来就是`a7`。当然es6中你可以这样做。

{%highlight javascript%}
console.log('\u{00617}');
{%endhighlight%}

>PS: 前提是你的环境是运行支持es6的基础上的，不然上面的语句会报错。

#### normalize()方法

编码另一个有趣的事儿是：不同的字符出于排序或者比较的目的用来判断相等。这儿有两种途径来定义这种关系，首先、典型的相等是两个语句的编码点在各方面都是可交换的，这甚至意味着两个字符的组合和另外一个字符也是相等的。第二种关系是兼容性：即两个语句的编码点虽然不相同，但是在某种情况下却可以同等的对待。

由于这些关系，或许就有两个字符串代表相同的文本，但却具有不同的编码点。例如：字符串"æ"和"ae"，从使用上来说。这两个字符串是等价值的，但是在js中判断由于编码点的不同则两个字符串是一定不相等的，所以就需要对他们进行序列化。

es6为字符串提供了一个`normalize()`方法，这个方法选择性的接受一个字符串来指明格式化的形式。默认值是`NFC`，另外还有"NFD", "NFKC", "NFKD"几种。对于不同形式的讨论这里不展开，只需要记住的是：如果要比较两个字符，必须要使用同一种序列化方法。

{%highlight javascript%}
var normalized = values.map(function(text) {
    return text.normalize();
});

normalized.sort(function(first, second) {
    if (first < second) {
        return -1;
    } else if (first === second) {
        return 0;
    } else {
        return 1;
    }
});
{%endhighlight%}

`values`是一个内容需要被序列化后用于排序的数组，当然你也可以在`values`上直接调用sort方法排序，只是在内部进行比较的时候调用序列化方法。

{%highlight javascript%}
values.sort(function(first, second) {
    var firstNormalized = first.normalize(),
        secondNormalized = second.normalize();

    if (firstNormalized < secondNormalized) {
        return -1;
    } else if (firstNormalized === secondNormalized) {
        return 0;
    } else {
        return 1;
    }
});
{%endhighlight%}

> PS: 进行比较的两个字符必须经过相同的序列方法进行序列化。

#### 正则表达式中的`u`标志

从上面的例子中可以看到，对于这种需要2个16位编码来表示的字符，正则表达式在这些情况下是无效的！所以es6针对正则表达式引入了一个`u`标记代表：'Unicode'

当正则表达式中有u标记后，会切换到基于字符串而不是编码单元的模式进行工作。这就不会导致因为编码单元不同而引起正则表达式失效的情况。

{%highlight javascript%}
var text = "𠮷";

console.log(text.length);           // 2
console.log(/^.$/.test(text));      // false
console.log(/^.$/u.test(text));     // true
{%endhighlight%}

如上，加了u标记以后正则表达式工作正常。然而不幸的是es6并没有原生的方法来得到一个字符串有多少个编码点。有了u标记，你就可以用它来进行计算。

{%highlight javascript%}
function codePointLength(text) {
    var result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
}

console.log(codePointLength("abc"));    // 3
console.log(codePointLength("𠮷bc"));   // 3
{%endhighlight%}

这时候就能正常的计算特殊字符串的长度了。上面的正则表达式匹配空格和非空格，当字符串匹配上正则表达式以后，`result`中包含的是匹配组。所以它的长度就代表一个字符串的编码点个数。
