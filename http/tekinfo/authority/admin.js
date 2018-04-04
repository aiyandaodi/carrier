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
tek.macList.appendCustomListField=function (field,record,data,sb) {
  if(!field || !record || !data || !sb)
    return;
  
  var fieldName=field.name;
  if(!fieldName)
    return;

  var show=field.show;
  if(!show)
    show="";
	
  if(fieldName=="authority_status"){
	var status=field.value;
	if(status==0){
      sb.append("<span class='label label-warning'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status==1) {
      sb.append("<span class='label label-default'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status== 10){
	  sb.append("<span class='label label-success'>");
      sb.append(show);
      sb.append("</span>");	
	}else if(status== -1){
	  sb.append("<span class='label label-danger'>");
      sb.append(show);
      sb.append("</span>");	
	}

  } else {
  	// 普通列数据
    tek.macList.appendDefaultListField(field,record,data,sb);
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
tek.macList.appendListOperation=function (record,data,sb) {
  if(!record || !data || !sb)
    return;

  var id=record.id;

  sb.append("<span id='operate-");
  sb.append(id);
  sb.append("'>");
  if(mySecurity >= 0x40){
    /*sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readClient(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-ok'>查看</b> </button>");
    
	sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editClient(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>" );*/

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteAuthority(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  }
  sb.append("</span>");
}

/**
 * 删除授权
 *
 * @param id
 *           授权标识
 * @param name
 *           授权名称
 */
function deleteAuthority(id,name){
  var params={};
  params["objectName"]="Authority";
  params["action"]="removeInfo";
  params["authority_id"]=id;
  
  tek.macList.removeInfo(id, name,params);
}

/**
 * 批量删除选中的授权
 */
function removeLists() {
  var params={};
  params["objectName"]="Authority";
  params["action"]="removeList";
  tek.macList.removeList(params);
}

//响应刷新事件
function customRefresh() {
    tek.macList.getList();
}