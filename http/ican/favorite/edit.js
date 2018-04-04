var currentTag;
var currentColor;
//显示字段数组
var items = [
    "favorite_set_name",
    "favorite_set_tag",
    "favorite_set_color",
    "favorite_set_status",
    "favorite_set_remark"
	];

var favorite_set_id;  //机构编码标识
/**
* 初始化
*/
function init(){
	
	favorite_set_id = request["favorite_set_id"];
	
	if(favorite_set_id){
		editNew();
	}
	
	
}
//获得显示的字段
function editNew() {
    var params = {};
    params["objectName"] = "FavoriteSet";
    params["action"] = "getEdit";
    params["favorite_set_id"] = favorite_set_id;

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "favoriteSet_form");
	//初始化按钮
	tek.macEdit.initialDefaultButton("favoriteSet_btn");
	$("#submitBtn").attr("type","button").click(function(event){
		submitEdit();
		return false;
	});
}
tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);
	$("#favoriteSet_btn button[type='reset']").click(function(){
		resetForm();
	});
	
	
    //获取标签
    getTags(currentTag);
    //获取颜色
    getColors(currentColor);
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
        html += '<input type="hidden" class="form-control" name="' + fieldname + '" id="' + fieldname+ '" value="' + (field.value || '') + '" >'
            + '<input type="text" class="form-control dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="' + fieldname+ '-input" value="' + setWorksColor(field.show || '')+ '" placeholder="人生色彩">'
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

        currentTag = field.show;
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
//设置颜色值设置颜色名称
function setWorksColor(value){
    if(!value){
        return ;
    }
    var colorName = '';
    switch(value){
        case 'ff0000':
            colorName = '红色';
            break;
        case 'ff8000':
            colorName = '橙色';
            break;
        case 'ffff00':
            colorName = '黄色';
            break;
        case '00ff00':
            colorName = '绿色';
            break;
        case '00ffff':
            colorName = '青色';
            break;
        case '0000ff':
            colorName = '蓝色';
            break;
        case '8000ff':
            colorName = '紫色';
            break;
    }
    return colorName;
}

//提交修改信息
function submitEdit(){
    var mydata = tek.common.getSerializeObjectParameters("favoriteSet_form") || {};	//转为json

    mydata["objectName"] = "FavoriteSet";
    mydata["action"] = "setInfo";
    mydata["favorite_set_id"] = favorite_set_id;


    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}
