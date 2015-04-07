---
layout: post
title: "基于Linode的shadowsocks实现"
description: "高速使用google，代理一切不能访问的资源"
category: "服务器"
tags: 
  - Linode
  - VPN
---

#### 服务器配置

参照官方教程，一键安装。[这里](https://github.com/shadowsocks/shadowsocks/wiki/%E5%9C%A8-Linode-%E4%B8%8A%E5%BF%AB%E9%80%9F%E6%90%AD%E5%BB%BA-Shadowsocks)

#### 本地使用

__下载一个Shadowsocks客户端__

链接：[http://pan.baidu.com/s/1mg00h2w](http://pan.baidu.com/s/1mg00h2w)

密码：e6p2

__Shadowsocks配置__

Server IP: 使用linode服务器的ip地址

Server Port: linode服务器上的端口

Password: linode服务器上配置的密码信息

SOCKS 5 Proxy Port: 本地chrome插件switchproxy等的监听端口

Encryption Method: 默认加密方法即可

Timeout in Second: 默认即可

点击“Save”客户端启动成功，接下来配置chrome插件switchproxy或者SwitchOmega(switchproxy的升级版)

#### chrome插件配置

__switchproxy__

本地代理，ip选择127.0.0.1，方式选socks v5；端口用上面客户端中的SOCKS 5 Proxy Port即可

__switchOmega__

所有网址协议的代理协议均选成`SOCKS5`, 余下的信息和switchproxy的相同。

接下来就享受高速上网把~~~


PS：出售IP和帐号，联系信息QQ: 1013651933, Email: luofeihit2010@gmail.com
