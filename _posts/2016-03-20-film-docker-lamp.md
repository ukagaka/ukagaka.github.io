---
layout: post
keywords: Start
description: Docker-lanp简单环境搭建Dockerfile编写
title: Docker-lanp简单环境搭建
categories: [Docker]
tags: [Docker]
group: archive
icon: globe
---



>本文是在你了解Docker的基础上进行编写


目录结构

    ~/Dockerfiles
    ├── mysql
    │   └── Dockerfile
    │
    ├── nginx
    │   ├── Dockerfile
    │   ├── nginx.conf
    │   └── sites-enabled
    │       ├── default.conf
    │       └── demo.conf
    │
    ├── php
    │  ├── Dockerfile
    │  ├── php-fpm.conf
    │  ├── sources.list
    │  └── php.ini
    │
    └──docker-compose.yml

项目结构

    /var/www
    ├── data
    │
    ├── demo
    │
    ├── log
    │  ├── nginx
    │  └── php
    │
    └──docker-compose.yml

>首先我们需要创建目录log目录用来存放各个日志文件，以后`log`文件夹下的`nginx`和`php`文件夹。<br>
>我们共享的目录默认为`/var/www`目录，共享到容器的目录也是`/var/www`目录，如果想更改，请更改各个配置文件<br>

### 1、Nginx的编写

    FROM nginx:1.9.0
    ADD nginx.conf /etc/nginx/nginx.conf
    ADD sites-enabled/* /etc/nginx/conf.d/
    EXPOSE 80
    VOLUME ["/var/www"]

这里会复制2个配置文件
一个`nginx.conf`文件用来指定`nginx`日志文件存放的位置。为了数据能永久保存，我们指定日志存到我们的共享目录下，方便后期的查找。<br>
另外是`sites-enabled`的目录下，我们存放了虚拟目录的配置文件。<br>

### 2、PHP的编写

    FROM php:5.6-fpm
    ADD sources.list /etc/apt/sources.list
    RUN apt-get update && apt-get install -y \
    	git \
        libmcrypt-dev \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng12-dev \
        && rm -r /var/lib/apt/lists/*
    RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
        && docker-php-ext-install zip \
        && docker-php-ext-install gd \
        && docker-php-ext-install mbstring \
        && docker-php-ext-install mcrypt \
        && docker-php-ext-install pdo_mysql
    ADD php.ini /usr/local/etc/php/php.ini
    ADD php-fpm.conf /usr/local/etc/php-fpm.conf
    RUN curl -sS https://getcomposer.org/installer | php \
        && mv composer.phar /usr/local/bin/composer \
        && chmod 755 /usr/local/bin/composer
    WORKDIR /var/www
    RUN usermod -u 1000 www-data
    EXPOSE 9000
    VOLUME ["/var/www"]

这里我们需要安装一些扩展，用来使php和mysql进行连接，而官方给我们提供了一个`docker-php-ext-install`指令，可以快速的安装GD、PDO等常见扩展<br>
唯一的缺点是必须使用`apt-get update`更新下才可以安装，这样导致镜像非常大<br>
另外因为安装扩展的时候源非常慢，所以这里我们创建了一个`sources.list`，进行更换为阿里源，这样在更新安装的时候，速度就非常快<br>
另外我们还复制了2个文件<br>
- `php-ini`是开启了一些我们常用的功能扩展<br>
- `php-fpm.conf`是更改了我们的日志文件存放的位置<br>
并且安装了composer，并且使composer进行了全局配置<br>

### 3、msyql编写

    FROM mysql:5.6
    RUN usermod -u 1000 mysql && chown mysql.mysql /var/run/mysqld/
    EXPOSE 3306
    VOLUME ["/var/www"]

mysql编写的时候只要注意权限进行设置下即可。<br>

### 4、docker-compose的编写
使用官方提供的DocerCompose可以使容器很好的连接起来，更容易进行管理<br>

    nginx:
      build: ./nginx
      ports:
        - "80:80"
      links:
        - "php"
      volumes:
        - /var/www:/var/www

    php:
      build: ./php
      ports:
        - "9000:9000"
      links:
        - "mysql"
      volumes:
        - /var/www:/var/www

    mysql:
      build: ./mysql
      ports:
        - "3306:3306"
      volumes:
        - /var/www/data/mysql:/var/lib/mysql
      environment:
        MYSQL_ROOT_PASSWORD: 123456

编写的时候一定要注意各个端口的映射和共享文件的映射，通过links可以连接各个容器，即便后期增加新的服务，只要有镜像都可以使用links很方便的连接起来<br>
在执行的时候使用`docker-compose up`即可启动并构建所有容器。<br>

<br>
<br>

问题：<br>
1、使用Docker-composer会出现版本错误或者版本不同，所以，Docker和DockerCopose的的版本要对应（不是一样的版本）。<br>
- 如果出现版本的问题，可以到官网上，有它们的安装方法，直接覆盖安装即可<br>

2、启动过程中提示log打开不成功或者是，或者没有这个的文件，说明在本地共享之前没有创建这个目录<br>
- 在构建镜像的时候，虽然使用mkdir创建了文件夹，但是因为数据是共享出来的，所以会覆盖这些文件夹，所以一定要在执行`docker-compose up`的时候先<br>
- 把相应的文件夹给创建好<br>

3、PHP在使用`docker-php-ext-install`命令安装扩展的时候会报错<br>
- 这种情况，一般都是没使用`apt-get install`安装docker命令的扩展所导致的，可以到Docker镜像的官网里找到这个镜像，查看扩展的安装方法<br>

4、镜像构建以后docker的镜像文件都比较大<br>
- 一般都是执行过`apt-get update`后才会文件比较大，所以尽量少执行，另外还有一些人使用alpine镜像进行构建镜像，这样构建出来的镜像只有几十M，例子<br>

    FROM alpine:latest
    MAINTAINER alex alexwhen@gmail.com
    RUN apk --update add nginx
    COPY . /usr/share/nginx/html
    EXPOSE 80
    CMD [“nginx”, “-g”, “daemon off;”]

