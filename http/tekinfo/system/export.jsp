<!-- 
    * 数据导出页面
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>数据导出</title>

  <script type="text/javascript" src="../../common/jquery/2.1.4/jquery.min.js"></script>
  <script type="text/javascript" src="../../common/tek/js/dataUtility.js"></script>
  <script type="text/javascript" src="../../common/tek/js/common.js"></script>
  <script type="text/javascript" src="../../common/tek/js/refresh.js"></script>
  <script type="text/javascript" src="../../common/tek/js/core.js"></script>
  <script type="text/javascript" src="../../common/tek/js/mac-common.js"></script>
</head>

<body>
<%@ include file="../../config.jsp" %>

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.remoting.Blob" %>
<%@ page import="net.tekinfo.remoting.BlobResult" %>
<%@ page import="net.tekinfo.remoting.DatabaseRemoting" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%
	if (!isLogin || (my.getSecurity() < User.USER_SUPER) || (my.getStatus() != User.STATUS_VALID)) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;
	}
	
	String objectName = HttpUtility.GetParameter(request, "objectName");
	String message = null;
	if (objectName != null && !objectName.isEmpty()) {
		// 导出数据
		DatabaseRemoting dr = new DatabaseRemoting();
		BlobResult result = dr.export(token.getTokenCode(), clientIp, objectName, "");
		if (result != null) {
			if (result.getCode() == Result.RESULT_OK) {
				// 打开新窗口下载
				Blob[] blobs = result.getBlobs();
				if (blobs != null && blobs.length > 0 && blobs[0] != null) {
					String path = blobs[0].getPath();
					String fileName=blobs[0].getFileName();
					if (path != null && !path.isEmpty() && fileName != null && !fileName.isEmpty()) {
%>
  <script language="javascript">
    var url=tek.common.getRelativePath()+"http/tekinfo/system/download.jsp?file-path=";
    url+=encodeURIComponent("<%= path %>");
    url+="&file-name="+encodeURIComponent("<%=fileName%>");
    window.open(url);
  </script>
<%
					} else
						message = "导出文件不存在<br/>";
				} else
					message = "导出数据为空!<br/>";
			} // end if (result.getCode() == Result.RESULT_OK)

			String msg = result.getMessage();
			if (msg != null)
				message += msg.replaceAll("\r\n", "<br/>");
		} else
			message = "导出错误!";
	} // end if (objectName != null && !objectName.isEmpty())
%>

  <!-- 导出对象输入框 -->
  <div id="export">
    <form action="export.jsp" id="exportForm" name="exportForm" method="post">
      <table>
<%
	if (message != null) {
%>
        <tr>
          <td colspan="2"><%= message %></td>
        </tr>
<%
	}
%>
	    <tr>
	      <td>导出对象名</td>
		  <td><input type="text" id="objectName" name="objectName" value="<%= (objectName != null) ? objectName : "" %>"/></td>
        </tr>
        <tr>
          <td colspan="2" align="right"><input id="exportButton" name="exportButton" type="button" onclick="exportObject()" value="导出"/></td>
        </tr>
      </table>
    </form>
    <script language="javascript">
	  /**
	   * 导出对象
	   */
	  function exportObject() {
		var flag = window.confirm("是否导出?");
        if (!flag)
          return ;
		  
		var form = document.getElementById("exportForm");
		if (form != null) {
		  form.submit();
		  var button = document.getElementById("exportButton");
		  if (button != null)
		    button.disabled="disabled";
		}
	  }
	</script>
  </div>
</body>
</html>
