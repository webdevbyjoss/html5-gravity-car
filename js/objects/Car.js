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


        // create visual opengl representation of the car aligned with physics
        var mainColor = 0x2C5F9B; // Deeper blue for the main body
        var darkColor = 0x1A3A5E; // Darker blue for details
        var windowColor = 0xA3C8E3; // Light blue for windows
        var headlightColor = 0xFFFFA0; // Yellow for headlights
        var taillightColor = 0xFF0000; // Red for taillights
        var wheelColor = 0x222222; // Dark gray for wheels
        var rimColor = 0xCCCCCC; // Light gray for wheel rims
        
        // Create a car group to hold all parts
        var glcarBody = new THREE.Object3D();
        
        // Materials
        var bodyMaterial = new THREE.MeshLambertMaterial({ color: mainColor });
        var darkMaterial = new THREE.MeshLambertMaterial({ color: darkColor });
        var windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
        var headlightMaterial = new THREE.MeshLambertMaterial({ color: headlightColor });
        var taillightMaterial = new THREE.MeshLambertMaterial({ color: taillightColor });
        
        // Create a unified car body instead of separate pieces
        // Main body part (horizontal) - increased height by 30%
        var mainBodyGeometry = new THREE.CubeGeometry(data.w, data.h * 0.65, 2.0); // Increased from 0.5 to 0.65
        var mainBody = new THREE.Mesh(mainBodyGeometry, bodyMaterial);
        mainBody.position.y = -0.075; // Slight adjustment to position to accommodate increased height
        glcarBody.add(mainBody);
        
        // Connecting piece to smooth the transition between parts
        var connectorGeometry = new THREE.CubeGeometry(data.w * 0.6, data.h * 0.3, 2.0);
        var connector = new THREE.Mesh(connectorGeometry, bodyMaterial);
        connector.position.x = -0.2;
        connector.position.y = -0.55; // Adjusted to match the new main body height
        glcarBody.add(connector);
        
        // Second body part (cabin/cockpit)
        var secondBodyGeometry = new THREE.CubeGeometry(data.w * 0.5, data.h * 0.5, 2.0);
        var secondBody = new THREE.Mesh(secondBodyGeometry, bodyMaterial);
        secondBody.position.x = -0.25;
        secondBody.position.y = -1.0;
        glcarBody.add(secondBody);
        
        // Add simple windshield that spans the transition at 45 degrees
        var windshieldGeometry = new THREE.CubeGeometry(0.05, data.h * 0.9, 1.8);
        var windshield = new THREE.Mesh(windshieldGeometry, windowMaterial);
        windshield.position.x = data.w * 0.1;
        windshield.position.y = -0.6;
        windshield.rotation.z = Math.PI * 0.25; // 45 degree angle
        glcarBody.add(windshield);
        
        // Add simple rear window
        var rearWindowGeometry = new THREE.CubeGeometry(0.05, data.h * 0.5, 1.8);
        var rearWindow = new THREE.Mesh(rearWindowGeometry, windowMaterial);
        rearWindow.position.x = -data.w * 0.35;
        rearWindow.position.y = -0.8;
        rearWindow.rotation.z = -Math.PI * 0.1;
        glcarBody.add(rearWindow);
        
        // Add simple headlights
        var headlightGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8);
        
        var headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightLeft.rotation.z = Math.PI * 0.5;
        headlightLeft.position.x = data.w * 0.45;
        headlightLeft.position.y = -0.1;
        headlightLeft.position.z = 0.7;
        glcarBody.add(headlightLeft);
        
        var headlightRight = headlightLeft.clone();
        headlightRight.position.z = -0.7;
        glcarBody.add(headlightRight);
        
        // Add simple taillights
        var taillightGeometry = new THREE.CubeGeometry(0.1, 0.15, 0.3);
        
        var taillightLeft = new THREE.Mesh(taillightGeometry, taillightMaterial);
        taillightLeft.position.x = -data.w * 0.45;
        taillightLeft.position.y = -0.1;
        taillightLeft.position.z = 0.7;
        glcarBody.add(taillightLeft);
        
        var taillightRight = taillightLeft.clone();
        taillightRight.position.z = -0.7;
        glcarBody.add(taillightRight);
        
        // Create wheels (simplified)
        var wheelTireMaterial = new THREE.MeshLambertMaterial({ color: wheelColor });
        var wheelRimMaterial = new THREE.MeshLambertMaterial({ color: rimColor });
        
        // Simple wheel creation function
        var createWheel = function(x, y, z) {
            var wheelGroup = new THREE.Object3D();
            
            // Tire - simple cylinder
            var wheelTire = new THREE.Mesh(
                new THREE.CylinderGeometry(data.wheelRadius, data.wheelRadius, 0.5, 24, 1, false),
                wheelTireMaterial
            );
            wheelTire.rotation.x = Math.PI/2;
            wheelGroup.add(wheelTire);
            
            // Rim
            var wheelRim = new THREE.Mesh(
                new THREE.CylinderGeometry(data.wheelRadius * 0.65, data.wheelRadius * 0.65, 0.51, 16, 1, false),
                wheelRimMaterial
            );
            wheelRim.rotation.x = Math.PI/2;
            wheelGroup.add(wheelRim);
            
            // Hub cap in the center
            var hubCap = new THREE.Mesh(
                new THREE.CylinderGeometry(data.wheelRadius * 0.2, data.wheelRadius * 0.2, 0.52, 16, 1, false),
                wheelRimMaterial
            );
            hubCap.rotation.x = Math.PI/2;
            wheelGroup.add(hubCap);
            
            // Add visible spokes to show rotation
            for (var i = 0; i < 6; i++) {
                var spoke = new THREE.Mesh(
                    new THREE.CubeGeometry(data.wheelRadius * 1.1, 0.1, 0.07),
                    wheelRimMaterial
                );
                spoke.rotation.z = Math.PI * i / 3; // Divide 360 degrees into 6 equal parts
                spoke.position.y = 0;
                wheelRim.add(spoke);
            }
            
            // Add colored markers on the tire edge
            var markerMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF }); // White markers
            
            var marker = new THREE.Mesh(
                new THREE.CubeGeometry(0.1, 0.1, 0.55),
                markerMaterial
            );
            marker.position.set(data.wheelRadius * 0.8, 0, 0);
            wheelTire.add(marker);
            
            // Add a second marker on the opposite side for balance
            var marker2 = marker.clone();
            marker2.position.set(-data.wheelRadius * 0.8, 0, 0);
            wheelTire.add(marker2);
            
            wheelGroup.position.set(x, y, z);
            return wheelGroup;
        };
        
        // Create the four wheels
        var glWheel1left = createWheel(-1.5, 0.4, -1.1);
        var glWheel2left = createWheel(1.3, 0.4, -1.1);
        var glWheel1right = createWheel(-1.5, 0.4, 1.1);
        var glWheel2right = createWheel(1.3, 0.4, 1.1);
        
        // attach wheels to the car
        glcarBody.add(glWheel1left);
        glcarBody.add(glWheel2left);
        glcarBody.add(glWheel1right);
        glcarBody.add(glWheel2right);

        world.scene.add(glcarBody);

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
            glWheel1left.rotation.z = wheel1Def.angle;
            glWheel2left.rotation.z = wheel2Def.angle;
            glWheel1right.rotation.z = wheel1Def.angle;
            glWheel2right.rotation.z = wheel2Def.angle;

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