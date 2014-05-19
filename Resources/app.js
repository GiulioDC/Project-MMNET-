// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	var Window;
	
	Window = require('ui/handheld/ios/ApplicationWindow');
	
	

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	
	var theTabGroup = new ApplicationTabGroup();
	if (osname === 'iphone' || osname === 'ipad') {
		theTabGroup.open({transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
	}
	else{
		theTabGroup.open();
	}
	
		
})();

	var url = "http://www.gstorm.eu/dc.txt";
	
	//return an array of objects according to key, value, or key and value matching
	function getObjects(obj, key, val) {
    	var objects = [];
    	for (var i in obj) {
       		if (!obj.hasOwnProperty(i)) continue;
        	if (typeof obj[i] == 'object') {
            	objects = objects.concat(getObjects(obj[i], key, val));    
        	} //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        	else if (i == key && obj[i] == val || i == key && val == '') { //
            	objects.push(obj);
        	}
        	else if (obj[i] == val && key == ''){ //only add if the object is not already in the array
            	if (objects.lastIndexOf(obj) == -1){
                	objects.push(obj);
            	}
        	}
    	}
    	return objects;
	}
	Ti.App.addEventListener('getobjects', getObjects);
 
	//return an array of values that match on a certain key
	function getValues(obj, key) {
    	var objects = [];
    	for (var i in obj) {
        	if (!obj.hasOwnProperty(i)) continue;
       		if (typeof obj[i] == 'object') {
            	objects = objects.concat(getValues(obj[i], key));
        	}
        	else if (i == key) {
            	objects.push(obj[i]);
        	}
    	}
    	return objects;
	}
	Ti.App.addEventListener('getvalues', getValues);
 
	//return an array of keys that match on a certain value
	function getKeys(obj, val) {
    	var objects = [];
    	for (var i in obj) {
        	if (!obj.hasOwnProperty(i)) continue;
       		if (typeof obj[i] == 'object') {
            	objects = objects.concat(getKeys(obj[i], val));
        	} 
        	else if (obj[i] == val) {
            	objects.push(i);
       		}
    	}
    	return objects;
	}
	Ti.App.addEventListener('getkeys', getKeys);
		
	function getdata(){
	
		var filename = "data.txt"; // Set the filename
		var xhr = Titanium.Network.createHTTPClient(); // Start the connection
	
		xhr.open("GET",url); 	// Open the connection to the API
	
		// If all works fine
		xhr.onload = function() {
			
			var output = JSON.parse(this.responseText);
			var timestamp_json = output.unix; 		// Set the latest timestamp
			var count_json = output.count; // Set the amount of posts returned
			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename); // Get cache file
		
			// If the cache file exists
			if (file.exists()) {
		
				var timestamp_file = file.createTimestamp().getTime() / 1000.0; // Set file timestamp in the correct unix format
				var file_content = file.read(); // Get the content of the file
				var file_parse = JSON.parse(file_content); // Parse the content
			
				// Get the item count with a loop
				for (var file_count = 0; file_count < file_parse.length; file_count++) { };

				// If the file is newer than the JSON object and that the item count is the same
				if (timestamp_file > timestamp_json && file_count == count_json) {
			
					Titanium.API.info("The file is already up to date"); // Log the call if the JSON object is newer than the file	
				}
				else {
					var data = Titanium.Network.createHTTPClient();// Start the connection
				
					data.open("GET",url); // Open the connection to the API
				
					// If all works fine
					data.onload = function() {
				
						// Log to console
						// Titanium.API.info('Loaded! Status: ' + this.status);
    					// Titanium.API.info('Response Header: ' + this.getResponseHeader('Content-Type'));
    					// Titanium.API.info('Response Text: ' + this.responseText);
    	
						file.write(this.responseText); // Fill the content of that file		
						};
					data.send(); // Make the API request

					Titanium.API.info("Update the file with new data"); // Log the call
 				}
			} 
			else { // If the cache file does not exist create the file		
		
				var create_file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
				var create = Titanium.Network.createHTTPClient(); // Start the connection
	
				create.open("GET",url); // Open the connection to the API
				
				create.onload = function() { // If all works fine
			
					// Log to console
					Titanium.API.info('Loaded! Status: ' + this.status);
    				// Titanium.API.info('Response Header: ' + this.getResponseHeader('Content-Type'));
    				// Titanium.API.info('Response Text: ' + this.responseText);
	
					create_file.write(this.responseText); // Fill the content of that file
				};
			
				create.send(); // Make the API request
				Titanium.API.info("Create the file and fill it with data");	// Log the call	
			}
		};
	
		xhr.send(); // Make the API request
	
	return Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename); // Return the file content
	
	
	};
	Ti.App.addEventListener('getdata', getdata);
	
