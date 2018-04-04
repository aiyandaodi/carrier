// JavaScript Document

//显示字段数组
var items = new Array("device_name","device_type","device_ini","device_valid","device_port","device_baudrate","device_databits","device_flowcontrol","device_parity","device_stopbits","device_sendspeed");

//获得显示的字段
function addNew(){
	
	var params={};
	params["objectName"]="Device";
	params["action"]="getNew";
  
	getEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"add-info");
}


//提交信息
function addNewInfo(){
	
	var mydata=getSerializeObjectParameters("add_form") || {};	//转为json
	
	mydata["objectName"] = "Device";
	mydata["action"] = "addInfo";
	
	editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);	
}


