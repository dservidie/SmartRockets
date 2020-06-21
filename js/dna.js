
class DNA {
	constructor(genes){
		// Recieves genes and create a dna object
		if (genes) {
			this.genes = genes;
		} else {
			// If no genes just create random dna
			this.genes = [];
			for (var i = 0; i < (config.commandsAmount * config.commandDuration); i++) {
				// Gives random vectors
				this.genes[i] = { thrust: random(0.5, 1), steering: random(-1, 1) };
			}
		}
	}
	// Performs a crossover with another member of the species
	crossover(partner) {
		var newgenes = [];
		// Picks random midpoint
		var mid = floor(random(this.genes.length));
		for (var i = 0; i < this.genes.length; i++) {
			// If i is greater than mid the new gene should come from this partner
			if (i > mid) {
				newgenes[i] = this.genes[i];
			}
			// If i < mid new gene should come from other partners gene's
			else {
				newgenes[i] = partner.genes[i];
			}
		}
		// Gives DNA object an array
		return new DNA(newgenes);
	}

	// Adds random mutation to the genes to add variance.
	mutation () {
		for (var i = 0; i < this.genes.length; i++) {
			// if random number less than 0.01, new gene is then random vector
			if (random(1) < config.mutationRate) {
				this.genes[i] = { thrust: random(0.5, 1), steering: random(-1, 1) };
			}
		}
	}
}
