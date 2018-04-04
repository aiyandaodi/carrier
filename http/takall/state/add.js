var AjaxURL = tek.common.getRelativePath()+"servlet/tobject";

var WRAP_ID = "state_form";

var ITEM = ["state_name","state_fullname","state_shortname","state_areacode","state_timezone"];

var COUNTRY_CODE;
var LOCALE_CODE;

function init(){
	
    COUNTRY_CODE=request["country_code"];
	LOCALE_CODE=request["country_locale"]
	var sendData = {
		objectName : "State",
		action : "getNew",
		country_code : COUNTRY_CODE,
        state_locale : LOCALE_CODE
	}

	var parentId = WRAP_ID;

	tek.macEdit.getEdit(AjaxURL, sendData, ITEM, parentId);
	tek.macEdit.initialDefaultButton("state_btn");

	$("#submitBtn").attr("type","button").click(function(event){
		addNew();
		return false;
	});
}

tek.macEdit.customOperation = function(data, items, parent){
  tek.macEdit.defaultOperation(data, items, parent);

	$("#state_btn button[type='reset']").click(function(){
		resetForm();
	});
}

// 新建一条信息
function addNew(){
	var params=tek.common.getSerializeObjectParameters(WRAP_ID);
	params["objectName"] = "State";
	params["action"] = "addInfo";
    params["country_code"] = COUNTRY_CODE;
	params["state_country"] = COUNTRY_CODE;
	params["state_locale"] = LOCALE_CODE;
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
