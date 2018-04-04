// JavaScript Document
/**************************************************
 *    编辑字典页面 index.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
//显示字段数组
var items = [
    "dictionary_code",
    "dictionary_original",
    "dictionary_language",
    "dictionary_name",
    "dictionary_targetObject",
    "dictionary_targetFields",
    "dictionary_property"];


var dictionary_id;  //获取字典记录id
 
/**
* 初始化
*/
function init(){
	
	dictionary_id=request["dictionary_id"];
	
	//判断是否登录
	if (tek.common.isLoggedIn()) {
		tek.macEdit.initialButton("btn");
		editNew(dictionary_id); 
	} else {
		//提示 并 跳转登录
		goLogin();
	}
}
//获得显示的字段
function editNew(dictionary_id) {
    var params = {};
    params["objectName"] = "ObjectDictionary";
    params["action"] = "getEdit";
    params["dictionary_id"] = dictionary_id;

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "set-info");
}


//提交信息
function setNewInfo(dictionary_id) {
    var sendData = tek.common.getSerializeObjectParameters("set_form") || {};	//转为json
    sendData["objectName"] = "ObjectDictionary";
    sendData["action"] = "setInfo";
    sendData["dictionary_id"] = dictionary_id;
/*
    var original = sendData["dictionary_original"];
    if (original && original.indexOf("0x") == 0) {
        var num = parseInt(original);
        sendData["dictionary_original"] = num;
    }
*/

    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);
}


//-----------------------------------------------------------------------------------
// 执行页面自定义的初始化按钮函数  --mac-edit.js中调用
tek.macEdit.initialCustomButton = function (parentId) {
    var html = "<button type='submit' id='submitBtn' class='btn btn-danger col-xs-3'>提交</button>";

    if (showClose == 1) {
        //显示关闭按钮
        html += "<button type='button' id='closeBtn' class='btn btn-info col-xs-3' onclick='tek.common.closeWithConfirm();'>关闭</button>";
    } else if (callbackURL) {
        //显示返回按钮
        html += "<button type='button' id='callbackBtn' class='btn btn-success col-xs-3' onclick='tek.common.callbackWithConfirm(callbackURL)'>返回</button>";
    } else {
        // 显示“提交”、“重置”
        html += "<button type='reset' class='btn btn-success col-xs-3'>重置</button>";
    }

    $("#" + parentId).html(html);
};


//-----------------------------------------------------End-------------------------------------
