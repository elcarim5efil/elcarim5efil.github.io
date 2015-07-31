---
layout: post
title: jQuery 源码分析（7）Sizzle
description: 分析Sizzle 入口源码
category: blog
---

jQuery使用的是Sizzle这个选择器引擎，这个引擎以其高速著称，其实现十分精妙但是也足够复杂，下面现简单分析一下相关的代码。


##jQuery的部分API接口：

	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;



##Sizzle入口源码分析

	// @param selector 已去掉头尾空白的选择器字符串 
	// @param context 执行匹配的最初的上下文（即DOM元素集合）。若context没有赋值，则取document。 
	// @param results 已匹配出的部分最终结果。若results没有赋值，则赋予空数组。 
	// @param seed 初始集合 

	function Sizzle( selector, context, results, seed ) {
	     var match, elem, m, nodeType,
	          // QSA vars
	          i, groups, old, nid, newContext, newSelector;
	      if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {

	          // 根据不同的浏览器环境,设置合适的Expr方法,构造合适的rbuggy测试
	          setDocument( context );
	     }
	      context = context || document;
	     results = results || [];
	     nodeType = context.nodeType;
	      if ( typeof selector !== "string" || !selector ||
	          nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
	           return results;
	     }
	      if ( !seed && documentIsHTML ) {
	          // 尽可能快地找到目标节点, 选择器类型是id,标签和类
	          // rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/
	          // 将selector按 #[id] / [tag] / .[class]的顺序捕获到数组中,数组的第一个元素是原始值
	          // 捕获结果中'#'和'.'会被移除
	          if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
	               // 加速: Sizzle("#ID")
	               if ( (m = match[1]) ) {
	                    if ( nodeType === 9 ) {
	                         elem = context.getElementById( m );
	                         // 检查Blackberry 4.6返回的已经不在document中的parentNode
	                         if ( elem && elem.parentNode ) {
	                              // IE, Opera, Webkit有时候会返回name == m的元素
	                              if ( elem.id === m ) {
	                                   results.push( elem );
	                                   return results;
	                              }
	                         } else {
	                              return results;
	                         }
	                    } else {
	                         // 上下文不是document
	                         if ( context.ownerDocument && 

	                              (elem = context.ownerDocument.getElementById( m )) &&
	                              contains( context, elem ) && elem.id === m ) {

	                              results.push( elem );
	                              return results;
	                         }
	                    }
	                // 加速: Sizzle("TAG")
	               // 由于返回是一个数组,因此需要让这个数组作为参数数组并利用push.apply调用将其拼接到results后面
	               } else if ( match[2] ) {
	                    push.apply( results, context.getElementsByTagName( selector ) );
	                    return results;
	               // 加速: Sizzle(".CLASS")
	               // push.apply的使用原因同上
	               } else if ( (m = match[3]) && support.getElementsByClassName ) {
	                    push.apply( results, context.getElementsByClassName( m ) );
	                    return results;
	               }
	          }

	          // 使用QSA, QSA: querySelectorAll, 原生的QSA运行速度非常快,因此尽可能使用QSA来对CSS选择器进行查询
	          // querySelectorAll是原生的选择器,但不支持老的浏览器版本, 主要是IE8及以前的浏览器
	          // rbuggyQSA 保存了用于解决一些浏览器兼容问题的bug修补的正则表达式
	          // QSA在不同浏览器上运行的效果有差异，表现得非常奇怪，因此对某些selector不能用QSA
	          // 为了适应不同的浏览器，就需要首先进行浏览器兼容性测试，然后确定测试正则表达式,用rbuggyQSA来确定selector是否能用QSA

	          if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
	               nid = old = expando;
	               newContext = context;
	               newSelector = nodeType !== 1 && selector;

	               // QSA 在以某个根节点ID为基础的查找中(.rootClass span)表现很奇怪，
	               // 它会忽略某些selector选项，返回不合适的结果
	               // 一个比较通常的解决方法是为根节点设置一个额外的id，并以此开始查询
	               // IE 8 doesn't work on object elements 
	               if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
	                    groups = tokenize( selector );                  // 分析选择器的词法并返回一个词法标记数组
	                    if ( (old = context.getAttribute("id")) ) {     // 保存并设置新id
	                         nid = old.replace( rescape, "\\$&" );
	                    } else {
	                         context.setAttribute( "id", nid );
	                    }
	                    nid = "[id='" + nid + "'] ";
	                     i = groups.length;
	                    while ( i-- ) {
	                         groups[i] = nid + toSelector( groups[i] );     // 把新的id添加到选择器标记里
	                    }
	                    newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
	                    newSelector = groups.join(",");                     // 构造新的选择器
	               }
	                if ( newSelector ) {                                    // 使用新的选择器通过QSA来查询元素
	                    try {
	                         push.apply( results,                          // 将查询结果合并到results上
	                              newContext.querySelectorAll( newSelector )
	                         );
	                         return results;
	                    } catch(qsaError) {
	                    } finally {
	                         if ( !old ) {
	                              context.removeAttribute("id");          // 如果没有旧id,则移除
	                         }
	                    }
	               }
	          }
	     }
	      // 其他selector,这些selector无法直接使用原生的document查询方法
	     return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

##rbuggy：测试QSA的Bug

	/**
	* Support testing using an element
	* @param {Function} fn Passed the created div and expects a boolean result
	*/
	function assert( fn ) {
	     var div = document.createElement("div");          // 创建测试用节点
	     try {
	          return !!fn( div );                          // 转换fn的返回值为boolean值
	     } catch (e) {
	          return false;
	     } finally {
	          if ( div.parentNode ) {                      // 结束时移除这个节点
	               div.parentNode.removeChild( div );
	          }
	          div = null;                                  // IE浏览器中必须这样,释放内存
	     }
	}

* assert函数建立一个div节点，将这个div节点传递给回调函数。
* div节点在assert函数结束时会被删除，此时注意要删除由回调函数创建的子节点，并将div赋值null以让GC回收。
* 回调函数利用新建的div节点作为根节点，在这个根节点上创建一些测试用的节点进行测试。

###一个bug测试例子

	assert(function( div ) {

	     // 创建一些子节点
	     docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
	          "<select id='" + expando + "-\f]' msallowcapture=''>" +
	          "<option selected=''></option></select>";
	     ... // 其他测试
	     // 测试document.querySelectorAll()的正确性
	     if ( div.querySelectorAll("[msallowcapture^='']").length ) {
	          rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );

	          // 确定用于测试selector能否使用QSA的正则表达式

	     }
	     ... // 其他测试 
	});


##select方法
	当无法直接使用document的原生选择器时,就会调用Sizzle.select.
	注释里写到"A low-level selection function that works with Sizzle's compiled",这是一个低级选择器,与Sizzle.compiled协作执行.

	// @param selector 已去掉头尾空白的选择器字符串 
	// @param context 执行匹配的最初的上下文（即DOM元素集合）。若context没有赋值，则取document。 
	// @param results 已匹配出的部分最终结果。若results没有赋值，则赋予空数组。 
	// @param seed 初始集合 

	select = Sizzle.select = function( selector, context, results, seed ) {
	     var i, tokens, token, type, find,
	          compiled = typeof selector === "function" && selector,
	          match = !seed && tokenize( (selector = compiled.selector || selector) );
	      results = results || [];
	      // 当没有seed或group时，尽可能地减少操作
	     if ( match.length === 1 ) {

	          // 如果根选择器是id，利用快捷方式并设置context
	          tokens = match[0] = match[0].slice( 0 );
	          if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
	                    support.getById && context.nodeType === 9 && documentIsHTML &&
	                    Expr.relative[ tokens[1].type ] ) {

	             // 使用Expr.find["ID"]查找元素,其中调用了context.getElementById方法
	             // 为了兼容不同的浏览器,setDocument方法会测试不同的浏览器环境并构造一个使用与当前运行环境的Expr.find["ID"]元素
	             // 将id选择器的返回结果作为新的上下文

	               context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
	               if ( !context ) {
	                    return results;     // 如果找不到id根元素直接返回results
	                // Precompiled matchers will still verify ancestry, so step up a level
	               } else if ( compiled ) {
	                    context = context.parentNode;
	               }
	               // 移除第一个id选择器
	               selector = selector.slice( tokens.shift().value.length );
	          }
	          // Fetch a seed set for right-to-left matching
	          // matchExpr["needsContext"]测试选择器是否含有位置伪类,如:first,:even,或包含"> + ~"等关系
	          // 如果包含将i赋值0,否则赋值tokens.length
	          i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;

	          // 遍历tokens, 逐个查询
	          while ( i-- ) {
	               token = tokens[i];
	                // 遇到关系符"~ + > ."的时候跳出

	               if ( Expr.relative[ (type = token.type) ] ) {
	                    break;
	               }

	               // 根据type获取查询方法
	               if ( (find = Expr.find[ type ]) ) {
	                    // Search, expanding context for leading sibling combinators
	                    // rsibling = /[+~]/， 用于判断同胞关系符
	                    if ( (seed = find(
	                         token.matches[0].replace( runescape, funescape ),
	                         rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
	                    )) ) {

	                         // 如果seed是空的或者没有任何token了,就可以提前返回
	                         // 否则,就根据新的seed和token,迭代地继续搜索下去
	                         tokens.splice( i, 1 );
	                         selector = seed.length && toSelector( tokens );
	                         if ( !selector ) {
	                              push.apply( results, seed );
	                              return results;
	                         }
	                         break;
	                    }
	               }
	          }
	     }
	     // Compile and execute a filtering function if one is not provided
	     // Provide `match` to avoid retokenization if we modified the selector above
	     // 执行compile返回一个匹配器函数, 再利用这个返回的函数进行匹配;
	     ( compiled || compile( selector, match ) )(
	          seed,
	          context,
	          !documentIsHTML,
	          results,
	          rsibling.test( selector ) && testContext( context.parentNode ) || context
	     );
	     return results;
	};


##Compile方法

	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	     var i,
	          setMatchers = [],
	          elementMatchers = [],
	          cached = compilerCache[ selector + " " ];     // 根据selector获取cache中的匹配器
	     // 如果尚未创建这个匹配器，则需要创建一个
	     if ( !cached ) {
	          // 产生一个函数,这个函数包含一系列递归函数用来检索每一个元素
	          if ( !match ) {
	               match = tokenize( selector );          // 解析选择器词法
	          }
	          i = match.length;
	          while ( i-- ) {
	               cached = matcherFromTokens( match[i] );     // 根据token创建匹配器
	               if ( cached[ expando ] ) {
	                    setMatchers.push( cached );
	               } else {
	                    elementMatchers.push( cached );
	               }
	          }
	          // Cache the compiled function
	          // matcherFromGroupMatchers 返回一个superMatcher
	          // compelerCache = createCache(), 根据selector建立匹配器方法cache
	          cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	           //在cached中保存选择器
	          cached.selector = selector;
	     }

	     // 返回这个对应的匹配器
	     return cached;
	};

##总结

* 调用jQuery.find的时候实际上就调用了Sizzle。Sizzle的实现的一个最基本思路是以最快的速度完成选择器匹配，那如何才能够完成呢？对于简单不含其他关系符的选择器如（#id，tag，.class）就尽可能得直接调用document.getElementById/ .getElementByTagName/ .getElementByClassName 等原生方法。这些DOM的基本方法的运行速度是最快的。而对于词法更为复杂的选择器（包含关系符，伪类选择器），首选是调用document.querySelectorAll。QSA的速度非常快，但在不同的浏览器上其运行效果不一样，很多时候会有莫名奇妙的返回结果，因此使用前需要对浏览器进行测试，确保在确定能够使用QSA的情况下才进行这样的调用，否则就需要调用Sizzle.select进行更低层次的元素匹配；
* select的实现相对而言比较复杂，它首先需要对选择器进行词法分析，然后根据所得到的词法标记利用sizzle.compile构造出一系列匹配器，并将这些匹配器组合成一个更大的匹配方法，最后才执行这个匹配方法；关于select的更详细具体的分析，留在日后再看；
* 有select可以看出来，鉴于浏览器的兼容性问题，尤其是针对IE < 8的兼容性，jQuery在这方面作出了许多努力，使得代码的编写变得臃肿，执行效率也有所下降；
* jQuery中使用的assert方法十分精妙，新建DOM节点元素作为测试根节点，然后进行节点匹配测试。要注意的是，测试完成后删除子节点，并对根节点赋值null，否则容易导致内存泄漏（IE）；
* jQuery的选择器是使用频率最高的方法之一，因此一切效率之上。从jQuery的源码可学习到，如何在保证运行效率的前提下保证一个方法对浏览器的兼