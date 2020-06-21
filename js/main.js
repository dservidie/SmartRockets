var population;
var stage;
// Made to display count on screen
var generationP, lifeP, statusP, logP;
// Keeps track of frames and generations
var FPS = 0, generationCounter = 1;
// Where rockets are trying to go
var target;


function setup() {
	let canvas = createCanvas(600, 400);
  canvas.parent('canvasDiv');
	population = new Population();
  stage = new Stage();
  stage.addBarrier({ rx: 200, ry: 250, rw: 200, rh: 12 });
  stage.addBarrier({ rx:   0, ry: 140, rw: 150, rh: 12 });
  stage.addBarrier({ rx: 450, ry: 140, rw: 150, rh: 12 });
  generationP = createP();
  lifeP = createP();
	statusP = createP();
  logP = createP('');
	generationP.parent('outDiv');
  lifeP.parent('outDiv');
  statusP.parent('outDiv');
  logP.parent('outDiv');
	target = createVector(width / 2, 50);
}

function draw() {  
	background(0);
	population.run();
  let simulationFinished = population.simulationFinished();
	// Displays count to window
	generationP.html("Generation #" + generationCounter);
	lifeP.html("Frame: " + FPS);
	statusP.html("Success / Failed: " + Population.successCounter + '/' + Population.failedCounter);
  FPS++;
	
	// Renders barrier for rockets
  stage.draw()
	// Renders target
	ellipse(target.x, target.y, 16, 16);
	
	if (simulationFinished) {
		population.evaluate();
		population.selection();
		FPS = 0;
		generationCounter++;
    Stage.stop(2000);
	}

}


