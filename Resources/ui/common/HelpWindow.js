function HelpWindow(title) {

	var win = Ti.UI.createWindow({
  		backgroundColor: 'white',
  		title:'Help'
	});

	function addRow(obj) {

		var row = Ti.UI.createTableViewRow({
			height:Ti.UI.SIZE,
			layout: 'horizontal',
		});

		var view = Ti.UI.createView({
			bottom: 10,
    		height: Ti.UI.SIZE,
    		layout: 'vertical',
    		top: 20
		});
		row.add(view);
	
		var titleLabel = Ti.UI.createLabel({
			text: obj.title || '',
			font: {fontSize: 16, fontWeight: 'bold'},
			height: Ti.UI.SIZE,
    		left: 10,
   			right: 10,
    		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		view.add(titleLabel);
	
		if(obj.text){
			var textLabel = Ti.UI.createLabel({
				text: obj.text || '',
				height: Ti.UI.SIZE,
    			left: 10,
    			right: 10,
    			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
			});
			view.add(textLabel);
		}
		return row;
	}

	var data = [
		{title: 'Welcome to Interactive Discovery and Environmental Assistance app.'},
		{title: 'QR CODES DISPOSITION', text: 'You will find QR Codes to scan next to every room label, which is generally placed next to the door.'},
		{title: 'HOW TO SCAN?', text: 'To scan, go to "QR Scan" Tab, click on "Scan Code" and face the phone towards the wall, at middle height. When a QR code is found, the app will automatically redirect you to the result window.'},
		{title: 'NAVIGATION', text: 'You can also search manually for the destination or starting point, just go on "Places Tab", search for the Point of Interest you desire and then choose if you want to go there or start from there.'}
	];

	var rows = [], intRow = 0, intRows = data.length;
	for (intRow = 0; intRow < intRows; intRow = intRow + 1) {
    	rows.push(addRow({
        	title: data[intRow].title,
        	text: data[intRow].text
   		}));
    }
	
	var tableview = Ti.UI.createTableView({
    	data: rows,
    	height: Ti.UI.FILL,
    	minRowHeight: 40,
    	width: Ti.UI.FILL
	});
	win.add(tableview);

	return win;
	};

module.exports = HelpWindow;