<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：User的读取程序
参数：user_id - 对象标识。如果为0，读取当前用户的信息。
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
<!-- 加入自己的head -->
<meta name="keywords" content="user,server,manager,list,用户" />
<meta name="description" content="user,server,manager,list,用户" />
<link rel="stylesheet" type="text/css" href="read.css" />
<script>
  $(document).ready(function() {
    initWaiting(null, 70, 70);
	checkMenu();
  });
</script>
<title>系统用户 - 读取</title>
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
<!-- 加入自己的import类 -->
<%@ page import="com.takall.contact.Contact" %>
<%@ page import="net.tekinfo.message.mobile.MobileAccountOp" %>
<%@ page import="net.tekinfo.remoting.user.UserRm" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.Map.Entry" %>
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
    objectId = DataUtility.StringToLong(parameters.getParameter(User.FIELD_ID));
    remoting = new UserRm();
	
	StringHash p = parameters.getParameters();
	StringBuilder html_param = new StringBuilder();    // 当前页面的回调参数
	boolean delim = false;
	for (Iterator<Entry<String, String>> iterator = p.entrySet().iterator(); iterator.hasNext();) {
		Entry<String, String> entry = iterator.next();
		if (delim)
			html_param.append("&");
		else
			delim = true;
		html_param.append(entry.getKey()).append("=").append(entry.getValue());
	}
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
	if (result.getCode() == Result.RESULT_OK) {
		//out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='mailaccount();'><a href='#'>邮件账号</a></li>");
		out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='namecard();'><a>名片信息</a></li>");
		out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='account();'><a>手机账号</a></li>");
		out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='send();'><a>发短信</a></li>");

		if (Right.IsCanWrite(right)) {
			out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='edit();'><a>修改</a></li>");
			//out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='password();'><a>修改密码</a></li>");
		} // end if (Right.IsCanWrite(right))

		if (Right.IsCanDelete(right))
			out.println("<li class='menuout'  onMouseOver='this.className=\"menuover\"'  onMouseOut='this.className=\"menuout\"' onclick='remove1();'><a>删除</a></li>");
	} // end if (result.getCode() == Result.RESULT_OK)
%>
      <li class="menuout" onmouseover="this.className='menuover'" onmouseout="this.className='menuout'" onclick="refreshWithWaiting('<%= charset %>');"><a>刷新</a></li>


    <script language="javascript">
      /**
       * 名片
       */
      function namecard() {
        var form = document.getElementById("form1");
        if (form == null)
          return;

        form.innerHTML="";
        form.action = "../contact/namecard/index.jsp";
        form.target="_blank";
        if(navigator.userAgent.indexOf('MSIE')>=0)
          document.charset="<%=charset %>";
      
        var hidden = document.createElement("input");
        hidden.id = "<%=Contact.FIELD_USER%>";
        hidden.name = "<%=Contact.FIELD_USER%>";
        hidden.type = "hidden";
        hidden.value = "<%= objectId %>";
        form.appendChild(hidden);

        form.submit();
      }

	  //电子邮件账号
	  function mailaccount() {
        var form = document.getElementById("form1");
        if (form == null)
          return;
  
        form.innerHTML="";
        form.action = "../message/email/list.jsp";
        form.target="_blank";
        if(navigator.userAgent.indexOf('MSIE')>=0)
          document.charset="<%=charset %>";
       
        var hidden = document.createElement("input");
        hidden.id = "<%=User.FIELD_ID%>";
        hidden.name = "<%=User.FIELD_ID%>";
        hidden.type = "hidden";
        hidden.value = "<%= objectId %>";
        form.appendChild(hidden);

        var showClose = document.createElement("input");
        showClose.id = "<%= KEY_SHOW_CLOSE %>";
        showClose.name = "<%= KEY_SHOW_CLOSE %>";
        showClose.type = "hidden";
        showClose.value = "1";
        form.appendChild(showClose);

        form.submit();
      }

      /**
       * 手机账号
       */
      function account() {
        var form = document.getElementById("form1");
        if (form == null)
          return;

        form.innerHTML="";
        form.action = "../message/mobile/account/read.jsp";
        form.target="_blank";
        if(navigator.userAgent.indexOf('MSIE')>=0)
          document.charset="<%=charset %>";
      
        var hidden = document.createElement("input");
        hidden.id = "<%=User.FIELD_ID%>";
        hidden.name = "<%=User.FIELD_ID%>";
        hidden.type = "hidden";
        hidden.value = "<%= objectId %>";
        form.appendChild(hidden);

        var showClose = document.createElement("input");
        showClose.id = "<%= KEY_SHOW_CLOSE %>";
        showClose.name = "<%= KEY_SHOW_CLOSE %>";
        showClose.type = "hidden";
        showClose.value = "1";
        form.appendChild(showClose);

        var remain = document.createElement("input");
        remain.id = "<%= MobileAccountOp.KEY_SHOW_REMAIN %>";
        remain.name = "<%= MobileAccountOp.KEY_SHOW_REMAIN %>";
        remain.type = "hidden";
        remain.value = "1";
        form.appendChild(remain);

        form.submit();
      }
	  
	  /**
       * 发短信
       */
      function send() {
        var form = document.getElementById("form1");
        if (form == null)
          return;

        form.innerHTML="";
        form.action = "../message/mobile/sendqueue/send.jsp";
        form.target="_blank";
        if(navigator.userAgent.indexOf('MSIE')>=0)
          document.charset="<%=charset %>";
      
        var sendObject = document.createElement("input");
        sendObject.id = "send-object";
        sendObject.name = "send-object";
        sendObject.type = "hidden";
        sendObject.value = "<%= User.OBJECT %>";
        form.appendChild(sendObject);

        var sendId = document.createElement("input");
        sendId.id = "send-id";
        sendId.name = "send-id";
        sendId.type = "hidden";
        sendId.value = "<%= my.getId() %>";
        form.appendChild(sendId);
		
        var receiverObject = document.createElement("input");
        receiverObject.id = "receiver-object";
        receiverObject.name = "receiver-object";
        receiverObject.type = "hidden";
        receiverObject.value = "<%= User.OBJECT %>";
        form.appendChild(receiverObject);

        var receuverIds = document.createElement("input");
        receuverIds.id = "receiver-ids";
        receuverIds.name = "receiver-ids";
        receuverIds.type = "hidden";
        receuverIds.value = "<%= objectId %>";
        form.appendChild(receuverIds);

        var showClose = document.createElement("input");
        showClose.id = "<%= KEY_SHOW_CLOSE %>";
        showClose.name = "<%= KEY_SHOW_CLOSE %>";
        showClose.type = "hidden";
        showClose.value = "1";
        form.appendChild(showClose);

        form.submit();
      }

      /**
       * 修改
       */
      function edit() {
        var form = document.getElementById("form1");
        if (form == null)
          return;

        form.innerHTML="";
        form.action = "edit.jsp";
        form.target="_blank";
        if(navigator.userAgent.indexOf('MSIE')>=0)
          document.charset="<%=charset %>";
      
        var hidden = document.createElement("input");
        hidden.id = "<%=User.FIELD_ID%>";
        hidden.name = "<%=User.FIELD_ID%>";
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
        hidden.id = "<%=User.FIELD_ID%>";
        hidden.name = "<%=User.FIELD_ID%>";
        hidden.type = "hidden";
        hidden.value = "<%= objectId %>";
        form.appendChild(hidden);

        var showClose = document.createElement("input");
        showClose.id = "<%= KEY_SHOW_CLOSE %>";
        showClose.name = "<%= KEY_SHOW_CLOSE %>";
        showClose.type = "hidden";
        showClose.value = "<%= DataUtility.StringToBoolean(parameters.getParameter(KEY_SHOW_CLOSE)) %>";
        form.appendChild(showClose);

        var refreshOpener = document.createElement("input");
        refreshOpener.id = "refresh-opener";
        refreshOpener.name = "refresh-opener";
        refreshOpener.type = "hidden";
        refreshOpener.value = "true";
        form.appendChild(refreshOpener);

        submitWithWaiting("form1", "<%= charset %>");
      }
	</script>
        <!-- end .menu1 -->
    </div>
<!-- #EndEditable -->
  <!-- end #menu-->
  </ul>

<!-- #BeginEditable "info" -->
<!-- 显示信息 -->
<%
	if (fields != null && fields.length > 0) {
%>

  <!-- 数据 -->
 <div style="width:98%;">
    <ul id="info">
<%
		// 信息项
		for (Field field:fields) {
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
