---
layout: post
title: jQuery 源码分析（4） 整体结构
description: 分析jQuery.extend方法
category: blog
---

分析jQuery.extend方法，学习jQuery中如果实现方法扩展

##源码分析

	// 如果传入一个对象,这个对象的属性会被添加到jQuery对象中
	// 如果传入两个或多个对象,所有对象的属性会被添加到第一个对象中
	// 如果想合并两个对象,则可以这样用: $.extend({}, obj1, obj2);
	// 如果第一个参数是true,则执行深拷贝(迭代合并)

	jQuery.extend = jQuery.fn.extend = function() {
	    var src, copyIsArray, copy, name, options, clone,
	        target = arguments[0] || {},     // 获取第一个参数,第1个参数选择是否进行深拷贝
	        i = 1,
	        length = arguments.length,
	        deep = false;

	    // 处理深拷贝
	    if ( typeof target === "boolean" ) {
	        deep = target;
	        // 跳过第一个boolean值
	        target = arguments[ i ] || {};     // i == 1
	        i++;
	     }

	     // 如果target是一个非object且非function (是string或其他类型,可能要深拷贝)
	     if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
	        target = {};
	     }

	    // 如果只有一个参数，则扩展jQuery对象自己
	    if ( i === length ) {
	        target = this;
	        i--;
	    }
	    for ( ; i < length; i++ ) {
	        // 只处理非null或undefined的值
	        if ( (options = arguments[ i ]) != null ) {
	            // 开始扩展基类对象
	            	for ( name in options ) {
	                    src = target[ name ];
	                    copy = options[ name ];

	                    // 防止一个环形链，造成循环引用
	                    if ( target === copy ) {
	                         continue;
	                    }

	                    // 如果要执行纯对象的深拷贝或拷贝Array时，要递归jQuery.extend
	                    if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
	                        if ( copyIsArray ) {
	                            copyIsArray = false;

	                            // 确保src是一个数组
	                            clone = src && jQuery.isArray(src) ? src : [];
	                        } else {

	                            // 确保src是一个纯对象
	                            clone = src && jQuery.isPlainObject(src) ? src : {};
	                        }
	                        // 递归调用jQuery.extend来实现深拷贝
	                        target[ name ] = jQuery.extend( deep, clone, copy );

	                    // 丢弃undefined值
	                    } else if ( copy !== undefined ) {
	                        // 执行拷贝

	                        target[ name ] = copy;
	                    }
	               }
	          }
	     }
	     // 返回扩展后的对象
	     return target;
	};

##总结

通过jQuery.extend方法可以为jQuery或其他对象进行属性扩展操作。对于纯对象可选择执行深拷贝，对于数组是一定执行深拷贝。
jQuery的大部分功能都通过此方法进行扩展，也可以此为jQuery扩展插件。
jQuery.extend({}),此时target为 jQuery.prototype,为jQuery扩展静态属性或方法,jQuery内部也是以此方法进行。
jQuery().extend({}),此时target为jQuery对象本身,给jQuery对象扩展属性或方法。