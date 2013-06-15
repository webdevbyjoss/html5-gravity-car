define([
	'app/objects/Platform',
	'app/objects/Item',
	'app/objects/Car',
], function(
	Platform,
	Item,
	Car
){

	return function() {
		
		// init WebGL
	    this.glDomElem = document.getElementById("main");
	    this.scene = new THREE.Scene();
	    this.camera = new THREE.PerspectiveCamera( 55, this.glDomElem.width / this.glDomElem.height, 0.1, 1000 );
	    this.renderer = new THREE.WebGLRenderer({
	    	canvas: this.glDomElem
	    });
		this.camera.position.x = 30;
		this.camera.position.y = 30;
		this.camera.position.z = -15;
		this.camera.rotation.z = Math.PI;
		this.camera.rotation.y = Math.PI;

		// add subtle blue ambient lighting
		var ambientLight = new THREE.AmbientLight(0x004444);
		this.scene.add(ambientLight);

		// directional lighting
		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(30, 30, -20).normalize();
		this.scene.add(directionalLight);


		// init physisc
	    this.b2world = new b2World(
	        new b2Vec2(0, 10),   //gravity
	        true                 //allow sleep
	    );

	    // default fixture values
	    this.fixDef = new b2FixtureDef;
	    this.fixDef.density = 1000.0;
	    this.fixDef.friction = 1;
	    this.fixDef.restitution = 0;

		var platforms = [{
			pos: {x: -15, y: 17},
			box: {w: 2, h: 0.5},
			angle: -Math.PI / 2
		},{
			pos: {x: -5, y: 18.62},
			box: {w: 10, h: 0.5},
			angle: Math.PI/80
		}, {
			pos: {x: 12, y: 19},
			box: {w: 10, h: 0.5}
		}, {
			pos: {x: 23.5, y: 18.3},
			box: {w: 2, h: 0.5},
			angle: -Math.PI/8
		},{
			pos: {x: 30, y: 18.35},
			box: {w: 5, h: 0.5},
			angle: Math.PI/20
		}, {
			pos: {x: 64, y: 19},
			box: {w: 30, h: 0.5}
		}, {
			pos: {x: 95, y: 18.5},
			box: {w: 2, h: 0.5},
			angle: -Math.PI / 2
		}];

		this.ground = [];
		for (var i = 0; i < platforms.length; i++) {
			this.ground[i] = new Platform(this, platforms[i]);
		}

	    // create game objects
	    /*
	    var items = [];
	    for(var i = 0; i < 30; ++i) {
	    	items[i] = new Item(this);
	    }
	    */

	    // create car
	    this.car = new Car(this, {
            posx: 10,
            posy: 16,
			w: 5,
            h: 1,
            wheelRadius: 0.6
        });


	    //setup debug draw
	    this.contextDebug = document.getElementById("gravity-debug").getContext("2d");
	    var debugDraw = new b2DebugDraw();
	        debugDraw.SetSprite(this.contextDebug);
	        debugDraw.SetDrawScale(15.0);
	        debugDraw.SetFillAlpha(0.3);
	        debugDraw.SetLineThickness(1.0);
	        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	        this.b2world.SetDebugDraw(debugDraw);

	    this.update = function(input) {

	    	this.b2world.Step(
	               1 / 50   //frame-rate
	            ,  8       //velocity iterations
	            ,  3       //position iterations
	        );
	        this.b2world.ClearForces();

	    	for (var i = 0; i < this.ground.length; i++) {
	    		this.ground[i].update();
	    	}

	    	this.car.update(input);

	    	// update camera position according to car body
	    	var pos =  this.car.carBody.GetPosition();

			var vel = this.car.carBody.GetLinearVelocity();
			var velmodule = vel.x * vel.x + vel.y * vel.y;

			this.camera.position.x = pos.x + 5;
			this.camera.position.y = pos.y - 5;

			// update acmera Z coordinate softly
			var cameraTargetZ = -15 - (velmodule * 0.02);
			var cameraSpeed = Math.abs(cameraTargetZ - this.camera.position.z) * 0.2;
			if (this.camera.position.z < cameraTargetZ) {
				this.camera.position.z += cameraSpeed;
			} else {
				this.camera.position.z -= cameraSpeed;
			}

			// output some debug on SPACE
			if (input.getKeyDown(input.keyCode.SPACE)) {
				console.log(this.car.carBody);
			}
	    };

	    this.render = function() {

	    	this.renderer.render(this.scene, this.camera);


	    	// render debug physics output
	    	this.contextDebug.save();
	    	var pos = this.car.carBody.GetPosition();
	    	var offsetx = pos.x * box2dConfig.PixelToMeter / 2 - 100;
	    	this.contextDebug.translate(-offsetx, 0);
	    	this.b2world.DrawDebugData();
	    	this.contextDebug.restore();
	    };

	}
});