// JavaScript Document
// JavaScript Document

function init(){
	
	removeTag();

    $('#summernote_phone').summernote({
        height: 500,                 // set editor height
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        lang:'zh-CN',
        placeholder:'请在这里输入内容！',
        focus: true,
        airMode: true
    });

}

function promptAdd(){
	var str='<a href="javascript:submitAdd();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
		
	showMessage(str);
}

function submitAdd(){
	closeMessage();
	alert("ok");
}

function closePrompt(){
	closeMessage();
}
function selectQuestionType(Type){
    //$("#type").empty();
    var type_content = document.getElementById(Type).innerHTML;
    $("#type").html(type_content);
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
	$('.ui-2 .ui-tag .tag').append('<li><a href="#" class="tagValue" onClick="javascript:tagInit(this)">'+str+'</a><a href="#" class="btn btn-default remove-tag"><i class="fa fa-remove"></i></a></li>');
	closeMessage();
	removeTag();
}
//选中标签
function tagInit(index){
	$(index).parent().toggleClass('active');
}