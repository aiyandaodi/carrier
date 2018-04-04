var hostSiteId;//主机ID
var hostSiteName;//主机名称

function init(){

if (tek.common.isLoggedIn()) {
		hostSiteId = request['host_specifications_site'];
		// hostSiteName = request['host_site_name'];
		// alert(hostSiteName);
		// var highHtml = "新建&nbsp;&nbsp;&nbsp;&nbsp;" + hostSiteName + "&nbsp;&nbsp;&nbsp;&nbsp;服务";
		// $("#host_service_high").html(highHtml);
		//获取主机服务新建信息
        getNewSpecifications();

        //登录ipower管理系统，获取登录凭证
		// getIpowerMonitorLogin();


    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
	$("#waiting-modal-dialog").attr("style","margin-top:25%;");
}
//获取对象字典中主机服务类型列表
function getAddSpecificationList(){
	var html = '';
	var setting = {operateType: '获取对象字典中主机服务类型列表'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"getList",
		dictionary_targetObject: "HostSpecifications",
		dictionary_targetFields: "host_specifications_type"
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
				   + '<table class="table table-striped table-bordered table-hover" id="specification_list">'
				   + '<thead id="specification_title">'
				   + '</thead><tbody id="dialog_list">'
				   + '</tbody></table></div>';
				tek.macCommon.waitDialogShow('选择要新建的服务类型', dialog, null, 2);
				if(records.length){
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>规格名称</th>'
	              		 + '<th>规格详情</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#specification_title").html(html);
					for(var i in records){
						showServicesType(i,records[i]);
					}
				}else{
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>规格名称</th>'
	              		 + '<th>规格详情</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#specification_title").html(html);
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
		  			+ '<td><a class="label label-primary" href="javascript:addSpecificationType(\''+ record.name +'\',\''+ record.id +'\',\''+ record.dictionary_property.value +'\')">选择</a></td>';
		html += '</tr>';
		$("#dialog_list").append(html);
	}

}

//选择主机类型
function addSpecificationType(name, id, property){
	$("#host_specifications_name").val(name + " / " + property);
	$("#host_specifications_type1").val(name + " / " + property);
	$("#host_specifications_type").val(id);
	tek.macCommon.waitDialogHide(0,null);
}

//获取主机规格新建信息
function getNewSpecifications(){
	var setting = {operateType: '获取主机服务新建信息'};
	var sendData = {
		objectName: "HostService",
		action:"getNew",
	}
	var callback = {
		success: function (data) {
			var record = data['record'];
			if (record) {
				$("#specifications_form").show();
			} else {
				$("#specifications_form").show();
				//提示 '记录不存在！'
				// tek.macCommon.waitDialogShow(null, '主机服务记录不存在');
			}
		},
		error: function (data, errorMsg) {
			$("#specifications_form").show();
			//显示错误信息
			// tek.macCommon.waitDialogShow(null, errorMsg);
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


//新建该主机规格
function addNewSpecifications(){
	var params = tek.Utils.getFromJSON(document.getElementById("specifications_sub_form"));
	// params["host_specifications_name"] = params["host_specifications_type"];
	var setting = {operateType: '新建该主机服务'};
	var sendData = tek.Utils.mergeForObject({
		objectName: "HostSpecifications",
		action:"addInfo",
		host_specifications_site:hostSiteId,
        }, params);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {

			$("#specifications_form").hide();
			if(data){
				hostScriptId = data.value;
				tek.macCommon.waitDialogShow("", '新建主机规格成功!',null,2);
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

// 返回前一页
function returnPage(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/site/read.html?host_site_id='+hostSiteId+'&refresh-opener=1&show-close=1');
	callPage(url);
	function callPage(backURL){
			if (backURL) {
				location.href = backURL;
			}
	}
}