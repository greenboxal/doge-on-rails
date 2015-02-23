var vm = require('vm');
var repl = require('repl');
var program = require('commander');
var Promise = require('bluebird')
var pkg = require('../../../package.json');

module.exports = Class.create(function Console() {
	/////////// Methods Declaration
	this.define(initialize);
	this.define(parseOptions);
	this.define(start);

	/////////// Methods Definition
	function initialize(args) {
		this.parseOptions(args);
	};

	function parseOptions(args) {
		program.usage('console [OPTIONS]')
		program.option('-e, --environment [env]', 'Specifies the environment to run this server under (test/development/production). Default: development', 'development');
		program.parse(args);

		if (program.environment) {
			process.env.DAILS_ENV = program.environment;
		}
	};

	function start() {
		console.log('Loading ' + process.env.DAILS_ENV + ' environment (Dails ' + pkg.version + ')')

		repl.start({
			eval: function(code, context, filename, callback) {
				Promise.resolve()
				.then(function() {
					return eval(code);
				})
				.nodeify(callback);
			}
		});
	};
});

