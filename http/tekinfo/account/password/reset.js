
function init(){
 
  var login=request["account_login"];
  var ack=request["ack-token"];
  if(login && login.length>0 && ack && ack.length>0) {
    checkReset();
  } else {
    // 账号错误
    $("#error-message").html("参数错误!3秒后自动跳转到“第一步”");
    setInterval("window.location.href='forget.html'", 3000);
  }
}
/**
 * 重置密码
 */
function checkReset() {
  // 提交请求
  var html="<div class='center'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/> 正在获取数据...</div>";
  $("#error-message").html(html);
  
  var url=tek.common.getRootPath()+"servlet/resetPwd";
  var setting={};
  setting["async"]=true;
  setting["type"]="post";
  var params={};
  params["action"]="reset";
  params["account_login"]=request["account_login"];
  params["ack-token"]=request["ack-token"];
  params["check"]=1;

  var callback={};
  callback["success"]=function(data) {
      $("#error-message").html("");
      
      if(data){
        $("#account-div").removeClass("hidden");
        $("#password-div").removeClass("hidden");
        $("#repassword-div").removeClass("hidden");
        //$("#safepassword-div").removeClass("hidden");
        $("#next-div").removeClass("hidden");
        $("#name").html(data.value);
      }
  };
  callback["error"]=function(data, errorMsg) {
      if (errorMsg)
        $("#error-message").html(errorMsg);
  };

  tek.common.ajax(url, setting, params, callback);
}

/**
 * 重置密码
 */
function resetPwd() {
/*  if(!verifyPassword(document.getElementById("password"))){
    $("#password").focus();
    $("#password").select();
    return;
  }

  if(!verifyPasswordAgain(document.getElementById("repassword"))){
    $("#repassword").focus();
    $("#repassword").select();
    return;  
  }*/
  
  /*var security_password = $("#safepwd").val();
  if(!security_password || security_password.length<=0) {
	  showError("请输入安全密码!");  
	  $("#safepwd").focus();
	  return;
  }*/
  
  var newpassword = $("#password").val();
  if(!newpassword || newpassword.length<=0) {
	  showError("请输入新密码!");  
	  $("#password").focus();
	  return;
  }
  
  var repassword = $("#repassword").val();
  if(!repassword || repassword.length<=0) {
	  showError("请再次输入新密码!");  
	  $("#repassword").focus();
	  return;
  }
  var warningstring = tek.dataUtility.isCertificatePassword(newpassword);
  
  //$("#next").attr("disabled","disabled");

  if(warningstring == null){
    $("#error-message").html("");
	//	if(!security_password && security_password == ""){
//			showError("请输入安全密码！");
//			$("#password").focus();
//			return;  
//		}
	
		//if(!newpassword && newpassword == ""){
//			showError("请输入新密码！");
//			$("#password").focus();
//			return;  
//		}
//		else 
		if(newpassword.length < 6 || newpassword.length > 24)
		{
			showError("密码长度必须为6-24位！");
			$("#password").focus();
			$("#password").select();
			return;
		}
	
		//if(!repassword && repassword == ""){
//			showError("请再次输入新密码！");
//			$("#repassword").focus();
//			return;  
//		}else 
		if(newpassword != repassword)
		{
			$("#error-message").html("两次填写的密码不一致，请重新输入！");
			$("#repassword").focus();
			$("#repassword").select();
			return; 
		}
		
		var login=request["account_login"];
	    var ack=request["ack-token"];
		if(!login || login.length<=0 || !ack || ack.length<=0){
			$("#error-message").html("参数错误!3秒后自动跳转到“第一步”");
			setInterval("window.location.href='forget.html'", 3000);
		}else{
			$("#error-message").html("");
			submitNewPassword(newpassword,repassword);
		}
	}else
		showError(warningstring);
  
}
// 提交请求
function submitNewPassword(newpassword,repassword){
  var html="<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/> 正在提交，请稍后...";
  //waitingMessage(html.toString());
  //$("#waiting-modal-dialog").modal("show",null,2);
  tek.macCommon.waitDialogShow(null, html, null, 2);

  var url=tek.common.getRootPath()+"servlet/resetPwd";
  var setting={};
  setting["async"]=true;
  setting["type"]="post";
  var params={};
  params["action"]="reset";
  params["account_login"]=request["account_login"];
  params["ack-token"]=request["ack-token"];
  params["account_password"]=encodeURI(newpassword);
  params["account_confirm"]=encodeURI(repassword);
  //params["security-password"]=encodeURI(security_password);

  var callback={};
  callback["success"]=function(data) {
      if(data){
        $("#account-div").addClass("hidden");
        $("#password-div").addClass("hidden");
        $("#repassword-div").addClass("hidden");
        //$("#safepassword-div").addClass("hidden");
        $("#next").addClass("hidden");
        $("#close").removeClass("hidden");

        $("#newpwd-span").removeClass("label-warning").addClass("label-success");
        $("#finish-span").removeClass("label-info").addClass("label-success");
        $("#error-message").html("重置密码成功,请重新登录!");
      }
  };
  callback["error"]=function(data, errorMsg) {
      if (errorMsg)
        $("#error-message").html(errorMsg);
  };
  callback["complete"]=function() {
      $("#next").removeAttr("disabled");
      tek.macCommon.waitDialogHide();
  }

  tek.common.ajax(url, setting, params, callback);
}
