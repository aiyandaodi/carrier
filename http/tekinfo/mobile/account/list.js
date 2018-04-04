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
function appendListOperation(record,data,sb) {
  if(!record || !data || !sb)
    return;

  var id=record.id;
  sb.append("<span id='operate-");
  sb.append(id);
  sb.append("'>");

  sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readAccount(\"");
  sb.append(id);
  sb.append("\");'>");
  sb.append("<b class='icon-ok'>查看</b> </button>");

  if(mySecurity >= 0x40){
    sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editAccount(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>");

    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:deleteAccount(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  }
  sb.append("</span>");
}

//查看用户
function readAccount(account_id)
{ 
  window.open("read.html?account_id="+account_id+"&show-close=1&refresh-opener=1");
}
			
//编辑用户
function editAccount(account_id)
{ 
	window.open("edit.html?account_id="+account_id+"&show-close=1&refresh-opener=1");
}

//新建手机账号
function createNew(account_id)
{ 
	window.open("add.html?account_id="+account_id+"&show-close=1&refresh-opener=1");
}

//删除手机账号
function deleteAccount(account_id, account_device){
  var params={};
  params["objectName"]="MobileAccount";
  params["action"]="removeInfo";
  params["account_id"]=account_id;
  
  removeInfo(account_id, account_device,ajaxURL, params);
}

//批量删除选中的手机账号 
function removeLists() {
  var params={};
  params["objectName"]="MobileAccount";
  params["action"]="removeList";
  
  removeList(ajaxURL,params);
}
