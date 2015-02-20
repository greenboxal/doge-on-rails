var Promise = require('bluebird');


module.exports = Class.create('Application', function() {
	this.include(ActiveSupport.Callbacks);
	this.include(ActiveSupport.Initializable);

	this.defineMethod('initialize', function(basedir) {
		this.routes = new ActionDispatch.Router(this);
		this.middlewares = [];
	});

	this.defineMethod('load', function() {
		return Promise.bind(this)
		.then(function() {
			return this.runInitializers();
		})
		.then(function() {
			return this.loadControllers();
		})
		.then(function() {
			return this.loadRoutes();
		});
	});

	this.defineMethod('callback', function() {
		return function(req, res, next) {
			this.routes.handle(req, res, next);
		}.bind(this);
	});
});

