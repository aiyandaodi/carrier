/*初始化*/
var paperId; //试卷标识
var request = tek.common.getRequest();
var exams_paper_name; //试卷名称
var exams_paper_start; //考试试卷
function init(){
	paperId=request["paper_id"];

	examsPaperName=decodeURI(request["exams_paper_name"]);
	examsPaperStart=decodeURI(request["exams_paper_start"]);
	if(examsPaperName){
		$("#test-paper-title").html(examsPaperName);
	}
	if(examsPaperStart) {
		$("#exams_paper_start").html(examsPaperStart);
	}

	readPaper();
	readReplyList();
}
/*读取试卷*/
function readPaper(){	
	if(!paperId)
		return;

	var mydata={};
	mydata["objectName"]="ExamsPaper";
	mydata["action"]="readInfo";
	mydata["exams_paper_id"]=paperId;
	mydata["count"]=1;
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend:function(){
			$("#paper-info").html("<div class='col-md-12 col-sm-12 center'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function(data) {
			if (data) {
				if (data.code==0){
					//判断权限显示按钮
					//if(tek.right.isCanWrite(data.right)||tek.right.isCanDelete(data.right)){
//						$("#test-btn").removeClass("hidden");
//						if(tek.right.isCanWrite(data.right))
//							$("#test-edit-btn").removeClass("hidden");
//						if(tek.right.isCanDelete(data.right))
//							$("#test-delete-btn").removeClass("hidden");
//					}
					
					var record=data["record"];
					if (record) {
						//显示试卷信息
						showPaperInfo(record);
					}
				}else{
					$("#paper-info").html("");
					var sb = new StringBuffer();
					sb.append("<font color='red'>");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(tek.dataUtility.stringToHTML(data.message));
					sb.append("</font>");
					$("#paper-info").html(sb.toString());
				}  //end if (data.code==0)
			} else {
				$("#paper-info").html("");
				$("#paper-info").html("<font color='red'>操作失败![data=null]</font>");
			}
 	    }, //end success: function(data)
		error: function(request) {
			$("#paper-info").html("");
			var sb = new StringBuffer();
			sb.append("<font color='red'>");
			sb.append("操作失败！[");
			sb.append(request.status);
			sb.append(" - ");
			sb.append(request.statusText);
			sb.append("]</font>");
			$("#paper-info").html(sb.toString());
        }
	});
}

//显示试卷信息
function showPaperInfo(record){
	if(record){
		var field;
		var sb = new StringBuffer();
		sb.append("得分 :"); 
		sb.append("<span id='exams_test_duration' style='color:#d9534f;'>");
		field = record.exams_paper_score;
		if(field && field.show){
			sb.append(field.show);
		}
		sb.append("分</span>");
		field = record.exams_paper_result;
		if(field && field.value && field.show){
			if((field.value==4)||(field.value==3)||(field.value==2)){
				sb.append("<span style='color:rgb(92, 158, 145);'>&nbsp;&nbsp;");
				sb.append(field.show);
				sb.append("</span>");
			}else{
				sb.append("<span style='color:#c9302c;'>&nbsp;&nbsp;不及格</span>");
			}
		}
		
		$("#paper-info").html(sb.toString());
	}
}

//读取问答列表
function readReplyList(){
	if(!readPaper)
		return;
	
	var target = document.getElementById('reply-list');
	if(!target)
		return;
		
	var mydata={};
	mydata["objectName"]="ExamsReply";
	mydata["action"]="getList";
	mydata["order"] = "createTime";
	mydata["desc"] = 1;
	mydata["exams_reply_paper"] = paperId;
	
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
					$("#reply-list").html(error.toString());
				}//end if(data.code==0)
			}else{
            	$("#reply-list").html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
	    	$("#reply-list").html("<font color='red'>操作失败</font>");
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
		sb.append("<div class='paper-question'>");
		sb.append("<span>");
		field = record.exams_reply_question;
		if(field && field.show){
			sb.append(field.show ||"");
		}
		sb.append("</span>");
		field = record.exams_reply_score;
		if(field && field.value && field.show){
			if(field.value==0){
				sb.append("<span style='color:#c9302c;'>");
				sb.append("&nbsp;&nbsp;<i class='fa fa-remove'></i>&nbsp;");
				sb.append(field.show || "");
				sb.append("分</span>");
			}else{
				sb.append("<span style='color:rgb(92, 158, 145);'>");
				sb.append("&nbsp;&nbsp;<i class='fa fa-check'></i>&nbsp;");
				sb.append(field.show || "");
				sb.append("分</span>");
			}
		}
		sb.append("</div>");
//		sb.append("<div class='checkbox row' id='answer-list-304721472107791124'>");
		//显示答案，进行权限判断
//		sb.append("<div class='col-md-3 col-sm-6'>");
//		sb.append("<label>");
//		sb.append("<input type='radio' value='304721472107805866' name='answer-for-304721472107791124' disabled='disabled'>");
//		sb.append("防雷接地");
//		sb.append("</label>");
//		sb.append("</div>");
		
//		sb.append("<div class='col-md-3 col-sm-6 '>");
//		sb.append("<label>");
//		sb.append("<input type='radio' value='304721472107816386' name='answer-for-304721472107791124' disabled='disabled'>保护接地</label>");
//		sb.append("</div>");
		
//		sb.append("<div class='col-md-3 col-sm-6'>");
//		sb.append("<label>");
//		sb.append("<input type='radio' value='304721472107823376' name='answer-for-304721472107791124' disabled='disabled'  checked='checked'>联合接地");
//		sb.append("</label>");    
//		sb.append("</div>");
//		sb.append("</div>");
		sb.append("</div>");
		sb.append("</li>");
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
			
		
	}
}

//显示答案
