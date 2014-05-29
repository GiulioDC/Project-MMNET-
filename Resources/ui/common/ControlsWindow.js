function ControlsWindow(title) {
	var self = Ti.UI.createWindow({
		title:'IDEA',
		backgroundColor:'white'
	});
	
	// create table view data object
	var data = [
		{title:'Search place', hasChild:true, test:'ui/common/controls/places'},
		{title:'Prove', hasChild:true, test:'ui/prove'}
	];
	
	
	// create table view
	for (var i = 0; i < data.length; i++ ) { data[i].color = '#000' ; data[i].font = {fontWeight:'bold'} ; };
	var tableview = Titanium.UI.createTableView({
		data:data
	});
	
	// create table view event listener
	tableview.addEventListener('click', function(e) {
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({
					title:e.rowData.title, //passes the title of the row as title of next window
					containingTab:self.containingTab,
					tabGroup:self.tabGroup
				});
			self.containingTab.open(win,{animated:true});
		}
	});
	
	// add table view to the window
	self.add(tableview);
	
	return self;
};

module.exports = ControlsWindow;
