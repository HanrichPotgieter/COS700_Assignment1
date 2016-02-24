var colog = require('colog');

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
    //console.log(result);
    callback(result);
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
var PSO = function(particles,objective,range,count,callback){
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
                colog.success("New global best found");
                console.log(gbest);
                colog.success("=====================");
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
            velocity:[0.0,0.0,0.0]
            });
    }
    return particles;
};

// ===================================

// ===================================
// Calculations..
// ===================================
var showResults = function(result){
    console.log(result);
}
    
var range = {min:-100.0,max:100.0}


//for(var j =0;j<100;j++)
//{
    var particles = generateParticles(20,range);
    for(var i =1;i<1000000;i++){
        particles = PSO(particles,abs,range,0,null)
    }
//}
//var loop = function(result,count){
//    count = count + 1;
    //console.log(result);
    //console.log(result[0].neighborhoodBest);
//    if(count <= 100){
//        PSO(result,abs,range,count,loop);
//    }
//}

//PSO(generateParticles(20,range),abs,range,0,loop);

// ===================================