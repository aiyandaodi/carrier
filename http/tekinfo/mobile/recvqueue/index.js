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
	if(status==0){	//未处理
      sb.append("<span class='label label-warning'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status==-1){	//无法处理
      sb.append("<span class='label label-danger'>");
      sb.append(show);
      sb.append("</span>");
	} else if(status==1){	//已处理
      sb.append("<span class='label label-success'>");
      sb.append(show);
      sb.append("</span>");
	}

  } else {
	// 普通列数据
    appendDefaultListField(field,record,data,sb);
  } // end else
} 
 

function appendListOperation(record,data,sb) {
  if(!record || !data || !sb)
    return;

  var id=record.id;

  sb.append("<span id='operate-");
  sb.append(id);
  sb.append("'>");

  sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readRecvQueue(\"");
  sb.append(id);
  sb.append("\");'>");
  sb.append("<b class='icon-ok'>查看</b> </button>");

  if(mySecurity >= 0x40){
    sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editRecvQueue(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>");

    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:deleteRecvQueue(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  }
  sb.append("</span>");
  sb.append("</td>");
}

//查看用户
function readRecvQueue(queue_id)
{ 
  window.open("read.html?queue_id="+queue_id+"&show-close=1&refresh-opener=1");
}
			
//编辑用户
function editRecvQueue(queue_id)
{ 
  window.open("edit.html?queue_id="+queue_id+"&show-close=1&refresh-opener=1");
}

//删除接收列表
function deleteRecvQueue(queue_id, queue_device){
  var params={};
  params["objectName"]="MobileRecvQueue";
  params["action"]="removeInfo";
  params["queue_id"]=queue_id;
  
  removeInfo(queue_id, queue_device,ajaxURL, params);
}
//批量删除选中的接收列表

function removeLists() {
  var params={};
  params["objectName"]="MobileRecvQueue";
  params["action"]="removeList";  
 removeList(ajaxURL,params);
}
