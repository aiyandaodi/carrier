// JavaScript Document
// JavaScript Document
function init(){
	
	removeTag();
}

function promptEdit(){
	var str='<p>是否确认修改？</p>'+'<a href="javascript:submitEdit();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
	showMessage(str);
	$('#message-modal-dialog').css('z-index','10880');
}
function submitEdit(){
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
	$('.login-reg-form .form-group .tag').append('<li><a href="#" onClick="javascript:tagInit(this)" class="tagValue">'+str+'</a><a href="#" class="btn btn-default remove-tag"><i class="fa fa-remove"></i></a></li>');
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