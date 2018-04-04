// JavaScript Document
var authorityId;
var showClose;
var callbackURL;
var updateOpener;

var request = tek.common.getRequest();

/*初始化*/
function init(){
	authorityId = request["authority_id"];
	if(authorityId){
		readAuthority();
	}else{
		showReadMessage("参数错误!", document.getElementById("readInfo"));
	}

	showClose = request["show-close"];
	if(showClose && (showClose == 1 || showClose == true)){
		showClose = 1;
	}else {
		showClose = 0;
	}
	callbackURL = request["callback-url"];
	if(callbackURL){
		callbackURL = decodeURIComponent(callbackURL);
	}

	updateOpener = request["refresh-opener"];
	if(updateOpener && (updateOpener == 1 || updateOpener == true)){
		updateOpener = 1;
	}else {
		updateOpener = 0;
	}
	initBtn();
}
/*
	初始化按钮
*/
function initBtn(){
	if(showClose == 1){
		//显示关闭按钮
		var obj = document.getElementById("menu-btn");
		if(obj){
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-success button-right' onclick='window.close();'><i class='fa fa-minus'>关闭</i></a>");
			obj.insertAdjacentHTML('BeforeEnd', sb.toString());
		}
	}else if(callbackURL){
		//显示返回按钮
		var obj = document.getElementById("menu-btn");
		if(obj){
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-warning button-right'  onclick='window.location.href=\"");
			sb.append(callbackURL);
			sb.append("\";'><i class='fa fa-arrow-left'>返回</i></a>");
			obj.insertAdjacentHTML("BeforeEnd", sb.toString());
		}
	}
}

//读取信息
function readAuthority(){
	var rows = new Array();

	rows.push('authority_name');
	rows.push('authority_type');
	rows.push('authority_status');
	rows.push('authority_client');
	rows.push('authority_user');

	rows.push('authority_start');
	rows.push('authority_end');
	rows.push('createTime');
	rows.push('modifyTime');
	rows.push('authority_pwdstrength');

	var params={};
    params["objectName"]="Authority";
	params["action"]="readInfo";
	params["authority_id"]=authorityId;
	//tek.macRead.readInfo(tek.common.getRootPath()+"servlet/tobject", params, rows, "readInfo");
	tek.macRead.readInfo(tek.common.getRootPath()+"servlet/tobject",params,rows,"readInfo");
}

/*
自定义操作
*/
function customOperation(data){
	if(!data)
		return;

	var editTarget=document.getElementById("menu-btn");
	if(editTarget){
		/*if((data.right & 8)==8){
			// 有编辑权限
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-info button-left' onclick='editRecord()'><i class='fa fa-edit'>编辑</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}*/
		
		if(tek.right.isCanDelete(data.right)){
			// 有删除权限
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-danger button-left' onclick='deleteRecord()'><i class='fa fa-trash-o'>删除</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
	}
}

//响应“删除”按钮
function deleteRecord(){
  var params={};
  params["objectName"]="ObjectRecord";
  params["action"]="removeInfo";
  params["record_id"]=recordId;

  tek.macRead.removeInfo(tek.common.getRootPath()+"servlet/tobject", params);
}