---
layout: post
title: "一步一步简化你的web开发成本"
description: "利用Grunt简化web前端开发成本"
category: "Grunt"
tags: 
  - Grunt
---

#### 场景

某个时刻，某人让你写一个页面。作为一个专业的web前端开发工程师，你毫不犹豫的创建了如下的文档结构。

{%highlight html%}
webapp
|-- css
|   |-- reset.css
|   |-- common.css
|-- js
|   |-- main.js
|-- img
|   |-- bg.png
|-- index.html
{%endhighlight%}

过两天需要添加一个about.html、main.html...而且每个页面的风格都大不相同。这时你需要为每个页面都搞一套css，于是在css目录下又多了about.css、main.css。一切都还ok，开发继续。

搞了一个星期，所有需求都ok，用1px的精度打败了挑剔的UE，凭着一手牛逼的兼容性解决方案糊弄过了QA。然后兴致勃勃的开始上线。

然后悲剧了，老大说http链接太多了。每个css都要发起一次http请求，浪费时间。需要优化一下。你一想这不是分分钟的事儿嘛~ `cat` 一键合并！然后重新上线。

上线不到一分钟，公司就接到用户反馈，页面显示异常！特么一看原来是样式被覆盖了。common.css中的选择器#container被about.css的覆盖了。 想一想，问题的修复并不困难，给每个页面的css都加一个前缀。如：.about-container完美解决问题。

事实是，about这个页面选择器太多！！！给每个选择器前面都加上.about是一项巨大的工程，仔细一想得搞个工具来解决。

#### less

上网一查发现还有less这种神器，于是赶紧搬到项目中。于是css文件内容变成了这样。

{%highlight html%}
.about-container {
    .about-title {
        font-size: 1.6rem;
        color: #333;
    }
    .about-content {
        padding: 6px;
    }
}
{%endhighlight%}

修改完后一键编译：

{%highlight bash%}
lessc about.less about.css
{%endhighlight%}

一切又回归正常，还有个小问题。就是每次修改less文件都要手动执行一下脚本，对于修改一次就需要编译的强迫症来说，这绝对不能忍！ 好吧，继续折腾。

#### Grunt

用watch监听文件改动，然后自动编译less文件。配置如下：

{%highlight javascript%}
module.exports = function (grunt) {
    grunt.initConfig({
        less: {
            dev: {
                options: {
                    compress: true,
                    cleancss: true,
                    optimization: 2
                    //sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: 'css/less/',
                    src: ['*.less'],
                    dest: 'css/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            less: {
                files: ['css/less/*.less'],
                tasks: ['less']
            }
        }
    });
}
{%endhighlight%}

然后执行：`grunt watch`

折腾无止境，虽然到这一步已经很nice了，但是在写less的时候各种css3的前缀也很烦人。对于强迫症来说，最不能接受的是切页面的时候F5已按烂的窘境。。。

最近新技术又火了（React），你想在项目中试用试用，发现jsx也需要每修改一次就编译一次，有了以上的经验，你很轻松的在grunt中配置了一个自动编译jsx的任务~

到目前为止，基本已经解放了前端很大部分的成本！F5的寿命得到了显著提升！

#### 最后

附上所有的Gruntfile配置

{%highlight javascript%}
module.exports = function(grunt) {
    grunt.initConfig({
        // 监听到文件改动后自动刷新页面
        connect: {
            options: {
                port: 8224,
                hostname: '*',
                base: '.',
                livereload: 8225
            },
            dev: {
                options: {
                    open: true,
                    base: ['.']
                }
            }
        },
        less: {
            dev: {
                options: {
                    compress: true,
                    cleancss: true,
                    optimization: 2
                    //sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: 'static/css/less/',
                    src: ['*.less'],
                    dest: 'static/css/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            style: {
                files: ['static/css/less/*.less'],
                tasks: ['less', 'autoprefixer'],
                options: {
                    nospawn: true,
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            script: {
                files: ['static/js/tpl/*.js'],
                tasks: ['react'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            html: {
                files: ['**/*.html'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            php: {
                files: ['**/*.php'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            }
        },
        // jsx 编译
        react: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'static/js/tpl/',
                    src: ['*.js'],
                    dest: 'static/build/',
                    ext: '.js'
                }]
            }
        },
        // 自动添加css3前缀
        autoprefixer: {
            dev: {
                options: {
                    browsers: ['last 2 versions', 'ie 8', 'ie 9']
                },
                src: 'static/css/*.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['connect:dev', 'watch']);
}
{%endhighlight%}

你可以在github上看见整个项目。每次创建新应用的时候先clone，然后基于这个模型进行开发~   [base_app](https://github.com/luofei2011/base_app)

#### 续

以上的配置在日常开发中基本足够，但是在写非纯前端的项目中还有很多不足。特别是基于后端框架的开发过程中，node的server并不能直接解析php。这个功能有待改进，有时间自己搞一个~(可能已经有了这种工具，只是我不知道。。。知道的求告知)  
