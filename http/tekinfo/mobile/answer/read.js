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
function readAnswer(){
	var rows = new Array();
	rows.push('answer_answerkey');
	rows.push('answer_answercode');
	rows.push('answer_start');
	rows.push('answer_end');
	rows.push('answer_object');
	rows.push('answer_objectid');
	rows.push('answer_flag');
    
	var params={};
    params["objectName"]="MobileAnswer";
	params["action"]="readInfo";
	params["answer_id"]=answerId;
	
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
			sb.append("<a class='btn alert alert-info button-left' onclick='editAnswer()'><i class='fa fa-edit'>编辑</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
		
		if((data.right & 16)==16){
			// 有删除权限
			var sb = new StringBuffer();
			sb.append("<a class='btn alert alert-danger button-left' onclick='deleteAnswer()'><i class='fa fa-trash-o'>删除</i></a>");
			if(editTarget){
				editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
			}
		}
	}
}

//响应“编辑”按钮
function editAnswer(){
	var url=new StringBuffer();
	url.append("edit.html?answer_id=");
	url.append(answerId);
	url.append("&show-close=1&refresh-opener=1");
	window.open(url.toString(),"_blank");
}

//响应“删除”按钮
function deleteAnswer(){
  var params={};
  params["objectName"]="MobileAnswer";
  params["action"]="removeInfo";
  params["answer_id"]=answerId;
  
  removeInfo(tek.common.getRootPath()+"servlet/tobject", params);
}
