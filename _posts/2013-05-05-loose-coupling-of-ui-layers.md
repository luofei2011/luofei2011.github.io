---
layout: post
title: "UI布局的松耦合"
description: "网页设计中UI的松耦合"
category: javascript
tags:
  - 松耦合
  - JS模板
---
{% include JB/setup %}

## 前言

在Web开发中,UI被定义为以下三个层的组合:

1. HTML: 结构化需要显示的数据.
2. CSS: 视觉上的渲染.
3. JavaScript: 增强页面的交互性.

通常的UI布局是这样的, HTML层作为基础, CSS, JavaScript层在他的上面:

![传统布局]({{ ASSET_PATH }}/img/2013050501.png)

事实是, 某些应用中Javascript并不依靠于css, 存在这样的应用: 只有JS和Html; 或者只有Html和Css. 这都是有可能的, 
故Javascript和css的关系应该是平等的!例如: 尽管JavaScript和Css之间存在某些相互作用(如动态改变元素的className等.), 
JavaScript也能消除和CSS之间的依赖关系而独立运作.

![改进布局]({{ ASSET_PATH }}/img/20130505_02.png)

HTML, CSS, JavaScript之间的关系经常被定义得非常的紧密(紧密耦合), 以至于带来的后果是: 改变一个层不得不改变另外的一个或
者两个层; 比如说: 你想修改一段HTML代码(改一个类名字), 发现不仅需要到CSS里面去修改还需要去JS文件中寻找是否这个元素上绑
定有操作事件! 因此在较大规模的web应用中, 或者是团队开发过程中这种布局存在很大的问题.

## 松耦合

很多设计模式设计的初衷都是为了解决以上三层之间存在的紧密耦合关系, 如果两个模块紧密耦合, 意味着修改一个必然依赖于另一个模块的改变! 比如: 在你的网站中有一个error的类名, 当你有一天想把它换成warning的时候, 由于HTML和CSS是紧密耦合的, 所以你需要同时编辑HTML文件(改变所有类名叫error的元素)和CSS文件! 再往多了想, 当你面对几十个或者几百个模块的时候, 如此的修改是不能接受的! 

所以松耦合的目的就是: 当你改变一个单一模块的时候不必去修改别的任何模块! 松耦合适用于团队开发. 因为当多人贡献于一个项目的时候, 你希望的是一个开发者修改的某个代码部分不会影响到其它代码部分的开发者!

有一点是需要注意的: 在一个系统中, 不存在完全没有耦合的两个模块! 在任何系统中, 任两个模块之间都会存在一定的信息共享. 我们的目的仅仅是保证一个模块的修改不会导致像基本布局一样带来的太多地方的改动.

松耦合的UI很容易调试, 文本或者结构的问题可以直接定位到HTML层, 样式问题肯定出现在CSS层, 其它的像一些调试器上出现的error我们会直接去JS文件中寻找(代码的剥离在下面有介绍).
<!--more--> 

## CSS中不要出现JS代码

**CSS expressions**: 在IE8及早期版本中, 允许在CSS中直接插入JS代码.

    .box {
    　　width: expression(document.body.offsetWidth + "px");
    }

JS代码被放在expression()函数里面, 接受任何的JS代码, **CSS expression()**每次都会被浏览器重新计算导致性能上的问题!

抛开性能上的问题, 由于JS代码是直接嵌入到CSS的, 给维护带来了很大的问题! 比如说有时候出现了一个js错误, 你的第一直觉肯定是去js文件中寻找错误, 但是不幸的是等你找遍了所有的js文件后还是没能发现问题, 最后当你一气之下剥离掉所有js代码之后发现错误并没有消失....当你绝望的上下滚动鼠标时, 惊奇的发现CSS文件里面还有一段js代码, 最终出错的就是这里的时候, 你一定会气得砸掉电脑.... 

IE9去掉了CSS expression(). 不过CSS3中添加了特殊的属性, 功能类似与expression, 但里面支持的仅仅是数学表达式:

    /* 元素的居中 */
    .box{
    　　width: 500px;
    　　height: 300px;
    　　margin-left: calc((100% - 500) / 2); /* +,-前后必须有空格才能被解释, *, /后可以没有空格 */
    }

## 去掉JS中的CSS代码

使用最频繁的就是利用DOM元素的style属性, style属性是一个包含了可读可写的css属性的对象, 如修改文本的颜色:

    // Bad
    element.style.color = 'blue';

或者是批量修改样式:

    // Bad
    element.style.color = "red";
    element.style.left = "10px";
    element.style.top = "100px";
    element.style.visibility = "visible";

甚至是通过cssText属性一次性解决:

    // Bad
    element.style.cssText = "color: red; left: 10px; top: 100px; visibility: hidden";

这些修改样式的方法都会带来维护上的问题: 当页面的样式出现差异的时候肯定首先去css文件中查找, 会走很多的弯路!

最好的解决办法就是, 把所有的样式定义都放在css文件中, 当需要修改某个节点的样式的时候只需为它加上相应的className即可!

如下的css:

    .reveal {
    　　color: red;
    　　left: 10px;
    　　top: 100px;
    　　visibility: visible;
    }

用js为元素添加类名:

    // Good - Native
    element.className += " reveal";

    // Good - HTML5
    element.classList.add("reveal");

    // Good - jQuery
    $(element).addClass("reveal");

把className看作是CSS和JS之间的联系, JS能很容易的通过改变元素的类名就改变了元素的样式. 当需要修改样式效果的时候也只需修改对应的css文件即可!

## 剥离出HTML中的JS代码

对于一些事件响应, 我们通常喜欢把js嵌入到html文件中. 通过为元素添加一个属性(如: onclick):

    <!-- Bad -->
    <button onclick="doSomething();" id="action-btn">Click Me</button>

尽管这样在执行效果上没什么问题, 事实是HTML层和JS层紧密耦合, 带来了几个问题:

1. 必须保证在button点击以前, doSomething()函数是存在的! 某些情况下, doSomething()或许是在html文档后面才加载的! 因此当你点击button的时候就会发生一个js error, 相应地按钮什么也不做!
2. 再一个就是维护问题, 试想一下当你想改变函数名的时候, 你还需要去改变html中所有调用这个函数的地方为他们修改名字(或许你可以通过查找替换轻松的实现, 但要是你忘记了替换呢?)!

因此, 在html文件中尽量不要通过on属性来绑定一个事件, 而是通过js的方法来给一个元素绑定监听事件(考虑到兼容性).

    function addListener(target, type, handler) {

    　　if (target.addEventListener) {
    　　　　target.addEventListener(type, handler, false);

    　　// for IE
    　　} else if (target.attachEvent) {
    　　　　target.attachEvent("on" + type, handler);

    　　// 对于DOM Level 0(这只是不同的版本, 就像html4和html5一样, 目前基本是DOM Level 3)
    　　} else {
    　　　　target["on" + type] = handler;
    　　}
    }

如给一个id为btn的元素绑定一个事件:

    function doSomething() {
    // code
    }

    var btn = document.getElementById("btn");

    // js方法
    addListener(btn, "click", doSomething);

    // jQuery
    $("#btn").on("click", doSomething);

还有另一种方法是在html文件中通过script标签嵌入js代码:

    <!-- Bad -->
    <script>
    　　doSomething();
    </script>

**总之**: 最好让js文件和html文件分离! 分离的好处是调试方便.

## 不要在JS中插入html代码

使用最多的就是在js中使用innerHTML属性来为某个元素动态添加内容.

    // Bad
    var div = document.getElementById("my-div");
    div.innerHTML = "<h3>Error</h3><p>Invalid e-mail address.</p>"; 

在js中嵌入html串有几个方面的问题:

1. 就像上面常提到的, 出错了找错不方便, 或许会走很多不必要的弯路.
2. 维护问题.

由于很多的网站应用都是动态的, JS通常用于改变网页的UI, 因此用js来插入或者操作网页中的节点是非常有必要的,  要实现html和js间的松耦合有一下几种方法.

## 从服务器上动态或者页面信息

对于单个页面的动态加载非常的方便:

    function loadDialog(name, oncomplete) {

    　　var xhr = new XMLHttpRequest();
    　　xhr.open("get", "/js/dialog/" + name, true);

    　　xhr.onreadystatechange = function() {
    　　　　
    　　　　if (xhr.readyState == 4 && xhr.status == 200) {

    　　　　　　var div = document.getElementById("dlg-holder");
    　　　　　　div.innerHTML = xhr.responseText;
    　　　　　　oncomplete();

    　　　　} else {
    　　　　　　// handle error
    　　　　}
    　　};

    　　xhr.send(null);
    }

jQuery的异步加载方式:

    // jQuery
    function loadDialog(name, oncomplete) {
    　　$("#dlg-holder").load("/js/dialog/" + name, oncomplete);
    }

当你想插入大量的html的时候异步加载是不错的选择, 但是从性能的角度讲, 把大量没用
的节点放在内存或者是DOM中是值得考虑的! 对于最少化标签量的原则, 可以考虑**模板引擎**. 

## 简单的模板

例如有如下的HTML模板:

    <!--%s是需要动态改变的参数, 这里我们通过给js函数传递参数实现-->
    <div id="template">
    　　<li><a href="%s">%s</a></li>
    </div>

然后我们针对这一个模板, 写一个js函数来动态替换标签a中的内容(主要是链接地址和链接的名字):

    /*
     @param {Array} text 这里接受的参数形式是一个数组, 第一个是需要替换的元素后面的参数是顺序替换的内容
     @return {string} text 返回替换完成后的文本, 再把这文本注入到DOM元素中　
    */
    function sprintf( text ) {
            var i = 1,
                args = arguments,
                len = args.length;

            return text.replace(/%s/g, function() {
                return ( i < len ) ? args[ i++ ] : '';
            });
    } 

接下来是在DOM中根据实际参数替换模板中的内容:

    window.onload = function() {

    　　var template= document.getElementById("template"),
    　　　　 templateText = template.innerHTML,
       　　 result = sprintf( templateText, "/item/4", "Fourth item" );

    　　template.innerHTML = result; // 注入修改后的内容
    }

实际修改后HTML内容为:

    <div id="template">
    　　<li><a href="/item/4">Fourth item</a></li>
    </div> 

上面这种模板带来的问题是: 当同一地方也定义了相同的模板以后, 导致JS会两个模板一起渲染, 在js传参不确定的情况, 某些模板将会解释出错. 达不到预期的效果, 所以理想的情况是: 把模板放在一个相对固定的地方, 能通过js精确的渲染这个模板

以下是一个利用HTML注释(也是DOM节点, 能通过js操作)作为模板的例子:

    <ul id="mylist"><!--<li id="item%s"><a href="%s">%s</a></li>-->
    　　<li><a href="/item/1">First item</a></li>
    　　<li><a href="/item/2">Second item</a></li>
    　　<li><a href="/item/3">Third item</a></li>
    </ul>

接下来为js添加一个方法来处理它:

    function addItem( item, url, text ) {

        var mylist = document.getElementById("mylist"),
            templateText = mylist.firstChild.nodeValue, // 获取注释节点
            result = sprintf( templateText, item, url, text );

        /*
          More About insertAdjacentHTML: https://developer.mozilla.org/zh-CN/docs/DOM/element.insertAdjacentHTML 
         */
        mylist.insertAdjacentHTML("beforeend", result);
    }

当你需要向ul#mylist里动态添加一个项目的时候, 只需要传递变化部分的参数即可!

    window.onload = function() {
        addItem( "4", "/item/4", "Fourth item" );
    }

## 利用script标签的type属性创建模板

type属性: script的type属性通常是"text/javascript", 但是你完全可以自定义自己的type属性(目的就是要让浏览器不知道这个type是做什么的):

    <script type="text/x-my-template" id="list-item">
    　　<li><a href="%s">%s</a></li>
    </script>

然后修改一下前面的addItem()方法:

    function addItem( item, url, text) {

    　　var doc = document, // 做好缓存
    　　　　mylist= doc.getElementById("mylist"),
    　　　　script= doc.getElementById("list-item"),
    　　　　templateText= script.text, // 取回模板中的文本
    　　　　result= sprintf(templateText, item, url, text), // 根据参数渲染模板
    　　　　div= doc.createElement("div");

    　　div.innerHTML = result.replace(/^\s*/, "");
    　　mylist.appendChild(div.firstChild); // 动态插入
    }

**注意**: 为什么在向div插入结果的时候需要截取掉开始的空格?

因为在我们的script模板中, 真正的模板文件在第二行, 当用text取得模板内容的时候空格也被带进来了, 因此插入div的时候会产生一个空的文本节点(什么都没有, 但确实是一个文本节点), 这样再向mylist中插入项目的时候将会插入一个空的文本节点, 结果是什么也没有! 因此在插入div以前, 要确保一开始的内容就是我们想要的而非空格.

跟上面同样的使用方法:

    window.onload = function() {
        addItem( "4", "/item/4", "Fourth item" );
    }

## 复杂的模板 

目前网上有很多现成的模板库, 大家可以根据自己的需求集成到自己的应用中.如
[HandleBars](https://github.com/wycats/handlebars.js/), 以及它的[教程](http://blog.teamtreehouse.com/getting-started-with-handlebars-js).
