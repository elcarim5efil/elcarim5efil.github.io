---
layout: post
title: jQuery 源码分析（3） 整体结构
description: 分析jQuery.fn上的部分工具方法
category: blog
---

分析jQuery.fn上的部分工具方法的实现源码。

##源码分析

	// 建立方法实例,提高方法访问的速度(避免在原型链上搜索)

	var deletedIds = [];
	var slice = deletedIds.slice;
	var concat = deletedIds.concat;
	var push = deletedIds.push;
	var indexOf = deletedIds.indexOf;
	var class2type = {};
	var toString = class2type.toString;
	var hasOwn = class2type.hasOwnProperty;
	var support = {};

	jQuery.fn = jQuery.prototype = {
	    // 保存目前jQuery版本号
	    jquery: version,

	    // 指向构造器
	    constructor: jQuery,

	    // 初始化空的选择器
	    selector: "",

	    // 初始化长度为0,及空的jQuery对象的length为0,可以此判断是否存在查找结果
	    length: 0,

	    // 转换成Array并返回
	    toArray: function() {
	          return slice.call( this );     // 使用了Array.slice     
	    },

	    // num == 0 则返回所有元素
	    // 如果 num < 0, 则返回第this.length + num个元素
	    get: function( num ) {
	          return num != null ?
	               // 返回一个元素
	               ( num < 0 ? this[ num + this.length ] : this[ num ] ) :
	               // 返回全部元素
	               slice.call( this );
	    },

	    // 将一个DOM元素集Array压入到jQuery栈
	    // 该方法在find,parent,filter中被频繁使用
	    // 通过创建prevObject,能够跟踪链式调用中上一个调用方法返回的元素集
	    pushStack: function( elems ) {
	           // 建立新的jQuery对象以保存新的元素集(将新元素集合并到其中)
	          var ret = jQuery.merge( this.constructor(), elems );
	           // 新jQuery对象中创建prevObject,引用原来的jQuery对象,更新新元素集的上下文
	          ret.prevObject = this;
	          ret.context = this.context;
	           // 返回新的元素集
	          return ret;
	     },

	    // 每个元素都调用一次回调函数,参数已Array形式传递(内部调用时才使用)
	     each: function( callback, args ) {
	          return jQuery.each( this, callback, args );
	     },
		// jQuery.map对this中的每个key重新用回调函数计算出新的值并返回
	    // 将jQuery.map的返回结果添加到新的jQuery中并返回,新的jQuery以原有的元素为基础
	    map: function( callback ) {           return this.pushStack( jQuery.map(this, function( elem, i ) {
	            return callback.call( elem, i, elem );
	        }));
	    },

	    // 通过slice将"参数数组"截取并压栈
	    slice: function() {
	        return this.pushStack( slice.apply( this, arguments ) );
	    },

	    // 将第一个元素压栈并返回新的jQuery栈
	    first: function() {
	        return this.eq( 0 );
	    },
	    
	    // 将最后一个元素压栈并返回新的jQuery栈
	    last: function() {
	        return this.eq( -1 );     // 实际上是 len - 1, 即最后一个元素
	    },

	    // 取this[i]并压栈,如果i < 0则取this[len + i],如果i > len, 压入空Array
	    eq: function( i ) {
	        var len = this.length,
	            j = +i + ( i < 0 ? len : 0 );           return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	     },

	     // prevObject是通过pushStack创建的,通过end跟踪链式调用中上一个方法返回的DOM元素集
	     // end相当与一个出栈操作,通过end,能够返回到上一个链式调用方法的元素集,如
	     // $().find('button').click(function(){alert(1)})     // 对find('button')返回的元素操作
	     //             .end().click(function(){alert(2)})     // 返回到find('button')返回的元素，然后操作
	     end: function() {
	        return this.prevObject || this.constructor(null);
	     },

	     // 内部调用, 引用Array方法
	     push: push,
	     sort: deletedIds.sort,
	     splice: deletedIds.splice
	};


这里定义了一个重要的方法————jQuery.pushStack；它在find，filter，parent等方法中被频繁使用。通过创建prevObject记录上次链式调用时返回的元素集结果，以此能够实现对链式调用元素集的跟踪，利用jQuery.end来回溯到上一次调用的结果。