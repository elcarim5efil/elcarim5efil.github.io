---
layout: post
title: jQuery 源码分析（8）回头看jQuery的构造器
description: 回头看jQuery的构造器（jQuery.fn，jQury.prototype，jQuery.fn.init.prototype的分析）
category: blog
---

在第一篇jQuery源码分析中，简单分析了jQuery对象的构造过程，里面提到了jQuery.fn、jQuery.prototype、jQuery.fn.init.prototype的关系。

从代码中可以看出，这三者其实都是等价的，都是指向了jQuery.prototype，但这又是为什么呢？为什么要这么绕？一个jQuery.prototype不就解决问题了吗？带着这些疑问，再一次来看看其中的精妙之处。
 
##jQuery构造器
jQuery使用非常方便，其中一个原因就是我们在调用的时候并不需要使用关键字new来创造一个jQeury对象，直接使用jQuery("#id")或$(".class")就可轻松得到一个新的jQuery对象。原因就是jQuery使用工厂方法，利用构造器创造一个新的jQuery对象并返回，省去了用户的new操作。

 
##一般构造器
一般情况下，我们在JavaScript中创建一个类的时候，会这样做：

	var $ = jQuery = function() {
	    return new jQuery();
	}
	jQuery.prototype = {
	    jquery: "1.11"
	};
	console($().jquery);

上面的代码有些奇怪，因为一个构造器返回利用它自身创建了一个新的对象并返回，这样形成了一个死循环，产生栈溢出的异常。因此，上面的代码是错误的代码。


##返回原型方法 jQuery.fn.init
 
为了解决循环，就必须在jQuery.prototype中定义的一个构造器，这就是jQuery.fn.init了。jQeury.fn实际上就是jQuery.prototype的别名，我认为这个别名的目的就为了说明prototype上挂载的都是jQuery类的公有方法，同时也缩减了引用jQuery.prototype时要书写的代码长度。

jQuery.fn.init能够返回jQuery.fn这个原型方法，代码是：

	var $ = jQuery = function() {
	    return jQuery.fn.init();
	}
	jQuery.fn = jQuery.prototype = {
	    init: function(){
	        return this;
	    },
	    jquery: "1.11"
	}

虽然这个方法解决了嵌套为问题，也将jQuery的原型方法传递给了jQuery对象，但它是将一个完整的jQuery.prototype暴露处理，jQuery的任何对this关键字的操作，实际上就是直接在jQuery.prototype上进行操作，那么jQuery.fn的完整性很容易就被破坏了，jQuery对象之间也可能产生不可预估的影响。

    如：

	console.log($().jquery);
	console.log($());       // 将jQuery.prototype打印出来, Object { init: jQuery.prototype.init(), jquery: "1.11"}

##返回一个jQuery.fn.init对象

为了避免直接返回jQuery.fn，我们需要借鉴一开始使用关键字new的方法，通过new创建一个新Oject，改变了this所指向的对象，从而避开对jQuery.fn的直接暴露。

	var $ = jQuery = function() {
	    return new jQuery.fn.init();
	}
	jQuery.fn = jQuery.prototype = {
	    init: function(){
	        this.num = 2015;
	        return this;
	    },
	    jquery: "1.11"
	}

	console.log($().num);          // 2015
	console.log($().jquery);       // undefined
	console.log($());              // Object {num: 2015}

但此时问题来了，new jQuery.fn.init()所返回的新对象并没有继承jQuery.fn，因为jQuery.fn.init.prototype仅仅是指向了一个function对象的原型，并不包含jQuery.fn。这时，是彻底地将jQuery.fn给封锁了起来。

##让jQuery.fn.init.prototype指向jQuery.fn
既然jQuery.fn.init.prototype只是指向了Object.prototype，那么我们只需要改变它的指向，让它指向jQuery.fn不就好了吗？

	var $ = jQuery = function(x) {
	    return new jQuery.fn.init(x);
	}
	jQuery.fn = jQuery.prototype = {
	    init: function(x){
	        this.num = x || 0;
	        return this;
	    },
	    jquery: "1.11"
	}
	jQuery.fn.init.protoytpe = jQuery.fn;

	console.log($(2015).num);           // 2015
	console.log($(2015).jquery);        // 1.11
	console.log($(2016).num);           // 2016
	console.log($(2016).__proto__);     // Object { init: jQuery.prototype.init(), jquery: "1.11" }

显然，jQuery.fn.init这个工厂方法完全奏效了，$()返回的每个对象，都拥有独立的内部变量，也共享jQuery.fn上的公有方法和属性。

##总结　　
到这里，相信这个三个特殊的名字存在的意义就非常明了了。

- jQuery.prototype，挂载jQuery对象的原型方法；
- jQuery.fn是jQuery.prototype的别名，标注jQuery.prototype的意义且缩短代码书写长度，避免混淆（像jQuery.prototype.init.prototype = jQuery.prototype这行代码，能把人看昏了）方便使用；
- jQuery.fn.init.prototype，则是为了让jQuery.fn.init这个工厂方法能够继承jQuery.fn上的原型方法。

虽然三个特殊的名字都代表了同样一个东西，但他们的意义并不相同，因此需要特别注意这一点。

###参考书：
- 朱印宏 《jQury内核详解与实战》