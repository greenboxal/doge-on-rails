var ActiveSupport = require('./support');
var Initializable = require('./initializable');

module.exports = Class.create(function Bone() {
	this.include(Initializable);

	////////// Metaclass
	this.openMetaclass(function() {
		this.include(ActiveSupport.DescendantTracker);
		
	});

	////////// Method Declaration
	this.define(initialize);

	////////// Method Defintion
	function initialize() {

	};
});

