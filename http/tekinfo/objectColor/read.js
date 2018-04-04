// JavaScript Document
/**************************************************
 *    读取颜色分类 read.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var color_id;

function init(){
	color_id = request["color_id"];
	if (color_id) {
		readColorInfo(color_id);
	} else {
		showErrorMessage("对象字典未找到！");
	}
}
//=====================================================Function===============================
//获取对象字典信息
function readColorInfo(color_id) {
    if (!color_id)
        return;

    var setting = {operateType: "获取对象目录分类节点信息"};
    var sendData = {
        objectName: "ObjectColor",
        action: "readInfo",
        color_id: color_id
    };
    var callback = {
        beforeSend: function () {
            showWaitingImg(true);	//显示等待加载
        },
        success: function (data) {
            var record = data["record"];
            if (record) {
                if (record.length)
                    record = record[0];
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
    field = record.color_code;
    if (field) {
         html += appendShowFrom(field.name, field.display, field.show);
    }
    //名称
    field = record.color_name;
    if (field) {
         html += appendShowFrom(field.name, field.display, field.show);
    }
    //目标对象类型名
    field = record.color_object;
    if (field) {
         html += appendShowFrom(field.name, field.display, field.show);
    }
    //拥有者
    field = record.color_owner;
    if (field) {
         html += appendShowFrom(field.name, field.display, field.show);
    }
    //颜色值
    field = record.color_value;
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

    $("#color-info").html(html);
}

// 拼接显示的表单
function appendShowFrom(name, label, value) {
    if (!label)
        return "";

    var html = "<div class='form-group'>"
    +"<label class='control-label col-xs-4' for='"+name+"'>"+label+"</label>"
    +"<div class='col-xs-8' style='padding-top:7px'>"
    +"<span id='"+name+"'>";
    if (!tek.type.isEmpty(name) && name == 'color_owner' && tek.type.isEmpty(value)) {
        html+="<span class='label label-primary'>公共</span>&nbsp;";
    } else if (!tek.type.isEmpty(name) && name == 'color_value') {
        html+=value
        +"<span style='display: inline-block;margin-left: 16px;border-radius: 20%;width: 14px;height: 14px;background-color: #" + value + ";'></span>";
    } else {
        html+=value;
    }
    html+="</span>"
    +"</div>"
    +"</div>";

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
        + "<h2>" + (message || "对象颜色分类未找到！") + "</h2>"
        + "</div>"
        + "</div>"

        + "<div class='widget-foot'></div>"

        + "</div>"
        + "</div>";


    $("#main_content").html(html);
}

//显示等待加载图标
function showWaitingImg(displayWaiting) {
    var html = "";
    if (displayWaiting == true) {
        html += "<div class='center loading'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>";
    }

    $("#color-info").html(html);
}

//-----------------------------------------------------End-------------------------------------