---
layout: post
keywords: Start
description: Laravel登陆重构
title: Laravel登陆重构
categories: [Laravel]
tags: [Laravel]
group: archive
icon: globe
---



>需要使用laravel搭建一个后台内容管理系统，但是laravel默认的登陆注册不能满足目前的需求
>登陆的话，首先需求是不一定需要邮箱进行注册，还可以直接使用用户名等进行登陆或者手机号

## 1. 登陆路由的确定
首先我们必须找到它默认的登陆路由，这样的话我们可以直接重写它的登陆方法<br>
默认的登陆路由是直接在后面输入`\auth\login`,这个可以在手册里找到，如果不是得话也可能是直接输入`login`<br>
然后它访问的方法是`Auth\AuthController@getLogin`和`Auth\AuthController@postLogin`。<br>
它们一个是显示登陆页面get请求，一个是请求登陆使用的post请求<br>
但是如果你查看这个controller的话，就会发现找不到这个方法。这是因为它已经在其它地方已经实现了这个方法<br>
目前的话，我们不需讨论它是如何实现的，感兴趣的可以查看下源码。

## 2. 显示登陆页
这个使用的是`getLogin`这个方法，这个的话其实没有什么要改的话，我们可以还直接使用它默认的，不需要重写<br>
只需要找到它的视图文件，然后改它的视图文件就好。一般在`resources\views\auth\login.blade.php`文件<br>

## 3. 请求登陆
这个使用的是`postLogin`这个方法，这个的话因为表名，字段名，字段，包括验证等，都不符合我们的要求，所以需要重写
重写的话可以使用两种方法接收传过来的数据：
一种是使用`request`的方法接收数据，另外一种是使用`Input::get`的方法获取数据。<br>
Request的话需要引入`use Illuminate\Http\Request`类<br>
Input的话需要引入`use Input`类<br>
这里的话，推荐大家用request，因为毕竟是PHP新特性。<br>
另外使用Request类来接收的话，需要在参数里写入 `Request $request`<br>


## 4. 更改model
根据laravel的官方文档介绍，验证的话，其实使用的是`App\User`类，如果你建立的用户表或者字段跟model里的不一样，就需要更改<br>
（这里说明下，不更改也可以，我们需要手动使用`session`方法把用户信息存入session里，更改User的好处是，可以使用laravel内置的方法）<br>
更改的方面主要是，表名，主键，哪些字段可以赋值，已我的为例：

    <?php
    namespace App;
    
    use Illuminate\Foundation\Auth\User as Authenticatable;
    
    class User extends Authenticatable
    {
        protected $table = 'finance_enewsuser';  //定义用户表名称
        protected $primaryKey = "userid";    //定义用户表主键
        public $timestamps = false;         //是否有created_at和updated_at字段

        protected $fillable = [     //可以被赋值的字段
            'truename', 'username', 'password', 'rnd', 'adminclass', 'groupid', 'checked', 'styleid', 'filelevel', 'salt', 'loginnum', 'lasttime', 'lastip'
        ];
    
        protected $hidden = [   //在模型数组或 JSON 显示中隐藏某些属性
            'password', 'remember_token',
        ];
    }
根据自己的需求更改为和自己一样的数据表名称

## 5. 重写方法和认证用户
重写`postLogin`的方法<br>
认证的话，可以使用laravel提供的`Auth::attempt(['email' => $email, 'password' => $password])`方法进行认证<br>
注意把方法里的'email'和'password'两个名称改为和你数据库里字段名称相同的字段名称（即，用户名和密码字段）<br>
例：

    Auth::attempt(['username' => $name, 'password' => $password])
上面，我用户数据表里的用户名和密码字段对应于'username'和'password'字段<br>
如果有人问，如果我用户名不止一个字段，该怎么办，比如email和phone两个字段都是用户名，都可以登陆，这样该怎么办？<br>
其实我们可以使用两次进行认证<br>
例：
    
    if (Auth::attempt(['email' => $name, 'password' => $password], 1)) {
        return redirect()->intended('/');
    } else if (Auth::attempt(['phone' => $name, 'password' => $password], 1)) {
        return redirect()->intended('/');
    }
其实，完全不推荐这样使用，可以在前面判断好后在决定使用哪种认证


## 6. 认证失败返回
上面的例子显示的是成功的例子，如果认证失败呢？比如用户名不正确，密码不正确，该怎么返回呢？<br>
也是有两种方法：<br>
    第一种是使用`Validator`类，来进行验证输入的数据和返回错误信息<br>
    另外一种是使用辅助函数来完成<br>
这里因为是登陆，所以也没有特别需要验证的，所以我们使用辅助函数来完成<br>
例：

    redirect('login')->withInput($request->except('password'))->with('msg', '用户名或密码错误');
`redirect`表示重定向到哪个页面<br>
`withInput`表示重定向后存储的一次性数据，这里我们把用户输入的数据还返回过去<br>
`except`方法表示返回除了指定键的所有集合项，这里我们把返回的数据里的密码项给删除<br>
`with`带一次性session重定向的数据<br>

## 7. 前端显示错误信息
因为我们使用的是辅助函数来返回的错误，所以我们接收的话也使用辅助函数来接收数据<br>
这里我们使用`session`方法来接收这个错误<br>
使用`old('username')`接收上次输出的数据<br>


## 8. 完成后的示例
AuthController

    public function postLogin(Request $request)
        {
            $name = $request->input('username');
            $password = $request->input('password');
            if( empty($remember)) {  //remember表示是否记住密码
                $remember = 0;
            } else {
                $remember = $request->input('remember');
            }
            //如果要使用记住密码的话，需要在数据表里有remember_token字段
            if (Auth::attempt(['username' => $name, 'password' => $password], $remember)) {  
                return redirect()->intended('/');
            }
            return redirect('login')->withInput($request->except('password'))->with('msg', '用户名或密码错误');
        }

login.blade

    <form class="login-form" action="{{ url('/login') }}" method="post">
            {!! csrf_field() !!}
            <h3 class="form-title font-green">登陆</h3>
            @if (session('msg'))
                <div class="alert alert-danger display-hide"  style="display: block;">
                    <button class="close" data-close="alert"></button>
                    <span>{{ session('msg') }} </span>
                </div>
            @else
                <div class="alert alert-danger display-hide">
                    <button class="close" data-close="alert"></button>
                    <span> 请输入用户名或密码  </span>
                </div>
            @endif
            <div class="form-group">
                <label class="control-label visible-ie8 visible-ie9">Username</label>
                <input class="form-control form-control-solid placeholder-no-fix" type="text" autocomplete="off" placeholder="Username" name="username" value="{{ old('username') }}" /> </div>
            <div class="form-group">
                <label class="control-label visible-ie8 visible-ie9">Password</label>
                <input class="form-control form-control-solid placeholder-no-fix" type="password" autocomplete="off" placeholder="Password" name="password" /> </div>
            <div class="form-actions">
                <button type="submit" class="btn green uppercase">登陆</button>
                <label class="rememberme check">
                    <input type="checkbox" name="remember" value="1" />记住密码 </label>
            </div>
            <div class="create-account">
            </div>
        </form>
<br>
<br>
>如果Auth::attempt认证用户后，然后在其它页面使用`Auth::user()`获取不到用户信息的话，很可能就是`App\User`没有配置正确


原文链接：[Dennis`s blog](http://ukagaka.github.io/laravel/2016/07/31/laravel-log.html)