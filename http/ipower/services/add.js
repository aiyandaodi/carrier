var hostSiteId;//主机ID
var hostSiteName;//主机名称

function init(){

if (tek.common.isLoggedIn()) {
		hostSiteId = request['host_service_site'];
		// hostSiteName = request['host_site_name'];
		// alert(hostSiteName);
		// var highHtml = "新建&nbsp;&nbsp;&nbsp;&nbsp;" + hostSiteName + "&nbsp;&nbsp;&nbsp;&nbsp;服务";
		// $("#host_service_high").html(highHtml);
		//获取主机服务新建信息
        getNewService();

        //登录ipower管理系统，获取登录凭证
		// getIpowerMonitorLogin();


    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
	$("#waiting-modal-dialog").attr("style","margin-top:25%;");
}

//获取主机服务新建信息
function getNewService(){
	var setting = {operateType: '获取主机服务新建信息'};
	var sendData = {
		objectName: "HostService",
		action:"getNew",
	}
	var callback = {
		success: function (data) {
			var record = data['record'];
			
			$("#service_form").show();
		},
		error: function (data, errorMsg) {
			$("#service_form").show();
			//显示错误信息
			// tek.macCommon.waitDialogShow(null, errorMsg);
		}
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//获取对象字典中主机服务类型列表
function getAddServiceList(){
	var html = '';
	var setting = {operateType: '获取对象字典中主机服务类型列表'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"getList",
		dictionary_targetObject: "HostService",
		dictionary_targetFields: "host_service_type"
	}
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(records){
				var dialog = '';
				dialog += '<div class="table-responsive">'
				   + '<table class="table table-striped table-bordered table-hover" id="service_list">'
				   + '<thead id="service_title">'
				   + '</thead><tbody id="dialog_list">'
				   + '</tbody></table></div>';
				tek.macCommon.waitDialogShow('选择要新建的服务类型', dialog, null, 2);
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>服务名称</th>'
	              		 + '<th>服务默认端口</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#service_title").html(html);
					for(var i in records){
						showServicesType(i,records[i]);
					}
				}else{
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>服务名称</th>'
	              		 + '<th>服务默认端口</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#service_title").html(html);
					showServicesType(0,records);
				}
				
			}else{
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '主机标签不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showServicesType(num, record){
		var html = '';
		html += '<tr>'
		  			+ '<td>'+ num +'</td>'
		  			+ '<td>'+ record.name +'</td>'
		  			+ '<td>'+ record.dictionary_property.show +'</td>'
		  			+ '<td><a class="label label-primary" href="javascript:addServiceType(\''+ record.name +'\',\''+ record.id +'\',\''+ record.dictionary_property.value +'\')">选择</a></td>';
		html += '</tr>';
		$("#dialog_list").append(html);
	}

}

//选择主机类型
function addServiceType(name, id, port){
	$("#host_service_name").val(name);
	$("#host_service_type1").val(name);
	$("#host_service_type").val(id);
	$("#host_service_port").val(port);
	tek.macCommon.waitDialogHide(0,null);
}

//新建该主机服务
function addNewService(){
	var params = tek.Utils.getFromJSON(document.getElementById("service_sub_form"));
	// params["host_service_name"] = params["host_service_type"];
	var setting = {operateType: '新建该主机服务'};
	var sendData = tek.Utils.mergeForObject({
		objectName: "HostService",
		action:"addInfo",
		host_service_site:hostSiteId,
        }, params);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {

			$("#service_form").hide();
			if(data){
				hostScriptId = data.value;

				//同步管理台主机服务信息
				// addIpowerHostService(params);
				tek.macCommon.waitDialogShow("", '新建主机服务成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'showHostSite()');
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

//跳转到主机读取页面
function showHostSite(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/site/read.html?host_site_id='+hostSiteId+'&refresh-opener=1&show-close=1');
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

// 返回上一页
function returnPage(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/site/read.html?host_site_id='+hostSiteId+'&refresh-opener=1&show-close=1');
	callPage(url);
	function callPage(backURL){
			if (backURL) {
				location.href = backURL;
			}
	}
}