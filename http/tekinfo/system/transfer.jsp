<!-- 
    * Takall数据导入页面
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script type="text/javascript" src="../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>
<script type="text/javascript" src="../../common/tek/js/refresh.js"></script>
<title>Takall数据导入</title>
</head>

<body>
<%@ include file="../../config.jsp" %>

<%@ page import="java.io.BufferedInputStream" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>

<%@ page import="org.apache.commons.fileupload.FileItem" %>
<%@ page import="org.apache.commons.fileupload.FileItemFactory" %>
<%@ page import="org.apache.commons.fileupload.FileUploadException" %>
<%@ page import="org.apache.commons.fileupload.disk.DiskFileItemFactory" %>
<%@ page import="org.apache.commons.fileupload.servlet.ServletFileUpload" %>

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.system.Credentials" %>
<%@ page import="net.tekinfo.system.Host" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.transfer.DBTransfer" %>
<%@ page import="net.tekinfo.transfer.DBTransferFactory" %>
<%@ page import="net.tekinfo.util.DataUtility" %>

<%
	if (!isLogin) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;
	}
	
	/*Host host = hostManager.getHost(token.getTokenCode(), DataUtility.IpToLong(clientIp), null);
	if (host == null || !host.isAlive()) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;		
	}*/
	
	host.getForegroundMessage(true);
	host.getBackgroundMessage(true);

	Credentials credentials = host.getCredentials();
	if (credentials == null) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;		
	}

	User user = credentials.getUser();
	if (user == null || !user.isAdminUser(host)) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;		
	}
	
	File dbFile = null;    //数据库配置文件
	ArrayList<File> files = new ArrayList<File>();

	boolean isMultipart = ServletFileUpload.isMultipartContent(request);
	if (isMultipart) {
		// 文件格式，取得文件信息导入
		File dir = host.getPrivateHostDir();
		if (dir != null) {
			FileItemFactory factory = new DiskFileItemFactory();
			ServletFileUpload upload = new ServletFileUpload(factory);
	
			List<FileItem> list = null;
			try {
				list = upload.parseRequest(request);
			} catch (FileUploadException e) {
				out.println("解析参数错误!<br/>");
				e.printStackTrace();
			}
			
			if (list != null && !list.isEmpty()) {
				for (FileItem item : list) {
					if (item == null || item.isFormField())
						continue;
					
					String fieldName = item.getFieldName();
					if (fieldName == null || fieldName.isEmpty())
						continue;
						
					byte[] bytes = null;       //文件字节
					String fileName = null;    //文件名
					long size = 0L;            //文件大小
					
					BufferedInputStream bis = null;
					try {
						bis = new BufferedInputStream(item.getInputStream());
					} catch (IOException e) {
						out.println("读取文件错误!<br/>");
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
							out.println("读取文件错误!<br/>");
							e.printStackTrace();
						}
					} // end if (bis != null)
					
					File f = HttpUtility.SetFile(dir, fileName, bytes);
					if (f != null) {
						if (fieldName.equals("db")) {
							// 数据库配置文件
							dbFile = f;
						} else if (fieldName.equals("table")) {
							// 表配置文件
							files.add(f);
						}
					} // end if (f != null)
				} // end for (FileItem item : list)
			} // end if (list != null && !list.isEmpty())
		} else 
			out.println("无法创建home目录<br/>");
	} // end if (isMultipart)
	
	int success = 0;
	int failure = 0;
	
	if (dbFile != null && !files.isEmpty()) {
		//out.println(host.getLocaleManager().getString("message.transfer.start"));
		//out.println("<br/>");

		for (File file : files) {
			int[] count = DBTransferFactory.TakallTransfer(host, dbFile, file, null);
			if (count != null && count.length >= 2) {
				success += count[0];
				failure += count[1];
			}
		}
		
		// 删除临时文件
		dbFile.delete();
		for (File file : files) {
			if (file != null)
				file.delete();
		}

		//out.println(host.getLocaleManager().getString("message.transfer.end"));
		//out.println("<br/>");
	} // end if (dbFile != null && !files.isEmpty())
%>
  <div>
    <!-- 文件选择界面 -->
    <form action="" id="transfer" name="transfer" enctype="multipart/form-data" method="post">
      <table id="transferTable">
	    <tr>
	      <td>数据库文件</td>
          <td><input type="file" id="db" name="db" value=""/></td>
        </tr>
        <tr>
          <td>表文件</td>
          <td><input type="file" id="table" name="table" value=""/></td>
        </tr>
      </table>
    
      <!-- <input type="button" onclick="addTableFile()" value="增加"/> -->
      <input type="button" onclick="transferDB(this)" value="转换" />
    </form>
  </div>
  
<%
	out.println("<div id='msg'>");
	String message = host.getForegroundMessage(true);
	if (message != null && !message.isEmpty()) {
		out.print(host.getLocaleManager().getString("message.transfer.success"));
		out.print(": ");
		out.println(success);
		out.print(host.getLocaleManager().getString("message.transfer.failure"));
		out.print(": ");
		out.println(failure);

		message = HttpUtility.StringToHTML(message);
		out.print(message);
		out.println("<br/>");
	}
	out.println("<!-- end #msg --></div>");
%>
</body>

<script language="javascript">

  /**
   * 转换
   */
  function transferDB(btn) {
    var db = document.getElementById("db");
	var table = document.getElementById("table");

    var transfer = document.getElementById("transfer");
    if (transfer != null) {
      transfer.submit();
	  
	  btn.disabled="disabled";
	  document.getElementById("db").disabled="disabled";
	  document.getElementById("table").disabled="disabled";
      $("#msg").html("正在转换...");
	}
  }
</script>
</html>
