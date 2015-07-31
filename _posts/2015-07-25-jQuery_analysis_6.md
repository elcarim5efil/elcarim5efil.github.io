---
layout: post
title: jQuery 源码分析（6）jQuery 基本静态方法（二）
description: 分析jQuery 基本静态方法（二）
category: blog
---

分析jQuery.extend方法，学习jQuery中如果实现方法扩展

##源码分析

	jQuery.extend({

	// 遍历obj的所有值
	// args 这参数只能内部调用的会用到
	// 注意到,如果回调函数调用失败会直接跳出并中止遍历
	// 当有args数组时,使用apply调用,否则使用call调用
	each: function( obj, callback, args ) {
	     var value,
	          i = 0,
	          length = obj.length,
	          isArray = isArraylike( obj );
	      if ( args ) {     // 内部调用时才会有args
	          if ( isArray ) {     // obj是Array

	               for ( ; i < length; i++ ) {
	                    value = callback.apply( obj[ i ], args );
	                    if ( value === false ) {
	                        break;
	                    }
	               }
	          } else {             // obj是Object


	          for ( i in obj ) {

	              value = callback.apply( obj[ i ], args );

	              if ( value === false ) {

	                   break;

	              }

	          }

	          }
	    // 最常用的each使用方式
	    } else {
	         if ( isArray ) {     // obj是Array
	              for ( ; i < length; i++ ) {
	                   value = callback.call( obj[ i ], i, obj[ i ] );   // 回调函数会获取i 和 对应的属性
	                   if ( value === false ) {
	                        break;
	                   }
	              }
	         } else {             // obj是Object
	              for ( i in obj ) {
	                   value = callback.call( obj[ i ], i, obj[ i ] );
	                   if ( value === false ) {
	                        break;
	                   }
	              }
	          }
	     }
	     return obj;
	},

	// 支持: Android<4.1, IE<9
	// rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
	// 删除 BOM and NBSP 
	trim: function( text ) {
	     return text == null ?
	            "" :
	            ( text + "" ).replace( rtrim, "" );
	},

	// results参数仅限内部调用
	// 将arr变成一个Array
	// 如果有results,arr会合并到results后面
	// 如果arr是'string',则会转换为[arr]然后合并到Array上
	makeArray: function( arr, results ) {
	     var ret = results || [];
	     if ( arr != null ) {
	          if ( isArraylike( Object(arr) ) ) {
	               jQuery.merge( ret,
	                          typeof arr === "string" ?
	                         [ arr ] : arr
	               );
	          } else {
	               push.call( ret, arr );
	          }
	     }
	     return ret;
	},

	// 判断elem是否在arr这个数组上
	// i是检索的起始index
	inArray: function( elem, arr, i ) {
	     var len;
	     if ( arr ) {
	          if ( indexOf ) {
	               return indexOf.call( arr, elem, i );     // 调用Array.indexOf
	          }
	          len = arr.length;
	          i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;     // 如果i<0,则设i为len+i
	          for ( ; i < len; i++ ) {
	          // 跳过对稀疏数组的访问?
	          // Skip accessing in sparse arrays
	               if ( i in arr && arr[ i ] === elem ) {
	                    return i;
	               }
	          }
	     }
	     return -1;
	},

	 // 把second合并到first上
	merge: function( first, second ) {
	    var len = +second.length,
	        j = 0,
	        i = first.length;
	    while ( j < len ) {
	        first[ i++ ] = second[ j++ ];
	    }
	    // 支持: IE<9
	    // 如果类数组对象没有length,因此.length不是一个数字,例如NodeLists
	    if ( len !== len ) {
	         while ( second[j] !== undefined ) {
	             first[ i++ ] = second[ j++ ];
	         }
	    }
	    first.length = i;
	    return first;
	},

	// 筛选遍历数组
	// callback用于判断是否符合
	// invert表示与callback的结果相反，即希望保留callback返回值为false的元素
	grep: function( elems, callback, invert ) {
	     var callbackInverse,
	         matches = [],
	         i = 0,
	         length = elems.length,
	         callbackExpect = !invert;   // invert == true, 表示希望callback返回false
	     // 遍历数组,只保留通过筛选的元素
	     for ( ; i < length; i++ ) {
	         callbackInverse = !callback( elems[ i ], i );
	         if ( callbackInverse !== callbackExpect ) {
	             matches.push( elems[ i ] );
	         }
	     }
	     return matches;
	},

	// arg参数只在内部调用时使用
	map: function( elems, callback, arg ) {
	    var value,
	    i = 0,
	    length = elems.length,
	    isArray = isArraylike( elems ),
	    ret = [];
	     // 遍历数组,将其转换成新的值并放到ret数组中
	    if ( isArray ) {
	        for ( ; i < length; i++ ) {
	            value = callback( elems[ i ], i, arg );
	            if ( value != null ) {
	                ret.push( value );
	            }
	        }
	    // 遍历对象的属性,将其转换成新的值并放到ret数组中
	    } else {
	        for ( i in elems ) {
	            value = callback( elems[ i ], i, arg );
	            if ( value != null ) {
	               ret.push( value );
	            }
	        }
	    }
	     // 如果存在嵌套的数组,将其展开
	    return concat.apply( [], ret );
	},

	 // 对象的全局GUID计数器
	guid: 1,

	 // Bind a function to a context, optionally partially applying any arguments.
	// 为一个function绑定一个上下文环境,
	proxy: function( fn, context ) {
	    var args, proxy, tmp;
	    // 处理: $.proxy(context, name)
	    if ( typeof context === "string" ) {
	        tmp = fn[ context ];      // 从参数context提取一个function
	        context = fn;             // 将上下文设置成参数context
	        fn = tmp;                 // 将绑定function对象设置为conext[nam]
	    }
	    
	    // 确保fn是一个可调用对象
	    // 如果不可调用,返回undefined
	    if ( !jQuery.isFunction( fn ) ) {
	        return undefined;
	    }
	    // 模拟上下文绑定
	    args = slice.call( arguments, 2 );     // 截取fn所需要的参数
	    proxy = function() {
	        return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	    };
	    // 为唯一的句柄设置guid,这个guid应该与原理fn的guid一样,使得它可以被移除
	    proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	    return proxy;
	},

	 // 新建一个时间对象并返回
	now: function() {
	    return +( new Date() );
	},

	// jQuery不会在内核中使用,但其他项目会将一些属性设置到support中
	support: support

	});

##总结

* jQuery.extend在进行扩展的时候，是使用到了深拷贝，这是教科书式的用法，对Object和Array对象进行递归合并，将其中所有的属性都作拷贝。这样做的原因是在JavaScript里，对右值为Object和Array的赋值操作是执行引用而非拷贝，因此必须遍历Object和Array的属性以实现深拷贝；
* 方法重载的技巧再次出现，如jQuery.proxy。重载的实现实际上要对参数类型、参数数量进行判断，以进行不同的处理；
* 为了绑定函数方法的上下文环境，我们可以使用jQuery.proxy，而.proxy的实现使用到了function.apply(conext, args)；
* jQuery.grep的实现也是比较巧妙，添加一个形参invert来进行反向选择，即可以利用一个callback作出双向选择，这也是一个简单而巧妙的技巧。