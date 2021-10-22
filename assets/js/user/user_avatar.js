$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //实现上传功能
    $('.post').on('click', function () {
        $('#file').click();
    })

    //为file框添加改变事件
    $('#file').on('change', function (e) {
        // console.log(e);

        var fileList = e.target.files;
        if (fileList.length == 0) {
            return layer.msg('请选择图片');
        }
        //选择了图片的话，把图片拿到
        var file = e.target.files[0];
        // 创建一个图片对应的url
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    $('.btn_confirm').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {avatar: dataURL},
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新头像失败')
                }
                window.parent.getUserInfo();
                // console.log(res);
                
            }
        })
    })
})

