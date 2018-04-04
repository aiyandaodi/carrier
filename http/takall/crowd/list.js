var request = tek.common.getRequest();
//初始化
function init(){
	showOpenClass("group_space");
	showSubClass("crowd");

	initParams();
	tek.macList.getList();
}

function initParams(){
	tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";
	tek.macList.params = {};

	tek.macList.params["objectName"] = "Crowd";
	tek.macList.params["action"] = "getList";
	tek.macList.params["skip"] = 0;
	tek.macList.params["count"] = 10;

	tek.macList.columns = [
		
	]

}


function createNew(){
	var html = tek.common.getRootPath() + "http/takall/crowd/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}