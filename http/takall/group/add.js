/**
 * Created by zhengqianqian on 2017/6/3.
 */
// JavaScript Document
//=====================================================Parameter==============================
//显示字段数组
var items = new Array("group_code", "group_name", "group_status", "group_speak", "group_listen", "group_join", "group_member_memberright", "group_remark", "group_blob", "group_qrcode");
//=====================================================Function===============================
function init(){
    addNew();

}

//获得显示的字段
function addNew() {
    var params = {};
    params["objectName"] = "Group";
    params["action"] = "getNew";

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "organization_form");
}

function promptAdd(){
    var str='<a href="javascript:submitAdd();" class="btn btn-success">确认</a>'
        + '&nbsp;&nbsp;'
        + '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';

    showMessage(str);
}

//提交小组信息
function submitAdd(){
    var mydata = tek.common.getSerializeObjectParameters("organization_form") || {};	//转为json

    mydata["objectName"] = "Group";
    mydata["action"] = "addInfo";

    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}


