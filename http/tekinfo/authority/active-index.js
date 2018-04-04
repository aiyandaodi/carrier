// JavaScript Document
//
function activeEmail() {
  var html="<div class='center'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/> 正在获取数据...</div>";
  $("#message").html(html);

  var url=tek.common.getRootPath()+"servlet/authority";
  var setting={};
  setting["async"]=true;
  setting["type"]="post";
  var params = {};
  params["objectName"] = "Authority";
  params["action"] = "active";
  params["authority_id"] = request["authority_id"];
  params["active"] = request["active"];

  var callback={};
  callback["success"]=function(data) {
      if(data){
        $("#message").html("");
        if(showClose == 1){
          $("#close").removeClass("hidden");
          //$("returnfirst").addClass("hidden");
        }else if(callbackURL){
          $("#callbackBtn").removeClass("hidden");
          //$("returnfirst").addClass("hidden");
        }else{
          $("#returnfirst").removeClass("hidden");
        }
        
        showMessage("激活成功！");
      }
  };
  callback["error"]=function(data, errorMsg) {
	  if (errorMsg)
        showError(errorMsg);
  };

  tek.common.ajax(url, setting, params, callback);
}


function showMessage(msg){
	var obj = document.getElementById("message");
	if(obj){
	  obj.innerHTML="<h2>" + msg + "</h2>";
	  //obj.focus();
	}
	else
	  alert(msg);
}

function showError(msg){
	var obj = document.getElementById("message");
	if(obj){
	  obj.innerHTML="<span style='color:red'>"+msg+"</span>";
	  //obj.focus();
	}
	else
	  alert(msg);
}
