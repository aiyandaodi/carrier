var AjaxURL = tek.common.getRelativePath()+"servlet/tobject";

var WRAP_ID = "state_form";

// var ITEM = ["state_name","state_shortname","state_timezone","state_areacode"];
var ITEM = ["state_name","state_fullname","state_shortname","state_areacode","state_timezone"];
var STATE_CODE;
var LOCALE_CODE;

function init(){
	//先判断登录（有些页面不需要判断）
	// if (!tek.common.isLoggedIn()) {
  //   showMsg("请先登录","goLogin()");
  //   return;
	// }
    STATE_CODE=request["state_code"];
	LOCALE_CODE=request["state_locale"]
	var sendData = {
		objectName : "State",
		action : "getEdit",
		state_code : STATE_CODE,
        state_locale : LOCALE_CODE
	}

	var parentId = WRAP_ID;

	tek.macEdit.getEdit(AjaxURL, sendData, ITEM, parentId);
	tek.macEdit.initialDefaultButton("state_btn");

	$("#submitBtn").attr("type","button").click(function(event){
		setNew();
		return false;
	});
}

tek.macEdit.customOperation = function(data, items, parent){
  tek.macEdit.defaultOperation(data, items, parent);

	$("#state_btn button[type='reset']").click(function(){
		resetForm();
	});
}

// 修改信息
function setNew(){
	var params=tek.common.getSerializeObjectParameters(WRAP_ID);
	params["objectName"] = "State";
	params["action"] = "setInfo";
    params["state_code"] = STATE_CODE;
	/*params["state_country"] = COUNTRY_CODE;
	params["state_locale"] = LOCALE_CODE;*/
	tek.macEdit.editInfo(AjaxURL, params);
}

function resetForm(){
	var input_sum = ITEM.length;
	var temp_type = "";
	var temp_input = "";
	for(i = 0; i < input_sum; i++){
		temp_input = $("#" + ITEM[i]);
		temp_type = temp_input.attr("type");
		// temp_type;
		if(temp_type === "text"){
			temp_input.val("");
		}

	}
}
