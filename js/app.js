'use strict';

var CordovaInit = function() {

	if (window.cordova) {
		document.addEventListener('deviceready', function() {
			console.log('Arranco backbone desde cordova');
			boot();
		});
	} else {
		console.log('Arranco backbone desde web');
		boot();
	}
	
	function boot(){
		// Arrancar
	}
};

$(function() {
	new CordovaInit();
});