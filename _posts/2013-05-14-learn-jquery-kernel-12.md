---
layout: post
title: "jquery内核学习(12)--页面初始化"
description: ""
category: jquery
tags: 
  - jquery内核
  - 学习笔记
---
{% include JB/setup %}

## ready()

> 封装了js原生的window.onload方法, 表示在DOM载入就绪, 并可以查询和被操纵时, 能够
> 自动执行函数.

    $(document).ready(function() {
        // 页面初始化后的代码
    });

    jQuery(function($) {
        // 同上
    });

    // 或者
    $(function() {
        // 
    });

jquery允许在文档中无限次使用ready事件, 里面的内容按注册的先后顺序执行, 一旦使用
了jquery事件初始化界面就不能使用js的原生window.onload, 否则会导致冲突致无法触发
ready事件.

## ready事件触发机制

1. load事件是在文档内容完全加载完毕后才被触发, 这个文档包括页面中所有节点以及和
节点相关的文件. 这时js才可以访问网页中任何元素和内容. 编码过程中不用考虑加载的次
序.

2. ready事件是在DOM完全就绪时就可以触发, 此时文档中所有元素都是可以访问的, 但是
与文档相关联的文件可能还没有下载完毕. 通俗地讲: 浏览器下载并完成了解析HTML的DOM
树结构后代码就可以执行了.
<!--more--> 

例如: 在大型网站中, 如使用load方法, 则必须等到所有图像都下载完毕才能够进行. 而
ready事件则不需要等这么久, 只需在DOM树创建好就可以执行. 但是触发过早也会导致一些
意料之外的事情发生.

    // 与js中load等效的写法
    $(window).load(function() {
        //
    });

    // 等价于;
    window.onload = function() {
        //
    }

## 初始化事件的多次调用

js中的load不允许多次调用.

    window.onload = function() {
        alert('first');
    }

    window.onload = function() {
        alert('second');
    }

导致第一次事件调用被重写. 若要解决这个问题只有将所有初始化函数都放在一个load事件
中.

    window.onload = function() {
        (function() {
            alert('first');
         })();
        (function() {
            alert('second');
         })();
    }

而jquery的ready则不用考虑这么多, 可以无限写.

    $(function() {
        alert('first');
    });
    $(function() {
        alert('second');
    });

## 为js自定义自己的ready方法

由于js的load和jquery的ready方法存在使用上的冲突, 因此自定义一个js的ready方法:

    function ready() {
        var oldOnload = window.onload;  // 缓存load函数.

        if( typeof window.onload != 'function' ) {  // 若load还为绑定任何事件处
            理函数
            window.onload = func;
        } else {
            // 若load已经绑定了处理函数, 则先执行已经绑定的函数, 然后再顺序
            // 执行后面添加的函数
            window.onload = function() {    // 重写改方法
                oldOnload();
                func();
            }
        }
    }

    // 使用
    ready(function() {
        alert('first');
    });
    ready(function() {
        alert('second');
    });

## 使用js自定义jquery的事件方法

原生的js代码总会比诸如jquery代码库的写法执行效率更高.

jquery的ready方法实际上是对IE的readystatechange事件和DOM的DOMContentLoaded事件进
行封装, 这两个事件都是在DOM树结构下载并解析完毕之后触发.

    // 自定义ready方法
    var $ = ready = window.ready = function(fn) {
        if ( document.addEventListener ) {  // 非IE
            document.addEventListener('DOMContentLoaded', function() {
                document.removeEventListener( 'DOMContentLoaded',
                    arguments.callee, false );
                fn();   // 调用参数函数
            }, false);
        } else if ( document.attachEvent ) { // IE
            document.attachEvent('onreadystatechange', function() {
                if( document.readyState === 'complete' ) {
                    document.detachEvent('onreadystatechange',
                        arguments.callee);
                    fn();
                }
            });
        }
    }

正常情况下, 若使用onload方法则必须等到image, flash, iframe等内容都加载完毕才会执
行. 造成等待时间的浪费.

## 最后

对于jquery动画效果这章. 本人是觉得jquery封装非常不错, 在已经有的情况再去用js实现
一篇意义不大. 因此对于处理动画效果我还是比较喜欢直接使用jquery库.

然后是对于jquery异步通讯这块, jquery不管是从浏览器的兼容性还是从代码的可维护性上
都封装得很好...在实际项目中也无数次的使用ajax. 故这块掌握得比较扎实, 也不再叙述.

jquery内核学习系列的后期主要侧重于插件的开发.
