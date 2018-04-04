<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：删除选中的信息的模板
参数：object-ids - 删除的对象标识（以“;”分割多个标识）
     callback-url - 回调地址
     callback-params - 回调参数
     refresh-opener - 是否刷新opener页面
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/removeList.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<link href="../../../common/tek/css/msg.css" rel="stylesheet" type="text/css" media="screen" />
<script type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<title>端口设备 - 删除</title>
<!-- #EndEditable -->
</head>

<body>
<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.ObjectRm" %>
<!-- #BeginEditable "import" -->
<!-- 自己的import类 -->
<%@ page import="net.tekinfo.remoting.resource.DeviceRm" %>
<!-- #EndEditable -->

  <div id="main">
<%@ include file="../../../config.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

<%
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);

	String callbackURL = parameters.getParameter(KEY_CALLBACK_URL);           //返回地址
	String callbackParams = parameters.getParameter(KEY_CALLBACK_PARAMS);     //返回参数
	
	ObjectRm remoting = null;
%>
<!-- #BeginEditable "initial" -->
<!-- 构造Rm -->
<%
	remoting = new DeviceRm();
%>
<!-- #EndEditable -->
<%
	ObjectResult result = remoting.removeList(token.getTokenCode(), clientIp, parameters.getParameters());	
	if (result != null) {
		// 操作错误
		String msg = result.getMessage();
		if (msg != null && !msg.isEmpty()) {
			msg = HttpUtility.StringToHTML(msg);
			out.println(new StringBuilder("<div class='msg'>").append(msg).append("</div>"));
		}
		
	} else {
		// result为空
		out.println("<div class='msg'>操作失败!</div>");		
	} // end if (result != null) else

	if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null")) {
		// 返回前一页面
		ObjectPrint objectPrint = new ObjectPrint();
		out.println(objectPrint.printCallbackForm(callbackURL, callbackParams, charset));
%>
    <ul class='button'>
      <li><input type="button" onclick="submitForm('callback', '<%= charset %>')" value="确定"/></li>
    </ul>
<%
	} else {
		// 关闭页面
		boolean showclose = DataUtility.StringToBoolean(parameters.getParameter(KEY_SHOW_CLOSE));
		if (showclose) {
			out.println("<ul class='button'>");
			out.println("<li><input type=\"button\" onclick=\"window.close();\" value=\"关闭\"/></li>");
			out.println("</ul>");
		}
	} // end if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null")) else

	if (result != null && result.getCode() == Result.RESULT_OK) {
		boolean refreshOpener = DataUtility.StringToBoolean(parameters.getParameter(KEY_REFRESH_OPENER));    //是否刷新opener页面
		if (refreshOpener) {
			out.println("<script language='javascript'>");
			out.println(new StringBuilder("tekRefreshOpener('").append(charset).append("');"));
			out.println("</script>");
		} // end if (refreshOpener)
	} // end if (result != null && result.getCode() == Result.RESULT_OK)
%>
  <!-- end #main -->  
  </div>
</body>
<!-- #EndTemplate --></html>
