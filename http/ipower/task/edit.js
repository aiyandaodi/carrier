var hostTaskId;//任务ID
var hostSiteId = "";//作用到的主机ID
var hostScriptId = "";//作用到的脚本ID

var hostSiteRecord;//主机信息
var siteCount = 0;//主机的列表递增数
function init(){
	$("#host_task_time4").datetimepicker();
	$("#host_task_time").datetimepicker({
		/*	//这段代码表示周六日不可选
			onGenerate:function( ct ){
					$(this).find('.xdsoft_date.xdsoft_weekend')
					.addClass('xdsoft_disabled');
			},*/
			timepicker:false,
			format: 'Y-m-d H:i:s',
			lang:'ch',
			minDate:'-1970/01/01', // today is minimum date

		});
	// $("#host_site_stoptime").datetimepicker();
	if (tek.common.isLoggedIn()) {
		hostTaskId = request['host_task_id'];
        // order_id = request['order_id'];
        getEditTask();
    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	// getSiteTags();
}


//跳转到任务读取页面
function showHostTask(){
    var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/task/read.html?host_task_id='+hostTaskId+'&refresh-opener=1&show-close=1');
    // alert(url);
    callPage(url);
   	function callPage(backURL) {
            if (backURL) {
                    location.href = backURL;
            }
        };
}

//返回到前一页面
function returnPage(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/task/read.html?host_task_id='+hostTaskId+'&refresh-opener=1&show-close=1');
    callPage(url);
   	function callPage(backURL) {
            if (backURL) {
                //var callbackConfirm = confirm("确定返回前一页面？");
                //if (callbackConfirm)
                    location.href = backURL;
            }
        };
}

// 获取编辑任务信息
function getEditTask(){
	var setting = {operateType: '获取编辑任务信息'};
	var sendData = {
		objectName: "HostTask",
		action:"getEdit",
		host_task_id:hostTaskId,
	}
	var callback = {
		success: function (data) {
			// $("#host_site_group").val(myName);
			var record = data.record;
			if (record) {
				hostSiteRecord = record;
				showHostTaskInfo(record);
				
			} else {
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '主机记录不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示任务
function showHostTaskInfo(record){
	$("#host_task_name").val(record.host_task_name.value);
	// $("#host_task_script").val(record.host_task_script.value);
	// $("#host_task_script1").val(record.host_task_script.show);
	getSiteTask();
	getSiteCredentials();
	getTaskScript();
	$("#host_task_time").val(record.host_task_time.show);
	getTaskStatus();
	// $("#host_task_status").val(record.host_task_status.value);
	// $("#host_site_status_"+ (record.host_site_status.value+1)).addClass("checked","checked");
	$("#host_task_owner").val(record.host_task_owner.show);
	$("#host_task_remark").val(record.host_task_remark.show);
}

//获取使用脚本
function getTaskScript(){
	var setting = {operateType: '获取任务使用脚本'};
	var sendData = {
		objectName: "TaskScript",
		action:"getList",
		task_script_task:hostTaskId

	}
	var callback = {
		beforeSend: function () {
			$("#host_task_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if (records.length>1) {
				for (var i = 0; i < records.length; i++) {
						var taskScript = tek.dataUtility.stringToArray(records[i].task_script_script.show, ";");
						showTaskScript(records[i]);
					}
			}else{
				if(records !=""){
					showTaskScript(records);
				}
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showTaskScript(records){
		var firstContent = document.getElementById("task_script_script1").value;
		var firstContent_id = document.getElementById("task_script_script").value;
		if (firstContent != "") {
			$("#task_script_script1").val(firstContent + ";" + records.task_script_script.show);
			$("#task_script_script").val(firstContent_id + ";" + records.task_script_script.value);
			// $("#task_script_script1").val(records.task_script_script.show + ";").append(firstContent);
			// $("#task_script_script").val(records.task_script_script.value + ";").append(firstContent_id);
		}else{
			$("#task_script_script").val(records.task_script_script.value);
			$("#task_script_script1").val(records.task_script_script.show);
		}
			 	
 	}
}

//获取任务作用的主机
function getSiteTask(){
	var setting = {operateType: '获取任务作用的主机'};
	var sendData = {
		objectName: "TaskSite",
		action:"getList",
		task_site_task:hostTaskId,
	}
	var callback = {
		beforeSend: function () {
			$("#host_task_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(records !=""){
				// tek.macCommon.waitDialogHide(3000,'showHostTask()');
				// $("task_site_site1").val(records.task_site_site.show);
				showSiteTask(records);
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showSiteTask(records){
		// var html = '';
  //   		html += '<label>'
		// 	 	 + '<input type="text" id="task_site_site1" name="task_site_site1" class="form-control col-lg-8" placeholder="选择主机" '
		// 	 	 + 'value = ' + records.task_site_site.show +'>'
		// 	 	 + '<input type="text" id="task_site_site" name="task_site_site" class="form-control col-lg-8" placeholder="选择主机" '
		// 	 	 + 'value = '+ records.task_site_site.value+'>'
		// 	 	 + '<a class="label label-default" href="javascript:getAddServiceSiteList();">选择主机</a>'
		// 	  	 + '</label>';
			 	 $("#task_site_site").val(records.task_site_site.value);
			 	 $("#task_site_site1").val(records.task_site_site.show);
			 	}

}

// 获取使用凭证
function getSiteCredentials(){
	var setting = {operateType: '获取任务作用的主机'};
	var sendData = {
		objectName: "TaskSite",
		action:"getList",
		task_site_task:hostTaskId,
	}
	var callback = {
		beforeSend: function () {
			$("#host_task_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(records !=""){
				showSiteCredentials(records);
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showSiteCredentials(records){
			 	 $("#task_site_credentials").val(records.task_site_credentials.value);
			 	 $("#task_site_credentials1").val(records.task_site_credentials.show);
			 	}
}

// 选择使用凭证
// function getAddServiceCredentialsList(){
// 	if(hostSiteId == ""){
// 		tek.macCommon.waitDialogShow("","请选择作用的主机",null,2);
// 		return;
// 	}
// 	var html = "";
// 	var setting = {operateType: '获取脚本列表'};
// 	var sendData = {
// 		objectName: "ServiceCredentials",
// 		action:"getList",
// 		service_credentials_site:hostSiteId 
// 	};
// 	var callback = {
// 		beforeSend: function () {
// 			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
// 		},
// 		success: function (data) { 
// 			var records = data.record;
			
// 			if(!records){
// 				//管理组内成员的弹窗列表显示
// 				html += '<font>暂无脚本，点此&nbsp;&nbsp;<a class="label label-primary" target="_blank" href="../script/add.html">新建脚本</a></font>';
// 				tek.macCommon.waitDialogShow("", html,null,2);
// 			}else{
// 				//管理组内成员的弹窗列表显示
// 				var dialog = '';
// 				dialog += '<div class="table-responsive">'
// 					   + '<table class="table table-striped table-bordered table-hover" id="credentials_list">'
// 					   + '<thead id="credentials_title">'
// 					   + '</thead><tbody id="dialog_list">'
// 					   + '</tbody></table></div>';
// 				tek.macCommon.waitDialogShow('脚本列表', dialog,null,2);

// 				if(records.length){
						
// 					html += '<tr>'
// 	              		 + '<th>#</th>'
// 	              		 + '<th>'+ records[0].service_credentials_name.display +'</th>'
// 	              		 + '<th>'+ records[0].service_credentials_username.display +'</th>'
// 	              		 + '<th>'+ records[0].service_credentials_passwd.display +'</th>'
// 	              		 + '<th>'+ records[0].service_credentials_type.display +'</th>'
// 	              		 + '<th>'+ records[0].service_credentials_status.display +'</th>'
// 	              		 + '<th>操作</th>'
// 	              		 + '</tr>';
// 	              	$("#credentials_title").html(html);

// 					for(var i in records){
// 						// if(records[i].group_type.value == 0){
// 							// groupSiteId = records[i].id;
// 							var count = tek.dataUtility.stringToInt(i) + 1;
// 							if(records[i].service_credentials_status.value == 1)
// 								showAddCredentialsListInfo(count, records[i].id, records[i]);
// 						// }
// 					}
// 				}else{
// 	              	html += '<tr>'
// 	              		 + '<th>#</th>'
// 	              		 + '<th>'+ records.service_credentials_name.display +'</th>'
// 	              		 + '<th>'+ records.service_credentials_username.display +'</th>'
// 	              		 + '<th>'+ records.service_credentials_passwd.display +'</th>'
// 	              		 + '<th>'+ records.service_credentials_type.display +'</th>'
// 	              		 + '<th>'+ records.service_credentials_status.display +'</th>'
// 	              		 + '<th>操作</th>'
// 	              		 + '</tr>';
// 	              	$("#credentials_title").html(html);

// 					// if(records.group_type.value == 0){
// 						// groupSiteId = records.id;
// 						if(records.service_credentials_status.value == 1)
// 							showAddCredentialsListInfo(1, records.id, records);
// 					// }
// 				}
// 			}
			
// 		}
// 	};
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
// }

//显示凭证列表
// function showAddCredentialsListInfo(num, id, record){

// 	var html = '';
// 	html += '<tr>'
//   		+ '<td>'+ num +'</td>'
//   		+ '<td>'+ record.service_credentials_name.show +'</td>'
//   		+ '<td>'+ record.service_credentials_username.show +'</td>'
//   		+ '<td>'+ record.service_credentials_passwd.show +'</td>'
//   		+ '<td id="service_credentials_type'+ num +'"></td>'
//   		if(record.service_credentials_status.value == 1){
//   			html += '<td><span class="label label-success">'+ record.service_credentials_status.show +'</span></td>';
//   		}else if(record.service_credentials_status.value == 0){
//   			html += '<td><span class="label label-primary">'+ record.service_credentials_status.show +'</span></td>';
//   		}else{
//   			html += '<td><span class="label label-danger">'+ record.service_credentials_status.show +'</span></td>';
//   		}
//   	html += '<td><a class="label label-primary" href="javascript:addCredentials(\''+ id +'\',\''+ record.service_credentials_name.show +'\')">选择</a></td>'
// 	$("#dialog_list").append(html);

// 	if(record.service_credentials_type){
// 		var type = tek.dataUtility.stringToArray(record.service_credentials_type.show, ";");
// 		for(var i in type){
// 			getServiceCredentialsType(num, type[i]);
// 		}
// 	}
// }

// 选择凭证
// function addCredentials(id, name){
// 	$("#task_site_credentials1").val(name);
// 	$("#task_site_credentials").val(id);
// 	tek.macCommon.waitDialogHide(0,null);

// }
//获取主机凭证类型
// function getServiceCredentialsType(num, id){
// 	var setting = {operateType: '获取主机凭证类型'};
// 	var sendData = {
// 		objectName: "ObjectDictionary",
// 		action:"readInfo",
// 		dictionary_id:id
// 	}
// 	var callback = {
// 		success: function (data) {
// 			var records = data.record;
// 			if(records){
// 				$("#service_credentials_type"+ num).append( records.dictionary_name.show + "&nbsp;&nbsp;&nbsp;&nbsp;");
// 			}else{
// 				//提示 '记录不存在！'
// 				// tek.macCommon.waitDialogShow(null, '凭证类型不存在');
// 			}
// 		},
//         error: function (data, errorMsg) {
//            	// tek.macCommon.waitDialogShow(null, errorMsg);
//            	// tek.macCommon.waitDialogHide(3000);
//         }
// 	}
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
// }
//显示普通组员主机群组信息
function getAddServiceSiteList(){
	var html = '';
	var setting = {operateType: '查看成员可操作的主机群组权限'};
	var sendData = {
		objectName: "HostMember",
		action:"getList",
		host_member_user:myId,
	}
	var callback = {
		beforeSend: function () {
			$("#site_group_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;

			if(!records){
				html = '&nbsp;&nbsp;';
				html += '<font>暂无可操作主机群组。</font>';
				$("#site_group_list").html(html);
			}else{
				$("#site_group_list").html("");
				//显示可操作主机群组
				if(records.length){
					highMemberGroupGount = records.length;
					//控制台顶部群组数量显示
					$("#index_group").html(highMemberGroupGount);
					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						// showRightHostMember(count, records[i].host_member_group.value);		
						setRightHostSiteInfo(records[i].host_member_group.value);
					}
				}else{
					highMemberGroupGount = 1;
					//控制台顶部群组数量显示
					$("#index_group").html(highMemberGroupGount);
					// showRightHostMember(1, records.host_member_group.value);
					setRightHostSiteInfo(records.host_member_group.value);
				}
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示普通组员可操作的主机
function setRightHostSiteInfo(groupId){
	var html = '';
	var setting = {operateType: '显示普通组员可操作的主机'};
	var sendData = {
		objectName: "HostSite",
		action:"getList",
		host_site_group:groupId,
		count: 10,
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(!records){
				html += '<font>暂无可选主机</font>';
				tek.macCommon.waitDialogShow("", html,null,2);
			}else{

				var dialog = '';
				dialog += '<div class="widget-content"><div class="table-responsive" id="member_site">'
					   + '<table class="table table-striped table-bordered table-hover" id="host_site_member_list">'
					   + '<thead id="site_dialog_title">'
					   + '</thead><tbody id="dialog_list">'
					   + '</tbody></table></div></div>';
				tek.macCommon.waitDialogShow('可选主机', dialog,null,2);
				if(records.length){
					html += '<tr>'
	           			 + '<th>#</th>'
	           			 + '<th>'+ records[0].host_site_name.display +'</th>'
	           			 + '<th>'+ records[0].host_site_group.display +'</th>'
	           			 + '<th>'+ records[0].host_site_user.display +'</th>'
	           			 + '<th>'+ records[0].host_site_status.display +'</th>'
	           			 + '<th>操作</th>'
	           			 + '</tr>';
	             		$("#site_dialog_title").html(html);
					for(var i in records){
					showHostSiteInfo(i, records[i]);
					}
				}else{
					html += '<tr>'
	           			 + '<th>#</th>'
	           			 + '<th>'+ records.host_site_name.display +'</th>'
	           			 + '<th>'+ records.host_site_group.display +'</th>'
	           			 + '<th>'+ records.host_site_user.display +'</th>'
	           			 + '<th>'+ records.host_site_status.display +'</th>'
	           			 + '<th>操作</th>'
	           			 + '</tr>';
	             		$("#site_dialog_title").html(html);
					showHostSiteInfo(1, records);
				}

			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//主机信息显示
function showHostSiteInfo(num, record){
	siteCount = siteCount + 1;
	var html = "";

	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + siteCount + '</td>'
         + '<td>' + record.host_site_name.show + '</td>'
         + '<td>' + record.host_site_group.show + '</td>'
         + '<td>' + record.host_site_user.show + '</td>';
    if(record.host_site_status.value == 1){
        html += '<td><span class="label label-success">'+ record.host_site_status.show +'</span></td>';
    }else if(record.host_site_status.value == 0){
        html += '<td><span class="label label-warning">'+ record.host_site_status.show +'</span></td>';
    }else{
        html += '<td><span class="label label-danger">'+ record.host_site_status.show +'</span></td>';
    }
         html += '<td><a class="label label-primary" href="javascript:addSite(\''+ record.id+'\',\''+ record.host_site_name.show +'\')">选择</a></td></tr>';

    $("#dialog_list").append(html);

}

//选择主机
function addSite(id, name){
	$("#task_site_site1").val(name);
	$("#task_site_site").val(id);
	hostSiteId = id;
	tek.macCommon.waitDialogHide(0,null);

	// var html = '';
 //    		html += '<label>'
	// 		 	 + '<input type="text" id="task_site_site1" name="task_site_site1" class="form-control col-lg-8" placeholder="选择主机" '
	// 		 	 + 'value = ' + name +'>'
	// 		 	 + '<input type="text" id="task_site_site" name="task_site_site" class="form-control col-lg-8" placeholder="选择主机" '
	// 		 	 + 'value = '+ id +'>'
	// 		 	 + '<a class="label label-default" href="javascript:getAddServiceSiteList();">选择主机</a>'
	// 		  	 + '</label>';
	// 		 	 $("#task_site_site").html(html);
	// tek.macCommon.waitDialogHide(0,null);
}


//选择任务脚本
function getAddServiceScriptList(){
	var html = "";
	var setting = {operateType: '获取脚本列表'};
	var sendData = {
		objectName: "HostScript",
		action:"getList",
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) { 
			var records = data.record;
			
			if(!records){
				//管理组内成员的弹窗列表显示
				html += '<font>暂无脚本，点此&nbsp;&nbsp;<a class="label label-primary" target="_blank" href="../script/add.html">新建脚本</a></font>';
				tek.macCommon.waitDialogShow("", html,null,2);
			}else{
				//管理组内成员的弹窗列表显示
				var dialog = '';
				dialog += '<div class="table-responsive">'
					   + '<table class="table table-striped table-bordered table-hover" id="script_list">'
					   + '<thead id="script_title">'
					   + '</thead><tbody id="dialog_list">'
					   + '</tbody></table></div>';
				tek.macCommon.waitDialogShow('脚本列表', dialog,null,2);

				if(records.length){
						
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].host_script_name.display +'</th>'
	              		 + '<th>'+ records[0].host_script_tag.display +'</th>'
	              		 // + '<th>'+ records[0].host_script_group.display +'</th>'
	              		 + '<th>'+ records[0].host_script_services.display +'</th>'
	              		 + '<th>'+ records[0].host_script_status.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#script_title").html(html);

					for(var i in records){
						// if(records[i].group_type.value == 0){
							// groupSiteId = records[i].id;
							var count = tek.dataUtility.stringToInt(i) + 1;
							if(records[i].host_script_status.value == 1)
								showAddScriptListInfo(count, records[i].id, records[i]);
						// }
					}
				}else{
	              	html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.host_script_name.display +'</th>'
	              		 + '<th>'+ records.host_script_tag.display +'</th>'
	              		 // + '<th>'+ records.host_script_group.display +'</th>'
	              		 + '<th>'+ records.host_script_services.display +'</th>'
	              		 + '<th>'+ records.host_script_status.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#script_title").html(html);

					// if(records.group_type.value == 0){
						// groupSiteId = records.id;
						if(records.host_script_status.value == 1)
							showAddScriptListInfo(1, records.id, records);
					// }
				}
			}
			
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示脚本列表
function showAddScriptListInfo(num, id, record){

	var html = '';
	html += '<tr>'
  		+ '<td>'+ num +'</td>'
  		+ '<td>'+ record.host_script_name.show +'</td>'
  		+ '<td>'+ record.host_script_tag.show +'</td>'
  		// + '<td>'+ record.host_script_group.show +'</td>'
  		+ '<td id="host_script_services_'+ num +'"></td>'
  		if(record.host_script_status.value == 1){
  			html += '<td><span class="label label-success">'+ record.host_script_status.show +'</span></td>';
  		}else if(record.host_script_status.value == 0){
  			html += '<td><span class="label label-primary">'+ record.host_script_status.show +'</span></td>';
  		}else{
  			html += '<td><span class="label label-danger">'+ record.host_script_status.show +'</span></td>';
  		}
  	html += '<td><a class="label label-primary" href="javascript:addScript(\''+ id +'\',\''+ record.host_script_name.show +'\')">选择</a></td>'
	$("#dialog_list").append(html);

	if(record.host_script_services){
		var services = tek.dataUtility.stringToArray(record.host_script_services.show, ";");
		for(var i in services){
			getHostServiceType(num, services[i]);
		}
	}
}

//选择脚本
function addScript(id, name){
	$("#task_script_script").val(id);
	$("#task_script_script1").val(name);
	hostScriptId = id;
	tek.macCommon.waitDialogHide(0,null);

}

//获取脚本适用于的服务类型 
function getHostServiceType(num, id){
	var setting = {operateType: '获取脚本适用于的服务类型'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"readInfo",
		dictionary_id:id
	}
	var callback = {
		success: function (data) {
			var records = data.record;
			if(records){
				$("#host_script_services_"+ num).append( records.dictionary_name.show + "&nbsp;&nbsp;&nbsp;&nbsp;");
			}else{
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '脚本适用于的服务类型不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//执行时间选择
function clickHostTaskTimeOn(num){
	if(num == 1){
		$("#host_task_time3").hide();
		$("#host_task_time4").hide();
		$("#add_task_btn").html("提交并执行");
	}else if(num == 0){
		$("#host_task_time3").hide();
		$("#host_task_time4").hide();
		$("#add_task_btn").html("提交");
	}else{
		$("#host_task_time3").show();
		$("#host_task_time4").show();
		$("#add_task_btn").html("提交");
	}
}

// 判断当前任务的状态
function getTaskStatus(){
	var setting = {operateType: '获取任务信息'};
	var sendData = {
		objectName: "HostTask",
		action:"readInfo",
		host_task_id:hostTaskId,
	}; 
	var callback = {
		beforeSend: function () {
			$("#host_task_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var record = data['record'];
			if (record) {
				showTaskStatus(record);
				// showHostTaskInfo(record);
			} else {
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '任务记录不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showTaskStatus(record){
		var html = '';
		if (record.host_task_status.value == 0) {
    		html += '<label>'
			 	 + '<input type="radio" name="host_task_status" id="host_task_status_0" value="0" checked>'
			 	 + '停止使用'
			 	 + '</label>'
			 	 + '&nbsp;'
			 	 + '&nbsp;'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_task_status" id="host_task_status_1" value="-1">'
			 	 + '报废'
			 	 + '</label>'
			 	 + '&nbsp;'
			 	 + '&nbsp;'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_task_status" id="host_task_status_2" value="1">'
			 	 + '正常使用'
			  	 + '</label>';
			 	 $("#host_task_status").append(html);
			 	}
		if (record.host_task_status.value == -1) {
			html += '<label>'
				 + '<input type="radio" name="host_task_status" id="host_task_status_0" value="0">'
			 	 + '停止使用'
			 	 + '</label>'
			 	 + '&nbsp;'
			 	 + '&nbsp;'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_task_status" id="host_task_status_1" value="-1" checked>'
			 	 + '报废'
			 	 + '</label>'
			 	 + '&nbsp;'
			 	 + '&nbsp;'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_task_status" id="host_task_status_2" value="1">'
			 	 + '正常使用'
			  	 + '</label>';
			 	 $("#host_task_status").append(html);
			 	} 
		if (record.host_task_status.value == 1){
			html += '<label>'
				 + '<input type="radio" name="host_task_status" id="host_task_status_0" value="0">'
			 	 + '停止使用'
			 	 + '</label>'
			 	 + '&nbsp;'
			 	 + '&nbsp;'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_task_status" id="host_task_status_1" value="-1">'
			 	 + '报废'
			 	 + '</label>'
			 	 + '&nbsp;'
			 	 + '&nbsp;'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_task_status" id="host_task_status_2" value="1" checked>'
			 	 + '正常使用'
			  	 + '</label>';
			 	 $("#host_task_status").append(html);
			 	}
			 }
}


//修改并提交任务信息
function setInfoTask(){
	var formData = getFormData();
    
	//console.log(params);
	
	var setting = {operateType: "修改任务信息"};
	var sendData = tek.Utils.mergeForObject({
            objectName: "HostTask", 
            action: "setInfo", 
            host_task_id: hostTaskId,
        }, formData);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				// hostTaskId = (data.value).split("=");
				// 修改关联表信息
				setTaskSite();
				// setTaskScript();
				// tek.macCommon.waitDialogShow("", '修改成功!', null, 2);
				// tek.macCommon.waitDialogHide(3000, 'showHostTask()');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 修改任务作用到的主机
function setTaskSite(){
	var formData = getFormData();
	var setting = {operateType: "修改任务作用到的主机"};
	var sendData = tek.Utils.mergeForObject({
		objectName:"TaskSite",
		action:"setInfo",
		// task_site_site:hostSiteId
		task_site_task:hostTaskId

	},formData);
	var callback = {
		beforeSend: function(){
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success:function(data){
			if (data) {
				// tek.macCommon.waitDialogShow("", '修改成功!', null, 2);
				// tek.macCommon.waitDialogHide(3000, 'showHostTask()');
				setTaskScript();
			}
		},
		error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting,sendData, callback);
}

// 修改任务使用脚本
function setTaskScript(){
	var formData = getFormData();
	var setting = {operateType: "修改任务使用脚本"};
	var sendData = tek.Utils.mergeForObject({
		objectName:"TaskScript",
		action:"setInfo",
		task_script_task:hostTaskId
		// task_script_script:hostScriptId
	},formData);
	var callback = {
		beforeSend: function(){
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success:function(data){
			if (data) {
				tek.macCommon.waitDialogShow("", '修改成功!', null, 2);
				tek.macCommon.waitDialogHide(3000, 'showHostTask()');
			}
		},
		error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting,sendData, callback);
}

// 获取提交表单数据（同时校验）
function getFormData() {
    var params = tek.Utils.getFromJSON(document.getElementById("task_sub_form"));
    // params["host_task_time"] = tek.dataUtility.stringToDate(params.host_task_time, 'yyyy-MM-dd HH:mm:ss').getTime();

    if(params["host_task_time"] == "3"){
    	if(params["host_task_time2"] == "" || params["host_task_time_picker"] == ""){
			tek.macCommon.waitDialogShow("", '请选择重复执行时间!',null,2);
			return;
			// alert("请选择重复执行时间");
			// goEditHostTask();
    	}else{
    		params["host_task_time"] = "";
    		params["host_task_time"] = params["host_task_time2"] + ";" + params["host_task_time_picker"];
    	}
    }
    params["host_task_owner"] = myId;
    console.log(params);

    return params;
}