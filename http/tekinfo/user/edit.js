// JavaScript Document
/**************************************************
 *    编辑用户 edit.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================

//显示字段数组
var items = new Array("user_code", "user_name", "user_sex", "user_birthday", "user_security", "user_status", "user_start", "user_end", "user_role", "user_file", "user_remark");
var user_id;  //获取用户id

/**
 * 初始化
 */
function init(){
	$("#my_icon").html("");
	user_id=request["user_id"];

	tek.macEdit.initialButton("btn");
	editNew(user_id);

	//日历初始化
	initNoteCalender( {
		type: "note",
		daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
		datestr: "",
		begin: "1900,1"
	} );
}
//=====================================================Function===============================
//获得显示的字段
function editNew() {
	var params = {};
	params["objectName"] = "User";
	params["action"] = "getEdit";
	params["user_id"] = user_id;

	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "edit-info");
}

//自定义编辑页面输入框
tek.macEdit.customOperation = function (data, items, parent) {
	tek.macEdit.defaultOperation(data, items, parent);

	$("#user_status").change(function () {
		changeStatus();
	});
	changeStatus();
};

//改变状态
function changeStatus() {
	if ($("#user_status").val() == 1) {
		$("#user_start-form-group").addClass("hidden");
		$("#user_end-form-group").addClass("hidden");
	} else {
		$("#user_start-form-group").removeClass("hidden");
		$("#user_end-form-group").removeClass("hidden");
	}
}

//修改数据提交
function commitInfo() {
	$("#waiting-modal-dialog").modal("show", null, 2);

	var mydata = tek.common.getSerializeObjectParameters("edit_form") || {};	//转为json

	var userBirthday = mydata["user_birthday"];
	if (userBirthday) {
		userBirthday = decodeURIComponent(userBirthday);
		var birthday_year = userBirthday.substring(0, 4);
		var birthday_month = userBirthday.substring(5, 7);
		var birthday_day = userBirthday.substring(8, 10);
		var birthday = birthday_year + "/" + birthday_month + "/" + birthday_day + " 00:00:00";
		mydata["user_birthday"] = new Date(birthday).getTime();
	}
	var userStart = mydata["user_start"];
	if (userStart) {
		userStart = decodeURIComponent(userStart);
		var start_year = userStart.substring(0, 4);
		var start_month = userStart.substring(5, 7);
		var start_day = userStart.substring(8, 10);
		var start = start_year + "/" + start_month + "/" + start_day + " 00:00:00";
		mydata["user_start"] = new Date(start).getTime();
	}
	var userEnd = mydata["user_end"];
	if (userEnd) {
		userEnd = decodeURIComponent(userEnd);
		var end_year = userEnd.substring(0, 4);
		var end_month = userEnd.substring(5, 7);
		var end_day = userEnd.substring(8, 10);
		var end = end_year + "/" + end_month + "/" + end_day + " 00:00:00";
		mydata["user_end"] = new Date(end).getTime();
	}

    var userRole = mydata["user_role"];
    if (userRole) {
        var arr=tek.dataUtility.stringToArray(userRole, ";");
        userRole=0;
        if(arr && arr.length>0){
        	for (var i in arr)
        		userRole |= parseInt(arr[i]);
		}
        mydata["user_role"] = userRole;
    }

    mydata["objectName"] = "User";
	mydata["action"] = "setInfo";
	mydata["user_id"] = user_id;

	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}
//-----------------------------------------------------End------------------------------------->>>>>>> .r40
