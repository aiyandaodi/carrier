<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ page contentType="text/html; charset=utf-8" %>

<!--
功能：对象操作记录索引列表
参数：
    
	order -- 排序
    desc -- 是否倒序
    skip -- 查询的起始位置，默认为0。
    count -- 一次显示数量，默认为30。
    quick-search  -- 快速检索的输入内容。

-->

<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.object.ObjectRecordOp" %>
<%@ page import="net.tekinfo.object.ObjectRecord" %>
<%@ page import="net.tekinfo.object.ObjectOp" %>
<%@ page import="net.tekinfo.http.Parameters" %>

<%@ page import="net.tekinfo.remoting.Field" %>

<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.Record" %>
<%@ page import="net.tekinfo.remoting.ObjectRecordRm" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.system.User" %>

<%@ page import="net.tekinfo.system.LocaleManager" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%@ page import="java.util.Map.Entry" %>
<%@ page import="java.util.Iterator" %>

<html>
<%@ include file="../../../config.jsp" %>


<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
<link   rel= "Shortcut Icon"   href= "../../../images/tekinfo.ico"/>
<link   rel= "Bookmark"   href= "../../../images/tekinfo.ico"/>

<link rel="stylesheet" href="../../../common/tek/css/index-object.css" type="text/css" media="all">
<!--[if IE]> <link href="index-objectIE.css" rel="stylesheet" type="text/css" media="screen" /><![endif]-->   
<link rel="stylesheet" href="index-record.css" type="text/css" media="all">

<script src="../../../common/js/normal.js"></script>
<script src="../../../common/tek/innerwin/InnerWindow.js"></script>
<script type="text/javascript" src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>


<title>对象操作记录</title>
</head>

<body>
<div id="load_content">
<%
	LocaleManager lm=tekinfo.getLocaleManager();
	
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
	StringHash para=parameters.getParameters();
	ObjectPrint objectPrint = new ObjectPrint();
	
	ObjectRecordRm remoting = new ObjectRecordRm();

	final int PAGE_COUNT = 10;    //默认一页显示数量
	String quickSearch = parameters.getParameter("quick-search");
	int skip = DataUtility.StringToInt(parameters.getParameter("skip"));
	int count = DataUtility.StringToInt(parameters.getParameter("count"));
	boolean desc = DataUtility.StringToBoolean(parameters.getParameter("desc"));
	String order = parameters.getParameter("order");
	if (order == null || order.isEmpty()){
		order = ObjectRecord.FIELD_TIME;
		if(parameters.getParameter("desc")==null)
			desc=true;
	}

	if(count == 0)
		count = PAGE_COUNT;

	ObjectResult result = remoting.getList(token.getTokenCode(), clientIp,  para, quickSearch,order, desc, skip, count);
	
	if (result == null) {
		out.println("<div class='msg'>操作失败!</div>");
		return;
	} // end if (result == null)

	int total = DataUtility.StringToInt(result.getValue());    //信息总数
	int right = result.getRight();    //权限
%>

<div id="content_area" class="content_area">

<%	

	if (result.getCode() == Result.RESULT_OK) {
%>
	<!-- 显示主要信息 -->
  <div class="title_area">
    <div class="list_area"><!-- 菜单 -->
<%
		/*if (Right.IsCanList(right)) {
			out.print("<a href='list.jsp?");
			out.print(parameters.getHtmlParameter());
			out.println("'>列表</a>");
		}*/
%>
    </div>
    
    <div class="search_area">

  <form id="search" action="index-record.jsp" method="post"  accept-charset="<%=charset%>" onsubmit="javascript:if(navigator.userAgent.indexOf('MSIE')&gt;=0)document.charset='<%=charset%>';">
    <input id="<%= ObjectOp.PARA_QUICKSEARCH %>" name="<%= ObjectOp.PARA_QUICKSEARCH %>" class="inputBox" type="text" size="15" value="<%= (quickSearch != null && !quickSearch.isEmpty() && !quickSearch.equals("null")) ? quickSearch : "记录查询" %>" onclick="javascript:this.select();"/>
    <button id="searchBtn" type="submit"></button>
    <%= objectPrint.printInputParameters(para, ObjectOp.PARA_SKIP, ObjectOp.PARA_QUICKSEARCH) %>
  </form>
    </div>
  <!-- end.title_area--></div>


<%
		Record[] records = result.getRecords();
		
		if (records != null && records.length > 0) {
			
			for (Record record : records) {
				if (record == null)
						continue;
				
				long id = record.getId();
				String name = record.getName();
				
	
				Field[] fields = record.getFields();
				if (fields != null) {
					
					out.println("<ul class='item_area'>");
					String recordTime="";
					String recordName="";
					String recordUserName="";
					String recordObject=null;
					long recordObjectId=0;
					String recordCommand=null;
					String recordRemark="";
					String recordOS="";
					
					long userId=0;
					
					StringBuilder sb=new StringBuilder();
					sb.append("from:");
					
					
					StringBuilder st=new StringBuilder();
					st.append("at:");
					
					for(Field field:fields){
						 //输出内容
						if (field == null)
							continue;
						

						String fieldname = field.getName();
						if (fieldname == null)
							continue;
							
						if(fieldname.equals(ObjectRecord.FIELD_TIME)){
							recordTime=field.getShow();
						}else if(fieldname.equals(ObjectRecord.FIELD_NAME)){
							recordName=field.getShow();
						}else if(fieldname.equals(ObjectRecord.FIELD_DISPLAY)){
							recordUserName=field.getShow();
						}else if(fieldname.equals(ObjectRecord.FIELD_USER)){
							userId=DataUtility.StringToLong(field.getValue());
						}else if(fieldname.equals(ObjectRecord.FIELD_OBJECT)){
							recordObject=field.getValue();
						}else if(fieldname.equals(ObjectRecord.FIELD_OBJECTID)){
							recordObjectId=DataUtility.StringToLong(field.getValue());
						}else if(fieldname.equals(ObjectRecord.FIELD_COMMAND)){
							recordCommand=field.getValue();
						}else if(fieldname.equals(ObjectRecord.FIELD_REMARK)){
							recordRemark=field.getValue();
						}else if(fieldname.equals(ObjectRecord.FIELD_OS)){
							recordOS=field.getShow();
							
						}else if(fieldname.equals(ObjectRecord.FIELD_IP)){
							sb.append("&nbsp; IP:"+field.getShow());
							sb.append(";");

						}else if(fieldname.equals(ObjectRecord.FIELD_LONGITUDE)){
							st.append("&nbsp;经度:"+field.getShow());
							st.append(";");

						}else if(fieldname.equals(ObjectRecord.FIELD_LATITUDE)){
							st.append("&nbsp; 纬度:"+field.getShow());
							st.append(";");
						}else if(fieldname.equals(ObjectRecord.FIELD_HEIGHT)){
							st.append("&nbsp; 高度:"+field.getShow());
							st.append(";");
						}
					} //end for(Field field:fields)
					
					boolean isAdminShow=false;
					if(my.getSecurity()>=User.USER_ADMIN || my.getId()==userId)
						isAdminShow=true;
						
					String urlpath=null;
					if(recordObject!=null){
						if(recordObject.equals("Subject")){
							urlpath="../subject/read.jsp?subject_id=";
						}else if(recordObject.equals("Member")){
							urlpath="../member/read.jsp?member_id=";
						}else if(recordObject.equals("User")){
							urlpath="../user/read.jsp?user_id=";
						}else if(recordObject.equals("Group")){
							urlpath="../group/read.jsp?group_id=";
						}
						
					}
					
					String operation=null;
					if(recordCommand!=null){
						if(recordCommand.equals("add")){
							operation="创建";
						}else if(recordCommand.equals("read")){
							operation="读取";
						}else if(recordCommand.equals("list")){
							operation="列表";
						}else if(recordCommand.equals("edit")){
							operation="编辑";
						}else if(recordCommand.equals("remove")){
							operation="删除";
						}else
							operation=recordCommand;
					}else
						operation="未知操作";
					
					out.print("<li class='record_time'>");
					out.print(recordTime);
					out.println("</li>");
					
					out.print("<li class='record_userdisplay'>");
					if(isAdminShow){
						//管理员，或者自己可以查看
						out.print("<a href='../user/read.jsp?user_id=");
						out.print(userId);
						out.print("' target='_blank'>");
					}
					out.print(recordUserName);
					if(isAdminShow)
						out.print("</a>");
					out.println("</li>");
					
					out.print("<li class='record_command'>");
					out.print(operation);
					out.println("</li>");
					
					out.print("<li class='record_name' style='margin-bottom:5px;'>");
					if(urlpath!=null){
						out.print("<a href='");
						out.print(urlpath);
						out.print(recordObjectId);
						out.print("' target='_blank'>");
					}
					out.print(recordName);
					if(urlpath!=null)
						out.print("</a>");
					out.println("</li>");
					
					out.println("<hr/>");
					
					out.print("<li class='record_object' style='margin-top:5px;>");
					out.print("被操作对象:&nbsp;");
					out.print(lm.getObjectString(recordObject,"name"));
					out.print("[");
					out.print(recordObjectId);
					out.print("]");
					out.println("</li>");
					
					out.print("<li class='record_object'>");
					out.print("操作命令:&nbsp;");
					out.print(operation);
					out.print("(");
					out.print(recordCommand);
					out.print(")");
					out.println("</li>");
					
					
					out.print("<li class='record_os'>");
					out.print("操作平台:&nbsp;");
					out.print(recordOS);
					out.println("</li>");
					
					out.print("<li class='record_remark'>");
					out.print("操作内容:&nbsp;");
					out.print(recordRemark);
					out.println("</li>");
					
					
					if(isAdminShow){
						out.print("<li class='record_at'>");
						out.print(st.toString());
						out.println("</li>");
					}
					
					out.print("<li class='record_from'>");
					out.print(sb.toString());
					out.println("</li>");
				  
				    out.println("</ul>");
					
				} //end if (fields!=null)
						
			} // end for (Record record : records)

		} else {
			out.println("<div class='msg'>没有数据!</div>");
		} // end if (records != null && records.length > 0) else
	} // end if (result != null && result.getCode() == Result.RESULT_OK
	else
	{
		out.print("<div class='msg'>");
		out.print(result.getCode());
		out.print(" : ");
		out.print(result.getMessage());
		out.println("</div>");
	}	
%>

    
    <!-- 翻页按钮 -->
    <div id="turnpage">
      <ul class="menu">
<%
  	if(total > count && skip > 0) {
		out.print("<li><a href=\"javascript:turnpage(");
		int prevskip = 0;
		if(skip > count)
			prevskip = skip - count;
		out.print("'");
		out.print(prevskip);
		out.println("');\">上一页</a></li>");
	}
	
	if(total > count && count > 0 && total > (count + skip)) {
		out.print("<li><a href=\"javascript:turnpage(");
		out.print("'");
		out.print((skip + count));
		out.println("');\">下一页</a></li>");
	}
%>
      <!-- end.menu-->
      </ul>
      <script language="javascript">
	    /**
		 * 翻页
		 * 
		 * @param skip
		 *           跳过记录数
		 */
        function turnpage(skip) {
          var form = document.getElementById("form1");
          if (!form) {
            createForm("form1", "<%= charset %>");
            form = document.getElementById("form1");
          }

          if (form != null) {
            form.innerHTML="";
            form.target="_self";
            form.action = "";
            if(navigator.userAgent.indexOf('MSIE')>=0)
		      document.charset="<%=charset %>";
          
          //skip
          if (skip) {
            var skipElem = document.createElement("input");
            skipElem.id = "skip";
            skipElem.name = "skip";
            skipElem.type = "hidden";
            skipElem.value = skip;
            form.appendChild(skipElem);
          }
<%
	if (para != null && para.size() > 0) {
		out.println("var hidden;");
		
		Iterator<Entry<String, String>> iterator = para.entrySet().iterator();
		if (iterator != null) {
			while (iterator.hasNext()) {
				Entry<String, String> entry = iterator.next();
				String key = entry.getKey();
				String value = entry.getValue();
				if (key == null || key.isEmpty() || key.equals("skip"))
					continue;
			
				if (value != null) {
					out.println("hidden=document.createElement(\"input\");");
					out.println("hidden.id=\"" + key + "\";");
					out.println("hidden.name=\"" + key + "\";");
					out.println("hidden.type=\"hidden\";");
					out.println("hidden.value=\"" + value + "\";");
					out.println("form.appendChild(hidden);");
				}
			}
		} // end if (iterator != null)
	} // end if (p != null && p.size() > 0)
%>
            form.submit();
          } 
		}
	  </script>    <!-- end .turnpage --></div>
<!-- end.content_area--></div>       
     

<div class="rightcolumn_area">
  <div id="offen-content"></div>
<!-- end rightcolumn_area--></div>

</div>
</body>

</html>
