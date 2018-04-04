// JavaScript Document
//显示字段数组
var items = new Array("contact_name", "contact_color","contact_property", "contact_remark", "contact_default");
var objectId;
function init(){
	var objectId = request["object_id"];	//链接对象
	addNew();
	
}
function addNew(){
	var sendData={
		objectName: "Contact",
		action: "getNew"
	};
	if(objectId){
		sendData["contact_objectName"] = "Organization";
		sendData["contact_objectId"] = objectId;
	}else{
		sendData["contact_objectName"] = "User";
		sendData["contact_owner"] = myId;
	}
	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", sendData, items, "contact_form");
	tek.macEdit.initialDefaultButton("contact_btn");
	$("#submitBtn").attr("type","button").click(function(event){
		submitAdd();
		return false;
	});
}
tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);
	$("#contact_btn button[type='reset']").click(function(){
		resetForm();
	});
	
    /*$(document).on("focus", "#contact_catalogText", function() {
        getCatalog();
        $(this).blur();
        openCatalogModal();
    });
    //获取标签
    getTags();*/
    getColors();
}

tek.macEdit.appendCustomEditField = function(field, record){
    var html = "";
    if (!tek.type.isObject(field) || tek.type.isEmpty(field.name)){
        return html;
    }

    var fieldname = field.name;

    if(fieldname === "contact_color"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
            + tek.macEdit.appendNameField(field)
            + "<div class='col-xs-9'>";
        html += '<input type="hidden" class="form-control" name="' + fieldname + '" id="' + fieldname+ '" >'
            + '<input type="text" class="form-control dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="' + fieldname+ '-input" placeholder="人生色彩">'
            + '<ul class="dropdown-menu" id="contact-common-color-ul"  aria-labelledby="' + fieldname + '"></ul>'

        html += '</div></div>';

    }else if(fieldname == "contact_catalog"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<input type="text" class="form-control" id="' + field.name + 'Text" value="" placeholder="请输入' + field.display + '">';
        html += '<input type="hidden" id="' + field.name + '" name="' + field.name + '" />'
        html+='<font class = "red" id="'+field.name+'_text"></font> </div>';

        html+="</div>"

    }else if(fieldname == "contact_name"){
    	html += "<div id='" + fieldname + "-form-group' class='form-group'>"
	        + tek.macEdit.appendNameField(field)
	        + "<div class='col-xs-9'>";

	  	if(record.contact_owner){
	  		var field = record.contact_owner;    //域名
            var show = !!field.show ? tek.dataUtility.stringToInputHTML(field.show) : "";    //域显示值

            html += "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + show + "'/>";
  	
	  	}
	  	html += "</div></div>";
    }else if(fieldname === "contact_tags"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<div id="contact_tags" class="col-md-12" style="overflow:hidden">'
        + '<ul id="contact-common-tags-ul" class="col-md-12 radio-checkbox-ul"></ul>'
        + '</div>';

        html += "</div></div>";

        // html += "<div class='col-xs-2' id='organization_tags_text'>提示信息</div>";

        // 加上提示的text
    }else if(fieldname == "contact_property"){
    	html += "<div id='" + fieldname + "-form-group' class='form-group'>"
	        + tek.macEdit.appendNameField(field)
	        + "<div class='col-xs-9'>";

	    html += appendSingleField(field);
	    html += "</div></div>";
    }else{
        html = tek.macEdit.appendDefaultEditField(field, record);
    }

    return html;
}

//选择颜色
function selectedColor(name, value){
   $('#contact_color-input').val(name);
   $('#contact_color').val(value);
}


//提交新建
function submitAdd(){
	var setting = {operateType: "提交新建联系人信息"};
	var params = tek.common.getSerializeObjectParameters("contact_form");
	params["objectName"] = "Contact";
	params["action"] = "addInfo";

	if(objectId){
		params["contact_objectName"] = "Organization";
		params["contact_objectId"] = objectId;
	}else{
		params["contact_objectName"] = "User";
		params["contact_owner"] = myId;
	}
//	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", params);
	
	var callback = {
		beforeSend: function(){
			var msg = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在提交，请稍候!</p>";
			tek.macCommon.waitDialogShow(null, msg, null, 2);
		},
		success: function(data){
			if(data.code == 0){
				var value = data.value;
				if(value && value.length >= 11){
					tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + " 即将进入读取页面</p>", null, 2)
				}
				if (updateOpener == 1) {
                    // 刷新父页面
                    tek.refresh.refreshOpener(null, request["refresh-opener-func"]);
                }
				
				
                setTimeout(function () {


                    tek.macCommon.waitDialogHide();


                    var url = tek.common.appendURLParam("read.html", "contact_id", value.substr(11));
                   
                    location.href = url.toString();
                }, 2000);
			}
			
		},
		error: function (data, errorMsg) {
            $("#closeLogin").show();

            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        },
		complete: function(){
			//window.close();
		}
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
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
function appendSingleField(field) {
    var html = "";
    if (!field || !field.name)
        return html;

    var fieldname = field.name;    //域名
    var value = field.value;    //域值
    var selects = field.selects;
    var shows = field.shows;
    if (!selects || selects.length <= 0 || !shows || shows.length <= 0 || selects.length != shows.length)
        return html;

    for (var i = 0; i < selects.length; i++) {
        if (!selects[i] || selects[i].length <= 0 || !shows[i] || shows[i].length <= 0)
            continue;

        html += "<div class='col-xs-12' style=' overflow:hidden; padding:0px 5px'>"
            + "<input type='radio' class='col-xs-1' style='width:15%; float:left;' " + " id='" + fieldname + "-" + selects[i]
            + "' name='" + fieldname + "'" + " value='" + selects[i] + "'"
            + (selects[i] == value ? " checked='checked'" : "") + "/>"
            + "<label class='col-xs-11'  style='float:left;width:85%;text-align:left;overflow:hidden' for='" + fieldname + "-" + selects[i] + "'>"
            + shows[i]
            + "</label>"
            + "</div>";
    }

    return html;
};