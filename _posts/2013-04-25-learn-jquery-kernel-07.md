---
layout: post
title: "jquery内核学习(7)--DOM元素选择"
description: "封装一些js的原生方法"
category: jquery
tags:
  - jquery内核
  - DOM
---
{% include JB/setup %}

做到这一步,我的这个jquery框架已经具备了基本的选择器功能(只能直接选择dom节点对象),还具备可扩展功能extend().

## 封装js方法

我们所知道的js能处理DOM元素的方法有:

    document.getElementsByTagName();    //获取html标签的dom元素集合
    document.getElementById();          //获取带ID的DOM元素

    //引用DOM节点
    childNodes;
    firstChild;
    lastChild;
    nextSibling;
    parentNode;
    previousSibling;

接下来封装到我的插件中去.

    /*more about nodeType: http://www.w3school.com.cn/xmldom/prop_element_nodetype.asp
     * nodeType            元素类型
     * 1                元素element
     * 2                属性attributies
     * 3                文本text
     * 8                注释comments
     * 9                文档documnt
     *
     * */
<!--more--> 

下面是封装过程中需要用到的共用函数

    jQuery.extend({
        /*
         * @param elem 起点元素
         * @param dir    寻找的方向:parentNode,nextSibling,previousSibling,firstChild,lastChild
         * @param until    到某个元素截至
         *
         * */
        dir: function( elem, dir, until ) {
            //匹配的元素集合
            var matched = [],
                //是否规定了截断范围
                truncate = until !== undefined;

            while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
                if ( elem.nodeType === 1 ) {
                    if ( truncate && jQuery( elem ).is( until ) ) {
                        break;
                    }
                    matched.push( elem );
                }
            }
            return matched;
        },

        /*
         * @param n    起点元素
         * @param elem    不包含自身
         *
         * */
        sibling: function( n, elem ) {
            //匹配的元素集合
            var matched = [];

            //迭代的过程: n = n.nextSibling
            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== elem ) {
                    matched.push( n );
                }
            }

            return matched;
        }
    });

封装好的对象

    var extend_fun = {
        //直接后继
        next: function( elem ) {
            return jQuery.sibling( elem, "nextSibling" );
        },
        //直接前驱
        prev: function( elem ) {
            return jQuery.sibling( elem, "previousSibling" );
        },
        //所有祖先元素
        parents: function( elem ) {
            return jQuery.dir( elem, "parentNode" );
        },
        //父元素
        parent: function( elem ) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !=== 11 ? parent : null;
        },
        //相邻(处于同一层DOM树)的元素
        sibling: function( elem ) {
            return jQUery.sibling( elem.parentNode.firstChild, elem );
        },
        //所有后继元素
        nextAll: function( elem ) {
            return jQuery.dir( elem, "nextSibling", until );
        },
        //所有前驱元素
        prevAll: function( elem ) {
            return jQuery.dir( elem, "previousSibling", until );
        },
        //所有的子元素
        children: function( elem ) {
            return jQuery.sibling( elem.firstChild );
        },
        //more about iframe: https://developer.mozilla.org/en-US/docs/XUL/iframe?redirectlocale=en-US&redirectslug=XUL%3Aiframe
        contents: function( elem ) {
            return jQuery.nodeName( elem, "iframe" ) ?
                    elem.contentDocument || elem.contentWindow.document :
                    jQuery.merge( [], elem.childNodes );
        }
    }

## 后续

好吧,现在这个小插件已经具备了DOM元素的操作功能(仅限于选择).待继续完善它!
