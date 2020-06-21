const config = {
  popSize: 25,
  
  // Each rocket is alive till 400 frames
  commandsAmount: 30,
  commandDuration: 20, // How many FPS we let commands to execute
  // Rocket physics configuration
  rocketMass: 2.0,
  rocketThrust: 0.07,
  rocketManeuverability: 0.1, // In radians per frame
	// Sets how likely are one gene to mutate. 0: No mutation at all / 1: Mutate all genes.
	mutationRate: 0.04,
  debugMode: false,
}