var styledb = require('../models/styledb.njs'),
	Document = require('../models/document.njs');

/* -------------------------------------------------------------
Function which formats the JSON data to valid CSS .
The style var accepts a JSON object, and the callback 
returns CSS
------------------------------------------------------------- */
function createCSS(styling, callback) {
	var css = '';
	for (var element in styling) {
		css += '#blocks ' + element + ' {\n';
		for (var key in styling[element]) {
			var name = key.replace(/_/g, '-');
			var value = styling[element][key];

			if (typeof(value) == 'number') {
				value += 'px';
			}
			css += '\t' + name + ': ' + value + ';\n';
		}
		css += '}\n\n';
	}
	callback(css);
}

/* -------------------------------------------------------------
Module functions
------------------------------------------------------------- */

module.exports = {
	edit: function(req, res) {
		Document.findByID(req.params.id, function(err, document, collaborators) {
			if ( ! document) {
				res.redirect('/dashboard');
			} else {				
				res.render('pages/document/document', {
					'pageTitle': 'Doctopus - Beta 002',
					'options': styledb.options,
					'style': styledb.current,
					'blocks': document.blocks
				});
			}
		})
	},
	manage: function(req, res) {
		Document.findByID(req.params.id, function(err, document, collaborators) {
			if (err == 'noDocument'){
				res.redirect('/dashboard');
			}
			else {				
				res.render('pages/document/manage', {
					pageTitle: 'Manage document ' + document.title,
					document: document,
					'collaborators': collaborators
				});
			}
		});
	},
	css: function(req, res) {
		createCSS(styledb.current, function(css) {
			res.set('Content-Type', 'text/css');
			res.send(css);
		});	
	},
	setstyle: function(req, res) {
		var element = req.body.element;
		var name = req.body.name;
		var value = req.body.value;

		if (typeof(styledb.current[element]) === 'undefined') {
			styledb.current[element] = {};
		}
		styledb.current[element][name] = value;

		createCSS(styledb.current, function(css) {
			res.set('Content-Type', 'text/css');
			res.send(css);
		});	
	},

	saveBlock : function (req, res){
		Document.saveBlock(req.body, function(err, document) {
			if (! err) {
				console.log('data has been send to the model');
				//console.log(document);
				res.send('succes');
			}
			else {
				console.log('error');
				res.send('error');
			}
		});
	}
}