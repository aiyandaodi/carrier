var site_type_network = 0;//网络设备主机数
var site_type_computer = 0;//计算机设备主机数
var site_type_intellgent = 0;//智能设备主机数
var work_success = 0;//工作运行成功数	
var work_error = 0;//工作运行失败数
var host_site_stop = 0;//可用状态：禁止运行主机数
var host_site_apply = 0;//可用状态：不可用主机数（报废）
var host_site_valid = 0;//可用状态：可用主机数
var host_site_runstatus_stop = 0;//运行状态：停止
var host_site_runstatus_apply = 0;//运行状态：禁用
var host_site_runstatus_valid = 0;//运行状态：运行正常
var hostSiteTotel = 0;//设备总数量
var siteMember = 0;//组员总数量

var groupCount = 0;//主机群组的列表递增数
var siteCount = 0;//主机的列表递增数

var groupMemberId = "";//组员群组ID

var workSuccess = [];//工作成功的数组
var workError = [];//工作失败的数组

function init(){
	tek.common.getUser();
	showUser();
	

	//判断用户是否登录
	if (tek.common.isLoggedIn()) {
	 	//控制台数据显示
		setCarrierInfo();

	}else{
	    tek.macCommon.waitDialogShow("<font color='red'>请先登录</font>", "正在跳转登录页面...", null, 0);
	    tek.macCommon.waitDialogHide(1500, 'goLogin()');
	}



}

//控制台数据显示
function setCarrierInfo(){
	showApplyTaskTotal();
	showStopTaskTotal();
	showValidTaskTotal();
	getTransaction("apply");
	getTransaction("stop");
	getTransaction("release");
	getCurrentDate();
	//事件紧急程度显示 参数为 id、status
	showEventTotal("event-status-normal",0);
	showEventTotal("event-status-serious",1);
	showEventTotal("event-status-warning",2);

	//获取不同类型的设备数量与百分比
	getSiteTotalList();

	//获取组员总数
	getControlMemberTotal();
	//获取群组
	showRightControlSite();

	//获取工作近期成功失败折线图
	getHostWorkList();
}

/**
 * 即将开始任务数
 */
function showApplyTaskTotal() {
	var params={};
	params["host_task_status"]=-1;
	showTaskTotal("task-status-apply", params);
}

/**
 * 执行完毕任务数
 */
function showStopTaskTotal() {
	var params={};
	params["host_task_status"]=0;
    showTaskTotal("task-status-stop", params);
}

/**
 * 正在执行任务数
 */
function showValidTaskTotal() {
	var params={};
	params["host_task_status"]=1;
    showTaskTotal("task-status-valid", params);
}

/**
 * 统计任务数
 */
function showTaskTotal(id, params) {
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={ };

	var sendData=params || {};
	sendData["objectName"]="HostTask";
	sendData["action"]="getTotal";

	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			if(total)
				$("#"+id).html(total);
		}
	};
    tek.common.ajax(url, setting, sendData, callback);
}


/**
* 获取不同类型工单
*/

function getTransaction(status){
	var url=tek.common.getRootPath()+"servlet/tobject";
	var transaction_status = 0;
	if(status == "apply"){
		transaction_status = 0;
		}else if (status == "stop"){
			transaction_status = -1;
			}else if(status == "release"){
				transaction_status = 1;
				}
	var setting={operateType: "获取工单列表"};
	var sendData = {
		objectName: "Transaction",
		action: "getList",
		count: 5,
		skip: 0,
		indexPage: 1, //说明是索引页面
		order: "transaction_latestTime",
		transaction_status : transaction_status,
		desc: 1
	};
	var html = null ; 
	var callback = {
		beforeSend: function () {
			html =  "<div class='center'><img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...</div>";
			$("#transaction-"+status).html(html);
		},
		success: function (data) {
			var records = data["record"];
			if (records) {
				records = !records.length ? [records] : records;
				// 显示信息
				showTransactionInfo(status,records,transaction_status);
			} else {
				$("#transaction-"+status).html("没有数据记录");
			}
		},
		error: function (data, errorMsg) {
			$("#transaction-"+status).html(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示工单信息
function showTransactionInfo(status,records,transaction_status) {
	if (!tek.type.isArray(records)) return;
	var elem = $("#transaction-"+status);
	var html = null;
	html = "<ul class='board-lis'>";
	for(var i in records){
		html += " <li class='card'>";
		html += "<a class='card-a' href='"+tek.common.getRelativePath()+"http/tekinfo/transaction/read.html?transaction_id="+records[i].id+"' target='_blank'>"+records[i].transaction_name.show;
		html += "</a>";
		html += "</li>";
	}
	if(records.length == 5){
	html += "<li><a class='card-a pull-right' href='"+tek.common.getRelativePath()+"http/tekinfo/transaction/index.html?show-close=1&refresh-opener=1&transaction_status="+transaction_status+"' target='_blank'>查看更多&nbsp;&nbsp;<i class='fa fa-angle-double-right color'></i></a></li>"
	}
	html += "</ul></br>";
	elem.html(html);
}

/**
 * 执行成功工作数
 */
function showSuccessWorkTotal() {
	var params={};
	params["host_work_status"] = 0;
	var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={async:false};
	params["objectName"]="HostWork";
	params["action"]="getTotal";
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			work_success = total;
		}
	};
    tek.common.ajax(url, setting, params, callback);
}

/**
 * 执行失败工作数
 */
function showErrorWorkTotal() {
	var params={};
	params["host_work_status"] = -1;
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={async:false};
	params["objectName"]="HostWork";
	params["action"]="getTotal";

	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			work_error = total;
		}
	};
    tek.common.ajax(url, setting, params, callback);
}

/**
 * 可用状态：禁止运行主机数
 */
function showStopSiteTotal() {
	var params={};
	params["host_site_status"] = 0;
	var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={async:false};
	params["objectName"]="HostSite";
	params["action"]="getTotal";
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			host_site_stop = total;
		}
	};
    tek.common.ajax(url, setting, params, callback);
}

/**
 * 可用状态：不可用主机数（报废）
 */
function showApplySiteTotal() {
	var params={};
	params["host_site_status"] = -1;
	var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={async:false};
	params["objectName"]="HostSite";
	params["action"]="getTotal";
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			host_site_apply = total;
		}
	};
    tek.common.ajax(url, setting, params, callback);
}

/**
 * 可用状态：可用主机数
 */
function showValidSiteTotal() {
	var params={};
	params["host_site_status"] = 1;
	var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={async:false};
	params["objectName"]="HostSite";
	params["action"]="getTotal";
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			host_site_valid = total;
		}
	};
    tek.common.ajax(url, setting, params, callback);
}

/**
 * 运行状态：停止
 */
 function showStopRunStatusTotal() {
	var params={};
	params["host_site_runstatus"] = 0;
	var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={async:false};
	params["objectName"]="HostSite";
	params["action"]="getTotal";
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			host_site_runstatus_stop = total;
		}
	};
    tek.common.ajax(url, setting, params, callback);
}
 
 /**
 * 运行状态：运行
 */
 function showValidRunStatusTotal() {
	var params={};
	params["host_site_runstatus"] = 1;
	var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={async:false};
	params["objectName"]="HostSite";
	params["action"]="getTotal";
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			host_site_runstatus_valid = total;
		}
	};
    tek.common.ajax(url, setting, params, callback);
}
 /**
 * 运行状态：禁用
 */
function showApplyRunStatusTotal() {
	var params={};
	params["host_site_runstatus"] = -1;
	var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={async:false};
	params["objectName"]="HostSite";
	params["action"]="getTotal";
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			host_site_runstatus_apply = total;
		}
	};
    tek.common.ajax(url, setting, params, callback);
}


//获取当前日期
function getCurrentDate(){
	var date = new Date();
	var format = "yyyy-MM-dd";
	var current_date = tek.dataUtility.dateToString(date, format);
	$("#current-date").html("日期："+current_date);
}

//事件紧急程度
function showEventTotal(id,status) {
	var params={};
	params["host_event_status"]=status;
	showEventTotalInfo(id, params);
}

/**
 * 统计任务数
 */
function showEventTotalInfo(id, params) {
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={ };

	var sendData=params || {};
	sendData["objectName"]="HostEvent";
	sendData["action"]="getTotal";

	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			if(total)
				$("#"+id).html(total);
		}
	};
//	callback["error"]=function (data, errorMsg) {
//			$("#"+id).html(errorMsg);
//		}
    tek.common.ajax(url, setting, sendData, callback);
}


//主机类型
function showSiteTotal(id,type) {
	var params={};
	params["host_site_type"]=type;
	showSiteTotalInfo(id, params);
}

//获取设备总数
function getSiteTotalList(){
	var html = '';
	var setting = {operateType: '获取设备总数'};
	var sendData = {
		objectName: "HostSite",
		action:"getTotal",
	}
	var callback = {
		// beforeSend: function () {
		// 	$("#host_site_list").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		// },
		success: function (data) {
			var records = data.value;
			hostSiteTotel = records;
			//显示不同类型主机 参数为 id、type
			showSiteTotal("site-type-network",0);
			showSiteTotal("site-type-computer",1);
			showSiteTotal("site-type-intellgent",2);


		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

/**
 * 统计主机类型数
 */
function showSiteTotalInfo(id, params) {
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={ };

	var sendData=params || {};
	sendData["objectName"]="HostSite";
	sendData["action"]="getTotal";

	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			if(total)
				$("#"+id).html(total);
				if(id == "site-type-network"){
						site_type_network = total;
						$("#width_network").attr("style","width:"+total/hostSiteTotel*100+"%;");
					}else if(id == "site-type-computer"){
						site_type_computer = total;
						$("#width_computer").attr("style","width:"+total/hostSiteTotel*100+"%;");
					}else if(id == "site-type-intellgent"){
						site_type_intellgent = total;
						$("#width_intellgent").attr("style","width:"+total/hostSiteTotel*100+"%;");
					}
		}
	};
//	callback["error"]=function (data, errorMsg) {
//			$("#"+id).html(errorMsg);
//		}
    tek.common.ajax(url, setting, sendData, callback);
}


//显示普通组员主机群组信息
function showRightControlSite(){
	var html = '';
// $("#host_member")
	var setting = {operateType: '查看成员可操作的主机群组权限'};
	var sendData = {
		objectName: "HostMember",
		action:"getList",
		host_member_user:myId,
	}
	var callback = {
		success: function (data) {
			var records = data.record;

			if(!records){
				html = '&nbsp;&nbsp;';
				html += '<font>暂无可操作主机群组。</font>';
				$("#site_group_title").html(html);

			}else{
				$("#site_group_title").html("");
				//显示可操作主机群组
				if(records.length){
					for(var i in records){
						var count = tek.dataUtility.stringToInt(i) + 1;
						showRightHostMember(count, records[i].host_member_group.value);		

					}
				}else{
					showRightHostMember(1, records.host_member_group.value);
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
		// beforeSend: function () {
		// 	$("#site_group_title").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		// },
		success: function (data) {
			var records = data.record;
			
			if(!records){

			}else{
				if(records.length){
					for(var i in records){
						if(records[i].group_type.value == 0){
		                    html += '<br /><a style="cursor:default;" href="#"><i class="fa fa-laptop"></i>' + records[i].group_name.show + '</a>';
		                    html += '<div class="progress progress-striped active">'
			              		 + '<div id="group_site_'+ records[i].id +'" class="progress-bar progress-bar-primary"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="">'
			              		 + '<span class="sr-only">80% Complete</span>'
			              		 + '</div></div>'
			              		 + '<div class="progress progress-striped active">'
			              		 + '<div id="group_member_'+ records[i].id +'" class="progress-bar progress-bar-danger"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="">'
			              		 + '<span class="sr-only">30% Complete</span>'
			              		 + '</div></div>'
			              	$("#site_group_title").append(html);
							// groupSiteId = records[i].id;
							// var count = tek.dataUtility.stringToInt(i) + 1;
							showHostMemberRightList(records[i].id, records[i]);
							getMemberInfo(records[i].id);
						}
					}
				}else{
	              	html += '<br /><a style="cursor:default;" href="#"><i class="fa fa-laptop"></i>&nbsp;&nbsp;' + records.group_name.show + '</a>';
	              	html += '<div class="progress progress-striped active">'
	              		 + '<div id="group_site_'+ records.id +'" class="progress-bar progress-bar-primary"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="">'
	              		 + '<span class="sr-only">80% Complete</span>'
	              		 + '</div></div>'
	              		 + '<div class="progress progress-striped active">'
	              		 + '<div id="group_member_'+ records.id +'" class="progress-bar progress-bar-danger"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="">'
	              		 + '<span class="sr-only">30% Complete</span>'
	              		 + '</div></div>'
	              	$("#site_group_title").append(html);

					if(records.group_type.value == 0){
						// groupSiteId = records.id;
						showHostMemberRightList(records.id, records);
						getMemberInfo(records.id);
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

//获取组员信息
function getMemberInfo(id){
	var html = '';
	var setting = {operateType: '获取组员信息'};
	var sendData = {
		objectName: "HostMember",
		action:"getTotal",
		host_member_group:id
	}
	var callback = {
		success: function (data) {
			var value = data.value;
			if(value){
				// alert(value+","+siteMember);
				$("#group_member_"+id).attr("style","width:"+ value/siteMember*100+"%;");
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
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
			// alert(highMemberSite);
			if(value){
				$("#group_site_"+id).attr("style","width:"+value/hostSiteTotel*100+"%;");
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//获取所属群组信息
function getControlMemberTotal(){
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
			}else{
				if(records.length){
					for(var i in records){
						if(records[i].group_type.value == 1){
							groupMemberId = records[i].id;
							getMember();
						}
					}
				}else{
					if(records.group_type.value == 1){
						groupMemberId = records.id;
						getMember();
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

//获取组内成员数量
function getMember(){
	var html = '';

	var setting = {operateType: '获取组内成员数量'};
	var sendData = {
		objectName: "Member",
		action:"getTotal",
		group_id:groupMemberId
	};
	var callback = {
		success: function (data) {
			siteMember = parseInt(data.value) + 1;
			
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//获取近期工作
function getHostWorkList(id){
	var html = '';
	var setting = {operateType: '获取近期工作'};
	var sendData = {
		objectName: "HostWork",
		action:"getList",
		order:"createTime",
		count:10
	}
	var callback = {
		success: function (data) {
			var records = data.record;
			var time = "";
			if(records.length){
				workSuccess.push([0,null]);
				workError.push([0,null]);
				for(var i = 0; i < records.length; i++){

					time = records[i].createTime.show;
					getWorkRecordList(i+1, time, records[i].id);
				}
			}else{
				time = records.createTime.show.substring(0,10);
				getWorkRecordList(1, time, records.id);
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取近期工作的成功失败数
function getWorkRecordList(num, time, id){
	var html = '';
	var setting = {operateType: '获取近期工作的成功失败数'};
	var sendData = {
		objectName: "WorkRecord",
		action:"getList",
		work_record_work:id,
	}
	var callback = {
		success: function (data) {
			var records = data.record;
			var statusSuccess = 0;
			var statusError = 0;
			if(records.length){
				for(var i = 0; i < records.length; i++){
					if(records[i].work_record_status.value == 1)
						statusSuccess++;
					if(records[i].work_record_status.value == -1)
						statusError++;
				}
				workSuccess.push([num,statusSuccess]);
				workError.push([num,statusError]);
				// workSuccess.push([time.substring(0,10),statusSuccess]);
				// workError.push([time.substring(0,10),statusError]);
			}else{
				if(records.work_record_status.value == 1)
					statusSuccess++;
				if(records.work_record_status.value == -1)
					statusError++;
				workSuccess.push([num,statusSuccess]);
				workError.push([num,statusError]);
				// workSuccess.push([time.substring(0,10),statusSuccess]);
				// workError.push([time.substring(0,10),statusError]);
			}

			console.log(workSuccess);
			console.log(workError);
			showWorkRecord();
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

/* Curve chart starts */

function showWorkRecord() {
    // var sin = [], cos = [];
    // for (var i = 0; i < 11; i += 1) {
    //     // sin.push([i, Math.sin(i)]);
    //     // cos.push([i, Math.cos(i)]);
    //     sin.push([i, Math.sin(parseInt(Math.random()*1000)+10)]);
    //     cos.push([i, Math.sin(parseInt(Math.random()*1000)+10)]);
    // }


    var plot = $.plot($("#curve-chart"),
           [ { data: workSuccess, label: "执行成功数"}, { data: workError, label: "执行失败数" } ], {
               series: {
                   lines: { show: true, fill: false},
                   points: { show: true }
               },
               grid: { hoverable: true, clickable: true, borderWidth:0 },
               yaxis: { min: 0, max: 5 },
               colors: ["#5cb85c", "#cb4b4b"]
             });

    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',

            top: y + 5,
            left: x + 5,
            border: '1px solid #000',
            padding: '2px 8px',
            color: '#ccc',
            'background-color': '#000',
            opacity: 0.9
        }).appendTo("body").fadeIn(200);
    }

    var previousPoint = null;
    $("#curve-chart").bind("plothover", function (event, pos, item) {
        $("#x").text(pos.x.toFixed(5));
        $("#y").text(pos.y.toFixed(5));

        if ($("#enableTooltip:checked").length > 0) {
            if (item) {

                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    
                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                    
                    showTooltip(item.pageX, item.pageY, 
                                item.series.label + " of " + x + " = " + y);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;            
            }
        }
    }); 

    $("#curve-chart").bind("plotclick", function (event, pos, item) {
        if (item) {
            $("#clickdata").text("您选中了 " + item.dataIndex + " 的 " + item.series.label + ".");
            plot.highlight(item.series, item.datapoint);
        }
    });

}

//悬浮弹框
function titleShow(){
    var oTitle = null;
    var sTitle = null;
    var aA = document.getElementsByTagName('a');
    for(var i = 0;i < aA.length;i ++) {
        if(aA[i].title) {//假如a标签中存在title的话
            aA[i].onmouseover=function(ev) {
            	
            	
                sTitle=this.title;
                this.title='';
                oTitle=document.createElement('div');
                oTitle.className='titleShow';
                oTitle.innerHTML=sTitle;
                document.body.appendChild(oTitle);
            };
            aA[i].onmousemove=function(ev) {
                var ev = ev || window.event;
                oTitle.style.left = ev.pageX + 10 +'px';//获取鼠标所在x座标并增加10个像素,下同
                oTitle.style.top = ev.pageY + 10 + 'px';
            }
            aA[i].onmouseout=function() {
            this.title = sTitle;
            document.body.removeChild(oTitle);
            }
        }
    }
}

// /**
//  * 执行成功工作数
//  */
// function getWorkList() {
// 	var params={};
// 	params["host_work_status"] = 0;
// 	var url=tek.common.getRootPath()+"servlet/tobject";
// 	var setting={async:false};
// 	params["objectName"]="HostWork";
// 	params["action"]="getList";
// 	params["count"]=10;
// 	params["order"]="createTime";
// 	params["desc"]=1;
// 	var callback={};
// 	callback["success"]=function(data) {
// 		if(data) {
// 			var records = data.record;
// 			if(records.length){
// 				for(var i = 0; i < 11; i++){

// 				}
// 			}
// 			var total=data.value;
// 			work_success = total;
// 		}
// 	};
//     tek.common.ajax(url, setting, params, callback);
// }

// /**
//  * 执行失败工作数
//  */
// function showErrorWorkTotal() {
// 	var params={};
// 	params["host_work_status"] = -1;
//     var url=tek.common.getRootPath()+"servlet/tobject";
// 	var setting={async:false};
// 	params["objectName"]="HostWork";
// 	params["action"]="getTotal";

// 	var callback={};
// 	callback["success"]=function(data) {
// 		if(data) {
// 			var total=data.value;
// 			work_error = total;
// 		}
// 	};
//     tek.common.ajax(url, setting, params, callback);
// }

