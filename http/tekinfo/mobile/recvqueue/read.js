//javascript document

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
function readQueue(){
	var rows = new Array();
	rows.push('queue_device');
	rows.push('queue_time');
	rows.push('queue_phone');
	rows.push('queue_status');
	rows.push('queue_object');
	rows.push('queue_objectid');
	rows.push('queue_message');
    
	var params={};
    params["objectName"]="MobileRecvQueue";
	params["action"]="readInfo";
	params["queue_id"]=queueId;
	
	readInfo(tek.common.getRootPath()+"servlet/tobject",params,rows,"readInfo");
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
			sb.append("<a class='btn alert alert-info button-left' onclick='editQueue()'><i class='fa fa-edit'>编辑</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
		
		if((data.right & 16)==16){
			// 有删除权限
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-danger button-left' onclick='deleteQueue()'><i class='fa fa-trash-o'>删除</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
	}
}

//响应“编辑”按钮
function editQueue(){
	var url=new StringBuffer();
	url.append("edit.html?queue_id=");
	url.append(queueId);
	url.append("&show-close=1&refresh-opener=1");
	window.open(url.toString(), "_blank");
}

//响应“删除”按钮
function deleteQueue(){
  var params={};
  params["objectName"]="MobileRecvQueue";
  params["action"]="removeInfo";
  params["queue_id"]=queueId;
  
  removeInfo(tek.common.getRootPath()+"servlet/tobject", params);
}
