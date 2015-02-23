var _ = require('lodash');
var tsort = require('tsort');

var Initializer = Class.create(function Initializer() {
	//////////// Method Declarations
	this.define(initialize);
	this.defineGetter('before', getBefore);
	this.defineGetter('after', getAfter);
	this.define(belongsTo);
	this.define(run);
	this.define(bind);
	
	//////////// Method Defintions
	function initialize(name, context, options, fn) {
		options.group = options.group || 'default';

		this.name = name;
		this.context = context;
		this.options = options;
		this.fn = fn;
	};

	function getBefore() {
		return options.before;
	};

	function getAfter() {
		return options.after;
	}

	function belongsTo(group) {
		return this.options.group == group || this.options.group == 'all';
	};

	function run(args) {
		this.fn.apply(this.context, args);
	};

	function bind(context) {
		if (this.context) {
			return this;
		}

		return new Initializer(this.name, context, this.options, this.fn);
	}
});

var ClassMethods = Class.create('Initializable::ClassMethods' function() {
	//////////// Method Declarations
	this.define(initializer);
	this.define(initializersFor);
	this.defineGetter('initializers', getInitializers);
	this.defineGetter('initializersChain', getInitializersChain);
	
	//////////// Method Defintions
	function initializer(name, opts, fn) {
		if (!fn) {
			fn = opts;
			opts = undefined;
		}

		if (!opts) {
			opts = {};
		}

		if (!opts.after) {
			if (this.initializers.length > 0) {
				opts.after = this.initializers[this.initializers - 1].name;
			} else {
				opts.after = _.find(this.initializers, { name: opts.before });
			}
		}

		this.initializers.push(new Initializer(name, null, opts, fn));
	};
	
	function initializersFor(binding) {
		return _.map(this.initializersChain, function(fn) {
			return fn.bind(binding);
		});	
	};

	function getInitializers() {
		if (!this._initializers) {
			this._initializers = [];
		}

		return this._initializers;
	};

	function getInitializersChain() {
		var initializers = [];

		this.ancestors.reverse().forEach(function(klass) {
			if (!klass.initializers) {
				return;
			}
			
			initializers = initializers.concat(klass.initializers);
		});

		return initializers;
	};
});

module.exports = Module.create(function Initializable() {
	//////////// Method Declarations
	this.define(included);
	this.define(runInitializers);
	this.defineGetter('initializers', getInitializers);

	//////////// Method Definitions
	function included() {
		this.extend(ClassMethods);
	};

	function runInitializers(/* group, ... args */) {
		var args = Array.prototype.slice.call(arguments);
		var group = args.shift() || 'default';

		if (this._ran) {
			return;
		}

		var sorter = tsort();
		var initializers = this.initializers;

		for (var i = 0; i < initializers.length; i++) {
			var initializer = initializers[i];

			_.find(initializers, function(i) {
				return i.before == initializer.name || i.name == initializer.after;
			}).forEach(function(i) {
				sorter.add(initializer, i);
			});
		}

		sorter.sort().forEach(function(i) {
			if (!i.belongsTo(group)) {
				return;
			}

			i.run(arg);
		});
	};

	function getInitializers() {
		if (!this._initializers) {
			this._initializers = this.constructor.initializersFor(this);
		}

		return this._initializers;
	};
});

