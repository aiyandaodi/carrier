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
function readAccount(){
	var rows = new Array();
	rows.push('account_device');
	rows.push('account_user');
	rows.push('account_daymax');
	rows.push('account_monthmax');
	rows.push('account_remain');
	rows.push('account_valid');
    
	var params={};
    params["objectName"]="MobileAccount";
	params["action"]="readInfo";
	params["account_id"]=accountId;
	params["user_id"]=ownerId;
	
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
			sb.append("<a class='btn alert alert-info button-left' onclick='editAccount()'><i class='fa fa-edit'>编辑</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
		
		if((data.right & 16)==16){
			// 有删除权限
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-danger button-left' onclick='deleteAccount()'><i class='fa fa-trash-o'>删除</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
	}
}

//响应“编辑”按钮
function editAccount(){
	var url=new StringBuffer();
	url.append(tek.common.getRootPath());
	url.append("http/tekinfo/mobile/account/edit.html?account_id=");
	url.append(accountId);
	url.append("&show-close=1&refresh-opener=1");
	window.open(url.toString(),"_blank");
}

//响应“删除”按钮
function deleteAccount(){
  var params={};
  params["objectName"]="MobileAccount";
  params["action"]="removeInfo";
  params["account_id"]=accountId;

  removeInfo(tek.common.getRootPath()+"servlet/tobject", params);
}
