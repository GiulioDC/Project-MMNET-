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
	if (osname === 'iphone' || osname === 'ipad') {
		theTabGroup.open({transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
	}
	else{
		theTabGroup.open();
	}
	
		
})();
