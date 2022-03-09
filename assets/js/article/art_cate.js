$(function () {
    // 获取文章分类列表信息
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCateList()
    var form = layui.form
    var layer = layui.layer
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })


    // 通过代理的形式 为form-add 表单绑定 submit
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log(1);
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 成功后渲染列表
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null
    // 通过代理的方式为 edit-btn 绑定 click 事件
    $('tbody').on('click', '#btn-edit', function () {
        // 弹出修改文章层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 取到修改的id
        var id = $(this).attr('data-id')
        // 发起对应id分类数据 的请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                // 对已有数据的填充
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过代理的方式为 form-edit 绑定 submit 
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            // post请求需要拿到序列化数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                // 渲染列表
                initArtCateList()
            }
        })
    })
    // 通过代理的方式为 btn-del 绑定 click
    $('tbody').on('click', '#btn-del', function () {
        var id = $(this).attr('data-id')
        // 提示删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    initArtCateList()
                    layer.close(index);
                }
            })
        });

    })

})