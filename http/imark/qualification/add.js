// JavaScript Document

//显示字段数组
var items = new Array("qualification_name", "qualification_grade", "qualification_authorizer", "qualification_type");


function init(){
	addNew();
}


//获得显示的字段
function addNew(){
	var params={};
	params["objectName"]="Qualification";
	params["action"]="getNew";
	

	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "qualification_form");
}

//提交新建资质信息
function submitAdd(){
	var mydata = tek.common.getSerializeObjectParameters("qualification_form") || {};	//转为json

    mydata["objectName"] = "Qualification";
    mydata["action"] = "addInfo";

    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}

function closePrompt(){
	closeMessage();
}