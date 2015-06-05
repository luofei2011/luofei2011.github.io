---
layout: post
title: "怎样在PC上调试移动端页面"
description: "移动端；页面调试；weinre；jsconsole"
category: "调试"
tags: 
  - 调试
---

#### 前言

移动端调试，可能从有移动端开发以来就存在的问题。移动端开发不像PC，PC上的方案很成熟，无论是新版IE的调试器，chrome的开发者工具，老牌的Firebug。都可以解决我们在开发中碰到的绝大部分问题。移动端则不然，想象一下在手机浏览器上通过`F12`调出一个调试窗口，然后用手指去展开结点的那种酸爽。当然最理想的情况是给移动设备接一个鼠标（据我所知这个成本貌似比较大）

综上，移动端开发的调试也可以算一项前端开发的挑战吧。今天就来大概的扒一扒各种方法的优劣。

#### 配对调试

姑且这么称呼吧，顾名思义：PC上装一个chrome，并且移动设备上也装chrome，通过USB或者wifi连接。这样就能达到PC上调试移动端页面的目的。

当然，之前的UC开发者版本也能达到这样的功能，由于是一对一的绑定，所以并不适合移动端各种设备的适配。除非你开发的产品不考虑兼容性，那这种方法是可以采纳的。

#### 基于Safari +　MAC的调试方法

这个是逼格最高的方法，首先你要有个MAC，没有就继续看下面的吧。

这个方法涵盖比较全面，基本能满足调试IPAD、IPhone页面的需求。而且官方文档也介绍得比较详细：[https://itunes.apple.com/us/app/mihtool/id584739126?ls=1&mt=8](https://itunes.apple.com/us/app/mihtool/id584739126?ls=1&mt=8)

我工作中用的就是这种方法，因为主要做的就是IPAD页面，所以也不用关注Android阵营的pad和手机端。

#### Telerk AppBuilder工具

[这里](https://platform.telerik.com)是官网，在谷歌中搜索移动端调试的时候碰见了一篇介绍这个工具用于调试IPAD的方法。[这是](http://blog.falafel.com/ios-web-inspector-on-windows-with-telerik-appbuilder/)教程。

不过这东西是收费，先给你免费用几个月（一贯的尿性，免费的用惯了。。。），这个是windows的客户端，装上之后用ＵＳＢ线连接IPAD和电脑，软件能自动识别PAD，然后就可以在上面调试。官方的[wiki](http://docs.telerik.com/platform/appbuilder/)很全！

#### weinre工具

目前大部分的移动端调试都是基于这个工具吧？　安装也比较简单。

`weinre`是一个`npm`的包，因此安装之前需要确保你的本地或者服务器安装了`node`环境。
{%highlight bash%}
npm i -g weinre
{%endhighlight%}

使用说明

{%highlight bash%}
usage:   weinre [options]
version: 2.0.0-pre-I0Z7U9OV

options:
    --httpPort     port to run the http server on        default: 8080
    --boundHost    ip address to bind the server to      default: localhost
    --verbose      print more diagnostics                default: false
    --debug        print even more diagnostics           default: false
    --readTimeout  seconds to wait for a client message  default: 5
    --deathTimeout seconds to wait to kill client        default: 3*readTimeout

--boundHost can be an ip address, hostname, or -all-, where -all-
means binding to all ip address on the current machine

for more info see: http://people.apache.org/~pmuellr/weinre/
{%endhighlight%}

使用方法

{%highlight bash%}
weinre --boundHost 0.0.0.0 --httpPort 8000

#　或者
weinre --httpPort 8000 -all-
{%endhighlight%}

启动服务以后，访问浏览器。地址就是你上面绑定的ip或者域名加上端口。比如：http://localhost:8000

到这里服务端基本就部署完毕了，接下来是客户端的js的脚本注入和PC上的调试。

脚本注入就是向你需要调试的页面中加入一个script标签。

{%highlight html%}
<script src="http://x.x.x.x:8000/target/target-script.min.js#hash"></script>
{%endhighlight%}

然后PC访问：[http://x.x.x.x:8000/client/#hash](http://x.x.x.x:8000/client/#hash)

注意上面两个链接中的hash值，一定要确保两个值是配对的，因为很多情况下，一个weinre服务会提供给很多人使用，使用不同的hash值是为了避免冲突。

参考资料：[http://www.cnblogs.com/lhb25/p/debug-mobile-site-and-app-with-weinre.html](http://www.cnblogs.com/lhb25/p/debug-mobile-site-and-app-with-weinre.html)

#### jsconsole工具

你可以直接在他们的[官网](http://jsconsole.com)尝试效果，他们的代码都托管到[github](https://github.com/remy/jsconsole)上。

使用方法也非常简单，打开官网。在输入栏中输入

{%highlight bash%}
# 这个id是可选的，目的和weinre中的hash作用一样。如果不选则随机生成
:listen id
{%endhighlight%}

然后把输出信息中的script标签放到你需要调试的页面中。用移动设备访问你的测试页面，回到jsconsole。在输入框中输入

{%highlight javascript%}
document.title
{%endhighlight%}

神奇的一幕发生了，这里拿到了你测试页面的title信息，而且你尝试在jsconsole页面修改测试页面的dom，你也会发现是即时生效的。这个东西对于js的调试特别有用！

当然，同weinre一样，如果你不想在jsconsole官网使用这个功能，你可以克隆他们的代码在自己的服务器上搭建一套环境

{%highlight bash%}
git clone https://github.com/remy/jsconsole.git
cd jsconsole
npm i
node server.js 8000
{%endhighlight%}

然后访问：http://x.x.x.x:8000效果和jsconsole一模一样。

#### 总结

大体来说，移动端的调试分样式、网络、js等方面的调试。以上的工具或者方法中. weinre是比较全面的，基本能达到跟PC调试一样的效果。但是jsconsole对于一些js方面的调试更便捷（主要是jsconsole的代码已经有好几年没有更新了。。。）

#### 补充

如果你闲搭建weinre的过程比较麻烦，我在我服务器上搭建了一个免费的weinre调试环境：[http://free.vim.ren:8888](http://free.vim.ren:8888)

当然，jsconsole的环境也有：[http://free.vim.ren:9999](http://free.vim.ren:9999) 

PS: 以上两个环境，由于有很多人要用，因此在初始化的时候一定要使用不同的hast值（越复杂越好）
