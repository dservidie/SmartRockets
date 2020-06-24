class Population {
	
	static successCounter = 0;
	static failedCounter = 0;	
	
	static rockets = [];
  static popsize;
  static matingpool = [];

	static initialize() {
		// Array of rockets
		Population.rockets = [];
		// Amount of rockets
    Population.popsize = config.popSize;
    // Amount parent rocket partners
    Population.matingpool = [];

    // Associates a rocket to an array index
    for (var i = 0; i < Population.popsize; i++) {
      Population.rockets[i] = new Rocket();
    }
  }

  static evaluate() {
		// Calculates the performance of the generation to normalize the fitness.
		let maxFuelUsed = 0;
		let minFuelUsed = Number.MAX_VALUE;
		let maxDistanceTraveled = 0;
		let minDistanceTraveled = Number.MAX_VALUE;
		let maxClosestTargetDistance = 0;		
		let minClosestTargetDistance = Number.MAX_VALUE;		
		let maxFinalTargetDistance = 0;		
		let minFinalTargetDistance = Number.MAX_VALUE;		

		for(var r of Population.rockets) {
			if(r.fuelUsed > maxFuelUsed) maxFuelUsed = r.fuelUsed;
			if(r.fuelUsed < minFuelUsed) minFuelUsed = r.fuelUsed;
			if(r.distanceTraveled > maxDistanceTraveled) maxDistanceTraveled = r.distanceTraveled;
			if(r.distanceTraveled < minDistanceTraveled) minDistanceTraveled = r.distanceTraveled;
			if(r.closestTargetDistance > maxClosestTargetDistance) maxClosestTargetDistance = r.closestTargetDistance;
			if(r.closestTargetDistance < minClosestTargetDistance) minClosestTargetDistance = r.closestTargetDistance;			
			if(r.finalTargetDistance > maxClosestTargetDistance) maxFinalTargetDistance = r.finalTargetDistance;
			if(r.finalTargetDistance < minClosestTargetDistance) minFinalTargetDistance = r.finalTargetDistance;			
		}
		// TMP fix
		maxFuelUsed += 0.0000000001;
		maxDistanceTraveled += 0.0000000001;
		maxClosestTargetDistance += 0.0000000001;
		maxFinalTargetDistance += 0.0000000001;
		
	//	if(config.debugMode){
			console.log("#######################################");
			console.log("###                                 ###");
			console.log("fuelUsed: ", minFuelUsed , ' / ' , maxFuelUsed );		
			console.log("distanceTraveled: ", minDistanceTraveled , ' / ' , maxDistanceTraveled );		
			console.log("closestTargetDistance: ", minClosestTargetDistance , ' / ' , maxClosestTargetDistance );		
			console.log("finalTargetDistance: ", minFinalTargetDistance , ' / ' , maxFinalTargetDistance );		
			console.log("#######################################");
	//	}
		// Calculates fitness
    for(var r of Population.rockets) {
			let fuelUsedScore = map(r.fuelUsed, minFuelUsed, maxFuelUsed, 0, 1) * config.score_FuelUsed;
			let distanceTraveledScore = map(r.distanceTraveled, minDistanceTraveled, maxDistanceTraveled, 0, 1) * config.score_DistanceTraveled;
			let closestTargetDistanceScore = map(r.closestTargetDistance, minClosestTargetDistance, maxClosestTargetDistance, 1, 0) * config.score_ClosestTargetDistance;
			let finalTargetDistanceScore = map(r.finalTargetDistance, minFinalTargetDistance, maxFinalTargetDistance, 1, 0) * config.score_FinalTargetDistance;

			r.fitness = fuelUsedScore + distanceTraveledScore + closestTargetDistanceScore + finalTargetDistanceScore;

			//if(config.debugMode){
				console.log("#######################################");
				console.log("fuelUsedScore:", fuelUsedScore , ' / r.fuelUsed: ' , r.fuelUsed );
				console.log("distanceTraveledScore:", distanceTraveledScore , ' / r.distanceTraveled: ' , r.distanceTraveled);
				console.log("closestTargetDistanceScore:", closestTargetDistanceScore , ' / r.closestTargetDistance: ' , r.closestTargetDistance);
				console.log("finalTargetDistanceScore:", finalTargetDistanceScore , ' / r.finalTargetDistance: ' , r.finalTargetDistance);
				console.log("# FITNESS: ", r.fitness );
		//	}
		}
		
		// Normalizing the fitness value.
		const maxFitness = Population.rockets.reduce((p, c) => (p.fitness > c.fitness) ? p.fitness : c.fitness)
		console.log(maxFitness);
		Population.rockets.forEach(r => r.fitness /= maxFitness);
		
    Population.matingpool = [];
    // Take rockets fitness make in to scale of 10 to 100
    // A rocket with high fitness will highly likely will be in the mating pool
		let maxChances = 200;
		let minChances = 10;
		let ch = "";
		let f = "";
    for(var r of Population.rockets) {
      var n =  map(r.fitness, 0, 1, minChances, maxChances);
			f += r.fitness + ', ';
  		ch += n + ', ';
      for (var j = 0; j < n; j++) {
        Population.matingpool.push(r);
      }
		}
		console.log("Fitness: ", f);
		console.log("Chances: ", ch);
		console.log("Population.matingpool.length: ", Population.matingpool.length);
		Population.successCounter = 0;
		Population.failedCounter = 0;
	}
	
  // Selects appropriate genes for child
  static selection() {
    let newRockets = [];
		Rocket.launchSecuenceCounter = 0; // Just for graphical look.
		for (var i = 0; i < Population.popsize; i++) {
			var baseRocket = random(Population.matingpool);
			var childGenome = baseRocket.dna.clone();
			childGenome.mutation(config.mutationRate); // * (1-(baseRocket.fitness))
			// Creates new rocket with child dna
			newRockets.push(new Rocket(childGenome));
		}

    // This instance of rockets are the new rockets
    Population.rockets = newRockets;
  }

	// Calls for update and show functions
	static run() {
		for(var r of Population.rockets) {
			if(FPS/5 > r.launchSecuence){
				r.update();
				// Displays rockets to screen
				r.draw();			
			}
		}
	}

  // Checks if all misiles are crashed
  static simulationFinished() {
    for (let r of Population.rockets) {
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