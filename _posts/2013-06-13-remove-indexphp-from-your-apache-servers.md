---
layout: post
title: "去掉apache中的index.php"
description: "利用.htaccess去掉apache中的index.php"
category: 电脑故障
tags: 
  - 电脑故障
---
{% include JB/setup %}

## 一. 问题描述

##### 1. 配置环境

> ubuntu-12.04, LAMPP, apache2.

##### 2. 遇到问题

无论怎么修改.htaccess无法去掉控制器中的index.php.

## 二. 解决办法

由于使用的是LAMPP集成环境, 并没有网上说的那些配置文件, 估计是有, 但名字什么的肯
定不一样.

##### 1. 修改地方

    # 我的居然在这个目录下进行修改, 并不是一般的apache/httpd.conf
    cd /etc/apache2/sites-available/

    # 就是这个default文件, 找得我好辛苦!
    sudo vim default

    # 找到如下部分
	<Directory /var/www/>
		Options Indexes FollowSymLinks MultiViews
        AllowOverride None # 这里默认是None
		Order allow,deny
		allow from all
	</Directory>

    # 然后把上面的AllowOverride None修改成All就OK
    AllowOverride All

    # 重启服务器
    sudo /etc/init.d/apache2 restart
<!--more--> 

至此服务器的修改算是完事, 哦! 对了, 记得你的配置文件中是把mod_rewrite.so开启的

    # 找到你的models目录, 这里面有各种.so文件, 下面是我的路径
    cd /etc/apache2/mods-available/

    # 然后是这个文件中, 应该都是开启的, 若没有开启则去掉前面的#号
    sudo vim rewrite.load

    # 最后应该是这样的
    LoadModule rewrite_module /usr/lib/apache2/modules/mod_rewrite.so

##### 2. .htaccess配置

按照上面的步骤做下来, 一般的.htaccess配置都是适用的. 我贴上自己的配置信息

    <IfModule mod_rewrite.c>
        RewriteEngine on
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ /your_app_path/index.php/$1 [QSA,PT,L]
    </IfModule>

注意上面的`your_app_path`一行, 若项目直接在`/var/www/`根目录下.则改成:

        RewriteRule ^(.*)$ /index.php/$1 [QSA,PT,L]

若非根目录, 如:`/var/www/your-app`, 则按我的配置文件写, 路径换成自己的项目地址即
可. 然后把.htaccess文件放在项目的根目录----与index.php同一级的目录.
