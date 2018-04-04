/**************************************************
 * 说明：
 *   该JS文件用于使用macadmin-5.0样式生成的登录页面的相关操作。
 * 要求：
 *   需要HTML页面包含id="waiting-modal-dialog"标签的等待图层。
 *   需要加载 common.js、login.js、mac-common.js
 *-------------------------------------------------------------------------------------------------
 * 公共参数&函数：
 *     function login(); - 本地登录
 *     function iRegister(); - 跳转到iPass注册页面
 *     function iLogin(); - 跳转到iPass登录页面
 **************************************************/
//=====================================================Function===============================

//登录
function login() {
	var params = tek.common.getSerializeObjectParameters("login_form");
	$("#username-msg").html("");
	$("#password-msg").html("");
	var userlogin = params["userlogin"];
	if (!userlogin || userlogin == "") {
		showError("请输入用户名！");
		$("#userlogin").focus();
		return;
	}
	var password = params["password"];
	if (!password && password == "") {
		showError("请输入保密字！");
		$("#password").focus();
		return;
	}

	$("#message").html("");

	$("#userlogin").blur();
	$("#password").blur();
//alert("go localLogin,params="+params+";tek.login.localLogin="+tek.login.localLogin+";type="+(typeof tek.login.localLogin));
	if(typeof tek.login.localLogin == "function"){
		//alert("go localLogin,params="+params);
		tek.login.localLogin(params);
	}else
		showError("没有登录函数");
	
	//alert("go localLogin end");
}

// 本地登录成功后回调（tek.login.localLogin()返回success时调用）
tek.login.localLoginSuccess = function (data) {
	$("#my_icon").attr("src", myIcon);
	if (tek.common.isLoggedIn())
		showLoginBar();
};

//登录标签框切换
function showLoginBar() {
	$("#user_name").html("");
	$("#user_lastestTime").html("");
	$("#user_lastestIp").html("");

	$("#login_area").hide();
	$("#success_area").show();

	$("#user_name").html(myName);//myName
	if (myLoginTime && myLoginTime.length >= 19)
		$("#user_lastestTime").html(myLoginTime.substring(5));
	else
		$("#user_lastestTime").html(myLoginTime);
	$("#user_lastestIp").html(myLoginIp);
}

// 跳转到ipass登录页面
function iLogin() {
	var msg = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif' width='16'/>  正在跳转到登录页面，请稍后...";
	tek.macCommon.waitDialogShow(null, msg, null, 2);

	tek.common.ipassLogin();
}

// 跳转到ipass注册页面
function iRegister() {
	var msg = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif' width='16'/>  正在跳转到注册页面，请稍后...";
	tek.macCommon.waitDialogShow(null, msg, null, 2);

	tek.common.ipassRegister();
}

// 跳转到登录页面
function promptLogin() {
  if (parent != window) {
    parent.goLogin();
  } else {
    tek.macCommon.waitingMessage("<img src='"+tek.common.getRelativePath()+"http/images/waiting-small.gif' width='16'/> &nbsp;正在跳转到登录页面，请稍后...");
    $("#waiting-modal-dialog").modal("show",null,2);
    tek.common.ipassLogin();
  }
}

// 跳转到注册页面
function promptRegister() {
  if (parent != window)
    parent.goRegister();
  else {
    tek.macCommon.waitingMessage("<img src='"+tek.common.getRelativePath()+"http/images/waiting-small.gif' width='16'/> &nbsp;正在跳转到注册页面，请稍后...");
    $("#waiting-modal-dialog").modal("show",null,2);

    tek.common.ipassRegister();
  }
}