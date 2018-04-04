<!-- 
    * 数据导入页面
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>数据导入</title>
</head>

<body>
<%@ include file="../../config.jsp" %>

<%@ page import="java.io.BufferedInputStream" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.io.FileNotFoundException" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="java.util.List" %>

<%@ page import="org.apache.commons.fileupload.FileItem" %>
<%@ page import="org.apache.commons.fileupload.FileItemFactory" %>
<%@ page import="org.apache.commons.fileupload.FileUploadException" %>
<%@ page import="org.apache.commons.fileupload.disk.DiskFileItemFactory" %>
<%@ page import="org.apache.commons.fileupload.servlet.ServletFileUpload" %>

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.remoting.DatabaseRemoting" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.system.User" %>

<%
	if (!isLogin || (my.getSecurity() < User.USER_ADMIN) || (my.getStatus() != User.STATUS_NORMAL)) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;
	}
	
	String message = null;    //显示信息
	
	byte[] bytes = null;       //文件字节
	String fileName = null;    //文件名
	long size = 0L;            //文件大小
	
	boolean isMultipart = ServletFileUpload.isMultipartContent(request);
	if (isMultipart) {
		// 文件格式，取得文件信息导入
		FileItemFactory factory = new DiskFileItemFactory();
		ServletFileUpload upload = new ServletFileUpload(factory);

		List<FileItem> list = null;
		try {
			list = upload.parseRequest(request);
		} catch (FileUploadException e) {
			message = "解析参数错误!<br/>";
			e.printStackTrace();
		}
		
		if (list != null && !list.isEmpty()) {
			for (FileItem item : list) {
				if (item == null)
					continue;
				
				String fieldName = item.getFieldName();
				if (fieldName != null && fieldName.equals("file")) {
					if (!item.isFormField()) {
						// 文件
						BufferedInputStream bis = null;
						try {
							bis = new BufferedInputStream(item.getInputStream());
						} catch (IOException e) {
							message = "读取文件错误!<br/>";
							e.printStackTrace();
						}
						
						if (bis != null) {
							size = item.getSize();
							
							fileName = item.getName();
							if (fileName != null && !fileName.isEmpty()) {
								// 如果是全路径，只取文件名
								int loc = fileName.lastIndexOf("\\");
								if (loc < 0)
									loc = fileName.lastIndexOf("/");
								
								if (loc >= 0 && (loc + 1) < fileName.length())
									fileName = fileName.substring(loc + 1);
							} // end if (fileName != null && !fileName.isEmpty())
							
							bytes = new byte[(int) size];
							try {
								bis.read(bytes);
							} catch (IOException e) {
								message = "读取文件错误!<br/>";
								e.printStackTrace();
							}
						}
					}
				} // end if (fieldName != null && fieldName.equals("file"))
			} // end for (FileItem item : list)
		} // end if (list != null && !list.isEmpty())
		
		if (message == null || message.isEmpty()
				&& bytes != null && bytes.length > 0
				&& size > 0
				&& fileName != null && !fileName.isEmpty()) {
			// 导出数据
			DatabaseRemoting dr = new DatabaseRemoting();
			Result result = dr.inport(token.getTokenCode(), clientIp, fileName, size, bytes);
			if (result != null) {
				message = result.getMessage();
				if (message != null)
					message = message.replaceAll("\r\n", "<br/>");
			} else
				message = "导入失败!";
		} // end if (message == null)
	} // end if (objectName != null && !objectName.isEmpty())
%>

  <!-- 导入对象输入框 -->
  <div>
    <form action="import.jsp" id="inport" name="inport" enctype="multipart/form-data" method="post">
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
	      <td>导入文件</td>
		  <td><input type="file" id="file" name="file" value=""/></td>
        </tr>
        <tr>
          <td colspan="2" align="right"><input id="importButton" name="importButton" type="button" onclick="importObject()" value="导入"/></td>
        </tr>
      </table>
    </form>
    
    <p id="msg" name="msg" style="display:none">正在导入....</p>
    
    <script language="javascript">
	  /**
	   * 导出对象
	   */
	  function importObject() {
		var flag = window.confirm("是否导入？");
        if (!flag)
          return ;
		
        var form = document.getElementById("inport");
        if (form != null) {
          form.submit();
          var button = document.getElementById("importButton");
          if (button != null)
            button.disabled="disabled";
	  
          var msg = document.getElementById("msg");
          if (msg != null)
            msg.style.display="block";
		}
	  }
	</script>
  </div>
</body>
</html>
