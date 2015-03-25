---
layout: post
title: "jquery内核学习(6)--扩展实现extend"
description: "丰富自己的jquery框架, 使其具备扩展的功能"
category: jquery
tags: ['jquery内核']
---
{% include JB/setup %}

本篇继续丰富我的jquery框架,利用extend来扩展!

## 扩展的优点

不必每次增加新的方法都直接往jQuery或者jQuery.fn追加. 

    jQuery.fn.extend({
        fun1: function() {
             console.log('this is an extend function');
        }
    })
通过这样的方法就能为jQuery扩展一个名叫`fun1()`的方法.然后能直接调用它

    $('div').fun1();    //this is an extend function
    extend()方法的基本思想就是把指定对象的方法都复制给jQuery或者jQuery.prototype对象! 

    jQuery.extend = jQuery.fn.extend = function( obj ) {
        for ( var name in obj ) {
            this[ name ] = obj[ name ];
        }
        return this;
    }
<!--more--> 

## 知识拓展

jQuery中的`extend()`方法远比上面几行代码复杂,强大!下面是官网提供的API.

    jQuery.extend( target, [ object1 ], [ objectN ] );

    //example
    var object1 = {
        apple: 0,
        banana: {weight: 52, price: 100},
        cherry: 97
    };
    var object2 = {
        banana: {price: 200},
        durian: 100
    };
    jQuery.extend( object1, object2 );
    //result
    var object1 = {
        apple: 0,
        banana: {weight: 52, price: 100},  
        durian: 100,
        cherry: 97
    } 

**target**:属性合并后的集合.

**object[1...n]**:待合并的属性,若target没有则直接加入,否则重写(覆盖).

若有新属性合并进来,则破坏了target原来的结构.

    jQuery.extend( { }, target, [ object1 ], [ objectN ] ); //合并后的结果将输入到{ }中.

    //example
    var defaults = { validate: false, limit: 5, name: "foo" };
    var options = { validate: true, name: "bar" };

    var merge = jQuery.extend( { }, defaults, options );

    //result
    /*
    var defaults = { validate: false, limit: 5, name: "foo" };
    var options = { validate: true, name: "bar" };
    var merge = {"validate":true,"limit":5,"name":"bar"};
    */ 

若`extend()`接受的参数是唯一的.则合并到jQuery的环境中去.

    jQuery.extend( target );

    //test
    jQuery.extend({
        test: function() {
            console.log( 'I'm an example' );
        }
    })

    jQuery.test();    //I'm an example

带选项的深度`extend()`方法

    jQuery.extend( [ deep ], target, object1, [ objectN ] );

**deep**(`boolean`): 若取值`true`,将会递归的合并(深度copy).

其它的参数含义如上.

何为深度copy?

    //example
    var object1 = {
      apple: 0,
      banana: {weight: 52, price: 100},
      cherry: 97
    };
    var object2 = {
      banana: {price: 200},
      durian: 100
    };

    jQuery.extend( true, object1, object2 );

    //result
    /*
    var object1 = {
        apple: 0,
        banana: {weight: 52, price: 200},
        cherry: 97,
        durian: 100
    }
    */
深度`copy`:为每个子对象递归调用`extend()`方法!

## 源码解析

    jQuery.extend = jQuery.fn.extend = function() {
        /*
         * options: 复制操作的对象及object[1...n]
         * name:    object[1...n]里面的每项
         * src:        目标对象
         * copy:    复制的项目,也是递归copy的操作对象
         * copyIsArray:    copy的对象是数组
         * clone:    需要递归copy的目标对象
         * */
        var options, name, src, copy, copyIsArray, clone,
            //复制操作的目标对象
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            //是否进行深度copy
            deep = false;

        //若传递的第一个参数是boolean(false,true),则处理是否深度copy
        if ( typeof target === "boolean" ) {
            deep = target;
            //第二个参数变成copy的目标对象
            target = arguments[1] || {};
            //掠过boolean值
            i = 2;
        }

        // 若目标对象为字符串则置空对象target
        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
            target = {};
        }

        //唯一参数的时候,目标对象是当前环境this
        if ( length === i ) {
            target = this;
            --i;
        }

        //处理需要进行copy的对象
        for ( ; i < length; i++ ) {
            //只对非空对象进行处理
            if ( (options = arguments[ i ]) != null ) {
                for ( name in options ) {
                    //相当于hash查找target中是否有name这一项,没有则加入,有则重写
                    src = target[ name ];
                    copy = options[ name ];

                    //阻止死循环发生
                    if ( target === copy ) {
                        continue;
                    }

                    //若copy是一个对象或者是一个数组,则进行递归的copy
                    if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            //相当于上面的target = {}; 定义进行递归copy的目标对象
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        //递归调用
                        target[ name ] = jQuery.extend( deep, clone, copy );

                    //其它情况则直接重写!
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        //返回合并后的对象
        return target;
    };

## 发现的问题

源码中有一点值得注意的:

    // 若目标对象为字符串则置空对象target
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
         target = {};
    } 
其实不能只单纯的理解为目标对象为字符串!分析源码不难发现.这里的条件是:

`target`不是`"object"`,并且target也不是`"function"`!怎么说呢?如下:

    var object1 = {
        name: 'Poised-flw',
        age: 20
    }

    //Number
    var test1 = jQuery.extend( 123, object1 ); //Object {name: "Poised-flw", age: 20}
    //String
    var test2 = jQuery.extend( 'Poised-flw', object1 ); //Object {name: "Poised-flw", age: 20}
    //Array
    var test3 = jQuery.extend( [ 1, 3, 4 ], object1 ); //Object {name: "Poised-flw", age: 20}
    //...more

    //以上的用法其实就相当于
    var test = jQuery.extend( { }, object1 );
话说还有个更奇妙的地方.当typeof target是"function"的时候会产生什么样的结果?

    var object1 = {
        name: 'Poised-flw',
        age: 20,
        test: 'haha'
    }

    var fun = function() {
        console.log('I am a function');
    }

    var result = jQuery.extend( fun, object1 );

    /*something interesting*/
    typeof result;    //"function"
    result();    //'I am a function'
    result['name'];    //""
    result['age'];    //20
    result.test;    //"haha"

函数还能这么用,这玩意不多见...井底之蛙了...@^@

不过还有个问题呀...^_^

    result.name;    //""  为什么不是"Poised-flw"
    result['name'];    //""  为什么不是"Poised-flw"
以下是解释:

    function.name
    name属性返回一个function的名字,当function是一个匿名函数的时候返回一个空串(Chrome & Opera & Firefox & Safari),IE不支持此属性(undefined)!


    // example 1
    function doSomething() {
         console.log(doSomething.name);  // expcept IE: "doSomething", but for IE: undefined   
    }

    //example 2
    var fun = function() {
         console.log(fun.name);   //except IE: "", and for ie: undefined   
    }

注意:name属性是只读属性,并不允许修改!就像length属性一样.


    //the name property
    var fun = function() {
        //...
    }

    //the same with length
    console.log(fun.name);    //""
    fun.name = "Poised-flw";    //"Poised-flw"
    console.log(fun.name);    //""

    //the length property
    console.log( (function() {}).length );    //0
    console.log( (function(a, b) {}).length );    //2

    //for firefox. function.length does not include the "rest parameter"
    /*
        About rest parameter:
            以...开始的参数,代表一个数组.范围是从0到数组的长度
        function(a, b, ...Args) { //... }    
     */
    console.log( (function(a, ...Args) {}).length );   //1

    //notice! arguments.length将返回实际传入函数的参数个数
    /*
     * function f( a, b, c, d ) {
     *    console.log( f.length );
     *　  console.log( arguments.length );
     * }
     * f( 1, 2, 3 );  //4, 3
    */
到此自己的jquery框架也算具备可扩展性了!接下来就是丰富它!
