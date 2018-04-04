// JavaScript Document
var profile_id;	//标识
var items = new Array("profile_name", "profile_describe", "profile_motto", "profile_sex","profile_source", "profile_resident",
				 "profile_jobarea", "profile_tag", "profile_color", "profile_degree", "profile_mode", "profile_status","profile_remark");
function init(){
	
	/** 载入页面顶部信息 **/
	$("#tekinfo_banner").load(tek.common.getRootPath() + "http/ican/html/owner.html",function(){
		$.getScript(tek.common.getRootPath() + "http/ican/html/owner.js",function(){
			if(typeof initHeader == "function"){
				initHeader();
			}
			$("#mydesk").addClass("active");
			//alert( $("#mydesk").attr("class") );
		});
		
		$("#tekinfo_banner").css("position","relative");
		$("#tekinfo_banner").show();
	});
	profile_id = request["profile_id"];
	if(profile_id || myId){
		readProfile();
	}
	
}
function readProfile(){
	var target = document.getElementById('read-info');
    if(!target){
		return;
	}

    var setting = {operateType: "获取用户信息"};
    var sendData = {
        objectName: "Profile",
        action: "readInfo",
        icon:1
    };
    if(profile_id){
    	sendData["profile_id"] = profile_id
    }else{
    	sendData["profile_owner"] = myId
    	sendData["action"] = "getList"
    }
	var callback = {
        beforeSend: function () {
            $("#read-info").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            if (tek.right.isCanWrite(parseInt(data.right))){
                $(".edit-btn").removeClass("hidden");
            }
           
            var record = data["record"];
            if (record) {
                $("#read-info").html("");
                //显示小组信息
                showUserInfo(record);
            } else {
                $("#read-info").html("<div class='col-md-12 col-sm-12 center'>没有用户信息！</div>");
                $(".edit-btn").addClass('hide');
            }
        },
        error: function (data, errorMsg) {
            // $("#read-info").html(errorMsg);
            if(data.code == 404){

            	$("#read-info").html("尚未添加个人信息！&nbsp;<a href='add.html?show-close=1&refresh-opener=1' target='_blank' class='btn btn-success'>立即添加</a>");
            }else{
            	$("#read-info").html(errorMsg);
            }
        }
    };
     tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	
	
	//tek.macRead.readInfo(tek.common.getRootPath() + "servlet/tobject",sendData, items, 'read-info');
	//var items = ["user_name","user_sex","user_birthday","user_mobile","user_email","user_security","user_status","user_end","user_remark"];
	
	
}

//显示用户信息
function showUserInfo(record){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	if(record.id){
		profile_id = record.id;
	}
	if(record.profile_describe){
		field = record.profile_describe;
		html += '<h4><i class="fa fa-heart"></i>&nbsp;&nbsp;一句话介绍自己</h4>'
			+ '<div class="form-group">'
			+ '<div class="col-sm-12">'
			+ '<textarea class="form-control" name="'+ field.name +'" id="' + field.name + '" rows="3">' + tek.dataUtility.stringToHTML(field.show || '') + '</textarea>'
			+ '</div>'
			+ '</div>';
	}
	                                
    if(record.profile_name){
		field = record.profile_name;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="' + field.name + '" value="' + (field.show || '') + '">'
			+ '</div>'
			+ '</div>';
	}
	
	if(record.profile_sex){
		field = record.profile_sex;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<label><input type="radio"  name="' + field.name + '" '+ ((field.value == 1) ? 'checked' : '') +' value="1">男性</label>&nbsp;'
			+ '<label><input type="radio"  name="' + field.name + '" '+ ((field.value == 2) ? 'checked' : '') +' value="2">女性</label>&nbsp;'
			+ '<label><input type="radio"  name="' + field.name + '" '+ ((field.value == 0) ? 'checked' : '') +' value="0">保密</label>'
			+ '</div>'
			+ '</div>';
	}
	if(record.profile_birthdate){
		field = record.profile_birthdate;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<input type="date" class="form-control" name="' + field.name + '" id="' + field.name + '" value="' + (field.show|| '') + '">'
			+ '</div>'
			+ '</div>';
	}
	
	html += '<h4></h4>';
	if(record.profile_source){
		field = record.profile_source;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<input type="text" class="form-control" id="' + field.name + '" value="' + (field.show|| '') + '">'
			+ '</div>'
			+ '</div>';
	}
	if(record.profile_resident){
		field = record.profile_resident;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<span class="form-control" id="' + field.name + '" >' + (field.show || '') + '</span>'
			+ '</div>'
			+ '</div>';
	}
	if(record.profile_jobarea){
		field = record.profile_jobarea;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<span class="form-control" id="' + field.name + '" >' + (field.show || '') + '</span>'
			+ '</div>'
			+ '</div>';
	}
	html += '<h4></h4>';
	
	/*if(record.profile_status){
		field = record.profile_status;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<span class="form-control" id="' + field.name + '" >' + (field.show || '') + '</span>'
			+ '</div>'
			+ '</div>';
	}*/
	if(record.profile_degree){
		field = record.profile_degree;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<span class="form-control" id="' + field.name + '" >' + (field.show || '') + '</span>'
			+ '</div>'
			+ '</div>';
	}
	if(record.profile_mode){
		field = record.profile_mode;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<span class="form-control" id="' + field.name + '" >' + (field.show || '') + '</span>'
			+ '</div>'
			+ '</div>';
	}
	if(record.profile_remark){
		field = record.profile_remark;
		html += '<div class="form-group">'
			+ '<label for="' + field.name + '" class="col-sm-3 control-label">' + (field.display || '') + '</label>'
			+ '<div class="col-sm-9">'
			+ '<textarea class="form-control" name="' + field.name + '" id="' + field.name + '" rows="4">' + (field.show || '') + '</textarea>'
			+ '</div>'
			+ '</div>';
	}
	
	html += '<div class="btns operateBtn hidden">'
		+ '<button type="button" class="btn btn-success btn-lg " id="save_info" onclick="javascript:promptAdd()">确定</button>'
		+ '<button  type="button" class="btn btn-danger btn-lg " id="cancel_info" onclick="javascript:cancelEdit()">取消</button>'
		+ '</div>';
	
	$("#read-info").html(html);
	
	var form=document.forms[0];
	for(var i=0;i<form.length;i++){
		var element=form.elements[i];
		element.disabled=true;
	}	
}
function editUser(){
	/*var form=document.forms[0];
	for(var i=0;i<form.length;i++){
		var element=form.elements[i];
		element.disabled=false;
	}
	$('.operateBtn').removeClass('hidden');
	$(".popmenu-btn").html('<i class="fa fa-save">');
	$(".popmenu-btn").attr('onClick','javascript:promptAdd();');
	*/
	var url = 'edit.html?profile_id=' + profile_id + '&show-close=1&refresh-opener=1';
	window.open(url);
}

function promptAdd(){
	/*var str='<p>是否确认更改？</p>'
		+ '<a href="javascript:submitAdd();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
	$('#message-modal-dialog').css('z-index','10880');
	showMessage(str);*/
	var target = document.getElementById('read-info');
	if(!target){
		return alert("系统错误！ 请与管理员联系！");
	}

  	var setting = {
  		async: true,
  		operateType: "提交用户编辑信息"
  	};
	var sendData = tek.common.getSerializeObjectParameters("read-info") || {};	//转为json
  	sendData["objectName"] = "Profile";
  	sendData["action"] = "setInfo";
  	sendData["profile_id"] = profile_id;

  	/*if(!sendData.user_name || sendData.user_name.value == ""){
		target.user_name.placeholder = "请输入你的问题";
		target.user_name.focus();
		
		//错误提示
		tek.macCommon.waitDialogShow(null, "名字不能为空", null, 0);
		tek.macCommon.waitDialogHide(3000);
		
		return;
	}*/

	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);
}

function submitAdd(){
	closeMessage();
	$(".popmenu-btn").html('<i class="fa fa-pencil">');
	$(".popmenu-btn").attr('onClick','javascript:editUser();');
	readUser();
}
//修改密码
function editPassword(){
	var str='<h4>修改密码:</h4>'
		+ '<form class="form-horizontal" style="max-width:500px" role="form">'
		+ '<div class="form-group">'
		+ '<label class="control-label col-sm-3">原密码</label><div class="col-sm-9"><input type="password" class="form-control" id="prePassword" value="12345"></div>'
		+ '</div>'
		+ '<div class="form-group">'
		+ '<label class="control-label col-sm-3">新密码</label><div class="col-sm-9"><input type="password" class="form-control" id="newPassword" placeholder="请输入新密码" required></div>'
		+ '</div>'
		+ '<div class="form-group">'
		+ '<label class="control-label col-sm-3">确认密码</label><div class="col-sm-9"><input type="password" class="form-control" id="secondPassword" placeholder="请确认新密码" required><span id="pwdMsg" style="color:red;display:none">密码不一致</span></div>'
		+ '</div>'
		+ '<button onClick="javascript:surePassword();" class="btn btn-success" id="btnSurePwd">确认</button>'
		+ '&nbsp;&nbsp;'
		+ '<button onClick="javascript:closePrompt();" class="btn btn-primary">返回</button>'
		+ '</form>';
	showMessage(str);
	pwdInputInit();
}
//确认修改密码
function surePassword(){
	var first=$('#newPassword').val();
	var second=$('#secondPassword').val();
	if(first!=""&&second!=""){
		showMessage('修改成功');
	}
	else{
		showError('密码不能为空');
	}
}
//检验两次密码一致
function pwdInputInit(){
	$('#secondPassword').keyup(function(){
		pwdInit();
	})
	$('#newPassword').keyup(function(){
		pwdInit();
	})
}
function pwdInit(){
	var first=$('#newPassword').val();
		var second=$('#secondPassword').val();
			if(first!=second){
				$('#pwdMsg').css('display','block');
				$('#btnSurePwd').attr('disabled',true);
			}
			else{
				$('#pwdMsg').css('display','none');
				$('#btnSurePwd').removeAttr('disabled');
			}
}
function closePrompt(){
	closeMessage();
}
function cancelEdit(){
	window.location.reload();
}