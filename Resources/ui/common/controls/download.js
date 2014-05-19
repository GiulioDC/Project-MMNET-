function download(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#dddddd'
	});


	var tabledata = [];
	var tableview = Titanium.UI.createTableView({
		data:tabledata
	});
	

	
	var json, i, row, nameLabel, floornumLabel;
	var DataType, EngineVersion, HowManyBuildings, Builndings, BuildingName, HowManyFloors, Floors, FloorName, FloorNumber;
	var HowManyPois, POIs, Code, POIName, POIDescription, POILocation, POILeft, POIRight, POIBehind, POIForward;
	
	
	Ti.App.fireEvent('getdata');
	var temp = getdata();	
	var readText = temp.read();
	var readText = temp.read();

	json = JSON.parse(readText);
	
	Ti.API.info("readtext = " +readText.text); //{"DataType":"...
	//Ti.API.info("F: " +f); //[object TiFilesystemFile]
	Ti.API.info("JSON: " + json);  // [object Object]
	
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
	    floornumLabel = Ti.UI.createLabel({
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
	    row.add(floornumLabel);
	    tabledata.push(row);
	}
		
	tableview.setData(tabledata);
	win.add(tableview);

	return win;
	
};

module.exports = download;