var pkg = require('../../../package.json');

module.exports = Class.create(function CommandsTasks() {
	//////////// Constants
	var COMMAND_WHITELIST = ['help', 'version', 'console', 'runner', 'server'];
	var HELP_MESSAGE = "";

	HELP_MESSAGE += 'Usage: dails COMMAND ARGS\n';
	HELP_MESSAGE += 'The most common rails commands are:\n';
	HELP_MESSAGE += ' console     Start the Rails console (short-cut alias: "c")\n';
	HELP_MESSAGE += ' server      Start the Rails server (short-cut alias: "s")\n';
	HELP_MESSAGE += '\n';
	HELP_MESSAGE += 'In addition to those, there are:\n';
	HELP_MESSAGE += ' runner       Run a piece of code in the application environment (short-cut alias: "r")\n';
	HELP_MESSAGE += '\n';
	HELP_MESSAGE += 'All commands can be run with -h (or --help) for more information.\n';

	//////////// Methods Declaration
	this.define(initialize);
	this.define(parseCommand);
	this.define(requireCommand);
	this.define(requireApplication);
	this.define(writeErrorMessage);
	this.define(runCommand);
	this.define(version);
	this.define(help);
	this.define(runConsole);
	this.define(runner);
	this.define(server);

	//////////// Methods Definition
	function initialize(args) {
		this.args = args;
	};

	function parseCommand(command) {
		switch (command) {
			case '--help':
				return 'help';
			case '--version':
				return 'version';
		}

		return command;
	};

	function requireCommand(name) {
		return require('./' + name);
	};

	function requireApplication() {
		return require(process.env.APP_PATH);
	};

	function writeErrorMessage(command) {
		console.log('unknown command', command);
		this.help();
	};

	function runCommand(command) {
		command = this.parseCommand(command)

		if (COMMAND_WHITELIST.indexOf(command) !== -1) {
			this.send(command);
		} else {
			this.writeErrorMessage(command);
		}
	};

	function version() {
		console.log('Dails', pkg.version);
	};

	function help() {
		console.log(HELP_MESSAGE);
	};

	function runConsole() {
		var Console = this.requireCommand('console');
		var console = new Console(this.args);

		this.requireApplication();

		console.start();
	};

	function runner() {
		this.requireCommand('runner');
	};

	function server() {
		var Server = this.requireCommand('server');
		var server = new Server(this.args);

		// process.chdir(Dails.application.root);

		server.start();
	};
});

