---
layout: post
title: "配置没有root权限的linux开发机"
description: "linux vim"
category: linux
tags: 
  - linux
  - vim
  - tmux
---

在没有root权限的机器上安装软件时；只能使用源码安装的方式。并且一定要指定安装的目录，且保证当前用户对该路径具有读写权限。

#### 首先安装`tmux`

1. 下载源代码；

2. 解压缩 & 安装

    ./configure --prefix=/home/users/XX/local  #一定是绝对路径
    
#### 把自己的vim配置文件导入

主要是需要在终端配置文件(`.bashrc`,`.bash_profile`,`.zshrc`)中添加PATH值和TERM值

    export PATH=$PATH:$HOME/local/bin #该目录为用户自己安装的软件存放地址
    # 但设置以上的路径后，自己安装的软件命令也能在全局使用了
    
    TERM='xterm-256color' # 支持256色；同时vim配置文件中添加如下内容
    
    # .vimrc
    set term=xterm-256color
    set t_Co=256
    set background=dark
    colorscheme solarized

#### 最重要的一步，colorful

即使设置了256色，但是在securecrt中还是黑白体……因此，需要对securecrt进行设置：Session Options -> Terminal -> Emulation；选择xterm，并且选中ANSI Color以及Use color scheme

#### 安装zsh

自己google

#### 安装oh-my-zsh

自己google

PS：安装那个字体软件非常蛋疼，一堆东西就是安装不成功。。。反正安装一切东西都需要使用源码安装。

#### 一切快捷操作

1. 折腾了半天不能安装gvim，导致系统粘贴板在vim中不能使用：`Shift + Ins`粘贴
