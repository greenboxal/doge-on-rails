var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var executables = [
	'bin/dails',
	'scripts/dails'
];

exports.loadApplication = function() {
	var originalCwd = process.cwd();

	while (true) {
		var path = process.cwd();
		var parsed = path.parse(path);

		var executable = _.find(executables, fs.existsSync);

		if (executable) {
			var result = child_process.spawnSync(executable, process.argv.slice(1), {
				stdio: [0,1,2]
			});

			process.exit(result.status);
			break;
		}

		if (parsed.root == parsed.dir) {
			process.chdir(originalCwd);
			break;
		}
		
		process.chdir('..');
	}
};

