function parseresult() {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: "Go To POI"
	});

	var search = Titanium.UI.createSearchBar({
		barColor:'#dddddd',
		showCancel:true,
		height:43,
		top:0,
		hint:'search POI'
	});


	win.add(search);
	search.focus();
	
	win.addEventListener('open', function() {
		if(win.searchinput != undefined) {
		search.value = win.searchinput();
		};
	});
	
	// SEARCH BAR EVENTS
	search.addEventListener('return', function(e) {
		
		Ti.API.info('Search Bar'+ e.value);
		search.blur();

		
		var json, i, j, k, row;
		var DataType, EngineVersion, HowManyBuildings, Builndings, BuildingName, HowManyFloors, Floors, FloorName, FloorNumber;
		var HowManyPois, POIs, Code, POIName, POIDescription, POILocation, POILeft, POIRight, POIBehind, POIForward, poicode;
		var NameLabel, InfoLabel, LocationLabel, PoiLeftLabel, PoiRightLabel, PoiBehindLabel, PoiForwardLabel;
		
		Ti.App.fireEvent('getdata');
		var temp = getdata();	
		//Ti.API.info('temp: ' + temp);
		var readText = temp.read();
		//Ti.API.info('readText: ' + readText);
	
		//var poisearched = e.value.substring(1);
		var poisearched = e.value.replace(/\s+/g, ''); //ignore spaces
		json = JSON.parse(readText);
		
		Ti.App.fireEvent('getobjects');
		var searchresult = getObjects(json, 'Code', poisearched);
		
		var data = [];
		var tableview = Ti.UI.createTableView({
  		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
		search:search,
		layout:'vertical',
		});
		
		var sectionPoiName = Ti.UI.createTableViewSection({headerTitle: 'Point Of Interest'	});
		sectionPoiName.add(Ti.UI.createTableViewRow({
			title: searchresult[0].Name,
			font:{ fontSize:'20dp', fontWeight:'bold'},
		}));
		tableview.appendSection(sectionPoiName);

		var sectionPoiInfo = Ti.UI.createTableViewSection({headerTitle: 'Info'});
			if(searchresult[0].Info != "No description") {
				sectionPoiInfo.add(Ti.UI.createTableViewRow({
					title: searchresult[0].Info,
					font:{fontSize:10}
				}));
				tableview.appendSection(sectionPoiInfo);
			}
			
		var sectionPoiLocation = Ti.UI.createTableViewSection({headerTitle: 'Location'});
		sectionPoiLocation.add(Ti.UI.createTableViewRow({
			title: searchresult[0].Location,
			font:{fontSize:10}
		}));
		tableview.appendSection(sectionPoiLocation);
		
		
		// var tableview = Ti.UI.createTableView({
  		// data: [sectionPoiName, sectionPoiInfo, sectionPoiLocation],
		// style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
		// search:search,
		// layout:'vertical',
		// });
			
		win.add(tableview);
		
	
		});	//searchbar event
		
	

	return win;
};

module.exports = parseresult;

