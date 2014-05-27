function startingpoi() {
	var win = Ti.UI.createWindow({
		title: 'Where are you?',
		backgroundColor:'white'
	});
	
	var plainTemplate = {
    	childTemplates: [
        {
            type: 'Ti.UI.Label', // Use a label
            bindId: 'rowtitle',  // Bind ID for this label
            properties: {        // Sets the Label.left property
                left: '10dp'
            }
        },             
        {
            type: 'Ti.UI.Button',   // Use a button
            bindId: 'button',       // Bind ID for this button
            properties: {           // Sets several button properties
                width: '80dp',
                height: '30dp',                        	
                right: '10dp',
                title: 'info'
            },
            events: { click : report }  // Binds a callback to the button's click event
        }
    	]
	};

	function report(e) {
		Ti.API.info(e.type);
	}

	var data = [];
	var listview = Ti.UI.createListView({
		//data:data,
		templates: { 'plain': plainTemplate }, // Maps the plainTemplate object to the 'plain' style name
		defaultItemTemplate: 'plain'  // Use the plain template, that is, the plainTemplate object defined earlier for all data list items in this list view
	});

	Ti.App.fireEvent('getdata'); //calls getdata function from app.js
	var poidata = getdata();	//navdata hold the entire json object
	var readpoidata = poidata.read();
	var json = JSON.parse(readpoidata);

	
  
 	Ti.App.fireEvent('getobjects'); //call getObjects function from app.js
 	var poi;
 	
 	for(var i = 0; i < path.length; i++) {
 		poi = getObjects(json, 'ID', path[i]);
 		Ti.API.info('poi[' + i + '] ' + poi[0].Name);
 		data.push({
 			rowtitle: {
 				text: poi[0].Name
 			},
 			properties : {
     			accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
        	}
 			
 		});
 		
 	}
 	
 	var section = Ti.UI.createListSection({items: data});
	listview.sections = [section];
	listview.addEventListener('itemclick', function(e){
    // Only respond to clicks on the label (rowtitle) or image (pic)
    if (e.bindId == 'rowtitle') {
        var item = e.section.getItemAt(e.itemIndex);
        if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
        }
        else {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
        }
        e.section.updateItemAt(e.itemIndex, item);
    }
        
});
  
  
  
  	win.add(listview);
	
	return win;
}

module.exports = startingpoi;