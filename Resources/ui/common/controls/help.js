function help(_args) {

var win = Ti.UI.createWindow({
  backgroundColor: 'white',
  exitOnClose: true,
  fullscreen: false,
  layout: 'vertical',
  title:_args.title
});


var label1 = Ti.UI.createLabel({
  text: 'The QR codes are placed on the wall immediately next to the door, on the room label',
  top: 30,
  width: 300, height: 200
});

win.add(label1);

return win;
}

module.exports = help;