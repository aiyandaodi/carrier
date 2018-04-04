/* 主题编辑页面 edit.js */
//============================================== Parameter ===========================
var subjectType;	//主题类型
var subjectTags;	//主题标签
var subjectCatalog;	//主题目录
var subjectDocumentId = "";	//主题概要，用于 默认用户没有输入时，存储上传文档的id
var subjectSummary = "";	//主题概要，用于 存储用户主题概要
var curCatalog;

var subjectId;	//主题标识
var request = tek.common.getRequest();


var DOCUEMNT_UPLOAD_TYPE = {action: "addInfo", id: "0"};
function init(){
	/*if(request){
		
		subjectId = request["subject_id"] || request["document_subject"];
		if(subjectId && subjectId.length > 0){
			getSubjectEdit();
		}else{
			//未加入任何小组
			var msg = "<div class='admin-form center'><h3 class='title'>未指定主题标识！- 没有数据</h3></div>";
			$("#subject-info-div").html(msg);
		}
	}*/

	subjectId = request["subject_id"];
	 //设置上传文件的方式
    DOCUEMNT_UPLOAD_TYPE["action"] = "addInfo";
    DOCUEMNT_UPLOAD_TYPE["id"] = subjectId;

	if(subjectId && subjectId.length > 0){
		getSubjectEdit();
	}else{
		showError("主题未找到!");
	}
} 
//================================================ Function ==============================
//取得主题的编辑域
function getSubjectEdit(){
	if(!subjectId){
		return ;
	}
	var setting = {async: false,operateType: "取得主题的编辑域"};
	var sendData = {
		objectName: 'Subject',
		action: 'getEdit',
		subject_id: subjectId
	};
	var callback = {
		beforeSend: function(){
			$("#subject-info-div-left-content").html("<div class='admin-form center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");

		},
		success: function(data){
			var record = data["record"];
			var name = record["name"];
			if(record){
				record = !!record.length ? record[0] : record;

				//主题类型
				if(record.subject_type){
					var url = tek.common.getRootPath();
					if(record.subject_type.value == 2){
						url += "http/takall/subject/index.html?index=1";
					}
				}

				showSubjectContent(record);

				//取得原目录显示名
				getCatalogShow(record);

				//默认加载一次附件列表subject_keywords_form
				getDocumentIcons();
			}else{
				//未加入任何小组
				$("#subject-info-div").html("<div class='admin-form center'><h3 class='title'>没有可编辑的字段！</h3></div>");
			}
		},
		error: function(data, errorMsg){
			if(data && data.right == 0){
				if(!tek.common.isLoggedIn()){
					return login();
				}
			}else{
				$("#subject-info-div").html(errorMsg);
			}
		},
		complete: function(data){
			//取得所有的类型
            //getAllType(subjectType);
            //获取标签分类
            getTags(subjectTags);
            //获取目录分类
             getCatalog(subjectCatalog);
            //获取发布频道
            //getkeywordsType(subjectKeywords);

            $(document).on("focus", "#subject_catalogText", function() {
				getCatalog();
				$(this).blur();
				openCatalogModal();
			});
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

function showSubjectContent(record){
	if(!record){
		return ;
	}
	groupId = !!record.subject_group ? record.subject_group.value : "";

	var html1 = "";

	html1 += '<div class="pull-left">'
		+ '<h5>基本信息</h5>'
		+ '<div class="bor bg-success"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>';

	//主题名称
	if(record.subject_name){
		var field = record.subject_name;

		html1 += "<div class='form-group'>"
			+ "<label class='col-md-2 col-sm-4 control-label' for='item_" + field.name + "'>" + field.display + "</label>"
	        + "<div class='col-md-10 col-sm-8'>"
	        + "<input name='" + field.name + "' id='" + field.name + "' class='form-control' type='input' value='" + (field.show || "") + "' placeholder='请输入主题名' />"
	        + "</div>"
	        + "<div class='clearfix'></div></div>";
	}

	//主题作者
	if(record.subject_author){
		var field = record.subject_author;

		html1 += "<div class='form-group'>"
	        + "<label class='col-md-2 col-sm-4 control-label' for='item_" + field.name + "'>" + field.display + "</label>"
	        + "<div class='col-md-10 col-sm-8'>"
	        + "<input name='" + field.name + "' id='" + field.name + "' class='form-control' type='input' value='" + (field.show || "") + "' onfocus='this.select();' style='color:red;' />"
	        + "</div>"
	        + "<div class='clearfix'></div></div>";
	}

	if(tek.user.isNormal(mySecurity) && tek.role.isAuditor(myRole)){
    	//主题概要\
    	if(record.subject_summary){
    		var field = record.subject_summary;

    		html1 += "<div class='form-group'>"
		        + "<label class='col-md-2 col-sm-4 control-label' for='item_" + field.name + "'>" + field.display + "</label>"
		        + "<div class='col-md-10'>"
		        + "<textarea name='" + field.name + "' id='" + field.name + "' class='form-control' placeholder='主题概要' rows='4'>" + tek.dataUtility.stringToInputHTML(field.show) + "</textarea>"
		        + "</div>"
		        + "<div class='clearfix'></div></div>";

		    subjectSummary = field.show;
    	}
    }

    html1 += '<hr/>'
		+ '<div class="pull-left">'
		+ '<h5>分类</h5>'
		+ '<div class="bor bg-orange"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>';


	//主题目录
	if(record.subject_catalog){
		var field = record.subject_catalog;
		subjectCatalog = field.value;
		getCatalog(subjectCatalog);
		html1 += '<div class="form-group" id="zhutimulu">'
			+ '<label class="col-md-2 col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-md-10 col-sm-8">'
			+ '<input name="' + field.name + 'Text" id="' + field.name + 'Text" class="form-control"  type="text" placeholder="目录分类">'
			+ '<input name="' + field.name + '" id="' + field.name + '" type="hidden" value="' + (field.value || "") + '" />'
			+ '</div>'
			+ '</div>';
	}


	//标签
	if(record.subject_tags){
		var field = record.subject_tags;

		html1 += "<div class='form-group'>"
        + "<label class='col-md-2 col-sm-4 control-label' for='item_" + field.name + "'>" + field.display + "</label>"
        + "<div class='col-md-10 col-sm-8'><ul id='subject_tags_ul' class='col-md-12 radio-checkbox-ul'>"
        + "<li><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></li>"
        + "</ul></div>"
        + "<div class='clearfix'></div></div>";


        subjectTags = field.show;	//保存标签
	}

	//所属小组
	if(record.subject_group){
		var field = record.subject_group;

		if(field.show){
			$("#add-subject-title").html("编辑 [" + field.show + "] 下的主题：" + tek.dataUtility.stringToHTML(record.name));
        } else {
            $("#add-subject-title").html("编辑主题：" + record.name);
        }

        html1 += "<div class='form-group hidden'>"
	        + "<label class='col-md-2 col-sm-4 control-label' for='item_" + field.name + "'>" + field.display + "</label>"
	        + "<div class='col-md-10 col-sm-8'>"
	        + "<input name='" + field.name + "' id='" + field.name + "' class='form-control' type='hidden' value='" + (field.value || "") + "' />"
	        + "</div>"
	        + "<div class='clearfix'></div></div>";
	}else {
		$("#add-subject-title").html("编辑主题: " + record.name);
	}


	//主题类型
	if(record.subject_type){
		var field = record.subject_type;
		subjectType = field.value; 	//保存主题类型
	}

	//主题发布时间
	if (record.subject_date) {
        var field = record.subject_date;

        var dateResult = !!field.value ? getHourMinSecFromLongDate(parseInt(field.value)) : null;

        html1 += "<div class='form-group form-group-hms' id='subject_date_form'>"
        + "<label class='col-md-2'>" + field.display + "</label>"
        + "<div class='col-md-10'><div class='' style='float:left;'>"
        + "<input name='" + field.name + "' id='" + field.name + "' class='form-control' type='input' value='" + (dateResult.ymd || "") + "' onclick='this.select();' onfocus='calendarShow(this);'/>"
        + "</div><div class='' style='float:left; padding:5px 8px 8px 2px;'></div>" //文本内容"日期"
        + "<div class='hour_minute_second'  style='float:left;'>"
            //时
        + "<div class='' style='float:left;'><select name='" + field.name + "_hour' id='" + field.name + "_hour' class='form-control'>";
        for (var i = 0; i < 24; i++) {
            var value = (i < 10) ? "0" + i : "" + i;

            html1 += "<option value='" + value + "' " + ((dateResult && dateResult.hh == value) ? "selected" : "") + " >" + value + "</option>";
        }
        html1 += "</select></div>"
        + "<div class='' style='float:left; padding:5px 5px 5px 2px;' >时</div>"
            //分
        + "<div class='' style='float:left;'><select name='" + field.name + "_min' id='" + field.name + "_min' class='form-control'>";
        for (var j = 0; j < 60; j++) {
            var value = (j < 10) ? "0" + j : "" + j;

            html1 += "<option value='" + value + "' " + ((dateResult && dateResult.mm == value) ? "selected" : "") + " >" + value + "</option>";
        }
        html1 += "</select></div>"
        + "<div class='' style='float:left; padding:5px 5px 5px 2px;' >分</div>"
            //秒
        + "<div class='' style='float:left;'><select name='" + field.name + "_sec' id='" + field.name + "_sec' class='form-control'>";
        for (var k = 0; k < 60; k++) {
            var value = (k < 10) ? "0" + k : "" + k;

            html1 += "<option value='" + value + "' " + ((dateResult && dateResult.ss == value) ? "selected" : "") + " >" + value + "</option>";
        }
        html1 += "</select></div>"
        + "<div class='' style='float:left; padding:5px 5px 5px 2px;' >秒</div>"
        + "</div>"
        + "</div>"//.hour_minute_second  end
        + "<div class='clearfix'></div></div>";
    }

    
    

    //附件列表
    html1 += "<div class='form-group'>"
	    + "<label class='col-md-2'>附件列表</label>"
	    + "<div class='col-md-10'>"
	    + "<li id='document_add_btn' style='display:inline-block'><a id='add-document-plus-btn' onclick='addDocumentPlusBtn();' title='新增文档' href='#document-list'>"
	    + "<i class='fa fa-4x fa-plus'></i></a></li>";

	if(subjectType == 2){
		html1 += "<div id='target_box' class='dashboard_target_box' style='display:inline-block'>"
			+ '<div id="drop_zone_home" class="dashboard_target_messages_container">'
				+ '<div id="dtb-msg2" class="dashboard_target_box_message" style="top: -44px;">'
					+ '<input hidefocus class="addfileI" name="uploadFile0" id="uploadFile0" onchange="uploadFileBtn();" type="file">'
					+ '<span>点击这里<br>上传附件</span>'
				+ '</div>'
				+ '<div id="dtb-msg1" class="dashboard_target_box_message" style="top: -44px;">'
					+ '<span>拖动图片到这里<br>开始上传图片</span>'
				+ '</div>'
			+ '</div>'
			+ '<div id="dtb-msg4" class="dashboard_target_box_message">'
				+ '<progress value="0" max="" style="position: absolute;left: -25px; right: -25px;margin-top:15px;"></progress>'
			+ '</div>'
		+ '</div>';
	}
	   /* + "<div id='target_box' class='dashboard_target_box' style='display:inline-block'>"
			+ '<div id="drop_zone_home" class="dashboard_target_messages_container">'
				+ '<div id="dtb-msg2" class="dashboard_target_box_message" style="top: -44px;">'
					+ '<input hidefocus class="addfileI" name="uploadFile0" id="uploadFile0" onchange="uploadFileBtn();" type="file">'
					+ '<span>点击这里<br>上传附件</span>'
				+ '</div>'
				+ '<div id="dtb-msg1" class="dashboard_target_box_message" style="top: -44px;">'
					+ '<span>拖动图片到这里<br>开始上传图片</span>'
				+ '</div>'
			+ '</div>'
			+ '<div id="dtb-msg4" class="dashboard_target_box_message">'
				+ '<progress value="0" max="" style="position: absolute;left: -25px; right: -25px;margin-top:15px;"></progress>'
			+ '</div>'
		+ '</div>'*/
	html1 += "<div class='clearfix'></div></div></div>";


	html1 += "<br/><div class='form-group'>"   
		+ "<label class='col-md-2'></label>"
		+ "<div class='col-md-10'>"
		+ "<div class='col-md-10'>"
	    + "<div id='document-list' class='document-list document-scroll' onscroll='docScroll(this)'>"
	    + "<li id='document-list-button'>"
	    + "</li>"
	    + "</div></div>"
		+ '</div>'
		+'</div>'
	    

    $("#subject-info-div-left-content").html(html1);


    //右侧栏数据
    var html2 = "<div class='row'>";

    html2 += '<div class="pull-left">'
		+ '<h5>权限</h5>'
		+ '<div class="bor bg-success"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>';

    //阅读属性
    if (record.subject_listen) {
        var field = record.subject_listen;

        var listenSelects = field.selects;
        var listenShows = field.shows;
		if (tek.user.isNormal(mySecurity) && tek.role.isAuditor(myRole)) {
			html2 += "<div class='form-group'>";
		}else{
			html2 += "<div class='form-group' style='display:none;'>";
		}
       	/*html2 += "<h4 class='alert-info title col-xs-offset-1'>" + field.display + "</h4>"
        	+ "<ul class='right-radio-ul'>";*/
        html2 += '<label for="document_right" class=" col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="div-right col-sm-8">'
			+ '<ul class="right-radio-ul">';
        if (listenSelects && listenSelects.length > 0) {
            for (var i = 0; i < listenSelects.length; i++) {
                html2 += "<li>"
                + "<input name='" + field.name + "' id='" + field.name + "_" + i + "' class='form-horizontal' type='radio'"
                + ((field.value == listenSelects[i]) ? " checked" : "") + " value='" + listenSelects[i] + "' />"
                + "<label class='form-horizontal' for='" + field.name + "_" + i + "' >" + listenShows[i] + "</label>"
                + "</li>";
            }
        }//end if(listenSelects && listenSelects.length >0)
        /*html2 += "</ul>"
        + "</div>";*/
        html2 += '</ul></div></div>';
		html2 += '<div class="clearfix"></div>';
    }

    //附加文档属性
    if (record.subject_speak) {
        var field = record.subject_speak;

        var speakSelects = field.selects;
        var speakShows = field.shows;
		if (tek.user.isNormal(mySecurity) && tek.role.isAuditor(myRole)) {
			html2 += "<div class='form-group'>";
		}else{
			html2 += "<div class='form-group' style='display:none;'>";
		}
        /*html2 += "<h4 class='alert-info title col-xs-offset-1'>" + field.display + "</h4>"
        + "<ul class='right-radio-ul'>";*/

        html2 += '<label for="document_right" class=" col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="div-right col-sm-8">	'
			+ '<ul class="right-radio-ul">';
        if (speakSelects && speakSelects.length > 0) {
            for (var i = 0; i < speakSelects.length; i++) {
                html2 += "<li>"
                + "<input name='" + field.name + "' id='" + field.name + "_" + i + "' class='form-horizontal' type='radio'"
                + ((field.value == speakSelects[i]) ? " checked" : "") + " value='" + speakSelects[i] + "' />"
                + "<label class='form-horizontal' for='" + field.name + "_" + i + "' >" + speakShows[i] + "</label>"
                + "</li>";
            }
        }//end if(speakSelects && speakSelects.length >0)
        /*html2 += "</ul>"
        + "</div>";*/
        html2 += '</ul></div></div>';
    }

    //主题状态
    var selectedStatus = 0;
    if (record.subject_status) {
        var field = record.subject_status;

        var statusSelects = field.selects;
        var statusShows = field.shows;

        /*html2 += "<div class='form-group' id='subject_status_form'>"
        + "<h4 class='alert-info title col-xs-offset-1'>" + field.display + "</h4>"
        + "<ul class='right-radio-ul'>";*/

        html2 += '<div class="form-group" id="subject_status_form">'
			+ '<label for="document_right" class=" col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="div-right col-sm-8">	'
			+ '<ul class="right-radio-ul">';
        if (statusSelects && statusSelects.length > 0) {
            for (var i = 0; i < statusSelects.length; i++) {
                html2 += "<li>"
                + "<input name='" + field.name + "' id='" + field.name + "_" + i + "' class='form-horizontal' type='radio' onchange='subjectStatusOnChange(" + statusSelects[i] + ");'"
                + ((field.value == statusSelects[i]) ? " checked" : "") + " value='" + statusSelects[i] + "' />"
                + "<label class='form-horizontal' for='" + field.name + "_" + i + "' >" + statusShows[i] + "</label>"
                + "</li>";

                if (field.value == statusSelects[i])
                    selectedStatus = statusSelects[i];
            }
        }//end if(statusSelects && statusSelects.length >0)
        /*html2 += "</ul>"
        + "</div>";*/
        html2 += '</ul></div></div>';
    }

    html2 += "</div>";
    $("#subject-info-div-right-content").html(html2);

    var html3 = "<button class='btn btn-primary col-xs-3' type='submit'> 确 定</button>";
    if (showClose == 1) {
        // 显示“关闭”按钮
        html3 += "<button class='btn btn-danger col-xs-3' type='button' onclick='window.close();'> 关 闭</button>";
    } else if (callbackURL && callbackURL.length > 0) {
        html3 += "<button class='btn btn-danger col-xs-3' type='button' onclick='window.location.href=\"" + callbackURL + "\";'> 返 回</button>";
    }
    $("#subject-info-div-submit").html(html3);

    //执行一次状态改变的函数，判断发布时间是否显示
    subjectStatusOnChange(selectedStatus);

    $('#drop_zone_home').hover(function () {
		$(this).children('[id*="dtb-msg"]').stop().animate({top: '0px'}, 200);
	}, function () {
		$(this).children('[id*="dtb-msg"]').stop().animate({top: '-44px'}, 200);
	});

}

//---------------------表单提交-------------------------
function editFormBtn(formTargetId){
	var target = document.getElementById(formTargetId);
	if(!target){
		return alert("系统错误！请与管理员联系！");
	}

	var setting = {async: true, operateType: "提交主题编辑"};

	var formData = $("#" + formTargetId).serialize();
	var sendData = strToJSON(formData) || {};	//转为json

	sendData["objectName"] = "Subject";
	sendData["action"] = "setInfo";
	sendData["subject_id"] = subjectId;
	if(subjectType){
		sendData["subject_type"] = subjectType;
	}
	if(!sendData.subject_name || sendData.subject_name == ""){
		target.subject_name.placeholder = "请输入主题名";
		target.subject_name.focus();

		showMessage("主题名不能为空", 1500);	//错误提示
		return;
	}

	if(!sendData.subject_tags || sendData.subject_tags == ""){
		sendData.subject_tags = "";
	}

	//主题发布时间
	if (!$("#subject_date_form").is(":hidden")) {
        var subjectDate = sendData.subject_date + " " + sendData.subject_date_hour + ":" + sendData.subject_date_min + ":" + sendData.subject_date_sec;
        if (subjectDate && subjectDate.length > 0) {
            var newDate = getLongDateByStringDate(subjectDate);
            if (newDate)
                sendData["subject_date"] = newDate;
        }
    } else {
        delete sendData.subject_date;
    }
    delete sendData.subject_date_hour;
    delete sendData.subject_date_min;
    delete sendData.subject_date_sec;
    //主题起始时间
    if (!$("#subject_start_form").is(":hidden")) {
        var subjectStart = sendData.subject_start + " " + sendData.subject_start_hour + ":" + sendData.subject_start_min + ":" + sendData.subject_start_sec;
        if (subjectStart && subjectStart.length > 0) {
            var newStart = getLongDateByStringDate(subjectStart);
            if (newStart)
                sendData["subject_start"] = newStart;
        }
    } else {
        delete sendData.subject_start;
    }
    delete sendData.subject_start_hour;
    delete sendData.subject_start_min;
    delete sendData.subject_start_sec;
    //主题截止时间
    if (!$("#subject_end_form").is(":hidden")) {
        var subjectEnd = sendData.subject_end + " " + sendData.subject_end_hour + ":" + sendData.subject_end_min + ":" + sendData.subject_end_sec;
        var subjectEnd = sendData.subject_end;
        if (subjectEnd && subjectEnd.length > 0) {
            var newEnd = getLongDateByStringDate(subjectEnd);
            if (newEnd)
                sendData["subject_end"] = newEnd;
        }
    } else {
        delete sendData.subject_end;
    }
    delete sendData.subject_end_hour;
    delete sendData.subject_end_min;
    delete sendData.subject_end_sec;

    //主题概要
    if (!sendData["subject_summary"]) {
        if (subjectSummary) {
            sendData["subject_summary"] = subjectSummary;
        } else if (subjectDocumentId) {
            sendData["subject_summary"] = getDocumentSummary(subjectDocumentId); //默认：第一个上传的文档概要
        }
    }

    var callback = {
    	beforeSend: function(){
    		$("#closeLogin").hide();
    		var msg = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />主题修改中，请稍候!</p>";
            tek.macCommon.waitDialogShow(null, msg, null, 2);
    	},
    	success: function(data){
    		tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + " 即将进入主题读取。</p>", null, 2);

    		if(updateOpener){
    			//刷新父页面
    			tek.refresh.refreshOpener(null, request["refresh-opener-func"]);
    		}

    		setTimeout(function () {
                tek.macCommon.waitDialogHide();

                var url;
                if (callbackURL && callbackURL.length > 0)
                    url = callbackURL;
                else {
                    var key = [];
                    key.push("show-close");
                    key.push("refresh-opener");
                    key.push("refresh-opener-func");
                    if(subjectType == 2){
                    	url = tek.common.getRequestParams(key, request, "read-photos.html?subject_type=2", null);
                    }else if(subjectType == 3){
                    	url = tek.common.getRequestParams(key, request, "read-wiki.html?", null);
                    }else if(subjectType == 4){
                    	url = tek.common.getRequestParams(key, request, "read-notice.html?", null);
                    }
                    if (url){
                        url = tek.common.appendURLParam(url, "subject_id", subjectId);
                    }
                }

                if (url){
                    location.href = url;
                }
            }, 2000);
    	},
    	error: function(data, errorMsg){
    		$("#closeLogin").show();

    		tek.macCommon.waitDialogHide();

    		showError(errorMsg);
    	}
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取文档概要
function getDocumentSummary(id) {
    var documentSummary = "";

    var setting = {async: false, operateType: "获取文档概要"};
    var sendData = {
        objectName: "Document",
        action: "readInfo",
        doc_id: id
    };
    var callback = {
        success: function (data) {
            var record = data["record"];
            if (record && record.doc_summary) {
                documentSummary = record.doc_summary.show;
            }
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

    return documentSummary;
}

//编辑区操作
function editAreaFocus(e) {
    //alert("dfg");
    e = e || window.even
    var text = e.currentTarget.innerText;
    if (e.type == "focus") {
        if (text == "请在这里编辑你的内容") {
            <!--e.currentTarget.innerHTML = "";-->
            $("#my-note-editor p").text("");
        }
    }
    if (e.type == "blur") {
        var text = e.currentTarget.innerText;
        if (tek.type.isEmpty(text)) {
            <!--e.currentTarget.innerText = "请在这里编辑你的内容";-->
            $("#my-note-editor p").text("请在这里编辑你的内容");
        }
    }
}

// 取得原目录显示名
function getCatalogShow(record) {
	if (tek.dataUtility.isNull(record))
		return;

    var subjectType;
	if(record.subject_type)
		subjectType=record.subject_type.value;
	if (tek.dataUtility.isNull(subjectType))
		return;
	//var subjectCatalog;
	if(record.subject_catalog)
		subjectCatalog=record.subject_catalog.value;
	if (tek.dataUtility.isNull(subjectCatalog))
		return;
	

    var catalogType;
	switch (parseInt(subjectType)){
		case 1:catalogType="SubjectCyclopedia";
			break;
		case 2:catalogType="SubjectExhibition";
			break;
		case 3:catalogType="SubjectDemand";
			break;
		case 4:catalogType="SubjectStrategy";
			break;
	}
	if (tek.dataUtility.isNull(catalogType))
		return;
		
    var setting = {async: true};

    var sendData = {};	//转为json

    sendData["objectName"] = "ObjectCatalog";
    sendData["action"] = "getList";
    sendData["catalog_object"] = catalogType;
    sendData["catalog_owner"] = "0";
    sendData["catalog_code"] = subjectCatalog;
    sendData["select"] = "catalog_code,catalog_name";

    var callback = {
        success: function (data) {
			if(data) {
				var records=data.record;
				if (records != null) {
					if(!records.length)
						records=[ records ];
					
					for (var i in records) {
						if (records[i] && records[i].catalog_code && records[i].catalog_code.value==subjectCatalog) {
							$("#subject_catalogText").val(records[i].name);
							break;
						}
					}
				}
			}
        },
        error: function (data, errorMsg) {
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}