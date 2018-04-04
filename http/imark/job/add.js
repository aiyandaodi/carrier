// JavaScript Document

var items = new Array("job_code", "job_name", "job_grade", "job_counts", "job_catalog", "job_tag", "job_owner", 
	"job_organization", "job_type", "job_department", "job_status", "job_certificates", "job_country", "job_state", "job_city", "job_street", "job_url", "job_remark");
function init(){
	getNew();
	removeTag();
}
//获得显示的字段
function getNew(){

	var params = {};
	params["objectName"] = "Job";
	params["action"] = "getNew";
	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "add_form");
}


//提交题库信息
function submitEdit(){
    var mydata = tek.common.getSerializeObjectParameters("add_form") || {};	//转为json

    mydata["objectName"] = "Job";
    mydata["action"] = "addInfo";


    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}


function promptAdd(){
	var str='<p>是否确认新建？</p>'+'<a href="javascript:submitAdd();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';	
	showMessage(str);
	$('#message-modal-dialog').css('z-index','10880');
}
function submitAdd(){
	closeMessage();
	alert("ok");
}
function closePrompt(){
	closeMessage();
}
//删除标签
function removeTag(){
	$('.remove-tag').on('click',function(){
		$(this).parent().remove();
	})
}
//新建标签
function addJobTag(index){
	var str='<h4>新建标签<h4>'+'<span>标签名：</span>'+'<input type="text" id="tag_name" placeholder="请输入标签名">'+'&nbsp;&nbsp;<a href="javascript:sureTag();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
	showMessage(str);
}
function sureTag(){
	var str=$('#tag_name').val();
	$('.login-reg-form .form-group .tag').append('<li><a href="#" class="tagValue" onClick="javascript:tagInit(this)">'+str+'</a><a href="#" class="btn btn-default remove-tag"><i class="fa fa-remove"></i></a></li>');
	closeMessage();
	removeTag();
}
//初始化标签
function tagInit(index){
	$(index).parent().toggleClass('active');
}
//添加输入框
function addInput(index){
	$(index).parents('.form-group').append('<div class="col-sm-3"></div><div class="col-sm-9 tempInput"><input type="text" class="form-control" name="job_selected_qualification" placeholder="请输入可选资格"><a class="btn btn-sm btn-default removeInput">x</a></div>');
	$('.removeInput i').css('color','#000');
	removeInput();
}
//删除输入框
function removeInput(){
	$('.removeInput').on('click',function(){
		$(this).parent().prev().remove();
		$(this).parent().remove();
	});
}