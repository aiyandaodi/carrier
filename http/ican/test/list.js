// JavaScript Document

var request = tek.common.getRequest();


function init(){
  showOpenClass("exams");
  showSubClass("test");
  
  initParams();
  tek.macList.getList();
  $("#select0").removeAttr("checked");
}

/**
 * mac-list.js的初始化参数
 */
function initParams() {
  tek.macList.ajaxURL=tek.common.getRootPath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
  
  //tek.macList.params={};    //Ajax取得列表信息的调用参数
  var key=new Array();
  key.push("exams_test_");
  key.push("skip");
  key.push("order");
  key.push("desc");
  tek.macList.params=tek.common.getRequestParams(key,request,tek.macList.params,true);
  tek.macList.params["objectName"]="ExamsTest";
  tek.macList.params["action"]="getList";
  tek.macList.params["count"]=tek.macList.PAGE_COUNT;
  // tek.macList.params["group_id"]=groupId;
  
  //tek.macList.columns=[];    //显示列
  tek.macList.columns.push('exams_test_name');
  tek.macList.columns.push('exams_test_grade');
  tek.macList.columns.push('createTime');
  tek.macList.columns.push('exams_test_score');
  /*tek.macList.columns.push('exams_test_read');
  tek.macList.columns.push('exams_test_write');*/
  tek.macList.columns.push('exams_test_type');
  tek.macList.columns.push('exams_test_start');
  tek.macList.columns.push('exams_test_end');
  tek.macList.columns.push('exams_test_duration');
  tek.macList.columns.push('exams_test_status');
  tek.macList.columns.push('exams_test_group');
  
  //tek.macList.searchs=new Array();    // 快速检索域
  tek.macList.searchs.push("exams_test_name");
}

/**
 * 添加列数据
 * @param {Object} field 列数据
 * @param {Object} record 数据记录
 * @param {Object} data 服务器返回的数据
 * @return {String} 拼接后的html字符串，可能是""
 */
tek.macList.appendCustomListField = function (field, record, data) {
    var html = "";
    if (!field || !record || !data){
      return html;
    }
    var fieldName = field.name;
    if (!fieldName){
      return html;
    }
    var show = field.show || "";
    if (fieldName == "exams_test_status") {
        var status = field.value;
        if (status in EXAMS_TEST_STATUS_COLOR) {
          html += "<span class='label label-"+EXAMS_TEST_STATUS_COLOR[status]+"'>" + show + "</span>";
        } 

    }
    else {
        // 普通列数据
        html += tek.macList.appendDefaultListField(field, record, data);
    }

    return html;
};

/**
 * 添加数据操作
 *
 * @param record
 *           信息
 * @param data
 *           信息
 * @param sb
 *           标签字符串
 */
tek.macList.appendListOperation = function (record, data) {
  if(!record || !data)
    return;

  var sb = new StringBuffer();
  var id=record.id;

  sb.append("<span id='operate-");
  sb.append(id);
  sb.append("'>");
  
  /*sb.append("<button class='btn btn-xs btn-info' onClick='javascript:readPaper(\"");
  sb.append(id);
  sb.append("\");'>");
  sb.append("<b class='icon-ok'>试卷</b> </button>");*/
  
  sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readInfo(\"");
  sb.append(id);
  sb.append("\");'>");
  sb.append("<b class='icon-ok'>查看</b> </button>");

  /*if(tek.right.isCanWrite(data.right)){*/
    sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editInfo(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>" );
  /*}*/
  /*if(tek.right.isCanDelete(data.right)){*/
	$("#remove-list-div").removeClass("hide");
    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:removeInfo(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  /*}*/
  
  sb.append("</span>");
  
  return sb.toString();
}

function creatNew(){
	var html = tek.common.getRootPath() + "http/ican/test/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}

//查看试卷列表
function readPaper(id){ 
  	var html = tek.common.getRootPath() + "http/ican/paper/index.html?exams_test_id=" + id +"&group_id=" + groupId;
  	window.open(html);
}

//查看考试
function readInfo(id){ 
  	var html = tek.common.getRootPath() + "http/ican/test/read.html?exams_test_id=" + id;
  	html += "&refresh-opener=1";
  	window.open(html);
}

//编辑考试
function editInfo(id){ 
	var html = tek.common.getRootPath() + "http/ican/test/edit.html?exams_test_id=" + id;
	html += "&show-close=1&refresh-opener=1";
  	window.open(html);
}

//删除考试
function removeInfo(id, name) {
	var params = {};
	params["objectName"] = "ExamsTest";
	params["action"] = "removeInfo";
	params["exams_test_id"] = id;

	tek.macList.removeInfo(id, name, params);
}

//批量删除选中的考试记录 
function removeList() {
	var params = {};
	params["objectName"] = "ExamsTest";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}


//刷新
function customRefresh(){
	tek.macList.customRefresh();
}

