// JavaScript Document
//=====================================================Parameter==============================
//显示字段数组
var items = new Array("exams_library_code","exams_library_name","exams_library_grade","exams_library_tags","exams_library_catalog","exams_library_read","exams_library_write","exams_library_end");
var group_id;
//=====================================================Function===============================
function init(){
    if(request["group_id"] && request["group_id"] != null)
        group_id = request["group_id"];

    if (group_id) {
        addNew();
    } else {
        tek.macCommon.waitDialogShow(null, "没有传入小组ID")
    }

    /*加载时间控件*/
	initNoteCalender( {
		type: "note",
		daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
		datestr: "",
		begin: "2010,1"
	});

}

//获得显示的字段
function addNew() {
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var params = {};
    params["objectName"] = "ExamsLibrary";
    params["action"] = "getNew";

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "add_form");
}

tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);

    $(document).on("focus", "#exams_library_catalogText", function() {
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

    if(fieldname == "exams_library_catalog"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<input type="text" class="form-control" id="' + field.name + 'Text" value="" placeholder="请输入' + field.display + '">';
        html += '<input type="hidden" id="' + field.name + '" name="' + field.name + '" />'
        html+='<font class = "red" id="'+field.name+'_text"></font> </div>';

        html+="</div>"

    }else if(fieldname === "exams_library_tags"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<div id="exams_library_tags" class="col-md-12" style="overflow:hidden">'
        + '<ul id="lib-common-tags-ul" class="col-md-12 radio-checkbox-ul"></ul>'
        + '</div>';

        html += "</div></div>";

        // html += "<div class='col-xs-2' id='organization_tags_text'>提示信息</div>";

        // 加上提示的text
    }else{
        html = tek.macEdit.appendDefaultEditField(field, record);
    }

    return html;
}

//提交题库信息
function submitEdit(){
    var setting = {operateType: "新增题库"};
    
    var mydata = tek.common.getSerializeObjectParameters("add_form") || {};	//转为json

    mydata["objectName"] = "ExamsLibrary";
    mydata["action"] = "addInfo";
    mydata["group_id"] = group_id;

    var libraryEnd=mydata["exams_library_end"];
    if(libraryEnd){
        libraryEnd=decodeURIComponent(libraryEnd);
        mydata["exams_library_end"] = getLongDateByStringDate(libraryEnd);
    }

    var callback = {
        beforeSend:function(){
            var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在提交...";
            tek.macCommon.waitDialogShow(null, html, null, 2);
        },
        success: function (data) {
            tek.macCommon.waitDialogShow(null, data.message, null, 1);
			setTimeout(function(){
				window.close();
			},1500)
        },
        error: function (data, message) {
            tek.macCommon.waitDialogShow(null, message, null, 2);
        }
    };
    //tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, mydata, callback);
    // console.log(mydata)
    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}

//日期类型转换
function getLongDateByStringDate(stringDate){
    var newStringDate = stringDate;
    if(newStringDate){
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

function promptEdit(){
    var str='<p>是否确认添加？</p>'+'<a href="javascript:submitEdit();" class="btn btn-success">确认</a>'
        + '&nbsp;&nbsp;'
        + '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
    showMessage(str);
}

function closePrompt(){
    closeMessage();
}