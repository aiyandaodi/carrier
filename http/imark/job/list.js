var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
var request = tek.common.getRequest();

function init() {
    showOpenClass("human_resource");
	showSubClass("job");
	
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";
    tek.macList.params = {};
    var key = new Array();
    key.push("job_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "Job";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    // tek.macList.columns = ["job_code","job_name","job_shortname","job_timezone","job_areacode","job_locale"];
    tek.macList.columns = ["job_code","job_name","job_fullname","job_timezone","job_areacode","job_locale","job_valid"];

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("job_code");
    tek.macList.searchs.push("job_name");
    tek.macList.searchs.push("job_fullname");
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

    if (fieldName == "job_valid") {
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

    var code = record.job_code && tek.dataUtility.stringToHTML(record.job_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editJob(\"");
    sb.append(code + "\",\""+ record["job_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>编辑</b> </button>");

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addJob(\"");
    // sb.append(code + "\",\""+ record["job_locale"]["value"] +"\");'>");
    // sb.append("<b class='icon-ok'>新建国家</b> </button>");

    

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:showProvince(\"");
    sb.append(code + "\",\""+ record["job_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>查看省/州</b> </button>");

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteJob(\"");
    sb.append(id + "\",\""+ record["job_name"]["value"] +"\",\""+ code +"\",\""+ record["job_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>删除</b> </button>");

    return sb.toString();
}
//新建操作
function createNew(){
	var html = tek.common.getRootPath() + "http/imark/job/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}

//删除记录
function deleteJob(id,name,job_code, job_locale) {
  var params = {};
  params["objectName"] = "Job";
  params["action"] = "removeInfo";
  params["job_code"] = job_code;
  params["job_locale"] = job_locale;

  tek.macList.removeInfo(id, name, params);
}

//编辑记录
function editJob(job_code,job_locale) {
    var sb = new StringBuffer();
    sb.append("edit.html?job_code=");
    sb.append(job_code + "&job_locale=" + job_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addJob(job_code,job_locale) {
    var sb = new StringBuffer();
    sb.append("add.html?");
    // sb.append(job_code + "&job_locale=" + job_locale);
    sb.append("show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addProvince(job_code,job_locale) {
    var sb = new StringBuffer();
    sb.append("../state/add.html?job_code=");
    sb.append(job_code + "&job_locale=" + job_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function showProvince(job_code,job_locale) {
    var sb = new StringBuffer();
    sb.append("../state/list.html?job_code=");
    sb.append(job_code + "&job_locale=" + job_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

//查看数据
function readOrganization(job_code, org_id) {
    var sb = new StringBuffer();
    sb.append("read.html?");
    sb.append("job_id=" + org_id);
    window.open(sb.toString());
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
