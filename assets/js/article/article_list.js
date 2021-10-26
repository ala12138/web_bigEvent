$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义一个查询对象，每次获取文章列表数据的时候都要提交上去
    var q = {
        pagenum: 1,  //	页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的id
        state: ''  //文章的状态，可选值有：已发布、草稿
    }
    initTable();
    initCate();
    //定义渲染页面数据的函数
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('页面加载失败')
                }
                // console.log(res.total);

                //成功的话就渲染数据上去
                var htmlStr = template('tpl-list', res);
                // console.log(htmlStr);
                // console.log(res);
                
                $('tbody').html(htmlStr);
                renderPage(res.total);
                //通知layui重新渲染表单
                form.render();
            }
        })
    }

    //定义初始化分类数据的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化分类失败');
                }
                var htmlStr = template('tpl-cate', res);
                // console.log(res);

                // console.log(htmlStr);

                $('[name=cate_id]').html(htmlStr)
            }
        })
    }
    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',  //分页容器的id
            count: total,   //总数据条数
            limit: q.pagesize,  //每页最多有几条
            curr: q.pagenum,   //当前页面的页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                console.log(obj.curr);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })

    }
    //定义美化时间的函数
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date);
        //年
        var y = dt.getFullYear();
        //月
        var m = addZero(dt.getMonth() + 1);
        //日
        var d = addZero(dt.getDate());
        //时
        var hh = addZero(dt.getHours())
        //分
        var mm = addZero(dt.getMinutes())
        //秒
        var ss = addZero(dt.getSeconds())
        //结果
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //补零函数
    function addZero(n) {
        return n > 9 ? n : '0' + n;
    }
    //为筛选表单绑定提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        initTable();
    })
    //给删除按钮绑定单击事件
    $('tbody').on('click','.btn-del',function(){
        var id = $(this).attr('data-id');
        var len = $('.btn-del').length;
        
        
        layer.confirm('确认删除？',{icon: 3,title: '提示'},function(index){
            $.ajax({
                method: 'get',
                url: '/my/article/delete/'+id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除数据失败')
                    }

                    initTable();
                    layer.msg('删除数据成功')
                    //判断页面上还有几个删除按钮，如果只有一个就让页码值减1
                    if(len === 1){
                        //页码值最小为1
                        q.pagenum = q.pagenum === 1? 1: q.pagenum-1
                    }
                }
            })
            layer.close(index)
        })
    })
})