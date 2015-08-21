---
layout: post
title: 关于document.write
description: Somthing About document.write
category: blog
---

##document.write的用处

`document.write`是JavaScript中对`document.open`所开启的文档流(document stream操作的API方法，它能够直接在文档流中写入字符串，一旦文档流已经关闭，那`document.write`就会重新利用`document.open`打开新的文档流并写入，此时原来的文档流会被清空，已渲染好的页面就会被清除，浏览器将重新构建DOM并渲染新的页面。

##写入文本

下面来看看如何在利用`document.write`来写入脚本。先考虑如下代码：

	<!DOCTYPE HTML>
	<html>
	<head>
	</head>
	<body>
		<h1>Head</h1>
		<script>
			document.write('<p>hello document</p>');
		</script>
		<h2>Tail</h2>
	</body>
	</html>

这段在`h1`和`h2`之间内嵌一个脚本，使用`document.write`来写入一个`p`标签。

刷新页面，可以看到最终的结果是

	Head
	
	hello document
	

	Tail

即要文本在脚本执行的位置被插入。这是因为，浏览器就解析HTML构建DOM的时候，如果遇到`script`就会暂停下来，解析`script`中的代码并执行，然后再继续解析剩余HTML。

此时再去浏览器中检测DOM的结构，会发现`script`与`h2`之间多了一个`p`，浏览器在解析完`h1`之后，碰到`script`并执行之，此时`document.write`将一段HTML代码写入到文档流中，script执行完毕后，浏览器会解析文档流中的字符串，对新添加的`p`标签进行解析。

如果将渲染好的页面保存下来，不同的浏览器会有不同的结果。如Chrome和Firefox的做保存下来的页面文件中，`script`后面会增加`p`标签，而IE中则是维持原状。（这里指的是原有的HTML结构，不同浏览器将页面保存会作不同的处理，有些会增加一些不影响原有结构的标签或注释。这意味着，如果浏览器重新加载Chrome或Firefox中保存下来的页面文件，就会多出一个`p`标签。

##写入<script\>

既然`document.write`可以写入`p`并被浏览器解析，那么自然地也可以写入`script`标签。

	<script>
		document.write('<script>alert("oops!!!")</script>');
	</script>

我们将代码作出上面的改动，意图在利用`document.write`在页面中插入一段脚本。这段代码的本意是弹出一个窗口，阻塞浏览器对HTML的解析。

浏览器下刷新页面，发现并不管用，取而代之的是显示出一个没有意料到的页面。

	Head
	
	');
	Tail

去检查DOM树，就会发现，这段脚本被拦腰截断了！浏览器将它解析成以下代码：

	<script>
		document.write('<script>alert("oops!!!")
	</script>
	');
	
插入文本中的`</script>`被当成了第一个`script`的闭合标签，因此这个段代码成了非法代码，因为`document.write`的调用书写不正确，缺少右边的括号`)`。此时，你可以在console中看到相关的错误信息。

为了解决这个问题，我们可以对插入文本中闭合的的标签进行轻微修改，对最后一个`>`进行转义，变成`\>`。

此时再刷新一下页面，就可以看到预想中的结果。即页面中仅显示`h1`，弹窗阻塞了浏览器对HTML的解析，关闭弹窗后，浏览器继续对HTML的解析并完成对页面的渲染。

再去看看DOM的结构，会发现在原有的`script`元素后面又多了一个新的`<script>`元素，其中所执行的代码就是我们的`alert("opps!!!")`。

##document.write使用的时机很重要

这样看来，利用`document.write`来在HTML中插入标签非常方便，就如同让浏览器在解析HTML的时候动态得添加标签，而且只需要一行代码即可，不需要使用`document.createElement`再将其插入到DOM中。

但为什么大家都不建议使用document.write呢？这跟`document.write`的实现机制有关。在讨论之前，先看看下面的代码：

	<script>
		setTimeout(function(){
			document.write('<p>5 secs later</p>');
		}, 5000);
	</script>

对之前的代码作简单修改，这段代码同样是想插入一个`p`元素，但它是在5秒以后才执行。

刷新页面后，我们看到了这样的显示效果：

	Head
	
	Tail

但是5秒以后，页面却变成了这样：

	5 secs later

原来的`h1`、`h2`甚至是`script`，`DOCTYPE`还有`head`（当然，之前并没有往head添加任何标签，但如果添加了，这些标签也会有同样的下场），它们全部都不见了，取而代之的是一个基本的html结构，它是这样的：
	
	<html>
		<head></head>
		<body>
			<p>5 secs later</p>
		</body>
	</html>

这是一个全新的页面，`document.write`将之前的页面全部清除了，重新打开一页面并在这个页面上写入了新的标签。为什么会这样呢？

回到再文章开头所描述文字，就会找到结果。这是因为，5秒以后，浏览器早已完成了HTML的解析，并将文档流给关闭了。5秒后，`timeout`事件触发，`document.write`在执行的时候发现文档流已经关闭了，就会重新调用`document.open`打开一个新的文档流，而`document.open`的调用则会清除已有的文档。所以，最终看到的显示结果就是向上面那样，之前存在的页面都被清除掉了。

如果我们把`document.write`调用放到`DOMCOntentLoaded`或`load`的事件处理中，也会得到同样的结果。

这样看到，除非是在浏览器关闭文档之前调用`document.write`，否则当前页面都会被清除。


这一个特性决定了`document.write`在实际开发中的应用范围和时机。那么，什么时候应该使用`document.write`呢？

在网上搜集的资料看，一般在下列情景下可以利用`document.write`来完成某些特殊的操作：

###加载需要配合JS脚本使用的外部CSS文件

利用下面的语句加载外部样式文件：

	<scirpt>
		document.write('<link  rel="stylesheet" href="style_neads_js.css">');
	</script>

将所有需要用到JS的样式都放到这个外部样式表中，如果浏览器不禁用JS，那么该样式表就会被顺利加载，否则页面就不会使用该样式。（[Don’t docwrite scripts](http://www.stevesouders.com/blog/2012/04/10/dont-docwrite-scripts/)）

###在新的窗口中写入新的页面数据时

既然在一个已加载完成的页面中调用`document.write`会重写整个页面，那么在一个新的窗口的空白页面中调用这个方法，就不存在这样的的问题了。

另外，在调用`document.write`，最好不要把`document.open`和`document.close`漏掉，尽管多数时候浏览器会帮忙完成这些操作。即，一个标准的document.write应该是这样的：

	document.open();
	document.write('anthing')
	document.close();

##弊端

从某个角度说，`document.write`的实际功能确实很强，能够直接修改文档流，但它有很多弊端：

- 在非loading阶段调用`document.write`会清除已加载的页面；
- **document.write不能够在XHTML中使用**；
- 嵌入`script`中的`document.write`不能给任意节点添加子节点，因为它是随着DOM的构建执行的；
- 利用`document.write`写入HTML字符串流并不是一个好方法，它有违DOM操作的概念；
- 利用`document.write`添加`script`加载外部脚本时，浏览器的HTML解析会被`script`的加载所阻塞；

##总结

综合上面所描述的关于`document.write`的种种特点，个人感觉还是不到迫不得已的时候，不要去使用document.write，使用不当document.write不仅会影响页面的性能，还容易造成各种bug。

要对DOM进行操作时，还是应当使用安全且对DOM的友好的API方法，以避免不必要的问题出现。

上述信息都是以自己做的小测试和网上的参考资料为基础总结出来，有错误的地方，欢迎大家指出，我会尽快作出修正。


##参考

[js中document.write的那点事](http://www.cnblogs.com/dh616854836/articles/2140349.html)

[document.wrtie_MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/write)

[Three JavaScript articles and one best practice](http://www.quirksmode.org/blog/archives/2005/06/three_javascrip_1.html)

[Don’t docwrite scripts](http://www.stevesouders.com/blog/2012/04/10/dont-docwrite-scripts/)

[Why is document.write considered a “bad practice”?](http://stackoverflow.com/questions/802854/why-is-document-write-considered-a-bad-practice)