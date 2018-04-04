<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>


<!--
说明："系统用户"对于属于"组"的对象的权限
参数：
	UserObjectRight.FIELD_OBJECT_GROUP -- 对象所属组，如果为0表示everyone
    UserObjectRight.FIELD_OBJECT_NAME -- 对象类型名
    UserObjectRight.FIELD_OBJECT_ID -- 对象标识 如果为0，表示所有该类对象的默认权限
    
    show-title -- 显示题头
 
    order -- 排序
    desc -- 是否倒序
    skip -- 查询的起始位置，默认为0。
    count -- 一次显示数量，默认为30。
    quick_search  -- 快速检索的输入内容。
-->
<%@ page import="com.takall.group.Group" %>
<%@ page import="com.takall.group.UserObjectRight" %>
<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.Field" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.Record" %>
<%@ page import="com.takall.remoting.group.UserObjectRightRm" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.util.DataUtility" %>


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="user, server,manager,list,组员,客户" />
<meta name="description" content="user, server,manager,list,组员,客户" />
<link rel="stylesheet" type="text/css" href="style.css" />
<link rel="stylesheet" type="text/css" href="list.css" />
<link rel= "Shortcut Icon"   href= "../../../../favicon.ico"/>
<link rel= "Bookmark"   href= "../../../../favicon.ico"/>

<script language="javascript" type="text/javascript" src="../../../common/tek/js/common.js"></script>

<title>用户权限 - 管理</title>
</head>

<%@ include file="../../../config.jsp" %>


<body>
<div id="main">
<%
int pageCount = 20;
Parameters parameters = new Parameters(token.getTokenCode(),clientIp,request);
long groupId = DataUtility.StringToLong(parameters.getParameter(Group.FIELD_ID));
String quickSearch = parameters.getParameter("quick-search");
String showTitle = parameters.getParameter("show-title");
if(showTitle==null)
	showTitle="";
	
boolean isBrowse = DataUtility.StringToBoolean(parameters.getParameter("browse"));
int skip =DataUtility.StringToInt(parameters.getParameter("skip"));
int count =DataUtility.StringToInt(parameters.getParameter("count"));
if(count==0)
	count=pageCount;
String order = parameters.getParameter("order");
boolean desc =DataUtility.StringToBoolean(parameters.getParameter("desc"));

UserObjectRightRm remoting = new UserObjectRightRm();
ObjectResult result = remoting.getList(token.getTokenCode(), clientIp, parameters.getParameters(), quickSearch,
		order, desc, skip, count);
		
if (result == null) {
	out.println("<div class='msg'>操作失败!</div>");
	return;
}


int total=DataUtility.StringToInt(result.getValue());
int right=result.getRight();

String userObjectName = parameters.getParameter(UserObjectRight.FIELD_OBJECT_NAME);
long userObjectId = DataUtility.StringToLong(parameters.getParameter(UserObjectRight.FIELD_OBJECT_ID));
long userGroupId = DataUtility.StringToLong(parameters.getParameter(UserObjectRight.FIELD_OBJECT_GROUP));

String setURL=new StringBuilder("set.jsp?confirm=1&").append(UserObjectRight.FIELD_OBJECT_NAME).append("=").append(userObjectName).append("&").append(UserObjectRight.FIELD_OBJECT_ID).append("=").append(userObjectId).append("&").append(UserObjectRight.FIELD_OBJECT_GROUP).append("=").append(userGroupId).toString();
String removeURL=new StringBuilder("remove.jsp?confirm=1&").append(UserObjectRight.FIELD_OBJECT_NAME).append("=").append(userObjectName).append("&").append(UserObjectRight.FIELD_OBJECT_ID).append("=").append(userObjectId).append("&").append(UserObjectRight.FIELD_OBJECT_GROUP).append("=").append(userGroupId).toString();

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
  <ul class="menu">
<%
	if (Right.IsCanAdmin(right)) {
%>
    <li id="new" name="new"><a href="#" onclick="browse('../list.jsp?browse=1&amp;open-url=user-right/list.jsp');">新增用户</a></li>
    <script language="javascript">
	  /*
       * 调用选择页面
       */
      function browse(url) {
        window.open(url);
      }
	</script>
<%
	} // end if (Right.IsCanCreate(right))
	
%>
    <li><a href="javascript:submitForm('refreshForm', '<%= charset %>');">刷新</a></li>
  <!-- end .menu -->
  </ul>


  <!-- 检索框 -->
  <div id="search_box" class="search">
   <%=showTitle%>
  <!-- end.search_box-->
  </div>



    <p></p>
    <p>&nbsp;</p>
    <div id="listitem">
      <ul id="listorder">
      <li class='first-blank'></li>
		<li class="user_username">用户名</li>
        <li  class='file-right'>列表</li>
        <li class='file-right'>读权</li>
        <li class='file-right'>创建</li>
        <li class='file-right'>修改</li>
        <li class='file-right'>删除</li>
        <li class='file-right'>管理</li>
        <li>设置</li>
        <li>移除</li>
        <li class="modifyTime">修改时间</li>
	  </ul>
      
      <script language="javascript" type="text/javascript">
<%
	if (result.getCode() == Result.RESULT_OK) {
		Record[] records = result.getRecords();
		
		if (records != null && records.length > 0) {
			for(Record record:records){
  	  			if(record==null) continue;
	  
      			Field []fields=record.getFields();
      			if(fields!=null && fields.length>0){
		  			long id=record.getId();
					
		            String systemUser="0";
		  			String name=null;
		  			String myright="0";
		  			String modify="";
		  
		  			for(Field field:fields){
			  			if(field==null)
			  				continue;
			//  System.out.println("0000000000000000000 key="+field.getName()+";value="+field.getValue());
			
			  			if(field.getName().equals(UserObjectRight.FIELD_NAME))
			  				name=field.getShow();
			  			else{
				  			if(field.getName().equals(UserObjectRight.FIELD_OBJECT_RIGHT))
			  					myright=field.getValue();
				  			else
				  			{
					   			if(field.getName().equals(UserObjectRight.FIELD_USER))
			  						systemUser=field.getValue();
								else
								{
									if(field.getName().equals(UserObjectRight.FIELD_MODIFY_TIME))
										modify=field.getShow();
								}
				  			}
			  			}
		  			} //end for(Field field:fields)
		  
		  
          			out.print("showUserRight('");
		  			out.print(id);
					out.print("','");
		  			out.print(systemUser);
		  			out.print("','");
		  			out.print(name);
		  			out.print("','");
		  			out.print(myright);
		  			out.print("','");
		  			out.print(modify);
		  			out.println("');");
		  
      			} //end if(fields!=null && fields.length>0)
  			} // end for(int i=0;i<records.length;i++)
				
		} // end if (records != null && records.length > 0)
	} // end if (result != null && result.getCode() == Result.RESULT_OK
	else
	{
		out.println(result.getCode());
		out.println(" : ");
		out.println(result.getMessage());	
	}	
%>
	<!-- 显示一个组权限 -->
	function showUserRight(id,systemUser,name,right,modify){
		
		document.writeln(getString(id,systemUser,name,right,modify));
	}
	
	function selectUser(userId,userName){
	 
	  	var elem = document.getElementById("listitem");
	 	var str=getString(0,userId,userName,0,"");
		
	 	elem.insertAdjacentHTML('AfterEnd', str);
 	}
	
	function getString(id,systemUser,name,right,modify){
		
		var sb = new StringBuffer();   
		
		sb.append("<ul class='item'>");
		
		sb.append("<form id='");
		sb.append(id);
		sb.append("' action='' method='post' accept-charset='<%=charset%>' onsubmit='javascript:if(navigator.userAgent.indexOf(\"MSIE\")>=0)document.charset=\"<%=charset%>\";' >");
		
		sb.append("<li class='group_member_groupname'>");
		sb.append(name)
		sb.append("</li>");
		
		
		sb.append("<li class='file-right'><input name='right' type='checkbox' value='0x01'");
		if(right & 0x1 ){
			sb.append(" checked");
		}
		sb.append("/></li>");
		
		sb.append("<li class='file-right'><input name='right'   type='checkbox' value='0x02'");
		if(right & 0x2 ){
			sb.append(" checked");
		}
		sb.append("/></li>");
		
		sb.append("<li class='file-right'><input name='right'  type='checkbox' value='0x04'");
		if(right & 0x4 ){
			sb.append(" checked");
		}
		sb.append("/></li>");
		
		sb.append("<li class='file-right'><input name='right'  type='checkbox' value='0x08'");
		if(right & 0x8 )
			sb.append(" checked");
		sb.append("/></li>");

		sb.append("<li class='file-right'><input name='right'  type='checkbox' value='0x010'");
		if(right & 0x10 )
			sb.append(" checked");
		sb.append("/></li>");
		
		sb.append("<li class='file-right'><input name='right'  type='checkbox' value='0x80'");
		if(right & 0x80 )
			sb.append(" checked");
		sb.append("/></li>");
		
		sb.append("<li><input name='modify' type='button' value='设置' onclick='javascript:modifyRight(\"");
		sb.append(id);
		sb.append("\",\"");
		sb.append(systemUser);
		sb.append("\");'/></li>");
		
		sb.append("<li><input name='remove' type='button' value='移除' onclick='javascript:removeRight(\"");
		sb.append(id);
		sb.append("\",\"");
		sb.append(systemUser);
		sb.append("\");'/></li>");
		
		sb.append("<li class='modifyTime'>");
		sb.append(modify);
		sb.append("</li>");
		
		
		sb.append("</form></ul>");
		//alert(sb.toString());
		return sb.toString();
	}
	
	function modifyRight(id,systemUser){
		//alert(systemUser);
		var rightform=document.getElementById(id);
		var myright=0x00;
		
		for(var i=0; i<rightform.right.length; i++)
        {
          if(rightform.right[i].checked)
          {
			  myright|=rightform.right[i].value;
          }
        } //end for(var i=0; i<form.right.length; i++)
		
		var url="<%=setURL%>&<%=UserObjectRight.FIELD_OBJECT_RIGHT%>="+myright+"&<%=UserObjectRight.FIELD_USER%>="+systemUser+"&<%=UserObjectRight.FIELD_ID%>="+id;
		//alert(url);
		openURL(url);
	}
	
	function removeRight(id,systemUser){
		
		var url="<%=removeURL%>&<%=UserObjectRight.FIELD_USER%>="+systemUser+"&<%=UserObjectRight.FIELD_ID%>="+id;
		openURL(url);
	}
	
	function openURL(url)
	{
		var popwin=window.open(url,"groupRightOp","scrollbars=no,menubar=no,toolbar=no,width=360,height=400");
		popwin.moveTo((screen.width-360)/2,(screen.height-400)/2);
	}
	
</script>

	
	<!-- end.listitem--></div>
 
 
<!-- end.main --></div>
</body>

</html>
