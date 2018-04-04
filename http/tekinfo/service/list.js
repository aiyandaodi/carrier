// JavaScript Document
var request = tek.common.getRequest();

function init(){
  showOpenClass("system");
  showSubClass("system_service");

  initParams();
  tek.macList.getList();
  
}
function initParams() {
    tek.macList.ajaxURL=tek.common.getRootPath()+"servlet/service";    //Ajax取得列表信息的访问地址

    tek.macList.params={};    //Ajax取得列表信息的调用参数
    var key=new Array();
    //key.push("client_");
    tek.macList.params=tek.common.getRequestParams(key,request,tek.macList.params,true);
    tek.macList.params["action"]="getList";
    //params["skip"]=0;
    //params["count"]=3;//PAGE_COUNT;

    tek.macList.columns=new Array();    //显示列
    tek.macList.columns.push('service_name');
    tek.macList.columns.push('service_type');
    tek.macList.columns.push('service_status');

    //searchs=new Array();    // 快速检索域
    //searchs.push("client_name");
}

// setInterval("tek.macList.customRefresh()", 5000);

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
tek.macList.showCustomListRecords=function(records,data) {
  tek.macList.showListRecords(records,data);
  $(".column-first").hide();
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

  var status;
  if(record.service_status)
    status=record.service_status.value;
  var name;
  if(record.service_name)
    name=record.service_name.value;
  var action;
  var id=record.id;

  sb.append("<span id='operate-");
  sb.append(id);
  sb.append("'>");

  if(status == 0) {
    action = "start" ;
    sb.append("<button class='btn btn-xs btn-success' onClick='javascript:operateService(");
    sb.append("\"");
    sb.append(name);
    sb.append("\",\"");
    sb.append(action);
    sb.append("\");'>");
    sb.append("<b class='icon-ok'>启动</b> </button>");
  } else {
    action = "stop";
    sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:operateService(" );
    sb.append("\"");
    sb.append(name);
    sb.append("\",\"");
    sb.append(action);
    sb.append("\");'>");
    sb.append("<b class='icon-pencil'>停止</b> </button>" );
    
    action = "enforceStop";
    sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:operateService(");
    sb.append("\"");
    sb.append(name);
    sb.append("\",\"");
    sb.append(action);
    sb.append("\");'>");
    sb.append("<b class='icon-remove'>强制停止</b> </button>");
  }
  sb.append("</span>");
}

//启动服务器
function operateService(name,action)
{
	var flag;

	var sb=new StringBuffer();
	sb.append("service_status_");
	sb.append(name);
	if(action == "start")
	{
		flag = window.confirm("是否启动" + name + "服务?");
		if(!flag){
			return;
		}
		var elem=document.getElementById(sb.toString());
		if(elem){
			elem.setAttribute("class","btn btn-xs btn-warning");
			elem.innerHTML="正在启动";
		}
		}else if(action == "stop"){
			flag = window.confirm("是否停止" + name + "服务?");
			if(!flag){
				return;
			}
		var elem=document.getElementById(sb.toString());
		if(elem){
			elem.setAttribute("class","btn btn-xs btn-warning");
			elem.innerHTML="正在结束";
		}
		}else if(action == "enforceStop"){
			flag = window.confirm("是否强制停止" + name + "服务?该操作可能造成软件异常!");
			if(!flag){
				return;
			}
		var elem=document.getElementById(sb.toString());
		if(elem){
			elem.setAttribute("class","btn btn-xs btn-warning");
			elem.innerHTML="正在强制停止";
		}
	}
  
  var p={};
  p["async"]=false;
  p["type"]="post";
  p["url"]=tek.common.getRootPath()+"servlet/service";
  p["params"]={};
  p["params"]["action"]=action;
  p["params"]["service_name"]=name;
  p["error"]=function(data,msg) {
      tek.macCommon.waitDialogShow(null, msg);
  }
  
  tek.common.ajax2(p);
}

tek.macList.appendCustomListField=function(field,record,data,sb) {
  if(!field || !record || !data || !sb)
    return;
  
  var fieldName=field.name;
  if(!fieldName)
    return;

  var show=field.show;
  if(!show)
    show="";

  if(fieldName=="service_status"){
	if(field.show=="运行中"){
		sb.append("<span class='btn btn-xs btn-success' style='margin-bottom:2px' id='service_status_");
		sb.append(record.name);
		sb.append("'>");
		sb.append(field.show);
		sb.append("</span>");
	}
	else if(field.show=="正在停止"){
		sb.append("<span class='btn btn-xs btn-warning' style='margin-end:2px' id='service_status_");
		sb.append(record.name);
		sb.append("'>");
		sb.append("正在结束");
		sb.append("</span>");
	}
	else if(field.show=="停止"){
		sb.append("<span class='btn btn-xs btn-danger' style='margin-end:2px' id='service_status_");
		sb.append(record.name);
		sb.append("'>");
		sb.append(field.show);
		sb.append("</span>");	
	}
	else{
		sb.append("<span class='btn btn-xs btn-warning' style='margin-end:2px' id='service_status_");
		sb.append(record.name);
		sb.append("'>");
		sb.append(field.show);
		sb.append("</span>");	
	}	

  } else {
	// 普通列数据
    tek.macList.appendDefaultListField(field,record,data,sb);
  } // end else
}

function createNew(){
	var html = tek.common.getRootPath() + "http/tekinfo/service/add.html?show-close=1&refresh-opener=1";
	window.open(html);
}


function var params = {
    var params = {
        objectName: "Service",
        action: "removeList"
    };

    tek.macList.removeList(params);
	
}