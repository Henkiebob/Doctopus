var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/doctopus'),
	Validator = require('validator').Validator,
	randomstring = require("randomstring");

var userSchema = new mongoose.Schema({
	email		: {type: String, required : true, index: {unique: true} },
	first		: {type: String },
	last		: {type: String },
	admin		: {type: Number, required : true, default: 0},
	token       : {type: String, required : true},
	authtoken	: {type: String},
	username    : {type: String, required : true}
});

userSchema.plugin(require('basic-auth-mongoose'));
var User = mongoose.model('User', userSchema);

module.exports = {
	findAll: function(callback) {
		User.find(function(err, users) {
			if ( ! err) {
				callback(null, users);
			}
		}).sort({'username' : '-1'});
	},
	
	findByID: function(id, callback) {
		User.findById(id, function (err, user) {
			callback(err, user);
		});
	},
	
	findByUsername: function(username, callback) {
		User.findOne({'username' : { $regex : new RegExp(username, "i") }}, function (err, user) {
			callback(err, user);
		});
	},
	findByEmail: function(email, callback) {
		User.findOne({email: {$regex : new RegExp(email, "i")}} , function (err, user) {
			callback(err, user);
		});
	},
	deleteByUsername: function(username, callback) {
		User.findOne({'username' : { $regex : new RegExp(username, "i") }}, function (err, user){
			if ( ! err ){
				User.remove({'username' : user.username}, function(err){
					if ( ! err) {
						callback(null);
					}
					else {
						callback(err);
					}
				});
			}
			else {
				callback(err);
			}
		});
	},
	update: function(username, params, callback) {
		User.findOne({'username' : { $regex : new RegExp(username, "i") }}, function (err, user) {
			if (! err){
				
				Validator.prototype.error = function (msg) {
				    this._errors.push(msg);
				    return this;
				}
			
				Validator.prototype.getErrors = function () {
				    return this._errors;
				}
			
				var validator = new Validator();
			
				validator.check(params.email).notEmpty(); 
				validator.check(params.first).notEmpty(); 
				validator.check(params.last).notEmpty();
				validator.check(params.email).len(6, 64).isEmail();
				validator.check(params.admin).notEmpty();
				
				user.email = params['email'], 
				user.first = params['first'], 
				user.last = params['last'], 
				user.username = params['username'],
				user.admin = params['admin'];
							
				if (validator.check(params.oldPassword).notEmpty()){
					if (user.authenticate(params.oldPassword)){
						validator.check(params.newPassword).equals(params.confirmNewPassword);
						user.password = params['newPassword'];
					}
				}

				var errors = validator.getErrors();
			
				user.save(function (err) {
					if (! err) {
						callback(null);
					}
					else {
						callback(err);
					}
				});
			}
		});
	},
	save: function(params, callback) {
		Validator.prototype.error = function (msg) {
		    this._errors.push(msg);
		    return this;
		}
	
		Validator.prototype.getErrors = function () {
		    return this._errors;
		}
	
		var validator = new Validator();
	
		validator.check(params.email).notEmpty();
		validator.check(params.password).equals(params.confirmPassword);
		validator.check(params.email).len(6, 64).isEmail(); 
	
		var errors = validator.getErrors();
	
		var token = randomstring.generate();
	
		var user = new User({
			email: params['email'],
			username: params['username'],
			password: params['password'],
			first: params['firstname'],
			last: params['lastname'],
			admin: 1,
			token: token
		});
		
/*		if(errors.length == 0) {
*/			user.save(function (err) {
				callback(err);
			});
	
/*			this.sendRegisterEmail ( params['username'], params['email'], token );
	
		}
	
		else {
			callback(errors);
		}
*/	},
	getInfo: function(authtoken, callback) {
		if (typeof authtoken !== 'undefined') {
			User.findOne({'authtoken': authtoken}, function(err, user) {
				callback(err, user);
			});
		}
		else {
			err = 'authtoken is undefined!';
			callback(err);
		}
	},
	isAdmin: function(username, callback) {
		User.findOne({'username' : username}, function(err, user){
			callback(err, user);
		});
	},
	resetPassword: function(email, callback) {
		
	},
	auth: function(form, callback) {
		var authtoken = null;

		User.findOne({'email' : form.email}, function (err, user) {
			if (err) {
				var error = 'Failed to login';
			}
			else {
				if (user) {					
					if (user.authenticate(form.password)) {
						// Generate an authentication token
						var authtoken = randomstring.generate();

						// Save the authentication token to the database
						user.authtoken = authtoken;
						user.save();

						error = false;
					}
					else {
						var error = 'password does not match, or user not activated';
					}
				}
			}
			callback(error, authtoken);
		});
	},
	logout: function(authtoken, callback) {
		if (typeof authtoken !== 'undefined') {
			User.findOne({'authtoken': authtoken}, function(err, user) {
				if (user) {
					user.authtoken = null;
					user.save();
				}	
			});
		}
		callback();
	}
};

/*
modelFunctions.prototype.resetPassword = function (email, callback){

	User.findOne({'email' : email}, function (err, user) {
		if (err) {
			var error = 'something went wrong';
		} // handle
		else {
				if (user) {
					// random string for email validation
					var randomstring = require("randomstring");
					var new_pw = randomstring.generate();

					found_user.password = new_pw;

					found_user.save(function (err) {
						callback(true);
						this.sendResetEmail (found_user.email, new_pw );
					});

				}
				else {
					var error = 'No user with such e-mail';
				}
		}
		
		callback(error);
	});
}

modelFunctions.prototype.activate = function(token, callback) {

	User.findOne({'token' : token}, function (err, found_user) {
		if (err) {
			var error = 'Something went wrong';
		} // handle
		else {
			if (found_user) {
				found_user.token = 1;

				found_user.save(function (err) {
					callback(true);
				});
			}else{
				var error = "No user with this token";

				callback(error)
			}
		}
		callback(error);
	});
};

// sends e-mail
modelFunctions.prototype.sendRegisterEmail = function(username, user_email, token, callback){

		var activation_link = "<a href=\x22localhost:1337/users/activate/"+token+"\x22>link</a>";

		// e-mail settings
		var email   = require("../..//node_modules/emailjs/email");
		var server  = email.server.connect({
		   user:    "doctopus.nl@gmail.com", 
		   password:"borstenzijncool", 
		   host:    "smtp.gmail.com", 
		   ssl:     true,
		   content : "text/html; charset=utf-8"
		});

		// send the message and get a callback with an error or details of the message that was sent
		server.send({
		   text:    "Thanks "+username+" for using Doctopus! please click this "+activation_link+" to activate your account", 
		   from:    "you <doctopus.nl@gmail.com>", 
		   to:      "<"+user_email+">",
		   subject: "Activation e-mail Doctopus"
		}, function(err, message) { console.log(err || message); });
}


// sends e-mail
modelFunctions.prototype.sendResetEmail = function(user_email, new_pw, callback){

		// e-mail settings
		var email   = require("../..//node_modules/emailjs/email");
		var server  = email.server.connect({
		   user:    "doctopus.nl@gmail.com", 
		   password:"borstenzijncool", 
		   host:    "smtp.gmail.com", 
		   ssl:     true
		});

		// send the message and get a callback with an error or details of the message that was sent
		server.send({
		   text:    "Dear, "+username+" your password has been reset to: "+new_pw+", you can use this to login into your account.", 
		   from:    "you <doctopus.nl@gmail.com>", 
		   to:      "<"+user_email+">",
		   subject: "Password reset e-mail Doctopus"
		}, function(err, message) { console.log(err || message); });
}

*/