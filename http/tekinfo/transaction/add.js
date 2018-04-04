// JavaScript Document
/**************************************************
 *    新建问题页面 add.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var relationObjectName; //关联对象类型名
var relationObjectId; //关联对象标识
var transactionType; //事务类型
var transactionName; //事务标题

var typeColors = "white grey black red green lblue blue orange yellow purple rose brown";
//=====================================================Function===============================
//-------------------------------------------初始化--------------------------------------
//初始化page
function initialPage() {
	relationObjectName = request["transaction_objectName"] ? decodeURIComponent(request["transaction_objectName"]) : null;
	relationObjectId = request["transaction_objectId"] ? decodeURIComponent(request["transaction_objectId"]) : null;
	transactionType = parseInt(request["transaction_type"]);
	transactionName = request["transaction_name"] ? decodeURIComponent(request["transaction_name"]) : null;

	$("#transaction_object_creator").html(myName);

	if (!tek.type.isEmpty(relationObjectName) && !tek.type.isEmpty(relationObjectId)) {
		$("#relation_object_item").removeClass("hide");
		$("#transaction_object_item").removeClass("horizontal-center");
		$("#transaction_object_item").removeClass("hide");
		//读取相关对象信息
		readRelationObjectInfo();
	} else {
		$("#transaction_object_item").removeClass("hide");
	}

	//设置类型名
	var showSelectTransactionType = function () {
		$("#transaction_object_type > span:eq(0)").addClass("hide");
		$("#transaction_object_type > span:eq(1)").removeClass("hide");
	}
	if (tek.type.isNumber(transactionType) && transactionType > 0) {
		var type = queryTranactionType(transactionType);
		if (type.name && type.name != "选择类型") {
			$("#transaction_object_type > span:eq(1)").addClass("hide");
			$("#transaction_object_type > span:eq(0)").removeClass(typeColors).addClass(type.color).html(type.name).removeClass("hide");
		} else {
			showSelectTransactionType();
		}
	} else {
		transactionType = 0;
		showSelectTransactionType();
	}

	//设置标题名
	if (!tek.type.isEmpty(transactionName)) {
		$("#transaction_title").val(transactionName);
	}
}


//----------------------------------相关对象-------------------------------------------------
//读取相关对象信息
function readRelationObjectInfo() {
	if (tek.type.isEmpty(relationObjectName) || tek.type.isEmpty(relationObjectId))    return;

	var setting = {operateType: "读取相关对象信息"};
	var sendData = {
		objectName: relationObjectName,
		action: "readInfo"
	};

	if (relationObjectName == "Subject") {
		sendData["subject_id"] = relationObjectId;
	} else if (relationObjectName == "Group") {
		sendData["group_id"] = relationObjectId;
	}

	var callback = {
		success: function (data) {
			var record = data["record"];
			if (record) {
				record = !record.length ? record : record[0];
				// 显示关联对象信息
				showRelationObjectInfo(record);
			} else {
				showErrorMessage('记录不存在！');
			}
		},
		error: function (data, errorMsg) {
			showErrorMessage(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示关联对象信息
function showRelationObjectInfo(record) {
	if (!tek.type.isObject(record)) return;

	var field;

	if (relationObjectName == "Subject") {
		field = record.subject_name;
	} else if (relationObjectName == "Group") {
		field = record.group_name;
	}
	if (field && field.show) {
		var html = "<a href='" + tek.common.getRelativePath() + "http/takall/subject/read.html?subject_id=" + record.id + "' target='_blank'>" + field.show + "</a>";
		$("#relation_object").html(html);
	}

	if (relationObjectName == "Subject") {
		field = record.subject_summary;
	} else if (relationObjectName == "Group") {
		field = record.group_remark;
	}
	if (field && field.show) {
		$("#relation_object_pointout").html(field.show);
	}

	//创建者
	if (relationObjectName == "Subject") {
		field = record.subject_owner;
	} else if (relationObjectName == "Group") {
		field = record.group_owner;
	}
	if (field && field.show) {
		$("#relation_object_creator").html("创建者：" + field.show);
	}

	//创建&修改 日期&IP
	field = record.createTime;
	if (field && field.show)
		$("#relation_object_createTime").html(field.show);
	field = record.createIp;
	if (field && field.show)
		$("#relation_object_createIp").html(field.show);

	field = record.modifyTime;
	if (field && field.show)
		$("#relation_object_modifyTime").html(field.show);
	field = record.modifyIp;
	if (field && field.show)
		$("#relation_object_modifyIp").html(field.show);
}

//显示错误信息
function showErrorMessage(message) {
	var errorMsg = "<div class='center error-content'>" + (message || "关联对象不存在！") + "</div>";

	$("#relation_object_item > div.ui-item").html(errorMsg);
}


//----------------------------------新建问题操作---------------------------------------------
//选择类型
function selectTranasctionType(typeValue) {
	typeValue = parseInt(typeValue);
	var type = queryTranactionType(typeValue);
	$("#transaction_object_type > span:eq(1) > a > span").removeClass(typeColors).addClass(type.color).text(type.name);
	transactionType = typeValue;
}

//提交信息
function commitInfo() {
	var setting = {operateType: "提交新建问答"};
	var sendData = tek.common.getSerializeObjectParameters("add_form") || {};	//转为json

	sendData["objectName"] = "Transaction";
	sendData["action"] = "addInfo";

	var title = $("#transaction_title").val().trim();
	if (tek.type.isEmpty(title)) {
		tek.macCommon.waitDialogShow(null, "请输入标题");
		tek.macCommon.waitDialogHide(1000);
		return;
	} else {
		sendData["transaction_name"] = title;
	}

	var content = $('#transaction_content').summernote('code');
	if (tek.type.isEmpty(content) || content == "请在这里编辑你的内容") {
		tek.macCommon.waitDialogShow(null, "请输入内容描述");
		tek.macCommon.waitDialogHide(1000);
		return;
	} else {
		sendData["transaction_content"] = content;
	}

	if (transactionType > 0)
		sendData["transaction_type"] = transactionType;

	if (!tek.type.isEmpty(relationObjectName))
		sendData["transaction_objectName"] = relationObjectName;
	if (!tek.type.isEmpty(relationObjectId))
		sendData["transaction_objectId"] = relationObjectId;

	var callback = {
		beforeSend: function () {
			//显示等待图层
			var html = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在提交...";
			tek.macCommon.waitDialogShow(null, html, null, 2);
		},
		success: function (data) {
			//提交成功
			tek.macCommon.waitDialogShow(null, data.message, null, 1);
			setTimeout(function(){
				window.close();
			},1500)
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null, errorMsg);
			tek.macCommon.waitDialogHide(2000);
		}
	};
	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);
	//tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//重置信息
function resetInfo() {
	$("#transaction_title").val("");
    var $tc = $('#transaction_content');
    $tc.summernote('code', "");
    $tc.summernote({focus: true})
}

//关闭网页
function closePage() {
    tek.common.closeWithConfirm();
}


//-----------------------------------------------通用函数(适用于本页面相关js文件中)------------------------------
//查询类型名
function queryTranactionType(typeValue) {
	var color, name;
	switch (typeValue) {
		case 0x10: 	//提问
			color = "lblue";
			name = "提问";
			break;
		case 0x20: 	//请求帮助
			color = "orange";
			name = "工单";
			break;
		case 0x80: 	//咨询
			color = "green";
			name = "咨询";
			break;
		case 0x40: 	//投诉
			color = "red";
			name = "投诉";
			break;
		case 0x41: 	//举报
			color = "rose";
			name = "举报";
			break;
		case 0x81: 	//建议
			color = "blue";
			name = "建议";
			break;
		default:
			color = "brown";
			name = "选择类型";
			break;
	}

	return {color: color, name: name};
}

//-----------------------------------------------------End-------------------------------------
