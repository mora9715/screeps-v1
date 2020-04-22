let Creep = require('role.creep');

var roleUpgrader = {
    run: function (spawn, creep) {

        if (creep.memory.upgrading && Creep.empty(creep)) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && Creep.full(creep)) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            Creep.refill(creep);
        }
    }
};

module.exports = roleUpgrader;