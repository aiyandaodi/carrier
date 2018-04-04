//显示字段数组
var answerItems = new Array("exams_answer_code","exams_answer_name","exams_answer_correct");

/*添加答案信息*/
function addAnswerInfo(){
	if(!questionId)
		return;
	
	//显示答案区域	 
	initialAnswerCustomButton("answer-btn");
	$("#new-answer").toggle("slow");
	var params={};
	params["objectName"]="ExamsAnswer";
	params["action"]="getNew";
	params["exams_question_id"]=questionId;
	getAnswerEdit(tek.common.getRootPath()+"servlet/tobject",params,answerItems,"add-answer-info");
}


function getAnswerEdit(ajaxURL,params,answerItems,parentId){
	var parent=document.getElementById(parentId);
  	if(!parent)
    	return;

  	// 显示读取数据等待框
  	var html= "<img src='"+tek.common.getRelativePath()+
  	"http/images/waiting-small.gif'/>&nbsp;正在获取数据...";
  	parent.innerHTML = html;
  

	var setting = {operateType: "读取答案列表"};
	var sendData = params;
	var callback = {
		success: function (data) {
			parent.innerHTML="";
			// 显示输入框
            showAnswerOperation(data,parent);
		},
		error: function (data, message) {
			parent.innerHTML = message;
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


function showAnswerOperation(data,parent){
  // 显示编辑框
  var record=data["record"];
  if(record){
    var r;
    if(record.length)
      r=record[0];
    else
      r=record;

    var html = "";
	for(var i=0; i<answerItems.length; i++)
    	html += tek.macEdit.appendEditField(r[answerItems[i]],record);
    parent.innerHTML = html;
  }
}

//提交信息
function addNewAnswerInfo(){
	var mydata = tek.common.getSerializeObjectParameters("add_answer_form") || {};	//转为json
	
	mydata["objectName"] = "ExamsAnswer";
	mydata["action"] = "addInfo";
	mydata["exams_question_id"]=questionId;
	
	editAnswerInfo(tek.common.getRootPath()+"servlet/tobject",mydata);	
}

/**
 * 编辑信息
 * 需要加载dataUtility.js、common.js文件
 *
 * @param ajaxURL
 *           ajax地址
 * @param ajaxParams
 *           ajax参数 
 */
function editAnswerInfo(ajaxURL, ajaxParams) {
  	//显示等待图层
  	//var html= "<img id='waiting-img' src='"+tek.common.getRelativePath()+
//  	"http/images/waiting-small.gif'/>&nbsp;正在提交答案...";
//  	$("#answer-list").append(html);

	var setting = {operateType: "提交答案信息"};
	var sendData = ajaxParams;
	var callback = {
		beforeSend: function () {
			var html= "<li id='waiting-img' style='text-align:center;'><img src='"+tek.common.getRelativePath()+
  	"http/images/waiting-small.gif'/></li>";
			$("#answer-list").append(html);
		},
		success: function (data) {
			$("#waiting-img").remove();
			
			// 操作成功
            if(typeof(updateOpener)!="undefined" && updateOpener==1){
                // 刷新父页面
                tek.refresh.refreshOpener();
            }
			  
			var value;
			if(data.value){
				value = data.value;
			}else{
				value = questionId;  
			}
			
			if(value && value.length>=11) {
				var answer_id =value.substr(value.indexOf("=",1)+1);
			  	//清空html，隐藏div
			 	$("#add-answer-info").html("");
			  	$("#new-answer").hide("fast");
			  	//读取提交的答案，自动添加到问题列表
			  	readAnswerInfo(answer_id,"add");
			}
		},
		
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

/*读取答案列表*/
function readAnswerList(question_id){
	var target = document.getElementById('answer-list');
	if(target.innerHTML !=""){
		target.innerHTML ="";
	}
	if(!target)
		return;
	
	var setting = {operateType: "读取答案列表"};
	var sendData = {
		objectName: "ExamsAnswer",
		action: "getList",
		exams_question_id: question_id,
		desc: 1
	};
	var callback = {
		beforeSend:function(){
			target.innerHTML = "<li style='text-align:center;'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/></li>";	
		},
		success: function (data) {
			target.innerHTML = "";
			
			var record = data["record"];
			if(record){
				if(record.length){
					for(var i in record){
						showAnswerList(record[i],target);
					}
				}else{
					showAnswerList(record,target);
				}//end if(record.length)
			}
		},
		error: function (data, message) {
			target.innerHTML = message;
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


function showAnswerList(record,target){
	if(record){
		var html = "<div class='col-md-12' id='answer-";
		if(record.id){
			html += record.id;
		}
		html += "'>";
		
        html += "<div class='library-question'>"+
		"<span style='font-size:0.9em;'>";
		if(record.exams_answer_name.show){
			html += record.exams_answer_name.show;
		}
		html += "</span>";
		
		html += "<span style='color:rgb(92, 158, 145)'>";
		if(record.exams_answer_correct.value==1){
			html += "<i class='fa fa-check'></i>";
		}
		html += "</span>";
		
		html += "<div class='btn-group' style='margin:0px 5px;'>"+
		"<button class='btn btn-xs btn-default' onclick='editAnswer(\"";
		if(record.id){
			html += record.id;
		}
		html += "\")' style='font-size: 16px;'><i class='fa fa-pencil'></i> </button>"+
		"<button class='btn btn-xs btn-default' onclick='deleteAnswerInfo(\"";
		if(record.id){
			html += record.id;
		}
		html += "\",\"";
		if(record.exams_answer_name.show){
			html += record.exams_answer_name.show;
		}
		html += "\")' style='font-size: 16px;'><i class='fa fa-times'></i> </button>";
		html += "</div></div></div>";
		
		if(target){
			target.insertAdjacentHTML("beforeEnd",html);
		}
	}
}


/*读取答案信息*/
function readAnswerInfo(answer_id,way){
	var target = document.getElementById('answer-list');
	if(!target&&!answer_id)
		return;

	var setting = {operateType: "获取答案信息"};
	var sendData = {
		objectName: "ExamsAnswer",
		action: "readInfo",
		exams_answer_id: answer_id,
		count: 1
	};
	
	var callback = {
		success: function (data) {
			var record=data["record"];
			if (record) {
				//删除提示信息
				$("#answer-list").children(".answer-data-message").remove();
				if(way=="add"){
					//显示答案信息
					showAnswerInfo(record);
				}else if(way=="edit"){
					//显示编辑答案信息
					showEditAnswerInfo(record);
				}
			}
		},
		error: function (data, errorMsg) {
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	
}

function showAnswerInfo(record){
	if(record){
		var html = "<div class='col-md-12' id='answer-";
		if(record.id){
			html += record.id;
		}
		html += "'>"+
        "<div class='library-question'>"+
		"<span style='font-size:0.9em;'>";
		if(record.exams_answer_name.show){
			html += record.exams_answer_name.show;
		}
		html += "</span>"+
		"<span style='color:rgb(92, 158, 145)'>";
		if(record.exams_answer_correct.value==1){
			html += "<i class='fa fa-check'></i>";
		}
		html += "</span>";
		//根据权限判断加按钮
		html += "<div class='btn-group' style='margin:0px 5px;'>"+
        "<button class='btn btn-xs btn-default' onclick='editAnswer(\"";
		if(record.id){
			html += record.id;
		}
		html += "\")' style='font-size: 16px;'>"+
		"<i class='fa fa-pencil'></i>"+
		"</button>"+
		"<button class='btn btn-xs btn-default' onclick='deleteAnswerInfo(\"";
		if(record.id){
			html += record.id;
		}
		html += "\",\"";
		if(record.exams_answer_name.show){
			html += record.exams_answer_name.show;
		}
		html += "\")' style='font-size: 16px;'><i class='fa fa-times'></i> </button>";
        html += "</div>";
		html += "</div>";
		html += "</div>";
		$("#answer-list").append(html);
	}
}

function showEditAnswerInfo(record){
	if(record){
		if(!record.id)
			return;
		var $answer = $("#answer-"+record.id);
		if($answer){
			$answer.html("");
			var html = "<div class='library-question'>"+
			"<span style='font-size:0.9em;'>";
			if(record.exams_answer_name.show){
				html += record.exams_answer_name.show;
			}
			html += "</span>";
			html += "<span style='color:rgb(92, 158, 145)'>";
			if(record.exams_answer_correct.value==1){
				html += "<i class='fa fa-check'></i>";
			}
			html += "</span>";
			//根据权限判断加按钮
			html += "<div class='btn-group' style='margin:0px 5px;'>";
			html += "<button class='btn btn-xs btn-default' onclick='editAnswer(\"";
			if(record.id){
				html += record.id;
			}
			html += "\")' style='font-size: 16px;'>";
			html += "<i class='fa fa-pencil'></i>";
			html += "</button>";
			html += "<button class='btn btn-xs btn-default' onclick='deleteAnswerInfo(\"";
			if(record.id){
				html += record.id;
			}
			html += "\",\"";
			if(record.exams_answer_name.show){
				html += record.exams_answer_name.show;
			}
			html += "\")' style='font-size: 16px;'><i class='fa fa-times'></i> </button>";
			html += "</div>";
			html += "</div>";
			
			$answer.html(html);
		}
	}
}

/*编辑答案信息*/
function editAnswer(answer_id){

	if(!answer_id)
		return;
		
	var setting = {operateType: "编辑答案信息"};
	var sendData = {
		objectName: "ExamsAnswer",
		action: "getEdit",
		exams_answer_id: answer_id,
	};	

	var callback = {
		success: function (data) {
			var record=data["record"];
			if (record) {
				//显示答案信息
				showAnswerEdit(record);
			}
		},
		error: function (data, message) {
			tek.macCommon.waitDialogShow(null, message);
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

function showAnswerEdit(record){
	if(record){
		var html = "<div class='padd new-answer' id='answer-edit-div-";
		if(record.id)
			html += record.id;
		html += "'>";
		html += "<form class='form-horizontal' id='edit_answer_form' name='edit_answer_form' method='post' action='javascript:submitEditAnswer(\"";
		if(record.id)
			html += record.id;
		html += "\")'>"+
		"<div id='add-info'>"+
		"<div class='form-group'>"+
		"<label class='col-xs-3' style='overflow:hidden' for='exams_answer_name'>";
		if(record.exams_answer_name.display){
			html += record.exams_answer_name.display;
		}
		html += "</label>";
		html += "<div class='col-xs-9'>";
		html += "<input id='exams_answer_name' name='exams_answer_name' class='form-control' value='' type='text' style='height:30px;' placeholder='";
		if(record.exams_answer_name.show){
			html += record.exams_answer_name.show;
		}
		html += "'></div></div>"+
		"<div class='form-group'>"+
		"<label class='col-xs-3' style='overflow:hidden' for='exams_answer_correct'>";
		if(record.exams_answer_correct.display){
			html += record.exams_answer_correct.display;
		}
		html += "</label>"+
		"<div class='col-xs-9'>"+
		"<div class='col-xs-6' style='padding:0px 5px'>"+
		"<input class='col-xs-1' style='width:15%; float:left;margin-top: 8px;' id='exams_answer_correct-1' name='exams_answer_correct' value='1' checked='";
		if(record.exams_answer_correct.value==1)
			html += "checked";
		html += "' type='radio'>"+
		"<label class='col-xs-11' style='float:left; width:85%; overflow:hidden' for='exams_answer_correct-1'>正确</label>"+
		"</div>";
		html += "<div class='col-xs-6' style='padding:0px 5px'>";
		html += "<input class='col-xs-1' style='width:15%; float:left;margin-top: 8px;' id='exams_answer_correct-0' name='exams_answer_correct' value='2'  type='radio' checked='";
		if(record.exams_answer_correct.value==0)
			html += "checked";
		html += "'>";
		html += "<label class='col-xs-11' style='float:left; width:85%; overflow:hidden' for='exams_answer_correct-0'>错误</label>";
		html += "</div>";
		html += "</div>";
		html += "</div>";
		html += "</div>";
		html += "<div class='form-group'>";
		html += "<div class='col-xs-12 center'>";
		html += "<button type='submit' id='submitBtn' class='btn btn-danger' style='font-size:0.9em;'>保存</button>";
		html += "<button type='button' id='closeBtn' class='btn btn-info' onclick='cancelEditAnswerInfo(\"answer-edit-div-";
		if(record.id)
			html += record.id;
		html += "\");' style='font-size:0.9em;'>取消</button>";
		html += "</div>";
		html += "</div>";
		html += "</form>";
		html += "</div>";

		$("#answer-"+record.id).append(html);
	}
}

//取消编辑框
function cancelEditAnswerInfo(id){
	//提示用户
	if(confirm("确定取消编辑答案吗？")){
		$("#"+id).remove();
	}
}

//提交编辑问题信息
function submitEditAnswer(answer_id){
	var mydata = tek.common.getSerializeObjectParameters("edit_answer_form") || {};	//转为json
	mydata["objectName"] = "ExamsAnswer";
	mydata["action"] = "setInfo";
	mydata["exams_answer_id"]=answer_id;
	
	submitEditAnswerInfo(tek.common.getRootPath()+"servlet/tobject",mydata,answer_id);
}

/**
 * 编辑信息
 * 需要加载dataUtility.js、common.js文件
 *
 * @param ajaxURL
 *           ajax地址
 * @param ajaxParams
 *           ajax参数 
 */
function submitEditAnswerInfo(ajaxURL, ajaxParams,answer_id) {
  if(!answer_id)
  	return;

  $.ajax({
      type: "post", 
      async:true,
      url: ajaxURL,
      dataType: "json",
      data: ajaxParams,
	  beforeSend: function(){
		  var html = "<li id='waiting-img' style='text-align:center;'><img src='"+
		  tek.common.getRelativePath()+
  		  "http/images/waiting-small.gif'/></li>";
		  
  		  $("#answer-list").append(html);
	  },
      success: function(data) {
		  //成功之后删除等待框
		  $("#waiting-img").remove();
		  
          if(data) {
            if (data.code==0) {
              // 操作成功
              if(typeof(updateOpener)!="undefined" && updateOpener==1){
                // 刷新父页面
               tek.refresh.refreshOpener();
              } // end if(updateOpener==1)
			  
			  tek.macCommon.waitDialogShow(null,tek.dataUtility.stringToHTML(data.message));
			  
			  //去掉编辑区域
			  $("#answer-edit-div-"+answer_id).remove();
			  //显示编辑后的回答
			  readAnswerInfo(answer_id,"edit");

            } else {
              // 操作错误
              var error=new StringBuffer();
              error.append("<font color='red'>");
              if(data.code)
                error.append(data.code);
              error.append(" - ");
              if(data.message)
                error.append(stringToHTML(data.message));
              error.append("</font>");
              waitingMessage(error.toString());
              //timeCounting();
              $("#waiting-modal-dialog").modal("show");
            } // end if (data.code==0) else
  
          } else {
            waitingMessage("<font color='red'>操作失败![data=null]</font>");
            //timeCounting();
            $("#waiting-modal-dialog").modal("show");
          } // end if(data) else
      },

      error: function(request) {
          var error=new StringBuffer();
          error.append("<font color='red'>");
          error.append("操作错误![");
          if(request.status)
            error.append(request.status);
          error.append(" - ");
          if(request.response)
            error.append(request.response);
          error.append("]");
          error.append("</font>");
		  
		  tek.macCommon.waitDialogShow(null, error.toString());
      },

      complete: function() {
		  tek.macCommon.waitDialogHide(500);
      }
  });
}

//删除答案
function deleteAnswerInfo(answer_id,name){
	var remove=window.confirm("确定删除“"+name+"”?");//(这个提示还加不加？)
	if (!remove)
	  return ;
	
	$.ajax({
	  type: "post",
	  url: tek.common.getRootPath()+"servlet/tobject",
	  dataType: "json",
	  data: {
		  objectName:"ExamsAnswer",
		  action:"removeInfo",
		  "exams_answer_id":answer_id,
	  },
	
	  success: function(data) {
		  if(data){
			if (data.code==0){
			  var sb = new StringBuffer();
			  sb.append("#answer-");
			  sb.append(answer_id);
			  //删除该节点
			  $(sb.toString()).remove();
			  //getList();
			} else
			  showError(data.code+" - "+data.message);
		  } else
			showError("删除错误!");
	  },
	
	  error: function(request) {
		//showMessage("登录操作失败!");
		showMessage("删除操作失败!"+request.status+" - "+request.response);
	  }
	});
}

 //执行页面自定义的初始化按钮函数  --mac-edit.js中调用
function initialAnswerCustomButton(parentId) {
											
  var html = "<button type='submit' id='submitBtn' class='btn btn-danger' style='font-size:0.9em;'>添加</button>";
 
  if(showClose==1){
    //显示关闭按钮
    html += "<button type='button' id='closeBtn' class='btn btn-info' onclick='cancelAddAnswerInfo();' style='font-size:0.9em;'>关闭</button>";
  } else if (callbackURL){
    //显示返回按钮
    html += "<button type='button' id='callbackBtn' class='btn btn-success' onclick='callbackWithConfirm(callbackURL)' style='font-size:0.9em;'>返回</button>";
  } else {
    // 显示“提交”、“重置”
    html += "<button type='reset' class='btn btn-success' style='font-size:0.9em;'>重置</button>";
  }

  $("#"+parentId).html(html);
}


function cancelAddAnswerInfo(){
	if(confirm("确定要取消新建吗？")){
		$("#new-answer").hide("slow");
	}
}