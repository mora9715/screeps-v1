const Creep = {
    refill: function(creep){
        /* Refills creep
           Order: Container => Storage => Mine
         */
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
    },
    full: function(creep){
        /* Returns True if creep is full
         */
        return creep.store.getFreeCapacity() === 0;
    },
    empty: function(creep){
        /* Returns True if creep is empty
         */
        return creep.store.getUsedCapacity() === 0;
    }
};

module.exports = Creep;