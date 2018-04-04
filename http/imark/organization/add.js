// JavaScript Document
//显示字段数组
var items = new Array("organization_code", "organization_name", "organization_person", "organization_leader","organization_type", "organization_catalog", "organization_tags", "organization_country", "organization_state", "organization_city", "organization_street", "organization_url","organization_status", "organization_remark");

function init(){
	addNew();
	
}
function addNew(){
	var sendData={
		objectName: "Organization",
		action: "getNew"
	};
	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", sendData, items, "organization_form");
	tek.macEdit.initialDefaultButton("organization_btn");
	$("#submitBtn").attr("type","button").click(function(event){
		submitAdd();
		return false;
	});
}
tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);
	$("#organization_btn button[type='reset']").click(function(){
		resetForm();
	});
	
    $(document).on("focus", "#organization_catalogText", function() {
        getCatalog();
        $(this).blur();
        openCatalogModal();
    });
    //获取标签
    getTags();
}

tek.macEdit.appendCustomEditField = function(field, record){
    var html = "";
    if (!tek.type.isObject(field) || tek.type.isEmpty(field.name)){
        return html;
    }

    var fieldname = field.name;

    if(fieldname == "organization_catalog"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<input type="text" class="form-control" id="' + field.name + 'Text" value="" placeholder="请输入' + field.display + '">';
        html += '<input type="hidden" id="' + field.name + '" name="' + field.name + '" />'
        html+='<font class = "red" id="'+field.name+'_text"></font> </div>';

        html+="</div>"

    }else if(fieldname === "organization_tags"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<div id="organization_tags" class="col-md-12" style="overflow:hidden">'
        + '<ul id="org-common-tags-ul" class="col-md-12 radio-checkbox-ul"></ul>'
        + '</div>';

        html += "</div></div>";

        // html += "<div class='col-xs-2' id='organization_tags_text'>提示信息</div>";

        // 加上提示的text
    }else{
        html = tek.macEdit.appendDefaultEditField(field, record);
    }

    return html;
}



//提交新建
function submitAdd(){
	var params = tek.common.getSerializeObjectParameters("organization_form");
	params["objectName"] = "Organization";
	params["action"] = "addInfo";
	console.log(params)
	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", params);
}

//重置
function resetForm(){
	var input_sum = items.length;
	var temp_type = "";
	var temp_input = "";
	for(i = 0; i < input_sum; i++){
		temp_input = $("#" + items[i]);
		temp_type = temp_input.attr("type");
		// temp_type;
		if(temp_type === "text"){
			temp_input.val("");
		}

	}
}