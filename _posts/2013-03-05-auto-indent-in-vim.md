---
layout: post
title: "vim编辑php文件时html无法自动缩进的解决办法"
description: "混合代码缩进的时候使用"
category: vim
tags: ['vim']
---
{% include JB/setup %}

### 解决办法:

1. 确保vim中开启了文件类型检查: filetype on

2. 加入以下快捷键,在编辑中根据文件类型实时更改

    nnoremap <leader>1 :set filetype=xhtml<CR>  "快捷键: \+1"
    nnoremap <leader>2 :set filetype=css<CR>  
    nnoremap <leader>3 :set filetype=javascript<CR>  
    nnoremap <leader>4 :set filetype=php<CR>

3. 问题完美解决!
