
function init(){

	if (tek.common.isLoggedIn()) {
			showMessage("系统进入控制台界面...");
			setTimeout(function () {
				tek.common.callPage("control.html", callbackURL);
			}, 2000);
		} else {
			showMessage("系统要求您登录...");
			setTimeout("goLogin()", 2000);
		}
		
}