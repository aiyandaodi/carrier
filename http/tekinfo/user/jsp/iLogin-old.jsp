<!-- 
    通用的登录页面。
    参数callbackURL和callbackParams记录回调页面地址和参数，如果存在，登录成功后返回回调页面。
    将该文件嵌入其他页面中使用。另外，需要在嵌入该文件的页面中嵌入<%=request.getContextPath()%>/http/user/loginConfig.jsp和/ipsay/http/user/myUser.jsp，实现登录的相关操作
-->
<!-- CSS -->
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/http/styles/iLogin.css"/>

<%@ page contentType="text/html; charset=utf-8"%>

<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.Map.Entry" %>

<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%
	String callbackURL = HttpUtility.GetParameter(request, "callbackURL");
	String callbackParams = HttpUtility.GetParameter(request, "callbackParams");

	if (isLogin) {
		// 登录成功

		if (callbackURL != null && !callbackURL.isEmpty()) {
			// 转到回调页面。
%>
  <form id="callback" name="callback" action="<%= callbackURL %>" method="post">
<%
			if (callbackParams != null && !callbackParams.isEmpty()) {
				StringHash parameters = DataUtility.StringToInfo(callbackParams, "&");
				if (parameters != null) {
					Iterator<Entry<String, String>> iterator = parameters.entrySet().iterator();
					while (iterator.hasNext()) {
						Entry<String, String> entry = iterator.next();
%>
    <input type="hidden" id="<%= entry.getKey() %>" name="<%= entry.getKey() %>" value="<%= entry.getValue() %>"/>
<%
					}
				}
			}
%>
  </form>
  <script language="javascript">
    document.callback.submit();
  </script>
<%		
			return;	
			
		} else {
			// 没有回调参数，显示登录用户界面
			String name = null;         //登录名
			String loginTime = null;    //登录时间
		
			if (myUserFields != null && myUserFields.length > 0) {
				for (Field field : myUserFields) {
					if (field == null || field.getName() == null)
						continue;
					
					if (field.getName().equals("user_name"))
						name = field.getShow();
					else if (field.getName().equals("user_currentTime"))
						loginTime = field.getShow();
				}
			}  // end if (myUserFields != null && myUserFields.length > 0)
%>
  <div align="center">
    <div class="loginItem">
      <div id="userIcon"></div>
	  <%= name %>
    </div>
    <div>
      <form id="logoutForm" name="logoutForm" action="<%=request.getContextPath()%>/http/user/logout.jsp" method="post">
<%
			StringBuffer url = request.getRequestURL();    //登录页面的回调地址
 			if (url != null) {
%>
        <input type="hidden" id="callbackURL" name="callbackURL" value="<%= url.toString() %>"/>
<%

				String parameters = request.getQueryString();
				if (parameters != null && !parameters.isEmpty()) {
%>
        <input type="hidden" id="callbackParams" name="callbackParams" value="<%= parameters %>"/>
<%
				}
			} // end if (url != null)
%>
        <div class="loginItem">
          <div id="btnIcon"></div>
            <button type="button" id="logoutBtn" name="logoutBtn" onclick="logout()">注销</button>
        </div>
      </form>
    </div>
    <script language="javascript">
      function logout() {
		var form = document.getElementById("logoutForm");
		if (form != null) {
          form.submit();
		  var button = document.getElementById("logoutBtn");
          if (button != null)
            button.disabled="disabled";
		}
      }
    </script>
  </div>
<%
		} // end if (callbackURL != null && !callbackURL.isEmpty()
		//&& callbackParams != null && !callbackParams.isEmpty())
        
	} else {
%>

  <!-- 登录框 -->
  <div id="login" align="center">

<%
		if (loginMsg != null) {
%>
    <!-- 错误提示 -->
    <div id="msg">
      <font color="#FF0000"><%= loginMsg %></font>
    </div>
<%
		}
%>
    <div>
      <form id="loginForm" name="loginForm" action="" method="post">
<%
		if (callbackURL != null && !callbackURL.isEmpty())
      		out.println("<input type='hidden' id='callbackURL' name='callbackURL' value='" + callbackURL + "'/>");
		if (callbackParams != null && !callbackParams.isEmpty())
			out.println("<input type='hidden' id='callbackParams' name='callbackParams' value='" + callbackParams + "'/>");
%>
        <div class="loginItem">
          <div id="userIcon"></div>
          <input name="username" class="inputBox" type="text" size="15"  value="<%= (username != null) ? username : "用户名" %>" onclick="javascript:this.select();"/>
        </div>
        <div class="loginItem">
          <div id="pswdIcon"></div>
          <input name="password" class="inputBox" type="password" size="15"  value="" onclick="javascript:this.select();" onkeypress="pressEnter();"/>
        </div>
        <div class="loginItem">
          <input value="0" id="remember" name="remember" class="checkbox" type="checkbox"><label for="remember">自动登录</label>
          忘记密码
        </div>
        <div class="loginItem">
          <div id="btnIcon"></div>
	      <button id="loginBtn" name="loginBtn" type="button" onclick="login()"></button>
        </div> 
        <div class="loginItem">
        </div> 
      </form>
      <script language="javascript">
	    /*
		 * 如果按回车键，登录
		 */
		function pressEnter() {
			if (event.keyCode == 13)
				login();
		}
		
	    /**
		 * 登录
		 */
	    function login() {
		  var form = document.getElementById("loginForm");
          if (form != null) {
            form.submit();

		    var button = document.getElementById("loginBtn");
            if (button != null)
              button.disabled="disabled";
		  } else
		    alert("form is null");
        }
      </script>
    </div>
  </div>
<%
	} // end if (isLogin)
%>