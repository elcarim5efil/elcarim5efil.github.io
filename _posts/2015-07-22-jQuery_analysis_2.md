---
layout: post
title: jQuery 源码分析（2） jQuery.fn.init
description: 分析jQuery.fn.init的源码
category: blog
---

##源码分析
分析jQuery.fn.init的源码，学习它的实现方法。

###jQuery.fn.intit 中使用到的外部变量

	// 判断是否为HTML标签或#id
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
	// window.document的jQuery对象
	rootjQuery = jQuery(window.document);
	// 判断是否为HTML标签
	rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);

###构造Jquery对象的方法

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// 处理空selector $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;          // 返回空jQuery对象
		}
		// 处理 HTML 字符串
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// 如果头尾含有 "<", ">"则跳过正则表达式检查
				match = [ null, selector, null ];
			} else {
	        	match = rquickExpr.exec( selector );     // 使用正则表达式检查是否为#id或HTML标签
	        }
               // 确定是一个html标签，或为#id时没有特定的上下文
               if ( match && (match[1] || !context) ) {
                     // HANDLE: $(html) -> $(array)
                    if ( match[1] ) {
                         context = context instanceof jQuery ? context[0] : context;
                         // jQuery.merge把jQuery.parseHTML的返回值合并到this上
                         // jQuery.parseHTML将HTML字符串转换为一个DOM节点的集合
                         // 如果context不为空则以conext节点为上下文来创建HTML片段
                         // jQuery.parseHTML中的参数true表明保留HTML字符串中的脚本
                         // 如果parseHTML方法不存在则会抛出异常
                         jQuery.merge( this, jQuery.parseHTML(
                              match[1],
                              context && context.nodeType ? context.ownerDocument || context : document,
                              true
                         ) );
                          // jQuery(html, attributes),example
                         // $( "<div></div>", {
                         //      "class": "my-div",
                         //      on: { touchstart: function( event ) {// Do something}
                         // }
                         // })
                         // rsingleTag检测字符串时候为一个HTML tag
                         // jQuery.isPlainObject 判断context是否为纯粹的对象字面量
                         // 纯粹对象字面量表明这个对象是有new或{}创建的，它有构造器，有原型链继承，但要排除window或DOM对象

                         // 如果context不是纯粹对象字面量,for in 语句操作可能会出错
                         if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
                              for ( match in context ) {
                                   // 调用自身的方法
                                   if ( jQuery.isFunction( this[ match ] ) ) {
                                        this[ match ]( context[ match ] );
                                    // 设置属性
                                   } else {
                                        this.attr( match, context[ match ] );
                                   }
                              }
                         }
                          return this;
                     // $('#id') 选择id
                    } else {

                         // 直接利用document的方法来说实现
                         elem = document.getElementById( match[2] );
                          // Check parentNode to catch when Blackberry 4.6 returns
                         // nodes that are no longer in the document #6963
                         // Blackberry4.6 返回时有parentNode
                         if ( elem && elem.parentNode ) {

                              // IE和Opera的返回对象是第一个name符合的对象
                              if ( elem.id !== match[2] ) {     // 如果ID错误,在rootjQuery中用find查找
                                   return rootjQuery.find( selector );
                              }
                               // 如果不存在这个节点,则插入一个
                              this.length = 1;
                              this[0] = elem;
                         }
                          this.context = document;     // 添加上下文
                         this.selector = selector;    // 更改选择器为id
                         return this;
                    }
                // 选择器表达式: $(expr, $(...))

               // 如果context为空或context是一个jQuery对象,jQuery.jquery存放version信息
               } else if ( !context || context.jquery ) {
                    return ( context || rootjQuery ).find( selector );
                // 选择器表达式: $(expr, context)
               // 等同于: $(context).find(expr)
               } else {        // 利用jQuery构造器调用context
                    return this.constructor( context ).find( selector );
               }
           // $(a_node), 一个DOM节点元素
          } else if ( selector.nodeType ) {     // 直接把该节点添加到this上
               this.context = this[0] = selector;
               this.length = 1;
               return this;
           // selector 是一个function, 调用jQuery.ready(func) 的快捷方式
          } else if ( jQuery.isFunction( selector ) ) {
               return typeof rootjQuery.ready !== "undefined" ?
                    rootjQuery.ready( selector ) :
                    // 如果ready方法不存在,则立即执行
                    selector( jQuery );
          }
           if ( selector.selector !== undefined ) {     // 如果选择器包含其他属性,赋值给this的同名属性
               this.selector = selector.selector;
               this.context = selector.context;
          }

		// 将selector合并到this上
		return jQuery.makeArray( selector, this );
     };

##总结
init执行过程：
<ul>
	<li>处理空selector，相当于返回jQuery方法接口</li>
	<li>判断HTML字符串</li>
		<ul>
			<li>HTML字符或#id</li>
			<li>单独HTML标签，创建DOM对象并插入</li>
			<li>#id，使用document.getElementById获取DOM对象</li>
		</ul>
	<li>选择器表达式，使用$.find</li>
	<li>函数，注册到ready或立即执行</li>
	<li>DOM对象,直接返回</li>
</ul>

可以看到init初始化一个jQuery对象，根据形参来搜索或建立一个DOM对象(又或者是执行jQuery.ready方法)，并将该对象返回。
jQuery.fn.init的实现十分精明，在JavaScript中实现了方法的重载,让API调用变得更为简单方便。
过程中有针对浏览器兼容性的处理、纯粹对象判断，用来保证运行的可靠性和稳定性，这部分十分值得研读和学习。