---
layout: default
title: 服务器运维日志
---

用于记录多人合作服务器下的运维日志，供以后参考。

#### 2015-09-29 数据库定时备份

添加定时备份脚本，每周五对给定的数据库进行备份，备份文件放在`$HOME/backup/sql/20150929/xxx.sql`

#### 2015-10-15 php服务全部504

突然发生的，排除我的因素。追查nginx日志发现`php5-fpm`总是timeout，尝试重启了nginx & fpm问题依然存在。

查看登录日志，发现期间有两个人登录过服务器，其中一个人没有root权限，忽略。查看有登录权限这人的操作历史（`.bash_history`），发现期间用root权限上传过东西。

由于nginx目录下的所有站点都是`www-data`权限，猜测是root权限问题。最后给fpm的日志文件`php5-fpm_error.log`修改权限级别；问题得到解决。

#### 2015-10-15 php5-fpm

近期持续收到fpm报警：`WARNING: [pool www] server reached pm.max_children setting (5), consider raising it`

猜测原因可能是由于黑哥博客推广太快，并发访问量大导致的。然后看了下`/etc/php5/fpm/pool.d/www.conf`这个文件，发现这些配置

    pm = dynamic
    pm.max_children = 5
    ; Default Value: min_spare_servers + (max_spare_servers - min_spare_servers) / 2
    pm.start_servers = 2
    pm.min_spare_servers = 1
    pm.max_spare_servers = 3

发现确实比较小了，1GB的RAM，应该可以支持max_children为10. 所以做如下改动

    pm = dynamic
    pm.max_children = 10
    ; Default Value: min_spare_servers + (max_spare_servers - min_spare_servers) / 2
    pm.start_servers = 3
    ; 2倍
    pm.min_spare_servers = 2
    ; 2倍
    pm.max_spare_servers = 6

然后重启服务，当然这并不能解决根本问题，随着访问量越来越大。。。再说吧

参考链接：[Adjusting child processes for PHP-FPM (Nginx)](http://myshell.co.uk/blog/2012/07/adjusting-child-processes-for-php-fpm-nginx/)
