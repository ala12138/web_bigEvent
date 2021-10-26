$(function () {
    var layer = layui.layer;
    var form = layui.form;
    ininCate();
    // 初始化富文本编辑器
    initEditor()
    // 文章封面
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //初始化下拉框的函数
    function ininCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类信息失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //提醒layui刷新下
                form.render();
            }
        })
    }
    //给文件选择按钮绑定单击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    //更换裁剪区里面的图片
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0];
        if (file.length === 0) {
            return
        }
        //根据文件创建一个url地址
        var newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    //定义文章的发布状态
    var art_state = '已发布'

    $('#btnSave2').on('click', function () {
        art_state = '草稿'

    })
      // 为表单绑定 submit 提交事件
  $('#form-pub').on('submit', function(e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault()
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0])
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd);
        
        
      })
  })
  //提交文章的函数
  function publishArticle(fd){
      $.ajax({
          method: 'post',
          url: '/my/article/add',
          data: fd,
          contentType: false,
          processData: false,
          success: function(res){
              if(res.status !== 0){
                  return layer.msg('发布文章失败')
              }
     
              
            //   跳转到文章列表页
            
            
            location.href = 'article_list.html'
            layer.msg('发布文章成功');
           
          }
      })
  }
})