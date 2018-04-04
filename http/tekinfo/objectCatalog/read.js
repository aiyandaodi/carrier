// JavaScript Document
/**************************************************
 *    读取目录分类页面 read.js
 *
 *
 *
 **************************************************/
//=====================================================iniy==================================
var catalog_id;
var request = tek.common.getRequest();
function init(){
	catalog_id = request["catalog_id"];
	if (catalog_id) {
		readCatalogInfo(catalog_id);
	} else {
		showErrorMessage("目录分类未找到！");
	}
}
//=====================================================Parameter=============================

//=====================================================Function===============================
//获取对象目录分类节点信息
function readCatalogInfo(catalog_id) {
    if (!catalog_id)
        return;

    var setting = {operateType: "获取对象目录分类节点信息"};
    var sendData = {
        objectName: "ObjectCatalog",
        action: "readInfo",
        catalog_id: catalog_id
    };
    var callback = {
        beforeSend: function () {
            showWaitingImg(true);	//显示等待加载
        },
        success: function (data) {
            var record = data["record"];
            if (record) {
                record = !record.length ? record : record[0];
                // 显示信息
                showInfo(record);
            } else {
                showErrorMessage('记录不存在！');
            }//end if(record)
        },
        error: function (data, errorMsg) {
            showErrorMessage(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示信息
function showInfo(record) {
    if (!record) return;

    var html = "";
    var field;

    //编码
    field = record.catalog_code;
    if (field) {
        html += appendShowFrom(field.name, field.display, field.show);
    }
    //名称
    field = record.catalog_name;
    if (field) {
        html += appendShowFrom(field.name, field.display, field.show);
    }
    //目标对象类型名
    field = record.catalog_object;
    if (field) {
        html += appendShowFrom(field.name, field.display, field.show);
    }
    //拥有者
    field = record.catalog_owner;
    if (field) {
        html += appendShowFrom(field.name, field.display, field.show);
    }
    var field1, field2;
    //创建
    field1 = record.createTime;
    field2 = record.createIp;
    if (field1 || field2) {
        html += appendShowFrom(null, "创建", field1.show + " (" + field2.show + ")");
    }
    //修改
    field1 = record.modifyTime;
    field2 = record.modifyIp;
    if (field1 || field2) {
        html += appendShowFrom(null, "修改", field1.show + " (" + field2.show + ")");
    }

    $("#catalog-info").html(html);
}

// 拼接显示的表单
function appendShowFrom(name, label, value) {
    if (!label)
        return "";

    var html = "<div class='form-group'>"
        + "<label class='control-label col-xs-4' for='" + name + "'>" + label + "</label>"
        + "<div class='col-xs-8' style='padding-top:7px'>"
        + "<span id='" + name + "'>"
        + (name == 'catalog_owner' ? "<span class='label label-primary'>公共</span>&nbsp;" : value)
        + "</span>"
        + "</div>"

        + "</div>";

    return html;
}


//-----------------------------------------------通用函数(仅限于当前js文件中)------------------------------
//显示错误的信息
function showErrorMessage(message) {
    var html = "<div class='col-xs-12'>"
        + "<div class='widget'>"

        + "<div class='widget-head'>"
        + "<div class='pull-left'></div><div class='widget-icons pull-right'></div><div class='clearfix'></div>"
        + "</div>"

        + "<div class='widget-content'>"
        + "<div class='center error-content'>"
        + "<h2>" + (message || "对象目录分类未找到！") + "</h2>"
        + "</div>"
        + "</div>"

        + "<div class='widget-foot'></div>"

        + "</div>"
        + "</div>";

    $("#main-content > div.container > div.row").html(html);
}

//显示等待加载图标
function showWaitingImg(displayWaiting) {
    var html = "";
    if (displayWaiting == true) {
        html += "<div class='center loading'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>";
    }

    $("#catalog-info").html(html);
}

//-----------------------------------------------------End-------------------------------------