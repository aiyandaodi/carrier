//初始化
function init() {
	//判断用户是否登录
	 if (tek.common.isLoggedIn()) {
	 	
 		//控制台数据显示
		getHostTaskList();
		
		//登录ipower管理系统，获取登录凭证
		getIpowerMonitorLogin();
	}else{
		tek.macCommon.waitDialogShow("<font color='red'>请先登录</font>", "正在跳转登录页面...", null, 0);
		tek.macCommon.waitDialogHide(1500, 'goLogin()');
	}

}

//登录ipower管理系统，获取登录凭证
function getIpowerMonitorLogin(){
	// var ajaxURL = "http://10.128.0.211/ipower/ip/api_jsonrpc.php";
	var ajaxURL = "http://10.128.0.211:8800/api_jsonrpc.php";
    var params = '';
    params += '{';
    params += '"auth":null,';
    params += '"id":0,';
    params += '"jsonrpc":"2.0",';
    params += '"method":"user.login",';
    params += '"params":{"user":"Admin","password":"tekinfo.net"}';
    params += '}';

	$.ajax({
		type:"POST",
		url:ajaxURL,
		headers:{
			"Content-Type":"application/json-rpc",
			"ACCEPT":"application/json-rpc,text/javascript, text/html, application/xml, text/xml, */*"
		},
		data:params,
		dataType:"json",
		processData:false,
		success: function(data){
			// console.log(data);
			if(data){
				if(data.result != null){
					ipowerAudit = data.result;

				}else{
					// tek.macCommon.waitDialogShow(null, errorMsg);
				}
			}else{
				// tek.macCommon.waitDialogShow(null, errorMsg);
			}
		},
        // error: function (data, errorMsg) {
        //    	tek.macCommon.waitDialogShow(null, errorMsg);
        //    	tek.macCommon.waitDialogHide(3000);
        // }
        error: function(data){
            console.log(data);
        }
	})
}

//获取主机任务列表信息
function getHostTaskList(){
	var setting = {operateType: '获取任务列表信息'};
	var sendData = {
		objectName: "HostTask",
		action:"getList",
		count: 10,
	}
	var callback = {
		beforeSend: function () {
			$("#host_task_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(records){
				var html = "";
					html += '<thead><tr>'
				         + '<th>#</th>'
				         + '<th>任务名称</th>'
				         + '<th>任务备注</th>'
				         + '<th>任务状态</th>'
				         + '<th>任务所使用脚本</th>'
				         + '<th>任务开始时间</th>'
				         + '<th>操作</th>'
				         + '</tr></thead>';
    			$("#host_task_form").html(html);
				if(records.length){
					for(var i in records){
						if(records[i].host_task_status.value != -1)
						showHostTaskInfo(i, records[i]);
					}
				}else{
					showHostTaskInfo(0, records);
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

//任务信息显示
function showHostTaskInfo(num, record){
	var html = "";
	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.host_task_name.show + '</td>'
         + '<td>' + record.host_task_remark.show + '</td>'
         if (record.host_task_status.value == 1) {
         	html += '<td><span class="label label-success">'+ record.host_task_status.show +'</span></td>';
         }else if (record.host_task_status == 0) {
         	html += '<td><span class="label label-warning">'+ record.host_task_status.show +'</span></td>';
         }else{
         	html += '<td><span class="label label-danger">'+ record.host_task_status.show +'</span></td>';
         }
         // + '<td>' + record.host_task_status.show + '</td>'
    html += '<td id="task_script_script_'+ num +'"></td>' 
         + '<td>' + record.host_task_start.show + '</td>'
         + '<td><a href="../../../http/ipower/task/read.html?host_task_id=' + record.id + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i> </a>'
         + '<a href="../../../http/ipower/task/edit.html?host_task_id=' + record.id +'" class="btn btn-xs btn-warning"><i class="fa fa-pencil"></i> </a>'
                  +'<button onclick="javascript:deleteHostTask(\'' + record.id + '\');" class="btn btn-xs btn-danger"><i class="fa fa-times"></i> </button></td></tr>'
     	        
         getTaskScript(num,record.id);         
    $("#host_task_form").append(html);

}

//获取任务有关脚本
function getTaskScript(num,id){
	var setting = {operateType:'获取任务关联脚本'};
	var sendData = {
		objectName:"TaskScript",
		action:"getList",
		task_script_task:id 
	}
	var callback = {
		beforeSend: function () {
			$("#host_script_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success:function(data){
			var records = data.record;
			if (records.length>1){
					for (var i = 0; i < records.length; i++) {
						var taskScript = tek.dataUtility.stringToArray(records[i].task_script_script.show, ";");
						showTaskScript(records[i],num);
					} 
				}
			else{  
					$("#task_script_script_"+num).append(records.task_script_script.show);
				}
			},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	function showTaskScript(records,num){
			$("#task_script_script_"+num).append(records.task_script_script.show+";");
			// var html = "";
			// html += '<td> ' + records.task_script_script.show + '</td>'
			// $("#host_task_form").append(html);
		}
}


//删除
function deleteHostTask(hostTaskId){
	var setting = {operateType: '删除任务'};
	var sendData = {
		objectName: "HostTask",
		action:"setInfo",
		host_task_id: hostTaskId,
		host_task_status: -1,
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			// deleteIpowerHostTask(hostTaskId);
			tek.macCommon.waitDialogShow(null, "删除成功", null, 0);
			tek.refresh.refresh(1500);
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//删除任务（将状态改为-1）
// function deleteIpowerHostTask(hostTaskId){
// 	var ajaxURL = "http://10.128.0.211/ipower/ip/api_jsonrpc.php";
// 	var params = '';
// 	params += '"hosttaskid":"' + hostTaskId + '",';
// 	params += '"status":1';
// 	// params += '"groups":[{"groupid":"10"}]';

// 	var param = "" + params;
//     var request = '';
//     request += '{';
//     request += '"auth":"'+ ipowerAudit +'",';
//     request += '"id":1,';
//     request += '"jsonrpc":"2.0",';
//     request += '"method":"host.update",';
//     // request += '"method":"hostgroup.get",';
//     // request += '"params":{"output":"extend","searchByAny":"true"}';
//     request += '"params":{'+ param + '}';
//     request += '}';

// 	$.ajax({
// 		type:"POST",
// 		url:ajaxURL,
// 		headers:{
// 			"Content-Type":"application/json-rpc",
// 			"ACCEPT":"application/json-rpc,text/javascript, text/html, application/xml, text/xml, */*"
// 		},
// 		data:"" + request,
// 		dataType:"json",
// 		processData:false,
// 		success: function(data){
// 			// console.log(data);
// 			if(data){
// 				if(data.result != null){
					
// 				}else{
// 					// tek.macCommon.waitDialogShow(null, errorMsg);
// 				}
// 			}else{
// 				// tek.macCommon.waitDialogShow(null, errorMsg);
// 			}
// 		},
//         error: function (data, errorMsg) {
//            	tek.macCommon.waitDialogShow(null, errorMsg);
//            	tek.macCommon.waitDialogHide(3000);
//         }
// 	})
// }