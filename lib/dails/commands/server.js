var _ = require('lodash');
var program = require('commander');
var express = require('express');
var cluster = require('cluster');
var pkg = require('../../../package.json');

module.exports = Class.create(function Server() {
	//////////// Constants
	var defaultConfig = {
		port: 3000,
		binding: '0.0.0.0',
		environment: process.env.DAILS_ENV || process.env.NODE_ENV || 'development',
		trustProxy: true
	};

	/////////// Methods Declaration
	this.define(initialize);
	this.define(parseOptions);
	this.define(start);
	this.define(printBootInformation);
	
	/////////// Methods Definition
	function initialize(args) {
		this.server = express();
		this.parseOptions(args);

		if (this.options.trustProxy) {
			this.server.enable('trust proxy');
		}

		this.server.set('environment', this.options.environment);

		this.server.use(function(req, res) {
			this.app.call(req, res);
		});
	};

	function parseOptions(args) {
		program.usage('server [OPTIONS]')
		program.option('-p, --port [port]', 'Runs Dails on the specified port. Default: 3000', 3000);
		program.option('-b, --binding [IP]', 'Runs Dails on the specified IP. Default: 127.0.0.1', '127.0.0.1');
		program.option('-e, --environment [env]', 'Specifies the environment to run this server under (test/development/production). Default: development', 'development');
		program.option('-t, --untrust-proxy', 'Do not trust proxy information.', false);
		program.parse(args);

		if (program.environment) {
			process.env.DAILS_ENV = program.environment;
		}

		this.options = _.defaults({
			port: program.port,
			binding: program.binding,
			environment: program.environment,
			trustProxy: !program.untrustProxy
		}, defaultConfig);
	};

	function start() {
		this.printBootInformation();

		this.server.listen(this.options.port, this.options.binding);
	};

	function printBootInformation() {
		var url = 'http://' + this.options.binding + ':' + this.options.port;

		if (process.NODE_ENV != 'production') {
			console.log();
			console.log("                        Doge on Rails");
			console.log("                  Y.                      _");
			console.log("                  YiL                   .```.");
			console.log("                  Yii;      WOW       .; .;;`.");
			console.log("                  YY;ii._           .;`.;;;; :");
			console.log("                  iiYYYYYYiiiii;;;;i` ;;::;;;;");
			console.log("              _.;YYYYYYiiiiiiYYYii  .;;.   ;;;");
			console.log("           .YYYYYYYYYYiiYYYYYYYYYYYYii;`  ;;;;");
			console.log("         .YYYYYYY$$YYiiYY$$$$iiiYYYYYY;.ii;`..");
			console.log("        :YYY$!.  TYiiYY$$$$$YYYYYYYiiYYYYiYYii.");
			console.log("        Y$MM$:   :YYYYYY$!\"``\"4YYYYYiiiYYYYiiYY.");
			console.log("     `. :MM$$b.,dYY$$Yii\" :'   :YYYYllYiiYYYiYY");
			console.log("  _.._ :`4MM$!YYYYYYYYYii,.__.diii$$YYYYYYYYYYY");
			console.log("  .,._ $b`P`     \"4$$$$$iiiiiiii$$$$YY$$$$$$YiY;");
			console.log("     `,.`$:       :$$$$$$$$$YYYYY$$$$$$$$$YYiiYYL");
			console.log("      \"`;$$.    .;PPb$`.,.``T$$YY$$$$YYYYYYiiiYYU:");
			console.log("    ' ;$P$;;: ;;;;i$y$\"!Y$$$b;$$$Y$YY$$YYYiiiYYiYY");
			console.log("      $Fi$$ .. ``:iii.`-\";YYYYY$$YY$$$$$YYYiiYiYYY");
			console.log("      :Y$$rb ````  `_..;;i;YYY$YY$$$$$$$YYYYYYYiYY:");
			console.log("       :$$$$$i;;iiiiidYYYYYYYYYY$$$$$$YYYYYYYiiYYYY.");
			console.log("        `$$$$$$$YYYYYYYYYYYYY$$$$$$YYYYYYYYiiiYYYYYY");
			console.log("        .i!$$$$$$YYYYYYYYY$$$$$$YYY$$YYiiiiiiYYYYYYY");
			console.log("       :YYiii$$$$$$$YYYYYYY$$$$YY$$$$YYiiiiiYYYYYYi' cmang");
			console.log();
		}

		console.log('=> Booting Express');
		console.log('=> Dails', pkg.version, 'application starting in', this.options.environment, 'on', url);
		console.log('=> Run `dails server -h` for more startup options');

		if (cluster.isMaster) {
			console.log('=> Ctrl-C to shutdown server');
		}
	};
});

