$(function () {
    var layer = layui.layer
    var form = layui.form
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 调用layui 渲染下拉列表框
                form.render()
            }
        })
    }
    initCate()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为封面按钮绑定 点击事件
    $('#btnChooseImage').on('click', function (e) {
        $('#coverFile').click()
    })

    // 监听 coverFile de change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 用户文件s file[0]:第一个文件对象
        var files = e.target.files
        if (files.length === 0) {
            return layer.msg('请选择封面！')
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

        console.log(file);
        console.log(file[0]);


    })

    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮， 绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 1. 基于 form 表单 快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 进行追加赋值 将文章状态存为草稿
        fd.append('state', art_state)
        /* fd.forEach(function (v, k) {
            // 打印表单里的 k,v 
            // <input type="text" name="title"> title: aaa（参数名：值）
            // console.log(k, v);
        }) */
        // 将方面裁剪后 ，输出为一个文件对象 blob
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存在 fd 中，
                fd.append('cover_img', blob)
                // 3. 发起ajax 请求 
                publishArticle(fd)
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意： 如果向服务器提交的formData 格式的数据
            // 必须配置两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
            }
        })
    }


})