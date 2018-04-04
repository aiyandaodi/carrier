<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：客户端Client读取页面
参数：client_id -- 对象标识
-->

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="serverRead.css" rel="stylesheet" type="text/css" />
<meta http-equiv="Cache-Control" content="no-cache,no-store, must-revalidate">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="expires" content="0">

<!--[if lt IE 7]>
<style type="text/css">
.home .row{
	padding-bottom:0;
}
.px_fix{
	left:1px;
	bottom:-3px;
}
</style>
<![endif]-->

<link rel= "Shortcut Icon"   href= "../../../images/tekinfo.ico"/>
<link rel= "Bookmark"   href= "../../../images/tekinfo.ico"/>
<script language="javascript" type="text/javascript" src="../../../common/tek/js/common.js"></script>
<script language="javascript" type="text/javascript" src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../../../common/js/normal.js"></script>
<script language="javascript" type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
<script language="javascript" type="text/javascript">
  $(document).ready(function(){
	  $(".menu2>li").bind("mouseover",function(){
          $(this).children("ul").slideDown("fast"); 
      }).bind("mouseleave",function(){     
          $(this).children("ul").slideUp("fast"); 
      }); 
      $(".menu2>li>ul li").bind("mouseover",function(){     
          $(this).children("ul").slideDown("fast"); 
      }).bind("mouseleave",function(){  
          $(this).children("ul").slideUp("fast"); 
      });
	  $(".slide").click(function(){
		 if($(".crumbs-outer").css("display")=="none"){
		   $(".slide").html("隐藏");
		  }else{
		  	$(".slide").html("详细信息");
		  }
		  $(".crumbs-outer").toggle();		  
      }) 
  });
</script>
<meta name="keywords" content="client,server,manager,list,客户端" />
<meta name="description" content="client,server,manager,list,客户端" />
<link href="../../../client/read.css" rel="stylesheet" type="text/css" media="screen" />
<!--[if IE]> <link href="readIE.css" rel="stylesheet" type="text/css" media="screen" /><![endif]-->

<title>Client 客户端 - 读取</title>
</head>
<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.object.ObjectOp" %>
<%@ page import="net.tekinfo.object.ObjectRecord" %>
<%@ page import="net.tekinfo.remoting.system.ClientRm" %>
<%@ page import="net.tekinfo.system.Client" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%@ page import="java.util.Hashtable" %>

<body>
<%@ include file="../../../config.jsp" %>
<%@ include file="../../../common/tek/jsp/shield.jsp" %>

<%
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
	StringHash p = parameters.getParameters();
	
	long clientId = DataUtility.StringToLong(parameters.getParameter(Client.FIELD_ID));
	
	ClientRm remoting = new ClientRm();
	ObjectResult result = remoting.readInfo(token.getTokenCode(), clientIp, p);
		
	if (result == null) {
		out.println("<div class='msg'>操作失败!</div>");
		return;
	}
	
	int right = result.getRight();
	boolean create = Right.IsCanCreate(right);
	boolean read = Right.IsCanRead(right);
	boolean write = Right.IsCanWrite(right);
	boolean delete = Right.IsCanDelete(right);
	boolean admin = Right.IsCanAdmin(right);

	Hashtable<String, Field> hash = new Hashtable<String, Field>();    // 域值哈希表<域名,显示值>
	
	if (result.getCode() == Result.RESULT_OK) {
		Record[] records = result.getRecords();

		if (records != null && records.length > 0 && records[0] != null) {
			Field[] fields = records[0].getFields();
			
			if (fields != null && fields.length > 0) {
				for(Field field : fields) {
					if(field == null)
						continue;
					
					String fieldName = field.getName();
					if (fieldName == null || fieldName.isEmpty())
						continue;
					
					hash.put(fieldName, field);
				} //end for(Field field : fields)
			}	//end if(fields != null && fields.length > 0)
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
<form id="form1" name="form1" method="post"  accept-charset="<%=charset%>" style="display:none">
</form>
<%
	// 刷新form
	ObjectPrint objectPrint = new ObjectPrint();
	String refreshForm = objectPrint.printRefreshForm(parameters, charset);
	if (refreshForm != null)
		out.println(refreshForm);
%>
<div id="main">
	<div id="in" class="home">
		<div id="header">
			<div id="menu">
				<ul class="menu" style="left:0;">
<%
	if(write)
		out.println("<li><a href='javascript:edit();'>修改</a></li>");

	if (delete)
		out.println("<li><a href='javascript:remove1();'>删除</a></li>");
	
	if (admin)
		out.println("<li><a href='javascript:record();'>操作记录</a></li>");
%>
                  </ul>
				<!--end.menu--></div>

			<div id="navigation">
            <!--end.navigation--></div>

		</div>
        

		<div id="body">
			<div id="banner" class="cbox">
				<div>
    			  <a href="#" id="crumbsShow">

<%
	// 名称
	Field nameField = hash.get(Client.FIELD_NAME);
	if (nameField != null) {
		//out.print("<li>");
		//out.print(nameField.getDisplay());
		//out.print(":");
		out.print(nameField.getShow());
		//out.print("；</li>");
	}
%>
				  </a>
				</div>
				<div class="crumbs-outer"><ul class="crumbs">
<%
	// 编码
	Field codeField = hash.get(Client.FIELD_CODE);
	if (codeField != null) {
		out.print("<li>");
		out.print(codeField.getDisplay());
		out.print(":");
		out.print(codeField.getShow());
		out.print("；</li>");
	}

	// 类别
	Field typeField = hash.get(Client.FIELD_TYPE);
	if (typeField != null) {
		out.print("<li>");
		out.print(typeField.getDisplay());
		out.print(":");
		out.print(typeField.getShow());
		out.print("；</li>");
	}

	// 状态
	Field statusField = hash.get(Client.FIELD_STATUS);
	if (statusField != null) {
		out.print("<li>");
		out.print(statusField.getDisplay());
		out.print(":");
		out.print(statusField.getShow());
		out.print("；</li>");
	}

	// 域名
	Field domainField = hash.get(Client.FIELD_DOMAIN);
	if (domainField != null) {
		out.print("<li>");
		out.print(domainField.getDisplay());
		out.print(":");
		out.print(domainField.getShow());
		out.print("；</li>");
	}

	// 授权码
	Field tokenCodeField = hash.get(Client.FIELD_TOKEN);
	if (tokenCodeField != null) {
		out.print("<li>");
		out.print(tokenCodeField.getDisplay());
		out.print(":");
		out.print(tokenCodeField.getShow());
		out.print("；</li>");
	}

	// 授权码密钥
	Field tokenSecretField = hash.get(Client.FIELD_TOKENSECRET);
	if (tokenSecretField != null) {
		out.print("<li>");
		out.print(tokenSecretField.getDisplay());
		out.print(":");
		out.print(tokenSecretField.getShow());
		out.print("；</li>");
	}
	
	// 开始时间
	Field startField = hash.get(Client.FIELD_START);
	if (startField != null) {
		out.print("<li>");
		out.print(startField.getDisplay());
		out.print(":");
		out.print(startField.getShow());
		out.print("；</li>");
	}

	// 结束时间
	Field endField = hash.get(Client.FIELD_END);
	if (endField != null) {
		out.print("<li>");
		out.print(endField.getDisplay());
		out.print(":");
		out.print(endField.getShow());
		out.print("；</li>");
	}

	// 创建时间
	Field createTimeField = hash.get(Client.FIELD_CREATE_TIME);
	if (createTimeField != null) {
		out.print("<li>");
		out.print(createTimeField.getDisplay());
		out.print(":");
		out.print(createTimeField.getShow());
		out.print("；</li>");
	}

	// 创建ＩＰ地址
	Field createIpField = hash.get(Client.FIELD_CREATE_IP);
	if (createIpField != null) {
		out.print("<li>");
		out.print(createIpField.getDisplay());
		out.print(":");
		out.print(createIpField.getShow());
		out.print("；</li>");
	}

	// 创建用户名
	Field userNameIpField = hash.get(Client.FIELD_USERNAME);
	if (userNameIpField != null) {
		out.print("<li>");
		out.print(userNameIpField.getDisplay());
		out.print(":");
		out.print(userNameIpField.getShow());
		out.print("；</li>");
	}

	// 联系电话
	Field phoneField = hash.get(Client.FIELD_PHONE);
	if (phoneField != null) {
		out.print("<li>");
		out.print(phoneField.getDisplay());
		out.print(":");
		out.print(phoneField.getShow());
		out.print("；</li>");
	}

	// 联系邮箱
	Field emailField = hash.get(Client.FIELD_EMAIL);
	if (emailField != null) {
		out.print("<li>");
		out.print(emailField.getDisplay());
		out.print(":");
		out.print(emailField.getShow());
		out.print("；</li>");
	}

	// 邮政编码
	Field postCodeField = hash.get(Client.FIELD_POSTCODE);
	if (postCodeField != null) {
		out.print("<li>");
		out.print(postCodeField.getDisplay());
		out.print(":");
		out.print(postCodeField.getShow());
		out.print("；</li>");
	}

	// 地址
	Field addressField = hash.get(Client.FIELD_ADDRESS);
	if (addressField != null) {
		out.print("<li>");
		out.print(addressField.getDisplay());
		out.print(":");
		out.print(addressField.getShow());
		out.print("；</li>");
	}

	// 备注
	Field remarkField = hash.get(Client.FIELD_REMARK);
	if (remarkField != null) {
		out.print("<li class='comment'>");
		out.print(remarkField.getDisplay());
		out.print(":");
		out.print(HttpUtility.StringToHTML(remarkField.getShow()));
		out.print("；</li>");
	}
%>
				</ul>
				<!--end.banner--></div></div>
				</div>
			<div id="load_content">
				<iframe id="load_frame" name="load_frame"  width="100%" height="100%" scrolling="no" frameborder="0" allowtransparency="true"  onload="javascript:if(navigator.userAgent.indexOf('MSIE')<=0) {iniIFrame(this);}" onreadystatechange ="javascript:iniIFrame(this);"> </iframe>
				
				<!-- end.load_content--></div>
		</div>
		<br />
	</div>
	<!--in--> 
</div>
<!--main-->
</body>

<script language="javascript">
  /**
   * 修改
   */
  function edit() {
    var form = document.getElementById("form1");
    if (form == null)
      return;

    form.innerHTML="";
    form.action = "edit.jsp";
    form.target="_self";
    if(navigator.userAgent.indexOf('MSIE')>=0)
      document.charset="<%=charset %>";
      
    var hidden = document.createElement("input");
    hidden.id = "<%= Client.FIELD_ID %>";
    hidden.name = "<%= Client.FIELD_ID %>";
    hidden.type = "hidden";
    hidden.value = "<%= clientId %>";
    form.appendChild(hidden);

    var callbackURL = document.createElement("input");
    callbackURL.id = "<%= KEY_CALLBACK_URL %>";
    callbackURL.name = "<%= KEY_CALLBACK_URL %>";
    callbackURL.type = "hidden";
    callbackURL.value = "read.jsp";
    form.appendChild(callbackURL);
 
    var callbackParams = document.createElement("input");
    callbackParams.id = "<%= KEY_CALLBACK_PARAMS %>";
    callbackParams.name = "<%= KEY_CALLBACK_PARAMS %>";
    callbackParams.type = "hidden";
    callbackParams.value = "<%=Client.FIELD_ID%>=<%= clientId %>";
    form.appendChild(callbackParams);

    var refreshOpener = document.createElement("input");
    refreshOpener.id = "<%= KEY_REFRESH_OPENER %>";
    refreshOpener.name = "<%= KEY_REFRESH_OPENER %>";
    refreshOpener.type = "hidden";
    refreshOpener.value = "true";
    form.appendChild(refreshOpener);
 
    submitWithWaiting("form1", "<%= charset %>");
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
    hidden.id = "<%= Client.FIELD_ID %>";
    hidden.name = "<%= Client.FIELD_ID %>";
    hidden.type = "hidden";
    hidden.value = "<%= clientId %>";
    form.appendChild(hidden);

    var refreshOpener = document.createElement("input");
    refreshOpener.id = "<%= KEY_REFRESH_OPENER %>";
    refreshOpener.name = "<%= KEY_REFRESH_OPENER %>";
    refreshOpener.type = "hidden";
    refreshOpener.value = "true";
    form.appendChild(refreshOpener);

    var showClose = document.createElement("input");
    showClose.id = "<%= KEY_SHOW_CLOSE %>";
    showClose.name = "<%= KEY_SHOW_CLOSE %>";
    showClose.type = "hidden";
    showClose.value = "true";
    form.appendChild(showClose);

    submitWithWaiting("form1", "<%= charset %>");
  }

  /**
   * 操作记录
   */
  function record() {
    var form=document.getElementById("form1");
    if (!form)
      form=createForm("form1","<%=charset%>");

    if(!form)
	  return;

    form.innerHTML="";
    form.action = "../object/index-record.jsp";
    form.target="_blank";
    if(navigator.userAgent.indexOf('MSIE')>=0)
      document.charset="<%=charset %>";
    
    var objectName=document.createElement("input");
    objectName.id="<%= ObjectRecord.FIELD_OBJECT %>";
    objectName.name="<%= ObjectRecord.FIELD_OBJECT %>";
    objectName.type="hidden";
    objectName.value="<%= Client.OBJECT %>";
    form.appendChild(objectName);

    var objectId=document.createElement("input");
    objectId.id="<%= ObjectRecord.FIELD_OBJECTID %>";
    objectId.name="<%= ObjectRecord.FIELD_OBJECTID %>";
    objectId.type="hidden";
    objectId.value="<%=clientId%>";
    form.appendChild(objectId);

    form.submit();
  }
		
  //设置页面高度
  function iniIFrame( myframe ){
	 //  var tabObj=document.getElementById("load_frame");
	  
	var isgo=false;
	if(navigator.userAgent.indexOf("MSIE")>0){
		if ((myframe.readyState == "complete")|| (myframe.readyState == "loaded") )
		isgo=true;
	}else		
		isgo=true;

	if(isgo){
		var height=getIframeScrollHeight(myframe);
		try{
			//alert(height);
			myframe.height = height;
			//if(tabObj)
			//	tabObj.height=height+60;
        }catch (ex){}
			
	} //end if(isgo)*/
  }

  function refreshFrame(){
	  var conobj=document.getElementById("load_frame");
	  if(conobj)
		iniIFrame(conobj);
  }
	
	function openContent(cmd) {
	//alert(currentPath);
	//alert(cmd);
	  var tabObj=document.getElementById("load_frame");
	  if(tabObj){
		 // tabObj.height=300;
	  	//if(currentPath)
	  	//	tabObj.src=currentPath+cmd;
	  	//else
	  		tabObj.src=cmd;
	  }
    }

<%
	if (typeField != null) {
		int type = DataUtility.StringToInt(typeField.getValue());
		if (type == Client.TYPE_SYSTEM || type == Client.TYPE_SYNC_SAME || type == Client.TYPE_SYNC_DOWN || type == Client.TYPE_SYNC_OTHER) {
			// 同步服务器的客户端
			out.print("openContent('../user/list.jsp?");
			out.print(Client.FIELD_ID);
			out.print("=");
			out.print(clientId);
			out.println("');");
			
		} else if (type == Client.TYPE_BIND) {
			// 第三方绑定
			out.print("openContent('../authority/list.jsp?");
			out.print(Client.FIELD_ID);
			out.print("=");
			out.print(clientId);
			out.println("');");
		}
	}
%>
  window.setInterval("iniIFrame(document.getElementById('load_frame'))", 500);
</script>
</html>
