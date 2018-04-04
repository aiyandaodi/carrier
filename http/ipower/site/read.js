var hostSiteId;//主机ID
var hostSiteName;//主机名称
var newCredentials;//主机服务凭证信息的新建返回信息
var ipowerHostId = "";//管理台该主机id
var groupMemberId = "";//组员群组ID
var siteGroupId = "";//主机群组ID

function init(){

if (tek.common.isLoggedIn()) {
		hostSiteId = request['host_site_id'];
		//获取主机信息
        getHostSiteInfo();

        //登录ipower管理系统，获取登录凭证
		getIpowerMonitorLogin();
      

    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
	$("#waiting-modal-dialog").attr("style","margin-top:25%;");
}

//登录ipower管理系统，获取登录凭证
function getIpowerMonitorLogin(){
	var ajaxURL = "http://10.128.0.211/ipower/ip/api_jsonrpc.php";
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
		error: function(data){
			console.log(data);
		}
	})
}

//去读取主机信息
// function readInvoice(){
//     var backurl = tek.common.getRootPath()+'http/ibiz/productOrder/read.html?order_id='+order_id+'&refresh-opener=1&show-close=1';
//     var url = tek.common.getRootPath()+'http/ibank/ibankInvoice/read.html?ibank_invoice_id='+ OrderInvoive +'&order_id='+order_id+'&order_type='+orderType+'&refresh-opener=1&show-close=1&callback-url='+encodeURIComponent(backurl)+'';
//     window.open(url, '_blank');
// }

// 获取主机信息
function getHostSiteInfo(){
	var setting = {operateType: '获取主机信息'};
	var sendData = {
		objectName: "HostSite",
		action:"readInfo",
		host_site_id:hostSiteId,
	}
	var callback = {
		beforeSend: function () {
			$("#host_site_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var record = data['record'];
			if (record) {
				if(tek.role.isAuditor(myRole)){
					$("#show_edit_site").show();
					$("#show_add_service").show();
					$("#show_add_specifications").show();
				}
				ipowerHostId = record.host_host_id.value;
				hostSiteName = record.host_site_name.value;
				//获取管理台当前主机信息
				getIpowerHost();
				//获取当前主机信息
				showHostSiteInfo(record);
				//获取当前主机服务
				getHostSiteService();
				 //获取主机事件
				getHostSiteEvent();
				//获取当前主机规格
				getHostSiteSpecifications();
				//获取当前主机可操作用户
				getMemberInfo();
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

//获取主机规格信息
function getHostSiteSpecifications(){
	var setting = {operateType: '获取主机规格信息'};
	var sendData = {
		objectName: "HostSpecifications",
		action:"getList",
		host_specifications_site:hostSiteId,
		count: 10,
	}
	var callback = {
		beforeSend: function () {
			$("#specifications_show").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data['record'];
			if (records) {
				var html = "";
					html += '<thead><tr>'
				         + '<th>#</th>'
				         + '<th>规格名称</th>'
				         + '<th>规格有效值</th>'
				         + '<th>创建时间</th>'
				         // + '<th>备注</th>'
				         + '<th>操作</th>'
				         + '</tr></thead>';
				$("#specifications_show").html(html);
				if(records.length){
					for(var i in records){
						//主机规格的有效值为不再有效则不显示
						if(records[i].host_specifications_value.value != -1){

							//显示当前主机规格
							showHostSiteSpecificationsInfo(i,records[i]);
						}
					}
				}else{
					//显示当前主机规格
					if(records.host_specifications_value.value != -1){
						showHostSiteSpecificationsInfo(1,records);
					}else{
						$("#specifications_show").html("<br/>当前主机没有规格信息。");
					}
				}
				
			} else {

				$("#specifications_show").html("<br/>当前主机没有规格信息。");
				//提示 '记录不存在！'
				// tek.macCommon.waitDialogShow(null, '主机规格记录不存在');
			}
		},
		error: function (data, errorMsg) {

			$("#specifications_show").html("<br/>当前主机没有规格信息。");
			//显示错误信息
			// tek.macCommon.waitDialogShow(null, errorMsg);
		}
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//显示主机规格列表
function showHostSiteSpecificationsInfo(num, record){
	var html = "";
	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.host_specifications_name.show + '</td>'
    if(record.host_specifications_value.value == 1){
    	html += '<td><span class="label label-success">' + record.host_specifications_value.show + '</span>';
    }else if(record.host_specifications_value.value == 0){
    	html += '<td><span class="label label-warning">' + record.host_specifications_value.show + '</span>';
    }else if(record.host_specifications_value.value == -1){
    	html += '<td><span class="label label-danger">' + record.host_specifications_value.show + '</span>';
    }
    

    html += '<td>' + record.createTime.show + '</td>'
    // html += '<td>' + record.host_specifications_remark.show + '</td>'
         + '<td>'
         // +'<a href="../../../http/ipower/site/read.html?host_site_id=' + record.id + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i> </a>'
         // + '<a href="../../../http/ipower/site/edit.html?host_site_id=' + record.id + '" class="btn btn-xs btn-warning"><i class="fa fa-pencil"></i> </a>'
                  +'<button onclick="javascript:deleteHostSpecifications(\'' + record.id + '\');" class="btn btn-xs btn-danger"><i class="fa fa-times"></i> </button></td></tr>'

    $("#specifications_show").append(html);
}

//删除主机规格
function deleteHostSpecifications(serviceId){
		var setting = {operateType: '删除主机规格'};
	var sendData = {
		objectName: "HostSpecifications",
		action:"setInfo",
		host_sepicications_id: serviceId,
		host_sepicications_value: -1,
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			
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

// 获取主机事件
function getHostSiteEvent(){
	var setting = {operateType: '获取主机事件'};
	var sendData = {
		objectName: "HostEvent",
		action:"getList",
		// host_event_id:hostSiteId,
		count: 5,
	}
	var callback = {
		beforeSend: function () {
			$("#event_show").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data['record'];
			if (records) {
				var html = "";
					html += '<thead><tr>'
				         + '<th>#</th>'
				         + '<th>事件名称</th>'
				         + '<th>事件备注</th>'
				         + '<th>事件状态</th>'
				         + '<th>记录时间</th>'
				         + '<th>操作</th>'
				         + '</tr></thead>';
				$("#event_show").html(html);
				if(records.length != undefined){
					for(var i in records.id){
							showHostSiteEventInfo(i,records[i]);
					}
				}else if (records !="") {
					showHostSiteEventInfo(1,records);
				}else{
					$("#event_show").html("<br/>当前主机没有事件。");
				}
			}
		},
		error: function (data, errorMsg) {
			$("#event_show").html("<br/>当前主机没有事件。");
			//显示错误信息
			tek.macCommon.waitDialogShow(null, errorMsg);
		}
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//显示主机事件列表
function showHostSiteEventInfo(num, record){
	var html = "";
	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.host_event_name.show + '</td>'
         + '<td>' + record.host_event_remark.show + '</td>'
         // + '<td><span class="label label-success">' + record.host_site_tags.show + '</span></td>';
         // + '<td><span class="label label-success">ssh</span></td>'
    html += '<td>';
    if(record.host_event_status.value == 0){
    	html += '<span class="label label-success">' + record.host_event_status.show + '</span>&nbsp;&nbsp;';
    }else if(record.host_event_status.value == 1){
    	html += '<span class="label label-warning">' + record.host_event_status.show + '</span>&nbsp;&nbsp;';
    }else if(record.host_event_status.value == 2){
    	html += '<span class="label label-danger">' + record.host_event_status.show + '</span>&nbsp;&nbsp;';
    }
    
    html += '</td>';
    html += '<td>' + record.createTime.show + '</td>';
    html += '<td>'
         +'<a href="../../../http/ipower/services/read.html?host_event_id=' + record.id + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i> </a>'
         // + '<a href="../../../http/ipower/site/edit.html?host_site_id=' + record.id + '" class="btn btn-xs btn-warning"><i class="fa fa-pencil"></i> </a>'
                  // +'<button onclick="javascript:deleteHostService(\'' + record.id + '\');" class="btn btn-xs btn-danger"><i class="fa fa-times"></i> </button></td></tr>'

    $("#event_show").append(html);
}


//获取主机服务信息
function getHostSiteService(){
	var setting = {operateType: '获取主机服务信息'};
	var sendData = {
		objectName: "HostService",
		action:"getList",
		host_service_site:hostSiteId,
		count: 10,
	}
	var callback = {
		beforeSend: function () {
			$("#service_show").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data['record'];
			if (records) {
				var html = "";
					html += '<thead><tr>'
				         + '<th>#</th>'
				         + '<th>服务名称</th>'
				         + '<th>该服务端口</th>'
				         + '<th>状态</th>'
				         + '<th>创建时间</th>'
				         // + '<th>备注</th>'
				         + '<th>查看凭证等其他信息</th>'
				         // + '<th>操作</th>'
				         + '</tr></thead>';
				$("#service_show").html(html);
				if(records.length){
					for(var i in records){
						//主机服务的有效值为不再有效则不显示
						if(records[i].host_service_value.value != -1){

							//显示当前主机服务
							showHostSiteServiceInfo(i,records[i]);
						}
					}
				}else{
					//显示当前主机服务
					if(records.host_service_value.value != -1){
						showHostSiteServiceInfo(1,records);
					}else{
						$("#service_show").html("<br/>当前主机没有服务。");
					}
				}
			} else {
				$("#service_show").html("<br/>当前主机没有服务。");
				//提示 '记录不存在！'
				// tek.macCommon.waitDialogShow(null, '主机规格记录不存在');
			}
		},
		error: function (data, errorMsg) {
			$("#service_show").html("<br/>当前主机没有服务。");
			//显示错误信息
			// tek.macCommon.waitDialogShow(null, errorMsg);
		}
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//显示主机服务列表
function showHostSiteServiceInfo(num, record){
	var html = "";
	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.host_service_name.show + '</td>'
         + '<td>' + record.host_service_port.show + '</td>'
         // + '<td><span class="label label-success">' + record.host_site_tags.show + '</span></td>';
         // + '<td><span class="label label-success">ssh</span></td>'
    html += '<td>';
    if(record.host_service_value.value == 1){
    	html += '<span class="label label-success">' + record.host_service_value.show + '</span>&nbsp;&nbsp;';
    }else if(record.host_service_value.value == 0){
    	html += '<span class="label label-warning">' + record.host_service_value.show + '</span>&nbsp;&nbsp;';
    }else if(record.host_service_value.value == -1){
    	html += '<span class="label label-danger">' + record.host_service_value.show + '</span>&nbsp;&nbsp;';
    }
    
    if(record.host_service_ifmonitor.value == 1){
    	html += '<span class="label label-success">' + record.host_service_ifmonitor.show + '</span>&nbsp;&nbsp;';
    }else if(record.host_service_ifmonitor.value == -1){
    	html += '<span class="label label-warning">' + record.host_service_ifmonitor.show + '</span>&nbsp;&nbsp;';
    }

    if(record.host_service_ismonitor.value == 1){
    	html += '<span class="label label-success">' + record.host_service_ismonitor.show + '</span>&nbsp;&nbsp;';
    }else if(record.host_service_ismonitor.value == -1){
    	html += '<span class="label label-warning">' + record.host_service_ismonitor.show + '</span>&nbsp;&nbsp;';
    }
    // alert(record.id);
    html += '</td>';
    html += '<td>' + record.createTime.show + '</td>';
    // html += '<td>' + record.host_service_remark.show + '</td>';
    // html += '<td><button onclick="javascript:readServiceCredentials(\''+ record.id +'\',\''+ record.host_service_name.show +'\')" class="btn btn-xs btn-primary">查看凭证</button></td>'
    html += '<td>'
         +'<a href="../../../http/ipower/services/read.html?host_service_id=' + record.id + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i> </a>'
         // + '<a href="../../../http/ipower/site/edit.html?host_site_id=' + record.id + '" class="btn btn-xs btn-warning"><i class="fa fa-pencil"></i> </a>'
                  +'<button onclick="javascript:deleteHostService(\'' + record.id + '\');" class="btn btn-xs btn-danger"><i class="fa fa-times"></i> </button></td></tr>'

    $("#service_show").append(html);
}

//查看主机服务对应的凭证信息
function readServiceCredentials(serviceId, serviceName){
	var html = '';
	var setting = {operateType: '读取服务凭证信息'};
	var sendData = {
		objectName: "ServiceCredentials",
		action:"getList",
		service_credentials_service: serviceId,
		count: 10,
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			console.log(records);
			if(!records){
				html += showServiceCredentials(null, serviceId, serviceName);
				var title = hostSiteName + '&nbsp;&nbsp;&nbsp;'+ serviceName +'&nbsp;&nbsp;&nbsp;服务凭证信息<br/>&nbsp;&nbsp;&nbsp;'
							+ '<button style="float:right;" onclick="javascript:getNewCredentials(\''+ serviceId +'\','+ serviceName +');" class="btn btn-xs btn-primary">新建凭证</button>';
				tek.macCommon.waitDialogShow(title, html, null , 0);
			}else{
				if(records.length){
					for(var i in records){
						html += showServiceCredentials(records[i], serviceId, serviceName);
					}
						var title = hostSiteName + '&nbsp;&nbsp;&nbsp;'+ serviceName +'&nbsp;&nbsp;&nbsp;服务凭证信息<br/>&nbsp;&nbsp;&nbsp;'
									+ '<button style="float:right;" onclick="javascript:getNewCredentials(\''+ serviceId +'\','+ serviceName +');" class="btn btn-xs btn-primary">新建凭证</button>';
						tek.macCommon.waitDialogShow(title, html, null , 0);
				}else{
					html += showServiceCredentials(records, serviceId, serviceName);
					var title =  hostSiteName + '&nbsp;&nbsp;&nbsp;'+ serviceName +'&nbsp;&nbsp;&nbsp;服务凭证信息<br/>&nbsp;&nbsp;&nbsp;'
								+ '<button style="float:right;" onclick="javascript:getNewCredentials(\''+ serviceId +'\','+ serviceName +');" class="btn btn-xs btn-primary">新建凭证</button>';
					tek.macCommon.waitDialogShow(title, html, null , 0);
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

//弹窗显示服务凭证信息
function showServiceCredentials(record, serviceId, serviceName){
	var html = "";
	if(record != null){
		html += '<div class="form-group"><label class="col-lg-5 control-label">'+ record.service_credentials_name.display +'：</label>' + record.service_credentials_name.show + '</div>';
		html += '<div class="form-group"><label class="col-lg-5 control-label">'+ record.service_credentials_username.display +'：</label>' + record.service_credentials_username.show + '</div>';
		html += '<div class="form-group"><label class="col-lg-5 control-label">'+ record.service_credentials_passwd.display +'：</label>' + record.service_credentials_passwd.show + '</div>';
		html += '<div class="form-group"><label class="col-lg-5 control-label">'+ record.service_credentials_status.display +'：</label>'
		if(record.service_credentials_status.value == 1){
    		html += '<span class="label label-success">' + record.service_credentials_status.show + '</span>';
    	}else if(record.service_credentials_status.value == 0){
    		html += '<td><span class="label label-warning">' + record.service_credentials_status.show + '</span>';
    	}else if(record.service_credentials_status.value == -1){
    		html += '<td><span class="label label-danger">' + record.service_credentials_status.show + '</span>';
    	}
		html += '</div>';
		html += '<div class="form-group"><label class="col-lg-5 control-label">'+ record.service_credentials_user.display +'：</label>' + record.service_credentials_user.show + '</div>';
		html += '<div class="form-group"><a class="label label-primary" href="javascript:connectionService()">使用此凭证连接主机</a></div>';
		html += '<hr style="border-bottom: 1px dashed #9e9e9e;margin-top: 25px;"/>';
	}else{
		html += '<br/><br/><div class="select-cause" id="add-credentials">当前服务无凭证信息</div>';
		html += '<br/><br/>';
	}
	return html;
}

//获取凭证新建信息
function getNewCredentials(serviceId, serviceName){
		var setting = {operateType: '获取凭证新建信息'};
	var sendData = {
		objectName: "ServiceCredentials",
		action:"getNew",
	}
	var callback = {
		success: function (data) {
			var record = data.record;
			if(record){
				newCredentials = record;
				showGetNewCredentials(record, serviceId, serviceName);
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示凭证新建表单
function showGetNewCredentials(record, serviceId, serviceName){
	var html = '';
	html += '<div id="credentials_form">';
	html += '<form class="form-horizontal" role="form"  id="credentials_sub_form">'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_name.display +'</label><div class="col-lg-5">'
		 + '<input type="text" id="service_credentials_name" name="service_credentials_name" class="form-control" placeholder="填写该服务名称"></div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_username.display +'</label><div class="col-lg-5">'
		 + '<input type="text" id="service_credentials_username" name="service_credentials_username" class="form-control" placeholder="填写该服务名称"></div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_passwd.display +'</label><div class="col-lg-5">'
		 + '<input type="text" id="service_credentials_passwd" name="service_credentials_passwd" class="form-control" placeholder="填写连接密码"></div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_type.display +'</label><div class="col-lg-5">'
		 + '<input type="text" id="service_credentials_type" name="service_credentials_type" class="form-control" placeholder="请选择凭证类型"><br />'
		 + '<button class="btn btn-default" style="float:left;" onclick="javascript:">选择类型</button></div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_status.display +'</label><div class="col-lg-5">'
		 + '<div class="radio" id="service_credentials_status">'
		 + '<label><input type="radio" name="service_credentials_status" id="service_credentials_status_0" value="0">停止</label>&nbsp;&nbsp;'
		 + '<label><input type="radio" name="service_credentials_status" id="service_credentials_status_1" value="1">正常</label>&nbsp;&nbsp;'
		 + '<label><input type="radio" name="service_credentials_status" id="service_credentials_status_-1" value="-1">报废</label>&nbsp;&nbsp;'
		 + '</div></div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_user.display +'</label><div class="col-lg-5">'
		 + '<input type="text" id="service_credentials_user1" name="service_credentials_user1" class="form-control" placeholder="添加所属用户" value="'+ record.service_credentials_user.show +'">'
		 + '<input type="text" style="display:none;" id="service_credentials_user" name="service_credentials_user" class="form-control" placeholder="添加所属用户" value="'+ record.service_credentials_user.value +'"><br />'
		 + '<a class="label label-default" style="float:left;" href="javascript:showControlMember();">选择所属用户</a></div></div>'

		 // + '<div class="form-group"><label class="col-lg-2 control-label">'+ record.service_credentials_owner.display +'</label><div class="col-lg-5">'
		 // + '<input type="text" id="service_credentials_owner" name="service_credentials_owner" class="form-control" placeholder="填写所有者名称" readonly value="'+ record.service_credentials_owner.show +'"><br/>'
		 // + '</div></div>'

		 + '<div class="form-group"><div class="col-lg-offset-2 col-lg-6">'
		 + '<button type="button" onclick="javascript:addNewCredentials(\''+ serviceId +'\');" class="btn btn-sm btn-success">提交</button>&nbsp;&nbsp;&nbsp;'
		 + '<button onclick="javascript:tek.macCommon.waitDialogHide(0,null);" type="button" class="btn btn-sm btn-default">关闭</button>'
		 + '</div></div>'
		 + '</form></div>';
	html += '<div id="member_table" style="display:none"></div>';


	var title = '新建&nbsp;'+ serviceName +'&nbsp;服务凭证信息';

	tek.macCommon.waitDialogShow(title, html , null ,2);
}

//获取所属群组信息
function showControlMember(){
	$("#member_table").show();
	if(tek.role.isAuditor(myRole)){
		$("#show_member").show();
	}
	var setting = {operateType: '获取所属群组信息'};
	var sendData = {
		objectName: "Group",
		action:"getList",
		group_type:1
	};
	var callback = {
		success: function (data) {
			var records = data.record;
			
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无管理组，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:addNewMemberGroup();">创建群组</button></font>';
				// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
				$("#member_table").html(html);
			}else{
				if(records.length){
					for(var i in records){
						if(records[i].group_type.value == 1){
							groupMemberId = records[i].id;
							getMemberList();
						}
					}
				}else{
					if(records.group_type.value == 1){
						groupMemberId = records.id;
						getMemberList();
					}
				}
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取组员列表
function getMemberList(){
	var html = '';

	var setting = {operateType: '获取群组成员信息'};
	var sendData = {
		objectName: "Member",
		action:"getList",
		order:"createTime",
		count: 10,
		group_id:groupMemberId
	};
	var callback = {
		success: function (data) {
			var records = data.record;
			
			if(!records){

				html += '<font>暂无成员，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:addMember();">添加成员</a></font>';
				$("#member_table").html(html);
				
			}else{
				//管理组内成员的弹窗列表显示
				var dialog = '';
				dialog += '<div class="widget-content"><div class="table-responsive" id="group_member">'
					   + '<table class="table table-striped table-bordered table-hover" id="host_site_member_list2">'
					   + '<thead id="member_dialog_title">'
					   + '</thead><tbody id="dialog_list">'
					   + '</tbody></table></div></div>';
				dialog += '<div class="widget-head"><hr style="margin: 2% 2% 15px;border-bottom: 2px solid #d2d2d2;"/><div class="pull-left" id="host_site_member_name"></div>'
					   // + '<div class="widget-icons pull-right"><a href="#" class="wminimize"><i class="fa fa-chevron-up"></i></a><a href="#" class="wclose"><i class="fa fa-times"></i></a></div>'
					   + '<div class="clearfix" id="host_site_member_add"></div></div>'
					   + '<div class="widget-content"><div class="table-responsive" id="host_member">'
					   + '<table class="table table-striped table-bordered table-hover" id="host_site_member_list3">'
					   + '<thead id="host_site_member_title">'
					   + '</thead><tbody id="host_site_member_list">'
					   + '</tbody></table></div><div class="widget-foot" id="host_member_foot"></div></div>';
				$("#member_table").html(dialog);
				if(records.length){
					html += '<tr>'
	             		 + '<th>#</th>'
	             		 + '<th>'+ records[0].member_name.display +'</th>'
	             		 + '<th>'+ records[0].member_status.display +'</th>'
	             		 + '<th>操作</th>'
	             		 + '</tr>';
	             		$("#member_dialog_title").html(html);
					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						showMember(count,records[i]);
					}


				}else{
					$("#member_list").html("");
					if(records.length){
						
						html += '<tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records[0].member_name.display +'</th>'
	              			 + '<th>'+ records[0].member_status.display +'</th>';
	              		
	              			 + '</tr>';
	              		$("#member_list_title").html(html);
						for(var i in records){
							var count = tek.dataUtility.stringToInt(i) + 1;
							showMember(count,records[i]);
						}
					}else{
	              		html += '<tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records.member_name.display +'</th>'
	              			 + '<th>'+ records.member_status.display +'</th>'
	              		
	              			 + '</tr>';
	              		$("#member_list_title").html(html);
						showMember(1,records);
					}
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

//首页显示组内成员
function showMember(count,record){
	var html = '';
	html += '<tr>'
		  // + '<td><span class="uni"><input type="checkbox" value="check1" /></span></td>'
		  + '<td>'+ count +'</td>'
		  + '<td>'+ record.member_name.show +'</td>'
		  + '<td>'+ record.member_status.show +'</td>';
	
	// if(num == 2){
		html += '<td>'
			 + '<a class="label label-warning" href="javascript:addServiceCredentialsUser(\''+ record.member_user.value +'\',\''+ record.member_user.show +'\');">选择</a>&nbsp;&nbsp;'
			 + '</td>';
	// }
	html += '</tr>';

		$("#dialog_list").append(html);

}

//添加服务凭证所属用户的显示
function addServiceCredentialsUser(user, show){
	$("#service_credentials_user1").attr("value",show);
	$("#service_credentials_user").attr("value",user);
	$("#member_table").hide();
}

//跳转查看当前主机的主机服务列表
function thisSiteHostServiceList(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/services/list.html?host_site_id='+hostSiteId+'&refresh-opener=1&show-close=1');
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

//跳转查看当前主机的主机规格列表
function thisSiteHostSpecificationsList(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/specifications/list.html?host_site_id='+hostSiteId+'&refresh-opener=1&show-close=1');
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

//新建主机服务凭证
function addNewCredentials(serviceId){
	var params = tek.Utils.getFromJSON(document.getElementById("credentials_sub_form"));
	// params["service_credentials_user"] = newCredentials.service_credentials_user.value;
	params["service_credentials_owner"] = newCredentials.service_credentials_owner.value;
	// console.log(params);
	var setting = {operateType: '新建该主机服务凭证'};
	var sendData = tek.Utils.mergeForObject({
		objectName: "ServiceCredentials",
		action:"addInfo",
		service_credentials_service:serviceId,
        }, params);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {

			if(data){
				tek.macCommon.waitDialogShow("", '新建主机服务凭证成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'getHostSiteService()');
				// showHostSite(data.value);
			}

			
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//删除主机服务
function deleteHostService(serviceId){
	// alert(serviceId);
	var setting = {operateType: '删除主机服务'};
	var sendData = {
		objectName: "HostService",
		action:"setInfo",
		host_service_id: serviceId,
		host_service_value: -1,
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			
			tek.macCommon.waitDialogShow(null, "删除成功", null, 0);
			getHostSiteService();
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

// //获取主机规格新建信息
// function getNewSpecifications(){
// 	var setting = {operateType: '获取主机服务新建信息'};
// 	var sendData = {
// 		objectName: "HostService",
// 		action:"getNew",
// 	}
// 	var callback = {
// 		success: function (data) {
// 			var record = data['record'];
// 			if (record) {
// 				$("#specifications_form").show();
// 			} else {
// 				$("#specifications_form").show();
// 				//提示 '记录不存在！'
// 				// tek.macCommon.waitDialogShow(null, '主机服务记录不存在');
// 			}
// 		},
// 		error: function (data, errorMsg) {
// 			$("#specifications_form").show();
// 			//显示错误信息
// 			// tek.macCommon.waitDialogShow(null, errorMsg);
// 		}
// 	}
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);


// }

//获取主机服务新建信息
// function getNewService(){
// 	var setting = {operateType: '获取主机服务新建信息'};
// 	var sendData = {
// 		objectName: "HostService",
// 		action:"getNew",
// 	}
// 	var callback = {
// 		success: function (data) {
// 			var record = data['record'];
// 			if (record) {
// 				$("#service_form").show();
// 			} else {
// 				$("#service_form").show();
// 				//提示 '记录不存在！'
// 				// tek.macCommon.waitDialogShow(null, '主机服务记录不存在');
// 			}
// 		},
// 		error: function (data, errorMsg) {
// 			$("#service_form").show();
// 			//显示错误信息
// 			// tek.macCommon.waitDialogShow(null, errorMsg);
// 		}
// 	}
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

// }

//跳转到新建主机服务页面
function goAddHostService(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/services/add.html?host_service_site='+ hostSiteId +'&host_site_name='+ hostSiteName +'&refresh-opener=1&show-close=1');
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
//跳转到新建主机规格页面
function goAddSpecifications(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/specifications/add.html?host_specifications_site='+ hostSiteId +'&host_site_name='+ hostSiteName +'&refresh-opener=1&show-close=1');
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

// //新建该主机规格
// function addNewSpecifications(){
// 	var params = tek.Utils.getFromJSON(document.getElementById("specifications_sub_form"));
// 	params["host_specifications_name"] = params["host_specifications_type"];
// 	var setting = {operateType: '新建该主机服务'};
// 	var sendData = tek.Utils.mergeForObject({
// 		objectName: "HostSpecifications",
// 		action:"addInfo",
// 		host_specifications_site:hostSiteId,
//         }, params);
// 	var callback = {
// 		beforeSend: function () {
// 			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
// 		},
// 		success: function (data) {

// 			$("#specifications_form").hide();
// 			if(data){
// 				hostScriptId = data.value;
// 				tek.macCommon.waitDialogShow("", '新建主机规格成功!',null,2);
// 				tek.macCommon.waitDialogHide(3000,'getHostSiteSpecifications()');
// 				// showHostSite(data.value);
// 			}

			
// 		},
//         error: function (data, errorMsg) {
//            	tek.macCommon.waitDialogShow(null, errorMsg);
//            	tek.macCommon.waitDialogHide(3000);
//         }
// 	}
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

// }

//新建该主机服务
// function addNewService(){
// 	var params = tek.Utils.getFromJSON(document.getElementById("service_sub_form"));
// 	params["host_service_name"] = params["host_service_type"];
// 	var setting = {operateType: '新建该主机服务'};
// 	var sendData = tek.Utils.mergeForObject({
// 		objectName: "HostService",
// 		action:"addInfo",
// 		host_service_site:hostSiteId,
//         }, params);
// 	var callback = {
// 		beforeSend: function () {
// 			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
// 		},
// 		success: function (data) {

// 			$("#service_form").hide();
// 			if(data){
// 				hostScriptId = data.value;

// 				//同步管理台主机服务信息
// 				addIpowerHostService(params);
// 				tek.macCommon.waitDialogShow("", '新建主机服务成功!',null,2);
// 				tek.macCommon.waitDialogHide(3000,'getHostSiteService()');
// 				// showHostSite(data.value);
// 			}

			
// 		},
//         error: function (data, errorMsg) {
//            	tek.macCommon.waitDialogShow(null, errorMsg);
//            	tek.macCommon.waitDialogHide(3000);
//         }
// 	}
// 	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

// }

//获取管理台当前主机信息
function getIpowerHost(){
	//登录ipower管理系统，获取登录凭证
	getIpowerMonitorLogin();

	var ajaxURL = "http://10.128.0.211/ipower/ip/api_jsonrpc.php";
	var params = '';
	params += '"output":"extend",';
	params += '"filter":{"hostid":"' + ipowerHostId + '"}';
	// params += '"templates":[{"templateid":""}]';
	// params += '"inventory_mode":0,';
	// params += '"inventory":{"macaddress_a":"","macaddress_b":""}';

	var param = "" + params;
    var request = '';
    request += '{';
    request += '"auth":"'+ ipowerAudit +'",';
    request += '"id":1,';
    request += '"jsonrpc":"2.0",';
    request += '"method":"host.get",';
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
		data:request,
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
		error: function(data){
			console.log(data);
		}
	})
}


//同步管理台主机服务信息
function addIpowerHostService(serviceData){
	//登录ipower管理系统，获取登录凭证
	getIpowerMonitorLogin();

	var ajaxURL = "http://10.128.0.211/ipower/ip/api_jsonrpc.php";
	// console.log(serviceData);
	var params = '';
	params += '"hostid":"' + ipowerHostId + '",';
	params += '"interfaces":[{';
			if(serviceData.host_service_port){
				params += '"port":"'+ serviceData.host_service_port +'",';
			}else{
				params += '"port":"10050",';
			}
			if(serviceData)
		params += '"type":1,"main":1,"useip":1,"ip":"127.0.0.1","dns":"","port":"'+ serviceData.host_service_port +'"';
	params += '}]';
	// params += '"groups":[{"groupid":"10"}]';

	var param = "" + params;
    var request = '';
    request += '{';
    request += '"auth":"'+ ipowerAudit +'",';
    request += '"id":1,';
    request += '"jsonrpc":"2.0",';
    request += '"method":"host.update",';
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
		error: function(data){
			console.log(data);
		}
	})
}

//主机信息显示
function showHostSiteInfo(record){
	var highHtml = "" + record.host_site_name.show + "&nbsp;&nbsp;&nbsp;&nbsp;的主机信息";
				
	$("#host_site_high").html(highHtml);

	var html = "";
	html += '<div class="form-group">';
	// html += '<label class="col-lg-2">'+ record.host_site_name.display +'：</label>'+ record.host_site_name.show +'</div>';
	if(record.host_site_group.value == 0){
		if(tek.role.isAuditor(myRole)){
					html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_group.display +'</label><div class="col-lg-5">暂无所属群组，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getSiteGroupList();">选择主机群组</a></div></div>';
				}else{
					html += '<font>暂无所属群组</font>'
				}
	}else{
		siteGroupId = record.host_site_group.value;
		html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_group.display +'</label><div class="col-lg-5">'+ record.host_site_group.show +'</div></div>';
	}
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_tags.display +'</label><div class="col-lg-5" id="host_site_tags"><span class="label label-success">'+ record.host_site_tags.show +'</span></div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_status.display +'</label><div class="col-lg-5" id="host_site_status">';
	if(record.host_site_status.value == 1){
		html += '<span class="label label-success">'+ record.host_site_status.show +'</span>';
	}else if(record.host_site_status.value == 0){
		html += '<span class="label label-warning">'+ record.host_site_status.show +'</span>';
	}else if(record.host_site_status.value == -1){
		html += '<span class="label label-danger">'+ record.host_site_status.show +'</span>';
	}
	html += '</div></div>';

	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_mac.display +'</label><div class="col-lg-5">'+ record.host_site_mac.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_buytime.display +'</label><div class="col-lg-5">'+ record.host_site_buytime.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_stoptime.display +'</label><div class="col-lg-5">'+ record.host_site_stoptime.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_supplier.display +'</label><div class="col-lg-5">'+ record.host_site_supplier.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_remark.display +'</label><div class="col-lg-5">'+ record.host_site_remark.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_user.display +'</label><div class="col-lg-5">'+ record.host_site_user.show +'<a class="label label-info">查看联系信息</a></div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_site_contact.display +'</label><div class="col-lg-5">'+ record.host_site_contact.show +'<a class="label label-info">查看联系信息</a></div>';
                                  
    html += '</div>';   
	html += '<div class="form-group">';
	html += '<div class="col-lg-offset-2 col-lg-12">';
	//此处需增加判断是否有主机服务，若无，则显示此按钮
	// html += '<button id="service_site" onclick="javascript:getNewService();" type="button" class="btn btn-sm btn-primary">添加该主机服务</button>&nbsp;&nbsp;&nbsp;';
	//此处需增加判断是否有主机规格，若无，则显示此按钮
	// html += '<button id="specifications_site" onclick="javascript:getNewSpecifications();" type="button" class="btn btn-sm btn-primary">添加主机规格</button>&nbsp;&nbsp;&nbsp;';
	// html += '<button type="button" class="btn btn-sm btn-primary">查看规格信息</button>';
	// html += '<a href="edit.html?host_site_id='+ hostSiteId +'" type="button" class="btn btn-sm btn-warning">编辑主机信息</a>&nbsp;&nbsp;&nbsp;';
	// html += '<a href="../../../index.html" type="button" class="btn btn-sm btn-default">返回</a>';
	html += '</div>';
	html += '</div>';    
    
    $("#host_site_form").html(html); 
                                
}

//跳转到编辑主机页面
function goEditHostSite(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/site/edit.html?host_site_id='+hostSiteId+'&refresh-opener=1&show-close=1');
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

//获取主机群组信息
function getSiteGroupList(){
	var html = "";
	var setting = {operateType: '获取主机群组信息'};
	var sendData = {
		objectName: "Group",
		action:"getList",
		group_type:0
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				//管理组内成员的弹窗列表显示
				if(tek.role.isAuditor(myRole)){
					html += '<font>暂无主机群组，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getNewSiteGroup();">新建群组</a></font>';
				}else{
					html += '<font>暂无主机群组。</font>'
				}
				tek.macCommon.waitDialogShow("", html,null,2);
			}else{
				//管理组内成员的弹窗列表显示
				var dialog = '';
				dialog += '<div class="table-responsive">'
					   + '<table class="table table-striped table-bordered table-hover" id="site_group_list">'
					   + '<thead id="site_group_title">'
					   + '</thead><tbody id="dialog_list">'
					   + '</tbody></table></div>';
				tek.macCommon.waitDialogShow('主机群组列表', dialog,null,2);
					
				if(records.length){
						
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].group_name.display +'</th>'
	              		 + '<th>'+ records[0].group_remark.display +'</th>'
	              		 + '<th>'+ records[0].group_status.display +'</th>'
	              		 + '<th>主机数量</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#site_group_title").html(html);

					for(var i in records){
						if(records[i].group_type.value == 0){
							// groupSiteId = records[i].id;
							var count = tek.dataUtility.stringToInt(i) + 1;
							showSiteGroupListInfo(count, records[i].id, records[i]);
						}
					}
				}else{
	              	html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.group_name.display +'</th>'
	              		 + '<th>'+ records.group_remark.display +'</th>'
	              		 + '<th>'+ records.group_status.display +'</th>'
	              		 + '<th>主机数量</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#site_group_title").html(html);

					if(records.group_type.value == 0){
						// groupSiteId = records.id;
						showSiteGroupListInfo(1, records.id, records);
					}
				}
			}
			
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示主机群组列表
function showSiteGroupListInfo(num, id, record){
	var html = '';

	var setting = {operateType: '获取群组信息'};
	var sendData = {
		objectName: "HostSite",
		action:"getTotal",
		host_site_group:id
	}
	var callback = {
		success: function (data) {
			var value = data.value;
			
			if(value){
				var html = '';
				html += '<tr>'
		  			+ '<td>'+ num +'</td>'
		  			+ '<td>'+ record.group_name.show +'</td>'
		  			+ '<td>'+ record.group_remark.show +'</td>';

		  			if(record.group_status.value == 1){
		 	 			html += '<td><span class="label label-success">'+ record.group_status.show +'</span></td>';
		 	 		}else if(record.group_status.value == 0){
		 	 			html += '<td><span class="label label-primary">'+ record.group_status.show +'</span></td>';
		 	 		}else{
		 	 			html += '<td><span class="label label-danger">'+ record.group_status.show +'</span></td>';
		 	 		}
		  		html += '<td>'+ value +'</td>'
		  			+ '<td><a class="label label-primary" href="javascript:addSiteGroup(\''+ id +'\',\''+ record.group_name.show +'\')">选择</a></td>'
				$("#dialog_list").append(html);
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//选择主机群组
function addSiteGroup(id, name){
	var setting = {operateType: '选择主机群组'};
	var sendData = {
		objectName: "HostSite",
		action:"setInfo",
		host_site_id:hostSiteId,
		host_site_group:id
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '选择主机群组成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'getHostSiteInfo()');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

// 获取提交表单数据（同时校验）
function getFormData() {
    var params = tek.Utils.getFromJSON(document.getElementById("site_sub_form"));

    params["host_site_buytime"] = tek.dataUtility.stringToDate(params.host_site_buytime, 'yyyy-MM-dd HH:mm').getTime();
    params["host_site_stoptime"] = tek.dataUtility.stringToDate(params.host_site_stoptime, 'yyyy-MM-dd HH:mm').getTime();
    params["host_site_user"] = myId;
    params["host_site_contact"] = myId;


    return params;
}

//获取组员信息
function getMemberInfo(){
	var html = '';
	var setting = {operateType: '获取组员信息'};
	var sendData = {
		objectName: "HostMember",
		action:"getList",
		host_member_group:siteGroupId
	}
	var callback = {
		beforeSend: function () {
			$("#user_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无成员，点此&nbsp;&nbsp;<a class="label label-primary" href="../site/add.html">添加成员</a></font>';
				$("#user_list").html(html);
			}else{
				var table = '<div class="table-responsive">'
					 + '<table class="table table-striped table-bordered table-hover" id="host_user_list">'
					 + '<thead id="user_title"></thead>'
					 + '<tbody id="user_list_info"></tbody>'
					 + '</table></div>';
				$("#user_list").html(table);
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].host_member_user.display +'</th>'
	              		 + '<th>'+ records[0].host_member_name.display +'</th>'
	              		 // + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#user_title").html(html);

					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						//显示组员信息
						showMemberInfo(count, records[i]);
					}
				}else{
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.host_member_user.display +'</th>'
	              		 + '<th>'+ records.host_member_name.display +'</th>'
	              		 // + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#user_title").html(html);
					//显示组员信息
					showMemberInfo(1, records);
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
//显示组员信息
function showMemberInfo(count, record){
	var html = '';
	html += '<tr>'
	  // + '<td><span class="uni"><input type="checkbox" value="check1" /></span></td>'
	  + '<td>'+ count +'</td>'
	  + '<td>'+ record.host_member_user.show +'</td>'
	  + '<td>'+ record.host_member_name.show +'</td>';
	// html += '<td>'
	// + '<a class="label label-primary" href="../site/read.html?user_id='+ record.id +'">查看</a>&nbsp;&nbsp;'
	// + '<a class="label label-danger" href="javascript:removeGroupSite(\''+ record.id +'\')">移除</a>'
	// + '</td>';
	html += '</tr>';
	$("#user_list_info").append(html);
}