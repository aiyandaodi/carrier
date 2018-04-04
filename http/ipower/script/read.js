var hostScriptId;//脚本ID
var hostScriptService;//脚本适用于的服务

function init(){

if (tek.common.isLoggedIn()) {
		hostScriptId = request['host_script_id'];
		//获取脚本信息
        getHostScriptInfo();


    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
}

//跳转到主机读取页面
function showHostScript(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/script/read.html?host_script_id='+hostScriptId+'&refresh-opener=1&show-close=1');
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

// 获取脚本信息
function getHostScriptInfo(){
	var setting = {operateType: '获取脚本信息'};
	var sendData = {
		objectName: "HostScript",
		action:"readInfo",
		host_script_id:hostScriptId,
	};
	var callback = {
		beforeSend: function () {
			$("#host_script_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var record = data['record'];
			if (record) {
				if(tek.role.isAuditor(myRole)){
					$("#show_edit_script").show();
				}
				showHostScriptInfo(record);
				getHostTaskScript(hostScriptId);
				if(record.host_script_services){
					var services = tek.dataUtility.stringToArray(record.host_script_services.show, ";");
					for(var i in services){
						getHostServiceType(services[i]);
					}
				}

			} else {
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '脚本记录不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//跳转到编辑脚本页面
function goEditHostScript(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/script/edit.html?host_script_id='+ hostScriptId +'&refresh-opener=1&show-close=1');

    callPage(url);
   	function callPage(backURL) {
        if (backURL) {
            //var callbackConfirm = confirm("确定返回前一页面？");
            //if (callbackConfirm)
            location.href = backURL;
        }
    };

}


//获取脚本适用于的服务类型
function getHostServiceType(id){
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
				hostScriptService = records.dictionary_name.show;
				$("#host_script_services").append( hostScriptService + "&nbsp;&nbsp;&nbsp;&nbsp;");
			}else{
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '脚本使用于的服务类型不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//脚本信息显示
function showHostScriptInfo(record){
	
	var html = "";
	html += '<div class="form-group">';
	// ------------------------------------------------------------------------------------------------------------------------------------
	html += '<label class="col-lg-2 control-label">'+ record.host_script_name.display +'</label><div class="col-lg-5">'+ record.host_script_name.show +'</div></div>';
	if (record.host_script_group.value == 0) {
		if (tek.role.isAuditor(myRole)) {
			html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_script_group.display +'</label><div class="col-lg-5">暂无所属群组，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getSiteGroupList();">选择主机群组</a></div></div>';
		}else{
			html += '<font>暂无所属群组</font>'
		}
	}else{
		scriptGroupId = record.host_script_group.value;
		html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_script_group.display +'</label><div class="col-lg-5">'+ record.host_script_group.show +'</div></div>';
	}
	// ---------------------------------------------------------------------------------------------------------------------------------------
	// html += '<label class="col-lg-2 control-label">'+ record.host_script_name.display +'</label><div class="col-lg-5">'+ record.host_script_name.show +'</div></div>';
	// html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_script_group.display +'</label><div class="col-lg-5">'+ record.host_script_group.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_script_color.display +'</label><div class="col-lg-5"><span class="label label-'+ record.host_script_color.value +'" value="'+ record.host_script_color.value +'">&nbsp;';
	if(record.host_script_color.show == "default")
		html += "无";
	if(record.host_script_color.show == "info")
		html += "普通";
	if(record.host_script_color.show == "primary")
		html += "一般";
	if(record.host_script_color.show == "success")
		html += "正常";
	if(record.host_script_color.show == "warning")
		html += "严重";
	if(record.host_script_color.show == "danger")
		html += "紧急";
	html += '&nbsp;</span></div></div>';

	var tags = tek.dataUtility.stringToArray(record.host_script_tag.show, ";");
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_script_tag.display +'</label><div class="col-lg-5" id="host_script_tag">';
	for(var i in tags){
		html += '<span class="label label-success">'+ tags[i] +'</span>';
	}
	html += '</div></div>';

	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_script_status.display +'</label><div class="col-lg-5" id="host_site_status">';
	if(record.host_script_status.value == 1){
		html += '<span class="label label-success">'+ record.host_script_status.show +'</span>';
	}else if(record.host_script_status.value == 0){
		html += '<span class="label label-warning">'+ record.host_script_status.show +'</span>';
	}else if(record.host_script_status.value == -1){
		html += '<span class="label label-danger">'+ record.host_script_status.show +'</span>';
	}
	html += '</div></div>';

	// console.log(services);
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_script_services.display +'</label><div class="col-lg-5" id="host_script_services">';

	html += '</div></div>';


	


	html += '<div class="form-group"><label class="col-lg-2 control-label">脚本文件</label><div class="col-lg-5">qqfile.sh &nbsp;&nbsp;&nbsp;<input type="button" value="下载该脚本文件"></div></div>';

	// html += '<label class="col-lg-2 control-label">'+ record.host_site_stoptime.display +'</label><div class="col-lg-5"><font class="form-control" id="host_site_stoptime">'+ record.host_site_stoptime.show +'</font></div>';
	// html += '<label class="col-lg-2 control-label">'+ record.host_site_supplier.display +'</label><div class="col-lg-5"><font class="form-control" id="host_site_supplier">'+ record.host_site_supplier.show +'</font></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_script_remark.display +'</label><div class="col-lg-5">'+ record.host_script_remark.show +'</div>';
	// html += '<label class="col-lg-2 control-label">'+ record.host_site_user.display +'</label><div class="col-lg-5"><font class="form-control" id="host_site_user">'+ record.host_site_user.show +'</font><a class="label label-info">查看联系信息</a></div>';
	// html += '<label class="col-lg-2 control-label">'+ record.host_site_contact.display +'</label><div class="col-lg-5"><font class="form-control" id="host_site_contact">'+ record.host_site_contact.show +'</font><a class="label label-info">查看联系信息</a></div>';
                                  
    html += '</div>';   
	html += '<div class="form-group">';
	html += '<div class="col-lg-offset-2 col-lg-6">';

	// html += '<button type="button" class="btn btn-sm btn-primary">查看规格信息</button>';
	// html += '<a href="edit.html?host_script_id='+ hostScriptId +'" type="button" class="btn btn-sm btn-warning">编辑脚本信息</a>&nbsp;&nbsp;&nbsp;';
	// html += '<a href="../../../index.html" type="button" class="btn btn-sm btn-default">返回</a>';
	html += '</div>';
	html += '</div>';    
    
    $("#host_script_form").html(html); 

           
}

//获取此脚本的信息
function getHostTaskScript(id){
	var html = '';
	var setting = {operateType: '获取此脚本的信息'};
	var sendData = {
		objectName: "TaskScript",
		action:"getList",
		task_script_script:id
	}
	var callback = {
		beforeSend: function () {
			$("#script_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无有关该脚本任务，点此&nbsp;&nbsp;<a class="label label-primary" href="../task/add.html?host_task_script='+ hostScriptId +'">创建任务</a></font>';
				$("#task_list").html(html);
			}else{
				var table = '<div class="table-responsive">'
					 + '<table class="table table-striped table-bordered table-hover" id="host_task_list">'
					 + '<thead id="task_title"></thead>'
					 + '<tbody id="task_list_info"></tbody>'
					 + '</table></div><div class="widget-foot"></div>';
				$("#task_list").html(table);
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ '任务名' +'</th>'
	              		 + '<th>'+ '任务备注' +'</th>'
	              		 + '<th>'+ '任务状态' +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#task_title").html(html);

					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						//获取任务信息--通过脚本获取任务
						// showHostTaskScript(count, records[i]);
						getTaskScript(count, records[i]);
					}
				}else{
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ '任务名' +'</th>'
	              		 + '<th>'+ '任务备注' +'</th>'
	              		 + '<th>'+ '任务状态' +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#task_title").html(html);
					//获取任务信息
					// showHostTaskScript(1, records);
					getTaskScript(1,records);
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

// 获取脚本相关任务信息
function getTaskScript(count,record){
	var setting = {operateType: '获取有关此脚本相关的任务列表'};
	var sendData = {
		objectName: "HostTask",
		action:"getList",
		host_task_id:record.task_script_task.value
	}
	var callback = {
		beforeSend: function () {
			$("#script_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function(data){
			var records = data.record;
			if (!records) {
				showHostTaskScript(count ,record[i]);
			}else{
				showHostTaskScript(1,records);
			}
		},
		error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示有关此脚本的任务信息
function showHostTaskScript(count, record){
	var html = '';
	html += '<tr>'
	  // + '<td><span class="uni"><input type="checkbox" value="check1" /></span></td>'
	  + '<td>'+ count +'</td>'
	  + '<td>'+ record.host_task_name.show +'</td>'
	  + '<td>'+ record.host_task_remark.show +'</td>';

	if(record.host_task_status.value == 1){
		html += '<td><span class="label label-success">'+ record.host_task_status.show +'</span></td>';
	}else if(record.host_task_status.value == 0){
		html += '<td><span class="label label-warning">'+ record.host_task_status.show +'</span></td>';
	}else if(record.host_task_status.value == -1){
		html += '<td><span class="label label-danger">'+ record.host_task_status.show +'</span></td>';
	}

	html += '<td>'
	+ '<a href="../task/read.html?host_task_id=' + record.id + '" class="label label-primary">查看</a>';
	// + '<a class="label label-danger" href="javascript:removeGroupSite(\''+ record.id +'\')">移除</a>'
	+ '</td>';
	html += '</tr>';
	$("#task_list_info").append(html);
}





// //脚本颜色提交
// function setColor(){
// 	var formData = getFormData();
// 	// console.log(formData);
// 	var setting = {operateType: "添加脚本颜色标记"};
// 	var sendData = tek.Utils.mergeForObject({
//             objectName: "HostScript", 
//             action: "setInfo", 
//             host_script_id:hostScriptId,
//         }, formData);
// 	var callback = {
// 		beforeSend: function () {
// 			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
// 		},
// 		success: function (data) {
// 			if(data){
// 				// hostScriptId = data.value;
// 				tek.macCommon.waitDialogShow("", '添加成功!',null,2);
// 				tek.macCommon.waitDialogHide(3000,'showHostScript()');
// 				// showHostSite(data.value);
// 			}
// 			// alert("1");
// 		},
//         error: function (data, errorMsg) {
//            	tek.macCommon.waitDialogShow(null, errorMsg);
//            	tek.macCommon.waitDialogHide(3000);
//         }
// 	}
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

// }

// // 获取提交表单数据（同时校验）
// function getFormData() {
//     var params = tek.Utils.getFromJSON(document.getElementById("script_color_form"));
//     var color = "";
//     for(var i in params["host_script_color"]){
//     	color += params["host_script_color"][i] +",";
//     }
//     // console.log(color);
//     params["host_script_color"] = color;

//     return params;
// }