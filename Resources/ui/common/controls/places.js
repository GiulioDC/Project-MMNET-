function places(title) {
	var win = Ti.UI.createWindow({
		title:'Places',
		backgroundColor:'#dddddd'
	});
	var tab = title.containingTab;
	
	Ti.App.fireEvent('getdata');
	Ti.App.fireEvent('getvalues');
	Ti.App.fireEvent('getobjects');
	var temp = getdata();	
	var readText = temp.read();
	var json = JSON.parse(readText);
	
	var data = [];
	var tableview = Ti.UI.createTableView({
  		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
		layout:'vertical',
	});
		
	var sectionBuilding = Ti.UI.createTableViewSection({headerTitle: 'Building'	});
	var sectionFloors = Ti.UI.createTableViewSection({headerTitle: 'Floors'});
	
	var BuildName = getValues(json, 'BuildingName');
	Ti.API.info(BuildName);
	for (var i = 0; i < BuildName.length; i++) {
		
		sectionBuilding.add(Ti.UI.createTableViewRow({
			title: BuildName[i],
			font:{ fontSize:'20dp', fontWeight:'bold'}
		}));
		
		var BuildObj = getObjects(json, "BuildingName", BuildName[i]);
		
		for(var j = 0; j < BuildObj[0].HowManyFloors; j++) {
			var floor = BuildObj[0].Floors[j];
			sectionFloors.add(Ti.UI.createTableViewRow({
				title: '[' + floor.FloorNumber + '] ' + floor.FloorName,
				number: floor.FloorNumber,
				hasChild:true
			}));
		}
	}
	tableview.appendSection(sectionBuilding);
	tableview.appendSection(sectionFloors);

	tableview.addEventListener('click', function(e) {
		if(e.rowData.number) {
			var Window = require('ui/common/controls/poilist'),
			win1 = new Window({
				title: e.rowData.title,
				containingTab:win.containingTab,
				tabGroup:win.tabGroup
			});
			tab.open(win1,{animated:true});
		}
	});

	
	win.add(tableview);
		
	return win;
};

module.exports = places;