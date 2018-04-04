var hostScriptId;//脚本ID
var hostScriptServices = '';//脚本服务类型

var hostScriptRecord;//脚本信息
function init(){
if (tek.common.isLoggedIn()) {
		hostScriptId = request['host_script_id'];
		hostScriptServices = request['host_script_services']; //我写的
        // order_id = request['order_id'];
        getEditScript();
    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	getScriptTags();//获取标签
	getServiceType();//获取服务
}

//跳转到脚本读取页面
function showHostScript(){
    var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/script/read.html?host_script_id='+hostScriptId+'&refresh-opener=1&show-close=1');
    // alert(url);
    callPage(url);
   	function callPage(backURL) {
            if (backURL) {
                //var callbackConfirm = confirm("确定返回前一页面？");
                //if (callbackConfirm)
                    location.href = backURL;
            }
        };
}

//返回到前一页面
function returnPage(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/script/read.html?host_script_id='+hostScriptId+'&refresh-opener=1&show-close=1');
    // tek.common.callPage(url,null);
    callPage(url);
    function callPage(backURL){
    	if (backURL) {
    		location.href = backURL;
    	}
    }
}

// 获取编辑脚本信息
function getEditScript(){
	var setting = {operateType: '获取编辑脚本信息'};
	var sendData = {
		objectName: "HostScript",
		action:"getEdit",
		host_script_id:hostScriptId,
	}
	var callback = {
		success: function (data) {
			// $("#host_site_user").val(myName);
			// $("#host_site_contact").val(myName);
			// $("#host_site_group").val(myName);
			var record = data.record;
			if (record) {
				hostScriptRecord = record;
				showHostScriptInfo(record);
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


//选择服务类型
function addServiceType(name, id, port){
	$("#host_service_name").val(name);
	$("#host_service_type1").val(name);
	$("#host_service_type").val(id);
	$("#host_service_port").val(port);
	// $("#host_script_services1").val(name);
	$("#host_script_services").val(id);
	tek.macCommon.waitDialogHide(0,null);
}

// 获取脚本适用于的服务类型  --我写的，data拿到空的
function getHostServiceType(){
	var setting = {operateType: '获取脚本适用于的服务类型'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"getList",
		dictionary_targetObject: "HostService",
		dictionary_targetFields: "host_script_services"
	}
	var callback = {
		success: function (data) {
			var records = data.record;
				if (records) {
				$("#host_script_services").html("");
				if (records.length) {
					for(var i in records){
						showScriptServices(i,records[i]);
					}
				}else{
					showScriptServices(0,records);
				}
			}else{
				// 记录不存在
				tek.macCommon.waitDialogShow(null,'脚本服务类型不存在');
			}
		},
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showScriptServices(){
		var html = '';
		if ((record.name+";") == host_script_services.value) {
    		html += '<label>'
			 	 + '<input type="checkbox" name="item_host_script_services" checked id="host_script_services_'+ num +'" value="'+ record.name +'">'
			 	 + record.name
			  	 + '</label>';
			 	 $("#host_script_services").append(html);
			 	}else{
			 		html += '<label>'
			 	 + '<input type="checkbox" name="item_host_script_services" id="host_script_services_'+ num +'" value="'+ record.name +'">'
			 	 + record.name
			  	 + '</label>';
			 	 $("#host_script_services").append(html);
			 	}
    	}

	}

//获取对象字典中的主机服务类型
function getServiceType(){
	var setting = {operateType: '获取对象字典中的主机服务类型'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"getList",
		dictionary_targetObject: "HostService",
		dictionary_targetFields: "host_service_type"
	}
	var callback = {
		success: function (data) {
			var records = data.record;
			if(records){
				$("#host_script_services").html("");
				if(records.length){
					for(var i in records){
						showHostService(i,records[i]);
					}
				}else{
					showHostService(0,records);
				}
				
			}else{
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '主机服务类型不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showHostService(num,record){
		var html = '';
		html += '<label>'
			 + '<input type="checkbox" ';
		splitServices = host_script_services.value.split(";");
		for (var i = 0; i < splitServices.length; i++) {
			if((record.id) == splitServices[i]){
			html += 'checked ';
		  }
		}

		html += ' name="item_host_script_services" id="host_script_services_'+ record.id +'" value="'+ record.id +'">'
			 + record.name
			 + '</label>';
			 $("#host_script_services").append(html);
	}
    	
}

// 显示脚本信息
function showHostScriptInfo(record){
	$("#host_script_name").val(record.host_script_name.value);
	$("#host_script_group").val(record.host_script_group.value);
	$("#host_script_group1").val(record.host_script_group.show);
	$("#host_script_tag").val(record.host_script_tag.value);
	// 判断当前是那种脚本颜色标签
	getScriptColor(record);
	// $("#host_script_services").val(record.host_script_services.value);
	// 列出脚本适用的服务
	// getServiceType(record);
	// getHostServiceType(record.host_script_services.value);
	$("#host_script_services").val(record.host_script_services.value);

	// $("#host_script_status_"+ (record.host_script_status.value)).addClass("checked","checked");
	// 判断脚本状态
	getScriptStatus();
	$("#host_script_remark").val(record.host_script_remark.value);
	$("#host_script_owner").val(record.host_script_owner.value);
}

// 获取脚本状态
function getScriptStatus(){
	var setting = {operateType: '获取脚本状态'};
	var sendData = {
		objectName: "HostScript",
		action:"readInfo",
		host_script_id:hostScriptId,
	}; 
	var callback = {
		beforeSend: function () {
			$("#host_task_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var record = data['record'];
			if (record) {
				showScriptStatus(record);
				// showHostTaskInfo(record);
			} else {
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '脚本状态不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showScriptStatus(record){
		var html = '';
		if (record.host_script_status.value == 0) {
    		html += '<label>'
			 	 + '<input type="radio" name="host_script_status" id="host_script_status_0" value="0" checked>'
			 	 + '默认'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_script_status" id="host_script_status_-1" value="-1">'
			 	 + '不可用'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_script_status" id="host_script_status_1" value="1">'
			 	 + '可用'
			  	 + '</label>';
			 	 $("#host_script_status").append(html);
			 	}
		if (record.host_script_status.value == -1) {
			html += '<label>'
				 + '<input type="radio" name="host_script_status" id="host_script_status_0" value="0" >'
			 	 + '默认'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_script_status" id="host_script_status_-1" value="-1" checked>'
			 	 + '不可用'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_script_status" id="host_script_status_1" value="1">'
			 	 + '可用'
			  	 + '</label>';
			 	 $("#host_script_status").append(html);
			 	} 
		if (record.host_script_status.value == 1){
			html += '<label>'
				 + '<input type="radio" name="host_script_status" id="host_script_status_0" value="0" >'
			 	 + '默认'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_script_status" id="host_script_status_-1" value="-1">'
			 	 + '不可用'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_script_status" id="host_script_status_1" value="1" checked>'
			 	 + '可用'
			  	 + '</label>';
			 	 $("#host_script_status").append(html);
			 	}
			 }
}

//修改脚本信息
function setInfoScript(){
	var formData = getFormData();
	// console.log(params);
	var setting = {operateType: "修改脚本信息"};
	var sendData = tek.Utils.mergeForObject({
            objectName: "HostScript", 
            action: "setInfo", 
            host_script_id: hostScriptId,
        }, formData);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '修改成功!', null, 2);
				tek.macCommon.waitDialogHide(3000, 'showHostScript()');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// ---------------------------------------------------------------------------------------------

// 获取脚本管理组列表
function getScriptGroupList(){
	var html = "";
	var setting = {operateType: '获取脚本管理组信息'};
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
				html += '<font>暂无主机群组，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getNewScriptGroup();">新建群组</a></font>';
				tek.macCommon.waitDialogShow("", html,null,2);
			}else{
				//管理组内成员的弹窗列表显示
				var dialog = '';
				dialog += '<div class="table-responsive">'
					   + '<table class="table table-striped table-bordered table-hover" id="script_group_list">'
					   + '<thead id="script_group_title">'
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
	              	$("#script_group_title").html(html);

					for(var i in records){
						if(records[i].group_type.value == 0){
							// groupSiteId = records[i].id;
							var count = tek.dataUtility.stringToInt(i) + 1;
							showScriptGroupListInfo (count, records[i].id, records[i]);
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
	              	$("#script_group_title").html(html);

					if(records.group_type.value == 0){
						// groupSiteId = records.id;
						showScriptGroupListInfo(1, records.id, records);
					}
				}
			}
			
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示脚本群组列表
function showScriptGroupListInfo(num, id, record){
	var html = '';

	var setting = {operateType: '获取脚本群组信息'};
	var sendData = {
		objectName: "HostScript",
		action:"getTotal",
		host_script_group:id
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
		  			+ '<td><a class="label label-primary" href="javascript:addScriptGroup(\''+ id +'\',\''+ record.group_name.show +'\')">选择</a></td>'
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

//选择主机管理组
function addScriptGroup(id, name){
	$("#host_script_group1").val(name);
	$("#host_script_group").val(id);
	tek.macCommon.waitDialogHide(0,null);

}
// 获取对象字典中的脚本标签
function getScriptTags(){
	var setting = {operateType: '获取对象字典中的脚本标签'};
	var sendData = {
		objectName: "ObjectDictionary",
		action: "getList",
		dictionary_targetObject: "HostScript",
		dictionary_targetFields: "host_script_tag"
	}
	var callback = {
		success: function (data){
			var records = data.record;
			if (records) {
				$("#host_script_tag").html("");
				if (records.length) {
					for(var i in records){
						showScriptTags(i,records[i]);
					}
				}else{
					showScriptTags(0,records);
				}

				var addTagsBtn = '';
				addTagsBtn += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='add_tags_btn' href='javascript:addHostScriptTags(1);' class='label label-warning'>添加标签</a>";
				addTagsBtn +=  '<div class="col-lg-5 input-group" id="add_host_script_tag" style="display:none;">'
							   + '<input type="text" class="form-control" placeholder="标签名"/>'
                               + '<span class="input-group-btn">'
                               + '<a class="btn btn-color" onclick="javascript:addHostScriptTagsInfo();" title="提交"><i class="fa fa-check"></i></a>'
                               + '<a class="btn btn-color" onclick="javascript:addHostScriptTags(0);" title="放弃"><i class="fa fa-remove"></i></a>'
                               + '</span>'
                               + '</div>';
                $("#host_script_tag").append(addTagsBtn);
                // alert(host_script_tag.value);
			}else{
				// 记录不存在
				tek.macCommon.waitDialogShow(null,'脚本标签不存在');
			}
		},
		error: function (data, errorMsg) {
			var addTagsBtn = '';
				addTagsBtn += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='add_tags_btn' href='javascript:addHostScriptTags(1);' class='label label-warning'>添加标签</a>";
				addTagsBtn +=  '<div class="col-lg-5 input-group" id="add_host_script_tag" style="display:none;">'
							   + '<input type="text" class="form-control" placeholder="标签名"/>'
                               + '<span class="input-group-btn">'
                               + '<a class="btn btn-color" onclick="javascript:addHostScriptTagsInfo();" title="提交"><i class="fa fa-check"></i></a>'
                               + '<a class="btn btn-color" onclick="javascript:addHostScriptTags(0);" title="放弃"><i class="fa fa-remove"></i></a>'
                               + '</span>'
                               + '</div>';
				$("#host_script_tag").append(addTagsBtn);
           	// tek.macCommon.waitDialogShow(null, errorMsg);
           	// tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showScriptTags(num,record){
		var html = '';
		html += '<label>'
			 + '<input type="checkbox" ';
		splitTags = host_script_tag.value.split(";");
		for (var i = 0; i < splitTags.length; i++) {
			if (record.name == splitTags[i]) {
				html += 'checked ';
			}
		}
			 	html += ' name="item_host_script_tag" id="host_script_tag_'+ num +'" value="'+ record.name +'">'
					 + record.name
			  		 + '</label>';
					 $("#host_script_tag").append(html);
    	}
		
	}

// 添加脚本标签的文本框显示
function addHostScriptTags(num){
	if(num == "1"){
		$("#add_host_script_tag").show();
		$("#add_tags_btn").hide();
	}else{
		$("#add_tags_btn").show();
		$("#add_host_script_tag").hide();
	}
}

//添加脚本标签的对象字典
function addHostScriptTagsInfo(){
	var tag = $("#add_host_script_tag").find('input').val();
		var setting = {operateType: '获取对象字典中的脚本标签'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"addInfo",
		dictionary_targetObject: "HostScript",
		dictionary_targetFields: "host_script_tag",
		dictionary_language:"zh_CN",
		dictionary_name:tag,
		dictionary_original:tag
	}
	var callback = {
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '添加成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'getScriptTags()');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//选择脚本颜色
function clickHostScriptColor(color, name){
	$("#host_script_color1").removeAttr("class").attr("class","label label-"+color).attr("value",color).html(name);
	$("#host_script_color").attr("value",color);
}

//获取当前脚本颜色
function getScriptColor(record){
	if (record.host_script_color.value == "default") {
		$("#host_script_color1").removeAttr("class").attr("class","label label-"+record.host_script_color.value).attr("value",record.host_script_color.value).html("无");
		$("#host_script_color").attr("value",record.host_script_color.value);
	}
	if (record.host_script_color.value == "info") {
		$("#host_script_color1").removeAttr("class").attr("class","label label-"+record.host_script_color.value).attr("value",record.host_script_color.value).html("普通");
		$("#host_script_color").attr("value",record.host_script_color.value);
	} 
	if (record.host_script_color.value == "primary") {
		$("#host_script_color1").removeAttr("class").attr("class","label label-"+record.host_script_color.value).attr("value",record.host_script_color.value).html("一般");
		$("#host_script_color").attr("value",record.host_script_color.value);
	}
	if (record.host_script_color.value == "success") {
		$("#host_script_color1").removeAttr("class").attr("class","label label-"+record.host_script_color.value).attr("value",record.host_script_color.value).html("正常");
		$("#host_script_color").attr("value",record.host_script_color.value);
	}
	if (record.host_script_color.value == "warning") {
		$("#host_script_color1").removeAttr("class").attr("class","label label-"+record.host_script_color.value).attr("value",record.host_script_color.value).html("严重");
		$("#host_script_color").attr("value",record.host_script_color.value);
	}
	if (record.host_script_color.value == "danger") {
		$("#host_script_color1").removeAttr("class").attr("class","label label-"+record.host_script_color.value).attr("value",record.host_script_color.value).html("紧急");
		$("#host_script_color").attr("value",record.host_script_color.value);
	}
}

//是否上传脚本文件页面部分显示
function showBlob(num){
	if(num == 0){
		$("#host_script_blob_0").show();
		$("#host_script_blob_1").hide();
	}else{
		$("#host_script_blob_0").hide();
		$("#host_script_blob_1").show();

	}
}
// -----------------------------------------------------------------------------------------------------------

// 获取提交表单数据（同时校验）
function getFormData() {

    var params = tek.Utils.getFromJSON(document.getElementById("script_sub_form"));

    params["host_script_owner"] = myId;
    // params["host_script_group"] = myId;

    //判断哪些脚本标签被选中
    params["host_script_tag"] = "";
    for(var i in params["item_host_script_tag"]){
    	params["host_script_tag"] += params["item_host_script_tag"][i] + ";";
    }
    // 判断哪些脚本服务被选中
    params["host_script_services"] = "";
    for(var i in params["item_host_script_services"]){
    	params["host_script_services"] += params["item_host_script_services"][i] + ";";
    }
//         params["appraisal_name"] = encodeURIComponent(params.appraisal_name);
//         if(!params["appraisal_name"]){
//             tek.macCommon.waitDialogShow(null, "<font color='red'>请输入委托单位</font>", null, 0);
//             return null;
//         }

//         params["appraisal_contact"] = encodeURIComponent(params.appraisal_contact);
//         if(!params["appraisal_contact"]){
//             tek.macCommon.waitDialogShow(null, "<font color='red'>请输入联系人</font>", null, 0);
//             return null;
//         }

//         params["appraisal_phone"] = encodeURIComponent(params.appraisal_phone);
//         if(!params["appraisal_phone"]){
//             tek.macCommon.waitDialogShow(null, "<font color='red'>请输入联系电话</font>", null, 0);
//             return null;
//         }
//         if(!tek.dataUtility.isCertificatePhone(params.appraisal_phone)){
//             //判断手机号码格式是否正确
//             tek.macCommon.waitDialogShow(null, "<font color='red'>请输入正确的联系电话</font>", null, 0);
//             return null;
//         }

        
        
//         if(!params["appraisal_email"]){
//             tek.macCommon.waitDialogShow(null, "<font color='red'>请输入联系邮箱</font>", null, 0);
//             return null;
//         }
//         if(!tek.dataUtility.isCertificateEmail(params.appraisal_email)){
//             //判断邮箱格式是否正确
//             tek.macCommon.waitDialogShow(null, "<font color='red'>请输入正确的联系邮箱</font>", null, 0);
//             return null;
//         }
//         params["appraisal_email"] = encodeURIComponent(params.appraisal_email);
        
//         params["appraisal_recommend"] = encodeURIComponent(params.appraisal_recommend);
//         params["appraisal_urgent"] = tek.Utils.calculateFloat(((params.appraisal_urgent1 && params.appraisal_urgent1.length) ? params.appraisal_urgent1[0] : 0),"+",((params.appraisal_urgent2 && params.appraisal_urgent2.length) ? params.appraisal_urgent2[0] : 0),0);

//         if (!params["appraisal_start"]) {
//             tek.macCommon.waitDialogShow(null, "<font color='red'>请输入委托办理时间</font>", null, 0);
//             return null;
//         }
//         var ADDTIME = tek.dataUtility.stringToDate(params.appraisal_start, 'yyyy-MM-dd HH:mm').getTime();
//         var settime = isValidTime(ADDTIME);
//         if(!settime){
//             return null;
//             }
//         params.appraisal_end = params.appraisal_start;
//         params["appraisal_start"] = tek.dataUtility.stringToDate(params.appraisal_start, 'yyyy-MM-dd HH:mm').getTime();
        
// //       if (!params["appraisal_end"]) {
// //            tek.macCommon.waitDialogShow(null, "<font color='red'>请输入要求完成时间！</font>", null, 0);
// //            return null;
// //        }
//         year = parseInt(params.appraisal_end.substring(0,4)) + 1;
//         params.appraisal_end = year + params.appraisal_end.substring(4);
//         params["appraisal_end"] = tek.dataUtility.stringToDate(params.appraisal_end,'yyyy-MM-dd HH:mm').getTime();
//         params["appraisal_remark"] = encodeURIComponent(params.appraisal_remark);
//         params["appraisal_remark_secrecy"] = (params.appraisal_remark_secrecy && params.appraisal_remark_secrecy.length) ? params.appraisal_remark_secrecy[0] : 0;
//         params["appraisal_case"] = encodeURIComponent(params.appraisal_case);
//         params["appraisal_agreetime"] = (params.appraisal_agreetime && params.appraisal_agreetime.length) ? params.appraisal_agreetime[0] : 0;
//         params["appraisal_case_secrecy"] = (params.appraisal_case_secrecy && params.appraisal_case_secrecy.length) ? params.appraisal_case_secrecy[0] : 0;
//         params["appraisal_appraisal"] = encodeURIComponent(params.appraisal_appraisal);

//         if (params['file-blob']) {
//             params["input-stream"] = "file-blob";
//             params['appraisal_blob'] = tek.fileUtility.getFileName(params['file-blob']);
//         }



    return params;
}