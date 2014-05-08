function map(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#dddddd'
	});

var url = "http://www.gstorm.eu/dc.txt";

var table = Ti.UI.createTableView();
var tableData = [];
var json, i, row, nameLabel, nickLabel;
var DataType, EngineVersion, HowManyBuildings, Builndings, BuildingName, HowManyFloors, Floors, FloorName, FloorNumber;
var HowManyPois, POIs, Code, POIName, POIDescription, POILocation, POILeft, POIRight, POIBehind, POIForward;

var xhr = Ti.Network.createHTTPClient({
    onload: function() {
	//Ti.API.debug(this.responseText);
	// alert(this.responseText);
		
	json = JSON.parse(this.responseText);
	
//alert(console.log(json));

	
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
	    tableData.push(row);
        }
		
	table.setData(tableData);
    },
    onerror: function(e) {
	Ti.API.debug("STATUS: " + this.status);
	Ti.API.debug("TEXT:   " + this.responseText);
	Ti.API.debug("ERROR:  " + e.error);
	alert('There was an error retrieving the remote data. Try again.');
    },
    timeout:5000
});


xhr.open("GET", url);
xhr.send();
win.add(table);

	return win;
};

module.exports = map;

