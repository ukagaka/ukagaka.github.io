---
layout: post
keywords: Start
description: Laravel注册重构
title: Laravel注册重构
categories: [Laravel]
tags: [Laravel]
group: archive
icon: globe
---



>需要使用laravel搭建一个后台内容管理系统，但是laravel默认的登陆注册不能满足目前的需求<br>
>注册的话因为是用在后台，并且不需要使用邮箱注册的，而且会有一些额外的配置需要在注册时一起填写。

## 1. 首先确定用户注册的路由
我们在安装好laravel的时候默认生成的注册是用邮箱进行注册的，并且有些选项不需要，有些还需要加一些表单选项<br>
我们注册的话，并不是可以随便注册的，只有一些超级管理员才能进行注册<br>
首先我们使用上次创建的`UserController`进行配置，如果没有的话，可以使用`php artisan make:controller UserController`创建一个控制器类<br>
然后创建两条路由`Route::get('register', 'UserController@getRegister')`和`Route::post('register', 'UserController@postRegister')`<br>
前者是显示一个注册的页面get请求，后面是注册账号的post请求。<br>


## 2. 显示注册账号页面
这个使用的是`getRegister`这个方法，这个方法只需要显示一个视图所以并没有特别的逻辑<br>
    
``` php
    public function getRegister()
    {
        return view('auth.register');
    }
```

## 3. 请求注册账号
这个使用的是`postRegister`这个方法<br>
注册账号的话和重置密码一样，而且比注册账号还要简单点。<br>
我们在往数据库里插入一条用户纪录的时候，可以使用`User::create($data)`进行插入。<br>
`$data`是个数组，里面存放了每个字段的键和值

``` php
    public function postRegister(Request $request)
    {
        $rules = [
            'username'=>'required|unique:finance_enewsuser',
            'password' => 'required|between:6,20|confirmed'
        ];
        $messages = [
            'required'=>':attribute不能为空',
            'unique'=>'用户名已被注册',
            'between' => '密码必须是6~20位之间',
            'confirmed' => '新密码和确认密码不匹配'
        ];
        $username = $request->input('username');
        $password = $request->input('password');
        $group = $request->input('group');
        $data = $request->all();
        $validator = Validator::make($data, $rules, $messages);
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        $data = [
            'username' => $username,
            'password' => bcrypt($password),
            'groupid' => $group,
            'checked' => 0,
            'styleid' => 1,
            'filelevel' => 0,
            'loginnum' => 0,
            'lasttime' => time(),
            'lastip' => '127.0.0.1',
            'truename' => '',
            'email' => '',
            'pretime' => time(),
            'preip' => '127.0.0.1',
        ];
        User::create($data); //插入一条新纪录，并返回保存后的模型实例
        //如果注册后还想立即登录的话，可以使用$user = User::create($data); Auth::login($user); 进行认证
        return redirect('/');
    }
```

## 4. 完成后的示例
UserController

```
    public function getRegister()
    {
        return view('auth.register');
    }

    public function postRegister(Request $request)
    {
        $rules = [
            'username'=>'required|unique:finance_enewsuser',
            'password' => 'required|between:6,20|confirmed'
        ];
        $messages = [
            'required'=>':attribute不能为空',
            'unique'=>'用户名已被注册',
            'between' => '密码必须是6~20位之间',
            'confirmed' => '新密码和确认密码不匹配'
        ];
        $username = $request->input('username');
        $password = $request->input('password');
        $group = $request->input('group');
        $data = $request->all();
        $validator = Validator::make($data, $rules, $messages);
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        $data = [
                    'username' => $username,
                    'password' => bcrypt($password),
                    'groupid' => $group,
                    'checked' => 0,
                    'styleid' => 1,
                    'filelevel' => 0,
                    'loginnum' => 0,
                    'lasttime' => time(),
                    'lastip' => '127.0.0.1',
                    'truename' => '',
                    'email' => '',
                    'pretime' => time(),
                    'preip' => '127.0.0.1',
                ];
        User::create($data); //插入一条新纪录，并返回保存后的模型实例
        return redirect('/');
    }
```
register.blade

```
    <form class="login-form" action="{{ url('/register') }}" method="post">
        {!! csrf_field() !!}
        <h3 class="font-green">Sign Up</h3>
        @if(count($errors) > 0)
            <div class="alert alert-danger display-hide" style="display: block;">
                <button class="close" data-close="alert"></button>
                <span> {{ $errors->first() }}  </span>
            </div>
        @endif
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">用户名</label>
            <input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="Username" name="username"> </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">密码</label>
            <input class="form-control placeholder-no-fix" type="password" autocomplete="off" id="register_password" placeholder="Password" name="password"> </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">重复密码</label>
            <input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="Repeat password" name="password_confirmation"> </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">用户组</label>
            <select name="group" class="form-control">
                    <option value="1"> 超级管理员 </option>
                    <option value="2"> 管理员 </option>
                    <option value="3"> 编辑 </option>
            </select>
        </div>
        <div class="form-actions">
            <button type="submit" id="register-submit-btn" class="btn btn-success uppercase pull-right">注册</button>
        </div>
    </form>
```

## 5. 中间件--用户必须登录
现在注册都完成了,我们就差用户的判断了。
需求注册账号必须只能是有超级管理员权限的账号才可以注册。<br>
这种情况下按照我们一般的步骤就是在`postRegister`方法里直接查出用户的信息，然后查看用户是否满足这个权限，不满足的情况下就跳转到其它页面。<br>
这种方法可以，但是，我们既然有超级管理员和管理员这些权限区分，肯定不止一个地方使用，其它地方也会用到。<br>
然后会有人想到在model里写个方法，以后有需要都可以直接调用。<br>
这个方法也可以，不过，我们推荐使用laravel提供的中间件这个功能，这个功能非常强大，也非常好用。现在我们就使用中间件这个功能。<br>
因为我们是后台内容管理系统，所以，我们首先创建一个中间件，功能是，所有页面进入前，必须是登录状态，否则跳到登录页。<br>
查看手册发现可以使用`php artisan make:middleware CheckLoginMiddleware`命令创建一个中间件，当然复制一个差不多的文件，改下也是一样的。<br>
然后会在`app/Http/Middleware/`目录下创建了一个`CheckLoginMiddleware`中间件文件，里面只有一个`handle()`方法，我们直接在里面增加我们的功能
 
 ```   
    <?php
    
    namespace App\Http\Middleware;
    
    use Closure;
    use Auth;
    
    class CheckLoginMiddleware
    {
        public function handle($request, Closure $next)
        {
            //使用Auth方法，需要引入use Auth;方法
            //$request->is('login')表示请求的URL是否是登录页
            //因为我们打算使用全局的，所以，需要把登录页排除，不然会无限重定向
            //如果你的登录页不是/login,而是/auth/login的话，就写$request->is('auth/login')
            //并且我们要在请求处理后执行其任务，因为我们需要获取到用户的登录信息
            $response = $next($request);
            if (!Auth::check() && !$request->is('login')) {
                return redirect('/login');
            }
            return $response;
        }
    }
```

这个中间件的功能是，如果有路由产生，首先使用`Auth::check()`判断用户是否登录，如果没有登录的跳转到登录页。<br>
方法写好了，但是还不能使用，我们需要注册下这个中间件，告诉框架我们这个中间件写好了，可以使用了，使用的范围是哪里。<br>
在`app/Http/`目录下有个`Kernel.php`文件是注册这个中间件的，也就是告诉框架，我们写好了这个中间件。<br>
而`Kernel.php`文件里有两个数组属性，一个`$middleware`表示全局使用,一个`$routeMiddleware`表示可以选择使用。<br>
全局使用的意思是，不管你请求哪个页面，都会先执行这个中间件。<br>
选择使用表示，需要哪个HTTP请求，要求执行中间件，就在哪个地方执行。<br>
这里每个页面都要求必须登录的话，可定是注册一个全局的，在`$middleware`数组属性里加入一条<br>

    \App\Http\Middleware\CheckLoginMiddleware::class

注册下，就可以使用了<br>
>PS:请记住，如果定义全局的要格外小心，比如上面我们要排除登录页，不然因为用户没有登录，所以在哪个页面都会重定向到登录页，当然也包括登陆页

## 5. 中间件--特殊页面需要验证用户组
现在是进行用户权限页面的限制，同样我们也要重新创建一个中间件<br>
使用`php artisan make:middleware CheckGroupMiddleware`创建一个新的中间件，用来判断这个用户是否满足这个权限<br>

```    
    <?php
    
    namespace App\Http\Middleware;
    
    use Closure;
    use Auth;
    
    class CheckGroupMiddleware
    {
        public function handle($request, Closure $next)
        {
            $user = Auth::user();
            if ($user->groupid != 1) {
                return redirect('/');
            }
            return $next($request);
        }
    }
```

这里我们还是通过`Auth::user()`来获取到用户的信息，然后判断用户的组，不属于超级管理员就跳到首页。<br>
然后我们在到`app/Http/`目录下有个`Kernel.php`文件是注册这个中间件的，这次我们注册为可以选择的中间件。<br>
这个中间件因为是可以选择的，所以我们还需要给它起个别名,在`$routeMiddleware`数组属性里加如一条<br>

```
    'user.group' => \App\Http\Middleware\CheckGroupMiddleware::class
```

创建一个可以使用`usergroup`这个名字使用的中间件。<br>
创建好后，我们可以选择在哪里使用，一个是在`router.php`的路由文件里加入，一个是在controller里使用<br>
在`router.php`文件里使用

```
    Route::get('/', ['middleware' => ['user.group'], function () {
        //
    }]);
```

在控制器内使用

```
    $this->middleware('user.group');
```

这里我们选择在路由里添加中间件。让注册页面只能是超级管理员才可以注册

```
    Route::get('register', 'UserController@getRegister')->middleware('user.group');
    Route::post('register', 'UserController@postRegister')->middleware('user.group');
```

我们目前只有两个路由要判断权限，所以使用了链式的写法，当然你也可以按照手册里上使用组的方式，组的方式更为优雅。

>当然如果你的整个控制器内的方法都需要中间件进行验证过滤的话，你也可以创建组的形式，也可以直接在控制器内使用`__construct`方法,让每次请求这个控制器时，先执行中间件
  
```
    class MyController extends Controller
    {
        public function __construct()
        {
            $this->middleware('user.group');
        }
    
        public function index()
        {
            return view('my.index');
        }
    }
```

原文链接：[Dennis`s blog](http://ukagaka.github.io/laravel/2016/08/05/laravel-register.html)