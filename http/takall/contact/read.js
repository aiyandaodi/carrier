//=====================================================Parameter=============================
var contactId; //联系信息id
var RIGHT = 0; //对于 Contact 的权限值
var OBJECT_NAME, OBJECT_ID; //联系信息所属对象，所属记录标识


// telephone type already-select
var PHONE_ALREADY = [];
var INSTANCE_ALREADY = [];
var CONTACT_TYPE;

var IS_EDIT =  false;

//=====================================================Function===============================
// 初始化
function init() {
    contactId = request['contact_id'];
    if (contactId) {
        //获取联系信息
        getContact(contactId);
		//getTelephoneInfo()
    } else {
        // 信息没有找到！

    }
}


//---------------------------------------------------联系信息------------------------------------------------------------
//获取联系信息
function getContact(contactId) {
    if (!contactId)
      return;

    var setting = {operateType: '获取联系信息'};
    var sendData = {
		objectName: "Contact", 
		action: "readInfo", 
		contact_id: contactId
	};
    var callback = {
        success: function (data) {
            RIGHT = parseInt(data.right); // 保存contact全限值

            var record = data['record'];
            var name = record["name"];
            if (record) {
                record = !record.length ? record : record[0];

                // 获取联系信息所属对象和记录
                getContactBelongTo(record);

                // 在页面上方显示名字
                $("#contact_name").text(record.name + " - 联系信息");

                var html = '<h3 class="pull-left">' +
                    '<span>' + record.name + '</span>' +
                    //'<div class="btn-icon" id="edit_Contact" style="display: none;"><i class="fa fa-edit circle-2 blue bg-info"></i></div>'+
                    '</h3>';
                html+='<div class="pull-right">';
                if(tek.right.isCanWrite(data.right)){
                    html+='<a id="edit_btn" class="btn btn-info" style="margin-right: 5px;" target="_blank" href="edit.html?contact_id='+record.id+'&show-close=1&refresh-opener=1">编辑</a>';
                }
                if(tek.right.isCanDelete(data.right)){
                    html+='<a id="remove_btn" class="btn btn-danger" onclick="deleteContactInfo('+record.id+',\''+record.name+'\')">删除</a>';
                }
                html+='</div><div class="clearfix"></div>';
                html+='<hr style="margin: 5px 0;">';
                if(tek.right.isCanWrite(data.right)){
                    html+='<div id="info" style="font-weight: 300;font-size: 1.2em;">';
                    if(record.contact_property){
                        html+='<div style="margin-top:20px;">'+record.contact_property.display+': '+record.contact_property.show+'</div>';
                    }
                    if(record.contact_default){
                        html+='<div>'+record.contact_default.display+': '+record.contact_default.show+'</div>';
                    }
                }

                if(record.contact_remark){
                    var field = record.contact_remark;
                    html+='<div>'+field.display+': '+tek.dataUtility.stringToHTML(field.show)+'</div>';
                }
                html+='</div>';
                    //'<div class="blog-meta">' +
                    //'<i class="fa fa-tag"></i><span id="contact_tags">标签：' + record.contact_tags.show + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'<i class="fa fa-user-md"></i>创建者:<span id="contact_owner">' + record.contact_owner.show + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'<i class="fa fa-info-circle"></i>属性:<span id="contact_property">' + record.contact_property.show + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //'</div>' +
                    // + record.contact_remark.show + '</p>';

                $("#contact_info").html(html);

                // 获取联系信息的附属信息
                getContactSub();
            } else {
                tek.macCommon.waitDialogShow(null, '没有联系信息!');
                tek.macCommon.waitDialogHide(3000, '');
            }
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

// 获取联系信息所属对象和记录
function getContactBelongTo(record) {
    OBJECT_NAME = record && record['contact_objectName'] && record['contact_objectName']['value'] || "";
    OBJECT_ID = record && record['contact_objectId'] && record["contact_objectId"]["value"] || "";

    if (!OBJECT_NAME || !OBJECT_ID){
      return;
    }

    // 机构|专家
    var obj_id = "";
    if (OBJECT_NAME === 'Organization') {
        obj_id = "organization_id";
    } else if (OBJECT_NAME === "Expert") {
        obj_id = "expert_id";
    }

    var setting = {operateType: '获取联系信息所属对象和记录'};
    var sendData = {objectName: OBJECT_NAME, action: "readInfo"};
    sendData[obj_id] = OBJECT_ID;
    var callback = {
        success: function (data) {
            var record = data["record"];
            if (record) {
                record = !record.length ? record : record[0];
                console.log('获取联系信息所属对象和记录', record);
            }
        },
        error: function (data, errorMsg) {
            console.log(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}


//---------------------------------------------------获取附属信息列表-----------------------------------------------------
// 获取联系信息的附属信息
function getContactSub() {
    // 获取联系人信息
    //getProfileInfo();
    // 获取电话信息
    getTelephoneInfo();
    // 获取邮件信息
    getEmailInfo();
    // 获取即时通讯信息
    getInstanceInfo();
	//获取网址信息
	getUrlInfo();
    // 获取地址信息
    getAddressInfo();
}

// 获取联系人信息
function getProfileInfo() {
    getContactSubInfo("ContactProfile", function (data) {
        var records = data['record'];
        if (records) {
            records = !records.length ? [records] : records;

            var html = getListHtml.profile(records, data.right);

            $("#profile_content").html(html);
        }
        // 显示隐藏新建按钮
        addBtn('ContactProfile', data.right);
    }, function (data, errorMsg) {

    });
}

// 获取电话信息
function getTelephoneInfo() {
    getContactSubInfo("ContactTelephone", function (data) {
        var records = data['record'];
        if (records) {
            records = !records.length ? [records] : records;

            var html = getListHtml.telephone(records, data.right);

            $("#telephone_table tbody").html(html);

        }
        
        var len = PHONE_ALREADY.length;
        if(len == 3){
            $('#add_btn_telephone').hide();
        }else{
            // 显示隐藏新建按钮
            addBtn('ContactTelephone', data.right);
        }
    }, function (data, errorMsg) {

    });
}

// 获取邮件信息
function getEmailInfo() {
    getContactSubInfo("ContactEmail", function (data) {
        var records = data['record'];
        if (records) {
            records = !records.length ? [records] : records;

            var html = getListHtml.email(records, data.right);

            $("#mail_table tbody").html(html);
        }
        // 显示隐藏新建按钮
        addBtn('ContactEmail', data.right);
    }, function (data, errorMsg) {

    });
}

// 获取即时通讯信息
function getInstanceInfo() {
    getContactSubInfo("ContactInstance", function (data) {
        var records = data['record'];
        if (records) {
            records = !records.length ? [records] : records;

            var html = getListHtml.instance(records, data.right);


            $("#instance_table tbody").html(html);
        }
        
        var len = INSTANCE_ALREADY.length;
        if(len == 4){
            $('#add_btn_instance').hide();
        }else{
            // 显示隐藏新建按钮
            addBtn('ContactInstance', data.right);
        }
    }, function (data, errorMsg) {

    });
}
//获取url信息
function getUrlInfo(){
	getContactSubInfo("ContactUrl", function(data){
		var records = data['record'];
		if(records){
			records = !records.length ? [records] : records;
			var html = getListHtml.url(records, data.right);
			
			$("#url_table tbody").html(html);
		}
		// 显示隐藏新建按钮
        addBtn('ContactUrl', data.right);
	}, function(data, errorMsg){
	});
}
// 获取地址信息
function getAddressInfo() {
    getContactSubInfo("ContactAddress", function (data) {
        var records = data['record'];
        if (records) {
            records = !records.length ? [records] : records;
            var html = getListHtml.address(records, data.right);
           // console.log(html);
            $("#address_table tbody").html(html);
            setTimeout(function(){
                addBaiDuMapScript(function(){
                    showMap(records[0]);
                });
            },0);

            $("#add_btn_address").hide();
        }else{
            // 显示隐藏新建按钮
            addBtn('ContactAddress', data.right);
        }
    }, function (data, errorMsg) {

    });
}

//-----------------------通用方法（用于 获取附属信息）---------------
// 获取联系信息列表内容
function getContactSubInfo(objectName, success, error) {
    var sendData = {
        objectName: objectName,
        action: "getList",
        contact_id: contactId
    };
    var callback = {success: success, error: error};
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', {}, sendData, callback);
}


//-------------------------------------------------------操作-----------------------------------------------------------
// 编辑联系信息
$("#edit_Contact").click(function () {
    var url = "edit.html?contact_id=" + contactId + "&object_id=" + OBJECT_ID + "&object_name=" + OBJECT_NAME + '&refresh-opener=1&show-close=1';
    window.open(url, '_blank');
});

// 新建
function showNew(objectName) {
    if (!objectName || $(getEleArea(objectName)).is(':visible'))
        return;

    var setting = {operateType: '获取新建域'};
    var sendData = {objectName: objectName, action: "getNew", contact_id: contactId};
    var callback = {
        beforeSend: function () {
            var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;获取新建域</div>";
            tek.macCommon.waitDialogShow(null, html, null, 2);
        },
        success: function (data) {
            var record = data['record'];
            if (record) {
                record = !record.length ? record : record[0];

                var key = objectName.toLowerCase().substring(7);
                var html = getEditHtml[key](record);
                $(getEleArea(objectName)).html(html).show(200, function () {
                     if (objectName == 'ContactAddress') {
                         // 触发元素的onChange事件
                         var ele = document.getElementById('address_country');
                         ele.fireEvent ? ele.fireEvent('onchange') : ele.onchange();
                     }
                });

                tek.macCommon.waitDialogHide();
            } else {
                tek.macCommon.waitDialogShow(null, '获取新建域失败！', null, 0);
                tek.macCommon.waitDialogHide(3000);
            }
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

// 编辑
function showEdit(objectName, field, id) {
     $("#add_new_address").find("button").eq(0).attr("disabled","false");
    IS_EDIT = true;

    if (!objectName || $(getEleArea(objectName)).is(':visible'))
        return;

    var setting = {operateType: '获取编辑域'};
    var sendData = {objectName: objectName, action: "getEdit", contact_id: contactId};
    sendData[field] = id;
    var callback = {
        beforeSend: function () {
            var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;获取编辑域</div>";
            tek.macCommon.waitDialogShow(null, html, null, 2);
        },
        success: function (data) {
            var record = data['record'];
            if (record) {
                record = !record.length ? record : record[0];

                var key = objectName.toLowerCase().substring(7);
                var html = getEditHtml[key](record);

                $(getEleArea(objectName)).html(html).show(200, function () {
                    if (objectName == 'ContactAddress') {
                        // 触发元素的onChange事件
                        var ele = document.getElementById('address_country');
                        ele.fireEvent ? ele.fireEvent('onchange') : ele.onchange();
                    }
                });

                tek.macCommon.waitDialogHide();
            } else {
                tek.macCommon.waitDialogShow(null, '获取编辑域失败！', null, 0);
                tek.macCommon.waitDialogHide();
            }
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

// 删除
function removeInfo(objectName, field, id) {
    showConfirm("删除", "删除之后不可恢复，确定要删除吗？", function () {
        var setting = {operateType: '删除记录'};
        var sendData = {objectName: objectName, action: "removeInfo"};
        sendData[field] = id;
        var callback = {
            beforeSend: function () {
                var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在删除...</div>";
                tek.macCommon.waitDialogShow(null, html, null, 2);
            },
            success: function (data) {
                window.location.href = window.location.href;
                /*
                tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data['message']), null, 0);

                var eleId = field.replace('id', id);
                $('#' + eleId).remove();

                // 如果当前编辑域是打开的，隐藏编辑域
                var $editArea = $(getEleArea(objectName));
                if ($editArea.is(':visible') && $editArea.find('tr').attr('data-type') == 'edit_' + id) {
                    $editArea.hide(200, function () {
                        $(this).empty();
                    });
                }
                */
            },
            error: function (data, errorMsg) {
                tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
            },
            complete: function () {
                tek.macCommon.waitDialogHide(3000);
            }
        };
        tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
    });
}

// 删除Contact信息
function deleteContactInfo(contact_id, contact_name) {
    if (!window.confirm('确定删除' + contact_name + '?'))
        return;

    var setting = {operateType: '删除联系信息'};
    var sendData = {objectName: 'Contact', action: 'removeInfo', contact_id: contact_id};
    var callback = {
        beforeSend: function () {
             var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在删除...</div>";
            tek.macCommon.waitDialogShow(null, html, null, 2);
        },
        success: function (data) {
            tek.macCommon.waitDialogShow(null, data.message, null, 0);
            tek.macCommon.waitDialogHide(1000, 'window.close()');
        },
        error: function(data, errorMsg){
            tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
            tek.macCommon.waitDialogHide(2000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

// 隐藏新建、编辑域
function cancelNew(eleId) {
    if (!eleId)
        return;

    $('#' + eleId).hide(200, function () {
        $(this).empty();
    });
}

// 显示隐藏新建按钮
function addBtn(objectName, right) {
    switch (objectName) {
        case 'ContactProfile':
            if (tek.right.isCanCreate(right)) {
                $('#add_btn_profile').show();
            } else {
                $('#add_btn_profile').hide();
            }
            break;
        case 'ContactTelephone':
            if (tek.right.isCanCreate(right)) {
                $('#add_btn_telephone').show();
            } else {
                $('#add_btn_telephone').hide();
            }
            break;
        case 'ContactEmail':
            if (tek.right.isCanCreate(right)) {
                $('#add_btn_email').show();
            } else {
                $('#add_btn_email').hide();
            }
            break;
        case 'ContactInstance':
            if (tek.right.isCanCreate(right)) {
                $('#add_btn_instance').show();
            } else {
                $('#add_btn_instance').hide();
            }
            break;
			
		case 'ContactUrl':
			if(tek.right.isCanCreate(right)){
				$('#add_btn_url').show();
			}else{
				$('#add_btn_url').hide();
			}
			break;
        case 'ContactAddress':
            // 只允许有一个地址
            if (tek.right.isCanCreate(right)) {
                $('#add_btn_address').show();
            } else {
                $('#add_btn_address').hide();
            }
            break;
    }

}

//------------------------------通用方法（用于 操作）------------------
// 获取编辑域、新建域显示区域的元素
function getEleArea(objectName) {
    if (!objectName)
        return null;

    var eleId = {
        ContactProfile: "add_new_profile",
        ContactTelephone: "add_new_telephone",
        ContactEmail: "add_new_email",
        ContactInstance: "add_new_instance",
		ContactUrl: "add_new_url",
        ContactAddress: "add_new_address"
    };

    return document.getElementById(eleId[objectName]);
}


//-----------------------------------------------------提交信息（用于新建 编辑）-------------------------------------------
// 提交联系人
function commitProfile(id) {
    var params = getProfileParams();
    if (!params)
        return;

    var action = (!id || id == 0) ? {action: "addInfo"} : {action: "setInfo", contact_profile_id: id};

    var setting = {operateType: '提交联系人'};
    var sendData = tek.Utils.mergeForObject({objectName: "ContactProfile", contact_id: contactId}, action, params);
    for(var name in sendData){
        sendData[name] = encodeURIComponent(sendData[name]);
    }
    var callback = {
        success: function (data) {
            getProfileInfo();

            cancelNew('add_new_profile');

            tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data['message']), null, 0);
            tek.macCommon.waitDialogHide(2000)
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
            tek.macCommon.waitDialogHide(2000)
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

// 提交电话
function commitTelephone(id) {
    var params = getTelephoneParams();
    if (!params)
        return;

    var action = (!id || id == 0) ? {action: "addInfo"} : {action: "setInfo", telephone_id: id};

    var setting = {operateType: '提交电话'};
    var sendData = tek.Utils.mergeForObject({objectName: "ContactTelephone", contact_id: contactId}, action, params);
    for(var name in sendData){
        sendData[name] = encodeURIComponent(sendData[name]);
    }
    var callback = {
        success: function (data) {
            getTelephoneInfo();

            cancelNew('add_new_telephone');

            tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data['message']), null, 0);
            tek.macCommon.waitDialogHide(2000)
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
            tek.macCommon.waitDialogHide(2000)
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

// 提交邮箱
function commitMail(id) {
    var params = getMailParams();
    if (!params)
        return;

    var action = (!id || id == 0) ? {action: "addInfo"} : {action: "setInfo", email_id: id};

    var setting = {operateType: '提交邮箱'};
    var sendData = tek.Utils.mergeForObject({objectName: "ContactEmail", contact_id: contactId}, action, params);
    for(var name in sendData){
        sendData[name] = encodeURIComponent(sendData[name]);
    }
    var callback = {
        success: function (data) {
            getEmailInfo();

            cancelNew('add_new_email');

            tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data['message']), null, 0);
            tek.macCommon.waitDialogHide(2000)
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
            tek.macCommon.waitDialogHide(2000)
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

// 提交及时通讯
function commitInstance(id) {
    var params = getInstanceParams();
    if (!params)
        return;

    var action = (!id || id == 0) ? {action: "addInfo"} : {action: "setInfo", instance_id: id};

    var setting = {operateType: '提交及时通讯'};
    var sendData = tek.Utils.mergeForObject({objectName: "ContactInstance", contact_id: contactId}, action, params);
    for(var name in sendData){
        sendData[name] = encodeURIComponent(sendData[name]);
    }
    var callback = {
        success: function (data) {
            getInstanceInfo();

            cancelNew('add_new_instance');

            tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data['message']), null, 0);
            tek.macCommon.waitDialogHide(2000)
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
            tek.macCommon.waitDialogHide(2000)
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

//提交网址
function commitUrl(id){
	var params = getUrlParams();
	if(!params){
		return ;
	}
	var action = (!id || id == 0) ? {action: "addInfo"} : {action: "setInfo", contact_url_id: id};
	
	var setting = {operateType: '提交网址'};
	var sendData = tek.Utils.mergeForObject({objectName: "ContactUrl", contact_id: contactId}, action, params);
	
	for(var name in sendData){
		sendData[name] = encodeURIComponent(sendData[name]);
	}
	var callback = {
		success: function(data){
			getUrlInfo();
			cancelNew('add_new_url');
			
			tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data['message']), null, 0);
			tek.macCommon.waitDialogHide(2000);
		},
		error: function(data, errorMsg){
			tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
			tek.macCommon.waitDialogHide(2000);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}
// 提交地址
function commitAddress(id) {
    
    var params = getAddressParams();
    if (!params)
        return;
    var action = (!id || id == 0) ? {action: "addInfo"} : {action: "setInfo", address_id: id};

    var setting = {operateType: '提交地址'};
    var sendData = tek.Utils.mergeForObject({objectName: "ContactAddress", contact_id: contactId}, action, params);
    if(params){
         $("#add_new_address").find("button").eq(0).attr("disabled","true");
    }
    for(var name in sendData){
        sendData[name] = encodeURIComponent(sendData[name]);
    }
    var callback = {
        success: function (data) {
            getAddressInfo();
           
            cancelNew('add_new_address');

            tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data['message']), null, 0);
            tek.macCommon.waitDialogHide(2000)
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
            tek.macCommon.waitDialogHide(2000)
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}


//---------------------------------------------获取提交参数并校验（用于 新建 和 编辑）---------------------------------------
// 方法在 read-append.js 中


//------------------------------------------------------输入框操作-------------------------------------------------------
// 电话类型改变
function telephoneTypeChange(ele) {
    if (!ele)
        return;

    if (ele.value==1) {
        $("#telephone_areacode").hide();
    } else {
        $("#telephone_areacode").show();
    }

}

// 地址改变
function addressChange(ele, grade) {
    if (!ele || !grade){
        return;
    }

    if (grade == 'country') {
        $('#address_state').empty();
        $('#address_city').empty();
        getState(ele.value);
    } else if (grade == 'state') {
        var code = $(ele).find("option[value='" + ele.value + "']").attr('data-code');
        if (code){
            $('#address_city').empty();
            getCity(code);
        }
    }
}

// 获取二级行政单位（省/市）
function getState(countryCode) {
    var $state = $("#address_state");
    if (!$state || !$state.length)
        return;

    var defaultState = $state.attr('data-value') || '';

    var setting = {operateType: '获取二级行政单位'};
    var sendData = {
        objectName: "State",
        action: "getList",
        country_code: countryCode || 'CN',
        state_locale: 'zh_CN'
    };
    var callback = {
        success: function (data) {
            $state.val('');

            var html = '';
            var records = data['record'];
            if (records) {
                records = !records.length ? [records] : records;
                for (var i = 0; i < records.length; i++) {
                    var code = records[i] && records[i]['state_code'] && records[i]['state_code'].value || '';
                    var name = records[i] && records[i]['state_name'] && records[i]['state_name'].value || '';
                    if (!code || !name)
                        continue;

                    var selected = (!defaultState && i == 0) || (defaultState == name) ? 'selected' : '';
                    html += "<option value='" + name + "' data-code=" + code + " " + selected + ">" + name + "</option>";
                }
            }
            $state.html(html);

            // 触发元素的onChange事件
            var ele = document.getElementById('address_state');
            ele.fireEvent ? ele.fireEvent('onchange') : ele.onchange();
        },
        error: function (data, errorMsg) {
            console.log(errorMsg)
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

// 获取三级行政单位（县/市/区）
function getCity(stateCode) {
    var $city = $("#address_city");
    if (!$city || !$city.length || !stateCode)
        return;

    var defaultCity = $city.attr('data-value') || '';

    var setting = {operateType: '获取三级行政单位'};
    var sendData = {
        objectName : "City",
        action : "getList",
        state_code: stateCode || '',
        city_locale:  'zh_CN'
    };
    var callback = {
        success: function (data) {
            $city.val("");
            var html = '';
            var records = data['record'];
            if (records) {
                records = !records.length ? [records] : records;
                for (var i = 0; i < records.length; i++) {
                    var name = records[i] && records[i]['city_name'] && records[i]['city_name'].value || '';
                    if (!name)
                        continue;

                    var selected = (!defaultCity && i == 0) || (defaultCity == name) ? 'selected' : '';
                    html += "<option value='" + name + "' " + selected + ">" + name + "</option>";
                }
            }
            $city.html(html);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}


//-----------------------------------------------------通用方法（适用于本js文件）------------------------------------------
// confirm弹窗
function showConfirm(title, msg, sureCallback) {
    if (!$("#confirm-modal-dialog").is(":hidden")) {
        return;
    }

    $("#confirm-modal-dialog-title").text(title);
    $("#confirm-modal-dialog-body").text(msg);
    $("#confirm-modal-dialog").modal("show");

    // 确认
    $("#confirm-sure").click(function () {
        $('#confirm-modal-dialog').modal('hide');
        sureCallback();
    });
}

//----------------------------------------------------------END---------------------------------------------------------


function addBaiDuMapScript(fn){
    var scriptEle = cEle('script');
    // <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=3miyFLxfI99qiXNG4hxEnV8USYYp7NDm"></script>
    // scriptEle.src = 'http://api.map.baidu.com/api?v=2.0&ak=3miyFLxfI99qiXNG4hxEnV8USYYp7NDm';
    window.BMap_loadScriptTime = (new Date).getTime();
    var timeTag = (new Date(BMap_loadScriptTime));

    var y = timeTag.getFullYear();
    var m = zeroHolder(timeTag.getMonth() + 1);
    var d = zeroHolder(timeTag.getDate());
    var h = zeroHolder(timeTag.getHours());
    var i = zeroHolder(timeTag.getMinutes());
    var s = zeroHolder(timeTag.getSeconds());

    var datetimestr = '' + y + m + d + h + i + s;

    scriptEle.src = 'http://api.map.baidu.com/getscript?v=2.0&ak=3miyFLxfI99qiXNG4hxEnV8USYYp7NDm&services=&t=' + datetimestr;
    scriptEle.onload = function(){
        if(fn && typeof fn === 'function'){
            fn();
        }
    }

    document.body.appendChild(scriptEle);

    function zeroHolder(no){
        if(no < 10){
            return '0' + no;
        }else{
            return no;
        }
    }
}

function cEle(str){
    return document.createElement(str);
}