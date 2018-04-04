var hostWorkId//工作ID


function init(){

if (tek.common.isLoggedIn()) {
		hostWorkId = request['host_work_id'];
		//获取工作信息
        getHostWorkInfo();
        //获取任务返回信息
        getWorkRecord();

    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
}

//跳转到工作读取页面
function showHostScript(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/script/read.html?host_task_id='+hostScriptId+'&refresh-opener=1&show-close=1');
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

// 获取工作信息
function getHostWorkInfo(){
	var setting = {operateType: '获取工作信息'};
	var sendData = {
		objectName: "HostWork",
		action:"readInfo",
		host_work_id:hostWorkId,
	}; 
	var callback = {
		beforeSend: function () {
			$("#host_work_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var record = data['record'];
			if (record) {
				// getTaskWorkInfo();
				showHostWorkInfo(record);
			} else {
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '工作记录不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取任务作用的主机
// function getSiteTask(){
	
// 	var setting = {operateType: '获取任务作用的主机'};
// 	var sendData = {
// 		objectName: "TaskSite",
// 		action:"getList",
// 		task_site_task:hostTaskId,
// 	}
// 	var callback = {
// 		beforeSend: function () {
// 			$("#host_task_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
// 		},
// 		success: function (data) {
// 			var records = data.record;
// 			if(records !=""){
// 				// tek.macCommon.waitDialogHide(3000,'showHostTask()');
// 				var html = '';
// 				html += records.task_site_site.show;
// 				$("task_site_site").html(html);
// 			}
// 		},
//         error: function (data, errorMsg) {
//            	tek.macCommon.waitDialogShow(null, errorMsg);
//            	tek.macCommon.waitDialogHide(3000);
//         }
// 	}
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

// }

//任务信息显示
function showHostWorkInfo(hostTask){
	var html = "";
	html += '<div class="form-group">';
	// html += getSiteTask(html);
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_work_name.display +'</label><div class="col-lg-5">'+ hostTask.host_work_name.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ "任务名称" +'</label><div class="col-lg-5">'+ hostTask.host_work_task.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ "工作状态" +'</label><div class="col-lg-5" id="host_task_status">';
	if(hostTask.host_work_status.value == 1){
		html += '<span class="label label-success">'+ hostTask.host_work_status.show +'</span>';
	}else if(hostTask.host_work_status.value == 0){
		html += '<span class="label label-warning">'+ hostTask.host_work_status.show +'</span>';
	}else if(hostTask.host_work_status.value == -1){
		html += '<span class="label label-danger">'+ hostTask.host_work_status.show +'</span>';
	}
	html += '</div></div>';

	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_work_error.display +'</label><div class="col-lg-5">'+ hostTask.host_work_error.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_work_owner.display +'</label><div class="col-lg-5">'+ hostTask.host_work_owner.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_work_type.display +'</label><div class="col-lg-5" id="host_work_type">';
	if(hostTask.host_work_type.value == 1){
		html += '<span class="label label-success">'+ hostTask.host_work_type.show +'</span>';
	}else if(hostTask.host_work_type.value == -1){
		html += '<span class="label label-warning">'+ hostTask.host_work_type.show +'</span>';
	}else if(hostTask.host_work_type.value == 0){
		html += '<span class="label label-danger">'+ hostTask.host_work_type.show +'</span>';
	}
	html += '</div></div>';

	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_work_start.display +'</label><div class="col-lg-5">'+ hostTask.host_work_start.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_work_end.display +'</label><div class="col-lg-5">'+ hostTask.host_work_end.show +'</div></div>';
    // 工作说明
    // html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_work_end.display +'</label><div class="col-lg-5">'+ hostTask.host_work_end.show +'</div></div>';

    html += '</div>';   
	html += '<div class="form-group">';
	html += '<div class="col-lg-offset-2 col-lg-6">';
	html += '</div>';
	html += '</div>';    
    
    $("#host_work_form").html(html); 

                                
}
// 获取任务返回信息
function getWorkRecord(){
	var setting = {operateType: '获取任务返回信息'};
	var sendData = {
		objectName: "WorkRecord",
		action:"getList",
		work_record_work: hostWorkId,
		// count: 6,
	}
	var callback = {
		beforeSend: function () {
			$("#host_work_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(records){
				var html = "";
					html += '<thead><tr>'
				         + '<th>#</th>'
				         + '<th>执行工作的主机</th>'
				         + '<th>执行返回的记录</th>'
				         + '<th>执行状态</th>'
				         // + '<th>操作</th>'
				         + '</tr></thead>';
    			$("#work_record_list").html(html);
				if(records.length){
					for(var i in records){
						showWorkRecordInfo(i, records[i]);
					}
				}else{
					showWorkRecordInfo(0, records);
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

//任务返回信息显示
function showWorkRecordInfo(num, record){
	var html = "";
	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.work_record_site.show + '</td>'
         + '<td>' + record.work_record_remark.show + '</td>'
    	 if(record.work_record_status.value == 1){
    	 	html += '<td><span class="label label-success">'+ record.work_record_status.show +'</span></td>';
    	 	}else if(record.work_record_status.value == 0){
    	 		html += '<td><span class="label label-primary">'+ record.work_record_status.show +'</span></td>';
    	 	}else{
    	 		html += '<td><span class="label label-danger">'+ record.work_record_status.show +'</span></td>';
    	 	}		
       // html += '<td><a href="../../../http/ipower/work/read.html?host_work_id=' + record.id + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i> </a>'
       //      + '<a href="../../../http/ipower/work/edit.html?host_work_id=' + record.id +'" class="btn btn-xs btn-warning"><i class="fa fa-pencil"></i> </a>'
       //      +'<button onclick="javascript:deleteHostWork(' + record.id + ');" class="btn btn-xs btn-danger"><i class="fa fa-times"></i> </button></td></tr>'

    $("#work_record_list").append(html);

}

//获取信息
// function showWorkRecordInfo(num, record){
// 	$("#work_record_site").var(record.work_record_site.show);
// 	getRecordStatus();
// 	$("#work_record_remark").var(record.work_record_remark.show);
// }

// 获取执行状态
// function getRecordStatus(){
// 	var setting = {operateType: '获取执行状态'};
// 	var sendData = {
// 		objectName: "WorkRecord",
// 		action:"readInfo",
// 		work_record_work: hostWorkId,
// 	}; 
// 	var callback = {
// 		beforeSend: function () {
// 			$("#host_work_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
// 		},
// 		success: function (data) {
// 			var record = data['record'];
// 			if (record) {
// 				showRecordStatus(record);
// 				// showHostTaskInfo(record);
// 			} else {
// 				//提示 '记录不存在！'
// 				tek.macCommon.waitDialogShow(null, '任务记录不存在');
// 			}
// 		},
//         error: function (data, errorMsg) {
//            	tek.macCommon.waitDialogShow(null, errorMsg);
//            	tek.macCommon.waitDialogHide(3000);
//         }
// 	}
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

// 	function showRecordStatus(record){
// 		var html = '';
// 		if(record.work_record_status.value == 1){
//     	 	html += '<td><span class="label label-success">'+ record.work_record_status.show +'</span></td>';
//     	 	}else if(record.work_record_status.value == 0){
//     	 		html += '<td><span class="label label-primary">'+ record.work_record_status.show +'</span></td>';
//     	 	}else{
//     	 		html += '<td><span class="label label-danger">'+ record.work_record_status.show +'</span></td>';
//     	 	}
//     	 	$("#work_record_status").append(html);
// 			 }
// }



//跳转到编辑工作页面
function goEditHostWork(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/work/edit.html?host_work_id='+hostWorkId+'&refresh-opener=1&show-close=1');
    callPage(url);
   	function callPage(backURL) {
        if (backURL) {
            //var callbackConfirm = confirm("确定返回前一页面？");
            //if (callbackConfirm)
            location.href = backURL;
        }
    };

}

//获取工作关联任务信息--
// function getTaskWorkInfo(){
// 	var html = '';
// 	var setting = {operateType: '获取工作关联任务信息'};
// 	var sendData = {
// 		objectName: "TaskSite",
// 		action:"getList",
// 		task_site_task:hostTaskId,
// 	}
// 	var callback = {
// 		beforeSend: function () {
// 			$("#site_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
// 		},
// 		success: function (data) {
// 			var records = data.record;
			
// 			if(!records){
// 				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
// 				html += '<font>暂无相关主机，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:;">添加主机</a></font>';
// 				$("#site_list").html(html);
// 			}else{
// 				var table = '<div class="table-responsive">'
// 					 + '<table class="table table-striped table-bordered table-hover" id="">'
// 					 + '<thead id="site_title"></thead>'
// 					 + '<tbody id="site_list_info"></tbody>'
// 					 + '</table></div><div class="widget-foot"></div>';
// 				$("#site_list").html(table);
// 				if(records.length){
// 					html += '<tr>'
// 	              		 + '<th>#</th>'
// 	              		 + '<th>'+ records[0].task_site_site.display +'</th>'
// 	              		 + '<th>'+ records[0].task_site_credentials.display +'</th>'
// 	              		 + '<th>操作</th>'
// 	              		 + '</tr>';
// 	              	$("#site_title").html(html);

// 					for(var i in records){
// 						var count = tek.dataUtility.stringToInt(i) + 1;
// 						//显示凭证信息
// 						showHostSite(count, records[i]);
// 					}
// 				}else{
// 					html += '<tr>'
// 	              		 + '<th>#</th>'
// 	              		 + '<th>'+ records.task_site_site.display +'</th>'
// 	              		 + '<th>'+ records.task_site_credentials.display +'</th>'
// 	              		 + '<th>操作</th>'
// 	              		 + '</tr>';
// 	              	$("#site_title").html(html);
// 					//显示凭证信息
// 					showHostSite(1, records);
// 				}
// 			}
// 		},
//         error: function (data, errorMsg) {
//             tek.macCommon.waitDialogShow(null, errorMsg);
//             tek.macCommon.waitDialogHide(3000);
//         }
// 	}
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

// }

//显示有关此任务的主机
function showHostSite(count, record){
	var html = '';
	html += '<tr>'
	  // + '<td><span class="uni"><input type="checkbox" value="check1" /></span></td>'
	  + '<td>'+ count +'</td>'
	  + '<td><a href="../site/read.html?host_site_id='+ record.task_site_site.value +'">'+ record.task_site_site.show +'</a></td>'
	  + '<td>'+ record.task_site_credentials.show +'</td>'
	  + '<td><a onclick="" class="label label-success">运行一次</a></td>';

	// html += '<td>'
	// + '<a class="label label-primary" href="../script/read.html?host_script_id='+ record.id +'">查看</a>&nbsp;&nbsp;'
	// // + '<a class="label label-danger" href="javascript:removeGroupSite(\''+ record.id +'\')">移除</a>'
	// + '</td>';
	html += '</tr>';
	$("#site_list_info").append(html);
}


//跳转到编辑任务页面
function goEditHostTask(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/task/edit.html?host_task_id='+hostTaskId+'&refresh-opener=1&show-close=1');
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


