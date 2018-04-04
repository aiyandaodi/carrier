// JavaScript Document
// JavaScript Document
function init(){
	

}


function promptAdd(){
	var str='<a href="javascript:submitAdd();" class="btn btn-success">ç¡®è®¤</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">è¿å</a>';
		
	showMessage(str);
}

function submitAdd(){
	closeMessage();
	alert("ok");
}

function closePrompt(){
	closeMessage();
}