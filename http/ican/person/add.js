// JavaScript Document
//显示字段数组
var items = new Array("profile_name", "profile_describe", "profile_motto", "profile_sex","profile_birthdate", "profile_source", "profile_resident",
				 "profile_jobarea", "profile_tag", "profile_color", "profile_degree", "profile_mode", "profile_status","profile_remark");

function init(){
	
	getNew();

	initNoteCalender({
		type: "note",
		daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
		datestr: "",
		begin: "2010,1"
	});
}
function getNew(){
	var sendData = {
		objectName: "Profile",
		action: "getNew"
	};
	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", sendData, items, "profile_form");
	tek.macEdit.initialDefaultButton("profile_btn");
	$("#submitBtn").attr("type","button").click(function(event){
		submitAdd();
		return false;
	})
}
tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);
	$("#profile_btn button[type='reset']").click(function(){
		resetForm();
	});
	

    //获取标签
    getTags();
    //获取颜色分类
    getColors();
}

tek.macEdit.appendCustomEditField = function(field, record){
    var html = "";
    if (!tek.type.isObject(field) || tek.type.isEmpty(field.name)){
        return html;
    }

    var fieldname = field.name;
    if(fieldname === "profile_color"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
            + tek.macEdit.appendNameField(field)
            + "<div class='col-xs-9'>";
        html += '<input type="hidden" class="form-control" name="' + fieldname + '" id="' + fieldname+ '" >'
            + '<input type="text" class="form-control dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="' + fieldname+ '-input" placeholder="人生色彩">'
            + '<ul class="dropdown-menu" id="profile-common-color-ul"  aria-labelledby="' + fieldname + '"></ul>'

        html += '</div></div>';

    }else if(fieldname == "profile_name"){
    	html += "<div id='" + fieldname + "-form-group' class='form-group'>"
	        + tek.macEdit.appendNameField(field)
	        + "<div class='col-xs-9'>";

	  	if(record.profile_owner){
	  		var field = record.profile_owner;    //域名
            var show = !!field.show ? tek.dataUtility.stringToInputHTML(field.show) : "";    //域显示值

            html += "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + show + "'/>";
  	
	  	}
	  	html += "</div></div>";
    }else if(fieldname === "profile_tag"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<div id="profile_tag" class="col-md-12" style="overflow:hidden">'
        + '<ul id="profile-common-tags-ul" class="col-md-12 radio-checkbox-ul"></ul>'
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
   $('#profile_color-input').val(name);
   $('#profile_color').val(value);
}


function submitAdd(){
	var params = tek.common.getSerializeObjectParameters("profile_form");
	params["objectName"] = "Profile";
	params["action"] = "addInfo";

	//转换时间格式
	var profileBirth=params["profile_birthdate"];
    if(profileBirth){
        profileBirth=decodeURIComponent(profileBirth);
        params["profile_birthdate"] = getLongDateByStringDate(profileBirth);
    }
	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", params);
}

function closePrompt(){
	closeMessage();
}

//日期类型转换
function getLongDateByStringDate(stringDate){
	var newStringDate = stringDate;
	if(newStringDate){
		if(newStringDate.indexOf("+") > 0)
			newStringDate = replaceMyString(newStringDate,"+"," ");
		newStringDate = replaceMyString(newStringDate,"-","/");
		if(newStringDate){
			if(newStringDate.indexOf(":") <= 0)
				newStringDate += " 00:00:00"
		}else{
			newStringDate = stringDate;
		}
	}
	
	var dateDate = new Date(newStringDate);
	return dateDate.getTime();
}

//字符串替换
function replaceMyString(str,oldStr,newStr){
	var ns = str;
	if(str){
		do{
			ns = ns.replace(oldStr,newStr);
		}while(ns.indexOf(oldStr) > -1);
	}
	return ns;
}