var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var params_obj = tek.common.getRequest();

function init() {
    showOpenClass("zone");
    showSubClass("state");
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";

    tek.macList.params = {};
    var key = new Array();
    key.push("state_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    if(params_obj["country_code"] && params_obj["country_locale"]){
      tek.macList.params["state_country"] = params_obj["country_code"];
      tek.macList.params["state_locale"] = params_obj["country_locale"];
    }

    tek.macList.params["objectName"] = "State";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    tek.macList.params["order"] = 'modifyTime';
    tek.macList.params["desc"] = 1;

    tek.macList.columns = [
        "state_code",
        "state_name",
        "state_fullname",
        "state_shortname",
        "state_areacode",
        "state_timezone",
        "state_country",
        "state_locale"
    ];

    // 快速检索域
    tek.macList.searchs = [
        "state_code",
        "state_name",
        "state_fullname",
        "state_shortname",
        "state_areacode",
        "state_timezone",
        "state_locale",
        "state_valid"
    ];
}

tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
        return "";
    }

    var code = record.state_code && tek.dataUtility.stringToHTML(record.state_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readOrganization(\"");
    // sb.append(id + "\");'>");
    // sb.append("<b class='icon-ok'>查看</b> </button>&nbsp;");

    // sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editOrganization(\"");
    // sb.append(id + "\");'>");
    // sb.append("<b class='icon-ok'>编辑</b> </button>");

    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editState(\"");
    sb.append(code + "\",\""+ record["state_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>编辑</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addCity(\"");
    sb.append(code + "\",\""+ record["state_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>新建市/县</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:showCurCity(\"");
    sb.append(code + "\",\""+ record["state_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>查看市/县</b> </button>");

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
function deleteOrganization(state_id, state_name) {
    var params = {};
    params["objectName"] = "State";
    params["action"] = "removeInfo";
    params["state_id"] = state_id;

    tek.macList.removeInfo(state_id, state_name, params);
}

//批量删除选中的记录
//删除记录
function deleteState(id,name,state_code, state_locale) {
  var params = {};
  params["objectName"] = "State";
  params["action"] = "removeInfo";
  params["state_code"] = state_code;
  params["state_locale"] = state_locale;

  tek.macList.removeInfo(id, name, params);
}

//编辑记录
function editState(state_code,state_locale) {
    var sb = new StringBuffer();
    sb.append("edit.html?state_code=");
    sb.append(state_code + "&state_locale=" + state_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addCity(state_code,state_locale) {
    var sb = new StringBuffer();
    sb.append("../city/add.html?state_code=");
    sb.append(state_code + "&state_locale=" + state_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

// showCurCity
function showCurCity(state_code,state_locale) {
    var sb = new StringBuffer();
    sb.append("../city/admin.html?state_code=");
    sb.append(state_code + "&state_locale=" + state_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}


tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
