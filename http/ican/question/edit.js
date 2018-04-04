// JavaScript Document
/**************************************************
 *	
 编辑问题页面 edit.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================
//显示字段数组
var questionId; //问题的标识
var items = new Array("exams_question_code","exams_question_name","exams_question_end");//exams_question_tags
var Tags;
//=====================================================Function===============================
/**
 * 初始化
 */
function init(){
  questionId = request["exams_question_id"];

  if(questionId){
	  //初始化按钮
	  tek.macEdit.initialCustomButton("btn");
	  editNew(); 
  }
  
  //日历初始化
  initNoteCalender( {
	  type: "note",
	  daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
	  datestr: "",
	  begin: "2010,1"
  });

}


/*编辑问题信息*/
function editNew(question_id){
	var params={};
 	params["objectName"]="ExamsQuestion";
 	params["action"]="getEdit";
  	params["exams_question_id"]=questionId;
	
    tek.macEdit.getEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"add-question-info");
}

//提交信息
function setNewInfo(){
  var mydata= tek.common.getSerializeObjectParameters("add_question_form") || {};	//转为json
  mydata["objectName"] = "ExamsQuestion";
  mydata["action"] = "setInfo";
  mydata["exams_question_id"]=questionId;
  
  var questionEnd=mydata["exams_question_end"];
  if(questionEnd){
	questionEnd=decodeURIComponent(questionEnd);
	mydata["exams_question_end"] = getLongDateByStringDate(questionEnd);
  }
	
  tek.macEdit.editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);
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

//-----------------------------------------------------------------------------------
// 执行页面自定义的初始化按钮函数  --mac-edit.js中调用
tek.macEdit.initialCustomButton = function (parentId) {
	var html = "<button type='submit' id='submitBtn' class='btn btn-danger'>提交</button>";

	if (showClose == 1) {
		//显示关闭按钮
		html += "<button type='button' id='closeBtn' class='btn btn-info' onclick='tek.common.closeWithConfirm();'>关闭</button>";
	} else if (callbackURL) {
		//显示返回按钮
		html += "<button type='button' id='callbackBtn' class='btn btn-success' onclick='tek.common.callbackWithConfirm(callbackURL)'>返回</button>";
	} else {
		// 显示“提交”、“重置”
		html += "<button type='reset' class='btn btn-success'>重置</button>";
	}

	$("#" + parentId).html(html);
};