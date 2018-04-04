// JavaScript Document
/**************************************************
 *    新建对象分类配置页面 add-option.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var enforce = {value: null, isSuccess: false};	//是否强制目标对象使用颜色分类（0：非强制性；1：必须选择）
var private = {value: null, isSuccess: false};	//是否允许私有颜色定义（0：不允许；1：允许）

var optionObjectName;	//对应ObjectOption中option_objectName字段，所属对象类型名
var optionObjectId = "0";	//对应ObjectOption中option_objectId字段，所属对象标识
var optionOwner = "0";	//对应ObjectOption中option_owner字段，所属用户

//=====================================================Function===============================
//初始化页面参数
function initPageParams() {
    optionObjectName = request["option_objectName"];
    optionObjectName = (optionObjectName) ? decodeURIComponent(optionObjectName) : optionObjectName;

    $("#option_owner").html("<span class='label label-default'>公共</span>");
    if (tek.type.isEmpty(optionObjectName)) {
        $("#option_object").html("<select class='form-control' id='object_option_object_select' name='object_option_object_select' onchange='objectNameChange(this)'></select>");
        // 获取可选对象的选项列表
        getSelectableObjectOption();
    } else {
        $("#option_object").html(optionObjectName);
        //获取option中相应配置参数
        var isSuccessExecute = getObjectOptionParam();

        //初始化panel及配置参数
        if (isSuccessExecute) {
            initPanelBox();
        }
    }

    $(".admin-form").removeClass("hide");
}

//对象名发生改变
function objectNameChange(ele) {
    if (ele && ele.value && ele.value !== optionObjectName) {
        optionObjectName = ele.value;

        enforce = {value: null, isSuccess: false};
        private = {value: null, isSuccess: false};

        //获取option中相应配置参数
        var isSuccessExecute = getObjectOptionParam();

        //初始化panel及配置参数
        if (isSuccessExecute) {
            initPanelBox();
        }
    }
}

//--------------------------------------------选取对象--------------------------------------
// 获取可选对象的选项列表
function getSelectableObjectOption() {
    var setting = {operateType: "获取可选对象的选项列表"};
    var sendData = {action: "getObjectNames"};
    var callback = {
        success: function (data) {
            if (data.value && tek.type.isString(data.value)) {
                var values = data.value.split(";");
                // 字典排序
                sortAccordingToTheDictionaryOrder(values);
                // 装入option选项
                showSelectOptionInfo(values);
            } else {
                showSelectOptionInfo(null);
            }//end if(data) else
        },
        error: function (data, errorMsg) {
            showSelectOptionInfo(null);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/sys", setting, sendData, callback);
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

// 显示下拉选项
function showSelectOptionInfo(values) {
    var html = "<option value=''>----</option>";

    if (!tek.type.isEmpty(values) && tek.type.isArray(values)) {
        for (var i = 0, len = values.length; i < len; i++) {
            var value = values[i].split("=");

            // 添加形如 <option value="Transaction">问答</option>
            if (!tek.type.isEmpty(value[0]) && !tek.type.isEmpty(value[1])) {
                html += "<option value='" + value[0] + "'>" + value[1] + " (" + value[0] + ")</option>";
            }
        }
    }

    $("#object_option_object_select").html(html);
}

//------------------------------------------------------初始化panel框---------------------------------------------
//获取option中相应配置参数
function getObjectOptionParam() {
    var isSuccessExecute = false;

    var setting = {async: false, operateType: "获取option中相应配置参数"};
    var sendData = {
        objectName: "ObjectOption",
        action: "getList",
        option_objectName: optionObjectName,
        option_objectId: optionObjectId,
        option_owner: optionOwner,
        condition: "option_name='color_enforce' OR option_name='color_private'"
    };
    var callback = {
        success: function (data) {
            var records = data["record"] || [];
            records = tek.type.isArray(records) ? records : [records];

            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                if (record.name == "color_enforce") {
                    enforce.value = (record.option_value) ? parseInt(record.option_value.value) : null;
                } else if (record.name == "color_private") {
                    private.value = (record.option_value) ? parseInt(record.option_value.value) : null;
                }
            }
            isSuccessExecute = true;
        },
        error: function (data, errorMsg) {
            showErrorMessage(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

    return isSuccessExecute;
}

//初始化panel及配置参数（已经存在的参数，对应panel显示成功样式，输入框禁止编辑）
function initPanelBox() {
    if (!tek.type.isEmpty(enforce.value) && (enforce.value == 0 || enforce.value == 1)) {
        $("#color_enforce_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", true);
        $("input[name='color_enforce']").val(enforce.value);
        enforce.isSuccess = true;
    } else {
        $("#color_enforce_panel").removeClass("panel-success").find(".panel-body").removeClass("has-success").find("input").attr("disabled", false);
        enforce.value = $("input[name='color_enforce']").val().trim();
        enforce.isSuccess = false;
    }

    if (!tek.type.isEmpty(private.value) && (private.value == 0 || private.value == 1)) {
        $("#color_private_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", true);
        $("input[name='color_private']").val(private.value);
        private.isSuccess = true;
    } else {
        $("#color_private_panel").removeClass("panel-success").find(".panel-body").removeClass("has-success").find("input").attr("disabled", false);
        private.value = $("input[name='color_private']").val().trim();
        private.isSuccess = false;
    }
}

//------------------------------------------提交---------------------------------------
//添加对象配置信息
function addObjectOption() {
    //校验输入信息
    var check = inputInfoCheck();

    if (check) {
        //提交添加对象配置信息
        submitAddObjectOption();
    }
}

//校验输入信息
function inputInfoCheck() {
    return ((enforce.value == 0 || enforce.value == 1) && (private.value == 0 || private.value == 1));
}

//提交添加对象配置信息
function submitAddObjectOption() {
    var commonUrl = tek.common.getRootPath() + "servlet/tobject";

    var commonParams = {
        objectName: "ObjectOption",
        action: "addInfo",
        option_objectName: optionObjectName,
        option_objectId: optionObjectId,
        option_owner: optionOwner
    };

    if (!enforce.isSuccess) {
        var params2 = tek.Utils.clone(commonParams);
        params2["option_name"] = "color_enforce";
        params2["option_value"] = enforce.value;
        ajaxSubmit(commonUrl, params2,
            function (data) {
                $("#color_enforce_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", "disabled");
                enforce.isSuccess = true;
                tek.macCommon.waitDialogShow(null, "强制使用颜色 [color_enforce] 添加成功！");
            },
            function (error) {
                tek.macCommon.waitDialogShow(null, error);
            },
            0
        );
    }

    if (!private.isSuccess) {
        var params3 = tek.Utils.clone(commonParams);
        params3["option_name"] = "color_private";
        params3["option_value"] = private.value;
        ajaxSubmit(commonUrl, params3,
            function (data) {
                $("#color_private_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", "disabled");
                private.isSuccess = true;
                tek.macCommon.waitDialogShow(null, "定义私有颜色 [color_private] 添加成功！");
            },
            function (error) {
                tek.macCommon.waitDialogShow(null, error);
            },
            500
        );
    }

}

//ajax提交
function ajaxSubmit(url, params, success, error, delay) {
    if (tek.type.isEmpty(url) || !tek.type.isObject(params))
        return;

    delay = (isFinite(delay) && delay >= 0) ? parseInt(delay) : 0;

    setTimeout(function () {
        var callback = {
            beforeSend: function () {
                tek.macCommon.waitDialogShow(null, "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在提交...", null, 2);
            },
            success: function (data) {
                // 操作成功
                if (tek.type.isFunction(success))
                    success(data);
            },
            error: function (daata, errorMsg) {
                if (tek.type.isFunction(error))
                    error(errorMsg);
            },
            complete: function () {
                tek.macCommon.waitDialogHide(3000);
            }
        };
        tek.common.ajax(url, null, params, callback);
    }, delay);
}

//------------------------------------------------------校验--------------------------------
//输入值校验
function inputValueCheck(ele) {
    if (!ele)
        return;

    switch (ele.name) {
        case "color_enforce":
            if (ele.value != enforce.value) {
                if (ele.value == 0 || ele.value == 1) {
                    enforce.value = ele.value;
                } else {
                    ele.value = enforce.value;
                }
            }
            break;
        case "color_private":
            if (ele.value != private.value) {
                if (ele.value == 0 || ele.value == 1) {
                    private.value = ele.value;
                } else {
                    ele.value = private.value;
                }
            }
            break;
    }
}

//---------------------------------------通用函数（适用于本js文件）----------------------------------
//显示错误信息
function showErrorMessage(msg) {
    if (!tek.type.isEmpty(msg)) {
        var html = "<div style='max-width: 600px;margin: 60px auto;text-align: center;'>" + msg + "</div>";

        $("#object_color_option_add").html(html);
    }
}

//-----------------------------------------------------End-------------------------------------