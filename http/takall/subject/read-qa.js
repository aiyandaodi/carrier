// JavaScript Document

/*var SUBJECT_RIGHT = 0; //主题权限
var SUBJECT_GROUP=0;  //主题所属小组
var SUBJECT_TYPE;	//主题类型
var SUBJECT_OWNER; //问答拥有者
var isShowSameSubject = false; //是否已经读取相关主题
var isShowRecommendSubject = false; // 是否已经读取推荐主题*/
var isEdit = true;	//主题是否可编辑
var subjectId;
var request = tek.common.getRequest();
var TOTAL; //文档总数
var SKIP = 0; //数据条数
var COUNT = 5; //每页显示条数
var IMGSRC = '';
var NUM = 1;
var ICON;
//相关主题栏配置
var SAME_SUBJECT_COUNT = 5;	//显示主题数
var isShowSameSubject = false; //是否已经读取相关主题

/*初始化*/
function init(){
	subjectId = request["subject_id"];
	if(subjectId && subjectId.length > 0){
		readSubject();
	}else{
		showError("主题未找到!");
	}
	
	$("#summernote_pc").summernote({
		height: 'auto',                 // set editor height
		minHeight: 150,             // set minimum height of editor
		maxHeight: null,             // set maximum height of editor
		lang: 'zh-CN',
		focus: true,			// set focus to editable area after initializing summernote
		airMode: true,
		placeholder: '在此输入...'
	})
	
	
	//获取文档新建域
	getEditDocument();
	/*获取本地登录用户信息*/
	tek.common.getUser();
	readUser(myId, ".reply_icon");

	$("#reply_author").html(myName);
}


//------------------------------------------------------

//显示主题信息
function showSubjectInfo(record){
	if(!record){
		return;
	}
	
	//标题
	$("#subject_name").html(tek.dataUtility.stringToHTML(record.name));
	$("#edit_subject_name").attr('value',tek.dataUtility.stringToHTML(record.name));
	//内容摘要
	if (record.subject_summary) {
		 var show = record.subject_summary.show || "";
        $("#subject_summary").html(tek.dataUtility.stringToHTML(show));
		
		
    }
	
	
	//作者
	if(record.subject_author){
		$("#subject_author").html(SUBJECT_AUTHOR.show);
	}
	//发布时间
	if(record.subject_date && record.modifyTime){
		if(record.subject_date.show == record.modifyTime.show){
			var show = record.subject_date.show || "";
			var firstTime = record.subject_date.value;
			$("#subject_date").html(", " + tek.dataUtility.stringToHTML(show));
		}else{
			var show = record.modifyTime.show || "";
			var firstTime = record.modifyTime.value;
			$("#subject_date").html(", " + tek.dataUtility.stringToHTML(show));
		}
		var date = new Date().getTime();
		if(isEdit && date-firstTime < 1000*60*60){
			$("#editBtn").removeClass("hide");
		}else{
			$("#editBtn").addClass("hide");
		}
	}
	
	
	if(SUBJECT_OWNER){
		readUser(SUBJECT_OWNER.value, '.user_icon');
	}
	//标签
	/*if(SUBJECT_TAGS){
		var target = document.querySelector('.tag');
		var tags = SUBJECT_TAGS.split(";");
		var html = "";
		for(var i in tags){
			if(tags[i]){
				html += '<li><a href="javascript:;">' + tags[i] + '</a></li>';
			}                
		}
		target.insertAdjacentHTML('BeforeEnd', html);
	}*/
	//主题状态
	if(SUBJECT_STATUS){
		showOrHide(SUBJECT_STATUS);
		$("#change-subject-status").find("option[value='" + SUBJECT_STATUS + "']").attr("selected",true);
	}
}
//编辑问题
function editQuestion(){
	var subjectName = $("#subject_name").html();
	var subjectSummary = $("#subject_summary").html();
	
	getWidth();
	if(winWidth < CHANGE_WIDTH){
		var url = tek.common.getRootPath() + "http/takall/subject/edit-qa.html?subject_id=" + subjectId;
		url += '&subject_name=' + encodeURIComponent(SUBJECT_NAME) + '&subject_summary=' + encodeURIComponent(SUBJECT_SUMMARY);
		url += '&edit=1&show-close=1&refresh-opener=1';
		window.open(url);
	}else{
		
		$('#edit_subject_name').val(subjectName);
		$('#edit_subject_summary').val(subjectSummary);
		$("#edit-modal-dialog").modal("show");
	}
	
	
}
//取消修改问题
function cancelSubjectNameBtn(){
	$("#subject_name").removeClass('hide');
	$("#edit_subject_name").val($("#subject_name").html());
	$(".isHide").css('display','none');
}
//提交修改问题
function addSubjectNameBtn(){
	$("#edit-modal-dialog").modal('hide');
	var editSubjectName = document.getElementById('edit_subject_name');
	var editSubjectSummary = document.getElementById('edit_subject_summary');
	if(!subjectId){
		return ;
	}
	var setting = {operateType: "提交主题编辑"};
	var sendData = {};
	sendData["objectName"] = "Subject";
	sendData["action"] = "setInfo";
	sendData["subject_id"] = subjectId;
	sendData["subject_type"] = 1;
	sendData["subject_name"] = editSubjectName.value;
	
	if(editSubjectSummary.value == ""){
		sendData["subject_summary"] = editSubjectName.value;
	}else{
		sendData["subject_summary"] = editSubjectSummary.value;
	}
	var callback = {
		beforeSend: function(){
			$("#closeLogin").hide();
            var msg = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />主题修改中，请稍候!</p>";
            tek.macCommon.waitDialogShow(null, msg, null, 2);
		},
		success: function(data){
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>", null, 2);
			tek.macCommon.waitDialogHide(1500);
			
			/*$("#subject_name").removeClass('hide');
			$("#subject_name").html(editSubjectName.value);
			$(".isHide").css('display','none');*/
			if(request['edit'] && request['edit'] == 1){
				var url = tek.common.getRootPath() + "http/takall/subject/read-qa.html?subject_id=" + subjectId + '&subject_type=1';
				location.href = url;
			}else{
				setTimeout(function(){
					location.reload(1500);
				}, 1500)
					
			}
			
		},
        error: function (data, errorMsg) {
            $("#closeLogin").show();
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + errorMsg + "</p>", null, 2);
			tek.macCommon.waitDialogHide(1500);

        }
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
//显示错误的信息
function showError(message) {
   
	var msg = message || "主题未找到！"
	tek.macCommon.waitDialogShow(null, msg);
	tek.macCommon.waitDialogHide(1500);
}


//显示等待加载图标
function showWaitingImg(displayWaiting) {
    var html = "";
    if (displayWaiting == true) {
        html += "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' alt='waiting...'/>";
    }
   //$("#subject_info_ul_1").html("<li class='loading center loading-style'>" + html + "</li>");
   if (tek.user.isNormal(mySecurity) && tek.role.isAuditor(myRole)) {
    $("#subject_summary").html("<div class='loading center'>" + html + "</div>");
   }
    /*var nhtml = "<div id='waiting_icon' class='loading-big center'>" + html + "</div>";
    $("#subject_content").html(nhtml);*/
}


//===================================================================================================
//修改主题状态
function changeSubjectStatus(value) {
	//权限判断
	if (!tek.right.isCanAdmin(SUBJECT_RIGHT)) {
		//显示等待提示信息
		tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >您没有当前主题管理权限，不能更改当前主题状态</p>");
		//隐藏提示信息与域
		tek.macCommon.waitDialogHide(3000);
		return;
	}

	//主题状态更改为发布
	value = parseInt(value);
	if (value == 1 && SUBJECT_TYPE == "1") {
		//弹出框，选择发布时间
		//popupForSubjectDate();
	} else {
		//提交主题更改
		commitSubjectChange(value, null);
	}
}

//提交主题更改
function commitSubjectChange(status, formId) {
	if (!subjectId)
		return;

	var setting = {operateType: "更改主题状态"};
	var sendData = {
		objectName: "Subject",
		action: "setInfo",
		subject_id: subjectId,
		subject_status: status,	//主题状态
		"keep-time": 1
		
	};

	//主题发布时间
	/*if (formId) {
		var formData = $("#" + formId).serialize();
		formData = strToJSON(formData) || {};	//转为json
		formData = formData.subject_date + " " + formData.subject_date_hour + ":" + formData.subject_date_min + ":" + formData.subject_date_sec;
		if (formData && formData.length > 0) {
			var newDate = getLongDateByStringDate(formData);
			if (newDate)
				sendData["subject_date"] = newDate;
		}
	}*/

	var callback = {
		beforeSend: function () {
			//显示等待提示信息
			var html = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在修改主题状态...</p>";
			tek.macCommon.waitDialogShow("修改主题状态", html);
		},
		success: function (data) {
			//存储当前状体
			SUBJECT_STATUS = status;

			var statusText = $("#change-subject-status > option:selected").html();
			/*var statusInfo = $("#subject_info_ul > li:first-child").html();
			if (statusInfo && statusInfo.substring(0, 2) == "状态") {
				$("#subject_info_ul > li:first-child").html(statusInfo.substring(0, 5) + statusText);
			}*/

			tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >主题状态修改成功！</p>");
		},
		error: function (data, errorMsg) {
			showError(errorMsg);
		},
		complete: function () {
			//显示哪些按钮，回复区什么的隐藏和显示 //发布1   禁止-1   申请0
			showOrHide(SUBJECT_STATUS);
			//隐藏提示信息与域
			tek.macCommon.waitDialogHide(2000);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

 
/* 更多回答 */
function moreBtn(){
	readHtmlDocument();
}

//显示哪些按钮，回复区什么的隐藏和显示
function showOrHide(status) {
	//发布1   禁止-1   申请0
	status = parseInt(status);
	switch (status) {
		//发布
		case 1:
			//回复区域 显示
			$("#reply-form").show();
			
			//改变状态背景
			$("#change-subject-status").removeClass("btn-apply").removeClass("btn-finish").addClass("btn-release");
			break;
		//申请
		case 0:
			//回复区域 隐藏
			$("#reply-form").hide();
			
			//改变状态背景
			$("#change-subject-status").removeClass("btn-release").removeClass("btn-finish").addClass("btn-apply");
			break;
		//禁止
		case -1:
			//回复区域 隐藏
			$("#reply-form").hide();
			//改变状态背景
			$("#change-subject-status").removeClass("btn-release").removeClass("btn-apply").addClass("btn-finish");
			break;

		default:
			break;
	}
}


//用户信息	
/*function readUser(userId, imgId) {
	var setting = {operateType: "读取用户信息"};
	var sendData = {
		objectName: "User",
		action: "readInfo",
		user_id: userId,
		icon: 1
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#user_basic_info").html(html);
		},
		success: function (data) {
			var record = data["record"];

			if (record) {
				record = !record.length ? [record] : record;
				if(record.icon){
					$(imgId).attr('src',record.icon);
				}else{
					$(imgId).attr('src','images/1.jpg');
				}
				
			} 
		},
		error: function (data, errorMsg) {
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	
}*/
















