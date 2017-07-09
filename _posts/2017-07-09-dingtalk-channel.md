---
layout: post
title: "企业自建服务窗 - 外部联系人免登实现"
description: ""
category: "钉钉"
---

#### 名词解释

* corpid

企业id，每个企业独有。具体可在oa管理平台查看

* CorpSecret

在[钉钉开发者平台](http://open-dev.dingtalk.com/)：`开发账号管理 - corpSecret管理列表`，可选择已有的CorpSecret或者重新生成。（前提是你该企业的管理员）

该秘钥用于和企业相关的一些接口调用，包括但不限于：通讯录管理、外部联系人管理、微应用管理等。详见[WIKI](https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.zNQpfO&treeId=385&articleId=104981&docType=1)

* ChannelSecret

管理路径同CorpSecret。

该秘钥用于企业下服务窗相关接口的调用，如：服务窗关注者免登、jsapi授权、关注者发送消息等。详见[WIKI](https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.ObJoZg&treeId=255&articleId=105709&docType=1)

* CorpAccessToken

企业自建应用需要通过该token访问钉钉开放平台下的相关接口，获取方式：corpid+corpsecret。有效时间2小时。

* ChannelAccessToken

服务窗开发商需要通过ChannelToken访问钉钉开放平台的服务窗相关接口,与 服务窗关注者 进行交互,如进行服务窗关注者获取、向关注者发送消息等,对于企业本身就是服务窗开发商的可以通过corpid及ChannelSecret换取,对于ISV,可以在企业对套件授权后,使用 永久授权码 换取授权的ChannelToken.  有效时间2小时

#### 实现过程

拿到上面的corpid、corpSecret、channelSecret我们就可以进行下一步具体实现了。

* 移动端注入jsapi脚本

```javascript
await getScript('/g.alicdn.com/dingding/open-develop/1.5.1/dingtalk.js');
```

* 从后端获取`dd.config`需要的配置

```php
<?php
/**
 * file: /channel/api/Auth.php
 * Cache 为openapi-php-demo下的类。被我改造为redis存储了
 */

public static function getAccessToken($corpId) {
	$accessToken = Cache::getCorp($corpId, 'ch_access_token');
	if (!$accessToken) {
	  $res = Http::get('/channel/get_channel_token', array(
	    'corpid' => $corpId,
	    'channel_secret' => Cache::getCorp($corpId, 'ch_secret'),
	  ));
	  $accessToken = $res->access_token;
	  Cache::setCorp($corpId, 'ch_access_token', $accessToken, true);
	}
	
	return $accessToken;
}

/**
* 缓存jsTicket。jsTicket有效期为两小时，需要在失效前请求新的jsTicket（注意：以下代码没有在失效前刷新缓存的jsTicket）。
*/
public static function getTicket($corpId, $accessToken)
	{
	$jsticket = Cache::getCorp($corpId, 'ch_js_ticket');
	if (!$jsticket)
	{
	  $response = Http::get('/channel/get_channel_jsapi_ticket', array('access_token' => $accessToken));
	  self::check($response);
	  $jsticket = $response->ticket;
	  Cache::setCorp($corpId, 'ch_js_ticket', $jsticket, true);
	}
	return $jsticket;
}

# 这里需要传递corpid用来获取ChannelSecret、agentid无所谓，url用于确保鉴权信息和前端url一致
public static function getConfig($corpId, $agentid, $url = false) {
	#$agentId = Cache::getCorp($corpId, 'agentid');
	$nonceStr = 'abcdefg';
	$timeStamp = time();
	if (!$url) {
		$url = self::curPageURL();
	}
	$corpAccessToken = self::getAccessToken($corpId);
	if (!$corpAccessToken)
	{
		#Log::e("[getConfig] ERR: no corp access token");
	}
	$ticket = self::getTicket($corpId, $corpAccessToken);
	$signature = self::sign($ticket, $nonceStr, $timeStamp, $url);
	
	$config = array(
		'url' => $url,
		'nonceStr' => $nonceStr,
		'agentId' => $agentid,
		'timeStamp' => $timeStamp,
		'corpId' => $corpId,
		'signature' => $signature);
	return json_encode($config, JSON_UNESCAPED_SLASHES);
}
```

几点需要说明：

1. agentid是我前端透传过来的（为什么要前端透传呢？），因为我一套代码服务了ISV、企业自建微应用、企业自建服务窗、微信企业号等。。。所以为了区分，我会要求企业自建应用的url除了携带`$CORPID`外，还需要提供agentid。如：`https://xxx.com?corpid=$CORPID$&agentid=123456`
2. Cache为我自己实现的redis存储，后面的文章会讲解如何设计。
3. getconfig为什么还要传递url参数呢？为了保证鉴权url和前端url一致


调用方式：

```php
<?php

# 因为我的接口和前端是分离的，涉及到跨域问题，所以要透传referer字段作为鉴权url
ChAuth::getConfig($corpid, 123456, $_SERVER['HTTP_REFERER']);
```

* 前端jsapi的调用


```javascript
dd.config({
	// 这里配置大部分都是一样的，下面列出特殊的参数
	type: 1, // 服务窗应用这里需要为1
});

// 通过requestAuthCode获取code
// TIPS: 注意，这里非dd.runtime.permission.requestAuthCode !!!
dd.ready(function () {
	dd.channel.permission.requestAuthCode({
		corpId: 'xxx',
		onSuccess: function (info) {
			console.log(info.code)
		}
	})
});

// 接下来用code去后端请求用户信息：code+channelToken
```

错误处理：

* {errorCode:3,errorMessage:"1002,err msg uid is not in employee for orgid"}

这个错误我是把`dd.runtime.permission.requestAuthCode`换成`dd.channel.permission.requestAuthCode`才解决的

* 提示：权限检验失败，52019，无效的agentid

注意下后端accessToken的获取方式是不是corpid+channelSecret；agentId参数是否和当前打开应用一致；jsapi的版本是否最新（保证0.8.3+）；dd.config中的type参数是否为1

* 后端用code + channelToken获取用户openid & unionid

这个没什么好说的，看下服务窗文档。

如果你的系统到这步已经可以和系统进行关联，那没必要继续往下看了。

由于我们的系统，同步通讯录的时候写入的是userid，因此免登必须把unionid换取为userid才能进行关联。

这时候需要用到一个接口：

> 根据unionid获取成员的userid

```
https://oapi.dingtalk.com/user/getUseridByUnionid?access_token=ACCESS_TOKEN&unionid=xxxxxx
```

本来没什么。。。不过，这里的access_token为corpid+corpSecret换取的corpAccessToken；非corpid+channelSecret换取的ChannelToken，切记！切记！切记！

* 步骤完成


#### 一些相关的地址

* [获取免登授权码的问题](https://bbs.aliyun.com/read/289215.html?spm=5176.bbsr289215.0.0.MiAlCb)
* [服务窗JSAPI，关注者免登，提示：权限检验失败，52019，无效的agentid](https://bbs.aliyun.com/read/301662.html?spm=5176.bbsr301662.0.0.Zpss9u)
* 剩下就只能多去看看文档了
