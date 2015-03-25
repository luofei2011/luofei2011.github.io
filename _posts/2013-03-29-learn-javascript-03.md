---
layout: post
title: "Javascript 笔记(3)----对象"
description: ""
category: javascript
tags: ['object']
---
{% include JB/setup %}

### 构造函数

    function Person() {   //大写构造函数名的首字母以区别普通函数
        this.name = 'lf';
    }
    var person = new Person();
    person.name; //"lf";

接受参数的构造函数,个性化定制

    function Person(age){
        this.age = ge;
        this.name = 'lf';
        this.action = function() {
            return "Hello world!" + "I'm" + this.name + "and I'm" + this.age + "old";
        }
    }
    var p1 = new Person(20); //"Hello world!I'm lf and I'm 20 old";

若在创建新对象的时候忘记了new关键字会怎么样?

    var p = Person(20);
    typeof p; //undefined

因为没有加new关键字,就像调用普通函数一样调用Person()方法,注意,这时的this指向的是window对象.
<!--more--> 

### constructor

当一个对象创建的时候,都有一个属性指向构造它的元.----constructor,就像上面的例子:

     p1.constructor; //Person(age)

若你想构造一个和p1大体功能相似的对象,但是又不知道它的原始构造函数时:

    var p2 = new p1.constructor(80);
    p2.name; //"lf"

### instanceof操作符

测试一个对象是否是被特殊的构造函数创建

    function F1() {};
    var f = new F1();
    var o = {};
    f instanceof F1; //true
    f instanceof Object; //false
    o instanceof Object; //true

### Functions that return objects:

除了像前面一样用构造函数和new新建一个对象之外,还可以像普通函数一样通过函数返回一个对象实现对象的创建.

    function factory(name) {
    return {
        name : name;
    };
    }
    var o = factory('one');
    o.name; //"one"
    o.constructor; // Object()

### Passing Objects:

当你复制或则传递一个对象给函数时,你传递的是该对象的指向.他们都是指向该对象的内存空间,能直接改变原对象.

    var original = { howmany: 1 };
    var copy = original;
    copy.howmany; //1
    copy.howmany = 100; //100
    original.howmany; // 100

同样的,对于一个作为函数参数传递的对象,也能在函数里面直接修改原对象.

### Comparing Objects:

当比较两个对象时,只有当两个对象都指向同一片内存空间时,结果才会返回true,比较两个分开的对象.即使他们拥有相同的属性或方法,他们的结果都会返回false.

    var fido = { breed: 'dog' };
    var benji = { breed: 'dog' };
    benji === fido; //false
    benji == fido; //false
    var mydog = benji;
    mydog == benji; //true 这时因为两个对象指向的内存空间是一样的.
    mydog == fido; //false

### Built-in Objects:内置对象

当一个对象被创建的时候:

    var o = {};
    var o = new Object();

就已经继承了一些特有的方法:

    o.constructor
    o.toString()
    o.valueOf() 返回对象o自己的值
    var a = new Array(1,2,3,'four');

    typeof a; // object
    a.toString(); //"1,2,3,four";
    a.valueOf(); //[1,2,3,"four"]
    a.constructor; //Array()

### Array()

    push(),向数组尾追加新值
    pop(),删除数组尾元素
    sort(),排序数组.采用冒泡排序算法
    join(),返回一个用传递参数连接所有数组元素的string.
    var a = new Array(1,2,3);
    a.join('|');
    a; //1|2|3
    slice(),两个参数,第一个是起始位置,第二个是结束位置.两个参数都是从0开始.返回截取的字符串.原数组并没有变.
    splice(),截取+替换,前两个参数是截取范围.后面其他的参数是替换的内容

### Function

    length,返回函数参数的个数
    function myfunction(a,b,c){ return true;}
    myfunction.length; //3
    caller,谁调用了这个函数.

    function A() { return A.caller; }
    function B() { return A; } //调用了A()
    B(); //B()

若A在全局被调用,则A.caller = null.

toString(),这个方法返回函数体的全部代码.

call(),apply(),允许自己的对象从别的对象处借用方法,并且调用这个方法.这样呢给你充分的代码复用.

    some_obj.someMethod.call(my_obj,'a','b','c'...);

call()方法能传递这样的参数,第一个参数是需要调用别的对象方法的对象名,后面的参数是是传递给这个方法的.这时原本在some_obj中,指向some_obj的this将会指向my_obj.注意,若cal后面不传参数或则传递了null.则this将只想全局,方法中涉及到的参数将会去全局中寻找.

    some_obj.someMethod.apply(my_obj,['a','b','c'...]);

apply()与call()的区别仅在于传递的参数,apply需要传递一个数组形式的参数.

##### arguments

返回函数中传递的参数,arguments看起来像数组,但事实上它只是一个看起来像数组的对象,因为它同样拥有下标和length属性,但它并没有数组的slice或则sort方法.arguments拥有自己的NB的属性--callee.

##### callee property.

This contains a reference to the function being called. If you create a function
that returns arguments.callee and you call this function, it will simply return a
reference to itself.

     function f() { return arguments.callee；}
     f(); //f()

一个有趣的应用:让self-invoking function执行多次.

    (
        function(count){
            if (count < 5) {
                alert(count);
                arguments.callee(++count);
            }
        }
    )(1);

将会提示1,2,3,4

### Boolean

一个对象,即使是空对象也是真的.

### Number

toString(),接受参数,把数据转换成相应的进制.

### String

length属性

这样创建的两个string是有区别的:

    var obj = new String('world'); //typeof is Object

    var primitive = 'Hello'; //typeof is string

特别地,一个空对象是true,但是一个空string却是false:

     Boolean(""); //false
     Boolean(new String("")); //true

toUpperCase()

toLowerCase()

charAt(),返回索引.

indexOf(),返回第一次匹配的位置.下标从0开始记.若传递第二个参数s.indexOf('a',2)将会返回a第二次出现的位置//除了寻找单个的字符外,还可以查找一个短语或则句子.若找到则返回大于或等于0的位置,未找到则返回-1 ,故用if语句判断是否找到的时候应该是判断是否 != -1

lastIndexOf()返回最后一个匹配的位置

slice(),substring(),返回截取的片段,两个参数.起始和结束.区别在于:当传递[1,-1]这种区间时,slice()会截取整个字符串,而substring()则把[1,-1]当成[0,0];

split(),根据传递的分割符,把字符欻分割成为相应的数组.

concat(),把两个字符串接到一起.和 "+"的功能差不多.只是concat()不会改变原字符串,只是返回连接以后的新值

### Math:属性都是大写的

    Math.PI; //3.14....
    Math.SQRT2; //1.4..开根号

Math.E

Math.LN2

Math.random();返回0-1的随机数.若别的范围:100*Math.random()+2

((max - min) * Math.random()) + min

Math.round();

Math.floor();

Math.ceil();

Math.pow(a,b);

Math.sqrt(a);

### Date

    var d = new Date(); //Fri Mar 29 2013 12:11:20 GMT+0800 (CST)
    var d = Date(); //"Fri Mar 29 2013 12:13:24 GMT+0800 (CST)"
    d.setMonth();
    d.getMonth();

### RegExp

test();正则匹配返回true或false

match(),返回一个匹配的数组

serch()返回第一次匹配的位置

replace(),替换匹配的内容

split(),接受正则的参数来分割字符串成数组

### Error Objects

    try{
        //不确定是否会报错的内容;
    } catch(e){
       //若try的内容出错了,则执行这里的内容
    } finally{
      //再执行这里的东西
    }
