---
layout: post
title: "VPS下空间释放 - 系统内核备份"
description: "vps disk release, ubuntu kernel in /lib/modules/linux-image-xxx-generic"
category: "服务器"
tags: ['vps']
---

### 遇到的问题

[vultr]({{site.refer.vultr}})上买的vps近期频繁宕机 - mysql/fpm/ss啥的无故罢工；开始还没注意磁盘空间的问题，重启服务器后，发现ss没有正常启动；遂尝试手动重启方法。还是error，分析日志发现：

```
("No usable temporary directory found in %s" % dirlist))
 33 IOError: [Errno 2] No usable temporary directory found in ['/tmp', '/var/tmp', '/usr/tmp', '/']
 ```
 
 居然是没磁盘空间了。。。
 
### 扣空间
 
 理论上说，15G的空间应该是足够的，又没有存储附件啥的。所以就在各种常用目录下捣腾，该删的删。。
 
 ```bash
 du -h . --max-depth=1
 ```
 
 用上面的方法找到100M上的都删掉，不过都是杯水车薪，才扣出来几百M
 
 最后直接去root下看。
 
 发现3个占用2G+的目录：`/var/`、`/lib/`、`/usr/`；var下一般是我网站的源码，日志啥的，可以随便删。usr下多半是装的软件，也没法下手。。。只能去lib下看看。结果`/var/moduels`下一堆内核备份文件，足足从20-73，占用空间5G+
 
### 清除备份
 
 按照网上的办法：
 
 ```bash
 dpkg --list | grep linux-image | awk '{ print $2 }' | sort -V | sed -n '/'`uname -r`'/q;p' | xargs sudo apt-get -y purge
 ```
 
 大体功能就是：列出比当前内核版本低的，删除之。
 
 结果报错`apt-get -f install`大概就是说先把已下载的更新装上再删。照着这个执行：
 
 ```bash
 apt-get -f install
 ```
 
 可想而知。。。没有空间还装个毛线
 
 没办法，只能直接去`/var/moduels`下先手动rm掉非当前version的内核备份
 
 ```bash
 cd /var/modules/
 rm -rf 3.19.0-{20..69}-generic # 表示删除20-69之间的所有文件夹
 ```
 
 然后重复上面的两个命令即可：
 
 ```bash
 apt-get -f install
 dpkg --list | grep linux-image | awk '{ print $2 }' | sort -V | sed -n '/'`uname -r`'/q;p' | xargs sudo apt-get -y purge
 ```
 
 最后空间就回来了。。。
 
