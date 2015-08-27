---
layout: post
title: About Stacking Context
description: 关于层叠上下文
category: blog
---

##层叠上下文 Stacking Context

在[CSS2.1规范](http://www.w3.org/TR/CSS21/visuren.html#z-index)中，每个盒模型的位置是三维的，分别是平面画布上的x轴，y轴以及表示层叠的z轴。对于每个html元素，都可以通过设置`z-index`属性来设置该元素在视觉渲染模型中的层叠顺序。

`z-index`可以设置成三个值：
- `auto`，默认值。当设置为`auto`的时候，当前元素的层叠级数是0，同时这个盒不会创建新的层级上下文（除非是根元素，即`<html>`）；
- `<integer>`。指示层叠级数，可以使负值，同时无论是什么值，都会创建一个新的层叠上下文；
- `inherit`。


除了由根根元素创建的根层叠上下文以外，其它上下文是由`z-index`不为`auto`的“positioned”元素所创建。

参考层叠级数，浏览器会根据以下规则来渲染绘制每个在同一个层叠上下文中的盒模型：
（从先绘制到后绘制）

1. 创建层叠上下文的元素的背景和边界；
2. `z-index`为负值的子元素，数值越小越早被绘制；
3. 同时满足“in-flow”、“non-inline-level”、**“non-positioned”**的后代元素；
4. **“non-positioned”的浮动元素**；
5. 满足“in-flow”、“inline-level”、“non-positioned”的后代元素；
6. 层叠级数为0的子层叠上下文以及“positioned”且层叠级数为0的后代元素；
7. 层叠级数大于等于1的“positioned”子层叠上下文，数值越小越早被绘制；

在规则中，提到了几种元素的修饰词，下面是简单的解释：

- **“positioned”**指的是`position`为`fixed`，`absolute`，`relative`；那么如果未设置或为`static`的就是**“non-positioned”**元素；
- **“out-of-flow”**元素指的浮动的或绝对定位（`fixed`、`absolute`）的元素，又或者是根元素；如果不是上述情况，那个这个元素就是**“in-flow”**；
- **“inline-level”**元素指的是`display`为`inline`，`inline-table`，`inline-block`的元素；

规则有点多，但简单说，就是父元素会先绘制，接着是`z-index`为负值的子元素，然后是“non-positioned”元素，最后是按照层叠级数从0开始逐级绘制（这样说比较简单，省略了大量细节，因此并不是很准确）。如果层级相同，则按照元素在DOM树中的顺序来进行绘制。

从这样看，要让`z-index`非负的元素按照层级控制生效，那么就将该元素设置为“positioned”，这也是许多文章中普遍提到的规则。

下面，将利用MDN中的例子来分析和解释层叠上下文中的规则和计算方法，部分代码使用的MDN上的源码，另外一些是经过细微修改，目的是为了更好得把问题描述得更清楚。

##不设置z-index的层叠

利用[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/Stacking_without_z-index)上的一个例子来说明。

为了方便比较，将源码简化成如下：

	<body>
		<div id="absdiv1">DIV #1</div>
		<div id="reldiv1">DIV #2</div>
		<div id="reldiv2">DIV #3</div>
		<div id="absdiv2">DIV #4</div>
		<div id="normdiv">DIV #5</div>
	</body>

其中`DIV#1`和`DIV#4`是粉色框，`position`设置为`absolute`；

`DIV#2`和`DIV#3`是粉色框，`position`设置为`relative`；

`DIV#5`是黄色框，`position`为设置，默认`static`；

![](https://mdn.mozillademos.org/files/787/understanding_zindex_01.png)

根据规则，由于`DIV#5`是“non-positioned”，即使`DIV#5`是DOM树中最后的元素，它也是最早被绘制的，因此它处于所有“positioned”的下面；而对于其余四个“positioned”的`DIV`，它们的绘制顺序就是按照在DOM树中的顺序绘制，即`DIV#1`->`DIV#2`->`DIV#3`->`DIV#4`。

尽管`DIV#5`是最“先绘制”的，但是浏览器在解析HTML的时候仍然是按照HTML文档流的顺序来解析的，实际的绘制顺序仍然是`DIV#1`->`DIV#2`->`DIV#3`->`DIV#4`->`DIV#5`。只不过，要绘`DIV#5`的时候，会对影响到的元素进行重新绘制，其渲染的效果看上去的顺序是`DIV#5`->`DIV#1`->`DIV#2`->`DIV#3`->`DIV#4`，将`DIV#5`提到了最前。

##float的层叠

同样是要[MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/Stacking_and_float)上面的例子来说明。

	<body>
		<div id="absdiv1">
	        <br /><span class="bold">DIV #1</span>
	        <br />position: absolute;
	    </div>

	    <div id="flodiv1">
	        <br /><span class="bold">DIV #2</span>
	        <br />float: left;
	    </div>
	
	    <div id="flodiv2">
	        <br /><span class="bold">DIV #3</span>
	        <br />float: right;
	    </div>
	
	    <br />
	
	    <div id="normdiv">
	        <br /><span class="bold">DIV #4</span>
	        <br />no positioning
	    </div>
	
	    <div id="absdiv2">
	        <br /><span class="bold">DIV #5</span>
	        <br />position: absolute;
	    </div>
	</body>


其中`DIV#1`和`DIV#5`是粉色框，`position`设置为`absolute`；

`DIV#1`和`DIV#2`是粉色框，`float`设置分别为`left`和`right`，`opacity`是1；

`DIV#4`是黄色框，`position`为设置，默认`static`；

![](http://i.imgur.com/EgZpGDK.png)

上一节的例子类似，由于`DIV#4`是“non-positioned”，所以`DIV#4`仍然是最先绘制的，因此**它的背景和边界**将在所有元素的最下面。而且根据规则，`DIV#4`中的inline-level元素（`<span>`）会在浮动元素绘制以后才绘制，结果是`<span>`被挤到了`DIV#2`的右边。

根据规则，浮动元素是在“positioned”元素之前绘制，因此`DIV#1`和`DIV#5`会在两个浮动元素的上面。

要注意到，在这里几个`<div>`的并没有设置透明度，这跟MDN上的源码有所区别。那现在，如果完全按照MDN的源码，将`DIV#1`，`DIV#2`，`DIV#3`，`DIV#5`的`opacity`设置为`0.7`，显示结果如下：

![](http://i.imgur.com/Rj70yfI.png)

仔细观察，可以发现，在设置了`opacity`后，`DIV#3`的层级被提高到了`DIV#1`之上了。这与CSS2.1上的规定有所区别。

如果对`DIV#4`设置`opacity:0.99`，结果更加出人意料：

![](http://i.imgur.com/WtybPIQ.png)

原本在最下面的`DIV#4`跑到了更加前面的位置，只位于`DIV#5`之下。

由于`opacity`并不是在CSS2.1里规定，需要使用CSS3中新的规则来解释这一个现象，更容易理解z-index的规则，现在暂时不讨论`opacity`所带来的影响，避免把规则变得更复杂。

##设置了z-index的层叠

再次使用[MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/Adding_z-index)中的例子:

	<body>
	    <div id="absdiv1">DIV #1</div>
	    <div id="reldiv1">DIV #2</div>
	    <div id="reldiv2">DIV #3</div>
	    <div id="absdiv2">DIV #4</div>
	    <div id="normdiv">DIV #5</div>
	</div>

为了让结构更加清楚，简化了HTML源码，下面是每个`<div>`的属性设置：

- `DIV#1`：`position: absolute`，`z-index: 5`；
- `DIV#2`：`position: relative`，`z-index: 3`；
- `DIV#3`：`position: relative`，`z-index: 2`；
- `DIV#4`：`position: absolute`，`z-index: 1`；
- `DIV#5`：`position: static`，`z-index: 8`；

![](http://i.imgur.com/zusuJp8.png)

又见到了可怜的`DIV#5`，尽管它的`z-index：8`是所有元素中最大的，但由于它是“non-posititoned”所以，它在层叠上还是地位低下，仍然要老老实实呆在其他元素的下面。

而对于其他“positioned”元素，它们的绘制顺序就是按照z-index的大小来加以分别，因此尽管`DIV#1`在DOM树中是最靠前的，但由于它的`z-index: 5`比其他都大，因此就成了最顶层的元素了。

##层叠上下文

首先，回忆一下，创造层叠上下文的两种情况：

- 根元素，创建根层叠上下文；
- `z-index`不为`auto`的`positioned`元素；

###实例一（同一层叠上下文中的时代）

继续使用[MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/Stacking_context_example_1)上的例子，来说明如果层叠上下文对`z-index`计算的影响。

	<body>
		<div id="div1">
		   <div id="div2"></div>
		</div>

		<div id="div3">
		   <div id="div4"></div>
		</div>
	</body>

免去其他杂乱的样式和显示，HTML的主体结构如上所示，其中的属性设置如下：

- `DIV#1`：`position: relative`；
	- `DIV#2`：`position: absolute`， `z-index: 1`；
- `DIV#3`：`position: relative`；
	- `DIV#4`：`posititon: absolute`；

从代码就可以推断出，除了根元素创建的根层叠上下文以外，还有`DIV#2`所创建的层叠上下文。因此，尽管`DIV#2`与`DIV#3`或`DIV#4`都不在一个BFC（块格式化上下文）中，但它们都同处于一个层叠上下文中，因此根据层叠规则，`DIV#2`的`z-index`最高，因此处于另外三个元素之上。

显示的结果则如下图：

![](http://i.imgur.com/HrahBJ7.png)

当然，如果将`DIV#4`设置`z-index: 2`，那么`DIV#4`就会跑到最顶部：

![](http://i.imgur.com/1L2i2zf.png)

从此可以得知，层叠计算时，将考虑同一个层叠上下文中的所有元素而不考虑元素是否有其他联系。

###实例二（拼爹的时代）

依然上上面的例子：

	<body>
		<div id="div1">
		   <div id="div2"></div>
		</div>

		<div id="div3">
		   <div id="div4"></div>
		</div>
	</body>

但现在将各个元素的属性做一些修改：

- `DIV#1`：`position: relative`；
	- `DIV#2`：`position: absolute`， `z-index: 2`；
- `DIV#3`：`position: relative`，`z-index: 1`；
	- `DIV#4`：`posititon: absolute`，`z-index: 100`；

在看结果之前，先根据源码推断一下计算的结果。首先，`DIV#2`创建了一个层叠上下文（SC2），而`DIV#2`本身在**根层叠上下文**中的层级是2；与`DIV#2`处于同一个层叠上下文的`DIV#3`也创建了一个层叠上下文（SC3），同时由于其`z-index`是`1`，比`DIV#2`要小，`DIV#3`理所当然地会屈于`DIV#2`之下；另外，`DIV#3`还有一个子元素`DIV#4`，`DIV#4`显然是处于`DIV#3`所创建的层叠上下文（SC3）中，同时，自己又创建了另一个新的层级上下文（SC4）。

那么问题来了，`DIV#4`的`z-index`是`100`，比所有元素都要大，那么`DIV#4`会处于什么位置呢？

![](http://i.imgur.com/3LKUYpj.png)

从结果可以看到，`DIV#2`和`DIV#3`位置和预想中是一样的，但由于`DIV#4`则是处于`DIV#2`之下`DIV#3`之上。其中原因还，`DIV#4`所处的层叠上下文SC3的层级比SC2要低，因此不管`DIV#4`有多大，它都**不会超过比自身高的层叠上下文中的元素**。

如果改一改各个元素的属性：

- `DIV#1`：`position: relative`，`z-index: 1`；
	- `DIV#2`：`position: absolute`， `z-index: 100`；
- `DIV#3`：`position: relative`，`z-index: 1`；
	- `DIV#4`：`posititon: absolute`，`z-index: 2`；

通过修改代码，我们让`DIV#1`和`DIV#3`的`z-index`为`1`，它们在SC0（**根层叠上下文**）中的层级都是1,那么它们将按照DOM树的顺序来绘制，这意味着`DIV#3`稍微比`DIV#1`高那么一点。

在这两个层叠上下文中，分别有子元素`DIV#2`和`DIV#4`。此时，尽管`DIV#2`的层级数非常大，但由于它所处的层叠上下文SC1在SC3之下，因此`DIV#2`不仅在`DIV#4`之下，还会位于`DIV#3`之下。显示结果如下图所示：

![](http://i.imgur.com/GPPK0Jg.png)

通过这个例子，可以更清楚得认识到，层叠的计算是非常依赖所处的层叠上下文的，用刚通俗的话讲，层叠计算时期是一个拼爹的时代。

###小结

到这里，可以得到一些结论：

- 在同一个层叠上下文中计算层叠顺序时，根据前文所提到的规则来进行就是；
- 对于不同的层叠上下文的元素，层级较大的层叠上下文中的元素用于处于层级小的层叠上下文中的元素之上（[MG12](http://www.neoease.com/css-z-index-property-and-layering-tree/)将其归结为从父规则）；
- 从另一个角度理解，不同层叠上下文中的元素在计算层叠顺序时不会互相影响，因为在层叠上下文被创建的时候它与其他上下文的层叠顺序就早已经被决定了； 

##创建层叠上下文

前文曾经提到，根元素以及`z-index`非`auto`的“positioned”元素可以会创建新的层叠上下文，这也是CSS2.1规范唯一提到的，但是在CSS3中，创建层叠上下文的触发条件有了修改，在[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)中有如下描述：

> 文档中的层叠上下文由满足以下任意一个条件的元素形成：
> 
> - 根元素 (HTML),
> - 绝对（absolute）定位或相对（relative）定位且 z-index 值不为"auto"，
> - 一个 flex 项目(flex item)，且 z-index 值不为 "auto"，也就是父元素 display: flex|inline-flex，
> - 元素的 opacity 属性值小于 1（参考 the specification for opacity），
> - 元素的 transform 属性值不为 "none"，
> - 元素的 mix-blend-mode 属性值不为 "normal"，
> - 元素的 isolation 属性被设置为 "isolate"，
> - 在 mobile WebKit 和 Chrome 22+ 内核的浏览器中，position: fixed 总是创建一个新的层叠上下文, 即使 z-index 的值是 "auto" （参考 这篇文章），
> - 在 will-change 中指定了任意 CSS 属性，即便你没有定义该元素的这些属性（参考 这篇文章）
> - 元素的 -webkit-overflow-scrolling 属性被设置 "touch"

###opacity的影响

在这里，我们看到了那个令人惊讶的`opacity`，原来它也创建了一个新的层叠上下文。为什么`opacity`小于1时需要创建新的层叠上下文呢？在[CSS3-color](http://www.w3.org/TR/css3-color/#transparency)中有这样的解释。

> Since an element with opacity less than 1 is composited from a single offscreen image, content outside of it cannot be layered in z-order between pieces of content inside of it. For the same reason, implementations must create a new stacking context for any element with opacity less than 1.

由于一个`opacity`小于1的元素需要依靠这个元素以外的图像来合成，因此它外部内容不能根据`z-index`被层叠到该元素的内容中间（子元素也会变得透明，如果存在`z-index`不为`auto`的“positioned”子元素，那么这些子元素就需要与外部元素进行层叠计算，透明部分就会有奇怪的计算结果），因此它需要创建一个新的层叠上下文，以防止外部内容对该元素的透明化内容造成影响。

那么`opacity`对实际的层叠会有什么影响呢？规范中这样描述的：

>  If an element with opacity less than 1 is not positioned, implementations must paint the layer it creates, within its parent stacking context, at the same stacking order that would be used if it were a positioned element with ‘z-index: 0’ and ‘opacity: 1’. If an element with opacity less than 1 is positioned, the ‘z-index’ property applies as described in [CSS21], except that ‘auto’ is treated as ‘0’ since a new stacking context is always created. See section 9.9 and Appendix E of [CSS21] for more information on stacking contexts. The rules in this paragraph do not apply to SVG elements, since SVG has its own rendering model ([SVG11], Chapter 3).

- `opacity`小于1的“non-positioned”元素，它就会被当作一个`z-index: 0`且`opacity: 1`的“positioned”元素一样，来进行层叠计算（前文规则中的第6层）；
- `opacity`小于1的“positioned”元素，它将按照前文中`z-index`的层叠规则计算技术，只不过，即使`z-index`是`auto`，仍然会创建层叠上下文；

回到之前讨论“不设置z-index的层叠”时用到的例子：

	<body>
		<div id="flodiv2">DIV #1</div>
	    <div id="normdiv">DIV #2</div>
	    <div id="flodiv2">DIV #3</div>
	    <div id="normdiv">DIV #4</div>
	    <div id="absdiv2">DIV #5</div>
	</body>

将`DIV#3`的`opacity`设置为`0.7`，显示结果如下：

![](http://i.imgur.com/QBIYvlR.png)

所有的`opacity`小于1的元素都是“positioned”，`z-index`默认为`auto`，即为0，根据规则6（层叠级数为0的子元素以及“positioned”且层叠级数为0的后代元素），它将不是浮动元素，而是一个“positioned”且层叠级数为0的元素，因此它将会被绘制到`DIV#1`之上（如果`opacity`为1，它应该是在`DIV#1`之下的）；

如果仅将`DIV#4`设置`opacity: 0.9`，那么结果会使：

![](http://i.imgur.com/qW6QpQB.png)

那么`DIV#4`就是`opacity`小于1的`non-positioned`元素，它将同样被当成`z-index: 0`且`opacity: 1` 的 “positioned”元素一样，即是规则6（层叠级数为0的子元素以及“positioned”且层叠级数为0的后代元素），由于它与其他元素都处于`z-index: 0`，因此根据DOM树的顺序，它将仅在`DIV#5`之下。（即使将其他所有元素都设置`opacity`小于1，那么所有的这些元素都是根据规则6进行层叠计算，那么结果就是根据DOM树顺序产生）

Problem solved！！！

至于其他触发条件，就不再一一分析了。

##总结

- 元素设置了`z-index`后，必须将`position`设置为`fixed`、`absolute`或`relative`才回使`z-index`创建新的层叠上下文或生效；
- 根元素（`<html>`）拥有一个根层叠上下文；
- 计算层叠顺序时，需要先考虑元素所处的层叠上下文，层叠上下文之间的层叠关系直接决定了其元素集合之间的层叠关系（从父规则）；
- `opacity`及一些其他新的CSS3属性的设置也可能创建新的层叠上下文，这些属性的引入让层叠计算变得更加复杂；
- 层叠计算规则基本是（不是最准确的描述）：
	1. 创建层叠上下文的元素的背景和边界；
	2. `z-index`为负值的子元素；
	3. “non-positioned”的元素；
	4. “non-positioned”的浮动元素；
	5. “non-positioned”的内联元素（文本等）；
	6. `z-index`为0的“positioned”元素；
	7. `z-index`大于等于1的“positioned”子元素；

层叠上下文是个比较少接触的概念，但这又是一个非常重要的概念，它决定了元素的层叠顺序的计算方式，尤其是利用`z-index`对元素层叠进行控制的时候，如果不理解层叠上下文的概念，就容易遇到各种各样奇怪的问题，有时候，这些问题被错误的归结为浏览器的“BUG”。实际上，大多数浏览器都是根据规范干活的，不要轻易地怀疑浏览器，而是要去看看规范中是怎样定义规则的。

本文大量参考并引用MDN上的文字和源码，并在其基础上作些许改动以求更简单明了的解释。如果对源码有疑问，请先去MDN上参考相关源码和文献。

本文是基于我对层叠上下文的学习和理解记录而成，由于自己是初学者，不敢保证文中所有观点都是正确的，因此我的观点仅作参考，若发现文中有错误，欢迎大家指出，我会尽快作出修正。



##参考

[Specifying the stack level: the 'z-index' property](http://www.w3.org/TR/CSS21/visuren.html#z-index)

[Understanding CSS z-index](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index)

[Stacking without z-index](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/Stacking_without_z-index)

[Stacking and float](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/Stacking_and_float)

[CSS Stacking Context里那些鲜为人知的坑](http://blog.angular.in/css-stacking-contextli-na-xie-xian-wei-ren-zhi-de-keng/)

[css3-color-#transparency](http://www.w3.org/TR/css3-color/#transparency)


[CSS z-index 属性的使用方法和层级树的概念](http://www.neoease.com/css-z-index-property-and-layering-tree/)

[position 属性和 z-index 属性对页面节点层级影响的例子](http://www.neoease.com/tutorials/z-index/)