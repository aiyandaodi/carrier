<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!--
功能：读取指定文档，形成文件流输出到客户端
参数： Docuemnt.FIELD_ID -- 文档标识
	  icon -- 可选，jpg/bmp图片特有参数，使用本参数时必须指定height或width
      height
      width 
-->
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page info="openContent"%>

<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.object.ObjectRecord" %>
<%@ page import="net.tekinfo.remoting.Field" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.Record" %>
<%@ page import="net.tekinfo.remoting.Blob" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>
             
<%@ page import="com.takall.subject.Document" %>
<%@ page import="com.takall.remoting.subject.DocumentRm" %>

<%@ page import="java.util.Hashtable" %>
<%@ page import="javax.servlet.ServletOutputStream"%>
<%@ page import="java.io.BufferedOutputStream"%>

<%@ page import="java.io.BufferedInputStream" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.File" %>
<%@ page import="javax.imageio.ImageIO" %>
<%@ page import="java.awt.geom.AffineTransform" %>
<%@ page import="java.awt.image.AffineTransformOp" %>
<%@ page import="java.awt.image.BufferedImage" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.io.ByteArrayOutputStream" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.MalformedURLException" %>
<%@ page import="java.net.URL" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />


<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="keywords" content="读书 网络 社交 图片 相册 影像 文学 办公 协同 开源 求知 旅行 精品 支付 认证 readbook network Social photo video art office automation joint alliance Communication Authenticate Payment"/>
  <meta name="description" content="读书 网络 社交 图片 相册 影像 文学 办公 协同 开源 求知 旅行 精品 支付 认证 readbook network Social photo video art office automation joint alliance Communication Authenticate Payment"/>
  <meta name="author" content="Tekinfo[http://www.tekinfo.net]"/>
  
  <!-- Favicon -->
  <link rel="Shortcut Icon" href="../../../../favicon.ico"/>
  <link rel="Bookmark" href="../../../../favicon.ico"/>

<title>文档下载</title>

</head>
<body>

<%@ include file="../../../config.jsp" %>

<%
Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
StringHash p = parameters.getParameters();
boolean isIcon=DataUtility.StringToBoolean(p.get("icon"));
int width=DataUtility.StringToInt(p.get("width"));
int height=DataUtility.StringToInt(p.get("height"));
p.put("blob", 1);
DocumentRm remoting=new DocumentRm();
ObjectResult result = remoting.readInfo(token.getTokenCode(), clientIp,p);

if(result==null){
	out.println("读取失败");
	return;
}

if(result.getCode()!=Result.RESULT_OK){
	out.print("读取失败");
	String error = result.getMessage();
	if (error != null && !error.isEmpty())
		out.println( HttpUtility.StringToHTML(error) );
	return;
}

int right=result.getRight();
if(!Right.IsCanRead(right)){
	out.println( "你没有读取权限！" );
	return;
}
Record[] records = result.getRecords();

if (records != null && records.length > 0 && records[0] != null) {
	for(Record record:records){
		if (record!= null){
			long docId = record.getId();

			Field[] fields = record.getFields();
			Blob[] blobs = record.getBlobs();

			if (fields == null || fields.length <= 0 || blobs == null || blobs.length <= 0 || blobs[0] == null)
				continue;
			
			Hashtable<String, Field> docHash = new Hashtable<String, Field>();
			for (int j = 0; j < fields.length; j++) {
				if (fields[j] == null)
					continue;
					
				String fn = fields[j].getName();
				if (fn != null)
					docHash.put(fn, fields[j]);
			} // end for (int j = 0; j < fields.length; j++)
			
			String docMime = null;
			Field dnField = docHash.get(Document.FIELD_MIME);
			if(dnField!=null)
				docMime=dnField.getValue();
			if(docMime==null || docMime.isEmpty())
				docMime="text/plain";
			String docName = null;
			dnField = docHash.get(Document.FIELD_NAME);
			if (dnField != null)
				docName = dnField.getShow();
			String docSummary = null;
			Field dsField = docHash.get(Document.FIELD_SUMMARY);
			if (dsField != null)
				docSummary = dsField.getShow();
			String docFileName = blobs[0].getFileName();
			String filepath = blobs[0].getPath();
			
			if (docName != null && docSummary != null && docFileName != null && filepath != null) {
				if (filepath != null && !filepath.isEmpty()) {
					//String s_dir=hostManager.getTekInfo().getPathRoot();
					//System.out.println("00000000000000000 s_dir="+s_dir);

					/*File file;
					//if(s_dir!=null && !s_dir.isEmpty())
					//	 file = new File(s_dir, filepath);
					//else
						 file = new File(filepath);
					//out.println("00000000000000000 s_dir="+s_dir+";filepath="+filepath);
					if(file == null || !file.exists()){
						out.print("<div class='msg'>文件不存在！</div>");
						//out.print("<script>setTimeout(function(){history.go(-1);},1000);</script>");
						return ;
					}
					BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));*/

					URL url = null;
					File file = null;
					
					if (blobs[0].getLength() > 0L) {
						file = new File(host.getKeyRootPath("cash"));
						
						if (file != null)
							file = new File(file, filepath);
					} else {
						try {
							url = new URL(filepath);
						} catch (MalformedURLException e) {
							out.print("<div class='msg'>文件不存在！</div>");
						}
					}
					
					BufferedInputStream bis = null;
					if (url != null) {
						try {
							bis = new BufferedInputStream(url.openStream());
						} catch (IOException e) {
							out.print("<div class='msg'>文件无法读取！</div>");
						}
					} else if (file != null) {
						bis = new BufferedInputStream(new FileInputStream(file));
					}
					
					if (bis != null) {
						response.reset();
						response.setContentType(DataUtility.GetMimeType(docMime));
							
						String fileName = new String(docFileName.getBytes(charset),"iso8859-1");
						response.setHeader("Content-disposition","attachment;filename=" + fileName);
						ServletOutputStream os= response.getOutputStream();
						
						BufferedOutputStream bos = new BufferedOutputStream(os);
						byte[] buff = new byte[4096];
						int bytesRead;
						//图片大小处理流程
						if(isIcon){
							BufferedImage bSrc = null;
							if (url != null)
								bSrc = ImageIO.read(url);
							else if (file != null)
								bSrc = ImageIO.read(file);
							int srcW = bSrc.getWidth();
							int srcH = bSrc.getHeight();
							if(width<=0){
								// 根据设定的长度求出宽度
								width = (srcW * height)/srcH;
							}
							
							if(height<=0){
								// 根据设定的宽度求出长度
								height = (srcH * width) / srcW;
							}
	
							BufferedImage bTarget = new BufferedImage(width, height, BufferedImage.TYPE_3BYTE_BGR);
							
							AffineTransform transform = new AffineTransform();
							 
							double sx = (double) width / srcW;
							double sy = (double) height / srcH;
							
	
							transform.setToScale(sx, sy);
							AffineTransformOp ato = new AffineTransformOp(transform, null);
							ato.filter(bSrc, bTarget);
							
							ByteArrayOutputStream outByte = new ByteArrayOutputStream();
							ImageIO.write(bTarget, "jpeg", outByte);
							byte[] bytes = outByte.toByteArray();
							bos.write(bytes);
						} else {
						
						/*if(docMime.indexOf("text")>=0) {
							String filecharset=DataUtility.GetMimeCharacterEncoding(docMime);
							if(filecharset==null || filecharset.isEmpty())
								filecharset=charset;
	
							BufferedReader reader = new BufferedReader (new InputStreamReader(bis, filecharset));
							char[] buffer = new char[1024];
							int len=0;
							do{
								len=reader.read(buffer, 0, buffer.length);
								if(len>0) {
									String s = new String(buffer, 0, len);
									s = s.replaceAll("<", "&lt;")
											.replaceAll(">", "&gt;")
											.replaceAll("\\r\\n", "<br/>")
											.replaceAll("\\n", "<br/>")
											.replaceAll(" ", "&nbsp;")
											.replaceAll("'", "&prime;")
											.replaceAll("\"", "&Prime;");
									byte [] bytes=s.getBytes("UTF-8");
									bos.write(bytes);
								} //end if(len>0)
							}while(len>0);
						}else{*/
							while(-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
								bos.write(buff, 0, bytesRead);
							}	
						//}
						}
						
						bos.flush();
	
						if (os!=null)
							os.close();
	
						out.clear();  
						out = pageContext.pushBody();  
					
						bis.close();
					} // end if (bis != null)
				} //end if (filepath != null && !filepath.isEmpty()) 
			} // end if (diField != null && dnField != null && dsField != null)
			
			break;
		} // end if (record!= null)
	} // end for(Record record:records)
} //end if (records != null && records.length > 0 && records[0] != null)
%>

</body> 

</html>


