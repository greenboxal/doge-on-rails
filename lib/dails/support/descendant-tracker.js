
module.exports = Module.create(function DescendantTracker() {
	var DescendantTracker = this;

	////////// Metaclass
	defmeta = function() {
		////////// Instance Variables
		var directDescendants = new WeakMap();

		////////// Method Declarations
		this.define(storeInherited);
		this.define(getDirectDescendants);
		this.define(getDescendants);
		this.define(accumulateDescendants);

		////////// Method Defintions
		function storeInherited(klass, descendant) {
			if (!directDescendants.has(klass)) {
				directDescendants.set(klass, []);
			}

			directDescendants.get(klass).push(descendant);
		};

		function getDirectDescendants(klass) {
			return directDescendants.get(klass) || [];
		};

		function getDescendants(klass) {
			var arr = [];

			this.accumulateDescendants(klass, arr);

			return arr;
		};

		function accumulateDescendants(klass, arr) {
			var descendants = directDescendants.get(klass);

			if (descendants) {
				arr.push.apply(arr, descendants);

				descendants.forEach(function(descendant) {
					accumulateDescendants(descendant, arr);
				}.bind(this));
			}
		};
	};

	////////// Method Declarations
	this.define(inherited);
	this.defineGetter('directDescendants', getDirectDescendants);
	this.defineGetter('descendants', getDescendants);

	////////// Method Defintions
	function inherited(klass) {
		$super();

		DescendantTracker.storeInherited(this, klass);
	};

	function getDirectDescendants() {
		return DescendantTracker.getDirectDescendants(this);
	};

	function getDescendants() {
		return DescendantTracker.getDescendants(this);
	};
});


