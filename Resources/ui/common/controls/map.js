function map(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#dddddd'
	});
var tab = _args.containingTab;

	var data = [];
	
	var tableview = Titanium.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
	});

		
	Ti.App.fireEvent('getdata');
	var temp = getdata();	
	var readText = temp.read();
	
	var json = JSON.parse(readText);
		
	for (var i = 0; i < json.HowManyBuildings; i++) {
	    var building = json.Buildings[i];
	    var row = Ti.UI.createTableViewRow({
	        height:'60dp'
	    });
	    
	    var nameLabel = Ti.UI.createLabel({
	        text:building.BuildingName,
	        font:{
	            fontSize:'24dp',
		    	fontWeight:'bold'
			},
	    });
	    var floornumLabel = Ti.UI.createLabel({
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
	    data.push(row);
		
		

		
	} //for
	
	tableview.addEventListener('click', function(e) {
		if(e.rowData.test){
			var WinFloors = require('ui/common/controls/floors'),
			winfloors = new WinFloors({
				title : 'Floors',
				containingTab : win.containingTab,
				tabGroup:win.tabGroup
	   		});
			winfloors.passbuilding = function() {
				//e.row i;
			};
			win.containingTab.open(winfloors,{animated:true});
		}
	});
		
		
		
	tableview.setData(data);
	win.add(tableview);






	return win;
};

module.exports = map;

