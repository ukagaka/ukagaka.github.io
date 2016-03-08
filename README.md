#Please Delete this line!

## 选择服务商

目前支持Jekyll+Git方式部署博客比较方便的应该是国外的Github与国内的Gitcafe，出于稳定、速度、便捷的角度我们选择Gitcafe，官网地址：[http://gitcafe.com](http://gitcafe.com/signup?invited_by=saymagic)，如没有账号，请自行注册。

## 派生代码库

我将我的博客base版本发布到了Gitcafe，你可以在此[https://gitcafe.com/saymagic/blog](https://gitcafe.com/saymagic/blog),点击`派生`按钮：

![](http://cdn.saymagic.cn/o_1a0efi8uva2p1pjj8qv11dgb9.png)

即可将代码Clone到自己的Gitcafe代码库中:

![](http://cdn.saymagic.cn/o_1a0efps7h1951bguhtvbd39the.png)

接下来你需要做两件事就可以看到自己的博客了：

* 修改项目名称：

    点击项目设置 -> 将项目名称(blog)更改为自己的用户名，例如，下面的账户需要将`blog`改为`827273693 `：
    
    ![](http://cdn.saymagic.cn/o_1a0eg4iat19bm8pr1kasgb01s369.png)
    

* 做一次提交

    派生过来的代码默认情况下Gitcafe只会作为代码存储，不会部署到对应的Jekyll服务上去，我们需要做一次提交，为此，我故意在README.md文件中增加了一行:
    
        # Please Delete this line!

    直接点击`编辑`:

![](http://cdn.saymagic.cn/o_1a0egfu6v1o6o9vbjm91fbm16k0e.png)

   将多余的 一行删除，然后点击下面的提交按钮：
   
![](http://cdn.saymagic.cn/o_1a0egjs7p8qak6m15g4e6m18n99.png)

至此，您的博客就搭建好了，访问域名：gitcafe用户名.gitcafe.io，例如[827273693.gitcafe.io](827273693.gitcafe.io)见证神奇吧：

![](http://cdn.saymagic.cn/o_1a0egr4kb1p9i7uv221eo0u5l9.png)

## 配置域名

如果你有自己的域名，可以很方便的进行配置，Gitcafe提供了可视化的界面：

点击`项目设置` -> `Pages服务`：

![](http://cdn.saymagic.cn/o_1a0eh3833l28t5beht1mj39e7e.png)

右面的提醒写的很是明白，输入框中写入您想绑定的域名，然后在域名服务商里增加一条 CNAME 记录, 将它指向 gitcafe.io。就这样，稍后即可访问。


## 化为己有

> 接下来的部分涉及到Git了，本文默认您已有Git基础，如果没有，欢迎加入Git家族，百利无一害。

我们首先将博客代码clone到本地：

    git clone https://gitcafe.com/***/***.git

目录结构如下：

![](http://cdn.saymagic.cn/o_1a0ehkcmr1os11q6dads3o11k5l9.png)

我将所有的配置都集中到了`_config.yml`文件，你可以按照自己的需求进行修改，比如author、title等等，博客默认使用多说评论，你需要为`duoshuo_short_name`配置你自己的多说shortname。如果你需要使用google站内搜索，可以配置`google_cx`，这样在点击第二栏顶部搜索框时就会有弹出google站内搜索
：

![](http://cdn.saymagic.cn/o_1a0ehtbjg10bnromac01ssf4qa9.png)

接下来依次执行下面的git命令来将修改提交至Gitcafe库：

    git add .

    git commit -m 'fix'
    
    git push -u origin gitcafe-pages
    
注意的是，我们只有`gitcafe-pages`分支，Gitcafe只会将这个分支下的内容作为Jekyll进行处理。因此你要保证以后修改的内容都要发布到`gitcafe-pages`分支才会有效果。

## 编写博客

Jekyll会将`_post`目录下的文件映射为博客里的具体文章，现在，你的`_post`目录下拥有一个名为`2015-05-18-my-first-blog.md`的文件，格式为`时间`-`文章名称`.md,后面如果你想新建博文的话也需按此格式。

我们打开这篇文章，上面会有这么一块：

    ---
    layout: post
    keywords: Start
    description: 我的第一篇博客
    title: 我的第一篇博客
    categories: [日常]
    tags: [日常]
    group: archive
    icon: globe
    ---

这块是写给Jekyll看的，layout暂时固定为post, keywords、description、title可以按照自己的需求来写，categories是大分类，tags是小分类，后面两个值固定。以后添加文章的时候一定记得在文章的头部填写这块代码。并且`---`一定要顶行。然后就可以在下面使用MarkDown来编写文章了！

赶快去新建一篇博客然后push上去看看效果吧！


## 高亮代码

细心的你会发现博客的代码是具有高量效果的，这要感谢google的prettify.css库，因为个人喜好的不同，视觉的处女座会有一套自己的代码高亮风格，更改起来很简单，只需要编辑`/assets/js/prettify/prettify.css`文件里的rgb值即可。

同理，`/assets`目录下存放的主要是css与js代码，大都是一些第三方库，自定义的js存放在`script.js`中，自定义的css存放在`style.css`中。


## 写在最后

一个技术博客不仅需要文字和代码，与文相配的图片也是不可避免的，在Jekyll中我们可以新建一个图片文件夹来专门存放图片，但这样缺点比较多，在下篇博客中，我将带大家自己Hack一个专属的免费图床，敬请期待。


## 文章地址

[http://blog.saymagic.cn/2015/09/30/learn-jekyll.html](http://blog.saymagic.cn/2015/09/30/learn-jekyll.html)