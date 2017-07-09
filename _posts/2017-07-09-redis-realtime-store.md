---
layout: post
title:  "【钉钉】用Redis替换文件存储方式存储时效性数据"
description: "redis, redis key, dingtalk"
category: "钉钉"
tags: ['钉钉']
---

> 基于钉钉提供的`openapi-demo-php` 进行二次开发

#### 需求

原有的文件存储方式不利于管理，主要是接入的企业、企业应用、ISV等变多的时候。

#### 设计实现

利用Redis `SETEX`的特性，能很容易的实现token自动过期重取机制。即：设计好token缓存的维度（企业、ISV），在获取token的入口统一逻辑（redis数据未过期则直接使用，过期后重新从钉钉开放平台获取然后缓存），能有效避免资源浪费（对于需要自己设计定期更新token这种机制来说）。

#### 背景介绍[选读]

由于这部分和具体的业务挂钩，因此不理解也无所谓。。。

* 一些原则

1. 一个企业可以有多个自建微应用，但最多只能有一个用于发送消息
2. 一个企业可以有多个自建服务窗，但最多只能有一个用于发送消息
3. ISV套件也最多绑定一个appid用于发送消息

为什么这么搞？原则就是原则。。。当外部用户和企业人员混合的时候，涉及到发送消息的逻辑时这样做最简单：外部用户就用企业默认绑定的服务窗的agentid发送消息；企业用户就用默认绑定的微应用的agentid发送消息；ISV也用默认的appid发送消息。 -- 一切都那么完美~（原则不能变）

* 一些坑

1. 对于企业自建微应用或者ISV来说：同步通讯录的时候能获取到的重要信息有：`userid`、`unionid`、`openid`
2. 但是获取到的外部联系人列表却只有`userid`
3. 所以上面两步有什么问题呢？继续看
4. 针对企业微应用或者ISV来说，发送消息时知道对方`userid`即可
5. 但是。。。外部联系人要的是`openid`；不过也情有可原，用`openid`才能知道是谁哇。怎么办？（步骤2只拿到了`userid`），因此需要我们在外部用户进行免登操作或者扫码登录时拿到的`openid & unionid`进行关联。
6. 接着5讲：怎么关联？redis或者放到自己的数据库都可以~

* 一些小心思

针对上面外部用户需要做`userid`和`openid`关联的坑。外部用户如果是免登，这就好办了（免登肯定知道corpid，以及agentid啊）所以很容易就能通过corpid+corpSecret获取的corpAccessToken得到userid和unionid & openid的关联

但是扫码登录就坑了。。。钉钉的扫码可以和ISV、企业等彻底无关。即：扫码成功了但却不知道是哪个企业的，更何谈userid和openid的关联。

所以：终极大招就是：

> 我可以把系统中所有最小集合的企业列表拿到，然后挨个换取Token后去尝试用unionid换取userid啊。。。好像也没什么不好的，反正也只会发生在第一次扫码登录嘛

#### 哪些数据应该保留在`config.php`中？

* Suite套件相关的配置

`suite_ticket`、`token`、`encoding_aes_key`、`suite_secret`；相对来说这些不太容易改变的数据还是可以保留在config下

* 扫码相关配置

主要是用钉钉的扫码功能登录自有系统，有：`SCAN_APPID`、`SCAN_APPSECRET`。

* 企业相关的

`corpid`、`corp_secret`啥的由于一个服务有可能对接N个企业，因此不建议放置到config下，从下面的Redis存储中去考虑

#### 哪些数据是需要放置到Redis中的？

这些信息强烈建议按照不同的维度去存储，方便管理的同时也方便查看。

* Suite套件维度

1. `suite_access_token`。有效期2小时

* Scan扫码维度

1. `sns_access_token`。有效期2小时

* Corp企业维度

企业需要存储的东西视场景而定，如果自有的数据库中已经存储了相应信息，可以不再进行存储。但是放到redis中架不住它快啊！

1. `corp_info`：企业信息，此信息非彼信息（不是名称啥的）；包含：`corp_id` `tmp_auth_code` `permanent_code`。看信息就知道，这是ISV授权时激活套件的时候产生的信息
2. `corp_access_token`：用corpid+corpSecret换取的。有效期2小时
3. `corp_secret`：秘钥
4. `channel_secret`：服务窗秘钥
5. `ch_access_token`：服务窗token。有效期2小时
6. `auth_info`：授权信息，包括：`appid` `agent_name` `logo_url`，对。这也是授权套件应用时产生的信息
7. `active_status`：激活信息，是否激活了套件
8. `agentid`：唯一的自建微应用，用于发消息
9. `ch_agentid`：唯一的自建服务窗，用于发消息
10. `cb_token`：通讯录回调token - 自己注册的
11. `cb_aes_key`：通讯录回调aes_key - 自己注册的

* User用户维度

1. `openid`：之前提到的userid和openid的映射，主要是用于外部联系人发送消息


#### Redis key设计

```
type:[type]:维度:[维度名称]:维度标识:[标识值]:key [value]
```

以上面的四个维度为例：

```
# 由于suite唯一，所以后面的几个key不需要
type:dd:suite:suite_access_token xxxx

type:dd:scan:sns_access_token xxx

type:dd:corp:corpid:xxxxxx:corp_access_token xxxx

type:dd:user:userid:xxxx:openid xxxx
```

用法，如获取所有的企业信息

```php
<?php
$ret = $redis->mget($redis->keys('type:dd:corp:corpid:*:corp_info'));
var_dump($ret);
```

#### 附上RedisCache的实现

```php
<?php
/**
 * Redis
 */
class RedisCache {
  protected static $redis;

  private static function init() {
    self::$redis = new Redis();
    self::$redis->connect('127.0.0.1', 1234);
  }

  public static function set($key, $value, $expires = false) {
    self::init();
    $storeData = self::packData($value);
    if ($expires) {
      self::$redis->setEx($key, 7000, $storeData);
    }
    else {
      self::$redis->set($key, $storeData);
    }
  }

  public static function mget($keys) {
    self::init();
    $ret = [];
    foreach ($keys as $key) {
      $ret[] = self::get($key);
    }
    return $ret;
  }

  public static function mset($values) {
    self::init();
    return self::$redis->mset($values);
  }

  public static function keys($keys) {
    self::init();
    return self::$redis->keys($keys);
  }

  public static function get($key) {
    self::init();
    $data = self::$redis->get($key);
    if ($data) {
      $data = self::unpackData($data);
    }

    return $data;
  }

  public static function delete($key) {
    self::init();
    return self::$redis->del($key);
  }

  private static function packData($data) {
    return serialize($data);
  }

  private static function unpackData($data) {
    return unserialize($data);
  }
}
```

具体用法：

```php
<?php
class Cache
{
  // 设置企业信息
  public static function setCorp($corpId, $key, $value, $expires = false) {
    RedisCache::set("type:dd:corp:corpid:$corpId:$key", $value, $expires);
  }

  public static function getCorp($corpId, $key) {
    return RedisCache::get("type:dd:corp:corpid:$corpId:$key");
  }

  // 扫码信息默认一个服务器只绑定一种扫码方式
  public static function setScan($key, $value, $expires = false) {
    RedisCache::set("type:dd:scan:$key", $value, $expires);
  }

  public static function getScan($key) {
    return RedisCache::get("type:dd:scan:$key");
  }

  // 套件信息也默认一个服务器只绑定一个
  public static function setSuite($key, $value, $expires = false) {
    RedisCache::set("type:dd:suite:$key", $value, $expires);
  }

  public static function getSuite($key) {
    return RedisCache::get("type:dd:suite:$key");
  }

  // 用户信息
  public static function setDdUser($userid, $key, $value, $expires = false) {
    RedisCache::set("type:dd:user:userid:$userid:$key", $value, $expires);
  }

  public static function getDdUser($userid, $key) {
    return RedisCache::get("type:dd:user:userid:$userid:$key");
  }
```

#### 参考资料

无，纯属自己YY

