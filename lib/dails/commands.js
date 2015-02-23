var CommandsTasks = require('./commands/commands-tasks');

var args = process.argv.slice(2);

if (args.length == 0) {
	args.push('--help');
}

var aliases = {
	'c': 'console',
	's': 'server',
	'r': 'runner'
};

var command = args.shift();

command = aliases[command] || command;

new CommandsTasks(
	process.argv.slice(0,2).concat(args)
).runCommand(command);

