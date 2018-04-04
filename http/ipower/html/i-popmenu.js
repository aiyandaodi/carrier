// JavaScript Document
function initPopmenu(){
	
	loadCSS(tek.common.getRootPath()+"http/common/popmenu/popmenu.css");
	loadCSS(tek.common.getRootPath()+"http/vip/html/i-popmenu.css");
	$.getScript(tek.common.getRootPath()+"http/common/popmenu/popmenu.js",function(){
		if(typeof popmenu_start == "function"){
			popmenu_start();
		}
	});
}
