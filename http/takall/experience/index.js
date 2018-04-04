// JavaScript Document
function init(){
	
	$('#txtA').click(function(){
		if($(this).hasClass('active')){
			return false;
		}else{
			$(this).addClass('active');
			$('#timeA').removeClass('active');
			$('.ui-139').css('display','block');
			$('.ui-item').css('display','none');
		}
	})
	$('#timeA').click(function(){
		if($(this).hasClass('active')){
			return false;
		}else{
			$(this).addClass('active');
			$('#txtA').removeClass('active');
			$('.ui-139').css('display','none');
			$('.ui-item').css('display','block');
		}
	})
}

