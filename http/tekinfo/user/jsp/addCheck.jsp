<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：新建信息处理的模板
参数：callback-url - 回调地址
     callback-params - 回调参数
     show-close - 是否显示"关闭"菜单项
     refresh-opener - 是否刷新opener页面
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
<title>User 系统用户 - 新建确认</title>
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
<%@ page import="net.tekinfo.remoting.user.UserRm" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.system.UserOp" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
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
<!-- 初始化信息，包含objectId、remoting等 -->
<%
	remoting = new UserRm();
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
<!-- 调用rm的新建方法 -->
<%
				StringHash pp =  parameters.getParameters(fields);
				
				if (!pp.containsKey(UserOp.KEY_ACTIVE_URL)) {
					StringBuilder applyURL = new StringBuilder();
					StringBuffer url = request.getRequestURL();
					if (url != null && url.length() > 0) {
						int index = url.lastIndexOf("/");
						if (index > 0) {
							pp.put(UserOp.KEY_ACTIVE_URL, url.substring(0, index + 1) + "active.jsp");
						}
					}
				} // end if (!pp.containsKey(UserOp.KEY_ACTIVE_URL))
				
				result = remoting.addInfo(token.getTokenCode(), clientIp, pp);
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
		boolean showclose = DataUtility.StringToBoolean(parameters.getParameter(KEY_SHOW_CLOSE));

		String callbackURL = parameters.getParameter(KEY_CALLBACK_URL);           //返回地址
		String callbackParams = parameters.getParameter(KEY_CALLBACK_PARAMS);     //返回参数
		if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null"))
			out.println(objectPrint.printCallbackForm(callbackURL, callbackParams, charset));

		long objectId = 0L;
		StringHash hash = DataUtility.StringToInfo(result.getValue(), ";");
		if (hash != null)
			objectId = DataUtility.StringToLong(hash.get(User.FIELD_ID));
		
		out.println("<ul class='button'>");
		if (objectId != 0) {
			out.println("<input type='checkbox' id='account' name='account' checked='checked'/>创建手机账号<br/>");
			out.println("<li><input type=\"button\" onclick=\"ok()\" value=\"确定\"/></li>");
%>
  <script language="javascript">
    /**
	 * 确定
	 */
    function ok() {
		var check=document.getElementById("account");
		if (check && check.checked)
		  addAccount();
		else
<%
		if (showclose) {
			out.print("winClose(true, '");
			out.print(charset);
			out.println("');");
		} else {
         	out.print("submitWithWaiting('callback', '");
			out.print(charset);
			out.print("');");
		}
%>
	}
	
	/**
	 * 新建手机账号
	 */
	function addAccount() {
      var form = document.getElementById("form1");
      if (form == null) {
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
      form.action = "../message/mobile/account/add.jsp";
      form.target="_self";
      if(navigator.userAgent.indexOf('MSIE')>=0)
        document.charset="<%=charset %>";
    
      var hidden = document.createElement("input");
      hidden.id = "<%=User.FIELD_ID%>";
      hidden.name = "<%=User.FIELD_ID%>";
      hidden.type = "hidden";
      hidden.value = "<%= objectId %>";
      form.appendChild(hidden);

      var callbackURL = document.createElement("input");
      callbackURL.id = "<%= KEY_CALLBACK_URL %>";
      callbackURL.name = "<%= KEY_CALLBACK_URL %>";
      callbackURL.type = "hidden";
      callbackURL.value = "<%= callbackURL %>";
      form.appendChild(callbackURL);

      var callbackParams = document.createElement("input");
      callbackParams.id = "<%= KEY_CALLBACK_PARAMS %>";
      callbackParams.name = "<%= KEY_CALLBACK_PARAMS %>";
      callbackParams.type = "hidden";
      callbackParams.value = "<%= callbackParams %>";
      form.appendChild(callbackParams);

      submitWithWaiting("form1", "<%= charset %>");
    }
  </script>
<%
		} else {
			if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null"))
				out.println(new StringBuilder("<li><input type=\"button\" onclick=\"submitWithWaiting('callback', '").append(charset).append("')\" value=\"确定\"/></li>"));
			else {
				if (showclose) {
					out.println("<li><input type=\"button\" onclick=\"javascript:window.close();\" value=\"关闭\"/></li>");
				}
			}
		} // end if (objectId > 0)
		out.println("</ul>");
%>
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
      <script language="javascript">
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
