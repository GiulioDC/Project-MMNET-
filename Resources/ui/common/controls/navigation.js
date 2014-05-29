function navigation(_args) {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: "Navigation",
		f_number: _args.f_number_passed,
		b_id: _args.b_id_passed,
		start_id:_args.start_id_passed,
		end_id:_args.end_id_passed
	});

	Ti.API.info('startid nav: ' + win.start_id);
	Ti.API.info('endid nav: ' + win.end_id);
	Ti.API.info('buildingID: ' + win.b_id);
	Ti.API.info('floornum: ' + win.f_number);
	
	Ti.App.fireEvent('getdata'); //calls getdata function from app.js
	var navdata = getdata();	//navdata holds the entire json object
	var readnavdata = navdata.read();
	var json = JSON.parse(readnavdata);

	Ti.App.fireEvent('navgetpois');
	Ti.App.fireEvent('navreach');
	Ti.App.fireEvent('getobjects'); //call getObjects function from app.js
	
	var data;
	var tableview = Titanium.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
		layout:'vertical',
	});	
	
	var startObj = getObjects(json, 'ID', win.start_id);
	var endObj = getObjects(json, 'ID', win.end_id);
	var pois_temp = nav_get_POIs(json, win.b_id, win.f_number);
	var path = [];
  	path = nav_reach(pois_temp,startObj[0].Code,endObj[0].Code);
  	Ti.API.info('PATH: ' + path);
  	
  	
  	var i;
  	var poi, sectionPoiName;
  	
  	var sectionNavigation = Ti.UI.createTableViewSection({headerTitle: 'Navigation'});
		sectionNavigation.add(Ti.UI.createTableViewRow({
			title: 'From ' + startObj[0].Name + ' to ' + endObj[0].Name,
			color: 'white', backgroundColor: 'teal',
		}));
	tableview.appendSection(sectionNavigation);


	for(i = 0; i < path.length; i++) {
		poi = getObjects(json, 'ID', path[i]);
		sectionPoiName = Ti.UI.createTableViewSection({headerTitle: 'Point Of Interest'	});
		sectionPoiName.add(Ti.UI.createTableViewRow({
			title: poi[0].Name,
			font:{ fontSize:'20dp', fontWeight:'bold'}
		}));
		tableview.appendSection(sectionPoiName);
		
		
		
		
	}//for
 	
 	
 	
 	win.add(tableview);
	return win;
};

module.exports = navigation;