---
layout: post
title: "jquery内核学习(9)--文档对象操作"
description: ""
category: jquery
tags: 
  - 学习笔记
  - jquery内核
---
{% include JB/setup %}

## 创建节点

#### 创建元素

jQuery实现. 如创建h1:

    var h1 = $('<h1></h1>'); // 创建h1对象集合
    $('body').append(h1);   // 把创建的对象添加到文档中

Javascript实现. 过程如下:

    var h1 = document.createElement('h1');  // 创建h1对象
    document.body.appendChild(h1);

#### 创建文本

jQuery实现. 

    var h1 = $('<h1>测试文本</h1>');
    $('body').append('h1'); // 把需要的信息写好, 直接往DOM树上添加即可

Javascript实现, 需要额外的工作:

    var h1 = document.createElement('h1');
    var txt = document.createTextNode('测试文本');
    h1.appendChild(txt);    // 往h1中添加文本节点
    document.body.appendChild(h1);
<!--more--> 

#### 创建属性

jQuery实现.

    var h1 = $('<h1 title="一级标题" class="red">测试文本</h1>');
    $('body').append(h1);

Javascript实现.
    
    var h1 = document.createElement('h1');
    var txt = document.createTextNode('测试文本');
    h1.appendChild(txt);    // 往h1中添加文本节点
    h1.setAttribute('title', '一级标题');
    h1.setAttribute('class', 'red');
    document.body.appendChild(h1);

## 插入元素

jQuery提供了以下几种方法:

- append()

> 向元素内部追加内容, 如上面的例子.

- appendTo()

> 把所有匹配的元素追加到另一个指定的元素集合中, 与上一个方法刚好相反.

- prepend()

> 向元素内部前置内容

- prependTo()

> 与appendTo()方法用法类似.

- after()

> 在每个匹配的元素之后插入内容

- before()

> 元素之前插入

- insertAfter()

> 把匹配的集合插入到某个元素之后

- insertBefore()

> 与上相反

Javascript实现:

- appendChild()
    
> 与jquery的append()方法对应

- insertBefore()

> 与jquery的prepend()方法对应

    var o = e.insertBefore( new_e, target_node );

返回值o是新添加的节点, 表示在e的target_node后添加新节点new_e, 若target_node为
null, 则默认在e的最后面插入.

## 扩展DOM功能函数

出于jquery的便捷功能, 在js上也给节点元素扩展一些方法. 接下来实现一个扩展函数.

    var DOMextend = function( name, fn ) {

        if ( ! document.all ) {   // 非IE

            // 为HTMLElement扩展方法, 此方法IE不支持
            eval('HTMLElement.prototype.' + name + ' = fn');
        } else {    // IE

            var _createElement = document.createElement;    // 需要重写此方法

            document.createElement = function( tag ) {

                var _elem = _createElement( tag );
                eval('_elem.' + name + ' = fn');
                return _elem;
            }

            var _getElementById = document.getElementById;  // 需要重写此方法

            document.getElementById = function( id ) {

                var _elem = _getElementById( id );
                eval('_elem.' + name + ' = fn');
                return _elem;
            }

            var _getElementsByTagName = document.getElementsByTagName;

            document.getElementsByTagName = function( tag ) {

                var _arr = _getElementsByTagName( tag );
                
                for ( var _elem = 0; _elem < _arr.length; _elem++ ) {
                    eval('_arr[_elem].' + name + ' = fn');
                }
                return _arr;
            }
        }
    }

对于IE浏览器, 重写每种js的原生选择DOM节点的方法; 让通过他们选择的节点都具有扩展
的方法(这些都能通过原型链继承).

#### 利用DOMextend()扩展js的appendTo及prependTo方法

    // 为DOM element绑定appendTo方法.
    DOMextend('appendTo', function(e) {

        var _this = this;
        e.appendChild(_this);// 把当前的对象添加到目标节点内部的尾部
        return _this;   // 返回当前元素
    });

    // 为DOM element绑定prependTo方法
    DOMextend('prependTo', function(e) {

        var _this = this;
        e.insertBefore(_this, firstChild);  // 把当前元素追加到第一个元素的前面
        return _this;   // 返回当前的元素
    });

#### 扩展js的insertAfter与insertBefore方法

    // 为DOM element绑定insertAfter方法 
    DOMextend('insertAfter', function(e) {

        var _this = this;

        // 需要回溯到e的父节点再调用insertBefore()方法
        // 然后是在e的后面插入, 由于js没有insertAfter方法, 因此换个角度变成在e的
        // 下一个元素的前面插入
        e.parentNode.insertBefore(_this, e.nextSibling);
        return _this;   // 返回当前元素
    });

    // 为DOM element绑定insertBefore()方法
    DOMextend('insertBefore', function(e) {

        var _this = this;
        e.parentNode.insertBefore(_this, e);
        return _this;
    });

## 删除元素

jquery实现

- remove()

> 从DOM元素中删除匹配的元素, 并返回这个被删除的元素

- empty()

> 删除匹配元素集合中的所有子节点(清空当前节点的内容)

Javascript实现

    // 
    DOMextend('empty', function(e) {

        var _this = this;
        var a = []; // 存储删除的节点

        for ( var i = 0, c = _this.childNodes, l = c.length;

                i < 1; i ++ ) {

            a.push(_this.removeChild(c[0]));
        }

        return a;
    });

## 复制元素

jquery实现

- clone()

> 能够复制匹配的DOM元素并选中这些副本. 默认只复制元素而不复制绑定的事件处理; 当
> 额外传递另一个参数true时, 事件也一起复制.

Javascript实现

- cloneNode()

> 可以创建指定节点的副本, 包含一个参数(true/false). 用来设置被复制的节点是否包括
> 原节点的所有属性和子节点.

## 替换元素

jquery实现

- replaceWith()

> 将所有匹配的元素替换成HTML或者DOM元素

    $('p').replaceWith('<div>box</div>');// 替换所有p为div

- replaceAll()

> 功能与上相反

    $('<div>box</div>').replaceAll('p');

Javascript实现

- replaceChild()

> 实现节点替换, 接收两个参数, 第一个是替换的节点, 第二个是被替换的节点

    // 如上的效果
    var p = document.getElementsByTagName('p');
    var div = document.createElement('div');
    div.innerHTML = 'box';
    
    // 遍历进行替换
    for ( var i = 0, l = p.length; i < l; i++ ) {
        
        // 需要替换的内容
        var div1 = div.cloneNode(true);
        p[i].parentNode.replaceChild(div1, p[i]);
    }

#### js扩展自己的replaceWith和replaceAll方法

    DOMextend('replaceWith', function(e) {

        var _this = this;
        _this.parentNode.replaceChild(e, _this);
        return _this;
    });

    // 功能相同, 但是方法相反
    DOMextend('replaceAll', function(e) {

        var _this = this;
        _this.parentNode.replaceChild(_this, e);
        return _this;
    });

使用方法和jquery的使用一样

## 包裹元素

jquery实现

- wrap()

>

    $('p').wrap('<span class="wrap"></span>');

    // html
    <p>1</p>
    <p>2</p>
    <p>3</p>

    // 包裹后
    <span class="wrap">
        <p>1</p>
    </span>
    <span class="wrap">
        <p>2</p>
    </span>
    <span class="wrap">
        <p>3</p>
    </span> 

- wrapAll()

>

    // 如上的方法, 替换后
    <span class="wrap">
        <p>1</p>
        <p>2</p>
        <p>3</p>
    </span>

- wrapInner()

>

    <p>
      <span class="wrap">1</span>
    </p>
    <p>
      <span class="wrap">2</span>
    </p>
    <p>
      <span class="wrap">3</span>
    </p>

Javascript实现

    // wrap()
    DOMextend('wrap', function(e) {

        var _this = this;
        _this.parentNode.insertBefore(e, _this);    // 在当前被包裹元素前面插入
        包裹元素
        e.appendChild(_this);   // 然后把被包裹的元素移动到包裹的元素中
        return _this;
    });

    // 使用
    var p = document.getElementsByTagName('p');
    
    for ( var i = 0, l = p.length; i < l; i++ ) {
        var span = document.createElement('span');
        p[i].wrap(span);
    }

    // wrapAll()方法在上面基础做下改进即可
    // 把包裹元素的顺序放在for循环外面进行创建即可
    var p = document.getElementsByTagName('p');
    var span = document.createElement('span');

    for ( var i = 0, l = p.length; i < l; i++ ) {
        p[i].wrap(span);
    }

    // wrapInner()
    DOMextend('wrapInner', function(e) {

        var _this = this;
        _this.parentNode.insertBefore(e, _this);
        
        while( _this.firstChild ) { // 把所有的子节点转移到包裹元素中
            e.appendChild(_this.firstChild);
        }

        _this.appendChild(e);
        return _this;
    });

    // 和上面同样的用法

## 属性操作

#### 设置属性

jquery实现

- attr()

> 两个参数, 第一个属性名, 第二个是属性值

Javascript实现

- setAttribute()

> 用法和参数都与上相同

    // jquery
    $('p').attr('title', 'test');

    // javascript
    document.getElementsByTagName('p')[0].setAttribute('title', 'test');

#### 获取属性

jquery实现

- attr()

> 只有一个属性名参数

Javascript实现

- getAttribute()

> 同样的用法

    // jquery
    $('p').attr('title');   // 获取p的title属性

    // javascript
    document.getElementsByTagName('p')[0].getAttribute('title');    // 获取第一个p的title属性

#### 删除属性

jquery实现

- removeAttr()

> 能删除指定的元素属性

Javascript实现

- removeAttribute()

> 同上的用法

    $('p').removeAttr('title');

    p.removeAttribute('title');

    // 两者只是名字的简写, 功能一样.

## 操作类样式

#### 追加样式

jquery实现

- addClass()

> 很简单, 在相应的元素上添加一个类

Javascript通过setAttribute实现

#### 移除样式

jquery
 
- removeClass()

> 移除指定的类

Javascript实现

通过正则把需要移除的部分去掉即可

    DOMextend('removeClass', function(e) {

        var _this = this;
        if ( !e ) {
            this.setAttribute('class', ''); // 清空
        } else {
            var a = e.split(' ');   // 按空格划分去要截取的类
            var attr = _this.getAttribute('class'); // 获取到所有的类

            for ( var i = 0; i < a.length; i++ ) {
                attr = attr.replace(a[i], '');  // 截取掉匹配的类
            }

            _this.setAttribute('class', attr);
        }

        return _this;
    });

    // 相同的使用方法

#### 切换样式

jquery实现

- toggleClass()

> 两个参数, 第一个表示需要切换的类名, 第二个参数可选. 决定是否打开前面的类样式

    var n = 0;
    $('p').toggleClass('hidden', n++ % 3 == 0); // 当n为3的倍数的时候才进行切换

Javascript实现

显然需要考虑如下的几步:

1. 是否存在第二个参数, 以及第二个参数的值.

2. 判断是否设置了class属性.

3. 判断是否样式中已经包含了需要切换的类, 有则移除, 否这追加.

#### 判断样式

jquery实现

- hasClass()

> 判断元素中是否包含指定的类样式, 还可以直接使用`is()`方法.

Javascript实现

- hasAttribute()

> 只能判断元素是否设置了指定属性, 但是不能判断是否包含指定的样式

    // 做如下的扩展
    DOMextend('hasClass', function(p) {

        var _this = this;
        if ( !_this.hasAttribute('class') )
            return false;   // 没有设置样式
        var attr = _this.getAttribute('class');
        if ( attr === p || attr.indexOf(' ' + p) != -1 || 
                attr.indexOf(p + ' ') != -1 ) {
            return true;
        }

        return false;
    });

## 操作HTML, 文本值

#### 读写HTML字符串

jquery实现

- html()

> 没有参数时直接读取指定节点下的所有dom元素

Javascript利用innerHTML读取

#### 读取文本值

jquery有封装好的text()方法; Javascript有原生的innerText属性. 但是兼容性不好. 

    // 扩展如下
    DOMextend('text', function(e) {

        var _this = this;
        if ( e !== undefined ) {
            _this.innerHTML = s;
            return _this;
        }

        return sum(_this);  // 否则调用sum汇总所有子节点的文本内容

        function sum(s) {
            var son = s.childNodes;
            var string = "";
            for ( var i = 0; i < son.length; i++ ) {
                if ( son[i].nodeType == 3 ) { // 文本节点
                    string += son[i].data;
                }
                if ( son[i].nodeType == 1 ) {   // 元素节点
                    string += arguments.callee(son[i]);// 迭代下去
                }
            }

            return string;
        }
    });

#### 读写表单值

jquery实现

- val()

> 选中元素即可读取里面的值

Javascript实现

- value

> 通过value属性读取

## 操作样式表

#### 通用的css样式读写方法

jquery实现

- css()

> 读取指定的样式, 或者设置样式.

    $('p').css({color: 'red', fontWeight: 'bold'});

Javascript实现(读写行内样式)

- style对象

> css的所有属性都能在style对象上访问到, 对于属性中有`-`的, 改用驼峰式命名.

Javascript实现(读写样式表)

- styleSheets & cssRules

> Document对象的styleSheets集合上包含了文档中所有的样式表的引用; DOM还为每个样式
> 定义了一个cssRules集合, 用来包含指定样式表中所有的规则.

    // IE不支持cssRules; 通用的写法
    var cssRules = document.styleSheets[0].cssRules ||
    document.styleSheets[0].rules;

cssRules集合和rules集合都包含style属性. 用来访问style对象.

    cssRules[0].style.color;    // 访问color属性

#### 绝对偏移位置

所谓绝对偏移就是指定元素距离浏览器窗口左上角的偏移距离

jquery实现

- offset()

> 能够获取匹配元素在当前窗口的相对偏移, 没有参数, 返回一个对象. 包含两个属性top
> 和left. `仅对可见元素有效`.

Javascript实现

    // 扩展offset()
    DOMextend('offset', function() {

        var _this = this;
        var left = 0, top = 0;

        // 若存在offsetParent属性则获取并定位元素的偏移坐标
        while( _this.offsetParent ) {
            left += _this.offsetLeft;
            top += _this.offsetTop;
            _this = _this.offsetParent;
        }

        return {
            'left': left,
            'top': top
        };
    });

DOM中约定, 任何元素都拥有`offsetLeft`和`offsetTop`属性.

存在的问题: 不同的浏览器定义元素的偏移参照对象不同; IE是以父元素为参考对象进行偏
移, 非IE则以最近非静态定位元素为参考对象进行偏移.

#### 相对偏移位置

所谓相对偏移位置就是指定元素距离最近父级定位元素左上角的偏移距离.理解两个概念:

> - 定位元素就是被定义了相对, 绝对或者固定定位元素, 即设置了css的position属性值
> 为absolute, fixed, relative属性值的元素.

> - 所谓父元素是指与当前元素相邻的上一级元素, 而最近的父级元素不一定是与当前元素
> 相邻, 也可能距离很远. 如果当前元素的上级元素position属性值都没有被定义为
> absolute, fiexed, relative. 则当前元素的最近父级定位元素就应该是body元素了. 此
> 时相对偏移位置与绝对偏移位置是相同的.

jquery实现

- position()

> 获取匹配元素的相对偏移位置, 返回top, left两个属性. 仅对可见元素有效.

Javascript实现

> 设计思想: 利用offsetParent属性获取最近的父级定位元素, 然后判断改元素的位置. 如果他是父元
> 素, 则可以直接读取当前元素的offsetLeft和offsetTop属性值. 若不是父元素则可以将
> 获取的当前元素的绝对偏移位置减去定位元素的绝对偏移位置, 即可获得当前元素距离定
> 位元素的偏移距离.

#### 元素的宽和高

jquery实现

- width()

> 获取, 或者设置元素的宽

- height()

> 获取, 或者设置元素的高

    $('div').width('120px');
    $('div').height('20em');

Javascript实现:

- height属性    

- width属性

> 用style上的height和width属性来操作.

    var div = document.getElementsByTagName('div')[0];
    div.style.width = "200px";
    div.style.height = "30px";

除了最基本的外, jquery还定义了如下的方法

- innerHeight(), innerWidth(), outerHeight(), outerWidth()

> 在width(),height()的基础上, 再计算元素的边框或者补白.

> outer返回元素的总宽和高(包括: 宽高,补白,边框宽度); inner包括: 宽高, 补白.

## 元素遍历操作

基本的有`children`, `next`, `prev`, `parent`几种方法, 都是基于原生的js实现的. 具
体在前面[几篇文章](http://www.poised-flw.com/jquery/2013/04/25/learn-jquery-kernel-07/)中有专门介绍.
