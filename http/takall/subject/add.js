// 地址栏参数
var request = tek.common.getRequest();

var ajaxURL = tek.common.getRootPath() + "servlet/tobject";
var subjectType; //主题类型
var groupId; //小组标识id
var curCatalog;

// 初始化
function init() {
	// 判断是否登录
	if(tek.common.isLoggedIn()){
		//showUserInfo();
		subjectType = request["subject_type"];
		curCatalog = (request && request["subject_catalog"] ? decodeURIComponent(request["subject_catalog"]) : "") + '';
		groupId = request["group_id"];
		if(subjectType && subjectType == 2){
			$("#h4Title").html("新建影集");
		}

		if(groupId){
			getNewSubject();
		}

		updateOpener=request['refresh-opener'];

		if(updateOpener && (updateOpener==1 || updateOpener==true)){
				updateOpener=1;
		}else{
			updateOpener=0;
		}

		showClose=request['show-close'];

		if(showClose && (showClose==1 || showClose==true)){
			showClose=1;
		}else{
			showClose=0;
		}

		$("#private").attr("value",myId);

	}else{
		console.log("没有登录");
		returnPage();
	}
}

// 获得显示的字段
function getNewSubject() {
	
	if(!groupId){
		return ;
	}
	var setting = {
		operateType : "获取主题的新建域"
	};
	var sendData = {
		objectName: "Subject",
		action: "getNew",
		group_id: groupId
	};
	var callback = {
		beforeSend: function(){
			$("#subject-info-div-left-content").html("<div class='admin-form center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
			
		},
		success: function(data){
			var record = data["record"];
			if(record){
				record = !record.length ? record : record[0];
				showSubjectContent(record);
			}else{
				$("#subject-info-div").html("<div class='admin-form center'><h3 class='title'>没有可编辑的字段！</h3></div>");
			}
		},
		error: function(data, errorMsg){
			$("#subject-info-div").html(errorMsg);
		},
		complete: function(){
			//获取所有的类型
			//getAllType();
			//获取标签分类
			getTags();
			//获取目录分类
			//getCatalog();
			
			
			$(document).on("focus", "#subject_catalogText", function() {
				getCatalog();
				$(this).blur();
				openCatalogModal();
			});
			
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	
}

//显示内容
function showSubjectContent(record){
	if(!record){
		return;
	}
	
	var html1 = '';

	html1 += '<div class="pull-left">'
		+ '<h5>基本信息</h5>'
		+ '<div class="bor bg-success"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>';
	
	
	//主题名称
	if(record.subject_name) {
		var field = record.subject_name;
		
		html1 += "<div class='form-group'>"
			+ '<label class="col-md-2 col-sm-4 control-label" for="item_'+ field.name +'">'+ field.display +'</label>'
			+ '<div class="col-md-10 col-sm-8">'
			+ '<input name="' + field.name + '" id="' + field.name + '" class="form-control" type="text" placeholder="请输入主题名">'
			+ '</div>'
			+ '</div>';
	}
	
	//主题作者
	if(record.subject_author){
		var field = record.subject_author;

        html1 += '<div class="form-group">'
			+ '<label class="col-md-2 col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-md-10 col-sm-8">'
			+ '<input name="' + field.name + '" id="' + field.name + '" class="form-control" type="text" value="' + (field.show || "") + '">'
			+ '</div>'
			+ '</div>';
	}

	//内容提要
    if (record.subject_summary) {
        var field = record.subject_summary;

        html1 += '<div class="form-group">'
			+ '<label class="col-md-2 col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-md-10 col-sm-8">'
			+ '<textarea name="' + field.name + '" id="' + field.name + '" class="form-control" placeholder="备注说明" rows="8" >' + tek.dataUtility.stringToInputHTML(field.show) + '</textarea>'
			+ '</div>'
			+ '</div>';
    }
	
	html1 += '<hr/>'
		+ '<div class="pull-left">'
		+ '<h5>分类</h5>'
		+ '<div class="bor bg-orange"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>';
							
					
	//主题目录分类
	if (record.subject_catalog) {
		var field = record.subject_catalog;
		html1 += '<div class="form-group" id="zhutimulu">'
			+ '<label class="col-md-2 col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-md-10 col-sm-8">'
			+ '<input name="' + field.name + 'Text" id="' + field.name + 'Text" class="form-control"  type="text" placeholder="目录分类">'
			+ '<input name="' + field.name + '" id="' + field.name + '" type="hidden" value="' + (field.value || "") + '" />'
			+ '</div>'
			+ '</div>';
	}
	
	//标签分类
	if (record.subject_tags) {
        var field = record.subject_tags;

        html1 += '<div class="form-group">'
			+ '<label class="col-md-2 col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-md-10 col-sm-8"><ul id="subject_tags_ul" class="col-md-12 radio-checkbox-ul">'
			+ '<li><img src="' + tek.common.getRootPath() + 'http/images/waiting-small.gif" /></li>'
			+ "</ul></div>"
			+ "<div class='clearfix'></div></div>";
			
	
	
    }
	
	//所属小组
    if (record.subject_group) {
        var field = record.subject_group;

        $("#add-subject-title").html("在[ " + (field.show || '') + " ]频道下新建主题");

        html1 += '<div class="form-group hidden">'
		+ '<label class="col-md-2 col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
        + '<div class="col-md-10 col-sm-8">'
		+ '<input name="' + field.name + '" id="' + field.name + '" class="form-control" type="hidden" value="' + (field.value || '') +'" />'
        + '</div>'
		+ '</div>';
    }

	$("#subject-info-div-left-content").html(html1);
	
	
	//右侧栏数据
	var html2 = '';
	html2 += '<div class="pull-left">'
		+ '<h5>权限</h5>'
		+ '<div class="bor bg-success"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>';
		
	//阅读权限
	if(record.subject_listen){
		var field = record.subject_listen;
		var listenSelects = field.selects;
		var listenShows = field.shows;
		if(tek.user.isNormal(mySecurity) && tek.role.isAuditor(myRole)){
			html2 += '<div class="form-group">';
		}else {
			html2 += '<div class="form-group" style="display:none;">';
		}
		html2 += '<label for="document_right" class=" col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="div-right col-sm-8">'
			+ '<ul class="right-radio-ul">';
		if(listenSelects && listenSelects.length > 0){
			for(var i in listenSelects){
				html2 += "<li>"
					+ '<input name="' + field.name + '" id="' + field.name + '_' + i + '" class="form-horizontal" type="radio"'
					+ ((field.value == listenSelects[i]) ? 'checked' : '') + ' value="' + listenSelects[i] + '" />'
					+ '<label class="form-horizontal" for="' + field.name + '_' + i + '" > ' + listenShows[i] + '</label>'
					+ '</li>';
			}
		}
		html2 += '</ul></div></div>';
		html2 += '<div class="clearfix"></div>';
	}
	
	
	//附加文档属性
	if(record.subject_speak){
		var field = record.subject_speak;
		
		var speakSelects = field.selects;
		var speakShows = field.shows;
		if(tek.user.isNormal(mySecurity) && tek.role.isAuditor(myRole)){
			html2 += '<div class="form-group">';
		}else{
			html2 += '<div class="form-group" style="display:none;">';
		}
		
		html2 += '<label for="document_right" class=" col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="div-right col-sm-8">	'
			+ '<ul class="right-radio-ul">';
		if(speakSelects && speakSelects.length > 0){
			for(var i in speakSelects){
				html2 += '<li>'
					+ '<input name="' + field.name + '" id="' + field.name + '_' + i + '" class="form-horizontal" type="radio"'
					+ ((field.value == speakSelects[i]) ? ' checked' : '') + ' value="' + speakSelects[i] + '" />'
					+ '<label class="form-horizontal" for="' + field.name + '_' + i + '" >' + speakShows[i] + '</label>'
					+ '</li>';
			}
		}
		html2 += '</ul></div></div>';
	}
	
	//主题状态
	var selectedStatus = 0;
	if(record.subject_status){
		var field = record.subject_status;
		
		var statusSelects = field.selects;
		var statusShows = field.shows;
		
		html2 += '<div class="form-group" id="subject_status_form">'
			+ '<label for="document_right" class=" col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="div-right col-sm-8">	'
			+ '<ul class="right-radio-ul">';
		if(statusSelects && statusSelects.length > 0){
			for(var i in statusSelects){
				html2 += '<li>'
					+ '<input name="' + field.name + '" id="' + field.name + '_' + i + '" class="form-horizontal" type="radio" '
					+ ((field.value == statusSelects[i]) ? ' checked' : '') + ' value="' + statusSelects[i] + '" />'
					+ '<label class="form-horizontal" for="' + field.name + '_' + i + '" >' + statusShows[i] + '</label>'
					+ '</li>';
				if(field.value == statusSelects[i]){
					selectedStatus = statusSelects[i];
				}
			}
		}
		html2 += '</ul></div></div>';
	}
	$("#subject-info-div-right-content").html(html2);
}


// 提交信息
function submitAdd(){
	var target = document.getElementById('add_form');
	if(!target){
		return alert("系统错误！ 请与管理员联系！");
	}

  	var setting = {
  		async: true,
  		operateType: "提交主题新建"
  	};
  	var formData = $("#add_form").serialize();
  	var sendData = strToJSON(formData) || {};	//转为json

  	sendData["objectName"] = "Subject";
  	sendData["action"] = "addInfo";
  	sendData["upload-temp"] = 1;
  	sendData["subject_type"] = subjectType;

  	if(!sendData.subject_name || sendData.subject_name == ""){
		target.subject_name.placeholder = "请输入你的问题";
		target.subject_name.focus();
		
		//错误提示
		tek.macCommon.waitDialogShow(null, "问题不能为空", null, 0);
		tek.macCommon.waitDialogHide(3000);
		
		return;
	}

	if(!sendData.subject_tags || sendData.subject_tags == ""){
		tek.macCommon.waitDialogShow(null, "主题标签不能为空！", null, 0);
		tek.macCommon.waitDialogHide(3000);
		
		return;
	}

	var callback = {
		beforeSend: function(){
			$("#closeLogin").hide();
			var msg = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />正在提交，请稍后！</p>";
			tek.macCommon.waitDialogShow(null, msg, null, 2);
		},
		success: function(data){
			var value = data.value;
			if(value && value.length >= 11){
				tek.macCommon.waitDialogShow(null, "<p class='text-center'>" + data.message + "即将进入主题编辑。</p>", null, 2);

				if (updateOpener == 1) {
                    // 刷新父页面
                    tek.refresh.refreshOpener(null, request["refresh-opener-func"]);
                };
                setTimeout(function(){
                	tek.macCommon.waitDialogHide();

                	var url = tek.common.appendURLParam("edit.html", "subject_id", value.substr(11));

                	if(showClose)
	                    url=tek.common.appendURLParam(url, "show-close", showClose);
					if(callbackURL)
	                    url=tek.common.appendURLParam(url, "callback-url", callbackURL);
					if(updateOpener)
	                    url=tek.common.appendURLParam(url, "refresh-opener", updateOpener);
					if(updateOpenerFunc)
	                    url=tek.common.appendURLParam(url, "refresh-opener-func", updateOpenerFunc);

                    location.href = url.toString();
                }, 2000);
			}
		},
		error: function(data, errorMsg){
			$("#closeLogin").show();

			tek.macCommon.waitDialogShow(null, errorMsg);
			tek.macCommon.waitDialogHide(3000);
		},
		complete: function(){

		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 返回
function goBack(){
	window.history.go(-1);
}

// 获取表单中的值,变成参数
function getInputVal(){
	var addcontact_params = {};

	// 联系信息名字
	var name = $("#contact_name").val();
	if(!name && (name.length < 1 || name.length > 64)){
		showTips("name","名称长度不正确");
		return;
	}else{
		showTips("name","");
	}

	addcontact_params["contact_name"] = encodeURI(name);

	addcontact_params["contact_owner"] = CONTACT_OWNER;

	var remark = checkRemark();
	if(!remark){return;}
	addcontact_params["contact_remark"] = remark;

	// 阅读属性
	// var read = $(".read-property input:radio:checked").val();
	addcontact_params["contact_property"] = 64;//默认值

	if(CONTACT_OWNER == 0){
		//公共【不显示以下的字段】
		addcontact_params["contact_catalog"] = "0";
		addcontact_params["contact_tags"] = "0";
		addcontact_params["contact_color"] = "0";
	}else{
		// 只有当前记录所有者存在的时候【contact_owner】,才使用个人的目录分类，标签分类，颜色分类
		// 机构和专家的联系信息新建都属于私有联系信息
		// 私有，CONTACT_OWNER=myId;,以下的值是从表单中获取
		addcontact_params["contact_catalog"] = "catalog";
		// addcontact_params["contact_tags"] = $("#contact_tags").val();
		// 获取contacts_tags的值
		var checkBox = $("#coantact-common-tags-ul input");
		var len = checkBox.length;
		var temp_val = "";
		var temp_input = null;
		for(var i = 0; i < len; i++ ){
			temp_input = checkBox[i];
			if(temp_input.checked){
				temp_val += encodeURI($(temp_input).attr("value")) + ";";
			}
		}

		if(temp_val.length === 0){
			showTips("tags","请选择标签");
			return;
		}else{
			showTips("tags","");
		}
		addcontact_params["contact_tags"] = temp_val;
		addcontact_params["contact_color"] = $("#contact_color").val() || 0;
	}

	addcontact_params["contact_objectName"] = URLObjectName;
	addcontact_params["contact_objectId"] = URLObjectId + "";

	return addcontact_params;
}

function checkRemark(that){
	var val = $("#contact_remark").val();
	var len = val.length;

	if(len < 2){
		showTips("remark","内容长度不正确");
		return false;
	}else{
		showTips("name","");
	}

	return val;
}


function showError(data,message){
	var timerMsg="";
    tek.macCommon.waitingMessage(tek.dataUtility.stringToHTML(data.message), timerMsg);
    $("#waiting-modal-dialog").modal("show");
}


function showTips(ele,tips){
	$("#" + ele + "_tips").text(tips).css({
		color : 'red'
	});
}
