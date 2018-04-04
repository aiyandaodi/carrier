var hostTaskId;//任务ID
var taskRecord;
// var hostWorkId;//工作ID

function init(){

if (tek.common.isLoggedIn()) {
		hostTaskId = request['host_task_id'];
		//获取任务信息
        getHostTaskInfo();


    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
}

//跳转到主机读取页面
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

// 获取任务信息
function getHostTaskInfo(){
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
				taskRecord = record;
				getTaskSiteInfo();
				showHostTaskInfo(record);
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
}

//获取任务作用的主机--
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
function showHostTaskInfo(hostTask){
	var html = "";
	html += '<div class="form-group">';
	// html += getSiteTask(html);
	// html += '<label class="col-lg-2 control-label">'+ '作用到的主机'+'</label><div class="col-lg-5"  id="task_site_site">'+getSiteTask()+'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_task_name.display +'</label><div class="col-lg-5">'+ hostTask.host_task_name.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_task_owner.display +'</label><div class="col-lg-5">'+ hostTask.host_task_owner.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_task_remark.display +'</label><div class="col-lg-5">'+ hostTask.host_task_remark.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_task_status.display +'</label><div class="col-lg-5" id="host_task_status">';
	if(hostTask.host_task_status.value == 1){
		html += '<span class="label label-success">'+ hostTask.host_task_status.show +'</span>';
	}else if(hostTask.host_task_status.value == 0){
		html += '<span class="label label-warning">'+ hostTask.host_task_status.show +'</span>';
	}else if(hostTask.host_task_status.value == -1){
		html += '<span class="label label-danger">'+ hostTask.host_task_status.show +'</span>';
	}
	html += '</div></div>';

	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ hostTask.host_task_time.display +'</label><div class="col-lg-5">';
	var taskTime = hostTask.host_task_time.show;
	if(taskTime == "0"){
		html += '暂无&nbsp;&nbsp;';
	}else if(taskTime == "1"){
		html += '执行一次&nbsp;&nbsp;';
	}else{
		taskTime = (hostTask.host_task_time.show).split(";");
		if(taskTime[0] == "11"){
			html += '每天&nbsp;&nbsp;' + taskTime[1].split(" ")[1];
		}else if(taskTime[0] == "12"){
			html += '每周&nbsp;' + tek.dataUtility.stringToDate(taskTime[1], 'yyyy-MM-dd HH:mm').getDay()+ '&nbsp;&nbsp;'+ taskTime[1].split(" ")[1];
		}else if(taskTime[0] == "14"){
			html += '每月&nbsp;&nbsp;' + tek.dataUtility.stringToDate(taskTime[1], 'yyyy-MM-dd HH:mm').getDate()+ '号&nbsp;&nbsp;' + taskTime[1].split(" ")[1];
		}else if(taskTime[0] == "18"){
			var month = tek.dataUtility.stringToInt(tek.dataUtility.stringToDate(taskTime[1], 'yyyy-MM-dd HH:mm').getMonth()) + 1;
			html += '每年&nbsp;&nbsp;' + month + '月&nbsp;&nbsp;' + tek.dataUtility.stringToDate(taskTime[1], 'yyyy-MM-dd HH:mm').getDate()+ '号&nbsp;&nbsp;' + taskTime[1].split(" ")[1];
		}
	}
	+ hostTask.host_task_time.show +'</div></div>';
                                  
    html += '</div>';   
	html += '<div class="form-group">';
	html += '<div class="col-lg-offset-2 col-lg-6">';

	// html += '<button type="button" class="btn btn-sm btn-primary">查看规格信息</button>';
	// html += '<a href="edit.html?host_task_id='+ hostTaskId +'" type="button" class="btn btn-sm btn-warning">编辑任务信息</a>&nbsp;&nbsp;&nbsp;';
	// html += '<a href="#" type="button" class="btn btn-sm btn-success">运行一次</a>';
	html += '</div>';
	html += '</div>';    
    
    $("#host_task_form").html(html); 

                                
}


//获取任务关联主机信息
function getTaskSiteInfo(){
	var html = '';
	var setting = {operateType: '获取任务关联主机信息'};
	var sendData = {
		objectName: "TaskSite",
		action:"getList",
		task_site_task:hostTaskId,
	}
	var callback = {
		beforeSend: function () {
			$("#site_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			// 每一条路上的我们都是光芒的，也许以后我们很少联系，也许我们相隔‘十万八千里’。但只要咱们愿意，跨越这段路总会比西天取经要容易
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无相关主机，点此&nbsp;&nbsp;<a class="label label-primary" href="../site/add.html?task_site_task='+ hostTaskId +'">创建主机</a></font>';
				$("#site_list").html(html);
			}else{
				var table = '<div class="table-responsive">'
					 + '<table class="table table-striped table-bordered table-hover" id="">'
					 + '<thead id="site_title"></thead>'
					 + '<tbody id="site_list_info"></tbody>'
					 + '</table></div><div class="widget-foot"></div>';
				$("#site_list").html(table);
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].task_site_site.display +'</th>'
	              		 + '<th>'+ records[0].task_site_credentials.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#site_title").html(html);

					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						//显示主机信息
						showHostSite(count, records[i]);
					}
				}else{
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.task_site_site.display +'</th>'
	              		 + '<th>'+ records.task_site_credentials.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#site_title").html(html);
					//显示主机信息
					showHostSite(1, records);
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

// 运行一次
function runTask(){
	var date = new Date();
	var format = "yyyy-MM-dd HH:mm";
	var current_date = tek.dataUtility.dateToString(date, format);
	var work_name = taskRecord.host_task_name.show+":"+current_date;
	var setting = {operateType: '提交工作信息'};
	var sendData = {
		objectName: "HostWork",
		action:"addInfo",
		host_work_name:work_name,
		host_work_task:hostTaskId,
	}; 
	var callback = {
		beforeSend: function () {
			$("#host_task_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
				// hostWorkId = (data.value).split("=");
				location.href = tek.common.getRootPath()+'http/ipower/work/read.html?'+data.value;
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	}

