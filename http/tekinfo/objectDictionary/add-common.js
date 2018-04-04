// JavaScript Document
/**************************************************
 *    新建字典页面 index.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
//显示字段数组
var items = [
    "dictionary_code",
    "dictionary_original",
    "dictionary_language",
    "dictionary_name",
    "dictionary_targetObject",
    "dictionary_targetFields",
    "dictionary_property"];

var targetObject;
/**
 * 初始化
 */
function init(){
    targetObject = request['dictionary_targetObject'];
	   
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
    params["objectName"] = "ObjectDictionary";
    params["action"] = "getNew";

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "add-info");
}

//提交信息
function addNewInfo() {
    var sendData = tek.common.getSerializeObjectParameters("add_form") || {};	//转为json

    sendData["objectName"] = "ObjectDictionary";
    sendData["action"] = "addInfo";

    /*
     var original = sendData["dictionary_original"];
     if (original && original.indexOf("0x") == 0) {
     var num = parseInt(original);
     sendData["dictionary_original"] = num;
     }*/

    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);
}

//--------------------------------------mac-edit.js中切入调用---------------------------------------------
// 执行页面自定义的编辑字段
tek.macEdit.appendCustomEditField = function (field, record) {
    var html = "";
    if (!tek.type.isObject(field))
        return html;

    var fieldname = field.name;    //域名
    if (tek.type.isEmpty(fieldname))
        return html;

    if (targetObject && fieldname == "dictionary_targetObject") {
        html += "<div id='" + fieldname + "-form-group' class='form-group'>";

        html += tek.macEdit.appendNameField(field);

        html += "<div class='col-xs-9'>";
        if (fieldname == "dictionary_targetObject") {
            html += "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + targetObject + "' readonly/>";
        }
        html += "</div>"

        + "</div>";
    } else {
        html += tek.macEdit.appendDefaultEditField(field, record);
    }

    return html;
};

// 执行页面自定义的初始化按钮函数  --mac-edit.js中调用
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
        var error = "<div style='max-width: 600px;margin: 60px auto;text-align: center;'>" + msg + "</div>";

        $("#object_dictionary_add").html(error);
    }
}

//-----------------------------------------------------End-------------------------------------
