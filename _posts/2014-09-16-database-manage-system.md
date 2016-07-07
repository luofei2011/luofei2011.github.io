---
layout: post
title: "企业级后台管理系统"
description: "database manage system"
category: demo
tags: 
  - javascript
  - 设计模式
---


#### 应用场景

适用于企业级的后台数据管理系统，拥有比较完整的系统权限控制，所有的树形节点和操作都可以基于不同的系统角色权限进行设定

#### 系统特点

1. 基于配置：配置文件格式详见`static/js/config`目录，本系统还提供一键生成配置文件的接口。

2. 基于构件：细化系统组成部分为不同的构件：表单组件，TAB组件，树形菜单组件，表格组件(包含固定列功能，排序功能，数据校验)，弹出选择组件

3. 构件间的链接方式，通过id进行构件间的绑定和数据交互

4. 通用接口的封装：前后端的数据请求接口，弹窗接口，各种组件的初始化接口

5. 真正的跨平台(跨后端语言，只要按照本系统的协议返回数据，本系统即可运行在任何后端服务器上)

6. 所有数据交互都是基于ajax进行

7. 如果可以，你可以生成无数个表格组件(每个表格对应一个数据表)

#### 和MiniUI等UI组件的区别

1. 基于配置(JSON)，更容易进行二次开发和自定义

2. 界面友好，类似MiniUI

3. 完全免费！

#### 在线样例

你可以在这里查看线上demo：[http://mywebappdemo.sinaapp.com/graduation/](http://mywebappdemo.sinaapp.com/graduation/)

该项目的所有源码放在这里：[https://github.com/luofei2011/HitUI](https://github.com/luofei2011/HitUI)
