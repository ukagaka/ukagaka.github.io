---
layout: post
keywords: Start
description: Laravel重置密码重构
title: Laravel重置密码重构
categories: [Laravel]
tags: [Laravel]
group: archive
icon: globe
---



>需要使用laravel搭建一个后台内容管理系统，但是laravel默认的登陆注册不能满足目前的需求<br>
>重置密码的话因为是用在后台，并且不需要发送邮件进行重置，所以默认的重置密码肯定是不行的。

## 1. 首先确定重置密码的路由
我们在安装好laravel的时候默认生成的重置密码是在用户未登录的情况下进行的。所以使用原来的控制器是不可行的<br>
并且原有的重置密码，并不需要查看原始密码是否正确，而是通过邮件来进行直接更改密码，所以控制器方法的话，我们也需要重新写个<br>
我们使用`php artisan make:controller UserController`创建一个控制器类<br>
然后创建两条路由`Route::get('reset', 'UserController@getReset')`和`Route::post('reset', 'UserController@postReset')`<br>
前者是显示一个重置密码的页面get请求，后面是重置密码post请求。<br>


## 2. 显示重置密码页
这个使用的是`getReset`这个方法，这个方法只需要显示一个视图所以并没有特别的逻辑<br>
    
    public function getReset()
    {
        return view('auth.reset');
    }

## 3. 请求重置密码
这个使用的是`postReset`这个方法<br>
接收数据的话我们使用两种方法接收传过来的数据都可以：<br>
一种是使用`request`的方法接收数据，另外一种是使用`Input::get`的方法获取数据。<br>
Request的话需要引入`use Illuminate\Http\Request`类<br>
Input的话需要引入`use Input`类<br>
这里我们选择使用`request`来接收


## 4. 验证规则
验证的话，laravel为我们提供了一套验证的规则，使用`validator`的`Validator::make()`方法进行验证

    $data = $request->all(); //接收所有的数据
    $rules = [
        'oldpassword'=>'required|between:6,20',
        'password'=>'required|between:6,20|confirmed',
    ];
    $messages = [
        'required' => '密码不能为空',
        'between' => '密码必须是6~20位之间',
        'confirmed' => '新密码和确认密码不匹配'
    ];
    $validator = Validator::make($data, $rules, $messages);
`$data` 接收到从from传过来的数据信息<br>
`rules` 对接收到的值进行判断，其中数组前面的`oldpassword`和`password`是从前端from接收到的原始密码和新密码的name字段数据进行验证<br>
       验证规则的话在手册的验证章节都有，值得注意的是，使用confirmed的话是为了新密码和确认密码进行相同判断，确认密码必须的name值必须是<br>
       新密码的name值后面加上'_confirmation',比如新密码的name值为`newpassword`的话，确认密码的name值则必须为`newpassword_confirmation`才可以进行判断<br>
`messages`对验证的数据请求，显示什么提示<br>
<br>
然后通过上面的验证，还有个情况是没有验证的，那就是输入的原始密码是否和数据库里的原始密码相同。<br>
这里我们可以先把这个用户的信息从数据库里给查出来，然后和输入的原始密码进行比对。<br>
这里我们使用`Auth::user()`来获取用户的信息，这个方法需要引入`use Auth;`类<br>
然后通过`Hash::check()`来进行密码判断。<br>
判断完以后还有个问题，那就是，如何把错误信息给压入到validator的错误信息里，这里laravel为我们提供了`after`方法<br>
    
    $user = Auth::user();
    $validator->after(function($validator) use ($oldpassword, $user) {
        if (!\Hash::check($oldpassword, $user->password)) { //原始密码和数据库里的密码进行比对
            $validator->errors()->add('oldpassword', '原密码错误'); //错误的话显示原始密码错误
        }
    });
    if ($validator->fails()) {      //判断是否有错误
        return back()->withErrors($validator);  //重定向页面，并把错误信息存入一次性session里
    }
    $user->password = bcrypt($password);       //使用bcrypt函数进行新密码加密
    $user->save();      //成功后，保存新密码

>这里因为`after` 引入了一个PHP的匿名函数，所以我们需要使用`use` 关键字把外部数据给传入到匿名函数里（PS:php新特性，闭包和匿名函数）<br>
>在匿名函数里我们引入了一个全局函数所以我们需要在函数前面加`\`(PS:php新特性，命名空间章节，全局命名空间)
    

## 5. 前端显示错误信息
前端显示的话，我们使用`$errors`变量来显示错误，根据官方文档说明，调用的是`Illuminate\Support\MessageBag`的示例，有兴趣的话，可以看下<br>
我们使用`count($errors) > 0`来判断是否有错误，使用 `$errors->first()`显示一条错误信息
    
    @if(count($errors) > 0)
        <div class="alert alert-danger display-hide" style="display: block;">
            <button class="close" data-close="alert"></button>
            <span> {{ $errors->first() }}  </span>
        </div>
    @endif

可能会有人问，如果我的错误不是显示在固定的一个地方，而是在每个表单的后面显示错误信息的话，这样我们该怎么判断和显示呢？
答案是使用`$errors->has('oldpassword')`来判断有没有这个名称的错误，如果有的话，使用 `$errors->first('oldpassword')` 显示这条错误

    @if( $errors->has('oldpassword') )
        <div class="alert alert-danger display-hide" style="display: block;">
            <button class="close" data-close="alert"></button>
            <span> {{ $errors->first('oldpassword') }}  </span>
        </div>
    @endif

其中oldpassword是每个表单的里的name值，所以在使用`after`方法添加自定义错误的时候
`$validator->errors()->add('oldpassword', '原密码错误');`中，oldpassword一定要写对是在哪个表单的错误，这样才能正确的显示。

## 8. 完成后的示例
UserController

    public function getReset()
    {
        return view('auth.reset');
    }

    public function postReset(Request $request)
    {
        $oldpassword = $request->input('oldpassword');
        $password = $request->input('password');
        $data = $request->all();
        $rules = [
            'oldpassword'=>'required|between:6,20',
            'password'=>'required|between:6,20|confirmed',
        ];
        $messages = [
            'required' => '密码不能为空',
            'between' => '密码必须是6~20位之间',
            'confirmed' => '新密码和确认密码不匹配'
        ];
        $validator = Validator::make($data, $rules, $messages);
        $user = Auth::user();
        $validator->after(function($validator) use ($oldpassword, $user) {
            if (!\Hash::check($oldpassword, $user->password)) {
                $validator->errors()->add('oldpassword', '原密码错误');
            }
        });
        if ($validator->fails()) {
            return back()->withErrors($validator);  //返回一次性错误
        }
        $user->password = bcrypt($password);
        $user->save();
        Auth::logout();  //更改完这次密码后，退出这个用户
        return redirect('/login');
    }

reset.blade

    <form class="login-form" action="{{ url('/reset') }}" method="post">
            <h3 class="font-green">修改密码</h3>
            @if($errors->first())
                <div class="alert alert-danger display-hide" style="display: block;">
                    <button class="close" data-close="alert"></button>
                    <span> {{ $errors->first() }}  </span>
                </div>
            @endif
            {!! csrf_field() !!}
    
            <div class="form-group">
                <label class="control-label visible-ie8 visible-ie9">原始密码</label>
                <input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="Old Password" name="oldpassword"> </div>
            <div class="form-group">
                <label class="control-label visible-ie8 visible-ie9">新密码</label>
                <input class="form-control placeholder-no-fix" type="password" autocomplete="off" id="register_password" placeholder="New password" name="password"> </div>
            <div class="form-group">
                <label class="control-label visible-ie8 visible-ie9">重复密码</label>
                <input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="Repeat password" name="password_confirmation"> </div>
            <div class="form-actions">
                <button type="submit" id="register-submit-btn" class="btn btn-success uppercase pull-right">确定</button>
            </div>
        </form>


原文链接：[Dennis`s blog](http://ukagaka.github.io/laravel/2016/08/03/laravel-reset.html)