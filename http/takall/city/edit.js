
var AjaxURL = tek.common.getRelativePath()+"servlet/tobject";
var params_obj = tek.common.getRequest();

var WRAP_ID = "city_form";

var ITEM = ["city_name","city_fullname"];

function init(){
	//先判断登录（有些页面不需要判断）
	// if (!tek.common.isLoggedIn()) {
  //   showMsg("请先登录","goLogin()");
  //   return;
	// }

	var sendData = {
		objectName : "City",
		action : "getEdit",
		city_code : params_obj["city_code"],
		city_locale : params_obj["city_locale"]
	}

	var parentId = WRAP_ID;

	tek.macEdit.getEdit(AjaxURL, sendData, ITEM, parentId);
	tek.macEdit.initialDefaultButton("city_btn");

	$("#submitBtn").attr("type","button").click(function(event){
		addNew();
		return false;
	});
}

tek.macEdit.customOperation = function(data, items, parent){
  tek.macEdit.defaultOperation(data, items, parent);
	$("#city_btn button[type='reset']").click(function(){
		resetForm();
	});
}

// 新建一条信息
function addNew(){
	var params=tek.common.getSerializeObjectParameters(WRAP_ID);
	params["objectName"] = "City";
	params["action"] = "setInfo";
	params["city_code"] = params_obj["city_code"];
//	params["city_locale"] = params_obj["city_locale"];

	tek.macEdit.editInfo(AjaxURL, params);
}

function resetForm(){
	var input_sum = ITEM.length;
	var temp_type = "";
	var temp_input = "";
	for(i = 0; i < input_sum; i++){
		temp_input = $("#" + ITEM[i]);
		temp_type = temp_input.attr("type");

		if(temp_type === "text"){
			temp_input.val("");
		}
	}
}
