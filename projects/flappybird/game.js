console.log('game.js')
console.log(navigator.appName);
var image = document.getElementById('atlas');
console.log(image);

var atlas = {};
atlas.bird =[
	{
		sx: 0, 
		sy: 970,
		sw: 48,
		sh: 48
	},
	{
		sx: 56, 
		sy: 970,
		sw: 48,
		sh: 48
	},
	{
		sx: 112, 
		sy: 970,
		sw: 48,
		sh: 48
	},
]
atlas.pipes = [
	{				// face down
		sx: 112, 
		sy: 646,
		sw: 52,
		sh: 320
	},
	{				// face up
		sx: 168, 
		sy: 646,
		sw: 52,
		sh: 320
	}
]

var World = {

theCanvas : null,


pause: false,

// initialize the world
init : function(){
	var theCanvas = this.theCanvas = document.getElementById('game_box');
	this.ctx = theCanvas.getContext('2d');
	this.bird = null;
	this.items = [];
	this.width = theCanvas.width;
	this.height = theCanvas.height;
	this.offsetX = theCanvas.offsetLeft;
	this.offsetY = theCanvas.offsetTop;

	// this.bird = new Bird(this.ctx, this.width/10, this.height/2 , 48, 48);
	this.bird = new Bird(this.ctx, this.width/10, this.height/2, 0.15);

	(function(that){
		setInterval(function(){
			that.pipesCreate();
		}, 2000)
	})(this);
	(function(that){
		document.onkeydown = function(e) {
			if(navigator.appName == 'Netscape') {
			 	that.bird.fly();
			} else {
				var a = window.event.keyCode;
				that.bird.fly();
				// if( a === 38 ) { 
				// 	that.bird.fly();
				// }	
			}
			
		};
	})(this)
	
	this.animationLoop();
},


// reset the world
reset: function(){
	this.bird.reset();
	this.items = [];
},

// animation loop
animationLoop: function(){

	// scroll the background
	this.backgroundUpdate();

	// detect elements which is out of boundary
	this.boundDectect();

	// detect the collision between bird and pipes
	this.collisionDectect();

	// update the elements
	this.elementsUpdate();

	// next frame
	if(!this.pause){
		setTimeout(function(){
			World.animationLoop();
		}, 16.7)
	}
},


// draw a scrolling background
BGOffset: 0,			// scroll offset
backgroundUpdate : function() {
	var ctx = this.ctx;
	this.BGOffset--;
	if(this.BGOffset <= 0) {
		this.BGOffset = 288;
	}
	ctx.drawImage(image, 0, 0, 288, 512, this.BGOffset, 0, 288, 512);
	ctx.drawImage(image, 0, 0, 288, 512, this.BGOffset - 288, 0, 288, 512);
},

// update elements in the world
elementsUpdate: function(){

	// update the pipes
	var i;
	for(i in this.items) {
		this.items[i].update();
	}

	// update the bird
	this.bird.update();
},

// dectect the collision
collisionDectect: function(){
	var bpos = this.bird.pos;
	var bw = this.bird.width;
	var bh = this.bird.height;
	for(var i in this.items) {
		var pipe = this.items[i];
		if(this.hitBox(this.bird, pipe) && this.pixelHitTest(this.bird, pipe)) {
			console.log('collision');
			// var ctx = this.ctx;
			// this.pause = true;
			this.reset();
			break;
		}
	} 
},


hitBox: function ( source, target ) {
	/* Source and target objects contain x, y and width, height */
	return !(
		( ( source.pos.y + source.height ) < ( target.pos.y ) ) ||
		( source.pos.y > ( target.pos.y + target.height ) ) ||
		( ( source.pos.x + source.width ) < target.pos.x ) ||
		( source.pos.x > ( target.pos.x + target.width ) )
	);
},

pixelHitTest: function( source, target ) {
 
	// Source and target object contain two properties
	// { data: a render-map, resolution: The precision of the render-map}
 	
	// Loop through all the pixels in the source image
	for( var s = 0; s < source.pixelMap.data.length; s++ ) {
		var sourcePixel = source.pixelMap.data[s];

		// Add positioning offset
		var sourceArea = {
			pos : {
				x: sourcePixel.x + source.pos.x,
				y: sourcePixel.y + source.pos.y,
			},
			width: target.pixelMap.resolution,
			height: target.pixelMap.resolution
		};
 
		// Loop through all the pixels in the target image
		for( var t = 0; t < target.pixelMap.data.length; t++ ) {
			var targetPixel = target.pixelMap.data[t];
			// Add positioning offset
			var targetArea = {
				pos:{
					x: targetPixel.x + target.pos.x,
					y: targetPixel.y + target.pos.y,
				},
				width: target.pixelMap.resolution,
				height: target.pixelMap.resolution
			};
			/* Use the earlier aforementioned hitbox function */
			if( this.hitBox( sourceArea, targetArea ) ) {
				return true;
			}
		}
	}
},

// boundary dectect
boundDectect: function(){

	// the bird is out of bounds
	if(this.isBirdOutOfBound()){
		this.bird.reset();
		this.items = [];
	} else {
		this.pipesClear();
	}
},

// pipe craete
pipesCreate: function(){
	var type = Math.floor(Math.random() * 3);
	var that = this;
	// type = 0;
	switch(type) {

		// one pipe on the top
		case 0: {
			var height = 125 + Math.floor(Math.random() * 100);
			that.items.push( new Pipe(that.ctx, 300, 0, 52, height, -1, 0));						// face down
			break;
		}
		// one pipe on the bottom
		case 1: {
			var height = 125 + Math.floor(Math.random() * 100);
			that.items.push(new Pipe(that.ctx, 300, that.height - height, 30, height, -1, 1));		// face up
			break;
		}
		// one on the top and one on the bottom
		case 2: {
			var height = 125 + Math.floor(Math.random() * 100);
			that.items.push( new Pipe(that.ctx, 300, that.height - height, 30, height, -1, 1) );	// face up
			that.items.push( new Pipe(that.ctx, 300, 0, 30, that.height - height - 100, -1, 0) );	// face down
			break;
		}
	}
},

// pipe clearance
// clear the pipes which are out of bound
pipesClear: function(){
	var it = this.items;
	var i = it.length - 1;
	for(; i >= 0; --i) {
		if(it[i].pos.x + it[i].width < 0) {
			it = it.splice(i, 1);
		}
	}
},

// bird dectection
isBirdOutOfBound: function(callback){
	if(this.bird.pos.y - this.bird.height - 5 > this.height) {	// the bird reach the bottom of the world
		return true;
	}
	return false;
},

};


/*
*	for deriving a new Class
*	Child will copy the whole prototype the Parent has
*/
function extend(Child, Parent) {
     var F = function(){};
     F.prototype = Parent.prototype;
     Child.prototype = new F();
     Child.prototype.constructor = Child;
     Child.uber = Parent.prototype;
}

/*
*	Item Class
*	Basic tiem class which is the basic elements in the game world
*@param draw, the context draw function
*@param ctx, context of the canvas
*@param x, posisiton x
*@param y, posisiton y
*@param w, width
*@param h, height
*@param g, gravity of this item
*/
var Item = function(draw, ctx, x, y, w, h, g){
	this.ctx = ctx;
	this.gravity = g || 0;
	this.pos = {	x: x || 0,
					y: y || 0
				};
	this.speed = {	x: 0,		// moving speed of the item
					y: 0
	}
	this.width = 0;
	this.height = 0;
	this.draw = typeof draw == 'function' ? draw : function(){};
	return this;
};

Item.prototype = {
	// set up the 'draw' function
	setDraw : function(callback) {
		this.draw = typeof draw == 'function' ? draw : function(){};
	},

	// set up the position
	setPos : function(x, y) {
		// Handle: setPos({x: x, y: y});
		if(typeof x == 'object') {
			this.pos.x = typeof x.x == 'number' ? x.x : this.pos.x;
			this.pos.y = typeof x.y == 'number' ? x.y : this.pos.y;
		// Handle: setPos(x, y);
		} else {
			this.pos.x = typeof x == 'number' ? x : this.pos.x;
			this.pos.y = typeof y == 'number' ? y : this.pos.y;
		}
	},

	// set up the speed
	setSpeed : function(x, y) {
		this.speed.x = typeof x == 'number' ? x : this.speed.x;
		this.speed.y = typeof y == 'number' ? y : this.speed.y;
	},

	// set the size
	setSize : function(w, h) {
		this.width = typeof width == 'number' ? width : this.width;
		this.height = typeof height == 'number' ? height : this.height;
	},

	// update function which ran by the animation loop
	update : function() {
		this.setSpeed(null, this.speed.y + this.gravity);
		this.setPos(this.pos.x + this.speed.x, this.pos.y + this.speed.y);
		this.draw(this.ctx);
	},

	// generate the pixel map for 'pixel collision dectection'
	//@param image, contains the image size and data
	//@param reolution, how many pixels to skip to gernerate the 'pixelMap'
	generateRenderMap : function( image, resolution ) {
		var pixelMap = [];

		// scan the image data
		for( var y = 0; y < image.height; y=y+resolution ) {
			for( var x = 0; x < image.width; x=x+resolution ) {
				// Fetch cluster of pixels at current position
				// Check the alpha value is above zero on the cluster
				if( image.data[4 * (48 * y + x) + 3] != 0 ) {
					pixelMap.push( { x:x, y:y } );
				}
			}
		}
		return {
			data: pixelMap,
			resolution: resolution
		};
	}
}


/*
*								Bird Class
*
*	a sub-class of Item, which can generate a 'bird' in the world
*@param ctx, context of the canvas
*@param x, posisiton x
*@param y, posisiton y
*@param g, gravity of this item
*/
var Bird = function(ctx, x, y, g) {
	this.ctx = ctx;
	this.gravity = g || 0;
	this.pos = {	x: x || 0,
					y: y || 0
				};
	this.depos = {	x: x || 0,		// default position for reset
					y: y || 0
				};
	this.speed = {	x: 0,
					y: 0
	}
	this.width = atlas.bird[0].sw || 0;
	this.height = atlas.bird[0].sh || 0;

	this.pixelMap = null;			// pixel map for 'pixel collistion detection'
	this.type = 1;					// image type, 0: falling down, 1: sliding, 2: raising up
	this.rdeg = 0;					// rotate angle, changed along with speed.y
	
	this.draw = function drawPoint() {
		var ctx = this.ctx;
		ctx.save();									// save the current ctx
		ctx.translate(this.pos.x, this.pos.y);		// move the context origin 
		ctx.rotate(this.rdeg*Math.PI/180);			// rotate the image according to the rdeg
		ctx.drawImage(image, atlas.bird[this.type].sx, atlas.bird[this.type].sy, this.width, this.height,
							 0, 0, this.width, this.height);													// draw the image
		ctx.restore();								// restore the ctx after rotation

		// the access the image data using a temporaty canvas
		if(this.pixelMap == null) {
			var tempCanvas = document.createElement('canvas');		// create a temporary canvas
			var tempContext = tempCanvas.getContext('2d');
			tempContext.drawImage(image, atlas.bird[this.type].sx, atlas.bird[this.type].sy, this.width,  this.height,
										 0, 0,  this.width,  this.height);	// put the image on the temporary canvas
			var imgdata = tempContext.getImageData(0, 0, this.width, this.height);				// fetch the image from the temporary canvas
			this.pixelMap = this.generateRenderMap(imgdata, 4);		// using the resolution the reduce the calculation
		}
	};
	return this;
}

// derive fromt the Item class
extend(Bird, Item);

// fly action
Bird.prototype.fly = function(){		
	this.setSpeed(0, -5);
};

// reset the position and speed 
Bird.prototype.reset = function(){
	this.setPos(this.depos);
	this.setSpeed(0, 0);
};

// update the bird state and image
Bird.prototype.update = function() {	
	this.setSpeed(null, this.speed.y + this.gravity);
	
	if(this.speed.y < -2) {			// raising up
		if(this.rdeg > -10) {
			this.rdeg--;			// bird's face pointing up
		}
		this.type = 2;
	} else if(this.speed.y > 2) {	// fall down
		if(this.rdeg < 10) {
			this.rdeg++;			// bird's face pointing down
		}
		this.type = 0;
	} else {
		this.type = 1;
	}
	this.setPos(this.pos.x + this.speed.x, this.pos.y + this.speed.y);	// update position
	this.draw();
}


/*
*						Pipe Class
*
*	a sub-class of Item, which can generate a 'bird' in the world
*@param ctx, context of the canvas
*@param x, posisiton x
*@param y, posisiton y
*@param w, width
*@param h, height
*@param spx, moving speed from left to right
*@param type, choose to face down(0) or face up(1)
*/
var Pipe = function(ctx, x, y, w, h, spx, type) {
	this.ctx = ctx;
	this.type = type || 0;
	this.gravity = 0;					// the pipe is not moving down
	this.width = w;
	this.height = h;
	this.pos = {	x: x || 0,
					y: y || 0
				};
	this.speed = {	x: spx || 0,
					y: 0
	}

	this.pixelMap = null;				// pixel map for 'pixel collistion detection'
	
	this.draw = function drawPoint(ctx) {
		var pipes = atlas.pipes;
		if(this.type == 0) {			// a pipe which faces down, that means it should be on the top
			ctx.drawImage(image, pipes[0].sx, pipes[0].sy + pipes[0].sh - this.height, 52, this.height, this.pos.x, 0, 52, this.height);
		} else {						// a pipe which faces up, that means it should be on the bottom
			ctx.drawImage(image, pipes[1].sx, pipes[1].sy, 52, this.height, this.pos.x, this.pos.y, 52, this.height);
		}

		if(this.pixelMap == null) {		// just create the pixel map from a temporary canvas
			var tempCanvas = document.createElement('canvas');
			var tempContext = tempCanvas.getContext('2d');
			if(this.type == 0) {
				tempContext.drawImage(image, 112, 966 - this.height, 52, this.height, 0, 0, 52, this.height);
			} else {					// face up
				tempContext.drawImage(image, 168, 646, 52, this.height, 0, 0, 52, this.height);
			}
			var imgdata = tempContext.getImageData(0, 0, 52, this.height);
			this.pixelMap = this.generateRenderMap(imgdata, 4);
		}
	};
	return this;
}

// derived from the Item class
extend(Pipe, Item);


