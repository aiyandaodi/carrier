// JavaScript Document
/**************************************************
 *    编辑目录分类页面 edit.js
 *
 *
 *
 **************************************************/
//=====================================================init=================================
var catalog_id;		//对象目录记录id
var request = tek.common.getRequest();
function init(){

	catalog_id=request["catalog_id"];
	
	//判断是否登录
	if (tek.common.isLoggedIn()) {
		tek.macEdit.initialButton("btn");
		editNew(catalog_id);
	} else {
		//提示 并 跳转登录
		goLogin();
	}
}
//=====================================================Parameter=============================
var config;	//目录树配置

//显示字段数组
var items = [
    "catalog_code",
    "catalog_name",
    "catalog_object",
    "catalog_owner"];

//=====================================================Function===============================
//获得显示的字段
function editNew(catalog_id) {
    var params = {};
    params["objectName"] = "ObjectCatalog";
    params["action"] = "getEdit";
    params["catalog_id"] = catalog_id;

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "set-info");
}

//提交信息
function setNewInfo(catalog_id) {
    var sendData = tek.common.getSerializeObjectParameters("set_form") || {};	//转为json

    sendData["objectName"] = "ObjectCatalog";
    sendData["action"] = "setInfo";
    sendData["catalog_id"] = catalog_id;

    if (tek.type.isEmpty(sendData["catalog_code"])) {
        tek.macCommon.waitDialogShow(null, "目录分类的编码不能为空");
        tek.macCommon.waitDialogHide(3000);
        return;
    }

    if (tek.type.isEmpty(sendData["catalog_name"])) {
        tek.macCommon.waitDialogShow(null, "目录分类的名称不能为空");
        tek.macCommon.waitDialogHide(3000);
        return;
    }

    if (config == '0x00' && sendData["catalog_owner"] != '0') {
        tek.macCommon.waitDialogShow(null, "目录分类只允许定义公共目录");
        tek.macCommon.waitDialogHide(3000);
        return;
    } else if (config == '0x01' && sendData["catalog_owner"] == '0') {
        tek.macCommon.waitDialogShow(null, "目录分类只允许定义私有目录");
        tek.macCommon.waitDialogHide(3000);
        return;
    }

    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);
}

//---------------------------------------------xxx---------------------------------------------
//获取option中相应配置参数
function getOptionParams(catalogObject, catalogOwner) {
    var setting = {async: false, operateType: "获取参数配置中相应配置参数"};
    var sendData = {
        objectName: "ObjectCatalog",
        action: "readInfo",
        'read-option': 1,
        catalog_object: catalogObject,
        catalog_owner: catalogOwner
    };
    var callback = {
        success: function (data) {
            var record = data["record"];
            record = record || {};

            if (record.catalog_config) {
                var value = record.catalog_config.value;
                config = (value == '0x00' || value == '0x01') ? value : "0x00";
            }

            var base, depth, digit, step, tree;
            if (record.catalog_base) {
                var value = record.catalog_base.value;
                base = !!value ? value : "";
            }
            if (record.catalog_depth) {
                var value = record.catalog_depth.value;
                depth = (value > 0) ? parseInt(value) : 0;
            }
            if (record.catalog_digit) {
                var value = record.catalog_digit.value;
                digit = (value > 0) ? parseInt(value) : 0;
            }
            if (record.catalog_step) {
                var value = record.catalog_step.value;
                step = (value > 0) ? parseInt(value) : 0;
            }
            if (record.catalog_tree) {
                var value = record.catalog_tree.value;
                tree = (value == 'default' || value == 'dewey') ? value : "default";
            }

            var msg = "编码方式：" + (tree == "dewey" ? "杜威" : "默认")
                + "；前缀：" + (base.length > 0 ? base : "无")
                + "；划分层级数：" + depth + "级；每一级位数：" + digit + "位；步长：" + step;

            $("#code_help").html(msg);

        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//--------------------------------------mac-edit.js中切入调用---------------------------------------------
// 执行自定义显示编辑域
tek.macEdit.customOperation = function (data, items, parent) {
    tek.macEdit.defaultOperation(data, items, parent);

    var catalogObject, catalogOwner;

    if (data || data.record) {
        var field;
        field = data.record.catalog_object;
        if (field && field.value)
            catalogObject = field.value;
        field = data.record.catalog_owner;
        if (field && field.value)
            catalogOwner = field.value;
    }

    // 获取option中相应配置参数
    if (!tek.type.isEmpty(catalogObject) && !tek.type.isEmpty(catalogOwner))
        getOptionParams(catalogObject, catalogOwner);
};

// 执行页面自定义的编辑字段
tek.macEdit.appendCustomEditField = function (field, record) {
    var html = "";
    if (!tek.type.isObject(field))
        return html;

    var fieldname = field.name;    //域名
    var show = field.show || "";
    if (tek.type.isEmpty(fieldname))
        return html;

    if (fieldname == "catalog_code" || fieldname == "catalog_object") {
        html += "<div id='" + fieldname + "-form-group' class='form-group'>";

        html += tek.macEdit.appendNameField(field);

        html += "<div class='col-xs-9'>";

        if (fieldname == "catalog_code") {
            html += "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + show + "'/>"
                + "<p id='code_help' class='help-block text-right' style='font-size: 1em;line-height: 1.2em;'></p>";
        }
        if (fieldname == "catalog_object") {
            html += "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + show + "' readonly/>";
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
    if (fieldname == "catalog_owner") {
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
        var error = "<div style='max-width: 600px;margin: 60px auto;text-align: center;'>" + msg + "</div>";

        $("#object_option_add").html(error);
    }
}

//-----------------------------------------------------End-------------------------------------
