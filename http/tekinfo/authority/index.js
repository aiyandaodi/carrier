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

  if(fieldName=="authority_status"){
	var status=field.value;
	if(status== 0){
      sb.append("<span class='label label-info'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status== 1) {
      sb.append("<span class='label label-primary'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status== 10){
	  sb.append("<span class='label label-success'>");
      sb.append(show);
      sb.append("</span>");	
	}else if(status== -1){
	  sb.append("<span class='label label-default'>");
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

  if (category != 6) {
    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readAuthority(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-ok'>查看</b> </button>");
  }
  
  if(mySecurity >= 0x40){
    if (category != 6) {
      sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editAuthority(\"");
      sb.append(id);
      sb.append("\");'>");
      sb.append("<b class='icon-pencil'>编辑</b> </button>" );
	}
	
    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:deleteAuthority(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  }
  sb.append("</span>");
}

//查看用户
function readAuthority(authority_id)
{ 
  window.open("../read/index.html?authority_id="+authority_id+"&show-close=1&refresh-opener=1");
}
			
//编辑用户
function editAuthority(authority_id)
{
	window.open("../edit/index.html?authority_id="+authority_id+"&show-close=1&refresh-opener=1");
}

//删除绑定卡片
function deleteAuthority(authority_id, client_name){
  var params={};
  params["objectName"]="Authority";
  params["action"]="removeInfo";
  params["authority_id"]=authority_id;
  
  removeInfo(authority_id, client_name,"../../../servlet/tobject", params);
}


//批量删除选中的绑定卡片
function removeLists() {
  var params={};
  params["objectName"]="Authority";
  params["action"]="removeList";  
  params["authority_category"]=category;
  removeList("../../../servlet/tobject",params);
}

