// Constructor function
class Rocket {
  constructor(...args) {
    let dna = args[0];
    // Physics of rocket at current instance
    this.tiltAcc = 0; // Rotation aceleration
		this.rotation = p5.Vector.fromAngle(-HALF_PI, 0);
    this.pos = createVector(width / 2, height - 15);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.maneuver = { thrust: 0.0, steering: 0.0 };

    this.command = 0;
    // Checkes rocket has reached target
    this.success = false;
    // Checks if rocket had crashed
    this.crashed = false;
    // Checks if rocket is active
    this.flying = true;
    // Gives a rocket dna
    if (dna) {
      this.dna = dna;
    } else {
      this.dna = new DNA();
    }
    this.fitness = 0;
		this.debug = "";
  }

  // Calulates fitness of rocket
  calcFitness() {
    // Takes distance to target
    var d = dist(this.pos.x, this.pos.y, target.x, target.y);

    // Maps range of fitness
    this.fitness = map(d, 0, width, width, 0);
    // If rocket gets to target increase fitness of rocket
    if (this.success) {
      this.fitness *= 10;
    }
    // If rocket does not get to target decrease fitness
    if (this.crashed) {
      this.fitness /= 10;
    }
  }

	
  // Updates state of rocket
	update() {
		// if rocket has not got to goal and not crashed then update physics engine
		if (this.flying) {
			// Checks distance from rocket to target
			var d = dist(this.pos.x, this.pos.y, target.x, target.y);

			// If distance less than 10 pixels, then it has reached target
			if (d < 10) {
				this.success = true;
				this.crashed = false;
				this.flying = false;
				this.pos = target.copy();
				Population.increaseSuccessCounter();
			}
			// Rocket hit the barrier
			if (stage.rocketCollision(this)) {
				this.crashed = true;
				this.flying = false;
				this.countFailed++;
				Population.increaseFailedCounter();
			}

			if (FPS % config.commandDuration == 0) { // The lenght of a command in frames
				this.maneuver = this.getCommand(); // gets the next maneuver to perform during the next config.commandDuration frames
				this.tiltAcc = this.maneuver.steering;
			}
			// Rotates according to the steering of the maneuver and rocket Maneuverability
			this.rotation.rotate(this.tiltAcc * config.rocketManeuverability);
			let thrust = this.rotation.copy();
			thrust.setMag(config.rocketThrust * this.maneuver.thrust);
			thrust.div(config.rocketMass);
			this.acc.add(thrust);	
			
			if(config.debugMode){
				this.debug += 
					"maneuver: { steering: " + this.maneuver.steering + ", thrust: " + this.maneuver.thrust + " } <br/>" 
					+ "this.tiltAcc: " + this.tiltAcc + " <br/>" 
					+ "this.acc: " + this.debugV(this.acc) + " <br/>" 
					+ "thrust: " + this.debugV(thrust) + " <br/>";
				logP.html( this.debug );
				this.debug = '';
			}
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.vel.limit(3);
    }
  }

  getCommand() {
    let nextCommand = this.dna.genes[this.command];
    this.command++;
    return nextCommand;
  }
	
  debugV(vector) {
    return 'v{ X: '+ vector.x +' | Y:'+vector.y+' | '+ degrees(vector.heading()).toFixed(2) +' }';
  }

  // displays rocket to window
  draw() {
    push();
    noStroke();
    //translate to the postion of rocket
    translate(this.pos.x, this.pos.y);
    //rotatates to the angle the rocket is pointing
    rotate(this.rotation.heading());
    fill(255, 0, 0);
    arc(5, 0, 25, 5, PI + HALF_PI, HALF_PI);
    fill(225, 225, 225);
    triangle(-3, 8, -3, -8, 5, 0);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
    if(this.maneuver.thrust > 0 && this.flying){ // Draw exaust flame
      noSmooth();
      fill(255, 240, 0, 200);
      quad(-5,0,  -8,-3*this.maneuver.thrust,  -(15 * this.maneuver.thrust+5),random(-2,2),  -8,3*this.maneuver.thrust);
      smooth()   
    }
    pop();
		if(config.debugMode){
			Stage.drawArrow(this.vel, this.pos, "green", 25);		
		}
  }
}
