function places(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#dddddd'
	});
	//var tab = title.containingTab;
	
	Ti.App.fireEvent('getdata');
	Ti.App.fireEvent('getvalues');
	Ti.App.fireEvent('getobjects');
	var temp = getdata();	
	var readText = temp.read();
	var json = JSON.parse(readText);
	
	var data = [];
	var tableview = Ti.UI.createTableView({
  		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		layout:'vertical'
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
				f_number: floor.FloorNumber,
				hasChild:true
			}));
		}
		tableview.appendSection(sectionBuilding);
		tableview.appendSection(sectionFloors);
	}
	
	

	tableview.addEventListener('click', function(e) {
		if(e.rowData.f_number) {
			var Window = require('ui/common/controls/Places/poilist'),
			win1 = new Window({
				title: e.rowData.title,
				containingTab:_args.containingTab,
				tabGroup:_args.tabGroup,
				f_number_passed:e.rowData.f_number
			});

			_args.containingTab.open(win1,{animated:true});
		}
	});



	
	win.add(tableview);
		
	return win;
};

module.exports = places;