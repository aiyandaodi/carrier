// JavaScript Document

//===================================================Parameter==================================
var subjectType; //主题类型
var groupId;  //小组表示id
var curCatalog;
var PARAMS = {};
var request = tek.common.getRequest();

function init(){
    //getNewSubject();
	subjectType = request["subject_type"];
	groupId = request["group_id"];
	if(groupId){
		$(".isHide").css('display','block');
		$("#subject_group").attr('value',groupId);
	}
	getTags();
	$(document).on("focus", "#subject_catalogText", function() {
        getCatalog();
        $(this).blur();
        openCatalogModal();
    });
	
	$('.formDatetimepicker').datetimepicker({
		format: 'yyyy-MM-dd hh:mm',
		pickTime: false,  
		forceParse: true,
		autoclose: 1,
		language: 'zh-CN',
		todayBtn: true,
		inputMask: true,
		startDate: new Date(),
		startView: 'hour'
	});
	
	
}
//获得显示的字段
/*
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
			//getTags();
			//获取目录分类
			//getCatalog();
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	
}


function showSubjectContent(record){
	if(!record){
		return;
	}
	
	var html1 = '';
	
	
	html1 += '<div class="pull-left">'
		+ '<h5>主题类型</h5>'
		+ '<div class="bor bg-success"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>'
		+ '<div class="form-group">'
		+ '<label for="user" class="col-md-2 col-sm-4 control-label"></label>'
		+ '<div class=" col-sm-8">';
	
	//主题类型
	var subjecttypes = request['subject_type'];
	if(record.subject_type){
		var field = record.subject_type;
		
		var shows = field.shows;
		if(shows){
			for(var i in shows){
				html1 += '<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionsRadios1" value="option1"> &nbsp;'+ shows[i] +'</label>'
		
			}
		}
		html1 += '</div>';
		html1 +='</div>'
			+ '<hr/>'
			+ '<div class="pull-left">'
			+ '<h5>基本信息</h5>'
			+ '<div class="bor bg-success"></div>'
			+ '</div>'
			+ '<div class="clearfix"></div>';
	}
	
	
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
			+ '<div class="col-md-10 col-sm-8">'
			+ '<input type="text" class="form-control" id="subject_tags" name="subject_tags" placeholder="标签分类">'
			+ '</div>'
			+ '</div>';
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
					+ '<input name="' + field.name + '" id="' + field.name + '_' + i + '" class="form-horizontal" type="radio" onchange="subjectStatusOnchange('+ statusSelects[i] +');"'
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

*/

//提交信息，选择发布时间
function sendDataAdd(){
	var target = document.getElementById('add_form');
	if(!target){
		return alert("系统错误！ 请与管理员联系！");
	}
	
	var formData = $("#add_form").serialize();
	PARAMS = strToJSON(formData) || {}; //转为json
	if(PARAMS.subject_summary == ""){
		PARAMS["subject_summary"] = PARAMS["subject_name"];
	}
	if(PARAMS.subject_name == "" || !PARAMS.subject_name ){
		target.subject_name.placeholder = "请输入你的问题";
		target.subject_name.focus();
		
		//错误提示
		tek.macCommon.waitDialogShow(null, "问题不能为空", null, 0);
		tek.macCommon.waitDialogHide(3000);
		
		return;
	}
	
	var date = new Date();
	var startTimeStr = tek.dataUtility.dateToString(date,"yyyy-MM-dd HH:mm");
	$('#subject_date').val(startTimeStr);
	$("#date-modal-dialog").modal('show');
	
	
}

/*提交问题*/
function submitAdd(){
	$("#date-modal-dialog").modal('hide');
	var setting = {
		async: true,
		operateType: "提交主题新建"
	};
	/*var target = document.getElementById('add_form');
	if(!target){
		return alert("系统错误！ 请与管理员联系！");
	}
	var setting = {
		async: true,
		operateType: "提交主题新建"
	};
	var formData = $("#add_form").serialize();
	var sendData = strToJSON(formData) || {}; //转为json
	if(sendData.subject_summary == ""){
		sendData["subject_summary"] = sendData["subject_name"];
	}*/
	 var newDate = getLongDateByStringDate($("#subject_date").val());
	if (newDate){
		PARAMS["subject_date"] = newDate;
	}
		
	//sendData["subject_date"] = $("#subject_date").val();
	PARAMS["objectName"] = "Subject";
	PARAMS["action"] = "addInfo";
	PARAMS["upload-temp"] = 1;
	PARAMS["subject_type"] = subjectType;
	/*var contentHTML =  $('#subject_summary').summernote('code');
	sendData["blob-input"] = encodeURIComponent(contentHTML);*/

	/*if(!sendData.subject_name || sendData.subject_name == ""){
		target.subject_name.placeholder = "请输入你的问题";
		target.subject_name.focus();
		
		//错误提示
		tek.macCommon.waitDialogShow(null, "问题不能为空", null, 0);
		tek.macCommon.waitDialogHide(3000);
		
		return;
	}*/
	
	/*if(!sendData.subject_tags || sendData.subject_tags == ""){
		tek.macCommon.waitDialogShow(null, "主题标签不能为空！", null, 0);
		tek.macCommon.waitDialogHide(3000);
		
		return;
	}*/
	
	var callback = {
		beforeSend: function(){
			$("#closeLogin").hide();
			var msg = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在提交，请稍候!</p>";
			tek.macCommon.waitDialogShow(null, msg, null, 2);
		},
		success: function(data){
			if(data.code == 0){
				var value = data.value;
				if(value && value.length >= 11){
					tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + " 即将进入读取页面</p>", null, 2)
				}
				if (updateOpener == 1) {
                    // 刷新父页面
                    tek.refresh.refreshOpener(null, request["refresh-opener-func"]);
                }
				
				
                setTimeout(function () {


                    tek.macCommon.waitDialogHide();


                    var url = tek.common.appendURLParam("read-qa.html", "subject_id", value.substr(11));
                   
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
		error: function (data, errorMsg) {
            $("#closeLogin").show();

            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        },
		complete: function(){
			//window.close();
		}
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, PARAMS, callback);
}




















