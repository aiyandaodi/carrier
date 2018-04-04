// JavaScript Document
function init(){


}

function promptEdit(){
	var str='<p>是否确认修改？</p>'+'<a href="javascript:submitEdit();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';	
	showMessage(str);
}
function submitEdit(){
	closeMessage();
	alert("ok");
}
function closePrompt(){
	closeMessage();
}