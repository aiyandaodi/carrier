// JavaScript Document

/**
 * 添加列数据
 *
 * @param field
 *           列数据
 * @param record
 *           信息
 * @param data
 *           信息
 * @param sb
 *           标签字符串
 */
function appendCustomListField(field,record,data,sb) {
  if(!field || !record || !data || !sb)
    return;
  
  var fieldName=field.name;
  if(!fieldName)
    return;

  var show=field.show;
  if(!show)
    show="";

  if(fieldName=="queue_status"){
	var status=field.value;
	if(status==1){
      sb.append("<span class='label label-success'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status==0){
      sb.append("<span class='label label-primary'>");
      sb.append(show);
      sb.append("</span>");
	} else if(status==-1) {
      sb.append("<span class='label label-danger'>");
      sb.append(show);
      sb.append("</span>");
	}

  } else {
	// 普通列数据
    appendDefaultListField(field,record,data,sb);
  } // end else
}

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
  
  sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readInfo(\"");
  sb.append(id);
  sb.append("\");'>");
  sb.append("<ib class='icon-ok'>查看</b> </button>");

  if(mySecurity >= 0x40){
	  
    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:deleteInfo(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  }
  
  sb.append("</span>");
}

//查看用户
function readInfo(id)
{ 
  window.open("read.html?queue_id="+id+"&show-close=1&refresh-opener=1");
}
			

//删除用户
function deleteInfo(id,name){
  var params={};
  params["objectName"]="MobileSendQueue";
  params["action"]="removeInfo";
  params["queue_id"]=id;
  
  removeInfo(id, name, tek.common.getRootPath()+"servlet/tobject", params);
}

//批量删除选中的用户记录 
function removeSendQues() {
  var params={};
  params["objectName"]="MobileSendQueue";
  params["action"]="removeList";
  
  removeList(tek.common.getRootPath()+"servlet/tobject",params);
}

//响应刷新事件   
function customRefresh(){	
	getList();
}
