/*************************************/
// 登录界面操作的js
//
// 相关文件: ../jsp/login.jsp
/*************************************/

/**
 * 登录
 *
 * @param loginURL
 *           登录servlet地址
 */
function login(loginURL) {
  var msg=document.getElementById("msg");
  
  if (!$("#username").val()) {
	if(msg)
      msg.innerHTML="请输入用户名";
	else
	  alert("请输入用户名");
	return;
  }
  
  if (!$("#password").val()) {
	if(msg)
      msg.innerHTML="请输入密码";
	else
	  alert("请输入密码");
	return;
  }

  $.ajax({
      type: "post",
      url: loginURL,
      dataType: "json",
      data: {action: "login",
          userlogin: $("#username").val(),
          password: $("#password").val(),
          autoLogin: ($("#autoLogin").attr("checked")=="checked") ? "true" : "false"
      },
      success: function(data) {
        if (data.code==0) {
          //登录成功 
          $("#login").hide();
		  if($("#myUser")) {
            $("#myUser").html(data.my_name);
		    $("#myUser").attr("onclick", "read.jsp?user_id="+data.my_id);
		  }
		  if($("#userId"))
            $("#userId").val(data.my_id);
          if($("#logout"))
		    $("#logout").show();

		  if(msg)
            msg.innerHTML="&nbsp;";

          try {
            if($.isFunction(changeUser))
              changeUser(data.my_security);
		  } catch (e) {
            if(parent)
              parent.changeUser(data.my_security);
		  } // end if(typeof(eval(changeUser))=="function") else
	    } else {
          var error=data.message;
          if (error) {
			if(msg)
              msg.innerHTML=error;
			else
			  alert(error);
		  }
        }
      },
      error: function() {
		if(msg)
		  msg.innerHTML="操作失败!";
		//else
        //  alert("操作失败!");
      },
  });
}

/**
 * 注销
 *
 * @param loginURL
 *           登录servlet地址
 */
function logout(loginURL) {
  $.ajax({
      type: "post",
      url: loginURL,
      dataType: "json",
      data: {action: "logout"},
      success: function(data) {
          //if (data.code==0) {
            // 操作成功
            $("#logout").hide();

            //$("#userlogin").val("");
            $("#password").val("");
            $("#login").show();

            try {
              if($.isFunction(changeUser))
                changeUser();
		    } catch (e) {
              if(parent)
                parent.changeUser();
		    } // end if(typeof(eval(changeUser))=="function") else
          //}
      },
      error:function() {
		var msg=document.getElementById("msg");
		if(msg)
		  msg.innerHTML="操作失败!";
		//else
        //  alert("操作失败!");
      }
  });
}

/*
 * 如果按回车键，登录
 * 
 * @param evt
 *           键盘按键
 * @param url
 *           登录servlet地址
 */
function pressKeyLogin(evt, url) {
  evt = evt ? evt : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
  var key = evt.keyCode ? evt.keyCode : evt.which;
  if (key == 13)
    login(url);
}

/**
 * 读取当前用户信息
 *
 
function showMe() {
  var show=false;

  if(parent && parent!=self) {
    if(parent.showMe){
      parent.showMe();
      show=true;
    }
  }

  if(show==false)
    window.open("../user/read.jsp","_blank");
}*/
