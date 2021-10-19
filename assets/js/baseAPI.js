//其实每次发起请求的时候，不管是那三种里的哪种方式，其实都会事先调用ajaxPrefilter这个函数，他可以拿到请求里面的data
//所以我们可以通过这种方式来获取url，而不是每次发请求都写好大一串url
function ajaxPrefilter(options){
    options.url = 'http://api-breakingnews-web.itheima.net'+options.url;
}