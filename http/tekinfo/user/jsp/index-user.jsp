<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>

<!--
说明：FTP 文件显示（显示当前用户的所有默认目录：私有、所属组、公共）
参数：
	
-->

<%@ page import="com.takall.ftpserver.FtpServer" %>
<%@ page import="net.tekinfo.remoting.Field" %>
<%@ page import="com.takall.remoting.ftpserver.FtpServerRm" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.Record" %>


<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.http.Parameters" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="user, server,manager,list,FTP,文件" />
<meta name="description" content="user, server,manager,list,FTP,文件户" />
<link rel="stylesheet" type="text/css" href="style.css" />
<link rel="stylesheet" type="text/css" href="../../../user/table.css" />
<style>
html { overflow-x:hidden; }
body {
     overflow-x : hidden;   去掉横条
     overflow-y : hidden;   去掉竖条
} 
</style>

<link rel= "Shortcut Icon"   href= "../../../../favicon.ico"/>
<link rel= "Bookmark"   href= "../../../../favicon.ico"/>
<title>文件操作</title>
</head>

<body>

<%@ include file="../../../config.jsp" %>
 
<div>
<!-- 选项卡开始 -->
  <div class="nTab">
 <%
 Parameters parameter=new Parameters(token.getTokenCode(),clientIp,request);
	FtpServerRm remoting = new FtpServerRm();
	ObjectResult result = remoting.getHomes(token.getTokenCode(),clientIp,null,0,0);
	if ( result.getCode() == Result.RESULT_OK) {
		Record[] records = result.getRecords();
		
		if (records != null && records.length > 0) {
			
%>   
    
    <!-- 内容开始 -->
    <div id="TabContent" class="TabContent"> 
    
    <iframe id="myTab0_Content0"   name="myTab0_Content0" width='96%' height='100%'  scrolling="auto" frameborder="0" onload="jscript:if(navigator.userAgent.indexOf('MSIE')<=0) {iniIFrame(this);}" onreadystatechange ="jscript:iniIFrame(this);" class="framecontent">  </iframe>
    
    <%	
			for (int i=0;i<records.length;i++) {
				if (records[i] == null)
					continue;
				out.print("<iframe id='myTab0_Content");
				out.print(i+1);
				out.print("' name='myTab0_Content");
				out.print(i+1);
				out.println("' width='100%' height='96%' frameborde='false' scrolling='auto' frameborder='0' onload='javascript:if(navigator.userAgent.indexOf(\"MSIE\")<=0) {iniIFrame(this);}' onreadystatechange ='javascript:iniIFrame(this);' class='framecontent'>  </iframe>");
			} //end for (int i=0;i<records.length;i++) 
				
	%>
    
      
    </div>
    <!-- 标题开始 -->
    <div class="TabTitle">
      <ul id="myTab0">
      <%
			for (int i=0;i<records.length;i++) {
				if (records[i] == null)
					continue;
				out.print(" <li class='normal' onclick='javascript:nTabs(this,");
				out.print(i+1);
				out.println(");'>");
				Field [] fields=records[i].getFields();
				if(fields!=null){
					for(Field field:fields){
						if(field!=null && field.getName().equalsIgnoreCase("name"))
						{
							out.print(field.getShow());
							break;
						}
					} //end for(Field field:fields)
				}
				
				out.println("</li>");
			} //end for (int i=0;i<records.length;i++) 
		
	  %>
        <li id="help" class="normal" onclick="nTabs(this,0);">帮助</li>
      </ul>
    </div>
  </div>
  <!-- 选项卡结束 -->
  
</div>

<script language="javascript" type="text/javascript">

<!-- tab 标签 -->

	
	<%
	out.print("var htmls=['help.html'");
			for (int i=0;i<records.length;i++) {
				if (records[i] == null)
					continue;
				
				Field [] fields=records[i].getFields();
				if(fields!=null){
					for(Field field:fields){
						if(field!=null && field.getName().equalsIgnoreCase("path"))
						{
							out.print(",'");
							out.print("list.jsp?path=");
							out.print(parameter.encode(field.getShow()));
							//out.print(field.getShow());
							out.print("'");
							break;
						}
					} //end for(Field field:fields)
				}
			} //end for (int i=0;i<records.length;i++) 
	out.println("];");
	
	out.print("var isopen=[0");
			for (int i=0;i<records.length;i++) {
				if (records[i] == null)
					continue;
				out.print(",0");
			}
	out.println("];");
	%>
	
	function nTabs(thisObj,Num){
		
		if(thisObj.className == "active")
			return;
			
		var tabObj = thisObj.parentNode.id;
		var tabList = document.getElementById(tabObj).getElementsByTagName("li");
		
		for(i=0; i <tabList.length; i++)
		{
			
  			if (i == Num)
  			{
				thisObj.className = "active"; 
      			
				document.getElementById(tabObj+"_Content"+i).style.display = "block";
				if(isopen[i]==0)
				{
					alert(htmls[i]);
					window.frames[i].location=htmls[i];
					//iniIFrame(window.frames[0]);
					isopen[i]=1;
				}
				
  			}else{
				tabList[i].className = "normal"; 
   				document.getElementById(tabObj+"_Content"+i).style.display = "none";
  			}
		} 
		//document.getElementById(tabObj+"_Content"+tabList.length).style.display = "none";
	}

//设置页面高度
  		function iniIFrame( myframe ){
			var  divobj=document.getElementById( "TabContent");
			//alert(myframe);
			var isgo=false;
			if(navigator.userAgent.indexOf("MSIE")>0){
	  			if ((myframe.readyState == "complete")|| (myframe.readyState == "loaded") )
					isgo=true;
			}else		
	  			isgo=true;
				
			if(isgo){
				var dHeight ;
        		var height ;
			
					  
				   // if(navigator.userAgent.indexOf("MSIE")>0) { 
				   //  bHeight = myframe.document.body.scrollHeight;
                   //  dHeight = myframe.document.documentElement.scrollHeight;
				   // }
				   // else
				  // {
				bHeight = myframe.contentWindow.document.body.scrollHeight;
        		dHeight = myframe.contentWindow.document.documentElement.scrollHeight;
				   //}
				
				var height = Math.max(bHeight, dHeight);
				
				//alert(height);
				if(height<800)
					height=800;
				
				height+=50;
		    	//alert(myframe.document.body.scrollHeight);
			
				//width=document.body.clientWidth-130;
				
				try{
          			myframe.height = height;
					
					//divobj.style.height=heigh+"px"
					
					//myframe.width = width;
					//alert(";jjw="+myframe.width );
					divobj.style.width=width+"px"
        		}catch (ex){}
			
			} //end if(isgo)
  		}
		
		function openShow(){
			
			var tabObj=document.getElementById("myTab0").id;
			
			var tabList = document.getElementById(tabObj).getElementsByTagName("li");
		
			
			for(i=0; i <tabList.length; i++)
			{
   				tabList[i].className = "normal"; 
   				document.getElementById(tabObj+"_Content"+i).style.display = "none";
			}
			
			//alert(isopen[6]);
			if(isopen[0]==0){
				window.frames[0].location=htmls[0];
				isopen[0]=1;
			}
			
			document.getElementById(tabObj+"_Content"+0).style.display = "block";
		}
		
		openShow();
</script>

<%
		}
	} //end if ( result.getCode() == Result.RESULT_OK)
	else
	{
		out.println(result.getCode());
		out.println(" : ");
		out.println(result.getMessage());	
	}
	
	%>
</body>
</html>
