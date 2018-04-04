<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：移除"用户"对于属于"组"的对象的权限
参数：
	GroupObjectRight.FIELD_OBJECT_GROUP -- 对象所属组，如果为0表示everyone
    GroupObjectRight.FIELD_OBJECT_NAME -- 对象类型名
    GroupObjectRight.FIELD_OBJECT_ID -- 对象标识 如果为0，表示所有该类对象的默认权限
    GroupObjectRight.FIELD_USER -- 拥有权限的用户
    GroupObjectRight.FIELD_OBJECT_RIGHT -- 实际权限
    
    confirm -- 是否确认删除
-->

<%@ page import="com.takall.remoting.group.UserObjectRightRm" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="ftp server,manager,right" />
<meta name="description" content="ftp server,manager,right" />


<link   rel= "Shortcut Icon"   href= "file:///C|/tekinfo/tekinfo-9x/apache-tomcat-64bit-7.0.26/webapps/tekinfo.ico"/>
<link   rel= "Bookmark"   href= "file:///C|/tekinfo/tekinfo-9x/apache-tomcat-64bit-7.0.26/webapps/tekinfo.ico"/>
<link href="../../../style.css" rel="stylesheet" type="text/css" media="screen" />


<title>用户权限移除 </title>
</head>


<body>

<%@ include file="../../../config.jsp" %>

<%

Parameters parameter=new Parameters(token.getTokenCode(),clientIp,request);
//System.out.println("0000000000000000000000000 idss="+parameter.getParameter("group_object_right_id"));

UserObjectRightRm remoting=new UserObjectRightRm();
ObjectResult result=remoting.removeInfo(token.getTokenCode(),clientIp,parameter.getParameters());
out.println(result.getMessage());

%>
<script language="javascript" type="text/javascript">
opener.document.location.reload();
</script>
        
</body>
</html>
