// JavaScript Document

POPMENU_MENU_HEIGHT=420;  //弹出菜单高度
POPMENU_LIST_HEIGHT=360; //弹出列表高度

function initReadmenu(){
	
	//alert("000");
	loadCSS(tek.common.getRootPath()+"http/common/popmenu/popmenu.css");
	loadCSS(tek.common.getRootPath()+"http/vip/html/i-readmenu.css");
	
	$.getScript(tek.common.getRootPath()+"http/common/popmenu/popmenu.js",function(){
		//alert("popmenu_start="+(typeof popmenu_start));
		if(typeof popmenu_start == "function"){
			popmenu_start();
		}
	});
//alert("ok");
}

