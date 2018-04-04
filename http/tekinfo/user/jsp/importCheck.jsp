<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：导入提交的模板
参数：transfer-type - 导入类型
     transfer-templet - 模板名
     transfer-file - 导入文件
     overwrite - 是否覆盖
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/importCheck.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<link href="../../../common/tek/css/msg.css" rel="stylesheet" type="text/css" media="screen" />
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<title>导入系统用户</title>
<!-- #EndEditable -->
</head>

<body>
<%@ page import="net.tekinfo.http.MultipartParameters" %>
<%@ page import="net.tekinfo.object.ObjectOp" %>
<%@ page import="net.tekinfo.remoting.ObjectRm" %>
<%@ page import="net.tekinfo.remoting.Result" %>

<%@ page import="java.io.InputStream" %>
<!-- #BeginEditable "import" -->
<!-- 自己的import类 -->
<%@ page import="net.tekinfo.remoting.user.UserRm" %>
<!-- #EndEditable -->

  <div id="main">
<%@ include file="../../../config.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

<%
	MultipartParameters parameters = new MultipartParameters(token.getTokenCode(), clientIp, request);

	ObjectRm remoting = null;
%>
<!-- #BeginEditable "rm" -->
<!-- 创建Rm -->
<%
	remoting = new UserRm();
%>
<!-- #EndEditable -->
<%
	// 1、取得文件输入流
	InputStream is = parameters.getInputStream(ObjectOp.PARA_TRANSFER_FILE);
	if (is == null) {
		out.println("<div class='msg'>无法读取文件!</div>");
		return;	
	}
	
	Result result = remoting.inport(token.getTokenCode(), clientIp, parameters.getParameters(),
			is);

	if (result == null) {
		out.println("<div class='msg'>操作失败!</div>");
		return;
	}
%>

  <!-- 自定义form -->
  <form id="form1" name="form1" method="post"  accept-charset="<%=charset%>" style="display:none"></form>

<%
	String msg = result.getMessage();
	if (msg != null)
		out.println("<div class='msg'>" + msg.replaceAll("\n", "<br>") + "</div>");

	if (result.getCode() == Result.RESULT_OK) {
		// 操作成功
%>
    <ul class='button'>
      <li>
        <input type="button" onclick="window.close();" value="关闭"/>
      </li>
    </ul>

<%
	} else {
		// 操作失败
%>
  <form action="import.jsp" method="post"  accept-charset="<%=charset%>" onsubmit="javascript:if(navigator.userAgent.indexOf('MSIE')>=0)document.charset='<%=charset%>';">
<%
		String[] parameterNames = parameters.getParameterNames();
		if (parameterNames != null && parameterNames.length > 0) {
			for (int i = 0; i < parameterNames.length; i++) {
				if (parameterNames[i] == null)
					continue;
					
				String value = parameters.getParameter(parameterNames[i]);
				if (value != null)
					out.println("<input type='hidden' id='" + parameterNames[i] + "' name='" + parameterNames[i] + "' value='" + value + "'/>");
			}
		} // end if (enums != null)
%>
    <ul class='button'>
      <li><input type="submit" value="后退"/></li>
    </ul>
  </form>
<%		
	} // end if (flag) else
%>

  <!-- end #main -->
  </div>
</body>
<!-- #EndTemplate --></html>
