// JavaScript Document

//显示字段数组
var items = new Array("answer_answerkey");

//获得显示的字段
function getEditInfo(){
  var params={};
  params["objectName"]="MobileAnswer";
  params["action"]="getEdit";
  params["answer_id"]=request["answer_id"];

  getEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"edit-info");
}

//提交信息
function commitInfo(){
	var mydata=getSerializeObjectParameters("edit_form") || {};	//转为json

	if(mydata.application_time){
		var application_time = mydata.application_time;
		var start_year = application_time.substring(0,4);
		var start_month = application_time.substring(5,7);
		var start_day = application_time.substring(8,10);
		var start = start_year+"/"+start_month+"/"+start_day+" 00:00:00";
		mydata["application_time"] = new Date(start).getTime();
	}
	
	mydata["objectName"] = "MobileAnswer";
	mydata["action"] = "setInfo";
	mydata["answer_id"] = request["answer_id"];
	
	editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);
}

