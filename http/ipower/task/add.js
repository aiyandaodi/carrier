var hostTaskId = "";//任务ID
var hostSiteId = "";//作用到的主机ID

var siteCount = 0;//主机的列表递增数

function init(){
	$("#host_task_time4").datetimepicker();
	$("#host_site_stoptime").datetimepicker();
if (tek.common.isLoggedIn()) {
	
        getNewTask();

		//登录ipower管理系统，获取登录凭证
		// getIpowerMonitorLogin();

    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
}

//跳转到任务读取页面
function showHostTask(taskId){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/task/read.html?host_task_id='+hostTaskId[1]+'&refresh-opener=1&show-close=1');
    // alert(url);
    // alert(hostSiteId);
    callPage(url);
   	function callPage(backURL) {
        if (backURL) {
            //var callbackConfirm = confirm("确定返回前一页面？");
            //if (callbackConfirm)
            location.href = backURL;
        }
    };
}

//添加新的文本框
function addNewInput(){
	//因为要以数组形式保存，所以name相同
	var firstInput = document.getElementById('task_script_script1').value;
	if (firstInput == '') {
		tek.macCommon.waitDialogShow("", '请先选择当前文本框!',null,2);
		return;
	}else{
		//这里应该是获取当前文本框的id，暂时先这么写着
		var inputId = document.getElementById('task_script_script1').id;
    
		// var inputId = $("input").attr('id');
		//截取最后一位数字
		var number = inputId.substring(inputId.length-1,inputId.length);
		var num = tek.dataUtility.stringToInt(number);

		//在此基础上num+2
		$('<input type="text" id="task_script_script'+(num+2)+'" name="task_script_script" class="form-control col-lg-8" placeholder="选择脚本文件">').appendTo($('#scriptDiv'));
		$('<input style="display: none;" type="text" id="task_script_script'+(num+1)+'" name="task_script_script" class="form-control col-lg-8" placeholder="选择脚本文件">').appendTo($('#scriptDiv'));
	}
}


//获取脚本列表
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
	$("#task_script_script1").val(name);
	$("#task_script_script").val(id);
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


//获取凭证列表
function getAddServiceCredentialsList(){
	if(hostSiteId == ""){
		tek.macCommon.waitDialogShow("","请选择作用的主机",null,2);
		return;
	}
	var html = "";
	var setting = {operateType: '获取脚本列表'};
	var sendData = {
		objectName: "ServiceCredentials",
		action:"getList",
		service_credentials_site:hostSiteId 
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
					   + '<table class="table table-striped table-bordered table-hover" id="credentials_list">'
					   + '<thead id="credentials_title">'
					   + '</thead><tbody id="dialog_list">'
					   + '</tbody></table></div>';
				tek.macCommon.waitDialogShow('脚本列表', dialog,null,2);

				if(records.length){
						
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].service_credentials_name.display +'</th>'
	              		 + '<th>'+ records[0].service_credentials_username.display +'</th>'
	              		 // + '<th>'+ records[0].host_script_group.display +'</th>'
	              		 + '<th>'+ records[0].service_credentials_passwd.display +'</th>'
	              		 + '<th>'+ records[0].service_credentials_type.display +'</th>'
	              		 + '<th>'+ records[0].service_credentials_status.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#credentials_title").html(html);

					for(var i in records){
						// if(records[i].group_type.value == 0){
							// groupSiteId = records[i].id;
							var count = tek.dataUtility.stringToInt(i) + 1;
							if(records[i].service_credentials_status.value == 1)
								showAddCredentialsListInfo(count, records[i].id, records[i]);
						// }
					}
				}else{
	              	html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.service_credentials_name.display +'</th>'
	              		 + '<th>'+ records.service_credentials_username.display +'</th>'
	              		 // + '<th>'+ records.host_script_group.display +'</th>'
	              		 + '<th>'+ records.service_credentials_passwd.display +'</th>'
	              		 + '<th>'+ records.service_credentials_type.display +'</th>'
	              		 + '<th>'+ records.service_credentials_status.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#credentials_title").html(html);

					// if(records.group_type.value == 0){
						// groupSiteId = records.id;
						if(records.service_credentials_status.value == 1)
							showAddCredentialsListInfo(1, records.id, records);
					// }
				}
			}
			
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示凭证列表
function showAddCredentialsListInfo(num, id, record){

	var html = '';
	html += '<tr>'
  		+ '<td>'+ num +'</td>'
  		+ '<td>'+ record.service_credentials_name.show +'</td>'
  		+ '<td>'+ record.service_credentials_username.show +'</td>'
  		+ '<td>'+ record.service_credentials_passwd.show +'</td>'
  		+ '<td id="service_credentials_type'+ num +'"></td>'
  		if(record.service_credentials_status.value == 1){
  			html += '<td><span class="label label-success">'+ record.service_credentials_status.show +'</span></td>';
  		}else if(record.service_credentials_status.value == 0){
  			html += '<td><span class="label label-primary">'+ record.service_credentials_status.show +'</span></td>';
  		}else{
  			html += '<td><span class="label label-danger">'+ record.service_credentials_status.show +'</span></td>';
  		}
  	html += '<td><a class="label label-primary" href="javascript:addCredentials(\''+ id +'\',\''+ record.service_credentials_name.show +'\')">选择</a></td>'
	$("#dialog_list").append(html);

	if(record.service_credentials_type){
		var type = tek.dataUtility.stringToArray(record.service_credentials_type.show, ";");
		for(var i in type){
			getServiceCredentialsType(num, type[i]);
		}
	}
}

//获取主机凭证类型
function getServiceCredentialsType(num, id){
	var setting = {operateType: '获取主机凭证类型'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"readInfo",
		dictionary_id:id
	}
	var callback = {
		success: function (data) {
			var records = data.record;
			if(records){
				$("#service_credentials_type"+ num).append( records.dictionary_name.show + "&nbsp;&nbsp;&nbsp;&nbsp;");
			}else{
				//提示 '记录不存在！'
				// tek.macCommon.waitDialogShow(null, '凭证类型不存在');
			}
		},
        error: function (data, errorMsg) {
           	// tek.macCommon.waitDialogShow(null, errorMsg);
           	// tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//选择凭证
function addCredentials(id, name){
	$("#task_site_credentials1").val(name);
	$("#task_site_credentials").val(id);
	tek.macCommon.waitDialogHide(0,null);

}

// 返回上一页
function returnPage(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/control.html');
    // tek.common.callPage(url,null);
    callPage(url);
    function callPage(backURL){
    	if (backURL) {
    		location.href = backURL;
    	}
    }
}

//创建主机群组的弹窗显示
function getNewSiteGroup(){
	var html = '';
	var title = '创建主机群组';
	var setting = {operateType: '获取新建主机群组信息'};
	var sendData = {
		objectName: "Group",
		action:"getNew"
	}
	var callback = {
		success: function (data) {
			var record = data.record;
			if(record){
				html += '<form class="form-horizontal" role="form" id="site_group_form"><div class="form-group">'
			 + '<label class="col-lg-3 control-label">'+ record.group_name.display +'</label>'
			 + '<div class="col-lg-5"><input type="text" class="form-control col-lg-8" id="group_name" name="group_name" placeholder="请填写主机群组名称" /></div></div>'
			 + '<div class="form-group"><label class="col-lg-3 control-label">'+ record.group_remark.display +'</label>'
			 + '<div class="col-lg-5"><input type="text" class="form-control col-lg-8" id="group_remark" name="group_remark" placeholder="请填写备注" /></div></div>'
			 + '<button type="button" onclick="javascript:addSiteGroup();" class="btn btn-sm btn-success left">提交</button></form>';
			html += '</div>';
			
			tek.macCommon.waitDialogShow(title, html, null , 0);
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//创建主机群组
function addSiteGroup(){
	var name = $("#group_name").val();
	var remark = $("#group_remark").val()
	var setting = {operateType: '新建主机群组'};
	var sendData = {
		objectName: "Group",
		action:"addInfo",
		group_name:name,
		group_status:1,
		group_remark:remark,
		group_owner:myId,
		group_type:0,
	}
	var callback = {
		success: function (data) {
			
			if(data){
				//新建主机群组成员权限
				addHostMember(data.value);
			}else{

			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


//新建主机群组成员权限
function addHostMember(groupId){
	groupId = groupId.substring(9);
	// console.log(groupId);
	var setting = {operateType: '新建主机群组成员权限'};
	var sendData = {
		objectName: "HostMember",
		action:"addInfo",
		host_member_right:2,
		host_member_group:groupId,
		host_member_user:myId,
		host_member_name:"群组所有者"
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '创建成功!',null,2);
				tek.macCommon.waitDialogHide(3000,null);
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//-------------------------------------------------------------------------------

// 获取新建任务信息 
function getNewTask(){
	var setting = {operateType: '获取新建任务信息'};
	var sendData = {
		objectName: "HostTask",
		action:"getNew",
	}
	var callback = {
		success: function (data) {
			var record = data.record;
			if (record) {
				$("#host_site_user").val(myName);
				$("#host_site_contact").val(myName);
				// $("#host_site_group").val(myName);
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

//新建任务
function addNewTask(){
	var formData = getFormData();

	// console.log(params);
	
	var setting = {operateType: "新建任务"};
	var sendData = tek.Utils.mergeForObject({
            objectName: "HostTask", 
            action: "addInfo", 
        }, formData);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				hostTaskId = (data.value).split("=");
				// addIpowerMonitorHost(formData);
				addTaskSite();
				// tek.macCommon.waitDialogShow("", '新建任务成功!',null,2);
				// tek.macCommon.waitDialogHide(3000,'showHostTask()');
				// addTaskScript();
				
				
			}
			// alert("1");
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//新建任务关联主机
function addTaskSite(){
	var formData = getFormData();
	
	var setting = {operateType: "新建任务关联主机"};
	var sendData = tek.Utils.mergeForObject({
            objectName: "TaskSite", 
            action: "addInfo", 
            task_site_status:"1",
            task_site_task:hostTaskId[1]
        }, formData);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				// tek.macCommon.waitDialogShow("", '新建任务成功!',null,2);
				// tek.macCommon.waitDialogHide(3000,'showHostTask()');
				// showHostSite(data.value);
				addTaskScript();
			}
			// alert("1");
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 新建任务关联脚本
function addTaskScript(){
	var formData = getFormData();
	
	var setting = {operateType: "新建任务关联脚本"};
	var sendData = tek.Utils.mergeForObject({
            objectName: "TaskScript", 
            action: "addInfo", 
            task_script_task:hostTaskId[1]
        }, formData);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '新建任务成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'showHostTask()');
				// showHostSite(data.value);
				
			}
			// alert("1");
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
//------------------------------------------------------------------------------------
//显示普通组员主机群组信息
function getAddServiceSiteList(){
	var html = '';
// $("#host_member")
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


// 获取提交表单数据（同时校验）
function getFormData() {
    var params = tek.Utils.getFromJSON(document.getElementById("task_sub_form"));
    params["host_task_start"] = new Date().getTime();
    params["host_task_end"] = 0;
    // params["host_task_time"] = 0;
     // tek.dataUtility.stringToDate(params.host_task_end, 'yyyy-MM-dd HH:mm').getTime();
    // params["host_site_group"] = tek.dataUtility.stringToInt(params.host_site_group);
    // params["host_site_contact"] = myId;
    if(params["host_task_time"] == "3"){
    	if(params["host_task_time2"] == "" || params["host_task_time_picker"] == ""){
			tek.macCommon.waitDialogShow("", '请选择重复执行时间!',null,2);
			return;
    	}else{
    		params["host_task_time"] = "";
    		params["host_task_time"] = params["host_task_time2"] + ";" + params["host_task_time_picker"];
    	}
    }
    params["host_task_owner"] = myId;

console.log(params);
// return;
    return params;
}
