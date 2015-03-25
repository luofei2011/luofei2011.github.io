---
layout: post
title: "自动化部署工具--bash & php"
description: "curl发送post数据，php socket编程， 自动化部署工具"
category: shell
tags:
  - bash
  - php
---

{% include JB/setup %}

#### 使用场景

在不同的机器上开发或者维护代码，往往需要在不同的机器之间切换执行不同的脚本或者代码。那么有没有一种方式，让我只在一个机器上执行一条命令。然后自动触发远程机器（另一台机器）相关脚本的执行呢？答案是可以的，方法有很多种。这里只提供我使用的方法。

#### 基本思路

1.在远程机器上跑一个php socket服务，监听某个端口。

2.在我使用的机器上添加一条命令，给远程的php socket服务发送post数据（数据中含有需要执行的代码）

#### 相关代码

1.远程服务器php socket代码

{% highlight php %}
set_time_limit(0);
ob_implicit_flush();

$host = "localhost";
$port = "8444";

$socket = socket_create(AF_INET, SOCK_STREAM, 0) or die("ERROR 1!\n");
$binding = socket_bind($socket, $host, $port) or die("ERROR 2!\n");

$listening = socket_listen($socket, 5) or die("ERROR 3!\n");

echo "Listening at: http://" . $host . ":" . $port . "\n";

date_default_timezone_set("PRC");

do {
        $spawn = socket_accept($socket) or die("ERROR 4!\n");
        while($input = socket_read($spawn, 1024)) {
                // "action=pc&dir=test"
                $param = array();
                $data = explode("\n", $input);
                $data = array_pop($data);

                $queryList = explode('&', $data);
                foreach($queryList as $q) {
                        $kv = explode('=', $q);
                        $param[$kv[0]] = $kv[1];
                }

                $shell = $param["action"] . " " . $param["dir"];
                echo "Execute: " . $shell . "\n";

                system($shell);

                # close socket connect
                # 这里一定要关闭该链接，不然请求客户端由于得不到响应（while死循环）会一直等待……
                socket_close($spawn);
                break;
        }
} while(true);

socket_close($socket);
{% endhighlight %}

开机的时候就让该脚本执行

<!--more-->

{% highlight bash %}
# 在.bashrc或者.bash_profile中添加如下代码

# 运行前需要把之前的进程kill掉
ps -ef | grep "xxx.php" | grep -v grep | awk '{print $2}' | xargs kill -9
php xxx.php &
{% endhighlight %}

2.本地机器上调用远程服务的方法

简单来说就是发送一个post或者get请求到监听的socket端口，由于我本地机器上使用的是bash脚本，所以我就直接用curl发送请求。

{% highlight bash %}
curl -d "action=xx" -d "dir=xx" <ip>:<port>
{% endhighlight %}

#### 吐槽

之前用jekyll的时候，运行`jekyll server --watch`总是报错。由于远程机器太过奇葩，`inotify`这个组件老是有问题，所以就一直没能搞定这个问题。后台改用bash写了一个文件监听的脚本。用来重启服务器。。。

我这个人比较懒，重复的事情做一遍之后我就想各种简化。。。。我的工作生活中很多时间都在写脚本，让自己变懒（虽然我是一个FE）。^_^||

附上jekyll监听文件自动编译的bash脚本

{% highlight bash %}
#! /bin/bash
path=/xxx/github/Poised-flw-blog
sha=0
update_sha() {
	  # 这个地方_site目录没必要监听。。。不然会出现死循环的情况（文件一直在改动）
      sha=`ls -lR --time-style=full-iso --ignore=_site $path | sha1sum`
}
update_sha
previous_sha=$sha

restart_jekyll() {
	# 杀掉之前的服务
    ps -ef | grep "jekyll" | grep -v grep | awk '{print $2}' | xargs kill -9
    cd $path
    jekyll server --no-watch --port 8222 &
}

restart_jekyll

build() {
    echo -en " building...\n\n"
    #$cmd
    restart_jekyll
    echo -en "\n--> resumed watching."
}

compare() {
    update_sha
    if [[ $sha != $previous_sha ]] ; then
        echo -n "change detected,"
        build
        previous_sha=$sha
    else
        echo -n .
    fi
}
trap build SIGINT
trap exit SIGQUIT

echo -e  "--> Press Ctrl+C to force build, Ctrl+\\ to exit."
echo -en "--> watching \"$path\"."

while true; do
    compare
    sleep 1
done
{% endhighlight %}

这是在网上找的一个原始脚本，在上面做的一些修改。