function init() {
    showOpenClass("contact");
    showSubClass("contact_telephone");
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";

    tek.macList.params = {};
    var key = new Array();
    key.push("telephone_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "ContactTelephone";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    tek.macList.params["order"] = 'modifyTime';
    tek.macList.params["desc"] = 1;

    tek.macList.columns = [
        "telephone_name",
        "telephone_type",
        "telephone_phone"
    ];

    // 快速检索域
    tek.macList.searchs = [
        "telephone_name",
        "telephone_type",
        "telephone_phone"
    ];
}

tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
        return "";
    }

    // var code = record.telephone_code && tek.dataUtility.stringToHTML(record.telephone_code.value) || "";
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
function deleteOrganization(telephone_id, telephone_name) {
    var params = {};
    params["objectName"] = "ContactTelephone";
    params["action"] = "removeInfo";
    params["telephone_id"] = telephone_id;

    tek.macList.removeInfo(telephone_id, telephone_name, params);
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
