---
layout: post
title: "链接点击引起的mouseleave BUG"
description: "mouseleave bug when link click"
category: demo
tags: 
  - javascript
---

{% include JB/setup %}

#### 问题描述

可以在[这里查看DEMO](/demo/mouseout_click.html)

如果在一个含有超链接的容器上绑定mouseleave事件，当用户点击超链接并跳转到别的页面的时候这个mouseleave事件并不会立即执行。而是用户回到该页面并将鼠标移进document的时候才会立即触发原本没有执行的mouseleave事件。

PS：从某种交互上来说，这是一个明显的BUG。比如：我在某个节点上绑定mouseleave事件，当mouseleave事件发生的时候我才做某件事；但是上面的情况是，鼠标刚进入document，mouseleave事件就发生了，这不是我们预期的。如果你认为上面的情况不会影响到你系统的正常运行，那么接下来的HACK也就没必要再看了。

#### 解决方案一

紧耦合超链接的点击事件和容器的mouseleave事件：当超链接点击的时候在容器上添加一个属性表示在该容器内有链接触发了点击事件，那么在用户再次回到该页面的时候。mouseleave事件首先应该判断这个记录点击的属性是否存在。若存在则不触发，否则正常触发。

__需要注意几点:__

1. 超链接的点击事件应该屏蔽掉ctrl点击的情况

2. 如果超链接的target属性不是_blank那么也没必要按上面的方法处理

HACK代码如下：

	window.onload = function() {
		content.onmouseenter = function() {
			alert('mouseenter');
		};
		content.onmouseleave = function() {
			// alert('mouseleave');
			if (this.getAttribute('clicked') === 'true') {
				this.removeAttribute('clicked');
			} else {
				alert('mouseleave');
			}
		};
		link.onclick = function(e) {
			if (this.getAttribute('target').toLowerCase() === '_blank'
				&& !e.ctrlKey) {
				content.setAttribute('clicked', 'true');
			}
		}
	}

<!--more-->
#### 解决方案二

事件的移除与重新绑定：当超链接点击的时候暂时移除掉容器上绑定的mouseleave事件，当容器上再次发生mouseenter事件的时候再绑定mouseleave事件。该方法借助于目前流行的js框架，如jQuery将很容器实现。

HACK代码如下：

	$(function() {
		$('#content').on('mouseenter', function() {
			var isOn = false;
			var events = $._data(content, 'events').mouseout;
			if (events) {
				$.each(events, function() {
					if (this.namespace === 'test') {
						isOn = true;
						return false;
					}
				});
			}
			if (!isOn) $(this).on('mouseleave.test', funcForMLeave);
			alert('mouseenter');
		}).on('mouseleave.test', funcForMLeave);

		$('#link').on('click', function(e) {
			if (this.getAttribute('target').toLowerCase() === '_blank'
				&& !e.ctrlKey) {
				$('#content').off('mouseleave.test');
			}
		});

		function funcForMLeave() {
			alert('mouselave');
		}
	});

#### 最后

为啥不用mouseout呢？答案是mouseout有冒泡问题，虽然jQuery的mouseleave也是基于mouseout实现的……