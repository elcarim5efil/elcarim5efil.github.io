var space;
var shapeArray=[];

var gameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		gameLayer = new game();
		gameLayer.init();
		this.addChild(gameLayer);
	}
});

var game = cc.Layer.extend({
	init:function () {
		this._super();
		var backgroundLayer = cc.LayerGradient.create(cc.color(0xdf,0x9f,0x83,255), cc.color(0xfa,0xf7,0x9f,255));
		this.addChild(backgroundLayer); 
		
        space = new cp.Space();
        space.iterations = 5;
		space.gravity = cp.v(0, -750);

		var debugDraw = cc.PhysicsDebugNode.create(space);
		debugDraw.setVisible(true);
		this.addChild(debugDraw);

		var thickness = 50;
		var floor = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(0,0-thickness), cp.v(480,0-thickness), thickness));
        floor.setElasticity(0.7);
        floor.setFriction(0.8);
        var lwall = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(0-thickness,320), cp.v(0-thickness,0), thickness));
        var rwall = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(480+thickness, 320), cp.v(480+thickness, 0),thickness));
        var ceiling = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(0, 320+thickness), cp.v(480, 320+thickness), thickness));
        lwall.setElasticity(0.5);
        lwall.setFriction(1);
        rwall.setElasticity(0.5);
        rwall.setFriction(1);
        ceiling.setElasticity(0.5);
        ceiling.setFriction(1);


		/*
		this.addBody(240,10,480,20,false,"assets/ground.png","ground");
		this.addBody(204,32,24,24,true,"assets/brick1x1.png","destroyable");
		this.addBody(276,32,24,24,true,"assets/brick1x1.png","destroyable");
		this.addBody(240,56,96,24,true,"assets/brick4x1.png","destroyable");
		this.addBody(240,80,48,24,true,"assets/brick2x1.png","solid");
		this.addBody(228,104,72,24,true,"assets/brick3x1.png","destroyable");
		this.addBody(240,140,96,48,true,"assets/brick4x2.png","solid");
		this.addBody(240,188,24,48,true,"assets/totem.png","totem");
		*/
		var ball = new Ball();
		this.addChild(ball,0);
		ball.setPosition(200,240);
		this.ball = ball;

		var player_A = new BallPlayer(cc.p(200,200));
		player_A.spawn(this);
		//this.addChild(player_A,0);
		this.scheduleUpdate();
		//this.scheduleUpdate(this.ball, 0.5);
		//cc.eventManager.addListener(touchListener, this);
		//space.setDefaultCollisionHandler(this.collisionBegin,null,null,null);  		
	},
	addBody: function(posX,posY,width,height,isDynamic,spriteImage,type){
		if(isDynamic){
			var body = new cp.Body(1,cp.momentForBox(1,width,height));
		}
		else{
			var body = new cp.Body(Infinity,Infinity);
		}
		body.setPos(cp.v(posX,posY));
		//var bodySprite = cc.Sprite.create(spriteImage);
        //gameLayer.addChild(bodySprite,0);
        //bodySprite.setPosition(posX,posY);
		if(isDynamic){		
		   space.addBody(body);		
		}
		var shape = new cp.BoxShape(body, width, height);
		shape.setFriction(0.8);
		shape.setElasticity(0.9);
		shape.name=type;
		//shape.image=bodySprite;
		space.addShape(shape);
		shapeArray.push(shape);	
	},
	update:function(dt){
        dt = dt>0.2? 0.1:dt;
     	space.step(dt);
          for(var i=shapeArray.length-1;i>=0;i--){
               //shapeArray[i].image.x=shapeArray[i].body.p.x
               //shapeArray[i].image.y=shapeArray[i].body.p.y
               //var angle = Math.atan2(-shapeArray[i].body.rot.y,shapeArray[i].body.rot.x);
               //shapeArray[i].image.rotation= angle*57.2957795;
          }     
     },
     collisionBegin : function (arbiter, space ) {
          if((arbiter.a.name=="totem" && arbiter.b.name=="ground") || (arbiter.b.name=="totem" && arbiter.a.name=="ground")){
               console.log("Oh no!!!!");
          }
          return true;
     }
});

var touchListener = cc.EventListener.create({
     event: cc.EventListener.TOUCH_ONE_BY_ONE,
     onTouchBegan: function (touch, event) { 
          for(var i=shapeArray.length-1;i>=0;i--){
               if(shapeArray[i].pointQuery(cp.v(touch._point.x,touch._point.y))!=undefined){
                    if(shapeArray[i].name=="destroyable"){
                         gameLayer.removeChild(shapeArray[i].image);
                         space.removeBody(shapeArray[i].getBody())
                         space.removeShape(shapeArray[i])
                         shapeArray.splice(i,1);
                    }
               }
          }
     }
});

var Ball = cc.PhysicsSprite.extend({
	ctor: function(){
		this._super();
		this.initWithFile("assets/ball.png");

		var body = space.addBody(new cp.Body(1, cp.momentForBox(1, 50, 50)));
        var shape = space.addShape(new cp.CircleShape(body, 25, cp.v(0, 0)));
        shape.setElasticity(1);
        shape.setFriction(1);

        this.body = body;
        this.shape = shape;
        this.setBody(this.body);
	},
	update: function() {
		
	},
	reset: function(){

	}
});

var BallPlayer = cc.Class.extend({
	ctor: function(pos){
		//this._super();
		this.head = new CPSprite('assets/head10.png',cc.pAdd(pos, cc.p(0, 35.5)), 15, 0,0.2);
        this.leftArm = new CPSprite('assets/leftarm.png', cc.pAdd(pos,cc.p(-29.87,11)), 2, 0, 0.2);
        this.rightArm = new CPSprite('assets/rightarm.png', cc.pAdd(pos,cc.p(29.87,11)), 2,0,0.2);
        this.body = new CPSprite('assets/body.png', pos, 12, 0, 0.5);
        this.leftLeg = new CPSprite('assets/leftleg.png', cc.pAdd(pos,cc.p(-7,-32)), 5, 0, 1);
        this.rightLeg = new CPSprite('assets/rightleg.png', cc.pAdd(pos,cc.p(7,-32)), 5,0,1);
	
        this.leftArm.setRotation(0);
        this.leftArm.body.setAngle(cc.degreesToRadians(-90));

        this.rightArm.setRotation(-90);
        this.rightArm.body.setAngle(cc.degreesToRadians(90));

        this.body.body.onTouchesEnded = this.onTouchesEnded;

        //add joints
        
        space.addConstraint(new cp.PivotJoint(this.body.body, this.head.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-0.01, 23.0))));
        space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.head.body, 0, 1000000, 0));

        space.addConstraint(new cp.PivotJoint(this.body.body, this.leftArm.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-13.5,11))));
        space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.leftArm.body, cc.degreesToRadians(-180), cc.degreesToRadians(20)));

        space.addConstraint(new cp.PivotJoint(this.body.body, this.rightArm.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(13.5,11))));
        space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.rightArm.body, cc.degreesToRadians(-20), cc.degreesToRadians(180)));

        space.addConstraint(new cp.PivotJoint(this.body.body, this.leftLeg.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-6.5,-16))));
        space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.leftLeg.body, cc.degreesToRadians(-70), cc.degreesToRadians(20)));
        space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.leftLeg.body, cc.degreesToRadians(13), 500000, 10));


        space.addConstraint(new cp.PivotJoint(this.body.body, this.rightLeg.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(6.5,-16))));
        space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.rightLeg.body, cc.degreesToRadians(-20), cc.degreesToRadians(70)));
        space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.rightLeg.body, cc.degreesToRadians(-13), 500000, 10));
	},
    spawn:function(layer){
        //spawn at this location
        layer.addChild(this.leftLeg, 0);
        layer.addChild(this.rightLeg, 0);
        layer.addChild(this.body, 0);
        layer.addChild(this.head, 0);
        layer.addChild(this.leftArm, 0);
        layer.addChild(this.rightArm, 0);
    }
});


var CPSprite = cc.Sprite.extend({
    ctor:function(filename, pos, mass, Elasticity, friction){
    	this._super();
        this.initWithFile(filename);
        mass = mass || 5;
        var body = space.addBody(new cp.Body(mass, cp.momentForBox(mass, this.getContentSize().width, this.getContentSize().height)));
        body.setPos(cp.v(pos.x, pos.y));
        var shape = space.addShape(new cp.BoxShape(body, this.getContentSize().width, this.getContentSize().height));
        shape.setElasticity(Elasticity || 0.2);
        shape.setFriction(friction || 0.8);
   		//this.setBody(body);
        this.body = body;
        this.shape = shape;
    },
    visit:function(){
        if(this.body)
        {
            var pos = this.body.p;
            this.setPosition(pos.x, pos.y);
            this.setRotation(cc.RADIANS_TO_DEGREES(-1*this.body.a));
        }
        else{
            console.log('no body?');
        }
        this._super();
    }
});