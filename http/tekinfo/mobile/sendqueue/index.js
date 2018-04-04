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
	if(status==10){	//未发送
      sb.append("<span class='label label-warning'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status==11){	//已发送
      sb.append("<span class='label label-primary'>");
      sb.append(show);
      sb.append("</span>");
	} else if(status==20){	//已接收
      sb.append("<span class='label label-success'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status==99) {	//发送失败
      sb.append("<span class='label label-danger'>");
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

  sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readQueue(\"");
  sb.append(id);
  sb.append("\");'>");
  sb.append("<b class='icon-ok'>查看</b> </button>");

  if(mySecurity >= 0x40){
    sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editQueue(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>");

    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:deleteQueue(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  }
  sb.append("</span>");
}

//查看用户
function readQueue(queue_id)
{ 
  window.open("read.html?queue_id="+queue_id+"&show-close=1&refresh-opener=1");
}
			
//编辑用户
function editQueue(queue_id)
{ 
  window.open("edit.html?queue_id="+queue_id+"&show-close=1&refresh-opener=1");
}

//删除发送列表
function deleteQueue(queue_id, queue_phone){
  var params={};
  params["objectName"]="MobileSendQueue";
  params["action"]="removeInfo";
  params["queue_id"]=queue_id;
  
  removeInfo(queue_id, queue_phone,ajaxURL, params);
}

//批量删除选中的发送列表

function removeLists() {
  var params={};
  params["objectName"]="MobileSendQueue";
  params["action"]="removeList";  
 removeList(ajaxURL,params);
}

//响应刷新事件   
function refresh(){	
	getList();
}
