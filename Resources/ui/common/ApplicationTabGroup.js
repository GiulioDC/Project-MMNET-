
var messageWin;

function ApplicationTabGroup() {
	//create module instance
	var self = Ti.UI.createTabGroup(),
		ScannerWindow = require('ui/common/ScannerWindow'),
		ControlsWindow = require('ui/common/ControlsWindow'),
		HelpWindow = require('ui/common/HelpWindow');
	
/*CREATE APP TABS*/
	
	
	var scannerWin = new ScannerWindow(L('QR Scan')),
		controlsWin = new ControlsWindow(L('IDEA')),
		helpWin = new HelpWindow(L('Help'));
		
	//barcode scanner tab
	var scannerTab = Ti.UI.createTab({
		title: L('QR Scan'),
		icon: '/images/phone_camera.png',
		window: scannerWin
	});
	scannerWin.containingTab = scannerTab;
	
	self.addTab(scannerTab);
	
	//controls tab
	var controlsTab = Ti.UI.createTab({
		title: L('Places'),
		icon: '/images/places.png',
		window: controlsWin
	});
	controlsWin.containingTab = controlsTab;
	self.addTab(controlsTab);
	
	self.setActiveTab(1); //this tab will be the active at app opening
	
	//help tab
	var helpTab = Ti.UI.createTab({
		title: L('Help'),
		icon: '/images/help.png',
		window: helpWin
	});
	helpWin.containingTab = helpTab;
	self.addTab(helpTab);
	
	self.model = Ti.Platform.model;
	
	return self;
};

module.exports = ApplicationTabGroup;
