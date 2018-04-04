<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
内容：新建端口设备提交页面
参数：callback-url - 回调地址
     callback-params - 回调参数
     show-close - 是否显示"关闭"菜单项
     refresh_opener - 是否刷新opener页面
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/addCheck.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<script type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
<script type="text/javascript" src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>
<script type="text/javascript" src="../../../common/js/normal.js"></script>
<script language="javascript" type="text/javascript">
  $(document).ready(function() {
	initWaiting(null, 40, 40);
  });
</script>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<link href="../../../common/tek/css/add.css" rel="stylesheet" type="text/css" media="screen" />
<title>Device 端口设备 - 新建确认</title>
<!-- #EndEditable -->
</head>

<body>
<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.http.MultipartParameters" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.ObjectRm" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.Map.Entry" %>

<%@ page import="org.apache.commons.fileupload.servlet.ServletFileUpload" %>

<!-- #BeginEditable "import" -->
<!-- 自己的import类 -->
<%@ page import="net.tekinfo.remoting.resource.DeviceRm" %>
<!-- #EndEditable -->

  <div id="main">
<%@ include file="../../../config.jsp" %>
<%@ include file="../../../common/tek/jsp/shield.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

<%
	Parameters parameters = null;

	boolean isMultipart = ServletFileUpload.isMultipartContent(request);
	if (isMultipart)
		parameters = new MultipartParameters(token.getTokenCode(), clientIp, request);
	else
		parameters = new Parameters(token.getTokenCode(), clientIp, request);

	StringHash p = parameters.getParameters();    //参数哈希表
	ObjectRm remoting = null;    //对象Rm
	ObjectResult result = null;    //结果
%>

<!-- #BeginEditable "init" -->
<!-- 初始化信息，包含objectId、remoting、result等 -->
<%
	remoting = new DeviceRm();
	result = remoting.getNew(token.getTokenCode(), clientIp, p);
%>
<!-- #EndEditable -->

<%
	boolean flag = false;    //操作结果
	String msg = null;    //提示信息
	
	if (result != null) {
		if (result.getCode() == Result.RESULT_OK) {
			
			Field[] fields = null;
			Record[] records = result.getRecords();

			if (records != null && records.length > 0 && records[0] != null)
				fields = records[0].getFields();
				
			if (fields != null && fields.length > 0) {
				HttpUtility.SetValues(parameters, fields);
%>

<!-- #BeginEditable "add" -->
<!-- 调用rm的新建信息方法 -->
<%
				result = remoting.addInfo(token.getTokenCode(), clientIp, parameters.getParameters(fields));
%>
<!-- #EndEditable -->

<%
				if (result != null) {
					if (result.getCode() == Result.RESULT_OK)
						flag = true;

					msg = result.getMessage();
					if (msg != null)
						msg = HttpUtility.StringToHTML(msg);
				} else {
					// result为空
					if (msg == null || msg.isEmpty())
						msg = "操作失败!";
				} // end if (result != null) else
			} else 
				if (msg == null || msg.isEmpty())
					msg = "没有可编辑字段!";
		} else {
			msg = result.getMessage();
			if (msg != null)
				msg = HttpUtility.StringToHTML(msg);
		} // end if (result.getCode() == Result.RESULT_OK) else
		
	} else {
		// result为空
		if (msg == null || msg.isEmpty())
			msg = "操作失败!";
	} // end if (result != null) else
	
	ObjectPrint objectPrint = new ObjectPrint();
%>

    <div id="info">
<%	
	if (msg != null)
		out.println(new StringBuilder("<div id='msg' class='msg'>").append(msg).append("</div>"));

    if (flag) {
		// 操作成功
		boolean refreshOpener = DataUtility.StringToBoolean(parameters.getParameter(KEY_REFRESH_OPENER));    //是否刷新opener页面
		if (refreshOpener) {
			out.println("<script language='javascript'>");
			out.println(new StringBuilder("tekRefreshOpener('").append(charset).append("');"));
			out.println("</script>");
		} // end if (refreshOpener)	
%>
<!-- #BeginEditable "success" -->
<!-- 操作成功的界面 -->
<%
		out.println("<ul class='button'>");

		String callbackURL = parameters.getParameter(KEY_CALLBACK_URL);           //返回地址
		String callbackParams = parameters.getParameter(KEY_CALLBACK_PARAMS);     //返回参数
		if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null")) {
			out.println(objectPrint.printCallbackForm(callbackURL, callbackParams, charset));
			out.println("<li>（<span id='counting'>3</span>秒钟后自动返回前一页面）</li>");
			out.println(new StringBuilder().append("<li><input type=\"button\" onclick=\"submitWithWaiting('callback', '").append(charset).append("')\" value=\"确定\"/></li>"));
			out.println("<script language='javascript'>");
			out.print("window.setInterval('submitWithWaiting(\"callback\", \"");
			out.print(charset);
			out.println("\");', 3000);");
			out.println("</script>");
		} else {
			boolean showclose = DataUtility.StringToBoolean(parameters.getParameter(KEY_SHOW_CLOSE));
			if (showclose) {
				out.println("<li>（<span id='counting'>3</span>秒钟后自动关闭）</li>");
				out.println("<li><input type=\"button\" onclick=\"javascript:window.close();\" value=\"关闭\"/></li>");
				out.println("<script language='javascript'>");
				out.println("window.setInterval('window.close();', 3000);");
				out.println("</script>");
			}
		} // end if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null")) else

		out.println("</ul>");
%>
      <script language="javascript" type="text/javascript">
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
<%
	} else {
		// 操作失败
%>
<!-- #BeginEditable "failure" -->
<!-- 操作失败的界面 -->
      <ul class='button'>
        <li><input type='button' onclick='prevPage();' value='后退'/></li>
      </ul>
      <script language="JavaScript" type="text/javascript">
	    /**
		 * 返回上一页
		 */
	    function prevPage() {
		  if (history.back())
		    return ;

          var form=document.getElementById("form1");
          if (!form) {
            form=document.createElement("form");
			form.id="form1";
			form.name="form1";
			form.method="post";
			form.acceptCharset="<%= charset %>";
			form.style.display="none";
            if(navigator.userAgent.indexOf('MSIE')>=0)
              document.charset="<%=charset %>";
			document.body.appendChild(form);
		  }

          form.innerHTML="";
          form.action = "add.jsp";
          form.target="_self";
      
          <%= objectPrint.printJSInputParameters(p, parameters) %>

		  submitWithWaiting("form1", "<%= charset %>");
		}
	  </script>
<!-- #EndEditable -->

<%
	} // end if (flag) else
%>
    <!-- end #info --></div>
  <!-- end #main --></div>
</body>
<!-- #EndTemplate --></html>
