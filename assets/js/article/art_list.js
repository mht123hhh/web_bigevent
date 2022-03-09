$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mn = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mn + ':' + ss
    }
    // 定义补零函数
    function padZero(n) {
        // if (n < 10) {
        //     return '0' + n
        // }
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象， 将来请求数据的时候
    // 需要请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值： 默认请求第一页
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id 
        state: '', // 文章的发布状态
    }

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    layer.msg('获取文章列表数据失败！')
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total)
                // layer.msg('获取文章列表数据成功！')
            }
        })
    }
    initTable()
    //  初始化获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.state !== 0) {
                    layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎 渲染
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                // 发生可选列表没有渲染出来 因为layui.all.js文件没有监听到这个插入的数据
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染表单区域的 UI 结构
                form.render()
                layer.msg('获取分类数据成功！')

            }
        })
    }
    initCate()
    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单选项中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件 q ，重新渲染表格数据
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的Id
            count: total,   // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认的被选中的分页
            // 控制分页按钮的 排序组合
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候 触发jump回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调 undefined
            // 2. 只要调用了 laypage.render 就会触发回调 true
            // 3. 每页多条数据显示也会触发 jump 回调
            jump: function (obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                // 把最新的页码值 赋值给 q 这个参数对象
                q.pagenum = obj.curr
                // 把最新的条目数 赋值到 q 这个查询参数对象的 pagesize 中
                q.pagesize = obj.limit
                // initTable()
                // 如果 触发第二种回调，再次执行 initTable 时，会发生两次第二种回调
                // 所以必须发生第一种回调再执行 initTable
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 通过代理 绑定删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取当前页面删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-id')
        // 询问用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据跑了，则让页码值-1 之后
                    // 再重新调用 initTable() 方法
                    // 4. 
                    // 如果 len 的值等于1，证明删除完毕之后，页面上没有任何数据
                    if (len === 1) {
                        // 页码值最小为 1 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })




})