---
layout: post
title: "Javascript编码风格"
description: "解决问题固然重要, 但是代码的可读性更重要"
category: javascript
tags: ['编码风格']
---
{% include JB/setup %}

像我这种第一们语言是C的程序猿,接触到JS的时候也秉承着C的风格;直到看了开源社区那
些让人痴迷的代码风格以后,决定彻头彻尾的改变自己编写js
代码的规范!本篇中主要的规范都来自于[《Maintainable JavaScript》](http://book.douban.com/subject/21792530/)
by [Nicholas C. Zakas](http://book.douban.com/search/Nicholas%20C.%20Zakas).

介绍两个非常有用的工具:[JSLint](http://www.jslint.com/), [JSHint](http://www.jshint.com/).

## 缩进问题

推荐两种风格的缩进

1. 4个空格: 这种缩进的好处是在任何的编辑器下表现的方式是一致的!

2. Tab缩进: 经常使用的缩进方式, 但是在有些编辑器中表现的形式并不一样, 一般是4个空格, 但有些编辑器会解释成8个空格等等...

## 语句的结尾

在某些情况下,省略掉语句后面的分号是能正常解释执行的:


    //解释器会自动在结尾加上分号
    //var name = "Poised-flw";

    var name = "Poised-flw" 
    function sayName() {
    　　alert( name )
    } 
<!--more--> 

但是下面的这种情况不会得到预期的结果:

    function returnSomeThing() {
        return
        {
            author: "Poised-flw",
            age: 20
        }
    }

    //最终将被解释成如下的格式
    function returnSomeThing() {
        return;
        {
            author: "Poised-flw",
            age: 20
        }
    }

所以推荐,**最好在没一行结束的时候都加上分号**,避免错误的发生!

## 换行

由于屏幕分辨率的限制,当代码的行长过长的时候,某些部分是会自动隐藏(有些编译器出现导航条),比如vim编辑器,当行过长的时候阅读和编码的时候很不方便,因为当光标在行尾的时候上下移动时会出现跳频的现象!所以推荐每行最多显示80个字母!

当需要显示的内容超过最大长度的时候就要把它分为两行或者更多行显示.分割的依据是:
在**操作符号后**进行分割,并且**下一行和上一行之间应该有两个缩进**.

    // Good: 在操作符后进行换行,并且下一行和上一行之间有两倍的缩进
    callAFunction(document, element, window, "some string value", true, 123,
    　　　　navigator);

    // Bad: 上一行和下一行之间只有一个缩进
    callAFunction(document, element, window, "some string value", true, 123,
    　　navigator);

    // Bad: 在操作符前进行了换行
    callAFunction(document, element, window, "some string value", true, 123
    　　　　, navigator);

在if语句中也可以使用相同的换行方法:

    if (isLeapYear && isFebruary && day == 29 && itsYourBirthday &&
            noPlans) {
        waitAnotherFourYears();    //注意: 这里的缩进是相对于if的第一行而非第二行
    }

还有就是在赋值语句中,当换行发生时: 

    var result = something + anotherThing + yetAnotherThing + somethingElse +
                 anotherSomethingElse;
 
下一行的开始和上一行的第一个赋值变量开始处对齐! 

## 适当的空行

在if/for这样的控制语句下加一行空行

    if ( contition ) {

        for ( condition ) {
            var str,
                arr;

            if( condition ) {
                //doSomeThing
            }
        }
    }

在**两个函数**之间加一个空行

    // 函数1
    function fun1() {
    　　// doSomeThing
    }

    // 函数2
    function fun2() {
    　　// doSomeThing
    }

在函数内部的**局部变量声明与第一条语句之间**加入一个空行

    function fun() {
    　　var i,
    　　    base = 10;

    　　for( i = 1; i < base; ) {
    　　　　console.log( i++ );
    　　}
    }

对于一个方法中的**两个不同逻辑部分之间**加入一个空行提高代码的阅读性!

## 命名规则

变量或者方法都按驼峰似进行命名,而且**变量最好以名词开头**,而**方法以动词开头**!

    var thisIsMyName;　　// 这就是一个变量命名
    getValue();　　// 这就是一个方法

在能体现变量意义的前提下使变量名尽可能的短;

尽量能做到见变量名就知道变量的类型;

    count, length, size;　　// Number
    name, title, message;　　// String

像i, j, k这样的变量最好只用在循环结构中;

避免使用一些没有实际意义的变量名,因为读者在不了解代码结构上下文环境的情况下是不知道这些变量的用途的!

    // 如foo, bar, temp.在不清楚他们的使用范围的时候, 你无法猜测他们具体代表的什么

对于方法的命名,要求第一个单词尽量是动词,下面是一些常用的动词和代表意义:

    动词	意义
    can	    返回一个Boolean的方法
    has	    返回一个Boolean的方法
    is	    返回一个Boolean的方法
    get	    返回一个非Boolean的方法
    set	    通常用于存储值的方法

对于**常量**: 通常使用大写字母, 多个单词之间用下划线连接

    var MAX_LENGTH = 10;
    var URL = "www.cnblogs.com/Poised-flw";

对于**构造函数**: 每个单词的首字母都应该大写以区别普通的方法.

    var me = new Person( "Poised-flw" );

对于**字符串**: 使用分号或者双引号都可以, 二者间的嵌套不需要转义, 但相同的嵌套需要转义

    // 不需要转义
    var str = 'This is a test "String";';

    // 需要转义
    var str = "This is a test \"string\";";

对于`null`和`undefined`: `null`常用来初始化一个变量

    var test;
    typeof test;　　//undefined
    var test2 = null;
    typeof test2;　　//Object

声明对象常量, 数组常量的时候最好不要使用`new`.

    // Bad: 最好不要使用new创建实例
    var obj = new Object();
    var arr = new Array();

    // Good: 这样更直接, 推荐用法
    var obj = {};
    var arr = [];

## 注释

**对于单行注释**

1 .在注释块的前面应该有一个空行, 并且和注释的部分要有相同的缩进 

    function test() {

    　　// this is a block comments
    　　if( condition ) {
    　　　　// doSomeThing
    　　}
    }

2. 双斜线后面有一个空格,如上的注释!

3. 对于行尾的注释最好有一个缩进

    var arr = [ 1, 2, 3, 4, 5, 6, 7 ];　　//我这里有一个Tab缩进

4. 当需要注释的部分有很多行的时候最好采用多行注释.

**对于多行注释**

1. 跟单行注释一样, 在每个注释的块前留一个空行, 并且和注释的部分有相同的缩进.

2. 在行尾的注释中最好不要使用多行注释的方式!

3. 多行注释的格式如下:

    /*
     * 每行以*开头,并且*后面有一个空格
     * 第二行注释
     * 第三行注释
     * ...
    */

对于vim编辑器, 这些部分是会自动插入的!

4. 对于一些文档性的注释, 更倾向于这种方式

    /*
     * some description
     * @author    Poised-flw
     * @param    Array    arr    一个名叫arr的数组
     * @param    String    str    一个名叫str的字符串
     * @return    Object    obj    返回一个名叫obj的对象
     * */

5. 对于意义已经较明确的语句不需要再添加注释, 但对于难以理解的代码则必须使用注释 

## 语句和表达式

**大括号的使用**

即使块(`if/for/while/do...while/try...catch...finally`)中只有一条语句, 也建议使用括号括起来

    function test() {
    　　var i = 1;

    　　if ( i === 1 ) {
    　　　　console.log( i-- );
    　　} else {
    　　　　i ++;
    　　}
    }

至于括号应该怎么放, 看个人的爱好.

    if ( condition ) {　　// Java style

    }

    if ( condition )　　//C#中较流行
    {

    }

空格怎么使用也是自己的爱好.

    // if的括号前后均没空格,小括号和大括号之间也没有空格
    if(condition){
    　　doSomething();
    }

    // 左小括号和if间有空格, 小括号和大括号之间也有空格, 本书作者推荐这种写法
    if (condition) {
    　　doSomething();
    }

    // 最洁癖!所有括号的左右都有一个空格, jQuery采用这种方式,本人也比较喜欢这种!
    if ( condition ) {
    　　doSomething();
    }

`switch`语句:  每个`case`都要以`break(return, throw)`结尾!最好有一个`default`,若没有应该加一行注释加以说明

    switch ( condition ) {
    　　case "first":
    　　　　// code
    　　　　break;
    　　case "second":
    　　　　// code
    　　　　break;
    　　default:
    　　　　// code
    }

避免使用`with`语句

对于`for`语句: 尽可能的避免使用`continue`, 而改用条件去控制, 给出的解释是: 这样让代码更具有可读性, 且不容易发生错误!

    var values = [ 1, 2, 3, 4, 5, 6, 7 ],
    　　 i, len;

    for ( i=0, len=values.length; i < len; i++ ) {
    　　
    　　// 跳过i=2这一次
    　　if ( i == 2 ) {
    　　　　continue;
    　　}
    　　process( values[ i ] );
    }

    // 换一种方式,意义更明确
    for ( i=0, len=values.length; i < len; i++ ) {

    　　// 这样表达的意思更明确
    　　if ( i != 2 ) {
    　　　　process( values[ i ] );
    　　}
    }

对于`for-in`循环: 不但遍历自身的属性, 还会遍历继承得到的属性, 使用它的时候最好
和`hasOwnProperty()`方法一起使用(除非你有意想遍历原型链上的属性, 这时最好留下一个注释加以说明).

    var prop;

    for ( prop in object ) {

    　　if ( object.hasOwnProperty( prop ) ) {
    　　　　console.log( "Property name is " + prop );
    　　　　console.log( "Property value is " + object[ prop ] );
    　　}
    }

注意: 最好**不要用for-in来迭代数组**, 解释是: `for-in`会迭代包括继承得到的属性, 所以这些属性可能并不都是数组的数字下标, 所以可能会导致一些潜在的问题!

## 变量, 方法的声明

一个环境(如在一个函数中)中, **变量的声明是被优先执行**的, 而跟变量的声明地点没有关系 

    function soSomething() {
    　　var result = 10 + value;
    　　var value = 10;

    　　return result;　　// NaN
    }

    // 等同于
    function soSomething() {

    　　// 所有变量被优先声明
    　　var result;
    　　var value

    　　result = 10 + value;// now: value is undefined
    　　value = 10;

    　　return result;
    }

所以: 由于变量的声明都是被提前的, 故在函数中局部变量的声明只使用一个关键字var, 而所有的变量声明放在一起, 若是赋值语句则单独占一行.

    var i, len,
    　　 value = 10,
    　　 result = value + 10;

函数也和变量一样, 也是被优先解释的! 所以都建议函数应该先声明后使用, 且Crockford还建议: 局部函数的声明应该紧跟在局部变量生命的下面

    function doSomethingWithItems( items ) {
    　　var i, len,
    　　　　 value = 10,
    　　　　 result = value + 10;

    　　function doSomething( item ) {
    　　　　// do something
    　　}

    　　for ( i=0, len = items.length; i < len; i++ ) {
    　　　　doSomething( items[ i ] );
    　　}
    }

还有一点需要**注意**的, 在块语句中, 不应该出现函数声明语句!

    if ( condition ) {
    　　function doSomething() {
    　　　　alert( "Hi!" );
    　　}
    } else {
    　　function doSomething() {
    　　　　alert( "Yo!" );
    　　}
    } // 除了firefox会判断condition以为,其余的浏览器均执行!最后导致函数被重写!

对于立即执行的函数

    var value = function() {
    　　// function body
    　　return {
    　　　　message: "Hi"
    　　}
    }();

咋看起来这是一个匿名函数, 但是浏览到最后发现`()`的时候才知道这是一个立即执行函数! 因此最好区别一下提高代码的可阅读性!

    var value = (function() {
    　　// function body
    　　return {
    　　　　message: "Hi"
    　　}
    }());

其实我感觉这样还有一个好处就是, 给`value`的赋值语句块建立了一个封闭的作用域!　

## 相(不)等判断　

首先说`==`与`!=`: 在比较前会**进行变量类型的转化**

    if( 5 == "5" );　　// true: string的5会变成number的5
    console.log( 2 == true );　　// false: true会变成1,故导致不相等

所以判断相等的时候一定要使用`===`与`!==`,用他们进行比较的是不会发生类型转换, 故两个变量的类型不一样的时候是不会相等的!

不要使用`eval()`, `Function()`(传递字符串来创建函数), 并且
`setTimeOut/setInterval1`里面的执行部分不要是字符串, 而应该改写成函数.

    setTimeout( "document.body.style.background = 'red'", 50 );

    //改写成:
    setTimeout( function() {
    　　document.body.style.background = 'red';
    }, 50 );
    不要使用String, Number, Boolean来创建实例

    // 直接这样做更好
    var str = 'some string';
    var num = 10.8;
    var bl = false;

## 从代码中分离配置数据

代码的本质就是一堆指令, 然后就是通过这些指令来一顿的修改数据或者传递数据, 然后产
生设想的结果.

对于一些插件, 当我们需要根据自己的需求进行修改数据时就必须要涉及到修改源代码. 很
有可能在不知情的情况下就修改错了东西导致插件不能正常运行, 因此对于一个好的应用来
说把配置数据和代码分离是一种非常好的设计方式.

#### 什么是配置数据?

配置数据就是一些硬编码的数据. 如:

    // 嵌入到代码中的配置数据
    function validate(value) {
        if (!value) {
            alert("Invalid value");
            location.href = "/errors/invalid.php";
        }
    }

    function toggleSelected(element) {
        if (hasClass(element, "selected")) {
            removeClass(element, "selected");
        } else {
            addClass(element, "selected");
        }
    }

根据对上面代码的观察, 我们剥离出其中的配置数据

    var config = {
        MSG_INVALID_VALUE: "Invalid value",
        URL_INVALID: "/errors/invalid.php",
        CSS_SELECTED: "selected"
    };

    // 然后代码修改为这样
    function validate(value) {
        if (!value) {
            alert(config.MSG_INVALID_VALUE);
            location.href = config.URL_INVALID;
        }
    }

    function toggleSelected(element) {
        if (hasClass(element, config.CSS_SELECTED)) {
            removeClass(element, config.CSS_SELECTED);
        } else {
            addClass(element, config.CSS_SELECTED);
        }
    }

## 适当的`Throw Error`为调试代码

从程序员的角度来讲, 我们要做的是尽量的避免错误, 而不是抛出错误. 但是在JavaScript
中, 适当的抛出错误是一门艺术! 当你在一些容易出错的地方设置抛出错误时, 这将会大大
减少你的debugging时间.

#### Error对象

错误就是程序中一些不希望发生的东西发生, 或者是传递给函数的错误参数; 或者是数值运
算中不合法的操作符等. 编程语言会定义一些规则, 当错误发生的时候程序员能准确的定位
到它. 当然, 若程序执行没有预期的结果并且也没抛出错误的话对调试来说相当的困难, 所
以说适当的抛出错误对于程序员来说未必是坏事.

由于一些浏览器的错误提示对于错误的准确定位不是很准确, 因此抛出自定义的错误信息对
调试来说有事半功倍的效果.

#### JavaScript中的错误机制

简单的通过`throw`来抛出一个错误, 其中`Error`是最典型的.

    throw new Error('Something bad happended');

`Error`是JS内建对象, 接收一个字符串参数. 这个参数就是弹出的错误信息.但是这个错误
信息不能被`try-catch`结构捕获到.

当然, 如果你喜欢, 你可以抛出任何类型的数据

    throw { name: "poised-flw" };
    throw true;
    throw 1234566;
    throw new Date();

但是需要记住一点, 当不是通过`try-catch`结构时; `throw`抛出的任何值一定会导致一个
错误!

#### 抛错的优点

反正一个原则, 抛错的目的在于: 方便快捷的调试出错信息, 至于信息怎么定义看个人的爱
好.

    function getDivs( element ) {
        return element.getElementsByTagName("div");
    }

这个函数的目的在于返回一个节点元素范围内的所有div节点. 前提是`element`必须是DOM
元素. 当`element`为`null`时, 就会抛出错误:

    TypeError: Cannot call method 'getElemntsByTagName' of null

只是大概的告诉了你`getElementsByTagName`有错, 但是当页面中有很多这个方法的时候寻
找起来相当不方便, 因此DIY自己的错误提示信息:

    function getDivs(element) {
        
        if (element && element.getElementsByTagName) {
            return element.getElementsByTagName("div");
        } else {
            throw new Error("getDivs(): Argument must be a DOM element.");
        }
    }

这样, 再当错误发生的时候就能准确的定位到发生错误的位置了.

#### 何时候抛出错误

由于JS中并没有类型或者参数的检查, 因此在一些函数中需要对传递的参数进行类型检测.

    // Bad: Too much error checking
    function addClass(element, className) {
        if (!element || typeof element.className != "string") {
            throw new Error("addClass(): First argument must be a DOM element.");
        }

        if (typeof className != "string") {
            throw new Error("addClass(): Second argument must be a string.");
        }

        element.className += " " + className;
    }

这个函数的功能只是简单的给一个给定的元素添加一个class, 太多冗余的检测:

    // Good
    function addClass(element, className) {
        if (!element || typeof element.className != "string") {
            throw new Error("addClass(): First argument must be a DOM element.");
        }

        element.className += "" + className;
    }

#### `try-catch`语句

基本语法是这样的:

    try {
        somethingThatMightCauseAnError();
    } catch (e) {
        handleError(e);
    }

当错误发生在`try`块的时候, 就会马上停止执行并且跳到`catch`块. 当`catch`块中提供
了错误处理的时候将会被执行. 还有一种结构是带`finally`的.

    try {
        somethingThatMightCauseAnError();
    } catch (e) {
        handleError(e);
    } finally {
        continueDoingOtherStuff();
    }

但是这个结构有给棘手的地方, 例如: 当`try`块中包含有`return`语句的时候, `return`
语句并不能被真正的执行, 它必须等到`finally`执行完后才能执行. 由于这个问题
`finally`使用的并不是很频繁, 但是在错误处理方面`finally`还是一把利器.

有一点需要注意: `catch`中不能为空.

    // Bad
    try {
        somethingThatMightCauseAnError();
    } catch (e) {
        // noop
    }

当错误发生的时候, 你应该想的是怎么去从错误中恢复它, 不管怎样, 对于发生的错误都应
该进行处理而不是忽略它.

## 不要修改别人的对象

时刻记住这几条规则:

1. 不要重写别人的方法

2. 不要在别人的对象上随意添加方法, 或许下次这个库更新的时候就会加上这个方法呢? 

3. 不要随便删除别人库中的方法, 或许库中的方法都有很强的依赖关系

当然, 若是自己一个开发项目, 别人的东西想怎么改就在改. 但是团队开发中, 按照自己的
意愿改了不但会导致命名冲突, 还有可能会发生很多意想不到的事. 所以最好的方法就是别
动别人的, 想添加额外的通过别人给你题动的接口.

如jQuery的extend:

    $.extend();

#### 基于对象的继承

在ECMAScript5中能通过`Object.create()`方法很容易的实现基于对象的继承而不需要构造
函数.

    var person = {
        name: 'poised-flw',
        syaName: function() {
            alert(this.name);
        }
    };

    var myPerson = Object.create(person);
    
    myPerson.sayName(); // 'poised-flw'

基于对象`person`创建了一个对象`myPerson`, 然后`myPerson`就能访问`person`中的所有
属性和方法. 除非`myPerson`重写了自己的方法或者属性.

    myPerson.sayName = function() {
        alert('my own Property');
    }

    myPerson.sayName(); // "my own Property"
    person.sayName();   // "poised-flw"

`Object.create()`方法还接收第二个参数, 用来给创建的实例对象添加自己的属性或者方
法.

    var myPerson = Object.create(person, {
        name: {
         value: "Greg"
        }
    });

    myPerson.sayName(); // "Greg"
    person.sayName();   // "poised-flw"

#### 基于类的继承

就是通过一个构造函数的`prototype`属性来继承一个内建的对象实例.

    function MyError( message ) {
        this.message = message;
    }

    MyError.prototype = new Error();    // 通过原型链继承Error的实例, Error称为超类

这样, 当通过MyError创建一个实例时, 它将能访问到它自己的属性或者方法以及继承自
`Error`的属性或者方法.

    var error = new MyError("Something bad happended");

    console.log(error instanceof Error);    // true
    console.log(error instanceof MyError);  // true

可见, 基于类的继承主要包含两个步骤:

1. 原型链继承

2. 通过构造函数创建实例实现继承

>

    function Person(name) {
        this.name = name;
    }

    function Author(name) {
        Person.call(this, name);    // inherit constructor
    }

    Author.prototype = new Person();
    
在上面的代码中, `Author`类继承自`Person`, 事实上`name`属性被`Person`类管理. 所以
`Person.call(this, name)`是调用`Person`这个构造函数来定义`name`属性. 此时
`Person`中的`this`指向`Author`对象, 故最终`name`成为了新的`Author`对象上的一个属性.

    var person = new Author('poised-flw');

    person.name;    // "poised-flw"
    person.constructor; // "Person"

    person instanceof Author;   // true
    person instanceof Person;   // true

可以看出, 基于类的继承允许你灵活的创建新的对象, 定义一个类的时候允许你创建很多的
实例. 且这些实例都是继承自同一个超类的. 当然你的新类中就可以根据自己的需求定义自己的属
性或者方法.

#### 阻止修改类

有三种模式: `Prevent extension`, `seal`, `freeze`. 前者不允许添加方法或者属性,
但是能修改或者删除某个属性或者方法;接下来的在前面一个的基础上不允许删除属性或者方法;
最后一个在上一个的基础上不允许修改属性或者方法, 即对象上的一切都是只读的.

每种模式都有两个方法, 一个是进入这种模式, 还有一个是检查是否处于这个模式, 返回布
尔值.

    var person = {
        name: "poised-flw"
    };

    // 锁定这个对象
    Object.preventExtension( person );

    console.log( Object.isExtensible( person ) );   // false

    // 现在来修改它的属性试试
    person.age = 21;

    person.age; // 'undefined'

在`strict`模式中如上的修改是会报错的. 其它的两种方法用法和上面相似.

    Object.seal(person);
    Object.isSealed(person);

    Object.freeze(person);
    Object.isFrozen(person);

所以在自己的库开发中, 可以通过上面的几种方式来阻止类被修改. 当然, 作者还建议, 若
阻止了修改, 则强烈建议使用`strict`模式, 因为在非严格模式下, 修改一个类的时候虽然
失败了但是没有任何的提醒, 但是在严格模式下当你试图修改一个锁定的类时将会抛出错误
.
