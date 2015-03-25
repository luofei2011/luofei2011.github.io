---
layout: post
title: "Javascript 笔记(2)----闭包"
description: "完全理解javascript的闭包对深入理解js有很大的帮助"
category: javascript
permalink: /javascript/2013/03/29/learn-javascript-02 
tags: ['闭包']
---
{% include JB/setup %}

在学习闭包之前,要先了解`Javascript`中`作用域(scope)`的相关概念:

## 变量作用域(Gloabl & Local)

1.全局变量能在任何地方被访问;

    var a = 8;
    function a(){
        alert(a);    
    }
    a(); //8
    //假如改写下面一种函数
    function a(){
        alert(a);
        var a = 1;
        alert(a);
    }
    a(); //undifined, 1

后一种情况,在`a()`的作用域中,变量a被重写(rewrite),故第一个`alert`的时候提示a未定义.
<!--more--> 

2.定义在函数内的变量不能被函数外的程序访问到

    function a(){
        var a = 1;
    }
    alert(a);//undefined

3.定义在函数块(if or for loop...)中的变量对外部(第一层函数体)是可见的

    function f1(){
        var a = 1;
        for(var i=1;i<10; i++)
            a++;
        function f2(){
                    if(true)
                var b = 8;
        }    
        alert(i);//10,i在f1()范围内都是可见的
        f2();
        alert(b);//undefined,b的可见性止于f2();
    }
    f1();
    alert(i);//undifined,i的可见性止于f1();

4.若函数`f1()`中嵌套另一个函数`fn()`,则`f2()`能访问的变量将是它自己内部定义的加上父级函数(这里是:`f2()`)的变量.

## 函数作用域(Lexical Scope)

在函数被定义的时候(不是执行的时候),函数的"环境"就被创建.

    function f1(){ var a =1; f2();}
    function f2(){ return a; }
    //error: a is not defined .当f2被定义(不是执行)的时候,在他自己的作用域和Gloabl scope中并未发现a.
    f1();
当一个函数被定义的时候,他就"记住"了他所处的环境--作用域链;就像上面的程序,f1(),f2()都是定义的全局函数,因此他们的作用域都是Gloabl Scope.因此当f2();执行的时候自然不能访问f1()内部的变量.这时两者的作用域分别为:

1.`f1()`;全局变量+自己内部变量;

2.`f2()`;只能访问全局范围内的变量.

同样地:做如下的修改

    function f1(){ var a =1; return f2();}
    function f2(){ return a; }
    //error: a is not defined.
    f1();
同上:此时的`f1,f2`所处的环境都是`Window`,属于全局函数,f2自然也不能访问到同级别的f1中的变量.在f2定义的时候,并没有一个全局变量叫'a'的....

做如下改动:

    var = 5;
    f1(); //5
    a = 55; //缺省的全局变量
    f1(); //55
    delete a;//true
    f1(); // a is not defined
    delete f2();//true
    f1(); //f2 is not defined
    //重新定义下f2;
    var f2 = function() { return a*2; }
    var a = 5;
    f1(); //10

声明一个全局变量a后,f2()就可以正常工作了,因为f2记住了它所处的"环境"--Global Scope,并且它能访问到一切声明在全局的变量.就像这里的a.

故可得出以下**结论**:

当函数被定义的时候,只是记住了当前自己所处的"环境"--作用域.当函数执行的时候,按
照自己能访问的域寻找相应的变量或则函数.注意,这里只能是自己有权访问的范围!(**作用域链**)

## 闭包--打破上面的作用域链限制

![环境]({{ ASSET_PATH }}/img/20130329_01.png)

图(1)

我们把Gloabl Scope想成是整个宇宙,当然他包括一切事物.在这里,它包含变量(a),还有函数(F).

![环境]({{ ASSET_PATH }}/img/20130329_02.png)

图(2)

在全局范围下,每个函数有自己的私有空间,他们能用这个空间存储一些变量,甚至是函数.

![环境]({{ ASSET_PATH }}/img/20130329_03.png)

图(3)

如上图所示:有一个全局环境G,一个全局变量a,全局函数F,以及F中定义的变量b,还有F中私有的方法N和N自己的变量c.则他们的访问规则如下:

最里层的函数能访问到外层变量,反之则不行.

有趣的时,当引入这样一个函数N后,这样的规则将会被打破!---闭包

![环境]({{ ASSET_PATH }}/img/20130329_03.png)
    
图(4)

我们来分析一下,在这里F,N处在同样的外部环境,大家都是全局函数,他们都能记住自己被定义时的环境.

另外的:N还能访问到F-space.故也能访问到变量b,这非常的有趣,因为a和N的位置一样.但
是只有N能访问到b,而a却不能!---**N打破了传统的作用域链**.

**闭包是怎么形成的?**

1.可以在图(3)所示的情况中,定义N是忽略掉关键字var.(定义成了全局的函数).这样N具有双重身份,既是全局函数,但又能访问到F的空间!

    function f1(){
        f2 = function() {
            //
        }
    }

2.通过F把N传递(return)到全局空间.

    function f1(){
        //
        return function f2(){
            //
        }
    }
#### 实例1:

    function f(){
      var b = "b";
      return function(){
        return b;
      }
    }
声明了一个全局函数f(),有一个局部变量b;返回值是一个函数(匿名);把这个返回函数想象成上图中的N.它能访问到特有的环境--"f()的空间"+"全局空间";故它能访问到b;因为f是一个全局函数.你可以这样使用他:

    var n = f();
    n();
神奇的事就这么发生了,这里的新函数n()能访问到f的私有空间!

#### 实例2:

    var n;
    function f() {
      var b = "b";
      n = function(){
        return b;
      }
    }
    n(); //"b"

So:当我们调用f();的时候会发生什么情况?

一个新的函数n被定义在f里面,不幸的是.定义的时候忘记了加关键字var.导致n变成了全
局函数.**在定义的时间内,n()
都是在f()内部的**,所以n()尽管作为全局函数,但也能访问到f的私有变量或则函数.

#### 实例3:

What is Closure?

从我们上面的这么多讨论可以得到一个比较通俗的理解:闭包就是一种方法:想办法(return/gloabl function)让外界访问到父辈的私有变量.

    function f(arg) {
      var n = function(){
        return arg;
      };
      arg++;
      return n;
    }
    var m = f(23);
    m(); //24

让外界实时感知f()内部私有变量的变化

#### 实例4.循环结构中的闭包

循环结构中的闭包是很容易出现BUG的,如果不注意使用:特别是对概念理解不强的情况下.如下:

    function f() {
      var a = [];
      var i;
      for(i = 0; i < 3; i++) {
        a[i] = function(){
          return i;
        }
      }
      return a;
    }

在f()中我们通过for()循环每次产生一个新的函数(闭包),然后用数组a记录下函数.最后返回a.试想一下a中的内容会是什么?接下来就是见证奇迹的时候....

    var a = f();
    a[0]; //3
    a[1]; //3
    a[2[; //3
哇!怎么会这样???你还可以通过这里了解更多

原理:我们通过循环创建了三个闭包,但是所有的**闭包都是指向变量i**的.由于前面说过,函数定义的时候只是记住了当前所处的环境,并没有记住自己范围内所有变量的值(这些值是可以随时增加/修改/删除的).他们做的都是同一件事---指向i.故在循环结束以后,i都变成了3.这就是产生以上结果的最终原因.

如何改进:

就上面产生的原因来讲,我们只要让三个闭包拥有不同的指向,这个问题就能解决.

    function f() {
      var a = [];
      var i;
      for(i = 0; i < 3; i++) {
        a[i] = (function(x){
          return function(){
            return x;
          }
        })(i);
      }
      return a;
    }

是的,在这里通过self-invoking的方式,在每个闭包刚定义的时候就已经执行了---等等....这个执行的意思是:此时的x并不是一个指向了,而是一个真正的值!

PS:self-invoking大概是如下意思:

    (function() { //... })();
    //第一个()里面是函数主体.第二个括号的意思是执行...第二个()中的参数就是传递给这个函数的参数
改进后的执行结果将是:

    var a = f();
    a[0]; //0
    a[1]; //1
    a[2]; //2
还有一中改进方法:

另外声明一个构造函数:

    function makeClosure(x) {   //构造函数
        return function(){
          return x;
        }
    }

    function f() {
      var a = [];
      var i;
      for(i = 0; i < 3; i++) {
        a[i] = makeClosure(i);
      }
      return a;
    }

#### 实例5.Getter/Setter

想象一个这样一个场景:你拥有一组比较特殊的变量,你不想他们暴露,并且也不希望其他的任何部分代码改变他们的值.方法是:

在这个函数里面提供额外的两个函数---一个用来获取他们的值(gettter),另一个用来设置他们的值(setter).当然,设置值的函数还应该包含一些必要的验证措施.

把函数getter和setter都放在含有特殊变量的函数里面,即他们共享相同的环境--作用域.

    var getter, setter;
    (function() {
      var secret = 0;
      getter = function(){
        return secret;
      };
      setter = function(v){
        secret = v;
      };
    })()

在这个匿名函数里面,定义了两个全局的函数getter和setter,secret是一个无法被外界直接访问的私有变量.将会有如下的工作过程:

    getter(); //0
    setter(88); 
    getter(); //88

#### 实例6:迭代器:展示用一个闭包来完成迭代器的功能

试想一下你有一个非常复杂的数据结构,你想遍历里面的每一项内容,我们实现一个next()方法去遍历他.

下面这个函数接受一个数组输入,然后在函数内部定义一个私有的指针i,i总是指向数组中的下一个元素.

    function setup(x) {
      var i = 0;
      return function(){
        return x[i++];
      };
    }
我们这样调用setup()的时候将会是这样的结果:

    var next = setup(['a','b','c']);
    next(); //"a"
    next(); //"b"
    next(); //"c"
    next(); //undefined
注意,这里有一个问题:setup()函数中的私有变量i是一直存在内存中的!因为闭包会一直依赖它所处的环境,故父函数的变量会一直存在在内存中,滥用闭包将有可能引起内存泄漏!所以在退出闭包前,需要清空不必要的局部变量.
