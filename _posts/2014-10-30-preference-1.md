---
layout: post
title: "性能优化之--静态文件管理Grunt.js"
description: "web前端性能优化"
category: "性能优化"
tags: ['Gruntjs', '性能优化']
---


本系列文章可以在这里查看：[性能优化系列](http://www.poised-flw.com/categories.html#性能优化-ref)

> 静态管理可以从多方面进行优化，是前端性能优化的重点！本系列中的分享均是本人实际在项目开发中用到的。

#### 第一步

+ 资源合并`grunt-contrib-concat`、`grunt-contrib-cssmin`

{% highlight javascript linenos %}
// 任务：合并js文件
concat: {
    // 目标1：合并js文件all.js
    all_js: {
        src: ['a.js', 'b.js'],
        dest: 'all.js'
    },
    app_js: {
        src: ['core.js', 'main.js'],
        dest: 'app.js'
    }
},
// 任务：合并css文件
cssmin: {
    combine: {
        files: {
            'all.css': ['form.css', 'reset.css', 'main.css']
        }
    }
}
{% endhighlight %}

+ 静态资源压缩`grunt-contrib-uglify`、`grunt-contrib-cssmin`

{% highlight javascript %}
// 任务：js文件压缩
uglify: {
    min_js: {
        files: {
            'app.min.js': ['all.js', 'app.js']
        }
    }
}
// 任务：css文件压缩
cssmin: {
    css_min: {
        files: [{
            expand: true,
            cwd: '/path/to/yourdir', // 源目录
            src: ['*.css', '!*.min.css'],
            dest: '/path/to/yourdir/', // 目标目录
            ext: '.min.css'
        }]
    }
}
{% endhighlight %}

<!--more-->

+ 完整的`Gruntfile.js`

{% highlight javascript %}
module.exports = function(grunt) {
    grunt.initConfig({
        // 导入上面的任务
    });

    // 加载组件
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // 注册任务
    grunt.registerTask('static', ['concat', 'uglify', 'cssmin']);
}
{% endhighlight %}
运行该配置脚本
{% highlight bash %}
grunt static
{% endhighlight %}

#### 第二步

+ 静态资源添加md5信息

可用的Grunt组件有：`grunt-filerev`、`grunt-usemin`

+ 图片资源优化`CSS SPRITE`

可用组件：`grunt-imagemin`

#### 第三步

+ DNS预解析

{% highlight html %}
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<link rel="dns-prefetch" href="http://yourdomain.com">
{% endhighlight %}

+ CDN服务器

七牛存储提供的：[开放静态文件CDN](http://www.staticfile.org/)

#### 附：可用的Grunt插件列表

- [Grunt插件列表](http://gruntjs.com/plugins)
