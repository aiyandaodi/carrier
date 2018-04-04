// JavaScript Document
/**************************************************
 *    新建对象分类配置页面 add-option.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var config = {value: null, isSuccess: false};	//配置（值以二进制数表示（默认0x00）：0x00 – 允许定义对象目录树0x01 – 允许定义个人目录树）
var base = {value: null, isSuccess: false};	//基值（如，编码 ZX001002000 基值为 ZX；编码 001002000 基值 为 空""）
var depth = {value: 0, isSuccess: false};	//深度或者叫分级数（大于0的数。如，编码 ZX001002000 深度为 3）
var digit = {value: 0, isSuccess: false};	//位数，每一级编码位数（大于0的数。如，编码 ZX001002000 位数为 3）
var step = {value: 0, isSuccess: false};	//步长，同一级编码增长的跨度（大于0的数。如，编码 ZX001002000 步长为 2时，下一个编码是 ZX001004000）
var tree = {value: null, isSuccess: false};	//编码类型（杜威"dewey" 或 默认"default",默认值为"default"）

var optionObjectName;	//对应ObjectOption中option_objectName字段，所属对象类型名
var optionObjectId = "0";	//对应ObjectOption中option_objectId字段，所属对象标识
var optionOwner = "0";	//对应ObjectOption中option_owner字段，所属用户

var MAX_CODE_LENGTH = 20;	//最大编码长度

var regexp_base = /^[0-9A-z\~\!\@\#\$\%\^\&\*\(\)\|\?\.]*[A-z]$/;	//base 校验正则

//=====================================================Function===============================
function init(){
	//判断是否登录
	if (tek.common.isLoggedIn()) {
		if (tek.user.isSupervisor(parseInt(mySecurity))) {
			//初始化页面参数
			initPageParams()
		} else {
			// 你不是管理员提示
			showErrorMessage("<p class='text-center' style='color: red;'>你没有管理员权限！</p>");
		}
	} else {
		//提示 并 跳转登录
		goLogin();
	}
}

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

        config = {value: null, isSuccess: false};
        base = {value: null, isSuccess: false};
        depth = {value: 0, isSuccess: false};
        digit = {value: 0, isSuccess: false};
        step = {value: 0, isSuccess: false};
        tree = {value: null, isSuccess: false};

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
        condition: "option_name='catalog_config' OR option_name='catalog_base' OR option_name='catalog_depth'" +
        " OR option_name='catalog_digit' OR option_name='catalog_step' OR option_name='catalog_tree'"
    };
    var callback = {
        success: function (data) {
            var records = data["record"] || [];
            records = tek.type.isArray(records) ? records : [records];

            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                if (record.name == "catalog_config") {
                    config.value = (record.option_value) ? record.option_value.value : null;
                } else if (record.name == "catalog_base") {
                    base.value = (record.option_value) ? record.option_value.value : null;
                } else if (record.name == "catalog_depth") {
                    depth.value = (record.option_value) ? parseInt(record.option_value.value) : 0;
                } else if (record.name == "catalog_digit") {
                    digit.value = (record.option_value) ? parseInt(record.option_value.value) : 0;
                } else if (record.name == "catalog_step") {
                    step.value = (record.option_value) ? parseInt(record.option_value.value) : 0;
                } else if (record.name == "catalog_tree") {
                    tree.value = (record.option_value) ? record.option_value.value : null;
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
    if (!tek.type.isEmpty(config.value, true)) {
        $("#catalog_config_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", true);
        $("input[name='catalog_config']").val(config.value);
        config.isSuccess = true;
    } else {
        $("#catalog_config_panel").removeClass("panel-success").find(".panel-body").removeClass("has-success").find("input").attr("disabled", false);
        config.value = $("input[name='catalog_config']").val().trim();
        config.isSuccess = false;
    }

    if (!tek.type.isEmpty(base.value, true)) {
        $("#catalog_base_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", true);
        $("input[name='catalog_base']").val(base.value);
        base.isSuccess = true;
    } else {
        $("#catalog_base_panel").removeClass("panel-success").find(".panel-body").removeClass("has-success").find("input").attr("disabled", false);
        base.value = $("input[name='catalog_base']").val().trim();
        base.isSuccess = false;
    }

    if (!tek.type.isEmpty(depth.value) && depth.value > 0) {
        $("#catalog_depth_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", true);
        $("input[name='catalog_depth']").val(depth.value);
        depth.isSuccess = true;
    } else {
        $("#catalog_depth_panel").removeClass("panel-success").find(".panel-body").removeClass("has-success").find("input").attr("disabled", false);
        depth.value = $("input[name='catalog_depth']").val().trim();
        depth.isSuccess = false;
    }

    if (!tek.type.isEmpty(digit.value) && digit.value > 0) {
        $("#catalog_digit_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", true);
        $("input[name='catalog_digit']").val(digit.value);
        digit.isSuccess = true;
    } else {
        $("#catalog_digit_panel").removeClass("panel-success").find(".panel-body").removeClass("has-success").find("input").attr("disabled", false);
        digit.value = $("input[name='catalog_digit']").val().trim();
        digit.isSuccess = false;
    }

    if (!tek.type.isEmpty(step.value) && step.value > 0) {
        $("#catalog_step_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", true);
        $("input[name='catalog_step']").val(step.value);
        step.isSuccess = true;
    } else {
        $("#catalog_step_panel").removeClass("panel-success").find(".panel-body").removeClass("has-success").find("input").attr("disabled", false);
        step.value = $("input[name='catalog_step']").val().trim();
        step.isSuccess = false;
    }

    if (!tek.type.isEmpty(tree.value, true)) {
        $("#catalog_tree_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", true);
        $("input[name='catalog_tree']").val(tree.value);
        tree.isSuccess = true;
    } else {
        $("#catalog_tree_panel").removeClass("panel-success").find(".panel-body").removeClass("has-success").find("input").attr("disabled", false);
        tree.value = $("input[name='catalog_tree']:checked").val().trim();
        tree.isSuccess = false;
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
    return ((config.value == "0x00" || config.value == "0x01")
    && (base.value == "" || regexp_base.test(base.value))
    && depth.value >= 1 && digit.value >= 1 && step.value >= 1
    && (base.value.length + depth.value * digit.value) <= MAX_CODE_LENGTH
    && (tree.value == "dewey" || tree.value == "default"));
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

    if (!config.isSuccess) {
        var params1 = tek.Utils.clone(commonParams);
        params1["option_name"] = "catalog_config";
        params1["option_value"] = config.value;
        ajaxSubmit(commonUrl, params1,
            function (data) {
                $("#catalog_config_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", "disabled");
                config.isSuccess = true;
                tek.macCommon.waitDialogShow(null, "目录树配置 [catalog_config] 添加成功！");
            },
            function (error) {
                tek.macCommon.waitDialogShow(null, error);
            },
            0
        );
    }

    if (!base.isSuccess) {
        var params1 = tek.Utils.clone(commonParams);
        params1["option_name"] = "catalog_base";
        params1["option_value"] = base.value;
        ajaxSubmit(commonUrl, params1,
            function (data) {
                $("#catalog_base_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", "disabled");
                base.isSuccess = true;
                tek.macCommon.waitDialogShow(null, "基值 [catalog_base] 添加成功！");
            },
            function (error) {
                tek.macCommon.waitDialogShow(null, error);
            },
            500
        );
    }

    if (!depth.isSuccess) {
        var params2 = tek.Utils.clone(commonParams);
        params2["option_name"] = "catalog_depth";
        params2["option_value"] = depth.value;
        ajaxSubmit(commonUrl, params2,
            function (data) {
                $("#catalog_depth_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", "disabled");
                depth.isSuccess = true;
                tek.macCommon.waitDialogShow(null, "深度 [catalog_depth] 添加成功！");
            },
            function (error) {
                tek.macCommon.waitDialogShow(null, error);
            },
            1000
        );
    }

    if (!digit.isSuccess) {
        var params3 = tek.Utils.clone(commonParams);
        params3["option_name"] = "catalog_digit";
        params3["option_value"] = digit.value;
        ajaxSubmit(commonUrl, params3,
            function (data) {
                $("#catalog_digit_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", "disabled");
                digit.isSuccess = true;
                tek.macCommon.waitDialogShow(null, "位数 [catalog_digit] 添加成功！");
            },
            function (error) {
                tek.macCommon.waitDialogShow(null, error);
            },
            1500
        );
    }

    if (!step.isSuccess) {
        var params4 = tek.Utils.clone(commonParams);
        params4["option_name"] = "catalog_step";
        params4["option_value"] = step.value;
        ajaxSubmit(commonUrl, params4,
            function (data) {
                $("#catalog_step_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", "disabled");
                step.isSuccess = true;
                tek.macCommon.waitDialogShow(null, "步长 [catalog_step] 添加成功！");
            },
            function (error) {
                tek.macCommon.waitDialogShow(null, error);
            },
            2000
        );
    }

    if (!tree.isSuccess) {
        var params5 = tek.Utils.clone(commonParams);
        params5["option_name"] = "catalog_tree";
        params5["option_value"] = tree.value;
        ajaxSubmit(commonUrl, params5,
            function (data) {
                $("#catalog_tree_panel").addClass("panel-success").find(".panel-body").addClass("has-success").find("input").attr("disabled", "disabled");
                tree.isSuccess = true;
                tek.macCommon.waitDialogShow(null, "编码类型 [catalog_tree] 添加成功！");
            },
            function (error) {
                tek.macCommon.waitDialogShow(null, error);
            },
            2500
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

    //获取每一级允许最大值（由digit决定，如digit=4，maxSlice=9999）
    var getMaxSlice = function () {
        var v = "";
        for (var i = 0; i < digit.value; i++) {
            v += "9";
        }
        return parseInt(v);
    };

    switch (ele.name) {
        case "catalog_config":
            if (ele.value != config.value) {
                if (config.value == "0x00" || config.value == "0x01") {
                    config.value = ele.value;
                } else {
                    ele.value = config.value;
                }
            }
            break;
        case "catalog_base":
            if (ele.value != base.value) {
                if ((ele.value == "" || regexp_base.test(ele.value)) && (ele.value.length + depth.value * digit.value) <= MAX_CODE_LENGTH) {
                    base.value = ele.value;
                } else {
                    ele.value = base.value;
                }
            }
            break;
        case "catalog_depth":
            if (ele.value != depth.value) {
                ele.value = parseInt(ele.value);
                if ((base.value.length + ele.value * digit.value) <= MAX_CODE_LENGTH) {
                    depth.value = parseInt(ele.value);
                } else {
                    ele.value = depth.value;
                }
            }
            break;
        case "catalog_digit":
            if (ele.value != digit.value) {
                ele.value = parseInt(ele.value);
                if ((base.value.length + depth.value * ele.value) <= MAX_CODE_LENGTH) {
                    digit.value = parseInt(ele.value);
                } else {
                    ele.value = digit.value;
                }
            }
            break;
        case "catalog_step":
            if (ele.value != step.value) {
                ele.value = parseInt(ele.value);
                if (ele.value >= 1 && ele.value <= getMaxSlice()) {
                    step.value = parseInt(ele.value);
                } else {
                    if (ele.value < 1)
                        step.value = ele.value = 1;
                    if (ele.value > getMaxSlice())
                        step.value = ele.value = getMaxSlice();
                }
            }
            break;
        case "catalog_tree":
            if (ele.value != tree.value) {
                if (tree.value == "dewey" || tree.value == "default") {
                    tree.value = ele.value;
                } else {
                    ele.value = tree.value;
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

        $("#object_catalog_option_add").html(html);
    }
}

//-----------------------------------------------------End-------------------------------------