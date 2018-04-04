// JavaScript Document

var SELETED_ITEM=null;
function init(){
	/** 载入页面顶部信息 **/
	$("#tekinfo_banner").load(tek.common.getRootPath() + "http/ican/html/owner.html",function(){
		$.getScript(tek.common.getRootPath() + "http/ican/html/owner.js",function(){
			if(typeof initHeader == "function"){
				initHeader();
			}
		});
		
		$("#favorate").addClass("active");
		
		$("#tekinfo_banner").css("position","relative");
		$("#tekinfo_banner").show();
	});

}

function sortType(){
	window.location.reload();
}
function sortName(index){
	$(index).parent().addClass('active');
	$(index).parent().siblings('li').removeClass('active');
}
//过滤类型
function filterType(index){
	var type=$(index).html();
	var favorates=$('.table tbody tr:nth-child(odd) td:first-child a');
	$('.table tbody tr:nth-child(odd) td:first-child a').each(function(index, element) {
        if($(element).html()!=type){
			$(element).parents('tr').css('display','none');
		}
		else{
			$(element).parents('tr').removeAttr('display');
			}
    });
}
//为删除按钮绑定事件
function deleteInit(){
	$('.right-delete').on('click',function(){
		SELETED_ITEM=this;
		delFavorate();
	})
}
//删除收藏
function delFavorate(index){
	var str='<p>是否确认删除？</p>'
		+ '<a href="javascript:submitDel();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
		
	showMessage(str);
}
//确认删除
function submitDel(){
	$(SELETED_ITEM).parent().parent('tr').next('tr').remove();
	$(SELETED_ITEM).parent().parent('tr').remove();
	closePrompt();
	alert('success');
}
//slide收藏说明初始化
function slideInit(){
	$('.table tbody tr td:nth-child(2)').click(function(e){
		e.preventDefault();
		$(this).parent().next('tr').slideToggle(200);
	});
}
//检索
function inputSearch(){
	$('.ui-list form').fadeToggle(200);
}