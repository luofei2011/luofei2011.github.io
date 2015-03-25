---
layout: post
title: "jquery内核学习(4)--添加选择器功能"
description: ""
category: jquery
tags: ['jquery内核']
---
{% include JB/setup %}

通过前几篇的分析,大体的画出了jquery的框架,但是它确不具备现实中jquery插件的一切功能!现实中是怎样的?

    $('#id');  //我能选择一个id为id的dom元素
    $('.class');  //我也能选择一个class为class的dom元素
    $('div');   //我还能选择当前页面中的所有div

## 接受参数

首先给我的插件能传递一个参数,初步具备选择器的功能:

    /*
        selector: 选择器参数
        context: 选择的范围
     */
    var $ = jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
    }

    jQuery.fn = jQuery.prototype = {
        init: function(selector, context) {
            selector = selector || document;
            context = context || document;

            //console.log(typeof(selector));
            //选择器为dom节点对象
            if(selector.nodeType){
                this[0] = selector;
                this.length = 1;
                this.context = selector;
                return this;
            }
            //选择符是字符串
            if(typeof selector === 'string'){
                var node = context.getElementsByTagName(selector);
                for(var i in node)
                    this[i] = node[i];
                this.length = node.length;
                this.context = context;
                return this;
            } else{
                this.length = 0;
                this.context = context;
                return this;
            }
        },
        author: 'Poised-flw',
        size: function() {
            return this.length;
        }
    }

    jQuery.fn.init.prototype = jQuery.fn;
<!--more--> 

## 测下一下选择器

    //test html
    <div>1</div>
    <div>2</div>
    <div>3</div>

    //test script
    console.log($('div').size());    //3    selector is a string
    var div = document.getElementsByTagName('div');
    console.log($(div[0]).size());    //1 selector is a DOM node

现在我的jquery插件已经初步具备选择dom节点的功能了,并且还能调用size()方法返回对象集合的长度!
