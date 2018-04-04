//=====================================================Parameter=============================
var contactId; //联系信息id
var RIGHT = 0; //对于 Contact 的权限值
var OBJECT_NAME, OBJECT_ID; //联系信息所属对象，所属记录标识


// telephone type already-select
var PHONE_ALREADY = [];
var INSTANCE_ALREADY = [];
var CONTACT_TYPE;

var IS_EDIT =  false;
var ICON;
//=====================================================Function===============================
// 初始化
function init() {
	/** 载入页面顶部信息 **/
	$("#tekinfo_banner").load(tek.common.getRootPath() + "http/ican/html/owner.html",function(){
		$.getScript(tek.common.getRootPath() + "http/ican/html/owner.js",function(){
			if(typeof initHeader == "function"){
				initHeader();
			}
		});
		
		$("#contact").addClass("active");
		
		$("#tekinfo_banner").css("position","relative");
		$("#tekinfo_banner").show();
	});


    //获取联系信息
    getContactList();
    
}


//---------------------------------------------------联系信息------------------------------------------------------------
//获取联系信息
function getContactList() {

    var setting = {operateType: '获取联系信息'};
    var sendData = {
		objectName: "Contact", 
		action: "getList", 
		contact_objectName: 'User',
        contact_owner: myId
	};
    var callback = {
        success: function (data) {
            RIGHT = parseInt(data.right); // 保存contact全限值

            var record = data['record'];
            if (record) {
                record = !record.length ? [record] : record;
                for(var i in record){
                	showContactInfo(record[i], RIGHT);
                	/*contactId = record[i].id;
                	// 获取联系信息的附属信息
                	getContactSub();*/
                }

                // $("#contact_info").html(html);

                
            } else {
                $("#contact_info").html("<div class='center'>没有联系信息!")
            }
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

//显示联系信息
function showContactInfo(record, right){
	if(!record){
		return ;
	}
	var html = '';
	var field;
    if(record.contact_owner){
        readUser(record.contact_owner.value);
    }
   
	html += '<a href="read.html"><img src="'+ICON+'" alt="" class="img-responsive" /></a>'
		+ '<div class="ui-details">'
		+ '<div class="container-fluid">'
		+ '<ul id="contact_tel_' + record.id + '"></ul>'
		+ '<ul id="contact_email_' + record.id + '"></ul>'
		+ '<ul id="contact_instance_' + record.id + '"></ul>'
		+ '<ul id="contact_url_' + record.id + '"></ul>'
		+ '<ul id="contact_address_' + record.id + '"></ul>'
		+ '</div>'
		+ '</div>'
		+ '<div class="ui-social">';


    if(record.contact_owner.value == myId || tek.role.isRightManager(myRole)){

    	html += '<a target="_blank" href="edit.html?contact_id=' + record.id + '&show-close=1&refresh-opener=1" class="ui-tooltip operate-edit" data-toggle="tooltip" data-placement="top" alt="编辑" title="编辑当前信息" data-original-title="edit">'
    		+ '<i class="fa fa-edit bg-orange"></i></a>'
   
    	html += '<a href=javascript:removeInfo("' + record.id + '") class="ui-tooltip" data-toggle="tooltip" data-placement="top" alt="删除" title="删除当前信息" data-original-title="remove">'
    		+ '<i class="fa fa-remove bg-red"></i></a>'

    	html += '<a target="_blank" href="read.html?contact_id=' + record.id + '&show-close=1&refresh-opener=1" class="ui-tooltip" data-toggle="tooltip" data-placement="top" alt="编辑" title="编辑当前信息" data-original-title="edit">'
    		+ '<i class="fa fa-angle-right bg-lblue"></i></a>';

    }
    html += '</div>';

    var target = document.getElementById("contact_info");
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	}
	contactId = record.id;
    // 获取联系信息的附属信息
    getContactSub();
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

            $("#contact_tel_"+contactId).html(html);

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

            $("#contact_email_"+contactId).html(html);
        }
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


            $("#contact_instance_"+contactId).html(html);
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
			
			$("#contact_url_"+contactId).html(html);
		}
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
            $("#contact_address_"+contactId).html(html);
            
        }
    }, function (data, errorMsg) {

    });
}


//用户信息  
function readUser(id) {
    var setting = {async:false, operateType: "读取用户信息"};
    var sendData = {
        objectName: "User",
        action: "readInfo",
        user_id: id,
        icon: 1
    };
    var callback = {
        beforeSend: function () {
            var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
            $("#user_info").html(html);
        },
        success: function (data) {
            var record = data["record"];
            
            if (record) {
                record = !!record.length ? record[0] : record;
                if(record.icon){
                    ICON = record.icon;
                }else{
                    ICON = '../../ican/person/images/penson.jpg';
                }
                
            } 
        },
        error: function (data, errorMsg) {
            
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}




//-----------------------通用方法（用于 获取附属信息）---------------
// 获取联系信息列表内容
function getContactSubInfo(objectName, success, error) {
	var setting = {async: false}
    var sendData = {
        objectName: objectName,
        action: "getList",
        contact_id: contactId
    };
    var callback = {success: success, error: error};
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', {setting}, sendData, callback);
}


//-------------------------------------------------------操作-----------------------------------------------------------


// 删除
function removeInfo(id) {
    var remove = window.confirm("删除之后不可恢复，确定要删除吗？");
    if(!remove){
    	return false;
    }

    var setting = {operateType: '删除记录'};
    var sendData = {
    	objectName: 'Contact', 
    	action: "removeInfo",
    	contact_id: id
    };
    var callback = {
        beforeSend: function () {
            var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在删除...</div>";
            tek.macCommon.waitDialogShow(null, html, null, 2);
        },
        success: function (data) {
            window.location.href = window.location.href;
            
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg, null, 0);
        },
        complete: function () {
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
   
}


function cEle(str){
    return document.createElement(str);
}