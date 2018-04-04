var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var request = tek.common.getRequest();

function init() {
    showOpenClass("organization_manager");
	showSubClass("component");
	
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";
    tek.macList.params = {};
    var key = new Array();
    key.push("component_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "OrganizationComponent";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    // tek.macList.columns = ["component_code","component_name","component_shortname","component_timezone","component_areacode","component_locale"];
    tek.macList.columns = ["component_code","component_name","component_fullname","component_timezone","component_areacode","component_locale","component_valid"];

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("component_code");
    tek.macList.searchs.push("component_name");
    tek.macList.searchs.push("component_fullname");
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

    if (fieldName == "component_valid") {
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

    var code = record.component_code && tek.dataUtility.stringToHTML(record.component_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editComponent(\"");
    sb.append(code + "\",\""+ record["component_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>编辑</b> </button>");

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addComponent(\"");
    // sb.append(code + "\",\""+ record["component_locale"]["value"] +"\");'>");
    // sb.append("<b class='icon-ok'>新建国家</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addProvince(\"");
    sb.append(code + "\",\""+ record["component_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>新建省/州</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:showProvince(\"");
    sb.append(code + "\",\""+ record["component_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>查看省/州</b> </button>");

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteComponent(\"");
    sb.append(id + "\",\""+ record["component_name"]["value"] +"\",\""+ code +"\",\""+ record["component_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>删除</b> </button>");

    return sb.toString();
}

//删除记录
function deleteComponent(id,name,component_code, component_locale) {
  var params = {};
  params["objectName"] = "Component";
  params["action"] = "removeInfo";
  params["component_code"] = component_code;
  params["component_locale"] = component_locale;

  tek.macList.removeInfo(id, name, params);
}

//编辑记录
function editComponent(component_code,component_locale) {
    var sb = new StringBuffer();
    sb.append("edit.html?component_code=");
    sb.append(component_code + "&component_locale=" + component_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addComponent(component_code,component_locale) {
    var sb = new StringBuffer();
    sb.append("add.html?");
    // sb.append(component_code + "&component_locale=" + component_locale);
    sb.append("show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addProvince(component_code,component_locale) {
    var sb = new StringBuffer();
    sb.append("../state/add.html?component_code=");
    sb.append(component_code + "&component_locale=" + component_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function showProvince(component_code,component_locale) {
    var sb = new StringBuffer();
    sb.append("../state/list.html?component_code=");
    sb.append(component_code + "&component_locale=" + component_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

//查看数据
function readOrganization(component_code, org_id) {
    var sb = new StringBuffer();
    sb.append("read.html?");
    sb.append("component_id=" + org_id);
    window.open(sb.toString());
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
