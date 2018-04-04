// JavaScript Document
var member_id;
var ICON;
function init(){
	if(request["member_id"] && request["member_id"] != null){
		member_id = request["member_id"];
	}
	if(member_id){
		getMemberInfo();
	}else{
		tek.common.waitDialogShow(null, "没有传入要读取的组员ID");
	}
  
}
/* 获取组员信息 */
function getMemberInfo(){
	var target = $("#member-info");
	if(!target){
		return ;
	}
	var setting = {operateType: "获取组员信息"};
	var sendData = {
		objectName: "Member",
		action: "readInfo",
		member_id: member_id,
		icon: 1
	}
	var callback = {
		beforeSend: function(){
			$("#member-info").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function(data){
			if(tek.right.isCanWrite(parseInt(data.right))){
				$("#member-edit-btn").removeClass("hidden");
				$("#member-edit-btn").attr("onClick", "editInfo()");
			}
			if(tek.right.isCanDelete(parseInt(data.right))){
				$("#member-remove-btn").removeClass("hidden");
				$("#member-remove-btn").attr("onClick", "removeInfo()");
			}

			var record = data["record"];
			if(record){
				$("#member-info").html("");
				//显示小组信息
				showMemberInfo(record);
			}else{
				$('#member-info').html("<div class='col-md-12 col-sm-12 center'>没有组员信息！</div>")
			}
		},
		error: function(data, errorMsg){
			$("#member-info").html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示组员信息
function showMemberInfo(record){
	if(record){
		var html = "";
		var field;
		var items = new Array("member_code", "member_user", "member_inform", "member_mobile", "member_email",
					 		"member_instant", "member_credit", "member_member_right", "member_subject_right", "member_creator", 
					 		"member_latest", "createTime", "modifyTime");

		if(record.member_user){
			field = record.member_user;
			readUser(field.value);
		}
		$("#member-icon").attr("src", ICON || '../../ican/person/images/penson.jpg');
		if(record["member_name"]){
			field = record["member_name"];
			var show = tek.dataUtility.stringToHTML(field.show || '');
			$("#member-name").html(show);
		}
		if(record["member_status"]){
			field = record["member_status"];
			var show = tek.dataUtility.stringToHTML(field.show || '');
			$("#member-status").html(show);
		}
		for(var i in items){
			var item = items[i];
			if(!item){
				break;
			}
			if(record[item]){
				field = record[item];

				html += "<div class='col-md-6 col-sm-6 col-xs-6 col-mob'>";
				html += "<div class='uis-item'>";
				html += "<h4>" + (field.display || "") + "：" ;
				html += tek.dataUtility.stringToHTML(field.show || '') + "</h4>";
				html += "</div>";
				html += "</div>";
			}

		}
		var target = document.getElementById("member-info");
		if(target){
			target.insertAdjacentHTML('BeforeEnd', html);
		}
		/*备注信息*/
		if(record["member_remark"]){
			field = record["member_remark"];
			var remark = ""
			remark += "<h4>" + (field.display || "") + "</h4>";
			remark += "<div id='plot-chart-one' class='chart-placeholder'>" + tek.dataUtility.stringToHTML(field.show || '') + "</div>";
			
			$(".ui-chart").html(remark);
		}
	}
}

function editInfo(){
	var html = tek.common.getRootPath() + "http/takall/member/edit.html?member_id=" + member_id;
	html += "&show-close=1&refresh-opener=1";
	window.open(html);
}

function removeInfo(){
	if(!member_id){
        tek.macCommon.waitDialogShow(null, "未找到组员表标识", 1500 ,0);
        return;
    }

    var remove = window.confirm("确定删除组员?");
    if (!remove)
        return;

    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var setting = {operateType: "删除组员"};
    var sendData = {
        objectName: "Member",
        action: "removeInfo",
        member_id: member_id
    }

    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "组员删除成功!", 3000, 1);
          //  getGroupList();
        },
        error: function (data, message) {
            tek.macCommon.waitDialogShow(null, message);
        },
        complete: function () {
            tek.macCommon.waitDialogHide(1500);
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

function readUser(id){
	var setting = {async:false, operateType: "读取用户信息"};
	var sendData = {
		objectName: "User",
		action: "readInfo",
		user_id: id,
		icon: 1
	};
	var callback = {
		success: function (data) {
			var record = data["record"];

			if (record) {
				record = !!record.length ? record[0] : record;
				if(record.icon){
					ICON = record.icon
				}else{
					ICON = '';
				}
				
			} 
		},
		error: function (data, errorMsg) {
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


