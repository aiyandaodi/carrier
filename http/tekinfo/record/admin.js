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
tek.macList.appendCustomListField=function(field,record,data,sb) {
  if(!field || !record || !data || !sb)
    return;
  
  var fieldName=field.name;
  if(!fieldName)
    return;

  var show=field.show;
  if(!show)
    show="";

  if(fieldName=="record_os"){
	var array=tek.dataUtility.stringToArray(field.value,";");
	if(array&&array.length>=3){
      if(array[0]){
        sb.append("<span class='label label-warning'>");
        sb.append(array[0]);
        sb.append("</span>");
	  }
      if(array[1]){
        sb.append("<span class='label label-success'>");
        sb.append(array[1]);
        sb.append("</span>");
      }
      if(array[2]){
        sb.append("<span class='label label-info'>");
        sb.append(array[2]);
        sb.append("</span>");
      }
    } else {
      // 普通列数据
      tek.macList.appendDefaultListField(field,record,data,sb);
    } // end else
    
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
tek.macList.appendListOperation=function(record,data,sb) {
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

  if(tek.right.isCanDelete(parseInt(mySecurity))){
    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:removeRecord(\"");
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
  window.open("read.html?record_id="+id+"&show-close=1&refresh-opener=1");
}

//删除用户
function removeRecord(id, name){
  var params={};
  params["objectName"]="ObjectRecord";
  params["action"]="removeInfo";
  params["record_id"]=id;
  
  tek.macList.removeInfo(id, name, params);
}

//批量删除选中的服务器 
function removeLists() {
  var params={};
  params["objectName"]="ObjectRecord";
  params["action"]="removeList";
  tek.macList.removeList(params);
}

//响应刷新事件   
function customRefresh(){	
	tek.macList.getList();
}

//新建登录账号
