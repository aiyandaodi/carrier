// JavaScript Document
/**************************************************
 *	新建问题页面 add.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================
//显示字段数组
var questionId; //问题的标识
var items = new Array("exams_question_code","exams_question_name","exams_question_tags","exams_question_end");
var Tags;
//=====================================================Function===============================

/**
 * 初始化
 */
function init(){
  questionId = request["exams_question_id"];
  
  if(questionId){ 
	  readQuestionInfo(questionId);
	  //显示答案区域
	  $("#answer-container").show("fast");
	  readAnswerList(questionId);
  }
  
  //日历初始化
  initNoteCalender( {
	  type: "note",
	  daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
	  datestr: "",
	  begin: "2010,1"
  });

}


/*读取问题信息*/
function readQuestionInfo(question_id){
	questionId = question_id;
	$("#read-info-div").show("slow");
	if(!question_id)
		return;
	
	var setting = {operateType: "读取问题信息"};
	var sendData = {
		objectName: "ExamsQuestion",
		action: "readInfo",
		exams_question_id: question_id,
		count: 1
	};
		
	var callback = {
		beforeSend:function(){
			$("#read-info-div").html("<div class='col-md-12 col-sm-12'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var record=data["record"];
			if (record) {
				//显示小组信息
				showQuestionInfo(record);
			}
		},
		error: function (data, message) {
			$("#read-info-div").html("<font color='red'>"+message+"</font>");
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示问题信息
function showQuestionInfo(record){
	if(record){	
		var field;
		var html = "<div class='form-group'>"+
		"<label class='col-xs-3' for='exams_library_code'>";
		field = record.exams_question_library;
		if(field && field.show){
			html += field.display;
			html += "</label>"+
			"<div class='col-xs-9' style='font-weight:300; font-size:1.0em;'>"+
			"<span>";
			html += tek.dataUtility.stringToHTML(field.show ||"");
		}
		html += "</span></div></div>";
		
		if(record.exams_question_tags){
			field = record['exams_question_tags'];
			var lib_tags = tek.dataUtility.stringToHTML(field.show || '');
			
			html += "<div class='form-group'>"+
			"<label class='col-xs-3' for='exams_question_tags'>"+field.display+"</label>";
			html += "<div class='col-xs-9' style='font-weight:300; font-size:1.0em;'>";
			if (lib_tags) {
				var tagArr = lib_tags.split(";");
				if (tagArr && tagArr.length > 0) {
					for (var i = 0; i < tagArr.length; i++) {
						if (!tagArr[i] || tagArr[i] == "" || tagArr[i]== "undefined")
							continue;	
						html += "<span class='tags'>"
						+ tagArr[i] + "</span>　";
					} 
				} 
			} 
			html +=  "</div></div>";
		} 
		
		html += "<div class='form-group'>";
		field = record.exams_question_name;								        
		if(field && field.show){
			html += "<label class='col-xs-3' for='exams_library_code'>";	
			html += field.display;
			html += "</label>";
			html += "<div class='col-xs-9'>";
	    	html += "<span title='";
			html += field.show;
			html += "' style='font-weight:300;font-size:1.0em;color:rgba(11,72,136,0.8);'>";
			html += tek.dataUtility.stringToHTML(field.show ||"");
			html += "</span></div>";
		}
		html += "</div>";
		
		html += "<div class='form-group'>";
		field = record.exams_question_type;
		if(field && field.value){
			html += "<label class='col-xs-3' for='exams_library_code'>";
			html += field.display;
			html += "</label>";
			html += "<div class='col-xs-9'>";
			var type = field.value;
			if(type == 1){
				html += "<span style='color:#d9534f;'><i class='fa fa-question-circle'></i></span>";
				html += "<span style='font-weight:300;font-size:1.0em;color:#d9534f;'>问答</span>"; 
			}else if(type == 2){
				html += "<span style='color:#5bc0de;'><i class='fa  fa-dot-circle-o'></i></span>";
				html += "<span style='font-weight:300;font-size:1.0em;color:#5bc0de;'>单选题</span>";
			}else if(type == 4){
				html += "<span style='color:#5cb85c;'><i class='fa fa-check-square-o'></i></span>";
				html += "<span style='font-weight:300;font-size:1.0em;color:#5cb85c;'>多选题</span>"; 
			}else if(type == 8){
				html += "<span style='color:#f0ad4e;'><i class='fa fa-pencil-square-o'></i></span>";
				html += "<span style='font-weight:300;font-size:1.0em;color:#f0ad4e;'>填空题</span>";
			}
			html += "</div>";
		}
		html += "</div>";
		
		html += "<div class='form-group'>";
		field = record.exams_question_owner;
		if(field && field.show){
			html += "<label class='col-xs-3' for='exams_library_code'>";
			html += field.display;
			html += "</label>"+
			"<div class='col-xs-9'>"+
			"<span style='color:rgb(29,178,151);'><i class='fa fa-user'></i></span>"+
			"<span style='font-weight:300;font-size:1.0em;color:rgb(29,178,151);'>";
			html += tek.dataUtility.stringToHTML(field.show||"");
			html += "</span></div>";
		}
		html += "</div>";
		
		html += "<div class='form-group'>";
		field = record.exams_question_end;
		if(field && field.show){
			html += "<label class='col-xs-3' for='exams_library_code'>";
			html += field.display;
			html += "</label>";
			html += "<div class='col-xs-9'>"+
			"<span style='font-weight:300;font-size:1.0em;'>";
			html += tek.dataUtility.stringToHTML(field.show||"");
			html += "</span></div>";
		}
		html += "</div>";
		
		html += "<div class='form-group'>"+
		"<div class='col-xs-12 center'>"+
	 	"<button type='button' class='btn btn-info' style='font-size:1.0em;' onclick='editQuestionInfo(\"";
		if(record.id)
			html += record.id;
		html += "\");'>编辑</button>";				
		html += "</div></div>";

		$("#read-info-div").html(html);
	}
	
}
//=======================================================================================================================//
/*编辑问题信息*/
function editQuestionInfo(question_id){
	var question_id = questionId;
	
	var url= tek.common.getRootPath()+
	"http/ican/question/edit.html?exams_question_id="+question_id+"&show-close=1&refresh-opener=1";

	window.open(url, "_blank");
}


/*新建问题信息*/
function addQuestionInfo(){
	$("#read-info-div").show("slow");
	$("#add-info-div").hide("slow"); 
}

/*添加答案信息*/
function submitAnswerInfo(){
	$("#new-answer").hide("slow");
}

/*保存编辑答案信息*/
function getEditAnswerInfo(answer){
	if(answer=="answer1"){
		$("#answer1").hide("slow");
	}else if(answer=="answer2"){
		$("#answer2").hide("slow");
	}
}



//==================================================数据类型的转换==================================================//
function getLongDateByStringDate(stringDate){
	var newStringDate = stringDate;
	if(newStringDate){
		newStringDate = replaceMyString(newStringDate,"-","/");
		if(newStringDate){
			if(newStringDate.indexOf(":") <= 0)
				newStringDate += " 00:00:00"
		}else{
			newStringDate = stringDate;
		}
	}
	
	var dateDate = new Date(newStringDate);
	return dateDate.getTime();
}

//字符串替换
function replaceMyString(str,oldStr,newStr){
	var ns = str;
	if(str){
		do{
			ns = ns.replace(oldStr,newStr);
		}while(ns.indexOf(oldStr) > -1);
	}
	return ns;
}

//===============================================================================================================//