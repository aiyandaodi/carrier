// JavaScript Document pop-menu
// 调用参数
var POPMENU_MENU_HEIGHT=460;  //弹出菜单高度
var POPMENU_LIST_HEIGHT=360; //弹出列表高度
//

var loadOptionFinish=false; //是否已经加载配置信息

function popmenu_start(){
	$(function () {
		$('.ui-tooltip').tooltip();
	});
	//alert("enable popmenu");
	
	var menu_height=0,list_height=0;
	//alert("1 menu_height="+menu_height);
	if(typeof(_POPMENU_MENU_HEIGHT)!=="undefined")
		menu_height=_POPMENU_MENU_HEIGHT;
	if(typeof(_POPMENU_LIST_HEIGHT)!=="undefined")
		list_height=_POPMENU_LIST_HEIGHT;
	
	if(menu_height<10){
		menu_height=POPMENU_MENU_HEIGHT;
	}
	if(list_height<10){
		list_height=POPMENU_LIST_HEIGHT;
	}
	//alert($(".menu-body").length);
	if($(".popmenu").length){
		$("a.popmenu-btn").unbind("click").click(function(e){
			e.preventDefault();
			$("a.popmenu-btn").attr("disabled",true);
			//alert(" this class="+$(this).attr("class"));
			if(!($(this).hasClass("active"))){

				$("#popmenu_Layer").height($(document).height());
				$("#popmenu_Layer").show(1000);
				
				if($(".menu-body").length){
					$(".menu-body").animate({
						height: menu_height+"px",
						opacity: "1"
					});
				}
				
				if($(".ui-list").length){
					$(".ui-list").animate({
						height: list_height+"px",
						opacity: "1"
					});
				}
						
				$(this).addClass("active");
				
			}else{
				$("#popmenu_Layer").hide(1000);
				
				if($(".menu-body").length){
					$(".menu-body").animate({
						height: "0",
						opacity: "0"
					});
				}
				
				if($(".ui-list").length){
					$(".ui-list").animate({
						height: "0px",
						opacity: "0"
					});
				}
				$(this).removeClass("active");
			}
			$("a.popmenu-btn").attr("disabled","disabled");
		});
	}
}

function popmenu_close(){
	$("#popmenu_Layer").hide(1000);
	$(".menu-body").animate({
		height: "0",
		opacity: "0"
	});
	$("a.popmenu-btn").removeClass("active");
	
	if(loadOptionFinish)
		closeSystemOption();
}

function popmenu_totop(){
	$(".totop").hide();
	
	$(window).scroll(function(){
		if ($(this).scrollTop() > 300) {
			$('.totop').fadeIn();
		} else {
			$('.totop').fadeOut();
		}
	});
	$(".totop a").click(function(e) {
		e.preventDefault();
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;
	});
}

/**
弹出菜单，点击检索
**/
function popmenuInputSearch(){
	$("#pop_foot_menu").addClass("hide");
	
	$("#pop_foot_search").removeClass("hide");
	$("#quick_search").focus().select();
}

/**
弹出菜单检索框后，点击检索按钮
**/
function popmenuQuickSearch(){
	$("#pop_foot_search").addClass("hide");
	$("#pop_foot_menu").removeClass("hide");
	
	if(typeof quickSearch == "function"){
		quickSearch();
	}
	
	popmenu_close();
}

//触屏左滑
function touchScreenRightToLeft(){
	//alert("right to left");
	var isGo=false;
	var liobj=$("#pop_menu_item").children("li");
	//alert("liobj="+liobj+";l="+liobj.length);
	if(liobj){
		for(var i=0;i<liobj.length;i++){
			//alert("i="+i+";liobj[i]="+liobj[i]);
			
			var href=$(liobj[i]).children("a").get(0);
			//alert("href="+href);
			//alert("pathname="+window.location.href);
			if(window.location.href==href){
				//alert("prev="+prev);
				if(i==0){
					showSystemOption();
					isGo=true;
				}else{
					//alert("go prev="+$(liobj[i-1]).children("a").get(0));
					$(liobj[i-1]).children("a").get(0).click();
					isGo=true;
				}
			} //end if(window.location.href==href) else
		} //end for(var i=0;i<liobj.length;i++)
		if(!isGo)
			$(liobj[liobj.length-1]).children("a").get(0).click();
	}else{
		history.go(-1);
	} //end if(liobj)
}

//触屏右滑
function touchScreenLeftToRight(){
	//alert("left to right");

	var liobj=$("#pop_menu_item").children("li");
	//alert("liobj="+liobj+";l="+liobj.length);
	if(liobj){
		for(var i=0;i<liobj.length;i++){
			//alert("i="+i+";liobj[i]="+liobj[i]);
			
			var href=$(liobj[i]).children("a").get(0);
			//alert("href="+href);

			if(window.location.href==href){
				
				if(i==0){
					if(loadOptionFinish){
						closeSystemOption();
						loadOptionFinish=false;
						break;
					}
				} //end if(i==0)
				
				if(i<liobj.length-1){
					//alert("click");
					$(liobj[i+1]).children("a").get(0).click();
					break;
				}else{
					//alert("end i="+i);
					openUserResume();
				}
			}//end if(window.location.href==href)
		} //end for(var i=0;i<liobj.length;i++)
	}
}

function showSystemOption(){
	$("#option_Layer").height($(document).height());
	$("#option_Layer").show(1000);
	
	if(!loadOptionFinish){
		var url=tek.common.getRootPath()+"http/ican/option/read.html";
		var cssurl=tek.common.getRootPath()+"http/ican/option/read.css";
		$("#option_Layer").load(url);
		loadHeadFile(cssurl,"css");
		loadOptionFinish=true;
	}
}

function openUserResume(){
	//alert("obj="+$("#go_resume"));
	var url=$("#go_resume").attr("href");
	//alert("go url="+url);
	if(url){
		window.location.href=url;
	}else{
		url=	tek.common.getRootPath()+"http/ican/resume/read.html";
		window.open(url);
	}
}

function closeSystemOption(){
	$("#option_Layer").height($(document).height());
	$("#option_Layer").hide(1000);
}

// 载入头文件JavaScript／CSS
function loadHeadFile(filename,filetype){

    if(filetype == "js"){
        var fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src",filename);
    }else if(filetype == "css"){
    
        var fileref = document.createElement('link');
        fileref.setAttribute("rel","stylesheet");
        fileref.setAttribute("type","text/css");
        fileref.setAttribute("href",filename);
    }
   if(typeof fileref != "undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}