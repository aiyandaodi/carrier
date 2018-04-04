var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var request = tek.common.getRequest();

function init() {
    showOpenClass("organization_manager");
    showSubClass("organization");
	
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";
    tek.macList.params = {};
    var key = new Array();
    key.push("organization_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "Organization";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
   
    tek.macList.columns = ["organization_code","organization_name","organization_person","organization_leader","organization_type","organization_status"];
	
	
    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("organization_code");
    tek.macList.searchs.push("organization_name");
    tek.macList.searchs.push("organization_fullname");
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

    if (fieldName == "organization_valid") {
        var status = field.value;
        if(status in COUNTRY_STATUS_COLOR){
            html += "<span class='label label-"+COUNTRY_STATUS_COLOR[status]+"'>" + show + "</span>";
        }
        /*
        if (status == 1) {
            html += "<span class='label label-"+COUNTRY_STATUS_COLOR[1]+"'>" + show + "</span>";
        } else {
            html += "<span class='label label-"+COUNTRY_STATUS_COLOR[-1]+"'>" + show + "</span>";
        }*/

    }
    else {
        // 普通列数据
        html += tek.macList.appendDefaultListField(field, record, data);
    }

    return html;
};

tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
        return "";
    }

    var code = record.organization_code && tek.dataUtility.stringToHTML(record.organization_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

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


//新建
function createNew(){
	var html = tek.common.getRootPath() + "http/imark/organization/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}
//读取信息
function readInfo(organization_id) {
    var url = tek.common.getRootPath() + "http/imark/organization/read.html?organization_id=" + organization_id;
	url += "&show-close=1&refresh-opener=1";
    window.open(url);
}
//编辑记录
function editInfo(organization_id) {
    var url = tek.common.getRootPath() + "http/imark/organization/edit.html?organization_id=" + organization_id;
	url += "&show-close=1&refresh-opener=1";
    window.open(url);
}
//删除记录
function removeInfo(organization_id,name) {
  var params = {};
  params["objectName"] = "Organization";
  params["action"] = "removeInfo";
  params["organization_id"] = organization_id;
	
  tek.macList.removeInfo(organization_id, name, params);
}



//批量删除
function removeList() {
	var params = {};
	params["objectName"] = "Organization";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
