define([
	'app/objects/Platform',
	'app/objects/Car',
	'app/objects/Road'
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

	    console.log(this.b2world);

	    // default fixture values
	    this.fixDef = new b2FixtureDef;
	    this.fixDef.density = 1.0;
	    this.fixDef.friction = 0.5;
	    this.fixDef.restitution = 1;

		this.road = new Road(this, 3);

	    // create car
	    this.car = new Car(this, {
            posx: 5,
            posy: 13,
			w: 4.5,
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
	               1 / 60   //frame-rate
	            ,  10       //velocity iterations
	            ,  10       //position iterations
	        );
	        this.b2world.ClearForces();


	    	this.car.update(input);

	    	// update camera position according to car body
	    	var pos =  this.car.carBody.GetPosition();

			var velmodule = this.car.getSpeed();
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
	    	var offsety = -1 * (pos.y * pixelToMeter / 2 - 250);
	    	this.b2world.DrawDebugData(-offsetx, offsety);
	    };


	}
});