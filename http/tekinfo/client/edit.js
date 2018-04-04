// JavaScript Document
var request = tek.common.getRequest();
//显示字段数组
var items = new Array("client_code", "client_name", "client_type", "client_status", "client_domain", "client_token", "client_tokenSecret", "client_start", "client_end", "client_userName", "client_phone", "client_email", "client_postCode", "client_address", "client_remark");

function init(){
	showClose=request["show-close"];
	if(showClose && (showClose==1 || showClose==true)){
		showClose=1;
	}else{
		showClose=0;
	}
	
	callbackURL=request["callback-url"];
	if(callbackURL){
		callbackURL=decodeURIComponent(callbackURL);
	}

	updateOpener=request["refresh-opener"];
	if(updateOpener && (updateOpener==1 || updateOpener==true)){
		updateOpener=1;
	}else{
		 updateOpener=0;
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
  var params={};
  params["objectName"]="Client";
  params["action"]="getEdit";
  params["client_id"]=request["client_id"];

  tek.macEdit.getEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"set-info");
}
tek.macEdit.appendCustomEditField = function(field,record) {
	var html = "";
	
  	if(!field || !record){
		return html;
  	}
  	var fieldname=field.name;    //域名
  	if(!fieldname || fieldname.length<=0){
	   	return html;
  	}
  	if(fieldname=="client_token" || fieldname=="client_tokenSecret") {
  		html += "<div id='";
		html += fieldname;
    	html += "-form-group' class='form-group'>";
    	tek.macEdit.appendNameField(field);
    	html += "<div class='col-xs-9'>";
    	tek.macEdit.appendTextField(field);
    	html += "<span id='password-msg' style='color:red;'></span>";
    	html += "</div>";
    	html += "</div>";	
  	}else{
    	html += tek.macEdit.appendDefaultEditField(field,record);
  	}
	return html;
}

//提交信息
function commitInfo(){
	var mydata=tek.common.getSerializeObjectParameters("set_form") || {};	//转为json

	var clientStart=mydata["client_start"];
	if(clientStart){
		clientStart=decodeURIComponent(clientStart);
		var start_year = clientStart.substring(0,4);
		var start_month = clientStart.substring(5,7);
		var start_day = clientStart.substring(8,10);
		var start = start_year+"/"+start_month+"/"+start_day+" 00:00:00";
		mydata["client_start"] = new Date(start).getTime();
	}
	var clientEnd=mydata["client_end"];
	if(clientEnd){
		clinentEnd=decodeURIComponent(clientEnd);
		var end_year=clientEnd.substring(0,4);
		var end_month=clientEnd.substring(5,7);
		var end_day=clientEnd.substring(8,10);
		var end=end_year+"/"+end_month+"/"+end_day+" 00:00:00";
		mydata["client_end"]=new Date(end).getTime();
	}
	
	mydata["objectName"]="Client";
	mydata["action"]="setInfo";
	mydata["client_id"]=request["client_id"];
	
	tek.macEdit.editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);
}

