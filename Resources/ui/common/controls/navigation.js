function navigation() {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: "Navigation"
	});
	
	/*Check in the variable is a number*/
	function IsNumeric(n) {
  		return !isNaN(parseFloat(n)) && isFinite(n);
	}
  
 	Ti.App.fireEvent('getdata'); //calls getdata function from app.js
	var navdata = getdata();	//navdata hold the entire json object
	var readnavdata = navdata.read();
	var json = JSON.parse(readnavdata);
	
  Ti.API.info('json: ' + json);
  Ti.API.info('navdata: ' + navdata);
 
 /* nav_get_POIs: returns a set of POIs contained in a specific place, 
  identified by the ID of a building and a Floor number / label 
  Parameters:
   $data: the structure holding the entire environment
   $buildingId: the building ID
   $floorNumber: the floor number / label
  Returns:
   On success, an array containing some POIs.
   On error:
     - A string with value "unknown_building_location_in_array"
     OR
     - a string with value "unknown_floor_location_in_array"*/
  
  function nav_get_POIs(data, buildingId, floorNumber){
	/*Set some variables in a "consistent" state. we haven't searched for 
   	anything, so we didn't find anything. If searching failes, we simply 
   	return those variables.*/
   
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
    
    //Now, search for the Floor. I simply copy/pasted the code pattern for the 
    //previous case.
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
  

  var pippo = nav_get_POIs(json, 1, -1);
  Ti.API.info("pippo: " + pippo);
  
  /* Function poi_lookup_id: scans the vector of POIs and returns the ID of the
  POI object associated with the given POI code.
  Parameters:
   POIs: the POIs vector containing Points Of Interest
   poi_code: code of the POI we're searching for
  Returns:
   On success, the corrisponding POI object ID is returned.
   On failure, if the "none" code is given for the searched POI or a NULL 
   argument is passed as POI code, "-1" is returned.
  Assumption:
   Any POI has a specific ID and POI Code.*/
  

  
  function poi_lookup_id(POIs, poi_code) {
    //The resultant POI: now it's "-1" and will remain "-1" if we
    //can't find a POI with the given code.
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
  
  var pluto = poi_lookup_id(pippo, "0101");
  Ti.API.info('pluto: '+ pluto);
  
  
  /*Function nav_selectid: returns a POI ID based on the specified criteria
  Params:
   id: the ID of a Point Of Interest
   criteria: can be "major" (returns the greater id) or minor (returns the 
   smaller one instead).
  Returns:
   Returns the greater or smaller ID, depending on criteria.
  Notes:
   An ID should be greater than 0 to be valid. If an invalid ID is passed to 
   this function, then the other valid one is passed.
   If both arguments are invalid, -3 is returned.*/
  
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
  
  var topolino = nav_select_id(5, 7, "minor");
  Ti.API.info('topolino: ' + topolino);
  

  /*Function nav_reach: takes you from a starting POI to and destination one
  Parameters:
   POIs: vector containing Points Of Interest
   start_poi_code: code of the POI where you are now
   dest_poi_code: your destination POI's code
  Returns:
   On success, an array containing the sequence of POI Objects you should 
   pass within to reach your destination with the shortest pass count.
   On failure, "failure" is returned.
   If "start" and "dest" POIs are the same, "nothingtodo" is returned.*/
   
   
  function nav_reach(POIs, start_poi_code, dest_poi_code){
    //Useful variables:
    var walk_poi_id = "unknown";         //the POI id where we are now
    var dest_poi_id  = "unknown";        //our destination id
    var navpath = {} ;            		 //path to reach your destination
    var direction="unknown";
    var pdistance = null;                //only for printing, pass distance

    Ti.API.info('183: ' + walk_poi_id);
    
    //Fail if start and dest POIs are the same, or have the same code
    if (start_poi_code == dest_poi_code){
      return "nothingtodo";
    }
    
    //Check if the starting POI exists, and move there
    walk_poi_id = poi_lookup_id(POIs, start_poi_code);
    if (walk_poi_id == -1) {
      return "fail";
    }
    
    Ti.API.info('196: ' + walk_poi_id);
    
    //Does destination POI exist?
    dest_poi_id = poi_lookup_id(POIs, dest_poi_code);
    if (dest_poi_id == -1){
      return "fail";
    }
    
    //Search our destination:
    while (walk_poi_id != dest_poi_id){
      
      if ((dest_poi_id-walk_poi_id) < (walk_poi_id+POIs.length-dest_poi_id)){
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
      
      if (direction[0] == "ascending") {
        Ti.API.info('going forward');
        walk_poi_id = (walk_poi_id+1)%POIs.length+1;
      }
      else {
        Ti.API.info('going backwards');
        walk_poi_id = (walk_poi_id-1)%POIs.length;
      }
      
      Ti.API.info('236: ' + walk_poi_id);
          
      //The minus sign seems not removed by % operator, so we should handle them
      if (walk_poi_id < 0)
        walk_poi_id += POIs.length;
        
        var pdsistance;
        var navpath = {};
      
      Ti.API.info('245: ' + walk_poi_id);
      
      //Chek around us
      var templeft = poi_lookup_id(POIs, POIs[walk_poi_id].POILeft);
      if (templeft == dest_poi_id) {
        pdistance='POILeftDistance';
        navpath = templeft;
        break;
      }
      var tempright = poi_lookup_id(POIs, POIs[walk_poi_id].POIRight);
      if (tempright == dest_poi_id) {
        pdistance='POIRightDistance';
        navpath = tempright;
        break;
      }
      var tempforward = poi_lookup_id(POIs, POIs[walk_poi_id].POIForward);
      if (tempforward == dest_poi_id) {
        pdistance='POIForwardDistance';
        navpath = tempforward;
        break;
      }
      var tempbehind = poi_lookup_id(POIs, POIs[walk_poi_id].POIBehind);
      if (tempbehind == dest_poi_id) {
        pdistance='POIBehindDistance';
        navpath = tempbehind;
        break;
      }
      
      //Move on the next place
      walk_poi_id = nav_select_id(walk_poi_id, poi_lookup_id(POIs, POIs[walk_poi_id].POILeft), direction[1]);
      
      //If we arrived at the destination, stop
      if (walk_poi_id != dest_poi_id) {
        pdistance='POIRightDistance';
        walk_poi_id = nav_select_id(walk_poi_id, poi_lookup_id(POIs, POIs[walk_poi_id].POIRight), direction[1]);
      }
      else {
        pdistance='POILeftDistance';
      }

      //For now, add this id to the path
      $navpath = walk_poi_id;
    }

    navpath = walk_poi_id;
    Ti.API.info('Name: ' + POIs[walk_poi_id].Name + ' ID: ' + walk_poi_id);
    Ti.API.info('Next POI reached: ' + POIs[dest_poi_id].Name);

    return navpath;
  }
  
  var arr = nav_reach(pippo,"0101", "0102");
  Ti.API.info('ARRIVO: ' + arr);
  for(var k = 0; k < arr.length; k++) {
  	Ti.API.info('ARR[' + k + '] = ' + arr[k]);
  }

	return win;
};

module.exports = navigation;

