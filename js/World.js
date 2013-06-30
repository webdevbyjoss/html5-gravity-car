define([
	'app/objects/Platform',
	'app/objects/Car',
	'app/objects/Road',
], function(
	Platform,
	Car,
	Road
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

		var debugElem = document.getElementById('cam');

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

	    /*
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
			pos: {x: 23.5, y: 18.6},
			box: {w: 2, h: 0.5},
			angle: -Math.PI/13
		},{
			pos: {x: 30.3, y: 18.68},
			box: {w: 5, h: 0.5},
			angle: Math.PI/30
		}, {
			pos: {x: 94, y: 19},
			box: {w: 60, h: 0.5}
		},{
			pos: {x: 75.5, y: 18.6},
			box: {w: 2, h: 0.5},
			angle: -Math.PI/15
		},{
			pos: {x: 82.3, y: 18.73},
			box: {w: 5, h: 0.5},
			angle: Math.PI/30
		}/*, {
			pos: {x: 155, y: 18.5},
			box: {w: 2, h: 0.5},
			angle: -Math.PI / 2
		}];*/

		/*
		for (var i = 0; i <= 100; i++) {
			platforms.push({
				pos: {x: i*10, y: 19},
				box: {w: 10, h: Math.random() * 0.1}
			});
		}
		*/


		/*
		this.ground = [];
		for (var i = 0; i < platforms.length; i++) {
			this.ground[i] = new Platform(this, platforms[i]);
		}
		*/

		this.road = new Road(this, 3);

	    // create car
	    this.car = new Car(this, {
            posx: 5,
            posy: 16,
			w: 5.1,
            h: 1,
            wheelRadius: 0.8
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
	               1 / 60   //frame-rate
	            ,  8       //velocity iterations
	            ,  3       //position iterations
	        );
	        this.b2world.ClearForces();


	    	this.car.update(input);

	    	// update camera position according to car body
	    	var pos =  this.car.carBody.GetPosition();

			var vel = this.car.carBody.GetLinearVelocity();
			var velmodule = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
			debugElem.value = velmodule;

			// update acmera Z coordinate softly
			var cameraTargetZ = -10 - (velmodule * 0.5);

			var cameraSpeed = Math.abs(cameraTargetZ - this.camera.position.z) * 0.1;

			if (this.camera.position.z < cameraTargetZ) {
				this.camera.position.z += cameraSpeed;
			} else {
				this.camera.position.z -= cameraSpeed;
			}

			var camShiftX = (Math.abs(this.camera.position.z) - 10);
			this.camera.position.x = pos.x + 5 + camShiftX * 0.5;
			this.camera.position.y = pos.y - 2 - camShiftX * 0.3;


			// output some debug on SPACE
			if (input.getKeyDown(input.keyCode.SPACE)) {
				console.log(this.car.carBody);
			}
	    };

	    this.render = function() {

	    	this.renderer.render(this.scene, this.camera);

	    	// render debug physics output
	    	var pixelToMeter = 30;
	    	
	    	var pos = this.car.carBody.GetPosition();
	    	var offsetx = pos.x * pixelToMeter / 2 - 100;
	    	this.b2world.DrawDebugData(-offsetx, 0);
	    };


	}
});