class Stage {
  constructor() {
    this.objects = [];
  }
  addBarrier(barrier) {
    this.objects.push(barrier);
  }
  rocketCollision(rocket) {
    // Rocket hits border of canvas
    if (
      rocket.pos.x > width ||
      rocket.pos.x < 0 ||
      rocket.pos.y > height ||
      rocket.pos.y < 0
    ) {
      return true;
    }
    // Rocket hits one object
    for (let obj of this.objects) {
			if(
				rocket.pos.x > obj.rx &&
        rocket.pos.x < obj.rx + obj.rw &&
        rocket.pos.y > obj.ry &&
        rocket.pos.y < obj.ry + obj.rh
			) return true;
    }
		return false;
  }

  draw() {
    for (let obj of this.objects) {
      fill(255);
      rect(obj.rx, obj.ry, obj.rw, obj.rh);
    }
  }

  // draw an arrow for a vector at a given base position
  static drawArrow(vector, location, color, scale = 5) {
    push();
    stroke(color);
    fill(color);
    strokeWeight(3);
    translate(location.x, location.y);
    line(0, 0, vector.x*scale, vector.y*scale);
    rotate(vector.heading());
    let arrowSize = 3;
    translate(vector.mag()*scale - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
  
  static stop(milliseconds = 500) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  
}
