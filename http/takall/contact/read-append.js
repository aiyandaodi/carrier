// JavaScript Document
/**************************************************
 *    联系信息读取附件 read-append.js
 *          用于Html字符串的处理
 * ----------------------
 * 有待优化：
 *  2、profile 相关还没有完成
 *
 **************************************************/
//=====================================================Parameter=============================


//=====================================================Function===============================

//---------------------------------------------------获取附属信息列表-----------------------------------------------------
//-----------------------通用方法（用于 获取附属信息）---------------
// 返回数据的字符串拼接
var getListHtml = {
    profile: function (records, right) {
        var str = "";

        for (var i = 0; i < records.length; i++) {
            str += '<div class="blog-one-img col-md-4">' +
            '<img src="../../style/brave/img/gallery/small/2.jpg" alt="" class="img-responsive img-thumbnail" />' +
            '</div>' +

            '<div class="blog-one-content col-md-8">' +

            '<div class="row">' +
            '<div class="col-md-9">' +
            '<h4 class="contact_profile_name">' + str2html(records[i].contact_profile_name.show) + '</h4>' +
            '</div>' +

            '<div class="col-md-3">' +
                // '<a href="javascript:;" id="editProfile(this);"  data-tag="contact_profile_id" data-object="ContactProfile" data-id="'+ records[i].id +'"  class="btn btn-color editprofile_btn">编辑</a>'+
            '<i class="fa fa-edit fa-clock-o circle-2 blue bg-info editprofile_btn" data-object="ContactProfile" data-id="' + records[i].id + '" data-tag="contact_profile_id" ></i>' +
                // '&nbsp;<i class="fa fa-remove circle-2 red bg-info"></i>'+
            '</div>' +
            '</div>' +

            '<div class="row">' +
            '<div class="blog-one-content col-md-12">' +
            '<div class="agency-contact">' +
            '编码:<span class="contact_profile_code">20161238673</span> &nbsp; &nbsp;' +
            '称呼:<span class="contact_profile_title">' + str2html(records[i].contact_profile_title.show) + '</span> &nbsp; &nbsp;' +
            '</div>' +

            '<div class="agency-contact">' +
            '单位:<span class="contact_profile_unit">' + str2html(records[i].contact_profile_unit.show) + '</span> &nbsp; &nbsp;' +
            '</div>' +
            '<div class="agency-contact">' +
            '部门:<span class="contact_profile_department">' + str2html(records[i].contact_profile_department.show) + '</span> &nbsp; &nbsp;' +
            '职位:<span class="contact_profile_position">' + str2html(records[i].contact_profile_position.show) + '</span> &nbsp; &nbsp;' +
            '</div>' +

                // '<div class="agency-contact">'+
                //   '国籍:<span class="contact_profile_name">'+ records[i].contact_profile_country.show +'</span> &nbsp; &nbsp;'+
                //   '性别:<span class="contact_profile_sex">'+ records[i].contact_profile_sex.show +'</span> &nbsp; &nbsp;'+
                //   '生日:<span class="contact_profile_birthday">'+ records[i].contact_profile_birthday.show +'</span> &nbsp; &nbsp;'+
                // '</div>'+

            '<div class="agency-contact">' +
            '国籍:<span class="contact_profile_name">' + str2html(records[i].contact_profile_country.show) + '</span> &nbsp; &nbsp;' +
            '性别:<span class="contact_profile_sex">' + str2html(records[i].contact_profile_sex.show) + '</span> &nbsp; &nbsp;' +
            '生日:<span class="contact_profile_birthday">' + str2html(records[i].contact_profile_birthday.show) + '</span> &nbsp; &nbsp;' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div><hr />';
        }

        return str;
    },

    telephone: function (records, right) {
        var str = "";

        for (var i = 0; i < records.length; i++) {
            str += '<tr id="telephone_' + records[i].id + '">' +
            '<td class="telephone_name">' + str2html(records[i].telephone_name.show) + '</td>' +
            '<td class="telephone_type">' + str2html(records[i].telephone_type.show) + '</td>' +
            '<td class="telephone_phone">' + str2html(records[i].telephone_phone.show) + '</td>' +
            '<td class="operation">';

            if (tek.right.isCanCreate(right)) {
                str += '<a class="btn-icon" onclick="showEdit(\'ContactTelephone\', \'telephone_id\', \'' + records[i].id + '\')" title="编辑该电话">' +
                '<i class="fa fa-edit fa-clock-o circle-2 blue bg-info"></i></a>&nbsp;' +
                '<a class="btn-icon" onclick="removeInfo(\'ContactTelephone\', \'telephone_id\', \'' + records[i].id + '\')" title="删除该电话">' +
                '<i class="fa fa-remove circle-2 red bg-info"></i></a>';
            }

            str += '</td></tr>';
        }

        return str;
    },

    email: function (records, right) {
        var str = "";

        for (var i = 0; i < records.length; i++) {
            str += '<tr id="email_' + records[i].id + '">' +
            '<td class="email_name">' + str2html(records[i].email_name.show) + '</td>' +
            '<td class="email_address">' + str2html(records[i].email_address.show) + '</td>' +
            '<td class="operation">';

            if (tek.right.isCanCreate(right)) {
                str += '<a class="btn-icon" onclick="showEdit(\'ContactEmail\', \'email_id\', \'' + records[i].id + '\')" title="编辑该邮件">' +
                '<i class="fa fa-edit fa-clock-o circle-2 blue bg-info"></i></a>&nbsp;' +
                '<a class="btn-icon" onclick="removeInfo(\'ContactEmail\', \'email_id\', \'' + records[i].id + '\')" title="删除该邮件">' +
                '<i class="fa fa-remove circle-2 red bg-info"></i></a>';
            }

            str += '</td></tr>';
        }

        return str;
    },

    instance: function (records, right) {
        var str = "";

        for (var i = 0; i < records.length; i++) {
            str += '<tr id="instance_' + records[i].id + '">' +
            '<td class="instance_name">' + str2html(records[i].instance_name.show) + '</td>' +
            '<td class="instance_type">' + str2html(records[i].instance_type.show) + '</td>' +
            '<td class="instance_address"><a href="#">' + str2html(records[i].instance_address.show) + '</a></td>' +
            '<td class="operation">';

            if (tek.right.isCanCreate(right)) {
                str += '<a class="btn-icon" onclick="showEdit(\'ContactInstance\', \'instance_id\', \'' + records[i].id + '\')" title="编辑该即时通讯">' +
                '<i class="fa fa-edit fa-clock-o circle-2 blue bg-info"></i></a>&nbsp;' +
                '<a class="btn-icon" onclick="removeInfo(\'ContactInstance\', \'instance_id\', \'' + records[i].id + '\')" title="删除该即时通讯">' +
                '<i class="fa fa-remove circle-2 red bg-info"></i></a>';
            }

            str += '</td></tr>';
        }

        return str;
    },
    url: function(records, right){
        var str = "";
        for (var i = 0; i < records.length; i++) {
            str += '<tr id="contact_url_' + records[i].id + '">' +
            '<td class="contact_url_name">' + str2html(records[i].contact_url_name.show) + '</td>' +
            '<td class="contact_url_address">' + str2html(records[i].contact_url_address.show) + '</td>' +
            '<td class="operation">';

            if (tek.right.isCanCreate(right)) {
                str += '<a class="btn-icon" onclick="showEdit(\'ContactUrl\', \'contact_url_id\', \'' + records[i].id + '\')" title="编辑该网址">' +
                '<i class="fa fa-edit fa-clock-o circle-2 blue bg-info"></i></a>&nbsp;' +
                '<a class="btn-icon" onclick="removeInfo(\'ContactUrl\', \'contact_url_id\', \'' + records[i].id + '\')" title="删除该网址">' +
                '<i class="fa fa-remove circle-2 red bg-info"></i></a>';
            }

            str += '</td></tr>';
        }

        return str;
    },
    address: function (records, right) {
        var str = "";

        for (var i = 0; i < records.length; i++) {
            str += '<tr id="address_' + records[i].id + '"><td>' +
            '<div class="" style="position: relative;">' +
            '<div class="" style="margin-right: 150px;">' +
            '<h4 class="address_name">' + str2html(records[i].address_name.show) + '</h4>' +
            '</div>' +
            '<div class="operation" style="width: 150px;position: absolute;top: 0;right: -8px;padding: 8px;">';

            if (tek.right.isCanWrite(RIGHT)) { // 地址的权限特殊，通过contact的权限判断
                str += '<a class="btn-icon" onclick="showEdit(\'ContactAddress\', \'address_id\', \'' + records[i].id + '\')" title="编辑该地址">' +
                '<i class="fa fa-edit fa-clock-o circle-2 blue bg-info"></i></a>&nbsp;';

                if (contactId != OBJECT_ID) {
                    str += '<a class="btn-icon" onclick="removeInfo(\'ContactAddress\', \'address_id\', \'' + records[i].id + '\')" title="删除该地址">' +
                    '<i class="fa fa-remove circle-2 red bg-info"></i></a>';
                }
            }

            str += '</div>' +
            '</div>' +
            '<div class="agency-contact">' +
            '<div id="allmap" style="float:left;width:200px;height:200px;overflow:hidden;margin-right:15px;"></div>' +
            '<div>' +
            '国家:<span class="address_country">' + str2html(records[i].address_country.show) + '</span> &nbsp; &nbsp;' +
            '省/市:<span class="address_state">' + str2html(records[i].address_state.show) + '</span> &nbsp; &nbsp;' +
            '县/区:<span class="address_city">' + str2html(records[i].address_city.show) + '</span> &nbsp; &nbsp;' +
            '</div>' +
            '<div>街道:<span class="address_street">' + str2html(records[i].address_street.show) + '</span> &nbsp; &nbsp;</div>' +
            '<div>' +
            '地标:<span class="address_landmark">' + str2html(records[i].address_landmark.show) + '</span> <br />' +
            '邮编:<span class="contact_profile_position">' + str2html(records[i].address_zip.show) + '</span> &nbsp; &nbsp;' +
            '</div>' +
            '</div>' +
            '</td></tr>';
        }

        return str;
    }
};


//-------------------------------------------------------操作-----------------------------------------------------------
//------------------------------通用方法（用于 操作）------------------
// 获取编辑域HTML字符串
var getEditHtml = {
    profile: function (record) {
        if (!record)
            return "";

        var html = '<div class="form-group col-md-12">' +
            '<div colspan="4"><h3 class="add-new-title-info">新建联系人</h3></div>' +
            '</div>';
        // TODO 这里没有完成

        return html;
    },

    telephone: function (record) {
        if (!record)
            return "";

        var isMobile = false; //是否是手机

        var html = '<tr data-type="' + (record.id && record.id != 0 ? "edit_" + record.id : "") + '">' +
            '<td class="form-group">' +
            '<input class="form-control-line" type="text" name="telephone_name" placeholder="联系人/标记" value="' + (record.telephone_name.show || "") + '"/>' +
            '</td>' +
            '<td class="form-group">';
        if (record.telephone_type) {
            var field = record.telephone_type;
            var selects = field['selects'] || [];
            var shows = field['shows'] || [];
            isMobile = field.value == 1;

            html += '<select class="form-control-line" name="telephone_type" placeholder="类型" onchange="telephoneTypeChange(this)">';
            for (var i = 0; i < selects.length; i++) {
                var selected = (!field.value && i == 0) || (field.value == selects[i]) ? 'selected' : '';
                html += '<option value="' + selects[i] + '" ' + selected + '>' + shows[i] + '</option>';
            }
            html += '</select>';
        }
        html += '</td>' +
        '<td class="form-group">' +
        '<span id="telephone_areacode" ' + (isMobile ? 'style="display: none;"' : '') + '>' +
        '<input class="form-control-line number-code" type="text" maxlength="4" name="telephone_areacode" maxlength="4" placeholder="区号" value="' + (record.telephone_areacode.show || "") + '"/>' +
        '&nbsp;-&nbsp;</span>' +
        '<span id="telephone_number">' +
        '<input class="form-control-line" type="text" name="telephone_number" maxlength="15" placeholder="电话号码" value="' + (record.telephone_number.show || "") + '" />' +
        '</span>' +
        '</td>' +
        '<td class="form-group">' +
        '<button class="btn btn-red" type="button" onclick="commitTelephone(\'' + record.id + '\')">提交</button>&nbsp;' +
        '<button class="btn btn-default" type="button" onclick="cancelNew(\'add_new_telephone\');">取消</button>' +
        '</td>' +
        '</tr>';

        return html;
    },

    email: function (record) {
        if (!record)
            return "";

        var html = '<tr data-type="' + (record.id && record.id != 0 ? "edit_" + record.id : "") + '">' +
            '<td class="form-group">' +
            '<input class="form-control-line" type="text" name="email_name" placeholder="邮箱名/标记" value="' + (record.email_name.show || "") + '"/>' +
            '</td>' +
            '<td class="form-group">' +
            '<input class="form-control-line account-number" type="email" name="email_address" placeholder="邮箱" value="' + (record.email_address.show || "") + '"/>' +
            '</td>' +
            '<td class="form-group">' +
            '<button class="btn btn-red" type="button" onclick="commitMail(\'' + record.id + '\')">提交</button>&nbsp;' +
            '<button class="btn btn-default" type="button" onclick="cancelNew(\'add_new_email\');">取消</button>' +
            '</td>' +
            '</tr>';

        return html;
    },

    instance: function (record) {
        if (!record)
            return "";

        var html = '<tr data-type="' + (record.id && record.id != 0 ? "edit_" + record.id : "") + '">' +
            '<td class="form-group">' +
            '<input class="form-control-line" type="text" name="instance_name" placeholder="账号名/标记" value="' + (record.instance_name.show || "") + '"/>' +
            '</td>' +
            '<td class="form-group">';
        if (record.instance_type) {
            var field = record.instance_type;
            var selects = field['selects'] || [];
            var shows = field['shows'] || [];

            html += '<select class="form-control-line" name="instance_type" placeholder="类型">';
            for (var i = 0; i < selects.length; i++) {
                var selected = (!field.value && i == 0) || (field.value == selects[i]) ? 'selected' : '';
                html += '<option value="' + selects[i] + '" ' + selected + '>' + shows[i] + '</option>';
            }
            html += '</select>';
        }
        html += '</td>' +
        '<td class="form-group">' +
        '<input class="form-control-line account-number" type="text" name="instance_address" placeholder="账号" value="' + (record.instance_address.show || "") + '"/>' +
        '</td>' +
        '<td class="form-group">' +
        '<button class="btn btn-red" type="button" onclick="commitInstance(\'' + record.id + '\')">提交</button>&nbsp;' +
        '<button class="btn btn-default" type="button" onclick="cancelNew(\'add_new_instance\');">取消</button>' +
        '</td>' +
        '</tr>';

        return html;
    },
	url:function(record){
		if(!record){
			return "";
		}
		var html = '<tr data-type="' + (record.id && record.id != 0 ? "edit_" + record.id : "") + '">' +
            '<td class="form-group">' +
            '<input class="form-control-line" type="text" name="contact_url_name" placeholder="网址名" value="' + (record.contact_url_name.show || "") + '"/>' +
            '</td>' +
            '<td class="form-group">' +
            '<input class="form-control-line " type="text" name="contact_url_address" placeholder="网址" value="' + (record.contact_url_address.show || "") + '"/>' +
            '</td>' +
            '<td class="form-group">' +
            '<button class="btn btn-red" type="button" onclick="commitUrl(\'' + record.id + '\')">提交</button>&nbsp;' +
            '<button class="btn btn-default" type="button" onclick="cancelNew(\'add_new_url\');">取消</button>' +
            '</td>' +
            '</tr>';

        return html;
	},
    address: function (record) {
        if (!record)
            return "";

        var html = '<tr data-type="' + (record.id && record.id != 0 ? "edit_" + record.id : "") + '">' +
            '<td>' +
            '<div class="form-group col-md-12"><h4>新建地址信息' +
            '<div style="float: right;margin-right: 50px;">' +
            '<button type="button" class="btn btn-red" onclick="commitAddress(\'' + record.id + '\')">提交</button>&nbsp;' +
            '<button type="button" class="btn btn-default" onclick="cancelNew(\'add_new_address\');">取消</button>' +
            '</div>' +
            '</h4></div>';

        if (record.address_name) {
            var field = record.address_name;

            html += '<div class="form-group col-md-12"><div class="col-md-3">地址别名</div>' +
            '<div class="col-md-9">' +
            '<input type="text" class="form-control" name="address_name" placeholder="名称" value="' + (field.show || "") + '"/>' +
            '</div>' +
            '</div>';
        }
        if (record.address_zip) {
            var field = record.address_zip;

            html += '<div class="form-group col-md-12"><div class="col-md-3">' + field.display + '</div>' +
            '<div class="col-md-9">' +
            '<input type="text" class="form-control" name="address_zip" placeholder="邮编" value="' + (field.show || "") + '"/>' +
            '</div>' +
            '</div>';
        }
        if (record.address_country) {
            var field = record.address_country;
            var selects = field['selects'] || [];
            var shows = field['shows'] || [];

            html += '<div class="form-group col-md-12"><div class="col-md-3">' + field.display + '</div>' +
            '<div class="col-md-9">' +
            '<select class="form-control" id="address_country" name="address_country" onchange="addressChange(this, \'country\')" placeholder="' + field.display + '">';
            for (var i = 0; i < selects.length; i++) {
                var selected = (!field.value && i == 0) || (field.value == selects[i]) ? 'selected' : '';
                html += '<option value="' + selects[i] + '" ' + selected + '>' + shows[i] + '</option>';
            }
            html += '</select>' +
            '</div>' +
            '</div>';
        }
        if (record.address_state) {
            var field = record.address_state;

            html += '<div class="form-group col-md-12"><div class="col-md-3">' + field.display + '</div>' +
            '<div class="col-md-9">' +
            '<select class="form-control" id="address_state" name="address_state" onchange="addressChange(this, \'state\')" data-value="' + field.value + '" placeholder="' + field.display + '"></select>' +
            '</div>' +
            '</div>';
        }
        if (record.address_city) {
            var field = record.address_city;

            html += '<div class="form-group col-md-12"><div class="col-md-3">' + field.display + '</div>' +
            '<div class="col-md-9">' +
            '<select  class="form-control" id="address_city" name="address_city" data-value="' + field.value + '" placeholder="' + field.display + '"></select>' +
            '</div>' +
            '</div>';
        }
        if (record.address_street) {
            var field = record.address_street;

            html += '<div class="form-group col-md-12"><div class="col-md-3">' + field.display + '</div>' +
            '<div class="col-md-9">' +
            '<input type="text" class="form-control" name="address_street" placeholder="' + field.display + '" value="' + (field.show || "") + '"/>' +
            '</div>' +
            '</div>';
        }
        if (record.address_landmark) {
            var field = record.address_landmark;

            html += '<div class="form-group col-md-12"><div class="col-md-3">' + field.display + '</div>' +
            '<div class="col-md-9">' +
            '<input type="text" class="form-control" name="address_landmark" placeholder="' + field.display + '" value="' + (field.show || "") + '"/>' +
            '</div>' +
            '</div>';
        }

        html += '</td>' +
        '</tr>';

        return html;
    }
};


//---------------------------------------------获取提交参数并校验（用于 新建 和 编辑）---------------------------------------
// 联系人
function getProfileParams() {
    var params = tek.Utils.getFromJSON(document.getElementById('add_new_telephone'));

    if (params["contact_profile_title"].length > 64 || params["contact_profile_title"].length < 1) {
        borderWarn("#contact_profile_title");
        return;
    }

    if (params["contact_profile_name"].length > 250 || params["contact_profile_name"].length < 1) {
        borderWarn("#contact_profile_name");
        return;
    }

    if (params["contact_profile_birthday"].length > 10 || params["contact_profile_birthday"].length < 1) {
        borderWarn("#contact_profile_birthday");
        return;
    }

    if (params["contact_profile_language"].length > 250 || params["contact_profile_language"].length < 1) {
        borderWarn("#contact_profile_language");
        return;
    }

    if (params["contact_profile_country"].length > 10 || params["contact_profile_country"].length < 1) {
        borderWarn("#contact_profile_country");
        return;
    }

    if (params["contact_profile_organization"].length > 10 || params["contact_profile_organization"].length < 1) {
        borderWarn("#contact_profile_organization");
        return;
    }

    if (params["contact_profile_unit"].length > 10 || params["contact_profile_unit"].length < 1) {
        borderWarn("#contact_profile_unit");
        return;
    }

    if (params["contact_profile_department"].length > 10 || params["contact_profile_department"].length < 1) {
        borderWarn("#contact_profile_department");
        return;
    }

    if (params["contact_profile_position"].length > 10 || params["contact_profile_position"].length < 1) {
        borderWarn("#contact_profile_position");
        return;
    }

    // if(params["contact_profile_owner"].length > 10 || params["contact_profile_owner"].length < 1){
    // 	borderWarn("contact_profile_owner");
    // 	return;
    // }

    // if(params["contact_profile_contact"].length > 10 || params["contact_profile_contact"].length < 1){
    // 	borderWarn("contact_profile_contact");
    // 	return;
    // }

    if (params["contact_profile_remark"].length > 10 || params["contact_profile_remark"].length < 1) {
        borderWarn("#contact_profile_remark");
        return;
    }

    return params;
}

// 电话
function getTelephoneParams() {
    var params = tek.Utils.getFromJSON(document.getElementById('add_new_telephone'));

    if (!params["telephone_name"]) {
        borderWarn("[name='telephone_name']");
        return;
    }

    if (params['telephone_type'] != 1) {
        if (!(/^\d{2,6}$/).test(params["telephone_areacode"])) {
            borderWarn("[name='telephone_areacode']");
            return;
        }
    } else {
        params["telephone_areacode"] = "";
    }


    if (!(/^([0-9]{5,})+(\-[0-9]{1,})?$/.test(params["telephone_number"]))) {
        borderWarn("[name='telephone_number']");
        return false;
    }

    return params;
}

// 邮箱
function getMailParams() {
    var params = tek.Utils.getFromJSON(document.getElementById('add_new_email'));

    if (!params["email_name"]) {
        borderWarn("[name='email_name']");
        return;
    }

    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(params["email_address"])) {
        borderWarn("[name='email_address']");
        return;
    }

    return params;
}

// 即时通
function getInstanceParams() {
    var params = tek.Utils.getFromJSON(document.getElementById('add_new_instance'));

    if (!params["instance_name"]) {
        borderWarn("[name='instance_name']");
        return false;
    }

    if (params["instance_type"] == "qq") {
        // 验证
        if (!/^[0-9]{4,}$/.test(params["instance_address"])) {
            borderWarn("[name='instance_address']");
            return;
        }
    } else {
        //if (!/^[0-9]{4,}$/.test(params["instance_address"])) {
        //    borderWarn("[name='instance_address']");
        //    return;
        //}
    }

    return params;
}
//网址
function getUrlParams(){
	var params = tek.Utils.getFromJSON(document.getElementById('add_new_url'));
	
	if(!params["contact_url_name"]){
		borderWarn["[name='contact_url_name']"];
		return false;
	}

    return params;
}
// 地址
function getAddressParams() {
    var params = tek.Utils.getFromJSON(document.getElementById('add_new_address'));

    if (!params["address_name"]) {
        borderWarn("[name='address_name']");
        return false;
    }

    //if (params["address_zip"].length < 6 || params["address_zip"].length > 20) {
    //    borderWarn("[name='address_zip']");
    //    return false;
    //}

    //if (!params["address_country"]) {
    //    borderWarn("[name='address_country']");
    //    return;
    //}
    //
    //if (!params["address_state"]) {
    //    borderWarn("[name='address_state']");
    //    return;
    //}
    //
    //if (!params["address_city"]) {
    //    borderWarn("[name='address_city']");
    //    return;
    //}
    //
    //if (!params["address_street"]) {
    //    borderWarn("[name='address_street']");
    //    return false;
    //}

    //if (params["address_landmark"].length < 1 || params["address_landmark"].length > 64) {
    //    borderWarn("[name='address_landmark']");
    //    return;
    //}

    return params;
}


//-----------------------------------------------------通用方法（适用于本js文件）------------------------------------------
// 警告提示【不合法值表单边框变红，同时获取焦点】
function borderWarn($id) {
    $($id).css({
        'border-bottom': 'solid 1px red'
    }).focus();
    var timer = setTimeout(function () {
        clearTimeout(timer);
        $($id).css({
            'border-bottom': 'solid 1px #ccc'
        });
    }, 2000);
}

function str2html(str) {
    return tek.dataUtility.stringToHTML(str);
}


//----------------------------------------------------------END---------------------------------------------------------
