// JavaScript Document
var request = tek.common.getRequest();
function init(){
	showOpenClass("group_space");
	showSubClass("group");
	
	initParams();
	tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";
    tek.macList.params = {};
    var key = new Array();
    key.push("qualification_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "Group";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    tek.macList.params["order"] = "group_code";
    
    tek.macList.columns = ["group_code","group_name","createTime","modifyTime","group_status","group_credit","group_subjects","group_members","group_speak",
                            "group_listen","group_owner","group_join","group_remark","group_latestTime"];

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("group_remark");
    tek.macList.searchs.push("group_name");
    tek.macList.searchs.push("group_locale");
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

tek.macList.appendListOperation = function (record, data) {
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


//新建数据
function createNew(){
	var html = tek.common.getRootPath() + "http/takall/group/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}
//编辑记录
function editInfo(id) {
    var html = tek.common.getRootPath() + "http/takall/group/edit.html?group_id=" + id;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}

//查看数据
function readInfo(id) {
    var html = tek.common.getRootPath() + "http/takall/group/read.html?group_id=" + id;
    html += "&refresh-opener=1";
    window.open(html);
}

//删除记录
function removeInfo(id,name) {
  var params = {};
  params["objectName"] = "Group";
  params["action"] = "removeInfo";
  params["group_id"] = id;

  tek.macList.removeInfo(id, name, params);
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
//批量删除
function removeList(){
	var params = {};
	params["objectName"] = "Group";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}