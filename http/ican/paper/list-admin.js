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
tek.macList.appendListOperation = function (record, data){
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
    //sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editInfo(\"");
//    sb.append(id);
//    sb.append("\");'>");
//    sb.append("<b class='icon-pencil'>编辑</b> </button>" );

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

//查看用户
function readInfo(id)
{ 
  window.open("read.html?paper_id="+id+"&refresh-opener=1");
}

//返回上一级页面
function goback() {
	window.history.back();
}

//删除用户
//function removeInfo(id, name){
//  var remove=window.confirm("确定删除“"+name+"”?");
//  if (!remove)
//    return ;
//
//  $.ajax({
//    type: "post",
//    url: ajaxURL,
//    dataType: "json",
//    data: {
//        objectName:"ExamsPaper",
//        action:"removeInfo",
//        "exams_paper_id":id,
//    },
//
//    success: function(data) {
//        if(data){
//          if (data.code==0){
//            removeCheck(1);
//            getList();
//		  } else
//			showError(data.code+" - "+data.message);
//        } else
//		  showError("删除错误!");
//    },
//
//    error: function(request) {
//      //showMessage("登录操作失败!");
//      showMessage("删除操作失败!"+request.status+" - "+request.response);
//    }
//  });
//}

function removeInfo(id, name) {
	var params = {};
	params["objectName"] = "ExamsPaper";
	params["action"] = "removeInfo";
	params["exams_paper_id"] = id;

	tek.macList.removeInfo(id, name, params);
}

//批量删除选中的用户记录 
function removeList() {
	var params = {};
	params["objectName"] = "ExamsPaper";
	params["action"] = "removeList";

	tek.macList.removeList(params);
}

//批量删除选中的用户记录 
//function removeList() {
//  if (!selected || selected.length <=0) {
//     alert("没有选中待删除记录!");
//     return ;
//  }
//
//  var objectIds=new StringBuffer();
//  var count=0;
//  for (var i=0; i<selected.length; i++) {
//    if (selected[i] && selected[i]>0){
//	  if(count>0)
//	    objectIds.append(";");
//      objectIds.append(selected[i]);
//	  count++;
//	}
//  }
//
//  var remove=window.confirm("确定删除选中的"+count+"条用户记录？");
//  if (!remove)
//    return ;
//
//  $.ajax({
//    type: "post",
//    url: ajaxURL,
//    dataType: "json",
//    data: {
//        objectName:"ExamsPaper",
//        action:"removeList",
//        "object-ids":objectIds.toString(),
//    },
//
//    success: function(data) {
//        if(data){
//          if (data.code==0){
//            removeCheck(data.value);
//            getList();
//		  } else
//			showError(data.code+" - "+data.message);
//        } else
//		  showError("删除错误!");
//    },
//
//    error: function(request) {
//      //showMessage("登录操作失败!");
//      showMessage("删除操作失败!"+request.status+" - "+request.response);
//    }
//  });
//}
