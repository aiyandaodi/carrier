<!-- 
    * 初始化数据页面
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>初始化数据</title>
</head>

<body>
<%@ include file="../../config.jsp" %>

<%@ page import="java.util.Map.Entry" %>
<%@ page import="java.util.Iterator" %>

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.remoting.DatabaseRemoting" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.system.Credentials" %>
<%@ page import="net.tekinfo.system.Host" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%
	if (!isLogin) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;
	}
	
	//Host host = hostManager.getHost(token.getTokenCode(), DataUtility.IpToLong(clientIp), null);
	if (host == null || !host.isAlive()) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;
	}
	
	Credentials credentials = host.getCredentials();
	if (credentials == null) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;		
	}
	
	User user = credentials.getUser();
	if (user == null || !user.isAdminUser(host)) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;		
	}
	
	DatabaseRemoting dr = new DatabaseRemoting();
	Result result = dr.initial(token.getTokenCode(), clientIp, null);
	if (result != null) {
		if (result.getCode() == Result.RESULT_OK)
			out.println("初始化成功!<br/>");
		else
			out.println("初始化失败!<br/>");
		String msg = result.getMessage();
		if (msg != null) {
			msg = msg.replaceAll("\r\n", "<br/>");
			out.println(msg);
		}
	} else
		out.println("初始化错误!<br/>");

	String callbackURL = HttpUtility.GetParameter(request, "callbackURL");                   //返回地址
	if (callbackURL == null || callbackURL.isEmpty())
		callbackURL = "index.jsp";
	String callbackParams = HttpUtility.GetParameter(request, "callbackParams");             //返回参数
	
	
%>
  <form action="<%= callbackURL %>" id="callback" name="callback" method="post" style="display:none">
<%
	StringHash p = DataUtility.StringToInfo(callbackParams, "&");
	if (p != null) {
		Iterator<Entry<String, String>> iterator = p.entrySet().iterator();
		if (iterator != null) {
			while (iterator.hasNext()) {
				Entry<String, String> entry = iterator.next();
%>
    <input type="hidden" id="<%= entry.getKey() %>" name="<%= entry.getKey() %>" value="<%= entry.getValue() %>"/>
<%
			}
		} // end if (iterator != null)
	} // end if (p != null)
%>
  </form>
</body>
</html>
