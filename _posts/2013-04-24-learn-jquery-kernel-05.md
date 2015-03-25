---
layout: post
title: "jquery内核学习(5)--对象的遍历"
description: ""
category: jquery
tags: ['jquery内核']
---
{% include JB/setup %}

现在来实现jquery插件中经典的几个方法.

## 对象的遍历

经典的用法:

    $('div').each(function() {
        //do something
    });

现在给我的jquery扩展一个each()方法:

    jQuery.each = function(object, callback, args) {
        for(var i in object)
            callback.call(object[i], args);
        return object;
    }

两个地方:

1. 通过for循环遍历对象集合中的所有对象

2. 为每个对象绑定相同的回调函数callback(),有个问题.就是对于不变的回调函数当不同的对象调用它的时候.只是this的指向不同!

    callback.call(object[i], args);    //每次修改callback方法中this指向为object[i]

有了对象的遍历功能(虽然不健全,但还是有遍历的意思).接下就可以结合前面的选择器功能给对象绑定各种回调方法!
<!--more--> 

## $().html的实现

想法很简单,遍历选择器选择的没一个节点对象,分别为他们调用js原生的innerHTML方法.

    jQuery.fn = jQuery.prototype = {
           init: function(selector, context) {
            //......省略
            },
        html: function(val) {
            jQuery.each(this, function(val) {
                this.innerHTML = val;
            }, val);
        }
    }
    //很重要
    jQuery.fn.init.prototype = jQuery.fn;

简单的来个测试:

    //test html
    <div>1</div>
    <div>2</div>
    <div>3</div>
    $('div').html('hello world!');

结果:

    //result
    <div>hello world!</div>
    <div>hello world!</div>
    <div>hello world!</div>

## 知识拓展

jQuery框架中封装的each()和html()方法远比上面YY的那个强大!附上源码. 

    jQuery.extend ({
        isFunction: function( obj ) {
            //obj.toString()
            return toString.call(obj) === "[object Function]";

            //if obj is Object, toString.call(obj) = "[object Object]"
        },

        // args is for internal usage only
        each: function( object, callback, args ) {
            var name, i = 0,
                length = object.length,
                isObj = length === undefined || jQuery.isFunction(object);

            //args is an array
            if ( args ) {
                if ( isObj ) {    //若object不是jquery对象
                    for ( name in object ) {
                        //在每个对象上调用回调函数
                        if ( callback.apply( object[ name ], args ) === false ) {
                            break;
                        }
                    }
                } else {    
                    for ( ; i < length; ) {    //遍历对象数组
                        if ( callback.apply( object[ i++ ], args ) === false ) {
                            break;
                        }
                    }
                }

            // A special, fast, case for the most common use of each
            } else {
                if ( isObj ) {
                    for ( name in object ) {
                        if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                            break;
                        }
                    }
                } else {
                    for ( var value = object[0];
                        i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
                }
            }

            return object;
        }
    })

$().html()方法的源码:

    jQuery.fn = jQuery.prototype = {
        html: function( value ) {
                  return value === undefined ?
                      (this[0] ?
                        this[0].innerHTML.replace(/ jQuery\d+="(?:\d+null)"/g, "")) :
                        null) :
                      this.empty().append( value );
              }
    }

这么简洁,精炼的代码....好吧,下节继续实现extend()扩展方法.
