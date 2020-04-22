let Creep = require('role.creep');

var roleBuilder = {
    run: function (spawn, creep) {

        if (creep.memory.building && Creep.empty(creep)) {
            creep.memory.building = false;
            creep.say('👷 harvest');
        }
        if (!creep.memory.building && Creep.full(creep)) {
            creep.memory.building = true;
            creep.say('👷 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            Creep.refill(creep);
        }
    }
};

module.exports = roleBuilder;