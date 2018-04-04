// JavaScript Document
/**************************************************
 *    编辑事务页面
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
//显示字段数组
var items = new Array(
	"transaction_code",
	"transaction_name",
	"transaction_summary",
	"transaction_type",
	"transaction_status",
	"transaction_read",
	"transaction_objectName",
	"transaction_objectId");

//=====================================================Function===============================

var transactionId;  //
 
/**
* 初始化
*/
function init(){
	transactionId = request["transaction_id"];

	tek.macEdit.initialButton("btn");

	editNew(transactionId); 
}


//获得显示的字段
function editNew(transactionId) {
	var params = {};
	params["objectName"] = "Transaction";
	params["action"] = "getEdit";
	params["transaction_id"] = transactionId;

	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "add-info");
}


//提交信息
function setNewInfo(transactionId) {
	var mydata = tek.common.getSerializeObjectParameters("set_form") || {};	//转为json
	mydata["objectName"] = "Transaction";
	mydata["action"] = "setInfo";
	mydata["transaction_id"] = transactionId;

	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}


//------------------------------------------mac-edit.js中调用-----------------------------------------
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

/**
 * 自定义输入框
 * @param {Object} data AJAX返回数据
 * @param {Array} items 显示字段数组
 * @param {Element} parent 父元素
 */
tek.macEdit.customOperation = function (data, items, parent) {
	tek.macEdit.defaultOperation(data, items, parent);

	if (data && data.record && data.record["transaction_summary"]) {
		var field = data.record["transaction_summary"]

		var html = "<h3><b>" + field.display + "：" + "</b></h3>" + tek.dataUtility.stringToHTML(field.show);

		$("#transaction_summary").html(html);
	}
};

// 执行页面自定义的初始化按钮函数
tek.macEdit.appendCustomEditField = function (field, record) {
	var html = "";
	if (!tek.type.isObject(field))
		return html;

	var fieldname = field.name;    //域名
	if (tek.type.isEmpty(fieldname))
		return html;

	if (fieldname == "transaction_name" || field.name == "transaction_objectName" || field.name == "transaction_objectId") {
		html += "<div id='" + fieldname + "-form-group' class='form-group'>"
			+ tek.macEdit.appendNameField(field)
			+ "<div class='col-xs-9'>";

		if ((fieldname == "transaction_name") || (field.name == "transaction_objectName")) {
			html += "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + (field.show.trim() || "") + "' readonly/>";
		} else if (field.name == "transaction_objectId") {
			html += "<input type='hidden' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + field.value + "'/>"
				+ "<input type='text' id='" + fieldname + "-input' class='form-control' value='" + (field.show.trim() || "") + "' readonly/>";
		}
		html += "</div>"

			+ "</div>";
	} else {
		html += tek.macEdit.appendDefaultEditField(field, record);
	}

	return html;
};

//自定义取得fieldname字段的对象列表信息的ajax调用参数（如果存在对象域，需要实现该函数）
tek.macEdit.getObjectOptionParam = function (fieldname) {
	var params = {};

	var objectName = $("#transaction_objectName").val();
	params["objectName"] = objectName;
	params["action"] = "getList";

	return params;
};

//自定义取得fieldname字段的对象列表信息的ajax调用url（如果存在对象域，需要实现该函数）
tek.macEdit.getObjectOptionUrl = function (fieldname) {
	return tek.common.getRootPath() + "servlet/tobject";
};

//-----------------------------------------------------End-------------------------------------