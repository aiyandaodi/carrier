<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：该页面描述。
参数：该页面使用参数。
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/normal.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel= "Shortcut Icon"   href= "../../../images/favicon.ico"/>
<link rel= "Bookmark"   href= "../../../images/favicon.ico"/>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<title>文件下载</title>
<!-- #EndEditable -->
</head>

<body>
<!-- #BeginEditable "import" -->
<!-- 自己的import类 -->
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.remoting.SystemRm" %>
<%@ page import="net.tekinfo.system.TekInfoProperties" %>

<%@ page import="java.io.BufferedInputStream" %>
<%@ page import="java.io.BufferedOutputStream" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="java.util.Objects" %>
<!-- #EndEditable -->

<%@ include file="../../config.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

  <div id="main">
<!-- #BeginEditable "main" -->
<!-- 页面内容 -->
<%
	long longIp = DataUtility.IpToLong(clientIp);
	if (host == null) {
		out.println("<div class='msg'>Host is null!</div>");
		return ;
	}

	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);

	String path = parameters.getParameter(SystemRm.KEY_FILE_PATH);
	if (path == null || path.isEmpty()) {
		out.println("<div class='msg'>无法得到文件路径!</div>");
		return ;
	}

	String fileName = parameters.getParameter(SystemRm.KEY_FILE_NAME);
	if (fileName == null || fileName.isEmpty()) {
		out.println("<div class='msg'>无法得到文件名!</div>");
		return ;
	}

	String type = null;
	
	path = path.replaceAll("\\\\", "/");
	if (path.startsWith("/"))
		path = path.substring(1);

	int loc = path.indexOf("/");
	if (loc > 0) {
		User user = host.getUser();
		if (user != null)
			type = "" +  user.getId();
		else
			type = "0";
		if (path.startsWith(type)) {
			// 用户个人目录
			type = "home";
		} else {
			type = "cash";
		}
	} else {
		type = "home";
	}

	File file = null;
	
	if ("home".equals(type)) {
		// 个人目录
		File dir = host.getHomeDir();
		if (dir != null)
			file = new File(dir, path);
	} else {
		if (tekinfo != null) {
			TekInfoProperties tp = tekinfo.getXMLProperties();;
			if (tp != null) {
				String root = null;

				String keystr = new StringBuilder()
						.append(TekInfoProperties.PREFIX_PATH)
						.append(TekInfoProperties.SEP)
						.append(type)
						.toString();
				root = tp.get(keystr, "path");
				file = new File(root);
				if (file.exists())
					file = new File(file, path);
			}
		} // end if (tekinfo != null)
	}

	if (file != null && file.exists()) {
		// 文件存在
		response.reset();
	
		response.setContentType(host.getLocaleManager().getMimeTypeFromFileName(fileName, null));

		String userAgent = request.getHeader("User-Agent");
		byte[] bb = (userAgent.contains("MSIE") || userAgent.contains("Edge")) ? fileName.getBytes() : fileName.getBytes("UTF-8"); // name.getBytes("UTF-8")处理safari的乱码问题
		fileName = new String(bb, "ISO-8859-1"); // 各浏览器基本都支持ISO编码  */
		response.setHeader("Content-disposition","attachment;filename=" + fileName);
	
		OutputStream os = response.getOutputStream();
		BufferedOutputStream bos = new BufferedOutputStream(os);

		FileInputStream fis = new FileInputStream(file);
		BufferedInputStream bis = new BufferedInputStream(fis);
	
		int avail = -1;
		byte[] bytes = new byte[DataUtility.MAXBUFFER];
	
		do {
			avail = bis.read(bytes);
			if (avail > 0)
				bos.write(bytes, 0, avail);
		} while(avail > 0);

		bos.flush();

		fis.close();
		os.close();
		
		out.clear();  
		out = pageContext.pushBody();  

		return;

	} else {
		out.println("<div class='msg'>文件不存在或无法解析!</div>");
	}
%>
<!-- #EndEditable -->
  <!-- end #main -->
  </div>
</body>
<!-- #EndTemplate --></html>
