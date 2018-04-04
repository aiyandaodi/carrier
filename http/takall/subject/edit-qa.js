// 地址栏参数
var params_obj = tek.common.getRequest();
var ISEDIT;
var subjectId;
// 初始化
var ajaxURL = tek.common.getRootPath() + "servlet/tobject";


var URLObjectId,URLObjectName;
var CONTACT_OWNER;

function init() {
	// 判断是否登录
	if(tek.common.isLoggedIn()){
		subjectId = params_obj["subject_id"];
		var subjectName = decodeURIComponent(params_obj["subject_name"]);
		var subjectSummary = decodeURIComponent(params_obj["subject_summary"]);
		if(subjectId){
			
			ISEDIT = params_obj["edit"];
			$("#edit_subject_name").val(subjectName);
			$("#edit_subject_summary").val(subjectSummary);

		}
		
		
	}else{
		console.log("没有登录");
	}
}


