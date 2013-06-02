define([
	'app/objects/Platform',
	'app/objects/Item',
	'app/objects/Car',
], function(
	Platform,
	Item,
	Car
){

	// Export shortcuts of box2d into global space
    window.b2Vec2 = Box2D.Common.Math.b2Vec2;
    window.b2BodyDef = Box2D.Dynamics.b2BodyDef;
    window.b2Body = Box2D.Dynamics.b2Body;
    window.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    window.b2Fixture = Box2D.Dynamics.b2Fixture;
    window.b2World = Box2D.Dynamics.b2World;
    window.b2MassData = Box2D.Collision.Shapes.b2MassData;
    window.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    window.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    window.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	return function() {

	    this.b2world = new b2World(
	        new b2Vec2(0, 10),   //gravity
	        true                 //allow sleep
	    );

	    // default fixture values
	    this.fixDef = new b2FixtureDef;
	    this.fixDef.density = 1.0;
	    this.fixDef.friction = 0.5;
	    this.fixDef.restitution = 0.3;

	    // create game objects
	    var ground = new Platform(this);
	    var items = [];
	    for(var i = 0; i < 30; ++i) {
	    	items[i] = new Item(this);
	    }

	    // create car
	    this.car = new Car(this, {
            position: {
                x: 300,
                y: 500
            },
            size: {
                width: 150,
                height: 30
            },
            wheelRadius: 17
        });

	    this.context = document.getElementsByTagName("canvas")[0].getContext("2d");

	    //setup debug draw
	    var debugDraw = new b2DebugDraw();
	        debugDraw.SetSprite(this.context);
	        debugDraw.SetDrawScale(30.0);
	        debugDraw.SetFillAlpha(0.3);
	        debugDraw.SetLineThickness(1.0);
	        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	        this.b2world.SetDebugDraw(debugDraw);

	    this.update = function(input){

	    	this.car.update(input);

	    	this.b2world.Step(
	               1 / 60   //frame-rate
	            ,  8       //velocity iterations
	            ,  3       //position iterations
	        );
	        this.b2world.ClearForces();
	    };

	    this.render = function() {
	    	
	    	// var pos = this.car.car.GetPosition();
	    	this.context.translate(0, 0); // * box2dConfig.PixelToMeter

	    	this.b2world.DrawDebugData();
	    };

	}
});