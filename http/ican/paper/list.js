var request  = tek.common.getRequest();

function init(){
  showOpenClass("exams");
  
  showSubClass("paper");
  
  initParams();
  tek.macList.getList();
}

/**
 * mac-list.js的初始化参数
 */
function initParams() {
  tek.macList.ajaxURL=tek.common.getRootPath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
  
  tek.macList.params={};    //Ajax取得列表信息的调用参数
  tek.macList.params["objectName"]="ExamsPaper";
  tek.macList.params["action"]="getList";
  tek.macList.params["count"]=tek.macList.PAGE_COUNT;
  if(request["exams_test_id"])
    tek.macList.params["exams_test_id"]=request["exams_test_id"];
  
  tek.macList.columns=new Array();    //显示列
  tek.macList.columns.push('exams_paper_code');
  tek.macList.columns.push('exams_paper_name');
  tek.macList.columns.push('exams_paper_start');
  tek.macList.columns.push('exams_paper_end');
  tek.macList.columns.push('exams_paper_status');
  tek.macList.columns.push('exams_paper_score');
  tek.macList.columns.push('exams_paper_result');
  tek.macList.columns.push('exams_paper_owner');
  tek.macList.columns.push('exams_paper_test');
  
  tek.macList.searchs=new Array();    // 快速检索域
  tek.macList.searchs.push("exams_paper_name");
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
    if (!field || !record || !data)
        return html;

    var fieldName = field.name;
    if (!fieldName)
        return html;

    var show = field.show || "";

    
    // 普通列数据
    html += tek.macList.appendDefaultListField(field, record, data);


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
tek.macList.appendListOperation = function (record, data){
  if(!record || !data)
    return;

  var sb = new StringBuffer();
  var id=record.id;

  sb.append("<span id='operate-");
  sb.append(id);
  sb.append("'>");
  
  sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readInfo(\"");
  sb.append(id);
  sb.append("\",\"");
  sb.append(record.name);
  sb.append("\",\"")
  sb.append(record.exams_paper_start.show);
  sb.append("\");'>");
  sb.append("<b class='icon-ok'>查看</b> </button>");

//  if(mySecurity >= 0x40){
//    sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editInfo(\"");
//    sb.append(id);
//    sb.append("\");'>");
//    sb.append("<b class='icon-pencil'>编辑</b> </button>" );

    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:removeInfo(\"");
    sb.append(id);
    sb.append("\",\"");
	  sb.append(record.name);
	  sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
//  }
  
  sb.append("</span>");
  
  return sb.toString();
}

function createNew(){
	var html = tek.common.getRootPath() + "http/ican/paper/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}

//查看数据
function readInfo(id, name, time){ 
  var html = tek.common.getRootPath() + "http/ican/paper/read.html?paper_id=" + id;
  html += "&exams_paper_name=" + encodeURI(name);
  html += "&exams_paper_start=" + encodeURI(time);
  html += "&refresh-opener=1";
  window.open(html);
}
//编辑数据
function editInfo(id){
	var html = tek.common.getRootPath() + "http/ican/paper/edit.html?paper_id=" + id;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}

//返回上一级页面
function goback() {
	window.history.back();
}

//删除用户
//function removeInfo(id, name){
//  var remove=window.confirm("确定删除“"+name+"”?");
//  if (!remove)
//    return ;
//
//  $.ajax({
//    type: "post",
//    url: ajaxURL,
//    dataType: "json",
//    data: {
//        objectName:"ExamsPaper",
//        action:"removeInfo",
//        "exams_paper_id":id,
//    },
//
//    success: function(data) {
//        if(data){
//          if (data.code==0){
//            removeCheck(1);
//            getList();
//		  } else
//			showError(data.code+" - "+data.message);
//        } else
//		  showError("删除错误!");
//    },
//
//    error: function(request) {
//      //showMessage("登录操作失败!");
//      showMessage("删除操作失败!"+request.status+" - "+request.response);
//    }
//  });
//}

function removeInfo(id, name) {
	var params = {};
	params["objectName"] = "ExamsPaper";
	params["action"] = "removeInfo";
	params["exams_paper_id"] = id;

	tek.macList.removeInfo(id, name, params);
}

//批量删除选中的用户记录 
function removeList() {
	var params = {};
	params["objectName"] = "ExamsPaper";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}
function customRefresh(){
	tek.macList.customRefresh();
}
//批量删除选中的用户记录 
//function removeList() {
//  if (!selected || selected.length <=0) {
//     alert("没有选中待删除记录!");
//     return ;
//  }
//
//  var objectIds=new StringBuffer();
//  var count=0;
//  for (var i=0; i<selected.length; i++) {
//    if (selected[i] && selected[i]>0){
//	  if(count>0)
//	    objectIds.append(";");
//      objectIds.append(selected[i]);
//	  count++;
//	}
//  }
//
//  var remove=window.confirm("确定删除选中的"+count+"条用户记录？");
//  if (!remove)
//    return ;
//
//  $.ajax({
//    type: "post",
//    url: ajaxURL,
//    dataType: "json",
//    data: {
//        objectName:"ExamsPaper",
//        action:"removeList",
//        "object-ids":objectIds.toString(),
//    },
//
//    success: function(data) {
//        if(data){
//          if (data.code==0){
//            removeCheck(data.value);
//            getList();
//		  } else
//			showError(data.code+" - "+data.message);
//        } else
//		  showError("删除错误!");
//    },
//
//    error: function(request) {
//      //showMessage("登录操作失败!");
//      showMessage("删除操作失败!"+request.status+" - "+request.response);
//    }
//  });
//}
