function navigation() {
	var win = Titanium.UI.createWindow({
		backgroundColor:'white',
		title: "Navigation"
	});
	

	Ti.App.fireEvent('getdata'); //calls getdata function from app.js
	var navdata = getdata();	//navdata hold the entire json object
	var readnavdata = navdata.read();
	var json = JSON.parse(readnavdata);
	
	Ti.App.fireEvent('navgetpois');
	Ti.App.fireEvent('navreach');
	var pois_temp = nav_get_POIs(json, 1, -1);
	var arr = {};
  	arr = nav_reach(pois_temp,"0101", "0002");
  	Ti.API.info('ARRIVO: ' + arr);
  	for(var k = 0; k < arr.length; k++) {
  		Ti.API.info('ARR[' + k + '] = ' + arr[k]);
  	}
  	Ti.API.info('arrivo: ' + arr[0]);
  

	return win;
};

module.exports = navigation;

