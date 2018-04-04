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
    tek.macList.params["order"] = 'modifyTime';
    tek.macList.params["desc"] = 1;

    tek.macList.columns = [
        "country_code",
        "country_name",
        "country_fullname",
        "country_timezone",
        "country_areacode",
        "country_locale",
        "country_valid"
    ];

    // 快速检索域
    tek.macList.searchs = [
        "country_code",
        "country_name",
        "country_fullname"
    ];
}

// tek.macList.appendCustomListField = function (field, record, data) {
//     var html = "";

//     if (!field || !record || !data){
//         return html;
//     }

//     var fieldName = field.name;
//     if (!fieldName){
//         return html;
//     }

//     var show = field.show || "";

//     if (fieldName == "country_status") {
//         var status = field.value;
//         if(status in country_STATUS_COLOR){
//             html+="<span class='label label-"+country_STATUS_COLOR[status]+"'>" + show + "</span>";
//         }
//     }else {
//         html += tek.macList.appendDefaultListField(field, record, data);
//     }

//     return html;
// };

tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
        return "";
    }

    var code = record.country_code && tek.dataUtility.stringToHTML(record.country_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readOrganization(\"");
    // sb.append(id + "\");'>");
    // sb.append("<b class='icon-ok'>查看</b> </button>&nbsp;");

    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editOrganization(");
    sb.append("\"" + record["country_code"]["value"] + "\",\"" + record["country_locale"]["value"] + "\");'>");
    sb.append("<b class='icon-ok'>编辑</b> </button>");

	sb.append("<button class='btn btn-xs btn-success' onClick='javascript:addProvince(\"");
    sb.append(code + "\",\""+ record["country_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>新建省/州</b> </button>");
	
    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:showProvince(\"");
    sb.append(code + "\",\""+ record["country_locale"]["value"] +"\");'>");
    sb.append("<b class='icon-ok'>查看省/州</b> </button>");

   

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:showProvince(\"");
    // sb.append(code + "\",\""+ record["country_locale"]["value"] +"\");'>");
    // sb.append("<b class='icon-ok'>查看省/州</b> </button>");

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteOrganization(\"");
    sb.append(id);
    sb.append("\",\"");
    sb.append(record.name);
    sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");

    sb.append("</span>");

    return sb.toString();
}



//编辑记录
function editCountry(country_code,country_locale) {
    var sb = new StringBuffer();
    sb.append("edit.html?country_code=");
    sb.append(country_code + "&country_locale=" + country_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addCountry(country_code,country_locale) {
    var sb = new StringBuffer();
    sb.append("add.html?");
    // sb.append(country_code + "&country_locale=" + country_locale);
    sb.append("show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function addProvince(country_code,country_locale) {
    var sb = new StringBuffer();
    sb.append("../state/add.html?country_code=");
    sb.append(country_code + "&country_locale=" + country_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}

function showProvince(country_code,country_locale) {
    var sb = new StringBuffer();
    sb.append("../state/admin.html?country_code=");
    sb.append(country_code + "&country_locale=" + country_locale);
    sb.append("&show-close=1&refresh-opener=1");
    window.open(sb.toString());
}


tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}