// JavaScript Document
/**************************************************
 *    新建分类标签 add.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var selectedObject;	// 被选中的对象

var _tag_count;	// 允许标签最多数量 取值范围1-20
var _tag_enforce;	// 是否强制使用标签分类 如果为1，新建目标对象必须选择标签分类。
var _tag_private;	// 是否允许私有标签定义 如果为1，可以用户定义私有标签。

var isDeleting = false; // 是否正在删除


//=====================================================Function===============================
// 初始化
function init() {
    //判断是否登录
    if (tek.common.isLoggedIn()) {
        //if (tek.role.isComptroller(parseInt(mySecurity))) {
        //    //
        //} else {
        //    // 你不是管理员提示
        //    $('#container').html("<p class='text-center' style='color: red;'>你没有管理员权限！</p>");
        //}
    } else {
        //提示 并 跳转登录
        goLogin();
    }
}

// 选中对象选项
function selectTagObject() {
    var oldSelectObject = selectedObject;
    selectedObject = $("#object_tag_object_select").val();
    if (!tek.type.isEmpty(selectedObject) && selectedObject != oldSelectObject) {
        // 读取option中该对象的配置参数
        getObjectOptionParams();

        // 校验编码配置参数通过，读取列表信息
        if ((tek.type.isNumber(_tag_count) && _tag_count >= 1 && _tag_count <= 20)
            && tek.type.isNumber(_tag_enforce)
            && tek.type.isNumber(_tag_private)) {
            if (tek.user.isAdminUser(mySecurity) || (tek.user.isNormalUser(mySecurity) && _tag_private == 1)) {
                $('#tags_content').empty();
                getTags();
            } else {
                var msg = "<div style='margin: 30px 0;'>您没有创建该对象标签的权限！</div>";
                tek.macCommon.waitDialogShow(null, msg, null, 2);
            }
        } else {
            var msg = "<div style='margin: 30px 0;'>该对象标签分类的配置参数不完善，请先 <a style='font-weight: 600;' href='javascript:addObjectOption();'>完善</a> ！</div>";
            tek.macCommon.waitDialogShow(null, msg, null, 2);
        }
    }
}

// 添加编码配置参数
function addObjectOption() {
    tek.macCommon.waitDialogHide();
    tek.macCommon.waitDialogOn('hidden', function (e) {
        var url = tek.common.getRootPath() + "http/tekinfo/objectTag/admin/add-option.html?option_objectName=" + selectedObject + "&show-close=1&refresh-opener=1";
        window.open(url, "_blank");
    });
}


//-----------------------------------------------------读取配置参数------------------------------------------------------
// 读取option中该对象的配置参数
function getObjectOptionParams() {
    var setting = {async: false, operateType: "读取option中该对象的配置参数"};
    var sendData = {
        objectName: "ObjectTag",
        action: "readInfo",
        'read-option': 1,
        tag_object: selectedObject
    };
    var callback = {
        success: function (data) {
            var record = data["record"];
            record = record || {};

            if (record.tag_count) {
                var value = record.tag_count.value;
                _tag_count = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
            }
            if (record.tag_enforce) {
                var value = record.tag_enforce.value;
                _tag_enforce = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
            }
            if (record.tag_private) {
                var value = record.tag_private.value;
                _tag_private = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
            }
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


//-----------------------------------------------------公共标签列表------------------------------------------------------
// 获得公共标签
function getTags() {
    var setting = {};
    var sendData = {
        objectName: 'ObjectTag',
        action: 'getList',
        tag_object: selectedObject,
        tag_owner: '0'
    };
    var callback = {
        success: function (data) {
            var records = data['record'];
            if (records) {
                records = !records.length ? [records] : records;

                for (var i in records)
                    showTag(records[i]);
            }
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示标签
function showTag(record) {
    if (!record)
        return;

    var id = record.id;
    var code = record['tag_code'] && record['tag_code'].value || ''
    var name = record.name || (record['tag_name'] && record['tag_name'].value) || '';

    var html = '<span class="badge badge-blue tag-ball" id="tag_' + id + '" onclick="removeTag(this)" data-id="' + id + '">' + name + '</span>'

    $('#tags_content').append(html);
}


//----------------------------------------------------新添加标签---------------------------------------------------------
//提交信息
function addNewTag() {
    if (!selectedObject) {
        tek.macCommon.waitDialogShow(null, "先“选择对象”-->再点击“确定”");
        tek.macCommon.waitDialogHide(3000);
        return;
    }

    var tagName = $('#tag_name').val();
    if (tek.type.isEmpty(tagName)) {
        tek.macCommon.waitDialogShow(null, "标签名不能为空");
        tek.macCommon.waitDialogHide(3000);
        return;
    }
    var setting = {operateType: '添加标签'};
    var sendData = {
        objectName: 'ObjectTag',
        action: 'addInfo',
        tag_name: tagName,
        tag_object: selectedObject,
        tag_owner: '0'
    };
    var callback = {
        beforeSend: function () {
            var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在提交数据...</div>";
            tek.macCommon.waitDialogShow(null, html, null, 2);
        },
        success: function (data) {
            tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message));

            var tagId = data.value || '';
            tagId = tagId.split('=');
            tagId = tagId.length > 1 ? tagId[1] : '';
            if (tagId) {
                var html = '<span class="badge badge-blue tag-ball" id="tag_' + tagId + '" onclick="removeTag(this)" data-id="' + tagId + '">' + tagName + '</span>'
                $('#tags_content').append(html);
            }
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
        },
        complete: function () {
            isDeleting = false;
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);


}


//-----------------------------------------------------删除标签----------------------------------------------------------
// 打开删除功能
function openCancel(ele) {
    var $tc = $('#tags_content');

    if ($tc.is('.open-cancel')) {
        $tc.removeClass('open-cancel');
        $(ele).removeClass('btn-blue').addClass('btn-color').html('删除');
    } else {
        $tc.addClass('open-cancel');
        $(ele).removeClass('btn-color').addClass('btn-blue').html('取消');
    }
}

// 删除标签
function removeTag(ele) {
    if (!ele || !$('#tags_content').is('.open-cancel'))
        return;
    var id = $(ele).attr('data-id');
    if (!id)
        return;

    if (isDeleting)
        return;
    else
        isDeleting = true;

    var setting = {operateType: '删除标签'};
    var sendData = {objectName: 'ObjectTag', action: 'removeInfo', tag_id: id};
    var callback = {
        success: function (data) {
            $(ele).remove();
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        },
        complete: function () {
            isDeleting = false;
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


//----------------------------------------------------------End---------------------------------------------------------
