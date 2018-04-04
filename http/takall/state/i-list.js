var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var params_obj = tek.common.getRequest();
// 机构状态颜色
var STATUS_COLOR = {
    "-1": "danger",
    "0": "warning",
    "1":"success"
};


function init() {
	if(SERVICE_CSS){
		//如果定义了SERVICE_CSS，本程序是被载入的，需要自己加载所需CSS文件
		SERVICE_CSS=(
			tek.common.getRootPath()+"http/takall/city/list.css"
		);
		loadCSS(tek.common.getRootPath()+"http/takall/city/list.css");
	}
	if(SERVICE_JS){
		//如果定义了SERVICE_JS，本程序是被载入的，需要自己加载所需JS文件
		SERVICE_JS=(
			//tek.common.getRootPath()+"http/takall/city/list.js"
		);
		//loadJavascript(tek.common.getRootPath()+"http/takall/city/list.js");
	}
	
    showOpenClass("zone");
    showSubClass("state");
	
    initParams();
    tek.macList.getList();
}

function unloadList(){
	//卸载CSS文件
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

    tek.macList.searchs=[];// 快速检索域
    tek.macList.searchs.push("state_code");
    tek.macList.searchs.push("state_name");
    tek.macList.searchs.push("state_fullname");
    tek.macList.searchs.push("state_shortname");
    tek.macList.searchs.push("state_areacode");
    tek.macList.searchs.push("state_timezone");
    tek.macList.searchs.push("state_locale");
}
/*添加数据*/
tek.macList.appendCustomListField = function(field, record, data){
    var html = "";
    if(!field || !record || !data){
        return html;
    }
    var fieldName = field.name;
    if(!fieldName){
        return html;
    }

    var show = field.show || "";

    // 普通列数据
    html += tek.macList.appendDefaultListField(field, record, data);

    return html;

}
tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
      return "";
    }

    var code = record.state_code && tek.dataUtility.stringToHTML(record.state_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editState(\"");
    sb.append(code + "\",\""+ record["state_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>编辑</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addCity(\"");
    sb.append(code + "\",\""+ record["state_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>新建市/县</b> </button>");

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:showCurCity(\"");
    sb.append(code + "\",\""+ record["state_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>查看市/县</b> </button>");

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteState(\"");
    sb.append(id + "\",\"" + record["state_name"]["value"] + "\",\"" + code + "\",\""+ record["state_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>删除</b> </button>");

    return sb.toString();
}

//删除记录
function deleteOrganization(state_code, state_name) {
    var params = {};
    params["objectName"] = "Organization";
    params["action"] = "removeInfo";
    params["state_code"] = state_code;

    tek.macList.removeInfo(state_code, state_name, params);
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
    sb.append("../city/list.html?state_code=");
    sb.append(state_code + "&state_locale=" + state_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
