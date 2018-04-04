// JavaScript Document
var winWidth = 0;
var CHANGE_WIDTH=768;
function init(){
	
	
	addWidgetOperation();
	
	getWidth();
    if(winWidth < CHANGE_WIDTH){
        $('#summernote_phone').summernote({
        	toolbar:[
	            ['para',['paragraph']]
	        ],
            height: 200,                 // set editor height
            maxHeight: 200, //定义最大高度
  			minHeight: 200,  //定义最小高度
            lang:'zh-CN',
            focus: true,
            airMode: true
        });
    }else {
        $('#summernote_pc').summernote({
        	toolbar:[
	            ['insert',['picture']]
	        ],
            height: 200,                 // set editor height
            maxHeight: 200, //定义最大高度
  			minHeight: 200,  //定义最小高度
            lang: 'zh-CN',
            focus: true                  // set focus to editable area after initializing summernote
        });
    }
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
function getWidth(){
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if(winWidth < CHANGE_WIDTH){
        $('#pc').hide();
        $('#phone').show();
        $('#summernote_phone').summernote({
            height: 200,                 // set editor height
            maxHeight: 200, //定义最大高度
  			minHeight: 200,  //定义最小高度
            lang:'zh-CN',
            focus: true,
            airMode: true
        });
    }else{
        $('#pc').show();
        $('#phone').hide();
    }
}