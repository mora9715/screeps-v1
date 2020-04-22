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
            if (creep.store.getUsedCapacity() === 0) {
                creep.memory.refueling = true;
            }
            // If carry is full, need to stop refueling
            if (creep.store.getFreeCapacity() === 0) {
                creep.memory.refueling = false;
            }

            if (creep.memory.refueling) {
                creep.say('🛠 fuel');
                // Trying storages first
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_CONTAINER ||
                            structure.structureType === STRUCTURE_STORAGE) && structure.store.getCapacity() > 0;
                    }
                });
                // Draining storages if found
                if (targets.length > 0) {
                    if (creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    // If storages are empty or absent, going to mine
                    var source = creep.pos.findClosestByPath(FIND_SOURCES);
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
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