$(function () {
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    // 监听密码表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 序列化数据渲染
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('密码更新失败！')
                }
                layui.layer.msg('密码更新成功！')
                // 重置表单
                // [0] 将jquery 元素转换为 dom 元素 
                $('.layui-form')[0].reset()
            }
        })
    })

    // 初始化用户密码
    // function initUserPwd() {
    //     $.ajax({
    //         method: 'GET',
    //         url: '',
    //         success: function (res) {
    //             console.log(res);
    //         }
    //     })
    // }


})
