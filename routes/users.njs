var Gravatar = require('gravatar'),
	Provider = require('../models/provider.njs'),
	User = Provider.load('user'),
	Document = Provider.load('document');

module.exports = {
	register: function(req, res) {
		User.getInfo(req.cookies.authtoken, function(err, user) {

			if (user) res.redirect('/dashboard');

			res.render('pages/user/register', {
				pageTitle: 'User registration',
				session: req.session
			});
		});
	},
	login: function(req, res) {
		User.getInfo(req.cookies.authtoken, function(err, user) {
			if (user) res.redirect('/dashboard');

			if (typeof(req.body.email) != 'undefined') {
				User.auth(req.body, function(err, authtoken) {
					if (! err) {
						// Set the authentication cookie with the token (1000 * 3600 * 24 * 90 milliseconds = 30 days)
						res.cookie('authtoken', authtoken, {maxAge: 1000 * 3600 * 24 * 30});
						res.redirect('/dashboard');
					}
					else {
						res.send(err);
					}
				});
			}
			else {
				res.render('pages/user/login', {
					pageTitle: 'Login'
				})
			}
			
		});

	},
	logout: function(req, res) {
		User.logout(req.cookies.authtoken, function() {
			res.clearCookie('authtoken');
			res.redirect('/');
		});
	},
	create: function(req, res) {
		User.save(req.body, function(err) {
			if (! err){
				res.redirect('/login');
			} else {				
				console.log(err);
				res.render('pages/user/register', {
					pageTitle: 'User Registration'
				});
			}
		});
	},
	dashboard: function(req, res) {
		User.getInfo(req.cookies.authtoken, function(err, user) {
			if ( ! user) res.redirect('/login');
			Document.findByOwner(user, function(err, documents) {
				Document.findByCollaborator(user.id, function(err, shared) {					
					var avatarUrl = Gravatar.url(user.email, {s: '230', r: 'x', d: '404'});
					res.render('pages/user/dashboard', {
						avatar:				avatarUrl,				
						pageTitle: 			'Dashboard',
						user:				user,
						documents:			documents,
						sharedDocuments:	shared
					});
				});
			});
		});
	}
}