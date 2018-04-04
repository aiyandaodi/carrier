
/**
 * 提交账号
 */
function req() {
  var login=$("#login").val();
  if(!login || login.length<=0) {
	  showError("请输入重置账号!");
	  return;
  }
  
 $("#next").attr("disabled","disabled");

  // 提交请求
  var url=tek.common.getRootPath()+"servlet/resetPwd";
  var setting={};
  setting["async"]=true;
  setting["type"]="post";
  var sendData={};
  sendData["action"]="req";
  sendData["account_login"]=login;

  var callback={};
  callback["beforeSend"]=function() {
      var html="<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/> 正在提交数据，请稍后...";
      //tek.macCommon.waitingMessage(html.toString());
      //$("#waiting-modal-dialog").modal("show",null,2);
      tek.macCommon.waitDialogShow(null, html.toString(), null, 2);
  };
  callback["success"]=function(data) {
      if(data){
        var login=$("#login").val();
        var url="send.html?req-token="+data.value+"&account_login="+login;
        window.location.href=url;
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

  tek.common.ajax(url, setting, sendData, callback);
}
