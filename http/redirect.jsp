<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>

<%
/*
说明：页面跳转。用于不同WebApp间的页面跳转。
     该页面将当前session存入Attribute中，id为“session”+sessionId，供接收WebApp获取登录名、密码等信息，实现自动登录。
参数：
	url -- 自动跳转的URL地址。
    其他参数 -- 作为URL地址的附加参数。
附加URL参数：
    sid -- ipsay的session标识。通过该标识，从Attribute中取得ipsay的session。
session参数：
    ul - 加密后的登录名
    up - 加密后的登录密码
*/
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <script type="text/javascript" src="common/tek/js/refresh.js"></script>

<%@ include file="config.jsp" %>

<%@ page import="net.tekinfo.http.Parameters" %>

<%
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
	
	StringBuilder redirectURL = new StringBuilder();    //跳转URL

	String url = parameters.getParameter("url");
	String sessionId = session.getId();
	if (url != null && !url.isEmpty()
			&& sessionId != null && !sessionId.isEmpty()) {
		redirectURL.append(url);
		if (redirectURL.indexOf("?") >= 0)
			redirectURL.append("&");
		else
			redirectURL.append("?");
		redirectURL.append("sid=" + sessionId);
		
		ServletContext context = config.getServletContext();
		if (context != null)
			context.setAttribute("session" + sessionId, session);
	} // end if (url != null && !url.isEmpty())
	
	// 设置参数
	String[] parameterNames = parameters.getParameterNames();
	if (parameterNames != null && parameterNames.length > 0) {
		for (int i = 0; i < parameterNames.length; i++) {
			if (parameterNames[i] == null || parameterNames[i].isEmpty()
					|| parameterNames[i].equals("url"))
				continue;
			
			String value = parameters.getParameter(parameterNames[i]);
			if (value != null) 
				redirectURL.append("&").append(parameterNames[i]).append("=").append(value);
		} // end for (int i = 0; i < parameterNames.length(); i++)
	} // end if (e != null)
	
	if (redirectURL.length() > 0)
		out.println("<meta http-equiv='refresh' content='1;url=" + redirectURL.toString() + "'>");
%>
</head>

<body>
<%
	if (redirectURL.length() <= 0)
		out.println("<div class='msg'>连接地址错误!</div>");
%>
</body>
</html>
