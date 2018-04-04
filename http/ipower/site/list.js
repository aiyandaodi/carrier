
//初始化
function init() {
	//判断用户是否登录
	 if (tek.common.isLoggedIn()) {
	 	
 		//控制台数据显示
		getHostSiteList();
		
		//登录ipower管理系统，获取登录凭证
		getIpowerMonitorLogin();
	}else{
		tek.macCommon.waitDialogShow("<font color='red'>请先登录</font>", "正在跳转登录页面...", null, 0);
		tek.macCommon.waitDialogHide(1500, 'goLogin()');
	}

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
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	})
}

//获取主机列表信息
function getHostSiteList(){
	var html = '';
	var setting = {operateType: '获取主机列表信息'};
	var sendData = {
		objectName: "HostSite",
		action:"getList",
		order:"createTime",
		desc:1,
		
	}
	var callback = {
		beforeSend: function () {
			$("#host_site_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			$("#host_site_list").html("");
			var records = data.record;
			if(!records){
				html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无主机群组，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewSiteGroup();">创建群组</button></font>';
				// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
				$("#host_site_list").html(html);
			}else{
				$("#host_site_list").html("");
				// var html = "";
				// 	html += '<thead><tr>'
				//          + '<th>#</th>'
				//          + '<th>主机名称</th>'
				//          + '<th>所属群组</th>'
				//          + '<th>使用者</th>'
				//          + '<th>连接状态</th>'
				//          + '<th>操作</th>'
				//          + '</tr></thead>';
    			// $("#host_site_list").html(html);
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].host_site_name.display +'</th>'
	              		 + '<th>'+ records[0].host_site_group.display +'</th>'
	              		 + '<th>'+ records[0].createTime.display +'</th>'
	              		 + '<th>'+ records[0].host_site_tags.display +'</th>'
	              		 + '<th>'+ records[0].host_site_status.display +'</th>'
	              		 + '<th>'+ records[0].host_site_remark.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#host_site_title").html(html);
					for(var i in records){
						if(records[i].host_site_status.value != -1)
						showHostSiteInfo(i, records[i]);
					}
				}else{
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.host_site_name.display +'</th>'
	              		 + '<th>'+ records.host_site_group.display +'</th>'
	              		 + '<th>'+ records.createTime.display +'</th>'
	              		 + '<th>'+ records.host_site_tags.display +'</th>'
	              		 + '<th>'+ records.host_site_status.display +'</th>'
	              		 + '<th>'+ records.host_site_remark.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#host_site_title").html(html);
					showHostSiteInfo(0, records);
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
	if(record.host_site_status.value != -1){
		var html = "";
		num = tek.dataUtility.stringToInt(num) + 1;
	    html += '<tr><td>' + num + '</td>'
	         + '<td>' + record.host_site_name.show + '</td>'
	         + '<td>' + record.host_site_group.show + '</td>'
	         + '<td>' + record.createTime.show + '</td>'
	         + '<td><span class="label label-success">' + record.host_site_tags.show + '</span></td>';
	         // + '<td><span class="label label-success">ssh</span></td>'
	    if(record.host_site_status.value == 1)
	    	html += '<td><span class="label label-success">' + record.host_site_status.show + '</span>';
	    if(record.host_site_status.value == 0)
	    	html += '<td><span class="label label-warning">' + record.host_site_status.show + '</span>';

	    html += '<td>' + record.host_site_remark.show + '</td>'
	         + '<td><a href="../../../http/ipower/site/read.html?host_site_id=' + record.id + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i> </a>'
	         + '<a href="../../../http/ipower/site/edit.html?host_site_id=' + record.id + '" class="btn btn-xs btn-warning"><i class="fa fa-pencil"></i> </a>'
	                  +'<button onclick="javascript:deleteHostSite(\'' + record.id + '\',\''+ record.host_host_id.value +'\');" class="btn btn-xs btn-danger"><i class="fa fa-times"></i> </button></td></tr>'

	    $("#host_site_list").append(html);
	}
}

//删除主机(将主机状态改为不可用)
function deleteHostSite(siteId , ipowerHostId){
	var setting = {operateType: '删除主机'};
	var sendData = {
		objectName: "HostSite",
		action:"setInfo",
		host_site_id:siteId,
		host_site_status: -1,
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			deleteIpowerHostSite("" + ipowerHostId);
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

//删除管理台主机（将主机状态改为-1）
function deleteIpowerHostSite(ipowerHostId){
	var ajaxURL = "http://10.128.0.211/ipower/ip/api_jsonrpc.php";
	var params = '';
	params += '"hostid":"' + ipowerHostId + '",';
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