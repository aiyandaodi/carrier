// JavaScript Document
//显示字段数组
var items = new Array("favorite_set_name", "favorite_set_tag", "favorite_set_color", "favorite_set_status","favorite_set_remark");

function init(){
	addNew();
	
}
function addNew(){
	var sendData={
		objectName: "FavoriteSet",
		action: "getNew",
		favorite_set_owner: myId
	};
	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", sendData, items, "favoriteSet_form");
	tek.macEdit.initialDefaultButton("favoriteSet_btn");
	$("#submitBtn").attr("type","button").click(function(event){
		submitAdd();
		return false;
	});
}
tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);
	$("#favoriteSet_btn button[type='reset']").click(function(){
		resetForm();
	});
	
    
    //获取标签
    getTags();
    //获取颜色
    getColors();
}

tek.macEdit.appendCustomEditField = function(field, record){
    var html = "";
    if (!tek.type.isObject(field) || tek.type.isEmpty(field.name)){
        return html;
    }

    var fieldname = field.name;

    if(fieldname === "favorite_set_color"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
            + tek.macEdit.appendNameField(field)
            + "<div class='col-xs-9'>";
        html += '<input type="hidden" class="form-control" name="' + fieldname + '" id="' + fieldname+ '" >'
            + '<input type="text" class="form-control dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="' + fieldname+ '-input" placeholder="人生色彩">'
            + '<ul class="dropdown-menu" id="favoriteSet-common-color-ul"  aria-labelledby="' + fieldname + '"></ul>'

        html += '</div></div>';

    }else if(fieldname === "favorite_set_tag"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<div id="favorite_set_tag" class="col-md-12" style="overflow:hidden">'
        + '<ul id="favorite_set-common-tags-ul" class="col-md-12 radio-checkbox-ul"></ul>'
        + '</div>';

        html += "</div></div>";

        // html += "<div class='col-xs-2' id='organization_tags_text'>提示信息</div>";

        // 加上提示的text


    }else{
        html = tek.macEdit.appendDefaultEditField(field, record);
    }
    return html;
}

//选择颜色
function selectedColor(name, value){
   $('#favorite_set_color-input').val(name);
   $('#favorite_set_color').val(value);
}

//提交新建
function submitAdd(){
	var params = tek.common.getSerializeObjectParameters("favoriteSet_form");
	params["objectName"] = "FavoriteSet";
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