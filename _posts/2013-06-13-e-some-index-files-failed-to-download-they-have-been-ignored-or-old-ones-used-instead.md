---
layout: post
title: "E: Some index files failed to download. They have been ignored, or old ones used instead."
description: "ubuntu12.04运行apt-get update时出错"
category: 电脑故障
tags: 
  - 电脑故障
---
{% include JB/setup %}

## 一. 问题描述

很长一段时间, 在我ubuntu-12.04上运行`sudo apt-get update`都会出现如下的错误


    W: 无法下载 http://ppa.launchpad.net/fcitx-team/stable/ubuntu/dists/precise/main/source/Sources  404  Not Found

    W: 无法下载 http://ppa.launchpad.net/synapse-core/ppa/ubuntu/dists/precise/main/i18n/Index  软件包仓库 Release 文件 /var/lib/apt/lists/partial/ppa.launchpad.net_synapse-core_ppa_ubuntu_dists_precise_main_i18n_Index 内无哈希条目

    W: 无法下载 http://ppa.launchpad.net/fcitx-team/stable/ubuntu/dists/precise/main/binary-i386/Packages  404  Not Found

    E: Some index files failed to download. They have been ignored, or old ones used instead.

主要是最后一句话, 本来我也没想管的. 可每次都这样, 应该就是个错误. 由于用的是学校
自己的源, 网上那些所谓的换源对于我来说并不适用, 所以, 偶得一法:
<!--more--> 

## 二. 删掉错误的源

这是在ubuntu论坛上看见的, 下面是我的解决方法:

    cd /etc/apt/
    
    # 里面有很多源列表, 其中的sources.list是我们学校的源.
    # 然后在一个sources.list.d的文件夹里面是一些软件自己的源.
    # 由于我的是fcitx-team出错了, 所以我就删掉了这个源

    sudo rm fcitx-team-stable-precise.list

过程就是, 哪个源出错了, 那么就移除它, 这样问题就得以顺利解决.
