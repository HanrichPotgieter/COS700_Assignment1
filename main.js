var colog = require('colog');
var winston = require('winston');
// ===================================
// Absolute Value Function
// ===================================

// Setting up logger
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-File',
      filename: 'info-File.log',
      level: 'info'
    })
  ]
});

// ===================================

// ===================================
// Absolute Value Function
// ===================================

var abs = function(x,callback){
    var result = 0.0;
    x.forEach(function(element) {
        result += Math.abs(element);
    }, this);
    callback(result);
};

// ===================================

// ===================================
// Alpline Function
// ===================================

var alpline = function(x,callback){
    //console.log(x);
    var result = 0.0;
    var firstTerm = 0.0;
    var secondTerm = 0.0;
    x.forEach(function(element) { 
        if(firstTerm == 0.0){
            firstTerm = Math.sin(element);
        }
        else{
            firstTerm *= Math.sin(element);
        }
    }, this);

    x.forEach(function(element) {
        if(secondTerm == 0.0)
            secondTerm = element;
        else
            secondTerm *= element;
    }, this);
    
    result = firstTerm*Math.sqrt(secondTerm);
    if(isNaN(result)){
        callback(Infinity);
    }
    else
    {
        callback(result);
    }
    //console.log(result);
    
};

// ===================================

// ===================================
// Random number form uniform 
// distrobution
// ===================================

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a uniform distrobution
function getRandomInt(min, max) {
  return (Math.random() * (max - min)) + min;
};

// ===================================

// ===================================
// Check if particle is within range
// ===================================
var isWithinRange = function(particle,range){
    var result = true;
    particle.j.forEach(function(element) {
        if(!(element <= range.max && element >= range.min)){
            result = false;
        }
    }, this);
    return result;
};

var isWithinRangeValue = function(x,range){
    if(x <= range.max && x >= range.min)
        return true;
    return false;
};

// ===================================

// ===================================
// PSO - Particle Swarm Optmizer
// ===================================
var gbest = null;
var PSO = function(particles,objective,range,count,LogName,callback){
    //colog.success("===================================================");
    //colog.success("Iternation " + count);
    //if(gbest !== null)
    //    console.log(gbest);
    // First Part of algorithm
    particles.forEach(function(element) {
        //Evaluate particle fitness
        objective(element.j,function(result){
            element.fitness = result;
            //Update personal best position
            if(result < element.personalBest.fitness && isWithinRange(element,range)){
                element.personalBest.fitness = result;
                element.personalBest.j = element.j;
                //console.log("new personal best found");
                //console.log(element.personalBest);
                
            }
        });
    }, this);
    //Update particle neighborhood best position
    particles.forEach(function(element) {
        if(gbest === null){
            gbest = {fitness : element.fitness,j: element.j};
        }
        else{
            if(element.fitness < gbest.fitness && isWithinRange(element,range)){
                gbest = {fitness : element.fitness ,j: element.j};
                colog.success("New global best found loggin to " + LogName);
                console.log(gbest);
                colog.success("=====================");
                //Log to file...
                logger.log('info', 'Global Best',gbest);
            }
        }
    }, this);
    particles.forEach(function(element) {
        element.neighborhoodBest = gbest;
    }, this);
    // Second Part of algorithm
    // Update particles velocity
    var w = 0.729844;
    var c1 = 1.496180;
    var c2 = 1.496180;
    var r1 = getRandomInt(0.0,1.0);
    var r2 = getRandomInt(0.0,1.0);
    particles.forEach(function(element) {
        //colog.question('Element --> s');
            //colog.error("===============================");
            element.j.forEach(function(x,index) {
                //colog.question("===============================");
                //console.log("value of position: " +  x);
                //console.log("value of  goal: " +  gbest.j[index]);
                
                var social = element.personalBest.j[index] - x;
                var cognative = gbest.j[index] - x;
                //colog.question('Element social: ' + social + " Element cognative: " + cognative);
                element.velocity[index] = w*element.velocity[index] + c1*r1*social + c2*r2*cognative;
                //console.log("velocity: " +  element.velocity[index]);
                
                element.j[index] = element.j[index] + element.velocity[index];
                if(!isWithinRangeValue(element.j[index],range)){
                    if(element.j[index] <= range.min)
                        element.j[index] = range.min;
                    if(element.j[index] >= range.max)
                        element.j[index] = range.max;
                }
                //console.log("value of new position: " +  element.j[index]);
                //colog.question("===============================");
            }, this);
            //colog.error("===============================");
        //colog.question('Element <-- e');
    }, this);
    //console.log(particles);
    //colog.success("===================================================");
    //callback(particles,count);
    return particles;
};

// ===================================

// ===================================
// Generate Particles
// ===================================

var generateParticles = function(count,range){
    var particles = [];
    for(var i = 0;i <= count;i++)
    {
        particles.push({
            fitness: Infinity,
            'j':[getRandomInt(range.min,range.max),getRandomInt(range.min,range.max)],
            personalBest: {
                fitness: Infinity,
                j: []
            },
            neighborhoodBest: {},
            velocity:[getRandomInt(range.min,range.max),getRandomInt(range.min,range.max)]
            });
    }
    return particles;
};

// ===================================

// ===================================
// Calculations..
// ===================================

//logger.log('info', 'Starting the Application',{test:'Hello'});
var iterrations = 50;

colog.headerInfo('======================================='); 
colog.headerInfo('Uni-Modal abs function'); 
colog.headerInfo('=======================================');

logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'abs-File',
      filename: 'abs-File.log',
      level: 'info'
    })
  ]
});

colog.progress(0, iterrations); 
for(var j = 0;j<iterrations;j++){
    logger.log('info', 'Iteration' + j);
    gbest = null;
    colog.progress();
    var range = {min:-10.0,max:10.0}
    var particles = generateParticles(20,range);
    
    for(var i =1;i<100000;i++){
        particles = PSO(particles,abs,range,0,'abs-File',null);
    }
}

colog.headerInfo('======================================='); 
colog.headerInfo('Multi-Modal alpline function'); 
colog.headerInfo('=======================================');

logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'alpline-File',
      filename: 'alpline-File.log',
      level: 'info'
    })
  ]
});

colog.progress(0, iterrations); 
for(var j = 0;j<iterrations;j++){
    logger.log('info', 'Iteration' + j);
    gbest = null;
    colog.progress();
    var range = {min:-100.0,max:100.0}
    var particles = generateParticles(20,range);
    
    for(var i =1;i<100000;i++){
        particles = PSO(particles,alpline,range,0,'alpline-File',null);
    }
}

// ===================================