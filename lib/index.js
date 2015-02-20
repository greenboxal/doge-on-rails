require('./saphire');
require('./active-support');
require('./active-support/dependencies/autoload');
require('./active-support/core-ext/module/delegation');

module.exports = Module.create('Dails', function() {
	this.metaclass.instanceEval(function() {
		this.delegate(['initializeApplication', 'initialized'], 'application');


	});
});

