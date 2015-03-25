---
layout: post
title: "jquery内核学习(8)--Sizzle选择器"
description: ""
category: jquery
tags: 
  - jquery内核
  - 学习笔记
---
{% include JB/setup %}

## Sizzle选择器

jquery从1.3版本以后就开始使用Sizzle作为默认的选择器引擎, Sizzle完全独立于jquery.
因此你可以到官网去单独下载Sizzle使用, 使用方法和jquery类似.

## CSS选择器

最基本的三种类型: ID选择器(#id), class选择器(.class)以及节点选择器
(p/div/h1/...). 然后再加上一些高级的选择器如: attribute, 伪类, 对象等选择器. 然
后再把各种选择器进行组合就是强大的选择器: `div:last-child`.

## 设计思路

再复杂的框架, 都是基于最原始的js方法实现的, 因此分析如下选择器的实现过程:

    $("div.red");

简单的描述: 寻找类名为red的div元素.

- 首先肯定是找出所有div的节点:

>

    var div = document.getElementsByTagName('div');

- 然后在判断找到的div的类名是否为red:

>
    
    var result = [];    // 结果

    for ( var item in div ) {

        if ( div[item] === 'red') {

            result.push( div[item] );
        }
    }    

    return result;
<!--more--> 
 
更复杂的选择器可以根据上面思想进行细分, 在不同版本的jquery中, 选择器引擎的设计思
路有些许差别.

    $('div p');

在早期的版本中, 是这个顺序:

    var div = document.getElementsByTagName('div'); // 首先找出所有的div

    if ( p in div.childNodes ) { // 迭代这个过程, 寻找所有具有p这个后代节点的div
        result.push( p );
    }

    return result;

而Sizzle把顺序做了调整:

    var p = document.getElementsByTagName('p'); // 首先找到所有的节点p

    while( p ) {

        if ( p.parentNode == div ) {
            result.push( p );
            break;  // 寻找父辈节点中有div的p元素, 找到即返回
        } else {
            p = p.parentNode;   // 一直迭代到根节点
        }
    }

    return result;

Sizzle选择器在遍历的过程中就进行过滤操作, 因此速度上有很大的提升.

对于一些复杂的选择器

    $('div.red:nth-child(odd)[title=bar]#wrap p');

解析顺序如下:

    var p = document.getElementsByTagName('p'); // 首先找到所有的节点p建立初始的
    结果集合

    // 如上面例子的方法筛选出所有父辈节点是div的节点p

    // 在上面的结果中找出类名是red的元素

    // 开始解析伪类选择器:nth-child(odd), 即找子元素为偶数的元素

    // 解析属性选择器[title=bar], 在上面的结果集合中筛选title属性为bar的元素

    // 最后是在结果集合中再筛选出id为wrap的元素.

## 部分源码分析

参照github上的最新代码进行部分分析...能力有限, 全部不可能看懂.

其实从使用中就可以看出, 实现选择器的第一步肯定是语法的正确性分析, 这步是通过很多
的正则表达式支持的; 接下来才是解析选择器的类型. 最后才是分别调用原生的js方法进行
结果的选择.

#### 部分正则表达式

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";

    // 匹配空格
	whitespace = "[\\x20\\t\\r\\n\\f]";

    // 匹配字母
    characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";

    // 标识符
	identifier = characterEncoding.replace( "w", "w#" );

    // 匹配属性选择器
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace +
        "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" +
        whitespace + "*\\]";

    // 匹配伪类选择器
	pseudos = ":(" + characterEncoding +
    ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" +
    attributes.replace( 3, 8 ) + ")*)|.*)\\)|)";

    // 下面是生成相应的正则表达式
    matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	};

    // 这是最简单的选择器匹配正则表达式, 分别匹配: ID, TAG, CLASS
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;

#### 首先是最简单选择器的匹配过程

    var match, m;

    if ( match = rquickExpr.exec( selector ) ) {

        // ID
        if ( m = match[1] ) {
            // getElementById(m);

        // Tag
        } else if ( match[2] ) {
            // getElementsByTagName(selector);

        // Class
        } else if ( m = match[3] ) {
            // getElementByClassName( m );
        }
    }

复杂的选择器真是无能为力, 深入不进去. 想了解更多的标准去参考[标准
](http://www.w3.org/TR); 想深入看jquery的源代码去[这里
](http://www.github.com/jquery/jquery).

## 选择器的优化

也是一些约定俗成的规矩了, 毕竟选择器的基本都是基于js原生方法的. 所以不同选择器的
效率肯定有区别.

- 多用ID选择器. 个人感觉都用这个; 尤其推荐js原生的方法:

>

    document.getElementById('id');
    document.querySlector('#id');
    document.querySlectorAll('tag');

- 必然的就是少用class选择器. 你可以用原生的.

>

    document.querySlector('.class');

- 使用class的时候最好能限定范围.

>

    $('div.red');   // 即我就想找类名是red的div

- 使用id选择器就不需要限定范围了.

>

    $('div#id');    // 多此一举, 因为id本身就是唯一的

- 多用父子关系, 少用嵌套关系.

>

    $(parent > child);  // 这样只是在parent中找直接的后代元素而不用迭代
    $(parent child);    // 则会在子代中进行迭代查找.

- 缓存jquery对象.

>

    var doc = document; // 直接把它也缓存了.

    var div = $('#div');    // 缓存要处理的结果

## 元素的定位

jquery中定义了`get()`, `index()`来定位元素；还定义了`get(index)`, `eq(index)`来
读取指定位置的元素.

`get(index)`和`eq(index)`的区别:

> 前者获取的是引用(reference), 跟用数组下标访问一样的效果, 可以直接修改原始对象;
> 后者只是对象的克隆, 并不会修改原始对象.

`get()`实现:

    get: function( num ) {
        return num === undefined ?
            // 返回全部的DOM元素数组
            Array.prototype.slice.call( this ) :
            // 返回对应位置的元素
            this[ num ];
    }

`eq()`实现:

    eq: function( i ) {
        // 序号是从0开始的.
        return this.slice(i, +i + 1);
    }

`index()`实现:

    index: function( elem ) {
        return jQuery.inArray(
            // 若参数是jquery对象, 则判断jquery对象中第一个元素在当前jquery对象
            // 中的位置
            elem && elem.jquery ? elem[0] : elem
        , this );
    }

    // 获取指定元素在数组中的下标位置
    inArray: function( elem, array )
        for ( var i = 0; length = array.length; i< length; i++ ) {

            if ( array[i] === elem ) {
                return i;
            }

            return -1;
        }

## 复制元素

模仿数组的`contact`方法定义了一个全局的`merge`函数.

    merge: function( first, second ) {

        // IE, Opera会重写length属性, 故先缓存length的值
        var i = 0, elem, pos = first.length;

        // 兼容IE
        if ( !jQuery.support.getAll ) {
            while( (elem = second[ i++ ]) != null )
                if ( elem.nodeType != 8 )   // 注释节点
                    first[ pos++ ] = elem;
        } else
            while ( (elem = second[i++]) != null )
                first[ pos++ ] = elem;

        return first;
    }

## 添加元素

该方法能把与表达式匹配的元素添加到jquery对象中.

    add: function( selector ) {
        // pushStack把所有的类数组对象全部推进到jquery对象
        return this.pushStack( jQuery.unique( jQuery.merge( // 去重并合并
                    this.get(), // 获取已经有的jquery对象, 在它的基础上进行添加
                    typeof selector === 'string' ?  // 判断是否为选择器
                    jQuery( selector ) :    // 若是选择器则直接进行选择
                    jQuery.makeArray( selector );   // 返回一个数组对象
        )));
    }

## 映射元素

jquery定义了两个映射方法, `each`对集合中的每个元素都执行回调函数; `map`方法还能
收集每个回调函数返回结果组成的新集合.

    each: function( callback, args ) {
        return jQuery.each( this, callback, args );
    }

是通过jQuery.each()公共函数来实现迭代过程的. 注意, 上面的args是为回调函数准备的
参数.

    map: function( callback ) {
        return this.pushStack( jQuery.map( this, function(elem, i) {
                return callback.call( elem, i, elem );
        }));
    }

    // map()公共方法
    map: function( elems, callback ) {
             var ret = [];
             for ( var i = 0; length = elems.length; i < length; i++ ) {
                 var value = callback( elems[i], i );
                 if ( value != null ) {
                     ret[ ret.length ] = value;
                 }

                 return ret.contact.apply( [], ret ); // 连接返回
             }
    }
