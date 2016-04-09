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




### 1、模板页上的内容覆盖子页面上的内容
在子页面中可以使用 `@parent` 指令来被模板页上的内容给替换掉，前提是在布局模板中使用`@section`指令用来指定覆盖的区域


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


### 2、在视图中引入另外一个视图
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



### 3、`{{}}` 和 `{!! !!}`的区别
`{!! !!}` 对代码会进行转义， ``{{}}`不会对代码进行转义
比如有一个变量，存储的是一段HTML标签或者JS，那么`{{}}`会直接输出这些进行显示，而`{!! !!}`会把它当作HTML进行解析

例：在一个控制器内
    $name = '<span style="color:red">Hello Word</span>';
    return view('index')->with('name',$name);

那么，在视图里，`{!! $name !!}` 输出的是红色的 Hello Word，而`{{ $name }}`输出的是`<span style="color:red">Hello Word</span>`


### 3、使用php artisan命令
1、 使用 php artisan make:model --migration Post
会在app目录下创建模型类 post
会在database/migrations目录下创建 post迁移用数据库