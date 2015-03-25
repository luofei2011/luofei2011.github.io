---
layout: post
title: "常见错误的解决办法"
description: "常见问题解答"
category: "电脑故障"
tags: 
  - 电脑故障
---
{% include JB/setup %}

开辟一共模块来记录一些软件的安装过程以及一些出错的快速处理方法

- May 24, 2013

> ubuntu-12.04.1 下安装libreoffice出现不能安装, 不能卸载软件的问题.

	#问题描述
	lake of libreoffice-common(> 1:3.5.7)

	#解决
    sudo apt-get upgrade

    /*
    正在读取软件包列表... 完成
    正在分析软件包的依赖关系树       
    正在读取状态信息... 完成       
    您也许需要运行“apt-get -f install”来修正上面的错误。
    下列软件包有未满足的依赖关系：
     libreoffice-core : 依赖: libreoffice-common (> 1:3.5.7) 但是它还没有被安装
    E: 不能满足依赖关系。不妨试一下 -f 选项。
    */

当然照上面的说敲这个命令也是不管用的.

    sudo apt-get -f install

    // 出现如下的错误
    /*
    在处理时有错误发生：
     /var/cache/apt/archives/libreoffice-common_1%3a3.5.7-0ubuntu4_all.deb
    E: Sub-process /usr/bin/dpkg returned an error code (1)
    */
<!--more--> 

究其原因, 我猜大概是我装了openoffice的原因. 因此libreoffice是unbuntu自带安装的,
以前我装了openoffice以后就把它给卸载了, 这次再装就出现了上面的错误.

**解决办法**

只有卸载掉已经安装部分的libreoffice:

    sudo dpkg --remove libreoffice-core

这样以后再执行`sudo apt-get upgrade`会出现如下的问题:

    // 反正就是一堆的依赖关系. 然后把这些依赖关系再全部用上面的方法删掉
    sudo dpkg --remove libreoffice-base-core
    sudo dpkg --remove libreoffice-draw
    sudo dpkg --remove libreoffice-emailmerge
    sudo dpkg --remove libreoffice-impress
    sudo dpkg --remove libreoffice-math
    sudo dpkg --remove libreoffice-style-human
    sudo dpkg --remove libreoffice-writer
    sudo dpkg --remove mythes-en-us
    sudo dpkg --remove python-uno

然后问题就解决了, 若想再装libreoffice需要先把openoffice卸载了再安装.

- June 02, 2013

> How to use Zend-Framework

	#问题描述
	/*
		今天碰巧接触到了这个框架，有一个现成的应用是基于这个框架的。
		但是却一直进入不了这个应用......

		localhost/constollerName/acrionName 

		正常的框架不都是这么进去的么...尝试了很多次还是不行，最后从头配了一次这个框架。
		这里几下学习过程供以后参考
	*/

	#配置过程（windows）
	#1. 启用httpd.conf下的mod_rewrite模块（我的是xampp集成环境D:/xampp/apache/conf/httpd.conf）
		去掉：LoadModule rewrite_module modules/mod_rewrite.so前的注释'#'
	#2. 在php.ini中追加路径（最好这么做）
		; Zend Framework
		include_path = ".;D:\php\PEAR\library"  
		;意思就是把Zend这个框架放到library这个目录下，在php文件可以直接include/require.
	#3. 在应用根目录下添加重定向文件.htaccess
		RewriteEngine on
		RewriteRule .* index.php

		php_flag magic_quotes_gpc off
		php_flag register_globals off
	#4. 根目录添加启动入口index.php
		<?php
			error_reporting(E_ALL | E_STRICT);
			date_default_timezone_set('Europe/London');
			
			set_include_path('.' . PATH_SEPARATOR . './library'
				. PATH_SEPARATOR . './application/models/'
				. PATH_SEPATATOR . get_include_path());
			include "Zend/Loader.php";
			Zend_Loader::loadClass('Zend_Controller_Front');
			
			// setup controller
			$index = Zend_Controller_Front::getInstance();
			$index->throwExceptions(true);
			$index->setControllerDirectory('./application/controllers');

			// run this
			$index->dispatch();
		?>
	#5. 控制器中大概格式这样
		<?php
			class IndexController extends Zend_Controller_Action {
				function init() {
					$this->initView();
					$this->view->baseUrl = $this->_request->getBaseUrl();
				}

				function indexAction() {
					$this->view-title = "test title";
					$this->render();
				}
			}
		?>
	#6. 数据库配置(Mysql)
		resources.db.adapter = "PDO_MYSQL"
		resources.db.params.host = "localhost"
		resources.db.params.username = "root"
		resources.db.params.password = "root"
		resources.db.params.dbname = "database_name"

就到这里吧，有机会用这框架的时候再深入去了解了解。
