var image;

var atlas = {};

// store the information of the bird images
atlas.bird =[

	// bird rising up
	{
		sx: 0, 
		sy: 970,
		sw: 48,
		sh: 48
	},

	// bird sliding
	{
		sx: 56, 
		sy: 970,
		sw: 48,
		sh: 48
	},

	// bird falling down
	{
		sx: 112, 
		sy: 970,
		sw: 48,
		sh: 48
	},
]

// store the information of the pipe images
atlas.pipes = [

	// pipes face down
	{
		sx: 112, 
		sy: 646,
		sw: 52,
		sh: 320
	},

	// pipes face up
	{
		sx: 168, 
		sy: 646,
		sw: 52,
		sh: 320
	}
]

var World = {

	// canvas element
	theCanvas : null,

	// store the canvas context
	ctx: null,

	// width of the canvas
	width: 0,

	// height of the canvas
	height: 0,

	// offset-left of the canvas
	offsetX: 0,

	// offset-top of the canvas
	offsetY: 0,

	// set true to pause the game
	pause: false,

	// store the Bird object
	bird: null,

	// store other items of the world
	items: [],

	// counting the FPS
	frames: 0,

	// atlas image
	altas: undefined,

	// initialize the World
	init : function(){

		// retrieve the canvas
		var theCanvas = this.theCanvas = document.getElementById('game_box');
		this.ctx = theCanvas.getContext('2d');
		
		this.width   = theCanvas.width;
		this.height  = theCanvas.height;
		this.offsetX = theCanvas.offsetLeft;
		this.offsetY = theCanvas.offsetTop;

		// this.bird = new Bird(this.ctx, this.width/10, this.height/2 , 48, 48);
		this.bird = new Bird(this.ctx, this.width/10, this.height/2, 0.15);
		
		// using closure to pass the 'this' pointer of the world
		(function(that){

			// generate the pipes periodically
			setInterval(function(){
				that.pipesCreate();
			}, 2000)

			// binding the key
			document.onkeydown = function(e) {
				e = e || window.event;
				var keyCode = e.keyCode;
				e.preventDefault();

				// so far, ANY KEY will trigger the bird to fly
				that.bird.fly();			
			};

			/*
			//counting the FPS
			setInterval(function(){
				console.log('FPS: ' + frames);
				frames = 0;
			}, 1000);
			//*/

		})(this);
		
		// start the geme loop
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

		// detect the collision between the bird and the pipes
		this.collisionDectect();

		// update the elements
		this.elementsUpdate();

		++frames;

		// next frame
		if(!this.pause){
			setTimeout(function(){
				World.animationLoop();
			}, 16.7)
		}
	},

	// scroll offset
	BGOffset: 0,

	// draw a scrolling background
	backgroundUpdate : function() {
		var offset = --this.BGOffset;
		var ctx = this.ctx;

		offset = this.BGOffset = this.BGOffset <= 0 ? 288 : offset;

		ctx.drawImage(image, 0, 0, 288, 512, offset, 0, 288, 512);
		ctx.drawImage(image, 0, 0, 288, 512, offset - 288, 0, 288, 512);
	},

	// update elements in the world
	elementsUpdate: function(){
		var items = this.items;
		var i = items.length;

		// update the pipes
		while(--i >= 0) {
			items[i].update();
		}

		// update the bird
		this.bird.update();
	},

	// dectect the collision
	collisionDectect: function(){
		var bird = this.bird;
		var bpos = bird.pos;
		var bw = bird.width;
		var bh = bird.height;
		var items = this.items;

		for(var i in items) {
			var pipe = items[i];

			if(this.hitBox(bird, pipe) && this.pixelHitTest(bird, pipe)) {

				// collision occured
				console.log('collision');
				this.reset();
				break;
			}
		} 
	},

	// box collision detection
	hitBox: function (src, tag) {

		return !(

			// if the two boxes are not touched 
			( ( src.pos.y + src.height ) <= ( tag.pos.y ) ) ||
			( src.pos.y >= ( tag.pos.y + tag.height ) ) ||
			( ( src.pos.x + src.width ) <= tag.pos.x ) ||
			( src.pos.x >= ( tag.pos.x + tag.width ) )
		);
	},

	// pixel collision detection
	pixelHitTest: function(src, tag) {
	 	var srcMap = src.pixelMap;
	 	var tagMap = tag.pixelMap;
		var tagRes = tagMap.resolution;
		// Source and target object contain two properties
		// { data: a render-map, resolution: The precision of the render-map}
	 	
		// Loop through all the pixels in the source image
		for( var i = 0; i < src.pixelMap.data.length; i++ ) {
			var sourcePixel = srcMap.data[i];

			// Add positioning offset
			var sourceArea = {
				pos : {
					x: sourcePixel.x + src.pos.x,
					y: sourcePixel.y + src.pos.y,
				},
				width: tagRes,
				height: tagRes
			};
	 
			// Loop through all the pixels in the target image
			for( var j = 0; j < tagMap.data.length; j++ ) {
				var targetPixel = tagMap.data[j];

				// Add positioning offset
				var targetArea = {
					pos:{
						x: targetPixel.x + tag.pos.x,
						y: targetPixel.y + tag.pos.y,
					},
					width: tagRes,
					height: tagRes
				};
				
				// Use the hitBox function the detect the collision of these two square areas
				if( this.hitBox( sourceArea, targetArea ) ) {
					return true;
				}
			}
		}
	},

	// pipe craete
	pipesCreate: function(){

		// there are 3 types of pipes. 0: pipes face down on the top, 1: pipes face up on the bottom, 2: two pipes on the top and the bottom
		var type = Math.floor(Math.random() * 3);
		var that = this;

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

	// pipe clearance, clear the pipes that are out of bound
	pipesClear: function(){
		var it = this.items;
		var i = it.length - 1;
		for(; i >= 0; --i) {
			if(it[i].pos.x + it[i].width < 0) {
				it = it.splice(i, 1);
			}
		}
	},

	pipesClearAll: function(){
		this.items = [];
	},

	// bird dectection
	isBirdOutOfBound: function(callback){
		var bird = this.bird;
		if( bird.pos.y - bird.height - 5 > this.height ||
			bird.pos.y + 200 < 0) {

			// the bird reach the bottom or the top of the world
			return true;
		}
		return false;
	},

	// boundary dectect
	boundDectect: function(){

		if(this.isBirdOutOfBound()){
			
			// the bird is out of bounds, reset the bird the clear all the pipes
			this.bird.reset();
			this.pipesClearAll();
		} else {

			// just clear the pipes which are out of bound
			this.pipesClear();
		}
	},

};

/**
*	for deriving a new Class
*	Child will copy the whole prototype the Parent has
*@param Child, child Class
*@param Parent, parent Class
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

	// position of the item
	this.pos = {
		x: x || 0,
		y: y || 0
	};

	// moving speed of the item
	this.speed = {
		x: 0,
		y: 0
	}

	this.width  = 0;
	this.height = 0;
	this.draw   = typeof draw == 'function' ? draw : function(){};
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
		this.width  = typeof width == 'number' ? width : this.width;
		this.height = typeof height == 'number' ? height : this.height;
	},

	// update function which ran by the animation loop
	update : function() {
		this.setSpeed(null, this.speed.y + this.gravity);
		this.setPos(this.pos.x + this.speed.x, this.pos.y + this.speed.y);
		this.draw(this.ctx);
	},

	/** generate the pixel map for 'pixel collision dectection'
	*@param image, contains the image size and data
	*@param reolution, how many pixels to skip to gernerate the 'pixelMap'
	*/
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
	this.ctx     = ctx;
	this.gravity = g || 0;

	this.pos = {
		x: x || 0,
		y: y || 0
	};

	// default position for reset
	this.depos = {
		x: x || 0,
		y: y || 0
	};

	this.speed = {
		x: 0,
		y: 0
	};

	this.width  = atlas.bird[0].sw || 0;
	this.height = atlas.bird[0].sh || 0;

	// pixel map for 'pixel collistion detection'
	this.pixelMap = null;

	// image type, 0: falling down, 1: sliding, 2: raising up
	this.type     = 1;

	// rotate angle, changed along with speed.y
	this.rdeg     = 0;
	
	this.draw = function drawPoint() {
		var ctx = this.ctx;

		// save the current ctx
		ctx.save();

		// move the context origin
		ctx.translate(this.pos.x, this.pos.y);

		// rotate the image according to the rdeg
		ctx.rotate(this.rdeg*Math.PI/180);

		// draw the image
		ctx.drawImage(image, atlas.bird[this.type].sx, atlas.bird[this.type].sy, this.width, this.height,
							 0, 0, this.width, this.height);

		// restore the ctx after rotation
		ctx.restore();

		// the access the image data using a temporaty canvas
		if(this.pixelMap == null) {

			// create a temporary canvas
			var tempCanvas  = document.createElement('canvas');
			var tempContext = tempCanvas.getContext('2d');

			var imgdata;

			// put the image on the temporary canvas
			tempContext.drawImage(image, atlas.bird[this.type].sx, atlas.bird[this.type].sy, this.width,  this.height,
										 0, 0, this.width, this.height);

			// fetch the image from the temporary canvas
			imgdata       = tempContext.getImageData(0, 0, this.width, this.height);

			// using the resolution the reduce the calculation
			this.pixelMap = this.generateRenderMap(imgdata, 4);
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
	
	// raising up
	if(this.speed.y < -2) {

		// bird's face pointing up
		if(this.rdeg > -10) {
			this.rdeg--;
		}
		this.type = 2;

	// fall down
	} else if(this.speed.y > 2) {

		// bird's face pointing down
		if(this.rdeg < 10) {
			this.rdeg++;
		}
		this.type = 0;

	// sliding
	} else {
		this.type = 1;
	}

	// update position
	this.setPos(this.pos.x + this.speed.x, this.pos.y + this.speed.y);

	// draw the bird on the canvas
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
	this.ctx     = ctx;
	this.type    = type || 0;
	this.gravity = 0;			// the pipe is not moving down
	this.width   = w;
	this.height  = h;
	this.pos = {	x: x || 0,
					y: y || 0
				};
	this.speed = {	x: spx || 0,
					y: 0
	}

	// pixel map for 'pixel collistion detection'
	this.pixelMap = null;
	
	this.draw = function drawPoint(ctx) {
		var pipes = atlas.pipes;

		// a pipe which faces down, that means it should be on the top
		if(this.type == 0) {
			ctx.drawImage(image, pipes[0].sx, pipes[0].sy + pipes[0].sh - this.height, 52, this.height, this.pos.x, 0, 52, this.height);

		// a pipe which faces up, that means it should be on the bottom
		} else {
			ctx.drawImage(image, pipes[1].sx, pipes[1].sy, 52, this.height, this.pos.x, this.pos.y, 52, this.height);
		}

		if(this.pixelMap == null) {

			// just create the pixel map from a temporary canvas
			var tempCanvas = document.createElement('canvas');
			var tempContext = tempCanvas.getContext('2d');

			var imgdata;

			// pipe face down
			if(this.type == 0) {
				tempContext.drawImage(image, 112, 966 - this.height, 52, this.height, 0, 0, 52, this.height);

			// pipe face up
			} else {
				tempContext.drawImage(image, 168, 646, 52, this.height, 0, 0, 52, this.height);
			}

			imgdata = tempContext.getImageData(0, 0, 52, this.height);
			this.pixelMap = this.generateRenderMap(imgdata, 4);
		}
	};
	return this;
}

// derived from the Item class
extend(Pipe, Item);


