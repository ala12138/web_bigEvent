$(function () {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登录”的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 从 layui 中获取 form 对象
  var form = layui.form
  var layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    // 自定义了一个叫做 pwd 校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })
  //为注册表单绑定提交事件，调用注册的接口
  $('#form_reg').on('submit',function(e){
    //阻止表单默认提交行为
    e.preventDefault();
    //调接口
    var data = {username :$('#form_reg [name = username]').val(), password :$('#form_reg [name = password]').val()};
    $.post('/api/reguser',data,function(res){
      if(res.status !== 0){
        return layer.msg(res.message)
      }
      layer.msg(res.message);
      //注册成功后自动跳到登录
      $('#link_login').click();
    })
  })
  //为登录表单绑定提交事件
  $('#form_login').on('submit',function(e){
    //阻止默认跳转行为
    e.preventDefault();
    $.ajax({
      method :'post',
      url:'/api/login',
      data: $(this).serialize(),
      success: function(res){
        console.log();
        
        if(res.status !== 0){
          return layer.msg("账号或密码错误")
        }
        //本地存储token
        localStorage.setItem('token',res.token);
        //登录成功后跳转到后台
        location.href = 'index.html';
      }
    })

  })
})