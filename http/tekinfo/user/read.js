// JavaScript Document
/**************************************************
 *    用户读取页面 index.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var DefaultCountPerPage = 3;	 //每页默认显示条数
var DefaultCountPerGroup = 2;	 //每组默认显示的条数

var subject_skip = 0;
var subject_total = 0; 		//记录总条数初始化
var subject_count = DefaultCountPerPage;	 //当前每页显示的条数
var currentFromPage = 1;	 //当前显示的页码起始值

var group_skip = 0;		//查询起始位置
var group_count = 3;	//每页显示个数
var group_total = 0;	//总共的个数
var userId;
var request = tek.common.getRequest();
function init(){
		if(request["user_id"]){
			userId = request["user_id"];
		}
		readUser();
		//获取记录
		listRecord();
		/*
		//获取小组
		listGroup();
		//获取主题
		listSubject();
		*/
	
}
//=====================================================Function===============================
//--------------------------------------读取用户信息---------------------------------------
//用户信息	
function readUser() {
	var setting = {operateType: "读取用户信息"};
	var sendData = {
		objectName: "User",
		action: "readInfo",
		user_id: request["user_id"],
		icon: 1
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#user_basic_info").html(html);
		},
		success: function (data) {
            console.log('hi di');
			var record = data["record"];
			if (tek.right.isCanWrite(parseInt(data.right))) {
				$("#my_icon").attr("onclick", "iconEdit()");
				$("#user_photo > span").removeClass("hidden").attr("onclick", "iconEdit()");

				var editTarget = document.getElementById("editBut");
				if (editTarget) {
					var html = "<a class='btn alert alert-info' onclick='editUser()'><i class='fa fa-edit'>编辑</i></a>";
					editTarget.insertAdjacentHTML('BeforeEnd', html);
				}
			}

			if (record) {
				record = !!record.length ? record[0] : record;
				showUserReadInfo(record);
			} else {
				$("#user_basic_info").text("没有数据！");
			}
		},
		error: function (data, errorMsg) {
			$("#user_basic_info").html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

function showUserReadInfo(record) {
	if (!record)
		return;

	//头像
	if (record.icon) {
		$("#my_icon").attr("src", record.icon);
	}else{
        $('#my_icon').attr('src','../../ican/person/images/penson.jpg');
    }

	//最近登录时间
	if (record.user_latestTime) {
		var user_latestTime = record.user_latestTime.show;
		if (user_latestTime)
			$("#user_latestTime").html(user_latestTime);
	}

	//最近登录IP
	if (record.user_latestIp) {
		var user_latestIp = record.user_latestIp.show;
		if (user_latestIp)
			$("#user_latestIp").html(user_latestIp);
	}

	//当前登录时间 当前登录IP
	if (userId == myId) {
		$("#user_currentTime").html(myLoginTime); //时间
		$("#user_currentIp").html(myLoginIp); //IP
	} else {
		$("#currentTime").html(null);
		$("#currentIp").html(null);
	}

	//是否在线
	//if(record.user_online){
	//   var user_online=record.user_online.show;
	//   if(user_online)
	//      document.getElementById("user_online").innerHTML=user_online;
	//}

	//-----------------基本信息-------------
	var html = "";

	//用户编码
	if (record.user_code) {
		html += "<div class='form-group'><label class='control-label col-xs-4' for='user_code'>用户编码</label>"
			+ "<div class='col-xs-8' style='padding-top:7px'><span id='user_code'>"
			+ (record.user_code.show || "")
			+ "</span></div></div>";
	}

	//用户姓名
	if (record.user_name) {
		html += "<div class='form-group'><label class='control-label col-xs-4' for='user_name2'>用户姓名</label>"
			+ "<div class='col-xs-8' style='padding-top:7px'><span id='user_name2'>"
			+ (record.user_name.show || "")
			+ "</span></div></div>";
		$("#current_user").html(record.user_name.show || "");
	}

	//性别
	if (record.user_sex) {
		html += "<div class='form-group'><label class='control-label col-xs-4' for='user_sex'>用户性别</label>"
			+ "<div class='col-xs-8' style='padding-top:7px'><span id='user_sex'>"
			+ (record.user_sex.show || "")
			+ "</span></div></div>";
	}

	//出生日期
	if (record.user_birthday) {
		html += "<div class='form-group'><label class='control-label col-xs-4' for='user_birthday'>用户生日</label>"
			+ "<div class='col-xs-8' style='padding-top:7px'><span id='user_birthday'>"
			+ (record.user_birthday.show || "")
			+ "</span></div></div>";
	}

	//安全等级
	if (record.user_security) {
		html += "<div class='form-group'><label class='control-label col-xs-4' for='user_security'>安全等级</label>"
			+ "<div class='col-xs-8' style='padding-top:7px'><span id='user_security'>"
			+ (record.user_security.show || "")
			+ "</span></div></div>";
	}

	//用户状态
	if (record.user_status) {
		html += "<div class='form-group'><label class='control-label col-xs-4' for='user_status'>用户状态</label>"
			+ "<div class='col-xs-8' style='padding-top:7px'><span id='user_status'>"
			+ (record.user_status.show || "")
			+ "</span></div></div>";
	}

	//有效时间
	if (record.user_start || record.user_end) {
		html += "<div class='form-group'><label class='control-label col-xs-4' for='user_valid_time'>有效时间</label>"
			+ "<div class='col-xs-8' style='padding-top:7px'><span id='user_valid_time'>"
			+ (record.user_start.show || "") //有效时间start
			+ "  --  "
			+ (record.user_end.show || "") //有效时间end
			+ "</span></div></div>";
	}

	//所属客户端
	if (record.user_client) {
		html += "<div class='form-group'><label class='control-label col-xs-4' for='user_client'>所属客户端</label>"
			+ "<div class='col-xs-8' style='padding-top:7px'><span id='user_client'>"
			+ (record.user_client.show || "")
			+ "</span></div></div>";
	}

	//说明
	if (record.user_remark) {
		html += "<div class='form-group'><label class='control-label col-xs-4' for='user_client'>说 明</label>"
			+ "<div class='col-xs-8' style='padding-top:7px'><span id='user_client'>"
			+ (record.user_remark.show || "")
			+ "</span></div></div>";
	}

	$("#user_basic_info").html(html);
}

//编辑用户
function editUser() {
	
	window.open("edit.html?user_id=" + userId + "&show-close=1&refresh-opener=1", "_blank");
}

//编辑用户头像
function iconEdit() {
	window.open("icon-edit.html?user_id=" + userId);
}


/*
//------------------------------------------------小组显示----------------------------------
//获取小组的列表数据
function listGroup() {
	if (!$("#group").length) {
		return showError("小组显示区错误，请和管理员联系");
	}

	var setting = {operateType: "获取小组列表"};
	var sendData = {
		objectName: "Group",
		action: "getList",
		user_id: userId,
		order: "group_code",
		join: 1,
		count: group_count,
		skip: group_skip
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在获取数据...</div>";
			$("#group").html(html);
			//重置
			group_total = 0;
		},
		success: function (data) {
			$("#group").empty(); //清空
			group_total = parseInt(data.value);	//保存总数
			var records = data["record"];
			if (records) {
				records = !records.length ? [records] : records;
				for (var i in records)
					showGroupList(records[i]);
			} else {
				$("#group").html("没有数据！");
			}
		},
		error: function (data, errorMsg) {
			$("#group").html(errorMsg);
		},
		complete: function () {
			tek.turnPage.show("group-page", group_skip, group_count, group_total, DefaultCountPerGroup, false, false, false, false);//false,true,false,true
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示小组	
function showGroupList(record) {
	if (!record)
		return;

	var html = "<li>";

	var status = record.member_status;
	html += "<i class='fa fa-user "
		+ (!status ? "" : ((status.value == 100) ? "alert-danger" : "alert-link"))
		+ "'></i>";

	if (record.id && record.name) {
		html += "<a target='_blank' href='" + tek.common.getRootPath() + "http/takall/group/read.html?group_id=" + record.id
			+ "' target'_blank'>" + record.name + "</a>";
	} else {
		html += "错误小组";
	}
	html += "</li>";

	var target = document.getElementById('group');
	target.insertAdjacentHTML('BeforeEnd', html);

}
*/

//------------------------------------------------小组操作记录----------------------------------
//获取操作记录  -- 分 当前用户的最新操作记录 | 该用户最新操作的主题记录
function listRecord() {
	if (!$("#record").length) {
		return showError("记录显示区错误，请和管理员联系");
	}
	var setting = {operateType: "获取小组列表"};
	var sendData = {
		objectName: "ObjectRecord",
		action: "getList",
		user_id: userId,
		order: "record_code",
		desc: 1,
		count: 18
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在获取数据...</div>";
			$("#record").html(html);
			//重置
			record_total = 0;
		},
		success: function (data) {
			$("#record").empty();

			var records = data["record"];
			if (records) {
				records = !records.length ? [records] : records;
				for (var i in records)
					showRecord(records[i]);

				//显示更多按钮
				if (data.value > sendData.count) {
					$("#more > a").attr("href", tek.common.getRootPath() + "http/tekinfo/record/index.html?order=createTime&desc=1&user_id=" + userId);
					$("#more").removeClass("hide");
				}
			} else {
				$("#record").html("没有记录！");
			}
		},
		error: function (data, errorMsg) {
			$("#record").html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示操作记录
function showRecord(record) {
	if (!record)
		return;

	var html = "<tr onclick='recordInfo(\"" + record.id + "\")'>"
			//sb.append("操作：");
		+ "<td>"
		+ "<i class='fa fa-arrow-right'></i>  "
		+ (record.record_object ? record.record_object.show : "")
		+ "-"
		+ (record.record_command ? record.record_command.show : "")
		+ "</td>"
			//sb.append("记录对象：");
		+ "<td>"
		+ (record.record_objectid ? record.record_objectid.show : "")
		+ "</td>"
			//sb.append("记录时间：");
		+ "<td>"
		+ (record.record_time ? record.record_time.show : "")
		+ "</td>"
		+ "</tr>";

	var target = document.getElementById('record');
	target.insertAdjacentHTML('BeforeEnd', html);
}

//查看记录详情
function recordInfo(recordId) {
	return;
	var url = tek.common.getRootPath() + "http/tekinfo/record/read.html?record_id=" + recordId + "&show-close=1&refresh-opener=1";
	window.open(url);
}

//------------------------------------------------------其他 Function--------------------------------------------------
//翻页 --用于turn-page.js中
tek.turnPage.turn = function (ulId, skip) {
	if (ulId == "subject-page") {
		//改变列表起始位置
		subject_skip = skip;
		if (typeof listSubject == "function")
			listSubject();	//重新查询
		else
			alert("缺少listSubject方法！");
	} else if (ulId == "group-page") {
		//改变列表起始位置
		group_skip = skip;
		if (typeof listGroup == "function")
			listGroup();	//重新查询
		else
			alert("缺少listGroup方法！");
	}
};

//-------------------------------------------------------End------------------------------------------------------------------
