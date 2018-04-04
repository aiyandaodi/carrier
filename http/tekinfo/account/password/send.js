/**
 * 初始化
 */
var request = tek.common.getRequest();
function init(){
  var req=request["req-token"];
  if(!req || req.length<=0) {
    // 账号错误
    $("#error-message").html("参数错误!3秒后自动跳转到“第一步”");
    setInterval("window.location.href='forget.html'", 3000);
  } else{
	  checkReq();
  }
    
}

/**
 * 选择验证方式
 */
function selectType(sel) {
  if(sel.value==2){
    var lab=document.getElementById("identity-label");
    if(lab)
      lab.innerHTML="邮箱地址";
    
    var identity=document.getElementById("identity");
    if(identity){
      identity.value="";
      identity.placeholder="认证电子邮箱";
    }
    $("#active-div").addClass("hide");
    $("#next").removeClass("hidden");
    $("#next-mobile").addClass("hide");
    
  } else if(sel.value==1) {
    var lab=document.getElementById("identity-label");
    if(lab)
      lab.innerHTML="手机号码";
    
    var identity=document.getElementById("identity");
    if(identity){
      identity.value="";
      identity.placeholder="认证手机号码";
    }
    $("#active-div").removeClass("hide");
    $("#next").addClass("hidden");
    $("#next-mobile").removeClass("hide");
  } else {
    $("#identity-div").addClass("hide");
    $("#active-div").addClass("hide");
    $("#next").addClass("hidden");
    $("#next-mobile").addClass("hide");
  }
}

/**
 * 检查
 */
function checkReq() {
  var html="<div class='center'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/> 正在获取数据...</div>";
  $("#error-message").html(html);

  var url=tek.common.getRootPath()+"servlet/resetPwd";
  var setting={};
  setting["async"]=true;
  setting["type"]="post";
  var params={};
  params["action"]="ack";
  params["req-token"]=request["req-token"];
  params["check"]=1;

  var callback={};
  callback["beforeSend"]=function() {
      var html="<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/> 正在提交数据，请稍后...";
      //tek.macCommon.waitingMessage(html.toString());
      //$("#waiting-modal-dialog").modal("show",null,2);
      tek.macCommon.waitDialogShow(null, html.toString(), null, 2);
  };
  callback["success"]=function(data) {
      if(data){
        $("#error-message").html("");
        $("#account-div").removeClass("hidden");
        $("#type-div").removeClass("hidden");
        //$("#safepassword-div").removeClass("hidden");
        $("#identity-div").removeClass("hidden");
        //$("#next").removeClass("hidden");
        $("#name").html(data.value);
        
        selectType(document.getElementById("type"));
      }
  };
  callback["error"]=function(data, errorMsg) {
      if (errorMsg)
        $("#error-message").html(errorMsg);
  };
  callback["complete"]=function() {
      $("#waiting-modal-dialog").modal("hide");
  }

  tek.common.ajax(url, setting, params, callback);
}

//显示忘记安全密码链接
/*function showLink(){
	var target = document.getElementById("forgetsafepwd");
	var sb = new StringBuffer();
	//var name = document.getElementById("name").innerHTML;
	var name = request["account_login"];
	sb.append("<a href='");
	sb.append(getRootPath());
	sb.append("http/tekinfo/authority/forget.html?account_login=");
	sb.append(name);
	sb.append("'>忘了安全密码？</a>");
	if(target){
		target.insertAdjacentHTML('afterBegin',sb.toString());
	}
}*/

/**
 * 确认
 */
function ack() {
  var type=$("#type").val();
  if(type<=0 || type > 2) {
    $("#error-message").html("没有选择验证方式");
    return;
  }
  
  // var name = document.getElementById("name").innerHTML;
  var name = request["account_login"];
  /*var security_password = $("#safepwd").val();
  if(!security_password || security_password.length<=0) {
      showError("请输入安全密码!");  
      $("#safepwd").focus();
      return;
  }*/
  
  var identity=$("#identity").val();
  if(type==2) {
    if (!tek.dataUtility.isCertificateEmail(identity)) {
      $("#error-message").html("<font color='red'>请输入有效的电子邮箱！</font>");
      $("#identity").focus();
      $("#identity").select();
      return;
    }
  } else if(type==1) {
    if (!tek.dataUtility.isCertificatePhone(identity)) {
      $("#error-message").html("<font color='red'>请输入有效的手机号码！</font>");
      $("#identity").focus();
      $("#identity").select();
      return;
    }
  }

  var req = request["req-token"];
  if(!req || req.length <= 0) {
    $("#error-message").html("参数错误!3秒后自动跳转到“第一步”");
    setInterval("window.location.href='forget.html'", 3000);
  }
  
  $("#next").attr("disabled","disabled");
  
  // 提交请求
  var html="<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/> 正在提交，请稍后...";
  //waitingMessage(html.toString());
  //$("#waiting-modal-dialog").modal("show",null,2);
  tek.macCommon.waitDialogShow(null, html.toString(), null, 2);

  var url=tek.common.getRootPath()+"servlet/resetPwd";
  var setting={};
  setting["async"]=true;
  setting["type"]="post";
  var params={};
  params["action"]="ack";
  params["account_login"]=name;
  params["req-token"]=request["req-token"];
  params["type"]=type;
  params["identity"]=identity;
  //params["security-password"]=encodeURI(security_password);

  var callback={};
  callback["success"]=function(data) {
      $("#error-message").html("");
      if(data){
        if(type==2) {
          // 电子邮件
          $("#account-div").addClass("hidden");
          $("#type-div").addClass("hidden");
          $("#safepassword-div").addClass("hidden");
          $("#identity-div").addClass("hidden");
          $("#prev").addClass("hidden");
          //$("#next").addClass("hidden");
          $("#next").removeClass("btn-danger");
          $("#next").addClass("btn-success");
          $("#next").html("再次发送");
          //$("#sendagain").removeClass("hidden");
          $("#close").removeClass("hidden");
          if(data.message)
            $("#error-message").html(tek.dataUtility.stringToHTML(data.message));
          else
            $("#error-message").html("验证邮件已发送到" + name + "，请您登录邮箱完成验证!");
        } else if(type==1) {
          // 手机号码
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
        }
      }
  };
  callback["error"]=function(data, errorMsg) {
      if (errorMsg)
        $("#error-message").html(errorMsg);
  };
  callback["complete"]=function() {
      $("#next").removeAttr("disabled");
      $("#waiting-modal-dialog").modal("hide");
  }

  tek.common.ajax(url, setting, params, callback);
}

/**
 * 返回上一步
 */
function prev() {
  if(!history.back())
    location.href="forget.html";
}
//点击键盘上Enter键时提交
function enterPress(evt) {
  evt = evt ? evt : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
  var key = evt.keyCode ? evt.keyCode : evt.which;
  if(key == 13)
    ack();
}


/**
 * 重置密码
 */
function checkReset() {
  // 提交请求
  var html="<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/> 正在提交，请稍后...";
  tek.macCommon.waitDialogShow(null, html, null, 2);
  
  var url=tek.common.getRootPath()+"servlet/resetPwd";
  var setting={};
  setting["async"]=true;
  setting["type"]="post";
  var params={};
  params["action"]="reset";
  params["account_login"]=request["account_login"];
  params["ack-token"]=$("#active").val();
  params["check"]=1;
  
  var callback={};
  callback["success"]=function(data) {
      $("#error-message").html("");
      
      if(data){
        var html="reset.html?ack-token="+$("#active").val()+"&account_login="+request["account_login"];
        window.open(html, "_self");
      }
  };
  callback["error"]=function(data, errorMsg) {
      if (errorMsg)
        $("#error-message").html(errorMsg);
  };
  callback["complete"]=function(result) {
      tek.macCommon.waitDialogHide();
  };

  tek.common.ajax(url, setting, params, callback);
}

// 检查“发送验证码”是否可操作
function checkActive() {
  var type=$("#type").val();
  var identity=$("#identity").val();
  if(type==1 && tek.dataUtility.isCertificatePhone(identity))
    $("#active-btn").removeAttr("disabled");
  else
    $("#active-btn").attr("disabled", "disabled");
}

function checkNextMobile() {
  var type=$("#type").val();
  var active=$("#active").val();
  if(type==1 && active && active.length>0)
    $("#next-mobile").removeAttr("disabled");
  else
    $("#next-mobile").attr("disabled", "disabled");	
}