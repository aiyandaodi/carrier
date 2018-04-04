var request = tek.common.getRequest();

function init(){
	showOpenClass("group_space");
	showSubClass("space");

	initParams();
	tek.macList.getList();
}

function initParams(){
	tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";
	tek.macList.params = {};

	tek.macList.params["objectName"] = "Space";
	tek.macList.params["action"] = "getList";
	tek.macList.params["skip"] = 0;
	tek.macList.params["count"] = 10;

	tek.macList.columns = [
		"space_code",
		"space_name",
		"space_status",
		"space_remark",
		"space_owner",
		"space_path",
		"space_file",
		"space_latestTime"
	]

	tek.macList.searchs = [
		"space_name"

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

//查看
function readInfo(id){
	window.open("read.html?space_id="+id+"&refresh-opener=1");
}

//删除数据
function removeInfo(id, name){
	var params = {};
	params["objectName"] = "Space";
	params["action"] = "removeInfo";
	params["space_id"] = id;

	tek.macList.removeInfo(id, name, params);
}
//批量删除选中的记录
function removeList(){
	var params = {};
	params["objectName"] = "Member";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}