
var messageWin;

function ApplicationTabGroup() {
	//create module instance
	var self = Ti.UI.createTabGroup(),
		ScannerWindow = require('ui/common/ScannerWindow'),
		ControlsWindow = require('ui/common/ControlsWindow');
	
	//create app tabs
	var scannerWin = new ScannerWindow(L('QR Scan')),
		controlsWin = new ControlsWindow(L('IDEA'));
	
	var scannerTab = Ti.UI.createTab({
		title: L('QR Scan'),
		icon: '/images/tableview/phone_camera.png',
		window: scannerWin
	});
	scannerWin.containingTab = scannerTab;
	
	self.addTab(scannerTab);
	
	var controlsTab = Ti.UI.createTab({
		title: L('Controls'),
		icon: '/images/tabs/KS_nav_views.png',
		window: controlsWin
	});
	controlsWin.containingTab = controlsTab;
	self.addTab(controlsTab);
	
	
	self.setActiveTab(1);
	
	
	// Tabgroup events and message window
	// messageWin = Titanium.UI.createWindow({
		// height:30,
		// width:250,
		// bottom:70,
		// borderRadius:10,
		// touchEnabled:false,
		// orientationModes : [
			// Titanium.UI.PORTRAIT,
			// Titanium.UI.UPSIDE_PORTRAIT,
			// Titanium.UI.LANDSCAPE_LEFT,
			// Titanium.UI.LANDSCAPE_RIGHT
		// ]
	// });
	// if (Ti.Platform.osname === 'iphone') {
		// messageWin.orientationModes = [Ti.UI.PORTRAIT];
	// }
// 	
	// var messageView = Titanium.UI.createView({
		// id:'messageview',
		// height:30,
		// width:250,
		// borderRadius:10,
		// backgroundColor:'#000',
		// opacity:0.7,
		// touchEnabled:false
	// });
// 		
	// var messageLabel = Titanium.UI.createLabel({
		// id:'messagelabel',
		// text:'',
		// color:'#fff',
		// width:250,
		// height:'auto',
		// font:{
			// fontFamily:'Helvetica Neue',
			// fontSize:13
		// },
		// textAlign:'center'
	// });
	// messageWin.add(messageView);
	// messageWin.add(messageLabel);
	
	self.addEventListener('close', function(e) {
		if (e.source == self){
			if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
				self.open();
			}
		}
	});
	
	// self.addEventListener('open',function(e) {
		// if (e.source == self){
			// Titanium.UI.setBackgroundColor('#fff');
			// messageLabel.text = 'tab group open event';
			// messageWin.open();
// 	
			// setTimeout(function() {
				// messageWin.close({opacity:0,duration:500});
			// },1000);
		// }
	// });
	
	// self.addEventListener('focus', function(e) {
		// // On iOS, the "More..." tab is actually a tab container, not a tab. When it is clicked, e.tab is undefined.
		// if (!e.tab) {
			// return;
		// }
// 
		// // iOS fires with source tabGroup. Android with source tab
		// if ((e.source == baseUITab) || (e.source == controlsTab) || (e.source == self)) {
// 
			// messageLabel.text = 'tab changed to ' + e.index + ' old index ' + e.previousIndex;
			// messageWin.open();
// 
			// setTimeout(function() {
				// Ti.API.info('tab = ' + e.tab.title + ', prevTab = ' + (e.previousTab ? e.previousTab.title : null));
				// messageLabel.text = 'active title ' + e.tab.title + ' old title ' + (e.previousTab ? e.previousTab.title : null);
			// }, 1000);
// 
			// setTimeout(function() {
				// messageWin.close({
					// opacity : 0,
					// duration : 500
				// });
			// }, 2000);
		// }
// 
	// }); 
	
	self.addEventListener('blur', function(e) {
		Titanium.API.info('tab blur - new index ' + e.index + ' old index ' + e.previousIndex);
	});
	self.model = Ti.Platform.model;
	
	return self;
};

module.exports = ApplicationTabGroup;
