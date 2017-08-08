---
layout: post
keywords: Start
description: Ubuntu下安装Docker
title: Ubuntu下安装Docker
categories: [PHP]
tags: [PHP]
group: archive
icon: globe
---



>Docker官方分为了两个版本，一个是Docker EE（即企业版，收费），另外一个是Docker CE（社区版，免费）。目前我们自己使用的话社区版完全够用。  
>目前操作系统我用的是ubuntu 16.04

## 1. 安装OverlayFS的支持
如果你Ubuntu的版本为14.04的话，需要安装额外的OverlayFS的支持，如果是16.04的版本因为已经自带了OverlayFS支持，所以不需要安装了

```
$ sudo apt-get update

$ sudo apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual

```


## 2. 安装依赖程序

```
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
```

## 3. 添加Docker的官方GPG密钥

```
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

验证证书是否正确

```
$ sudo apt-key fingerprint 0EBFCD88
```
如果显示的有`9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88`字样，就说明安装证书是正确的，例：

```
pub   4096R/0EBFCD88 2017-02-22
      Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid                  Docker Release (CE deb) <docker@docker.com>
sub   4096R/F273FCD8 2017-02-22
```

## 4. 添加Docker包源
1. 首先要查看Ubuntu的内核版本
```
$ sudo lsb_release -cs
```
这里会显示你的Ubuntu的版本，例如，我的是`xenial`，如果不是的，可以查看官网，进行更改

2. 根据CPU类型选择添加哪种源

amd64：
```
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```
armhf：

```
$ sudo add-apt-repository "deb [arch=armhf] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```
s390x：

```
$ sudo add-apt-repository "deb [arch=s390x] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```
（大部分人的都是amd64的CPU，所以这里我们选择amd64的源）


## 5. 安装Docker CE

1. 更新apt包索引。
```
$ sudo apt-get update
```

2. 安装最新版本的Docker CE
```
$ sudo apt-get install docker-ce
```


## 6. 查看docker是否安装成功

```
docker info

```

## 7. 安装docker compose

```
$ sudo curl -L https://github.com/docker/compose/releases/download/$dockerComposeVersion/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

```

PS: 使用compose的版本号替换$dockerComposeVersion，如

```
$ sudo curl -L https://github.com/docker/compose/releases/download/1.14.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

```

## 8. 查看docker-compose是否安装成功

```
docker-compose -v
```

原文链接：[Dennis`s blog](http://ukagaka.github.io/php/2017/08/07/UbuntuDocker.html)  
参考链接：  
[获取Ubuntu的Docker CE](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#prerequisites)  
[安装Docker Compose](https://docs.docker.com/compose/install/)
