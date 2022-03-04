// 每次调用$.get/post/ajax 的时候
// 会先调用这个函数 ajaxPrefilter
// 在这个函数中，我们可以拿到我们的ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在真正发起ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})