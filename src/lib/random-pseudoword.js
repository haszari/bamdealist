import _ from 'lodash';

const defaults = function(options, defaultValues) {
  options = options || {};
  return _.defaults(options, defaultValues);
};

const randomInteger = function(options) {
  options = defaults(options, {
    max: 10,
    min: 0
  });
  return Math.floor((Math.random() * (options.max - options.min)) + options.min);
};

const arrayModAt = function(array, index) {
  return array[index % array.length];
};

const randomPseudoword = (options) => {
  options = defaults(options, {
    maxSyllables: 5,
    minSyllables: 3,
    capitalize: true
  });

  let
    consonants = "bcdfghjklmnpqrstvwxyz",
    vowels = [
      'a', 'e', 'i', 'o', 'u', 'y'
    ],
    longvowels = [
      'ee', 'oo'
    ],
    dipthongs = [
      'ae', 'ai', 'ao', 'au',
      'ea', 'ei', 'eo', 'eu',
      'ia', 'ie', 'io', 'iu',
      'oa', 'oe', 'oi', 'ou'
    ];

  // shuffle our materials; shuffle two copies so can have repeats
  consonants = _.shuffle(consonants + consonants);
  vowels = _.shuffle(vowels.concat(vowels));
  longvowels = _.shuffle(longvowels.concat(longvowels));

  const syllables = randomInteger({ min: options.minSyllables, max: options.maxSyllables });
  let word = '';
  for (var i=0; i<syllables; i++) {
     var mode = randomInteger({max: 20});
     if (mode >= 18) {
        word += arrayModAt(consonants, i) + arrayModAt(dipthongs, i);
     }
     else if (mode >= 16) {
        word += arrayModAt(consonants, i) + arrayModAt(longvowels, i);
     }
     else if (mode === 6) {
        word += arrayModAt(consonants, i);
     }
     else {
        word += arrayModAt(consonants, i) + arrayModAt(vowels, i);
     }
  }
  
  if (options.capitalize) {
     word = word.charAt(0).toUpperCase() + word.slice(1);
  }
  
  return word;
}

export default randomPseudoword;
