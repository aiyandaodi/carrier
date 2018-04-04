// JavaScript Document
/**************************************************
 *    颜色分类管理页面 list.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var request = tek.common.getRequest();
/*初始化*/
function init(){
    showOpenClass("classification");
    showSubClass("object_color");
    
    initParams();
  
    tek.macList.getList();
}
//=====================================================Function===============================
// turn-page.js必须实现方法
tek.turnPage.turn = function (eleId, skip) {
    skip = parseInt(skip);
    if (!isFinite(skip) || skip < 0)
        return;

    tek.macList.params.skip = skip;
    tek.macList.getList();
};

// mac-list.js的初始化参数l
function initParams() {
    tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";    //Ajax取得列表信息的访问地址

    //Ajax取得列表信息的调用参数
    var key = [];
    key.push("color_");
    key.push("skip");
    key.push("order");
    key.push("desc");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "ObjectColor";
    tek.macList.params["action"] = "getList";
    tek.macList.params["count"] = tek.macList.PAGE_COUNT;

    //显示列
    tek.macList.columns.push('color_code');
    tek.macList.columns.push('color_name');
    tek.macList.columns.push('color_object');
    tek.macList.columns.push('color_owner');

    // 快速检索域
    tek.macList.searchs.push("color_code");
    tek.macList.searchs.push("color_name");
    tek.macList.searchs.push("color_object");
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

    if (fieldName == "color_owner" && tek.type.isEmpty(show)) {
        html += "<span class='label label-primary'>公共</span>";
    } else {
        // 普通列数据
        html += tek.macList.appendDefaultListField(field, record, data);
    }

    return html;
};

/**
 * 列表添加数据操作
 * @param {Object} record 数据记录
 * @param {Object} data 服务器返回的数据
 * @return {String} 拼接后的html字符串，可能是""
 */
tek.macList.appendListOperation = function (record, data) {
    var html = "";
    if (!record || !data)
        return html;

    var id = record.id;
    var right = parseInt(data.right);

    html += "<span id='operate-" + id + "'>";
    if (tek.right.isCanRead(right)) {
        html += "<button class='btn btn-xs btn-success' onClick='readInfo(\"" + id + "\");'><b class='icon-ok'>查看</b></button>";
    }
    if (tek.right.isCanWrite(right)) {
        html += "<button class='btn btn-xs btn-warning' onClick='editInfo(\"" + id + "\");'><b class='icon-pencil'>编辑</b></button>";
    }
    if (tek.right.isCanDelete(right)) {
        html += "<button class='btn btn-xs btn-danger' onClick='removeInfo(\"" + id + "\",\"" + record.name + "\");'><b class='icon-remove'>删除</b></button>";
    }
    html += "</span>";

    return html;
};

//新建
function addNew() {
    var url = tek.common.getRootPath() + 'http/tekinfo/objectColor/add.html?show-close=1&refresh-opener=1';
    window.open(url);
}

//查看
function readInfo(id) {
    var url = tek.common.getRootPath() + 'http/tekinfo/objectColor/read.html?color_id=' + id;
    url += '&show-close=1&refresh-opener=1';
    window.open(url);
}

//编辑
function editInfo(id) {
    var url = tek.common.getRootPath() + 'http/tekinfo/objectColor/edit.html?color_id=' + id;
    url += '&show-close=1&refresh-opener=1';
    window.open(url);
}

//删除
function removeInfo(id, name) {
    var params = {
        objectName: "ObjectColor",
        action: "removeInfo",
        color_id: id
    };

    tek.macList.removeInfo(id, name, params);
}

//批量删除选中的用户记录 
function removeList() {
    var params = {
        objectName: "ObjectColor",
        action: "removeList"
    };

    tek.macList.removeList(params);
}

//响应刷新事件
function customRefresh() {
    tek.macList.getList();
}