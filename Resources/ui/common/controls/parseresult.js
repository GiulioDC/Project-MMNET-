function parseresult() {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: "Search POI"
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
		var readText = temp.read();
	
		//var poisearched = e.value.substring(1);
		var varsearch = e.value.replace(/\s+/g, ''); //ignore spaces
		var poisearched = varsearch.toLowerCase();
		json = JSON.parse(readText);
		
		Ti.App.fireEvent('getobjects');
		Ti.App.fireEvent('getKeys');
		
		var key = getKeys(json, poisearched);
		if(key == 'Name'){
			var searchresult = getObjects(json, 'Name', poisearched);
		}
		else{
			var searchresult = getObjects(json, 'Code', poisearched);
		}
		
				// switch(key) {
// 			
			// case 'Name':
				// var searchresult = getObjects(json, 'Name', poisearched);
				// break;
			// case 'Code':
				// var searchresult = getObjects(json, 'Code', poisearched);
				// break;
			// case 'Info':
				// var searchresult = getObjects(json, 'Info', poisearched);
			// case 'ID':
				// var searchresult = getObjects(json, 'ID', poisearched);
				// break;
			// default:
				// alert('Input error');
				// break;
		// }
		
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
					font:{fontSize:12}
				}));
				tableview.appendSection(sectionPoiInfo);
			}
			
		var sectionPoiLocation = Ti.UI.createTableViewSection({headerTitle: 'Location'});
		sectionPoiLocation.add(Ti.UI.createTableViewRow({
			title: searchresult[0].Location,
			font:{fontSize:10}
		}));
		tableview.appendSection(sectionPoiLocation);
		
		var sectionPoiLeft = Ti.UI.createTableViewSection({headerTitle: 'POI on the left - distance'});
		if(searchresult[0].POILeft != "none") {
	    	var left = getObjects(json, 'Code', searchresult[0].POILeft);
	    	sectionPoiLeft.add(Ti.UI.createTableViewRow({
	    		title: left[0].Name +
	    		', ' + searchresult[0].POILeftDistance + ' steps',
	    	}));
	    	if(left[0].Name == "corner"){
	    		sectionPoiLeft.add(Ti.UI.createTableViewRow({
	    			title: 'Turn ' + searchresult[0].POILeftDoor + ' to go on',
	    		}));
	    	}
	    	else {
	    		sectionPoiLeft.add(Ti.UI.createTableViewRow({
	    			title: 'The door will be ' + searchresult[0].POILeftDoor,
	    		}));
	    	}
			tableview.appendSection(sectionPoiLeft);
		}
		
		var sectionPoiRight = Ti.UI.createTableViewSection({headerTitle: 'POI on the right - distance'});
		if(searchresult[0].POIRight != "none") {
	    	var right = getObjects(json, 'Code', searchresult[0].POIRight);
	    	sectionPoiRight.add(Ti.UI.createTableViewRow({
	    		title: right[0].Name +
	    		', ' + searchresult[0].POIRightDistance + ' steps',
	    	}));
	    	if(right[0].Name == "corner"){
	    		sectionPoiRight.add(Ti.UI.createTableViewRow({
	    			title: 'Turn ' + searchresult[0].POIRightDoor + ' to go on',
	    		}));
	    	}
	    	else {
	    		sectionPoiRight.add(Ti.UI.createTableViewRow({
	    			title: 'The door will be ' + searchresult[0].POIRightDoor,
	    		}));
	    	}
	    	
			tableview.appendSection(sectionPoiRight);
		}
		
		var sectionPoiBehind = Ti.UI.createTableViewSection({headerTitle: 'POI behind - distance'});
		if(searchresult[0].POIBehind != "none") {
	    	var behind = getObjects(json, 'Code', searchresult[0].POIBehind);
	    	sectionPoiBehind.add(Ti.UI.createTableViewRow({
	    		title: behind[0].Name +
	    		', ' + searchresult[0].POIBehindDistance + ' steps',
	    	}));
	    	sectionPoiBehind.add(Ti.UI.createTableViewRow({
	    			title: 'The door will be ' + searchresult[0].POIBehindDoor,
	    	}));
			tableview.appendSection(sectionPoiBehind);
		}
		
		var sectionPoiForward = Ti.UI.createTableViewSection({headerTitle: 'POI in front of you - distance'});
		if(searchresult[0].POIForward != "none") {
	    	var forward = getObjects(json, 'Code', searchresult[0].POIForward);
	    	sectionPoiForward.add(Ti.UI.createTableViewRow({
	    		title: forward[0].Name +
	    		', ' + searchresult[0].POIForwardDistance + ' steps',
	    	}));
	    	sectionPoiForward.add(Ti.UI.createTableViewRow({
	    			title: 'The door will be ' + searchresult[0].POIForwardDoor,
	    	}));
			tableview.appendSection(sectionPoiForward);
		}
		
		win.add(tableview);
		
	
		});	//searchbar event
		
	

	return win;
};

module.exports = parseresult;

