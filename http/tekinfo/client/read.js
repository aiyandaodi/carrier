//javascript document

var clientId;

var showClose;    // 是否关闭
var callbackURL;    // 回调地址
var updateOpener;    //是否刷新父页面
var request = tek.common.getRequest();

function init(){
	clientId=request["client_id"];
	if(clientId){
		readClient();
	}
	else{
		showReadMessage("参数错误!",document.getElementById("readInfo"));
	}
		
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
	initBtn();
}

/**
 * 初始化按钮
 */
function initBtn() {
	if(showClose==1){
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

//读取客户端信息
function readClient(){
	var rows = new Array();
	rows.push('client_code');
	rows.push('client_name');
	rows.push('client_domain');
	rows.push('client_token');
	rows.push('client_tokenSecret');
	rows.push('client_start');
	rows.push('client_end');
	rows.push('client_type');
	rows.push('client_status');
	rows.push('ccreateTime');
	rows.push('createIp');
	rows.push('client_userName');
	rows.push('client_phone');
	rows.push('client_email');
	rows.push('client_postCode');
	rows.push('client_address');
	rows.push('client_remark');
    
	var params={};
    params["objectName"]="Client";
	params["action"]="readInfo";
	params["client_id"]=clientId;
	
	tek.macRead.readInfo(tek.common.getRootPath()+"servlet/tobject",params,rows,"readInfo");
}

/**
 * 自定义操作
 */
function customOperation(data){
	if(!data)
		return;

	var editTarget=document.getElementById("menu-btn");
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
	var url="edit.html?client_id="+clientId+"&show-close=1&refresh-opener=1";
	window.open(url);
}

//响应“删除”按钮
function deleteClient(){
  var params={};
  params["objectName"]="Client";
  params["action"]="removeInfo";
  params["client_id"]=clientId;

  removeInfo(tek.common.getRootPath()+"servlet/tobject", params);
}
