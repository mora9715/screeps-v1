let Creep = require('role.creep');

var roleRepairer = {
    run: function (spawn, creep) {
        // If creep does not have targets, search for one
        if (!creep.memory.target) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });

            targets.sort((a, b) => a.hits - b.hits);

            if (targets.length > 0) {
                creep.memory.target = targets[0].id;
                creep.say('🛠️ target')
            }
        } else {
            // If carry is empty, need to refuel
            if (Creep.empty(creep)) {
                creep.memory.refueling = true;
            }
            // If carry is full, need to stop refueling
            if (Creep.full(creep)) {
                creep.memory.refueling = false;
            }

            if (creep.memory.refueling) {
                Creep.refill(creep);
            } else {
                // We are full and have target
                var target = Game.getObjectById(creep.memory.target);
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleRepairer;