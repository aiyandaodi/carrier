// JavaScript Document
function init(){
	toolTip();
}

function closePrompt(){
	closeMessage();
}
function toolTip(){
	$('.ui-tooltip').tooltip();
}
//检索
function inputSearch(){
	$('.ui-list form').fadeToggle(200);
}