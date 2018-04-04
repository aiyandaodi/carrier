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
//--------------------------------------------初始化页面--------------------------------------
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
    } else {
        // 更新显示树widget的title
        var title = "【" + (!catalogOwner ? "公共" : "私有") + "】目录分类 (" + objectName + ")";
        $("#object_catalog_title").html(title);
        // 重新显示目录树
        redisplayTree();
    }
}


//-------------------------------------------------------选取对象--------------------------------------------------------
// 变更对象类型名
function changeObjectName() {
    var objName;
	if ($("#object_catalog_object_select").hasClass("hide"))
		objName = $("#object_catalog_object_select-input").val();
	else
		objName = $("#object_catalog_object_select").val();

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


//-------------------------------------------------------目录树显示------------------------------------------------------
// 重新显示目录树
function redisplayTree() {
    var options = {};
    var openAll = request["open-all"];
    if (openAll && (openAll == 1 || openAll == true))
        options["open-all"] = true;

    // 初始化树
    initTree("object_catalog_ztree", "ztree_msg", catalogObject, objectName, catalogOwner, options);
}


//--------------------------------------------------------End-----------------------------------------------------------
