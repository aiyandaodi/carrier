// JavaScript Document
//imark.js
var BannerHeight;
var banner_height;
var beforeScrollTop;

/** 加入takall.com 的ymeng.com统计代码 **/
function addCnzzYmeng(){
	var cnzz = document.createElement("script");
	cnzz.src = "https://s11.cnzz.com/z_stat.php?id=4270269&web_id=4270269";
	document.getElementsByTagName('body')[0].appendChild(cnzz);
}

/**
百度统计代码 takall.com
**/
var _hmt = _hmt || [];
function addBaiduTongji(){
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js%3F89eef6e4d64a6ee9cbfa76c304a9f87f";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
  //alert("s="+s);
};

//进入客服后台管理
function goClientService(){
	if (typeof clientService == "function")
		clientService();
}

