//javascript document
var recordId;

var showClose;    // 是否关闭
var callbackURL;    // 回调地址
var updateOpener;    //是否刷新父页面
var request = tek.common.getRequest();
function init(){
	recordId=request["record_id"];
	if(recordId)
		readRecord();	
	else
		showError("参数错误!");
	
    showClose=request["show-close"];
    if(showClose
	    && (showClose==1 || showClose==true))
      showClose=1;
	else
	  showClose=0;

    callbackURL=request["callback-url"];
    if(callbackURL)
      callbackURL=decodeURIComponent(callbackURL);
	
	updateOpener=request["refresh-opener"];
	if(updateOpener
	    && (updateOpener==1 || updateOpener==true))
	  updateOpener=1;
	else
	  updateOpener=0;
	  
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
function readRecord(){
	var rows = new Array();
	
	rows.push('record_name');
	rows.push('record_user');
	rows.push('record_userdisplay');
	rows.push('record_device');
	rows.push('record_client');

	rows.push('record_object');
	rows.push('record_objectid');
	rows.push('record_command');
	rows.push('record_os');
	rows.push('record_time');
	rows.push('record_ip');
	rows.push('record_longitude');
	rows.push('record_latitude');
	rows.push('record_height');
	rows.push('record_remark');

	var params={};
    params["objectName"]="ObjectRecord";
	params["action"]="readInfo";
	params["record_id"]=recordId;
	
	tek.macRead.readInfo(tek.common.getRootPath()+"servlet/objectrecord",params,rows,"readInfo");
}

/**
 * 自定义操作
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

  removeInfo(tek.common.getRootPath()+"servlet/objectrecord", params);
}
