---
layout: post
keywords: Start
description: Lumen使用Redis指南
title: Lumen使用Redis指南
categories: [PHP]
tags: [PHP]
group: archive
icon: globe
---



>鉴于官方文档过于简单，所以详细写了下使用指南

## 1. 安装扩展
要使用redis必须安装两个扩展

```
 composer require predis/predis
 composer require illuminate/redis
```

>(PS:官方上有要求安装两个安装的版本为`predis/predis (~1.0)`和`illuminate/redis (5.2.*)`，因为目前安装的最新版本就是这两个版本，故使用compose的时候没加版本号，如果你安装后发现不能使用，请在执行composer的时候加上版本号)


## 2. 引入redis支持

在目录`bootstrap/app.php`中要引入redis的扩展

```
$app->register(Illuminate\Redis\RedisServiceProvider::class);
```

## 3. 启用redis辅助函数

> Lumen和Laravel有些不一样，默认'Facades'和'Eloquent'是没有启用的，要想像laravel中使用redis一样，要把文件`bootstrap/app.php`里的'Facades'和'Eloquent'的` $app->withFacades()` 和 `$app->withEloquent()`注释打开就好了

## 4. 配置redis服务器参数
默认系统是调用的`.env`里的redis配置文件，但是一般安装后没有这些参数，可以查看文件路径`vendor/laravel/lumen-framework/config/database.php`中查看有哪些参数需要配置，例如，我的`.env`文件需要配置

```
REDIS_HOST=192.168.1.41
REDIS_PORT=7000
REDIS_PASSWORD=123456
```

## 5. 使用redis
首先要在使用redis的控制器内引入类。`use Illuminate\Support\Facades\Redis`  
然后就可以直接使用redis函数了
```
Redis::setex('site_name', 10, 'Lumen的redis');
return Redis::get('site_name');
```


## 6. 第二种使用redis的方法
>使用辅助函数Cache一样可以调用redis  

首先要在使用redis的控制器内引入Cache类。`Illuminate\Support\Facades\Cache` 
然后就可以直接使用redis函数了

```
Cache::store('redis')->put('site_name', 'Lumen测试', 10);
return Cache::store('redis')->get('site_name');

```

原文链接：[Dennis`s blog](http://ukagaka.github.io/php/2017/08/06/LumenRedis.html)  
