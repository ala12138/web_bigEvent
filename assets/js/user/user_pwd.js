$(function(){
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/,'密码必须在6-12位'],
        samepwd: function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同'
            }
        },
        repwd: function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致'
            }
        }
    })
    //重置密码
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                // console.log(res);
                layer.msg('密码修改成功')
                //清空文本框
                $('.layui-form')[0].reset();
            }
        })
    })
})