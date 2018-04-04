function init() {
    showOpenClass("contact");
    showSubClass("contact_list");
    initParams();
    tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";

    tek.macList.params = {};
    var key = new Array();
    key.push("contact_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "Contact";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    tek.macList.params["order"] = 'modifyTime';
    tek.macList.params["desc"] = 1;

    tek.macList.columns = [
        "contact_name",
        "contact_owner",
        "contact_objectId",
        "contact_catalog",
        "contact_tags",
        "contact_color",
        "contact_property",
        "contact_remark"
    ];

    // 快速检索域
    tek.macList.searchs = [
        "contact_name",
        "contact_owner",
        "contact_objectId",
        "contact_catalog",
        "contact_tags",
        "contact_color",
        "contact_property",
        "contact_remark"
    ];
}

tek.macList.appendListOperation = function (record, data) {
    if (!record || !data){
        return "";
    }

    var code = record.contact_code && tek.dataUtility.stringToHTML(record.contact_code.value) || "";
    var id = record.id;
    var sb = new StringBuffer();

    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readOrganization(\"");
    sb.append(id + "\");'>");
    sb.append("<b class='icon-ok'>查看</b> </button>&nbsp;");

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
function deleteOrganization(contact_id, contact_name) {
    var params = {};
    params["objectName"] = "Contact";
    params["action"] = "removeInfo";
    params["contact_id"] = contact_id;

    tek.macList.removeInfo(contact_id, contact_name, params);
}

//批量删除选中的记录
function removeLists() {
    var params = {};
    params["objectName"] = "Contact";
    params["action"] = "removeList";

    tek.macList.removeList(params);
}

//查看数据
function readOrganization(org_id) {
    var html="read.html?contact_id="+org_id+"&refresh-opener=1";
    window.open(html);
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}

function SendAjax(obj, fn) {
    var params = obj;

    var parm = {};
    parm["url"] = tek.macList.ajaxURL;
    parm["params"] = params;  // - 传递参数
    parm["type"] = "POST";
    parm["success"] = function (data) {
        if (fn && typeof fn === "function") {
            fn(data);
        }
    }

    parm["error"] = function (data, msg) {
        $("#waiting-modal-dialog").modal("show");
        $("#waiting-modal-dialog-body").html(msg);
    }

    parm["message"] = function (msg) {
        $("#waiting-modal-dialog").modal("show");
        $("#waiting-modal-dialog-body").html(msg);
    };

    tek.common.ajax2(parm);
}
