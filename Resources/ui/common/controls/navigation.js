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

	//call functions from app.js
	Ti.App.fireEvent('navgetpois');
	Ti.App.fireEvent('navreach');
	Ti.App.fireEvent('getobjects'); 
	Ti.App.fireEvent('getvalues');
	Ti.App.fireEvent('getkeys');
	
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
  	
  	var i, poi, poinext, key, poiObj, keyvalue, keyvaluenext, keybetween, poibetween, sumsteps;
  	var sectionPoiName, sectionDirection;
  	
  	var sectionNavigation = Ti.UI.createTableViewSection({headerTitle: 'Navigation'});
		sectionNavigation.add(Ti.UI.createTableViewRow({
			title: 'From ' + startObj[0].Name + ' to ' + endObj[0].Name,
			color: 'white', backgroundColor: 'teal',
		}));
	tableview.appendSection(sectionNavigation);

	for(i = 0; i < path.length-1; i++) {
		poi = getObjects(json, 'ID', path[i]);
		poinext = getObjects(json, 'ID', path[i+1]);
		
		key = getKeys(poi[0], poinext[0].Code);
	
		
		Ti.API.info('key [' + i + '] : ' + key);
		
		sectionPoiName = Ti.UI.createTableViewSection({headerTitle: 'You are now in front of'	});
		sectionPoiName.add(Ti.UI.createTableViewRow({
			title: poi[0].Name
		}));
		tableview.appendSection(sectionPoiName);
		 
		sectionDirection = Ti.UI.createTableViewSection({headerTitle: 'To reach the next POI...'});
		if(key[0] == 'POILeft' || key[1] == 'POILeft') {
	   		sectionDirection.add(Ti.UI.createTableViewRow({
	   			title: 'Turn left and walk ' + poi[0].POILeftDistance + ' steps,',
	   		}));
	   		if(poinext[0].Info == "corner"){
    			sectionDirection.add(Ti.UI.createTableViewRow({
    				title: 'until the corner.'
	    		}));
	    	}
	   		else {
	   			sectionDirection.add(Ti.UI.createTableViewRow({
	   				title: 'you will find the POI ' + poi[0].POILeftDoor + '.',
	    		}));
	  	 	}
			tableview.appendSection(sectionDirection);
		}//key==POILeft
		
		if(key[0] == 'POIRight' || key[1] == 'POIRight') {
	   		sectionDirection.add(Ti.UI.createTableViewRow({
	   			title: 'Turn right and walk ' + poi[0].POIRightDistance + ' steps,',
	   		}));
	   		if(poinext[0].Info == "corner"){
    			sectionDirection.add(Ti.UI.createTableViewRow({
    				title: 'until the corner.'
	    		}));
	    	}
	   		else {
	   			sectionDirection.add(Ti.UI.createTableViewRow({
	   				title: 'you will find the POI ' + poi[0].POIRightDoor + '.',
	    		}));
	  	 	}
			tableview.appendSection(sectionDirection);
		}//key==POIRight
		
		if(key[0] == 'POIBehind' || key[1] == 'POIBehind') {
			if(poi[0].POIBehindDistance != 0){
	   			sectionDirection.add(Ti.UI.createTableViewRow({
	   				title: 'Turn back and walk ' + poi[0].POIBehindDistance + ' steps,',
	   			}));
	   		}
	   		else{
	   			sectionDirection.add(Ti.UI.createTableViewRow({
	   				title: 'Turn back and walk ' + poi[0].POIBehindDistance + ' steps,',
	   			}));
	   		}
	   		sectionDirection.add(Ti.UI.createTableViewRow({
	   			title: 'you will find the POI ' + poi[0].POIBehindDoor + '.',
	    	}));
			tableview.appendSection(sectionDirection);
		}//key==POIBehind
		
		if(key[0] == 'POIForward' || key[1] == 'POIForward') {
	   		sectionDirection.add(Ti.UI.createTableViewRow({
	   			title: 'Go on and walk ' + poi[0].POIForwardDistance + ' steps,',
	   		}));
	   		sectionDirection.add(Ti.UI.createTableViewRow({
	   			title: 'you will find the POI ' + poi[0].POIForwardDoor + '.',
	    	}));
			tableview.appendSection(sectionDirection);
		}//key==POIForward
		
		if(key != 'POILeft' && key != 'POIRight' && key != 'POIForward' && key != 'POIBehind'){
			keyvalue = getValues(poi[0], 'ID');
			Ti.API.info('keyvalue: ' + keyvalue);
			if(poinext[0].ID > poi[0].ID) {
				keyvaluenext = keyvalue[0]+1;
			}
			else if (poinext[0].ID < poi[0].ID){
				keyvaluenext = keyvalue[0]-1;
			}
			Ti.API.info('Keyvaluenext: ' + keyvaluenext);
			poibetween = getObjects(json, 'ID', keyvaluenext);
			keybetween = getKeys(poi[0], poibetween[0].Code);
			Ti.API.info('keybetween : ' + keybetween);
			
			if(keybetween == 'POILeft') {
				sumsteps = poi[0].POILeftDistance + poibetween[0].POIRightDistance; //fuck
				Ti.API.info('poi[0].POILeftDistance : ' + poi[0].POILeftDistance);
				Ti.API.info('poibetween[0].POIRightDistance: ' + poibetween[0].POIRightDistance);
				Ti.API.info('sumsteps: ' + sumsteps);
				sectionDirection.add(Ti.UI.createTableViewRow({
	   				title: 'Turn left and walk ' + sumsteps + ' steps,',
	   			}));
	   			sectionDirection.add(Ti.UI.createTableViewRow({
	   				title: 'you will find the POI ' + poibetween[0].POIRightDoor + '.',
	    		}));
				tableview.appendSection(sectionDirection);
			}//keybetween==POILeft
			
			if(keybetween == 'POIRight') {
				sumsteps = poi[0].POIRightDistance + poibetween[0].POILeftDistance;
				sectionDirection.add(Ti.UI.createTableViewRow({
	   				title: 'Turn right and walk ' + sumsteps + ' steps,',
	   			}));
	   			sectionDirection.add(Ti.UI.createTableViewRow({
	   				title: 'you will find the POI ' + poibetween[0].POILeftDoor + '.',
	    		}));
				tableview.appendSection(sectionDirection);
			}//keybetween==POIRight
						
		}//key==ID
		
	}//for
 	
 	var sectionPoiLast = Ti.UI.createTableViewSection({headerTitle: 'You are now arrived in front of'});
	sectionPoiLast.add(Ti.UI.createTableViewRow({
		title: endObj[0].Name,
		font:{ fontSize:'20dp', fontWeight:'bold'},
		color: 'white', backgroundColor: 'red',
	}));
	tableview.appendSection(sectionPoiLast);
 	
 	win.add(tableview);

	return win;
};

module.exports = navigation;