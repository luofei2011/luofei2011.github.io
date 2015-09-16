---
layout: post
title: "angular上基于bootstrap的带时间的日期选择器"
description: "angular-bootstrap-datetimepicker,中文"
category: "angular"
tags: 
  - angular
---

为了一个可以选择时间的日期插件，找过好多开源组件，绝大部分都是基于bootstrap的；但是样式好看，支持汉化，并且可配置极强的就不那么好找了。这里记录几款使用过的时间日期选择器。

#### 1、angular-bootstrap-datetimepicker

* github地址：[https://github.com/dalelotts/angular-bootstrap-datetimepicker](https://github.com/dalelotts/angular-bootstrap-datetimepicker)

* DEMO地址：[http://dalelotts.github.io/angular-bootstrap-datetimepicker/](http://dalelotts.github.io/angular-bootstrap-datetimepicker/)

该插件基于老牌的moment.js进行开发，所以从汉化、可配置上来讲没有任何挑剔。

但是。。。只提供两个对外的接口：`before-render`和`on-set-time`所以并不能做一些后续的开发，比如选择完日期后自动关闭日期选择器。而且，从操作上来讲，选择的步骤也比较复杂。到分钟级别尤其不好选择。

#### 2、bootstrap-ui-datetime-picker

这个插件和上面的module名字一样，比较坑爹，所以不能一起用。

* github地址：[https://github.com/Gillardo/bootstrap-ui-datetime-picker](https://github.com/Gillardo/bootstrap-ui-datetime-picker)

* DEMO地址：[http://plnkr.co/edit/S8UqwvXNGmDcPXV7a0N3](http://plnkr.co/edit/S8UqwvXNGmDcPXV7a0N3)

该插件从整体上来讲：外观好看，汉化支持好（基于angular-ui的DatePicker和TimePicker），可配置性比较强，比如原生就支持选择后关闭日期选择框。特么是分钟级别的选择非常便利。

由于该插件的一些配置写死在全局了，没有很好的暴露配置接口，这里提供几种重置默认配置的方法：

__通过指令的方式__

{%highlight html%}

<input type="text" class="form-control" datetime-picker="yyyy-MM-dd HH:mm" ng-model="startTime" datepicker-options="calendarOptions" is-open="open" ng-click="openCalendar()" close-text="确定" today-text="今天" now-text="现在" clear-text="清空" time-text="时间" date-text="日期" min-date="minDate">

{%endhighlight%}

{%highlight javascript%}
var app = angular.module('app', ['ui.bootstrap', 'ui.bootstrap.datetimepicker']);

app.controller('MyCtrl', ['$scope', function ($scope) {
    $scope.startTime = new Date();
    $scope.calendarOptions = {
        showWeeks: false
    };
    $scope.open = false;
    $scope.openCalendar = function () {
        $scope.open = true;
    };
    $scope.minDate = new Date();
}]);
{%endhighlight%}

最后附上一个非常简单的使用demo：[http://webfe.cf/timepicker/index.html](http://webfe.cf/timepicker/index.html)
