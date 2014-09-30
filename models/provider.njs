module.exports = {
	load: function(modelName) {
		return model = require('./'+modelName+'.njs');
	}
}