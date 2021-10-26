$(function(){
    var layer = layui.layer;
    var form = layui.form;
    initArtList();
    //新增  索引
    var indexAdd = null;
    //修改  索引
    var indexEdit = null;
    //封装初始化文章列表函数
    function initArtList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('初始化文章列表失败');
                }
                // 运用模板引擎快速初始化
                // console.log(res);
                
                var htmlStr = template('artList_template',res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //为添加分类按钮绑定单击事件
    $('#btnShowAdd').on('click',function(){
        //script标签的位置很重要，搞死我了
        // console.log($('#dialog_add').html());
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px','250px'],
            content: $('#dialog_add').html(),
            
        })
    })
    //为表单绑定提交事件，因为表单是动态生成的，所以要绑在父节点上，事件委托（冒泡）
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('新增文章分类失败');
                }
                //成功了就重新将新数据渲染出来
                initArtList();
                layer.msg('新增分类成功')
                //并且关闭输入框
                layer.close(indexAdd);
            }
        })
    })
    //为编辑按钮绑定单击事件,也是动态生成的，所以还是用事件委托
    $('tbody').on('click','#btn-edit',function(){
        indexEdit = layer.open({
            type: 1,
            title: '编辑文章分类',
            area: ['500px','250px'],
            content: $('#dialog_edit').html(),
        })
        //获取当前点击按钮的自定义id
        var id = $(this).attr('data-id');
        // console.log(id);
        
        //然后根据id来获取信息渲染到页面
        $.ajax({
            method: 'get',
            url: '/my/article/cates/'+id,
            success: function(res){
                if(res.status !== 0){
                    console.log(res);
                    
                    return layer.msg('获取文章分类数据失败')
                }
                //layui的一个方法可以快速渲染上去
                form.val('form-edit',res.data);
             console.log(res);
             
                
            }
        })
        
    })
    //为编辑的form表单绑定提交事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('修改数据失败')
                }
                //成功就关闭弹出层 并且更新数据
                layer.close(indexEdit);
                initArtList();
                layer.msg('更新数据成功');
            }
        })
    })
    //删除文章分类
    $('body').on('click','#btn-del',function(){
        // 获取点击的按钮的id，后面再通过这个id来删除对应的tr
        var id = $(this).attr('data-id');
        layer.confirm('确定要删除吗？',{icon: 3,tltle:'提示'},function(index){
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/'+id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除数据失败');
                    }
                    //更新
                    initArtList();
                    layer.close(index);
                    layer.msg('删除数据成功')
                    
                }
            })

        })
    })
})