var hostSiteId = "";//主机ID

function init(){
	$("#host_site_buytime").datetimepicker();
	$("#host_site_stoptime").datetimepicker();

	$('#host_site_buytime').datetimepicker({
		timepicker:false,
		format:'Y/m/d',
		formatDate:'Y/m/d',
	});
if (tek.common.isLoggedIn()) {
		//获取新建主机信息
        getNewSite();
        //选择所属管理组
        getAddJsSiteGroupList();
		//登录ipower管理系统，获取登录凭证
		getIpowerMonitorLogin();

    } else {
        tek.macCommon.waitDialogShow(null, "<font color='red'>请先登录</font>", "<font id='counter' color='red'></font> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
	
}

//登录ipower管理系统，获取登录凭证
function getIpowerMonitorLogin(){
	var ajaxURL = "http://10.128.0.211/ipower/ip/api_jsonrpc.php";
    var params = '';
    params += '{';
    params += '"auth":null,';
    params += '"id":0,';130
    params += '"jsonrpc":"2.0",';
    params += '"method":"user.login",';
    params += '"params":{"user":"Admin","password":"tekinfo.net"}';
    params += '}';

	$.ajax({
		type:"POST",
		url:ajaxURL,
		headers:{
			"Content-Type":"application/json-rpc",
			"ACCEPT":"application/json-rpc,text/javascript, text/html, application/xml, text/xml, */*"
		},
		data:params,
		dataType:"json",
		processData:false,
		success: function(data){
			// console.log(data);
			if(data){
				if(data.result != null){
					ipowerAudit = data.result;

				}else{
					// tek.macCommon.waitDialogShow(null, errorMsg);
				}
			}else{
				// tek.macCommon.waitDialogShow(null, errorMsg);
			}
		},
		error: function(data){
			console.log(data);
		}
	})
}

//跳转到主机读取页面
function showHostSite(siteId){
	var url = decodeURIComponent(tek.common.getRootPath()+'http/ipower/site/read.html?host_site_id='+hostSiteId[1]+'&refresh-opener=1&show-close=1');
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

//获取管理组列表
function getAddJsSiteGroupList(){
	var html = "";
	var setting = {operateType: '获取管理组列表'};
	var sendData = {
		objectName: "Group",
		action:"getList",
		group_type:0
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>",null,2);
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
				tek.macCommon.waitDialogShow('选择所属主机群组', dialog,null,2);
					
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
							showAddJsSiteGroupListInfo(count, records[i].id, records[i]);
						}
					}
				}else{
	    //           	html += '<tr>'
	    //           		 + '<th>#</th>'
	    //           		 + '<th>'+ records.group_name.display +'</th>'
	    //           		 + '<th>'+ records.group_remark.display +'</th>'
	    //           		 + '<th>'+ records.group_status.display +'</th>'
	    //           		 + '<th>主机数量</th>'
	    //           		 + '<th>操作</th>'
	    //           		 + '</tr>';
	    //           	$("#site_group_title").html(html);

					// if(records.group_type.value == 0){
					// 	// groupSiteId = records.id;
					// 	showAddJsSiteGroupListInfo(1, records.id, records);
					// }
					addJsSiteGroup(records.id, records.group_name.show);
				}
			}
			
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示主机群组列表
function showAddJsSiteGroupListInfo(num, id, record){
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
		  			+ '<td><a class="label label-primary" href="javascript:addJsSiteGroup(\''+ id +'\',\''+ record.group_name.show +'\')">选择</a></td>'
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
function addJsSiteGroup(id, name){
	$("#host_site_group1").val(name);
	$("#host_site_group").val(id);
	tek.macCommon.waitDialogHide(0,null);

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
				tek.macCommon.waitDialogShow("", '创建成功!',null,0);
				tek.macCommon.waitDialogHide(3000,null);
			}
		},
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//-------------------------------------------------------------------------------

// 获取新建主机信息
function getNewSite(){
	var setting = {operateType: '获取新建主机信息'};
	var sendData = {
		objectName: "HostSite",
		action:"getNew",
	}
	var callback = {
		success: function (data) {
			var record = data.record;
			if(record){
				$("#host_site_user").val(myName);
				$("#host_site_contact").val(myName);
				// $("#host_site_group").val(myName);
				getSiteTags();
			}else{
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
		html += '<label>'
			 + '<input type="checkbox" name="item_host_site_tags" id="host_site_tags_'+ num +'" value="'+ record.name +'">'
			 + record.name
			 + '</label>';
			 $("#host_site_tags").append(html);
	}

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

//添加主机标签的对象字典
function addHostSiteTagsInfo(){
	var tag = $("#add_host_site_tags").find('input').val();
		var setting = {operateType: '获取对象字典中的主机标签'};
	var sendData = {
		objectName: "ObjectDictionary",
		action:"addInfo",
		dictionary_targetObject: "HostSite",
		dictionary_targetFields: "host_site_tags",
		dictionary_language:"zh_CN",
		dictionary_name:tag,
		dictionary_original:tag
	}
	var callback = {
		success: function (data) {
			if(data){
				tek.macCommon.waitDialogShow("", '添加成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'getSiteTags()');
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//新建主机
function addNewSite(){
	var formData = getFormData();

	// console.log(formData);
	
	var setting = {operateType: "新建主机"};
	var sendData = tek.Utils.mergeForObject({
            objectName: "HostSite", 
            action: "addInfo", 
        }, formData);
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null,"<div class='col-md-12 col-sm-12 center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function (data) {
			if(data){
				hostSiteId = (data.value).split("=");
				addIpowerMonitorHost(formData);
				tek.macCommon.waitDialogShow("", '新建主机成功!',null,2);
				tek.macCommon.waitDialogHide(3000,'showHostSite()');
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

//管理台主机新建
function addIpowerMonitorHost(siteData){
	var ajaxURL = "http://10.128.0.211/ipower/ip/api_jsonrpc.php";
	var params = '';
	params += '"host":"' + siteData.host_site_name + '",';
	params += '"interfaces":[{';
		params += '"type":1,"main":1,"useip":1,"ip":"127.0.0.1","dns":"","port":"10050"';
	params += '}],';
	params += '"groups":[{"groupid":"10"}]';
	// params += '"templates":[{"templateid":""}]';
	// params += '"inventory_mode":0,';
	// params += '"inventory":{"macaddress_a":"","macaddress_b":""}';

	var param = "" + params;
    var request = '';
    request += '{';
    request += '"auth":"'+ ipowerAudit +'",';
    request += '"id":1,';
    request += '"jsonrpc":"2.0",';
    request += '"method":"host.create",';
    // request += '"method":"hostgroup.get",';
    // request += '"params":{"output":"extend","searchByAny":"true"}';
    request += '"params":{'+ param + '}';
    request += '}';

	$.ajax({
		type:"POST",
		url:ajaxURL,
		headers:{
			"Content-Type":"application/json-rpc",
			"ACCEPT":"application/json-rpc,text/javascript, text/html, application/xml, text/xml, */*"
		},
		data:"" + request,
		dataType:"json",
		processData:false,
		success: function(data){
			// console.log(data);
			if(data){
				if(data.result != null){
					var ipowerHostId = data.result.hostids[0];
					setHostHostId(ipowerHostId);
				}else{
					// tek.macCommon.waitDialogShow(null, errorMsg);
				}
			}else{
				// tek.macCommon.waitDialogShow(null, errorMsg);
			}
		},
        error: function (data, errorMsg) {
           	tek.macCommon.waitDialogShow(null, errorMsg);
           	tek.macCommon.waitDialogHide(3000);
        }
	})
}

//更新主机信息中的管理台主机id
function setHostHostId(ipowerHostId){

	// console.log(params);
	
	var setting = {operateType: "更新主机"};
	var sendData = tek.Utils.mergeForObject({
            objectName:"HostSite", 
            action:"setInfo", 
            host_site_id:hostSiteId[1],
            host_host_id:ipowerHostId,
        });
	var callback = {
		success: function (data) {
			if(data){
				// tek.macCommon.waitDialogHide(3000,'showHostSite()');
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


// 获取提交表单数据（同时校验）
function getFormData() {
    var params = tek.Utils.getFromJSON(document.getElementById("site_sub_form"));

    params["host_site_buytime"] = tek.dataUtility.stringToDate(params.host_site_buytime, 'yyyy-MM-dd').getTime();
    // params["host_site_stoptime"] = tek.dataUtility.stringToDate(params.host_site_stoptime, 'yyyy-MM-dd HH:mm').getTime();
    params["host_site_group"] = tek.dataUtility.stringToInt(params.host_site_group);
    params["host_site_contact"] = myId;
    params["host_site_mac"] = 0;
    params["host_site_user"] = myId;
    params["host_site_tags"] = "";
    for(var i in params["item_host_site_tags"]){
    	params["host_site_tags"] += params["item_host_site_tags"][i] + ";";
    }
    return params;
}