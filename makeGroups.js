// Module structure:

// Import necessary packages:
  // Tabletop: https://www.npmjs.com/package/tabletop
  // what else?

// Manage data inputs:
  // # of generations
  // Cull rate
  // Gene pool size
  // Mutation rate
  // Bonus for affinitiy
  // Penalty for refusal (technical)
  // Penalty for refusal (interpersonal)
  // Penalty for wrong group size (for v2)

// Clean data

// Generate the initial gene pool randomly

// Begin assessment/cull/breed loop:
  // Assess the fitness of all combinations in the gene pool
  // Cull the bottom %
  // Breed the top % to fill the new gap
  // Repeat until generation count is met

// Print the most fit combination and associated fitness score to console

const preferences = require('./preferenceData');

const generationCount = 200;
const cullRate = .1;
const genePoolSize = 100;
const mutationRate = .01;
const affinityBonus = 1;
const techRefusal = -3;
const personalRefusal = -5;
const wrongSizePentaltyBase = -5;

const phraseToRateTable = {
  'I would especially enjoy working with this person.': affinityBonus,
  'I would refuse to work with this person, due to THEIR TECHNICAL ABILITIES': techRefusal,
  'I would refuse to work with this person, due to OUR INTERPERSONAL ISSUES': personalRefusal
};

const cleanPreferences = (preferences) => {
  let cleanedPreferences = {};

  preferences.forEach((person) => {
    let relationships = {};
    for (let key in person) {
      if (key !== 'timestamp' && key !== 'yourName' && key !== person.yourName) {
        relationships[key] = phraseToRateTable[person[key]];
      }
    }
    cleanedPreferences[person.yourName] = relationships;
  });

  return cleanedPreferences;
};

const cleanedPreferences = cleanPreferences(preferences);

const makePeopleList = (preferences) => {
  return preferences.map((person) => {
    return person.yourName;
  });
};

const people = makePeopleList(preferences);

const makeRandomGenome = (people) => {
  let peopleCopy = people.map((person) => { return person; });
  let currentGroup = 0;
  let genome = [{name: currentGroup, members: []}];
  let randomIndex = 0;
  let person = '';

  while (peopleCopy.length > 0) {
    randomIndex = Math.floor(Math.random() * peopleCopy.length);
    person = peopleCopy[randomIndex];
    peopleCopy.splice(randomIndex, 1);

    if (genome[currentGroup].members.length < 4) {
      genome[currentGroup].members.push(person);
    } else {
      currentGroup++;
      genome[currentGroup] = {name: currentGroup, members: []};
      genome[currentGroup].members.push(person);
    }
  }

  return genome;
};

const makeInitialGenePool = (size, people) => {
  let genePool = [];
  
  for (var i = 0; i < size; i++) {
    genePool.push(makeRandomGenome(people));
  }

  return genePool;
};

const getFitness = (genome, preferences) => {
  let fitness = 0;

  genome.forEach((group) => {
    group.members.forEach((member) => {
      group.members.forEach((relation) => {
        if (preferences[member][relation] !== undefined) {
          fitness += preferences[member][relation];
        }
      });
    });
  });

  return fitness;
};

console.log(getFitness(makeRandomGenome(people), cleanedPreferences));
