// JavaScript Document
function initFooter(){
	//alert("init footer");
	setFooterLocation();
	
	$("#tekinfo_main").resize(function(){
        setFooterLocation();
    });
	$(window).resize(function(){
        setFooterLocation();
    });
	
	//显示服务器和客户端时间
	$.getScript(tek.common.getRootPath()+"http/common/tek/js/serverTimer.js",function(){
		//alert("tek.serverTimer.show="+(typeof tek.serverTimer.show));
		if(typeof tek.serverTimer.show == "function"){
			tek.serverTimer.show();
		}
	});
}

function setFooterLocation(){
	//alert("dheight="+$(document).height()+"; widow height="+$(window).height()+"tekinfo_footer="+$("#tekinfo_footer").height());
	if($("#tekinfo_footer")){
		if( $(window).height() > ($("#tekinfo_main").height() + $("#tekinfo_footer").height()) ){
			
			$("#tekinfo_footer").css("position","fixed");
			$("#tekinfo_footer").css("bottom","0");
			
		}else{
			//alert("relative");
			$("#tekinfo_footer").css("position","relative");
		}
	}
}