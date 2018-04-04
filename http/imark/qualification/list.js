var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var request = tek.common.getRequest();

function init() {
    showOpenClass("exams");
	showSubClass("qualification");
	
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";
    tek.macList.params = {};
    var key = new Array();
    key.push("qualification_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "Qualification";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    // tek.macList.columns = ["qualification_code","qualification_name","qualification_shortname","qualification_timezone","qualification_areacode","qualification_locale"];
    tek.macList.columns = ["qualification_name","qualification_grade","qualification_authorizer","qualification_type","qualification_status"];

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("qualification_name");
    tek.macList.searchs.push("qualification_grade");
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

    if (fieldName == "qualification_valid") {
        var status = field.value;
        if(status in COUNTRY_STATUS_COLOR){
            html += "<span class='label label-"+COUNTRY_STATUS_COLOR[status]+"'>" + show + "</span>";
        }

    }
    else {
        // 普通列数据
        html += tek.macList.appendDefaultListField(field, record, data);
    }

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

//新建题库
function addNew(){
	var html = tek.common.getRootPath() + "http/imark/qualification/add.html?show-close=1&refresh-opener=1";
  	window.open(html);
}

//查看数据
function readInfo(id){ 
  var html = tek.common.getRootPath() + "http/imark/qualification/read.html?qualification_id=" + id;
  html += "&refresh-opener=1";
   window.open(html);
}
function editInfo(id){
	var html = tek.common.getRootPath() + "http/imark/qualification/edit.html?qualification_id=" + id;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}
//删除数据
function removeInfo(id, name) {
	var params = {};
	params["objectName"] = "Qualification";
	params["action"] = "removeInfo";
	params["qualification_id"] = id;

	tek.macList.removeInfo(id, name, params);
}

//批量删除选中的用户记录 
function removeList() {
	var params = {};
	params["objectName"] = "Qualification";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}
//刷新
function customRefresh(){
  tek.macList.customRefresh();
}
tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
