define([
	'app/objects/Platform',
	'app/objects/Car',
	'app/objects/RallyCar',
	'app/objects/Road'
], function(
	Platform,
	Car,
	RallyCar,
	Road
){

	var fn = function(scene, camera, b2world) {

		if (!scene || !camera || !b2world) {
			throw("WebGL schene & camera, Box2D world objects are required");
		}

		this.scene = scene;
		this.camera = camera;
		this.b2world = b2world;

		this.debugElem = document.getElementById('cam');

	    // create car
	    this.car = new Car(this, {
            posx: 30,
            posy: 16,
			w: 5,
            h: 1.7,
            wheelRadius: 0.6
        });

		this.road = new Road(this, 5);
	};

	fn.prototype.update = function(input) {

    	// update camera position according to car body
    	var pos =  this.car.carBody.GetPosition();

		var velmodule = this.car.getSpeedPow2();
		
		this.debugElem.value = Math.floor(velmodule * 3.6) + 
						  'km/h, distance: ' + Math.round(pos.x - 30) + 'm';

		// update camera Z coordinate softly
		var cameraTargetZ = -10 - (velmodule * 0.5);
		var cameraTargetY = pos.y - 2;

		var cameraSpeed = Math.abs(cameraTargetZ - this.camera.position.z) * 0.1;

		if (this.camera.position.z < cameraTargetZ) {
			this.camera.position.z += cameraSpeed;
		} else {
			this.camera.position.z -= cameraSpeed;
		}

		var angVel = this.car.carBody.GetLinearVelocity();

		var camSpeedY = Math.abs(angVel.y) * 0.015;
		if (camSpeedY < 0.02) {
			camSpeedY = 0.02;
		}
		if (Math.abs(this.camera.position.y - cameraTargetY) > 0.5) {
			if (this.camera.position.y < cameraTargetY) {
				this.camera.position.y += camSpeedY;
			} else {
				this.camera.position.y -= camSpeedY;
			}
		}

		var camShiftX = (Math.abs(this.camera.position.z) - 10);
		this.camera.position.x = pos.x + 5 + camShiftX * 0.5;
		// this.camera.position.y = pos.y - 2 - camShiftX * 0.3;

       	this.road.update(this.camera.position.x);
    	this.car.update(input);
    };

	fn.prototype.render = function() {

    	// render debug physics output
    	var pixelToMeter = 30;
    	var pos = this.car.carBody.GetPosition();
    	var offsetx = pos.x * pixelToMeter / 2 - 100;
    	var offsety = -1 * (pos.y * pixelToMeter / 2 - 250);
    	this.b2world.DrawDebugData(-offsetx, offsety);
    };

    fn.prototype.remove = function() {
	    this.car.remove();
		this.road.remove();

		this.scene = null;
		this.camera = null;
		this.b2world = null;
		this.debugElem = null;
	    this.car = null;
		this.road = null;
    };

    return fn;
	
});