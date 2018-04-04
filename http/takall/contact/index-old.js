// JavaScript Document
/**************************************************
 *    联系信息 index.js
 *
 *      说明：本页面是用户的个人联系信息的管理页面
 *
 *      必须传入：
 *          链接对象：对象类型名 contact_objectName
 *          链接对象：对象标识 contact_objectId
 *
 **************************************************/
//=====================================================Parameter=============================
var linkObject = null; // 链接对象：对象类型名 contact_objectName
var linkId = null; // 链接对象：对象标识 contact_objectId

var ajaxURL = tek.common.getRootPath() + "servlet/tobject";// - ajax访问地址。（不能为空）

var $contactList = null; // 显示联系信息box瀑布流的盒子

//=====================================================Function===============================
// 初始化
function init() {
    if (tek.common.isLoggedIn()) {

        flowInitParams('contact_list');

        linkObject = request['contact_objectName'];
        linkId = request['contact_objectId'];

        $contactList =  $('#contact_list');

        if (linkObject && linkId && linkId != '0' && $contactList.length) {
            getContactList();
        } else {
            tek.macCommon.waitDialogShow(null, "参数有误", "<span class='red' id='counter'></span> 秒后关闭", 2);
            tek.macCommon.waitDialogHide(3000, 'window.close()');
        }
    } else {
        tek.macCommon.waitDialogShow(null, "<span class='red'>请先登录</span>", "<span class='red' id='counter'></span> 秒后跳转", 2);
        tek.macCommon.waitDialogHide(3000, 'goLogin()');
    }
}

// 获取联系信息列表
function getContactList() {
    var setting = {};
    var sendData = {
        objectName: 'Contact',
        action: 'getList',
        contact_objectName: linkObject,
        contact_objectId: linkId
    };
	var callback = {
        beforeSend: function () {
            var html = '<div class="center"><img src="' + tek.common.getRootPath() + 'http/images/waiting-small.gif"/>&nbsp;正在获取数据...</div>';
            $contactList.html(html);
        },
        success: function(data) {
            $contactList.empty();

            var records = data['record'];
            if(records){
                records = !records.length ? [records] : records;

                for(var i = 0; i < records.length; i++) {
                    showContactBox(records[i]);
                }
            } else {
                $contactList.html('您还没有联系信息，快去创建一个！');
            }
        },
        error: function(data, errorMsg) {
            $contactList.html(errorMsg);
        },
        complete: function (data) {
            flowFlushDisplay();
        }
    };
	tek.common.ajax(ajaxURL, setting, sendData, callback);
}

// 显示联系信息box
function showContactBox(record) {
    if (!record)
        return;

    var id = record.id;
    var name = record['contact_name'] && record['contact_name'].value || '';

    var idDef = record['contact_default'] && record['contact_default'].value || false; // 默认联系信息

    var html = '<div class="box flow-item-box' + (idDef ? ' default' : '') + '">' +
        '<h6><i class="fa fa-user" title="姓名"></i>&nbsp;&nbsp;' + name + '</h6>' +
        '<p><i class="fa fa-home" title="地址"></i>&nbsp;<span id="contact_address">付款了爱是房间卡卡</span>' +
        '<p>' +
        '<i class="fa fa-phone" title="电话"></i>&nbsp;<span id="contact_phone">电话</span><br>' +
        '<i class="fa fa-envelope" title="邮件"></i>&nbsp;<span id="contact_email">邮件</span><br>' + //<a href="#">infodesk@uk.com</a>
        '<i class="fa fa-fax" title="即时通讯"></i>&nbsp;<span id="contact_instance">即时通</span><br>' +
        '</p>' +
        '<p class="text-right">' +
        '<a class="btn btn-xs btn-lblue" onclick="setDefaultContact(id)"><i class="fa fa-bookmark" title="标记为默认"></i></a>&nbsp; &nbsp; ' +
        '<a class="btn btn-xs btn-black" onclick="deleteContact(id)"><i class="fa fa-remove" title="删除该记录"></i></a>' +
        '</p>' +
        '</div>';

    $contactList.append(html);

    getContactSub(id);
}

// 获取联系信息附属信息
function  getContactSub(contactId) {
    getAddress(contactId);
    getPhone(contactId);
    getEmail(contactId);
    getInstance(contactId);
}

// 获取地址
function getAddress(contactId) {
    //
}
// 获取电话
function getPhone(contactId) {
    //
}
// 获取邮件
function getEmail(contactId) {
    //
}
// 获取即时通
function getInstance(contactId) {
    //
}

//---------------------------------------------------操作----------------------------------------------------------------
// 创建信息的联系信息
function addNewContact() {
    var url = 'add.html?contact_objectName=' + linkObject + '&contact_objectId=' + linkId + '&refresh-opener=1&show-close=1';
    window.open(url, '_blank');
}

// 设置默认联系信息
function setDefaultContact(contactId) {
    if (!contactId)
        return;

    var setting = {};
    var sendData = {
        objectName: 'Contact',
        action: 'setInfo',
        contact_id: contactId,
        contact_default: 1
    };
    var callback = {
        success: function(data) {
            // TODO 设置成功，
        },
        error: function(data, errorMsg) {
            $contactList.html(errorMsg);
        }
    };
    tek.common.ajax(ajaxURL, setting, sendData, callback);
}

// 删除联系信息
function deleteContact(contactId) {
    if (!contactId)
        return;

    var setting = {};
    var sendData = {
        objectName: 'Contact',
        action: 'removeInfo',
        contact_id: contactId
    };
    var callback = {
        success: function(data) {
            // TODO 删除成功，
        },
        error: function(data, errorMsg) {
            $contactList.html(errorMsg);
        }
    };
    tek.common.ajax(ajaxURL, setting, sendData, callback);
}

//-----------------------------------------------------END--------------------------------------------------------------
