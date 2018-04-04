var request = tek.common.getRequest();
//初始化
function init(){
	showOpenClass("social");
	showSubClass("friends");

	initParams();
	tek.macList.getList();
}

function initParams(){
	tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";

	tek.macList.params = {};
	tek.macList.params["objectName"] = "Friend";
	tek.macList.params["action"] = "getList";
	tek.macList.params["skip"] = 0;
	tek.macList.params["count"] = 10;

	tek.macList.columns = [
		"friend_code",
		"friend_name",
		"friend_other",
		"friend_tag",
		"friend_color",
		"friend_ownername",
		"friend_owner",
		"friend_status",
		"friend_remark"
	]

	tek.macList.searchs = [
		"friend_name"

	]
}


/*添加数据*/
tek.macList.appendCustomListField = function(field, record, data){
	var html = "";
	if(!field || !record || !data){
		return html;
	}
	var fieldName = field.name;
	if(!fieldName){
		return html;
	}

	var show = field.show || "";

	// 普通列数据
    html += tek.macList.appendDefaultListField(field, record, data);

    return html;

}

/*
添加数据操作
*/
tek.macList.appendListOperation = function(record, data){
	if(!record || !data){
		return;
	}
	var sb = new StringBuffer();
	var id = record.id || "";

	sb.append("<span id='operate-");
	sb.append(id);
	sb.append("'>");

	sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readInfo(\"");
	sb.append(id);
	sb.append("\");'>");
	sb.append("<b class='icon-ok'>查看</b></button>");

	if(mySecurity >= 0x40){
		sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:removeInfo(\"");
		sb.append(id);
		sb.append("\",\"");
		sb.append(record.name);
		sb.append("\");'>");
		sb.append("<b class='icon-ok'>删除</b></button>");
	}

	sb.append("</span>");

	return sb.toString();
}

//新建
function createNew(){
	var html = tek.common.getRootPath() + "http/takall/friend/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}

//查看
function readInfo(id){
	var html = tek.common.getRootPath() + "http/takall/friend/read.html?friend_id=" + id;
	html += "&refresh-opener=1";
	window.open(html);
}

//删除数据
function removeInfo(id, name){
	var params = {};
	params["objectName"] = "Member";
	params["action"] = "removeInfo";
	params["friend_id"] = id;

	tek.macList.removeInfo(id, name, params);
}
//批量删除选中的记录
function removeList(){
	var params = {};
	params["objectName"] = "Member";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}

