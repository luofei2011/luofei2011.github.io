---
layout: post
title: Ubuntu12.04又遇到的几个问题 - 环境
description: 'Hash sum mismatch, ubuntu update php5.6'
category: ubuntu
tags: ['ubuntu', 'php']
---

手里一台虚拟机，很久之前装的`php5.5`，最近一个项目想升级到5.6，或者7.0+。

#### 第一步

卸载掉之前的php版本

```
sudo apt-get purge php.* -y
```

#### 添加ppa源然后安装

```
sudo apt-get install python-software-properties

sudo add-apt-repository ppa:ondrej/php

sudo apt-get update # 这步就错了，死活Hash sum mismatch

# 下面是理想步骤
sudo apt-get -y install php5.6 php5.6-cli php5.6-common php5.6-curl php5.6-fpm php5.6-redis php5.6-mbstring php5.6-mysql
```

#### 一共出现的几个问题

* `Hash Sum Mismatch`

* `Can't Fetch ppa`

* `Call undefined function json_encode()`

* `undefined CURLOPT_RETURNTRANSFER`


#### 终极解决办法

或许上面的问题网上都能找到最详尽的通用版解决办法，比如`json_encode`这个，就是装一下`php5.6-json`然后重启fpm啥的，但我的就不生效

* 换一个靠谱的源：[阿里源](http://mirrors.aliyun.com/help/ubuntu)
* pptp链接VPN解决ppa源无法下载的问题：[Ubuntu通过PPTP协议使用VPN](http://blog.fens.me/vpn-pptp-client-ubuntu/)
* 彻底移除之前的php相关文件

```
# 除了执行上面的
sudo apt-get purge php.* -y

# 再手动把下面的路径干掉，需要删的再删。。。
sudo rm -rf /etc/apache2; rm -rf /etc/php5; rm -rf /var/lib/mysql; rm etc/mysql
```

#### 一些网址

* [How to completely remove PHP?](https://askubuntu.com/questions/59886/how-to-completely-remove-php)