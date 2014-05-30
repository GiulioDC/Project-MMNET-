function poilist(_args) {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: _args.title,
		f_number: _args.f_number_passed,
		b_id: _args.b_id_passed,
		start_id: _args.start_id_passed,
		end_id:_args.end_id_passed
	});
	Ti.API.info('startid: ' + win.start_id);
	Ti.API.info('endid: ' + win.end_id);
	
	var search = Titanium.UI.createSearchBar({
		barColor:'#dddddd',
		showCancel:true,
		height:43,
		top:0,
		touchEnabled:true
	});
	
	var data = [];
	var tableview = Titanium.UI.createTableView({
		data:data,
		search:search,
		style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
		layout:'vertical',
		top:43,
		});
	

	Ti.App.fireEvent('getdata');
	Ti.App.fireEvent('getobjects');
	Ti.App.fireEvent('getvalues');
	var temp = getdata();	
	var readText = temp.read();
	json = JSON.parse(readText);
	
	var sectionClassrooms = Ti.UI.createTableViewSection({headerTitle: 'Classrooms'});
	var sectionEntrance = Ti.UI.createTableViewSection({headerTitle: 'Entrance'});
	var sectionBathrooms = Ti.UI.createTableViewSection({headerTitle: 'Bathrooms'});
	var sectionOffices = Ti.UI.createTableViewSection({headerTitle: 'Offices'});
	var sectionElevators = Ti.UI.createTableViewSection({headerTitle: 'Elevators'});
	var sectionStairs = Ti.UI.createTableViewSection({headerTitle: 'Stairs'});
	var sectionOthers = Ti.UI.createTableViewSection({headerTitle: 'Others'});
	
	var FloorObj = getObjects(json, "FloorNumber", win.f_number);
	
	for(var i = 0; i < FloorObj[0].POIs.length; i++) {
		var poi = FloorObj[0].POIs[i];
		
		if(win.stard_id != poi.ID || win.end_id != poi.ID){
		
		if(poi.Info == 'classroom'){
			sectionClassrooms.add(Ti.UI.createTableViewRow({
				title: poi.Name,
				poi_id: poi.ID,
				hasChild:true
			}));
		}
		if(poi.Info == 'entrance'){
			sectionEntrance.add(Ti.UI.createTableViewRow({
				title: poi.Name,
				poi_id: poi.ID,
				hasChild:true
			}));
		}
		if(poi.Info == 'office'){
			sectionOffices.add(Ti.UI.createTableViewRow({
				title: poi.Name,
				poi_id: poi.ID,
				hasChild:true
			}));
		}
		if(poi.Info == 'bathroom'){
			sectionBathrooms.add(Ti.UI.createTableViewRow({
				title: poi.Name,
				poi_id: poi.ID,
				hasChild:true
			}));
		}
		if(poi.Info == 'elevators'){
			sectionElevators.add(Ti.UI.createTableViewRow({
				title: poi.Name,
				poi_id: poi.ID,
				hasChild:true
			}));
		}
		if(poi.Info == 'stairs'){
			sectionStairs.add(Ti.UI.createTableViewRow({
				title: poi.Name,
				poi_id: poi.ID,
				hasChild:true
			}));
		}
		if(poi.Info == 'others'){
			sectionOthers.add(Ti.UI.createTableViewRow({
				title: poi.Name,
				poi_id: poi.ID,
				hasChild:true
			}));
		}
		}
	}
	tableview.appendSection(sectionClassrooms);
	tableview.appendSection(sectionEntrance);
	tableview.appendSection(sectionOffices);
	tableview.appendSection(sectionBathrooms);
	tableview.appendSection(sectionElevators);
	tableview.appendSection(sectionStairs);
	tableview.appendSection(sectionOthers);
	
	
	tableview.addEventListener('click', function(e) {
		if(win.start_id == undefined && win.end_id == undefined && e.rowData) {
			var Window = require('ui/common/controls/Places/poidetails'),
			win1 = new Window({
				title: e.rowData.title,
				containingTab:_args.containingTab,
				tabGroup:_args.tabGroup,
				poi_id_passed:e.rowData.poi_id
			});

			_args.containingTab.open(win1,{animated:true});
		}
		if(win.start_id != undefined && e.rowData) {
			var Window = require('ui/common/controls/navigation');
			if(win.start_id == e.rowData.poi_id){
				alert("Starting and ending points are the same, please pick a different arrival point");
				win.close();
			}
			else{
				win1 = new Window({
					containingTab:_args.containingTab,
					tabGroup:_args.tabGroup,
					b_id_passed:win.b_id,
					f_number_passed:win.f_number,
					end_id_passed:e.rowData.poi_id,
					start_id_passed:win.start_id
				});
				_args.containingTab.open(win1,{animated:true});
			}
		}
		if(win.end_id != undefined && e.rowData) {
			var Window = require('ui/common/controls/navigation');
			if(win.end_id == e.rowData.poi_id){
				alert("Starting and ending points are the same, please pick a different starting point");
				win.close();
			}
			else{
				win1 = new Window({
					containingTab:_args.containingTab,
					tabGroup:_args.tabGroup,
					b_id_passed:win.b_id,
					f_number_passed:win.f_number,
					start_id_passed:e.rowData.poi_id,
					end_id_passed:win.end_id
				});
				_args.containingTab.open(win1,{animated:true});
			}
		}
	});
	
	

	win.add(search);
	win.add(tableview);
	

	return win;
};

module.exports = poilist;
