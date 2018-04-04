<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ page contentType="text/html; charset=utf-8" %>

<!--
功能：账户索引
参数：style -- 样式

-->

<%@ page import="com.takall.contact.Contact" %>
<%@ page import="com.takall.group.Group" %>
<%@ page import="net.tekinfo.message.mobile.MobileAccountOp" %>
<%@ page import="net.tekinfo.message.system.TextMessage" %>
<%@ page import="com.takall.group.Member" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="com.takall.organization.Organization" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.Record" %>
<%@ page import="com.takall.remoting.group.GroupRm" %>
<%@ page import="com.takall.remoting.organization.OrganizationRm" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<html>
<%@ include file="../../../config.jsp" %>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
<link   rel= "Shortcut Icon"   href= "../../../../favicon.ico"/>
<link   rel= "Bookmark"   href= "../../../../favicon.ico"/>

<title>我的账户</title>
</head>

<body>

<ul id="transfer-index-list">
  <li>
    <h2 onClick="transferTree(this);"><img src="../../../user/images/arrow2.png"/>我的账户</h2>
    <ul>
      <li onclick="selectElem(this, 'read.jsp');"><a>账户信息</a></li>
      <%
	  if(my.getSecurity()>=User.USER_REGISTER){
	  %>
      	<li onclick="selectElem(this, 'password.jsp');"><a>更改保密字</a></li>
      <%
	  } //end if(my.getSecurity()>=User.USER_APPLY)
	  %>
    </ul>       
  </li>
  <%		  
if(my.getSecurity()>=User.USER_REGISTER){
%>
<!-- 显示我所属的小组-->
  <li>
    <h2 onClick="transferTree(this);"><img src="../../../user/images/arrow2.png"/>我的小组</h2>
    <ul id="group-list">
      <script language="javascript">
        jquery_load("#group-list", "<%=request.getContextPath()%>/http/group/index-list-member.jsp?skip=0&count=10 #group-content");
      </script>
    </ul>
  </li>
<%
} //end  if(my.getSecurity()>=User.USER_REGISTER)
	  
  if(my.getSecurity()>=User.USER_REGISTER){
  %>  
  <li>
    <h2 onClick="transferTree(this);"><img src="../../../user/images/arrow2.png"/>系统短信</h2>
    <ul>
      <li onclick="selectElem(this, '../message/textmsg/list.jsp?<%=TextMessage.FIELD_RECEIVER%>=<%=my.getId()%>');"><a>收件箱</a></li>
      <li onclick="selectElem(this, '../message/textmsg/list.jsp?<%=TextMessage.FIELD_SENDER%>=<%=my.getId()%>');"><a>发件箱</a></li>
    </ul>
  </li>
  
  <li>
    <h2 onClick="transferTree(this);"><img src="../../../user/images/arrow2.png"/>通讯录</h2>
    <ul>
      <li onclick="selectElem(this, '../contact/index-contact.jsp?<%= User.FIELD_ID %>=<%= my.getId() %>');"><a>我的通讯录</a></li>
    </ul>
  </li>
 
  <li>
    <h2 onClick="transferTree(this);"><img src="../../../user/images/arrow2.png"/>我的对象</h2>
    <ul id="organization-list">
      <li onclick="selectElem(this, '../subject/index.jsp?subject_owner=<%=my.getId()%>');"><a>我的主题</a></li>
    </ul>
  </li>
<%
  } //end  if(my.getSecurity()>=User.USER_REGISTER)
%>

  <li>
    <h2 onClick="transferTree(this);"><img src="../../../user/images/arrow2.png"/>帮助</h2>
    <ul>
      <li id="defaultSelect" onclick="selectElem(this, 'help/index.html');"><a>用户指南</a></li>
    </ul>
  </li>
</ul>
        
 <script language="javascript" type="text/javascript">
   selectElem(document.getElementById("defaultSelect"), "help/index.html");
 </script>
    
</body>
</html>
