// JavaScript Document
/**************************************************
 *	新建字典页面 index.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================
//显示字段数组
var items = new Array(
	"dictionary_code",
	"dictionary_original",
	"dictionary_language",
	"dictionary_name",
	"dictionary_targetObject",
	"dictionary_targetFields",
	"dictionary_property");

//=====================================================Function===============================
//获得显示的字段
function addNew(){
	var params={};
	params["objectName"]="ObjectDictionary";
	params["action"]="getNew";
  
	getEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"add-info");
}

//提交信息
function addNewInfo(){
	var mydata=getSerializeObjectParameters("add_form") || {};	//转为json
	
	mydata["objectName"] = "ObjectDictionary";
	mydata["action"] = "addInfo";
	
	var original = mydata["dictionary_original"];
	if (original && original.indexOf("0x") == 0) {
		var num = parseInt(original);
		mydata["dictionary_original"] = num;
	}
	
	editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);	
}

//-----------------------------------------------------------------------------------
// 执行页面自定义的初始化按钮函数  --mac-edit.js中调用
function initialCustomButton(parentId) {
  var sb=new StringBuffer();
  sb.append("<button type='submit' id='submitBtn' class='btn btn-danger col-xs-3'>提交</button>");
 
  if(showClose==1){
    //显示关闭按钮
    sb.append("<button type='button' id='closeBtn' class='btn btn-info col-xs-3' onclick='tek.common.closeWithConfirm();'>关闭</button>");
  } else if (callbackURL){
    //显示返回按钮
    sb.append("<button type='button' id='callbackBtn' class='btn btn-success col-xs-3' onclick='tek.common.callbackWithConfirm(callbackURL)'>返回</button>");
  } else {
    // 显示“提交”、“重置”
    sb.append("<button type='reset' class='btn btn-success col-xs-3'>重置</button>");
  }

  $("#"+parentId).html(sb.toString());
}

// 执行页面自定义的初始化按钮函数
function appendCustomEditField(field, record, sb) {
	if (!tek.type.isObject(field) || tek.type.isEmpty(sb)) return sb;
	
	var fieldname = field.name;    //域名
	if (tek.type.isEmpty(fieldname)) return sb;

	if (fieldname == "dictionary_targetObject" || fieldname == "dictionary_targetFields" || fieldname == "dictionary_property") {
		sb.append("<div id='");
		sb.append(fieldname);
		sb.append("-form-group' class='form-group'>");
		
		appendNameField(field, sb);
		
		sb.append("<div class='col-xs-9'>");
		
		if (fieldname == "dictionary_targetObject") {
			sb.append("<input type='text' id='");
			sb.append(fieldname);
			sb.append("' name='");
			sb.append(fieldname);
			sb.append("' class='form-control' value='");
			sb.append(targetObject);
			sb.append("' disabled/>");
			
			sb.append("<input type='hidden' name='");
			sb.append(fieldname);
			sb.append("' value='");
			sb.append(targetObject);
			sb.append("'/>");
		} else if (fieldname == "dictionary_targetFields") {
			sb.append("<input type='text' id='");
			sb.append(fieldname);
			sb.append("' name='");
			sb.append(fieldname);
			sb.append("' class='form-control' value='");
			sb.append(targetFields);
			sb.append("' disabled/>");
			
			sb.append("<input type='hidden' name='");
			sb.append(fieldname);
			sb.append("' value='");
			sb.append(targetFields);
			sb.append("'/>");
		} else if (fieldname == "dictionary_property") {
			sb.append("<input type='text' id='");
			sb.append(fieldname);
			sb.append("' name='");
			sb.append(fieldname);
			sb.append("' onclick='openPropertyEditBox()' class='form-control' value='' readonly/>");
		}
		sb.append("</div>");

		sb.append("</div>");
		
		if (fieldname == "dictionary_property") {
			appendPropertyEditBox(sb);
		}
	} else {
		appendDefaultEditField(field, record, sb);
	}
}

// 添加属性设置域
function appendPropertyEditBox(sb) {
	if (tek.type.isEmpty(sb))
		return;
	
	sb.append("<div class='panel panel-primary' id='dictionary_property_setting_panel' style='display: none;position: relative;'>");
	
	sb.append("<div style='width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent;border-bottom: 20px solid #337AB7;position: absolute;top: -20px;right:10px;'></div>");
	sb.append("<div class='panel-body'>");
	
	sb.append("<div class='form-group'>");
	sb.append("<label class='col-xs-3' style='overflow:hidden' for='property_read'>阅读属性</label>");
	sb.append("<div class='col-xs-9'>");
	sb.append("<select class='form-control' id='property_read' name='property_read'></select>");
	sb.append("</div>");
	sb.append("</div>");
	
	sb.append("<div class='form-group'>");
	sb.append("<label class='col-xs-3' style='overflow:hidden' for='property_answer'>回答权限</label>");
	sb.append("<div class='col-xs-9'>");
	sb.append("<select class='form-control' id='property_answer' name='property_answer'></select>");
	sb.append("</div>");
	sb.append("</div>");
	
	sb.append("<div class='form-group'>");
	sb.append("<label class='col-xs-3' style='overflow:hidden' for='property_idleTime'>无答复时间</label>");
	sb.append("<div class='col-xs-9'>");
	sb.append("<input class='form-control' id='property_idleTime' name='property_idleTime' type='text' value='0'>");
	sb.append("<p class='help-block text-right' style='font-size: 1em;'>允许没有答复的最长时间，单位：分钟</p>");
	sb.append("</div>");
	sb.append("</div>");
	
	sb.append("<div class='form-group'>");
	sb.append("<label class='col-xs-3' style='overflow:hidden' for='property_people'>允许抢答人数</label>");
	sb.append("<div class='col-xs-9'>");
	sb.append("<input class='form-control' id='property_people' name='property_people' type='text' value='0'>");
	sb.append("<p class='help-block text-right' style='font-size: 1em;'>0-不限制回答人</p>");
	sb.append("</div>");
	sb.append("</div>");
	
	sb.append("<div class='form-group'>");
	sb.append("<label class='col-xs-3' style='overflow:hidden'>显示模式</label>");
	sb.append("<div class='col-xs-9'>");
	sb.append("<div class='col-xs-6'><label><input name='property_show' type='radio' value='1' checked> 时间线显示</label></div>");
	sb.append("<div class='col-xs-6'><label><input name='property_show' type='radio' value='2'> 对答显示</label></div>");
	sb.append("</div>");
	sb.append("</div>");
	
	sb.append("<div class='text-right'><button class='btn btn-primary' type='button' onclick='submitPropertyParams()'>&nbsp;<i class='glyphicon glyphicon-ok'></i>&nbsp;</button></div>");
	
	sb.append("</div>");
	sb.append("</div>");	
}

// 打开属性编辑域
function openPropertyEditBox() {
	$("#dictionary_property_setting_panel").show("slow");
	
	// 获取属性中相关选项
	getOptionForProperty();
}

// 获取属性中相关选项
function getOptionForProperty() {
	var getOption = function (field) {
		if (!field) return null;
			
		var selects = field.selects;
		var shows = field.shows;
		var sb = new StringBuffer();
		if (tek.type.isArray(selects) && tek.type.isArray(shows) && selects.length == shows.length) {
			for (var i = 0; i < selects.length; i++) {
				sb.append("<option value='");
				sb.append(tek.Utils.convert(selects[i], 10, 16));
				sb.append("'>");
				sb.append(shows[i]);
				sb.append("</option>");
			}
		}
		return sb.toString();
	};
	
	var url = tek.common.getRootPath()+"servlet/tobject";
	var mydata = {};
	mydata["objectName"] = targetObject;
	mydata["action"] = "getFields";
	mydata["command"] = "read";
	mydata["select"] = "transaction_read,transaction_answer";
	
	if (tek.type.isEmpty($("#property_read").val()) || tek.type.isEmpty($("#property_answer").val())) {
		$.get(url, mydata, function (data) {
			if (data && data.record) {
				var record = data.record;
				if (record.transaction_read) {
					var html = getOption(record.transaction_read);
					$("#property_read").html(tek.type.isEmpty(html) ? "" : html);
				}
				if (record.transaction_answer) {
					var html = getOption(record.transaction_answer);
					$("#property_answer").html(tek.type.isEmpty(html) ? "" : html);
				}
			}
		}, "json");
	} // end if (tek.type.isEmpty($("#property_read").val()) || tek.type.isEmpty($("#property_answer").val()))
}

// 提交属性字段的参数
function submitPropertyParams() {
	var prop = {};
	var $param = $("#dictionary_property_setting_panel");
	
	prop["read"] = $param.find("[name='property_read']").val();
	prop["answer"] = $param.find("[name='property_answer']").val();
	prop["idleTime"] = parseInt($param.find("[name='property_idleTime']").val());
	if (!tek.type.isNumber(prop["idleTime"]) || prop["idleTime"] < 0) {
		waitDialogShow(null, "<p class='center'>请输入大于等于零的整数</p>");
		waitDialogHide(2000);
		$param.find("[name='property_idleTime']").val("").focus();
		return;
	} else {
		$param.find("[name='property_idleTime']").val(prop["idleTime"]);
	}
	prop["people"] = parseInt($param.find("[name='property_people']").val());
	if (!tek.type.isNumber(prop["people"]) || prop["idleTime"] < 0) {
		waitDialogShow(null, "<p class='center'>请输入大于等于零的整数</p>");
		waitDialogHide(2000);
		$param.find("[name='property_people']").val("").focus();
		return;
	} else {
		$param.find("[name='property_people']").val(prop["people"]);
	}
	prop["show"] = $param.find("[name='property_show']:checked").val();
	
	var format = function () {
		var s = "";
		for(p in prop) {
			if (!!p)
				s += p + "=" + (tek.type.isEmpty(prop[p]) ? "" : prop[p]) + ";";
		}
		if (s && s.length > 0)
			s = s.substring(0, s.length - 1);
		return s;
	}();
	
	if (!tek.type.isEmpty(format)) {
		$("#dictionary_property").val(format);
		$("#dictionary_property_setting_panel").hide("slow");
	}
}

//------------------------------------------------------通用函数（适用于本js文件）-------------------------------
// 显示错误信息
function showErrorMessage(msg) {
	if (!tek.type.isEmpty(msg)) {
		var sb = new StringBuffer();
		sb.append("<div style='max-width: 600px;margin: 60px auto;text-align: center;'>");
		sb.append(msg);
		sb.append("</div>");
		
		$("#object_dictionary_add").html(sb.toString());
	}
}

//等待图层显示   --第三个参数是否点击灰框关闭，取值[0,1,2]：0-自动关闭，1-提示关闭，2-禁止关闭
function waitDialogShow(title, msg, isAutoClose){
	if(title) $("#waiting-modal-dialog-title").html(title);
	if(msg) $("#waiting-modal-dialog-body").html(msg);

	if(!isAutoClose || (isAutoClose!=0 && isAutoClose!=1 && isAutoClose!=2)) isAutoClose == 0;
	if($("#waiting-modal-dialog").is(":hidden")){
		$("#waiting-modal-dialog").modal("show",null,parseInt(isAutoClose));
	}
}

//等待图层隐藏
function waitDialogHide(time){
	if(!$("#waiting-modal-dialog")[0])
		return;

	if(!time || typeof time != "number") time = 0;

	window.self.setTimeout(function(){
		$("#waiting-modal-dialog").modal("hide");
		$("#waiting-modal-dialog-title").html(" ");
		$("#waiting-modal-dialog-body").empty();
	}, time);
}
//-----------------------------------------------------End-------------------------------------
