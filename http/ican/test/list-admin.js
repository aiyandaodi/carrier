// JavaScript Document

/**
 * 添加数据操作
 *
 * @param record
 *           信息
 * @param data
 *           信息
 * @param sb
 *           标签字符串
 */
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

  if(mySecurity >= 0x40){
    sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editInfo(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>" );

    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:removeInfo(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  }
  
  sb.append("</span>");
  
  return sb.toString();
}

function creatNew(){
  window.open("add.html?show-close=1&refresh-opener=1");
}

//查看考试
function readInfo(id)
{ 
  window.open("read.html?test_id="+id+"&refresh-opener=1");
}

//编辑考试
function editInfo(id)
{ 
  window.open("edit.html?test_id="+id+"&show-close=1&refresh-opener=1");
}

//删除考试
function removeInfo(id, name) {
	var params = {};
	params["objectName"] = "ExamsTest";
	params["action"] = "removeInfo";
	params["exams_test_id"] = id;

	tek.macList.removeInfo(id, name, params);
}

//批量删除选中的考试记录 
function removeList() {
	var params = {};
	params["objectName"] = "ExamsTest";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}