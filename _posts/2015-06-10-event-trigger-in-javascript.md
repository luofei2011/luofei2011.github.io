---
layout: post
title: "事件触发"
description: "事件触发;CustomEvent;dispatchEvent;fireEvent"
category: "javascript"
tags: 
  - api
---

#### 使用场景

主要目的在于不借助第三方库（如：jquery和zepto）实现自定义事件的触发或者普通事件模拟操作。

__jq的触发方式__

{%highlight javascript%}
$('xxx').trigger('eventName.nickname', data);
{%endhighlight%}

#### W3C标准浏览器实现方法

IE9+和chrome、firefox都可以直接用`Event`构造函数创建一个事件处理对象。

__最基本的用法__

{%highlight javascript%}
var event = new Event('eventName'); // 创建一个名为'eventName'的事件对象
{%endhighlight%}

__高级用法__

上面方法创建的事件对象基本只能保证事件能正常触发，并能不能保证事件冒泡特性的延续性（即压根就不会冒泡），所以：可以在新建事件对象的时候传递一些默认值

{%highlight javascript%}
var event = new Event('eventName', {
        bubbles: true, // true代表事件可以被冒泡
        cancelable: true // true代表事件可以被stopPropagation方法阻止冒泡
    });
{%endhighlight%}

__综合用法__

<iframe width="100%" height="300" src="//jsfiddle.net/Poised_flw/o6L3y5rc/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

__注意事项__

1. 并不能在事件处理函数中通过`return false`来阻止冒泡，需要自己实现

2. W3C浏览器结合`dispatchEvent`方法即可实现自定义事件的触发 & 模拟需求

3. `CustomEvent`构造函数效果和使用`Event`一样。

4. `Event`构造函数相当于基类，不在基础别的属性或方法。当然除了Object

#### 低版本的ie浏览器兼容

IE较特殊的一个非标准方法`createEventObject`，该方法存在于`document`下。类似于标准浏览器中的`document.createEvent`。

__综合用法__

{%highlight html%}
<div id="test">click me!</div>
<script>
var oTest = document.getElementById('test');

oTest.attachEvent('onclick', function () {
    alert('click');
});

// trigger click
var eventObj = document.createEventObject();
event.cancelBubble = true;
event.data = 'trigger from simulate';

oTest.fireEvent('onclick', eventObj);
</script>
{%endhighlight%}

#### 参考资料

1. [MDN Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)

2. [MDN MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)

3. [MDN CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)

4. [JavaScript CustomEvent](http://davidwalsh.name/customevent)

5. [MSDN createEventObject method](https://msdn.microsoft.com/en-us/library/ms536390%28v=vs.85%29.aspx)
