// 每次调用$.get/post/ajax 的时候
// 会先调用这个函数 ajaxPrefilter
// 在这个函数中，我们可以拿到我们的ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在真正发起ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url);
    // 统一为有权限的接口, 设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) { // 返回索引号
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // console.log('执行了 complete 回调：');
        // console.log(res);
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空 token
            // 不登录永远清空你的token值 防止你暴力登录(f12设置token值)
            localStorage.removeItem('token')
            // 2. 强制跳转到 登录页面
            location.href = '/login.html'
        }
    }
})