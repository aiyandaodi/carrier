<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：客户端删除信息
参数：callback-url - 回调地址
     callback-params - 回调参数
     show-close - 是否显示"关闭"菜单项
     refresh-opener - 是否刷新opener页面
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/remove.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<link href="../../../common/tek/css/msg.css" rel="stylesheet" type="text/css" media="screen" />
<script type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<title>Client 客户端 - 删除</title>
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
<%@ page import="net.tekinfo.remoting.system.ClientRm" %>
<!-- #EndEditable -->

  <div id="main">
<%@ include file="../../../config.jsp" %>
<%@ include file="../../../common/tek/jsp/shield.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

<%
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
	ObjectPrint objectPrint = new ObjectPrint();

	ObjectRm remoting = null;
%>
<!-- #BeginEditable "initial" -->
<!-- 构造Rm -->
<%
	remoting = new ClientRm();    // 改为当前对象的RM
%>
<!-- #EndEditable -->
<%
	ObjectResult result = remoting.removeInfo(token.getTokenCode(), clientIp, parameters.getParameters());	
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

	if (result != null && result.getCode() == Result.RESULT_OK) {
		//是否刷新opener页面
		boolean refreshOpener = DataUtility.StringToBoolean(parameters.getParameter(KEY_REFRESH_OPENER));
		if (refreshOpener) {
			out.println("<script language='javascript'>");
			out.println(new StringBuilder("tekRefreshOpener('").append(charset).append("');"));
			out.println("</script>");
		} // end if (refreshOpener)
	} // end if (result != null && result.getCode() == Result.RESULT_OK)
%>

<!-- #BeginEditable "finish" -->
<!-- 操作完成的界面 -->
<%
	String callbackURL = parameters.getParameter(KEY_CALLBACK_URL);           //返回地址
	String callbackParams = parameters.getParameter(KEY_CALLBACK_PARAMS);     //返回参数
	
	if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null")) {
		// 返回前一页面
		out.println(objectPrint.printCallbackForm(callbackURL, callbackParams, charset));
		out.println("<ul class='button'>");
		out.println("<li>（<span id='counting'>3</span>秒钟后自动返回前一页面）</li>");
		out.print("<li><input type='button' onclick='submitWithWaiting(\"callback\", \"");
		out.print(charset);
		out.println("\");' value='确定'/></li>");
		out.println("</ul>");
		out.println("<script language='javascript'>");
		out.print("window.setInterval('submitWithWaiting(\"callback\", \"");
		out.print(charset);
		out.println("\");', 3000);");
		out.println("</script>");

	} else {
		boolean showclose = DataUtility.StringToBoolean(parameters.getParameter(KEY_SHOW_CLOSE));
		if (showclose) {
			// 关闭页面
			out.println("<ul class='button'>");
			out.println("<li>（<span id='counting'>3</span>秒钟后自动关闭）</li>");
			out.println("<li><input type=\"button\" onclick=\"window.close();\" value=\"关闭\"/></li>");
			out.println("</ul>");
			out.println("<script language='javascript'>");
			out.println("window.setInterval('window.close();', 3000);");
			out.println("</script>");
		}
	} // end if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null")) else
%>
<script language="JavaScript" type="text/javascript">
  /**
   * 倒计时减1
   */
  function reduce() {
    var elem=document.getElementById("counting");
    if (elem) {
      var num=parseInt(elem.innerHTML);
	  if (num>0)
        elem.innerHTML=num-1;
    }
  }
		
  window.setInterval("reduce();", 1000);
</script>
<!-- #EndEditable -->
  <!-- end #main -->  
  </div>
</body>
<!-- #EndTemplate --></html>
