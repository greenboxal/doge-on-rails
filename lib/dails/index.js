require('./bootstrap');
require('./active-support');
require('./active-support/dependencies/autoload');
require('./active-support/core-ext/module/delegation');

defmod = function Dails() {
	defmeta = function() {
		this.delegate(['initializeApplication', 'initialized'], 'application');


	};
};

