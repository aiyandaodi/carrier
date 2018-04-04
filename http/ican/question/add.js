// JavaScript Document
/**************************************************
 *	新建问题页面 add.js
 *	
 *	
 *	
 **************************************************/
//=====================================================init==================================
var libraryId; //
var questionType;//问题的类型

/**
 * 初始化
 */
function init(){
	libraryId = request["exams_library_id"];
	questionType = request["exams_question_type"];

	if(libraryId){
		tek.macEdit.initialCustomButton("btn");
		addNew();
	}

	//日历初始化
	initNoteCalender( {
		type: "note",
		daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
		datestr: "",
		begin: "2010,1"
	});

}
//=====================================================Parameter=============================
//显示字段数组
var items = new Array("exams_question_code","exams_question_name","exams_question_tags","exams_question_end");
var Tags;
//=====================================================Function===============================
//获得显示的字段
function addNew(){
	if(!libraryId)
		return;
	var params={};
	params["objectName"]="ExamsQuestion";
	params["action"]="getNew";
	params["exams_library_id"]=libraryId;
 
 	if(!questionType)
		items.push("exams_question_type");
		
	tek.macEdit.getEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"add-question-info");
}

tek.macEdit.customOperation = function(data, items, parent){
	tek.macEdit.defaultOperation(data, items, parent);
	//获取标签
	getTags(proTags);
}

tek.macEdit.appendCustomEditField = function(field, record){
	var html = "";
	if (!tek.type.isObject(field) || tek.type.isEmpty(field.name)){
		return html;
	}

	var fieldname = field.name;

    if(fieldname == "exams_library_catalog"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
				+ tek.macEdit.appendNameField(field)
				+ "<div class='col-xs-9'>";
				
        html += '<input type="text" class="form-control" id="' + field.name + 'Text" value="" placeholder="请输入' + field.display + '">';
        html += '<input type="hidden" id="' + field.name + '" name="' + field.name + '" />'
        html+='<font class = "red" id="'+field.name+'_text"></font> </div>';
		
		html+="</div>"

    }else if(fieldname === "exams_question_tags"){
		html += "<div id='" + fieldname + "-form-group' class='form-group'>"
				+ tek.macEdit.appendNameField(field)
				+ "<div class='col-xs-9'>";

		html += '<div id="exams_question_tags" class="col-md-12" style="overflow:hidden">'
				+ '<ul id="lib-common-tags-ul" class="col-md-12 radio-checkbox-ul"></ul>'
				+ '</div>';

		html += "</div></div>";
        proTags = field.value;
		// html += "<div class='col-xs-2' id='organization_tags_text'>提示信息</div>";

		// 加上提示的text
	}else{
		html = tek.macEdit.appendDefaultEditField(field, record);	
	}

	return html;
}

//提交信息
function addNewQuestionInfo(){
	if(!libraryId)
		return;
	
	var mydata = tek.common.getSerializeObjectParameters("add_question_form") || {};	//转为json
	
	mydata["objectName"] = "ExamsQuestion";
	mydata["action"] = "addInfo";
	mydata["exams_library_id"]=libraryId;
	
	var questionEnd=mydata["exams_question_end"];
	if(questionEnd){
		questionEnd=decodeURIComponent(questionEnd);
		mydata["exams_question_end"] = getLongDateByStringDate(questionEnd);
	}
	
	if(questionType){
		mydata["exams_question_type"] = questionType;
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