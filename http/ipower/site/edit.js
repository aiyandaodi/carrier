var hostSiteId;//主机ID

var hostSiteRecord;//主机信息
function init(){
	$("#host_site_buytime,#host_site_stoptime").datetimepicker({
		/*	//这段代码表示周六日不可选
			onGenerate:function( ct ){
					$(this).find('.xdsoft_date.xdsoft_weekend')
					.addClass('xdsoft_disabled');
			},*/
			timepicker:false,
			format: 'Y-m-d H:i:s',
			lang:'ch',
			minDate:'-1970/01/01', // today is minimum date

		});
	$("#host_site_stoptime").datetimepicker();
	if (tek.common.isLoggedIn()) {
		hostSiteId = request['host_site_id'];
        // order_id = request['order_id'];
        getEditSite();
    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	getSiteTags();
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

//返回到前一页面
function returnPage(){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/site/read.html?host_site_id='+hostSiteId+'&refresh-opener=1&show-close=1');
    callPage(url);
   	function callPage(backURL) {
            if (backURL) {
                //var callbackConfirm = confirm("确定返回前一页面？");
                //if (callbackConfirm)
                    location.href = backURL;
            }
        };
}

// 获取编辑主机信息
function getEditSite(){
	var setting = {operateType: '获取编辑主机信息'};
	var sendData = {
		objectName: "HostSite",
		action:"getEdit",
		host_site_id:hostSiteId,
	}
	var callback = {
		success: function (data) {
			// $("#host_site_user").val(myName);
			// $("#host_site_contact").val(myName);
			// $("#host_site_group").val(myName);
			var record = data.record;
			if (record) {
				hostSiteRecord = record;
				showHostSiteInfo(record);
				
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

// 显示主机
function showHostSiteInfo(record){
	$("#host_site_name").val(record.host_site_name.value);
	$("#host_site_catalog").val(record.host_site_catalog.value);
	$("#host_site_group").val(record.host_site_group.value);
	$("#host_site_group1").val(record.host_site_group.show);
	$("#host_site_tags").val(record.host_site_tags.value);
	$("#host_site_mac").val(record.host_site_mac.value);
	getHostStatus();
	// $("#host_site_status_"+ (record.host_site_status.value+1)).addClass("checked","checked");
	$("#host_site_buytime").val(record.host_site_buytime.show);
	$("#host_site_stoptime").val(record.host_site_stoptime.show);
	$("#host_site_user").val(record.host_site_user.show);
	$("#host_site_supplier").val(record.host_site_supplier.value);
	$("#host_site_remark").val(record.host_site_remark.value);
}

function getHostStatus(){
	var setting = {operateType: '获取任务信息'};
	var sendData = {
		objectName: "HostSite",
		action:"readInfo",
		host_site_id:hostSiteId,
	}; 
	var callback = {
		beforeSend: function () {
			$("#host_site_form").html("<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			var record = data['record'];
			if (record) {
				showHostStatus(record);
				// showHostTaskInfo(record);
			} else {
				//提示 '记录不存在！'
				tek.macCommon.waitDialogShow(null, '任务记录不存在');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

	function showHostStatus(record){
		var html = '';
		if (record.host_site_status.value == 0) {
    		html += '<label>'
			 	 + '<input type="radio" name="host_site_status" id="host_site_status_0" value="0" checked>'
			 	 + '停止使用'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_site_status" id="host_site_status_1" value="-1">'
			 	 + '报废'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_site_status" id="host_site_status_2" value="1">'
			 	 + '正常使用'
			  	 + '</label>';
			 	 $("#host_site_status").append(html);
			 	}
		if (record.host_site_status.value == -1) {
			html += '<label>'
				 + '<input type="radio" name="host_site_status" id="host_site_status_0" value="0">'
			 	 + '停止使用'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_site_status" id="host_site_status_1" value="-1" checked>'
			 	 + '报废'
			 	 + '</label>'
			 	 + '<br>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_site_status" id="host_site_status_2" value="1">'
			 	 + '正常使用'
			  	 + '</label>';
			 	 $("#host_site_status").append(html);
			 	} 
		if (record.host_site_status.value == 1){
			html += '<label>'
				 + '<input type="radio" name="host_site_status" id="host_site_status_0" value="0">'
			 	 + '停止使用'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_site_status" id="host_site_status_1" value="-1">'
			 	 + '报废'
			 	 + '</label>'
			 	 + '<label>'
			 	 + '<input type="radio" name="host_site_status" id="host_site_status_2" value="1" checked>'
			 	 + '正常使用'
			  	 + '</label>';
			 	 $("#host_site_status").append(html);
			 	}
			 }
}

//修改主机信息
function setInfoSite(){
	//alert("10")
	var formData = getFormData();
    
	//console.log(params);
	
	var setting = {operateType: "修改主机信息"};
	var sendData = tek.Utils.mergeForObject({
            objectName: "HostSite", 
            action: "setInfo", 
            host_site_id: hostSiteId,
        }, formData);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '修改成功!', null, 2);
				tek.macCommon.waitDialogHide(3000, 'showHostSite()');
			}
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
	var setting = {operateType: '获取主机群组信息'};
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
							showSiteGroupListInfo(count, records[i].id, records[i]);
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
						showSiteGroupListInfo(1, records.id, records);
					}
				}
			}
			
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示主机群组列表
function showSiteGroupListInfo(num, id, record){
	var html = '';

	var setting = {operateType: '获取群组信息'};
	var sendData = {
		objectName: "HostSite",
		action:"getTotal",
		host_site_group:id,
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

//选择主机管理组
function addSiteGroup(id, name){
	$("#host_site_group1").val(name);
	$("#host_site_group").val(id);
	tek.macCommon.waitDialogHide(0,null);

}
// -------------------------------------------------------------------------------------------------
//获取对象字典中的主机标签
function getSiteTags(){
	
	var setting = {operateType: '获取对象字典中的主机标签'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"getList",
		dictionary_targetObject: "HostSite",
		dictionary_targetFields: "host_site_tags"
	}
	var callback = {
		success: function (data) {
			var records = data.record;
			if(records){
				$("#host_site_tags").html("");
				if(records.length){
					for(var i in records){
						showSiteTags(i,records[i]);
					}
				}else{
					showSiteTags(0,records);
				}

				var addTagsBtn = '';
				addTagsBtn += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='add_tags_btn' href='javascript:addHostSiteTags();' class='label label-warning'>添加标签</a>";
				addTagsBtn +=  '<div class="col-lg-5 input-group" id="add_host_site_tags" style="display:none;">'
							   + '<input type="text" class="form-control" placeholder="标签名"/>'
                               + '<span class="input-group-btn">'
                               + '<a class="btn btn-color" onclick="javascript:addHostSiteTagsInfo();" title="提交"><i class="fa fa-check"></i></a>'
                               + '<a class="btn btn-color" onclick="javascript:addHostSiteTags();" title="放弃"><i class="fa fa-remove"></i></a>'
                               + '</span>'
                               + '</div>';
				$("#host_site_tags").append(addTagsBtn);
				
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

	function showSiteTags(num,record){
		var html = '';
		if ((record.name+";") == host_site_tags.value) {
		html += '<label>'
			 + '<input type="checkbox" name="item_host_site_tags" checked id="host_site_tags_'+ num +'" value="'+ record.name +'">'
			 + record.name
			 + '</label>';
			 $("#host_site_tags").append(html);
			}else{
				html += '<label>'
			 		 + '<input type="checkbox" name="item_host_site_tags" id="host_site_tags_'+ num +'" value="'+ record.name +'">'
			 		 + record.name
			 		 + '</label>';
			 		 $("#host_site_tags").append(html);
			}
	}

	// function showSiteTags_checked(num,record){
	// 	var html = '';
	// 	html += '<label>'
	// 		 + '<input type="checkbox" name="item_host_site_tags" checked id="host_site_tags_'+ num +'" value="'+ record.name +'">'
	// 		 + record.name
	// 		 + '</label>';
	// 		 $("#host_site_tags").append(html);
	// }

}
//添加主机标签的文本框显示
function addHostSiteTags(){
	if($("#add_host_site_tags").attr("style") == "display:none;"){
		$("#add_host_site_tags").show();
		$("#add_tags_btn").hide();
	}else{
		$("#add_tags_btn").show();
		$("#add_host_site_tags").hide();
	}

}
// --------------------------------------------------------------------------------------------------

// 获取提交表单数据（同时校验）
function getFormData() {
    var params = tek.Utils.getFromJSON(document.getElementById("site_sub_form"));
  
    params["host_site_buytime"] = tek.dataUtility.stringToDate(params.host_site_buytime, 'yyyy-MM-dd HH:mm:ss').getTime();
    //判断主机是否已停用
    if (params.host_site_stoptime != 0) {
    	if (params.host_site_stoptime) {}
    	params["host_site_stoptime"] = tek.dataUtility.stringToDate(params.host_site_stoptime, 'yyyy-MM-dd HH:mm:ss').getTime();
    }else{
    	params["host_site_stoptime"] = 0;
    }    
    params["host_site_user"] = myId;
    params["host_site_contact"] = myId;

    //判断采购时间是否大于停用时间
    if (params["host_site_buytime"]>params["host_site_stoptime"]) {
    	alert("采购时间不能大于停用时间,请重新选择时间");
    	//params["host_site_stoptime"] = tek.dataUtility.stringToDate(params.host_site_stoptime, 'yyyy-MM-dd HH:mm').getTime();
    	goEditHostSite();
    }

    //判断哪些主机标签被选中
    params["host_site_tags"] = "";
    for(var i in params["item_host_site_tags"]){
    	params["host_site_tags"] += params["item_host_site_tags"][i] + ";";
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