function gotopoi(_args) {
	var win = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'#dddddd'
	});
	
	var search = Titanium.UI.createSearchBar({
		barColor:'dddddd',
		showCancel:true,
		height:43,
		top:0
	});
	
	win.add(search);
	
	
	
	//
	// TOGGLE CANCEL BUTTON
	//
	var b3 = Titanium.UI.createButton({
		title:'Toggle Cancel',
		height:40,
		width:200,
		top:160,
	});
	win.add(b3);
	b3.addEventListener('click', function()
	{
		search.showCancel = (search.showCancel === true)?false:true;
	});
	
	
	
	//
	// HIDE/SHOW
	//
	var b5 = Titanium.UI.createButton({
		title:'Hide/Show',
		height:40,
		width:200,
		top:260
	});
	win.add(b5);
	var visible = true;
	b5.addEventListener('click', function()
	{
		if (!visible)
		{
			search.show();
			visible=true;
		}
		else
		{
			search.hide();
			visible=false;
		}
	});
	
	//
	// SEARCH BAR EVENTS
	//
	search.addEventListener('cancel', function(e)
	{
		Titanium.API.info('search bar cancel fired');
		search.blur();
	});
	search.addEventListener('return', function(e)
	{
		Titanium.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();
		search.blur();
	});

	return win;
}

module.exports = gotopoi;
	