// JavaScript Document
var subClass;
var transaction_type;
var request = tek.common.getRequest();
function init(){
	showOpenClass("transaction");
	
	var session = window.sessionStorage;
	if(sessionStorage && sessionStorage.getItem('openSubClass')){
		
		subClass = sessionStorage.getItem('openSubClass');
		showSubClass(subClass);
	}
	
	
	
	
	initParams();
	tek.macList.getList();
}

function initParams() {
    tek.macList.ajaxURL = tek.common.getRelativePath() + "servlet/tobject";
    tek.macList.params = {};
    var key = new Array();
    key.push("transaction_");
    tek.macList.params = tek.common.getRequestParams(key, request, tek.macList.params, true);
    tek.macList.params["objectName"] = "Transaction";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = 0;
    tek.macList.params["count"] = 10;
    tek.macList.params["order"] = "transaction_code";
    tek.macList.params["indexPage"] = "1";
    if(subClass){
		switch(subClass){
			case 'question':
				transaction_type = 16;
				break;
			case 'worksheet':
				transaction_type = 32;
				break;
			case 'consult':
				transaction_type = 128;
				break;
			case 'complaint':
				transaction_type = 64;
				break;
			case 'report':
				transaction_type = 65;
				break;
			case 'suggestion':
				transaction_type = 129;
				break;
				
		
		}
		tek.macList.params["transaction_type"] = transaction_type;
	}
	
    tek.macList.columns = ["transaction_code","transaction_owner","transaction_name","transaction_type","transaction_status","transaction_tags","transaction_answerCount"];

    tek.macList.searchs = [];    // 快速检索域
    tek.macList.searchs.push("transaction_code");
    tek.macList.searchs.push("transaction_name");
    tek.macList.searchs.push("transaction_tags");
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

    if(fieldName == "transaction_type"){
    	var status = field.value;
    	if(status in TRANSACTION_TYPE_COLOR){
    		html += "<span style='line-height:18px;' class='badge badge-"+TRANSACTION_TYPE_COLOR[status]+"'>" + show + "</span>";
		}
    }else if(fieldName == "transaction_status"){
    	var status = field.value;
    	if(status in TRANSACTION_STATUS_COLOR){
    		html += "<span class='label label-"+TRANSACTION_STATUS_COLOR[status]+"'>" + show + "</span>";
		}
    }else{
    	// 普通列数据
    	html += tek.macList.appendDefaultListField(field, record, data);

    }
    
    return html;
};

tek.macList.appendListOperation = function (record, data) {
    if(!record || !data)
    	return;

	var sb = new StringBuffer();
	var id=record.id;

	sb.append("<span id='operate-");
	sb.append(id);
	sb.append("'>");

	sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readInfo(\"");
	sb.append(id);
	sb.append("\");'>");
	sb.append("<b class='icon-ok'>查看</b> </button>");

	/*if(subjectType != 1){
		sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editInfo(\"");
		sb.append(id);
		sb.append("\");'>");
		sb.append("<b class='icon-pencil'>编辑</b> </button>" );
  	}*/
		sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:removeInfo(\"");
		sb.append(id);
		sb.append("\",\"");
		sb.append(record.name);
		sb.append("\");'>");
		sb.append("<b class='icon-remove'>删除</b> </button>");
 
  	sb.append("</span>");
  
  	return sb.toString();
}


/*//新建数据
function createNew(){
	var html = tek.common.getRootPath() + "http/takall/subject/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}*/
/*//编辑记录
function editInfo(id) {
    var html = tek.common.getRootPath() + "http/takall/subject/edit.html?subject_id=" + id;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}*/

//查看数据
function readInfo(id) {
    var html = tek.common.getRootPath() + "http/tekinfo/transaction/read.html?transaction_id=" + id;
	
    html += "&refresh-opener=1";
    window.open(html);
}

//删除记录
function removeInfo(id,name) {
  var params = {};
  params["objectName"] = "Transaction";
  params["action"] = "removeInfo";
  params["transaction_id"] = id;

  tek.macList.removeInfo(id, name, params);
}

tek.turnPage.turn = function (id, skip) {
    tek.macList.params["skip"] = skip;
    tek.macList.getList();
}
//批量删除
function removeList(){
	var params = {};
	params["objectName"] = "Transaction";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}