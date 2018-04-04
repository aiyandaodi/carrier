<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ page contentType="text/html; charset=utf-8" %>

<!--
功能：通讯录索引列表
参数：
    Member.FIELD_OWNER -- 通讯录所属用户
	order -- 排序
    desc -- 是否倒序
    skip -- 查询的起始位置，默认为0。
    count -- 一次显示数量，默认为30。
    quick-search  -- 快速检索的输入内容。

-->

<%@ page import="com.takall.group.Member" %>
<%@ page import="com.takall.group.MemberOp" %>

<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.Field" %>
<%@ page import="net.tekinfo.remoting.ObjectRm" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.Record" %>
<%@ page import="com.takall.remoting.ObjectRecordRm" %>

<%@ page import="net.tekinfo.object.Command" %>
<%@ page import="net.tekinfo.object.ObjectOp" %>
<%@ page import="net.tekinfo.object.ObjectRecord" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>


<html>
<%@ include file="../../../config.jsp" %>


<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
<link   rel= "Shortcut Icon"   href= "../../../../favicon.ico"/>
<link   rel= "Bookmark"   href= "../../../../favicon.ico"/>

   
<link rel="stylesheet" href="../../../object/index-member.css" type="text/css" media="all">
<!--[if IE]> <link href="index-memberIE.css" rel="stylesheet" type="text/css" media="screen" /><![endif]-->
<script src="../../../common/js/normal.js"></script>

<title>常访问组员</title>
</head>

<body>
<%
long owner=my.getId();
	
StringHash para=new StringHash();
para.put(ObjectRecord.FIELD_USER,owner);
para.put(ObjectRecord.FIELD_OBJECT,Member.OBJECT);
para.put(ObjectRecord.FIELD_COMMAND,Command.COMMAND_READ);

ObjectRecordRm remoting = new ObjectRecordRm();
ObjectResult result = remoting.getList(token.getTokenCode(), clientIp, para,null,ObjectRecord.FIELD_TIME, true, 0,20);

if (result.getCode() == Result.RESULT_OK) {
	Record[] records = result.getRecords();
	if (records != null && records.length > 0) {
		for (Record record : records) {
			if (record == null)
					continue;

			long id = record.getId();
			
			Field[] fields = record.getFields();
			if (fields != null) {
				String subject = record.getName();
				String remark=subject;
				String objectid="0";
				for (Field field:fields) { //输出内容
					if (field == null)
						continue;

					String fieldname = field.getName();
					if(fieldname.equals(ObjectRecord.FIELD_REMARK))
						remark=field.getValue();
					else if(fieldname.equals(ObjectRecord.FIELD_OBJECTID))
						objectid=field.getValue();
					
					//out.println("0000000000000000000 name="+field.getName()+":"+field.getValue());
				} //end for (int i = 0; i < fields.length; i++)
				
				out.println("<div class='column'>");
				out.print("<div class='member_name'><a href='javascript:readMember(");
				out.print(objectid);
				out.print(");'>");
				out.print(subject);
				out.println("</a></div>");
				out.println("<div class='member_content'>");
				out.print(HttpUtility.StringToHTML(remark));
				out.println("</div>");
			
				out.print("<p><a href='javascript:readMember(\"");
				out.print(objectid);
				out.print("\");'>");
				out.print("read more");
				out.println("</a></p>");
				out.println("</div>");
          	} //end if (fields!=null)
		} //end for (Record record : records)
	} // end if (records != null && records.length > 0)
}
%>
    

  

</body>
<script  language="javascript" type="text/javascript">
function readMember(id){
		 
	var form = document.getElementById("form1");
        if (!form) {
          createForm("form1", "<%= charset %>");
          form = document.getElementById("form1");
 		}
        if (form != null) {
          form.innerHTML="";
          form.target="_blank";
          form.action = "read.jsp";
		 
          if(navigator.userAgent.indexOf('MSIE')>=0)
		    document.charset="<%=charset %>";
        
		  var hidden1 = document.createElement("input");
          hidden1.id = "<%=Member.FIELD_ID%>";
          hidden1.name = "<%=Member.FIELD_ID%>";
          hidden1.type = "hidden";
          hidden1.value = id;
          form.appendChild(hidden1);
	  
	  	  form.submit();
	  	}
	  }
</script>

</html>
