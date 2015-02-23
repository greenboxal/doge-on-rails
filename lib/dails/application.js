var Dails = require('./index');

module.exports = Class.create(function Application() {
	////////// Metaclass
	defmeta = function() {
		this.define(inherited);

		function inherited(klass) {
			$super();

			Dails.applicationClass = klass;
		};
	};


	////////// Methods Declaration
	this.define(initialize);
	this.define(boot);

	////////// Methods Definition
	function initialize() {
		$super();
	};

	function boot() {
		this.runInitializers();
	};
});

