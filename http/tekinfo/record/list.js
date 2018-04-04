// JavaScript Document
var request = tek.common.getRequest();
/*初始化*/
function init(){
  showOpenClass("security");
  showSubClass("record_list");

  initParams();
  tek.macList.getList();
}
/**
 * mac-list.js的初始化参数
 */
function initParams() {
  tek.macList.ajaxURL=tek.common.getRootPath()+"servlet/objectrecord";    //Ajax取得列表信息的访问地址
 
  var key=new Array();
  key.push("record_");
  key.push("skip");
  key.push("order");
  key.push("desc");
  tek.macList.params=tek.common.getRequestParams(key,request,tek.macList.params,true);
  tek.macList.params["objectName"]="ObjectRecord";
  tek.macList.params["action"]="getList";
  tek.macList.params["count"]=tek.macList.PAGE_COUNT;
  
  tek.macList.columns=new Array();    //显示列
  tek.macList.columns.push('record_name');
  tek.macList.columns.push('record_user');
  tek.macList.columns.push('record_object');
  tek.macList.columns.push('record_command');
  tek.macList.columns.push('record_os');
  tek.macList.columns.push('record_time');
  tek.macList.columns.push('record_ip');
  
  tek.macList.searchs=new Array();    // 快速检索域
  tek.macList.searchs.push("record_name");
}
/**
 * 添加列数据
 *
 * @param field
 *           列数据
 * @param record
 *           信息
 * @param data
 *           信息
 * @param sb
 *           标签字符串
 */
tek.macList.appendCustomListField=function(field,record,data) {
  var html = "";
  if(!field || !record || !data){
    return html;
  }
  
  var fieldName=field.name;
  if(!fieldName){
    return html;
  }

  var show=field.show;
  if(!show)
    show="";

  if(fieldName=="record_os"){
  	var array=tek.dataUtility.stringToArray(field.value,";");
  	if(array&&array.length>=3){
        if(array[0]){
          html += "<span class='label label-warning'>";
          html +=array[0];
          html += "</span>";
  	    }
        if(array[1]){
          html += "<span class='label label-success'>";
          html += array[1];
          html += "</span>";
        }
        if(array[2]){
          html += "<span class='label label-info'>";
          html += array[2];
          html += "</span>";
        }
      } else {
        // 普通列数据
        html += tek.macList.appendDefaultListField(field,record,data);
      } // end else
    
  } else {
    // 普通列数据
    html += tek.macList.appendDefaultListField(field,record,data);
  } // end else
  return html;
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
tek.macList.appendListOperation=function(record,data) {
  if(!record || !data)
    return;

  var id=record.id;
  var sb = new StringBuffer();
  sb.append("<span id='operate-");
  sb.append(id);
  sb.append("'>");
  
  sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readInfo(\"");
  sb.append(id);
  sb.append("\");'>");
  sb.append("<ib class='icon-ok'>查看</b> </button>");

 // if(tek.right.isCanDelete(mySecurity)){
    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:removeRecord(\"");
    sb.append(id);
    sb.append("\",\"");
	  sb.append(record.name);
	  sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
 // }
  
  sb.append("</span>");
  return sb.toString();
}

//查看用户
function readInfo(id){ 
	var html = tek.common.getRootPath() + "http/tekinfo/record/read.html?record_id=" + id;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}

//删除用户
function removeRecord(id, name){
  var params={};
  params["objectName"]="ObjectRecord";
  params["action"]="removeInfo";
  params["record_id"]=id;
  
  tek.macList.removeInfo(id, name, params);
}

//批量删除选中的服务器 
function removeList() {
  var params={};
  params["objectName"]="ObjectRecord";
  params["action"]="removeList";
  tek.macList.removeList(params);
}

//响应刷新事件   
function customRefresh(){	
	tek.macList.getList();
}

//新建登录账号
