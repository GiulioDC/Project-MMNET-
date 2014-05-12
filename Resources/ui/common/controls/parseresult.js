function parseresult() {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white'
	});
	
	//This can't happen until the window is opened. Otherwise properties attached to the window wont exist yet. -AD
	win.addEventListener('open', function() {
		// pull properties off of current window object an display
		var l = Titanium.UI.createLabel({
			top:0,
			height:'auto',
			width:300,
			color:'#777',
			font:{fontSize:16},
			text:'Place code: ' + win.myFunc()
		});
		win.add(l);
	});
	
	
	return win;
};

module.exports = parseresult;

