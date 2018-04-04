//初始化
function init() {
	//判断用户是否登录
	 if (tek.common.isLoggedIn()) {
	 	
 		//获取工作列表
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

//获取工作列表
function getHostTaskList(){
	var setting = {operateType: '获取工作列表信息'};
	var sendData = {
		objectName: "HostWork",
		action:"getList",
		count: 6,
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
				         + '<th>工作名称</th>'
				         + '<th>任务标识</th>'
				         + '<th>工作进行时的状态值</th>'
				         + '<th>执行的错误数</th>'
				         + '<th>工作类型</th>'
				         + '<th>工作开始时间</th>'
				         + '<th>工作结束时间</th>'
				         + '<th>操作</th>'
				         + '</tr></thead>';
    			$("#host_work_form").html(html);
				if(records.length){
					for(var i in records){
						showHostWorkInfo(i, records[i]);
					}
				}else{
					showHostWorkInfo(0, records);
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

//工作信息显示
function showHostWorkInfo(num, record){
	var html = "";
	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.host_work_name.show + '</td>'
         + '<td>' + record.host_work_task.show + '</td>'
         if (record.host_work_status.value == 1) 
         	html += '<td><span class="label label-success">'+ record.host_work_status.show +'</span></td>'
         if (record.host_work_status.value == 0) 
         	html += '<td><span class="label label-default">'+ record.host_work_status.show +'</span></td>'
         if (record.host_work_status.value == -1) 
         	html += '<td><span class="label label-warning">'+ record.host_work_status.show +'</span></td>'

    html += '<td>' + record.host_work_error.show + '</td>'
	     // + '<td>' + record.host_work_type.show + '</td>'
	     if (record.host_work_type.value == 1) 
	     	html += '<td><span class="label label-success">'+ record.host_work_type.show +'</span></td>';
	     if (record.host_work_type.value == 0) 
	     	html += '<td><span class="label label-info">' + record.host_work_type.show + '</span>';
    html += '<td>' + record.host_work_start.show + '</td>'
         + '<td>' + record.host_work_end.show + '</td>'
         + '<td><a href="../../../http/ipower/work/read.html?host_work_id=' + record.id + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i> </a>'
    $("#host_work_form").append(html);

}

//删除
function deleteHostWork(hostTaskId){
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
			deleteIpowerHostTask(hostTaskId);
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
function deleteIpowerHostTask(hostTaskId){
	var ajaxURL = "http://10.128.0.211/ipower/ip/api_jsonrpc.php";
	var params = '';
	params += '"hosttaskid":"' + hostTaskId + '",';
	params += '"status":1';
	// params += '"groups":[{"groupid":"10"}]';

	var param = "" + params;
    var request = '';
    request += '{';
    request += '"auth":"'+ ipowerAudit +'",';
    request += '"id":1,';
    request += '"jsonrpc":"2.0",';
    request += '"method":"host.update",';
    // request += '"method":"hostgroup.get",';
    // request += '"params":{"output":"extend","searchByAny":"true"}';
    request += '"params":{'+ param + '}';
    request += '}';

	$.ajax({
		type:"POST",
		url:ajaxURL,
		headers:{
			"Content-Type":"application/json-rpc",
			"ACCEPT":"application/json-rpc,text/javascript, text/html, application/xml, text/xml, */*"
		},
		data:"" + request,
		dataType:"json",
		processData:false,
		success: function(data){
			// console.log(data);
			if(data){
				if(data.result != null){
					
				}else{
					// tek.macCommon.waitDialogShow(null, errorMsg);
				}
			}else{
				// tek.macCommon.waitDialogShow(null, errorMsg);
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	})
}