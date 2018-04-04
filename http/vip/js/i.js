// JavaScript Document
//i.js

// 跳转到登录界面
function goLogin() {
  tek.common.callPage(tek.common.getRootPath()+"http/ican/login/login.html", location.href);
}

// 跳转到注销页面
function goLogout() {
  tek.common.callPage(tek.common.getRootPath()+"http/ican/login/logout.html", location.href);
}

// 跳转到注册页面
function goRegister() {
  tek.common.callPage(tek.common.getRootPath()+"http/ican/login/register.html", location.href);
}

function clientService(){
	var url=tek.common.getRootPath()+"http/ican/audit/control.html";
	//alert("url="+url);
	window.location.href=url;
}

function goTakallService(){
	
	var callBackUrl=tek.common.getRootPath()+"http/ican/audit/control.html";
	var jsurl=tek.common.getRootPath()+"http/ican/js/ican.js";
	var url=tek.common.getRootPath()+"http/takall/audit/control.html?load_js="+jsurl+"&callback-url="+callBackUrl;
	//alert("url="+url+";path="+window.location.pathname+";href="+window.location.href);encodeURIComponent
	window.location.href=url;
}


/** 加入ican.vip 的ymeng.com统计代码 **/
function addCnzzYmeng(){
	var cnzz = document.createElement("script");
	cnzz.src = "https://s11.cnzz.com/z_stat.php?id=1261166554&web_id=1261166554";
	document.getElementsByTagName('body')[0].appendChild(cnzz);
}

/**
百度统计代码ican.vip
**/
var _hmt = _hmt || [];
function addBaiduTongji(){
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?03f62c5cf5ad585febbab4687c1fc512";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
  //alert("s="+s);
};

