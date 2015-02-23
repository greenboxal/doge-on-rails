var path = require('path');
var cluster = require('cluster');
var includePath = require('include-path');
var child_process = require("child_process");

var harmonize = function() {
    if (typeof Proxy == 'undefined') {
        var v = process.versions.node.split(".");

        if (v[0] == 0 && v[1] < 8) {
            throw new Error("DOR requires at least node v0.8");
        }

		if (!cluster.isMaster) {
			throw new Error("Cluster master must harmonize itself first!");
		}

        var result = child_process.spawnSync(process.argv[0], ['--harmony_proxies'].concat(process.argv.slice(1)), {
			stdio: [0,1,2]
		});

		process.exit(result.status);
    }
};

// Enable needed ES6 features
harmonize();

// Initialize saphire!
require('./saphire');

// Patch include paths
includePath(path.resolve(__dirname, '..'));

// Fix environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DAILS_ENV = process.env.DAILS_ENV || process.env.NODE_ENV || 'development';

