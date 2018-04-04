// JavaScript Document
/**************************************************
 *    新建配置页面 add.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================

var request = tek.common.getRequest();
//显示字段数组
var items = [
	"option_code",
	"option_objectName",
	"option_objectId",
	"option_owner",
	"option_name",
	"option_value"];

//=====================================================Function===============================
function init(){
	   
	//判断是否登录
	if (tek.common.isLoggedIn()) {
		if (tek.user.isSupervisor(parseInt(mySecurity))) {
			tek.macEdit.initialButton("btn");
			addNew();
		} else {
			// 你不是管理员提示
			showErrorMessage("<p class='text-center' style='color: red;'>你没有管理员权限！</p>");
		}
	} else {
		//提示 并 跳转登录
		goLogin();
	}
}

//获得显示的字段
function addNew() {
	var params = {};
	params["objectName"] = "ObjectOption";
	params["action"] = "getNew";

	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "add-info");
}

// 获取可选对象的选项列表
function getSelectableObjectOption() {

	var url = tek.common.getRootPath() + "servlet/sys";
	var sendData = {
		action: "getObjectNames"
	};
	$.getJSON(url, sendData, function (data) {
		if (data && data.code == 0) {
			var value = data["value"];
			if (!tek.type.isEmpty(value) && tek.type.isString(value)) {
				var values = value.split(";");
				// 字典排序
				sortAccordingToTheDictionaryOrder(values);
				// 装入option选项
				showSelectOptionInfo(values);
			} else {
				showErrorMessage('没有可选对象！');
			}
		}
	});
}

// 显示下拉选项
function showSelectOptionInfo(values) {
	if (tek.type.isEmpty(values) || !tek.type.isArray(values))
		return;

	var html = "";
	for (var i = 0, len = values.length; i < len; i++) {
		var value = values[i].split("=");

		// 添加形如 <option value="Transaction">问答</option>
		if (!tek.type.isEmpty(value[0]) && !tek.type.isEmpty(value[1])) {
			html += "<option value='" + value[0] + "'>" + value[1] + " (" + value[0] + ")</option>";
		}
	}

	$("#option_objectName").html(html);
}

//提交信息
function addNewInfo() {
	var sendData = tek.common.getSerializeObjectParameters("add_form") || {};	//转为json

	sendData["objectName"] = "ObjectOption";
	sendData["action"] = "addInfo";
	/*
	 if (tek.type.isEmpty(sendData["option_objectId"]))
	 sendData["option_objectId"] = "0";

	 if (tek.type.isEmpty(sendData["option_owner"]))
	 sendData["option_owner"] = "0";
	 */
	if (tek.type.isEmpty(sendData["option_name"])) {
		tek.macCommon.waitDialogShow(null, "配置名不能为空");
		tek.macCommon.waitDialogHide(3000);
		return;
	}

	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);
}

//--------------------------------------mac-edit.js中切入调用---------------------------------------------
// 执行自定义显示编辑域
tek.macEdit.customOperation = function (data, item, parent) {
	tek.macEdit.defaultOperation(data, item, parent);

	// 读取可选对象的选项列表
	getSelectableObjectOption();
};

// 执行页面自定义的编辑字段
tek.macEdit.appendCustomEditField = function (field, record) {
	var html = "";
	if (!tek.type.isObject(field))
		return html;

	var fieldname = field.name;    //域名
	if (tek.type.isEmpty(fieldname))
		return html;

	if (fieldname == "option_objectName") {
		html += "<div id='" + fieldname + "-form-group' class='form-group'>";
		html += tek.macEdit.appendNameField(field);
		html += "<div class='col-xs-9'>";
		if (fieldname == "option_objectName") {
			html += "<select id='" + fieldname + "' name='" + fieldname + "' class='form-control' ></select>";
			
			// input
			html+="<input id='" + fieldname + "-input' name='" + fieldname + "' class='form-control hide' disabled='disabled'/>";
			html+="<button type='button' onclick='transfer();'>切换</button>";
		}
		html += "</div>"
			+ "</div>";
			
	} else {
		html += tek.macEdit.appendDefaultEditField(field, record);
	}

	return html;
};

// 选项参数
tek.macEdit.getObjectOptionParam = function (fieldname) {
	var params = null;
	if (fieldname == "option_objectId") {
		var objName = $("#option_objectName").val();
		if (!tek.type.isEmpty(objName)) {
			params = {};
			params["objectName"] = objName;
			params["action"] = "getList";
			params["adminPage"] = "1";
		}
	} else if (fieldname == "option_owner") {
		params = {};
		params["objectName"] = "User";
		params["action"] = "getList";
	}

	return params;
};

// 选项url
tek.macEdit.getObjectOptionUrl = function (fieldname) {
	return tek.common.getRootPath() + "servlet/tobject";
};

// 执行页面自定义的初始化按钮函数
tek.macEdit.initialCustomButton = function (parentId) {
	var html = "<button type='submit' id='submitBtn' class='btn btn-danger col-xs-3'>提交</button>";

	if (showClose == 1) {
		//显示关闭按钮
		html += "<button type='button' id='closeBtn' class='btn btn-info col-xs-3' onclick='tek.common.closeWithConfirm();'>关闭</button>";
	} else if (callbackURL) {
		//显示返回按钮
		html += "<button type='button' id='callbackBtn' class='btn btn-success col-xs-3' onclick='tek.common.callbackWithConfirm(callbackURL)'>返回</button>";
	} else {
		// 显示“提交”、“重置”
		html += "<button type='reset' class='btn btn-success col-xs-3'>重置</button>";
	}

	$("#" + parentId).html(html);
};

//---------------------------------------通用函数（适用于本js文件）----------------------------------
// 显示错误信息
function showErrorMessage(msg) {
	if (!tek.type.isEmpty(msg)) {
		var errorMsg = "<div style='max-width: 600px;margin: 60px auto;text-align: center;'>" + (msg || "") + "</div>";

		$("#object_option_add").html(errorMsg);
	}
}

// 字典排序
function sortAccordingToTheDictionaryOrder(vs) {
	// 按照字典顺序（v1在v2后面返回1，v1在v2前面返回-1，v1与v2相同返回0）
	var compare = function (v1, v2) {
		v1 = v1.split("=")[0];
		v2 = v2.split("=")[0];
		if (v1.localeCompare(v2) > 0)
			return 1;
		else if (v1.localeCompare(v2) < 0)
			return -1;
		else
			return 0;
	};

	if (tek.type.isArray(vs) && vs.length > 1) {
		var low = 0, high = vs.length - 1;
		var i, tmp;
		while (low < high) {
			for (i = low; i < high; ++i) {
				if (compare(vs[i], vs[i + 1]) == 1) {
					tmp = vs[i];
					vs[i] = vs[i + 1];
					vs[i + 1] = tmp;
				}
			}
			--high;
			for (i = high; i > low; --i) {
				if (compare(vs[i], vs[i - 1]) == -1) {
					tmp = vs[i];
					vs[i] = vs[i - 1];
					vs[i - 1] = tmp;
				}
			}
			++low;
		}
	}
}

// 转换“所属对象类型名”输入方式
function transfer() {
	if ($("#option_objectName").hasClass("hide")) {
		$("#option_objectName").removeClass("hide")
		$("#option_objectName").removeAttr("disabled");
	} else {
		$("#option_objectName").addClass("hide")
		$("#option_objectName").attr("disabled", "disabled");
	}

	if ($("#option_objectName-input").hasClass("hide")) {
		$("#option_objectName-input").removeClass("hide")
		$("#option_objectName-input").removeAttr("disabled");
	} else {
		$("#option_objectName-input").addClass("hide")
		$("#option_objectName-input").attr("disabled", "disabled");
	}
}
//-----------------------------------------------------End-------------------------------------
