// JavaScript Document
var SELECTED_ITEM=null;
function init(){
	
	moodInit();
	postNew();
}
function closePrompt(){
	closeMessage();
}
function postNew(){
	$("#my_photo").removeClass("hide");	
	$("#my_title").removeClass("hide");
	$("#post_text").removeClass("hide");
	$("#post_text").focus();
}
function moodInit(){
	$('.ui-296 ul li').on('click',function(){
		$(this).toggleClass('active');
		$(this).siblings('li').removeClass('active');
	})
}