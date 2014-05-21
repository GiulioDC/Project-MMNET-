function floors() {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: "Floors"
	});
	var tab = [];

	var data = [];
	var tableview = Titanium.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
	});
	var buildID = 0;

	Ti.App.fireEvent('getdata');
	var temp = getdata();	
	var readText = temp.read();
	json = JSON.parse(readText);
	
	Ti.App.fireEvent('getobjects');
	Ti.App.fireEvent('getvalues');


	
	// win.addEventListener('open', function() {
		// buildID = win.passbuilding();
		// Ti.API.info('buildid ' + buildID);
	// });
	
	tableview.setData([]);
	
	// var row = Ti.UI.createTableViewRow({
	    // height:Ti.UI.SIZE,
	    // layout: 'vertical'
	// });

	for (var i = 0; i < json.HowManyBuildings; i++) {
		var building = json.Buildings[i];
		for(var j = 0; j < building.HowManyFloors; j++){

			var floornum = building.Floors[j];
			
			var sectionFloor = Ti.UI.createTableViewSection({headerTitle: 'Floor'	});
			sectionFloor.add(Ti.UI.createTableViewRow({
				title: floornum.FloorName,
				font:{ fontSize:'20dp', fontWeight:'bold'},
			}));
			sectionFloor.add(Ti.UI.createTableViewRow({
				title: 'Floor number: ' + floornum.FloorNumber
			}));
			sectionFloor.add(Ti.UI.createTableViewRow({
				title: 'Number of POIs: ' + floornum.HowManyPOIs
			}));
			tableview.appendSection(sectionFloor);
			
			

				
				
				
				

// 			
			// var floornameLabel = Ti.UI.createLabel({
				// text: floornum.FloorName
			// });
			// row.add(floornameLabel);
// 			
			// var floornumLabel = Ti.UI.createLabel({
				// text: 'Floor number: ' + floornum.FloorNumber
			// });
			// row.add(floornumLabel);
// 			
			// var floorpoisLabel = Ti.UI.createLabel({
				// text: 'Number of POIs: ' + floornum.HowManyPOIs
			// });
			// row.add(floorpoisLabel);
			// tableview.appendRow(row);
			
			// floornameLabel.addEventListener('click', function(e){
				// var WinPois = require('ui/common/controls/poilist'),
				// winpoilist = new WinPois();
				// winpoilist.title = 'List of Point of Interest';	
// 			
				// winpoilist.passfloornum = function() {
					// return j;
				// };
// 			
				// tab.open(winfloors,{animated:true});
			// });

			var sectionPoiName = Ti.UI.createTableViewSection({headerTitle: 'Points Of Interest'	});
			for(var k = 0; k < floornum.HowManyPOIs; k++) {
				
				var poiname = floornum.POIs[k];
				
				sectionPoiName.add(Ti.UI.createTableViewRow({
					title: poiname.Name
				}));
				
				
			} //k
			tableview.appendSection(sectionPoiName);
		}//chiusura for j
	} //chiusura for i


	

	
	win.add(tableview);


	return win;
};

module.exports = floors;
