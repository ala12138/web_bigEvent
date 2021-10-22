$(function(){
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value){
            if(value.length > 6){
                return '昵称需要在1-6字符之间'
            }
        }
    })
    initUserInfo();
    //初始化用户信息
    function initUserInfo(){
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败');
                }
               //初始化
            form.val('user-form',res.data);
            }
        })
    }
    //给表单监听submit事件
    $('.layui-form').on('submit',function(e){
        // 阻止默认提交行为，这很重要！！！每次给他绑定都要！！！！
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败');
                }
               //让左上角的头像那个也可以更新（想当于调用父亲的方法）
               //window就是到了iframe页面
               // window.parent 是到了index页面
               window.parent.getUserInfo();
            }
        })
    })
    //给重置按钮添加点击事件
    $('.layui-btn-primary').on('click',function(e){
        //阻止点击，就清空的默认行为，我们需要的是还原为之前的数据
        e.preventDefault();
        //调用init来还原
        initUserInfo();
    })
})
