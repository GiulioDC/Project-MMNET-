function poidetails(_args) {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: _args.title,
		poi_id: _args.poi_id_passed
	});

	
	var data = [];
	var tableview = Titanium.UI.createTableView({
		data:data,
		style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
		layout:'vertical'
	});

	Ti.App.fireEvent('getdata');
	Ti.App.fireEvent('getobjects');
	Ti.App.fireEvent('getvalues');
	var temp = getdata();	
	var readText = temp.read();
	json = JSON.parse(readText);
	
	
	
	
	win.add(tableview);

	return win;
};

module.exports = poidetails;
