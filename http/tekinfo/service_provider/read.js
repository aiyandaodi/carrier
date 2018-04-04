// JavaScript Document
var showClose;    // 是否关闭
var callbackURL;    // 回调地址
var updateOpener;    //是否刷新父页面
var service_provider_id;  //获取组织机构id
var request = tek.common.getRequest();

/**
* 初始化
*/
function init(){
	service_provider_id=request["service_provider_id"];
	if(service_provider_id){
		readServiceProviderInfo();
	}
	else{
		showReadMessage("参数错误!",document.getElementById("readInfo"));
	}

	showClose=request["show-close"];
	service_provider_id=request["service_provider_id"];
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
	initBtn();


}
/**
 * 初始化按钮
 */
function initBtn() {
	if(showClose == 1){
		//显示关闭按钮
		var obj=document.getElementById("menu-btn");
		if(obj){
			var sb=new StringBuffer();
			sb.append("<a class='btn alert alert-success button-right' onclick='window.close();'><i class='fa fa-minus'>关闭</i></a>");
			obj.insertAdjacentHTML('BeforeEnd', sb.toString());
		}

	} else if (callbackURL){
		//显示返回按钮
		var obj = document.getElementById("menu-btn");
		if(obj){
			var sb=new StringBuffer();
			sb.append("<a class='btn alert alert-warning button-right'  onclick='window.location.href=\"");
			sb.append(callbackURL);
			sb.append("\";'><i class='fa fa-arrow-left'>返回</i></a>");
			obj.insertAdjacentHTML('BeforeEnd', sb.toString());
		}
	}
}
//读取信息
function readServiceProviderInfo(){

	var rows = new Array();
	rows.push("service_provider_code");
	rows.push("service_provider_name");
	rows.push("service_provider_url");
	rows.push("service_provider_port");
	rows.push("service_provider_protocol");
	rows.push("service_provider_version");
	rows.push("service_provider_param");
	rows.push("service_provider_appid");
	rows.push("service_provider_status");
	rows.push("service_provider_default");

	var params = {};
	params["objectName"] = "ServiceProvider";
	params["action"] = "readInfo";
	params["service_provider_id"] = service_provider_id;

	tek.macRead.readInfo(tek.common.getRootPath() + "servlet/tobject", params, rows, "readInfo");
}

tek.macRead.customOperation = function(data){
	if(!data){
		return ;
	}

	var editTarget = document.getElementById("menu-btn");
	if(editTarget){
		if((data.right & 8)==8){
			// 有编辑权限
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-info button-left' onclick='editClient()'><i class='fa fa-edit'>编辑</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
		
		if((data.right & 16)==16){
			// 有删除权限
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-danger button-left' onclick='deleteClient()'><i class='fa fa-trash-o'>删除</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
	}
}

//响应“编辑”按钮
function editClient(){

	var url="edit.html?service_provider_id="+service_provider_id+"&show-close=1&refresh-opener=1";
	window.open(url);
}

//响应“删除”按钮
function deleteClient(){
  var params={};
  params["objectName"]="ServiceProvider";
  params["action"]="removeInfo";
  params["service_provider_id"]=service_provider_id;

  tek.macRead.removeInfo(tek.common.getRootPath()+"servlet/tobject", params);
}