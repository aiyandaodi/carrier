var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var params_obj = tek.common.getRequest();

function init() {
    showOpenClass("zone");
    showSubClass("city");
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";

    tek.macList.params = {};
    var key = new Array();
    key.push("city_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);

    if(params_obj["state_code"] && params_obj["state_locale"]){
      tek.macList.params["city_state"] = params_obj["state_code"];
      tek.macList.params["city_locale"] = params_obj["state_locale"];
    }

    tek.macList.params["objectName"] = "City";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    tek.macList.params["order"] = 'modifyTime';
    tek.macList.params["desc"] = 1;

    tek.macList.columns = [
        "city_code",
        "city_name",
        "city_fullname",
        "city_state",
        "city_locale",
        "city_valid"
    ];

    // 快速检索域
    tek.macList.searchs = [
        "city_name",
        "city_fullname",
        "city_locale"
    ];
}

tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
        return "";
    }

    var code = record.city_code && tek.dataUtility.stringToHTML(record.city_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readOrganization(\"");
    // sb.append(id + "\");'>");
    // sb.append("<b class='icon-ok'>查看</b> </button>&nbsp;");

    // sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editOrganization(\"");
    // sb.append(id + "\");'>");
    // sb.append("<b class='icon-ok'>编辑</b> </button>");

    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editCity(\"");
    sb.append(code + "\",\""+ record["city_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>编辑</b> </button>");

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteOrganization(\"");
    sb.append(id);
    sb.append("\",\"");
    sb.append(record.name);
    sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");

    sb.append("</span>");

    return sb.toString();
}

//删除记录
function deleteOrganization(city_id, city_name) {
    var params = {};
    params["objectName"] = "City";
    params["action"] = "removeInfo";
    params["city_id"] = city_id;

    tek.macList.removeInfo(city_id, city_name, params);
}

//批量删除选中的记录
function removeLists() {
    var params = {};
    params["objectName"] = "City";
    params["action"] = "removeList";

    tek.macList.removeList(params);
}

//查看数据
function readOrganization(org_id) {
    var html="read.html?city_id="+org_id+"&refresh-opener=1";
    window.open(html);
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}


//删除记录
function deleteCity(id,name,city_code, city_locale) {
  var params = {};
  params["objectName"] = "City";
  params["action"] = "removeInfo";
  params["city_code"] = city_code;
  params["city_locale"] = city_locale;

  tek.macList.removeInfo(id, name, params);
}


//编辑记录
function editCity(city_code,city_locale) {
    var sb = new StringBuffer();
    sb.append("edit.html?city_code=");
    sb.append(city_code + "&city_locale=" + city_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addProvince(city_id) {
    var sb = new StringBuffer();
    sb.append("../state/add.html?city_id=");
    sb.append(city_id);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}
