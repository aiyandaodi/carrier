// JavaScript Document

//显示字段数组
var items = new Array("device_name","device_type","device_ini","device_valid","device_port","device_baudrate","device_databits","device_flowcontrol","device_parity","device_stopbits","device_sendspeed");

//获得显示的字段
function editNew(device_id){
	
  var params={};
  params["objectName"]="Device";
  params["action"]="getEdit";
  params["device_id"]=device_id;

  getEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"add-info");
}


//提交信息
function setNewInfo(device_id){
	var mydata=getSerializeObjectParameters("set_form") || {};	//转为json
	//var formData = $("#set_form").serialize();
	//var mydata = strToJSON(formData) || {};	//转为json
    //alert(decodeURIComponent(mydata["organization_tag"]));
	mydata["objectName"] = "Device";
	mydata["action"] = "setInfo";
	mydata["device_id"]=device_id;
	
	editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);
}
