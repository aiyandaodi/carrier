/**
 * Created by zhkj on 2017/3/15.
 */
// JavaScript Document
//=====================================================Parameter=============================
//显示字段数组
var items = new Array("group_code", "group_name", "group_status", "group_speak", "group_listen", "group_join", "group_member_memberright", "group_remark", "group_blob", "group_qrcode");
var group_id;
//=====================================================Function===============================
function init(){
    if(request["group_id"] && request["group_id"] != null)
        group_id = request["group_id"];

    if (group_id) {
        editNew(group_id);
    } else {
        tek.macCommon.waitDialogShow(null, "没有传入要编辑小组ID")
    }
}

//获得显示的字段
function editNew(group_id) {

    var params = {};
    params["objectName"] = "Group";
    params["action"] = "getEdit";
    params["group_id"] = group_id;

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "set_form");
}

//提交信息
function setNewInfo() {
    var mydata = tek.common.getSerializeObjectParameters("set_form") || {};	//转为json
    mydata["objectName"] = "Group";
    mydata["action"] = "setInfo";
    mydata["group_id"] = group_id;

    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}

function closePrompt(){
    window.open('read.html');
}