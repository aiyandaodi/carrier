// JavaScript Document
var currentCatalog;
var currentTag;
//显示字段数组
var items = [
    "organization_code",
    "organization_name",
    "organization_person",
    "organization_leader",
    "organization_type",
	"organization_catalog",
	"organization_tags",
	"organization_url",
	"organization_remark",
	"organization_status"
	];

var organization_id;  //机构编码标识
/**
* 初始化
*/
function init(){
	
	organization_id = request["organization_id"];
	
	tek.macEdit.initialButton("btn");
	if(organization_id){
		editNew();
	}
	
	
}
//获得显示的字段
function editNew() {
    var params = {};
    params["objectName"] = "Organization";
    params["action"] = "getEdit";
    params["organization_id"] = organization_id;

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "organization_form");
	//初始化按钮
	tek.macEdit.initialDefaultButton("organization_btn");
	$("#submitBtn").attr("type","button").click(function(event){
		submitEdit();
		return false;
	});
}
tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);
	$("#organization_btn button[type='reset']").click(function(){
		resetForm();
	});
	
	getCatalog(currentCatalog);
    $(document).on("focus", "#organization_catalogText", function() {
        getCatalog();
        $(this).blur();
        openCatalogModal();
    });
    //获取标签
    getTags(currentTag);
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

        currentCatalog = field.value;
    }else if(fieldname === "organization_tags"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<div id="exams_library_tags" class="col-md-12" style="overflow:hidden">'
        + '<ul id="org-common-tags-ul" class="col-md-12 radio-checkbox-ul"></ul>'
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



//提交修改信息
function submitEdit(){
    var mydata = tek.common.getSerializeObjectParameters("organization_form") || {};	//转为json

    mydata["objectName"] = "Organization";
    mydata["action"] = "setInfo";
    mydata["organization_id"] = organization_id;

    /*var libraryEnd=mydata["exams_library_end"];
    if(libraryEnd){
        libraryEnd=decodeURIComponent(libraryEnd);
        mydata["exams_library_end"] = getLongDateByStringDate(libraryEnd);
    }*/

    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}
