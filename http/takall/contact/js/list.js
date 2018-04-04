// JavaScript Document

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
function appendCustomListField(field,record,data,sb) {
  if(!field || !record || !data || !sb)
    return;
   
  var fieldName=field.name;
  if(!fieldName)
    return;

  var show=field.show;
  if(!show)
    show="";

 
    appendDefaultListField(field,record,data,sb);
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
function appendListOperation(record,data,sb) {
  if(!record || !data || !sb)
    return;

  var id=record.id;

  sb.append("<span id='operate-");
  sb.append(id);
  sb.append("'>");
  
  if(mySecurity >= 0x40){
	sb.append(" <button class='btn btn-xs btn-success' onClick='javascript:readInfo(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>查看</b> </button>" );
	  
    sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editInfo(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>" );

    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:removeAppointInfo(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  }
  
  sb.append("</span>");
}

//删除指定信息
function removeAppointInfo(id, name){
	
	var ajaxURL = "../../../servlet/contact";
	
	var ajaxParams = {};
	
	
	ajaxParams["objectName"] = "Contact";
	ajaxParams["action"] = "removeContact";
	ajaxParams["contact_id"] = id;
		
	removeInfo(id, name, ajaxURL, ajaxParams); //调用 mac-list.js 中的函数执行删除操作
}

//批量删除选中的记录 
function removeMultiterm() {
	var ajaxURL = "../../../servlet/contact";
	var ajaxParams = {};
	ajaxParams["objectName"] = "Contact";
	ajaxParams["action"] = "removeList";
	
	removeList(ajaxURL, ajaxParams);  //调用 mac-list.js 中的函数执行删除操作
}



/**
 * 查看详细
 */
function readInfo(id){
	var url=new StringBuffer();
	url.append("read.html?show_close=1&refresh_opener=1&callback_url=list.html&contact_id="+id);
	
	
	window.open(url.toString());
}

function creatNew() {
	var url=new StringBuffer();
	url.append("add.html?show_close=0&refresh_opener=1&callback_url=list.html");
	window.open(url.toString());
}

/**
 * 修改标签
 *
 * @param id
 *           标签标识
 */
function editInfo(id){
	var url=new StringBuffer();
	url.append("edit.html?contact_id=");
	url.append(id);
	url.append("&show_close=1&refresh_opener=1&callback_url=list.html");
	window.open(url.toString());
}

//响应刷新事件   
function customRefresh(){	

	getList();
}
