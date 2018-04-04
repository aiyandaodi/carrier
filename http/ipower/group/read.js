var siteGroupId;//主机群组ID

//初始化
function init() {
	//判断用户是否登录
	 if (tek.common.isLoggedIn()) {
	 	siteGroupId = request['group_id'];
 		//群组信息显示
		readGroupInfo();
		
	}else{
		tek.macCommon.waitDialogShow("<font color='red'>请先登录</font>", "正在跳转登录页面...", null, 0);
		tek.macCommon.waitDialogHide(1500, 'goLogin()');
	}

}

//获取群组信息
function readGroupInfo(){
	var setting = {operateType: '获取群组信息'};
	var sendData = {
		objectName: "Group",
		action:"readInfo",
		group_id:siteGroupId
	};
	var callback = {
		success: function (data) {
			var records = data.record;
			
			if(records){
				//显示群组信息
				showGroupInfo(records);
				//获取组员信息
				getMemberInfo();
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示群组信息
function showGroupInfo(record){
	var html = '';
	var setting = {operateType: '显示群组信息'};
	var sendData = {
		objectName: "HostSite",
		action:"getTotal",
		host_site_group:siteGroupId
	}
	var callback = {
		beforeSend: function () {
			$("#site_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var value = data.value;
			
			if(value){
				var highHtml = "" + record.group_name.show + "&nbsp;&nbsp;&nbsp;&nbsp;中的主机&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;主机数量：" + value;
				
				$("#host_group_high").html(highHtml);

				var table = '<div class="table-responsive">'
					 + '<table class="table table-striped table-bordered table-hover" id="host_group_list">'
					 + '<thead id="site_group_title"></thead>'
					 + '<tbody id="site_group_list"></tbody>'
					 + '</table></div><div class="widget-foot"></div>';


				$("#site_list").html(table);

				//获取当前群组中所有主机信息
				getSiteInfo();
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);


}

//获取当前群组中所有主机信息
function getSiteInfo(){
	if(tek.role.isAuditor(myRole)){
		$("#show_add_site").show();
	}
	var html = '';
	var setting = {operateType: '获取当前群组中所有主机信息'};
	var sendData = {
		objectName: "HostSite",
		action:"getList",
		host_site_group:siteGroupId
	};
	var callback = {
		beforeSend: function () {
			$("#site_group_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){

				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				if(tek.role.isAuditor(myRole)){
					html += '<font>暂无主机，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:addGroupSite();">添加主机</a></font>';
				}else{
					html += '<font>暂无主机。</font>'
				}
				$("#site_group_list").html(html);
			}else{
				$("#site_group_list").html("");
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].host_site_name.display +'</th>'
	              		 + '<th>'+ records[0].host_site_user.display +'</th>'
	              		 + '<th>'+ records[0].host_site_tags.display +'</th>'
	              		 + '<th>'+ records[0].host_site_remark.display +'</th>'
	              		 + '<th>'+ records[0].host_site_status.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#site_group_title").html(html);

					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						//显示主机信息
						showSiteInfo(1, count, records[i]);
					}
				}else{
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.host_site_name.display +'</th>'
	              		 + '<th>'+ records.host_site_user.display +'</th>'
	              		 + '<th>'+ records.host_site_tags.display +'</th>'
	              		 + '<th>'+ records.host_site_remark.display +'</th>'
	              		 + '<th>'+ records.host_site_status.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#site_group_title").html(html);
					//显示主机信息
					showSiteInfo(1, 1, records);
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

//显示主机信息
function showSiteInfo(num, count, record){
	var html = '';
	html += '<tr>'
	  // + '<td><span class="uni"><input type="checkbox" value="check1" /></span></td>'
	  + '<td>'+ count +'</td>'
	  + '<td>'+ record.host_site_name.show +'</td>'
	  + '<td>'+ record.host_site_user.show +'</td>'
	  + '<td>'+ record.host_site_tags.show +'</td>';
	if(num == 1){
	  html += '<td>'+ record.host_site_remark.show +'</td>';
	}
	if(record.host_site_status.value == 1){
	  	html += '<td><span class="label label-success">'+ record.host_site_status.show +'</span></td>';
	  }else if(record.user_status.value == 0){
	  	html += '<td><span class="label label-primary">'+ record.host_site_status.show +'</span></td>';
	  }else{
	  	html += '<td><span class="label label-danger">'+ record.host_site_status.show +'</span></td>';
	  }
	if(num == 1){
		  html += '<td>'
		  + '<a class="label label-primary" href="../site/read.html?host_site_id='+ record.id +'">查看</a>&nbsp;&nbsp;'
		  + '<a class="label label-danger" href="javascript:removeGroupSite(\''+ record.id +'\')">移除</a>'
		  + '</td>';
		$("#site_group_list").append(html);
	}else{
		html += '<td>'
		  + '<a class="label label-primary" href="javascript:setGroupSite(\''+ record.id +'\')">添加</a>&nbsp;&nbsp;'
		  + '</td>';
		$("#site_dialog_title").append(html);
	}
}

//移除主机群组内的主机
function removeGroupSite(id){
	var setting = {operateType: '移除主机群组内的主机'};
	var sendData = {
		objectName: "HostSite",
		action:"setInfo",
		host_site_id:id,
		host_site_group:0
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '移除主机成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'readGroupInfo()');
			}
		},
       	error: function (data, errorMsg) {
          	tek.macCommon.waitDialogShow(null, errorMsg);
          	tek.macCommon.waitDialogHide(3000);
       	}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取主机列表-弹窗显示
function addGroupSite(){
	var html = '';
	var setting = {operateType: '获取主机列表'};
	var sendData = {
		objectName: "HostSite",
		action:"getList",
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无主机，点此&nbsp;&nbsp;<a class="label label-primary" href="../site/add.html">新建主机</a></font>';
				tek.macCommon.waitDialogShow("", html,null,2);
			}else{
					//主机列表弹窗显示
					var dialog = '';
					dialog += '<div class="table-responsive">'
						   + '<table class="table table-striped table-bordered table-hover" id="host_site_list">'
						   + '<thead id="site_dialog_title">'
						   + '</thead><tbody id="dialog_list">'
						   + '</tbody></table></div>';
					tek.macCommon.waitDialogShow('添加主机', dialog,null,2);
					if(records.length){
						html += '<tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records[0].host_site_name.display +'</th>'
	              			 + '<th>'+ records[0].host_site_user.display +'</th>'
	              			 + '<th>'+ records[0].host_site_tags.display +'</th>'
	              			 + '<th>'+ records[0].host_site_status.display +'</th>'
	              			 + '<th>操作</th>'
	              			 + '</tr>';
	              		$("#site_dialog_title").html(html);
						for(var i in records){
							var count = tek.dataUtility.stringToInt(i) + 1;
							showSiteInfo(2, count, records[i]);
						}
					}else{
						html += '<tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records.host_site_name.display +'</th>'
	              			 + '<th>'+ records.host_site_user.display +'</th>'
	              			 + '<th>'+ records.host_site_tags.display +'</th>'
	              			 + '<th>'+ records.host_site_status.display +'</th>'
	              			 + '<th>操作</th>'
	              			 + '</tr>';
	              		$("#site_dialog_title").html(html);
						showSiteInfo(2, 1, records);
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

//群组添加主机
function setGroupSite(id){
	var setting = {operateType: '主机群组添加主机'};
	var sendData = {
		objectName: "HostSite",
		action:"setInfo",
		host_site_id:id,
		host_site_group:siteGroupId
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '添加主机成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'readGroupInfo()');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
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
			$("#member_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无成员，点此&nbsp;&nbsp;<a class="label label-primary" href="../site/add.html">添加成员</a></font>';
				$("#member_list").html(html);
			}else{
				var table = '<div class="table-responsive">'
					 + '<table class="table table-striped table-bordered table-hover" id="host_group_list">'
					 + '<thead id="member_title"></thead>'
					 + '<tbody id="member_list_info"></tbody>'
					 + '</table></div><div class="widget-foot"></div>';
				$("#member_list").html(table);
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].host_member_user.display +'</th>'
	              		 + '<th>'+ records[0].host_member_name.display +'</th>'
	              		 // + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#member_title").html(html);

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
	              	$("#member_title").html(html);
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
	$("#member_list_info").append(html);
}