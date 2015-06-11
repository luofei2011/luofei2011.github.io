---
layout: post
title: "IPAD 网页开发阶段经验总结"
description: "IPAD web develop;IPAD调试"
category: "移动端"
tags: 
  - ipad
  - 经验
---

#### 序

本文只针对IPAD网页开发进行、移动手机端的开发经验后序给出。IPAD的网页开发其实和手机大致类似了，大家的行为和事件都差不多，不过好在公司的需求只兼容IOS678即可。之前本人一直在开发PC网页，虽说大家都很讨厌ie678系列，但是ie引起的bug基本都还有前辈的足迹可以追寻。所以即使PC开发BT到兼容ie6，我也没感到有太大的阻力。并没有遇到十分棘手的问题。

唯一有点影响的就是`z-index`和IMAGE的`complete`事件，针对这两个特殊情况的研究网上有很多博文说明，本博[之前](http://www.poised-flw.com/css/2013/11/22/understand-the-z-index-in-ie6-and-ie7.html)的文章也有提到。

回归正题，当然即使只有IOS678，但是存在的各种软件也是琳琅满目。QQ、UC、Safari、Chrome、还有各种HD。其实学过数学的都知道，这些终端的存在情况已经远比PC的复杂。被IOS6虐过才知道ie6算是友好的~

继续分解，本次只讨论IOS下的某HD网页开发，当然某HD是基于webkit内核进行的。透露下，我司的IOS开发并不兼容chrome，是不是觉得很奇怪。。。so、纯的webkit内核坑还是比较多。接下来细解。

PS: 还不知道怎么调试移动端的同学，可以移步[这里](http://www.poised-flw.com/%E8%B0%83%E8%AF%95/2015/06/05/how-to-debug-on-remote-mobile-device.html)

#### 谈`webkit-sticky`属性

曾经一度认为这是一个拯救世界的属性（fixed + relative），某年前，chrome浏览器上还是支持这个属性的，时至今天貌似完全不支持了。

那么问题来了，有这么一个需求：头部不跟随页面滚动，即固定到顶部。刚开始我用的就是`position: -webkit-sticky`。但是后来发现该属性只在IOS6上有效果，IOS78完全就是`relative`了。。。有可能是纯webkit的原因吧（因为同系统版本下的QQ、Safari都是ok的）

解决办法：fixed + relative自己用js控制，在合适的时候改变position属性

#### 说`orientationchange`事件

移动设备开发比较熟悉的一个事件了，屏幕发生旋转的时候会触发，这时候可以通过`window.orientation`得到旋转的角度。发生的问题大概描述就是：在事件的回调函数中获取window的尺寸或者orientation并不是最新的，其实这个究其根本不能算bug，这是IOS的一个机制，你可以理解为延迟响应。

不过这个问题只会发生在IOS8上，67不存在这个问题。发生的原因很简单，所以解决办法也很简单。在回调函数中加一个setTimeout去延迟回调的执行。至于延迟事件100ms左右应该就ok

{%highlight javascript%}
window.addEventListener('orientationchange', function () {
    setTimeout(function () {
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        // do something.
    }, 100);
});
{%endhighlight%}

#### 解`touch`事件

细谈之前不得不提IOS的经典问题：页面滚动过程中不会触发repaint!!! 连js的执行也会被阻塞（阻塞并不代表遗弃，即会把结果压入一个等待队列，当滚动结束后立即执行）。类似下面这种效果：
<p style="text-align:center"><img src="http://7xjmqm.com1.z0.glb.clouddn.com/static/images/lightbar.jpg" alt=""></p>

拖动中间小圆点的时候改变亮度的同时改变圆点的位置以及激活的长度。

从开发PC的经验来说，这真的算不上一个需求，分分钟就能搞定。当然自认为移动端也是分分钟的事儿。讲下流程：

首先、需要获取拖动按钮、总进度条、激活进度条的DOM

然后、绑定事件，给拖动按钮绑定touchstart、touchmove、touchend事件

最后就是事件处理了。具体的业务逻辑后面讲。 接下来代码实现

{%highlight html%}
<div class="setting-main">
    <i class="icon-light-low"></i>
    <div class="setting-bar">
        <div class="bar-active"></div>
        <div class="bar-btn"></div>
    </div>
    <i class="icon-light-high"></i>
</div>
{%endhighlight%}

css代码就不提供了，这里只分析问题。

{%highlight javascript%}
// 事件处理
// 用了zepto
var $btn = $('.bar-btn');
var $active = $('.bar-active');
var $bar = $('.setting-bar');
var isTouch = false;

$btn.on('touchstart', function () {
    isTouch = true;
});

$(document).on('touchmove', function () {
    if (isTouch) {
        // do something.
    }
});

$btn.on('touchend', function () {
    isTouch = false;
});
{%endhighlight%}

上面的js逻辑再经典不过了，move事件绑定到document上范围更大。体验更好。如果位置的计算逻辑不出错，一切ok，那么绝壁有如下的问题：

1、按住按钮拖动的时候你特么发现页面在滚动。（页面滚动意味着什么？前面有提到）

2、如果拖动的手速过快，你会发现按钮在来回跳（自行脑补、不上图了）

3、当然流畅性就不忍直视了。

对应上面的问题，一一解决。

__页面滚动__

前面提到过，在IOS上页面的滚动会阻止页面的repaint和js的阻塞。不知道repaint是什么的可以看[这里](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)
你可以这样去理解。当你开始拖动页面的时候，GPU把当前的页面生成了一个快照（一张图片）然后在滚动过程中只是去滚动这张静态图。。。当然从效率，节能上来考虑这个优化很高！从一方面体现出比Android省电？

当然知道了原因，肯定就有解决办法。那就是在touchmove的时候阻止默认行为（默认行为就是滚屏）

{%highlight javascript%}
$(document).on('touchmove', function (e) {
    if (isTouch) {
        e.preventDefault();

        // do something.
    }
});
{%endhighlight%}

__按钮来回跳__

其实这种问题的第一反应就是机器性能差，本来都准备不管了，本着精益求精的精神，去认真的探索了一番。怎么探索呢？我在日志中打印了每次touchmove的间隔（即两次拖动的间隔）发现一个十分奇妙、十分有趣的事情。

{%highlight html%}
diff: 4
diff: 8
diff: 5
diff: 7
diff: 3
diff: 4
diff: 30
diff: 28
diff: 14
diff: 5
diff: 4
diff: 2
diff: 1
{%endhighlight%}

而且每次发生跳动的时候数据都会出现如上的波动，并且。波动的点一定是发生跳动的点。你可以把这些数据脑补到折线图上。不过在看到数据的一瞬间，我大概猜出了原因是什么。。

可以理解为人眼的视觉差，从机器的角度来说。如果向右拖动按钮，按钮确实是在向右前进，无外乎是每次前进的距离不一样。但是反映到我们的眼中可不是这样。由于人眼视觉的停留，如果一次移动距离不均匀，比如过长、而且时间间隔很短就会发生来回跳的“假象”。我觉得这是一件很有意思的事情。。。

那么接下来我就去消除这种“误差”，第一步用了setTimeout去控制touchmove发生的频率，手动延缓两次移动的时间间隔。

> 在这之前闲扯一下：机器屏幕的刷新频率一般是60HZ左右？即60fps。即每16.67ms会刷新一下屏幕，当然人眼也有同样的处理方式。频率也60HZ左右？（不是精确的数，有兴趣的可以去查资料）即人眼中看到的事物会每隔16.67ms刷新一次，如果外物更新过快。由于人眼的视觉停留就会产生误差。引起一些视觉上的BUG。

接上面的分析，用setTimeout去延长每次移动的时间间隔。

{%highlight javascript%}
document.addEventListener('touchmove', function (e) {
    if (isTouch) {
        e.preventDefault();
        setTimeout(function () {
            // do something.
        }, 100);
    }
});
{%endhighlight%}

我首先延迟了100ms，测试发现拖动很迟钝，用户体验比较烂。所以提高到几十毫秒。直至16ms，发现效果还是不流畅，总有卡顿的情况出现。

更换`requestAnimationFrame`进行实验。

{%highlight javascript%}
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

document.addEventListener('touchmove', function (e) {
    if (isTouch) {
        e.preventDefault();
        window.requestAnimationFrame(function () {
            // do something.
        });
    }
});
{%endhighlight%}

再测试、发现效果很赞！非常流畅，不管拖动多快也不会发生来回跳的情况。至此该问题算是得到完美解决。

#### 弃`scroll`绑定

这是一个相当耗性能的事件，PC上亦如此。触发的频率太高。如果在回调中改变某些结点的大小或者属性，会不断的触发reflow和repaint。性能不敢想像。 如果非要用，建议用这种方式（方法源于网络）

{%highlight javascript%}
var isScroll = false;
window.addEventListener('scroll', function () {
    isScroll = true;
});

setInterval(function () {
    if (isScroll) {
        isScroll = false;

        // do something.
    }
}, 100);
{%endhighlight%}

#### 其它

什么3D GPU加速、分层、减少reflow repaint区域这些大家都知道的我就不一一介绍了。网上一搜一大堆，下面的参考资料中也能找到他们的身影。

#### 参考资料

1. [Javascript高性能动画与页面渲染](http://www.codeceo.com/article/javascript-high-performance-2.html)

2. 尤其推荐！！！[Rendering: repaint, reflow/relayout, restyle](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)

3. [How (not) to trigger a layout in WebKit](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)

4. [Performance profiling with the Timeline](https://developer.chrome.com/devtools/docs/timeline)

5. [Understanding & measuring events with Chrome DevTools timeline](https://web-design-weekly.com/2014/09/18/understanding-measuring-events-with-chrome-devtools/)

6. [使用Chrome DevTools的Timeline和Profiles提高Web应用程序的性能](http://www.oschina.net/translate/performance-optimisation-with-timeline-profiles)
