---
layout: default
title: svn editor vim
---

一般的svn commit用法都是这样的

    svn ci -m 'xxx'

问题在于不能提交多行commit信息，对于想记录更多的commit信息只能放在一行中，略显不足。

#### 改进

修改.bashrc或者.bash_profile等等之类的配置文件

    export SVN_EDITOR=vim

然后生效配置文件

    source ~/.bashrc

下次再提交的时候只需要输入`svn ci`即可。系统会自动在commit的时候吊起vim编辑器，这样你就可以在里面添加多行信息了。编辑之后保存退出即可(:wq)

然后`svn update`一下就可以用`svn log`查看刚才提交的信息了。
