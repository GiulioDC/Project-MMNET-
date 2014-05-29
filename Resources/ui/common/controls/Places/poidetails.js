function poidetails(_args) {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: _args.title,
		poi_id: _args.poi_id_passed
	});

	Ti.API.info('poi_id: ' + win.poi_id);
	var data = [];
	var tableview = Titanium.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
		layout:'vertical',
	});	
	
	var sectionNavigation = Ti.UI.createTableViewSection({headerTitle: 'Navigation'});
		sectionNavigation.add(Ti.UI.createTableViewRow({
			title: 'Start from here',
			color: 'white', backgroundColor: 'red',
			start_id:win.poi_id
		}));
		sectionNavigation.add(Ti.UI.createTableViewRow({
			title: 'Go here',
			color: 'white', backgroundColor: 'navy',
			end_id:win.poi_id
		}));
	tableview.appendSection(sectionNavigation);

	Ti.App.fireEvent('getdata');
	Ti.App.fireEvent('getobjects');
	Ti.App.fireEvent('getvalues');
	var temp = getdata();	
	var readText = temp.read();
	json = JSON.parse(readText);
	
	var poi = getObjects(json, 'ID', win.poi_id);
	
	var sectionPoiName = Ti.UI.createTableViewSection({headerTitle: 'Point Of Interest'	});
		sectionPoiName.add(Ti.UI.createTableViewRow({
			title: poi[0].Name,
			font:{ fontSize:'20dp', fontWeight:'bold'}
		}));
	tableview.appendSection(sectionPoiName);

	var sectionPoiInfo = Ti.UI.createTableViewSection({headerTitle: 'Info'});
		if(poi[0].Info != "No description") {
			sectionPoiInfo.add(Ti.UI.createTableViewRow({
				title: poi[0].Info,
				//font:{fontSize:12}
			}));
			tableview.appendSection(sectionPoiInfo);
		}
		
	var sectionPoiLocation = Ti.UI.createTableViewSection({headerTitle: 'Location'});
	sectionPoiLocation.add(Ti.UI.createTableViewRow({
		title: poi[0].Location
		// font:{fontSize:13}
	}));
	tableview.appendSection(sectionPoiLocation);
		
	var sectionPoiLeft = Ti.UI.createTableViewSection({headerTitle: 'POI on the left - distance'});
	if(poi[0].POILeft != "none") {
		var left = getObjects(json, 'Code', poi[0].POILeft);
	   	sectionPoiLeft.add(Ti.UI.createTableViewRow({
	   		title: left[0].Name +
	   		', ' + poi[0].POILeftDistance + ' steps',
	   		poiname: left[0].Name,
	   		poi_id: left[0].ID,
	   		hasChild:true
	   	}));
	   	if(left[0].Info == "corner"){
    		sectionPoiLeft.add(Ti.UI.createTableViewRow({
    			title: 'Turn ' + poi[0].POILeftDoor + ' to go on',
	    	}));
	    }
	   	else {
	   		sectionPoiLeft.add(Ti.UI.createTableViewRow({
	   			title: 'The door will be ' + poi[0].POILeftDoor,
	    	}));
	   	}
		tableview.appendSection(sectionPoiLeft);
	}
		
	var sectionPoiRight = Ti.UI.createTableViewSection({headerTitle: 'POI on the right - distance'});
	if(poi[0].POIRight != "none") {
	   	var right = getObjects(json, 'Code', poi[0].POIRight);
	   	sectionPoiRight.add(Ti.UI.createTableViewRow({
	   		title: right[0].Name +
	   		', ' + poi[0].POIRightDistance + ' steps',
	   		poiname: right[0].Name,
	   		poi_id: right[0].ID,
	   		hasChild:true
	   	}));
	   	if(right[0].Info == "corner"){
	   		sectionPoiRight.add(Ti.UI.createTableViewRow({
	   			title: 'Turn ' + poi[0].POIRightDoor + ' to go on',
	   		}));
	   	}
	   	else {
	   		sectionPoiRight.add(Ti.UI.createTableViewRow({
	   			title: 'The door will be ' + poi[0].POIRightDoor,
	   		}));
	   	}	    	
		tableview.appendSection(sectionPoiRight);
	}
		
	var sectionPoiBehind = Ti.UI.createTableViewSection({headerTitle: 'POI behind - distance'});
	if(poi[0].POIBehind != "none") {
	   	var behind = getObjects(json, 'Code', poi[0].POIBehind);
	   	sectionPoiBehind.add(Ti.UI.createTableViewRow({
	   		title: behind[0].Name +
	   		', ' + poi[0].POIBehindDistance + ' steps',
	   		poiname: behind[0].Name,
	   		poi_id: behind[0].ID,
	   		hasChild:true
	   	}));
	   	sectionPoiBehind.add(Ti.UI.createTableViewRow({
	   			title: 'The door will be ' + poi[0].POIBehindDoor,
	   	}));
		tableview.appendSection(sectionPoiBehind);
	}
		
	var sectionPoiForward = Ti.UI.createTableViewSection({headerTitle: 'POI in front of you - distance'});
	if(poi[0].POIForward != "none") {
    	var forward = getObjects(json, 'Code', poi[0].POIForward);
    	sectionPoiForward.add(Ti.UI.createTableViewRow({
    		title: forward[0].Name +
    		', ' + poi[0].POIForwardDistance + ' steps',
    		poiname: forward[0].Name,
    		poi_id: forward[0].ID,
    		hasChild:true
    	}));
    	sectionPoiForward.add(Ti.UI.createTableViewRow({
    			title: 'The door will be ' + poi[0].POIForwardDoor,
    	}));
		tableview.appendSection(sectionPoiForward);
	}
	
	tableview.addEventListener('click', function(e) {
		if(e.rowData.poiname) {
			var Window = require('ui/common/controls/Places/poidetails'),
			win1 = new Window({
				title: e.rowData.poiname,
				containingTab:_args.containingTab,
				tabGroup:_args.tabGroup,
				poi_id_passed:e.rowData.poi_id
			});
			_args.containingTab.open(win1,{animated:true});
			//win.close(); //if you want to close the parent window after switching to the new one...
		}
		if(e.rowData.start_id != undefined){
			var Window = require('ui/common/controls/places'),
			win1 = new Window({
				title: 'Where do you want to go?',
				containingTab:_args.containingTab,
				tabGroup:_args.tabGroup,
				start_id_passed:e.rowData.start_id
			});
			_args.containingTab.open(win1,{animated:true});
		}
		if(e.rowData.end_id != undefined){
			var Window = require('ui/common/controls/places'),
			win1 = new Window({
				title: 'Where do you want to start from?',
				containingTab:_args.containingTab,
				tabGroup:_args.tabGroup,
				end_id_passed:e.rowData.end_id
			});
			_args.containingTab.open(win1,{animated:true});
		}
	});
	
	
	win.add(tableview);

	return win;
};

module.exports = poidetails;
