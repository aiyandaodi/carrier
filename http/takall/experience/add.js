
var AjaxURL = tek.common.getRelativePath()+"servlet/tobject";
var params_obj = tek.common.getRequest();

var WRAP_ID = "experience_form";

var ITEM = ["experience_code","experience_name","experience_fullname"];

function init(){
	
	/* Date picker */
    $('#experience_start').datetimepicker({
      pickTime: false
    });

    $('#experience_end').datetimepicker({
      	pickTime: false
    });
   	
   	/*点击li，给input赋值*/
   	$('.dropdown-menu li').each(function(){
   		$(this).click(function(){
   			var html = $(this).children('strong').html();
   			$('#experience_color').val(html);
   		})
   	})
	
/*
	//先判断登录（有些页面不需要判断）
	// if (!tek.common.isLoggedIn()) {
  //   showMsg("请先登录","goLogin()");
  //   return;
	// }

	var sendData = {
		objectName : "City",
		action : "getNew",
		state_code : params_obj["state_code"],
		experience_locale : params_obj["state_locale"]
	}

	var parentId = WRAP_ID;

	tek.macEdit.getEdit(AjaxURL, sendData, ITEM, parentId);
	tek.macEdit.initialDefaultButton("experience_btn");

	$("#submitBtn").attr("type","button").click(function(event){
		addNew();
		return false;
	});*/
}

tek.macEdit.customOperation = function(data, items, parent){
  tek.macEdit.defaultOperation(data, items, parent);
	$("#experience_btn button[type='reset']").click(function(){
		resetForm();
	});
}

// 新建一条信息
function addNew(){
	var params=tek.common.getSerializeObjectParameters(WRAP_ID);
	params["objectName"] = "City";
	params["action"] = "addInfo";
	params["state_code"] = params_obj["state_code"];
	params["experience_locale"] = params_obj["state_locale"];

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

