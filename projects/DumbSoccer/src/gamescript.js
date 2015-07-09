var space;
var shapeArray=[];
var spaceWidth = 800;
var spaceHeight = 400;
var restart = false;
var score={a: 0, b: 0};
var round={a: 0, b: 0};
var playerA;
var playerB;
var goalkeeperA;
var goalkeeperB;
var roundBoard;
var scoreBoard;
var infoBoard;
var ROUNDNUM = 5;
var btnA;
var btnB;

alert("press W to control blue team, press UP to control red team.");
var game = cc.Layer.extend({
	init:function () {
		this._super();

        background = new ScrollingBG();
        this.addChild(background);

		//var backgroundLayer = cc.LayerGradient.create(cc.color(0xdf,0x9f,0x83,255), cc.color(0xfa,0xf7,0x9f,255));
		//this.addChild(backgroundLayer); 
		
        space = new cp.Space();
        space.iterations = 5;
		space.gravity = cp.v(0, -750);

		//var debugDraw = cc.PhysicsDebugNode.create(space);
		//debugDraw.setVisible(true);
		//this.addChild(debugDraw);

        scoreBoard = cc.LabelTTF.create("0 : 0","Arial","32",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(scoreBoard);
        scoreBoard.setPosition(400,350);

        roundBoard = cc.LabelTTF.create("0 - 0","Arial","24",cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(roundBoard);
        roundBoard.setPosition(400,380);

        infoBoard = cc.LabelTTF.create("","Microsoft YaHei","60",cc.TEXT_ALIGNMENT_CENTER);
        infoBoard.setPosition(400,200);

        this.spaceBoundaryInit();
        this.initButtons();
        this.initGame();

        var gateL = new Gate('L', 50, 180);
        var gateR = new Gate('R', 750, 180);
        this.addChild(gateL);
        this.addChild(gateR);

		//cc.eventManager.addListener(touchListener, this);
	},
	addBody: function(posX,posY,width,height,isDynamic,spriteImage,type){
		if(isDynamic){
			var body = new cp.Body(1,cp.momentForBox(1,width,height));
		}
		else{
			var body = new cp.Body(Infinity,Infinity);
		}
		body.setPos(cp.v(posX,posY));
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
    spaceBoundaryInit: function(){
        var thickness = 50;
        var floor = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(0,100-thickness), cp.v(spaceWidth,100-thickness), thickness));
        floor.setElasticity(0.9);
        floor.setFriction(0.8);
        var lwall = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(0-thickness,spaceHeight), cp.v(0-thickness,0), thickness));
        var rwall = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(spaceWidth+thickness, spaceHeight), cp.v(spaceWidth+thickness, 0),thickness));
        var ceiling = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(0, spaceHeight+thickness), cp.v(spaceWidth, spaceHeight+thickness), thickness));
        lwall.setElasticity(0.5);
        lwall.setFriction(1);
        rwall.setElasticity(0.5);
        rwall.setFriction(1);
        ceiling.setElasticity(0.5);
        ceiling.setFriction(1);
    },
	update:function(dt){
        dt = dt>0.2? 0.1:dt;
     	space.step(dt);
        //console.log(this.playerA.getRotation());
        if(playerA.getRotation() < -85 || playerA.getRotation() > 85) {
            setTimeout(function(){
                playerA.standup();
            }, 1000);
        }

        if(goalkeeperA.getRotation() < -85 || goalkeeperA.getRotation() > 85) {
            setTimeout(function(){
                goalkeeperA.standup();
            }, 1000);
        }

        if(playerB.getRotation() < -85 || playerB.getRotation() > 85) {
            setTimeout(function(){
                playerB.standup();
            }, 1000);
        }

        if(goalkeeperB.getRotation() < -85 || goalkeeperB.getRotation() > 85) {
            setTimeout(function(){
                goalkeeperB.standup();
            }, 1000);
        }

    },
    initButtons: function(){
        btnA = cc.Sprite.create("assets/buttonA.png");
        btnA.setScale(2);
        this.addChild(btnA, 0);
        btnA.setPosition(700,50);

        btnB = cc.Sprite.create("assets/buttonB.png");
        btnB.setScale(2);
        this.addChild(btnB, 0);
        btnB.setPosition(100,50);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if(keyCode == 87) { //'w'
                    action.teamB();
                }
                if(keyCode == 38) { //'UP'
                    action.teamA();
                }
                //console.log(keyCode);
            },
            onKeyReleased: function(keyCode, event) {
                //console.log(keyCode.toString());
            }
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                if(touch.getLocation().x > 600) {
                    action.teamA();
                }
                if(touch.getLocation().x < 200) {
                    action.teamB();
                }
            },
            onTouchEnded: function(event) {
                if(this.pressing) {
                    this.pressing = false;
                }
            }
        }, this);
    },
    initGame: function(){
        var ball = new Ball();
        this.addChild(ball,0);
        ball.setPosition(400,200);
        this.ball = ball;
        playerA = new BallPlayer(cc.p(500,100), 'A');
        playerA.spawn(this);
        goalkeeperA = new Goalkeeper(cc.p(600,100), 'A');
        goalkeeperA.spawn(this);

        playerB = new BallPlayer(cc.p(300,100), 'B');
        playerB.spawn(this);
        goalkeeperB = new Goalkeeper(cc.p(200,100), 'B');
        goalkeeperB.spawn(this);

        this.scheduleUpdate();

        setTimeout(function(){
            //playerA.jump();
            //playerB.jump();
            //goalkeeperA.jump();
            //restartGame();
        },0);
        setInterval(function(){
            var wind = Math.random() * 100 - 50;
            space.gravity = cp.v(wind, -750);
        }, 1000);
    },
    restart: function(){
        this.ball.setPosition(400, 200);
        setTimeout(function(){
            playerA.setPosition(500,120);
        } , 200);
        setTimeout(function(){
            goalkeeperA.setPosition(600,120);
        } , 400);
        setTimeout(function(){
            playerB.setPosition(300,120);
        } , 600);
        setTimeout(function(){
            goalkeeperB.setPosition(200,120);
        } , 800); 
    }
});

var action = {};
action.teamA = function(){
    playerA.kick();
    goalkeeperA.kick();
    goalkeeperA.waveHand();
}
action.teamB = function(){
    playerB.kick();
    goalkeeperB.kick();
    goalkeeperB.waveHand();
}

var ScrollingBG = cc.Sprite.extend({
    ctor:function(){
        this._super();
        this.initWithFile("assets/background.png");
    },
    onEnter: function() {
        this.setPosition(400,200);
    },
    scroll: function(){
        this.setPosition(   this.getPosition().x-scrollSpeed,
                            this.getPosition().y);
        if(this.getPosition().x<0){
            this.setPosition(   this.getPosition().x+480,
                                this.getPosition().y);
        }
    }
});


var touchListener = cc.EventListener.create({
     event: cc.EventListener.TOUCH_ONE_BY_ONE,
     onTouchBegan: function (touch, event) {
        game.playerJump();
     }
});

var Ball = cc.PhysicsSprite.extend({
	ctor: function(){
		this._super();
		this.initWithFile("assets/ball.png");

		var body = space.addBody(new cp.Body(1, cp.momentForBox(1, 25, 25)));
        var shape = space.addShape(new cp.CircleShape(body, 12.5, cp.v(0, 0)));
        shape.setElasticity(1);
        shape.setFriction(1);
        this.body = body;
        this.shape = shape;
        this.setBody(this.body);
        this.scheduleUpdate();
        //this.shape.group = 100;
	},
    move: function(){
        //this._super();
        var moveAction = cc.MoveTo.create(2.5, new cc.Point(0, 10));
        this.runAction(moveAction);
    },
	update: function() {
		var x = this.getPosition().x;
        var y = this.getPosition().y;
        if(restart == false) {
            if(x < 100 && y < 200) {
                console.log("A team score");
                restart = true;
                this.score('a');
            }
            if(x > 700 && y < 200) {
                console.log("B team score");
                restart = true;
                this.score('b');
            }
        }
        //console.log(this.getPosition());
	},
	reset: function(){
	},
    score: function(team){
        var endround = false;
        score.a += team == 'a';
        score.b += team == 'b';
        showInfo("GOAL GOAL GOAL !!!");
        if( score.a == ROUNDNUM || score.b == ROUNDNUM) {
            endround = true;
            setTimeout(function(){
                round.a += score.a == ROUNDNUM;
                round.b += score.b == ROUNDNUM;
                score.a = 0;
                score.b = 0;
                roundBoard.setString(round.b + ' - ' + round.a);
                scoreBoard.setString(score.b + ' : ' + score.a);
                showInfo("Round " + round.b + ' - ' + round.a);
                restartGame();
            }, 2000);
        }
        scoreBoard.setString(score.b + ' : ' + score.a);
        console.log(score.b + ' : ' + score.a);
        if(endround == false) {
            restartGame();
        }
    }
});

var Gate = cc.Sprite.extend({
    ctor: function(side, x, y){
        this._super();
        this.initWithFile("assets/gate"+ side +".png");
        var thickness = 5;
        space.addShape(new cp.SegmentShape(space.staticBody, cp.v(x-50, y+100-thickness), cp.v(x+50, y+100-thickness), thickness));
        
        this.setPosition(x,y);
        //gateR.setPosition(750,180);
        //this.scheduleUpdate();
    },
    update: function() {

    }
});


var BallPlayer = cc.Class.extend({
	ctor: function(pos, team){
        this.team = team;
		this.head = new CPSprite('assets/head'+team+'.png',cc.pAdd(pos, cc.p(0, 35.5)), 5, 0.8,0.2);
        this.leftArm = new CPSprite('assets/arm'+team+'.png', cc.pAdd(pos,cc.p(19.87,15)), 2, 0.4, 0.2);
        this.rightArm = new CPSprite('assets/arm'+team+'.png', cc.pAdd(pos,cc.p(-19.87,15)), 2,0.4,0.2);
        this.body = new CPSprite('assets/body'+team+'.png', pos, 12, 0.5, 0.5);
        this.leftLeg = new CPSprite('assets/leg'+team+'.png', cc.pAdd(pos,cc.p(-6,-32)), 15, 0.8, 1);
        this.rightLeg = new CPSprite('assets/leg'+team+'.png', cc.pAdd(pos,cc.p(6,-32)), 15,0.8,1);
	
        this.leftArm.setRotation(-90);
        this.leftArm.body.setAngle(cc.degreesToRadians(90));

        this.rightArm.setRotation(0);
        this.rightArm.body.setAngle(cc.degreesToRadians(-90));

        this.body.body.onTouchesEnded = this.onTouchesEnded;

        //add joints
        
        space.addConstraint(new cp.PivotJoint(this.body.body, this.head.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-0.01, 23.0))));
        space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.head.body, 0, 1000000, 10));

        space.addConstraint(new cp.PivotJoint(this.body.body, this.leftArm.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(8,11))));
        //space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.leftArm.body, cc.degreesToRadians(-20), cc.degreesToRadians(180)));

        space.addConstraint(new cp.PivotJoint(this.body.body, this.rightArm.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-8,11))));
        //space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.rightArm.body, cc.degreesToRadians(-180), cc.degreesToRadians(20)));

        space.addConstraint(new cp.PivotJoint(this.body.body, this.leftLeg.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-6.5,-16))));
        space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.leftLeg.body, cc.degreesToRadians(-90), cc.degreesToRadians(90)));
        space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.leftLeg.body, cc.degreesToRadians(0), 10000, 0));


        space.addConstraint(new cp.PivotJoint(this.body.body, this.rightLeg.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(6.5,-16))));
        space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.rightLeg.body, cc.degreesToRadians(-90), cc.degreesToRadians(90)));
        space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.rightLeg.body, cc.degreesToRadians(0), 10000, 0));
	
        this.head.shape.group = BallPlayer.num;
        this.leftArm.shape.group = BallPlayer.num;
        this.rightArm.shape.group = BallPlayer.num;
        this.body.shape.group =BallPlayer.num;
        this.leftLeg.shape.group =BallPlayer.num;
        this.rightLeg.shape.group = BallPlayer.num;
        BallPlayer.num++;
    },
    spawn:function(layer){
        //spawn at this location
        layer.addChild(this.rightArm, 0);        
        layer.addChild(this.rightLeg, 0);
        layer.addChild(this.body, 0);
        layer.addChild(this.leftLeg, 0);
        layer.addChild(this.head, 0);
        layer.addChild(this.leftArm, 0);
    },
    jump: function(){
        this.leftLeg.body.applyImpulse(cp.v(0, 1*1000), cp.v(0, 0));
        this.rightLeg.body.applyImpulse(cp.v(0, 1*1000), cp.v(0, 0));
    },
    standup:function(){
        this.head.setRotation(0);
        this.body.setRotation(0);
        this.leftLeg.setRotation(0);
        this.rightLeg.setRotation(0);
    },
    kick: function(){
        //console.log("kick~~");
        if(this.team == 'A') {
            this.leftLeg.body.applyImpulse(cp.v(0.5*10000, 0), cp.v(0,39));
            this.body.body.applyImpulse(cp.v(-2*1000, 0), cp.v(0, 0));
            this.leftLeg.body.applyImpulse(cp.v(-2*1000, 0), cp.v(0, 0));
            this.rightLeg.body.applyImpulse(cp.v(-2*1000, 0), cp.v(0, 0));
            this.jump();
        } else if(this.team == 'B') {
            this.rightLeg.body.applyImpulse(cp.v(-0.5*10000, 0), cp.v(0,39));
             this.body.body.applyImpulse(cp.v(2*1000, 0), cp.v(0, 0));
            this.leftLeg.body.applyImpulse(cp.v(2*1000, 0), cp.v(0, 0));
            this.rightLeg.body.applyImpulse(cp.v(2*1000, 0), cp.v(0, 0));
            this.jump();
        }
    },
    getRotation: function(){
        return this.body.getRotation();
    },
    setPosition: function(x, y){
        this.body.setPosition(x, y);
        this.head.setPosition(x, y+50);
        this.leftLeg.setPosition(x-3, y);
        this.rightLeg.setPosition(x+3, y);
        this.leftArm.setPosition(x-3, y+50);
        this.rightArm.setPosition(x+3, y+50);
    }
});

var Goalkeeper = cc.Class.extend({
    ctor: function(pos, team){
        this.team = team;
        this.head = new CPSprite('assets/head'+team+'.png',cc.pAdd(pos, cc.p(0, 35.5)), 5, 0.8,0.2);
        this.leftArm = new CPSprite('assets/arm'+team+'.png', cc.pAdd(pos,cc.p(19.87,15)), 2, 0.4, 0.2);
        this.rightArm = new CPSprite('assets/arm'+team+'.png', cc.pAdd(pos,cc.p(-19.87,15)), 2,0.4,0.2);
        this.body = new CPSprite('assets/body'+team+'.png', pos, 12, 0.5, 0.5);
        this.leftLeg = new CPSprite('assets/leg'+team+'.png', cc.pAdd(pos,cc.p(-6,-32)), 20, 0.8, 1);
        this.rightLeg = new CPSprite('assets/leg'+team+'.png', cc.pAdd(pos,cc.p(6,-32)), 20,0.8,1);
    
        this.leftArm.setRotation(-90);
        this.leftArm.body.setAngle(cc.degreesToRadians(90));

        this.rightArm.setRotation(0);
        this.rightArm.body.setAngle(cc.degreesToRadians(-90));

        this.body.body.onTouchesEnded = this.onTouchesEnded;

        //add joints
        
        space.addConstraint(new cp.PivotJoint(this.body.body, this.head.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-0.01, 23.0))));
        space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.head.body, 0, 1000000, 10));

        space.addConstraint(new cp.PivotJoint(this.body.body, this.leftArm.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(8,11))));
        //space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.leftArm.body, cc.degreesToRadians(-20), cc.degreesToRadians(180)));

        space.addConstraint(new cp.PivotJoint(this.body.body, this.rightArm.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-8,11))));
        //space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.rightArm.body, cc.degreesToRadians(-180), cc.degreesToRadians(20)));

        space.addConstraint(new cp.PivotJoint(this.body.body, this.leftLeg.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-6.5,-16))));
        space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.leftLeg.body, cc.degreesToRadians(-90), cc.degreesToRadians(90)));
        space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.leftLeg.body, cc.degreesToRadians(0), 10000, 0));


        space.addConstraint(new cp.PivotJoint(this.body.body, this.rightLeg.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(6.5,-16))));
        space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.rightLeg.body, cc.degreesToRadians(-90), cc.degreesToRadians(90)));
        space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.rightLeg.body, cc.degreesToRadians(0), 10000, 0));
    
        this.head.shape.group = BallPlayer.num;
        this.leftArm.shape.group = BallPlayer.num;
        this.rightArm.shape.group = BallPlayer.num;
        this.body.shape.group =BallPlayer.num;
        this.leftLeg.shape.group =BallPlayer.num;
        this.rightLeg.shape.group = BallPlayer.num;
        BallPlayer.num++;
    },
    spawn:function(layer){
        //spawn at this location
        layer.addChild(this.rightArm, 0);        
        layer.addChild(this.rightLeg, 0);
        layer.addChild(this.body, 0);
        layer.addChild(this.leftLeg, 0);
        layer.addChild(this.head, 0);
        layer.addChild(this.leftArm, 0);
    },
    jump: function(){
        //console.log("jump~~");
        //this.head.body.applyImpulse(cp.v(0, 1*10000), cp.v(0, 0));
        this.leftLeg.body.applyImpulse(cp.v(0, 1*1000), cp.v(0, 0));
        this.rightLeg.body.applyImpulse(cp.v(0, 1*1000), cp.v(0, 0));
    },
    standup:function(){
        this.head.setRotation(0);
        this.body.setRotation(0);
        this.leftLeg.setRotation(0);
        this.rightLeg.setRotation(0);
    },
    kick: function(){
        //console.log("kick~~");
        if(this.team == 'A') {
            this.leftLeg.body.applyImpulse(cp.v(0.5*10000, 0), cp.v(0,39));
            this.body.body.applyImpulse(cp.v(-2*1000, 0), cp.v(0, 0));
            this.leftLeg.body.applyImpulse(cp.v(-2*1000, 0), cp.v(0, 0));
            this.rightLeg.body.applyImpulse(cp.v(-2*1000, 0), cp.v(0, 0));
            this.jump();
        } else if(this.team == 'B') {
            this.rightLeg.body.applyImpulse(cp.v(-0.5*10000, 0), cp.v(0,39));
             this.body.body.applyImpulse(cp.v(2*1000, 0), cp.v(0, 0));
            this.leftLeg.body.applyImpulse(cp.v(2*1000, 0), cp.v(0, 0));
            this.rightLeg.body.applyImpulse(cp.v(2*1000, 0), cp.v(0, 0));
            this.jump();
        }
    },
    waveHand: function(){

    },
    getRotation: function(){
        return this.body.getRotation();
    },
    setPosition: function(x, y){
        this.body.setPosition(x, y);
        this.head.setPosition(x, y+50);
        this.leftLeg.setPosition(x-3, y);
        this.rightLeg.setPosition(x+3, y);
        this.leftArm.setPosition(x-3, y+50);
        this.rightArm.setPosition(x+3, y+50);
    }
});

BallPlayer.num = 1;

var CPSprite = cc.PhysicsSprite.extend({
    ctor:function(filename, pos, mass, Elasticity, friction){
        this._super();
        this.initWithFile(filename);
        mass = mass || 5;
        var body = space.addBody(new cp.Body(mass, cp.momentForBox(mass, this.getContentSize().width, this.getContentSize().height)));
        body.setPos(cp.v(pos.x, pos.y));
        var shape = space.addShape(new cp.BoxShape(body, this.getContentSize().width, this.getContentSize().height));
        shape.setElasticity(Elasticity || 0.2);
        shape.setFriction(friction || 0.8);
        this.body = body;
        this.shape = shape;
    }
});
function restartGame(){
    setTimeout(function(){
        showInfo("Start !!!");
        gameLayer.restart();
        restart = false;
    }, 2000);
       
}
function showInfo(text, sec) {
    sec = sec || 2;
    infoBoard.setString(text);
    gameLayer.addChild(infoBoard);
    setTimeout(function(){
        gameLayer.removeChild(infoBoard);
    }, 1000);
}
var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);
        showInfo("Start !!!");
    }
});