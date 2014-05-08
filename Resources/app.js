// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	var Window;
	
	Window = require('ui/handheld/ios/ApplicationWindow');

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	
	var theTabGroup = new ApplicationTabGroup();
	theTabGroup.open({transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
	
	//var MessageWindow = require('ui/common/MessageWindow'),
		//messageWin = new MessageWindow();
		
	// Titanium.App.addEventListener('event_one', function(e) {
		// messageWin.setLabel('app.js: event one, array length = ' + e.data.length);
		// messageWin.open();
		// setTimeout(function() {
			// messageWin.close({opacity:0,duration:500});
		// },1000);
	// });
	
	// Titanium.App.addEventListener('event_two', function(e) {
		// messageWin.setLabel('app.js: event two, name = ' + e.name);
		// messageWin.open();
		// setTimeout(function() {
			// messageWin.close({opacity:0,duration:500});
		// },1000);	
	// });
	
		
})();
