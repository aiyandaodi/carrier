var currentColor;
// 地址栏参数
var params_obj = tek.common.getRequest();
var contact_id = params_obj["contact_id"];
var ajaxURL = tek.common.getRelativePath() + "servlet/tobject";

var items=[
    'contact_name',
    'contact_color',
    'contact_property',
    'contact_default',
    'contact_remark'
];
var FORM_PARENT = "contact_form";
var AjaxURL = tek.common.getRelativePath()+"servlet/tobject";
var BTN_PARENT = "contact_btn";

var ADD_CONFIG = {
	isADDing : true,//edit:false
	owner_type : true,//private:false||public:true
}

var URLObjectId,URLObjectName;
var CONTACT_OWNER;

var OBJECT_NAME = params_obj["object_name"];
var OBJECT_ID = params_obj["object_id"];

//如果没有选择参数则返回
if(!contact_id){
	window.history.go(-1);
}


function init() {
    var sendData = {
        objectName : "Contact",
        action : "getEdit",
        contact_id : params_obj["contact_id"]
    };

    tek.macEdit.getEdit(AjaxURL, sendData, items, FORM_PARENT);
    tek.macEdit.initialDefaultButton(BTN_PARENT);

    $("#submitBtn").attr("type","button").click(function(event){
        addNew1();
        return false;
    });
    
}

tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);
    
    
    
    //获取标签
    // getTags(currentTag);
    //获取颜色
    getColors(currentColor);


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
        html += '<input type="hidden" class="form-control" name="' + fieldname + '" id="' + fieldname+ '" value="' + (field.value || '') + '" >'
            + '<input type="text" class="form-control dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="' + fieldname+ '-input" value="' + setContactColor(field.show || '')+ '" placeholder="人生色彩">'
            + '<ul class="dropdown-menu" id="contact-common-color-ul"  aria-labelledby="' + fieldname + '"></ul>'

        html += '</div></div>';

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
//设置颜色值设置颜色名称
function setContactColor(value){
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



// 初始化结束
// _______________________________________________________________________

// 新建一条信息
function addNew1(){
    var params=tek.common.getSerializeObjectParameters(FORM_PARENT);
    params["objectName"] = "Contact";
    params["action"] = "setInfo";
    params["contact_id"] = params_obj["contact_id"];

    tek.macEdit.editInfo(AjaxURL, params);
}

// 添加一条联系信息
function addNew(){
	var params = getInputVal() || null;
	if(!params){
		return;
	}

  params["objectName"]="Contact";

	var parm = {};
	parm["url"] = ajaxURL;

	// 在编辑的情况下，则使用编辑的提交方式
	params["action"]="setInfo";
	params["contact_id"]=params_obj["contact_id"];


	parm["params"] = params;
	parm["success"] = function(data){

			var id = params_obj["contact_id"];

			var base_href = "read.html?contact_id=" + id;
	    tek.macCommon.waitDialogShow("添加成功",tek.dataUtility.stringToHTML(data.message + "\n3秒后跳转到读取页面"), "",true);

	    setTimeout(function(){
	    	window.location.href = base_href;
	    },3000);

	    $("#waiting-modal-dialog").modal("show");
	}

	//发送ajax请求
	tek.common.ajax2(parm);
}


// 获取表单中的值,变成参数
function getInputVal(){
	var addcontact_params = {};

	// 联系信息名字
	var name = $("#contact_name").val();
	if(!name && (name.length < 2 || name.length > 32)){
		console.log("长度不对");
		showTips("name","长度应大于2");
		return;
	}else{
		showTips("name","");
	}

	addcontact_params["contact_name"] = encodeURI(name);

	addcontact_params["contact_owner"] = CONTACT_OWNER;

	var remark = checkRemark();
	if(!remark){return;}
	addcontact_params["contact_remark"] = remark;

	// 阅读属性
	// var read = $(".read-property input:radio:checked").val();
	addcontact_params["contact_property"] = 64;//默认值

	if(CONTACT_OWNER == 0){
		//公共【不显示以下的字段】
		addcontact_params["contact_catalog"] = "0";
		addcontact_params["contact_tags"] = "0";
		addcontact_params["contact_color"] = "0";
	}else{
		// 只有当前记录所有者存在的时候【contact_owner】,才使用个人的目录分类，标签分类，颜色分类
		// 机构和专家的联系信息新建都属于私有联系信息
		// 私有，CONTACT_OWNER=myId;,以下的值是从表单中获取
		addcontact_params["contact_catalog"] = "catalog";
		// addcontact_params["contact_tags"] = $("#contact_tags").val();
		// 获取contacts_tags的值
		var checkBox = $("#coantact-common-tags-ul input");
		var len = checkBox.length;
		var temp_val = "";
		var temp_input = null;
		for(var i = 0; i < len; i++ ){
			temp_input = checkBox[i];
			if(temp_input.checked){
				temp_val += encodeURI($(temp_input).attr("value")) + ";";
			}
		}

		if(temp_val.length === 0){
			showTips("tags","请选择标签");
			return;
		}else{
			showTips("tags","");
		}

		addcontact_params["contact_tags"] = temp_val;
		addcontact_params["contact_color"] = $("#contact_color").val();
	}

	addcontact_params["contact_objectName"] = OBJECT_NAME;
	addcontact_params["contact_objectId"] = OBJECT_ID + "";

	return addcontact_params;
}


function checkRemark(that){
	var val = $("#contact_remark").val();
	var len = val.length;

	if(len < 1){
		console.log("标记长度不对");
		// $("#remark_tips").text("长度应大于2").css({
		// 	color : 'red'
		// });

		showTips("remark","长度应大于2");
		return false;
	}

	return val;
}

function checkName(){
	console.log("");
}

function showError(data,message){
	var timerMsg="";
    tek.macCommon.waitingMessage(tek.dataUtility.stringToHTML(data.message), timerMsg);
    $("#waiting-modal-dialog").modal("show");
}

function showInfo(){
	console.log("提示信息");
}


function showTips(ele,tips){
	$("#" + ele + "_tips").text(tips).css({
		color : 'red'
	});
}

// 提示信息
function showMsg(msg,scripts_str){
	tek.macCommon.waitDialogShow(null, msg, '<font is="counter" color="red"></font> 秒后自动跳转', 2);
	tek.macCommon.waitDialogHide(3000, scripts_str);
}

// 获取编辑信息
function editThisInfo(id){
	var params = {};
	params["objectName"] = "Contact";
	params["action"] = "getEdit";
	params["contact_id"] = id;

	var parm = {};
	parm["url"] = ajaxURL;

	parm["success"] = function(data){
		console.log(data);
		if(data && data.code == 0 && data.record){
			var data_val = data.record;
			// 普通
			var ipnuts = $("#contact_form input[type='text']");
			var inputs_num = ipnuts.length;
			for(var i = 0; i < inputs_num; i++){
				console.log(i);
				var this_id = ipnuts.eq(i).attr("id");
				ipnuts.eq(i).val(data_val[this_id].value);
			}

			// textarea
			var textareas = $("#contact_form textarea");
			var textareas_num = textareas.length;
			for(var j = 0; j < textareas_num; j++){
				var this_id = textareas.eq(j).attr("id");
				textareas.eq(j).val(data_val[this_id].value);
			}

			// 单选
			var name_hold = ["contact_property"];
			// data_val["contact_property"].value = 1;
			var radios = $("#contact_form input[type='radio']");
			var num_radios = radios.length;
			var reback_val = data_val[name_hold[0]].value;
			for(var k = 0; k < num_radios; k++){
				var this_val = radios.eq(k).attr("value");

				if(parseInt(this_val) == parseInt(data_val[name_hold[0]].selects[reback_val])){
					radios.eq(k).attr("checked","checked");
				}
			}
		}
	};

	parm["params"] = params;	// - 传递参数
	parm["type"] = "post";
	parm["error"] = function(data,msg){
		showError(data,msg);
	}

	parm["message"] = showInfo;
	tek.common.ajax2(parm);
}

function SendAjax(obj,fn){
	var params = obj;

	var parm = {};
	parm["url"] = AjaxURL;
	parm["params"] = params;  // - 传递参数
	parm["type"] = "POST";
	parm["success"] = function(data){
		if(fn && typeof fn === "function"){
			fn(data);
		}
	}

	parm["error"] = function(data,msg){
		console.log(data,msg);
		console.log("提示错误");
	}

	parm["message"] = function(){
		console.log("提示信息");
	};

	tek.common.ajax2(parm);
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




//
// // 这里是前端临时的处理。以后返回的机构的code值是不需要处理的。
// function getContactObj(record){
// 	// 以下是处理显示联系信息所有者名字的地方。获取到记录中的ObjectId[expert_id || organization_code]和ObjectName[Expert || Organization]
// 	var obj_id = record["contact_objectId"]["value"] + "";
// 	var obj_name = record["contact_objectName"]["value"];
//
// 	var obj_attr = "";
// 	var show_name = "";
//
// 	// 专家
// 	if(obj_name === "Expert"){
// 		obj_attr = "expert_id";
// 		show_name = "expert_name";
// 	}else{
// 		obj_attr = "organization_code";
// 		show_name = "organization_name";
//
// 		// 注释开始【organization_code重新设计之后】【上线前这里要删除】
// 		var code_len = obj_id.length;
// 		var zero_len = 8 - code_len;
// 		var zero_str = "";
// 		for(var i = 0 ; i < zero_len; i++ ){
// 			zero_str += "0";
// 		}
//
// 		// 在返回的机构的code值前面加上0
// 		obj_id = zero_str + obj_id;
// 		// 注释结束【organization_code重新设计之后】
// 	}
//
// 	var params_1 = {
// 		action : "readInfo",
// 		objectName : obj_name,
// 	}
//
// 	params_1[obj_attr] = obj_id;
//
// 	// 读取该条记录
// 	SendAjax(params_1,function(data){
// 		// 在页面上方显示机构的名字或者专家的名字
// 		$("#organization_name").text(data["record"][show_name]["show"] + "的联系信息");
// 	});
// }
