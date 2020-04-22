var _ = require('lodash');

// Price of each body part
const BODYPART_COST = {
    "move": 50,
    "work": 100,
    "attack": 80,
    "carry": 50,
    "heal": 250,
    "ranged_attack": 150,
    "tough": 10,
    "claim": 600
};

// Offset for different worker roles
const OFFSET = {
    "start": {
        "builder": [WORK, WORK, MOVE, CARRY],
        "harvester": [WORK, MOVE, MOVE, CARRY],
        "upgrader": [WORK, MOVE, MOVE, CARRY],
        "miner": [WORK, WORK, MOVE],
        "carrier": [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        "repairer": [WORK, MOVE, MOVE, CARRY]
    }
};
let managerQueue = {
    /** Summary: collection of functions to manage creeps
     *
     *
     * @param {Object}   creep        - creep to calculate cost for
     * @param {string}   creep.spawn  - spawn where creep should be created
     * @param {string}   creep.role   - role of a creep
     * @param {Object[]} creep.body   - parts of creep body
     * @param {string}   creep.body[] - single body part
     */
    enqueueCreep: function (spawn, role, offset) {
        /** Summary: add creep to spawn queue
         *
         * @param {string} spawn  - spawn where creep should be created
         * @param {string} role   - role of a creep
         * @param {string} offset - offset of the creep (body)
         */
        let creep = {
            'spawn': spawn,
            'role': role,
            'body': OFFSET[offset][role]
        };
        for (item of Memory.spawnQueue) {
            if (JSON.stringify(creep) === JSON.stringify(item)) {
                return 1;
            }
        }
        Memory.spawnQueue.push(creep);
        return 0;
    },
    calculateCost: function (creep) {
        /** Summary: calculate cost for a creep
         *
         * @param {Object} creep - see object description above
         *
         * @return {number} total creep cost
         */
        let totalSum = 0;
        for (part of creep['body']) {
            totalSum += BODYPART_COST[part];
        }
        return totalSum;
    },
    produceCreep: function (creep) {
        /** Summary: spawn a creep on a given spawn point, with given body and role
         *
         * @param {Object} creep - see object description above
         *
         * @return {number} 0 if spawned successfully, 1 otherwise
         */
        const costsEnergy = this.calculateCost(creep);
        const availableEnery = Game.spawns[creep['spawn']].room.energyAvailable;

        if (availableEnery >= costsEnergy && Game.spawns[creep['spawn']].spawning == null) {
            const nameSuffix = Math.random().toString(36).substring(7);
            const res = Game.spawns[creep['spawn']].spawnCreep(
                creep['body'],
                creep['role'] + '_' + nameSuffix,
                {memory: {'role': creep['role']}}
            );
            if (res === 0) {
                console.log('Spawned creep with role ' + creep['role']);
                return 0;
            } else {
                console.log('Failed to spawn creep. Return code: ' + res);
                return 1;
            }
        }
    },
    processQueue: function () {
        /** Summary: process first element of queue, delete if successful
         *
         * @return {number} 0 if processed successfully, 1 otherwise
         */
        if (Memory.spawnQueue.length > 0) {
            const res = this.produceCreep(Memory.spawnQueue[0]);
            if (res === 0) {
                Memory.spawnQueue.shift();
                return 0;
            }
            return 1;
        }
    },
    maintainCreep: function (spawn, offset, desiredMap) {
        currentQuantity = [];
        currentMap = {};
        // Getting current quantity of all creeps with roles
        for (var creep in Game.creeps) {
            if (Game.creeps[creep].memory.role) {
                currentQuantity.push(Game.creeps[creep].memory.role);
            }
        }
        // Creating current role-quantity mapping
        currentQuantity.forEach(function(i) { currentMap[i] = (currentMap[i]||0) + 1;});
        // Queuing if something is missing
        for (element in desiredMap) {
            if (currentMap[element] < desiredMap[element] || currentMap[element] === undefined) {
                console.log("enqueuing creep for SPAWN: ", spawn);
                this.enqueueCreep(spawn, element, offset);
            }
        }
        this.processQueue();
    }

};

module.exports = managerQueue;