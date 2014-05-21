function map(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#dddddd'
	});
var tab = _args.containingTab;

	var tabledata = [];
	var tableview = Titanium.UI.createTableView({
		data:tabledata,
		search:search,
		//searchHidden:true,
		filterAttribute:'Name',
		top:50,
		style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
	});


	var search = Titanium.UI.createSearchBar({
		barColor:'#dddddd',
		showCancel:true,
		height:43,
		top:0,
		hint:'search POI'
	});

	win.add(search);
	
	var json, i, j, k, row;
	var DataType, EngineVersion, HowManyBuildings, Builndings, BuildingName, HowManyFloors, Floors, FloorName, FloorNumber;
	var HowManyPois, POIs, Code, POIName, POIDescription, POILocation, POILeft, POIRight, POIBehind, POIForward, poicode;
	var NameLabel, InfoLabel, LocationLabel, PoiLeftLabel, PoiRightLabel, PoiBehindLabel, PoiForwardLabel;
		
	Ti.App.fireEvent('getdata');
	var temp = getdata();	
	//Ti.API.info('temp: ' + temp);
	var readText = temp.read();
	//Ti.API.info('readText: ' + readText);
	
	json = JSON.parse(readText);
		
	for (i = 0; i < json.HowManyBuildings; i++) {
	    var building = json.Buildings[i];
	    row = Ti.UI.createTableViewRow({
	        height:'60dp'
	    });
	    
	    nameLabel = Ti.UI.createLabel({
	        text:building.BuildingName,
	        font:{
	            fontSize:'24dp',
		    	fontWeight:'bold'
			},
	    });
	    floornumLabel = Ti.UI.createLabel({
			text:'Number of floors: ' + building.HowManyFloors,
			font:{
		    	fontSize:'16dp'
			},
			top: '40dp',
			color:'#000',
			touchEnabled:false
	    });
	    row.add(nameLabel);
	    row.add(floornumLabel);
	    tabledata.push(row);
	    
		nameLabel.addEventListener('click', function(e) {
	    	var WinFloors = require('ui/common/controls/floors'),
			winfloors = new WinFloors();
			winfloors.title = 'Floors';	
			
			winfloors.passbuilding = function() {
				return i;
			};
			
			
			tab.open(winfloors,{animated:true});
		});
		
		

		
	}
		
	tableview.setData(tabledata);
	
	win.add(tableview);






	return win;
};

module.exports = map;

