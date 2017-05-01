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

  cleanedPreferences = preferences.map((person) => {
    let cleanEntry = {name: person['yourName'], relationships: {}};
    for (let key in person) {
      if (key !== 'timestamp' && key !== 'yourName' && key !== cleanEntry.name) {
        cleanEntry.relationships[key] = phraseToRateTable[person[key]];
      }
    }
    return cleanEntry;
  });

  return cleanedPreferences;
};

console.log(cleanPreferences(preferences));
