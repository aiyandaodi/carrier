var hostServiceId;//服务ID
var hostServiceName;//服务名称
var hostSiteName;//主机名称

function init(){

if (tek.common.isLoggedIn()) {
		hostServiceId = request['host_service_id'];
		//获取服务信息
        getHostServiceInfo();

    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
}

//获取有关此服务类型的脚本列表
function getHostScriptService(type){
	var html = '';
	var setting = {operateType: '获取有关此服务类型的脚本列表'};
	var sendData = {
		objectName: "HostScript",
		action:"getList",
		host_script_services:type
	}
	var callback = {
		beforeSend: function () {
			$("#script_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无该服务脚本，点此&nbsp;&nbsp;<a class="label label-primary" href="../script/add.html?host_script_services='+ type +'">创建脚本</a></font>';
				$("#script_list").html(html);
			}else{
				var table = '<div class="table-responsive">'
					 + '<table class="table table-striped table-bordered table-hover" id="host_group_list">'
					 + '<thead id="script_title"></thead>'
					 + '<tbody id="script_list_info"></tbody>'
					 + '</table></div><div class="widget-foot"></div>';
				$("#script_list").html(table);
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].host_script_name.display +'</th>'
	              		 + '<th>'+ records[0].host_script_remark.display +'</th>'
	              		 + '<th>'+ records[0].host_script_tag.display +'</th>'
	              		 // + '<th>'+ records[0].service_credentials_username.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#script_title").html(html);

					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						//显示有关此服务的脚本信息
						showHostScriptService(count, records[i]);
					}
				}else{
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.host_script_name.display +'</th>'
	              		 + '<th>'+ records.host_script_remark.display +'</th>'
	              		 + '<th>'+ records.host_script_tag.display +'</th>'
	              		 // + '<th>'+ records.service_credentials_username.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#script_title").html(html);
					//显示有关此服务的脚本信息
					showHostScriptService(1, records);
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

//显示有关此服务的脚本信息
function showHostScriptService(count, record){
	var html = '';
	html += '<tr>'
	  // + '<td><span class="uni"><input type="checkbox" value="check1" /></span></td>'
	  + '<td>'+ count +'</td>'
	  + '<td>'+ record.host_script_name.show +'</td>'
	  + '<td>'+ record.host_script_remark.show +'</td>'
	  + '<td>'+ record.host_script_tag.show +'</td>';

	html += '<td>'
	+ '<a class="label label-primary" href="../script/read.html?host_script_id='+ record.id +'">查看</a>&nbsp;&nbsp;'
	// + '<a class="label label-danger" href="javascript:removeGroupSite(\''+ record.id +'\')">移除</a>'
	+ '</td>';
	html += '</tr>';
	$("#script_list_info").append(html);
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

// 获取服务信息
function getHostServiceInfo(){
	var setting = {operateType: '获取服务信息'};
	var sendData = {
		objectName: "HostService",
		action:"readInfo",
		host_service_id:hostServiceId,
	};
	var callback = {
		beforeSend: function () {
			$("#host_service_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var record = data['record'];
			if (record) {

				if(tek.role.isAuditor(myRole)){
					$("#show_edit_service").show();
					$("#show_add_script").show();
					$("#show_add_credentials").show();
				}
				hostSiteName = record.host_service_site.show;
				hostServiceName = record.host_service_name.show;
				$("#host_service_high").html('<a href="../site/read.html?host_site_id=' + record.host_service_site.value + '">'+ hostSiteName + '</a>&nbsp;&nbsp;&nbsp;&nbsp;'+ hostServiceName + '&nbsp;&nbsp;');
				//服务信息显示
				showHostServiceInfo(record);
				//服务凭证信息显示
				getServiceCredentialsInfo();

        		//获取有关此服务类型的脚本列表
        		getHostScriptService(record.host_service_type.value);
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

//服务信息显示
function showHostServiceInfo(record){

	var html = "";
	html += '<div class="form-group">';
	html += '<label class="col-lg-2 control-label">服务名称</label><div class="col-lg-5">'+ record.host_service_name.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">该服务端口</label><div class="col-lg-5">'+ record.host_service_port.show +'</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">关联主机</label><div class="col-lg-5">'+ record.host_service_site.show +'&nbsp;&nbsp;<a href="../site/read.html?host_site_id=' + record.host_service_site.value + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i></a></div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">状态</label><div class="col-lg-5" id="host_site_status">';
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
	html += '</div></div>';
	html += '<div class="form-group"><label class="col-lg-2 control-label">创建时间</label><div class="col-lg-5" id="createTime"><span class="label label-success">'+ record.createTime.show +'</span></div></div>';

	// html += '<div class="form-group"><label class="col-lg-2 control-label">凭证信息</label><div class="col-lg-5"><a class="label label-default" style="float:left;" href="javascript:showControlMember();">点击查看</a></div></div>';

	html += '<div class="form-group"><label class="col-lg-2 control-label">'+ record.host_service_remark.display +'</label><div class="col-lg-5">'+ record.host_service_remark.show +'</div>';
                                  
    html += '</div>';   
	html += '<div class="form-group">';
	html += '<div class="col-lg-offset-2 col-lg-6">';

	// html += '<button type="button" class="btn btn-sm btn-primary">查看规格信息</button>';
	// html += '<a href="edit.html?host_service_id='+ hostServiceId +'" type="button" class="btn btn-sm btn-warning">编辑脚本信息</a>&nbsp;&nbsp;&nbsp;';
	// html += '<a href="../../../index.html" type="button" class="btn btn-sm btn-default">返回</a>';
	html += '</div>';
	html += '</div>';    
    
    $("#host_service_form").html(html); 
    if(record.host_script_color){
    	var color = (record.host_script_color.show).split(",");
    	for(var i in color){
    		console.log(color[i]);
    		$("#host_script_color_"+color[i]).attr("checked","checked");
    	}
    }

                                
}

//跳转到编辑服务页面
function goEditHostService(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/service/edit.html?host_service_id='+hostServiceId+'&refresh-opener=1&show-close=1');
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

//获取凭证信息
function getServiceCredentialsInfo(){
	var html = '';
	var setting = {operateType: '获取凭证信息'};
	var sendData = {
		objectName: "ServiceCredentials",
		action:"getList",
		service_credentials_service:hostServiceId
	}
	var callback = {
		beforeSend: function () {
			$("#member_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无可使用凭证，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getNewCredentials();">添加凭证</a></font>';
				$("#member_list").html(html);
			}else{
				var table = '<div class="table-responsive">'
					 + '<table class="table table-striped table-bordered table-hover" id="host_credentials_list">'
					 + '<thead id="member_title"></thead>'
					 + '<tbody id="member_list_info"></tbody>'
					 + '</table></div><div class="widget-foot"></div>';
				$("#member_list").html(table);
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].service_credentials_name.display +'</th>'
	              		 + '<th>'+ records[0].service_credentials_status.display +'</th>'
	              		 + '<th>'+ records[0].service_credentials_type.display +'</th>'
	              		 // + '<th>'+ records[0].service_credentials_username.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#member_title").html(html);

					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						//显示凭证信息
						getServiceCredentialsType(count, records[i]);
					}
				}else{
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.service_credentials_name.display +'</th>'
	              		 + '<th>'+ records.service_credentials_status.display +'</th>'
	              		 + '<th>'+ records.service_credentials_type.display +'</th>'
	              		 // + '<th>'+ records.service_credentials_username.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#member_title").html(html);
					//显示凭证信息
					getServiceCredentialsType(1, records);
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

//显示凭证信息
function showServiceCredentialsInfo(count, record, type){
	var html = '';
	html += '<tr>'
	  // + '<td><span class="uni"><input type="checkbox" value="check1" /></span></td>'
	  + '<td>'+ count +'</td>'
	  + '<td>'+ record.service_credentials_name.show +'</td>';
	if(record.service_credentials_status.value == 1){
    	html += '<td><span class="label label-success">' + record.service_credentials_status.show + '</span></td>';
    }else if(record.service_credentials_status.value == 0){
    	html += '<td><span class="label label-warning">' + record.service_credentials_status.show + '</span></td>';
    }else if(record.service_credentials_status.value == -1){
    	html += '<td><span class="label label-danger">' + record.service_credentials_status.show + '</span></td>';
    }
	html += '<td>'+ type +'</td>';
	html += '<td>'
	+ '<a class="label label-primary" href="javascript:readServiceCredentialsInfo(\''+ record.service_credentials_username.show +'\',\''+ record.service_credentials_passwd.show +'\')">查看</a>&nbsp;&nbsp;'
	// + '<a class="label label-danger" href="javascript:removeGroupSite(\''+ record.id +'\')">移除</a>'
	+ '</td>';
	html += '</tr>';
	$("#member_list_info").append(html);
}

//获取对象字典中的凭证类型
function getServiceCredentialsType(count, record){
	var type = record.service_credentials_type.value;
	var setting = {operateType: '获取对象字典中的主机标签'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"readInfo",
		dictionary_id:type,
	}
	var callback = {
		success: function (data) {
			var records = data.record;
			type = records.dictionary_name.show;
			showServiceCredentialsInfo(count, record, type);
		},
        error: function (data, errorMsg) {

			showServiceCredentialsInfo(count, record, "");
           	// tek.macCommon.waitDialogShow(null, errorMsg);
           	// tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showServiceType(num,record){
		var html = '';
		html += '<label>'
			 + '<input type="radio" name="service_credentials_type" id="service_credentials_type_'+ num +'" value="'+ record.id +'">'
			 + record.name
			 + '</label>&nbsp;&nbsp;';
			 $("#service_credentials_type").append(html);
	}

}


//弹窗显示服务凭证信息
function readServiceCredentialsInfo(username, pwd){
	var html = "";
		// html += '<div class="form-group"><label class="col-lg-5 control-label">'+ record.service_credentials_name.display +'：</label>' + record.service_credentials_name.show + '</div>';
		html += '<div class="form-group"><label class="control-label">用户名：</label>' + username + '</div>';
		html += '<div class="form-group"><label class="control-label">保密字：</label>' + pwd + '</div>';
		
		// html += '<div class="form-group"><label class="col-lg-5 control-label">'+ record.service_credentials_user.display +'：</label>' + record.service_credentials_user.show + '</div>';
		html += '<div class="form-group"><a class="label label-primary" href="javascript:window.open(\'http://10.128.0.211:8080/#/\', \'_blank\');">使用此凭证连接主机</a></div>';
		// html += '<div class="form-group"><a class="label label-primary" href="javascript:connectionService()">使用此凭证连接主机</a></div>';
		html += '<hr style="border-bottom: 1px dashed #9e9e9e;margin-top: 25px;"/>';
	var title =  hostSiteName + '&nbsp;&nbsp;&nbsp;'+ hostServiceName +'&nbsp;&nbsp;&nbsp;服务凭证详情<br/>&nbsp;&nbsp;&nbsp;';
								// + '<button style="float:right;" onclick="javascript:getNewCredentials(\''+ hostS +'\','+ serviceName +');" class="btn btn-xs btn-primary">新建凭证</button>';
	tek.macCommon.waitDialogShow(title, html, null , 0);
}

//获取凭证新建信息
function getNewCredentials(){
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
				showGetNewCredentials(record, hostServiceId, hostServiceName);
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取对象字典中的凭证类型
function getServiceType(){
	var setting = {operateType: '获取对象字典中的主机标签'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"getList",
		dictionary_targetObject: "ServiceCredentials",
		dictionary_targetFields: "service_credentials_type"
	}
	var callback = {
		success: function (data) {
			var records = data.record;
			if(records){
				$("#service_credentials_type").html("");
				if(records.length){
					for(var i in records){
						showServiceType(i,records[i]);
					}
				}else{
					showServiceType(0,records);
				}

				// var addTagsBtn = '';
				// addTagsBtn += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='add_tags_btn' href='javascript:addHostSiteTags();' class='label label-warning'>添加标签</a>";
				// addTagsBtn +=  '<div class="col-lg-5 input-group" id="add_host_site_tags" style="display:none;">'
				// 			   + '<input type="text" class="form-control" placeholder="标签名"/>'
    //                            + '<span class="input-group-btn">'
    //                            + '<a class="btn btn-color" onclick="javascript:addHostSiteTagsInfo();" title="提交"><i class="fa fa-check"></i></a>'
    //                            + '<a class="btn btn-color" onclick="javascript:addHostSiteTags();" title="放弃"><i class="fa fa-remove"></i></a>'
    //                            + '</span>'
    //                            + '</div>';
				// $("#host_site_tags").append(addTagsBtn);
				
			}else{
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '凭证标签不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showServiceType(num,record){
		var html = '';
		html += '<label>'
			 + '<input type="radio" name="service_credentials_type" id="service_credentials_type_'+ num +'" value="'+ record.id +'">'
			 + record.name
			 + '</label>&nbsp;&nbsp;';
			 $("#service_credentials_type").append(html);
	}

}


//显示凭证新建表单
function showGetNewCredentials(record, serviceId, serviceName){
	var html = '';
	html += '<div id="credentials_form">';
	html += '<form class="form-horizontal" role="form"  id="credentials_sub_form">'

		 // + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_type.display +'</label><div class="col-lg-5">'
		 // + '<input type="text" style="display:none;" id="service_credentials_type" name="service_credentials_type" class="form-control" placeholder="请选择凭证类型">'
		 // + '<input type="text" id="service_credentials_type1" name="service_credentials_type1" class="form-control" placeholder="请选择凭证类型">'
		 // + '<a class="label label-default" style="float:left;" href="javascript:getCredentialsTypeList();">选择凭证类型"</a></div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_type.display +'</label><div class="col-lg-5">'
		 + '<div class="radio" id="service_credentials_type" name="service_credentials_type"></div>'
		 // + '<div style="display:none;" class="radio" id="service_credentials_type" name="service_credentials_type"></div>'
		 + '</div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_name.display +'</label><div class="col-lg-5">'
		 + '<input type="text" id="service_credentials_name" name="service_credentials_name" class="form-control" placeholder="填写该服务名称"></div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_username.display +'</label><div class="col-lg-5">'
		 + '<input type="text" id="service_credentials_username" name="service_credentials_username" class="form-control" placeholder="填写该服务名称"></div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_passwd.display +'</label><div class="col-lg-5">'
		 + '<input type="text" id="service_credentials_passwd" name="service_credentials_passwd" class="form-control" placeholder="填写连接密码"></div></div>'


		 + '<div class="form-group" style="display:none;"><label class="col-lg-4 control-label">'+ record.service_credentials_status.display +'</label><div class="col-lg-5">'
		 + '<div class="radio" id="service_credentials_status">'
		 + '<label><input type="radio" name="service_credentials_status" id="service_credentials_status_0" value="0">停止</label>&nbsp;&nbsp;'
		 + '<label><input type="radio" name="service_credentials_status" id="service_credentials_status_1" value="1" checked>正常</label>&nbsp;&nbsp;'
		 + '<label><input type="radio" name="service_credentials_status" id="service_credentials_status_-1" value="-1">报废</label>&nbsp;&nbsp;'
		 + '</div></div></div>'

		 + '<div class="form-group"><label class="col-lg-4 control-label">'+ record.service_credentials_user.display +'</label><div class="col-lg-5">'
		 + '<input type="text" id="service_credentials_user1" name="service_credentials_user1" class="form-control" placeholder="添加所属用户" value="'+ record.service_credentials_user.show +'">'
		 + '<input type="text" style="display:none;" id="service_credentials_user" name="service_credentials_user" class="form-control" placeholder="添加所属用户" value="'+ record.service_credentials_user.value +'">'
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


	var title = '新建&nbsp;'+ hostServiceName +'&nbsp;服务凭证信息';

	tek.macCommon.waitDialogShow(title, html , null ,2);

	getServiceType();
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

//新建主机服务凭证
function addNewCredentials(serviceId){
	var params = tek.Utils.getFromJSON(document.getElementById("credentials_sub_form"));
	console.log(params);
	params["service_credentials_"] = newCredentials.service_credentials_user.value;
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
				tek.macCommon.waitDialogHide(3000,'getServiceCredentialsInfo()');
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

