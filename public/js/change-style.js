function updateStyle(element, name, value) {
	// Set the data
	var data = {
		'element': element,
		'name': name,
		'value': value
	};
	// Save the data to the database
	jQuery.ajax({
		type: 'POST',
		url: '/setstyle',
		data: data
	}).done(function(css) {
		jQuery('#styling').html(css);
	});	
}

jQuery.fn.setPx = function(minSize, maxSize) {
	// Set the default values
	minSize = minSize || 8;
	maxSize = maxSize || 64;

	jQuery.fn.updatePx = function() {
		// Get the name of the field
		var name = jQuery(this).attr('name');

		// Get the element on which the style should be applied
		var element = jQuery(this).attr('data-element');

		// Get the value and strip all but numbers
		var val = jQuery(this).val().replace(/\D/g, '');

		// Limit the max size
		if (val.length > 0) {
			val = (val > maxSize ? maxSize : val);
			val = (val < minSize ? minSize : val);
		}

		// Set the value
		jQuery(this).val(val);

		// Apply the styling & update the database
		updateStyle(element, name, val + 'px');
	}

	$(this).each(function() {
		jQuery(this).updatePx();
	});

	// Update the field on focus out
	jQuery(this).on('blur', function() {
		jQuery(this).updatePx();
	});
	// Update the field on enter
	jQuery(this).on('keyup', function(e) {
		if (e.keyCode == 13) {
			jQuery(this).updatePx();
		}
	});
}

jQuery.fn.setText = function(prefix, suffix) {
	// Set the default values
	prefix = prefix || '';
	suffix = suffix || '';

	jQuery.fn.updateText = function() {
		// Get the name of the field
		var name = jQuery(this).attr('name');

		// Get the element on which the style should be applied
		var element = jQuery(this).attr('data-element');

		// Get the value and strip all but numbers
		var val = jQuery(this).val();

		// Set the value
		jQuery(this).val(val);

		// Apply the styling & update the database
		updateStyle(element, name, prefix + val + suffix);
	}

	jQuery(this).on('change', function() {
		jQuery(this).updateText();
	});

	jQuery(this).on('keyup', function(e) {
		if (e.keyCode == 13) jQuery(this).updateText();
	});
	jQuery(this).on('blur', function() {
		jQuery(this).updateText();
	});
}

jQuery.fn.selectVal = function() {
	jQuery(this).on('change', function() {
		var element = jQuery(this).attr('data-element');
		var name = jQuery(this).attr('name');
		var val = jQuery(this).val();
		
		// Apply the styling & update the database
		updateStyle(element, name, val);
	});
}

jQuery(document).ready(function() {
	jQuery('select').selectVal();
	jQuery('.setpx').setPx();
	jQuery('.colorpicker').setText('#');
});