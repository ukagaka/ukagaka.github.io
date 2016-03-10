---
layout: post
keywords: Start
description: docker-file命令
title: docker-file命令
categories: [Docker]
tags: [Docker]
group: archive
icon: globe
---


例子：

    FROM ubuntu:14.04
    MAINTAINER myname "myemail@outlook.com"
    RUN apt-get update
    RUN atp-get install -y nginx
    EXPOSE 80

### 1. FROM
格式为 `FROM <image>`或 `FROM <image>:<tag>`。<br>
第一条指令必须为 FROM 指令。并且，如果在同一个Dockerfile中创建多个镜像时，可以使用多个 FROM 指令（每个镜像一次）。

### 2. MAINTAINER
格式为 `MAINTAINER <name>`，指定维护者信息。<br>
(PS:可有可无，推荐提供一些说明)

### 3. RUN
格式为 `RUN <command>` 或 `RUN ["executable", "param1", "param2"]`。<br>
前者将在 shell 终端中运行命令，即 /bin/sh -c；后者则使用 exec 执行。<br >
指定使用其它终端可以通过第二种方式实现，例如 RUN ["/bin/bash", "-c", "echo hello"]。<br>
每条 RUN 指令将在当前镜像基础上执行指定命令，并提交为新的镜像。当命令较长时可以使用 \ 来换行。

### 4. EXPOSE
格式为 `EXPOSE <port> [<port>...]`。<br>
告诉 Docker 服务端容器暴露的端口号，供互联系统使用。在启动容器时需要通过 -P，Docker 主机会自动分配一个端口转发到指定的端口。

### 5. CMD
支持三种格式<br>

- CMD ["executable","param1","param2"] 使用 exec 执行，推荐方式；
- CMD command param1 param2 在 /bin/sh 中执行，提供给需要交互的应用；
- CMD ["param1","param2"] 提供给 ENTRYPOINT 的默认参数；

指定启动容器时执行的命令，每个 Dockerfile 只能有一条 CMD 命令。如果指定了多条命令，只有最后一条会被执行。<br>
如果用户启动容器时候指定了运行的命令，则会覆盖掉 CMD 指定的命令。

### 6. ENTERYPOINT
两种格式：

- ENTRYPOINT ["executable", "param1", "param2"]
- ENTRYPOINT command param1 param2（shell中执行）。

配置容器启动后执行的命令，并且不可被 docker run 提供的参数覆盖。<br>
每个 Dockerfile 中只能有一个 ENTRYPOINT，当指定多个时，只有最后一个起效。


### 7. ADD
格式为 `ADD <src> <dest>`。<br>
该命令将复制指定的 <src> 到容器中的 <dest>。 其中 <src> 可以是Dockerfile所在目录的一个相对路径；也可以是一个 URL；还可以是一个 tar 文件（自动解压为目录）。


### 8. COPY
格式为 `COPY <src> <dest>`。<br>
复制本地主机的 <src>（为 Dockerfile 所在目录的相对路径）到容器中的 <dest>。<br>
当使用本地目录为源目录时，推荐使用 COPY。<br>

### 9. VOLUME
格式为 `VOLUME ["/data"]`。<br>
创建一个可以从本地主机或其他容器挂载的挂载点，一般用来存放数据库和需要保持的数据等。

### 10. WORKDIR
格式为 `WORKDIR /path/to/workdir`。<br>
为后续的 RUN、CMD、ENTRYPOINT 指令配置工作目录。<br>
可以使用多个 WORKDIR 指令，后续命令如果参数是相对路径，则会基于之前命令指定的路径。例如

    WORKDIR /a
    WORKDIR b
    WORKDIR c
    RUN pwd

则最终路径为 /a/b/c。

### 11. ENV
格式为 `ENV <key> <value>`。 指定一个环境变量，会被后续 RUN 指令使用，并在容器运行时保持。<br>
例如

    ENV PG_MAJOR 9.3
    ENV PG_VERSION 9.3.4
    RUN curl -SL http://example.com/postgres-$PG_VERSION.tar.xz | tar -xJC /usr/src/postgress && …
    ENV PATH /usr/local/postgres-$PG_MAJOR/bin:$PATH


### 12. USER
格式为 `USER daemon`。
指定运行容器时的用户名或 UID，后续的 RUN 也会使用指定用户。<br>
当服务不需要管理员权限时，可以通过该命令指定运行用户。并且可以在之前创建所需要的用户，例如：`RUN groupadd -r postgres && useradd -r -g postgres postgres`。要临时获取管理员权限可以使用 gosu，而不推荐 sudo。

### 13. ONBUILD
格式为 `ONBUILD [INSTRUCTION]`。<br>
配置当所创建的镜像作为其它新创建镜像的基础镜像时，所执行的操作指令。<br>
例如，Dockerfile 使用如下的内容创建了镜像 image-A。<br>

    [...]
    ONBUILD ADD . /app/src
    ONBUILD RUN /usr/local/bin/python-build --dir /app/src
    [...]

如果基于 image-A 创建新的镜像时，新的Dockerfile中使用 FROM image-A指定基础镜像时，会自动执行 ONBUILD 指令内容，等价于在后面添加了两条指令。

    FROM image-A
    #Automatically run the following
    ADD . /app/src
    RUN /usr/local/bin/python-build --dir /app/src

    使用 ONBUILD 指令的镜像，推荐在标签中注明，例如 ruby:1.9-onbuild。


## 问题

### 1.RUN和CMD的区别
run名字是在构建镜像的时候运行的，而CMD是运行容器的时候执行的<br>
而cmd一般还会与entrypoint一起使用，作为ENTRYPOINT指令的默认参数

### 2.CMD和ENTRYPOINT的区别
区别在于，ENTRYPOINT命令不会被docker run 提供的参数覆盖，而启动容器的时候用户指定了运行命令，则会覆盖掉CMD命令

### 3.ADD和COPY的区别
区别在于ADD命令包含了类似tar的解压功能，如果是单纯复制文件，Docker推荐使用COPY


## dockerfile启动过程

### 1. 启动是通过一个原始镜像(FROM)，然后执行文件里的每一步操作，执行的每一步生成一个中间层容器，然后执行完以后，生成一个新的镜像，在把中间层容器给删掉

### 1. setp:表示执行的dockerile每一步操作。

### 2. -->Running in 9c87a0679522:表示执行每一步生成的一个容器（中间层容器）

### 3. -->a63e4da99ab4:这是后面紧跟的一个，表示的是，提交以后生成的镜像（中间层镜像）ID

### 4. removing intermediate container cc70f09786f4：表示在得到这个中间层镜像后，删除中间层建立容器。

### 5. Successfully built 3504c6ef75e4：表示build完整之后，最后生成的镜像


## 从基础镜像运行一个容器

- 执行一条指令，对容器做出修改
- 执行类似docker commit的操作,提交一个新的镜像层
- 再基于刚提交的镜像运行一个新容器
>通过观察可以发现，build只删除了中间层容器，但是并没有删除中间层镜像，我们还可以使用docker run 命令，更加中间层生成的ID，进行查看中间层镜像的状态，还可以进行调试


## 再次执行dockerfile启动

### 1. -->Using cache:表示使用了缓存，dockerfile就不会在继续进行构建。如果不使用缓存，可以在docker build后面加上 --no-cache命令，让docker不使用缓存。

### 2. 如果Dockerfile文件有变动，只会对有变动的命令执行build操作，其它还是用缓存（只有在有变动的地方才不使用缓存）

### 3. 可以使用docker history [image] 命令进行查看镜像的构建过程