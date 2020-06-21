class Population {
	
	static successCounter = 0;
	static failedCounter = 0;	
	
	constructor() {
		// Array of rockets
		this.rockets = [];
		// Amount of rockets
    this.popsize = config.popSize;
    // Amount parent rocket partners
    this.matingpool = [];

    // Associates a rocket to an array index
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i] = new Rocket();
    }
  }

  evaluate() {
    var maxfit = 0;
    // Iterate through all rockets and calcultes their fitness
    for (var i = 0; i < this.rockets.length; i++) {
      // Calculates fitness
      this.rockets[i].calcFitness();
      // If current fitness is greater than max, then make max equal to current
      if (this.rockets[i].fitness > maxfit) {
        maxfit = this.rockets[i].fitness;
      }
    }
    // Normalises fitnesses
    for (var i = 0; i < this.rockets.length; i++) {
      this.rockets[i].fitness /= maxfit;
    }

    this.matingpool = [];
    // Take rockets fitness make in to scale of 1 to 100
    // A rocket with high fitness will highly likely will be in the mating pool
    for (var i = 0; i < this.rockets.length; i++) {
      var n = this.rockets[i].fitness * 100;
      for (var j = 0; j < n; j++) {
        this.matingpool.push(this.rockets[i]);
      }
		}
		Population.successCounter = 0;
		Population.failedCounter = 0;
	}
  // Selects appropriate genes for child
  selection() {
    var newRockets = [];
    for (var i = 0; i < this.rockets.length; i++) {
      // Picks random dna
      var parentA = random(this.matingpool).dna;
      var parentB = random(this.matingpool).dna;
      // Creates child by using crossover function
      var child = parentA.crossover(parentB);
      child.mutation();
      // Creates new rocket with child dna
      newRockets[i] = new Rocket(child);
    }
    // This instance of rockets are the new rockets
    this.rockets = newRockets;
  }

  // Calls for update and show functions
  run() {
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].update();
      // Displays rockets to screen
      this.rockets[i].draw();
    }
  }

  // Checks if all misiles are crashed
  simulationFinished() {
    for (let r of this.rockets) {
      if (r.flying) {
        return false;
      }
    }
    return true;
  }

	static increaseSuccessCounter() {
			Population.successCounter++;
	}
	static increaseFailedCounter() {
			Population.failedCounter++;
	}
	
}