var raceMenu = require('./raceMenu');
var polling = require('./polling');

Promise.resolve()
    .then(raceMenu.loaded)
    .then(polling.loaded);