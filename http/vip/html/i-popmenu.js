// JavaScript Document
function initPopmenu(){
	
	loadCSS(tek.common.getRootPath()+"http/common/popmenu/popmenu.css");
	loadCSS(tek.common.getRootPath()+"http/vip/html/i-popmenu.css");
	//alert("url="+tek.common.getRootPath()+"http/common/popmenu/popmenu.js");
	$.getScript(tek.common.getRootPath()+"http/common/popmenu/popmenu.js",function(){
		//alert("popmenu_start="+(typeof popmenu_start));
		if(typeof popmenu_start == "function"){
			popmenu_start();
		}
	});
	
	//alert("ok");
}


function goInteraction(){
	var url = tek.common.getRootPath() + "http/takall/interaction/index.html";
	window.open(url);
}
function goQuestion(){
	var url = tek.common.getRootPath() + "http/takall/subject/index-know.html?subject_type=1";
	window.open(url);
}
