function poilist(_args) {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: _args.title
	});
	
	var tabledata = [];
	var tableview = Titanium.UI.createTableView({
		data:tabledata,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
	});

	Ti.App.fireEvent('getdata');
	var temp = getdata();	
	var readText = temp.read();
	json = JSON.parse(readText);
	
	Ti.App.fireEvent('getobjects');
	Ti.App.fireEvent('getvalues');

	var poilist = getValues(json, "ID");
	
	
	var row = Ti.UI.createTableViewRow({
	    height:Ti.UI.SIZE,
	    layout: 'vertical'
	});





	return win;
};

module.exports = poilist;
