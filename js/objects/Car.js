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

        // motor 
        var speed = 20;
        var motorTorque = 8000;
        var torqueForce = 500;
        var stabilizationForce = 20000;


  	    var fixDef = Object.create(this.world.fixDef);
        fixDef.shape = new b2PolygonShape;

        // define car body
  	    var bodyDef = new b2BodyDef;

        //create car body
        fixDef.density = 400;
        fixDef.friction = 0.2;
        fixDef.restitution = -5;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(data.w * 0.5, data.h * 0.3);

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(data.posx, data.posy);
        this.carBody = this.world.b2world.CreateBody(bodyDef);
        this.carBody.CreateFixture(fixDef);

        fixDef.shape.SetAsOrientedBox(
            data.w * 0.25,
            data.h * 0.35,
            new b2Vec2(-0.25, -1), 0
        );
        this.carBody.CreateFixture(fixDef);


        var anchor, localXback, localXfront, localY, revoluteJ;
        //create wheel1
        localXback = (data.wheelRadius * 1.5 - data.w * 0.5);
        localY = data.h * 0.4;
        anchor = this.carBody.GetWorldPoint(new b2Vec2(localXback, localY));

        fixDef = Object.create(this.world.fixDef);
        fixDef.density = 30;
        fixDef.friction = 0.8;
        fixDef.restitution = 0.2;
        fixDef.shape = new b2CircleShape(data.wheelRadius);
        bodyDef.position.Set(anchor.x, anchor.y);
        this.wheel1 = this.world.b2world.CreateBody(bodyDef);
        this.wheel1.CreateFixture(fixDef);

        //create wheel1 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(this.carBody, this.wheel1, anchor);
        this.motor1 = this.world.b2world.CreateJoint(revoluteJ);

        //create wheel 2
        localXfront = (data.w * 0.5 - data.wheelRadius * 2);
        anchor = this.carBody.GetWorldPoint(new b2Vec2(localXfront, localY));
        bodyDef.position.Set(anchor.x, anchor.y);
        this.wheel2 = this.world.b2world.CreateBody(bodyDef);
        this.wheel2.CreateFixture(fixDef);

        //create wheel2 joint
        revoluteJ = new b2RevoluteJointDef();
        revoluteJ.enableMotor = true;
        revoluteJ.Initialize(this.carBody, this.wheel2, anchor);
        this.motor2 = this.world.b2world.CreateJoint(revoluteJ);



        // create visual opengl representation of the car
        // build visual representation of car body
        var material = new THREE.MeshLambertMaterial( { color: 0x248F24 } );
        
        var geometryBody = new THREE.CubeGeometry(data.w, data.h, 1);
        var geometryTop = new THREE.CubeGeometry(data.w * 0.5, data.h, 1);

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

        glWheel1left.position.x = localXback; // -1.5
        glWheel2left.position.x = localXfront; // 1.3;
        glWheel1right.position.x = localXback; // -1.5;
        glWheel2right.position.x = localXfront; // 1.3;

        glWheel1left.position.z = -1;
        glWheel2left.position.z = -1;
        glWheel1right.position.z = 1;
        glWheel2right.position.z = 1;


        glWheel1left.position.y = localY;
        glWheel2left.position.y = localY;
        glWheel1right.position.y = localY;
        glWheel2right.position.y = localY;


        // attach wheels to the car        
        glcarBody.add(glWheel1left);
        glcarBody.add(glWheel2left);
        glcarBody.add(glWheel1right);
        glcarBody.add(glWheel2right);


        world.scene.add( glcarBody );

        this.update = function(input) {

            // accelerate car            
            this.motor1.SetMotorSpeed(
                speed * Math.PI * (input.getKey(input.keyCode.D) ? 1 : input.getKey(input.keyCode.A) ? -1 : 0));

            this.motor1.SetMaxMotorTorque(
                input.getKey(input.keyCode.A) || input.getKey(input.keyCode.D) ? motorTorque : 0.5);

            // it will be easier to flip car up side down
            // but almost impossible if it is in correct position
            var carAngle = normalizeAngle(this.carBody.GetAngle());
            var carTorquoRatio = Math.sin(carAngle * 0.5); // strongest when car is up-side-down
            if (input.getKey(input.keyCode.A)) {
                this.carBody.ApplyTorque(torqueForce * carTorquoRatio);
            }
            if (input.getKey(input.keyCode.D)) {
                this.carBody.ApplyTorque(-1 * torqueForce * carTorquoRatio);
            }
            if (input.getKeyDown(input.keyCode.A)) {
                this.carBody.ApplyTorque(torqueForce * 500 * carTorquoRatio);
            }
            if (input.getKeyDown(input.keyCode.D)) {
                this.carBody.ApplyTorque(-1 * (torqueForce * 500 * carTorquoRatio));
            }
            
            // car stabilization, lets apply the torque force into opposit direction
            // depending on current car position relative from ground
            var carTorquoStabilizationRatio = Math.sin(carAngle); // strongest in vertical position
            this.carBody.ApplyTorque(-1 * stabilizationForce * carTorquoStabilizationRatio);

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
        }


        function normalizeAngle(angle) {
          angle = angle % (2 * Math.PI); 
          return angle >= 0 ? angle : angle + 2 * Math.PI;
          // angle = atan2(sin(angle, cos(angle))
        }
    }
})