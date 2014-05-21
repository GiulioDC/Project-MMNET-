function navigation() {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: "Navigation"
	});
	
	function IsNumeric(n) {
  		return !isNaN(parseFloat(n)) && isFinite(n);
	}
  
  //Function nav_init: initialize navigation engine, loading the json file 
  //describing the environment and returning a big associative array containing 
  //the data
  
 	Ti.App.fireEvent('getdata');
	var temp = getdata();	
	//Ti.API.info('temp: ' + temp);
	var readText = temp.read();
	//Ti.API.info('readText: ' + readText);
 
  //nav_get_POIs: returns a set of POIs contained in a specific place, 
  //identified by the ID of a building and a Floor number / label 
  //Parameters:
  //  $data: the structure holding the entire environment
  //  $buildingId: the building ID
  //  $floorNumber: the floor number / label
  //Returns:
  //  On success, an array containing some POIs.
  //  On error:
  //    - A string with value "unknown_building_location_in_array"
  //    OR
  //    - a string with value "unknown_floor_location_in_array"
  
  function nav_get_POIs(data, buildingId, floorNumber){
    //Set some variables in a "consistent" state. we haven't searched for 
    //anything, so we didn't find anything. If searching failes, we simply 
    //return those variables.
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
      
      //Is this the floor we where searching for?
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
  
  var json = JSON.parse(readText);
  Ti.API.info('json: ' + json);
  var pippo = nav_get_POIs(json, 1, -1);
  Ti.API.info("pippo: " + pippo);
  
  //Function POI_lookup: scans the vector of POIs and returns the POI object 
  //associated with the given POI code.
  //Parameters:
  //  POIs: the POIs vector containing Points Of Interest
  //  poi_code: code of the POI we're searching for
  //Returns:
  //  On success, the corrisponding POI object is returned.
  //  On failure, if the "none" code is given for the searched POI or a NULL 
  //  argument is passed as POI code, NULL is returned.
  //Assumption:
  //  Any POI has a different code from another.
  
  function POI_lookup(POIs, poi_code) {
    //The resultant POI: now it's NULL and will remain NULL if we can't find a 
    //POI corresponding to this one
    
    // var searched_POI=null;
    var searched_POI = -1;
    
    //NULL argument?
    if ((poi_code == null) || (poi_code == "none")) {
      return searched_POI_ID;
    }
    
    // foreach (POIs as $actual_POI) {
      // if (actual_POI.Code == $poi_code) {
        // searched_POI=actual_POI;
        // break;
      // }
    // }
    	
    for(var i = 0; i < POIs.length; i++) {
  	Ti.API.info('POIs.code: ' + POIs[i].Code);
    	if(POIs[i].Code == poi_code) {
    		Ti.API.info('POIs[i].Code = ' + POIs[i].Code);
    		// searched_POI = POIs[i].Code;
    		searched_POI_ID = POIs[i];
  			break;
    	}
    }
    
    return searched_POI_ID;
  }
  
  var poicercato = POI_lookup(pippo, '0101');
  Ti.API.info("poicercato: " + poicercato);
  
  //Function nav_reach: takes you from a starting POI to and destination one
  //Parameters:
  //  POIs: vector containing Points Of Interest
  //  start_poi: code of the POI where you are now
  //  dest_poi: your destination POI's code
  //  direction: try to reach the destination going "left" or "right" (string)
  //Returns:
  //  On success, an array containing the sequence of POI Objects you should 
  //  pass within to reach your destination with the shortest pass count.
  //  On failure, or if the start and destination POI are the same,,NULL is 
  //  returned.
  //Note:
  //  The Forward and Behind directions are handled independently of the 
  //  "direction" argument.
  
  function nav_reach(POIs, start_poi, dest_poi, direction){
    //If we don't succeed in finding a viable path, NULL is returned
    // var navpath = null;
    var navpath = {};
    var i = 0, j = 0;
    
    //Store the "walking" position
    var walk_poi = undefined;
    //Temporarily store some values for testing: probably avoidable
    var tmp_poi = undefined;
    //And remember where we have been
    var visited_places_codes = {};

    //Move on the start_poi, and check it's existence
    walk_poi = POI_lookup(POIs, start_poi);
    if (walk_poi == undefined) {
      Ti.API.info(start_poi + ' non trovato o mancante');
      return navpath;
    }

    //We should be sure the destination POI exists
    if (POI_lookup(POIs, dest_poi) == undefined){
      Ti.API.info(dest_poi + ' non trovato o mancante');
      return navpath;
    }
    
    //Are we already at our destination?
    if (start_poi == dest_poi) {
      return navpath;
    }
    
    //Parse the "direction" argument
    switch(direction){
      case 'left': {
        direction="POILeft";
        break;
      }
      case 'right': {
        direction="POIRight";
        break;
      }
      default: {
        alert('I have received ' + direction);
        return navpath;
      }
    }
    Ti.API.info('Direzione: ' + direction);
    
    //Lookup our starting poi to use it more efficiently in the while loop, to 
    //detect circular navigation.
    start_poi = POI_lookup(POIs, start_poi);
    
    //Check if we can reach our destination going left
    while ((dest_poi != walk_poi) && (walk_poi != undefined)){
      Ti.API.info('Entrata while: ' + walk_poi.Code);
      navpath[i] = walk_poi;
      i++;

      //Can we reach our desired POI considering what we have in front of us?
      tmp_poi = POI_lookup(POIs, walk_poi.POIForward);
      //Ti.API.info('Punto davanti: ' + tmp_poi.Code);
      Ti.API.info('Punto davanti: ' + tmp_poi);
      //if (dest_poi == tmp_poi.Code) {
      if(dest_poi == tmp_poi) {
        Ti.API.Info('Era davanti');
        walk_poi = tmp_poi;
        navpath[i] = walk_poi;
        i++;
        return navpath;
      }
      else
      {
        Ti.API.info('non trovato');
      }
      
      //Or behind us?
      tmp_poi = POI_lookup(POIs, walk_poi.POIBehind);
      //Ti.API.info('Punto dietro: ' + tmp_poi.Code);
      Ti.API.info('Punto dietro: ' + tmp_poi);
      
      //if (dest_poi == tmp_poi.Code) {
      	if(dest_poi == tmp_poi) {
        Ti.API.info('era davanti');
        walk_poi = tmp_poi;
        navpath[i] = walk_poi;
        i++;
        return navpath;
      }
      else
      {
        Ti.API.info('Non trovato');
      }
      
      //Go in the "direction" direction
      walk_poi = POI_lookup(POIs, walk_poi.direction);
      Ti.API.info('walk_poi: ' + walk_poi);

      //If we are where we started, stop here
      if (start_poi == walk_poi) {
        Ti.API.info("Uscita: siamo tornati al punto di partenza.");
        return undefined;
        break;
      }
      // if(visited_places_codes[j].indexOf(walk_poi) == -1) {
        // Ti.API.info('Uscita: dipendenze circolari?');
        // Ti.API.info('Infatti, ' + walk_poi.Code + ' presente');
        // j++;
        // return undefined;
      // }
      // else
      // {
        // if (walk_poi != start_poi) {
         // Ti.API.info('Aggiungo ' + walk_poi.Code + ' alla lista dei posti visitati.');
          // visited_places_codes[j] = walk_poi;
          // j++;
        // }
      // }

    } //end of the walking loop
    
    if (walk_poi == undefined) {
     Ti.API.info('walk_poi era nullo, quindi destinazione non raggiungibile');
      return walk_poi;
    }
    else {
      Ti.API.info('Aggiungo la destinazione.');
      navpath[i] = walk_poi;
      i++;
    }
    
    return navpath;
  }
  
  var arr = nav_reach(pippo,"0101", "0102", "left");
  Ti.API.info('ARRIVO: ' + arr);
  for(var k = 0; k < arr.length; k++) {
  	Ti.API.info('ARR[' + k + '] = ' + arr[k]);
  }
// 
  // $map = nav_init("dc.txt");
//   
  // $pois = nav_get_pois($map, 1, -1);
//   
  // $arr = nav_reach($pois, "0101", "0102", "left");
  // foreach ($arr as $element){
    // echo "Codice: {$element['Code']}";
  // }


	return win;
};

module.exports = navigation;

