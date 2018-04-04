/***************************************************************************************************
 * 说明：
 *   该JS文件用于使用macadmin-5.0样式的弹出框显示TAKALL登录页面。
 * 要求：
 *   需要加载 common.js、mac-common.js、core.js
 *-------------------------------------------------------------------------------------------------
 * tek.login 公共参数&函数：
 *     function tek.login.initPopAuthLogin(); - 初始化弹出框登录页面
 *     function tek.login.showPopAuthLogin(); - 弹出框显示登录页面（需首先调用appendPopAuthLogin()）
 *     function tek.login.localLogin(params); - 本地登录
 *     function tek.login.isHaveSafePassword(); - 判断是否设置了安全密码
 *     function tek.login.showTimer(); - 显示倒数计时（由 seconds 决定）
 *     function tek.login.goToSafePassword(); - 跳转到设置安全密码页面
 *------------------------------------------------------------------------------------------------
 * 页面可选自定义方法：
 *     function tek.login.showError(errorMsg); - 自定义错误提示。
 *     function tek.login.localLoginSuccess(data); - 自定义AJAX登录成功后的操作。
 ***************************************************************************************************/

(function () {
	// 创建全局变量 tek 作为命名空间
	window.tek = window.tek || {};

	// 定义 login.js 中相关的参数、函数
	tek.login = {};
	(function (login) {
		/**
		 * 初始化弹出框登录页面
		 */
		login.initPopAuthLogin = function () {
			var loginFrame = document.getElementById("loginFrame");
			if (loginFrame)
				return;

			var ele = document.getElementById("login-modal-dialog");
			if (!ele) {
				var html = "<div id='login-modal-dialog' class='modal fade'>"
					+ "<div class='modal-dialog'>"
					+ "<div class='modal-content'>"
					+ "<div id='login-modal-dialog-body' class='modal-body center'>"
					+ "<iframe id='loginFrame' width='100%' height='330' src='' marginwidth='0' marginheight='0' hspace='0' vspace='0' frameborder='0' scrolling='no' allowtransparency='true'></iframe>"
					+ "</div>"
					+ "</div>"
					+ "</div>"
					+ "</div>";
				$(document.body).append(html);
			}
		};

		/**
		 * 显示弹出框登录页面
		 */
		login.showPopAuthLogin = function () {
			var url = tek.common.getRootPath()
				+ "servlet/login?action=request&error-url="
				+ encodeURIComponent(tek.common.getRootPath())
				+ encodeURIComponent("http/error/message.html");
			$("#loginFrame").attr("src", url);
			$("#login-modal-dialog").modal("show");
		};

		//登录成功计时器计时，从几开始倒数到1，seconds >=1
		var seconds = 0;

		/**
		 * 本地登录
		 * @param {Object} params 参数
		 */
		login.localLogin = function (params) {
			if (!params) {
				var msg = "参数错误！";

				if (typeof tek.login.showError == "function") {
					tek.login.showError(msg);
				} else {
					tek.macCommon.waitDialogShow(null, msg, null);
				}

				return;
			}

			var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在登录...";
			tek.macCommon.waitDialogShow(null, html, null, 2);

			var setting = {async: true, operateType: "本地登录"};

			params["action"] = params["action"] || "login";

			var callback = {
				success: function (data) {
					myId = data.my_id;
					myName = data.my_name;

					myLogin = data.my_login;
					mySecurity = data.my_security;
					myLatestedTime = data.my_latestTime;
					myLatestedIp = data.my_latestIp;

					myLoginTime = data.my_loginTime;
					myLoginIp = data.my_loginIp;
					myIcon = data.my_icon;

					tek.macCommon.waitDialogHide();

					seconds = 3;
					//login.isHaveSafePassword();
					login.showTimer();

					if (typeof tek.login.localLoginSuccess == "function")
						tek.login.localLoginSuccess(data);
				},
				error: function (data, message) {
					tek.macCommon.waitDialogShow(null, message, null, 0);
				}
			};

			tek.common.ajax(tek.common.getRootPath() + "servlet/login", setting, params, callback);
		};

		// 是否存在安全密码（boolean值有效，turn存在，false不存在）
		var haveSafePassword = null;

		/**
		 * 判断是否设置了安全密码
		 */
		login.isHaveSafePassword = function () {
			if (tek.type.isBoolean(havaSafePassword))
				return haveSafePassword;

			var setting = {async: false, operateType: "是否有安全密码"};

			var sendData = {
				command: "password",
				objectName: "Authority",
				action: "getEdit",
				authority_type: 160,
				my: 1
			};

			var callback = {
				success: function (data) {
					// 操作成功
					var record = data["record"];
					if (record) {
						haveSafePassword = !!record.authority_password;
					}
				},
				error: function (data, message) {
					if (typeof tek.login.showError == "function") {
						tek.login.showError(message);
					} else {
						tek.macCommon.waitDialogShow(null, message);
					}
				}
			};

			tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

			return haveSafePassword;
		};

		/**
		 * 显示倒数计时（由 seconds 决定）
		 */
		login.showTimer = function () {
			if (seconds >= 1) {
				$("#timer-msg").html("页面<font color=red>" + seconds + "</font>秒后自动跳转");

				seconds--;
				setTimeout("tek.login.showTimer()", 1000);
			} else {
				if (haveSafePassword === false)
					login.goToSafePassword();
				else {
					if (typeof tek.core.goBack == "function")
						tek.core.goBack();
				}
			}
		};

		/**
		 * 跳转到设置安全密码页面
		 */
		login.goToSafePassword = function () {
			var url = tek.common.getRootPath() + "http/tekinfo/authority/edit.html?command=password";
			if (callbackURL)
				url += "&callback-url=" + encodeURIComponent(callbackURL);
			window.location.href = url;
		};

	})(tek.login);

})();
