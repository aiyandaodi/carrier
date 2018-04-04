var AjaxURL = tek.common.getRelativePath()+"servlet/tobject";
var params_obj = tek.common.getRequest();

var WRAP_ID = "country_form";

var ITEM = ["country_code","country_name","country_fullname","country_timezone","country_areacode","country_locale"];
//初始化
function init(){

	var sendData = {
		objectName : "Country",
		action : "getNew"
	}

	var parentId = WRAP_ID;

	tek.macEdit.getEdit(AjaxURL, sendData, ITEM, parentId);
	tek.macEdit.initialDefaultButton("country_btn");

	$("#submitBtn").attr("type","button").click(function(event){
		addNew();
		return false;
	});
}

tek.macEdit.customOperation = function(data, items, parent){
  tek.macEdit.defaultOperation(data, items, parent);

	$("#country_btn button[type='reset']").click(function(){
		resetForm();
	});
}

// 新建一条信息
function addNew(){
	var params=tek.common.getSerializeObjectParameters(WRAP_ID);
	params["objectName"] = "Country";
	params["action"] = "addInfo";
	console.group(params);
	// params["country_code"] = params_obj["country_code"];
	// params["state_locale"] = params_obj["country_locale"];
	tek.macEdit.editInfo(AjaxURL, params);
}
//重置
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
