---
layout: post
title: jQuery 源码分析（1） 入口源码
description: 分析jQuery的入口源码
category: blog
---

目前阅读的是jQuery 1.11.3的源码，有参考nuysoft的资料。原来比较喜欢在自己的Evernote上做学习基类，并没有在网上写技术博客的习惯，现在开始学习JS的开源代码，想跟大家多交流，希望有所收获。

##源码分析

	(function( global, factory ) {
	      if ( typeof module === "object" && typeof module.exports === "object" ) {
	          module.exports = global.document ?
	               factory( global, true ) :
	               function( w ) {
	                    if ( !w.document ) {
	                         throw new Error( "jQuery requires a window with a document" );
	                    }
	                    return factory( w );
	               };
	     } else {
	          factory( global );
	     }
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	     
	     // 创建jQuery对象, 实际上是jQuery.fn.init所返回的对象
	     var jQuery = function( selector, context ) {
	          return new jQuery.fn.init( selector, context );
	          // 如果调用new jQuery, 生成的jQuery会被丢弃,最后返回jQuery.fn.init对象
	          // 因此可以直接调用jQuery(selector, context), 不需要使用new
	     }

	     // 创建jQuery对象原型，为jQuery添加各种方法
	     jQuery.fn = jQuery.prototype = {
	          // 在调用new jQuery.fn.init后, jQuery.fn.iniy.prototype = jQuery.fn = jQuery.prototype
	          // 相当于将所有jQuery.fn的方法都挂载到一开始jQuery函数返回的对象上
	          ...
	     }     

	     init.prototype = jQuery.fn;
	     // 创建jQuery.extend方法
	     jQuery.extend = jQuery.fn.extend = function() {、
	          ...
	     }

	 
	     // 使用jQuery.extend扩展静态方法
	     jQuery.extend({});

	     // 为window全局变量添加$对象

		if ( typeof noGlobal === strundefined ) {     // var strundefined = typeof undefined
		     window.jQuery = window.$ = jQuery;
		}

		return jQuery;

	}));


##window对象检测

为了保证不污染全局变量，jQuery源码中将所有的对象及方法创建都放到了factory函数中执行。通过形参global来传递window变量，在利用factory创建jQuery对象以前，首先进行window变量的检测。

window检测代码部分有英文注释

	// For CommonJS and CommonJS-like environments where a proper window is present,
	// execute the factory and get jQuery
	// For environments that do not inherently posses a window with a document
	// (such as Node.js), expose a jQuery-making factory as module.exports
	// This accentuates the need for the creation of a real window
	// e.g. var jQuery = require("jquery")(window);
	// See ticket #14549 for more info
 
module 和 module.exports主要是为了让jQuery能够以模块的形式注入到没有window.document变量的诸如Node.js的运行环境中，当遇到这种情况，就不会在window中设置jQuery$变量。要使用jQuery时，则是使用所返回的jQuery对象，如在Node.js中：

	var jQuery = require("jquery")(window);	