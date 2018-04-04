// JavaScript Document
//显示字段数组
var items = new Array("organization_code", "organization_name", "organization_person", "organization_leader","organization_type", "organization_catalog", "organization_tags", "organization_country", "organization_state", "organization_city", "organization_street", "organization_url","organization_status", "organization_remark");

function init(){
	addNew();
	
	
	$(document).on("focus", "#organization_catalogText", function() {
        getCatalog();
        $(this).blur();
        openCatalogModal();
    });
}
function addNew(){
	var setting = {operateType: "获取机构新建域"}

	var sendData={
		objectName: "Organization",
		action: "getNew"
	};
	var callback = {
		beforeSend: function(){
			$("#organization_form").html("<div class='admin-form center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function(data){
			var record = data["record"];
			if(record){
				record = !record.length ? record: record[0];
				showOrganizationContent(record);
			}else{
				$("#organization_form").html("<div class='admin-form center'><h3 class='title'>没有可编辑的字段！</h3></div>")
			}
		},
		error: function(data, errorMsg){
			$("#organization_form").html(errorMsg);
		},
		complete: function(){
			//获取标签分类
			getTags();
			//获取目录分类
			 getCatalog();
		}
	}

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
//	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", sendData, items, "organization_form");
}

//显示内容
function showOrganizationContent(record){
	if(!record){
		return ;
	}
	var html = '';
	var field;

	html += '<div class="pull-left">'
		+ '<h5>基本信息</h5>'
		+ '<div class="bor bg-success"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>';

	//机构名称
	if(record.organization_name){
		field = record.organization_name;
		html += '<div class="form-group">'
			+ '<label class="col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="'+ field.name +'" placeholder="机构名称">'
			+ '</div>'
			+ '</div>';
	}
	//机构编码
	if(record.organization_code){
		field = record.organization_code;
		html += '<div class="form-group">'
			+ '<label class="col-sm-4 col-xs-12 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="'+ field.name +'" placeholder="机构编码">'
			+ '</div>'
			+ '</div>';
	}
	//法人代表
	if(record.organization_person){
		field = record.organization_person;
		html += '<div class="form-group">'
			+ '<label class="col-sm-4 col-xs-12 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="'+ field.name +'" placeholder="法人代表">'
			+ '</div>'
			+ '</div>';
	}
	// 机构负责人
	if(record.organization_leader){
		field = record.organization_leader;
		html += '<div class="form-group">'
			+ '<label class="col-sm-4 col-xs-12 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="'+ field.name +'" placeholder="机构负责人">'
			+ '</div>'
			+ '</div>';
	}
	html += '<hr />'
		+ '<div class="pull-left">'
		+ '<h5>机构类别</h5>'
		+ '<div class="bor bg-space"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>';
	
	//机构类别
	if(record.organization_type){
		field = record.organization_type;
		html += '<div class="form-group">'
			+ '<label for="item_' + field.name + '" class="col-sm-4 col-xs-12 control-label">' + field.display + '</label>'
			+ '<div class="col-sm-8">';
		
		var fieldname = field.name;    //域名
        var value = field.value;    //域值
		var selects = field.selects;
		var shows = field.shows;
		if (!selects || selects.length <= 0 || !shows || shows.length <= 0 || selects.length != shows.length)
			return html;

		for (var i = 0; i < selects.length; i++) {
			if (!selects[i] || selects[i].length <= 0 || !shows[i] || shows[i].length <= 0)
				continue;

			html += "<div class='col-sm-4 col-xs-6' style=' overflow:hidden; padding:0px 5px'>"
				+ "<input type='radio' " + " id='" + fieldname + "-" + selects[i]
				+ "' name='" + fieldname + "'" + " value='" + selects[i] + "'"
				+ (selects[i] == value ? " checked='checked'" : "") + "/>"
				+ "<label text-align:left;overflow:hidden' for='" + fieldname + "-" + selects[i] + "'>"
				+ shows[i]
				+ "</label>"
				+ "</div>";
		}
		html += "</div>"
			+ "</div>";
	}
	//机构目录分类
	if(record.organization_catalog){
		field = record.organization_catalog;
		html += '<div class="form-group" id="organizationCatalog">'
			+ '<label for="item_' + field.name + '" class="col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input name="' + field.name + 'Text" id="' + field.name + 'Text" class="form-control" type="text" placeholder="目录分类" />'
			+ '<input name="' + field.name + '" id="' + field.name + '" type="hidden" value="' + (field.value || "") + '" />'
			+ '</div>'
			+ '</div>';
	}
	//标签分类
	if(record.organization_tags){
		field = record.organization_tags;
		html += '<div class="form-group">'
			+ '<label for="item_' + field.name + '" class="col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="col-sm-8"><ul id="org-common-tags-ul" class="col-md-12 radio-checkbox-ul">'
			+ '<li></li>'
			+ '</ul></div>'
			+ '</div>';
	}
	//机构状态
	if(record.organization_status){
		field = record.organization_status;
		
		
		html += '<div class="form-group" id="organization_status_form">'
			+ '<label for="item_' + field.name + '" class=" col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="col-sm-8">';
		
		var fieldname = field.name;    //域名
        var value = field.value;    //域值
		var selects = field.selects;
		var shows = field.shows;
		if (!selects || selects.length <= 0 || !shows || shows.length <= 0 || selects.length != shows.length)
			return html;

		for (var i = 0; i < selects.length; i++) {
			if (!selects[i] || selects[i].length <= 0 || !shows[i] || shows[i].length <= 0)
				continue;

			html += "<div class='col-sm-4 col-xs-6' style=' overflow:hidden; padding:0px 5px'>"
				+ "<input type='radio' " + " id='" + fieldname + "-" + selects[i]
				+ "' name='" + fieldname + "'" + " value='" + selects[i] + "'"
				+ (selects[i] == value ? " checked='checked'" : "") + "/>"
				+ "<label text-align:left;overflow:hidden' for='" + fieldname + "-" + selects[i] + "'>"
				+ shows[i]
				+ "</label>"
				+ "</div>";
		}
		html += "</div></div>";
	}
	html += '<hr/>'
		+ '<div class="pull-left">'
		+ '<h5>注册地址</h5>'
		+ '<div class="bor bg-orange"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>'

	//国家/地区
	if(record.organization_country){
		field = record.organization_country;
		html += '<div class="form-group">'
			+ '<label for="item_' + field.name + '" class="col-sm-4 control-label">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ tek.macEdit.appendSelectField(field)
			+ '</div>'
			+ '</div>'
	}
	// 省/直辖市
	if(record.organization_state){
		field = record.organization_state;
		html += '<div class="form-group">'
			+ '<label class="col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="'+ field.name +'" placeholder="省/直辖市">'
			+ '</div>'
			+ '</div>';
	}
	// 市/县/区
	if(record.organization_city){
		field = record.organization_city;
		html += '<div class="form-group">'
			+ '<label class="col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="'+ field.name +'" placeholder="市/县/区">'
			+ '</div>'
			+ '</div>';
	}
	// 地址
	if(record.organization_street){
		field = record.organization_street;
		html += '<div class="form-group">'
			+ '<label class="col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="'+ field.name +'" placeholder="地址">'
			+ '</div>'
			+ '</div>';
	}
	html += '<hr/>'
		+ '<div class="pull-left">'
		+ '<h5>机构介绍</h5>'
		+ '<div class="bor bg-main"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>';
	// 地址
	if(record.organization_url){
		field = record.organization_url;
		html += '<div class="form-group">'
			+ '<label class="col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="'+ field.name +'" placeholder="机构网址">'
			+ '</div>'
			+ '</div>';
	}
	// 机构说明
	if(record.organization_remark){
		field = record.organization_remark;
		html += '<div class="form-group">'
			+ '<label class="col-sm-4 control-label" for="item_' + field.name + '">' + field.display + '</label>'
			+ '<div class="col-sm-8">'
			+ '<input type="text" class="form-control" name="' + field.name + '" id="'+ field.name +'" placeholder="机构简介">'
			+ '</div>'
			+ '</div>';
	}
	

	$("#organization_form").html(html);
}

//提交新建
function submitAdd(){
	var params = tek.common.getSerializeObjectParameters("organization_form");
	params["objectName"] = "Organization";
	params["action"] = "addInfo";
	console.log(params)
	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", params);
}