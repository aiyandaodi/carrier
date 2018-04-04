var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var request = tek.common.getRequest();
var sessionStorage = window.sessionStorage;
// 机构状态颜色
var CITY_STATUS_COLOR = {
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
	}*/
	
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

    if(sessionStorage["state_code"] && sessionStorage["state_locale"]){
      tek.macList.params["city_state"] = sessionStorage["state_code"];
      tek.macList.params["city_locale"] = sessionStorage["state_locale"];
    }
    sessionStorage.removeItem('state_code');
    sessionStorage.removeItem('state_locale');

    
    tek.macList.params["objectName"] = "City";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;

    // tek.macList.columns = ["city_code","city_name","city_shortname","city_timezone","city_areacode","city_locale","city_state"];
    tek.macList.columns = [
        "city_code",
        "city_fullname",
        "city_locale",
        "city_name",
        "city_state",
        "city_valid"
    ];

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("city_name");
    tek.macList.searchs.push("city_fullname");
    tek.macList.searchs.push("city_locale");
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

    if (fieldName == "city_valid") {
        var status = field.value;
        if(status in CITY_STATUS_COLOR){
            html += "<span class='label label-"+CITY_STATUS_COLOR[status]+"'>" + show + "</span>";
        }
        /*
        if (status == 1) {
            html += "<span class='label label-"+CITY_STATUS_COLOR[1]+"'>" + show + "</span>";
        } else {
            html += "<span class='label label-"+CITY_STATUS_COLOR[-1]+"'>" + show + "</span>";
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

    var code = record.city_code && tek.dataUtility.stringToHTML(record.city_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editCity(\"");
    sb.append(code + "\",\""+ record["city_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>编辑</b> </button>");

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteCity(\"");
    sb.append(id + "\",\"" + record["city_name"]["value"] + "\",\"" + code + "\",\""+ record["city_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>删除</b> </button>");

    return sb.toString();
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
	var url = tek.common.getRootPath() + "http/takall/city/edit.html?city_code=" + city_code;
	url += "&city_locale=" + city_locale;
	url += "&show-close=1&refresh-opener=1";
    window.open(url);
}


//批量删除选中的记录 
function removeList() {
	var params = {};
	params["objectName"] = "City";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}


tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
