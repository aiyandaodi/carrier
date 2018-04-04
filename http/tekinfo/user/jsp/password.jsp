<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：修改信息的模板
参数：callback-url - 回调地址
     callback-params - 回调参数
     show-close - 是否显示"关闭"菜单项
     refresh-opener - 是否刷新opener页面
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/edit.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<script type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
<script type="text/javascript" src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>
<script type="text/javascript" src="../../../common/js/normal.js"></script>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<link href="../../../common/tek/css/add.css" rel="stylesheet" type="text/css" media="screen" />
<script>
  $(document).ready(function() {
    initWaiting(null, 50, 50);
	checkMenu();
  });
</script>
<title>User 系统用户-修改密码</title>
<!-- #EndEditable -->
</head>

<body>
<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.ObjectRm" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%@ page import="java.util.Map.Entry" %>
<%@ page import="java.util.Iterator" %>

<!-- #BeginEditable "import" -->
<!-- 自己的import类 -->
<%@ page import="net.tekinfo.remoting.user.UserRm" %>
<!-- #EndEditable -->

  <div id="main">
<%@ include file="../../../config.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

<%
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
	
	StringHash p = parameters.getParameters();    //参数哈希表
	boolean upload = false;    //是否上传文件
	ObjectRm remoting = null;    //对象Rm
	ObjectResult result = null;    //结果
%>

<!-- #BeginEditable "init" -->
<!-- 初始化信息，包含objectId、upload、remoting、result等 -->
<%
	remoting = new UserRm();
	result = ((UserRm) remoting).getPasswordEdit(token.getTokenCode(), clientIp, p);
%>
<!-- #EndEditable -->

<%
	boolean flag = false;    //操作结果
	String errMsg = null;    //错误信息
	int right = Right.RIGHT_NONE;    //权限
	Field[] fields = null;    //编辑域
	
	if (result != null) {
		if (result.getCode() == Result.RESULT_OK) {
			Record[] records = result.getRecords();
			if (records != null && records.length > 0 && records[0] != null)
				fields = records[0].getFields();
	
			if (fields != null && fields.length > 0)
				flag = true;
			else
				errMsg = "没有可编辑字段!";
				
		} else {
			errMsg = result.getMessage();
			if (errMsg != null)
				errMsg = HttpUtility.StringToHTML(errMsg);
		} // end if (result.getCode() == Result.RESULT_OK) else
		
	} else {
		// result为空
		errMsg = "操作失败!";
	} // end if (result != null) else
	
	ObjectPrint objectPrint = new ObjectPrint();
%>

    <!-- 菜单 -->
    <div id="menu">
<!-- #BeginEditable "menu" -->
<!-- 菜单栏 -->
      <div class="title">修改密码</div>
      <div class="menu1">
<%
	String callbackURL = parameters.getParameter(KEY_CALLBACK_URL);           //返回地址
	String callbackParams = parameters.getParameter(KEY_CALLBACK_PARAMS);     //返回参数
	if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null")) {
		out.println(objectPrint.printCallbackForm(callbackURL, callbackParams, charset));
		out.println(new StringBuilder("<li class='menuout' onMouseOver='this.className=\"menuover\"' onMouseOut='this.className=\"menuout\"' onclick=\"submitWithWaiting('callback', '").append(charset).append("');\"><a href='#'>返回</a></li>"));
	} else {
		boolean showclose = DataUtility.StringToBoolean(parameters.getParameter(KEY_SHOW_CLOSE));
		if (showclose)
			out.println("<li class='menuout' onMouseOver='this.className=\"menuover\"' onMouseOut='this.className=\"menuout\"' onclick=\"javascript:window.close();\"><a href='#'>关闭</a></li>");
	}
%>
      <!-- end .menu1 --></div>
<!-- #EndEditable -->
    <!-- end #menu --></div>

      <!-- 输入框 -->
      <div id="info">
<%
	if (flag) {
%>

<!-- #BeginEditable "panel" -->
<!-- 输入框 -->
        <form action="passwordCheck.jsp" id="editForm" name="editForm" method="post" accept-charset="<%= charset %>"<%= upload ? "enctype='multipart/form-data'" : ""%>>
<%
		String html = objectPrint.printFields(fields);
		if (html != null)
			out.println(html);

		// 其他参数
		if (p != null) {
			Iterator<Entry<String, String>> iterator = p.entrySet().iterator();
			
			if (iterator != null) {
				while (iterator.hasNext()) {
					Entry<String, String> entry = iterator.next();
					String key = entry.getKey();
					String value = entry.getValue();
					
					boolean fieldParam = false;    //字段参数
					for (Field field : fields) {
						if (field == null || field.getName() == null)
							continue;
							
						if (field.getName().equals(key)) {
							fieldParam = true;
							break;
						}
					} // end for (Field field : fields)
					
					if (!fieldParam)
						out.println(new StringBuilder("<input type='hidden' id='").append(key).append("' name='").append(key).append("' value='").append(value).append("'/>"));
				} // end while (iterator.hasNext())
			} // end if (iterator != null)
		} // end if (p != null)
%>
          <!-- 按钮 -->
          <ul class='button'>
            <li><input type="button" id="editButton" name="editButton" onclick="submitWithWaiting('editForm', '<%= charset %>')" value="确定"/></li>
          </ul>
        </form>
        
		<script language="JavaScript" type="text/javascript">
          /**
           * 调用选择页面
           *
           * @param fieldName
           *           选择字段名
           */
          function browse(fieldName) {
          }
        </script>
<!-- #EndEditable -->

<%
	} else {
		if (errMsg != null)
			out.println(new StringBuilder("<div id='errMsg' class='msg'>").append(errMsg).append("</div>"));
	} // end if (errMsg != null) else
%>
    <!-- end #info --></div>
  <!-- end #main --></div>
  
<%@ include file="../../../common/tek/jsp/shield.jsp" %>
</body>
<!-- #EndTemplate --></html>
