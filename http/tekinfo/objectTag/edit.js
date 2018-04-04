// JavaScript Document
/**************************************************
 *    编辑标签分类 edit.js
 *
 *
 *
 **************************************************/
//=====================================================init==================================
var tag_id;		//对象标签记录id
var request = tek.common.getRequest();

function init(){
	tag_id=request["tag_id"];
	
	//判断是否登录
	if (tek.common.isLoggedIn()) {
		tek.macEdit.initialButton("btn");
		editNew(tag_id);
	} else {
		//提示 并 跳转登录
		goLogin();
	}
}
//=====================================================Parameter=============================
//显示字段数组
var items = [
    "tag_code",
    "tag_name",
    "tag_object",
    "tag_owner",
    "tag_language"];

var selectedObject;	//被选中对象

//=====================================================Function===============================
//获得显示的字段
function editNew(tag_id) {
    var params = {};
    params["objectName"] = "ObjectTag";
    params["action"] = "getEdit";
    params["tag_id"] = tag_id;

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "set-info");
}

// 获取可选对象的选项列表
function getSelectableObjectOption() {
    var setting = {operateType: "获取可选对象的选项列表"};
    var sendData = {action: "getObjectNames"};
    var callback = {
        success: function (data) {
            var value = data["value"];
            if (!tek.type.isEmpty(value) && tek.type.isString(value)) {
                var values = value.split(";");
                // 字典排序
                sortAccordingToTheDictionaryOrder(values);
                // 过滤values列表
                values = filterSelectOption(values);
                // 装入option选项
                showSelectOptionInfo(values);
            } else {
                showErrorMessage('没有可选对象！');
            }
        },
        error: function (data, errorMsg) {
            showErrorMessage(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/sys", setting, sendData, callback);
}

// 过滤values列表
function filterSelectOption(values) {
    if (!tek.type.isArray(values))
        return [];

    var newValues = [];
    // 读取ObjectOption 中已经定义参数配置的对象列表
    var selectableList = getCatalogObjectWithExistOption();
    if (tek.type.isArray(selectableList) && selectableList.length > 0) {
        for (var i = 0; i < values.length; i++) {
            var v = values[i].split("=");
            if (tek.type.isEmpty(v[0]))
                continue;
            for (var j = 0, len = selectableList.length; j < len; j++) {
                if (v[0] !== selectableList[j])
                    continue;
                newValues.push(values[i]);
                selectableList.splice(j, 1);
                break;
            }
        }
    }

    return newValues;
}

// 读取ObjectOption 中已经定义参数配置的对象列表
function getCatalogObjectWithExistOption() {
    var selectableList = [];

    var setting = {async: false, operateType: "获取ObjectOption中已经定义参数配置的对象列表"};
    var sendData = {
        objectName: "ObjectOption",
        action: "getList",
        select: "DISTINCT (option_objectName)",
        condition: encodeURIComponent("option_name LIKE 'tag_%'")
    };
    var callback = {
        success: function (data) {
            if (data.record) {
                var records = (tek.type.isArray(data.record)) ? data.record : [data.record];
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    if (record.option_objectName)
                        selectableList.push(record.option_objectName.value);
                }
            }
        },
        error: function (data, errorMsg) {
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

    return selectableList;
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
            html += "<option value='" + value[0] + (selectedObject == value[0] ? "' selected >" : "' >") + value[1] + " (" + value[0] + ")</option>";
        }
    }

    $("#tag_object").html(html);
}

//提交信息
function setNewInfo(tag_id) {
    var sendData = tek.common.getSerializeObjectParameters("set_form") || {};	//转为json

    sendData["objectName"] = "ObjectTag";
    sendData["action"] = "setInfo";
    sendData["tag_id"] = tag_id;

    if (tek.type.isEmpty(sendData["tag_name"])) {
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

    if (fieldname == "tag_object") {
        html += "<div id='" + fieldname + "-form-group' class='form-group'>";

        html += tek.macEdit.appendNameField(field);

        html += "<div class='col-xs-9'>";

        if (fieldname == "tag_object") {
            html += "<select id='" + fieldname + "' name='" + fieldname + "' class='form-control' ></select>";

            selectedObject = field.value;
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
    if (fieldname == "tag_owner") {
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
        var html = "<div style='max-width: 600px;margin: 60px auto;text-align: center;'>" + msg + "</div>";

        $("#object_tag_add").html(html);
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

//-----------------------------------------------------End-------------------------------------
