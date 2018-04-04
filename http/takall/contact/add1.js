// 地址栏参数
var params_obj = tek.common.getRequest();
// 初始化
var ajaxURL = tek.common.getRelativePath() + "servlet/tobject";

//var items = ["contact_title","contact_name","contact_owner","contact_objectName","contact_objectId","contact_remark","contact_property"];
var ADD_CONFIG = {
	isADDing : true,//edit:false
	owner_type : true,//private:false||public:true
}

var URLObjectId,URLObjectName;
var CONTACT_OWNER;

function init() {
	// 判断是否登录
	if(tek.common.isLoggedIn()){
		console.log("登录了");
		showUserInfo();
		// 判断是公共还是私有
		if(((params_obj["expert_id"] || params_obj["organization_id"]) && params_obj["objectName"])){
			// 私有
			// 判断地址栏参数，如果有expert_id,则是专家新建的联系信息，如果有organization_code,则是机构新建的联系信息
			if(params_obj["expert_id"]){
				URLObjectId = params_obj["expert_id"];
			}else if(params_obj["organization_id"]){
				URLObjectId = params_obj["organization_id"] + "";
			};

			URLObjectName = params_obj["objectName"];
			CONTACT_OWNER = myId;

			// 获取标签
			getTags();
		}else{
			console.log("公共");
			CONTACT_OWNER = 0;
		}

		updateOpener=request['refresh-opener'];

		if(updateOpener && (updateOpener==1 || updateOpener==true)){
				updateOpener=1;
		}else{
			updateOpener=0;
		}

		showClose=request['show-close'];

		if(showClose && (showClose==1 || showClose==true)){
			showClose=1;
		}else{
			showClose=0;
		}

		$("#private").attr("value",myId);

	}else{
		console.log("没有登录");
		returnPage();
	}
}

// 初始化结束
// _______________________________________________________________________

// 添加一条联系信息
function addNew(){
	var params = getInputVal() || null;
	if(!params){
		return;
	}

  params["objectName"]="Contact";

	var parm = {};
	parm["url"] = ajaxURL;
	params["action"]="addInfo";

	parm["params"] = params;
	parm["success"] = function(data){
		console.log(data);
			var id = data.value.split("=")[1];

			if (typeof updateOpener != "undefined" && updateOpener == 1) {
          // 刷新父页面
          tek.refresh.refreshOpener();
      }

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

// 返回
function goBack(){
	window.history.go(-1);
}

// 获取表单中的值,变成参数
function getInputVal(){
	var addcontact_params = {};

	// 联系信息名字
	var name = $("#contact_name").val();
	if(!name && (name.length < 1 || name.length > 64)){
		showTips("name","名称长度不正确");
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
		addcontact_params["contact_color"] = $("#contact_color").val() || 0;
	}

	addcontact_params["contact_objectName"] = URLObjectName;
	addcontact_params["contact_objectId"] = URLObjectId + "";

	return addcontact_params;
}

function checkRemark(that){
	var val = $("#contact_remark").val();
	var len = val.length;

	if(len < 2){
		showTips("remark","内容长度不正确");
		return false;
	}else{
		showTips("name","");
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
