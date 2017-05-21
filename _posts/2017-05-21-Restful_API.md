---
layout: post
keywords: Start
description: Restful API学习笔记
title: Restful API学习笔记
categories: [PHP]
tags: [PHP]
group: archive
icon: globe
---



## 1. 什么是Restful
Restful是互联网软件的架构原则。什么是互联网软件的架构原则呢？互联网软件的架构原则就像MVC或者设计模式一样，一种约定。就像我们日常生活中的，靠右行走，红灯停绿灯行一样。
而Restful就是对于服务器资源之间交互的一种规定。RESTful是面向资源的一种准则。什么是资源，网络上的所有事物都可以被抽象为资源，比如生活中得水资源，能量资源等等，在网络中比如种子，文章，帖子等等。

## 2. 为什么要使用Restful
使用Restful协议最大的好处是，通过这些约定俗成的方法，在别人使用你提供得API接口时，即使用户不查看文档，也知道下一步应该做什么。就行你从上海跑到北京，也知道靠右行走，红灯停绿灯行，而不需要知道在北京的交通规则。

## 3. 既然Restful是一种原则，那么以前是否有实现过类似得约定。
WebService是一种跨编程语言和跨操作系统平台的远程调用技术。WebService通过HTTP协议发送请求和接收结果时采用XML格式封装，并增加了一些特定的HTTP消息头，这些特定的HTTP消息头和XML内容格式就是SOAP协议。 

## 4. Restful与WebService的不同之处。
RESTful相对于比较轻量级。WebService是采用XML封装进行发送和接收结果。RESTful是对资源的，所以安全性不是很高。因为是采用的明文进行传输的。SOAP在请求的时候可以使用证书进行加密。所以对于一些资源得交互，我们一般都采用RESTful，
比如对文章得增删改查，对文件的增删改查等。

## 5. Restful API的设计原则
简单理解就是，由原来所有得GET和POST的请求拆分为GET、POST、PUT、PATCH（不常用，一般都使用PUT）、DELETE，这样刚好对应资源的增删改查。

- GET（SELECT）：从服务器取出资源（一项或多项）。
- POST（CREATE）：在服务器新建一个资源。
- PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
- PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
- DELETE（DELETE）：从服务器删除资源。

具体设计原则请参考：[RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)


## 6. 后端是如何实现Restful的接收呢？
对于后端PHP是如何识别这些请求得呢？使用PHP得内置函数 _SERVER 可以识别出是哪种请求，根据_SERVER获取得不同请求来执行不同得操作


## 7. 前端是如果实现Restful的请求呢？
前端的话，使用会发现只有GET和POST请求，那如何实现其它方式请求的？
第一种是使用AJAX进行请求，AJAX提供了type属性，可以通过设置type属性进行设置。
第二种是使用伪造消息请求头来请求

```

<input type="hidden" name="_method" value="PUT"/>

```

