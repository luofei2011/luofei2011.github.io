---
layout: post
title: "ipad上的sticky header实现方式"
description: "sticky header;ios sticky"
category: "移动端"
tags: 
  - ipad
  - 经验
---

本文主要分析sticky属性在ipad ios6/7/8上的展现效果，以及遇到问题的解决办法。

#### 使用概览

考虑到兼容性，使用的时候全部都带上前缀即可。

{%highlight css%}
header {
    position: -webkit-sticky;
    top: 0;
}
{%endhighlight%}

在需要实现sticky header的需求中，给需要固定的部分加上上面的代码。然后滚动页面，就会发现header会在滚动超过其offsetTop的时候固定在页面顶端不动。这种效果对于强视觉来说十分有用，如PC的百度结果页，检索框并不随页面滚动。这样用户在输入query的时候就会减少很多步骤。

__变种需求__

很多需求都可以在此基础上进行延伸，如：当用户往下滑动页面的时候，此时用户关心的时候页面下方被影藏的内容。并不关心header部分是否固定在页面顶端；而且还有一种可能，如果用户往下翻页面的时候header一直固定，特别是在移动端上，会挡住一大块儿屏幕，导致用户获取信息的区域变小。严重影响用户体验。

因此，在特定环境或者交互下才出现固定的header很有必要！

实现这种需求并不难，都是利用sticky的方式来固定header，只是要在特定的时候换成relative即可。我们可以抽象出两个header的状态：

1、固定状态

此时的css样式如上

2、不固定（还原）状态

{%highlight css%}
header {
    position: relative;
    top: 0;
}
{%endhighlight%}

> PS：这两种样式的切换不会导致页面抖动，可以理解为以上两种样式并没有脱离正常的文档流

所以、只需要监听页面的手势，在特定时候切换样式即可。

{%highlight javascript%}
// 引入基础库jquery or zepoto
// 重置header样式
var $header = $('header');
var $doc = $(document);
function resetHeaderStyle() {
    $header.css('position', 'relative');
}

function stickyHeader() {
    $header.css('position', '-webkit-sticky');
}

// 如果是zepoto
$doc.swipeUp(function () {
    resetHeaderStyle();
    // do others...
});

$doc.swipeDown(function () {
    stickyHeader();
    // do others...
});

// 如果用的jquery 
// 可以去网上找一些开源的touch手势基础库
// 当然也可以自己实现一个简单的。
var tmpY;
$doc.on('touchstart', function (e) {
    // 这里不要用pageY 一堆BUG
    tmpY = e.originalEvent.targetTouches[0].clientY;
});
$doc.on('touchmove', function (e) {
    e.stopPropagation();
    var nowY = e.originalEvent.targetTouches[0].clientY;

    // 这里控制一个误差范围能提供操作的流畅性
    if (Math.abs(nowY - tmpY) >= 3) {
        $doc.trigger((nowY > tmpY) ? 'swipeDown' : 'swipeUp');
    }

    tmpY = nowY;
});
{%endhighlight%}

#### 过程中遇到的一些BUG

由于是不标准的属性，因此在各个版本中兼容性都存在问题。而且会导致很多连续性的问题。

__1、当输入框激活唤起输入法导致检索框分离的现象__

这个问题查阅了好多资料，目前的处理办法都是强制回到页面顶部

{%highlight javascript%}
$header.find('input').on('focus', resetHeaderStyle);
{%endhighlight%}

> PS: “回到页面顶部”并不需要`window.scrollTo(0, 0);`，只需要把header的position改成relative，输入框激活的时候自动就回去了。

不过上面的方法在ios8的safari浏览器（竖屏）下会有点小瑕疵：这上面会出现一个滚动过程，而别的版本都是无缝、无感知的回到顶部。

__2、header固定后刷新页面发生样式错乱__

当header的样式变成sticky之后，刷新页面。header会先出现在靠近页面底部的位置，然后才能回到其该出现的位置。解决该问题的方法有两种：

一个就是如上的强制回到页面顶部，比较粗暴；但是非常有效！

另一个就是在页面初始化的时候强制重置一下header的样式。

{%highlight javascript%}
$(function () {
    $header.css({
        position: 'relative',
        top: 0
    });
});
{%endhighlight%}

__3、当快速滚动页面的时候出现两个重叠的header__

这个严格来说不算是代码的bug，而是机器的性能 + 人眼识别的时间差导致的样式错乱。解决方法也很简单，给header加一个`translate3d`即可。

{%highlight css%}
header {
    -webkit-transform: translate3d(0, 0, 0);
}
{%endhighlight%}

__4、快速滚动过程中的不流畅性__

对于这种问题，基本都是由于页面的频繁repaint和reflow导致的性能问题，因此做法就是减少或者集中此类问题的执行。针对这个需求，就是在touchmove中添加延迟执行。setTimeout或者`requestAnimationFrame`都可以。

#### 如何兼容不支持sticky的浏览器

不支持那就只能模拟了，方式有多种。`relative + fixed`或者`relative + absolute`都行。但问题是，这两种样式之间的切换是会导致页面闪动的，因此需要在页面初始化的时候添加一个备用结点用来替代header的位置。

实现原理和上面一样，都是两种状态之间的切换，对于出现的bug都可以用上面的方式解决。

#### 写在最后

最后附上检测浏览器是否支持sticky属性的方法，可用于选择加载不同的js文件。

{%highlight javascript%}
/**
 * @description 检测当前设备是否支持某css属性（可带前缀）
 * @param {string} property 属性名
 * @param {string} value 属性值，不带前缀
 * @param {boolean} hasPrefix 是否判断带私有属性 -- 可选
 * @return {boolean} 是否支持
 */
function featureDetect(property, value, hasPrefix) {
    // thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
    var prop = property + ':';
    var ele = document.createElement('test');
    var eStyle = ele.style;

    if (!hasPrefix) {
        eStyle.cssText = prop + ['-webkit-', ''].join(value + ';' + prop) + value + ';';
    } else {
        eStyle.cssText = prop + value;
    }

    return eStyle[property].indexOf(value) !== -1;
}

// 用法
featureDetect('position', 'sticky');
{%endhighlight%}
