// JavaScript Document
// JavaScript Document
var ICON;	//用户头像

function initHeader(){
	
	var cssurl=tek.common.getRootPath()+"http/ican/html/owner.css";
	//alert("cssurl="+cssurl);
	loadCSS(cssurl);	

	readUser(myId);	//读取用户头像信息
	if(ICON){
		$("#user-icon").attr('src', ICON);
	}
	getProfileInfo();
}

function getProfileInfo(){
	var setting = {operateType: "读取用户扩展信息"};
	var sendData = {
		objectName: "Profile",
		action: "getList",
		profile_owner: myId
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#profile_info").html(html);
		},
		success: function (data) {
			var record = data["record"];
			

			if (record) {
				$("#profile_info").html('');
				record = !!record.length ? record[0] : record;
				showProfileInfo(record);

				if (tek.right.isCanWrite(parseInt(data.right))) {
					$("#editInfo").removeClass('hide');
					$("#editInfo").attr('href','read.html?profile_id=' + record.id+'&show-close=1&refresh-opener=1');
				}
			} else {
				$("#profile_info").html("没有用户扩展信息！&nbsp;<a href='"+tek.common.getRootPath() + "http/ican/person/add.html?show-close=1&refresh-opener=1' target='_blank' class='btn btn-success'>立即添加</a>");
			}
		},
		error: function (data, errorMsg) {
			$("#profile_info").html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

function showProfileInfo(record){
	if (!record){
		return;
	}
	var html = '';
	var field;
	
	if(record.name){
		html += '<h3>' + record.name;
	}
	/*if(record.profile_describe){
		field = record.profile_describe;
		html += '&nbsp;&nbsp;<span>' + tek.dataUtility.stringToHTML(field.show || '') + '</span>';
	}*/
	html += '</h3>';

	if(record.profile_motto){
		field = record.profile_motto;
		html += '<p>' + tek.dataUtility.stringToHTML(field.value || '') + '&nbsp;&nbsp;(人生格言)</p>';
	}
	html += '<ul class="ul-circle">'
	if(record.profile_jobarea){
		field = record.profile_jobarea;
		html += '<li>' + tek.dataUtility.stringToHTML(field.show || '') + '</li>';
	}
	if(record.profile_degree){
		field = record.profile_degree;
		html += '<li>' + tek.dataUtility.stringToHTML(field.show || '') + '</li>';
	}
	if(record.profile_mode){
		field = record.profile_mode;
		html += '<li>' + tek.dataUtility.stringToHTML(field.show || '') + '</li>';
	}
	html += '</ul>';
	$("#profile_info").html(html);
}

//用户信息	
function readUser(userId) {
	var setting = {async: false, operateType: "读取用户信息"};
	var sendData = {
		objectName: "User",
		action: "readInfo",
		user_id: userId,
		icon: 1
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#user_basic_info").html(html);
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