$(function () {
    // 点击注册账号
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登录
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui 中获取form 对象
    var form = layui.form
    var layer = layui.layer
    // 通过layui.verify()函数自定义校验规则
    form.verify({
        // 自定义密码校验
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            // 通过形参value拿到的是确认密码框中的内容
            // 还需拿到输入密码框中的内容
            // 两者进行一个比对
            // 如果判断失败，则return一个提示消息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }

    })

    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        // $.post('http://ajax.frontend.itheima.net/api/reguser',

        $.post('/api/reguser',
            {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }, function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                // 模拟人的点击行为 自动触发点击事件
                $('#link_login').click()
            })
    })

    // 监听登录的表单提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            /* data: {
                username: $('#form_login [name=username]').val(),
                password: $('#form_login [name=password]').val()
            }, */
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功！')
                // 登录成功后将得到的 token 字符串，保存在本地localStorage
                console.log(res.token);
                localStorage.setItem('token', res.token)
                // 跳转主页
                location.href = 'index.html'
            }
        })
    })

})