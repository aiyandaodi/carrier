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
function closePrompt(){
	closeMessage();
}
//分享
function addShare(){
	var str='<p>分享理由：</p>'
		+'<form>'
		+'<textarea class="form-control" style="resize:vertical">O(∩_∩)O分享一个很好的职位给大家~</textarea><p></p>'
		+'<a href="javascript:submitShare();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>'
		+'</form>';
	showMessage(str);
}
function submitShare(){
	showMessage('分享成功');	
}