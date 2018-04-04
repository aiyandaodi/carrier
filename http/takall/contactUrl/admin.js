function init() {
    showOpenClass("contact");
    showSubClass("contact_address");
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";

    tek.macList.params = {};
    var key = new Array();
    key.push("address_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "ContactAddress";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    tek.macList.params["order"] = 'modifyTime';
    tek.macList.params["desc"] = 1;

    tek.macList.columns = [
        "address_code",
        "address_name",
        "address_zip",
        "address_country",
        "address_state",
        "address_city",
        "address_street",
        "address_landmark",
    ];

    // 快速检索域
    tek.macList.searchs = [
        "address_code",
        "address_name",
        "address_zip",
        "address_country",
        "address_state",
        "address_city",
        "address_street",
        "address_landmark",
    ];
}

tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
        return "";
    }

    var code = record.address_code && tek.dataUtility.stringToHTML(record.address_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    // sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readOrganization(\"");
    // sb.append(id + "\");'>");
    // sb.append("<b class='icon-ok'>查看</b> </button>&nbsp;");

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
function deleteOrganization(address_id, address_name) {
    var params = {};
    params["objectName"] = "ContactAddress";
    params["action"] = "removeInfo";
    params["address_id"] = address_id;

    tek.macList.removeInfo(address_id, address_name, params);
}

//批量删除选中的记录
function removeLists() {
    var params = {};
    params["objectName"] = "ContactAddress";
    params["action"] = "removeList";

    tek.macList.removeList(params);
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
