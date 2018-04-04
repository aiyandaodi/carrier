var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var request = tek.common.getRequest();

// 机构状态颜色
var COUNTRY_STATUS_COLOR = {
    "-1": "danger",
    "0": "warning",
    "1":"success"
};


function init() {
    showOpenClass("zone");
    showSubClass("country");
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";
    tek.macList.params = {};
    var key = new Array();
    key.push("country_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "Country";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    // tek.macList.columns = ["country_code","country_name","country_shortname","country_timezone","country_areacode","country_locale"];
    tek.macList.columns = ["country_code","country_name","country_fullname","country_timezone","country_areacode","country_locale","country_valid"];

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("country_code");
    tek.macList.searchs.push("country_name");
    tek.macList.searchs.push("country_fullname");
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

    if (fieldName == "country_valid") {
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

    var code = record.country_code && tek.dataUtility.stringToHTML(record.country_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editCountry(\"");
    sb.append(code + "\",\""+ record["country_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>编辑</b> </button>");

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addCountry(\"");
    // sb.append(code + "\",\""+ record["country_locale"]["value"] +"\");'>");
    // sb.append("<b class='icon-ok'>新建国家</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addProvince(\"");
    sb.append(code + "\",\""+ record["country_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>新建省/州</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:showProvince(\"");
    sb.append(code + "\",\""+ record["country_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>查看省/州</b> </button>");

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteCountry(\"");
    sb.append(id + "\",\""+ record["country_name"]["value"] +"\",\""+ code +"\",\""+ record["country_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>删除</b> </button>");

    return sb.toString();
}

//删除记录
function deleteCountry(id,name,country_code, country_locale) {
  var params = {};
  params["objectName"] = "Country";
  params["action"] = "removeInfo";
  params["country_code"] = country_code;
  params["country_locale"] = country_locale;

  tek.macList.removeInfo(id, name, params);
}

//编辑记录
function editCountry(country_code,country_locale) {
	var url = tek.common.getRootPath() + "http/takall/country/edit.html?country_code=" + country_code;
	url += "&country_locale=" + country_locale;
	url += "&show-close=1&refresh-opener=1"
    window.open(url);
}

function addCountry(country_code,country_locale) {
    var sb = new StringBuffer();
    sb.append("add.html?");
    // sb.append(country_code + "&country_locale=" + country_locale);
    sb.append("show-close=1&refresh-opener=1");
    window.open(sb.toString());
}
//新建省/州
function addProvince(country_code,country_locale) {
  
	var url = tek.common.getRootPath() + "http/takall/state/add.html?country_code=" + country_code;
	url += "&country_locale=" + country_locale;
	url += "&show-close=1&refresh-opener=1";
    window.open(url);
}

function showProvince(country_code,country_locale) {
   callSubServicePage("http/takall/state/");
   var sessionStorage = window.sessionStorage;
   if(sessionStorage){
        sessionStorage.setItem('country_code', country_code);
        sessionStorage.setItem('country_locale', country_locale);
   }
//    window.open(sb.toString());
}

//查看数据
function readOrganization(country_code, org_id) {
    var sb = new StringBuffer();
    sb.append("read.html?");
    sb.append("country_id=" + org_id);
    window.open(sb.toString());
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}

//新建数据
function addNew(){
	var html = tek.common.getRootPath() + "http/takall/country/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}

//批量删除选中的记录 
function removeList() {
	var params = {};
	params["objectName"] = "Country";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}
//响应刷新事件
function customRefresh() {
    tek.macList.getList();
}