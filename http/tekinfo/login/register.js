// JavaScript Document
//Register

/**
 * 初始化默认的底部按钮（提交）
 *
 * @param parentId
 *           父元素标识
 */
function initialButton(parentId) {
    var sb = new StringBuffer();
    sb.append("<button type='submit' id='submitBtn' class='btn btn-danger'>提交</button>");
    //sb.append("<button type='submit' id='loginBtn' class='btn btn-info'>登录</button>");

    if (showClose == 1) {
        //显示关闭按钮
        sb.append("<button type='button' id='closeBtn' class='btn btn-info' onclick='tek.common.closeWithConfirm();'>关闭</button>");
    } else if (callbackURL) {
        //显示返回按钮
        sb.append("<button type='button' id='callbackBtn' class='btn btn-success' onclick='tek.common.callbackWithConfirm(callbackURL)'>返回</button>");
    } else {
        // 显示“提交”、“重置”
        sb.append("<button type='reset' class='btn btn-success'>重置</button>");
    }

    $("#" + parentId).html(sb.toString());
}

function ennable() {
    if (document.getElementById('agree').checked)
        $("#submitBtn").removeAttr("disabled");
    else
        $("#submitBtn").attr("disabled", "disabled");
}

//注册
/**
 * 验证输入的名字是否符合规则
 *
 * @param input  用户输入的名字
 *
 * return 输入的名字符合规则返回true,否则返回false
 */
function verifyName(input) {
    var name = input.value;
    if (name == "" || !name) {
        $("#registermessage").html("请输入名字！");
        return false;
    }

    // 不在JS判断长度
    /*if(name.length>32
     || (name.length <= 6 && (!myId || mySecurity<240))) {
     $("#registermessage").html("名字必须是6~32位！");
     return false;
     }*/

    //var patrn=/^[a-zA-Z]{1}([a-zA-Z0-9]|[._-]){1,19}$/;
    var pattern = /^[\u4e00-\u9fa5\da-zA-Z\s._-]+$/;
    if (!pattern.test(name)) {
        $("#registermessage").html("名字格式不正确！（必须是4~32位，以中文或字母开头，以中文、字母或数字结尾，且只能包含中文、字母、数字、”.”、”_”、”-”）");
        $("#name").focus();
        $("#name").select();
        return false;
    } else {
        $("#registermessage").html("");
        return true;
    }
}
/**
 * 验证输入的登录名是否符合规则
 *
 * @param input  用户输入的登录名
 *
 * return 登录名符合规则返回true,否则返回false
 */
function verifyLogin(input) {
    var login = input.value;
    if (login == "" || !login) {
        $("#registermessage").html("请输入用户名！");
        return false;
    }

    // 不在JS判断长度
    if (login.length > 32
        || (login.length <= 2)) {
        $("#registermessage").html("登录名必须是4~32位字符！");
        return false;
    }

    //var patrn=/^[a-zA-Z]{1}([a-zA-Z0-9]|[._-]){1,19}$/;
    var patrn = /^[\da-zA-Z._-]+$/;
    if (!patrn.test(login)) {
        $("#registermessage").html("登录名格式不正确！（必须是3~32位，开头结尾必须是字母或数字，且只能包含字母、数字、”.”、”_”、”-”）");
        //$("#username").focus();
        //$("#username").select();
        return false;
    } else {
        $("#registermessage").html("");
        return true;
    }
}
/**
 * 验证输入密码是否符合规范
 *
 * @param input  用户输入的确认密码
 *
 * return 密码符合规则返回true,否则返回false
 */
function verifyPassword(input) {
    var s = input.value;
    var patrn = /^[\w~!@$^*-=\|]+$/;

    if (input.value == "" || !input.value)//是否为空
    {
        $("#registermessage").html("请输入密码!");
        return false;
    } else if (s.length < 6 || s.length > 24) {//是否6-24位
        $("#registermessage").html("密码不符合规则，必须是6~24位，以字母、数字开头结尾，有效字符包括字母、数字、“~”、“!”、“@”、“$”、“^”、“*”、“-”、“_”、“=”、“|”，非顺序字符，至少包含5中不同的字符！");
        $("#password").focus();
        $("#password").select();
        return false;
    }
    else if (!patrn.test(s)) {
        $("#registermessage").html("密码不符合规则，必须是6~24位，以字母、数字开头结尾，有效字符包括字母、数字、“~”、“!”、“@”、“$”、“^”、“*”、“-”、“_”、“=”、“|”，非顺序字符，至少包含5中不同的字符！");
        $("#password").focus();
        $("#password").select();
        return false;
    }
    else if (isSame(s)) {//是否全为一样的字符
        $("#registermessage").html("密码不符合规则，必须是6~24位，以字母、数字开头结尾，有效字符包括字母、数字、“~”、“!”、“@”、“$”、“^”、“*”、“-”、“_”、“=”、“|”，非顺序字符，至少包含5中不同的字符！");
        $("#password").focus();
        $("#password").select();
        return false;
    }
    else if (isOrder(s)) {//是否顺序字符
        $("#registermessage").html("密码不符合规则，必须是6~24位，以字母、数字开头结尾，有效字符包括字母、数字、“~”、“!”、“@”、“$”、“^”、“*”、“-”、“_”、“=”、“|”，非顺序字符，至少包含5中不同的字符！");
        $("#password").focus();
        $("#password").select();
        return false;
    } else {
        $("#registermessage").html("");
        return true;
    }
}

/**
 * 验证密码的强度
 *
 * @param input  用户输入的密码
 */
function verifyPasswordStrong(input) {
    $("#weak,#normal,#strong").css("background", "#dde1df");

    var password = input.value;
    if (password && password != "") {
        var strong = tek.dataUtility.getPasswordStrong(password);
        switch (strong) {
            case 1:
                //中密码
                $("#normal").css("background", "#EEAD0E");
                break;
            case 2:
                //强密码
                $("#strong").css("background", "#00EE00");
                break;
            default:
                //弱密码
                $("#weak").css("background", "#f87d7d");
                break;
        } // end switch(strong)
    }
}
/**
 * 验证再次输入的密码是否正确
 *
 * @param input  用户输入的确认密码
 *
 * return 再次输入的密码正确返回true,否则返回false
 */
function verifyPasswordAgain(input) {
    var passwordText;
    var password = document.getElementById("password");
    if (password)
        passwordText = password.value;

    var repasswordText;
    var repassword = document.getElementById("repassword");
    if (repassword)
        repasswordText = repassword.value;
    if (repasswordText == "" || !repasswordText) {
        $("#registermessage").html("请输入确认密码!");
        return false;
    }

    if (!repasswordText || repasswordText != passwordText) {
        $("#registermessage").html("密码不一致！");
        return false;
    } else {
        $("#registermessage").html("");
        return true;
    }
}
/**
 * 验证邮箱的格式是否正确
 *
 * @param input  用户输入的邮箱
 *
 * return 符合邮箱格式返回true,否则返回false
 */
function verifyMail(input) {
    if (input.value == "" || !input.value) {
        $("#registermessage").html("请输入验证邮箱!");
        return false;
    }

    if (!tek.dataUtility.isCertificateEmail(input.value)) {
        $("#registermessage").html("邮箱地址格式不正确！");
        return false;
    } else {
        $("#registermessage").html("");
        return true;
    }
}

/**
 * 验证电话号码的格式是否正确
 *
 * @param input  用户输入的电话号码
 *
 * return 符合电话号码格式返回true,否则返回false
 */
function verifyMobile(input) {	//mobile
    if (input.value == "" || !input.value) {
        $("#registermessage").html("请输入手机号码!");
        return false;
    }

    if (!tek.dataUtility.isCertificatePhone(input.value)) {
        $("#registermessage").html("手机号码格式不正确！");
        return false;
    } else {
        $("#registermessage").html("");
        return true;
    }
}

/**
 * 验证码是否正确
 *
 * @param input  用户输入的验证码
 *
 * return 符合验证码格式返回true,否则返回false
 */
function verifyActive(input) {
    if (input.value == "" || !input.value) {
        $("#registermessage").html("请输入验证码!");
        return false;
    }

    if (!tek.type.isNumber(input.value)) {
        $("#registermessage").html("验证码格式不正确！");
        return false;
    } else {
        $("#registermessage").html("");
        return true;
    }
}

function register() {
    var form = document.getElementById("register_form");
    if (!form) {
        showError("页面设置有误，请和管理员联系！");
        return;
    }

    if (!form.name && !form.username && !form.password && !form.email && !form.mobile) {
        showError("没有填写合法的注册信息！");
        return;
    }

    var nameText = form.name.value;
    //verifyName(form.name);
    if (!verifyName(form.name)) {
        //$("#registermessage").html("请输入名字！");
        $("#name").focus();
        return;
    }

    var usernameText = form.username.value;
    //verifyLogin(form.username);
    if (!verifyLogin(form.username)
        || $("#username-label").hasClass("text-danger")) {
        //$("#registermessage").html("请输入用户名！");
        $("#username").focus();
        return;
    }
    //loginIsExist(usernameText);

    var passwordText = form.password.value;
    //verifyPassword(form.password);
    if (!verifyPassword(form.password)) {
        $("#password").focus();
        $("#password").select();
        return;
    }

    var repasswordText = form.repassword.value;
    //verifyPasswordAgain(form.repassword);
    if (!verifyPasswordAgain(form.repassword)) {
        $("#repassword").focus();
        $("#repassword").select();
        return;
    }

    var emailText = form.email.value;
    //verifyMail(form.email);
    if (!verifyMail(form.email)
        || $("#email-label").hasClass("text-danger")) {
        $("#email").focus();
        $("#email").select();
        return;
    }

    var mobileText = form.mobile.value;
    //verifyMobile(form.mobile);
    if (!verifyMobile(form.mobile)
        || $("#mobile-label").hasClass("text-danger")) {
        $("#mobile").focus();
        $("#mobile").select();
        return;
    }

    if(!$("#active-div").hasClass("hide")) {
		var activeText = form.active.value;
		//verifyMobile(form.mobile);
		if (!verifyActive(form.active)
			|| $("#active-label").hasClass("text-danger")) {
			$("#active").focus();
			$("#active").select();
			return;
		}
	}
	
    //显示等待图层
    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>  正在提交...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var params = {};
    params["type"] = "post";
    params["url"] = tek.common.getRootPath() + "servlet/account";

    params["params"] = {};
    //params["params"]["action"]="agent",
    params["params"]["objectName"] = "Account";
    params["params"]["action"] = "addInfo";
    params["params"]["account_name"] = nameText;
    params["params"]["account_login"] = usernameText;
    params["params"]["account_password"] = encodeURI(passwordText);
    params["params"]["account_confirm"] = encodeURI(repasswordText);
    params["params"]["account_email"] = emailText;
    params["params"]["account_mobile"] = mobileText;
	params["params"]["active"]=activeText;
    if ($("input[name='account_auth']"))
        params["params"]["account_auth"] = $("input[name='account_auth']").val();

    var role = 0;
    $('input[name="user_role"]:checked').each(function () {
        role |= parseInt($(this).val());
    });
    params["user_role"] = role;

    params["success"] = function (data) {
        // 操作成功
        if (updateOpener == 1) {
            // 刷新父页面
            tek.refresh.refreshOpener();
        }

        var msg = tek.dataUtility.stringToHTML(data.message) || "注册成功!";
        if (showClose == 1) {
            // 关闭
            var timerMsg = "页面<font id='counter' color='red'></font>秒后自动关闭";
            tek.macCommon.waitDialogShow(null, msg, timerMsg);
            tek.macCommon.waitDialogHide(3000, "window.close()");

        } else if (callbackURL && callbackURL.length > 0) {
            // 跳转
            var timerMsg = "页面<font id='counter' color='red'></font>秒后自动跳转";
            tek.macCommon.waitDialogShow(null, msg, timerMsg);
            tek.macCommon.waitDialogHide(3000, "location.href='" + callbackURL + "';");

        } else {
            tek.macCommon.waitDialogShow(null, msg);
        }
    }
    params["error"] = function (data, message) {
        tek.macCommon.waitDialogShow(null, message);
    }
    tek.common.ajax2(params);
}
/**
 * 注册成功后返回登录页面
 *
 */
function showLogin() {
    //alert(parent);
    if (parent && parent != self) {
        if (parent.showLogin) {
            if (typeof(parent.showLogin) == "function") {
                parent.showLogin();
                return;
            }
        } //end if(parent.showLogin)
    }

    tek.common.callPage("login.html", callbackURL);
}

function showAuth() {
    $.ajax({
        type: "post",
        url: "../../../servlet/tobject",
        dataType: "json",
        data: {
            "objectName": "Account",
            "action": "getNew",
        },
        success: function (data) {
            if (data) {
                if (data.code == 0) {
                    // 操作成功
                    var record = data.record;
                    if (record)// 取得初始化数据
                    {
                        //如果不是系统管理员，则不显示安全认证
                        if (record.account_auth) {
                            // 系统管理员
                            $("#message").html("");
                            $("#have-id").html("");
							$("#active-div").addClass("hide");
                            $("#protocol-div").css("display", "none");
                            $("#certificate-div").css("display", "");
                            $("#role-div").css("display", "");
                            $("#agree").attr("checked", "checked");
                            $("#submitBtn").removeAttr("disabled");
                            $("#role-div").removeClass("hide");

                        } else {
                            // 非系统管理员
                        }

                        ennable();

                        if (record.account_auth && record.account_auth.selects) {
                            var sb = new StringBuffer();
                            for (i = 1; i < record.account_auth.selects.length; i++) {
                                sb.append("<div class=' col-xs-6'>")
                                sb.append("<input class=' col-xs-2' id='");
                                sb.append(record.account_auth.name);
                                sb.append("-");
                                sb.append(record.account_auth.selects[i]);
                                sb.append("' name='");
                                sb.append(record.account_auth.name);
                                sb.append("' value='");
                                sb.append(record.account_auth.selects[i]);
                                sb.append("' type='checkbox'");
                                if (record.account_auth.selects[i] == record.account_auth.value)
                                    sb.append(" checked='checked'");
                                sb.append("/>  ");

                                sb.append("<label for='");
                                sb.append(record.account_auth.name);
                                sb.append("-");
                                sb.append(record.account_auth.selects[i]);
                                sb.append("'>");
                                sb.append(record.account_auth.shows[i]);
                                sb.append("</label>");
                                sb.append("</div>");
                            }

                            var obj = document.getElementById("certificate");
                            if (obj) {
                                obj.insertAdjacentHTML('BeforeEnd', sb.toString());
                            }
                        }

                    }
                } else {
                    // 操作错误
                    tek.macCommon.waitDialogShow(null, data.message, null, 2);
                }
            } else {
                tek.macCommon.waitDialogShow(null, "执行错误!", null, 2);
            }
        },
        error: function () {
            tek.macCommon.waitDialogShow(null, "操作失败!", null, 2);
        }
    });
}
/**
 * 判断密码是否都是数字
 *
 * @param psw  用户输入密码
 *
 * return 都是数字返回true,否则返回false
 */
function isNum(psw) {
    for (var i = 0; i < psw.length; i++) {
        if (!isNaN(psw.charAt(i))) {
            continue;
        }
        return false;
    }
    return true;
}
/**
 * 判断密码是否由相同字符组成
 *
 * @param psw  用户输入密码
 *
 * return 相同字符组成返回true,否则返回false
 */
function isSame(psw) {
    var first = psw.charAt(0);
    for (var i = 1; i < psw.length; i++) {
        if (first == psw.charAt(i)) {
            continue;
        }
        return false;
    }
    return true;
}
/**
 * 判断密码是否由相邻字符组成
 *
 * @param psw  用户输入密码
 *
 * return 相邻字符组成返回true,否则返回false
 */
function isOrder(psw) {
    var big = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";//大写字符串
    var bigReverse = "ZYXWVUTSRQPONMLKJIHGFEDCBA";//大写字符串倒序
    var small = "abcdefghijklmnopqrstuvwxyz";//小写字符串
    var smallReverse = "zyxwvutsrqponmlkjihgfedcba";//小写字符串倒序
    var little = /^[a-z]+$/;
    if (little.test(psw)) {//若字符串都为小写字母，则进行小写匹配
        if (small.indexOf(psw) == -1 && smallReverse.indexOf(psw) == -1) {//匹配成功返回true，失败返回false
            return false;
        } else {
            return true;
        }
    } else {//否则，进行大写匹配
        if (big.indexOf(psw) == -1 && bigReverse.indexOf(psw) == -1) {//匹配成功返回true，失败返回false
            return false;
        } else {
            return true;
        }
    }
}

/**
 * 判断用户名和取得已注册的用户名
 *
 * @param username  用户输入的登录名
 */
function leagalAndExist(username) {
    if (verifyLogin(username))
        loginIsExist(username);
}

/**
 * 判断Email或Mobile
 *
 */
function authorityLeagalAndExist(type, input) {
    var flag = false;
    if (type == 1)
        flag = verifyMobile(input);
    else if (type == 2)
        flag = verifyMail(input);
    if (flag)
        authorityIsExist(type, input);
}

/**
 * 登录名是否已经存在。
 *
 * @param usernameText
 *            用户输入的登录名
 */
function loginIsExist(usernameText) {
    $("#registermessage").html("");
    var params = {};
    params["action"] = "getTotal";
    params["objectName"] = "Account";
    params["info-exist"] = 1;
    params["account_login"] = usernameText.value;

    $.ajax({
        type: "post",
        url: tek.common.getRootPath() + "servlet/account",
        dataType: "json",
        data: params,
        async: true,
        success: function (data) {
            if (data) {
                if (data.code == 0) {
                    if (data.value > 0) {
                        $("#registermessage").html("登录名已存在，请重新输入！");
                        $("#username-label").addClass("text-danger");
                    } else
                        $("#username-label").removeClass("text-danger");
                }
                else {
                    var error = new StringBuffer();
                    error.append("<font color='red'>检查登录名：");
                    if (data.code)
                        error.append(data.code);
                    error.append(" - ");
                    if (data.message)
                        error.append(tek.dataUtility.stringToHTML(data.message));
                    error.append("</font>");
                    $("#registermessage").html(error.toString());
                }
            } else
                $("#registermessage").html("<font color='red'>检查登录名：操作失败![data=null]</font>");
        },
        error: function (request) {
            var error = new StringBuffer();
            error.append("检查登录名：操作失败![");
            if (request.status)
                error.append(request.status);
            error.append(" - ");
            if (request.response)
                error.append(request.response);
            error.append("]");
            $("#registermessage").html(error.toString());
        }
    });
}

/**
 * Email、Mobile是否已经存在
 *
 * @param type
 *            Authority类型
 * @param input
 *            输入域
 */
function authorityIsExist(type, input) {
    $("#registermessage").html("");

    var params = {};
    params["action"] = "getTotal";
    params["objectName"] = "Authority";
    params["info-exist"] = 1;
    params["authority_type"] = type;
    params["authority_token"] = input.value;
	if(type==1)
		params["authority_status"]=10;

    $.ajax({
        type: "post",
        url: tek.common.getRootPath() + "servlet/tobject",
        dataType: "json",
        data: params,
        async: true,
        success: function (data) {
            if (data) {
                if (data.code == 0) {
                    if (data.value > 0) {
                        if (type == 1) {
                            $("#registermessage").html("手机号码已存在，请重新输入！");
                            $("#mobile-label").addClass("text-danger");
                        } else if (type == 2) {
                            $("#registermessage").html("电子邮箱已存在，请重新输入！");
                            $("#email-label").addClass("text-danger");
                        }
                    } else {
                        if (type == 1) {
                            $("#mobile-label").removeClass("text-danger");
							$("#active-btn").removeAttr("disabled");
						} else if (type == 2)
                            $("#email-label").removeClass("text-danger");
                    }
                } else {
                    var error = new StringBuffer();
                    error.append("<font color='red'>");
                    if (type == 1)
                        error.append("检查手机号码：");
                    else if (type == 2)
                        error.append("检查电子邮箱：");
                    if (data.code)
                        error.append(data.code);
                    error.append(" - ");
                    if (data.message)
                        error.append(tek.dataUtility.stringToHTML(data.message));
                    error.append("</font>");
                    $("#registermessage").html(error.toString());
                }
            } else {
                var error = new StringBuffer();
                error.append("<font color='red'>");
                if (type == 1)
                    error.append("检查手机号码：");
                else if (type == 2)
                    error.append("检查电子邮箱：");
                error.append("操作失败![data=null]</font>");
                $("#registermessage").html(error.toString());
            }
        },
        error: function (request) {
            var error = new StringBuffer();
            if (type == 1)
                error.append("检查手机号码：");
            else if (type == 2)
                error.append("检查电子邮箱：");
            error.append("操作失败![");
            if (request.status)
                error.append(request.status);
            error.append(" - ");
            if (request.response)
                error.append(request.response);
            error.append("]");
            $("#registermessage").html(error.toString());
        }
    });
}

// 发送验证码
function sendActive() {
  // 检查手机号码
  var mobileText = $("#mobile").val();
  if (!verifyMobile(document.getElementById("mobile"))
      || $("#mobile-label").hasClass("text-danger")) {
    $("#mobile").focus();
    $("#mobile").select();
    return;
  }

  // 发送验证码
  $("#active-btn").html("正在发送...");
  $("#active-btn").attr("disabled", "disabled");

  var setting = {};
  var sendData={};
  sendData["objectName"]="Authority";
  sendData["action"]="setInfo";
  sendData["command"]="identity";
  sendData["authority_type"]=1;
  sendData["authority_new"]=mobileText;
  var callback = {
      success: function (data) {
          $("#active-btn").html("已发送(<font id='active-count'>60</font>)");
          $("#active-btn").attr("disabled", "disabled");

          var interval = setInterval(function () {
              var count=$("#active-count").html();
              if(count && tek.type.isNumber(count) && parseInt(count)>1) {
                $("#active-count").html((--count));
              } else {
                $("#active-btn").html("发送验证码");
                $("#active-btn").removeAttr("disabled");
                window.clearInterval(interval);
              }
          }, 1000);
      },
      error: function (data, message) {
          tek.macCommon.waitDialogShow(null, message);
          $("#active-btn").html("发送验证码");
          $("#active-btn").removeAttr("disabled");
      }
  };
  tek.common.ajax(tek.common.getRootPath()+"servlet/authority", setting, sendData, callback);
}

