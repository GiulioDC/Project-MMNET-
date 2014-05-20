function parseresult() {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: "Go To POI"
	});
		
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
		Ti.API.info('ritorna: ' + searchresult[0].Name); 
		
		tableview.setData([]);
		
		row = Ti.UI.createTableViewRow({
			className: 'POIs',
			rowIndex:i,
	       	height:Ti.UI.SIZE,
	       	layout: 'vertical'
	   	});
	   	
	    NameLabel = Ti.UI.createLabel({
	        text: searchresult[0].Name,
	        font:{ fontSize:'24dp',fontWeight:'bold'},
	        // top: 50, 
	        // height:30,
	        // textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color:'#000',
			height : Ti.UI.SIZE,
			touchEnabled:false
	    });
	    row.add(NameLabel);
	    
	    if(searchresult[0].Info != "No description") {
	    	InfoLabel = Ti.UI.createLabel({
	    		text: searchresult[0].Info,
	    		// top:40,
	    		// height : Ti.UI.SIZE,
	    		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	    		wordWrap:true
	    	});
	    	row.add(InfoLabel);
	    }
	    
	    LocationLabel = Ti.UI.createLabel({
	    	text: 'Localization: ' + searchresult[0].Location,
	    	// height : Ti.UI.SIZE,
	    	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	    	wordWrap:true
	    	// top: 80
	    });
	    row.add(LocationLabel);
	    
	    if(searchresult[0].POILeft != "none") {
	    	var left = getObjects(json, 'Code', searchresult[0].POILeft);
	    	PoiLeftLabel = Ti.UI.createLabel({
	    		text: 'On the left: ' + left[0].Name +
	    		'\nDistance: ' + searchresult[0].POILeftDistance + ' steps',
	    		wordWrap:true
	    	});
	    	row.add(PoiLeftLabel);
	    }
	    
	    if(searchresult[0].POIRight != "none") {
	    	var right = getObjects(json, 'Code', searchresult[0].POIRight);
	    	PoiRightLabel = Ti.UI.createLabel({
	    		text: 'On the right: ' + right[0].Name +
	    		'\nDistance: ' + searchresult[0].POIRightDistance + ' steps',
	    		wordWrap:true,
	    		// height : Ti.UI.SIZE
	    	});
	    	row.add(PoiRightLabel);
	    }
	    
	    if(searchresult[0].POIBehind != "none") {
	    	var behind = getObjects(json, 'Code', searchresult[0].POIBehind);
	    	PoiBehindLabel = Ti.UI.createLabel({
	    		text: 'Behind: ' + behind[0].Name +
	    		'\nDistance: ' + searchresult[0].POIBehindDistance + ' steps',
	    		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	    		wordWrap:true
	    		// height : Ti.UI.SIZE
	    	});
	    	row.add(PoiBehindLabel);
	    }
	    
	    if(searchresult[0].POIForward != "none") {
	    	var forward = getObjects(json, 'Code', searchresult[0].POIForward);
	    	PoiForwardLabel = Ti.UI.createLabel({
	    		text: 'In front of you : ' + forward[0].Name +
	    		'\nDistance: ' + searchresult[0].POIForwardDistance + ' steps',
	    		wordWrap:true
	    	});
	    	row.add(PoiForwardLabel);
	    }
	    
	    tableview.appendRow(row);
	    // tabledata.push(row);	
		//tableview.setData(tabledata);
		win.add(tableview);
	
		});	//searchbar event
		
	

	return win;
};

module.exports = parseresult;

