// JavaScript Document
/**************************************************
 *    新建对象字典页面 add.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================

//=====================================================Function===============================
//--------------------------------------------xxx--------------------------------------

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
                // 装入option选项
                showSelectOptionInfo(values);
            } else {
                showErrorMessage('没有可选对象！');
            }//end if(record)
        },
        error: function (data, errorMsg) {
            showErrorMessage(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/sys", setting, sendData, callback);
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

    $("#object_dictionary_object_select").html(html);
}

// 根据选中的对象选项，跳转页面
function selectDictionaryObject() {
    var key = [];
    key.push("show-close");
    key.push("refresh-opener");
    key.push("refresh-opener-func");
    var param = tek.common.getRequestParams(key, request, "?", null);

    var url = tek.common.getRootPath();

    var selectedObject = $("#object_dictionary_object_select").val();
    switch (selectedObject) {
        case 'Transaction':
            url += "http/tekinfo/transaction/admin/add-dictionary.html";
            param = tek.common.appendURLParam(param, "dictionary_targetObject", selectedObject);
            param = tek.common.appendURLParam(param, "dictionary_targetFields", "transaction_type");
            break;

        default:
            url += "http/tekinfo/objectDictionary/add-common.html";
            param = tek.common.appendURLParam(param, "dictionary_targetObject", selectedObject);
            break;
    }

    location.href = url + param;
}


//---------------------------------------通用函数（适用于本js文件）----------------------------------
// 显示错误信息
function showErrorMessage(msg) {
    if (!tek.type.isEmpty(msg)) {
        var errorMsg = "<div style='max-width: 600px;margin: 0 auto;text-align: center;'>"+msg+"</div>";

        $("#object_dictionary_select").html(errorMsg);
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

//--------------------------------------------End--------------------------------------