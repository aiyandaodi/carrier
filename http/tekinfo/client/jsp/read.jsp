<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：客户端读取页面。
参数：该页面使用参数。
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/read.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="../../../common/tek/css/read.css" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<script language="javascript" type="text/javascript" src="../../../common/tek/js/common.js"></script>
<script language="javascript" type="text/javascript" src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../../../common/js/normal.js"></script>
<script language="javascript" type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<script>
  $(document).ready(function() {
    checkMenu();
  });
</script>
<title>Client 客户端 - 读取</title>
<!-- #EndEditable -->
</head>

<body>
<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.ObjectRm" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.util.StringHash" %>
<!-- #BeginEditable "import" -->
<!-- 自己的import类 -->
<%@ page import="net.tekinfo.remoting.system.ClientRm" %>
<%@ page import="net.tekinfo.system.Client" %>
<!-- #EndEditable -->

<%@ include file="../../../config.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

  <div id="main">
<%
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
	StringHash p = parameters.getParameters();

    long objectId = 0L;
    ObjectRm remoting = null;
%>
<!-- #BeginEditable "init" -->
<!-- 初始化信息，包含objectId、remoting等 -->
<%
    objectId = DataUtility.StringToLong(parameters.getParameter(Client.FIELD_ID));
	remoting = new ClientRm();
%>
<!-- #EndEditable -->
<%   
	ObjectResult result = remoting.readInfo(token.getTokenCode(), clientIp, p);
	
	if (result == null) {
		out.println("<div class='msg'>操作失败!</div>");
		return;
	}
	
	int right = result.getRight();
	boolean create = Right.IsCanCreate(right);
	boolean write = Right.IsCanWrite(right);
	boolean list = Right.IsCanList(right);
	boolean read = Right.IsCanRead(right);
	boolean delete = Right.IsCanDelete(right);
	boolean admin = Right.IsCanAdmin(right);
	
	String title = "";
	Field[] fields = null;
	if (result.getCode() == Result.RESULT_OK) {
		Record[] records = result.getRecords();
		if (records != null && records.length > 0){
			for(Record record : records){
				if(record != null){
					objectId = record.getId();	
					title = DataUtility.GetSubstring(record.getName(), 20, "...");
					fields = record.getFields();

					break;
				}
			}	//end for(Record record:records)
		} // end if (records != null && records.length > 0)
			
	} else {
		// 操作错误
		String msg = result.getMessage();
		if (msg != null && !msg.isEmpty()) {
			out.print("<div class='msg'>");
			out.print(HttpUtility.StringToHTML(msg));
			out.println("</div>");
		}
	} // end if (result.getCode() == Result.RESULT_OK)
%>

  <!-- 自定义form -->
  <form id="form1" name="form1" method="post"  accept-charset="<%=charset%>" style="display:none"></form>
<%
	// 刷新form
	ObjectPrint objectPrint = new ObjectPrint();
	String refreshForm = objectPrint.printRefreshForm(parameters, charset);
	if (refreshForm != null)
		out.println(refreshForm);
%>

  <!-- 菜单 -->
  <ul id="menu">
<!-- #BeginEditable "menu" -->
<!-- 读取菜单 -->
    <div class="menu1">
<%
		if (write) {
			out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='edit();'><a>修改</a></li>");
			//out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='password();'><a>修改密码</a></li>");
		} // end if (Right.IsCanWrite(right))

		if (delete)
			out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='remove1();'><a>删除</a></li>");
%>
      <li class="menuout" onmouseover="this.className='menuover'" onmouseout="this.className='menuout'" onclick="refreshWithWaiting('<%= charset %>');"><a href="#">刷新</a></li>
    <!-- end .menu1 --></div>
    <script language="javascript">
      /**
       * 修改
       */
      function edit() {
        var form = document.getElementById("form1");
        if (form == null)
          return;

        form.innerHTML="";
        form.action = "edit.jsp";
        form.target="_self";
        if(navigator.userAgent.indexOf('MSIE')>=0)
          document.charset="<%=charset %>";
      
        var hidden = document.createElement("input");
        hidden.id = "<%=Client.FIELD_ID%>";
        hidden.name = "<%=Client.FIELD_ID%>";
        hidden.type = "hidden";
        hidden.value = "<%= objectId %>";
        form.appendChild(hidden);

        var callbackURL = document.createElement("input");
        callbackURL.id = "<%= KEY_CALLBACK_URL %>";
        callbackURL.name = "<%= KEY_CALLBACK_URL %>";
        callbackURL.type = "hidden";
        callbackURL.value = "<%= request.getRequestURL().toString() %>";
        form.appendChild(callbackURL);

        var callbackParams = document.createElement("input");
        callbackParams.id = "<%= KEY_CALLBACK_PARAMS %>";
        callbackParams.name = "<%= KEY_CALLBACK_PARAMS %>";
        callbackParams.type = "hidden";
        callbackParams.value = "<%=Client.FIELD_ID%>=<%=objectId%>";
        form.appendChild(callbackParams);
		
        var refreshOpener = document.createElement("input");
        refreshOpener.id = "refresh-opener";
        refreshOpener.name = "refresh-opener";
        refreshOpener.type = "hidden";
        refreshOpener.value = "true";
        form.appendChild(refreshOpener);

        form.submit();
      }
	  
      /**
       * 删除
       */
      function remove1() {
        var form = document.getElementById("form1");
        if (form == null)
          return;

        var remove = window.confirm("是否删除?");
        if (!remove)
          return ;

        form.innerHTML="";
        form.action = "remove.jsp";
        form.target="_self";
        if(navigator.userAgent.indexOf('MSIE')>=0)
          document.charset="<%=charset %>";
       
        var hidden = document.createElement("input");
        hidden.id = "<%=Client.FIELD_ID%>";
        hidden.name = "<%=Client.FIELD_ID%>";
        hidden.type = "hidden";
        hidden.value = "<%= objectId %>";
        form.appendChild(hidden);

        var showClose = document.createElement("input");
        showClose.id = "<%= KEY_SHOW_CLOSE %>";
        showClose.name = "<%= KEY_SHOW_CLOSE %>";
        showClose.type = "hidden";
        showClose.value = "1";
        form.appendChild(showClose);

        var refreshOpener = document.createElement("input");
        refreshOpener.id = "<%=KEY_REFRESH_OPENER%>";
        refreshOpener.name = "<%=KEY_REFRESH_OPENER%>";
        refreshOpener.type = "hidden";
        refreshOpener.value = "1";
        form.appendChild(refreshOpener);

        submitWithWaiting("form1", "<%= charset %>");
      }
	</script>
<!-- #EndEditable -->
  <!-- end #menu-->
  </ul>

<!-- #BeginEditable "info" -->
<!-- 显示数据信息 -->
<%
	if (fields != null && fields.length > 0) {
%>

  <!-- 数据 -->
  <div style="width:98%;">
    <ul id="info">
<%
		// 信息项
		for (Field field : fields) {
			if (field == null)
				continue;
			
			out.print("<li class='" +field.getName() + "'>");
			StringBuilder message = new StringBuilder();
			message.append(field.getDisplay()).append(":").append(field.getShow());
			out.print(HttpUtility.StringToHTML(message.toString()));
			out.println("</li>");
		} // end for (int j = 0; j < fields.length; j++)
%>
    <!-- end.info -->
    </ul>
  </div>
<%
	} // end if (fields != null && fields.length > 0)
%>
<!-- #EndEditable -->
<%
	if (title != null && !title.isEmpty()) {
%>
  <script language="javascript">
	function showTitle(title) {
		var sb = new StringBuffer();   
		
		sb.append("<li class='title'>");
		sb.append(title);
		sb.append("</li>");
		
		var elem = document.getElementById("menu");
	 	elem.insertAdjacentHTML('afterbegin', sb.toString());
		//alert(sb.toString());
	}
	showTitle("<%=title%>");
  </script>
<%
	} // end if (title != null && !title.isEmpty())
%>
<!-- #BeginEditable "other" -->
<!-- 其他内容 -->
<!-- #EndEditable -->
  <!-- end #main -->
  </div>
<%@ include file="../../../common/tek/jsp/shield.jsp" %>
</body>
<!-- #EndTemplate --></html>
