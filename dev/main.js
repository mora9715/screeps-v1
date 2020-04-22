let controllerCreep = require('controller.creep');
let mainSpawn = 's1';


module.exports.loop = function () {
    controllerCreep.run(mainSpawn);
}