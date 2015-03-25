---
layout: post
title: "CSS使图片变灰, 兼容IE10+"
description: "ie10+ grayscale css整站变灰 grayscale整站变灰"
category: "css"
tags: ['life']
---
{% include JB/setup %}

#### 2015-02-10更新

{%highlight css linenos%}
html {
    /*ie4-8*/
    filter: gray;
    filter: grayscale(1);
    /*FF3.5+*/
    filter:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImdyYXlzY2FsZSI+                                            PGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAuMzMzMyAwLjMzMzMgMC4zMzMzIDAgMCAwLjMzMzMgMC4zMzMzIDAuMzMzMyAwIDAgMC4zMzMzIDAuMzMzMyAwLjMzMzMgMCAwIDAgMCAwIDEgMCIvPjwvZmlsdGVyPjwvc3ZnPg==#grayscale);
    /*ie9*/
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    -webkit-filter: grayscale(1);
}
{%endhighlight%}

PS: 已经方法不支持IE10+！！！解决该问题只能通过js实现，即：遍历`background-color`, `background-image`, `border-color`, `color`。把颜色用灰度算法替换掉，并且使用canvas来读取图片中的信息然后也调用灰度算法替换数据。

当然这么蛋疼的过程也不用你自己去实现，这里有完全实现好的插件:[grayscale.js](http://james.padolsey.com/demos/grayscale/grayscale.js)

用法：

{%highlight javascript linenos%}
grayscale();// 整站变灰
grayscale(document.getElementById('xx')); // id为xx的这个元素中所有内容变灰（包括xx节点本身）
{%endhighlight%}

#### 雅安加油!

#### 全局变灰:

    html{
        -webkit-filter: grayscale(1);
                filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    }

#### 只对局部进行变灰:

    (#id,.class,img,input......){
        -webkit-filter: grayscale(1);
                filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    }

