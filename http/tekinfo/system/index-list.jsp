<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ page contentType="text/html; charset=utf-8" %>

<!--
功能：系统操作
参数:
-->

<html>
<%@ include file="../../config.jsp" %>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
<link rel="Shortcut Icon" href= "../../../favicon.ico"/>
<link rel="Bookmark" href= "../../../favicon.ico"/>

<title>系统操作</title>
</head>

<body>

<ul>
<%		  
	if(my.getSecurity()>=User.USER_ADMIN){
%>
	  <li><h2>用户管理</h2>
    	<ul>
          <li onclick="selectElem(this, '../user/list.jsp');"><a>用户管理</a></li>
          <li onclick="selectElem(this, '../group/list.jsp');"><a>组管理</a></li>
          <li onclick="selectElem(this, '../space/list.jsp');"><a>空间管理</a></li>
          <!-- <li onclick="selectElem(this, '../organization/list.jsp');"><a>机构管理</a></li> -->
          <li onclick="selectElem(this, '../organization/tree.jsp');"><a>机构管理</a></li>
		</ul>
      </li>
      
      <li><h2>对象管理</h2>
    	<ul>
          <li onclick="selectElem(this, '../object/index-record.jsp');"><a>对象记录</a></li>
		</ul>
      </li>
      
      <li><h2>设备管理</h2>
        <ul>
          <li onclick="selectElem(this, '../resource/device/list.jsp');"><a>端口设备</a></li>
          <li onclick="selectElem(this, '../message/mobile/account/list.jsp');"><a>手机账号</a></li>
          <li onclick="selectElem(this, '../message/mobile/answer/list.jsp');"><a>短信应答</a></li>
          <li onclick="selectElem(this, '../message/mobile/sendqueue/list.jsp');"><a>发送队列</a></li>
          <li onclick="selectElem(this, '../message/mobile/recvqueue/list.jsp');"><a>接收队列</a></li>
        </ul>        
      </li>
      <li><h2>主题管理</h2>
        <ul>
          <li onclick="selectElem(this, '../subject/subject-tag/index.jsp?tag_object=Subject');"><a>标签分类</a></li>
        <li onclick="selectElem(this, '../subject/subject-catalog/tree.jsp?catalog_object=default&catalog_type=product');"><a>产品目录</a></li>
        </ul>        
      </li>
      <li><h2>系统管理</h2>
         <ul>
           <li onclick="selectElem(this, 'service.jsp');"><a>系统服务</a></li>
           <li><a href="javascript:openAbsoluteContent('/DBExplorer');">数据库管理</a></li>
           <li onclick="selectElem(this, 'initial.html');"><a>系统初始化</a></li>
         </ul>
      </li>
	  <%  
	  } //end  if(my.getSecurity()>=User.USER_ADMIN)
	  %>
</ul>
    
<script language="javascript" type="text/javascript">
 selectElem(document.getElementById("defaultSelect"), 'help/index.html');
</script>
</body>
</html>
