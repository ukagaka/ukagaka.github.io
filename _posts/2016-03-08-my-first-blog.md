---
layout: post
keywords: Start
description: docker学习问题解决
title: docker学习问题解决
categories: [Docker]
tags: [Docker]
group: archive
icon: globe
---

## 1. Docker从生产到发布流程
本地创建Dockerfile文件，并安装测试
然后递交给运维人员Dockerfile文件
运维人员使用安装Docker和Docker Compose
执行Docker-compose up 启动容器
（环境第一次执行Docker-compose up时会通过原始镜像生成一个生产镜像，生产镜像的名称以文件夹命名）
然后运维人员测试
测试完成后Dockerfile递交给其他开发人员


## 2. 搭建LNMP环境是否都把环境都搭载一个镜像里
分开镜像，一个容器只运行一个服务为最优
一个容器一个服务的话，以后升级版本的话非常方便


## 3. 原始镜像用哪个？
继承官网的服务镜像，如mysql，就FROM mysql:5.6


## 4. 代码数据存在哪里
存放在本地，使用Volumes挂载


## 5. 生产环境中在增加新的功能，镜像是否需要重建，Dockerfile是否重新生成？
？？？？