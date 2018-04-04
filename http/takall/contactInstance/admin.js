function init() {
    showOpenClass("contact");
    showSubClass("contact_instance");
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";

    tek.macList.params = {};
    var key = new Array();
    key.push("instance");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "ContactInstance";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    tek.macList.params["order"] = 'modifyTime';
    tek.macList.params["desc"] = 1;

    tek.macList.columns = [
        "instance_name",
        "instance_type",
        "instance_address"
    ];

    // 快速检索域
    tek.macList.searchs = [
        "instance_name",
        "instance_type",
        "instance_address"
    ];
}

tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
        return "";
    }

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
function deleteOrganization(instanceid, instancename) {
    var params = {};
    params["objectName"] = "ContactInstance";
    params["action"] = "removeInfo";
    params["instanceid"] = instanceid;

    tek.macList.removeInfo(instanceid, instancename, params);
}

//查看数据
function readOrganization(org_id) {
    var html="read.html?instanceid="+org_id+"&refresh-opener=1";
    window.open(html);
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
