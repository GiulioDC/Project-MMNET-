function download(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#dddddd'
	});

var url = "http://www.gstorm.eu/dc.txt";

var tabledata = [];
var tableview = Titanium.UI.createTableView({
		data:tabledata
	});
	
var DataManager = {
    send: function(toWhere, data, callback, context)
    {
        // Fail
            if (!toWhere) {
            return false;
        }
        
        // Defaults
        data     = data     || {}; // The data to send to the server
        callback = callback || function(_r) { return _r; }; // The callback. If none is supplied, will just return the result
        context  = context  || null; // The object that 'this' will refer to in the callback
        
        if (Ti.Network.online) {
            var XHR = Ti.Network.createHTTPClient({
                onload: function() {
                    var result = JSON.parse(this.responseText);
                    alert(console.log(json));
                    return callback.apply(context, [result]);
                },
                onerror: function() {
                    var result = JSON.parse(this.responseText);
                    alert('There was an error with the connection. Please try again later.');
                
                    return result;
                }
            });
        
            XHR.setTimeout(15000); // 15s is my timeout. Use your own here
            
            XHR.open('GET', url + toWhere, false);
            XHR.send(data);
        } else {
            // Handle offline here
            alert('You are offline');
        }
    }
};
//Using this object in the global scope, you can just type:
//DataManager.send('user/new', { myVar: 'some value' }, this.processXHR(), this);
	
// var json, i, row, nameLabel, nickLabel;
// var DataType, EngineVersion, HowManyBuildings, Builndings, BuildingName, HowManyFloors, Floors, FloorName, FloorNumber;
// var HowManyPois, POIs, Code, POIName, POIDescription, POILocation, POILeft, POIRight, POIBehind, POIForward;
// 
// var xhr = Ti.Network.createHTTPClient({
    // onload: function() {
	// //Ti.API.debug(this.responseText);
	// // alert(this.responseText);
// 		
	// json = JSON.parse(this.responseText);
// 	
// //alert(console.log(json));
// 
// 	
	// for (i = 0; i < json.HowManyBuildings; i++) {
	    // var building = json.Buildings[i];
	    // row = Ti.UI.createTableViewRow({
	        // height:'60dp'
	    // });
	    // nameLabel = Ti.UI.createLabel({
	        // text:'Name: ' + building.BuildingName,
	        // font:{
	            // fontSize:'24dp',
		    	// fontWeight:'bold'
			// },
		// // height:'auto',
		// // left:'20dp',
		// // top:'20dp',
		// color:'#000',
		// touchEnabled:false
	    // });
	    // nickLabel = Ti.UI.createLabel({
		// text:'Number of floors: ' + building.HowManyFloors,
		// font:{
		    // fontSize:'16dp'
		// },
		// // height:'auto',
		// // left:'15dp',
		// // bottom:'5dp',
		// top: '40dp',
		// color:'#000',
		// touchEnabled:false
	    // });
// 
	    // row.add(nameLabel);
	    // row.add(nickLabel);
	    // tabledata.push(row);
        // }
// 		
	// tableview.setData(tabledata);
    // },
    // onerror: function(e) {
	// Ti.API.debug("STATUS: " + this.status);
	// Ti.API.debug("TEXT:   " + this.responseText);
	// Ti.API.debug("ERROR:  " + e.error);
	// alert('There was an error retrieving the remote data. Try again.');
    // },
    // timeout:5000
// });


// xhr.open("GET", url);
// xhr.send();
win.add(tableview);

	return win;
};

module.exports = download;

