function download(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#dddddd'
	});

var url = "http://www.gstorm.eu/dc.txt";

var tabledata = [];
var tableview = Titanium.UI.createTableView({
		data:tabledata
	});
	
var DataManager = {
    send: function(toWhere, data, callback, context)
    {
        // Fail
            if (!toWhere) {
            return false;
        }
        
        // Defaults
        data     = data     || {}; // The data to send to the server
        callback = callback || function(_r) { return _r; }; // The callback. If none is supplied, will just return the result
        context  = context  || null; // The object that 'this' will refer to in the callback
        
        if (Ti.Network.online) {
            var XHR = Ti.Network.createHTTPClient({
                onload: function() {
                    var result = JSON.parse(this.responseText);
                    return callback.apply(context, [result]);
                },
                onerror: function() {
                    var result = JSON.parse(this.responseText);
                    alert('There was an error with the connection. Please try again later.');
                
                    return result;
                }
            });
        
            XHR.setTimeout(15000); // 15s is my timeout. Use your own here
            
            XHR.open('POST', url + toWhere, false);
            XHR.send(data);
        } else {
            // Handle offline here
            alert('You are offline');
        }
    }
};
//Using this object in the global scope, you can just type:
//DataManager.send('user/new', { myVar: 'some value' }, this.processXHR(), this);
	
function getdata(){

	// Set the filename
	
	var filename = "data.txt";
	
	// Start the connection

	var xhr = Titanium.Network.createHTTPClient();
	
	// Open the connection to the API

	xhr.open("GET",url);
	
	// If all works fine

	xhr.onload = function(){
	
		// Set the latest timestamp
		
		var output = JSON.parse(this.responseText);
		
		// Set the latest timestamp
		
		var timestamp_json = output.unix;
		
		// Set the amount of posts returned
		
		var count_json = output.count;
		
		// Get cache file

		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
		
		// If the cache file exists
	
		if (file.exists()) {
			
			// Set file timestamp in the correct unix format
		
			var timestamp_file = file.createTimestamp().getTime() / 1000.0;

                        ///////////// BETWEEN HERE //////////////
			
			// Get the content of the file
			
			var file_content = file.read();
			
			// Parse the content
			
			var file_parse = JSON.parse(file_content);
			
			// Get the item count with a loop
			
			for (var file_count = 0; file_count < file_parse.length; file_count++) { };

                        ///////////// AND HERE //////////////
			
			// If the file is newer than the JSON object and that the item count is the same
		
			if (timestamp_file > timestamp_json && file_count == count_json) {
			
				// Log the call
			
				Titanium.API.info("The file is already up to date");
				
			// If the JSON object is newer than the file
				
			} else {
			
				// Start the connection

				var data = Titanium.Network.createHTTPClient();
	
				// Open the connection to the API

				data.open("GET",url);
				
				// If all works fine

				data.onload = function() {
				
				// Log to console
	
				Titanium.API.info('Loaded! Status: ' + this.status);
    				Titanium.API.info('Response Header: ' + this.getResponseHeader('Content-Type'));
    				Titanium.API.info('Response Text: ' + this.responseText);
    	
 					// Fill the content of that file

					file.write(this.responseText);
				
				};
				
				// Make the API request

				data.send();
				
				// Log the call
			
				Titanium.API.info("Update the file with new data");
				
 			}
 			
 		// If the cache file does not exist
 			
		} else {
			
			// Create the file
		
			var create_file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);

			// Start the connection

			var create = Titanium.Network.createHTTPClient();
	
			// Open the connection to the API

			create.open("GET",url);
				
			// If all works fine

			create.onload = function(){
			
			// Log to console
	
			Titanium.API.info('Loaded! Status: ' + this.status);
    			Titanium.API.info('Response Header: ' + this.getResponseHeader('Content-Type'));
    			Titanium.API.info('Response Text: ' + this.responseText);
    				
 				// Fill the content of that file

				create_file.write(this.responseText);
				
			};
				
			// Make the API request

			create.send();
			
			// Log the call
			
			Titanium.API.info("Create the file and fill it with data");
			
		}
	
	};
	
	// Make the API request

	xhr.send();
	
	// Return the file content
	
	return Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
	
};
	
var json, i, row, nameLabel, nickLabel;
var DataType, EngineVersion, HowManyBuildings, Builndings, BuildingName, HowManyFloors, Floors, FloorName, FloorNumber;
var HowManyPois, POIs, Code, POIName, POIDescription, POILocation, POILeft, POIRight, POIBehind, POIForward;
// 
// var xhr = Ti.Network.createHTTPClient({
    // onload: function() {
	// //Ti.API.debug(this.responseText);
	// // alert(this.responseText);
// 		
getdata();
	
	for (i = 0; i < json.HowManyBuildings; i++) {
	    var building = json.Buildings[i];
	    row = Ti.UI.createTableViewRow({
	        height:'60dp'
	    });
	    nameLabel = Ti.UI.createLabel({
	        text:'Name: ' + building.BuildingName,
	        font:{
	            fontSize:'24dp',
		    	fontWeight:'bold'
			},
		// height:'auto',
		// left:'20dp',
		// top:'20dp',
		color:'#000',
		touchEnabled:false
	    });
	    nickLabel = Ti.UI.createLabel({
		text:'Number of floors: ' + building.HowManyFloors,
		font:{
		    fontSize:'16dp'
		},
		// height:'auto',
		// left:'15dp',
		// bottom:'5dp',
		top: '40dp',
		color:'#000',
		touchEnabled:false
	    });

	    row.add(nameLabel);
	    row.add(nickLabel);
	    tabledata.push(row);
        }
		
	tableview.setData(tabledata);
    // },
    // onerror: function(e) {
	// Ti.API.debug("STATUS: " + this.status);
	// Ti.API.debug("TEXT:   " + this.responseText);
	// Ti.API.debug("ERROR:  " + e.error);
	// alert('There was an error retrieving the remote data. Try again.');
    // },
    // timeout:5000
//});


// xhr.open("GET", url);
// xhr.send();
win.add(tableview);

	return win;
};

module.exports = download;

