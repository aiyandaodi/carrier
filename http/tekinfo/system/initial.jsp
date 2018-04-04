<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ page contentType="text/html; charset=UTF-8" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<meta name="keywords" content="" />
<meta name="description" content="" />

<link href="style.css" rel="stylesheet" type="text/css" media="screen" />
<link href="../../interface/default/calendar/style1.css" type="text/css" rel="stylesheet">

<!--[if IE]>
<style type="text/css">
#sidebar #calendar {
	background-position: 0px 20px;
}
</style>
<![endif]-->

<title>TekInfo TAKALL - System</title>
</head>
<body>
<%@ include file="../../config.jsp" %>
 

<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="com.takall.remoting.UserRemoting" %>

<%
	if (!isLogin) {
		// δ��¼�����ӵ���¼ҳ��
		ObjectPrint objectPrint = new ObjectPrint();
		String redirectHTML = objectPrint.printRedirectLoginPage(request, "warn.jsp");
		if (redirectHTML != null)
			out.println(redirectHTML);
			
		return ;
	}
	
	if (my.getSecurity() <= User.USER_ADMIN || my.getStatus() != User.STATUS_NORMAL) {
		out.println("û��Ȩ��!<br/>");
		return ;	
	}
%>

<!-- start page -->
<div id="page">
	<!-- start content -->
	<div id="content">
		<div class="post">
			<h2 class="title">�½�ϵͳ</h2>
			<div class="entry">
				<h3>�����µ�ϵͳ</h3>
			  <p>1��ȷ��������ݿ��Ѿ�������&ldquo;��&rdquo;����ȷ��tekinfo.xml���Լ����ݿ�xml�е�����������ȷ��</p>
			  <p>2��<a href="createTable.jsp">�������ݿ�&ldquo;��&rdquo;</a></p>
			  <p>3��<a href="initTable.jsp">��ʼ�����ݿ�&ldquo;��&rdquo;�е�����</a></p>
			  <p>&nbsp;</p>
			</div>
			<p class="meta">Powered  by <a href="../../interface/default/www.tekinfo.net" >TekInfo</a>&nbsp;|&nbsp; IPSAY<a href="http://www.ipsay.com" > ipsay.com</a></p>
		</div>
		<div class="post">
			<h2 class="title">����ϵͳ</h2>
			<div class="entry">
				<h3>�½�ϵͳ��ɺ������Ҫ��8.x��ǰ��ϵͳ������������￪ʼ</h3>
				<p>1��ȷ��������xml��д��ȷ��</p>
				<p>2��<a href="transfer.jsp">��ʼ��������</a></p>
			</div>
			<p class="meta">Powered  by <a href="../../interface/default/www.tekinfo.net">TekInfo</a> &nbsp;|&nbsp;Build on <a href="../../interface/default/www.takall.com">TekInfo TAKALL</a></p>
		</div>
	</div>
	<!-- end content -->
	
</div>

</body>
</html>
