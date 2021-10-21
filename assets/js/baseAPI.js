//其实每次发起请求的时候，不管是那三种里的哪种方式，其实都会事先调用ajaxPrefilter这个函数，他可以拿到请求里面的data
//所以我们可以通过这种方式来获取url，而不是每次发请求都写好大一串url
$.ajaxPrefilter(function(options){
    options.url = 'http://api-breakingnews-web.itheima.net'+options.url;
    //为有权限的设置header请求头，这样以后发有权限的请求就不用写headers
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''}
    }
    //每次请求成功还是失败都会执行这个complete函数
    options.complete= function(res){
        console.log(res);
        
        if(res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！'){
            //清空token
            localStorage.removeItem('token');
            // 跳转到登录页
            location.href = 'login.html';
        }
        
    }
})