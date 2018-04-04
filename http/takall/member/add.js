
// JavaScript Document
//=====================================================Parameter==============================
//显示字段数组
var items = new Array("member_name","member_user","member_mobile","member_email",
					  "member_status","member_subject_right","member_member_right","member_remark");
var group_id;
//=====================================================Function===============================
function init(){
    if(request["group_id"] && request["group_id"] != null)
        group_id = request["group_id"];

    if (group_id) {
        addNew();
    } else {
        tek.macCommon.waitDialogShow(null, "没有传入小组ID")
    }
}

//获得显示的字段
function addNew() {
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var params = {};
    params["objectName"] = "Member";
    params["action"] = "getNew";

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "add_form");
}


function submitAdd(){
    var mydata = tek.common.getSerializeObjectParameters("add_form") || {};	//转为json

    mydata["objectName"] = "Member";
    mydata["action"] = "addInfo";
    mydata["group_id"] = group_id;

    if($("#member_user").val())
        mydata["member_user"] = $("#member_user").val();

    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}

//取得fieldname字段的对象列表信息的ajax调用参数
tek.macEdit.getObjectOptionParam = function (fieldname) {
    var params = {};
    params["objectName"] = "User";
    params["action"] = "getList";
    params["condition"] = "user_security>=16";

    return params;
}


