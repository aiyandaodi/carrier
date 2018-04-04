// JavaScript Document
var request = tek.common.getRequest();

//显示字段数组
var items = new Array("authority_status", "authority_token", "authority_tokenSecret", "authority_client", "authority_user", "authority_start", "authority_end");

/*
初始化
*/
function init(){
	showClose = request["show-close"];
	if(showClose && (showClose==1 || showClose==true)){
		showClose = 1;
	}else {
		showClose = 0;
	}

	callbackURL = request["callback-url"];
	if(callbackURL){
		callbackURL = decodeURIComponent(callbackURL);
	}

	updateOpener = request["refresh-opener"];
	if(updateOpener && (updateOpener==1 || updateOpener == true)){
		updateOpener = 1;
	}else {
		updateOpener = 0;
	}

	tek.macEdit.initialButton("btn");
	
	//日历初始化
	initNoteCalender( {
		type: "note",
		daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
		datestr: "",
		begin: "2010,1"
	});

	getEditInfo();
}
//获得显示的字段
function getEditInfo(){
	var params = {};
	params["objectName"] = "Authority";
	params["action"] = "getEdit";
	params["authority_id"] = request["authority_id"];

	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "set-info");
}


//提交信息
function setNewInfo(){
	var mydata=tek.common.getSerializeObjectParameters("set_form") || {};	//转为json

	
	
	mydata["objectName"]="Authority";
	mydata["action"]="setInfo";
	mydata["authority_id"]=request["authority_id"];
	
	tek.macEdit.editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);
}
