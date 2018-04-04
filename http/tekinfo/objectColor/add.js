// JavaScript Document
/**************************************************
 *    新建分类颜色 add.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var selectedObject;	//被选中的对象

var _color_enforce;	//是否强制使用颜色分类 如果为1，新建目标对象必须选择颜色分类。
var _color_private;	//是否允许私有颜色定义 如果为1，可以用户定义私有颜色。

var DEFAULT_COLOR_VALUE = "000000";	//默认颜色值（color_value字段）

//显示字段数组
var items = [
    "color_code",
    "color_name",
    "color_value",
    "color_object",
    "color_owner"];


//=====================================================Function===============================

function init(){
	//判断是否登录
	if (tek.common.isLoggedIn()) {
		if (tek.user.isSupervisor(parseInt(mySecurity))) {
			// 获取可选对象的选项列表
			getSelectableObjectOption();
		} else {
			// 你不是管理员提示
			showErrorMessage("<p class='text-center' style='color: red;'>你没有管理员权限！</p>");
		}
	} else {
		//提示 并 跳转登录
		goLogin();
	}
}
//------------------------------------------------对象选择widget-------------------------------------
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
                showErrorMessage1('没有可选对象！');
            }
        },
        error: function (data, errorMsg) {
            showErrorMessage1(errorMsg);
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
        condition: encodeURIComponent("option_name LIKE 'color_%'")
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
            html += "<option value='" + value[0] + "'>" + value[1] + " (" + value[0] + ")</option>";
        }
    }

    $("#object_color_object_select").html(html);
}

// 根据选中的对象选项，切换到 颜色新建widget
function selectColorObject() {
    selectedObject = $("#object_color_object_select").val();
    if (!tek.type.isEmpty(selectedObject)) {
        // 读取option中该对象的配置参数
        getObjectOptionParams();

        // 校验编码配置参数通过，读取列表信息
        if (tek.type.isNumber(_color_enforce) && tek.type.isNumber(_color_private)) {
            if (tek.user.isAdminUser(mySecurity) || (tek.user.isNormalUser(mySecurity) && _color_private == 1)) {
                $("#object_select_widget").hide(500, function () {
                    $("#color_add_widget").show(500);
                    tek.macEdit.initialButton("btn");
                    addNew();
                });
            } else {
                var msg = "<div style='margin: 30px 0;'>您没有创建该对象颜色的权限！</div>";
                tek.macCommon.waitDialogShow(null, msg, null, 2);
            }
        } else {
            var msg = "<div style='margin: 30px 0;'>该对象颜色分类的配置参数不完善，请先 <a style='font-weight: 600;' href='javascript:addObjectOption();'>完善</a> ！</div>";
            tek.macCommon.waitDialogShow(null, msg, null, 2);
        }
    }
}

// 添加编码配置参数
function addObjectOption() {
    tek.macCommon.waitDialogHide();
    tek.macCommon.waitDialogOn('hidden', function (e) {
        var url = tek.common.getRootPath() + "http/tekinfo/objectColor/admin/add-option.html?option_objectName=" + selectedObject + "&show-close=1&refresh-opener=1";
        window.open(url, "_blank");
    });
}

//-------------------------------------------------读取配置参数--------------------------------------------
// 读取option中该对象的配置参数
function getObjectOptionParams() {
    var setting = {async: false, operateType: "读取option中该对象的配置参数"};
    var sendData = {
        objectName: "ObjectColor",
        action: "readInfo",
        'read-option': 1,
        color_object: selectedObject
    };
    var callback = {
        success: function (data) {
            var record = data["record"];
            record = record || {};

            if (record.color_enforce) {
                var value = record.color_enforce.value;
                _color_enforce = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
            }
            if (record.color_private) {
                var value = record.color_private.value;
                _color_private = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
            }
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//------------------------------------------------颜色新建widget-------------------------------------
//获得显示的字段
function addNew() {
    var params = {};
    params["objectName"] = "ObjectColor";
    params["action"] = "getNew";

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "add-info");
}


//提交信息
function addNewInfo() {
    var sendData = tek.common.getSerializeObjectParameters("add_form") || {};	//转为json

    sendData["objectName"] = "ObjectColor";
    sendData["action"] = "addInfo";

    if (tek.type.isEmpty(sendData["color_name"])) {
        tek.macCommon.waitDialogShow(null, "配置名不能为空");
        tek.macCommon.waitDialogHide(3000);
        return;
    }

    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);
}

//------------------------------------------colpick 调色板------------------------------------------
//设置调色板
function setColorPicker() {
    var colorValueInputEle = $("#color_value");
    var colorPreviewEle = $("#color_preview > i");

    //添加调色板
    $("#color_picker").colpick({
        submitText: '确定',
        color: DEFAULT_COLOR_VALUE,
        onChange: function (hsb, hex, rgb, el, bySetColor) {
            colorPreviewEle.css('color', '#' + hex);

            colorValueInputEle.val(hex);
        },
        onSubmit: function (hsb, hex, rgb, el) {
            colorPreviewEle.css('color', '#' + hex);

            colorValueInputEle.val(hex);

            $(el).colpickHide();
        }
    });
}

//--------------------------------------mac-edit.js中切入调用---------------------------------------------
// 自定义操作
tek.macEdit.customOperation = function (data, items, parent) {
    // 默认输入框
    tek.macEdit.defaultOperation(data, items, parent);

    // 设置调色板
    setColorPicker();
};

// 执行页面自定义的编辑字段
tek.macEdit.appendCustomEditField = function (field, record) {
    var html = "";
    if (!tek.type.isObject(field))
        return html;

    var fieldname = field.name;    //域名
    if (tek.type.isEmpty(fieldname))
        return html;

    if (fieldname == "color_object" || fieldname == "color_value") {
        html += "<div id='" + fieldname + "-form-group' class='form-group'>";

        html += tek.macEdit.appendNameField(field);

        html += "<div class='col-xs-9'>";

        if (fieldname == "color_object") {
            html += "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + selectedObject + "' readonly/>";
        } else if (fieldname == "color_value") {
            html += "<div class='input-group'>"
                + "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + DEFAULT_COLOR_VALUE + "' readonly/>"
                + "<span class='input-group-btn' style='font-size: 0.8em;'>"
                + "<button class='btn btn-default' id='color_preview' type='button'>&nbsp;<i class='fa fa-stop'></i>&nbsp;</button>"
                + "<button class='btn btn-default' id='color_picker' type='button'>调色板</button>"
                + "</span>"
                + "</div>";
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
    if (fieldname == "color_owner") {
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
// 显示错误信息 --选择对象widget
function showErrorMessage1(msg) {
    if (!tek.type.isEmpty(msg)) {
        var html = "<div style='max-width: 600px;margin: 60px auto;text-align: center;'>" + msg + "</div>";

        $("#object_color_select").html(html);
    }
}

// 显示错误信息 --颜色新建widget
function showErrorMessage(msg) {
    if (!tek.type.isEmpty(msg)) {
        var html = "<div style='max-width: 600px;margin: 60px auto;text-align: center;'>" + msg + "</div>";

        $("#object_color_add").html(html);
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
