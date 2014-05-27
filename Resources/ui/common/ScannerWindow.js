function ScannerWindow(title) {
	var self = Ti.UI.createWindow({
		title:'QR Scan',
		backgroundColor:'white'
	});
var tab = [];
	
var Barcode = require('ti.barcode');
Barcode.allowRotation = true;
Barcode.displayedMessage = '';
Barcode.useLED = false;


var scrollView = Ti.UI.createScrollView({
    contentWidth: 'auto',
    contentHeight: 'auto',
    top: 0,
    showVerticalScrollIndicator: true,
    layout: 'vertical'
});

/**
 * Create a chrome for the barcode scanner.
 */
var overlay = Ti.UI.createView({
    backgroundColor: 'transparent',
    top: 0, right: 0, bottom: 0, left: 0
});
// var switchButton = Ti.UI.createButton({
    // title: Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera',
    // textAlign: 'center',
    // color: '#000', backgroundColor: '#fff', style: 0,
    // font: { fontWeight: 'bold', fontSize: 16 },
    // borderColor: '#000', borderRadius: 10, borderWidth: 1,
    // opacity: 0.5,
    // width: 220, height: 30,
    // bottom: 10
// });
// switchButton.addEventListener('click', function () {
    // Barcode.useFrontCamera = !Barcode.useFrontCamera;
    // switchButton.title = Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera';
// });
// overlay.add(switchButton);

var toggleLEDButton = Ti.UI.createButton({
    title: Barcode.useLED ? 'LED is On' : 'LED is Off',
    textAlign: 'center',
    color: '#000', backgroundColor: '#fff', style: 0,
    font: { fontWeight: 'bold', fontSize: 16 },
    borderColor: '#000', borderRadius: 10, borderWidth: 1,
    opacity: 1,
    width: 220, height: 30,
    bottom: 40
});
toggleLEDButton.addEventListener('click', function () {
    Barcode.useLED = !Barcode.useLED;
    toggleLEDButton.title = Barcode.useLED ? 'LED is On' : 'LED is Off';
});
overlay.add(toggleLEDButton);

var cancelButton = Ti.UI.createButton({
    title: 'Cancel', textAlign: 'center',
    color: '#000', backgroundColor: '#fff', style: 0,
    font: { fontWeight: 'bold', fontSize: 16 },
    borderColor: '#000', borderRadius: 10, borderWidth: 1,
    opacity: 1,
    width: 220, height: 30,
    top: 20
});
cancelButton.addEventListener('click', function () {
    Barcode.cancel();
});
overlay.add(cancelButton);

/**
 * Create a button that will trigger the barcode scanner.
 */
var scanCode = Ti.UI.createButton({
    title: 'Scan Code',
    top: 20, width: 220, height: 40,
    color: 'white', backgroundColor: 'black', style: 0,
    borderColor: 'white', borderRadius: 10, borderWidth: 1,
    opacity: 1
});
scanCode.addEventListener('click', function () {
    reset();
    // Note: while the simulator will NOT show a camera stream in the simulator, you may still call "Barcode.capture"
    // to test your barcode scanning overlay.
    Barcode.capture({
        animate: false,
        overlay: overlay,
        showCancel: false,
        showRectangle: true,
        keepOpen: false/*,
        acceptedFormats: [
            Barcode.FORMAT_QR_CODE
        ]*/
    });
});
scrollView.add(scanCode);

/**
 * Create a button that will show the gallery picker.
 */
var scanImage = Ti.UI.createButton({
    title: 'Scan Image from Gallery',
    width: 220, height: 40, top: 20,
    color: 'white', backgroundColor: 'black', style: 0,
    borderColor: 'white', borderRadius: 10, borderWidth: 1,
    opacity: 1
});
scanImage.addEventListener('click', function () {
    reset();
    Ti.Media.openPhotoGallery({
        success: function (evt) {
            Barcode.parse({
                image: evt.media/*,
                acceptedFormats: [
                    Barcode.FORMAT_QR_CODE
                ]*/
            });
        }
    });
});
scrollView.add(scanImage);

/**
 * Now listen for various events from the Barcode module. This is the module's way of communicating with us.
 */
var scannedBarcodes = {}, scannedBarcodesCount = 0;
function reset() {
    scannedBarcodes = {};
    scannedBarcodesCount = 0;
    cancelButton.title = 'Cancel';
}
Barcode.addEventListener('error', function (e) {
    scanResult.text = e.message;
});
Barcode.addEventListener('cancel', function (e) {
    Ti.API.info('Cancel received');
});
Barcode.addEventListener('success', function (e) {
    Ti.API.info('Success called with barcode: ' + e.result);
    if (!scannedBarcodes['' + e.result]) {
        scannedBarcodes[e.result] = true;
        scannedBarcodesCount += 1;
        cancelButton.title = 'Finished (' + scannedBarcodesCount + ' Scanned)';

        scanResult.text += e.result + ' ';
        
        var W2 = require('ui/common/controls/parseresult'),
			w2 = new W2();
			// w2.title = 'Go To POI';			
		w2.searchinput = function()
		{
			return scanResult.text;
		};
		self.containingTab.open(w2,{animated:true});	
    }
});

/**
 * Finally, we'll add a couple labels to the window. When the user scans a barcode, we'll stick information about it in
 * to these labels.
 */

scrollView.add(Ti.UI.createLabel({
    text: 'Result: ', textAlign: 'left',
    top: 10, left: 10,
    color: 'black',
    height: Ti.UI.SIZE || 'auto'
}));
var scanResult = Ti.UI.createLabel({
    text: ' ', textAlign: 'left',
    top: 10, left: 10,
    color: 'black',
    height: Ti.UI.SIZE || 'auto'
});
scrollView.add(scanResult);

var searchresult = Ti.UI.createButton({
    title: 'search',
    width: 110, height: 30,
    color: 'white', backgroundColor: 'navy', style: 0,
    borderColor: 'white', borderRadius: 10, borderWidth: 1,
    opacity: 1
});

searchresult.addEventListener('click', function () {
// set properties on the window object, then open.  we will print them out in the new window
		var W2 = require('ui/common/controls/parseresult'),
			w2 = new W2();
			// w2.title = 'Go To POI';			
		w2.searchinput = function()
		{
			return scanResult.text;
		};
		self.containingTab.open(w2,{animated:true});	
});
scrollView.add(searchresult);

 	
self.add(scrollView);
 return self;
 };

module.exports = ScannerWindow;
