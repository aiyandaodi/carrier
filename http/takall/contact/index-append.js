// JavaScript Document
/**************************************************
 *    联系信息读取附件 index-append.js
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

        /*for (var i = 0; i < records.length; i++) {
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
        }*/

        return str;
    },

    telephone: function (records, right) {
        var str = "";
        for(var i in records){
            if(records[i].telephone_type){
                var type = records[i].telephone_type.value;
                var iType;
                if(type == 0){
                    iType = '<i class="fa fa-phone"></i>'
                }else if(type == 1){
                    iType = '<i class="fa fa-mobile"></i>'
                }else{
                    iType = '<i class="fa fa-fax"></i>'
                }
            }
            if(records[i].telephone_phone && records[i].telephone_type){
                var phone = records[i].telephone_phone.show || '';
                str += '<li>' + iType + ' &nbsp;' + tek.dataUtility.stringToHTML(phone) + '</li>';
            }
        }

        return str;
    },

    email: function (records, right) {
        var str = "";
        for(var i in records){
            if(records[i].email_address ){
                var email = records[i].email_address.show || '';
                str += '<li><i class="fa fa-envelope"></i> &nbsp;' + tek.dataUtility.stringToHTML(email) + '</li>';
               
            }
        }
        return str;
    },

    instance: function (records, right) {
        var str = "";
        for(var i in records){
            if(records[i].instance_type){
                var type = records[i].instance_type.value;
                var iType;
                if(type == 'qq'){
                    iType = '<i class="fa fa-qq"></i>'
                }else if(type == 'wechat'){
                    iType = '<i class="fa fa-weixin"></i>'
                }else if(type == 'blog'){
                    iType = '<i class="fa fa-weibo"></i>'
                }
            }

            if(records[i].instance_address ){
                var instance = records[i].instance_address.show || '';
                str += '<li>'+ iType +' &nbsp;' + tek.dataUtility.stringToHTML(instance) + '</li>';
               
            }
        }
        return str;
    },
    url: function(records, right){
        var str = "";
        for(var i in records){
            if(records[i].contact_url_address ){
                var url = records[i].contact_url_address.show || '';
                str += '<li><i class="fa fa-chain"></i> &nbsp;' + tek.dataUtility.stringToHTML(url) + '</li>';
               
            }
        }

        return str;
    },
    address: function (records, right) {
        var str = "";

        for(var i in records){
            if(records[i].address_country ){
                var country = records[i].address_country.show || '';
               
            }
            if(records[i].address_state ){
                var state = records[i].address_state.show || '';
               
            }
            if(records[i].address_city ){
                var city = records[i].address_city.show || '';
               
            }
            str += '<li><i class="fa fa-home"></i> &nbsp;' + tek.dataUtility.stringToHTML(country) + tek.dataUtility.stringToHTML(state) + tek.dataUtility.stringToHTML(city) +'</li>';
               
        }

        return str;
    }
};



//-----------------------------------------------------通用方法（适用于本js文件）------------------------------------------

function str2html(str) {
    return tek.dataUtility.stringToHTML(str);
}


//----------------------------------------------------------END---------------------------------------------------------
