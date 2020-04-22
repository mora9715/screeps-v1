var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repairer');
var queueManager = require('manager.queue');

let offset = "start";
let requiredCreeps = {
    'harvester': 1,
    'builder': 1,
    'upgrader': 1,
    'repairer': 1,

};
let roleMapper = {
    'harvester': roleHarvester,
    'builder': roleBuilder,
    'upgrader': roleUpgrader,
    'repairer': roleRepairer
};

var controllerCreep = {
    run: function (spawn) {
        // Memory cleanup:
        Memory.spawnQueue = [];
        for(var i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
        // Creeps go work:
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            roleMapper[creep.memory['role']].run(spawn, creep);
        }
        // Maintain creeps number:
        queueManager.maintainCreep(spawn, offset, requiredCreeps);
    }
};

module.exports = controllerCreep;