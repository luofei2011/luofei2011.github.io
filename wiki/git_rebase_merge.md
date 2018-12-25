---
layout: default
title: git rebase合并范围提交
---

假设在开发过程中，master是主干分支，只合并待上线代码。dev为日常开发代码，某天。PM要求正在开发的某些功能提前上线，而部分功能延后。恰好待上线部分代码只是dev分支中的几个离散或者连续的提交时，就可以使用该功能进行范围合并。

#### 前提

比如在dev分支上有一段连续的提交：9088de80~402f93f9, 现在需要把这段代码合并到master分支上线。

#### checkout一个临时分支

```
git checkout master
git checkout -b tmp
```

新分支tmp和master拥有相同的内容，接下来的操作都在tmp分支进行操作。

#### 强制修改master的头部指向

```
# 该操作不能在当前分支进行
# 402f93f9 为范围末尾commit
git branch -f master 402f93f9
```

该操作会让master分支包含到`402f93f9`提交前的所有commit

#### Rebase

```
git rebase --onto tmp 9088de80~1 master
```

`9088de80`是范围提交的起始位置， 该操作会将tmp分支及`9088de80 ~ 402f93f9`之间的所有提交都rebase到master分支。因为tmp分支已经包含了原来master中的所有内容。

#### 冲突解决

```
# 如果有冲突发生，手动解决冲突后执行即可
git rebase --continue

# 如果要终止操作
git rebase --abort
```

#### 参考

* [git: Merge A Range of Commits from One Branch to Another](https://www.roman10.net/2012/08/03/git-merge-a-range-of-commits-from-one-branch-to-another/)

* [用rebase合并](https://backlog.com/git-tutorial/cn/stepup/stepup2_8.html)
