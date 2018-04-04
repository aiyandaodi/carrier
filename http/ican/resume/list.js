var request = tek.common.getRequest();

function init(){
	showOpenClass("ican");
	showSubClass("resume");

	initParams();
	tek.macList.getList();
}

function initParams(){
	tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/service";  //Ajax取得列表信息的访问地址

	tek.macList.params = {};
	tek.macList.params["action"] = "getList";
}