function gotopoi(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'white'
	});
	
	var search = Titanium.UI.createSearchBar({
		barColor:'#dddddd',
		showCancel:true,
		height:43,
		top:0
	});
	
	win.add(search);
	
	//
	// SEARCH BAR EVENTS
	//
	
	search.addEventListener('return', function(e)
	{
		Titanium.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();
		search.blur();
	});
	

	return win;
}

module.exports = gotopoi;
	