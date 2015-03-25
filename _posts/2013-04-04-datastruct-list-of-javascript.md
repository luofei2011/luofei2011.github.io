---
layout: post
title: "数据结构--Javascript--链表篇"
description: "实现经典的数据结构算法"
category: javascript
tags: ['数据结构']
---
{% include JB/setup %}

    /*
      * concat()/join()/pop()/push()/reverse()/shift()
      * slice()/sort()/splice()/toSource()/toLocaleString()
      * unshift()/
     */
     
     /*扩展获取长度方法*/
     Array.prototype.Length = function() {
             return this.length;
     }
     
     /*扩展数组指定位置插入方法*/
     Array.prototype.ListInsert = function(value,position){
         /*
          * 插入过程中,先水平移动再插入 
          */
             var len = this.length-1;                //记录数组长度,为获取最后一位数据做准备
             var mv_len = this.length - position;    //水平移动位移
             var in_pos = position;                    //插入位置
     
             //判断插入的是number/object/array
             //function,string也具有length属性
             if(value.length === undefined || typeof(value) === 'string' || typeof(value) === 'function'){        
                 var in_len = 1;
             }else{
                 var in_len = value.length;            //需要插入元素的长度
             }

             //第一次循环水平移位
             for(var i=mv_len; i>0; i--){
                 this[len+in_len] = this[len--];
             }
     
             //第二次循环插入数据
             for(var i=0; i<in_len; i++){
                 //对于处理object/string/function这类的数据直接插入
                 if(value.length === undefined || typeof(value) === 'string' || typeof(value) === 'function'){
                     this[in_pos] = value;
                     continue;
                 }
                 this[in_pos++] = value[i];
             }
             return this;
     }
     
     /*扩展元素获取方法*/
     Array.prototype.getElem = function(indx) {
         if(!isNaN(indx))        //是否是可计算的表达式
             return this[indx];
         return false;
     }
     
     /*扩展的清空数组方法*/
     Array.prototype.ListEmpty = function() {
         //方法1
         //this.splice(0,this.length);
         //方法2
         this.length = 0;
         //方法3 形如: a = []
         return this;
     }
     
     /*扩展的元素位置方法(第一个匹配的,未找到返回-1)*/
     Array.prototype.LocateElem = function(value) {
         for(var i=0; i<this.length; i++){
             if(value === this[i])
                 return i;
         }
         return -1;
     }
     
     /*扩展的找前驱方法,不能为第一位元素*/
     Array.prototype.PriorElem = function(cur_e) {
         if(this.LocateElem(cur_e) <= 0)
             return -1;
         return this[this.LocateElem(cur_e)-1]
     }
     
     /*扩展的找后继方法,不能为最后一个元素*/
     Array.prototype.NextElem = function(cur_e) {
         if(this.LocateElem(cur_e) >= this.length)
             return -1;
         return this[this.LocateElem(cur_e)+1]
     }
     
     /*扩展的数组元素删除方法*/
     Array.prototype.ListDelete = function(indx) {
         for(var i=indx; i<this.length; i++){
             this[i] = this[i+1];
         }
         this.length--;
         return this;
     }
     
     /*扩展的遍历链表方法*/
     Array.prototype.ListTraverse = function() {
         //return this.toString();
         return this.valueOf();
     }
