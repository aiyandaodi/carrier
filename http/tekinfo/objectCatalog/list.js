// JavaScript Document
/**************************************************
 *    对象目录分类 list.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var request = tek.common.getRequest();
function init() {
    showOpenClass("classification");
    showSubClass("object_catalog");
    initParams();
    tek.macList.getList();
   /* //判断是否登录
    if (tek.common.isLoggedIn()) {
        if (tek.user.isSupervisor(parseInt(mySecurity))) {
           
        } else {
            // 你不是管理员提示
            showErrorMessage("<p class='text-center' style='color: red;'>你没有管理员权限！</p>");
        }
    } else {
        //提示 并 跳转登录
        goLogin();
    }*/
}

//=====================================================Function===============================

// mac-list.js的初始化参数
function initParams() {
    tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";    //Ajax取得列表信息的访问地址

    //Ajax取得列表信息的调用参数
    var key = [];
    key.push("catalog_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "ObjectCatalog";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = tek.macList.PAGE_COUNT;

    tek.macList.columns = [];    //显示列
    tek.macList.columns.push('catalog_code');
    tek.macList.columns.push('catalog_name');
    tek.macList.columns.push('catalog_object');
    tek.macList.columns.push('catalog_owner');

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("catalog_code");
    tek.macList.searchs.push("catalog_name");
    tek.macList.searchs.push("catalog_object");
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

    if (fieldName == "catalog_owner" && tek.type.isEmpty(show)) {
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
        html += " <button class='btn btn-xs btn-warning' onClick='editInfo(\"" + id + "\");'><b class='icon-pencil'>编辑</b></button>";
    }
    if (tek.right.isCanDelete(right)) {
        html += " <button class='btn btn-xs btn-danger' onClick='removeInfo(\"" + id + "\",\"" + record.name + "\");'><b class='icon-remove'>删除</b></button>";
    }
    html += "</span>";

    return html;
};

//显示对象目录树分类
function treeShow() {
    var html = tek.common.getRootPath() + "http/tekinfo/objectCatalog/tree.html?show-close=1&refresh-opener=1";
    window.open(html);
}

//查看对象目录分类
function readInfo(id) {
	var html = tek.common.getRootPath() + "http/tekinfo/objectCatalog/read.html?catalog_id=" + id;
	html += "&show-close=1&refresh-opener=1";
    window.open(html);
}

//编辑对象目录分类
function editInfo(id) {
	var html = tek.common.getRootPath() + "http/tekinfo/objectCatalog/edit.html?catalog_id=" + id;
	html += "&show-close=1&refresh-opener=1";
    window.open(html);
}

//删除用户
function removeInfo(id, name) {
    var params = {
        objectName: "ObjectCatalog",
        action: "removeInfo",
        catalog_id: id
    };

    tek.macList.removeInfo(id, name, params);
}

//批量删除选中的记录 
function removeList() {
    var params = {
        objectName: "ObjectCatalog",
        action: "removeList"
    };

    tek.macList.removeList(params);
}

//响应刷新事件   
function customRefresh() {
    tek.macList.getList();
}



// turn-page.js必须实现方法
tek.turnPage.turn = function (eleId, skip) {
    skip = parseInt(skip);
    if (!isFinite(skip) || skip < 0)
        return;

    tek.macList.params.skip = skip;
    tek.macList.getList();
};
