// JavaScript Document

//#index_banner 操作
var BANNER_HEIGHT;
var banner_height;
var FOOTER_HEIGHT;
var footer_height;
var beforeScrollTop;

// 返回调用页面（上一页面）
function goBack() {
    tek.core.goBack();
}

// 返回主页面
function goHome() {
    tek.core.goHome();
}

//---------------------------------------------------------------------------------------------------
function showUserInfo() {
    var obj = document.getElementById("user-name");
    if (obj) {
		
        obj.innerHTML = myName /*+ "@" + myLoginIp*/;
    }
    var obj = document.getElementById("user_account");
    if (obj) {
        obj.innerHTML = '<a href="javascript:myUser();"><span class="label label-primary"><i class="fa fa-user-circle-o"></i></span> 我的账户</a>';
    }
    var obj = document.getElementById("user_profile");
    if (obj) {
        obj.innerHTML = '<a href="javascript:goLogout();"><span class="label label-info"><i class="fa fa-sign-out"></i></span> 退出系统</a>';
    }
}

// 显示用户信息
function showUser() {
	
    var user_name = document.getElementById("user-name");
    var label_user = document.getElementById("label_user");
    var label_login = document.getElementById("label_login");
    var label_register = document.getElementById("label_register");

    if (myId && myId > 0) {
        if (label_login)
            label_login.style.display = "none";

        if (label_register)
            label_register.style.display = "none";

        if (user_name) {
            user_name.innerHTML = myName /*+ "@" + myLoginIp*/;
			
        }

        if (label_user){
            label_user.style.display = "block";
		}

    } else {
        if (label_login)
            label_login.style.display = "block";

        if (label_register)
            label_register.style.display = "block";

        if (label_user)
            label_user.style.display = "none";
    }//end if(myId && myId > 0)
}

//function myAccount(){
//	callPage(tek.common.getRootPath()+"http/readbook/account/index.html",encodeURIComponent(location.href),tek.common.getRequestString());
//}

function myUser() {
    window.open(tek.common.getRootPath() + "http/tekinfo/user/read.html?user_id=" + myId, "_blank");
}

function goIcanAudit(){
	window.open(tek.common.getRootPath() + "http/ican/audit/control.html");
}
function goTakallAudit(){
	window.open(tek.common.getRootPath() + "http/takall/audit/control.html");
}
function goTekinfoAudit(){
	window.open(tek.common.getRootPath() + "http/tekinfo/admin/control.html");
}
//---------------------------------------------------------------------------------------------------
function showMessage(msg) {
    showMessageWithTitle("提示信息：", msg, "fblue");
}

function showError(msg) {
    showMessageWithTitle("错误信息：", msg, "fred");
}

/**
 * 显示提示信息。title：提示头；msg: 显示信息; className:显示格式类
 */
function showMessageWithTitle(title, msg, className) {
    var sb = new StringBuffer();
    if (className) {
        sb.append('<p class="');
        sb.append(className);
        sb.append('">');
    }
    sb.append(msg);
    if (className) {
        sb.append('</p>');
    }

    var msgdiv = document.getElementById("message");
    //alert("message:"+msgdiv);
    if (msgdiv) {
        $("#message-modal-dialog-title").html(title);
        msgdiv.innerHTML = sb.toString();
        //alert(msgdiv.innerHTML);
        $('#message-modal-dialog').modal('show', null, 0);
    }
    else
        alert(title + msg);

    var obj = document.getElementById("history-message");
    if (obj) {
        sb = new StringBuffer();
        sb.append('<p class="');
        if (className) {
            sb.append(className);
        } else {
            sb.append("bblue");
        }
        sb.append('">');

        if (typeof getTimeString == "function")
            sb.append(getTimeString());

        sb.append(msg);
        sb.append("</p>");

        obj.insertAdjacentHTML("BeforeEnd", sb.toString());
    }
}

// 选择检索方式检索
function selectSearch(objSelect) {
    if (objSelect) {
        var s = objSelect.value;
        if (s) {
            var objText = document.getElementById("searchText");
            if (objText) {
                var key = objText.value;
                if (key && key.length > 0) {
                    if (s == "Google")
                        tek.common.googleSearch(key);
                    else if (s == "Bing")
                        tek.common.bingSearch(key);
                    else if (s == "Baidu")
                        tek.common.baiduSearch(key);
                    else if (s == "Sogou")
                        tek.common.sogouSearch(key);
                } //end if(key && key.length>0)
                else {
                    showMessage("请输入检索内容");
                } //end if(key && key.length>0) else
            } //end if(obj)
        } //end if(s)
        objSelect.value = "default";
    }
}

// ****************************这个方法将定义为class="vcdiv"的div上下居中 ********************//
function vcdiv() {
    $(".vcdiv").css({
        position: "absolute",
        left: ($(window).width() - $(".vcdiv").outerWidth()) / 2,
        top: ($(window).height() - $(".vcdiv").outerHeight()) / 2 - 20
    });
}

//---------------------------------------------------------------------------------------------------

// 跳转到登录界面
function goLogin() {
	//alert("go login");
	var url=tek.common.getRootPath()+"http/tekinfo/login/login.html";
	//alert("url="+url);
	tek.common.callPage(url, location.href);
}

// 跳转到注销页面
function goLogout() {
  tek.common.callPage(tek.common.getRootPath()+"http/tekinfo/login/logout.html", location.href);
}

// 跳转到注册页面
function goRegister() {
  tek.common.callPage(tek.common.getRootPath()+"http/tekinfo/login/register.html", location.href);
}

/** 加入tekinfo.net 的ymeng.com统计代码 **/
function addCnzzYmeng(){
	var cnzz = document.createElement("script");
	cnzz.src = "https://s11.cnzz.com/z_stat.php?id=5697882&web_id=5697882";
	document.getElementsByTagName('body')[0].appendChild(cnzz);
}

/**
百度统计代码 tekinfo.net
**/
var _hmt = _hmt || [];
function addBaiduTongji(){
  
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?703b98aa2c2b5b023c1f9db31d4e2511";
  	var s = document.getElementsByTagName("script")[0]; 
	s.parentNode.insertBefore(hm, s);
		
  //alert("s="+s);
};



function getScrollTop(){
	
	return window.pageYOffset  //用于FF
                || document.documentElement.scrollTop  
                || document.body.scrollTop  
                || 0;
}

/**
判断指定区间上滚还是下滚
**/
function scrollPage() {
	//alert("fn="+fn);
	banner_height=$("#index_banner").height();
	if(!BANNER_HEIGHT || BANNER_HEIGHT==0)
		BANNER_HEIGHT=banner_height;
		
	footer_height=$("#tekinfo_footer").height();
	if(!FOOTER_HEIGHT || FOOTER_HEIGHT==0)
		FOOTER_HEIGHT=footer_height;
	//alert("00000 BANNER_HEIGHT="+BANNER_HEIGHT+";banner_height="+banner_height);
    beforeScrollTop = getScrollTop();
		
    window.addEventListener("scroll", function(e) {
        //e = event || window.event;
		e.preventDefault();
		
		var afterScrollTop = getScrollTop();
        var delta = parseInt(afterScrollTop) - parseInt(beforeScrollTop);
		
		//alert("delta="+delta);
		if(parseInt(delta) < 0){ //上滚
			if(typeof scrollUp == "function"){
				scrollUp();
			}
			beforeScrollTop = afterScrollTop;
			
		}if(parseInt(delta) > 0){ //下滚
			if(typeof scrollDown == "function"){
				scrollDown();
			}
			beforeScrollTop = afterScrollTop;
		}
		
		//beforeScrollTop = afterScrollTop;
        
		var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight > scrollHeight-20) {  //滚动到底部执行事件
            if(typeof scrollToBottom == "function"){
				scrollToBottom();
			}
        }else if (scrollTop==0) {  //滚动到顶部执行事件
            if(typeof scrollToTop == "function"){
				scrollToTop();
			}
        }
    });
}

/**回到页面顶部**/
function scrollToTop(){
	//alert("top");
				
	banner_height=$("#index_banner").height();
	//alert("banner_height="+banner_height+";BANNER_HEIGHT="+BANNER_HEIGHT);
	if(banner_height<=0){
		$("#index_banner").stop().animate({
			height: BANNER_HEIGHT+"px",
			opacity: "1"
		},500,function(){
			$("#index_banner").height(BANNER_HEIGHT);
			if($("#index_banner").css("position")!="relative")
				$("#index_banner").css("position","relative");
			//alert("height="+$("#index_banner").height()+";B="+BANNER_HEIGHT);
		});
	}
}

/**回到页面底部
function scrollToBottom(){
	//alert("bottom");
			
	footer_height=$("#tekinfo_footer").height();
	//alert("footer_height="+footer_height+";FOOTER_HEIGHT="+FOOTER_HEIGHT);
	if(footer_height<=0){
		//alert("111footer_height="+footer_height+";FOOTER_HEIGHT="+FOOTER_HEIGHT);
		$("#tekinfo_footer").stop().animate({
			height: FOOTER_HEIGHT+"px",
			opacity: "1"
		},500,function(){
			//alert("222 footer_height="+footer_height+";FOOTER_HEIGHT="+FOOTER_HEIGHT);
			$("#tekinfo_footer").height(FOOTER_HEIGHT);
			if($("#tekinfo_footer").css("position")!="relative"){
				$("#tekinfo_footer").css("position","relative");
			}
			//alert("height="+$("#tekinfo_footer").height()+";B="+FOOTER_HEIGHT);
		});
	}
}**/

/** 向上滚动 **/
function scrollDown(){
	
	//if($("#index_banner").css("position")!="fixed")
		//$("#index_banner").css("position","fixed");	
	banner_height=$("#index_banner").height();
	//alert("up banner_height="+banner_height+";B="+BANNER_HEIGHT);
	if(!banner_height || banner_height<=BANNER_HEIGHT){
	   //alert("111");
		$("#index_banner").stop().animate({
			height: BANNER_HEIGHT+"px",
			opacity: "0.9"
		},500);
	}
	
	if($("#pop_menu").css("opacity")!="0"){
		//alert("pop");
		$("#pop_menu").stop().animate({
			opacity: "0"
		},500);
	}
}

/** 向下滚动 **/
function scrollUp(){
	//alert("down");
	if($("#index_banner").css("position")!="fixed"){
		$("#index_banner").css("position","fixed");
		$("#index_banner").css("top","-3px");
	}
		
	banner_height=$("#index_banner").height();
	//alert("down banner_height="+banner_height);
	if(banner_height>=0){
		//alert('11banner_height='+banner_height);
		$("#index_banner").stop().animate({
			height: 0,
			opacity: "0"
		},500);
	}
	
	if($("#tekinfo_footer").css("position")!="fixed"){
		//$("#tekinfo_footer").css("position","fixed");
		//$("#tekinfo_footer").css("top","0");
	}
	/**底部条	
	tekinfo_height=$("#tekinfo_footer").height();
	//alert("down banner_height="+banner_height);
	if(tekinfo_height>=0){
		//alert('11banner_height='+banner_height);
		$("#tekinfo_footer").stop().animate({
			height: 0,
			opacity: "0"
		},500);
	}**/

	if($("#pop_menu").css("opacity")!="1"){
		
		$("#pop_menu").stop().animate({
			opacity: "1"
		},500);
	}
}

/*回到顶部*/
function toTop(){
	$('html, body').animate({
		'scroll-top': 0,
	}, 300);
	
	popmenu_close();
	
}

/**
加载CSS文件
**/
function loadCSS(cssfile){
	$("head").append("<link>");
	var css = $("head").children(":last");
	css.attr({
		rel:  "stylesheet",
		type: "text/css",
		href: cssfile
	});
}

//加载 js 文件
function loadJavascript(jsfile) {
	//alert("jsfile="+jsfile);
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
	//alert("script="+script);
    script.src = jsfile;
    script.type = 'text/javascript';
	//alert("111 script="+script+";head="+head);
    head.appendChild(script);
}

/**
卸载CSS文件
**/
function unloadCSS(cssfile){
	
}

/**
卸载js文件
**/
function unloadJavascript(jsfile){
	
}


/**
导航栏
**/
/* Navigation */

function initNavbar(){
  
   $(".has_sub > a").click(function(e){
    e.preventDefault();
    var menu_li = $(this).parent("li");
    var menu_ul = $(this).next("ul");

    if(menu_li.hasClass("open")){
      menu_ul.slideUp(350);
      menu_li.removeClass("open")
    }
    else{
      $("#nav > li > ul").slideUp(350);
      $("#nav > li").removeClass("open");
      menu_ul.slideDown(350);
      menu_li.addClass("open");
    }
  });
};

function initSidebar(){
  $(".sidebar-dropdown a").on('click',function(e){
      e.preventDefault();

      if(!$(this).hasClass("open")) {
        // open our new menu and add the open class
        $(".sidebar #nav").slideDown(350);
        $(this).addClass("open");
      }
      
      else{
        $(".sidebar #nav").slideUp(350);
        $(this).removeClass("open");
      }
  });
};

/**
设置  jquery timeicker 的时间语言
*/
function setChineseTime(){
	
	$.datepicker.regional["zh-CN"] = {
		currentText: '当前时间',
		clearText: '清除',
        clearStatus: '清除已选日期',
        closeText: '关闭',
        closeStatus: '不改变当前选择',
        prevText: '<上月',
        prevStatus: '显示上月',
        prevBigText: '<<',
        prevBigStatus: '显示上一年',
        nextText: '下月>',
        nextStatus: '显示下月',
        nextBigText: '>>',
        nextBigStatus: '显示下一年',
        currentText: '今天',
        
		currentStatus: '显示本月',
		monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], 
		monthNamesShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"], 
		
		monthStatus: '选择月份',
        yearStatus: '选择年份',
        weekHeader: '周',
        weekStatus: '年内周次',
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"], 
        dayStatus: '设置 DD 为一周起始',
        dateStatus: '选择 m月 d日, DD',
        dateFormat: 'yy-mm-dd',
		weekHeader: "周", 
        firstDay: 1,
        initStatus: '请选择日期',
		showMonthAfterYear: !0, 
		yearSuffix: "年",
        isRTL: false
	}
	$.datepicker.setDefaults($.datepicker.regional["zh-CN"]);
}


//---------- 更改 tekinfo_Layer 的颜色 -----------------
var TEKINFO_LAYER_COLORS=new Array(
	"#A3E3DF",
	"#CCE3F5",
	"#E7A9F2",
	"#ED959F",
	"#E2B575",
	"#98DA7E",
	"#FFFFFF"
);
var tekinfo_color_counts=0;

function changeTekinfoLayerColor(){
	//alert("000 TEKINFO_LAYER_COLORS="+TEKINFO_LAYER_COLORS);
	if(TEKINFO_LAYER_COLORS && TEKINFO_LAYER_COLORS.length>0){
		//alert("TEKINFO_LAYER_COLORS-length="+TEKINFO_LAYER_COLORS.length+";tekinfo_color_counts="+tekinfo_color_counts);
		if(tekinfo_color_counts<0 || tekinfo_color_counts>TEKINFO_LAYER_COLORS.length-1)
			tekinfo_color_counts=0;
		if(tekinfo_color_counts<TEKINFO_LAYER_COLORS.length){
			$("#tekinfo_Layer").css("background-color",TEKINFO_LAYER_COLORS[tekinfo_color_counts]);
			tekinfo_color_counts++;
		}
	} //end if(TEKINFO_LAYER_COLORS && TEKINFO_LAYER_COLORS.length>0)
}