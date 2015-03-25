---
layout: post
title: "领悟z-index的渲染机制"
description: "z-index bug under the ie6 ie7"
category: css
tags: 
  - css
  - hack
---

{% include JB/setup %}

## z-index基础

> 设置元素的堆叠顺序， 拥有__更高堆叠顺序__的元素总是会处于堆叠顺序较低元素的前面。

#### 用法

1. 元素可以拥有负的z-index属性值；
2. z-index仅能在定位元素(`absolute`、`relative`、`fixed`)上有效.

[^position]: **定位元素：**`position`为`absolute`、`relative`、`fixed`的元素。

#### 示例

```
div {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
}
```

## 进阶用法
<!--more-->
> 利用基础中堆叠的思想，可以做到网页中不同层次的块堆叠在一个平面中从而展现一种三维立体的感觉

#### 看一个示例

##### html部分

	<div class="z-1">
		<div class="z-10">
			<div class="z-15">z-index: 15</div>
			<div class="z-12">z-index: 12</div>
		</div>
	</div>
	<div class="z-5">z-index: 5</div>

##### css部分

	div {
		text-align: center;
	}
	.z-12, .z-15 {
		width: 100px;
		height: 100px;
		line-height: 100px;
	}
	.z-10 {
		position: relative;
		width: 500px;
		height: 300px;
		background: #000;
		margin: 0 auto;
		z-index: 100;
	}
	.z-12 {
		position: absolute;
		z-index: 12;
		background: #f00;
		left: -50px;
	}
	.z-15 {
		position: absolute;
		z-index: 1;
		background: #fff;
		left: -20px;
		top: 20px;
	}
	.z-5 {
		position: absolute;
		width: 1000px;
		height: 100px;
		line-height: 100px;
		top: 50px;
		background: #00F;
		z-index: 5;
	}
	.z-1 {
		/*position: relative;*/
		/*z-index: 6;*/
	}

#### 正常浏览器(`chrome`、`firefox`、`ie 8+`)的效果图

![zIndex_01.png]({{ ASSET_PATH }}/img/20131122_01.png)

#### 抽风的`ie6 & ie7`

![抽风的ie6&ie7]({{ ASSET_PATH }}/img/20131122_02.png)

[^w3c]: **正常浏览器：** 指`chrome`、`firefox`、`ie 8+`等。

#### 问题

>各div的层叠并不像前面定义中说的那样按照堆叠顺序进行渲染、即不是按照z-index的大小进行渲染的

## 如何解决

#### 首先得明白一个常识

`z-index`是一个相对属性、即处在同一父级（设置了`z-index`的元素）下的元素`z-index`是可以进行比较的；处在不同父级下的元素如果要进行比较，这种情况只会在元素父级（离目标元素最远的设置了z-index属性的元素）之间进行比较，和参与比较的本身元素之前没有瓜葛！

    div1 #z-index: 1
        div2 #z-index: 2
            div3 #z-index: 3
    div4 #z-index: 4
    
如上的DOM结构

1. 若只有div3、div4设置了z-index属性，则这二者之前的z-index可以进行直接比较（即决定相互之前的堆叠顺序）
2. 若div2在1的基础上也设置了z-index属性，则此时div3和div4的z-index比较就没有任何意义！因为div2和div4之间已经决定了二者之前的堆叠顺序！
3. 同理能推导出另外的几种情况，即可证明z-index是一个相对属性。

#### 然后再来说说ie下的bug

进一步深究上面常识，[CSS specification](http://www.w3.org/TR/CSS21/visuren.html#z-index)中提到，除了根元素外，只有定位元素的z-index被定义一个非auto的数值才能产生新的`stacking context`.

所以：如果两个元素之间需要进行z-index的比较可以理解为、一个元素和另一个元素所处的`stacking context`栈底（想象成每个设置了z-index的定位元素都是依次入栈的）元素进行比较！

最后：ie下的bug实质是.

>定位元素在ie6、ie7下，即使没有设置z-index除auto外的值，也会产生`stacking context`（用我们的理解就是：它入栈了！）；但没有设置z-index却入栈了，那它的z-index值会是多少呢？这里可以理解为-0，注意前面的‘-’号；即只要有一个元素设置了z-index值，则堆叠的时候必定在未设置元素的上面！

## 总结

综合上面的分析，理解好了`stacking context`就能在ie6、ie7下游刃有余；即：定位元素一定不要忘记添加一个z-index的hack！