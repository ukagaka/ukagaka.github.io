---
layout: post
keywords: Start
description: Laravel学习笔记
title: Laravel学习笔记
categories: [Laravel]
tags: [Laravel]
group: archive
icon: globe
---




## 1. 模板页上的内容覆盖子页面上的内容
在子页面中可以使用 `@parent` 指令来显示模板页上的内容，前提是在布局模板中使用`@section`指令用来指定覆盖的区域


    <!-- 存放在 resources/views/layouts/master.blade.php -->
    <html>
        <head>
            <title>App Name - @yield('title')</title>
        </head>
        <body>
            @section('sidebar')
                This is the master sidebar.
            @show

            <div class="container">
                @yield('content')
            </div>
        </body>
    </html>


    <!-- 存放在 resources/views/layouts/child.blade.php -->

    @extends('layouts.master')

    @section('title', 'Page Title')

    @section('sidebar')
        @parent

        <p>This is appended to the master sidebar.</p>
    @endsection

    @section('content')
        <p>This is my body content.</p>
    @endsection


子模板的@parent处被模板的 `This is the master sidebar`.  给替换掉了。注意，子模板位置的`<p>This is appended to the master sidebar.</p>`
并没有覆盖掉，只覆盖了`@parent`位置处


## 2. 在视图中引入另外一个视图
在使用`@include`指令引入一个视图，所引入视图中的变量等，在本视图中依然有效

    <div>
        @include('shared.errors')

        <form>
            <!-- Form Contents -->
        </form>
    </div>

尽管被包含的视图继承所有父视图中的数据，还可以传递额外参数到被包含的视图：

    @include('view.name', ['some' => 'data'])

注：不要在 Blade 视图中使用 `__DIR__` 和 `__FILE__` 常量，因为它们会指向缓存视图的路径。


## 3. blade模板引擎的特殊用户
@{{ $name }} 不使用{{}}进行解析。主要针对有些前端框架使用的也是{{}}
{{ $name or 'Default'}}  表示如果给定的值（$name）没有的话，使用默认值(Default)
{{ isset($name)?$name:'Default' }} 用法同上，三目运算
@unless 除非的意思。除非是怎么样，否则的话才会输出
    例：
    
    @unless($score > 60)
        不及格
    @endunless
如果分数大于60的话不执行里面的语句，否则的话才会输出。如果分数大于60不输出内容，小于60输出不及格



## 4. `{{}}` 和 `{!! !!}`的区别
`{!! !!}` 对代码会进行转义， ``{{}}`不会对代码进行转义
比如有一个变量，存储的是一段HTML标签或者JS，那么`{{}}`会直接输出这些进行显示，而`{!! !!}`会把它当作HTML进行解析

例：在一个控制器内

    $name = '<span style="color:red">Hello Word</span>';
    return view('index')->with('name',$name);

那么，在视图里，`{!! $name !!}` 输出的是红色的 Hello Word，而`{{ $name }}`输出的是`<span style="color:red">Hello Word</span>`


## 5. 使用php artisan命令
1、 使用 `php artisan make:model --migration Post`
会在app目录下创建模型类 post
会在`database/migrations`目录下创建 post迁移用数据库


## 6. 在视图中显示URL连接的三种方式
### 1、 直接写id法
    <a href="/articles/{{ $article->id }}"></a>
### 2、 使用URL函数法
    <a href="{{ url('articles', $article->id) }}"></a>
### 3、 使用控制器方法
    <a href="{{ action('ArticlesController@show', [$article->id]) }}"></a>


## 7. module特殊用法
###  1、 使用 `setFieldNameAttribute` 可以在数据存入数据库之前，对数据进行处理，中间的fieldName为要处理的字段名
例：

    class Article extends Model
    {
        protected $fillable = ['title', 'content', 'published_at'];
        public function setPublishedAtAttribute($date){
            $this->attributes['published_at'] = Carbon::createFromFormat('Y-m-d', $date);
        }
    }
上面这个例子表示在存入数据库之前，对published_at字段进行处理。把接收到的时间字段给处理后，在存入数据库
前面的set和后面的Attribute为关键字，中间的字段名为驼峰写法

### 2、 使用 scopeMethodName 定义一个查询语句用方法
例：

    //Controller里使用
    $articles = Article::latest()->published()->get();  //使用了自定义的published方法
    //model里
    public function scopePublished($query)   //$query 表示传入进来的查询语句
    {
        $query->where('published_at', '<=', Carbon::now());   //表示查询时间小于或等于当前时间的数据
    }

注意scope为关键字，后面方法名为驼峰法，第一个字母大写，需要接收查询语句擦拭，但是不需要再使用的时候传递。


## 8. Carbon类的使用
如果想把自己定义的时间字段作为Carbon对象进行使用的话，需要在控制器内定义一个属性 $dates
然后把字段名赋值给 $dates
例：

    class Article extends Model
    {
        protected $fillable = ['title', 'content', 'published_at'];
        protected $dates = ['published_at'];
    }
    Carbon::now() 表示输出当前时间


## 9. 自动生成的created_at字段用法
自动生成的这个字段不属于普通的时间，而是作为一种Carbon对象来存储的
### 1、 使用$article->created_at，输出的是Carbon对象
### 2、 使用$article->created_at->year，输出的是年份
### 3、 使用$article->created_at->diffForHumans()，输出的是多少时间前发布的



## 10. 路由的参数筛选
路由里的接收的参数可以使用正则进行过滤，使用正则可以匹配给定过来的参数是否符合规则
例：

    Route::get('user/{name}', function ($name) {
        //
    })->where('name', '[A-Za-z]+');


## 11. ENV配置
config/app.php 里可以直接更改env里的配置为什么还需要在env文件里填配置。
通过代码可以发现，它是优先调用evn里的配置，如果存在的话，直接使用env里的配置，如果不存在才会使用本文件里的配置。
好处是，可以在.git上把env文件给屏蔽掉，这样其它人在使用的时候不清楚数据库的真实地址和用户名


## 12. 路由
路由文件里为什么每条路由写一次，这样有什么好处？
每条路由写一次利于管理，特别在一个请求比较多的情况下可以知道每个文件的请求。
在重构的时候也可以很方便的知道哪些是没用可以删掉的请求。