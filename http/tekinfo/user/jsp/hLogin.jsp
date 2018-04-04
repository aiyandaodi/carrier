<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8" %>
<!--
功能：横向排列的登录界面
-->

<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="hLogin.css" rel="stylesheet" type="text/css" media="screen" />
<!--[if IE]> <link href="hLoginIE.css" rel="stylesheet" type="text/css" media="screen" /><![endif]-->

<link   rel= "Shortcut Icon"   href= "../../../../favicon.ico"/>
<link   rel= "Bookmark"   href= "../../../../favicon.ico"/>

<script type="text/javascript" src="iLogin.js"></script>
<script type="text/javascript" src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>

<title>Login</title>

</head>

<%@ include file="../../../config.jsp" %>
<%@ include file="../../../loginConfig.jsp" %>

<body>
<div style="text-align:right;">
  <div id="login" align="center" style="display:<%= isLogin ? "none" : "block" %>">
    <form id="loginForm" name="loginForm" action="hLogin.jsp" method="post">
      <fieldset>
	    <legend>Log in</legend>
        <label for="username">用户名:</label>
        <input type="text" id="username" name="username" onfocus="javascript:this.select();"/>
	  	
        <label for="password">保密字:</label>
        <input type="password" id="password" name="password" onfocus="javascript:this.select();" onkeypress="pressKeyLogin(event, '<%= request.getContextPath()%>/servlet/login');"/>
        <input type="button" class="button" id="loginBtn" name="loginBtn" value="登录" onclick="login('<%= request.getContextPath()%>/servlet/login');"/>	
        <input type="checkbox" id="autoLogin" name="autoLogin" style="position: relative; top: 3px; margin: 0;"/>
        <label for="autoLogin" style="text-align:left">记住我?</label>
      </fieldset>
    </form>
  <!-- end #login --></div>
  
  <div id="logout" align="center" style="display:<%= isLogin ? "block" : "none" %>">
    <form id="logoutForm" name="logout-Form" action="hLogin.jsp" method="post">
      <input type="hidden" id="logoutUser" name="logoutUser" value="true"/>
      <button type="button" id="logoutBtn" class="outbutton" name="logoutBtn" onclick="logout('<%= request.getContextPath() %>/servlet/login');">注销</button>
      <a id="myUser" name="myUser" href="<%= request.getContextPath() %>/http/user/read.jsp?<%= User.FIELD_ID %>=<%= my.getId() %>" target="_blank"><%= my.getName() %></a>
    </form>
  <!-- end #logout --></div>
</div>

<script language="javascript" type="text/javascript">
  try {
    if($.isFunction(changeUser)) {
	  changeUser(<%= my.getSecurity() %>);
	}
  } catch (e) {
    if(parent && parent.changeUser) {
      parent.changeUser(<%= my.getSecurity() %>);
	}
  } // end if(typeof(eval(changeUser))=="function") else

  setInterval("window.location.reload();", 300000);
</script>
    
</body>
</html>
