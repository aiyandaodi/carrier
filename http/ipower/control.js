var groupMemberId = "";//组员群组ID
var groupSiteId = "";//主机群组ID

var order; // 排序字段
var desc; // 排序方式

var COUNT = 5; //每页查询数量
var SKIP = 0; //页面已经跳过的数量
var TOTAL = 0; //总数

var isContinueLoad = true;		//是否可以继续

var searchs; // 快速检索域，数组
var searchFormIndex = 1; //指明检索的输入表单
var quickSearch = ""; //快速检索

// var highSiteCount = 0;//管理员可操作主机数量，用于控制台顶部栏显示
var highMemberSiteCount = 0;//成员可操作主机数量，用于控制台顶部栏显示
// var highGroupCount = 0;//管理员可操作主机群组数量，用于控制台顶部栏显示
var highMemberGroupGount = 0;//成员可操作主机群组数量，用于控制台顶部栏显示
var groupCount = 0;//主机群组的列表递增数
var siteCount = 0;//主机的列表递增数

//初始化
function init() {
	//判断用户是否登录
	if (tek.common.isLoggedIn()) {
	 	
 		//控制台数据显示
		setControllerInfo();
		//登录ipower管理系统，获取登录凭证
		getIpowerMonitorLogin();
		//获取当前机器IP地址
		getYourIP();
		// 读取Transaction的列表信息
		readListInfo();


	}else{
		tek.macCommon.waitDialogShow("<font color='red'>请先登录</font>", "正在跳转登录页面...", null, 0);
		tek.macCommon.waitDialogHide(1500, 'goLogin()');
	}

}



//控制台数据显示
function setControllerInfo(){

	// if(tek.role.isAuditor(myRole)){
	// 	//显示主机信息
	// 	setHostSiteInfo();
	// 	//显示主机群组信息
	// 	showControlSite(1);
	// }else{

	//显示主机群组信息
	showRightControlSite();


	// }

	//显示任务信息
	setHostTask();
	//显示工作信息
	setHostWork();
	//显示脚本信息
	setHostScript();
	//显示群组成员信息
	showControlMember(1);

	//控制台顶部栏信息显示
	showHigherInfo();
}

//控制台顶部栏信息显示
function showHigherInfo(){
	// showMessages();
	// showHighUser();
	// showHighSite();
	// showHighGroup();
	// showHighWork();


	// function showHighSite(){
	// 	if(highSite != 0){
	// 		$("#index_site").html(highSite);
	// 	}else if(highMemberSite != 0){
	// 		$("#index_site").html(highMemberSite);
	// 	}else{
	// 		$("#index_site").html(0);
	// 	}
	// }

}



//获取任务信息
function setHostTask(){
	var html = '';
	var setting = {operateType: '获取任务信息'};
	var sendData = {
		objectName: "HostTask",
		action:"getList",
		count: 10,
		order: "createTime",
		desc: 1,
	}
	var callback = {
		beforeSend: function () {
			$("#host_task_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无任务，点此&nbsp;&nbsp;<a class="btn btn-xs btn-primary" href="task/add.html">创建任务</a></font>';
				// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
				$("#host_task_list").html(html);
			}else{
				html = "";
				


    			$("#host_task_list").html(html);
				if(records.length){
					html += '<thead><tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records[0].host_task_name.display +'</th>'
	              			 + '<th>'+ records[0].host_task_remark.display +'</th>'
	              			 + '<th>'+ records[0].host_task_status.display +'</th>'
	              			 + '<th>'+ records[0].host_task_time.display +'</th>'
	              			 + '<th>操作</th>'
	              			 + '</tr></thead>';

    				$("#host_task_list").html(html);
					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						showHostTaskInfo(count, records[i]);
					}
				}else{
					html += '<thead><tr>'
	              		 + '<th>#</th>'
	              			 + '<th>'+ records.host_task_name.display +'</th>'
	              			 + '<th>'+ records.host_task_remark.display +'</th>'
	              			 + '<th>'+ records.host_task_status.display +'</th>'
	              			 + '<th>'+ records.host_task_time.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr></thead>';
    				$("#host_task_list").html(html);
					showHostTaskInfo(1, records);
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

//显示任务信息
function showHostTaskInfo(num, record){
	var html = "";
	taskTime = (record.host_task_time.value).split(";");
    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.host_task_name.show + '</td>'
         + '<td>' + record.host_task_remark.show + '</td>';
    if(record.host_task_status.value == 1){
        html += '<td><span class="label label-success">'+ record.host_task_status.show +'</span></td>';
    }else if(record.host_task_status.value == 0){
        html += '<td><span class="label label-warning">'+ record.host_task_status.show +'</span></td>';
    }else{
        html += '<td><span class="label label-danger">'+ record.host_task_status.show +'</span></td>';
    }
    if(record.host_task_time.value == "0"){
		html += '<td>' + '暂无&nbsp;&nbsp;' + '</td>';
	}else if(record.host_task_time.value == "1"){
		html += '<td>'+'执行一次&nbsp;&nbsp;'+'</td>';
	}else{
		if(taskTime[0] == "11"){
			html += '<td>'+'每天&nbsp;&nbsp;' + taskTime[1].split(" ")[1]+'</td>';
		}else if(taskTime[0] == "12"){
			html += '<td>'+'每周&nbsp;' + tek.dataUtility.stringToDate(taskTime[1], 'yyyy-MM-dd HH:mm').getDay()+ '&nbsp;&nbsp;'+ taskTime[1].split(" ")[1]+'</td>';
		}else if(taskTime[0] == "14"){
			html += '<td>'+'每月&nbsp;&nbsp;' + tek.dataUtility.stringToDate(taskTime[1], 'yyyy-MM-dd HH:mm').getDate()+ '号&nbsp;&nbsp;' + taskTime[1].split(" ")[1]+'</td>';
		}else if(taskTime[0] == "18"){
			var month = tek.dataUtility.stringToInt(tek.dataUtility.stringToDate(taskTime[1], 'yyyy-MM-dd HH:mm').getMonth()) + 1;
			html += '<td>'+'每年&nbsp;&nbsp;' + month + '月&nbsp;&nbsp;' + tek.dataUtility.stringToDate(taskTime[1], 'yyyy-MM-dd HH:mm').getDate()+ '号&nbsp;&nbsp;' + taskTime[1].split(" ")[1]+'</td>';
		}
	}
 
    html += '<td><a href="../ipower/task/read.html?host_task_id=' + record.id + '" class="label label-primary">查看</a></td></tr>';
    $("#host_task_list").append(html);
}

//获取工作信息
function setHostWork(){
	var html = '';
	var setting = {operateType: '获取工作信息'};
	var sendData = {
		objectName: "HostWork",
		action:"getList",
		count: 4,
		order: "createTime",
		desc: 1
	}
	var callback = {
		beforeSend: function () {
			$("#host_work_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无工作</font>';
				// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
				$("#host_work_list").html(html);
			}else{
				html = "";
    			$("#host_work_list").html(html);
				if(records.length){
					//控制台顶部显示工作数量
					// $("#index_work").html(records.length);
						html += '<thead><tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records[0].host_work_name.display +'</th>'
	              			 + '<th>'+ records[0].host_work_type.display +'</th>'
	              			 + '<th>'+ '状态' +'</th>'
	              			 + '<th>'+ records[0].host_work_owner.display +'</th>'
	              			 + '<th>操作</th>'
	              			 + '</tr></thead>';
	              		$("#host_work_list").html(html);	 
					for(var i in records){
    					// $("#host_work_list").html(html);
						var count = tek.dataUtility.stringToInt(i) + 1;
						showHostWorkInfo(count, records[i]);
					}
				}else{
					//控制台顶部显示工作数量
					$("#index_work").html(1);
					html += '<thead><tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.host_work_name.display +'</th>'
	              		 + '<th>'+ records.host_work_type.display +'</th>'
	              		 + '<th>'+ '状态' +'</th>'
	              		 + '<th>'+ records.host_work_owner.display +'</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr></thead>';
    				$("#host_work_list").html(html);
					showHostWorkInfo(1, records);
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

//显示工作列表信息
function showHostWorkInfo(num, record){
	var html = "";

    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.host_work_name.show + '</td>';
 	if(record.host_work_type.value == 1){
        html += '<td><span class="label label-success">'+ record.host_work_type.show +'</span></td>';
    }else if(record.host_work_type.value == 0){
        html += '<td><span class="label label-info">'+ record.host_work_type.show +'</span></td>';
    }
    if(record.host_work_status.value == 1){
        html += '<td><span class="label label-success">'+ record.host_work_status.show +'</span></td>';
    }else if(record.host_work_status.value == 0){
        html += '<td><span class="label label-default">'+ record.host_work_status.show +'</span></td>';
    }else{
        html += '<td><span class="label label-warning">'+ record.host_work_status.show +'</span></td>';
    }
    html += '<td>' + record.host_work_owner.show + '</td>';
    html += '<td><a href="../ipower/work/read.html?host_work_id=' + record.id + '" class="label label-primary">查看</a></td></tr>';

    $("#host_work_list").append(html);
}

//显示普通组员主机群组信息
function showRightControlSite(){
	if(tek.role.isAuditor(myRole)){
		$("#show_site_1").show();
		$("#show_site_group").show();
	}
	var html = '';
// $("#host_member")
	var setting = {operateType: '查看成员可操作的主机群组权限'};
	var sendData = {
		objectName: "HostMember",
		action:"getList",
		host_member_user:myId,
	}
	var callback = {
		beforeSend: function () {
			$("#site_group_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
			$("#host_site_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;

			if(!records){
				html = '&nbsp;&nbsp;';
				html += '<font>暂无可操作主机群组。</font>';
				$("#site_group_list").html(html);

				var html2 = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html2 += '<font>暂无主机</font>';
				$("#host_site_list").html(html2);
				$("#show_site_1").hide();
			}else{
				$("#site_group_list").html("");
				//显示可操作主机群组
				if(records.length){
					highMemberGroupGount = records.length;
					//控制台顶部群组数量显示
					$("#index_group").html(highMemberGroupGount);
					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						showRightHostMember(count, records[i].host_member_group.value);		

						var siteHtml = '<thead><tr>'
			    			 + '<th>#</th>'
			    			 + '<th>主机名称</th>'
			    			 + '<th>所属群组</th>'
			    			 + '<th>使用者</th>'
			    			 + '<th>连接状态</th>'
			    			 + '<th>操作</th>'
			    			 + '</tr></thead>';
    					$("#host_site_list").html(siteHtml);
						setRightHostSiteInfo(records[i].host_member_group.value);
					}
				}else{
					highMemberGroupGount = 1;
					//控制台顶部群组数量显示
					$("#index_group").html(highMemberGroupGount);
					showRightHostMember(1, records.host_member_group.value);
					setRightHostSiteInfo(records.host_member_group.value);
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

//显示普通组员可操作的主机
function setRightHostSiteInfo(groupId){
	var html = '';
	var setting = {operateType: '显示普通组员可操作的主机'};
	var sendData = {
		objectName: "HostSite",
		action:"getList",
		host_site_group:groupId,
		count: 10,
	}
	var callback = {
		// beforeSend: function () {
		// 	$("#host_site_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		// },
		success: function (data) {
			var records = data.record;
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无主机</font>';
				// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
				$("#host_site_list").html(html);
			}else{
				html = "";
				if(records.length){
					for(var i in records){
						showHostSiteInfo(i, records[i]);
					}
				}else{
					showHostSiteInfo(1, records);
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

//显示普通组员可操作主机群组
function showRightHostMember(num, id){
	var html = "";
	var setting = {operateType: '显示普通组员可操作主机群组'};
	var sendData = {
		objectName: "Group",
		action:"readInfo",
		group_id:id
	};
	var callback = {
		beforeSend: function () {
			$("#site_group_title").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				//管理组内成员的弹窗列表显示
				// html += '<font>暂无主机群组，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getNewSiteGroup();">新建群组</a></font>';
				// tek.macCommon.waitDialogShow("", html,null,2);
			}else{
				//管理组内成员的弹窗列表显示
				// var dialog = '';
				// dialog += '<div class="table-responsive">'
				// 	   + '<table class="table table-striped table-bordered table-hover" id="site_group_list">'
				// 	   + '<thead id="site_group_title">'
				// 	   + '</thead><tbody id="dialog_list">'
				// 	   + '</tbody></table></div>';
				// tek.macCommon.waitDialogShow('主机群组列表', dialog,null,2);
					
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
							// var count = tek.dataUtility.stringToInt(i) + 1;
							showHostMemberRightList(records[i].id, records[i]);
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
						showHostMemberRightList(records.id, records);
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

//显示普通组员可操作主机群组信息
function showHostMemberRightList(id, record){
	var html = '';

	var setting = {operateType: '显示普通组员可操作主机群组信息'};
	var sendData = {
		objectName: "HostSite",
		action:"getTotal",
		host_site_group:id
	}
	var callback = {
		success: function (data) {
			groupCount = groupCount + 1;
			var value = data.value;
			highMemberSiteCount = highMemberSiteCount + tek.dataUtility.stringToInt(value);
			//控制台顶部栏主机数量显示
			$("#index_site").html(highMemberSiteCount);
			// alert(highMemberSite);
			if(value){
				var html = '';
				html += '<tr>'
		  			+ '<td>'+ groupCount +'</td>'
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
		  			 + '<td><a class="label label-primary" href="group/read.html?group_id='+ id +'">查看</a></td>';
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

//获取脚本信息
function setHostScript(){
	var html = '';
	var setting = {operateType: '获取脚本列表信息'};
	var sendData = {
		objectName: "HostScript",
		action:"getList",
		count: 10,
	}
	var callback = {
		beforeSend: function () {
			$("#host_script_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无脚本，点此&nbsp;&nbsp;<a class="btn btn-xs btn-primary" href="script/add.html">创建脚本</a></font>';
				// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
				$("#host_script_list").html(html);
			}else{
				html = "";
					html += '<thead><tr>'
				         + '<th>#</th>'
				         + '<th>脚本名称</th>'
				         + '<th>所属管理组</th>'
				         // + '<th>脚本标签</th>'
				         // + '<th>脚本颜色</th>'
				         + '<th>脚本适用的服务</th>'
				         + '<th>脚本状态</th>'
				         + '<th>操作</th>'
				         + '</tr></thead>';
    			$("#host_script_list").html(html);
				if(records.length){
					for(var i in records){
						showHostScriptInfo(i, records[i]);
					}
				}else{
					showHostScriptInfo(1, records);
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

//主机脚本信息显示
function showHostScriptInfo(num, record){
	var html = "";

	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.host_script_name.show + '</td>'
         + '<td>' + record.host_script_group.show + '</td>'
         + '<td id="host_script_services_'+ num +'"></td>'
 	if(record.host_script_status.value == 1){
        html += '<td><span class="label label-success">'+ record.host_script_status.show +'</span></td>';
    }else if(record.host_script_status.value == 0){
        html += '<td><span class="label label-warning">'+ record.host_script_status.show +'</span></td>';
    }else{
        html += '<td><span class="label label-danger">'+ record.host_script_status.show +'</span></td>';
    }
    html += '<td><a href="../ipower/script/read.html?host_script_id=' + record.id + '" class="label label-primary">查看</a></td></tr>';

    $("#host_script_list").append(html);

	var services = tek.dataUtility.stringToArray(record.host_script_services.show, ";");
	for(var i in services){
		getHostServiceType(services[i], num);
	}
}

//获取脚本适用于的服务类型
function getHostServiceType(id, num){
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
				$("#host_script_services_"+ num).append(records.dictionary_name.show + "&nbsp;&nbsp;&nbsp;&nbsp;");
			}
		},
        error: function (data, errorMsg) {
           	// tek.macCommon.waitDialogShow(null, errorMsg);
           	// tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取主机信息
function setHostSiteInfo(){
	if(tek.role.isAuditor(myRole)){
		$("#show_site_1").show();
		// $("#show_site_2").show;
	}
	var html = '';
	var setting = {operateType: '获取主机列表信息'};
	var sendData = {
		objectName: "HostSite",
		action:"getList",
		count: 10,
	}
	var callback = {
		beforeSend: function () {
			$("#host_site_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无主机，点此&nbsp;&nbsp;<a class="btn btn-xs btn-primary" href="site/add.html">创建主机</a></font>';
				// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
				$("#host_site_list").html(html);
			}else{
				html = "";
					html += '<thead><tr>'
				         + '<th>#</th>'
				         + '<th>主机名称</th>'
				         + '<th>所属群组</th>'
				         + '<th>使用者</th>'
				         + '<th>连接状态</th>'
				         + '<th>操作</th>'
				         + '</tr></thead>';
    			$("#host_site_list").html(html);
				if(records.length){
					for(var i in records){
						showHostSiteInfo(i, records[i]);
					}
				}else{
					showHostSiteInfo(1, records);
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
	siteCount = siteCount + 1;
	var html = "";

	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + siteCount + '</td>'
         + '<td>' + record.host_site_name.show + '</td>'
         + '<td>' + record.host_site_group.show + '</td>'
         + '<td>' + record.host_site_user.show + '</td>';
    if(record.host_site_status.value == 1){
        html += '<td><span class="label label-success">'+ record.host_site_status.show +'</span></td>';
    }else if(record.host_site_status.value == 0){
        html += '<td><span class="label label-warning">'+ record.host_site_status.show +'</span></td>';
    }else{
        html += '<td><span class="label label-danger">'+ record.host_site_status.show +'</span></td>';
    }
         html += '<td><a href="site/read.html?host_site_id=' + record.id + '" class="label label-primary">查看</a></td></tr>';

    $("#host_site_list").append(html);

}

//弹窗显示组内成员与操作
function showControlMember(num){
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
		beforeSend: function () {
			if(num == 1){
				$("#member_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
			}else{
				tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
			}
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<font>暂无管理组，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:addNewMemberGroup();">创建管理组</button></font>';
				// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
				$("#member_list").html(html);
				$("#show_member").hide();
				$("#show_member_control").hide();
			}else{
				if(records.length){
					for(var i in records){
						if(records[i].group_type.value == 1){
							groupMemberId = records[i].id;
							getMember(num);
						}
					}
				}else{
					if(records.group_type.value == 1){
						groupMemberId = records.id;
						getMember(num);
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

//创建管理群组
function addNewMemberGroup(){
	var setting = {operateType: '新建管理群组'};
	var sendData = {
		objectName: "Group",
		action:"addInfo",
		group_name:myName,
		group_status:1,
		group_remark:"控制台成员组",
		group_owner:myId,
		group_type:1,
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '创建成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'showControlMember(1)');
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

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
		success: function (data) {
			var record = data.record;
			if(record){
				html += '<form class="form-horizontal" role="form" id="site_group_form"><div class="form-group">'
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
	var remark = $("#group_remark").val()
	var setting = {operateType: '新建主机群组'};
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
		success: function (data) {
			
			if(data){
				//新建主机群组成员权限
				addHostMember(data.value);
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

//新建主机群组成员权限
function addHostMember(groupId){
	groupId = groupId.substring(9);
	// console.log(groupId);
	var setting = {operateType: '新建主机群组成员权限'};
	var sendData = {
		objectName: "HostMember",
		action:"addInfo",
		host_member_right:2,
		host_member_group:groupId,
		host_member_user:myId,
		host_member_name:"群组所有者"
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '创建成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'showControlSite(1)');
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//查看成员可操作的主机群组权限
function selectHostMember(id, name){
	var html = '';
// $("#host_member")
	var setting = {operateType: '查看成员可操作的主机群组权限'};
	var sendData = {
		objectName: "HostMember",
		action:"getList",
		host_member_user:id,
	}
	var callback = {
		beforeSend: function () {
			$("#host_site_member_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			html = '&nbsp;&nbsp;'
				 // + '<a class="label label-primary" href="javascript:setHostMember('+ id +');">添加主机群组</a>';
				 + '<font style="font-size:12px;">可操作群组列表</font>';
			$("#host_site_member_add").html(html);
			
			$("#host_site_member_name").html('<h4>'+ name + "</h4>");
			if(!records){
				html = '&nbsp;&nbsp;';
				html += '<font>暂无可操作主机群组，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getSiteGroupList(\''+ id +'\');">添加主机群组</a></font>';
				$("#host_site_member_title").html("");
				$("#host_site_member_list").html(html);
			}else{
				$("#host_site_member_list").html("");
				//显示可操作主机群组
				if(records.length){
					$("#host_member_foot").html('<p><a class="label label-primary" href="javascript:getSiteGroupList(\''+ id +'\');">添加主机群组</a></p>');
					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						showHostMember(count, records[i].host_member_group.value);
					}
				}else{
					$("#host_member_foot").html('<p><a style="margin-left:500px;border-bottom:10px;" class="label label-primary" href="javascript:getSiteGroupList(\''+ id +'\');">添加主机群组</a></p>');
					showHostMember(1, records.host_member_group.value);
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

//显示可操作主机群组
function showHostMember(num, id){
	var html = "";
	var setting = {operateType: '显示可操作主机群组'};
	var sendData = {
		objectName: "Group",
		action:"readInfo",
		group_id:id
	};
	var callback = {
		beforeSend: function () {
			$("#host_site_member_title").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				//管理组内成员的弹窗列表显示
				// html += '<font>暂无主机群组，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getNewSiteGroup();">新建群组</a></font>';
				// tek.macCommon.waitDialogShow("", html,null,2);
			}else{
				//管理组内成员的弹窗列表显示
				// var dialog = '';
				// dialog += '<div class="table-responsive">'
				// 	   + '<table class="table table-striped table-bordered table-hover" id="site_group_list">'
				// 	   + '<thead id="site_group_title">'
				// 	   + '</thead><tbody id="dialog_list">'
				// 	   + '</tbody></table></div>';
				// tek.macCommon.waitDialogShow('主机群组列表', dialog,null,2);
					
				if(records.length){
						
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].group_name.display +'</th>'
	              		 + '<th>'+ records[0].group_remark.display +'</th>'
	              		 + '<th>'+ records[0].group_status.display +'</th>'
	              		 + '<th>主机数量</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#host_site_member_title").html(html);

					for(var i in records){
						if(records[i].group_type.value == 0){
							showHostMemberList(num, records[i].id, records[i]);
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
	              	$("#host_site_member_title").html(html);

					if(records.group_type.value == 0){
						// groupSiteId = records.id;
						showHostMemberList(num, records.id, records);
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

//显示可操作主机群组信息
function showHostMemberList(num, id, record){
	var html = '';

	var setting = {operateType: '显示可操作主机群组信息'};
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
		  		html += '<td>'+ value +'</td>';
		  		html += '<td><a class="label label-primary" href="group/read.html?group_id='+ record.id +'">查看</a></td>';
				$("#host_site_member_list").append(html);
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//获取主机群组列表
function getSiteGroupList(groupUserId){
	var html = "";
	var setting = {operateType: '获取主机群组信息'};
	var sendData = {
		objectName: "Group",
		action:"getList",
		group_type:0
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				//管理组内成员的弹窗列表显示
				html += '<font>暂无主机群组，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getNewSiteGroup();">新建群组</a></font>';
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
							showSiteGroupListInfo(groupUserId, count, records[i].id, records[i]);
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
						showSiteGroupListInfo(groupUserId, 1, records.id, records);
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
function showSiteGroupListInfo(groupUserId, num, id, record){
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
		  			+ '<td><a class="label label-primary" href="javascript:addHostMemberSiteGroup(\''+ id +'\',\''+ groupUserId +'\')">选择</a></td>'
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

//组员添加主机群组权限
function addHostMemberSiteGroup(groupId, groupUserId){
	var setting = {operateType: '组员添加主机群组权限'};
	var sendData = {
		objectName: "HostMember",
		action:"addInfo",
		host_member_right:2,
		host_member_group:groupId,
		host_member_user:groupUserId,
		host_member_name:"群组管理者"
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '添加成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'showControlMember(2)');
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
	if(tek.role.isAuditor(myRole)){
		$("#show_site_group").show();
		// $("#show_site_2").show;
	}
	var html = "";
	var setting = {operateType: '获取主机群组信息'};
	var sendData = {
		objectName: "Group",
		action:"getList",
		group_type:0,
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
				$("#show_site_control").hide();
			}else{
				$("#site_group_list").html("");
				if(records.length){

					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].group_name.display +'</th>'
	              		 // + '<th>'+ records[0].group_remark.display +'</th>'
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
					highGroupCount = 1;
					//控制台顶部显示群组数量
					$("#index_group").html(highGroupCount);
	              	html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.group_name.display +'</th>'
	              		 // + '<th>'+ records.group_remark.display +'</th>'
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

	var setting = {operateType: '显示主机群组列表'};
	var sendData = {
		objectName: "HostSite",
		action:"getTotal",
		host_site_group:id
	}
	var callback = {
		success: function (data) {
			var value = data.value;
			// alert(highSite);

			if(value){
				var html = '';
				html += '<tr>'
		  			+ '<td>'+ num +'</td>'
		  			+ '<td>'+ record.group_name.show +'</td>';
		  			// + '<td>'+ record.group_remark.show +'</td>';

		  			if(record.group_status.value == 1){
		 	 			html += '<td><span class="label label-success">'+ record.group_status.show +'</span></td>';
		 	 		}else if(record.group_status.value == 0){
		 	 			html += '<td><span class="label label-primary">'+ record.group_status.show +'</span></td>';
		 	 		}else{
		 	 			html += '<td><span class="label label-danger">'+ record.group_status.show +'</span></td>';
		 	 		}
		  		html += '<td>'+ value +'</td>'
		  			+ '<td><a class="label label-primary" href="group/read.html?group_id='+ id +'">查看</a></td>'
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

//查看组内成员和添加成员按钮
function getMember(num){
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
				if(num == 1){
					html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
					html += '<font>暂无成员，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:addMember();">添加成员</a></font>';
					// html += '<font>暂无其成员，点此&nbsp;&nbsp;<button class="btn btn-xs btn-primary" onclick="javascript:getNewNumber();">添加成员</button></font>';
					$("#member_list").html(html);
				}else if(num == 2){
					//管理组内成员的弹窗列表显示
					html += '<font>暂无成员，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:addMember();">添加成员</a></font>';
					tek.macCommon.waitDialogShow("", html,null,2);
				}
				
			}else{
				if(num == 2){
					// console.log(num);
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
					tek.macCommon.waitDialogShow('管理组内成员<button class="btn btn-sm btn-success" style="float:right;" onclick="javascript:addMember();">添加成员</button>', dialog,null,2);
					if(records.length){
						html += '<tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records[0].member_name.display +'</th>'
	              			 + '<th>'+ records[0].member_status.display +'</th>'
	              			 + '<th>'+ records[0].member_email.display +'</th>'
	              			 + '<th>'+ records[0].member_mobile.display +'</th>'
	              			 + '<th>操作</th>'
	              			 + '</tr>';
	              		$("#member_dialog_title").html(html);
						for(var i in records){
							var count = tek.dataUtility.stringToInt(i) + 1;
							showMember(count, num, records[i]);
						}
					}else{
						html += '<tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records.member_name.display +'</th>'
	              			 + '<th>'+ records.member_status.display +'</th>'
	              			 + '<th>'+ records.member_email.display +'</th>'
	              			 + '<th>'+ records.member_mobile.display +'</th>'
	              			 + '<th>操作</th>'
	              			 + '</tr>';
	              		$("#member_dialog_title").html(html);
						showMember(1, num, records);
					}

				}else{
					$("#member_list").html("");
					if(records.length){
						
						html += '<tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records[0].member_name.display +'</th>'
	              			 + '<th>'+ records[0].member_status.display +'</th>'
	              		// if(tek.role.isAuditor(myRole))
	              		// 	html += '<th>'+ records[0].member_email.display +'</th>';
	              		// if(tek.role.isAuditor(myRole))
	              		// 	html += '<th>'+ records[0].member_mobile.display +'</th>';
	              			 + '</tr>';
	              		$("#member_list_title").html(html);
						for(var i in records){
							var count = tek.dataUtility.stringToInt(i) + 1;
							showMember(count, num, records[i]);
						}
					}else{
	              		html += '<tr>'
	              			 + '<th>#</th>'
	              			 + '<th>'+ records.member_name.display +'</th>'
	              			 + '<th>'+ records.member_status.display +'</th>'
	              		// if(tek.role.isAuditor(myRole))
	              		// 	 + '<th>'+ records.member_email.display +'</th>'
	              		// if(tek.role.isAuditor(myRole))
	              		// 	 + '<th>'+ records.member_mobile.display +'</th>'
	              			 + '</tr>';
	              		$("#member_list_title").html(html);
						showMember(1, num, records);
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
function showMember(count, num, record){
	var html = '';
	html += '<tr>'
		  // + '<td><span class="uni"><input type="checkbox" value="check1" /></span></td>'
		  + '<td>'+ count +'</td>'
		  + '<td>'+ record.member_name.show +'</td>'
		  + '<td>'+ record.member_status.show +'</td>';
	if(tek.role.isAuditor(myRole)){
		if(num == 2){
			if(record.member_email.show != ""){
				html += '<td>'+ record.member_email.show +'&nbsp;&nbsp;';
					html += '<a class="label label-success" href="javascript:setMember(1,\''+ record.id +'\',\''+ record.member_name.show +'\');">修改</a>';
				html += '</td>';
			}else{
				html += '<td><a class="label label-primary" href="javascript:setMember(1,\''+ record.id +'\',\''+ record.member_name.show +'\');">添加邮箱</a></td>';
			}
		}
	}
	
	if(tek.role.isAuditor(myRole)){
		if(num == 2){
			if(record.member_mobile.show != ""){
				html += '<td>'+ record.member_mobile.show +'&nbsp;&nbsp;';
					html += '<a class="label label-success" href="javascript:setMember(2,\''+ record.id +'\',\''+ record.member_name.show +'\');">修改</a>';
				html += '</td>';
			}else{
				html += '<td><a class="label label-primary" href="javascript:setMember(2,\''+ record.id +'\',\''+ record.member_name.show +'\');">添加电话</a></td>';
			}
		}
	}
	if(num == 2){
		html += '<td>'
			 + '<a class="label label-warning" href="javascript:selectHostMember(\''+ record.member_user.value +'\',\''+ record.member_user.show +'\');">权限</a>&nbsp;&nbsp;'
			 + '<a class="label label-danger" href="javascript:removeMember(\''+ record.id +'\');">删除</a>'
			 + '</td>';
	}
	html += '</tr>';
	if(num == 1){
		$("#member_list").append(html);
	}else{
		$("#dialog_list").append(html);
	}
}

//删除组内成员
function removeMember(id){
	var setting = {operateType: '删除组内成员'};
	var sendData = {
		objectName: "Member",
		action:"removeInfo",
		member_id:id
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				var title = "";
				tek.macCommon.waitDialogShow(title, '移除成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'getMember(1)');
			}
			
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//设置成员的邮箱
function setMember(num, id, name){
	var html = '';
	var title = '';
	if(num == 1){
		html += '<div class="form-group">'
			 + '<label class="col-lg-3 control-label">邮箱</label>'
			 + '<div class="col-lg-5"><input type="text" class="form-control col-lg-8" id="member_email" name="member_email" placeholder="请填写邮箱" /></div>'
			 + '<button type="button" onclick="javascript:setMemberInfo(1,\''+ id +'\');" class="btn btn-sm btn-success left">提交</button>';
		html += '</div>';

		title = '设置&nbsp;&nbsp;'+ name +'&nbsp;&nbsp;邮箱';
	}else{
		html += '<div class="form-group">'
		 	 + '<label class="col-lg-3 control-label">电话</label>'
		 	 + '<div class="col-lg-5"><input type="text" class="form-control col-lg-8" id="member_mobile" name="member_mobile" placeholder="请填写电话" /></div>'
		 	 + '<button type="button" onclick="javascript:setMemberInfo(2,\''+ id +'\');" class="btn btn-sm btn-success left">提交</button>';
		html += '</div>';

		title = '设置&nbsp;&nbsp;'+ name +'&nbsp;&nbsp;电话';
	}
	
	tek.macCommon.waitDialogShow(title, html, null , 0);

}

//添加成员信息
function setMemberInfo(num, id){
	var info = "";

	var setting = {operateType: '添加成员信息'};
	var sendData;
	if(num == 1){
		info = $("#member_email").val();
		// console.log(info);
		if(!tek.dataUtility.isCertificateEmail(info)){
			tek.macCommon.waitDialogShow("", '<font style="color:red;">邮箱格式错误，</font>&nbsp;&nbsp请&nbsp;&nbsp;<a style="font-size:15px;" href="javascript:setMember('+ num +','+ id +');">重新输入</a>',null,2);
			return null;
		}else{
			sendData = {
				objectName: "Member",
				action: "setInfo",
				member_email: info,
				member_id: id
			}
		}
	}else{
		info = $("#member_mobile").val();
		sendData = {
			objectName: "Member",
			action: "setInfo",
			member_mobile: info,
			member_id: id
		}
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				var title = "";
				tek.macCommon.waitDialogShow(title, '更新成员信息成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'getMember(1)');
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//获取可添加的成员信息
function addMember(){
	//获取新建群组成员信息
	getNewMember();
}

//获取新建群组成员信息
function getNewMember(){
	var setting = {operateType: '获取新建群组成员信息'};
	var sendData = {
		objectName: "Member",
		action:"getNew",
	}
	var callback = {
		success: function (data) {
			var records = data.record;

		//显示添加成员的弹窗
		getUserList();
			
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//获取用户列表
function getUserList(){
	var html = "";
	var setting = {operateType: '获取用户列表'};
	var sendData = {
		objectName: "User",
		action:"getList",
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			html += '<div class="table-responsive">'
		 		 + '<table class="table table-striped table-bordered table-hover">'
		 		 + '<thead id="user_list_title"></thead>';

			html += '<tbody style="text-align:left;" id="user_list"></tbody>';
			html += '</table></div>';
			var title = '添加小组成员';
			tek.macCommon.waitDialogShow(title, html, null , 0);
			

			if(records.length){
				html += '<tr>'
					 // + '<th><span class="uni"><input type="checkbox" value="check1" /></span></th>'
					 + '<th>#</th>'
					 + '<th>'+ records[0].user_name.display +'</th>'
		 		 	 + '<th>'+ records[0].user_login.display +'</th>'
		 		 	 + '<th>'+ records[0].user_role.display +'</th>'
		 		 	 + '<th>'+ records[0].user_status.display +'</th>'
		 		 	 + '<th>操作<th>'
		 		 	 + '</tr>';
		 		 $("#user_list_title").html(html);
				for(var i in records){
					var num = tek.dataUtility.stringToInt(i) + 1;
					showUserList(num, records[i]);
				}
			}else{
				html += '<tr>'
					 // + '<th><span class="uni"><input type="checkbox" value="check1" /></span></th>'
					 + '<th>#</th>'
					 + '<th>'+ records.user_name.display +'</th>'

		 		 	 + '<th>'+ records.user_login.display +'</th>'
		 		 	 + '<th>'+ records.user_role.display +'</th>'
		 		 	 + '<th>'+ records.user_status.display +'</th>'
		 		 	 + '<th>操作<th>'
		 		 	 + '</tr>';
		 		 $("#user_list_title").html(html);
				showUserList(1, records);
			}

		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	
}

//显示添加成员的弹窗
function showUserList(num, record){
	var html = '';
		html += '<tr>'
		 	 // + '<td><span class="uni"><input type="checkbox" value="check1" /></span></td>'
		 	 + '<td>'+ num +'</td>'
		 	 + '<td>'+ record.user_name.show +'</td>'
		 	 + '<td>'+ record.user_login.show +'</td>'
		 	 + '<td>'+ record.user_role.show +'</td>';
		 	 if(record.user_status.value == 1){
		 	 	html += '<td><span class="label label-success">'+ record.user_status.show +'</span></td>';
		 	 }else if(record.user_status.value == 0){
		 	 	html += '<td><span class="label label-primary">'+ record.user_status.show +'</span></td>';
		 	 }else{
		 	 	html += '<td><span class="label label-danger">'+ record.user_status.show +'</span></td>';
		 	 }
		html += '<td>'
		 	 + '<a class="label label-primary" href="javascript:addNewMember(\''+ record.user_name.value +'\',\''+ record.id +'\');">添加</a>'
		 	 + '</td>'
		 	 + '</tr>';

	$("#user_list").append(html);

}

//添加小组成员
function addNewMember(name, id){
	var setting = {operateType: '添加小组成员'};
	var sendData = {
		objectName: "Member",
		action:"addInfo",
		member_member_right:2,
		member_name:name,
		member_status:1,
		member_subject_right:32,
		member_user:id,
		group_id:groupMemberId,

	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '添加成员成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'getMember(1)');
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}
//---------------------------------------------读取并显示Transaction--------------------------------------------
// 读取Transaction的列表信息
function readListInfo() {
	if (isContinueLoad) {
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
	} else {
		return;
	}

	order = order || "transaction_latestTime";
	desc = (desc == 0 || desc == 1) ? desc : 0;
	//快速查询
	//quickSearch = (searchFormIndex == 1) ? $("nav input[name='searchText']").val() : $("#start_box input[name='searchText']").val();\
    quickSearch = $("#search_text").val();

	var setting = {operateType: "获取问答列表"};
	var sendData = {
		objectName: "Transaction",
		action: "getList",
		indexPage: 1, //说明是索引页面
		count: COUNT,
		skip: SKIP,
		order: order,
		desc: 1,
		'quick-search': encodeURIComponent(quickSearch || "")
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...</div>";
			$("#ajax_load_div").removeClass("hide").html(html);
		},
		success: function (data) {
			TOTAL = parseInt(data.value);

			var records = data["record"];
			if (records) {
				records = !records.length ? [records] : records;
				// 显示信息
				showRecordsInfo(records);
			} else {
				$("#slist").html("没有数据记录");
			}
		},
		error: function (data, errorMsg) {
			$("#ajax_load_div").html(errorMsg).removeClass("hide");
		},
		complete: function () {
			$("#ajax_load_div").addClass("hide");

			$("#transaction_page").html(tek.turnPage.getPagination(SKIP, COUNT, TOTAL));

			if (SKIP + COUNT >= TOTAL) {
				$("#next_page").addClass("hide");
				isContinueLoad = false;
			} else {
				$("#next_page").removeClass("hide");
				isContinueLoad = true;
			}

			/*/ 如果是检索
			if (tek.type.isEmpty(quickSearch)) {
				if (searchFormIndex == 1) {
					$("nav #searchForm button[type='submit']").removeClass("hide");
					$("nav #searchForm button[type='button']").addClass("hide");
				} else {
					$("#start_box #searchForm button[type='submit']").removeClass("hide");
					$("#start_box #searchForm button[type='button']").addClass("hide");
				}
			} else {
				if (searchFormIndex == 1) {
					$("nav #searchForm button[type='submit']").addClass("hide");
					$("nav #searchForm button[type='button']").removeClass("hide");
				} else {
					$("#start_box #searchForm button[type='submit']").addClass("hide");
					$("#start_box #searchForm button[type='button']").removeClass("hide");
				}
			}*/
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示信息
function showRecordsInfo(records) {
	if (!tek.type.isArray(records)) return;

	var elem = document.getElementById("slist");
	for (var i in records)
		showTransactionCard(records[i], elem, quickSearch);

	//刷新瀑布流显示
	// flowFlushDisplay();
}

// 快速查询
function quickSearchFormSubmit(index) {
	SKIP = 0;

	isContinueLoad = true;

	//searchFormIndex = parseInt(index);

	$("#slist").html("");

	readListInfo();
}

// 检索提问（没有检索到想要问答）
function searchAskQuestion() {
	var searchText = $("#searchText").val();
	if (tek.type.isEmpty(searchText)) {
		$("#searchForm button[type='submit']").removeClass("hide");
		$("#searchForm button[type='button']").addClass("hide");
		return;
	}

	var url = tek.common.getRelativePath() + "http/tekinfo/transaction/add.html?transaction_type=0x10&transaction_name=" + searchText;
	window.open(url, "_blank");
}

//------------------------------------------------------通用函数（适用于本js文件）-------------------------------
//快速检索字段凸显过滤函数
// checkRecordIteam：被检查的record字段对象；searchRecordItemArray：检索record字段数组；keyword：检索关键字
function quickSearchKeywordFilter(checkRecordItem, searchRecordItemArray, keyword) {
	if (!searchRecordItemArray || toString.apply(searchRecordItemArray) !== "[object Array]" || !keyword || keyword == "undefined")
		return checkRecordItem.show;

	for (var i = 0; i < searchRecordItemArray.length; i++) {
		if (checkRecordItem.name == searchRecordItemArray[i]) {
			var reg = new RegExp(keyword, "gi");
			var replaceText = "<font color='#F00'>" + keyword + "</font>";
			return checkRecordItem.show.replace(reg, replaceText);
		}
	}
	return checkRecordItem.show;
}
//--------------------------card way----------------
// 以卡片方式显示
function showTransactionCard(record, target, searchKeyword) {
	if (!tek.type.isObject(record) || tek.type.isEmpty(target))
		return;

	var li = '';
	li += '<li>'
	   + '<a target="_blank" href="../tekinfo/transaction/read.html?transaction_id=' + (record.id || "") + '">'+ quickSearchKeywordFilter(record.transaction_name, searchs, searchKeyword) +'</a>'
	   + '<p>"'+ (!!record.transaction_summary ? record.transaction_summary.show : "") +'"</p>'
	   + '</li>';

	var html = "<div class='flow-item-box'>"
			//<!--标题-->
		+ "<span class='title btn-group box-title'>"
		+ "<a target='_blank' href='../tekinfo/transaction/read.html?transaction_id=" + (record.id || "") + "'>"
		+ quickSearchKeywordFilter(record.transaction_name, searchs, searchKeyword)
		+ "</a>"
		+ "</span>";

	//<!--发布者头像-->
	var ownerValue = "";
	var ownerShow = "";
	if (record.transaction_owner) {
		ownerValue = record.transaction_owner.value;
		ownerShow = record.transaction_owner.show;
	}
	html += "<span class='img-circle box-owner-icon'>"
		+ "<a target='_blank' href='" + tek.common.getRootPath() + "http/tekinfo/user/read.html?user_id=" + ownerValue + "' title='" + ownerShow + "'>"
		+ "<img class='img-circle' id='owner_icon_" + (record.id || "") + "' width='100%' height='100%' src='' alt='' >"
		+ "</a>"
		+ "</span>"

		+ "<div class='box-owner-stype'>"
			//<!--发布者-->
		+ "<div class='box-owner'>" + ownerShow + "</div>"

			//<!--类型-->
		+ "<div class='box-type'><i class='fa fa-bookmark'></i>"
		+ (!!record.transaction_type ? quickSearchKeywordFilter(record.transaction_type, searchs, searchKeyword) : "")
		+ "</div>"

		+ "</div>" // end .box-owner-stype

			//<!--标签-->
		+ "<div class='box-tags'><i class='fa fa-tag' title='标签'></i>";
	if (record.transaction_tags) {
		var subjectTags = quickSearchKeywordFilter(record.subject_tags, searchs, searchKeyword);
		if (subjectTags) {
			var array = subjectTags.split(";");
			for (var i = 0; i < array.length; i++) {
				if (array[i]) {
					if (isTagSelected(array[i])) {
						html += "<span class='tag-selected'>" + array[i] + "</span>";
					} else {
						html += "<span onclick='selectTag(this.innerHTML);'>" + array[i] + "</span>";
					}
				}
			} //end for(var i = 0;i < array.length;i++)
		} //end if(subjectTags)
	} //end if(record.subject_tags)
	html += "</div>"

		//<!--概要-->
	+ "<div class='box-summary'>" + (!!record.transaction_summary ? record.transaction_summary.show : "") + "</div>"

		//<!--图片-->
	+ "<div class='box-image'>"
		//if (xxx)
		//	+"<img id='xxx' src='#' width='100%'>");
	+ "</div>"

	+ "<div class='box-foot'>"
		//<!--访问数-->
	+ "<span class='scattered-info' title='访问数'><i class='fa fa-eye'></i>"
	+ ((record.accessCount && record.accessCount.show) ? record.accessCount.show : "0")
	+ "</span>"

		//<!--解答数-->
	+ "<span class='scattered-info' title='"
	+ ((record.transaction_type.value < 0x70) ? "解答数" : "处理数")
	+ "'><i class='fa fa-comments'></i>"
	+ ((record.transaction_answerCount && record.transaction_answerCount.show) ? record.transaction_answerCount.show : "0")
	+ "</span>"

		//<!--评级-->
	+ "<span class='scattered-info' title='平均评价'><i class='fa fa-star'></i>"
	+ ((record.transaction_evaluate && record.transaction_evaluate.show) ? record.transaction_evaluate.show : "0.0")
	+ "</span>"

		//<!--时间-->
	+ "<span class='box-time'>";
	if (record.transaction_end && record.transaction_end.show) {
		html += timeCalculate(record.transaction_end.value) + "前 结束";
	} else if (record.transaction_latestTime && record.transaction_latestTime.show) {
		html += timeCalculate(record.transaction_latestTime.value) + "前 更新";
	} else if (record.transaction_start && record.transaction_start.show) {
		html += timeCalculate(record.transaction_start.value) + "前 创建";
	}
	html += "</span>"

		+ "</div>" //end .box-foot

		+ "</div>"; //end flow-item-box

	//插入HTML文本
	target.insertAdjacentHTML('BeforeEnd', li);

	//获取发布者的头像
	// getTransactionOwnerIcon(record.id, ownerValue, ownerShow);
}

// 获取发布者的头像
function getTransactionOwnerIcon(transactionId, userId, userName) {
	var setting = {operateType: "获取发布者头像"};
	var sendData = {
		objectName: "User",
		action: "getIcon",
		user_id: userId
	};
	var callback = {
		success: function (data) {
			if (!tek.type.isEmpty(data.value))
				$("#owner_icon_" + transactionId).attr('src', data.value);
		},
		error: function (data, errorMsg) {
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 新建问答
function addTransaction() {
	window.open(tek.common.getRootPath() + "http/tekinfo/transaction/add.html?show-close=1&refresh-opener=1&refresh-opener-func=refreshTransaction", '_blank');
}