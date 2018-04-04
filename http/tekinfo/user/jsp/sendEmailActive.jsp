<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：发送Email激活邮件页面。
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/normal.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<link href="../../../common/tek/css/msg.css" rel="stylesheet" type="text/css" media="screen" />
<title></title>
<!-- #EndEditable -->
</head>

<body>
<!-- #BeginEditable "import" -->
<!-- 自己的import类 -->
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.user.UserRm" %>
<%@ page import="net.tekinfo.system.UserOp" %>
<%@ page import="net.tekinfo.util.StringHash" %>
<!-- #EndEditable -->

<%@ include file="../../../config.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

  <div id="main">
<!-- #BeginEditable "main" -->
<!-- 页面内容 -->
<%
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);

	StringHash p = parameters.getParameters();    //参数
	UserRm remoting = new UserRm();

	StringHash pp = null;
	if (p != null)
		pp = p.getCopy();
	else
		pp = new StringHash();
	
	if (!pp.containsKey(UserOp.KEY_ACTIVE_URL)) {
		StringBuffer url = request.getRequestURL();
		if (url != null && url.length() > 0) {
			int index = url.lastIndexOf("/");
			if (index > 0)
				pp.put(UserOp.KEY_ACTIVE_URL, url.substring(0, index+1) + "active.jsp");
		}
	}
	Result result = remoting.sendActiveMessage(token.getTokenCode(), clientIp, pp);    //结果

	String message = null;
		
	if (result != null) {
		message = result.getMessage();
		if (message != null)
			message = HttpUtility.StringToHTML(message);
		
	} else {
		// result为空
		message = "操作失败!";
	} // end if (result != null) else

	if (message != null) {
		out.print("<div id='msg' class='msg'>");
		out.print(message);
		out.println("</div>");
	}
%>
<!-- #EndEditable -->
  <!-- end #main -->
  </div>
</body>
<!-- #EndTemplate --></html>
