var request = tek.common.getRequest();

function init(){
	var cssurl=tek.common.getRootPath()+"http/ican/audit/list.css";
	//alert("cssurl="+cssurl);
//	loadCSS(cssurl);

	showOpenClass("exams");
	showSubClass("library");
	initParams();
  	tek.macList.getList();
}


/**
 * mac-list.js的初始化参数
 */
function initParams() {
  tek.macList.ajaxURL=tek.common.getRootPath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
  
  tek.macList.params={};    //Ajax取得列表信息的调用参数
  var key=new Array();
  key.push("exams_paper_");
  tek.macList.params=tek.common.getRequestParams(key,request,tek.macList.params,true);
  tek.macList.params["objectName"]="ExamsLibrary";
  tek.macList.params["action"]="getList";
  tek.macList.params["count"]=tek.macList.PAGE_COUNT;
  tek.macList.params["skip"]=0;
  tek.macList.params["order"]="exams_library_code";
  tek.macList.params["desc"]=0;
	
  if(request["exams_test_id"])
    tek.macList.params["exams_test_id"]=request["exams_test_id"];

  tek.macList.columns=new Array();    //显示列
  tek.macList.columns.push('exams_library_code');
  tek.macList.columns.push('exams_library_name');
  tek.macList.columns.push('exams_library_catalog');
  tek.macList.columns.push('exams_library_tags');
  tek.macList.columns.push('exams_library_grade');
  tek.macList.columns.push('exams_library_group');
  tek.macList.columns.push('exams_library_owner');
  tek.macList.columns.push('exams_library_end');
	
  
  tek.macList.searchs=new Array();    // 快速检索域
  tek.macList.searchs.push("exams_library_name");
}
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
  sb.append("\");'>");
  sb.append("<b class='icon-ok'>查看</b> </button>");

  //if(mySecurity >= 0x40){
    sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editInfo(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>" );

    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:removeInfo(\"");
    sb.append(id);
    sb.append("\",\"");
	  sb.append(record.name);
	  sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
 // }
  
  sb.append("</span>");
  
  return sb.toString();
}

//新建题库
function addNew(){
	var html = tek.common.getRootPath() + "http/ican/library/add.html?show-close=1&refresh-opener=1";
  	window.open(html);
}

//查看数据
function readInfo(id){ 
  var html = tek.common.getRootPath() + "http/ican/library/read.html?exams_library_id=" + id;
  html += "&refresh-opener=1";
   window.open(html);
}
function editInfo(id){
	var html = tek.common.getRootPath() + "http/ican/library/edit.html?exams_library_id=" + id;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}
//返回上一级页面
function goback() {
	window.history.back();
}
function customRefresh(){
  tek.macList.customRefresh();
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
	params["objectName"] = "ExamsLibrary";
	params["action"] = "removeInfo";
	params["exams_library_id"] = id;

	tek.macList.removeInfo(id, name, params);
}

//批量删除选中的用户记录 
function removeList() {
	var params = {};
	params["objectName"] = "ExamsLibrary";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}

//批量删除选中的用户记录 
/*function removeList() {
  if (!tek.macList.selected || tek.macList.selected.length <=0) {
     alert("没有选中待删除记录!");
     return ;
  }

  var objectIds=new StringBuffer();
  var count=0;
  for (var i=0; i<tek.macList.selected.length; i++) {
    if (tek.macList.selected[i] && tek.macList.selected[i]>0){
	  if(count>0)
	    objectIds.append(";");
      objectIds.append(tek.macList.selected[i]);
	  count++;
	}
  }

  var remove=window.confirm("确定删除选中的"+count+"条用户记录？");
  if (!remove)
    return ;

  $.ajax({
    type: "post",
    url: ajaxURL,
    dataType: "json",
    data: {
        objectName:"ExamsPaper",
        action:"removeList",
        "object-ids":objectIds.toString(),
    },

    success: function(data) {
        if(data){
          if (data.code==0){
            tek.macList.removeCheck(data.value);
            getList();
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
}*/
