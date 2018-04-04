// JavaScript Document
/**************************************************
 *    读取参数配置页面 read.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var option_id;
var request = tek.common.getRequest();
function init(){
		
	option_id = request["option_id"];
	if (option_id) {
		readOptionInfo(option_id);
	} else {
		showErrorMessage("对象字典未找到！");
	}
}
//获取对象参数配置信息
function readOptionInfo(option_id) {
	if (!option_id)
		return;

	var setting = {operateType: "获取对象参数配置信息"};
	var sendData = {
		objectName: "ObjectOption",
		action: "readInfo",
		option_id: option_id
	};
	var callback = {
		beforeSend: function () {
			showWaitingImg(true);	//显示等待加载
		},
		success: function (data) {
			var record = data["record"];
			if (record) {
				record = !record.length ? record : record[0];
				// 显示信息
				showInfo(record);
			} else {
				showErrorMessage('记录不存在！');
			}
		},
		error: function (data, errorMsg) {
			showErrorMessage(errorMsg);
		},
		complete: function () {
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示信息
function showInfo(record) {
	if (!record)
		return;


	var field, html = "";

	//编码
	field = record.option_code;
	if (field) {
		html += appendShowFrom(field.name, field.display, field.show);
	}
	//名称
	field = record.option_name;
	if (field) {
		html += appendShowFrom(field.name, field.display, field.show);
	}
	//目标对象类型名
	field = record.option_objectName;
	if (field) {
		html += appendShowFrom(field.name, field.display, field.show);
	}
	//目标对象
	field = record.option_objectId;
	if (field) {
		html += appendShowFrom(field.name, field.display, field.show);
	}
	//拥有者
	field = record.option_owner;
	if (field) {
		html += appendShowFrom(field.name, field.display, field.show);
	}
	//值
	field = record.option_value;
	if (field) {
		html += appendShowFrom(field.name, field.display, field.show);
	}

	var field1, field2;
	//创建
	field1 = record.createTime;
	field2 = record.createIp;
	if (field1 || field2) {
		html += appendShowFrom(null, "创建", field1.show + " (" + field2.show + ")");
	}
	//修改
	field1 = record.modifyTime;
	field2 = record.modifyIp;
	if (field1 || field2) {
		html += appendShowFrom(null, "修改", field1.show + " (" + field2.show + ")");
	}

	$("#option-info").html(html);
}

// 拼接显示的表单
function appendShowFrom(name, label, value) {
	if (!label)
		return "";

	var html = "<div class='form-group'>"
		+ "<label class='control-label col-xs-4' for='" + name + "'>" + label + "</label>"
		+ "<div class='col-xs-8' style='padding-top:7px'><span id='" + name + "'>";
	if (!tek.type.isEmpty(name) && name == 'option_objectId' && tek.type.isEmpty(value)) {
		html += "<span class='label label-info'>所有记录有效</span>&nbsp;";
	} else if (!tek.type.isEmpty(name) && name == 'option_owner' && tek.type.isEmpty(value)) {
		html += "<span class='label label-primary'>公共</span>&nbsp;";
	} else {
		html += value;
	}
	html += "</span></div>"
		+ "</div>";

	return html;
}


//-----------------------------------------------通用函数(仅限于当前js文件中)------------------------------
//显示错误的信息
function showErrorMessage(message) {
	var html = "<div class='col-xs-12'>"
		+ "<div class='widget'>"
		+ "<div class='widget-head'>"
		+ "<div class='pull-left'></div><div class='widget-icons pull-right'></div><div class='clearfix'></div>"
		+ "</div>"
		+ "<div class='widget-content'>"
		+ "<div class='center error-content'><h2>" + (message || "对象参数配置未找到！") + "</h2></div>"
		+ "</div>"
		+ "<div class='widget-foot'></div>"
		+ "</div>"
		+ "</div>";

	$("#main_content").html(html);
}

//显示等待加载图标
function showWaitingImg(displayWaiting) {
	if (displayWaiting == true) {
		var html = new StringBuffer();
		html.append("<div class='center loading'>");
		html.append("<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />");
		html.append("</div>");
	} else {
		var html = "";
	}

	$("#option-info").html(html.toString());
}

//-----------------------------------------------------End-------------------------------------