<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"><!-- InstanceBegin template="/Templates/mac-admin-info.dwt" codeOutsideHTMLIsLocked="false" -->
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="keywords" content="后台 管理 通用 统一 平台 用户 主题 信息 资讯 媒体 Tekinfo Takall Admin Administrator Uniform RealOffice Administrator User Subject Information Media"/>
  <meta name="description" content="后台 管理 通用 统一 平台 用户 主题 信息 资讯 媒体 Tekinfo Takall Admin Administrator Uniform RealOffice Administrator User Subject Information Media"/>
  <meta name="author" content="Tekinfo TAKALL"/>

  <link rel="Shortcut Icon" href="../../../../favicon.ico"/>
  <link rel="Bookmark" href="../../../../favicon.ico"/>

  <!-- Stylesheets -->
  <link rel="stylesheet" href="../../../style/macadmin/css/bootstrap.min.css"/>
  <!-- Font awesome icon -->
  <link rel="stylesheet" href="../../../style/macadmin/css/font-awesome.min.css"/>
  <!-- jQuery UI -->
  <link rel="stylesheet" href="../../../style/macadmin/css/jquery-ui.css"/>
  <!-- Calendar -->
  <link rel="stylesheet" href="../../../style/macadmin/css/fullcalendar.css"/>
  <!-- prettyPhoto -->
  <link rel="stylesheet" href="../../../style/macadmin/css/prettyPhoto.css"/>
  <!-- Star rating -->
  <link rel="stylesheet" href="../../../style/macadmin/css/rateit.css"/>
  <!-- Date picker -->
  <link rel="stylesheet" href="../../../style/macadmin/css/bootstrap-datetimepicker.min.css"/>
  <!-- CLEditor -->
  <link rel="stylesheet" href="../../../style/macadmin/css/jquery.cleditor.css"/>
  <!-- Data tables -->
  <link rel="stylesheet" href="../../../style/macadmin/css/jquery.dataTables.css"/>
  <!-- Bootstrap toggle -->
  <link rel="stylesheet" href="../../../style/macadmin/css/jquery.onoff.css"/>
  <!-- Main stylesheet -->
  <link rel="stylesheet" href="../../../style/macadmin/css/style.css"/>
  <!-- Widgets stylesheet -->
  <link rel="stylesheet" href="../../../style/macadmin/css/widgets.css"/>
  
  <link rel="stylesheet" href="../../../common/css/mac-custom.css"/>

  <script type="text/javascript" language="JavaScript" src="../../../common/jquery/2.1.4/jquery.min.js"></script>
  <script type="text/javascript" language="JavaScript" src="../../../common/tek/js/refresh.js"></script>
  <script type="text/javascript" language="JavaScript" src="../../../common/tek/js/common.js"></script>
  <script type="text/javascript" language="JavaScript" src="../../../common/js/normal.js"></script>
  <script type="text/javascript" language="JavaScript" src="../../../common/tek/js/dataUtility.js"></script>
  <script type="text/javascript" language="JavaScript" src="../../../common/tek/js/serverTimer.js"></script>
  <script type="text/javascript" language="JavaScript" src="../../../common/tek/js/mac-common.js"></script>
  
  <!-- InstanceBeginEditable name="MyHead" -->
  <title>导入对象图标</title>
<!-- InstanceEndEditable -->

  <script type="text/javascript">
    $(document).ready(function() {
	  initial();
    });
  </script>
</head>

<body>
<!-- InstanceBeginEditable name="Top" -->
<%@ include file="../../../config.jsp" %>

<%@ page import="java.util.Map.Entry" %>
<%@ page import="java.util.Iterator" %>

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.remoting.ImportIconRemoting" %>
<%@ page import="net.tekinfo.system.Credentials" %>
<%@ page import="net.tekinfo.system.Host" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>
<!-- InstanceEndEditable -->

<div class="navbar navbar-fixed-top bs-docs-nav" role="banner">
  <div class="conjtainer">
    <!-- Menu button for smallar screens -->
    <div class="navbar-header">
      <button class="navbar-toggle btn-navbar" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
        <span>菜单</span>
	  </button>
      
	  <!-- Site name for smallar screens -->
      <a href="../../../ipass/admin/index.html" class="navbar-brand hidden-lg"><img src="../../../images/tekinfo-banner-180.png" style="margin-top:-5px" height="28" alt="Tekinfo" longdesc="http://www.tekinfo.net"></a>
	</div><!-- end .navbar-header -->
    
    <!-- Navigation starts -->
    <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">
      <!-- InstanceBeginEditable name="MainMenu" -->
    	
	<!-- InstanceEndEditable -->
      <!-- Links -->
      <ul class="nav navbar-nav pull-right">
        <li class="dropdown pull-right">
          <a data-toggle="dropdown" class="dropdown-toggle" href="#">
            <i class="fa fa-user"></i>
            <span id="user_name">匿名用户</span>
            <b class="caret"></b>
          </a>
          
          <!-- Dropdown menu -->
          <ul class="dropdown-menu">
            <li id="user_account"><a href="javascript:goLogin();">登录</a></li>
            <li id="user_profile"><a href="javascript:goRegister();">注册</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  </div><!-- end.conjtainer -->
</div>

<div class="content">
<!-- InstanceBeginEditable name="MAINCONTENT" -->
<%
	if (!isLogin) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;
	}
	
	//Host host = hostManager.getHost(token.getTokenCode(), DataUtility.IpToLong(clientIp), null);
	if (host == null || !host.isAlive()) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;
	}
	
	Credentials credentials = host.getCredentials();
	if (credentials == null) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;		
	}
	
	User user = credentials.getUser();
	if (user == null || !user.isSupervisor(host)) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;		
	}

	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
	StringHash p = parameters.getParameters();    //参数哈希表

	// 执行升级操作
	ImportIconRemoting remoting = new ImportIconRemoting();
		
	Result result = remoting.importIcon(token.getTokenCode(), clientIp, p);
	if (result != null) {
		if (result.getCode() == Result.RESULT_OK)
			out.println("导入成功!<br/>");
		else
			out.println("导入失败!<br/>");
		String msg = result.getMessage();
		if (msg != null) {
			msg = msg.replaceAll("\r\n", "<br/>");
			out.println(msg);
		}
	} else
		out.println("导入错误![result=null]<br/>");
%>
          </span>
        </div>
      </div> <!--end .col-md-12 -->
    </div><!--end .row -->
  </div><!--end .containe -->
</div><!--end .admin-form -->
<!-- InstanceEndEditable -->

<!-- Matter -->
<div class="matter">
  <div class="container">
    <!-- 显示操作信息 -->
    <div class="row">
      <div class="col-md-12">
        <div class="widget">
          <div class="widget-head">
            <div class="pull-left">系统信息</div>
            <div class="widget-icons pull-right">
            </div>  
            <div class="clearfix"></div>
          </div><!--end .widget-head-->
             
          <div class="widget-content" style="margin:5px 10px;">
            <div class="row">
              <div class="col-xs-3 col-sm-2 col-md-1">
                <img src="../../../images/clock-64.png" width="48" alt="时间"/>
              </div>
                    
              <div class="col-xs-9 col-sm-10 col-md-6">
                <div class="row">
                  <div class="col-xs-5 col-sm-4 col-lg-3 text-right">服务器时间:</div>
                  <div id="serverTime" class="col-xs-7 col-sm-8 col-lg-9 text-left"></div>
                </div>
                  
                <div class="row">
                  <div class="col-xs-5 col-sm-4 col-lg-3 text-right">客户端时间:</div>
                  <div id="clientTime" class="col-xs-7 col-sm-8 col-lg-9 text-left"></div>
                </div>
              </div>
            </div><!-- end .row-->
          </div><!-- end.widget-content -->
                
          <div class="widget-content">
            <div class="row">
              <div id="message" class="col-md-12">
              </div>
            </div>
          </div><!-- end.widget-content -->
        </div><!-- end .widget-->
      </div><!-- end.col-md-->
    </div><!-- end.row -->
    </div><!-- end.container-->
  </div><!--end matter-->
</div><!-- end .content -->

<!-- Footer starts -->
<footer>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        
<!-- Copyright info -->
        <p class="copy">
          <a href="http://www.tekinfo.net" target="_blank">
            <img src="../../../images/tekinfo-banner-180.png" height="16" alt="Tekinfo" longdesc="http://www.tekinfo.net"/></a>
          Copyright &copy; TekInfo | <a href="http://www.tekinfo.net">北京易商迅达科技有限公司</a> |
          <script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_4270269'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s95.cnzz.com/stat.php%3Fid%3D4270269%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E"));</script> |
            <script type="text/javascript">
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F89eef6e4d64a6ee9cbfa76c304a9f87f' type='text/javascript'%3E%3C/script%3E"));
</script>
        </p>
      </div>
    </div>
  </div>
</footer> 	

<!-- Footer ends -->

<form id="call_form" name="call_form" method="post" accept-charset="UTF-8" style="display:none"></form>
<!-- Scroll to top -->
<span class="totop"><a href="#"><i class="fa fa-chevron-up"></i></a></span> 

<!-- 等待图层 -->
<div id="waiting-modal-dialog" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 id="waiting-modal-dialog-title" class="center">&nbsp;</h3>
      </div>
      <div id="waiting-modal-dialog-body" class="modal-body center">
        <p id="waiting-msg" class='text-center'></p>
        <span id="waiting-timer-msg" style="text-align:center"></span>
      </div>
      <div class="col-lg-12" align="center">
      </div>
    </div>
  </div><!-- end .modal-dialog-->
</div>

<script src="../../../style/macadmin/js/bootstrap.js"></script> <!-- Bootstrap -->
<script src="../../../style/macadmin/js/bootstrap-datetimepicker.min.js"></script> <!-- Date picker -->
<script src="../../../style/macadmin/js/jquery.rateit.min.js"></script> <!-- RateIt - Star rating -->
<script src="../../../style/macadmin/js/jquery.prettyPhoto.js"></script> <!-- prettyPhoto -->
<script src="../../../style/macadmin/js/jquery-ui.min.js"></script> <!-- jQuery UI -->

<script src="../../../style/macadmin/js/jquery.dataTables.min.js"></script> <!-- Data tables -->
<script src="../../../style/macadmin/js/jquery.cleditor.min.js"></script> <!-- CLEditor -->
<script src="../../../style/macadmin/js/jquery.slimscroll.min.js"></script> <!-- CLEditor -->
<script src="../../../style/macadmin/js/jquery.onoff.min.js"></script> <!-- Bootstrap Toggle -->
<script src="../../../style/macadmin/js/moment.min.js"></script> <!-- Moment js for full calendar -->
<script src="../../../style/macadmin/js/fullcalendar.min.js"></script> <!-- Full Google Calendar - Calendar -->
<script src="../../../style/macadmin/js/custom.js"></script> <!-- Custom codes -->

<script language="javascript" type="text/javascript">

function goSystem(){
  //alert("u="+window.location.protocol+"//"+location.host);
  self.location=tek.common.getRelativePath();//window.location.protocol+"//"+location.host;
}

var request = GetRequest();
var requestURL=request["callback-url"];
var requestPAR=request["callback-params"];

function initial(){
	getUser();
	
	if(init && typeof(init)=="function")
		init();

	if(myId && myId > 0){
		var obj = document.getElementById("user_name");
		if(obj){
			obj.innerHTML=myName+"@"+myLoginIp;
		}
		var obj = document.getElementById("user_account");
		if(obj){
			obj.innerHTML="<a href='javascript:myAccount();'>我的账户</a>";
		}
		var obj = document.getElementById("user_profile");
		if(obj){
			obj.innerHTML="<a href='javascript:goLogout();'>退出系统</a>";
		}
	}
	
	showServerTime();
}

function goLogin() {
	callPage(tek.common.getRootPath()+"http/ipass/login/login.html",location.href,GetRequestString());
}
  
function goLogout() {
	callPage(tek.common.getRootPath()+"http/tekinfo/login/logout.html",location.href,GetRequestString());
}

//回调当前页的参数
var callParams;

function callPage(url) {
	var form = document.getElementById("call_form");
	if (form == null || url==null){
		waitingMessage("程序有错误，请和管理员联系！");
		$("#waiting-modal-dialog").modal("show",null,2);
		timeCounting();
	}else{
		form.innerHTML="";
		form.action = decodeURIComponent(url);
		form.target="_self";
		form.method="get";
		if(isIE())
			document.charset="UTF-8";
		
		var callbackURL = document.createElement("input");
		callbackURL.id = "callback-url";
		callbackURL.name = "callback-url";
		callbackURL.type = "text";
		callbackURL.value = location.href;
		
		form.appendChild(callbackURL);
		
		if(callParams && callParams.length>1){
			var callbackParams = document.createElement("input");
			callbackParams.id = "callback-params";
			callbackParams.name = "callback-params";
			callbackParams.type = "text";
			callbackParams.value = callParams;
			form.appendChild(callbackParams);
		}
		form.submit();
      }
}

/**
*	返回调用页面。requestURL
*/
function returnPage(){
	var url;
	if(!requestURL || requestURL.length<1)
		window.history.go(-1);
	else{
		url=decodeURIComponent(requestURL);
		
		if(requestPAR && requestPAR != "")
			url += "?callback-params="+requestPAR;
		self.location = url;
	}
}

function myAccount(){
	window.open(tek.common.getRootPath()+"http/tekinfo/user/read.html?user_id="+myId,"_blank");
}
</script>

<!-- InstanceBeginEditable name="MyJavascript" -->
<script type="text/javascript" language="javascript">
function init(){
}

function waiting() {
  $("#waiting-msg").html("正在加密处理，请等待...");	
  $("#waiting-modal-dialog").modal("show",null,2);
}
</script>
<!-- InstanceEndEditable --> 

</body>
<!-- InstanceEnd --></html>