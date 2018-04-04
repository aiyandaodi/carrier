// JavaScript Document
//显示字段数组
var items = [
    "qualification_name",
    "qualification_grade",
    "qualification_authorizer",
    "qualification_type"];



var qualification_id;  //获取id
 
/**
* 初始化
*/
function init(){
	
	qualification_id = request["qualification_id"];
	
	tek.macEdit.initialButton("btn");
	if(qualification_id){
		editNew();
	}
	
}
//获得显示的字段
function editNew() {
    var params = {};
    params["objectName"] = "Qualification";
    params["action"] = "getEdit";
    params["qualification_id"] = qualification_id;

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "set-info");
}

//提交信息
function setNewInfo() {
    var sendData = tek.common.getSerializeObjectParameters("set-info") || {};	//转为json
    sendData["objectName"] = "Qualification";
    sendData["action"] = "setInfo";
    sendData["qualification_id"] = qualification_id;
	
	
    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);

}