---
layout: post
keywords: Start
description: javascript学习笔记
title: javascript学习笔记
categories: [javascript]
tags: [javascript]
group: archive
icon: globe
---




## 1. 原型对象和原型链
`prototype`的主要作用是继承，`prototype`中定义的属性和方法是留给自己的“后代”用的。子类可以完全访问`prototype`中的属性和方法

    function f(){}
    f.prototype.foo = "abc";
    console.log(f.foo); //undefined

通过例子可以看出，自身是访问不到自己的`prototype`的

`__proto__`通常是把父类的`prototype`赋值给它，这样的话，就可以通过这种父类的`prototype`赋值给新对象的`__proto__`属性的形式，一代代传承

    function f(){}
    f.prototype.foo = "abc";
    var obj = new f();
    console.log(obj.foo); //abc

obj对象拥有这样一个原型链以后，当obj.foo执行时，obj会先查找自身是否有该属性，但不会查找自己的`prototype`,当找不到foo时，obj就沿着原型链依次去查找...


    function Animal(name){
        this.name = name;
    }
    Animal.color = "black";
    Animal.prototype.say = function(){
        console.log("I'm " + this.name);
    };
    var cat = new Animal("cat");

    console.log(
       cat.name,  //cat
       cat.color //undefined
    );
    cat.say(); //I'm cat

    console.log(
       Animal.name, //Animal
       Animal.color //back
    );
    Animal.say(); //Animal.say is not a function

cat.color -> cat会先查找自身的color，没有找到便会沿着原型链查找，在上述例子中，我们仅在Animal对象上定义了color,并没有在其原型链上定义，因此找不到。
cat.say -> cat会先查找自身的say方法，没有找到便会沿着原型链查找，在上述例子中，我们在Animal的`prototype`上定义了say,因此在原型链上找到了say方法。


### 1. 原型链的形成真正是靠`__proto__` 而非`prototype`,当JS引擎执行对象的方法时，先查找对象本身是否存在该方法，如果不存在，会在原型链上查找，但不会查找自身的`prototype`。

### 2. 一个对象的`__proto__`记录着自己的原型链，决定了自身的数据类型，改变`__proto__`就等于改变对象的数据类型。

### 3. 函数的`prototype`不属于自身的原型链，它是子类创建的核心，决定了子类的数据类型，是连接子类原型链的桥梁。

### 4. 在原型对象上定义方法和属性的目的是为了被子类继承和使用。


## 2. 作用域
JS中有种特殊情况
如果一个变量没有使用var声明，window便拥有了该属性，因此这个变量的作用域不属于某一个函数体，而是window对象

    functtion varscope(){
        foo = "I‘m in function";
        console.log(foo);//I‘m in function
    }
    varscope();
    console.log(window.foo);//I‘m in function

作用域链就是一个函数体中嵌套了多层函数体，并在不同的函数体中定义同一变量，当其中一个函数访问这个变量时，便会形成一条作用域链

    foo = "window";
    function first(){
        var foo = "first";
        function second(){
            var foo = "second",
            console.log(foo);
        }
        function third(){
            console.log(foo);
        }
        second();   //second
        third();    //first
    }
    first();

当执行second时，JS引擎会将second的作用域放置链表头部，其次是first的作用域，最后是window对象
second形成的作用域链：`second->first->window`
third形成的作用域链：`third->first->window`

    var foo = "window";
    var obj = {
        foo : "obj",
        getFoo : function(){
            return function(){
                return this.foo;
            };
        }
    };
    var f = obj.getFoo();
    f(); //window
    
在实例化obj.getFoo方法的时候，在getFoo方法作用域里,`this`代表getFoo函数
但是在输出的时候，又定义了一个匿名函数，所以`this`就代表了这个匿名函数
相当于赋值给f的是这个匿名的函数，所以找到的是window,即

    var foo = "window";
    var f = function(){
        return this.foo;
    }


## 3. 闭包
当一个内部函数被其外部函数之外的变量引用时，就形成了闭包

    function A(){
        var count = 0;
        function B(){
           count ++;
           console.log(count);
        }
        return B;
    }
    var c = A();
    c();// 1
    c();// 2
    c();// 3

因为被引用所以，A对象不会被GC回收（GC回收的机制是：如果一个对象不再被引用，那么这个对象就会被GC回收，否则这个对象一直会保存在内存中）

    var f = function(document){
        var viewport;
        var obj = {
            init:function(id){
                viewport = document.querySelector("#"+id);
            },
            addChild:function(){
                viewport.appendChild(child);
            },
            removeChild:function(child){
                viewport.removeChild(child);
            }
        }
    }
    f(document);
    
obj 是在 f 中定义的一个对象，这个对象中定义了一系列方法， 执行window.jView = obj 就是在 window 全局对象定义了一个变量 jView，并将这个变量指向 obj 对象，即全局变量 jView 引用了 obj . 而 obj 对象中的函数又引用了 f 中的变量 viewport ,因此 f 中的 viewport 不会被GC回收，会一直保存到内存中，所以这种写法满足闭包的条件。



参考的博客文[一像素博客](http://www.cnblogs.com/onepixel/)
