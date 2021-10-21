$(function () {
    //调用获取用户信息的函数
    getUserInfo();
    //退出
    $('#btn_out').on('click', function () {
        layer.confirm('确定要退出吗？',{icon:3,title:'提示'},function(index){
            //如果点击了确定就执行这个回调函数
            // 1.清空token
            localStorage.removeItem('token');
            // 2.跳珠到登录页
            location.href = 'login.html';
            layer.close(index);
        })

    })
})

//封装一个获取用户信息的函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
               
                return layui.layer.msg('获取用户信息失败');
                
            }
            // 成功后获取用户名
            // var username = res.data.username;
            // $('#welcome').html('欢迎您' + username);
            // $('.text-avatar').html(username.charAt(0).toUpperCase());
            // $('.layui-nav-img').css('display','none')

            
            renderAvatar(res.data);
        },
        // //每次请求成功还是失败都会执行这个complete函数
        // complete: function(res){
        //     console.log(res);
            
        //     if(res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！'){
        //         //清空token
        //         localStorage.removeItem('token');
        //         // 跳转到登录页
        //         location.href = 'login.html';
        //     }
            
        // }
    })
}
//封装渲染用户头像的函数
function renderAvatar(user) {
    //获取用户名
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎您&nbsp;' + name);
    //如果用户有自己的头像 就切换到自己的头像，没有就换成系统的
    if (user.user_pic) {
        $('.layui-nav-img').attr('src', user_pic);
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        $('.text-avatar').html(name.charAt(0).toUpperCase());
    }
}
