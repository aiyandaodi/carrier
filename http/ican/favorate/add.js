// JavaScript Documentfunction init(){
function init(){

   
}

function promptAdd(){
	var str='<p>是否确认添加？</p>'+'<a href="javascript:submitAdd();" class="btn btn-success">确认</a>'
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