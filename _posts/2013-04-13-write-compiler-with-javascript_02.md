---
layout: post
title: "编译原理----手写编译器(2)----LR(1)分析表的构造"
description: "动手写自己的编译器"
category: javascript
tags:
  - 编译原理
  - LR(1)
---
{% include JB/setup %}

上一篇文章已经对LR分析法做了比较详细的介绍,本篇将主要介绍LR(1)分析表的构造过程:

完整的项目请参考:https://github.com/luofei2011/jslr1

首先有一些基本概念.

## LR(1)项目

就是对于一个上下文无关文法G=(V,T,P,S),若存在规范推导:S=>...=>δAω=>δαβω,则称[A->α.β,a]对活前缀 γ=δα是有效的.其中α,β,δ是属于V&T并集闭包的元素.a是终结符T.且a是ω的首字符,若ω=ε,则a=#.[A->α.β,a]称为文法G的LR(1)项目,a称为搜索符.

例如:如下文法

    T->xyz
<!--more--> 

具体的LR(1)项目是什么呢?我的理解是在产生式右部的不同位置加上'.',然后加上相应的搜索符a:

    T->.xyz,#

    T->x.yz,#

    T->xy.z,#

    T->xyz.,#

在具体的语法分析过程中,这些状态将对应不同的操作(移进,归约,接受,出错等).咱们的重点还是项目集的构造.

##### 什么是项目集呢?

识别文法全部活前缀的DFA的每一个状态就用LR(1)项目集来表示.至于什么是活前缀,前面一篇文章有提到.

为了构造文法的LR(1)项目集,需要用到两个函数CLOSURE(I)和GO(I,X).CLOSURE(I)用来计算LR(1)项目集I的LR(1)闭包.以下的G'均为G的拓广文法

##### CLOSURE(I)的算法描述如下:

    function CLOSURE(I);
     begin
         C := I;
         repeat
             for [A->α.Bβ,a] in C do
                 for B->η in G' && b in FIRST(βa) do
                     if [B->.η,b] not in C then 
                         C := C+{[B->.η,b]};
         until C.length no change;
         return C;
     end;

下面给出Javascript的具体算法实现(非递归实现):

    /*
      *    闭包函数
      *    是非递归实现
      * @param array I 传递的需要求闭包的项目
      * @param array C 记录产生的闭包集合
      * @return array C    最终的闭包集合
      *
      * */
     function closure(I) {
         //初始化闭包
         var C = I || [];    
         /*记录闭包中的项目数*/
         var len = C.length;
         while(1){
             for(var item in C) {
                 var str = C[item].slice(C[item].indexOf('.')+1,C[item].indexOf('.')+2);
                 /*满足这种产生式:A->a.Bp,a*/
                 if(str.length && str != ','){
                     /*'.'后面是终结符则停止*/
                     if(is_inArray(str,T))
                         continue;
                     var first_arr = C[item].slice(C[item].indexOf('.')+2,C[item].length).replace(/,/g,'');
                     var first = getFirstAll(first_arr);
                     /*遍历拓广文法G'中产生式的左部*/
                     for(var i in pro){
                         /*找到以B开始的项目*/
                         if(str == i){
                             /*遍历出以B开始的产生式,并把他们加'.'以后加入闭包中*/
                             for(var j in pro[i]){
                                 /*还得对当前产生式的FIRST集合遍历一次*/
                                 for(var n in first){
                                     var yeta = i + '->.' + pro[i][j] + ',' + first[n];
                                     /*循环处理C中的每项,去重.直到C的大小不再改变*/
                                     if(!is_inArray(yeta,C))
                                         C.push(yeta);
                                 }
                             }
                         }
                     }
                 }
             }
             /*大小不再改变则停止寻找闭包*/
             if(C.length > len){
                 len = C.length;
             }else{
                 break;
             }
         }
         return C;
     }

从算法描述里面我看见了,就是需要求解FIRST(βa),所以得自己实现一个FIRST集的算法(我这里的文法不需要手动消除左递归的情况):

    /*
      *    求FIRST集合
      *    若出现以下情况(存在左递归):
      *        T->T*F
      *        T->T/F会产生死循环
      *    则程序自动处理,不需要手动消除.
      *    @param    array    pro_G    存储自己的文法.如:S->0S1等
      *    @param    array    V        所有的非终结符集合
      *    @param    array    T        所有的终结符集合
      *    @return array    first    返回first集合
      *
      * */
     function getFirstByOne(value) {
         var first = [];    
         if(is_inArray(value,T) || value == '#')
             first.push(value);
         if(is_inArray(value,V)){
             //找出所有的X->a/X->Y型产生式
             var all_x = [];
             for(var item in pro_G){
                 //产生式的右部
                 if(pro_G[item][0] == value){
                     //右侧是终结符并且没有加入first集合的情况下
                     if(is_inArray(pro_G[item][3],T) && !is_inArray(pro_G[item][3],first))
                         first.push(pro_G[item][3]);
                     //右侧第一个是非终结符
                     /*像这种T->T/F的产生式会发生死递归.
                       能想到的有两种方法能解决:
                             1.循环的过程中,像遍历二叉树一样弄一个hash表记录是否被访问过
                             2.强制规定不能有这种类型的产生式出现,若出现则忽略其FIRST集合
                       本实验我采取第二种方法,牺牲精确度,提高效率.
                     */
                     else if(is_inArray(pro_G[item][3],V) && pro_G[item][3] != pro_G[item][0]){
                         var all_v = getFirstByOne(pro_G[item][3]);
                         if(!is_inArray(all_v,first))
                             for(var j in all_v)
                                 first.push(all_v[j]);
                     }
                 }
             }
         }
         return first;
     }
     
     /*符号串的FIRST集合*/
     function getFirstAll(str){
         var first = [];
         /*for(var i=0; i<str.length; i++){
             var _val = getFirstByOne(str[i]);
             for(var j in _val)
                 if(!is_inArray(_val[j],first))
                     first.push(_val[j]);
             if(is_inArray(str[0],T))
                 break;
         }*/
        //感觉这里只能这样写,不知是FIRST集求错还是怎么.循环会有更多的FIRST集合
         var _val = getFirstByOne(str[0]);
         for(var j in _val)
             if(!is_inArray(_val[j],first))
                 first.push(_val[j]);
         return first;
     }

到此LR(1)分析法的CLOSURE(I)函数就实现,下一节将讲解GO(I,X)函数.
