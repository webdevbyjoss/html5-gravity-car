define(function(){
	"use strict";

	var fn = function(world, x1, y1, x2, y2) {
		this.world = world;
		this.next = null; // platforms are connected into linked list

		this.x = x2;
		this.y = y2;


		var mx = avg(x1, x2);
		var my = avg(y1, y2);

		var dx = x2 - x1;
		var dy = y2 - y1;

		var mw = Math.sqrt(dx*dx + dy*dy) * 1.02;
		var angle = Math.atan2(dy, dx);

		this.build({
			'pos': {'x': mx, 'y': my},
			'box': {'w': mw, 'h': 0.5},
			'angle': angle
		});
	};

	fn.prototype.build = function(data) {

		// build fixture
	    this.fixDef = new b2FixtureDef;
	    this.fixDef.shape = new b2PolygonShape;
	    this.fixDef.shape.SetAsBox(data.box.w * 0.5, data.box.h * 0.5);
	   	this.fixDef.density = 1;
	    this.fixDef.friction = 1;
	    this.fixDef.restitution = 0;


		// build physical body according to data
	    this.bodyDef = new b2BodyDef;
	    this.bodyDef.type = b2Body.b2_staticBody;
	    this.bodyDef.position.x = data.pos.x;
	    this.bodyDef.position.y = data.pos.y;
	    if (data.angle) {
	    	this.bodyDef.angle = data.angle;
	    }

	    this.obj = this.world.b2world.CreateBody(this.bodyDef);
	    this.fixture = this.obj.CreateFixture(this.fixDef);


	    // build visual representation
	   	var geometry = new THREE.CubeGeometry(data.box.w, data.box.h, 0);
		var material = new THREE.MeshLambertMaterial( { color: 0x75A3FF } );
		this.cube = new THREE.Mesh( geometry, material );
		this.cube.receiveShadow = true;
		this.world.scene.add( this.cube );

		// as platforms are never moved for now 
		// we can set the positions only once
		var bodyDef2 = this.fixture.GetBody().GetDefinition();
		this.cube.position.x = bodyDef2.position.x;
		this.cube.position.y = bodyDef2.position.y;
		this.cube.position.z = -0.2;
		this.cube.rotation.z = bodyDef2.angle;		
	};

	fn.prototype.update = function() {
		// do nothing for now as platforms are completely unmovable
	};

	fn.prototype.remove = function() {
		this.world.b2world.DestroyBody(this.obj);
		this.world.scene.remove(this.cube);

		this.fixDef = null;
		this.bodyDef = null;
		this.obj = null;
		this.fixture = null;
		this.cube = null;
		this.next = null;
	};

	return fn;
});