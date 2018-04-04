// JavaScript Document
var currentTag;
var currentColor;
//显示字段数组
var items = [
    "profile_name",
    "profile_describe",
    "profile_motto",
    "profile_sex",
    "profile_birthdate",
	"profile_source",
	"profile_resident",
	"profile_jobarea",
	"profile_tag",
	"profile_color",
	"profile_degree",
	"profile_mode",
	"profile_status",
	"profile_remark"
	];

var profile_id;  //个人信息标识

function init(){
	profile_id = request["profile_id"];
	
	if(profile_id){
		getEditInfo();
	}
	/*初始化日历*/
	initNoteCalender({
		type: "note",
		daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
		datestr: "",
		begin: "2010,1"
	});
}
function getEditInfo(){
	var params = {
		objectName: "Profile",
		action: "getEdit",
		profile_id: profile_id
	}

	tek.macEdit.getEdit(tek.common.getRootPath()+ "servlet/tobject", params, items, "profile_form");
	//初始化按钮
	tek.macEdit.initialDefaultButton("profile_btn");
	$("#submitBtn").attr("type","button").click(function(event){
		submitEdit();
		return false;
	})
}
tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);
	$("#profile_btn button[type='reset']").click(function(){
		resetForm();
	});
	
    //获取标签
    getTags(currentTag);
    //获取颜色分类
    getColors(currentColor);
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
        html += '<input type="hidden" class="form-control" name="' + fieldname + '" id="' + fieldname+ '" value="' + (field.value || '') + '" >'
            + '<input type="text" class="form-control dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="' + fieldname+ '-input" value="' + setWorksColor(field.show || '')+ '" placeholder="人生色彩">'
            + '<ul class="dropdown-menu" id="profile-common-color-ul"  aria-labelledby="' + fieldname + '"></ul>'

        html += '</div></div>';

    }else if(fieldname === "profile_tag"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<div id="profile_tag" class="col-md-12" style="overflow:hidden">'
        + '<ul id="profile-common-tags-ul" class="col-md-12 radio-checkbox-ul"></ul>'
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
   $('#profile_color-input').val(name);
   $('#profile_color').val(value);
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

function submitEdit(){
	var mydata = tek.common.getSerializeObjectParameters("profile_form") || {};	//转为json

    mydata["objectName"] = "Profile";
    mydata["action"] = "setInfo";
    mydata["profile_id"] = profile_id;
	
 	//转换时间格式
	var profileBirth=mydata["profile_birthdate"];
    if(profileBirth){
        profileBirth=decodeURIComponent(profileBirth);
        mydata["profile_birthdate"] = getLongDateByStringDate(profileBirth);
    }
    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
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
