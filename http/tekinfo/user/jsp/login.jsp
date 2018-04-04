<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8" %>


<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.Map.Entry" %>

<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Cache-Control" content="no-cache,no-store, must-revalidate">
<meta http-equiv="pragma" content="no-cache"> 
<meta http-equiv="expires" content="0">
<!-- 
    通用的登录页面。
    参数callback-url和callback-params记录回调页面地址和参数，如果存在，登录成功后返回回调页面。
    将该文件嵌入其他页面中使用。另外，需要在嵌入该文件的页面中嵌入<%=request.getContextPath()%>
-->
<!-- CSS -->
<link rel="stylesheet" type="text/css" href="iLogin.css"/>
<script type="text/javascript" src="iLogin.js"></script>
<script type="text/javascript" src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>

<link   rel= "Shortcut Icon"   href= "../../../images/tekinfo.ico"/>
<link   rel= "Bookmark"   href= "../../../images/tekinfo.ico"/>

<title>Login</title>
</head>


<body>
<%@ include file="../../../config.jsp" %>

<%
	String callbackURL = HttpUtility.GetParameter(request, KEY_CALLBACK_URL);
	String callbackParams = HttpUtility.GetParameter(request, KEY_CALLBACK_PARAMS);
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
		} // end if (callbackParams != null && !callbackParams.isEmpty())
%>
  </form>

<%
	} // end if (callbackURL != null && !callbackURL.isEmpty())
	
	if (isLogin) {
		// 已经登录

		if (callbackURL != null && !callbackURL.isEmpty()) {
			// 存在回调参数，返回调用页面
%>
  <script language="javascript">
    document.callback.submit();
  </script>
<%
			return;	
		} // end if (callbackURL != null && !callbackURL.isEmpty())
	} // end if (isLogin)
	
	// 注销页面
%>
  <div id="logout" align="center" style="display:<%= isLogin ? "block" : "none" %>">
    <div class="loginItem">
      <div id="userIcon"></div>
	  <a id="myUser" name="myUser" href="<%= request.getContextPath() %>/http/user/read.jsp?<%= User.FIELD_ID %>=<%= my.getId() %>" target="_blank"><%= my.getName() %></a>
      <form action="<%= request.getContextPath() %>/http/user/read.jsp" id="urForm" name="urForm" method="post" target="_blank">
        <input type="hidden" id="<%= KEY_CALLBACK_URL %>" name="<%= KEY_CALLBACK_URL %>" value="<%= request.getRequestURL().toString() %>"/>
        <input type="hidden" id="<%= KEY_CALLBACK_PARAMS %>" name="<%= KEY_CALLBACK_PARAMS %>" value="<%= request.getQueryString() %>"/>
        <input type="hidden" id="<%= User.FIELD_ID %>" name="<%= User.FIELD_ID %>" value="<%= my.getId() %>"/>
      </form>
      <script language="javascript">
	    /**
         * 读取用户
         */
        function read() {
          var form = document.getElementById("urForm");
          if (form != null)
            form.submit(); 
        }
	  </script>
    </div>
    <div>
      <form id="logoutForm" name="logoutForm" action="" method="post">
<%
		if (callbackURL != null && !callbackURL.isEmpty())
      		out.println(new StringBuilder("<input type='hidden' id='").append(KEY_CALLBACK_URL).append("' name='").append(KEY_CALLBACK_URL).append("' value='").append(callbackURL).append("'/>"));
		if (callbackParams != null && !callbackParams.isEmpty())
			out.println(new StringBuilder("<input type='hidden' id='").append(KEY_CALLBACK_PARAMS).append("' name='").append(KEY_CALLBACK_PARAMS).append("' value='").append(callbackParams).append("'/>"));
%>
        <input type="hidden" id="logoutUser" name="logoutUser" value="true"/>
        <div class="loginItem">
          <div id="btnIcon"></div>
            <button type="button" id="logoutBtn" name="logoutBtn" onclick="logout('<%= request.getContextPath() %>/http/login');">注销</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 登录框 -->
  <div id="login" align="center" style="display:<%= isLogin ? "none" : "block" %>">
    <!-- 错误提示 -->
    <div id="msg" style="color:#FF0000;"></font>
    </div>
    <div>
      <form id="loginForm" name="loginForm" action="" method="post">
<%
		if (callbackURL != null && !callbackURL.isEmpty())
      		out.println(new StringBuilder("<input type='hidden' id='").append(KEY_CALLBACK_URL).append("' name='").append(KEY_CALLBACK_URL).append("' value='").append(callbackURL).append("'/>"));
		if (callbackParams != null && !callbackParams.isEmpty())
			out.println(new StringBuilder("<input type='hidden' id='").append(KEY_CALLBACK_PARAMS).append("' name='").append(KEY_CALLBACK_PARAMS).append("' value='").append(callbackParams).append("'/>"));
%>
        <div class="loginItem">
          <div id="userIcon"></div>
          <input id="username" name="username" class="inputBox" type="text" size="15"  value="用户名" onfocus="javascript:this.select();"/>
        </div>
        <div class="loginItem">
          <div id="pswdIcon"></div>
          <input id="password" name="password" class="inputBox" type="password" size="15"  value="" onfocus="javascript:this.select();" onkeypress="pressKeyLogin(event, '<%= request.getContextPath()%>/http/login');"/>
        </div>
        <div class="loginItem">
          <input value="0" id="autoLogin" name="autoLogin" class="checkbox" type="checkbox"/><label for="remember">自动登录</label>
          <!-- 忘记密码 -->
        </div>
        <div class="loginItem">
          <div id="btnIcon"></div>
	      <button id="loginBtn" name="loginBtn" type="button" onclick="login('<%= request.getContextPath()%>/http/login');"></button>
        </div> 
        <div class="loginItem">
        </div> 
      </form>
    </div>
  </div>
</body>
<script language="javascript">
// 判断是否是iframe
if (self.frameElement) {
	if (self.frameElement.tagName!="iframe" && self.frameElement.tagName!="IFRAME") {
		//非iframe，允许连接到用户读取页面
		var a = document.getElementById("myUser");
		if (a) {
			a.onclick="read()";
		}
	}
}

try {
  if($.isFunction(changeUser))
    changeUser(<%= my.getSecurity() %>);
  } catch (e) {
    if(parent)
      parent.changeUser(<%= my.getSecurity() %>);
  } // end if(typeof(eval(changeUser))=="function") else

</script>
</html>
