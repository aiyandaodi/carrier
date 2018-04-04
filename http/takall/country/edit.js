var AjaxURL = tek.common.getRelativePath()+"servlet/tobject";
var params_obj = tek.common.getRequest();

var WRAP_ID = "country_form";

var ITEM = ["country_code","country_name","country_fullname","country_timezone","country_areacode","country_locale"];

function init(){
	
	var sendData = {
		objectName : "Country",
		action : "getEdit",
	    country_code : params_obj["country_code"],
	    country_locale : params_obj["country_locale"]
	}

	var parentId = WRAP_ID;

	tek.macEdit.getEdit(AjaxURL, sendData, ITEM, parentId);
	tek.macEdit.initialDefaultButton("country_btn");

	$("#submitBtn").attr("type","button").click(function(event){
		setNew();
		return false;
	});
}

tek.macEdit.customOperation = function(data, items, parent){
  tek.macEdit.defaultOperation(data, items, parent);

	$("#org_btn button[type='reset']").click(function(){
		resetForm();
	});
}

// 修改信息
function setNew(){
	var params=tek.common.getSerializeObjectParameters(WRAP_ID);
	params["objectName"] = "Country";
	params["action"] = "setInfo";
  params["country_code"] = params_obj["country_code"];

	console.group(params);
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
