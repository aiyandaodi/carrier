// JavaScript Document
/**************************************************
 *    事物处理读取页面 read.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var isTransactionFinish = false; //Transaction事务是否结束
var isReleaseStatus = false; //Transaction是否是发布状态

var transDoDisplayMode = 1; //TransDo显示模式 1-正确回答 2-时间线

var currentTransactionStatusValue; //当前Transaction状态值
var currentTransDoStatusValue; //当前TransDo状态值
//=====================================================Function===============================
//-----------------------------------------------Transaction-------------------------------------

var transactionId;  //获问题对象id
var request = tek.common.getRequest();
/**
 * 初始化
 */
function init(){
	transactionId = request["transaction_id"];
	if (transactionId && transactionId.length > 0){
		// 初始化Summernote编辑器
		initSummernote();
		
		tek.common.getUser();
		readTransactionInfo(transactionId);
	}else{
		showErrorMessage("事务处理未找到!");
	}
}

function initSummernote() {
	$('#trans_do_content').summernote({
		airMode: true,
		lang: 'zh-CN',
		placeholder: '输入回复内容...(空内容无效！)',
		callbacks: {
			onFocus: function(e) {
				var text = $('#trans_do_content').summernote('code');
				if (text == "请在这里编辑你的内容") {
					$('#trans_do_content').summernote('code', "");
				}
			},
			onBlur: function(e) {
				var text = $('#trans_do_content').summernote('code');
				if (tek.type.isEmpty(text)) {
					$('#trans_do_content').summernote('code', "请在这里编辑你的内容");
				}
			}
		}
	});
	
	$('#trans_do_content').summernote('lineHeight', 28); //单位 px
}


//获取事务处理信息
function readTransactionInfo(transactionId) {
	if (!transactionId) return;

	var setting = {operateType: "获取事务处理信息"};
	var sendData = {
		objectName: "Transaction",
		action: "readInfo",
		transaction_id: transactionId,
		blob: 1
	};
	if (tek.role.isAuditor(parseInt(mySecurity))) {
		sendData["condition"] = "transaction_status >= 0";
	} else {
		sendData["transaction_status"] = 1;
	}

	var callback = {
		success: function (data) {
			var record = data["record"];
			if (record) {
				record = !record.length ? record : record[0];
				// 显示事务信息
				showTransactionInfo(record);

				// 切换TransDo显示方式
				shiftTransDoDisplayMode();

				// 获取问题的回复域
				readTransDoReplay();
			} else {
				showErrorMessage('记录不存在！');
			}//end if(record)
		},
		error: function (data, errorMsg) {
			showErrorMessage(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示事务信息
function showTransactionInfo(record) {
	if (!tek.type.isObject(record)) return;

	var field;

	//事务名
	field = record.transaction_name;
	if (field && field.show) {
		document.title = "问答_" + field.show;
		$("#transaction_name").html(field.show);
	}
	//状态
	field = record.transaction_status;
	if (field && tek.role.isAuditor(parseInt(mySecurity)) && tek.type.isArray(field.selects) && tek.type.isArray(field.shows) && field.selects.length == field.shows.length) {
		var html1 = "<select class='btn btn-info' onchange='changeTransactionStatus(this.value)'>";
		for (var i = field.selects.length - 1; i >= 0; i--) {
			html1 += "<option class='btn-default' value='" + field.selects[i] + "' "
				+ (field.value == field.selects[i] ? "selected" : "")
				+ ">" + field.shows[i] + "</option>";
		}
		html1 += "</select>";
		$("#transaction_status").html(html1).removeClass("hide");
	}
	currentTransactionStatusValue = field.value;
	isReleaseStatus = (currentTransactionStatusValue >= 1) ? true : false;
	//详情或概要（详情存在，把概要覆盖）
	field = record.transaction_summary;
	if (field) {
		$("#transaction_summary").html(field.show);
	}
	field = record.blob;
	if (field && tek.type.isObject(field)) {
		var path = field.path || "";
		var filename = field.filename || "";
		if (!tek.type.isEmpty(path) && !tek.type.isEmpty(filename)) {
			var openurl = tek.common.getRootPath() + "http/tekinfo/system/download.jsp";
			$.get(openurl, {'file-path': path, 'file-name': filename}, function (data) {
				if (data != null) {
					$("#transaction_summary").html(data);
				}//end if(data != null)
			}, "html");
		}
	}

	var getYearMonthDate = function (dateLong) {
		dateLong = parseInt(dateLong);
		if (dateLong <= 0) return "";

		var date = new Date(dateLong);
		date = {y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate()};

		return date.y + "-" + ((date.m < 10) ? "0" + date.m : date.m) + "-" + ((date.d < 10) ? "0" + date.d : date.d);
	}
	//开始
	field = record.transaction_start;
	if (field && !tek.type.isEmpty(field.value) && parseInt(field.value) > 0) {
		$("#transaction_start").html("开始于：" + getYearMonthDate(field.value));
	}
	//结束
	field = record.transaction_end;
	if (field && !tek.type.isEmpty(field.value) && parseInt(field.value) > 0) {
		$("#transaction_end").html("结束于：" + getYearMonthDate(field.value));
		isTransactionFinish = true;
	}
	//作者
	field = record.transaction_owner;
	if (field && !tek.type.isEmpty(field.show)) {
		$("#transaction_owner").html(field.show);
	}

	//根据transaction的情况初始化一些参数
	transDoDisplayMode = isTransactionFinish ? 1 : 2; //问答结束显示正确回答否则显示时间线
}

// 修改问题状态
function changeTransactionStatus(status) {
	if (tek.type.isEmpty(status) || tek.type.isEmpty(transactionId)) return;

	var isSuccess = false;

	var setting = {operateType: "修改问答状态"};
	var sendData = {
		objectName: "Transaction",
		action: "setInfo",
		transaction_id: transactionId,
		transaction_status: status
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "正在提交修改。。。");
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, data.message);
			isSuccess = true;

			if (status >= 1) {
				isReleaseStatus = true;
				$("#trans_do_reply").removeClass("hide");
			} else {
				isReleaseStatus = false;
				$("#trans_do_reply").addClass("hide");
			}
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
		complete: function () {
			tek.macCommon.waitDialogHide(2000);

			if (isSuccess) {
				currentTransactionStatusValue = status;
			} else {
				$("#transaction_status > select").val(currentTransactionStatusValue);
			}
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//-----------------------------------------------TransDo-------------------------------------
// 切换TransDo显示方式
function shiftTransDoDisplayMode(mode) {
	mode = parseInt(mode);
	transDoDisplayMode = (mode == 1 || mode == 2) ? mode : transDoDisplayMode;

	var clearDisplayInfo = function () {
		$("#trans_do_correct").html("");
		$("#trans_do_info").html("");
		$("#trans_do_info_end").html("");
	};

	if (transDoDisplayMode == 1) {
		$("#trans_do_shift").html("<span onclick='shiftTransDoDisplayMode(2)'>显示时间线>>></span>");
		$("#trans_do_timeline").addClass("hide");
		clearDisplayInfo();
		$("#trans_do_correct").removeClass("hide");
	}

	if (transDoDisplayMode == 2) {
		$("#trans_do_shift").html("<span onclick='shiftTransDoDisplayMode(1)'>显示正确回答>>></span>");
		$("#trans_do_correct").addClass("hide");
		clearDisplayInfo();
		$("#trans_do_timeline").removeClass("hide");
	}

	// 获取事物的处理的回复信息
	readTransDoInfo(transactionId);
}

// 获取事物的处理的回复信息
function readTransDoInfo(transactionId, transDoId) {
	if (!transactionId) return;

	var setting = {operateType: "获取事物处理的回复信息"};
	var sendData = {
		objectName: "TransDo",
		action: "getList",
		trans_do_transaction: transactionId
	};


	if (transDoDisplayMode == 1) {
		sendData["condition"] = "trans_do_type >= " + 0x0800;
		sendData["count"] = 1;
	}

	if (transDoDisplayMode == 2) {
		sendData["order"] = "createTime"; //创建时间
		sendData["desc"] = 0; //时间线，正序

		if (!tek.type.isEmpty(transDoId))
			sendData["trans_do_id"] = transDoId;
	}

	var callback = {
		beforeSend: function () {
			//显示等待加载
			var html = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif' />";
			$("#load_error_msg").html(html).removeClass("hide");
		},
		success: function (data) {
			var records = data["record"];
			if (records) {
				records = !records.length ? [records] : records;
				// 显示回复信息
				showTransDoInfo(records);

				$("#load_error_msg").addClass("hide");
			} else {
				$("#load_error_msg").html("没有解答记录！");
			}//end if(record)
		},
		error: function (data, errorMsg) {
			$("#trans_do_info").html(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示回复信息
function showTransDoInfo(records) {
	if (!tek.type.isArray(records)) return;

	if (transDoDisplayMode == 1) {
		var record = records[0];
		var field, type;

		var html = "<h4>";
		field = record.trans_do_name;
		if (field)
			html += field.show || "";
		html += "</h4>"
			+ "<div class='trans-do-summary'>";
		field = record.trans_do_summary;
		if (field)
			html += field.show || "";
		html += "</div>"

			+ "<div class='trans-do-operate'><a onclick='openTransDoCorrectDetail(this,\"" + record.id + "\")' >" + "详情</a>" + "</div>"

			+ "<div id='trans_do_correct_detail' style='display: none;'></div>";

		$("#trans_do_correct").html(html);
	} else if (transDoDisplayMode == 2) {
		for (var i = 0, len = records.length; i < len; i++) {
			var record = records[i];
			var field, type;

			var html = "<div class='timeline-item' id='timeline_item_" + record.id + "' ><div class='timeline-circle ";

			field = record.trans_do_type;
			type = field.value;
			html += getShowColor(type) + "'>";

			field = record.createTime;
			if (field && !tek.type.isEmpty(field.value))
				html += dataTransform(field.value);
			html += "</div>"

				+ "<div class='timeline-content'>"
				+ "<h4>";
			field = record.trans_do_name;
			if (field && !tek.type.isEmpty(field.show))
				html += field.show;
			html += "</h4>"
				+ "<div class='trans-do-summary'>";
			field = record.trans_do_summary;
			if (field && !tek.type.isEmpty(field.show))
				html += field.show;
			html += "</div>"

				+ "<div class='trans-do-operate'>";
			// 有管理权限显示
			if (tek.role.isAuditor(parseInt(mySecurity)) && record.trans_do_type.value > 0) {
				field = record.trans_do_status;
				if (field && tek.type.isArray(field.selects) && tek.type.isArray(field.shows) && field.selects.length == field.shows.length) {
					html += "<select class='btn-link' id='trans_do_status_" + record.id + "' onchange='changeTransDoStatus(this.value, \"" + record.id + "\")'>";
					for (var j = field.selects.length - 1; j >= 0; j--) {
						html += "<option class='btn-default' value='" + field.selects[j] + "' "
							+ (field.value == field.selects[j] ? "selected" : "")
							+ ">" + field.shows[j] + "</option>";
					}
					html += "</select>";
				}
				currentTransDoStatusValue = field.value;
			}
			if (tek.role.isAuditor(parseInt(myRole)) && (record.trans_do_type.value & 0x20) == 0x20) {
				html += "<a " + ((record.trans_do_type.value & 0x800) == 0x800 ? "class='hide' " : "")
					+ "onclick='markCorrectAnswer(this,\"" + record.id + "\")' >" + "作为正确答案</a>";
			}
			html += "<a onclick='openTransDoDetail(this,\"" + record.id + "\")' >" + "详情</a>" + "</div>"

				+ "</div>"

				+ "</div>";

			if ((i >= len - 1) && (type == 0)) {
				$("#trans_do_info_end").append(html);
			} else {
				$("#trans_do_info").append(html);
			}
		} // end for (...)

		var $aEle = $("#trans_do_timeline .trans-do-operate a:hidden");
		if ($aEle.length > 0)
			changeCorrectAnswer.dated = $aEle[0];
	}
}

// 打开回复详情
function openTransDoDetail(btnEle, transDoId) {
	if (tek.type.isEmpty(transDoId))
		return;
	var ele = document.getElementById("timeline_item_" + transDoId);
	if (tek.type.isEmpty(ele))
		return;

	var transDoTitle = $(ele).find("h4").html();
	var transDoContent = $(ele).find(".trans-do-summary").html()

	if (!detailModalDialog.isShow()) {
		var setting = {operateType: "获取回复详情信息"};
		var sendData = {
			objectName: "TransDo",
			action: "readInfo",
			trans_do_id: transDoId,
			blob: 1
		};
		var callback = {
			beforeSend: function () {
				detailModalDialog.text(null, "<p class='center'><img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif' /></p>").show(ele);
				detailModalDialog.positionId = transDoId;
			},
			success: function (data) {
				var record = data.record;
				if (record) {
					// 显示解答详细内容
					showTransDoDetail(record);
				} else {
					detailModalDialog.text(transDoTitle, transDoContent);
				}
			},
			error: function (data, errorMsg) {
				detailModalDialog.text(null, errorMsg);
			},
			complete: function () {
				$(btnEle).html("收起");
			}
		};
		tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	} else {
		if (transDoId == detailModalDialog.positionId) {
			detailModalDialog.hide();
			$(btnEle).html("详情");
		}
	}
}

// 显示解答详细内容
function showTransDoDetail(record) {
	if (!tek.type.isObject(record))
		return;

	var title = (record.trans_do_name && record.trans_do_name.show) ? record.trans_do_name.show : "&nbsp;";
	var path = (record.blob && record.blob.path) ? record.blob.path : "";
	var filename = (record.blob && record.blob.filename) ? record.blob.filename : "";
	if (tek.type.isEmpty(path) || tek.type.isEmpty(filename)) {
		detailModalDialog.text("&nbsp;", "<p>详细信息不存在啦~</p>");
	} else {
		var openurl = tek.common.getRootPath() + "http/tekinfo/system/download.jsp";
		$.get(openurl, {'file-path': encodeURIComponent(path), 'file-name': decodeURIComponent(filename)}, function (data) {
			if (data != null) {
				detailModalDialog.text(title, data);
			}//end if(data != null)
		}, "html");
	}
}

// 详情模态框
var detailModalDialog = {
	positionId: "",
	static: false,
	text: function (title, content) {
		if (tek.type.isString(title))
			$("#detail_modal_dialog_title").html(title);
		if (tek.type.isString(content))
			$("#detail_modal_dialog_content").html(content);
		return this;
	},
	show: function (transDoEle) {
		var $timeLineItem = $(transDoEle);
		if ($timeLineItem.length > 0) {
			var offsetTop = $timeLineItem[0].offsetTop;
			var itemHeight = $timeLineItem[0].offsetHeight;
			var top = offsetTop + itemHeight - 10;
			$("#detail_modal_dialog").css({top: top + "px"}).show(0);
			$("#detail_modal_dialog_content").show("slow");
			this.static = true;
		}
		return this;
	},
	hide: function () {
		$("#detail_modal_dialog_content").hide("slow", function () {
			$("#detail_modal_dialog").hide(0);
			$("#detail_modal_dialog_title").html("&nbsp;");
			$("#detail_modal_dialog_content").html("");
		});
		this.static = false;
		return this;
	},
	isShow: function () {
		return this.static;
	}
};

// 打开TransDo正确答案详情
function openTransDoCorrectDetail(btnEle, transDoId) {
	if (tek.type.isEmpty(transDoId))
		return;

	var $correctDetail = $("#trans_do_correct_detail");
	if (!$correctDetail.length)
		return;

	if ($correctDetail.is(":hidden")) {
		var setting = {operateType: "获取正确回复详情信息"};
		var sendData = {
			objectName: "TransDo",
			action: "readInfo",
			trans_do_id: transDoId,
			blob: 1
		};
		var callback = {
			beforeSend: function () {
				var html = "<p class='center'><img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif' /></p>";
				$correctDetail.html(html).show("slow");
			},
			success: function (data) {
				var record = data.record;
				if (record) {
					// 显示正确解答详细内容
					var path = (record.blob && record.blob.path) ? record.blob.path : "";
					var filename = (record.blob && record.blob.filename) ? record.blob.filename : "";
					if (tek.type.isEmpty(path) || tek.type.isEmpty(filename)) {
						$correctDetail.html("<p>详细信息不存在啦~</p>");
					} else {
						var openurl = tek.common.getRootPath() + "http/tekinfo/system/download.jsp";
						$.get(openurl, {'file-path': path, 'file-name': filename}, function (data) {
							if (data != null) {
								$correctDetail.html(data);
							}//end if(data != null)
						}, "html");
					}
				} else {
					$correctDetail.html("<font color='red'>传入参数有误!</font>");
				}
			},
			error: function (data, errorMsg) {
				$correctDetail.html(errorMsg);
			},
			complete: function () {
				$(btnEle).html("收起");
			}
		};
		tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	} else {
		$correctDetail.hide("slow");
		$(btnEle).html("详情");
	}
}

// 标记为正确答案
function markCorrectAnswer(btnEle, transDoId) {
	if (tek.type.isEmpty(transDoId)) return;

	var isSuccess = false;

	var setting = {operateType: "标记为正确答案"};
	var sendData = {
		objectName: "TransDo",
		action: "setInfo",
		trans_do_id: transDoId,
		trans_do_type: 0x0800
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "正在提交设置。。。");
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message));
			isSuccess = true;
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
		complete: function () {
			tek.macCommon.waitDialogHide(3000);

			if (isSuccess)
				changeCorrectAnswer.markSuccess(btnEle);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 更换标准答案
var changeCorrectAnswer = {
	dated: null,
	markSuccess: function (btnEle) {
		if (!tek.type.isEmpty(this.dated) && this.dated.nodeName) {
			$(this.dated).removeClass("hide");
		}
		if (!tek.type.isEmpty(btnEle) && btnEle.nodeName) {
			$(btnEle).addClass("hide");
			this.dated = btnEle;
		}
	}
};

// 修改解答状态
function changeTransDoStatus(status, transDoId) {
	if (tek.type.isEmpty(status) || tek.type.isEmpty(transDoId)) return;

	var isSuccess = false;

	var setting = {operateType: "修改解答的状态"};
	var sendData = {
		objectName: "TransDo",
		action: "setInfo",
		trans_do_id: transDoId,
		trans_do_status: status
	};
	var callback = {
		beforeSend: function () {
			tek.macCommon.waitDialogShow(null, "正在提交修改。。。");
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, data.message);
			isSuccess = true;
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
		complete: function () {
			tek.macCommon.waitDialogHide(2000);

			if (isSuccess) {
				currentTransactionStatusValue = status;
			} else {
				$("#trans_do_status_" + transDoId).val(currentTransDoStatusValue);
			}
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 获取问题的回复域
function readTransDoReplay() {
	if (isTransactionFinish || !isReleaseStatus) return;

	var setting = {operateType: "获取解答的新建域"};
	var sendData = {
		objectName: "TransDo",
		action: "getNew",
		trans_do_transaction: transactionId
	};
	var callback = {
		success: function (data) {
			var record = data["record"];
			if (record) {
				record = !record.length ? record : record[0];

				// 显示TransDo回复域
				showTransDoReply(record)
			}
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
		complete: function () {
			tek.macCommon.waitDialogHide(3000);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示TransDo回复域
function showTransDoReply(record) {
	if (!record) return;

	$("#trans_do_reply").removeClass("hide");

	var field, type, typeName;

	// 类型
	var html1 = "";
	field = record.trans_do_type;
	if (field) {
		$(".trans-do-type").removeClass("hide");

		html1 += "<div class='form-group'>";

		var name = field.name;    //域名
		var value = field.value;    //域值
		var selects = field.selects;
		var shows = field.shows;
		if (!(tek.type.isEmpty(name) || tek.type.isEmpty(value) || !tek.type.isArray(selects) || !tek.type.isArray(shows) || selects.length != shows.length)) {
			var w = selects.length;
			w = parseInt(12 / ((w < 2) ? 2 : (w > 3) ? 3 : w));
			type = value;
			typeName = field.show;

			for (var i = 0, len = selects.length; i < len; i++) {
				if (tek.type.isEmpty(selects[i]) || tek.type.isEmpty(shows[i])) continue;

				html1 += "<div class='col-xs-" + w + " type-item'>"
					+ "<input type='radio' id='" + name + "-" + selects[i] + "' name='" + name + "'" + " value='" + selects[i] + "'"
					+ (selects[i] == value ? " checked='checked'" : "")
					+ " onclick='javascript:changeTransDoType(this.value);'/>"
					+ "<label for='" + name + "-" + selects[i] + "'>" + shows[i] + "</label>"
					+ "</div>";
			} // end for(var i=0; i<selects.length; i++)
		}
		html1 + "</div>";

		$("#trans_do_type").html(html1);
	}

	// 默认标题名
	var html2 = "【" + myName + "】" + (typeName || "处理") + "->【" + ($("#transaction_name").html()) + "】";
	$("#trans_do_title").val(html2);

	// 转处理	
	var html3 = "";

	field = record.trans_do_objectName;
	if (field) {
		html3 += tek.macEdit.appendDefaultEditField(field, null); //（调用mac-edit.js中的方法）
	}
	field = record.trans_do_objectId;
	if (field) {
		html3 += tek.macEdit.appendDefaultEditField(field, null); //（调用mac-edit.js中的方法）
	}
	field = record.trans_do_time;
	if (field) {
		html3 += tek.macEdit.appendDefaultEditField(field, null); //（调用mac-edit.js中的方法）
	}
	$("#trans_do_transfer").html(html3);

	if (type == 0x80)
		$("#trans_do_transfer").removeClass("hide");
}

// TransDo类型发生改变
function changeTransDoType(typeValue) {
	if (typeValue == 0x80) {
		$("#trans_do_transfer").removeClass("hide");
	} else {
		$("#trans_do_transfer").addClass("hide");
	}

	var typeName = $("label[for='trans_do_type-" + typeValue + "']").text();
	var title = $("#trans_do_title").val();
	if (!tek.type.isEmpty(typeName) && !tek.type.isEmpty(title)) {
		title = title.replace(/】.{2,4}->【/, "】" + typeName + "->【");
		$("#trans_do_title").val(title);
	}
}

// 新建TransDo（添加回复）
function addTransDoReply(formId) {
	if (!transactionId) return;

	var addForm = document.getElementById(formId);
	if (!addForm) return;

	var title = addForm.title.value.trim();
	if (tek.type.isEmpty(title)) {
		addForm.title.focus();
		addForm.title.placeholder = "请输入回复标题！";
		return;
	}

	var content = $('#trans_do_content').summernote('code');
	if (tek.type.isEmpty(content) || content == "输入回复内容...(空内容无效！)") {
		tek.macCommon.waitDialogShow(null, "请输入内容描述");
		tek.macCommon.waitDialogHide(2000);
		return;
	}

	var type = addForm.trans_do_type.value;
	var transferObject, transferId, transferTime;
	if (type == 0x00) {
		//结束问题，危险操作，弹出框提示
		var isSure = confirm("你确定要结束这个问题事务吗？");
		if (!isSure) return;
	} else if (type == 0x80) {
		//转处理，添加 trans_do_objectName、trans_do_objectId、trans_do_time 字段参数
		transferObject = addForm.trans_do_objectName.value;
		transferId = addForm.trans_do_objectId.value;
		transferTime = addForm.trans_do_time.value;
		
		//转处理，修改title显示
		title = title.replace(/转处理->【/,"转处理-> " + transferObject + "-> 【");
	}

	var setting = {operateType: "提交问题的解答"};
	var sendData = {
		objectName: "TransDo",
		action: "addInfo",
		trans_do_transaction: transactionId,
		trans_do_name: title,//标题
		trans_do_content: content,//内容
		trans_do_type: type//类型
	};

	if (type == 0x80) {
		sendData["trans_do_objectName"] = transferObject;
		sendData["trans_do_objectId"] = transferId;
		sendData["trans_do_time"] = transferTime;
	}

	var callback = {
		beforeSend: function () {
			//等待图层显示
			var html = "<p class='text-center text-nuted'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 请稍候...</p>";
			tek.macCommon.waitDialogShow("提交解答", html)
		},
		success: function (data) {
			//显示新添加解答回复
			var transDoId = data.value.split("=")[1];
			if (!tek.type.isEmpty(transDoId))
				readTransDoInfo(transactionId, transDoId);

			tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >回复成功！</p>");

			$('#trans_do_content').summernote('reset');//回复内容编辑框 reset
			if (type == 0x00) {
				isTransactionFinish = true;
				$("#trans_do_reply").addClass("hide");
			}
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
		complete: function () {
			//等待图层隐藏
			tek.macCommon.waitDialogHide(3000);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


//-----------------------------------------------通用函数(适用于本页面相关js文件中)------------------------------
// 获取颜色
function getShowColor(v) {
	var color = "";

	switch (parseInt(v)) {
		case 0x00: //结束
			color = "bg-black";
			break;
		case 0x01: //修订
			color = "bg-brown";
			break;
		case 0x10: //补充
			color = "bg-blue";
			break;
		case 0x20: //回答
			color = "bg-green";
			break;
		case 0x21: //请求补充
			color = "bg-lblue";
			break;
		case 0x80: //转处理
			color = "bg-orange";
			break;
		case 0x0800: //正确答案
			color = "bg-green";
			break;
		default:
			color = "bg-grey";
			break;
	}

	return color;
}

// 日期转换
function dataTransform(dateLong) {
	dateLong = parseInt(dateLong);
	if (dateLong <= 0) return "";

	var now = new Date();
	now = {
		y: now.getFullYear(),
		m: now.getMonth() + 1,
		d: now.getDate(),
		hh: now.getHours(),
		mm: now.getMinutes(),
		ss: now.getSeconds()
	};
	var date = new Date(dateLong);
	date = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		hh: date.getHours(),
		mm: date.getMinutes(),
		ss: date.getSeconds()
	};

	var t = "";
	if (date.d == now.d && date.m == now.m && date.y == now.y) {
		t += "<span>今</span>";
		if (date.hh != now.hh) {
			t += (now.hh - date.hh) + " 小时前";
		} else {
			var d = now.mm - date.mm;
			if (d <= 0) d = 1;
			t += d + " 分钟前";
		}
	} else {
		t += "<span>" + date.d + "</span>" + date.y + "-" + ((date.m < 10) ? "0" + date.m : date.m);
	}
	return t;
}

//显示错误的信息
function showErrorMessage(message) {
	var errorMsg = "<div class='widget'>"

		+ "<div class='widget-head'>"
		+ "<div class='pull-left'></div><div class='widget-icons pull-right'></div><div class='clearfix'></div>"
		+ "</div>"

		+ "<div class='widget-content'>"
		+ "<div class='center error-content'>"
		+ "<h2>" + (message || "事务处理未找到!") + "</h2>"
		+ "</div>"
		+ "</div>"

		+ "<div class='widget-foot'></div>"

		+ "</div>";

	$("#main-content > div.container > div.ui-303").html(errorMsg);
}



//取得fieldname字段的对象列表信息的ajax调用参数
tek.macEdit.getObjectOptionParam = function (fieldname) {
    var params = {};
    params["objectName"] = "User";
    params["action"] = "getList";
    params["condition"] = "user_security>=16";

    return params;
}

//-----------------------------------------------------End----------------------------------------