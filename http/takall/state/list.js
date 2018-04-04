var AjaxURL = tek.common.getRootPath() + "servlet/tobject";
var request = tek.common.getRequest();
var sessionStorage = window.sessionStorage;
// 机构状态颜色
var STATUS_COLOR = {
    "-1": "danger",
    "0": "warning",
    "1":"success"
};


function init() {
	/*if(SERVICE_CSS){
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
	*/
    showOpenClass("zone");
    showSubClass("state");
	
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";

    tek.macList.params = {};
    var key = new Array();
    key.push("state_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    
    if(sessionStorage["country_code"] && sessionStorage["country_locale"]){
      tek.macList.params["state_country"] = sessionStorage["country_code"];
      tek.macList.params["state_locale"] = sessionStorage["country_locale"];
    }
    sessionStorage.removeItem('country_code');
    sessionStorage.removeItem('country_locale');


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
    	
	var url = tek.common.getRootPath() + "http/takall/state/edit.html?state_code=" + state_code;
	url += "&state_locale=" + state_locale;
	url += "&show-close=1&refresh-opener=1";
    window.open(url);
}

function addCity(state_code,state_locale) {
    
	var url = tek.common.getRootPath() + "http/takall/city/add.html?state_code=" + state_code;
	url += "&state_locale=" + state_locale;
	url += "&show-close=1&refresh-opener=1";
    window.open(url);
}

// showCurCity
function showCurCity(state_code,state_locale) {
    callSubServicePage("http/takall/city/");
    var sessionStorage = window.sessionStorage;
    if(sessionStorage){
        sessionStorage.setItem('state_code', state_code);
        sessionStorage.setItem('state_locale', state_locale);
    }
//    window.open(sb.toString());
}

//批量删除选中的记录 
function removeList() {
	var params = {};
	params["objectName"] = "State";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}


tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
