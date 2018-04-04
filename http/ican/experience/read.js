/// JavaScript Document
function init(){
	/** 载入页面顶部信息 **/
	$("#tekinfo_banner").load(tek.common.getRootPath() + "http/ican/html/owner.html",function(){
		$.getScript(tek.common.getRootPath() + "http/ican/html/owner.js",function(){
			if(typeof initHeader == "function"){
				initHeader();
			}
			$("#experience").addClass("active");
		});
		
		$("#tekinfo_banner").css("position","relative");
		$("#tekinfo_banner").show();
	});
	
}	
