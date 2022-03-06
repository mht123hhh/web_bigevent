$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符'
            }
        }
    })
    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 不会清空默认表单值(阻止表单的默认重置行为)
        e.preventDefault()
        // 回到初始化值，即重置，但不会清空之前的默认值
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 对当前表单进行序列化渲染数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户头像和信息
                // 当前ifram，parent 调用父页面方法
                window.parent.getUserInfo()
            }
        })

    })

})