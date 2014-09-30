// // file system and easyimage resize
var fs 			= require('fs');
var easyimg 	= require('easyimage');

/* -------------------------------------------------------------
Module functions
------------------------------------------------------------- */

module.exports = {
	upload: function(req, res) {

	//console.log(req)
   	//settings
    var id  		= 1;
	var ext 		= req.files.file.name.split('.').pop();
	var type		= req.files.file.type;
	var new_name 	= Math.random().toString(36).substring(7);
	var max_width 	= 800;
	var max_height 	= 600;
	var max_size    = 5000000; // in bits, its 2mb
	var upload_dir  = "/../public/uploads/";
	var resize = false;
	var final_name = id + "_" + new_name + "."+ext;
	var newPath = __dirname + upload_dir + id + "_" + new_name + "."+ext;

	// write the new file
	fs.readFile(req.files.file.path, function (err, data) {

	  fs.writeFile(newPath, data, function (err) {

		easyimg.info(req.files.file.path, function(err, img_info, img_err) {
				
			// if there are any errors return them
			if (err) throw err;
			console.log(img_info);

			//check file size again	
			if(img_info.size > max_size){
				console.log('file is too large '+ img_info.size +'');
				resize = false;
			}

			// check max width
			if(img_info.width > max_width){
				console.log('width '+img_info.width+' is too high');
				resize = true;
			}

			// check max height
			if(img_info.height > max_height){
				console.log('height '+img_info.height+' is too high');
				resize = true;
			}

			if(resize == true){
				newPath = __dirname + upload_dir + id + "_" + new_name + "."+ext;

				easyimg.resize({src:req.files.file.path, dst:newPath, width:800, height:600}, function(err, stdout, stderr) {
					console.log('Resized to 800x600');
				});
			}

		});

		res.send(final_name);
	    //console.log(' '+newPath+' has been uploaded');
	  });
	});
	}
}