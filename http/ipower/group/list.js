
//初始化
function init() {
	//判断用户是否登录
	 if (tek.common.isLoggedIn()) {
	 	
 		//主机群组列表显示
		showControlSite();

	}else{
		tek.macCommon.waitDialogShow("<font color='red'>请先登录</font>", "正在跳转登录页面...", null, 0);
		tek.macCommon.waitDialogHide(1500, 'goLogin()');
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
		beforeSend: function () {
			html = "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>";
			tek.macCommon.waitDialogShow(title, html, null , 0);
		},
		success: function (data) {
			var record = data.record;
			if(record){
				html = '<form class="form-horizontal" role="form" id="site_group_form"><div class="form-group">'
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
	var remark = $("#group_remark").val();
	var setting = {operateType: '新建管理群组'};
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
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			
			if(data){
				
				tek.macCommon.waitDialogShow("", '创建成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'showControlSite(1)');
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

//显示主机群组信息
function showControlSite(num){
	var html = "";
	var setting = {operateType: '获取主机群组信息'};
	var sendData = {
		objectName: "Group",
		action:"getList",
		group_type:0
	};
	var callback = {
		beforeSend: function () {
			$("#site_group_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无主机群组，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewSiteGroup();">创建群组</button></font>';
				// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
				$("#site_group_list").html(html);
			}else{
				$("#site_group_list").html("");
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
							showSiteGroupInfo(count, records[i].id, records[i]);
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
						showSiteGroupInfo(1, records.id, records);
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
function showSiteGroupInfo(num, id, record){
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
		  			 + '<td><a href="read.html?group_id=' + record.id + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i> </a>'
	                 + '<button onclick="javascript:deleteSiteGroup(\'' + record.id + '\','+ value +');" class="btn btn-xs btn-danger"><i class="fa fa-times"></i> </button></td>';
				$("#site_group_list").append(html);
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//删除群组
function deleteSiteGroup(id, total){
	console.log(total);
	if(total != 0){
		tek.macCommon.waitDialogShow("", '请删除群组内主机后再删除群组!',null,2);
	}else{
		var setting = {operateType: '移除主机群组内的主机'};
		var sendData = {
			objectName: "Group",
			action:"removeInfo",
			group_id:id
		};
		var callback = {
			beforeSend: function () {
				tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
			},
			success: function (data) {
				if(data){
					tek.macCommon.waitDialogShow("", '删除成功!',null,2);
					tek.macCommon.waitDialogHide(3000,'showControlSite()');
				}
			},
        	error: function (data, errorMsg) {
            	tek.macCommon.waitDialogShow(null, errorMsg);
            	tek.macCommon.waitDialogHide(3000);
        	}
		};
		tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	}
	
}