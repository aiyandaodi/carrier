<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：导入操作的模板
参数：该页面使用参数。
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/import.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<link href="../../../common/tek/css/add.css" rel="stylesheet" type="text/css" media="screen" />
<script type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<title>导入系统用户</title>
<!-- #EndEditable -->
</head>

<body>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.object.ObjectOp" %>
<%@ page import="net.tekinfo.object.transfer.TransferFactory" %>
<%@ page import="net.tekinfo.remoting.ObjectRm" %>
<%@ page import="net.tekinfo.remoting.Result" %>
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

	ObjectRm remoting = null;
%>
<!-- #BeginEditable "rm" -->
<!-- 创建Rm -->
<%
	remoting = new UserRm();
%>
<!-- #EndEditable -->
<%
	Result result = remoting.getImportTempletNames(token.getTokenCode(), clientIp, parameters.getParameters());
	
	if (result == null) {
		out.println("<div class='msg'>操作失败!</div>");
		return;
	}
%>

  <!-- 输入框 -->
  <div id="info">
<%
	if (result.getCode() != Result.RESULT_OK) {
		// 操作错误
		String msg = result.getMessage();
		if (msg != null && !msg.isEmpty()) {
			msg = msg.replaceAll("\r\n", "<br/>");
			out.println("<div class='msg'>" + msg + "</div>");
		}

	} else {
		// 操作正确
		String[] types = null;    //模板类型
		String[][] templetNames = null;    //模板名

		String[] array = DataUtility.StringToArray(result.getValue(), ";");
		if (array != null && array.length > 0) {
			int length = array.length;
			types = new String[length];
			templetNames = new String[length][];

			for (int i = 0; i < length; i++) {
				if (array[i] == null || array[i].isEmpty())
					continue;
				
				int loc = array[i].indexOf("=");
				if (loc <= 0)
					continue;
				
				types[i] = array[i].substring(0, loc);
				templetNames[i] = DataUtility.StringToArray(array[i].substring(loc + 1), ",");
			}
		} // end if (array != null && array.length > 0)
%>
    <form action="importCheck.jsp" id="importForm" name="importForm" method="post"  enctype="multipart/form-data" accept-charset="<%= charset %>">
      <!-- 模板类型 -->
      <ul class='field'>
        <li class='title'>导入类型</li><br/>
        <li class='value'>
          <select id="<%= ObjectOp.PARA_TRANSFER_TYPE %>" name="<%= ObjectOp.PARA_TRANSFER_TYPE %>" onchange="changeType()">
<%
		if (types != null && types.length > 0) {
			String t = parameters.getParameter(ObjectOp.PARA_TRANSFER_TYPE);
			
			for (String type : types) {
				if (type == null || type.isEmpty())
					continue;
					
				out.print("<option value='" + type + "'");
				if (((t == null || t.isEmpty()) && type.equals("ipsay"))
						|| type.equals(t))
					out.print(" selected");
				out.println(">" + type + "</option>");
			}
		} // end if (types != null && types.length > 0)
%>
          </select>
        </li>
      </ul>
      <!-- 模板名  -->
      <ul class='field' id='temp' name='temp'>
        <li class='title'>使用模板</li><br/>
        <li class='value'>
          <select id="transfer-templet" name="transfer-templet">
          </select>
        </li>
      </ul>
      <!-- 导入文件 -->
      <ul class='field'>
        <li class='title'>导入文件</li><br/>
        <li class='value'>
          <input type="file" id="<%= ObjectOp.PARA_TRANSFER_FILE %>" name="<%= ObjectOp.PARA_TRANSFER_FILE %>"/>
        </li>
      </ul>
      <!-- 密码 -->
      <ul class='field' id="pass" name="pass">
        <li class='title'>密码</li><br/>
        <li class='value'>
          <input type="password" id="<%= ObjectOp.PARA_TRANSFER_PASSWORD %>" name="<%= ObjectOp.PARA_TRANSFER_PASSWORD %>"/>
        </li>
      </ul>
      <!-- 是否覆盖信息 -->
      <ul class='field'>
        <li class='title'>覆盖已存在的信息</li><br/>
        <li class='value'>
          <input type="radio" id="<%= ObjectOp.PARA_OVERWRITE %>" name="<%= ObjectOp.PARA_OVERWRITE %>" value="1"/>是<br/>
          <input type="radio" id="<%= ObjectOp.PARA_OVERWRITE %>" name="<%= ObjectOp.PARA_OVERWRITE %>" value="0" checked="checked"/>否<br/>
        </li>
      </ul>

      <!-- 附加参数 -->
<%
		String[] parameterNames = parameters.getParameterNames();
		if (parameterNames != null && parameterNames.length > 0) {
			for (int i = 0; i < parameterNames.length; i++) {
				if (parameterNames[i] == null || parameterNames[i].isEmpty())
					continue;
			
				String value = parameters.getParameter(parameterNames[i]);
				if (value == null)
					value = "";

				out.println("<input type=\"hidden\" id=\"" + parameterNames[i] + "\" name=\"" + parameterNames[i] + "\" value=\"" + value + "\"/>");
			}
		} // end if (parameterNames != null && parameterNames.length > 0)
%>
      <!-- 按钮 -->
      <ul class='button'>
        <li><input type="button" id="importButton" name="importButton" onclick="submitForm('importForm', '<%= charset %>', new Array('importButton'))" value="导入"/></li>
      </ul>
    </form>
    
    <script language="javascript">
      var types;    //模板类型
	  var templetNames;    //模板名
<%
		// 复制types和templetNames
		if (types != null && types.length > 0) {
			int len = types.length;
			out.println("types=new Array(" + len +")");
			for (int i = 0; i < len; i++)
				out.println("types[" + i + "]=\"" + types[i] + "\";");
		} // end if (types != null && types.length > 0)
		
		if (templetNames != null && templetNames.length > 0) {
			int len = templetNames.length;
			out.println("templetNames=new Array(" + len + ")");
			
			for (int i = 0; i < len; i++) {
				if (templetNames[i] == null)
					continue;
					
				int length = templetNames[i].length;
				out.println("templetNames[" + i + "]=new Array(" + length + ");");
				
				for (int j = 0; j < length; j++) {
					out.println("templetNames[" + i + "][" + j + "]=\"" + templetNames[i][j] + "\";");
				}
			} // end for (int i = 0; i < len; i++)
		} // end if (templetNames != null && templetNames.length > 0)
%>	  
	  
	  changeType();
	  
	  /**
	   * 更改模板类型，重新设置模板名可选项
	   */
	  function changeType() {
        var selType = document.getElementById("<%= ObjectOp.PARA_TRANSFER_TYPE %>");
        var selTemp = document.getElementById("<%= ObjectOp.PARA_TRANSFER_TEMPLET %>");
		
        if (!selType || !selTemp)
          return;
		
		selTemp.options.length=0;

		if (types && templetNames) {
          for (var i = 0; i < types.length; i++) {
            if (types[i] != selType.value)
              continue;

			if (templetNames.length > i) {
              if (templetNames[i] && templetNames[i].length > 0) {
                for (var j = 0; j < templetNames[i].length; j++) {
	              selTemp.options.add(new Option(templetNames[i][j], templetNames[i][j]));
				}
			  } else
	              selTemp.options.add(new Option("空", ""));
			}

			// 如果type="ipsay"，不显示"模板"输入框，否则，显示
			var temp=document.getElementById("temp");
			if (temp) {
              if (types[i]=="ipsay")
			    temp.style.display="none";
              else
			    temp.style.display="block";
			}
			
			// 如果type=“ipsay”，显示“密码”输入框，否则，不显示
			var pass=document.getElementById("pass");
			if (pass) {
              if (types[i]=="ipsay")
			    pass.style.display="block";
              else
			    pass.style.display="none";
			}
			
			break;
		  }
		} // end if (types)
	  }
	</script>
<%
	} // end if (result.getCode() != Result.RESULT_OK) else
%>
    <!-- end #info -->
    </div>
  <!-- end #main -->
  </div>
</body>
<!-- #EndTemplate --></html>
