function init() {
    showOpenClass("contact");
    showSubClass("contact_profile");
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";

    tek.macList.params = {};
    var key = new Array();
    key.push("contact_profile_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "ContactProfile";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    tek.macList.params["order"] = 'modifyTime';
    tek.macList.params["desc"] = 1;

    tek.macList.columns = [
        "contact_profile_title",
        "contact_profile_name",
        "contact_profile_sex",
        "contact_profile_birthday",
        "contact_profile_country",
        "contact_profile_unit",
        "contact_profile_department",
        "contact_profile_position",
        "contact_profile_user",
    ];

    // 快速检索域
    tek.macList.searchs = [
        "contact_profile_title",
        "contact_profile_name",
        "contact_profile_sex",
        "contact_profile_birthday",
        "contact_profile_country",
        "contact_profile_unit",
        "contact_profile_department",
        "contact_profile_position",
        "contact_profile_user",
    ];
}

tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
        return "";
    }

    var code = record.contact_profile_code && tek.dataUtility.stringToHTML(record.contact_profile_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readOrganization(\"");
    // sb.append(id + "\");'>");
    // sb.append("<b class='icon-ok'>查看</b> </button>&nbsp;");

    // sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editOrganization(\"");
    // sb.append(id + "\");'>");
    // sb.append("<b class='icon-ok'>编辑</b> </button>");

    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:deleteOrganization(\"");
    sb.append(id);
    sb.append("\",\"");
    sb.append(record.name);
    sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");

    sb.append("</span>");

    return sb.toString();
}

//删除记录
function deleteOrganization(contact_profile_id, contact_profile_name) {
    var params = {};
    params["objectName"] = "ContactProfile";
    params["action"] = "removeInfo";
    params["contact_profile_id"] = contact_profile_id;

    tek.macList.removeInfo(contact_profile_id, contact_profile_name, params);
}


tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
