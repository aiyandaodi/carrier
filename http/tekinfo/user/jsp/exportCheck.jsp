<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：导出提交的模板
参数：transfer-type - 导出类型
     transfer-templet - 模板名
     withLocalFile - 是否包含BLOB数据
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/exportCheck.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<link href="../../../common/tek/css/msg.css" rel="stylesheet" type="text/css" media="screen" />
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<title>导出</title>
<!-- #EndEditable -->
</head>

<body>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.ObjectRm" %>
<%@ page import="net.tekinfo.remoting.Result" %>
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
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);

	ObjectRm remoting = null;
%>
<!-- #BeginEditable "rm" -->
<!-- 创建Rm -->
<%
	remoting = new UserRm();
%>
<!-- #EndEditable -->
<%
	Result result = remoting.export(token.getTokenCode(), clientIp, parameters.getParameters());

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
  <form action="../../system/download.jsp" method="post" accept-charset="<%=charset%>" onsubmit="javascript:if(navigator.userAgent.indexOf('MSIE')>=0)document.charset='<%=charset%>';">
    <input type="hidden" id="file-path" name="file-path" value="<%= result.getValue() %>"/>
    <ul class='button'>
      <li>
        <input type="submit" value="下载文件"/>
        <input type="button" onclick="window.close();" value="关闭"/>
      </li>
    </ul>
  </form>

<%
	} else {
		// 操作失败
%>
  <form action="export.jsp" method="post"  accept-charset="<%=charset%>" onsubmit="javascript:if(navigator.userAgent.indexOf('MSIE')>=0)document.charset='<%=charset%>';">
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
