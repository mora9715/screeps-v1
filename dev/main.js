let controllerCreep = require('controller.creep');

module.exports.loop = function () {
    for (var spawn in Game.spawns) {
        controllerCreep.run(spawn);

    }

};