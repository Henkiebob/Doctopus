var socket = require('socket.io');

var Document = require('../models/document.njs');


module.exports.listen = function(server) {
	var io = socket.listen(server, {log: false});

	io.sockets.on('connection', function(socket){
		socket.on('document.new', function(data) {
			console.log(data);
			Document.save(data, function(err, document) {
				if (err) {
					console.log(err);
				}
				else {
					var data = [];
					data = {
						state: 'success',
						document: document
					};
					console.log(document._id);
					socket.emit('document.new', data);
				}
			});
		});

		// new collaborator
		socket.on('collaborator.new', function(collaborator) {
			Document.newCollaborator(collaborator, function(err, document, user) {
				if (!err) {
					data = {'document' : document, 'user' : user, 'state' : 'success'};
					socket.emit('collaborator.new', data);
				}
				else {
					data = {'state' : 'error', 'error' : err};
					socket.emit('collaborator.new', data);
				};
			});
		});
		
		// remove collaborator
		socket.on('collaborator.remove', function(params) {
			Document.removeCollaborator(params, function (err) {
				if (!err) {
					data = {'state' : 'success'};
					socket.emit('collaborator.remove', data);
				}
				else {
					data = {'state' : 'error', 'error' : err};
					socket.emit('collaborator.remove', data);
				};
			});
		});
		
		socket.on('document.remove', function(documentId) {
			Document.deleteById(documentId, function(err) {
				if (! err) {
					data = {'state' : 'succes'};
				}
				else {
					data = {'state' : 'error', 'error': err}
				}
				socket.emit('document.remove', data);
			})
		});
		
		// block content saved
		socket.on('block.saved', function(data) {

			Document.saveBlock(data, function(err, block, action) {
				if(!err){
					data = {'block' : block, 'state' : 'succes', 'action' : action };
					socket.emit('block.saved', data);
				}
				else{
					data = {'state' : 'error'};
					socket.emit('block.saved', data);
				}
			});
		});

		//new block added
		socket.on('block.added', function(block) {
			//console.log(block);

			// Document.addBlock(block, function(err, document, user){
			// 	if(!err){
			// 		data = {'block' : document, 'user' : user, 'state' : 'succes'};
			// 		socket.emit('block.added', data);
			// 	}
			// 	else{
			// 		data = {'state' : 'error'};
			// 		socket.emit('block.added', data);
			// 	}
			// }

		});

		//block has been removed
		socket.on('block.removed', function(block) {
			console.log(block);

			// Document.removeBlock(block, function(err, document, user){
			// 	if(!err){
			// 		data = {'block' : document, 'user' : user, 'state' : 'succes'};
			// 		socket.emit('block.removed', data);
			// 	}
			// 	else{
			// 		data = {'state' : 'error'};
			// 		socket.emit('block.removed', data);
			// 	}
			// }
		});

		//new size changed
		socket.on( 'block.resize', function( blockdata ) {
			// blockdata.id blockdata.oldSize blockdata.newSize
			blockdata.newSize = blockdata.oldSize + 1;
			if ( blockdata.newSize > 4 ) blockdata.newSize = 1;

			var block = {
				newSize : blockdata.newSize,
				blockId : blockdata.id
			}

			io.sockets.emit( 'block.resize', block );

		});

		//new size changed
		// socket.on( 'block.resize', function( blockdata ) {
		// 	// blockdata.id blockdata.oldSize blockdata.newSize
		// 	blockdata.newSize = blockdata.oldSize + 1;
		// 	if ( blockdata.newSize > 4 ) blockdata.newSize = 1;

		// 	var block = {
		// 		newSize : blockdata.newSize,
		// 		blockId : blockdata.id,
		// 		documentId : '51c4caf96631639b06000002'
		// 	}
			
		// 	Document.resizeBlock(blockdata, function(err, block, action) {
		// 		if(!err){
		// 			data = {'block' : block, 'state' : 'succes', 'action' : action };
		// 			socket.emit('block.resized', data);
		// 		}
		// 		else{
		// 			data = {'state' : 'error'};
		// 			socket.emit('block.resized', data);
		// 		}
		// 	});

		// });

	});

}

