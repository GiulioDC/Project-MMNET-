function parseresult() {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white'
	});
	
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
						Titanium.API.info('Loaded! Status: ' + this.status);
    					Titanium.API.info('Response Header: ' + this.getResponseHeader('Content-Type'));
    					Titanium.API.info('Response Text: ' + this.responseText);
    	
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
    				Titanium.API.info('Response Header: ' + this.getResponseHeader('Content-Type'));
    				Titanium.API.info('Response Text: ' + this.responseText);
	
					create_file.write(this.responseText); // Fill the content of that file
				};
			
				create.send(); // Make the API request
				Titanium.API.info("Create the file and fill it with data");	// Log the call	
			}
		};
	
		xhr.send(); // Make the API request
	
	return Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename); // Return the file content
	};
	
	var tabledata = [];
	var tableview = Titanium.UI.createTableView({
		data:tabledata,
		//search:search,
		//searchHidden:true,
		//filterAttribute:'Name',
		top:50
	});
		
		
	var search = Titanium.UI.createSearchBar({
		barColor:'#dddddd',
		showCancel:true,
		height:43,
		top:0
	});
	
	
	win.add(search);
	
	win.addEventListener('open', function() { //This can't happen until the window is opened. Otherwise properties attached to the window wont exist yet.
		search.value = win.searchinput();
	});
	
	// SEARCH BAR EVENTS
	search.addEventListener('return', function(e) {
		
		Ti.API.info('Search Bar'+ e.value);
		search.blur();

		var json, i, j, k, row, NameLabel, floornumLabel;
		var DataType, EngineVersion, HowManyBuildings, Builndings, BuildingName, HowManyFloors, Floors, FloorName, FloorNumber;
		var HowManyPois, POIs, Code, POIName, POIDescription, POILocation, POILeft, POIRight, POIBehind, POIForward, poicode;
		var temp = getdata();	
		var readText = temp.read();
	
		//var poisearched = e.value.substring(1);
		var poisearched = e.value.replace(/\s+/g, '');
		json = JSON.parse(readText);
		
		var ritorna = getObjects(json, 'Code', poisearched);
		Ti.API.info('ritorna: ' + ritorna[0].Name); 
		
		row = Ti.UI.createTableViewRow({
	       	height:'60dp'
	    });
	    NameLabel = Ti.UI.createLabel({
	        text:'Name: ' + ritorna[0].Name,
	        font:{
	            fontSize:'24dp',
		    	fontWeight:'bold'
			},
			color:'#000',
			touchEnabled:false
	    });

	    row.add(NameLabel);
	    tabledata.push(row);
		
		// for (i = 0; i < json.HowManyBuildings; i++) {
	    	// var building = json.Buildings[i];
// 
	    	// for (j = 0; j<json.Buildings[i].HowManyFloors; j++) {
	    		// var floor = json.Buildings[i].Floors[j];
// 	    	
	      		// for (k = 0; k<json.Buildings[i].Floors[j].HowManyPOIs;k++) {
	        		// var POI = json.Buildings[i].Floors[j].POIs[k];
	        		// Ti.API.info('poisearched: ' + poisearched);
	        		// var poicode = POI.Code;
	        		// Ti.API.info("POI.Code: " + POI.Code);
// 	        	
	        		// if(POI.Code == search.value){
// 
	        				// row = Ti.UI.createTableViewRow({
	       						// height:'60dp'
	     					// });
	     					// Ti.API.info('POI.Code DOPO: ' + poicode);
	          				// NameLabel = Ti.UI.createLabel({
	        					// text:'Number: ' + poicode,
	        					// font:{
	            					// fontSize:'24dp',
		    						// fontWeight:'bold'
								// },
								// color:'#000',
								// touchEnabled:false
	    					// });
// 
	    					// row.add(NameLabel);
	    					// tabledata.push(row);
	        			// } //chiude if di uguaglianza valori
					// } //chiude ciclo k
				// } //chiude ciclo j
// 	
				tableview.setData(tabledata);
				win.add(tableview);
// // 	
			// } //chiude ciclo i
	
		});	//searchbar event
		
	

	return win;
};

module.exports = parseresult;

