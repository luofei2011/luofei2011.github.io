---
layout: post
title: "彻底搞懂浏览器端的缓存"
description: "understand cache in browser totally"
category: "性能优化"
tags: 
  - 性能优化
---

#### 什么是浏览器端的缓存

__服务端缓存__

首先你得明白服务器端的缓存，基本分为基于内存的cache和基于硬盘的cache。基于内存的cache实现方式很多，如memcache；基于硬盘的cache如smarty模板引擎中通过`caching=true`开启的缓存。当然最明显的区别在于二者的读取速度不同、当然可用空间也有区别（内存的空间明显没有硬盘多！）

__客户端缓存__

再说浏览器端的缓存，说白了浏览器的缓存就是在使用者电脑上的缓存；也可以分为内存和硬盘的缓存，当然不同的浏览器有不同的缓存方式。IE有专门的临时文件夹目录，默认为：`C:\Users\<username>\AppData\Local\Microsoft\Windows\INetCache`；Firefox可以在地址栏输入：`about:cache`查看；Chrome同样的方式在地址栏输入：`chrome://cache`查看。

<p class="full-img">
    <img src="{{ASSET_PATH}}/img/2015010403.png" alt="IE cache">
</p>

#### 一次浏览器资源请求所经历的过程

__地址栏直达__

这里只谈论资源的获取途径，而且不讨论客户端和服务器之间经过的路由器和交换机等因素。当你在地址栏输入url并敲击回车之后。浏览器首先会在自己的缓存目录查找说请求的文件，如果存在且过期时间小于当前时间；则直接从客户端cache中返回内容，这时候通过Chrome的Developer Tools工具的Network项可以看到有`from cache`的关键字。

<!--more-->

注意：上面的条件是通过在地址栏输入url并回车的方式。下面讨论通过F5或者是点击浏览器的刷新按钮实现的页面资源请求。

__F5刷新__

如上面的过程，但是这种方式下浏览器不会首先去客户端的缓存中取数据，而是先到服务器进行校验；校验的方式有很多种(`If-Modified-Since`、`If-None-Match`等)，如果文件在客户端的缓存未过期，则响应状态为304的header信息，然后浏览器再去本地缓存中取数据。该过程服务器并不会向客户端发送资源数据！

<p class="full-img">
    <a href="{{ASSET_PATH}}/img/2015010401.png" target="_blank"><img src="{{ASSET_PATH}}/img/2015010401.png" alt="from cache"></a>
</p>

__Ctrl+F5强制刷新__

该模式下，所有的客户端缓存均失效；即资源请求不会再使用客户端缓存里的内容，而是全部到服务器端拿取。所有的缓存策略均失效！

#### 缓存对应的`Header`信息

> 注意，以下策略在强制刷新模式下均无效！

通过Developer Tools工具抓取了一张通过F5刷新得到的网络请求信息表。接下来将详细介绍每个header的含义即用法。

<p class="full-img"><img src="{{ASSET_PATH}}/img/2015010402.png" alt=""></p>

__Last-Modified__

字面意思：最后修改时间，这是服务器给浏览器的响应Header信息，即服务器告知该文件的最后修改时间

__If-Modified-Since__

该字段为浏览器向服务器请求资源时的请求Header信息，和上面的`Last-Modified`对应出现，即：该资源在这个最后修改时间的基础上是否又进行了修改。如果修改则返回修改后的内容（并重新响应新的Last-Modified信息），若没有修改则返回304，告知浏览器该资源并没有更新，浏览器可以放心的使用本地缓存内的内容。

注意：通过修改时间来检测一个文件是否变动并不准确，很多时候复制，移动一个文件也会导致修改时间的改变

>以下Header在HTTP/1.1中得到支持

__ETag__

由于最后修改时间存在的问题，这里采用ETag在标记资源的内容，原则即是：内容的ETag没有发生变化，则资源也一定没有发生变化！ETag的计算方式不同服务器有所不同，姑且理解为内容的MD5码吧。如上图中的：`ETag:"445d-50af2cb604280"`。

__If-None-Match__

该字段为浏览器向服务器请求资源时的请求Header信息，和上面的`ETag`一起使用，值即为服务器给浏览器响应Header中的ETag的值，同理：服务器使用该标记对比资源内容是否发生变化，若变化则返回最新内容；否则返回304告知浏览器缓存未过期。

> 上面的策略或多或少都需要客户端与服务器进行一次交流，下面这种方式才是真正的实现了直接从缓存中拿内容而不用经过服务器确认

__Expires__

这是服务器给浏览器的响应Header信息，代表该资源的过期时间。

    # 如
    Expires:Sat, 21 Dec 2024 09:24:33 GMT

即只要没有超过这个时间，浏览器就直接从缓存中读取该资源而不需要和服务器进行校验。如前面提到的`from cache`。但是！！！这种好事儿只会发生在通过地址栏回车进入页面的方式，在F5刷新或者强制刷新下均无效！

附上Apache下开启Expires的配置方法

    # 使用access plus的方式设置日期
    <IfModule mod_expires.c>
        ExpiresActive on
        ExpiresByType image/gif "access plus 1 month"
        ExpiresByType text/javascript "now plus 1 month"
        ExpiresByType text/css "now plus 2 day"
        ExpiresDefault "now plus 1 day"
    </IfModule>

> 注意以上跟时间相关的参数都含有GMT，即代表格林威治的标准时间。但是在我朝，时区为GMT+8.如果浏览器使用的是非标准时间，由于时差原因，很多短时间的缓存就会失效。

如：服务器设定资源A的过期时间为2个小时后失效，但是客户端的时区刚好比GMT快两个小时，则这个资源达到客户端的时候就已经失效了，失去了缓存的意义！WTF！！

幸好，HTTP/1.1中还有一个标记，用于弥补Expires在时区不同步方面的缺陷。

__Cache-Control__

格式如下：

    Cache-Control: max-age=<second>

这个时间是相对时间，相对的是浏览器的本地时间。即不管你在什么时区，用什么样的时间。我的资源都会在你的本地缓存多少秒。

> PS: 这个标记在服务器开启Expires支持的时候会自动加上该标记，不需要单独开启。

__优先级__

当HTTP响应头中同时含有Expires和Cache-Control时，浏览器会优先考虑Cache-Control，当然不存在Cache-Control的时候浏览器会直接使用Expires。

#### 参考资料

* 《构件高性能WEB站点》
* 《图解HTTP》
* www.baidu.com
