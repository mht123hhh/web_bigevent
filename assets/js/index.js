$(function () {
    // 调用用户的基本信息
    getUserInfo()
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            console.log('ok');
            // 1. 清空本地存储的 token 对后台权限访问
            localStorage.removeItem('token')
            // 2. 跳转到登录页面
            location.href = '/login.html'
            // 关闭 confirm 询问框
            layer.close(index);
        });
    })

})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置字段
        // headers: {
        //     // 身份认证必不可少
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            console.log(res);
            // 渲染用户头像信息
            renderAvatar(res.data)
        }
        // 不论成功还是失败，最终都会调用 complete 回调函数
        // complete: function (res) {
        //     // console.log('执行了 complete 回调：');
        //     // console.log(res);
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制清空 token
        //         // 不登录永远清空你的token值 防止你暴力登录(f12设置token值)
        //         localStorage.removeItem('token')
        //         // 2. 强制跳转到 登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#wellcom').html('欢迎' + '&nbsp;&nbsp;' + name)
    // 3. 按需渲染图片头像
    if (user.user_pic == null) {
        $('.layui-nav-img').hide()
        // 得到用户name的第一个字符并大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    } else {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }

}