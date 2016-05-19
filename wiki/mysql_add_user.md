---
layout: default
title: Mysql多用户 &　权限控制
---

#### 添加mysql用户 (5.6下测试有效)

*　首先登录root账户

```bash
mysql -u root -p
#　输入密码
```

* 添加账户

```mysql
# 添加一个名叫`testUser`的账户，并且设定密码为：`123456`
insert into mysql.user(Host,User,Password) values("localhost","testUser",password("123456"));
# 刷新权限表
flush privileges;
```

* 登录新账户验证

```bash
mysql -u testUser -p
# 输入密码123456
```

#### 权限控制

* 用root账户创建数据库

```mysql
create database testDB;
```

* 把`testDB`授权给`testUser`用户

```mysql
# 这里是授权所有权限all(select/update/delete...),　可单独授予：`select,update`
grant all privileges on testDB.* to testUser@localhost identified by '123456';
# 刷新权限表
flush privileges;
```

#### 删除用户

* 先登录root账户

```mysql
DELETE FROM user WHERE User="testUser" and Host="localhost";
flush privileges;
# 顺便删掉数据库
drop database testDB;
```

#### 修改密码

```mysql
# 登录root账户
update mysql.user set password=password('新密码') where User="testUser" and Host="localhost";
flush privileges;
```

#### 5.7下添加用户

* 第一步

```mysql
GRANT USAGE ON *.* TO 'tmpusr'@'localhost' IDENTIFIED BY 'newpassword' WITH GRANT OPTION;
#tmpusr 用户名
#newpassword 密码
```

* 第二步

```mysql
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP ON databaseName.*  TO 'tmpusr'@'localhost' IDENTIFIED BY 'newpassword';
```

* 第三步

```mysql
FLUSH PRIVILEGES;
```
