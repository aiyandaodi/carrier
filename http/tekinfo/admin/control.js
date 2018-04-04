// control.js
var LATEST_CALL_PATH;

// 调用后台管理子进程
// path - 相对根目录的路径（不包含文件名）
function callSubServicePage(path){
	if(path){
		if(LATEST_CALL_PATH){
			if (typeof unloadList == "function")
					unloadList();
					
			$("script[src='"+LATEST_CALL_PATH+"list.js']").remove();
		}
		
		//记载载入路径
		LATEST_CALL_PATH=tek.common.getRootPath()+path;
		
		callURL=LATEST_CALL_PATH+"i-list.html";
		callJS=LATEST_CALL_PATH+"list.js";
		//alert(callURL);
		$("#service_page").load(callURL, function() {
			//载入该页面的js
			$.getScript(callJS,function(){
				if (typeof init == "function")
					init();
			});

		})
	}
}

//---------------------------------------------------------------------------------------------------
//后台管理程序
//显示当前打开的链接（一级）
//如果有传递参数 open_class,则打开该参数指定链接。
//如果没有，则打开传递的参数

var request = tek.common.getRequest();
function showOpenClass(target) {
	var openClass=request["open_class"];
	if(!openClass)
		openClass=target;
		
    appendOpenClass(openClass, "open");
}

//显示当前打开的链接（二级）
//如果有传递参数 open_sub_class,则打开该参数指定链接。
//如果没有，则打开传递的参数
function showSubClass(target) {
	var openSubClass=request["open_sub_class"];
	
	if(!openSubClass)
		openSubClass=target;
	var oUls = document.getElementById("nav").getElementsByTagName("ul");
	for(var i in oUls){
		var oLis = oUls[i].childNodes;
		for(var j in oLis){
			if(oLis[j].className == 'current'){
				oLis[j].className = '';
			}
		}
	}
    appendOpenClass(openSubClass, "current");
	
	//var par=obj.parentNode;
}
/*关闭连接*/
/*function closeClass(target){
	//var obj = document.getElementById(target);
	var par = document.getElementById(target);
	var childs = par.getElementsByTagName('ul')[0].childNodes;
	for(var i in childs){
		if(childs[i].className == "current"){
			childs[i].className = '';
		}
	}
}*/
/**
 * 显示当前打开的链接
 * target - 指定tag 名字
 * className - 指定打开标识的class名字
 */
function appendOpenClass(target, className) {
    if (target) {
        var obj = document.getElementById(target);
		
        if (obj) {
            if (!className || className.length < 1 || className == "undefined")
                className = "open";

            if (obj.className && obj.className.length > 0)
                obj.className += " " + className;
            else
                obj.className = className;
        } //end if(obj)
    } //end if(target)
}

/**
 * 显示新注册用户
 */
function showNewUsers() {
	var viewAll=document.getElementById("all-users");
	if(!viewAll)
	  return;

	var time=new Date().getTime()-7*86400000;    // 7天前

	var mydata={};
	mydata["objectName"]="User";
	mydata["action"]="getList";
	mydata["condition"]="createTime>="+time;
	mydata["order"]="user_code";
	mydata["desc"]=1;
	mydata["skip"]=0;
	mydata["count"]=5;
	
	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		//async:true,
		data: mydata,
		
		error: function(request) {
          var error=new StringBuffer();
		  error.append("<font color='red'>");
          error.append("操作失败![");
          error.append(request.status);
          error.append(" - ");
          error.append(request.response);
		  error.append("]");
	  	  error.append("</font>");
          viewAll.innerHTML=error.toString();
		},

		success: function(data) {
			if (data) {
    			if (data.code==0){
					// 设置总数
					var total=data.value;
					if(total && parseInt(total)>0)
						$("#user-total").html(total);
	
					// 设置信息
					var record=data["record"];
					if (record){
						if(record.length){
							// 大于一条
							/*if(total>record.length){
								var sb=new StringBuffer();
								var elem=document.getElementById("drop-foot-user");
								if(elem){
    								sb.append("<a href='../../interface/admin/");
									sb.append(tek.common.getRelativePath());
									sb.append("http/user/list/index.html'>查看全部用户</a>");
	    							elem.insertAdjacentHTML("afterBegin", sb.toString());
								}
							}*/
							for(var i in record) {
									if(record[i]&& record[i].user_security && record[i].user_security.show&& record[i].user_name && record[i].user_name.show)
										appendInfo(record[i].user_name.show, record[i].user_security.show,viewAll);	
								}
						}else{
							// 一条
							if(record&& record.user_security && record.user_security.show&& record.user_name && record.user_name.show)
								appendInfo(record.user_name.show, record.user_security.show, viewAll);
						} //end if if(record.length) else
					} //end if (record)
				} else {
			      var error=new StringBuffer();
				  error.append("<font color='red'>");
				  error.append(data.code);
				  error.append(" - ");
				  error.append(tek.dataUtility.stringToHTML(data.message));
				  error.append("</font>");
				  viewAll.innerHTML=error.toString();
				}//end if (data.code==0) else
			
			} else {
				// data为空
				viewAll.innerHTML="<font color='red'>操作失败![data=null]</font>";
			} // end if (data) else
		}
	});
}

/**添加应用设备信息**/
function appendInfo(str1, str2, elem) {
	var sb=new StringBuffer();
	
	sb.append("<li>");
	sb.append("<h6>");//<a href='#'>");
	sb.append(str1);
	//sb.append("</a>");
	sb.append("<span class='label label-warning pull-right'>");
	sb.append(str2);
	sb.append("</span>");
	sb.append("</h6>");
    sb.append("<div class='clearfix'></div>");
	sb.append("<hr/>");
	sb.append("</li>");
	
	elem.insertAdjacentHTML("beforeBegin", sb.toString());
} 

/**
 * 显示最近登录用户数
 **/
function showLoginTotal() {
	var time=new Date().getTime()-7*86400000;    // 7天前
	var mydata={};
	mydata["objectName"]="ObjectRecord";
	mydata["action"]="getTotal";
	mydata["record_object"]="User";
	mydata["record_command"]="login";
	mydata["condition"]="createTime>="+time;
	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		//async:true,
		data: mydata,
		
		error: function(request) {
			var sb=new StringBuffer();
			sb.append("读取最近登录用户数：操作失败![");
			if(request){
				sb.append(request.status);
				sb.append(" - ");
				sb.append(request.response);
			}
			sb.append("]");
			showError(sb.toString());
		},

		success: function(data) {
			if (data) {
				if (data.code==0){
					// 设置总数
					var total=data.value;
					if(total && parseInt(total)>0)
						$("#login-total").html(total);
				} else{
					var sb=new StringBuffer();
					sb.append("读取最近登录用户数：");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(tek.dataUtility.stringToHTML(data.message));
					showError(sb.toString());
				} //end if (data.code==0) else
			} else {
				// data为空
				showError("读取最近登录用户数：操作失败![data=null]");
			} // end if (data) else
		}
	});
} 

/**
 * 显示最近更新小组数
 */
function showNewGroup() {
	var time=new Date().getTime()-7*86400000;    // 7天前
	var mydata={};
	mydata["objectName"]="Group";
	mydata["action"]="getTotal";
	mydata["condition"]="createTime>="+time;
	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		//async:true,
		data: mydata,
		
		error: function(request) {
			var sb=new StringBuffer();
			sb.append("读取最近授权用户数：操作失败![");
			if(request){
				sb.append(request.status);
				sb.append(" - ");
				sb.append(request.response);
			}
			sb.append("]");
			showError(sb.toString());
		},

		success: function(data) {
			if (data) {
				if (data.code==0){
					// 设置总数
					var total=data.value;
					if(total && parseInt(total)>0)
						$("#new-group-total").html(total);
				} else{
					var sb=new StringBuffer();
					sb.append("读取最近授权用户数：");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(tek.dataUtility.stringToHTML(data.message));
					showError(sb.toString());
				} //end if (data.code==0) else
			} else {
				// data为空
				showError("读取最近授权用户数：操作失败![data=null]");
			} // end if (data) else
		}
	});
}

/**
 * 显示最近操作数
 **/
function showRecordTotal(){
	var time=new Date().getTime()-7*86400000;    // 7天前
	var mydata={};
	mydata["objectName"]="ObjectRecord";
	mydata["action"]="getTotal";
	mydata["condition"]="createTime>="+time;
		$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		//async:true,
		data:mydata,
		
		error: function(request) {
			var sb=new StringBuffer();
			sb.append("读取最近操作数：操作失败![");
			if(request){
				sb.append(request.status);
				sb.append(" - ");
				sb.append(request.response);
			}
			sb.append("]");
			showError(sb.toString());
		},

		success: function(data) {
			if(data) {
				if (data.code==0){
					// 设置总数
					var total=data.value;
					if(total && parseInt(total)>0)
						$("#record-total").html(total);
				} else{
					var sb=new StringBuffer();
					sb.append("读取最近操作数：");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(tek.dataUtility.stringToHTML(data.message));
					showError(sb.toString());
				} //end if (data.code==0) else
			} else {
				// data为空
				showError("读取最近操作数：操作失败![data=null]");
			} // end if (data) else
		}
	});
}

/**
 * 显示待审主题
 **/
function showSubject() {
	var viewAll=document.getElementById("all-subject");
	if(!viewAll)
	  return;

	var time=new Date().getTime()-7*86400000;    // 7天前
	var mydata={};
	mydata["objectName"]="Subject";
	mydata["action"]="getList";
	mydata["subject_status"]=0;
	mydata["count"]=5;
	mydata["order"]="createTime";
	
	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		
		error: function(request) {
          var error=new StringBuffer();
		  error.append("<font color='red'>");
          error.append("操作失败![");
          error.append(request.status);
          error.append(" - ");
          error.append(request.response);
		  error.append("]");
	  	  error.append("</font>");
          viewAll.innerHTML=error.toString();
		},

		success: function(data) {
			if (data) {
    			if (data.code==0){
					// 设置总数
					var total=data.value;
					if(total && parseInt(total)>0)
						$("#subject-total").html(total);
					
					// 设置信息
					var record=data["record"];
					if (record){
						if(record.length){
							// 大于一条
							/*if(total>record.length){
								var sb=new StringBuffer();
								var elem=document.getElementById("drop-foot-subject");
								if(elem){
    								sb.append("<a href='../../interface/admin/");
									sb.append(tek.common.getRelativePath());
    								sb.append("http/subject/list/?subject_status=0'>查看全部主题</a>");
	    							elem.insertAdjacentHTML("afterBegin", sb.toString());
								}
							}*/
							for(var i in record) {
								if(record[i]&&record[i].subject_name&&record[i].subject_name.show&&record[i].subject_start&&record[i].subject_start.show)
									appendInfo(record[i].subject_name.show, record[i].subject_start.show,viewAll);
								}
						}else{
							// 一条
							if(record&&record.subject_name&&record.subject_name.show&&record.subject_start&&record.subject_start.show)
								appendInfo(record.subject_name.show, record.subject_start.show,viewAll);
						} //end if if(record.length) else
					} //end if (record)
				} else {
			      var error=new StringBuffer();
				  error.append("<font color='red'>");
				  error.append(data.code);
				  error.append(" - ");
				  error.append(tek.dataUtility.stringToHTML(data.message));
				  error.append("</font>");
				  viewAll.innerHTML=error.toString();
				}//end if (data.code==0) else
			
			} else {
				// data为空
				viewAll.innerHTML="<font color='red'>操作失败![data=null]</font>";
			} // end if (data) else
		}
	});
}

/**
 * 显示待审小组
 **/
function showGroup() {
	var viewAll=document.getElementById("all-group");
	if(!viewAll)
      return;

    var time=new Date().getTime()-7*86400000;    // 7天前

	var mydata={};
	mydata["objectName"]="Group";
	mydata["action"]="getList";
	mydata["group_status"]=0;
	mydata["count"]=5;
	mydata["order"]="createTime";
	
	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		
		error: function(request) {
            var error=new StringBuffer();
            error.append("<font color='red'>");
            error.append("操作失败![");
            error.append(request.status);
            error.append(" - ");
            error.append(request.response);
		    error.append("]");
	  	    error.append("</font>");
            viewAll.innerHTML=error.toString();
		},

		success: function(data) {
			if (data) {
    			if (data.code==0){
					// 设置总数
					var total=data.value;
					if(total && parseInt(total)>0)
						$("#group-total").html(total);

					// 设置信息
					var record=data["record"];
					if (record){
						if(record.length){
							// 大于一条
							/*if(total>record.length){
								var elem=document.getElementById("drop-foot-group");
								if(elem){
    							  var sb=new StringBuffer();
								  sb.append(tek.common.getRelativePath());
    							  sb.append("http/group/list/index.html");
	    						  elem.href=sb.toString();
								}
							}*/
							for(var i in record) {
								if(record[i]&&record[i].group_name&&record[i].group_name.show&&record[i].createTime&&record[i].createTime.show) {
									var time=record[i].createTime.show;
									if(time && time.length>=10)
										time=time.substring(0, 10);
									appendInfo(record[i].group_name.show, time,viewAll);
								}
							}
						}else{
							// 一条
							if(record&&record.group_name&&record.group_name.show&&record.createTime&&record.createTime.show) {
								var time=record.createTime.show;
								if(time && time.length>=10)
									time=time.substring(0, 10);
								appendInfo(record.group_name.show, time, viewAll);
							}
						} //end if if(record.length) else
					} //end if (record)
				} else {
			      var error=new StringBuffer();
				  error.append("<font color='red'>");
				  error.append(data.code);
				  error.append(" - ");
				  error.append(tek.dataUtility.stringToHTML(data.message));
				  error.append("</font>");
				  viewAll.innerHTML=error.toString();
				}//end if (data.code==0) else
			
			} else {
				// data为空
				viewAll.innerHTML="<font color='red'>操作失败![data=null]</font>";
			} // end if (data) else
		}
	});
}
