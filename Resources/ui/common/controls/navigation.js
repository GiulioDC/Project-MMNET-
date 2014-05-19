// function navigation() {
	// var win = Titanium.UI.createWindow({
		// backgroundColor:'white',
		// title: "Navigation"
	// });
//   
  // //Function nav_init: initialize navigation engine, loading the json file 
  // //describing the environment and returning a big associative array containing 
  // //the data
//   
  // // function nav_init($filename){
    // // //Create the navdata variable, holding the entire json object
    // // var navdata = json_decode(file_get_contents($filename), true);
// //     
    // // //Return it to caller
    // // return $navdata;
  // // }
  // win.getdata = getdata;
  // var parsed = Ti.UI.currentWindow.getdata;
//   
  // //nav_get_POIs: returns a set of POIs contained in a specific place, 
  // //identified by the ID of a building and a Floor number / label 
  // //Parameters:
  // //  $data: the structure holding the entire environment
  // //  $buildingId: the building ID
  // //  $floorNumber: the floor number / label
  // //Returns:
  // //  On success, an array containing some POIs.
  // //  On error:
  // //    - A string with value "unknown_building_location_in_array"
  // //    OR
  // //    - a string with value "unknown_floor_location_in_array"
  // function nav_get_POIs($data, $buildingId, $floorNumber){
    // //Set some variables in a "consistent" state. we haven't searched for 
    // //anything, so we didn't find anything. If searching failes, we simply 
    // //return those variables.
    // $arrayBuildingLocation="unknown_building_location_in_array";
    // $arrayFloorLocation="unknown_floor_location_in_array";
// 
    // //Search for specified building Id
    // for ($i=0;$i<$data['HowManyBuildings'];$i++){
//       
      // //Is this the building we where searching for?
      // if ($data['Buildings'][$i]['BuildingId'] == $buildingId){
        // $arrayBuildingLocation=$i;
      // }
    // }
//     
    // //Let the caller know we can not find the building with the specified ID
    // if ( !is_numeric($arrayBuildingLocation) ) {
      // return $arrayBuildingLocation;
    // }
//     
    // //Now, search for the Floor. I simply copy/pasted the code pattern for the 
    // //previous case.
    // for ($i=0;$i<$data['Buildings'][$arrayBuildingLocation]['HowManyFloors'];$i++){
//       
      // //Is this the floor we where searching for?
      // if ($data['Buildings'][$arrayBuildingLocation]['Floors'][$i]['FloorNumber'] == $floorNumber){
        // $arrayFloorLocation=$i;
      // }
    // }
//     
    // //Let the caller know we can not find the Building with the specified ID
    // if ( !is_numeric($arrayFloorLocation) ) {
      // return $arrayFloorLocation;
    // }
//     
    // return $data['Buildings'][$arrayBuildingLocation]['Floors'][$arrayFloorLocation]['POIs'];
  // }
//   
  // //Function POI_lookup: scans the vector of POIs and returns the POI object 
  // //associated with the given POI code.
  // //Parameters:
  // //  POIs: the POIs vector containing Points Of Interest
  // //  poi_code: code of the POI we're searching for
  // //Returns:
  // //  On success, the corrisponding POI object is returned.
  // //  On failure, if the "none" code is given for the searched POI or a NULL 
  // //  argument is passed as POI code, NULL is returned.
  // //Assumption:
  // //  Any POI has a different code from another.
  // function POI_lookup($POIs, $poi_code) {
    // //The resultant POI: now it's NULL and will remain NULL if we can't find a 
    // //POI corresponding to this one
    // $searched_POI=NULL;
//     
    // //NULL argument?
    // if (($poi_code == NULL) || ($poi_code == "none")) {
      // return $searched_POI;
    // }
//     
    // foreach ($POIs as $actual_POI) {
      // if ($actual_POI['Code'] == $poi_code) {
        // $searched_POI=$actual_POI;
        // break;
      // }
    // }
//     
    // return $searched_POI;
  // }
//   
  // //Function nav_reach: takes you from a starting POI to and destination one
  // //Parameters:
  // //  POIs: vector containing Points Of Interest
  // //  start_poi: code of the POI where you are now
  // //  dest_poi: your destination POI's code
  // //  direction: try to reach the destination going "left" or "right" (string)
  // //Returns:
  // //  On success, an array containing the sequence of POI Objects you should 
  // //  pass within to reach your destination with the shortest pass count.
  // //  On failure, or if the start and destination POI are the same,,NULL is 
  // //  returned.
  // //Note:
  // //  The Forward and Behind directions are handled independently of the 
  // //  "direction" argument.
  // function nav_reach($POIs, $start_poi, $dest_poi, $direction){
    // //If we don't succeed in finding a viable path, NULL is returned
    // $navpath = NULL;
//     
    // //Store the "walking" position
    // $walk_poi = NULL;
    // //Temporarily store some values for testing: probably avoidable
    // $tmp_poi = NULL;
    // //And remember where we have been
    // $visited_places_codes = array();
// 
    // //Move on the start_poi, and check it's existence
    // $walk_poi = POI_lookup($POIs, $start_poi);
    // if ($walk_poi == NULL) {
      // echo "start_poi, non trovato o mancante. \n";
      // return $navpath;
    // }
// 
    // //We should be sure the destination POI exists
    // if (POI_lookup($POIs, $dest_poi) == NULL){
      // echo "dest_poi non trovato o mancante. \n";
      // return $navpath;
    // }
//     
    // //Are we already at our destination?
    // if ($start_poi == $dest_poi) {
      // return $navpath;
    // }
//     
    // //Parse the "direction" argument
    // switch($direction){
      // case 'left': {
        // $direction="POILeft";
        // break;
      // }
      // case 'right': {
        // $direction="POIRight";
        // break;
      // }
      // default: {
        // echo "Ho ricevuto: $direction \n";
        // return $navpath;
      // }
    // }
    // echo "Direzione: $direction \n";
//     
    // //Lookup our starting poi to use it more efficiently in the while loop, to 
    // //detect circular navigation.
    // $start_poi = POI_lookup($POIs, $start_poi);
//     
    // //Check if we can reach our destination going left
    // while (($dest_poi != $walk_poi['Code']) && ($walk_poi != NULL)){
      // echo "Entrata while: {$walk_poi['Code']} \n";
      // $navpath[] = $walk_poi;
// 
      // //Can we reach our desired POI considering what we have in front of us?
      // $tmp_poi = POI_lookup($POIs, $walk_poi['POIForward']);
      // echo "Vediamo cosa succede valutando il punto davanti a noi, {$tmp_poi['Code']}: ";
      // if ($dest_poi == $tmp_poi['Code'] ) {
        // echo "Era davanti a noi";
        // $walk_poi = $tmp_poi;
        // $navpath[] = $walk_poi;
        // return $navpath;
      // }
      // else
      // {
        // echo "Non trovato. \n";
      // }
//       
      // //Or behind us?
      // $tmp_poi = POI_lookup($POIs, $walk_poi['POIBehind']);
      // echo "Vediamo cosa succede valutando il punto dietro a noi, {$tmp_poi['Code']}: ";
      // if ($dest_poi == $tmp_poi['Code']) {
        // echo "Era davanti a noi.";
        // $walk_poi = $tmp_poi;
        // $navpath[] = $walk_poi;
        // return $navpath;
      // }
      // else
      // {
        // echo "Non trovato. \n";
      // }
//       
      // //Go in the "direction" direction
      // $walk_poi = POI_lookup($POIs, $walk_poi["$direction"]);
// 
      // //If we are where we started, stop here
      // if ($start_poi == $walk_poi) {
        // echo "Uscita: siamo tornati al punto di partenza.\n";
        // return NULL;
        // break;
      // }
      // if (in_array($walk_poi, $visited_places_codes, true)){
        // echo "Uscita: dipendenze circolari? \n";
        // echo "Infatti, {$walk_poi['Code']} presente.:";
        // return NULL;
      // }
      // else
      // {
        // if ($walk_poi != $start_poi) {
          // echo "Aggiungo {$walk_poi['Code']} alla lista dei posti visitati.\n";
          // $visited_places_codes[] = $walk_poi;
        // }
      // }
// 
    // } //end of the walking loop
//     
    // if ($walk_poi == NULL) {
      // echo "walk_poi era nullo, quindi destinazione non raggiungibile \n";
      // return $walk_poi;
    // }
    // else {
      // echo "Aggiungo la destinazione. \n";
      // $navpath[] = $walk_poi;
    // }
//     
    // return $navpath;
  // }
// 
  // $map = nav_init("dc.txt");
//   
  // $pois = nav_get_pois($map, 1, -1);
//   
  // $arr = nav_reach($pois, "0101", "0102", "left");
  // foreach ($arr as $element){
    // echo "Codice: {$element['Code']}";
  // }
// 
// 
	// return win;
// };
// 
// module.exports = navigation;
// 
