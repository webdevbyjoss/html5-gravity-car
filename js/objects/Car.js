define(function(){
    return function(world, data) {
        
        this.world = world;
        this.carBody = null;
        this.wheel1 = null;
        this.wheel2 = null;
        this.motor1 = null;
        this.motor2 = null;
        this.axle1 = null;
        this.axle2 = null;
        this.spring1 = null;
        this.spring2 = null;
        this._vel = null;

        // motor 
        var motorSpeed = 1;
        var motorTorque = 30;

        // manual stabilization force
        var torqueForce = 1;
        var stabilizationForce = 1;


  	    var fixDef = Object.create(this.world.fixDef);
        fixDef.shape = new b2PolygonShape;

        // define car body
  	    var bodyDef = new b2BodyDef;

        //create car body
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.02;
        fixDef.filter.groupIndex = -1;

        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(data.w*0.5, data.h *0.25);

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(data.posx, data.posy);
        this.carBody = this.world.b2world.CreateBody(bodyDef);
        this.carBody.CreateFixture(fixDef);

        fixDef.shape.SetAsOrientedBox(
            data.w * 0.25,
            data.h * 0.25,
            new b2Vec2(-0.25, -1), 0
        );
        this.carBody.CreateFixture(fixDef);


        // add the axles
        var axle1, axle2, prismaticJointDef;
        this.spring1 = null;
        this.spring2 = null;

        fixDef = Object.create(this.world.fixDef);
        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        bodyDef.position.x = 3.2;
        axle1 = this.world.b2world.CreateBody(bodyDef);

        bodyDef.position.x = 6.5;
        axle2 = this.world.b2world.CreateBody(bodyDef);

        fixDef.shape = new b2PolygonShape();
        
        fixDef.shape.SetAsBox(0.1, 0.4);
        axle1.CreateFixture(fixDef);

        fixDef.shape.SetAsBox(0.1, 0.4);
        axle2.CreateFixture(fixDef);

        // create joins
        prismaticJointDef = new b2PrismaticJointDef();
        var axle1Pos = axle1.GetWorldCenter();
        axle1Pos.y += 0.4;
        prismaticJointDef.Initialize(this.carBody, axle1, axle1Pos,
            new b2Vec2(0, 0.5)
        );
        prismaticJointDef.lowerTranslation = -0.3;
        prismaticJointDef.upperTranslation = 0.3;
        prismaticJointDef.enableLimit = true;
        prismaticJointDef.enableMotor = true;
        this.spring1 = this.world.b2world.CreateJoint(prismaticJointDef);

        var axle2Pos = axle2.GetWorldCenter();
        axle2Pos.y += 0.4;
        prismaticJointDef.Initialize(this.carBody, axle2, axle2Pos,
            new b2Vec2(0, 0.5)
        );
        this.spring2 = this.world.b2world.CreateJoint(prismaticJointDef);


        fixDef = Object.create(this.world.fixDef);
        fixDef.density = 0.9;
        fixDef.friction = 6;
        fixDef.restitution = 0.2;

        //create wheel1
        fixDef.shape = new b2CircleShape(data.wheelRadius);
        bodyDef.position.Set(axle1.GetWorldCenter().x, axle1.GetWorldCenter().y + 0.3);
        this.wheel1 = this.world.b2world.CreateBody(bodyDef);
        this.wheel1.CreateFixture(fixDef);

        var revoluteJ;
        //create wheel1 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(axle1, this.wheel1, this.wheel1.GetWorldCenter());
        this.motor1 = this.world.b2world.CreateJoint(revoluteJ);

        //create wheel 2
        bodyDef.position.Set(axle2.GetWorldCenter().x, axle2.GetWorldCenter().y + 0.3);
        this.wheel2 = this.world.b2world.CreateBody(bodyDef);
        this.wheel2.CreateFixture(fixDef);
        //create wheel2 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(axle2, this.wheel2, this.wheel2.GetWorldCenter());
        this.motor2 = this.world.b2world.CreateJoint(revoluteJ);



        // create visual opengl representation of the car
        // build visual representation of car body
        var material = new THREE.MeshLambertMaterial( { color: 0x248F24 } );
        
        var geometryBody = new THREE.CubeGeometry(data.w, data.h * 0.5, 1);
        var geometryTop = new THREE.CubeGeometry(data.w * 0.5, data.h * 0.5, 1);

        var glcarBody = new THREE.Mesh( geometryBody, material );
        var glcarTop = new THREE.Mesh( geometryTop, material );

        glcarTop.position.y = -0.8;
        glcarTop.position.x = -0.4;
        glcarBody.add(glcarTop);

        // create wheels
        var wheelgeometry = new THREE.CylinderGeometry(
            data.wheelRadius,
            data.wheelRadius,
            0.25,
            8,
            1,
            false
        );
        var wheelMaterial = new THREE.MeshLambertMaterial( { color: 0x62625E } );

        var glWheel1left = new THREE.Mesh( wheelgeometry, wheelMaterial );
        var glWheel2left = new THREE.Mesh( wheelgeometry, wheelMaterial );

        var glWheel1right = new THREE.Mesh( wheelgeometry, wheelMaterial );
        var glWheel2right = new THREE.Mesh( wheelgeometry, wheelMaterial );

        glWheel1left.rotation.x = Math.PI/2;
        glWheel2left.rotation.x = Math.PI/2;
        glWheel1right.rotation.x = Math.PI/2;
        glWheel2right.rotation.x = Math.PI/2;

        glWheel1left.position.z = -1;
        glWheel2left.position.z = -1;
        glWheel1right.position.z = 1;
        glWheel2right.position.z = 1;

        glWheel1left.position.x = -1.5;
        glWheel1right.position.x = -1.5;

        glWheel2left.position.x = 1.3;
        glWheel2right.position.x = 1.3;

        glWheel1left.position.y = 0.4;
        glWheel2left.position.y = 0.4;
        glWheel1right.position.y = 0.4;
        glWheel2right.position.y = 0.4;

        // attach wheels to the car
        glcarBody.add(glWheel1left);
        glcarBody.add(glWheel2left);
        glcarBody.add(glWheel1right);
        glcarBody.add(glWheel2right);


        world.scene.add( glcarBody );

        this.update = function(input) {

            motorSpeed = 5 + (this.getSpeed() * 0.7);

            // accelerate car            
            this.motor1.SetMotorSpeed(
                motorSpeed * Math.PI * (input.getKey(input.keyCode.D) ? 1 : input.getKey(input.keyCode.A) ? -1 : 0));

            this.motor1.SetMaxMotorTorque(
                input.getKey(input.keyCode.A) || input.getKey(input.keyCode.D) ? motorTorque : 0.5);

            var tension = 800;
            var force = 50;
            var speed = 5;

            this.spring1.SetMaxMotorForce(force + Math.abs(tension * Math.pow(this.spring1.GetJointTranslation(), 2)));
            this.spring1.SetMotorSpeed((this.spring1.GetMotorSpeed() - speed * this.spring1.GetJointTranslation()) * 0.4);
            this.spring2.SetMaxMotorForce(force + Math.abs(tension * Math.pow(this.spring2.GetJointTranslation(), 2)));
            this.spring2.SetMotorSpeed((this.spring2.GetMotorSpeed() - speed * this.spring2.GetJointTranslation()) * 0.4);


            // it will be easier to flip car up side down
            // but almost impossible if it is in correct position
            var carAngle = normalizeAngle(this.carBody.GetAngle());
            var carTorquoRatio = Math.sin(carAngle * 0.5); // strongest when car is up-side-down
            if (input.getKey(input.keyCode.A)) {
                this.carBody.ApplyTorque(torqueForce * carTorquoRatio * 0.5);
            }
            if (input.getKey(input.keyCode.D)) {
                this.carBody.ApplyTorque(-1 * torqueForce * carTorquoRatio * 0.5);
            }
            if (input.getKeyDown(input.keyCode.A)) {
                this.carBody.ApplyTorque(torqueForce * 500);
            }
            if (input.getKeyDown(input.keyCode.D)) {
                this.carBody.ApplyTorque(-1 * (torqueForce) * 500);
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
            glcarBody.position.x = bodyDef2.position.x;
            glcarBody.position.y = bodyDef2.position.y;
            glcarBody.rotation.z = bodyDef2.angle;

            var wheel1Def = this.wheel1.GetDefinition();
            var wheel2Def = this.wheel2.GetDefinition();
            glWheel1left.rotation.y = wheel1Def.angle;
            glWheel2left.rotation.y = wheel2Def.angle;
            glWheel1right.rotation.y = wheel1Def.angle;
            glWheel2right.rotation.y = wheel2Def.angle;

            var wheel1Y = this.spring1.GetJointTranslation();
            var wheel2Y = this.spring2.GetJointTranslation();

            glWheel1left.position.y = wheel1Y + 0.6;
            glWheel2left.position.y = wheel2Y + 0.6;
            
            glWheel1right.position.y = wheel1Y + 0.6;
            glWheel2right.position.y = wheel2Y + 0.6;
        }

        this.getSpeed = function() {
            this._vel = this.carBody.GetLinearVelocity();
            return Math.sqrt(this._vel.x * this._vel.x + this._vel.y * this._vel.y);
        }

        function normalizeAngle(angle) {
          angle = angle % (2 * Math.PI); 
          return angle >= 0 ? angle : angle + 2 * Math.PI;
          // angle = atan2(sin(angle, cos(angle))
        }
    }
})