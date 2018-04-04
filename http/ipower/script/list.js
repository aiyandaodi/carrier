
//初始化
function init() {
	//判断用户是否登录
	 if (tek.common.isLoggedIn()) {
	 	
 		//控制台数据显示
		getHostScriptList();
		
	}else{
		tek.macCommon.waitDialogShow("<font color='red'>请先登录</font>", "正在跳转登录页面...", null, 0);
		tek.macCommon.waitDialogHide(1500, 'goLogin()');
	}

}

// 获取脚本列表信息
function getHostScriptList(){
	var setting = {operateType: '获取脚本列表信息'};
	var sendData = {
		objectName: "HostScript",
		action:"getList",
		count: 10,
	}
	var callback = {
		beforeSend: function () {
			$("#host_script_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			if(records){
				var html = "";
					html += '<thead><tr>'
				         + '<th>#</th>'
				         + '<th>脚本名称</th>'
				         + '<th>创建日期</th>'
				         + '<th>脚本适用的服务</th>'
				         + '<th>脚本标签</th>'
				         + '<th>脚本备注</th>'
				         + '<th>操作</th>'
				         + '</tr></thead>';
    			$("#host_script_form").html(html);
				if(records.length){
					for(var i in records){
						if(records[i].host_script_status.value != -1)
						showHostScriptInfo(i, records[i]);
					}
				}else{
					showHostScriptInfo(0, records);
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

//脚本信息显示
function showHostScriptInfo(num, record){
	var html = "";
	num = tek.dataUtility.stringToInt(num) + 1;
    html += '<tr><td>' + num + '</td>'
         + '<td>' + record.host_script_name.show + '</td>'
         + '<td>' + record.createTime.show + '</td>'
         // + '<td>' + record.host_script_services.show + '</td>'
         + '<td id="host_script_services_'+ num +'"></td>'
         + '<td><span class="label label-success">' + record.host_script_tag.show + '</span></td>'
         // + '<td><span class="label label-success">ssh</span></td>'
         // + '<td><span class="label label-success">' + record.host_site_status.show + '</span>'
         + '<td>' + record.host_script_remark.show + '</td>'
         + '<td><a href="../../../http/ipower/script/read.html?host_script_id=' + record.id + '" class="btn btn-xs btn-primary"><i class="fa fa-search-plus"></i> </a>'
         + '<a href="../../../http/ipower/script/edit.html?host_script_id=' + record.id + '" class="btn btn-xs btn-warning"><i class="fa fa-pencil"></i> </a>'
                  +'<button onclick="javascript:deleteHostScript(\'' + record.id + '\');" class="btn btn-xs btn-danger"><i class="fa fa-times"></i> </button></td></tr>'

    var services = tek.dataUtility.stringToArray(record.host_script_services.show, ";");
	for(var i in services){
		getHostServiceType(services[i], num);
	}
    $("#host_script_form").append(html);

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

function deleteHostScript(scriptId){
	var setting = {operateType: '删除脚本'};
	var sendData = {
		objectName: "HostScript",
		action:"setInfo",
		host_script_id: scriptId,
		host_script_status: -1,
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
