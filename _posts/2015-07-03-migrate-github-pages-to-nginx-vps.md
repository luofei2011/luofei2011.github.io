---
layout: post
title: "迁移博客到nginx"
description: "github gh-pages;nginx"
category: "服务器"
tags: 
  - gh-pages
  - nginx
  - 服务器
---

很长一段时间，发现再怎么频繁的分享文章，百度spider就是不来我的网站。。。去百度统计后台查看日志发现spider确实去爬了。但都是403.  应该是github碍于流量压力禁止spider了？

正好自己手头有好多空闲服务器，干脆就直接迁到自己的服务器，解决spider抓取的同时也间接让我的博客变成非静态博客。。。下面记录一下迁移步骤。

#### 环境准备

我的服务器都是在[vultr](http://www.vultr.com/?ref=6835929)运营商上，系统和版本：ubuntu15.04 X64

+ 基础编译环境

{%highlight bash%}
apt-get install gcc g++ build-essential make git
{%endhighlight%}

+ 安装nodejs

{%highlight bash%}
# 方式一
apt-get install nodejs
cd /usr/bin
mv nodejs node

# 方式二
wget http://nodejs.org/dist/v0.12.5/node-v0.12.5.tar.gz
tar -zxvf node-v0.12.5.tar.gz
cd node-v0.12.5

./configure --prefix=/usr
make && make install
{%endhighlight%}

+ 安装ruby相关

{%highlight bash%}
apt-get install ruby ruby-dev
gem install jekyll
gem install rdiscount
{%endhighlight%}

#### 开始搭建博客

+ 从git上克隆代码

{%highlight bash%}
cd /var/www/
git clone https://github.com/luofei2011/luofei2011.github.io.git
{%endhighlight%}

+ 配置自动pull

{%highlight bash%}
crontab -e

# 选择一个你自己熟悉的编辑器，加入以下命令. 2分抓一次
*/2 * * * * cd /var/www/luofei2011.github.io/; git pull >> /dev/null 2>&1;
{%endhighlight%}

+ 启动jekyll

由于我的服务器80端口已经被nginx占用，所以只能配置端口转发
{%highlight bash%}
cd /var/www/luofei2011.github.io/
jekyll serve --port 8888 --host 127.0.0.1 --detach
{%endhighlight%}

#### nginx配置端口转发

{%highlight bash%}
location / { 
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded $proxy_add_x_forwarded_for;
    proxy_pass http://127.0.0.1:8888;
}   
{%endhighlight%}

#### 后记

配置好nginx转发后重启服务，然后去对应的域名运营商把域名解析到自己的服务器即可。

当然，服务器都是自己的了，你就可以往死了优化自己的博客。
