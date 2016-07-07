---
layout: post
title: "CSS中min-height:100%问题"
description: "在很多布局中,都需要用到100%这个属性"
category: css
tags: ['css']
---

字面意思就是最小高度,高度的百分比继承于父元素大小.在多次嵌套的div中若里层需要使用min-height:100%.则其所有祖先元素都得设置
{%highlight css%}
    *{
        min-height:100%;
        height: 100%;
    }
{%endhighlight%}
如下面的实现过程:

{%highlight html%}
    <!DOCTYPE HTML>
    <html>
        <head>
            <title>test min-height</title>
        </head>
        <style type="text/css">
        html,body{
            height: 100%;
            margin: 0;
            padding: 0;
        }
        .container,.wrap1,.wrap2{
            min-height: 100%;
            height: 100%;
        }
        .wrap3{
            min-height: 100%;
        }
        </style>
        <body>
            <div class="container">
                <div class="wrap1">
                    <div class="wrap2">
                        <div class="wrap3">
                            <p>this is the test div</p>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
{%endhighlight%}
<!--more--> 
只有在父元素高度明确指定的情况下,子元素才能继承父元素的高度,但是`min-height`是模糊的,不明确的.故最后计算出来的高度往往是"auto"而不是期望的100%,在这个问题中.

当我们把html的高度设置为100%就代表html的大小就是整个页面,即html的高度是确定的.然后是body的100%,继承自html同样高度也是确定的.....这样一直下去,
到wrap3时,由于之前的元素高度都是确定的,此时wrap3的`min-height`自然能起作用.
