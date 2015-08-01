---
layout: post
title: jQuery 源码分析（5）jQuery 基本静态方法（一）
description: 分析jQuery 基本静态方法
category: blog
---

jQuery在初始化过程中会为自己扩展一些基本的静态方法和属性,以下是jQuery 1.11.3版本 239 ~ 564行间所扩展的静态属性和方法

##源码分析

	jQuery.extend({

	// 为每个jQuery拷贝建立一个唯一的编号
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	 
	// 假设jQuery脱离模块支持,已经准备好
	isReady: true,

	// 空转函数
	noop: function() {},

	/******************* 基本类型判断方法 *****************************/

	isFunction: function( obj ) {
	     return jQuery.type(obj) === "function";
	},
	isArray: Array.isArray || function( obj ) {
	     return jQuery.type(obj) === "array";
	},
	isWindow: function( obj ) { /* jshint eqeqeq: false */
	     return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
	// 首先抛弃数组, 利用parseFloat返回一个浮点数
	// 如果obj是一个合法数字(包括字符串数字),与parseFloat返回值的差是0,因此相减后等0，于是加1
	// 如果obj是"0x10",返回值则是0,而obj - 0则会得到16,因此判断"0x10"也是数值
	// 如果obj是"abc"等非法数字,会得到NaN - NaN,最终也会得到非数值的判断

	     return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	},
	 // 保证obj不包含任何属性
	isEmptyObject: function( obj ) {
	     var name;
	     for ( name in obj ) {

	          return false;
	     }
	     return true;
	},
	// 最常使用的判断之一，纯对象判断
	// 纯对象是有 new 或 {} 创建的对象
	// 意味着纯对象不能从其他对象原型中继承而来，只能从Object原型中继承
	isPlainObject: function( obj ) {
	     var key;
	     // 首先必须是一个object
	     // 针对IE,需要检查对象的constructor属性
	     // 把DOM节点和window对象都过滤掉
	     if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
	          return false;
	     }
	      try {
	          // Not own constructor property must be Object
	          if ( obj.constructor &&                      // 不包含构造器
	               !hasOwn.call(obj, "constructor") &&
	               !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
	               return false;
	          }

	     } catch ( e ) {
	          // IE8或9在某些主机上会抛出异常
	          return false;
	     }
	      // 支持: IE<9
	     // 先处理继承的属性,之后才会处理自身属性
	     if ( support.ownLast ) {
	          for ( key in obj ) {
	               return hasOwn.call( obj, key );
	          }
	     }
	     // 一般浏览器是先遍历自己的属性,因此利用空变量来略过之前的自身属性,直接跳到最后一个属性
	     // 如果最后一个属性是自身的,那么证明了所有属性都是自身的
	     for ( key in obj ) {}
	     return key === undefined || hasOwn.call( obj, key );
	},

	 

	/********************** 基本工具 **********************/

	type: function( obj ) {
	     if ( obj == null ) {
	          return obj + "";          // 返回一个字符串 'null'
	     }

	     // //jQuery初始化过程中会产生一个"class到type"的表
	     // jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	     //      class2type[ "[object " + name + "]" ] = name.toLowerCase();
	     // });
	     // // 实际上class2type是这样的
	     // var class2type = {
	     //      "[object Array]": "array",
	     //      "[object Boolean]": "boolean",
	     //      "[object Date]": "date",
	     //      "[object Function]": "function",
	     //      "[object Number]": "number",
	     //      "[object Object]": "object",
	     //      "[object RegExp]": "regexp",
	     //      "[object String]": "string",
	     //      "[object Error]" : "error",
	     // };
	     // toString(123) 实际上会返回一个字符串"[object Number]",此时就可以通过class2type表来返回"number"
	     // type(123) 返回的就是"number"
	     // 这样做的原因是,对于很多对象,typeof返回的只是object,无法区分具体是什么对象
	     // 通过object.prototype.toString.call(obj),虽然可以判断出什么对象,但是返回值却不够简练,因此使用了class2type进行映射
	   return typeof obj === "object" || typeof obj === "function" ?
	            class2type[ toString.call(obj) ] || "object" :     // 通过class2type来返回object类型
	            typeof obj;
	},
	 // Evaluates a script in a global context
	// 在全局上下文上执行一个脚本
	globalEval: function( data ) {
	     if ( data && jQuery.trim( data ) ) {
	          // IE上使用execScript
	          // 使用一个匿名函数,从而使上下文在firefox中变成window而非jQuery
	          ( window.execScript || function( data ) {
	               window[ "eval" ].call( window, data );
	          } )( data );
	     }
	},
	// 转换 dashed to camelCase; CSS和数据模块才使用这个方法
	// 首先要去除'-ms-'中的第一个'-'
	// 然后删除'-'并将'-'后紧接着的字母转换成大写
	// rmsPrefix = /^-ms-/
	// rdashAlpha = /-([\da-z])/gi
	// fcamelCase = function( all, letter ) {
	//          return letter.toUpperCase();
	// };
	camelCase: function( string ) {
	     return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},
	// 判断elem节点的名字是否为name
	// 在后面对节点的操作经常会用到
	nodeName: function( elem, name ) {
	     return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},
	});

##总结
- 基本判断方法里，jQuery.isNumeric的实现过程比较简练，要判断"0x10"这样的十六进制数字,又要判断"1.23"这样的浮点数.该方法里面只使用到了parseFloat，并根据其返回值的特点("字符串前部的合法数字")，只使用一次函数就可判别出数字,实现得非常精明;
- 纯对象的判断jQuery.isPlainObject也是用得较多的工具，其中针对浏览器的兼容性实现和优化都值得学习；
- jQuery.type的实现方案更加精彩，因此不同平台上typeof不一定能够准确返回对象的类型,因此需要使用到Object.ptototype.toString方法，然而这个方法会返回不需要的字符，建立一个映射表便可解决这一个问题；