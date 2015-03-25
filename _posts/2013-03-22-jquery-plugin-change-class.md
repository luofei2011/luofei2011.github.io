---
layout: post
title: "一个很简单的动态改变class插件"
description: "简单的jquery插件开发过程"
category: jquery
tags: ['插件']
---
{% include JB/setup %}

    ;(function($) {
     
     /**
     *    初始化插件
     *    @author: luofei
     *    @version: 2013/03/22
     *    @param:    {array}        options        初始化传入的json数据
     */
     
     $.fn.lf = function(options){
         this.opts = $.extend({}, $.fn.lf.defaults, options);
         this._init();
     };
     /*
     *    插件的扩展函数    公共方法
      */
     $.fn.lf.prototype = {
         _init: function() {
     
             var _this = this;    //获取当前对象
             
             //根据传入的参数确定选择器
             var selector = _this.opts.id === "" ? "."+_this.opts.className : "#"+_this.opts.id;
     
             $(selector).each(function(index) {
                 $(this).bind(_this.opts.eventType,makeFunc(index,_this.opts));
             });
         }
     }
     
     /*
     *    内部私有方法    --闭包    
     *    @param:    {int}    index    当前遍历的对象数组下标
     *    @param:    {array}        opts    插件配置选项
     * */
     function makeFunc(index,opts){
         return function(){
             if(opts.id)
                 var item = $("#"+opts.id);
             var item = $("."+opts.className);
             for(var i=0; i<item.length; i++){
                 var attr = item[i].getAttribute("class");
                 if(i != index){
                     attr = attr.replace(opts.toggleName,"");
                     item[i].setAttribute("class",attr);
                 }
                 else{
                     item[i].setAttribute("class",attr+" "+opts.toggleName);
                 }
             }
         };
     }
     
     /*
         * @param    {string}    id            选择器 id
         * @param    {string}    className    选择器 class
         * @param    {string}    toggleName    需增加的class
         * @param    {string}    eventType    事件触发的类型
     */
     $.fn.lf.defaults = {
         id: "",
         className: "",
         toggleName: "",
         eventType: "click"
     };
     
     })(jQuery);
     
     //应用实例
     $(function(){
         var lf = new $.fn.lf({
             className: "item",
             toggleName: "active"
         });
     });
