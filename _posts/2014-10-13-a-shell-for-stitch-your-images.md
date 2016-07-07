---
layout: post
title: "横向拼接图片--nodejs插件"
description: "how to stitch your images with node.js"
category: shell
tags:
  - nodejs
---


#### 实例代码

首先创建一个透明画布，然后把所有图片按序平铺到画布上，最后调用png压缩工具初步压缩图片。

{% highlight javascript %}
var images = require('images'),
	config = require('./config'),
	fs = require('fs'),
	pointerW = 0,
	Imagemin = require('imagemin'),
	imagemin = new Imagemin(),
	jsConf = {
		target: "$('.logo-x')",
		frames: config.frames,
		width: config.width,
		duration: 100,
		offset: config.gap,
		isAutoPlay: false,
		repeats: 1,
		action: ''
	},
	cssConf = '';

cssConf = ".logo-x {\r\n\tbackground: url(./img/output.png) no-repeat;\r\n\twidth: " + config.width + "px;\r\n\theight: " + config.height + "px;\r\n}"
//var transparentImg = images(1000, 1000);
//transparentImg.fill(0x00, 0xff, 0x00, 1).save('test.png', 'png');
// console.log(config);

/**
 * 计算整体长度，默认平铺方式拼接
 */
var width;
width = (config.width + config.gap) * config.frames;

images.setLimit(258660, 258);

// 生成白色背景的图片
var bg = images(width, config.height).fill(0xff, 0xff, 0xff, 1);

// 根据路径读取图片
fs.exists(config.imgSrc, function(e) {
	if (e) {
		fs.readdir(config.imgSrc, function(err, files) {
			if (err) {
				console.log('读取文件错误！');
			} else {
				if (files.length) {
					files = files.sort();
					// console.log(files);
					if (config.imgSrc[config.imgSrc.length - 1] !== '/')
						config.imgSrc = config.imgSrc + '/';
					files.forEach(function(file) {
						var filePath = config.imgSrc + file;
						// console.log(filePath);
						var img = images(filePath).size(270);
						bg.draw(img, pointerW, 0);
						pointerW += config.width + config.gap;
					});

					// 保存图片
					config.outputName = config.outputName ? config.outputName : 'output.png';
					var _o = config.dest + '/' + config.outputName;

					_o.replace('//', '/');
					bg.save(config.outputName, config.outputType);
					console.log('图片合并完成，开始压缩图片!');

					// 压缩图片
					imagemin.src(config.outputName).dest(config.outputName).use(Imagemin.optipng({ optimizationLevel: 3 }));
					console.log('图片压缩完毕!');

					imagemin.optimize(function (err, file) {
					    if (err) {
					        throw err;
					    }

					    // console.log(file);
					    // => { contents: <Buffer 89 50 4e ...>, mode: '0644' }
					    // 自动生成配置文件
					    writeFile();
					});
				}
			}
		})
	} else {
		console.log(config.imgSrc + '目录不存在!');
	}
});

function writeFile() {
	fs.open('conf.css', 'w', 0644, function(e, fd) {
		if (e) throw e;
		fs.writeSync(fd, cssConf);
	});

	fs.open('conf.js', 'w', 0644, function(e, fd) {
		if (e) throw e;
		fs.writeSync(fd, JSON.stringify(jsConf));
	});
}
{% endhighlight %}

#### 相关依赖

<!--more-->

1.需要安装的两个依赖`images`，`imagemin`

2.配置文件`config.js`

{% highlight javascript %}
var config = {
	/*每帧数据的宽度*/
	width: 270,
	/*每帧数据的高度*/
	height: 129,
	/*强烈建议设置为0即可！不然或许会引起不必要的麻烦*/
	gap: 0,
	/*共有多少帧*/
	frames: 479,
	/*待压缩的文件目录*/
	imgSrc: './img/',
	/*输出目录，如果为空则在根目录输出*/
	dest: '',
	/*输出文件名*/
	outputName: 'output_s.png',
	outputType: 'png'// 默认的保存格式，不需要修改
};

module.exports = config;
{% endhighlight %}

#### 使用

把需要合并的图片列表放到img文件夹下，执行`node xxx.js`即可。合并并且压缩后的图片会输出到同级目录下。