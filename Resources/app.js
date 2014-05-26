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


	/*Check in the variable is a number*/
	function IsNumeric(n) {
  		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	Ti.App.addEventListener('isnumeric', IsNumeric);


	//  ========================
	//  = Navigation functions = 
	//  ========================
  
 
 	/* nav_get_POIs: returns a set of POIs contained in a specific place, identified by the ID of a building and a Floor number / label 
  	Parameters:
   		-	data: the structure holding the entire environment
   		-	buildingId: the building ID
   		-	floorNumber: the floor number / label
  	Returns:
   		-	On success, an array containing some POIs.
   		-	On error:
     			A string with value "unknown_building_location_in_array"
     				OR
     			a string with value "unknown_floor_location_in_array"
	*/
  
  function nav_get_POIs(data, buildingId, floorNumber){
	/*Set some variables in a "consistent" state. we haven't searched for anything, so we didn't find anything. If searching fails, we simply return those variables.*/
   
    var arrayBuildingLocation = "unknown_building_location_in_array";
    var arrayFloorLocation = "unknown_floor_location_in_array";

    //Search for specified building Id
    for (var i = 0; i < data.HowManyBuildings; i++) {
      
      //Is this the building we where searching for?
      if (data.Buildings[i].BuildingId == buildingId){
        arrayBuildingLocation = i;
      }
    }
    
    //Let the caller know we can not find the building with the specified ID
    if ( !IsNumeric(arrayBuildingLocation) ) {
      return arrayBuildingLocation;
    }
    
    //Now, search for the Floor. I simply copy/pasted the code pattern for the previous case.
    for (i=0;i<data.Buildings[arrayBuildingLocation].HowManyFloors; i++){
      
      //Is this the floor we where looking for?
      if (data.Buildings[arrayBuildingLocation].Floors[i].FloorNumber == floorNumber){
        arrayFloorLocation=i;
      }
    }
    
    //Let the caller know we can not find the Building with the specified ID
    if ( !IsNumeric(arrayFloorLocation) ) {
      return arrayFloorLocation;
    }
    
    return data.Buildings[arrayBuildingLocation].Floors[arrayFloorLocation].POIs;
  }
  Ti.App.addEventListener('navgetpois', nav_get_POIs);
  
  
  /*Function poi_lookup_id: scans the vector of POIs and returns the ID of the POI object associated with the given POI code.
  		Assumption: any POI has a specific ID and POI Code.
 		Parameters:
   		-	POIs: the POIs vector containing Points Of Interest
   		-	poi_code: code of the POI we're searching for
  		Returns:
   		-	On success, the corrisponding POI object ID is returned.
   		-	On failure, if the "none" code is given for the searched POI or a NULL argument is passed as POI code, "-1" is returned.

   */
  
  function poi_lookup_id(POIs, poi_code) {  //The resultant POI: now it's "-1" and will remain "-1" if we can't find a POI with the given code.
    var searched_POI_ID = -1;
    
    //NULL argument?
    if ((poi_code == null) || (poi_code == "none")) {
      return searched_POI_ID;
    }
    
    var actual_POI;
    
    for(i = 0; i < POIs.length; i++) {
    	actual_POI = POIs[i];
    	if (actual_POI['Code'] == poi_code) {
    		searched_POI_ID = actual_POI['ID'];
    		break;
    	}
    }
    
    return searched_POI_ID;
  }
  Ti.App.addEventListener('poilookupid', poi_lookup_id);

  
  
  /*
   
  Function nav_selectid: returns a POI ID based on the specified criteria
  Parameters:
  	-	id: the ID of a Point Of Interest
   	-	criteria: can be "major" (returns the greater id) or minor (returns the smaller one instead).
  Returns the greater or smaller ID, depending on criteria.
  Notes:
   	-	An ID should be greater than 0 to be valid. If an invalid ID is passed to this function, then the other valid one is passed.
   	-	If both arguments are invalid, -3 is returned.
  */
  
  function nav_select_id(poi_id_first, poi_id_second, criteria){
    var result = -3;

    //If one of those argument is an invalid ID, return the other
    if (poi_id_first < 0)
      return poi_id_second;
    if (poi_id_second < 0)
      return poi_id_first;
    
    if (poi_id_first > poi_id_second) {
      if (criteria == "major") {
        result=poi_id_first;
      }
      else
      {
        result=poi_id_second;
      }
    }
    else {
      if (criteria == "minor") {
        result=poi_id_first;
      }
      else {
        result=poi_id_second;
      }
    }
    return result;
  }
  Ti.App.addEventListener('navselectid', nav_select_id);  

  /*
  Function nav_reach: takes you from a starting POI to and destination one
  Parameters:
  	-	POIs: vector containing Points Of Interest
    -	start_poi_code: code of the POI where you are now
   	-	dest_poi_code: your destination POI's code
  Returns:
  	-	On success, an array containing the sequence of POI Objects you should pass within to reach your destination with the shortest pass count.
   	-	On failure, "failure" is returned.
   	-	If "start" and "dest" POIs are the same, "nothingtodo" is returned.
  */ 
   
  function nav_reach(POIs, start_poi_code, dest_poi_code){
    //Useful variables:
    var walk_poi_id = "unknown";         //the POI id where we are now
    var dest_poi_id  = "unknown";        //our destination id
    var navpath = [] ;            		 //path to reach your destination
    var direction="unknown";
    var pdistance = null;                //only for printing, pass distance
    var j = 0;
    
    //Fail if start and dest POIs are the same, or have the same code
    if (start_poi_code == dest_poi_code){
      return "nothingtodo";
    }
    
    //Check if the starting POI exists, and move there
    walk_poi_id = poi_lookup_id(POIs, start_poi_code);
    if (walk_poi_id == -1) {
      return "fail";
    }
    else if (walk_poi_id == 0) {
    	navpath[j] = walk_poi_id;
    	j++;
    	walk_poi_id = 1;
    }
    
    Ti.API.info('341 startingpoi: ' + walk_poi_id);
    navpath[j] = walk_poi_id;
    j++;
    
    //Does destination POI exist?
    dest_poi_id = poi_lookup_id(POIs, dest_poi_code);
    if (dest_poi_id == -1){
      return "fail";
    }
    
    var diff = dest_poi_id - walk_poi_id;
    var absdiff = Math.abs(diff);
    Ti.API.info('absdiff: ' + absdiff);
    
    if(absdiff < POIs.length/2) {
   	if (dest_poi_id-walk_poi_id > 0){
          direction=["ascending", "major"];
        }
        else
        {
          direction=["descending", "minor"];
        }
      }
      else
      {
        if ((dest_poi_id-walk_poi_id) > 0) {
          direction = ["descending", "minor"];
        }
        else
        {
          direction=["ascending", "major"];
        }
      }
      Ti.API.info('direction: ' + direction[0] + ' ' + direction[1]);

    
    //Search our destination:
    while (walk_poi_id != dest_poi_id){
      
      //Chek around us
      var templeft = poi_lookup_id(POIs, POIs[walk_poi_id].POILeft);
      if (templeft == dest_poi_id) {
        navpath[j] = templeft;
        Ti.API.info('destinazione a sinistra ' + navpath[j]);
        j++;
        break;
      }
      var tempright = poi_lookup_id(POIs, POIs[walk_poi_id].POIRight);
      if (tempright == dest_poi_id) {
        navpath[j] = tempright;
        Ti.API.info('destinazione a destra ' + navpath[j]);
        j++;
        break;
      }
      var tempforward = poi_lookup_id(POIs, POIs[walk_poi_id].POIForward);
      if (tempforward == dest_poi_id) {
        navpath[j] = tempforward;
        Ti.API.info('destinazione avanti ' + navpath[j]);
        j++;
        break;
      }
      var tempbehind = poi_lookup_id(POIs, POIs[walk_poi_id].POIBehind);
      if (tempbehind == dest_poi_id) {
        navpath[j] = tempbehind;
        Ti.API.info('destinazione dietro ' + navpath[j]);
        j++;
        break;
      }
      
      if (direction[0] == "ascending") {
        Ti.API.info('going forward');
        // walk_poi_id = (walk_poi_id+1)%POIs.length+1;
        walk_poi_id = (walk_poi_id+1)%POIs.length;
      }
      else {
        Ti.API.info('going backwards');
        walk_poi_id = (walk_poi_id-1)%POIs.length;
      }
      
      Ti.API.info('420 mi muovo verso : ' + walk_poi_id);
          
      //The minus sign seems not removed by % operator, so we should handle them
      if (walk_poi_id < 0) {
      	walk_poi_id += POIs.length;
      	Ti.API.info('riparto dalla fine: ' + walk_poi_id);
      	navpath[j] = walk_poi_id;
      	j++;
      }
      else{
      	if(direction[0] == "ascending"){
      		walk_poi_id += -1;
      	}
      	else{
      		walk_poi_id += 1;
      	}
      }
      
      //Move on the next place
      walk_poi_id = nav_select_id(walk_poi_id, poi_lookup_id(POIs, POIs[walk_poi_id].POILeft), direction[1]);
      Ti.API.info('move to its left or stay in: ' + walk_poi_id);
      
      //Until we have arrived to the destination
      if (walk_poi_id != dest_poi_id) {
        walk_poi_id = nav_select_id(walk_poi_id, poi_lookup_id(POIs, POIs[walk_poi_id].POIRight), direction[1]);
        Ti.API.info('move to its right or stay in: ' + walk_poi_id);
      }
 

      if(walk_poi_id != 0 || (walk_poi_id == 0 && walk_poi_id == dest_poi_id)) { //avoid passage through entrance
      	navpath[j] = walk_poi_id;
      	Ti.API.info('451 right vs left is closest: ' + navpath[j]);
      	j++;  	
      }
     
  
      
      
      
    } //while
      
      // //Move on the next place
//      	
      // if (walk_poi_id != dest_poi_id) {
      	// Ti.API.info('walk 424: ' + walk_poi_id);
      	// var walktemp = nav_select_id(walk_poi_id, poi_lookup_id(POIs, POIs[walk_poi_id].POILeft), direction[1]); //???
      	// Ti.API.info('walk vs poileft: ' + walktemp);
        // walktemp = nav_select_id(walktemp, poi_lookup_id(POIs, POIs[walk_poi_id].POIRight), direction[1]);
        // Ti.API.info('walk vs poiright: ' + walktemp);
        // walktemp = nav_select_id(walktemp, poi_lookup_id(POIs, POIs[walk_poi_id].POIBehind), direction[1]);
        // Ti.API.info('walk vs poibehind: ' + walktemp);
        // walk_poi_id = nav_select_id(walktemp, poi_lookup_id(POIs, POIs[walk_poi_id].POIForward), direction[1]);
        // Ti.API.info('walk vs poiforward: ' + walk_poi_id);
      // }
// 
      // //For now, add this id to the path
      // navpath[j] = walk_poi_id;
      // Ti.API.info('for now add navpath: ' + navpath[j]);
      // j++;
      //
    // } //while

    // navpath[j] = walk_poi_id;
    // Ti.API.info('fuori dal while: ' + navpath[j]);
   
    return navpath;
  }
  Ti.App.addEventListener('navreach', nav_reach);