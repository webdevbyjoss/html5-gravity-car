define(function(){
    "use strict";

    var fn =  function(world, data) {
        // motor
        // LEVEL 0
        // var motorSpeed = 0.3;
        // var motorTorque = 5;

        // LEVEL 1
        // var motorSpeed = 1;
        // var motorTorque = 10;

        // LEVEL 2
        var motorSpeed = 2;
        var motorTorque = 50;

        // LEVEL 3
        //var motorSpeed = 5;
        //var motorTorque = 30;

        // LEVEL 4
        //var motorSpeed = 10;
        //var motorTorque = 50;


        // manual stabilization force
        var torqueForce = 50;
        var stabilizationForce = 0; // currently commented out



        var carFixDef = new b2FixtureDef;
        carFixDef.density = 3;
        carFixDef.friction = 0.5;
        carFixDef.restitution = 0.1;
        carFixDef.filter.groupIndex = -1;

        var axleFixDef = new b2FixtureDef;
        axleFixDef.density = 3;
        axleFixDef.friction = 1;
        axleFixDef.restitution = 0;
        carFixDef.filter.groupIndex = -1;

        var wheelFixDef = new b2FixtureDef;
        wheelFixDef.density = 1;
        wheelFixDef.friction = 10;
        wheelFixDef.restitution = 0.7;
        wheelFixDef.filter.groupIndex = -1;



        this.motorSpeed = motorSpeed;
        this.motorTorque = motorTorque;
        this.torqueForce = torqueForce;
        this.stabilizationForce = stabilizationForce;


        this.world = world;
        this.carBody = null;
        this.glcarBody = null;
        this.wheel1 = null;
        this.wheel2 = null;
        this.motor1 = null;
        this.motor2 = null;
        this.axle1 = null;
        this.axle2 = null;
        this.spring1 = null;
        this.spring2 = null;
        this.glWheel1left = null;
        this.glWheel2left = null;
        this._vel = null;




        carFixDef.shape = new b2PolygonShape();
        carFixDef.shape.SetAsBox(data.w*0.5, data.h *0.25);

        // define car body
        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(data.posx, data.posy);
        this.carBody = this.world.b2world.CreateBody(bodyDef);
        this.carBody.CreateFixture(carFixDef);

        carFixDef.shape.SetAsOrientedBox(
            data.w * 0.25,
            data.h * 0.25,
            new b2Vec2(-0.25, -0.75), 0
        );
        this.carBody.CreateFixture(carFixDef);


        // add the axles
        this.spring1 = null;
        this.spring2 = null;

        var axelBodyDef = new b2BodyDef;
        axelBodyDef.type = b2Body.b2_dynamicBody;
        axelBodyDef.position.Set(data.posx - 1.8, data.posy + 0.5);
        this.axle1 = this.world.b2world.CreateBody(axelBodyDef);
        axelBodyDef.position.Set(data.posx + 1.6, data.posy + 0.5);
        this.axle2 = this.world.b2world.CreateBody(axelBodyDef);

        axleFixDef.shape = new b2PolygonShape();
        axleFixDef.shape.SetAsBox(0.3, 0.3);
        this.axle1.CreateFixture(axleFixDef);
        axleFixDef.shape.SetAsBox(0.3, 0.3);
        this.axle2.CreateFixture(axleFixDef);


        // create joins
        var prismaticJointDef = new b2PrismaticJointDef();
        prismaticJointDef.lowerTranslation = -0.3;
        prismaticJointDef.upperTranslation = 0.4;
        prismaticJointDef.enableLimit = true;
        prismaticJointDef.enableMotor = true;

        prismaticJointDef.Initialize(this.carBody, this.axle1, this.axle1.GetWorldCenter(), new b2Vec2(0, 1));
        this.spring1 = this.world.b2world.CreateJoint(prismaticJointDef);
        prismaticJointDef.Initialize(this.carBody, this.axle2, this.axle2.GetWorldCenter(), new b2Vec2(0, 1));
        this.spring2 = this.world.b2world.CreateJoint(prismaticJointDef);

        //create wheel1
        wheelFixDef.shape = new b2CircleShape(data.wheelRadius);
        bodyDef.position.Set(this.axle1.GetWorldCenter().x, this.axle1.GetWorldCenter().y);
        this.wheel1 = this.world.b2world.CreateBody(bodyDef);
        this.wheel1.CreateFixture(wheelFixDef);

        var revoluteJ;
        //create wheel1 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(this.axle1, this.wheel1, this.wheel1.GetWorldCenter());
        this.motor1 = this.world.b2world.CreateJoint(revoluteJ);

        //create wheel 2
        bodyDef.position.Set(this.axle2.GetWorldCenter().x, this.axle2.GetWorldCenter().y);
        this.wheel2 = this.world.b2world.CreateBody(bodyDef);
        this.wheel2.CreateFixture(wheelFixDef);
        //create wheel2 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(this.axle2, this.wheel2, this.wheel2.GetWorldCenter());
        this.motor2 = this.world.b2world.CreateJoint(revoluteJ);






        // create visual opengl representation of the car
        // build visual representation of car body
        var material = new THREE.MeshLambertMaterial( { color: 0x248F24 } );
        
        var geometryBody = new THREE.CubeGeometry(data.w * 1.05, data.h * 0.6, 0);
        var geometryTop = new THREE.CubeGeometry(data.w * 0.55, data.h * 0.55, 0);

        this.glcarBody = new THREE.Mesh( geometryBody, material );
        this.glcarBody.castShadow = true;
        var glcarTop = new THREE.Mesh( geometryTop, material );

        glcarTop.position.y = -0.8;
        glcarTop.position.x = -0.4;
        this.glcarBody.add(glcarTop);

        // create wheels
        var wheelgeometry = new THREE.CylinderGeometry(
            data.wheelRadius * 1.15,
            data.wheelRadius * 1.15,
            0,
            8,
            1,
            false
        );
        var wheelMaterial = new THREE.MeshLambertMaterial( { color: 0x62625E } );

        this.glWheel1left = new THREE.Mesh( wheelgeometry, wheelMaterial );
        this.glWheel2left = new THREE.Mesh( wheelgeometry, wheelMaterial );


        this.glWheel1left.rotation.x = Math.PI/2;
        this.glWheel2left.rotation.x = Math.PI/2;

        this.glWheel1left.position.z = -0.1;
        this.glWheel2left.position.z = -0.1;


        this.glWheel1left.position.x = -1.8;
        this.glWheel2left.position.x = 1.6;

        this.glWheel1left.position.y = 0.2;
        this.glWheel2left.position.y = 0.2;

        // attach wheels to the car
        this.glcarBody.add(this.glWheel1left);
        this.glcarBody.add(this.glWheel2left);

        world.scene.add( this.glcarBody );
    };

    fn.prototype.update = function(input) {

        this.motorSpeed = 5 + (this.getSpeedPow2() * 0.5);

        // accelerate car            
        this.motor1.SetMotorSpeed(
            this.motorSpeed * Math.PI * (input.getKey(input.keyCode.D) ? 1 : input.getKey(input.keyCode.A) ? -1 : 0));

        this.motor1.SetMaxMotorTorque(
            input.getKey(input.keyCode.A) || input.getKey(input.keyCode.D) ? this.motorTorque : 0.5);


        // Simulate realistic spring
        // where in simplified model feedback force determined by multiplication
        // of spring tension by square spring length
        var tension = 200; // spring tension coefficient
        var force = 100;
        var speed = 40;
        var length1 = this.spring1.GetJointTranslation();
        var length2 = this.spring2.GetJointTranslation();
        this.spring1.SetMaxMotorForce(force + tension * length1 * length1);
        this.spring2.SetMaxMotorForce(force + tension * length2 * length1);
        var currSpeed1 = this.spring1.GetMotorSpeed();
        var currSpeed2 = this.spring2.GetMotorSpeed();
        var newSpeed1 = 0.4 * (currSpeed1 - speed * length1);
        var newSpeed2 = 0.4 * (currSpeed2 - speed * length2);
        this.spring1.SetMotorSpeed(newSpeed1);
        this.spring2.SetMotorSpeed(newSpeed2);


        // add ability to control car position in air
        var carAngle = this.normalizeAngle(this.carBody.GetAngle());
        if (input.getKey(input.keyCode.A)) {
            this.carBody.ApplyTorque(this.torqueForce);
        }
        if (input.getKey(input.keyCode.D)) {
            this.carBody.ApplyTorque(-1 * this.torqueForce);
        }
        
        if (input.getKeyDown(input.keyCode.A)) {
            this.carBody.SetAngularVelocity(0);
            this.carBody.ApplyTorque(this.torqueForce * 10);
        }
        if (input.getKeyDown(input.keyCode.D)) {
            this.carBody.SetAngularVelocity(0);
            this.carBody.ApplyTorque(-1 * (this.torqueForce) * 10);
        }

        // car stabilization, lets apply the torque force into opposit direction
        // depending on current car position relative from ground
        // var carTorquoStabilizationRatio = Math.sin(carAngle); // strongest in vertical position
        // this.carBody.ApplyTorque(-1 * stabilizationForce * carTorquoStabilizationRatio);

        // alright, we've added manual car correction and automatic stabilization
        // now its time to apply some downforce
        // this.carBody.ApplyForce(new b2Vec2(0, 100), {x:0, y:0});


        // update opengl position
        var bodyDef2 = this.carBody.GetDefinition();
        this.glcarBody.position.x = bodyDef2.position.x;
        this.glcarBody.position.y = bodyDef2.position.y;
        this.glcarBody.rotation.z = bodyDef2.angle;

        var wheel1Def = this.wheel1.GetDefinition();
        var wheel2Def = this.wheel2.GetDefinition();
        this.glWheel1left.rotation.y = wheel1Def.angle;
        this.glWheel2left.rotation.y = wheel2Def.angle;

        var wheel1Y = this.spring1.GetJointTranslation();
        var wheel2Y = this.spring2.GetJointTranslation();

        this.glWheel1left.position.y = wheel1Y + 0.5;
        this.glWheel2left.position.y = wheel2Y + 0.5;
    };

    fn.prototype.getSpeedPow2 = function() {
        this._vel = this.carBody.GetLinearVelocity();
        return Math.sqrt(this._vel.x * this._vel.x + this._vel.y * this._vel.y);
    };

    fn.prototype.normalizeAngle = function(angle) {
      angle = angle % (2 * Math.PI); 
      return angle >= 0 ? angle : angle + 2 * Math.PI;
      // angle = atan2(sin(angle, cos(angle))
    };

    fn.prototype.remove = function() {
        // remove phisics elements
        this.world.b2world.DestroyBody(this.carBody);
        this.world.b2world.DestroyBody(this.wheel1);
        this.world.b2world.DestroyBody(this.wheel2);
        this.world.b2world.DestroyJoint(this.motor1);
        this.world.b2world.DestroyJoint(this.motor2);
        this.world.b2world.DestroyBody(this.axle1);
        this.world.b2world.DestroyBody(this.axle2);
        this.world.b2world.DestroyJoint(this.spring1);
        this.world.b2world.DestroyJoint(this.spring2);

        // remove gl elements
        this.world.scene.remove(this.glcarBody);
        this.world.scene.remove(this.glWheel1left);
        this.world.scene.remove(this.glWheel2left);

        this.world = null;
        this.carBody = null;
        this.wheel1 = null;
        this.wheel2 = null;
        this.motor1 = null;
        this.motor2 = null;
        this.axle1 = null;
        this.axle2 = null;
        this.spring1 = null;
        this.spring2 = null;
        
        this.glWheel1left = null;
        this.glWheel2left = null;
        this.glcarBody = null;

        this._vel = null;
    };

    return fn;

});