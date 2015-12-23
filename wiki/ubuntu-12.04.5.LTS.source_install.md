---
layout: default
title: ubuntu-12.04.5 LTS 部分软件源码安装记录
---

#### 第一步：核心

首先把必须的依赖一次性装好

    sudo apt-get install build-essential openssl curl libevent-dev autoconf ncurses-dev automake pkg-config

#### tmux安装

163源太旧，里面的软件版本都比较低，所以推荐源码安装

    git clone https://github.com/tmux/tmux.git
    cd tmux
    sh autogen.sh
    ./configure && make
    sudo make install

* ./configure: line 4626: `PKG_CHECK_MODULES(

这是由于pkgconfig没有安装，`sudo apt-get install pkg-config`安装即可

* configure: error: "libevent not found"

需要安装一下`libevent-dev`

* tmux插件更新
{%highlight bash%}
# 拉取插件管理软件
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
# 拉取自己备份的配置文件
git clone https://github.com/luofei2011/linux-files.git
mv linux-files/.tmux.conf ~/
tmux -2
{%endhighlight%}
按`prefix + I`会安装配置文件中的插件

#### vim7.4+安装

源码编译基本不会出错

    git clone https://github.com/vim/vim.git
    cd vim/src
    make && sudo make install

* ctags相关问题
{%highlight bash%}
sudo apt-get install ctags
cd
# 会在当前目录创建一个ctags文件，可删掉
ctags -R
{%endhighlight%}
