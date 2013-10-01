define([
	'app/World',
    'app/objects/ui/PlayerStatus'
], function(World, PlayerStatus){
	"use strict";

	var fn = function() {

		// init WebGL
	    this.initGL(document.getElementById("main"));

		// init physics
		this.initBox2D();

		this.new();

        this.uiStatus = new PlayerStatus(this.scene, this.camera);
        this.uiStatusTimer = 0;
        this.uiStatusUpdateInterval = 30;

        this.gameMax = 0;
        this.playerMax = 0;
	};

	fn.prototype.new = function() {

		if (this.world) {
			this.over();
		}

		this.world = new World(this.scene, this.camera, this.b2world);
	};

	fn.prototype.over = function() {
        this.gameMax = 0;
		this.world.remove();
		this.world = null;
	};

	fn.prototype.update = function(input) {

        // restart game on ENTER
		if (input.getKeyDown(input.keyCode.ENTER)) {
			this.new();
		}

		this.world.update(input);

        // update UI
        /*
        this.uiStatusTimer++;
        if (this.uiStatusTimer > this.uiStatusUpdateInterval) {
            var current = ~~this.camera.position.x - 35;
            // update game distance
            if (this.gameMax < current) {
                this.gameMax = current;
                if (this.playerMax < this.gameMax) {
                    this.playerMax = this.gameMax;
                }
            }

            this.uiStatusTimer = 0; // reset timer
            this.uiStatus.update(this.gameMax, this.playerMax);
        }
        */

    	this.b2world.Step(
               1 / 35   //frame-rate
            ,  10       //velocity iterations
            ,  10       //position iterations
        );
        this.b2world.ClearForces();
	};

	fn.prototype.render = function() {
		this.world.render();

		this.renderer.render(this.scene, this.camera);
	};

	fn.prototype.initBox2D = function() {

	    this.b2world = new b2World(
	        new b2Vec2(0, 10),   //gravity
	        true                 //allow sleep
	    );

	    //setup debug draw
	    this.contextDebug = document.getElementById("gravity-debug").getContext("2d");
	    var debugDraw = new b2DebugDraw();
	        debugDraw.SetSprite(this.contextDebug);
	        debugDraw.SetDrawScale(15.0);
	        debugDraw.SetFillAlpha(0.3);
	        debugDraw.SetLineThickness(1.0);
	        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	        this.b2world.SetDebugDraw(debugDraw);

	};

	fn.prototype.initGL = function(elCanvas) {
	    this.scene = new THREE.Scene();
	    this.camera = new THREE.PerspectiveCamera( 55, elCanvas.width / elCanvas.height, 0.1, 1000 );
	    this.renderer = new THREE.WebGLRenderer({
	    	canvas: elCanvas,
            antialias: true
	    });

	    // this.renderer.shadowMapEnabled = true;
		// this.renderer.shadowMapSoft = true;
		
		this.renderer.shadowCameraNear = 3;
		this.renderer.shadowCameraFar = this.camera.far;
		this.renderer.shadowCameraFov = 50;

		this.renderer.shadowMapBias = 0.0039;
		this.renderer.shadowMapDarkness = 0.5;
		this.renderer.shadowMapWidth = 1024;
		this.renderer.shadowMapHeight = 1024;


		this.camera.position.x = 30;
		this.camera.position.y = 15;
		this.camera.position.z = -11;
		this.camera.rotation.z = Math.PI;
		this.camera.rotation.y = Math.PI;

        // camera contains child objects
        // so should be added to scene
        this.scene.add(this.camera);

		// add subtle blue ambient lighting
		/*
		var ambientLight = new THREE.AmbientLight(0xEEEEEE);
		this.scene.add(ambientLight);
		 */

		var directionalLight = new THREE.DirectionalLight(0xEEEEEE);
		directionalLight.position.set(-20, -40, -50).normalize();
		this.scene.add(directionalLight);

		// directional lighting
        /*
		var light = new THREE.SpotLight(0xFFFFFF);
		light.position.set(70, 150, -20);
		light.castShadow = true;
		light.shadowCameraVisible = true;
		this.scene.add(light);
		*/
        var origin = new THREE.Vector3(30, 14, 0);
        var terminus  = new THREE.Vector3(35, 14, 0);
        var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
        var arrow = new THREE.ArrowHelper(direction, origin, 5, 0x884400);
        this.scene.add(arrow);
	};

	return fn;
});