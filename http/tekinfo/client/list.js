// JavaScript Document

var request = tek.common.getRequest();
function init(){
  showOpenClass("system");
  showSubClass("client_client");
  var category=request["client_category"];
  if(category == 3)
  {
    showSubClass("client_list");
  }
  
  initParams();

  $("#addNew").attr("onclick","createNew("+category+")");
  tek.macList.getList();
}

/**
 * mac-list.js的初始化参数
 */
function initParams() {
  tek.macList.ajaxURL=tek.common.getRootPath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
  
  tek.macList.params={};    //Ajax取得列表信息的调用参数
  var key=new Array();
  key.push("client_");
  key.push("skip");
  key.push("order");
  key.push("desc");
  tek.macList.params=tek.common.getRequestParams(key,request,tek.macList.params,true);
  tek.macList.params["objectName"]="Client";
  tek.macList.params["action"]="getList";
  tek.macList.params["count"]=tek.macList.PAGE_COUNT;
  
  tek.macList.columns=new Array();    //显示列
  tek.macList.columns.push('client_code');
  tek.macList.columns.push('client_name');
  tek.macList.columns.push('client_domain');
  tek.macList.columns.push('client_type');
  tek.macList.columns.push('client_status');
  tek.macList.columns.push('createTime');
  
  tek.macList.searchs=new Array();    // 快速检索域
  tek.macList.searchs.push("client_name");
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
  if(!show){
    show="";
  }
	
  if(fieldName=="client_status"){
  	var status=field.value;
  	if (status in CLIENT_STATUS_COLOR) {
      html += "<span class='label label-"+CLIENT_STATUS_COLOR[status]+"'>" + show + "</span>";
    } 
 
  }else {
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
  if(!record || !data){
    return;
  }
  var sb = new StringBuffer();
  var id=record.id || "";

  sb.append("<span id='operate-");
  sb.append(id);
  sb.append("'>");

  sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readClient(\"");
  sb.append(id);
  sb.append("\");'>");
  sb.append("<b class='icon-ok'>查看</b> </button>");

  //if(mySecurity >= 0x40){
    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editClient(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>" );

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteClient(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
//  }
  sb.append("</span>");

  return sb.toString();
}

//查看数据
function readClient(client_id){
  var html = tek.common.getRootPath() + "http/tekinfo/client/read.html?client_id=" + client_id;
  html += "&show-close=1&refresh-opener=1";
  window.open(html);
}
		
//编辑数据
function editClient(client_id){
	var html = tek.common.getRootPath() + "http/tekinfo/client/edit.html?client_id=" + client_id;
	html += "&show-close=1&refresh-opener=1";
  	window.open(html);
}

//删除服务器
function deleteClient(client_id,client_name){
  var params={};
  params["objectName"]="Client";
  params["action"]="removeInfo";
  params["client_id"]=client_id;
  
  tek.macList.removeInfo(client_id, client_name, params);
}

//批量删除选中的服务器 
function removeList() {
  var params={};
  params["objectName"]="Client";
  params["action"]="removeList";
//  params["client_category"]=request["client_category"]; 
  tek.macList.removeList(params);
}

//新建client
function createNew(client_category){
	var html = tek.common.getRootPath() + "http/tekinfo/client/add.html?client_category=" + client_category;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}
