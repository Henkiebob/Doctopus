var Provider = require('../models/provider.njs'),
	User = Provider.load('user');


module.exports = {
	index: function(req, res) {
		User.getInfo(req.cookies.authtoken, function(err, user) {
			res.render('pages/front/index', {'pageTitle': 'Doctopus', 'user': user});
		});
	}
}