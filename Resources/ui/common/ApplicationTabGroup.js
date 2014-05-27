
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
	
	self.model = Ti.Platform.model;
	
	return self;
};

module.exports = ApplicationTabGroup;
