// JavaScript Document
function init(){
	
	/** 载入页面顶部信息 **/
	$("#tekinfo_banner").load(tek.common.getRootPath() + "http/ican/html/owner.html",function(){
		$.getScript(tek.common.getRootPath() + "http/ican/html/owner.js",function(){
			if(typeof initHeader == "function"){
				initHeader();
			}
			$("#security").addClass("active");
		});
		
		$("#tekinfo_banner").css("position","relative");
		$("#tekinfo_banner").show();
	});
	
}	
function promptAdd(){
	var str='<p>是否确认更改？</p>'
		+ '<a href="javascript:submitAdd();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
		
	showMessage(str);
}
function submitAdd(){
	closeMessage();
	alert("ok");
}

function searchSecurity(){
	var str=$('#searchValue').val();
}
function sortSecurity(index){
	var str=$(index).val();
}
function inputSearch(){
	$('.ui-list form').fadeToggle(200);
}