// JavaScript Document
/**************************************************
 *    对象分类目录树 tree.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var catalogObject;   //指明当前使用的对象类型名（ObjectName）
var objectName;	//当前对象分类所属对象名（对应catalog_object字段）
var catalogOwner = 0;  //指明对象分类所有者（对应catalog_owner字段）

//=====================================================Function===============================

// 初始化
function init() {
	// 初始化页面布局及参数
	initPage();
}
// 初始化页面布局及参数
function initPage() {
    catalogObject = "ObjectCatalog";

    objectName = request["object-name"];
    objectName = (objectName) ? decodeURIComponent(objectName) : objectName;
    catalogOwner = request["catalog-owner"];
    catalogOwner = (catalogOwner) ? decodeURIComponent(catalogOwner) : catalogOwner;

    if (tek.type.isEmpty(objectName)) {
        // 显示对象选择域
        $("#object_select_box").removeClass("hide");
        // 获取可选对象的选项列表
        getSelectableObjectOption();
    } else {
        // 更新显示树widget的title
        var title = "【" + (!catalogOwner ? "公共" : "私有") + "】目录分类 (" + objectName + ")";
        $("#object_catalog_title").html(title);
        // 重新显示目录树
        redisplayTree();
    }


}

//--------------------------------------------选取对象--------------------------------------
// 获取可选对象的选项列表
function getSelectableObjectOption() {
    var setting = {operateType: "获取可选对象的选项列表"};
    var sendData = {
        action: "getObjectNames"
    };
    var callback = {
        success: function (data) {
            if (data.value && tek.type.isString(data.value)) {
                var values = data.value.split(";");
                // 字典排序
                sortAccordingToTheDictionaryOrder(values);
                // 过滤values列表
                values = filterSelectOption(values);
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

    var setting = {async: false, operateType: "获取可选对象的选项列表"};
    var sendData = {
        objectName: "ObjectOption",
        action: "getList",
        select: "DISTINCT (option_objectName)",
        condition: encodeURIComponent("option_name LIKE 'catalog_%'")
    };
    var callback = {
        success: function (data) {
            var records = data['record'];
            if (records) {
                records = !records.length ? [records] : records;
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

    $("#object_catalog_object_select").html(html);
}

// 变更对象类型名
function changeObjectName() {
    var objName;
	if ($("#object_catalog_object_select").hasClass("hide")){
		objName = $("#object_catalog_object_select-input").val();
	}else{
		objName = $("#object_catalog_object_select").val();
	}
    if (!tek.type.isEmpty(objName) && objName != objectName) {
        objectName = objName;
        // 更新显示树widget的title
        var title = "【" + (!catalogOwner ? "公共" : "私有") + "】目录分类 (" + objectName + ")";
        $("#object_catalog_title").html(title);
        // 重新显示目录树
        redisplayTree();
        // 在干点别的事情。。。
    }
}

//--------------------------------------------目录树显示--------------------------------------
// 重新显示目录树
function redisplayTree() {
    var options = {};
    var openAll = request["open-all"];
    if (openAll && (openAll == 1 || openAll == true))
        options["open-all"] = true;

    // 初始化树
    initTree("object_catalog_ztree", "ztree_msg", catalogObject, objectName, catalogOwner, options);
}

//---------------------------------------通用函数（适用于本js文件）----------------------------------
// 显示错误信息
function showErrorMessage(msg) {
    if (!tek.type.isEmpty(msg)) {
        var html = "<div style='max-width: 600px;margin: 0 auto;text-align: center;'>" + msg + "</div>";

        $("#object_dictionary_select").html(html);
    }
}

// 选择对象 切换
function transfer() {
	if ($("#object_catalog_object_select").hasClass("hide")) {
		$("#object_catalog_object_select").removeClass("hide")
		$("#object_catalog_object_select").removeAttr("disabled");
	} else {
		$("#object_catalog_object_select").addClass("hide")
		$("#object_catalog_object_select").attr("disabled", "disabled");
	}

	if ($("#object_catalog_object_select-input").hasClass("hide")) {
		$("#object_catalog_object_select-input").removeClass("hide")
		$("#object_catalog_object_select-input").removeAttr("disabled");
	} else {
		$("#object_catalog_object_select-input").addClass("hide")
		$("#object_catalog_object_select-input").attr("disabled", "disabled");
	}
}

//--------------------------------------------End--------------------------------------
