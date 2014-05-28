function places(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#dddddd',
		start_id: _args.start_id_passed,
		end_id:_args.end_id_passed
	});
	
	Ti.API.info('startid: ' + win.start_id);
	Ti.API.info('endid: ' + win.end_id);
	
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
				b_id: BuildObj[0].BuildingId,
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
				b_id_passed:e.rowData.b_id,
				f_number_passed:e.rowData.f_number,
				start_id_passed:win.start_id,
				end_id_passed:win.end_id
			});

			_args.containingTab.open(win1,{animated:true});
		}
	});



	
	win.add(tableview);
		
	return win;
};

module.exports = places;