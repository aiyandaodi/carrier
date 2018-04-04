<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：Excel用户导入
参数：
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/normal.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<link href="../../../common/tek/css/add.css" rel="stylesheet" type="text/css" media="screen" />
<script src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>
<script language="javascript">
  $(document).ready(function(){
	  initWaiting(null, 40, 40);
  });
</script>
<title>Excel导入用户</title>
<!-- #EndEditable -->
</head>

<body>
<!-- #BeginEditable "import" -->
<!-- 自己的import类 -->
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.http.MultipartParameters" %>
<%@ page import="net.tekinfo.object.ObjectOp" %>
<%@ page import="com.takall.organization.OrganizationOp" %>
<%@ page import="net.tekinfo.remoting.user.UserRm" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.system.UserOp" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%@ page import="java.io.InputStream" %>

<%@ page import="org.apache.commons.fileupload.servlet.ServletFileUpload" %>
<!-- #EndEditable -->

<%@ include file="../../../config.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

  <div id="main">
<!-- #BeginEditable "main" -->
<!-- 页面内容 -->
<%
	final String PARA_IMPORT_FILE = "importFile";    //导入文件参数名
	
	Parameters parameters = null;
	boolean isMultipart = ServletFileUpload.isMultipartContent(request);
	if (isMultipart)
		parameters = new MultipartParameters(token.getTokenCode(), clientIp, request);
	else
		parameters = new Parameters(token.getTokenCode(), clientIp, request);
	StringHash p = parameters.getParameters();
	
	UserRm remoting = new UserRm();

	ObjectResult result = null;
	String msg = null;
	boolean overwrite = DataUtility.StringToBoolean(parameters.getParameter(ObjectOp.PARA_OVERWRITE)); //是否覆盖
	boolean organization = false; //是否导入机构
	String v = parameters.getParameter(UserOp.KEY_ORG);
	if (v != null)
		organization = DataUtility.StringToBoolean(v);
	else
		organization = true;
	boolean mobile = false; // 是否创建手机账号
	v = parameters.getParameter(UserOp.KEY_MOBILE);
	if (v != null)
		mobile = DataUtility.StringToBoolean(v);
	else
		mobile = true;
	long deviceId = DataUtility.StringToLong(parameters.getParameter(UserOp.FIELD_DEVICE)); //端口设备标识
	String deviceName = parameters.getParameter(new StringBuilder(UserOp.FIELD_DEVICE).append("Text").toString()); //端口设备名称
	String daymax = parameters.getParameter(UserOp.FIELD_DAYMAX); // 每日允许发送条数
	String monthmax = parameters.getParameter(UserOp.FIELD_MONTHMAX); // 每月允许发送条数
	
	if (isMultipart) {
		// 文件格式，取得文件信息导入
		InputStream is = ((MultipartParameters) parameters).getInputStream(PARA_IMPORT_FILE);       //文件输入流

		if (is != null && is.available() > 0) {
			// 导入
			result = remoting.excelImport(token.getTokenCode(), clientIp, p, is);
			if (result != null) {
				msg = result.getMessage();
				if (msg != null)
					msg = HttpUtility.StringToHTML(msg);
			} // end if (result != null)
		} else
			msg = "无法获取导入文件!";
	} // end if (isMultipart)
	
	int right = Right.RIGHT_NULL;    //权限
	Field securityField = null;    //安全等级字段
	result = remoting.getNew(token.getTokenCode(), clientIp, p);
	if (result != null) {
		right = result.getRight();
		
		Record[] records = result.getRecords();
		if (records != null && records.length > 0 && records[0] != null) {
			Field[] fields = records[0].getFields();
			
			if (fields != null && fields.length > 0) {
				for (Field field : fields) {
					if (field != null && field.getName() != null
							&& field.getName().equals(User.FIELD_SECURITY)) {
						securityField = field;
						break;
					}
				}
			}
		} // end if (records != null && records.length > 0 && records[0] != null)
	} // end if (result != null)
	
	if (Right.IsCanCreate(right)) {
%>

    <div id="info">
      <!-- 文件选择界面 -->
      <form action="" id="transfer" name="transfer" enctype="multipart/form-data" accept-charset="<%=charset%>" method="post">
<%
		if (securityField != null) {
			String[] selects = securityField.getSelects();
			String[] shows = securityField.getShows();
			
			if (selects != null && selects.length > 0 && shows != null && shows.length > 0) {
				StringBuilder sb = new StringBuilder();
				sb.append("<ul class='field'>\r\n");
				sb.append("<li class='title'>").append(securityField.getDisplay()).append("</li>\r\n");
				sb.append("<li class='value'>\r\n");
				sb.append("<select id='").append(User.FIELD_SECURITY).append("' name='").append(User.FIELD_SECURITY).append("'>\r\n");
				for (int i = 0; i < selects.length; i++) {
					if (selects[i] == null)
						continue;
					
					sb.append("<option value='").append(selects[i]).append("'");
					if (selects[i].equals(securityField.getValue()))
						sb.append(" selected");
					sb.append(">").append(shows[i]).append("</option>");
				} // end for (int i = 0; i < selects.length; i++)
				sb.append("</select>\r\n");
				sb.append("</li>\r\n");
				sb.append("</ul>\r\n");
				out.print(sb.toString());
			}
        }
%>
        <ul class="field">
          <li class="title">是否覆盖存在的用户</li>
          <li class="value">
            <input type="radio" id="overwrite" name="overwrite" value="0"<%= overwrite ? "" : " checked='checked'" %>/>否
            <input type="radio" id="overwrite" name="overwrite" value="1"<%= overwrite ? "checked='checked'" : "" %>/>是
          </li>
        </ul>

        <ul class="field">
          <li class="title">是否创建手机账号</li>
          <li class="value">
            <input type="radio" id="mobile" name="mobile" value="0"<%= mobile ? "" : " checked='checked'" %> onclick="importMobile(false)"/>否
            <input type="radio" id="mobile" name="mobile" value="1"<%= mobile ? " checked='checked'" : "" %> onclick="importMobile(true)"/>是
          </li>
        </ul>

        <ul id="user_device_info" class="field" style="display:<%= mobile ? "block" : "none" %>">
          <li class="title">手机短信端口</li>
          <li class="value">
            <input type="text" id="<%= UserOp.FIELD_DEVICE %>" name="<%= UserOp.FIELD_DEVICE %>" value="<%= (deviceId != 0) ? deviceId : "" %>" style="display:none"/>
            <input type="text" id="<%= UserOp.FIELD_DEVICE %>Text" name="<%= UserOp.FIELD_DEVICE %>Text" value="<%= (deviceName != null) ? deviceName : "" %>" disabled="disabled" style="text-align:right"/>
            <a href='#' onclick="browseList('<%= UserOp.FIELD_DEVICE %>');">...</a>
          </li>
        </ul>

        <ul id="user_daymax_info" class="field" style="display:<%= mobile ? "block" : "none" %>">
          <li class="title">每天允许发送条数</li>
          <li class="value">
            <input type="text" id="<%= UserOp.FIELD_DAYMAX %>" name="<%= UserOp.FIELD_DAYMAX %>" value="<%= (daymax != null) ? daymax : "90" %>"/>
          </li>
        </ul>

        <ul id="user_monthmax_info" class="field" style="display:<%= mobile ? "block" : "none" %>">
          <li class="title">每月允许发送条数</li>
          <li class="value">
            <input type="text" id="<%= UserOp.FIELD_MONTHMAX %>" name="<%= UserOp.FIELD_MONTHMAX %>" value="<%= (monthmax != null) ? monthmax : "300" %>"/>
          </li>
        </ul>

        <ul class="field">
          <li class="title">是否导入机构</li>
          <li class="value">
            <input type="radio" id="organization" name="organization" value="0"<%= organization ? "" : " checked='checked'" %>/>否
            <input type="radio" id="organization" name="organization" value="1"<%= organization ? " checked='checked'" : "" %>/>是
          </li>
        </ul>

        <ul class='field'>
          <li class='title'>Excel文件</li>
          <li class='value'>
            <input type="file" id="<%= PARA_IMPORT_FILE %>" name="<%= PARA_IMPORT_FILE %>" value=""/>
          </li>
        </ul>

        <!-- 附加参数 -->
<%
      // 传递的参数
		String[] parameterNames = parameters.getParameterNames();
		if (parameterNames != null && parameterNames.length > 0) {
			for (int i = 0; i < parameterNames.length; i++) {
				if (parameterNames[i] == null || parameterNames[i].isEmpty())
					continue;
			
				String value = parameters.getParameter(parameterNames[i]);
				if (value != null) {
					StringBuilder sb = new StringBuilder();
					
					out.println(new StringBuilder("<input type='hidden' id='").append(parameterNames[i]).append("' name='").append(parameterNames[i]).append("' value='").append(value).append("'/>"));
				}
			}
		} // end if (parameterNames != null && parameterNames.length > 0)
%>
        <!-- 按钮 -->
        <ul class='button'>
          <li><input type="button" id="importButton" name="importButton" onclick="inport(this);" value="导入"/></li>
        </ul>
      </form>
    <!-- end #info --></div>
    
    <script language="javascript">
      /**
       * 是否导入手机账号
       *
       * @param flag
       *           true表示导入，false表示不导入
       */
      function importMobile(flag) {
		// 端口
        var device=document.getElementById("<%= UserOp.FIELD_DEVICE %>_info");
        if (device) {
          if (flag)
		    device.style.display="block";
          else
		    device.style.display="none";
        }

		// 每日允许发送条数
        var day=document.getElementById("<%= UserOp.FIELD_DAYMAX %>_info");
        if (day) {
          if (flag)
		    day.style.display="block";
          else
		    day.style.display="none";
        }

		// 每月允许发送条数
        var month=document.getElementById("<%= UserOp. FIELD_MONTHMAX %>_info");
        if (month) {
          if (flag)
		    month.style.display="block";
          else
		    month.style.display="none";
        }
	  }
	  
      /**
       * 调用选择页面
       *
       * @param fieldName
       *           选择字段名
       */
      function browseList(fieldName) {
        var url;
		
		if (fieldName=="user_device")
		  url="../resource/device/list.jsp?browse=1";
        
		if (url) {
          var object_elem = document.getElementById(fieldName);
          if (object_elem)
            url += "&select_id=" + object_elem.value;
          window.open(url);
		}
      }

      /**
       * 选择端口
       */
      function selectDevice(id, name) {
        var elemId = document.getElementById("<%= UserOp.FIELD_DEVICE %>");
        if (elemId)
          elemId.value = id;
        var elemName = document.getElementById("<%= UserOp.FIELD_DEVICE %>Text");
        if (elemName)
          elemName.value = name;
      }

      /**
       * 导入
       */
      function inport(btn) {
        var transfer = document.getElementById("transfer");
        if (transfer!=null) {
          transfer.submit();
		  startWaiting();
		  //document.getElementById("importButton").disabled="disabled";
  	    }
      }
    </script>
<%
	} // end if (Right.IsCanAdmin(right))
	
	if (msg != null)
		out.println("<div class='msg'>" + msg + "</div>");
%>

<%@ include file="../../../common/tek/jsp/shield.jsp" %>
<!-- #EndEditable -->
  <!-- end #main -->
  </div>
</body>
<!-- #EndTemplate --></html>
