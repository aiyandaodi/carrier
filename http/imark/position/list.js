var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var request = tek.common.getRequest();

function init() {
    showOpenClass("human_resource");
	showSubClass("position");
	
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";
    tek.macList.params = {};
    var key = new Array();
    key.push("position_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "JobPosition";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    // tek.macList.columns = ["position_code","position_name","position_shortname","position_timezone","position_areacode","position_locale"];
    tek.macList.columns = ["position_code","position_name","position_fullname","position_timezone","position_areacode","position_locale","position_valid"];

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("position_code");
    tek.macList.searchs.push("position_name");
    tek.macList.searchs.push("position_fullname");
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

    if (fieldName == "position_valid") {
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

    var code = record.position_code && tek.dataUtility.stringToHTML(record.position_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editPosition(\"");
    sb.append(code + "\",\""+ record["position_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>编辑</b> </button>");

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addPosition(\"");
    // sb.append(code + "\",\""+ record["position_locale"]["value"] +"\");'>");
    // sb.append("<b class='icon-ok'>新建国家</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addProvince(\"");
    sb.append(code + "\",\""+ record["position_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>新建省/州</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:showProvince(\"");
    sb.append(code + "\",\""+ record["position_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>查看省/州</b> </button>");

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deletePosition(\"");
    sb.append(id + "\",\""+ record["position_name"]["value"] +"\",\""+ code +"\",\""+ record["position_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>删除</b> </button>");

    return sb.toString();
}

//删除记录
function deletePosition(id,name,position_code, position_locale) {
  var params = {};
  params["objectName"] = "Position";
  params["action"] = "removeInfo";
  params["position_code"] = position_code;
  params["position_locale"] = position_locale;

  tek.macList.removeInfo(id, name, params);
}

//编辑记录
function editPosition(position_code,position_locale) {
    var sb = new StringBuffer();
    sb.append("edit.html?position_code=");
    sb.append(position_code + "&position_locale=" + position_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addPosition(position_code,position_locale) {
    var sb = new StringBuffer();
    sb.append("add.html?");
    // sb.append(position_code + "&position_locale=" + position_locale);
    sb.append("show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addProvince(position_code,position_locale) {
    var sb = new StringBuffer();
    sb.append("../state/add.html?position_code=");
    sb.append(position_code + "&position_locale=" + position_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function showProvince(position_code,position_locale) {
    var sb = new StringBuffer();
    sb.append("../state/list.html?position_code=");
    sb.append(position_code + "&position_locale=" + position_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

//查看数据
function readOrganization(position_code, org_id) {
    var sb = new StringBuffer();
    sb.append("read.html?");
    sb.append("position_id=" + org_id);
    window.open(sb.toString());
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
