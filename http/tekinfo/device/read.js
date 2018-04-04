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
function readDevice(){
	var rows = new Array();
	rows.push('device_name');
	rows.push('device_type');
	rows.push('device_address');
	rows.push('device_ini');
	rows.push('device_valid');

	rows.push('device_baudrate');
	rows.push('device_databits');
	rows.push('device_flowcontrol');
	rows.push('device_parity');
	rows.push('device_stopbits');
	rows.push('device_sendspeed');
    
	var params={};
    params["objectName"]="Device";
	params["action"]="readInfo";
	params["device_id"]=deviceId;
	
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
			sb.append("<a class='btn alert alert-info button-left' onclick='editDevice()'><i class='fa fa-edit'>编辑</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
		
		if((data.right & 16)==16){
			// 有删除权限
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-danger button-left' onclick='deleteDevice()'><i class='fa fa-trash-o'>删除</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
	}
}

//响应“编辑”按钮
function editDevice(){
	var url=new StringBuffer();
	url.append(tek.common.getRootPath());
	url.append("http/tekinfo/device/edit.html?device_id=");
	url.append(deviceId);
	url.append("&show-close=1&refresh-opener=1");
	
	window.open(url.toString(),"_blank");
}

//响应“删除”按钮
function deleteDevice(){
  var params={};
  params["objectName"]="Device";
  params["action"]="removeInfo";
  params["device_id"]=deviceId;
  
  removeInfo(tek.common.getRootPath()+"servlet/tobject", params);
}
