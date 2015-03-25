---
layout: post
title: "兼容多浏览器的Ajax请求代码"
description: "利用工厂模式实现兼容多浏览器的Ajax请求代码"
category: javascript
tags: 
  - 设计模式
---

{% include JB/setup %}

## 源代码

    var ajax = function() {};
    ajax.prototype = {
        request: function(method, url, callback, postVars) {
            var xhr = this.createXhrObject();
            xhr.onreadystatechange = function() {
                if (xhr.readyState !== 4) return;
                (xhr.status === 200) ?
                    callback.success(xhr.responseText, xhr.responseXML) :
                    callback.failure(xhr,status);
            };
            if (method !== "POST") {
                url += "?" + JSONStringify(postVars);
                postVars = null;
            }
            xhr.open(method, url, true);
            xhr.send(postVars);
        },
        createXhrObject: function() {
            var methods = [
                function() { return new XMLHttpRequest(); },
                function() { return new ActiveXObject("Msxml2.XMLHTTP"); },
                function() { return new ActiveXObject("Microsoft.XMLHTTP"); }
            ],
            i = 0,
            len = methods.length;
            
            for (; i < len; i++) {
                try {
                    methods[i];
                } catch(e) {
                    continue;
                }
                
                this.createXhrObject = methods[i];
                return methods[i];
            }
            
            throw new Error("ajax created failure");
        },
        <!--more-->
        /*
        JSONStringify: function(obj) {
            var stringifyStr = "";
            
            for (var item in obj) {
                stringifyStr += item + "=";
                stringifyStr += obj[item] + "&";
            }
            
            return stringifyStr.slice(0, stringifyStr.length - 2);
            //return Array.prototype.slice.call(stringifyStr, 0, stringifyStr.length - 1).join('');
        },
        */
        JSONStringify: function(obj) {
            return JSON.stringify(obj).replace(/"|{|}/g, "")
                        .replace(/\b:\b/g, "=")
                        .replace(/\b,\b/g, "&");
        }
    };
