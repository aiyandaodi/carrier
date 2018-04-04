// JavaScript Document
var PAGE_COUNT=20;
var request = tek.common.getRequest();
/**
 * mac-list.js的初始化参数
 */
function initParams() {

  tek.macList.ajaxURL=tek.common.getRootPath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
  
  var key=new Array();
  key.push("authority_");
  key.push("skip");
  key.push("order");
  key.push("desc");
  
  //tek.macList.params={};    //Ajax取得列表信息的调用
  tek.macList.params= tek.common.getRequestParams(key, request, tek.macList.params, true);
  tek.macList.params["objectName"]="Authority";
  tek.macList.params["action"]="getList";
  tek.macList.params["count"]=tek.macList.PAGE_COUNT;
  
  tek.macList.columns=new Array();    //显示列
  tek.macList.columns.push('authority_name');
  tek.macList.columns.push('authority_type');
  tek.macList.columns.push('authority_client');
  tek.macList.columns.push('authority_user');
  tek.macList.columns.push('authority_start');
  tek.macList.columns.push('authority_end');
  tek.macList.columns.push('createTime');
  tek.macList.columns.push('modifyTime');
  tek.macList.columns.push('authority_status');

  tek.macList.searchs=new Array();    // 快速检索域
  tek.macList.searchs.push("authority_name");
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
tek.macList.appendCustomListField = function(field,record,data) {
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
	
  if(fieldName == "authority_status"){
	  var status=field.value;
	  if(status in AUTHORITY_STATUS_COLOR){
      html += "<span class='label label-"+AUTHORITY_STATUS_COLOR[status]+"'>" + show + "</span>";
    } 

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
tek.macList.appendListOperation = function(record,data) {
	if(!record || !data){
		return;
	}
    	
	var sb = new StringBuffer();
  	var id=record.id;

	sb.append("<span id='operate-");
	sb.append(id);
	sb.append("'>");
  
    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readAuthority(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-ok'>查看</b> </button>");
 /*   if(mySecurity >= 0x40){*/
	sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editAuthority(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>" );

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteAuthority(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
//  }
  	sb.append("</span>");
	
	return sb.toString();
}

//编辑授权
function editAuthority(id) {
	var html = tek.common.getRootPath() + "http/tekinfo/authority/edit.html?authority_id=" + id;
	html += "&show-close=1&refresh-opener=1";
    window.open(html);
}

//查看授权
function readAuthority(id) {
	var html = tek.common.getRootPath() + "http/tekinfo/authority/read.html?authority_id=" + id;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}

/**
 * 删除授权
 *
 * @param id
 *           授权标识
 * @param name
 *           授权名称
 */
function deleteAuthority(id,name){
  tek.macList.params={};
  tek.macList.params["objectName"]="Authority";
  tek.macList.params["action"]="removeInfo";
  tek.macList.params["authority_id"]=id;
  
  removeInfo(id, name,ajaxURL, tek.macList.params);
}

/**
 * 批量删除选中的授权
 */
function removeList() {
  var params={};
  params["objectName"]="Authority";
  params["action"]="removeList";
  
  tek.macList.removeList(params);
}

//响应刷新事件
function customRefresh() {
    tek.macList.getList();
}
