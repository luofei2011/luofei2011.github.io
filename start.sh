#!/bin/bash

cd /var/www/luofei2011.github.io

pid=`ps -aux | grep "jekyll" | grep -v grep | awk '{print $2}'`

if [ $pid ]
then
    kill -9 $pid
fi

git pull

jekyll serve --watch
