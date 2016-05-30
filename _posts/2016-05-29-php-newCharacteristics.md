---
layout: post
keywords: Start
description: PHP新特性笔记
title: PHP新特性笔记
categories: [PHP]
tags: [PHP]
group: archive
icon: globe
---



### 1. 命名空间
    使用namespace进行定义，导入时可以使用use

### 2. 接口
    像定义类一样使用 interface

### 3. 性状
    使用关键字trait定义，导入时在类里使用use导入

### 4. 生成器
    使用关键字yield。生成器从不返回值，只产生值

### 5. 闭包和匿名函数
    闭包是指在创建时封装周围状态的函数。
    匿名函数是指没有没有名称的函数。
    可以使用use关键字，把外部的变量附加到闭包上

### 5. 过滤
    使用htmlentities()函数。可以把把字符转换为 HTML 实体。
    filter_var 使用特定的过滤器过滤一个变量，还可以用来验证数据，比如邮箱
    filter_input 通过名称获取特定的外部变量，并且可以通过过滤器处理它

### 6. 安全
    password_hash  创建密码的哈希
    pasword_verify 验证密码是否和哈希匹配

### 7. 时间
    DateTime 管理日期和时间的类
    DateInterval 表示长度固定的时间段（如：“两天前”），或者相对而言的时间段（如“昨天”）
    DateTimeZone 更改时间时区
    DatePeriod 迭代处理一段时间


参考书籍<br>
    Modern PHP<br>
参考链接<br>
    https://www.insp.top/article/learn-laravel-container<br>