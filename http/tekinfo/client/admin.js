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
	
  /*if(fieldName=="client_domain")
   {
	   var cate=request["client_category"];
	   if(cate!=3)
	   {
        sb.append("<a href="../../client/list/+show+" target='_blank'>");
        sb.append(show);
        sb.append("</a>");
	   }
   }

  else*/ if(fieldName=="client_status"){
	var status=field.value;
	if(status==0){
      sb.append("<span class='label label-warning'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status==1) {
      sb.append("<span class='label label-success'>");
      sb.append(show);
      sb.append("</span>");
	}else if(status== -1){
	  sb.append("<span class='label label-default'>");
      sb.append(show);
      sb.append("</span>");	
	}else if(status== -2){
	  sb.append("<span class='label label-danger'>");
      sb.append(show);
      sb.append("</span>");	
	}
 
  } 
  else {
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

  sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readClient(\"");
  sb.append(id);
  sb.append("\");'>");
  sb.append("<b class='icon-ok'>查看</b> </button>");

  if(mySecurity >= 0x40){
    sb.append("<button class='btn btn-xs btn-warning' onClick='javascript:editClient(\"");
    sb.append(id);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>编辑</b> </button>" );

    sb.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteClient(\"");
    sb.append(id);
    sb.append("\",\"");
	sb.append(record.name);
	sb.append("\");'>");
    sb.append("<b class='icon-remove'>删除</b> </button>");
  }
  sb.append("</span>");
}

//查看用户
function readClient(client_id){
  window.open("read.html?client_id="+client_id+"&show-close=1&refresh-opener=1");
}
		
//编辑用户
function editClient(client_id){
  window.open("edit.html?client_id="+client_id+"&show-close=1&refresh-opener=1");
}

//删除服务器
function deleteClient(client_id,client_name){
  var params={};
  params["objectName"]="Client";
  params["action"]="removeInfo";
  params["client_id"]=client_id;
  
  tek.macList.removeInfo(client_id, client_name,params);
}

//批量删除选中的服务器 
function removeLists() {
  var params={};
  params["objectName"]="Client";
  params["action"]="removeList";
  params["client_category"]=request["client_category"]; 
  tek.macList.removeList(params);
}

//新建client
function createNew(client_category){
  window.open("add.html?client_category="+client_category+"&show-close=1&refresh-opener=1");
}
