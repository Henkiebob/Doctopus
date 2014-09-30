var debug = false;

var docsoc = {
	block: {
		changeSize: function(blockdata) {
			$block = jQuery('div[data-id="' + blockdata.blockId + '"]');	
			//$block = jQuery('.selected-block');
			$block.data('colspan', blockdata.newSize);

			if ($block.hasClass('col-1'))
				$block.switchClass('col-1', 'col-' + blockdata.newSize, 250);
			else if ($block.hasClass('col-2'))
				$block.switchClass('col-2', 'col-' + blockdata.newSize, 250);
			else if ($block.hasClass('col-3'))
				$block.switchClass('col-3', 'col-' + blockdata.newSize, 250);
			else
				$block.switchClass('col-4', 'col-' + blockdata.newSize, 250);
		},
		updateSize: function() {
			var $block = jQuery('.selected-block');
			documentUrl	= window.location.pathname.split('/'),
			documentId 	= documentUrl[3];
			var blockdata = {
				'id': $block.data('id'),
				'oldSize': $block.data('colspan'),
				'documentId': documentId
			}
			socket.emit('block.resize', blockdata);
		},
		changeBlock: function(data) {
			if (data.action == 'add') {				
				var content = [
					'<div data-colspan="1" data-id="' + data.block.id + '" class="col-1 block-' + data.block.type +'" >',
						'<div class="block-actions">',
							'<div class="mainbar-button resize">Resize</div>',
							'<div class="mainbar-button move">Move</div>',
						'</div>',
				].join("\n");
				
				if (data.block.type == 'text') {
					content += '<p class="col-content">'+data.block.content+'</p>';
				}
				else if (data.block.type == 'image') {
					content += '<form action="file-upload" class="dropzone" id="file_dropzone"></form>';
				}
				else if (data.block.type == 'list') {
					content += '<p class="col-content"><ul><li>This is a list</li><li>Another item</li></ul></p>';
				}

				content += '</div>';
				$('#blocks').append(content);

				if (jQuery('.awaiting-server').length > 0 ) {
					jQuery('.awaiting-server').remove();
				}
			}
			else if (data.action == 'edit') {
				
			} 
		},
		listener: function() {
			jQuery('.resize').on('click.resize', function () {
			 	docsoc.block.updateSize();
			});
			if (debug) console.log('Block listener activated.');
		}
	},
	reactivateListeners: function() {
		if (debug) console.log('Disabling all listeners.');
		jQuery('.resize').off('click.resize');
		docsoc.activateListeners();
	},
	activateListeners: function() {
		if (debug) console.log('Activating all listeners.');	
		docsoc.block.listener();
	}
}

jQuery(document).ready(function() {
	docsoc.activateListeners();
	socket.on('block.resize', docsoc.block.changeSize);
	socket.on('block.saved', docsoc.block.changeBlock);
});