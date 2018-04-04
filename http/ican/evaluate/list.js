var request = tek.common.getRequest();
/**
 * mac-list.js的初始化参数
 */
function initParams() {
    tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";    //Ajax取得列表信息的访问地址

    //Ajax取得列表信息的调用参数
    var key = new Array();
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "Evaluation";
    tek.macList.params["action"] = "getList";
//	tek.macList.params["user_id"] = myId;
    tek.macList.params["count"] = tek.macList.PAGE_COUNT;

    //显示列
    tek.macList.columns = [
        'evaluation_score',
        'evaluation_name',
        'evaluation_type',
        'evaluation_tag',
        'evaluation_catalog',
        'evaluation_status'
    ];

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("evaluation_name");
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


    var show = field.show || "";

    if (field.name == "user_online") {
        var status = field.value;
        if (status == 0x20) {
            html += "<span class='label label-success'>" + show + "</span>";
        } else {
            html += "<span class='label label-danger'>" + show + "</span>";
        }
    } else {
        // 普通列数据
        html += tek.macList.appendDefaultListField(field, record, data);
    }

    return html;
};

/**
 * 添加数据操作
 * @param {Object} record 数据记录
 * @param {Object} data 服务器返回的数据
 */
tek.macList.appendListOperation = function (record, data) {
    var html = "";
    if (!record || !data)
        return html;

    var id = record.id;

    html += "<span id='operate-" + id + "'>"
    + "<button class='btn btn-xs btn-success' onClick='readInfo(\"" + id + "\");'><b class='icon-ok'>查看</b></button>";

    if (mySecurity >= 0x40) {
        html += "<button class='btn btn-xs btn-warning' onClick='editInfo(\"" + id + "\");'><b class='icon-pencil'>编辑</b></button>"
        + "<button class='btn btn-xs btn-danger' onClick='deleteInfo(\"" + id + "\", \"" + record.name + "\");'><b class='icon-remove'>删除</b></button>";
    }

    html += "</span>";

    return html;
};
//删除用户
function deleteInfo(user_id, user_name) {
    var params = {};
    params["objectName"] = "User";
    params["action"] = "removeInfo";
    params["user_id"] = user_id;

    tek.macList.removeInfo(user_id, user_name,params);
}

//查看用户
function readInfo(id) {
    window.open("read.html?user_id=" + id + "&show-close=1&refresh-opener=1");
}

//编辑用户
function editInfo(id) {
    window.open("edit.html?user_id=" + id + "&show-close=1&refresh-opener=1");
}

//响应刷新事件
function customRefresh() {
    tek.macList.getList();
}

function removeUsers() {
    var params = {};
    params["objectName"] = "User";
    params["action"] = "removeList";

    tek.macList.removeList(tek.common.getRootPath() + "servlet/tobject", params);
}
