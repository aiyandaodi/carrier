//以保存试题数组
var savedArr = new Array();
//未保存试题数组
var unsavedArr = new Array();

//生成试卷的标识
var paperId;
//考试时间
var testDuration;
//问题个数
var replyCount;

var timer;

/*读取试卷*/
function readTest(){	
	if(!testId)
		return;

	var mydata={};
	mydata["objectName"]="ExamsTest";
	mydata["action"]="readInfo";
	mydata["exams_test_id"]=testId;
	mydata["count"]=1;
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend:function(){
			$("#test-info").html("<div class='col-md-12 col-sm-12 center'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function(data) {
			if (data) {
				if (data.code==0){
					//判断权限显示按钮
					if(tek.right.isCanWrite(data.right)||tek.right.isCanDelete(data.right)){
						$("#test-btn").removeClass("hidden");
						if(tek.right.isCanWrite(data.right))
							$("#test-edit-btn").removeClass("hidden");
						if(tek.right.isCanDelete(data.right))
							$("#test-delete-btn").removeClass("hidden");
					}
					
					var record=data["record"];
					if (record) {
						//显示试卷信息
						showTestInfo(record);
					}
				}else{
					$("#test-info").html("");
					var sb = new StringBuffer();
					sb.append("<font color='red'>");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(tek.dataUtility.stringToHTML(data.message));
					sb.append("</font>");
					$("#test-info").html(sb.toString());
				}  //end if (data.code==0)
			} else {
				$("#test-info").html("");
				$("#test-info").html("<font color='red'>操作失败![data=null]</font>");
			}
 	    }, //end success: function(data)
		error: function(request) {
			$("#test-info").html("");
			var sb = new StringBuffer();
			sb.append("<font color='red'>");
			sb.append("操作失败！[");
			sb.append(request.status);
			sb.append(" - ");
			sb.append(request.statusText);
			sb.append("]</font>");
			$("#test-info").html(sb.toString());
        }
	});
}


//显示试卷信息
function showTestInfo(record){
	if(record){
		var field;
		if(record.exams_test_name.show){
			$("#test-paper-title1").html(record.exams_test_name.show);
			$("#test-paper-title2").html(record.exams_test_name.show);
		}
		var sb = new StringBuffer();
		sb.append("<div class='col-md-6 col-sm-6' >");
		sb.append("<div class='center'>");
		sb.append("<span id='exams_test_duration'>");
		field = record.exams_test_duration;
		if(field && field.value){
		  sb.append(field.display);
		  sb.append(":");
		  //秒转换为分钟
		  testDuration = field.value;
		  var time = getTimeBySecond(field.value);
		  if(time)
			  sb.append(time);
		}
		sb.append("</span>");
		sb.append("</div>");
		sb.append("</div>");
		sb.append("<div class='col-md-6 col-sm-6' >");
		sb.append("<div class='center'>");
		sb.append("<span>");
		field = record.exams_test_score;
		if(field && field.show){
		  sb.append(field.display);
		  sb.append(":");
		  sb.append(field.show);
		  sb.append("分");
		}
		sb.append("</span>");
		sb.append("</div>");
		sb.append("</div>");
		sb.append("<div class='col-md-6 col-sm-6' >");
		sb.append("<div class='center'>");
		sb.append("<span>");
		field = record.exams_test_grade;
		if(field && field.show){
		  sb.append(field.display);
		  sb.append(":");
		  sb.append(field.show);
		  sb.append("级");
		}
		sb.append("</span></div>");
		sb.append("</div>");
		sb.append("<div class='col-md-6 col-sm-6' >");
		sb.append("<div class='center'>");
		sb.append("<span>");
		sb.append("答题人:");
		if(myName)
		  sb.append(myName);
		sb.append("</span>");
		sb.append("</div>");
		sb.append("</div>");
		sb.append("<div class='col-md-12 col-sm-12' style='margin-top:15px;'>");
		sb.append("<div class='center'>");
		sb.append("<button class='btn btn-info' onclick='startTest();'> 开始考试</button>");
		sb.append("</div>");
		sb.append("</div>");   
		  
		$("#test-info").html(sb.toString());
	}
}

//转换时间
function getTimeBySecond(stringTime){
	if(!stringTime)
		return;
	
	var second = parseInt(stringTime);// 秒
	var minute = 0;// 分
	var hour = 0;// 小时
	// alert(theTime);
	if(second > 60) {
		minute = parseInt(second/60);
		second = parseInt(second%60);
		
		if(minute > 60) {
			hour = parseInt(minute/60);
			minute = parseInt(minute%60);
		}
	}
	
	var result = ""+parseInt(second)+"秒";
	
	if(minute > 0) {
		result = ""+parseInt(minute)+"分"+result;
	}
	if(hour > 0) {
		result = ""+parseInt(hour)+"小时"+result;
    }
	
	return result; 
}

/*开始考试*/
function startTest(){
	$('.test-info').hide('slow');
	
	if($(".test-button").is("[class!='hidden']")){
		$(".test-button").removeClass("hidden").slideDown(500);;
	}	
	
	if($(".test-question").is("[class!='hidden']")){
		$(".test-question").removeClass("hidden").slideDown(1000);
	}	
	//getSurplusTimer();
	
	getPaper();
	
}

//生成试卷
function getPaper(){
	if(!testId)
		return;

	var mydata={};
	mydata["objectName"]="ExamsPaper";
	mydata["action"]="readInfo";
	mydata["exams_test_id"]=testId;
	mydata["command"]="exam";
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend:function(){
			$("#reply-list").html("<div class='col-md-12 col-sm-12 center'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function(data) {
			if (data) {
				if (data.code==0){
					//if(tek.right.isCanWrite(data.right))
						//$("#group_modify_btn").removeClass("hidden");
					if (data.value) {
						//获取试卷题
						paperId = data.value;
						//计算剩余时长
						var record = data["record"];
						if(record)
							getDurationTime(record);
						getReplyList(data.value,2,"single-list");
						getReplyList(data.value,4,"multiple-list");
					}
				}else{
					$("#reply-list").html("");
					var sb = new StringBuffer();
					sb.append("<font color='red'>");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(tek.dataUtility.stringToHTML(data.message));
					sb.append("</font>");
					$("#reply-list").html(sb.toString());
				}  //end if (data.code==0)
			} else {
				$("#reply-list").html("");
				$("#reply-list").html("<font color='red'>操作失败![data=null]</font>");
			}
 	    }, //end success: function(data)
		error: function(request) {
			$("#reply-list").html("");
			var sb = new StringBuffer();
			sb.append("<font color='red'>");
			sb.append("操作失败！[");
			sb.append(request.status);
			sb.append(" - ");
			sb.append(request.statusText);
			sb.append("]</font>");
			$("#reply-list").html(sb.toString());
        }
	});
	
}

//计算考试时长
function getDurationTime(record){
	if(record){
		if(record.exams_paper_end){
            var now;
			$.ajax({
			      type: "post",
			      url: tek.common.getRootPath()+"servlet/sys",
    			      dataType: "json",
   			      async:false,
			      data: {action: "getServerTime"},
 			      success: function(data) {
 				      if (data.code==0) {
          			        //操作成功
			 	        now=data.value;
			     	      }
			      }
   			});
			
			if (tek.dataUtility.isNull(now))
			  now = new Date().getTime();
			var diff =  record.exams_paper_end.value - now;
			testDuration = Math.floor(diff/1000);
			getSurplusTimer();
		}
	}
}

//获取试卷题
function getReplyList(paper_id,type,div_id){
	if(!paper_id)
		return;
	
	var target = document.getElementById(div_id);
	if(!target)
		return;
		
	var mydata={};
	mydata["objectName"]="ExamsReply";
	mydata["action"]="getList";
	mydata["order"] = "exams_reply_code";
	mydata["exams_reply_paper"] = paper_id;
	mydata["exams_reply_type"] = type;
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			//target.innerHTML = "";
		},
		success: function(data) {
			if(data) {
				if(data.code==0){
					//$("#apply-subject-count").html(data.value);	//显示个数
					if(type==2)
						$("#single-info").text("单选题（共"+data.value+"道）");//单选题
					else if(type==4)
						$("#multiple-info").text("多选题（共"+data.value+"道）");//多选题
					var record = data["record"];
					if(record){
						//显示该题型列表
						$("#"+div_id).removeClass("hidden");
						if(record.length){
							replyCount = record.length;
							for(var i in record){
								showReplyList(record[i],target);
							}
						}else{
								showReplyList(record,target);
						}//end if(record.length)
					}//end if(record)
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(tek.dataUtility.stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#"+div_id).html(error.toString());
				}//end if(data.code==0)
			}else{
            	$("#"+div_id).html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
	    	$("#"+div_id).html("<font color='red'>操作失败</font>");
        }
	});	
	
	
}

//获取问题列表
function showReplyList(record,target){
	
	if(record){
		var field;
		var sb = new StringBuffer();
		sb.append("<li>");
		sb.append("<div class='recent-content'>");
		sb.append("<div class='paper-question'><span>");
		field = record.exams_reply_question;
		if(field && field.show)
			sb.append(field.show);
		field = record.exams_reply_score;
		if(field && field.value){
			sb.append("<font class='reply-score'>");
			sb.append("（"+field.value+"分）");
			sb.append("</font>");
		}
		sb.append("</span></div>");
		sb.append("<div class='checkbox row' id='answer-list-");
		if(record.id){
			sb.append(record.id);
			unsavedArr.push(record.id);
		}
		sb.append("'>");
		sb.append("</div>");
		sb.append("</div>");
		sb.append("</li>");
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
		
		field = record.exams_reply_question;
		fieldname = record.exams_reply_name;
		if(field && field.value ){//&& fieldname && fieldname.value
			//获取问题列表
			readQuestionInfo(field.value,fieldname.value,record.id);
		}
	}
}

/*读取问题信息*/
function readQuestionInfo(question_id,reply_name,reply_id){
	if(!question_id&&!reply_id)
		return;
		
	var mydata={};
	mydata["objectName"]="ExamsQuestion";
	mydata["action"]="readInfo";
	mydata["exams_question_id"]=question_id;
	mydata["count"]=1;

	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend:function(){
			
		},
		success: function(data) {
			if (data) {
				if (data.code==0){
					var record=data["record"];
					if (record) {
						//获取问题列表
						if(record.exams_question_type.value)
							getAnswerList(question_id,record.exams_question_type.value,reply_name,reply_id);
					}
				}else{
					var sb = new StringBuffer();
					sb.append("<font color='red'>");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(tek.dataUtility.stringToHTML(data.message));
					sb.append("</font>");
					$('#answer-list-'+reply_id).html(sb.toString());
				}  //end if (data.code==0)
			} else {
				$('#answer-list-'+reply_id).html("<font color='red'>操作失败![data=null]</font>");
			}
 	    }, //end success: function(data)
		error: function(request) {
			var sb = new StringBuffer();
			sb.append("<font color='red'>");
			sb.append("操作失败！[");
			sb.append(request.status);
			sb.append(" - ");
			sb.append(request.statusText);
			sb.append("]</font>");
			$('#answer-list-'+reply_id).html(sb.toString());
        }
	});
}

function getAnswerList(question_id,input,reply_name,reply_id){
	if(!question_id&&!reply_id)
		return;

	var target = document.getElementById('answer-list-'+reply_id);
	if(!target)
		return;

	var mydata={};
	mydata["objectName"]="ExamsAnswer";
	mydata["action"]="getList";
	mydata["exams_question_id"]=question_id;
	mydata["desc"] = 1;

	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			target.innerHTML = "";
		},
		success: function(data) {
			if(data) {
				if(data.code==0){
					//$("#apply-subject-count").html(data.value);	//显示个数
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showAnswerList(record[i],target,input,reply_name,question_id,reply_id);
						}else{
								showAnswerList(record,target,input,reply_name,question_id,reply_id);
						}//end if(record.length)
					}//end if(record)
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(tek.dataUtility.stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$('#answer-list-'+reply_id).html(error.toString());
				}//end if(data.code==0)
			}else{
            	$('#answer-list-'+reply_id).html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
	    	$('#answer-list-'+reply_id).html("<font color='red'>操作失败</font>");
        }
	});	
}

function showAnswerList(record,target,input,reply_name,question_id,reply_id){
	if(record){
			var field;
			var sb = new StringBuffer();
			sb.append("<div class='col-md-3 col-sm-6 ' >");
			sb.append("<label>");
			sb.append("<input type='");
			if(input==2)
				sb.append("radio");
			else  if(input==4)
				sb.append("checkbox");
			else 
				sb.append("radio");
			sb.append("' value='");
			if(record.id)
				sb.append(record.id);
			sb.append("' name='answer-for-");
			field = record.exams_answer_question;
			if(field && field.value)
				sb.append(field.value);
			sb.append("' check='");
			if(reply_name.indexOf(record.id) > 0 ){
				sb.append("checked");
			}
			sb.append("' onclick='selectAnswer(this,\"");
			if(record.id)
				sb.append(record.id);
			sb.append("\",\"");
			if(reply_id)
				sb.append(reply_id);
			sb.append("\")' >");
			field = record.exams_answer_name;
			if(field && field.show)
				sb.append(field.show);
			sb.append("</label>");
			sb.append("</div>");
	
			if(target)
				target.insertAdjacentHTML('BeforeEnd',sb.toString());
	}
}


//选择答案
function selectAnswer(elem,answer_id,reply_id){
	if(elem.checked =="checked")
		return;
	//从保存的数组中删除
	var index=isArrayContain(savedArr, reply_id);
	if (index>=0){
		var arr = savedArr[index];
		savedArr.splice(index,1);
		unsavedArr.push(arr);
	}
	
}


//保存答案
function saveReply(way){

	//显示等待图层
	var html=new StringBuffer();
	html.append("<img src='");
	html.append(tek.common.getRelativePath());
	html.append("http/images/waiting-small.gif'/>&nbsp;正在保存中...");
	//waitingMessage(html.toString());
	//$("#waiting-modal-dialog").modal("show",null,2);
	tek.macCommon.waitDialogShow(null,html.toString());
	
	if(unsavedArr.length>0){
		//保存为保存的试题答案
		var length = unsavedArr.length;
		var unArr = unsavedArr.concat();;
		for(var i=0;i<length;i++){
			var reply_id = unArr[i];
			var answer_list = document.getElementById("answer-list-"+reply_id);
			//获取答案列表
			if(answer_list){
				var answerArr = answer_list.getElementsByTagName("input");
				//循环答案
				if(answerArr.length>0){
					var idArr = new Array();
					//获取答案的input
					for(var j = 0;j<answerArr.length;j++){
						var answer = answerArr[j];
						if(!answer)
							break;
						//获取答案的标识
						if(answer.checked){
							//保存答案
							var value = answer.value;
							if(value)
								idArr.push(value);
						}	
					}
				   
					//编辑试题答案
					if(idArr.length>0){
						editReplyInfo(reply_id,idArr.join(";"));
					}else{
						//从未保存的数组中删除
						var index=isArrayContain(unsavedArr, reply_id);
						if (index>=0){
							var arr = unsavedArr[index];
							unsavedArr.splice(index,1);
							savedArr.push(arr);
						}
					}
					
				}
			}
		}
	}	
	
	if(unsavedArr.length==0&&way!="submit"){
		 //waitingMessage("<font>保存成功!</font>");
		// timeCounting();
		 //$("#waiting-modal-dialog").modal("show");
		 tek.macCommon.waitDialogShow(null,"<font>保存成功!</font>",null,2);
		 tek.macCommon.waitDialogHide(1000);
	}else if(way=="submit"&&unsavedArr.length!=0){
		 var sb = new StringBuffer();
		 sb.append("<font color='red'>");
		 sb.append("提交失败");
		 sb.append("，请稍后重试!");
		 sb.append("</font>");
		 //waitingMessage(sb.toString());
		 //timeCounting();
		// $("#waiting-modal-dialog").modal("show");
		 tek.macCommon.waitDialogShow(null,sb.toString());
		 tek.macCommon.waitDialogHide(1000);
	}
		
	//提交试卷
	if(way=="submit"&&paperId&&unsavedArr.length<=0){
		editPaperInfo();
	}
	
}


//编辑试题答案
function editReplyInfo(reply_id,answer){
	if(!reply_id&&!answer)
		return;
		
	//if(!answer){
//		//从未保存的数组中删除
//		var index=isArrayContain(unsavedArr, reply_id);
//		if (index>=0){
//			var arr = unsavedArr[index];
//			unsavedArr.splice(index,1);
//			savedArr.push(arr);
//		}
//		
//		return;
//	}
	
	var mydata = {};
	mydata["objectName"] = "ExamsReply";
	mydata["action"] = "setInfo";
	mydata["exams_reply_id"]=reply_id;
	mydata["exams_reply_name"]=answer;

	$.ajax({
		type: "post", 
		async:false,
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		success: function(data) {
			if(data) {
			  if (data.code==0) {
				//从未保存的数组中删除
				var index=isArrayContain(unsavedArr, reply_id);
				if (index>=0){
				    var arr = unsavedArr[index];
					unsavedArr.splice(index,1);
				    savedArr.push(arr);
				}
  
			  } else {
				// 操作错误
				var error=new StringBuffer();
				error.append("保存失败，请稍后重试！");
				error.append("<font color='red'>");
				if(data.code)
				  error.append(data.code);
				error.append(" - ");
				if(data.message)
				  error.append(tek.dataUtility.stringToHTML(data.message));
				error.append("</font>");
				//waitingMessage(error.toString());
				//timeCounting();
				//$("#waiting-modal-dialog").modal("show");
				tek.macCommon.waitDialogShow(null,error.toString());
			  } // end if (data.code==0) else
	
			} else {
			  //waitingMessage("<font color='red'>操作失败![data=null]请稍后重试！</font>");
			  //timeCounting();
			  //$("#waiting-modal-dialog").modal("show");
			  tek.macCommon.waitDialogShow(null,"<font color='red'>操作失败![data=null]请稍后重试！</font>");
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
			error.append("请稍后重试！");
			error.append("</font>");
			//waitingMessage(error.toString());
			//timeCounting();
			//$("#waiting-modal-dialog").modal("show");
			tek.macCommon.waitDialogShow(null,error.toString());
		},
  
		complete: function() {
		}
	});
	
}

function isArrayContain(array, v) {
		if (!array || !v)
			return -1;

		for (var i = 0; i < array.length; i++) {
			if (array[i] == v)
				return i;
		}

		return -1;
}
	
//提交试卷
function submitPaper(time){
	if(!paperId)
		return;
	if(time=="time-over")
		alert("考试时间结束");
	else{
		var flag = confirm("交卷后不可更改,确定提交吗？");
		if(!flag)
			return;
	}
	
	//保存答案
	saveReply("submit");
}

//保存试卷
function editPaperInfo(){
	if(!paperId&&!testId)
		return;
	
	var mydata={};	//转为json
	mydata["objectName"] = "ExamsPaper";
	mydata["action"] = "readInfo";
	mydata["exams_paper_id"]=paperId;
	mydata["exams_test_id"]=testId;
	mydata["command"]="exam";
	mydata["submit"]="1";
	
	//显示等待图层
	var html=new StringBuffer();
	html.append("<img src='");
	html.append(tek.common.getRelativePath());
	html.append("http/images/waiting-small.gif'/>&nbsp;正在提交试卷...");
	//waitingMessage(html.toString());
	//$("#waiting-modal-dialog").modal("show",null,2);
 	tek.macCommon.waitDialogShow(null,html.toString());
  
	$.ajax({
		type: "post", 
		async:true,
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		success: function(data) {
			if(data) {
			  if (data.code==0) {
				//停止时间
				window.clearInterval(timer);
				// 操作成功
				if(typeof(updateOpener)!="undefined" && updateOpener==1){
				  // 刷新父页面
				  tek.refresh.refreshOpener();
				} // end if(updateOpener==1)
				
				if(typeof(showClose)!="undefined" && showClose==1){
				  // 关闭
				  var timerMsg=new StringBuffer();
				  timerMsg.append("考试结束！页面<font id='counter' color='red'>");
				  timerMsg.append("</font>秒后自动关闭");
				  //waitingMessage("操作成功!", timerMsg.toString());
				  //waitingMessage(tek.dataUtility.stringToHTML(data.message), timerMsg.toString());
				  //timeCounting("window.close()");
				  tek.macCommon.waitDialogShow(null,tek.dataUtility.stringToHTML(data.message));
				  tek.macCommon.waitDialogHide(1000, "window.close()");
				} else {
				  //var timerMsg=new StringBuffer();
				  //timerMsg.append("页面<font id='counter' color='red'>");
				  //timerMsg.append("</font>秒后提示框自动关闭");
				  //waitingMessage(tek.dataUtility.stringToHTML(data.message), timerMsg.toString());
				  //timeCounting();
				  //$("#waiting-modal-dialog").modal("show");
				  tek.macCommon.waitDialogShow(null,"点击×关闭考试窗口",null,2);
				} // end if else
  
			  } else {
				// 操作错误
				var error=new StringBuffer();
				error.append("提交试卷失败，请稍后重试！");
				error.append("<font color='red'>");
				if(data.code)
				  error.append(data.code);
				error.append(" - ");
				if(data.message)
				  error.append(tek.dataUtility.stringToHTML(data.message));
				error.append("</font>");
				//waitingMessage(error.toString());
				//timeCounting();
				//$("#waiting-modal-dialog").modal("show");
				tek.macCommon.waitDialogShow(null,error.toString());
			  } // end if (data.code==0) else
	
			} else {
			  //waitingMessage("<font color='red'>操作失败![data=null]请稍后重试！</font>");
			  //timeCounting();
			  //$("#waiting-modal-dialog").modal("show");
			  tek.macCommon.waitDialogShow(null,"<font color='red'>操作失败![data=null]请稍后重试！</font>");
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
			error.append("请稍后重试！");
			error.append("</font>");
			//waitingMessage(error.toString());
			//timeCounting();
			//$("#waiting-modal-dialog").modal("show");
			tek.macCommon.waitDialogShow(null,error.toString());
		},
  
		complete: function() {
		}
	});
}

function getSurplusTimer(){
	if(!testDuration)
		return;
	
	if(timer){
		window.clearInterval(timer);
	}
	
	var intDiff = testDuration;//倒计时总秒数量
    timer  = window.setInterval(function(){
		var day=0,
			hour=0,
			minute=0,
			second=0;//时间默认值        
		if(intDiff > 0){
			var time = intDiff;
			hour = Math.floor(time/(60*60));
			time = time % (60*60);
			minute= Math.floor(time / 60);
			second = Math.floor(time % 60);
			
		}else if(intDiff < 0){
			window.clearInterval(timer);
			//考试时间结束
			submitPaper("time-over");	
		}
		
		if (minute <= 9) minute = '0' + minute;
		if (second <= 9) second = '0' + second;
		var timesb = new StringBuffer();
		timesb.append('<s id="h"></s>'+hour+'时');
		timesb.append('<s></s>'+minute+'分');
		timesb.append('<s></s>'+second+'秒');
		var sb = new StringBuffer();
		sb.append("倒计时 ：");
		sb.append("<font color='#d9534f'>");
		sb.append(timesb.toString());
		sb.append("</font>");
		$("#test-time").html(sb.toString());
		$("#top-test-time").html(sb.toString());
		intDiff--;
    }, 1000);
} 