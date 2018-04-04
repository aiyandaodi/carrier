<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!-- 
    * 系统服务列表页面
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" type="text/css" href="../../common/tek/css/list.css" />
<!--[if IE]> <link href="../http/common/css/listIE.css" rel="stylesheet" type="text/css" media="screen" /><![endif]-->

<link rel= "Shortcut Icon"   href= "../../images/tekinfo.ico"/>
<link rel= "Bookmark"   href= "../../images/tekinfo.ico"/>
<script language="javascript" type="text/javascript" src="../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../../common/tek/js/refresh.js"></script>
<link href="service.css" rel="stylesheet" type="text/css" media="screen" />
<title>系统服务列表</title>
</head>

<body>
<%@ page import="java.util.Enumeration" %>
<%@ page import="java.util.Hashtable" %>

<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.service.ServiceStructure" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.system.ServiceOp" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

  <div id="main">
<%@ include file="../../config.jsp" %>

<%
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
	StringHash p = parameters.getParameters();
	
	Result result = new Result();
	ServiceOp op = new ServiceOp(token.getTokenCode(), clientIp, result);
	
	int right = op.getRight();
	if (!Right.IsCanList(right)) {
		// 没有权限
		out.println("<div class='msg'>没有权限!</div>");
		return ;
	}
	
	if (Right.IsCanWrite(right)) {
		// 有操作权限。
		String[] start = DataUtility.StringToArray(parameters.getParameter("start"), ",");      //需要启动的服务
		if (start != null && start.length > 0) {
			for (String serviceName : start) {
				if (serviceName != null)
					op.startService(serviceName);
			}
		}
		String[] stop = DataUtility.StringToArray(parameters.getParameter("stop"), ",");       //需要停止的服务
		if (stop != null && stop.length > 0) {
			for (String serviceName : stop) {
				if (serviceName != null)
					op.stopService(serviceName);
			}
		}
		String[] enforce = DataUtility.StringToArray(parameters.getParameter("enforce"), ",");    //需要强制停止的服务
		if (enforce != null && enforce.length > 0) {
			for (String serviceName : enforce) {
				if (serviceName != null)
					op.enforceStopService(serviceName);
			}
		}
	} // end if (Right.IsCanWrite(right))
%>
    <!-- 自定义form -->
    <form id="form1" name="form1" method="post" accept-charset="<%=charset%>" style="display:none"></form>
<%
	// 刷新form
	ObjectPrint objectPrint = new ObjectPrint();
	String refreshForm = objectPrint.printRefreshForm(parameters, charset);
	if (refreshForm != null)
		out.println(refreshForm);
%>
    <!-- 菜单 -->
    <div id="menu">
      <ul class="menu">
        <li class="menuout" onMouseOver="this.className='menuover'" onMouseOut="this.className='menuout'" onclick="action('refresh');"><a href="#">刷新</a></li>
      </ul>
    </div>

    <p style="height:40px;">&nbsp;</p>
  
  <!-- 列表显示 -->
  <div id="listitem">
<%
	out.println("<ul id='listorder'>");
	out.println("<li class='first-column'>&nbsp;&nbsp;</li>");
	out.println("<li class='selectinfo'></li>");
	out.println("<li class='service-name'>服务名</li>");
	out.println("<li class='service-status'>状态</li>");
	out.println("<li class='service-type'>启动类型</li>");
	out.println("</ul>");

	ServiceStructure[] services = op.getServices();
	if (services != null && services.length > 0) {
		int i = 0;
		for (ServiceStructure serviceStructure : services) {
			if (serviceStructure == null)
				continue;
			
			out.print("<ul class='");
			if (((i++) % 2) == 0)
				out.print("item1");
			else
				out.print("item2");
			out.println("'>");
			
			out.println("<li class='first-column'>&nbsp;&nbsp;</li>");
			out.println("<li class='selectinfo'></li>");

			// 信息
			out.println("<li class='service-name'>" + serviceStructure.getName() + "</li>");
			out.print("<li class='service-status'>");
			switch (serviceStructure.getStatus()) {
			case ServiceStructure.STATUS_STOP:
				out.print("停止");
				break;
				
			case ServiceStructure.STATUS_STOPPING:
				out.print("正在结束");
				break;
			
			case ServiceStructure.STATUS_RUNNING:
				out.print("运行中");
				break;
			} // end switch (serviceStructure.getStatus())
			out.println("</li>");
			out.print("<li class='service-type'>");
			int runType = serviceStructure.getRunType();
			switch (runType) {
			case ServiceStructure.TYPE_FORBID:
				out.print("禁止运行");
				break;
			case ServiceStructure.TYPE_MANUAL:
				out.print("手动运行");
				break;
			case ServiceStructure.TYPE_AUTO:
				out.print("自动运行");
				break;
			} // end switch (runType)
			out.println("</li>");
			
			// 命令
			out.print("<li class='action'>");
			if (runType != ServiceStructure.TYPE_FORBID && Right.IsCanWrite(right)) {
				switch (serviceStructure.getStatus()) {
				case ServiceStructure.STATUS_STOP:
					// 未启动。显示"启动"选项
					out.print("<a href='#' onclick=\"action('start', '" + serviceStructure.getName() + "')\">启动</a>");
					break;
				
				case ServiceStructure.STATUS_STOPPING:
					// 正在停止。
					out.print("<a href='#' onclick=\"action('enforce', '" + serviceStructure.getName() + "')\">强制停止</a>");
					break;
					
				case ServiceStructure.STATUS_RUNNING:
					// 已经启动。显示"停止"、"强制停止"选项
					out.print("<a href='#' onclick=\"action('stop', '" + serviceStructure.getName() + "')\">停止</a>");
					out.print("&nbsp;&nbsp;");
					out.print("<a href='#' onclick=\"action('enforce', '" + serviceStructure.getName() + "')\">强制停止</a>");
					break;
				} // end switch (serviceStructure.getStatus())
			} // end if (Right.IsCanWrite(op.getRight())
			out.println("</li>");
			
			out.println("</ul>");
		} // end for (ServiceStructure serviceStructure : services)
	} // end for (int i = 0; i < records.length; i++)
%>
  </div>
  
  <script language="javascript">
    /**
     * 操作
     */
    function action(method, name) {
      var form=document.getElementById("form1");
      if (!form)
        return ;

      form.action="";
      form.innerHTML="";
  	  
      if (method == "start") {
        var flag = window.confirm("是否启动" + name + "服务?");
        if (!flag)
            return ;

        var start = document.createElement("input");
        start.id = "start";
        start.name = "start";
        start.type = "hidden";
        start.value = name;
        form.appendChild(start);
	  
      } else if (method == "stop") {
        //停止服务
        var flag = window.confirm("是否停止" + name + "服务?");
        if (!flag)
            return ;

        var stop = document.createElement("input");
        stop.id = "stop";
        stop.name = "stop";
        stop.type = "hidden";
        stop.value = name;
        form.appendChild(stop);
	  
	  } else if (method == "enforce") {
        //强制停止服务
        var flag = window.confirm("是否强制停止" + name + "服务?该操作可能造成软件异常!");
        if (!flag)
          return ;

        var enforce = document.createElement("input");
        enforce.id = "enforce";
        enforce.name = "enforce";
        enforce.type = "hidden";
        enforce.value = name;
        form.appendChild(enforce);
      }

<%= objectPrint.printJSInputParameters(p, parameters, "start", "stop", "enforce") %>

      form.submit();
    }
  
    setInterval("action('refresh')", 5000);
  </script>
<!-- end #main -->
</div>
</body>
</html>
