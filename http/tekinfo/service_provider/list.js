// JavaScript Document
/**************************************************
 *    对象字典配置管理页面 list.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var request = tek.common.getRequest();
function init(){
  showOpenClass("system");
  showSubClass("service_provider");

  initParams();
  tek.macList.getList();
  //getList();
}

// mac-list.js的初始化参数
function initParams() {
    tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";    //Ajax取得列表信息的访问地址

    //Ajax取得列表信息的调用参数
    tek.macList.params["objectName"] = "ServiceProvider";
    tek.macList.params["action"] = "getList";
    tek.macList.params["count"] = tek.macList.PAGE_COUNT;
    tek.macList.params["skip"] = 0;

    tek.macList.columns = [];    //显示列
    tek.macList.columns.push('service_provider_code');
    tek.macList.columns.push('service_provider_name');
    tek.macList.columns.push('service_provider_url');
    tek.macList.columns.push('service_provider_protocol');
    tek.macList.columns.push('service_provider_status');
    tek.macList.columns.push('service_provider_default');

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("service_provider_code");
    tek.macList.searchs.push("service_provider_name");
    tek.macList.searchs.push("service_provider_url");
}
/**
 * 添加列数据
 * @param {Object} field 列数据
 * @param {Object} record 数据记录
 * @param {Object} data 服务器返回的数据
 * @return {String} 拼接后的html字符串，可能是""
 **/
tek.macList.appendCustomListField = function(field,record,data) {
  var html = "";
  if(!field || !record || !data)
    return html;
  
  var fieldName=field.name;
  if(!fieldName){
    return html;
  }

  var show=field.show;
  if(!show){
    show="";
  }

  if(fieldName=="service_provider_status"){
    var status = field.value;
  	if (status in SERVICE_PROVIDER_STATUS_COLOR) {
      html += "<span class='label label-"+SERVICE_PROVIDER_STATUS_COLOR[status]+"'>" + show + "</span>";
    } 

  } else {
	// 普通列数据
    html += tek.macList.appendDefaultListField(field,record,data);
  } // end else

  return html;
}

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

//新建对象字典配置
function createNew() {
	var html = tek.common.getRootPath() + "http/tekinfo/service_provider/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}

//查看对象字典配置
function readInfo(id) {
	var html = tek.common.getRootPath() + "http/tekinfo/service_provider/read.html?service_provider_id=" + id;
	html += "&refresh-opener=1";
	window.open(html);
}

//编辑对象字典配置
function editInfo(id) {
	var html = tek.common.getRootPath() + "http/tekinfo/service_provider/edit.html?service_provider_id=" + id;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}

//删除对象字典配置
function removeInfo(id, name) {
    var params = {
        objectName: "ServiceProvider",
        action: "removeInfo",
        service_provider_id: id
    };

    tek.macList.removeInfo(id, name, params);
}

//批量删除选中的字典配置
function removeList() {
    var params = {
        objectName: "ServiceProvider",
        action: "removeList"
    };

    tek.macList.removeList(params);
}

function customRefresh(){
	tek.macList.customRefresh();
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