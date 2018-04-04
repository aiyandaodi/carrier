var hostScriptId = "";//脚本ID
var hostScriptServices = '';//脚本服务类型

function init(){
	// $("#host_site_buytime").datetimepicker();
	// $("#host_site_stoptime").datetimepicker();
if (tek.common.isLoggedIn()) {
		
        hostScriptServices = request['host_script_services'];
        // if (order_id && order_id != '0') {
        //     // getOrder(order_id);
        // } else {
        //     tek.macCommon.waitDialogShow(null, "参数有误，不能下单", "<font id='counter' color='red'></font> 秒后进入预订列表", 2);
        //     tek.macCommon.waitDialogHide(3000, "window.open('shopCart.html', '_self')");
        // }
        // addSiteInfo();
        getNewScript();
        getScriptTags();
        getServiceType();
    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
}

//获取对象字典中的脚本标签
function getScriptTags(){
	var setting = {operateType: '获取对象字典中的脚本标签'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"getList",
		dictionary_targetObject: "HostScript",
		dictionary_targetFields: "host_script_tag"
	}
	var callback = {
		success: function (data) {
			var records = data.record;
			if(records){
				$("#host_script_tag").html("");
				if(records.length){
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
				
			}else{
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '脚本标签不存在');
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
			 + '<input type="checkbox" name="item_host_script_tag" id="host_script_tag_'+ num +'" value="'+ record.name +'">'
			 + record.name
			 + '</label>';
			 $("#host_script_tag").append(html);
	}

}

//添加脚本标签的文本框显示
function addHostScriptTags(num){
	// alert(num);
	if(num == "1"){
		$("#add_host_script_tag").show();
		$("#add_tags_btn").hide();
	}else{
		$("#add_tags_btn").show();
		$("#add_host_script_tag").hide();
	}

}

//返回到前一页面
function returnPage(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/control.html');
    // tek.common.callPage(url,null);
    callPage(url);
    function callPage(backURL){
    	if (backURL) {
    		location.href = backURL;
    	}
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
		// if(hostScriptServices != null){
		// 	$("#host_script_services_" + hostScriptServices).click();
  //       }
		var html = '';
		html += '<label>'
			 + '<input type="checkbox" ';

		if(hostScriptServices != null && hostScriptServices == record.id){
			html += 'checked ';
		}
		html += ' name="item_host_script_services" id="host_script_services_'+ record.id +'" value="'+ record.id +'">'
			 + record.name
			 + '</label>';
			 $("#host_script_services").append(html);
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

//跳转到脚本读取页面
function showHostScript(siteId){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/script/read.html?'+hostScriptId+'&refresh-opener=1&show-close=1');
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

// 获取新建脚本信息
function getNewScript(){
	var setting = {operateType: '获取新建脚本信息'};
	var sendData = {
		objectName: "HostScript",
		action:"getNew",
	}
	var callback = {
		success: function (data) {
			var record = data.record;
			if (record) {
				getSiteGroupList();
				$("#host_script_owner").val(myName);
				// $("#host_script_group").val(myName);
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

//新建脚本
function addNewScript(){
	var formData = getFormData();
	var params2 = tek.Utils.getFromJSON(document.getElementById("script_color_form"));

	// console.log(formData);
	
	var setting = {operateType: "新建脚本"};
	var sendData = tek.Utils.mergeForObject({
            objectName: "HostScript", 
            action: "addInfo", 
        }, formData,params2);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				hostScriptId = data.value;
				tek.macCommon.waitDialogShow("", '新建脚本成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'showHostScript()');
				// showHostSite(data.value);
			}
			// alert("1");
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取管理组列表
function getSiteGroupList(){
	var html = "";
	var setting = {operateType: '获取脚本群组信息'};
	var sendData = {
		objectName: "Group",
		action:"getList",
		group_type:0
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var records = data.record;
			
			if(!records){
				//管理组内成员的弹窗列表显示
				html += '<font>暂无脚本群组，点此&nbsp;&nbsp;<a class="label label-primary" href="javascript:getNewSiteGroup();">新建群组</a></font>';
				tek.macCommon.waitDialogShow("", html,null,2);
			}else{
				//管理组内成员的弹窗列表显示
				var dialog = '';
				dialog += '<div class="table-responsive">'
					   + '<table class="table table-striped table-bordered table-hover" id="site_group_list">'
					   + '<thead id="site_group_title">'
					   + '</thead><tbody id="dialog_list">'
					   + '</tbody></table></div>';
				tek.macCommon.waitDialogShow('脚本群组列表', dialog,null,2);
					
				if(records.length){
						
					html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records[0].group_name.display +'</th>'
	              		 + '<th>'+ records[0].group_remark.display +'</th>'
	              		 + '<th>'+ records[0].group_status.display +'</th>'
	              		 + '<th>脚本数量</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#site_group_title").html(html);

					for(var i in records){
						if(records[i].group_type.value == 0){
							// groupSiteId = records[i].id;
							var count = tek.dataUtility.stringToInt(i) + 1;
							showSiteGroupListInfo(count, records[i].id, records[i]);
						}
					}
				}else{
	              	html += '<tr>'
	              		 + '<th>#</th>'
	              		 + '<th>'+ records.group_name.display +'</th>'
	              		 + '<th>'+ records.group_remark.display +'</th>'
	              		 + '<th>'+ records.group_status.display +'</th>'
	              		 + '<th>脚本数量</th>'
	              		 + '<th>操作</th>'
	              		 + '</tr>';
	              	$("#site_group_title").html(html);

					if(records.group_type.value == 0){
						// groupSiteId = records.id;
						showSiteGroupListInfo(1, records.id, records);
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

//显示脚本群组列表
function showSiteGroupListInfo(num, id, record){
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
		  			+ '<td><a class="label label-primary" href="javascript:addSiteGroup(\''+ id +'\',\''+ record.group_name.show +'\')">选择</a></td>'
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

//选择脚本管理组
function addSiteGroup(id, name){
	$("#host_script_group1").attr("value",name);
	$("#host_script_group").attr("value",id);
	tek.macCommon.waitDialogHide(0,null);

}

//选择脚本颜色
function clickHostScriptColor(color, name){
	$("#host_script_color1").removeAttr("class").attr("class","label label-"+color).attr("value",color).html(name);
	$("#host_script_color").attr("value",color);
	// $("#host_script_color").attr("class","label label-"+color);
}

// 获取提交表单数据（同时校验）
function getFormData() {
    var params = tek.Utils.getFromJSON(document.getElementById("script_sub_form"));
    console.log(params);
    // params["host_site_buytime"] = tek.dataUtility.stringToDate(params.host_site_buytime, 'yyyy-MM-dd HH:mm').getTime();
    // params["host_site_stoptime"] = tek.dataUtility.stringToDate(params.host_site_stoptime, 'yyyy-MM-dd HH:mm').getTime();
    params["host_script_owner"] = myId;
    // params["host_script_services"] = 1;
    params["host_script_tag"] = "";
    for(var i in params["item_host_script_tag"]){
    	params["host_script_tag"] += params["item_host_script_tag"][i] + ";";
    }
    params["host_script_services"] = "";
    for(var i in params["item_host_script_services"]){
    	params["host_script_services"] += params["item_host_script_services"][i] + ";";
    }


    return params;
}