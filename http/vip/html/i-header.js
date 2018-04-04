// JavaScript Document
function initHeader(){
	/*var cssurl=tek.common.getRootPath()+"http/vip/html/i-header.css";
	//alert("cssurl="+cssurl);
	loadCSS(cssurl);*/
	//alert("B="+BANNER_HEIGHT);
	BANNER_HEIGHT=$("#navbar").css("height");
//	alert("B="+BANNER_HEIGHT);
	$("#index_banner").css("height",BANNER_HEIGHT);
	//alert("index_banner height="+$("#index_banner").height());
	//tek.common.getUser();
	
	//if (tek.common.isLoggedIn()) {
	//	showUserInfo();
	//}
}

/*function myUser(){
	var html=tek.common.getRootPath()+"http/ican/person/read.html?user_id=";
	
}*/