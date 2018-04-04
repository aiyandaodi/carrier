
// JavaScript Document
//=====================================================Parameter=============================
//显示字段数组
var items = new Array("member_name","member_user","member_mobile","member_email","member_subject_right","member_member_right","member_remark");
var member_id;
//=====================================================Function===============================
function init(){
    if(request["member_id"] && request["member_id"] != null)
        member_id = request["member_id"];

    if (member_id) {
        editNew(member_id);
    } else {
        tek.macCommon.waitDialogShow(null, "没有传入要编辑小组ID")
    }
}

//获得显示的字段
function editNew(member_id) {

    var params = {};
    params["objectName"] = "Member";
    params["action"] = "getEdit";
    params["member_id"] = member_id;

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "set_form");
}

//提交信息
function setNewInfo() {
    var mydata = tek.common.getSerializeObjectParameters("set_form") || {};	//转为json
    mydata["objectName"] = "Member";
    mydata["action"] = "setInfo";
    mydata["member_id"] = member_id;

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

function closePrompt(){
    window.open('read.html');
}