// JavaScript Document
function init(){

	addWidgetOperation();
}

/* 加入widget的按钮操作 */
function addWidgetOperation(){
	/* Close */
	$(".widget a.w-close").click(function(e){
					e.preventDefault();

					/* Widget variable */
					var widget = $(this).parent().parent().parent().parent(".widget");
					widget.hide(100);
					
	});	
	/* Minimize & Maximize */
	$(".widget a.w-mimax").click(function(e){
		
					e.preventDefault();

					/* Widget variable */
					var widget = $(this).parent().parent().parent().parent(".widget");
					var wBody = widget.children(".w-body");
					
					wBody.toggle(200);
					
	});
	$(function(){
					$(".w-scroll").niceScroll({
						cursorcolor : "rgba(0,0,0,0.2)",
						cursorwidth : "5px"
					});
	});
}