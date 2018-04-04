<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8"%>

<html><!-- InstanceBegin template="/Templates/hdw-dialog.dwt" codeOutsideHTMLIsLocked="false" -->
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta http-equiv="content-language" contect = "zh_CN"/>
  
  <!-- InstanceBeginEditable name="Title" -->
  <!-- 自定义Title -->
  <title>转换MONEY</title>
  <!-- InstanceEndEditable -->

  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="keywords" content="读书 网络 社交 图片 相册 影像 文学 办公 协同 开源 求知 旅行 精品 支付 认证 hongde network Social photo video art office automation joint alliance Communication Authenticate Payment"/>
  <meta name="description" content="读书 网络 社交 图片 相册 影像 文学 办公 协同 开源 求知 旅行 精品 支付 认证 hongde network Social photo video art office automation joint alliance Communication Authenticate Payment"/>
  <meta name="author" content="Tekinfo[http://www.tekinfo.net]"/>
  
  <!-- Favicon -->
  <link rel="Shortcut Icon" href= "../../../../favicon.ico"/>
  <link rel="Bookmark" href= "../../../../favicon.ico"/>

  <!-- Styles -->
  <!-- Bootstrap CSS -->
  <link href="../../../style/brave/css/bootstrap.min.css" rel="stylesheet"> 
  <!-- Font awesome CSS -->
  <link href="../../../style/brave/css/font-awesome.min.css" rel="stylesheet">
  <!-- Magnific Popup -->
  <link href="../../../style/brave/css/magnific-popup.css" rel="stylesheet">
  <!-- Owl carousel -->
  <link href="../../../style/brave/css/owl.carousel.css" rel="stylesheet">
  
  <!-- CSS for this page -->
  <!-- Base style -->
  <link href="../../../style/brave/css/styles/style.css" rel="stylesheet">
  <!-- Skin CSS -->
  <link href="../../../style/brave/css/styles/skin-red.css" rel="stylesheet" id="color_theme">

  <!-- Custom CSS. Type your CSS code in custom.css file -->
  <link href="../../../style/brave/css/custom.css" rel="stylesheet">
  
  <!-- tekinfo CSS -->
  <link rel="stylesheet" href="../../css/tekinfo.css"/>
  <!-- hongde CSS -->
  <link rel="stylesheet" href="../../../hdw.top/css/hdw-style.css"/>
  
  <!-- InstanceBeginEditable name="MyCSS" --> 
  <!-- 自定义CSS -->
  <!-- InstanceEndEditable -->
  
  <script type="text/javascript" src="../../../common/jquery/2.1.4/jquery.min.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/tool.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/user.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/dataUtility.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/common.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/core.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/mac-common.js"></script>
        
  <!-- tekinfo JS -->
  <script type="text/javascript" src="../../js/tekinfo.js"></script>
  <!-- hdw JS -->
  <script type="text/javascript" src="../../../hdw.top/js/hdw.js"></script>

  <!-- InstanceBeginEditable name="MyJS" -->
  <!-- 自定义JS -->
  <!-- InstanceEndEditable -->
  
  <script type="text/javascript">
    $(document).ready(function() {
        initial();
    });
  </script>
</head>

<body>
<main>
	<!-- InstanceBeginEditable name="MAINCONTENT" -->
<%@ include file="../../../config.jsp" %>

<%@ page import="java.math.BigDecimal" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Collection" %>
<%@ page import="java.util.Map.Entry" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.Properties" %>

<%@ page import="net.tekinfo.database.Condition" %>
<%@ page import="net.tekinfo.database.Table" %>
<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.object.TObject" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.system.Credentials" %>
<%@ page import="net.tekinfo.system.Host" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<div class="admin-form">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <!-- .widget worange starts -->
        <div class="widget worange" id="login_div">
          <!-- Widget head -->
          <div class="widget-head">
            <i class="icon-lock"></i> 转换MONEY
          </div><!-- end .widget-head -->

          <div class="widget-content">
            <div class="padd">
<%
	if (!isLogin || (my.getSecurity() < User.USER_SUPER)) {
		// 没有权限
		out.println("没有权限!<br/>");
		return ;
	}
		
	//host = hostManager.getHost(token.getTokenCode(), DataUtility.IpToLong(clientIp), null);
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

	String objectName = parameters.getParameter("object");
	int type = DataUtility.StringToInt(parameters.getParameter("type"));
%>
    <form action="" id="transferForm" name="transferForm" method="post">
      <div id="waiting" class="center" style="display:none;">正在转换...</div>
      <div class="center">
        <select id="object" name="object">
<%
	for (Iterator<TObject> iterator = host.getObjects().values().iterator(); iterator.hasNext();) {
		TObject to = iterator.next();
		if (to == null)
			continue;

		Table table = to.getTable();
		if (table == null)
			continue;
		
		StringBuilder fields = new StringBuilder();
		
		Properties prop = table.getColumns();
		for (Iterator<Entry<Object, Object>> iter = prop.entrySet().iterator(); iter.hasNext();) {
			Entry<Object, Object> entry = iter.next();
			String k = (String) entry.getKey();
			String v = (String) entry.getValue();
			if (v != null && v.contains("FLOAT(20,4)")) {
				// 存在MONEY字段
				fields.append(k).append(", ");
			}
		}
		
		if (fields.length() > 0) {
			out.print("<option value='" + to.getName() + "'");
			if(to.getName().equals(objectName))
				out.print("selected='selected'");
			out.print(">" + to.getName() + " (" + fields.toString() + ")" + "</option>");
		}
	}
%>
        </select>
      </div>
      <div class="center">
        <input id="type1" name="type" type="radio" value="1" <%= (type==1)?"checked='checked'":"" %>><label for="type1">转换数据</label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <input id="type2" name="type" type="radio" value="2" <%= (type==2)?"checked='checked'":"" %>><label for="type2">转换表结构</label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <input id="type3" name="type" type="radio" value="3" <%= (type==3)?"checked='checked'":"" %>><label for="type3">转换数据 & 表结构</label>
      </div>
      <div class="center">
        <input id="transferButton" name="transferButton" type="button" onclick="transfer()" value="开始转换"/>
      </div>
    </form>
<%	
	if (objectName != null && !objectName.isEmpty() && type > 0) {
		host.getForegroundMessage(true);
		
		TObject tobject = host.getObject(objectName);
		if (tobject != null) {
			out.println("对象名:" + objectName + "<br/>");

			Table table = tobject.getTable();
			if (table != null) {
				out.println("表名:" + table.getName() + "<br/>");

				ArrayList<String> list = new ArrayList<String>();

				Properties prop = table.getColumns();
				for (Iterator<Entry<Object, Object>> iter = prop.entrySet().iterator(); iter.hasNext();) {
					Entry<Object, Object> entry = iter.next();
					String k = (String) entry.getKey();
					String v = (String) entry.getValue();
					if (v != null && v.contains("FLOAT(20,4)")) {
						// MONEY字段
						list.add(k);
					}
				}
				
				if (list.size() > 0) {
					if ((type & 1) == 1) {
						// 转换数据
						Condition condition = new Condition();
						StringBuilder select = new StringBuilder();
						select.append(tobject.getIdentity());
						for (String field : list)
							select.append(",").append(field);
						condition.setSelect(select.toString());
						condition.setCount(100);
						
						Object[] obs = null;
						int skip = 0;
						int total = 0;
						
						do {
							condition.setSkip(skip);
							obs = host.search(tobject, condition);
							
							if (obs != null && obs.length > 0) {
								int length = obs.length;
								
								for (int i = 0; i < length; i++) {
									if (obs[i] == null)
										continue;
									
									StringHash info = (StringHash) obs[i];
									out.print("转换数据" + info + " -> ");
									StringHash newInfo = new StringHash();
									for (String fieldName : list) {
										String fieldValue = info.get(fieldName);
										
										long newValue = new BigDecimal(fieldValue).multiply(new BigDecimal("10000")).longValue();
										newInfo.put(fieldName, newValue);
									} // end for (Iterator<Entry<String, String>> iterator = info.entrySet().iterator(); iterator.hasNext();)
									out.print(newInfo);
									out.print(": ");
									boolean flag = host.setInfo(tobject, DataUtility.StringToLong(info.get(tobject.getIdentity())), newInfo);
									if (flag)
										out.print("<font color='green'>成功!</font>");
									else
										out.print("<font color='red'>失败!</font>");
									out.println("<br/>");
								} // end for (int i = 0; i < length; i++)
								
								skip += length;
								total += length;
							} // end if (obs != null && obs.length > 0)
						} while (obs != null && obs.length >= condition.getCount());
						out.println("转换总数：" + total + "<br/>");
					} 
					if ((type & 2) == 2) {
						// 修改表结构
						for (String field : list) {
							StringBuilder sql = new StringBuilder();
							sql.append("ALTER TABLE `").append(table.getName()).append("` CHANGE COLUMN `").append(field).append("` `").append(field).append("` BIGINT(20) NOT NULL DEFAULT 0;");
							out.print("SQL: " + sql.toString());
							boolean flag = host.getSQLExecuter().execute(table, sql.toString());
							if (flag)
								out.print("<font color='green'>成功!</font>");
							else
								out.print("<font color='red'>失败!</font>");
							out.println("<br/>");
						}
					}
				} else {
					out.println("不存在MONEY字段!【" + objectName + "】<br/>");
				}
			} else {
				out.println("表不存在!【" + objectName + "】<br/>");
			}
		} else {
			out.println("对象不存在!【" + objectName + "】<br/>");
		}
	}
%>
			</div><!-- end .padd -->
          </div><!-- end .widget-content -->
        </div>  <!-- end. widget worange -->
        
        <div class="col-lg-12" align="center">
          <span id="timer-msg" style="text-align:center"></span>
        </div>
      </div> <!--end .col-md-12 -->
    </div><!--end .row -->
  </div><!--end .containe -->
</div><!--end .admin-form -->
    <!-- InstanceEndEditable -->
</main>

<!-- Footer Starts -->
<footer>
	<div class="container">
		<!-- Footer Content -->
		<p class="pull-left">
			Copyright &copy; 2016 - <a href="http://www.tekinfo.net"><img src="../../logo/tekinfo-white-128.png" height="22" title="tekinfo" longdesc="http://www.tekinfo.net"/></a>&nbsp;|&nbsp;
			
			<!-- 友盟统计：hdw.top-->
			<script type="text/javascript">
				var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
				document.write(unescape("%3Cspan id='cnzz_stat_icon_1260062528'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s95.cnzz.com/z_stat.php%3Fid%3D1260062528%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E"));
			</script>
		</p>
		<ul class="list-inline pull-right">
			<!-- List -->
			<li><a href="hongde-help.html" target="_blank">帮助</a></li>
		</ul>
		
		<div class="clearfix"></div>
	</div>
</footer>
<!-- Footer Ends -->
            
<form id="call_form" name="call_form" method="post" accept-charset="UTF-8" style="display:none"></form>

<!-- Scroll to top -->
<span class="totop"><a href="#"><i class="fa fa-angle-up bg-color"></i></a></span>

<!-- 等待图层 -->
<div class="modal fade" id="waiting-modal-dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="center" id="waiting-modal-dialog-title">&nbsp;</h3>
      </div>
      <div class="modal-body center">
        <p style="margin-bottom: 8px;" id="waiting-modal-dialog-body"></p>
        <div id="waiting-modal-dialog-timer"></div>
      </div>
    </div>
  </div><!-- end .modal-dialog-->
</div><!-- end .modal-->

<!-- Login Modal starts -->
<div id="login" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button id="closeLogin" type="button" class="close" data-dismiss="modal" aria-hidden="true"  onclick="javascript:clickCheckUser();">×</button>
      <h3>&nbsp;</h3>
      </div>
      <div id="show_div" class="modal-body">
        <iframe id="show_frame" name="show_name" src="" allowtransparency="true" width="100%" height="100%" scrolling="auto" frameborder="0" ></iframe>
      </div>
    </div>
  </div><!-- end .modal-dialog-->
</div>
<!-- Login modal ends -->

<!-- 提示信息代码 -->
<div id="message-modal-dialog" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button id="closeLogin1" type="button" class="close" data-dismiss="modal" aria-hidden="true"  onclick="javascript:;">×</button>
        <h3 id="message-modal-dialog-title">提示信息:</h3>
      </div>
      <div class="modal-body">
        <div id="message"></div>
      </div>
    </div>
  </div><!-- end .modal-dialog-->
</div><!-- end message-modal-dialog-->

<!-- Bootstrap JS -->
<script src="../../../style/brave/js/bootstrap.js"></script>
<!-- Placeholders JS -->
<script src="../../../style/brave/js/placeholders.js"></script>
<!-- Magnific Popup -->
<script src="../../../style/brave/js/jquery.magnific-popup.min.js"></script>
<!-- Owl carousel -->
<script src="../../../style/brave/js/owl.carousel.min.js"></script>
<!-- Respond JS for IE8 -->
<script src="../../../style/brave/js/respond.min.js"></script>
<!-- HTML5 Support for IE -->
<script src="../../../style/brave/js/html5shiv.js"></script>
<!-- Main JS -->
<script src="../../../style/brave/js/main.js"></script>
<!-- Custom JS. Type your JS code in custom.js file -->
<script src="../../../style/brave/js/custom.js"></script>


<script type="text/javascript">
function initial() {
	tek.core.getURLRequest();
	
	tek.common.getUser();
	/*
	if (tek.common.isLoggedIn()) {
		if (tek.user.isNormalUser(mySecurity)) {
			showUserInfo();
		} else {
			goBack();
		}
	} else {
		tek.macCommon.waitDialogShow("<font color='red'>请先登录</font>", "正在跳转登录页面...", null, 0);
		tek.macCommon.waitDialogHide(1500, 'goLogin()');
	}
	*/
	if (typeof init == "function")
		init();
	
	var error = request["error"];
	if (error && error.length > 0)
		showError(tek.dataUtility.stringToHTML(decodeURIComponent(error)));
	
	var message = request["message"];
	if (message && message.length > 0)
		showMessage(tek.dataUtility.stringToHTML(decodeURIComponent(message)));
	
	
	<!-- 百度统计代码 hdw.top -->
	var _hmt = _hmt || [];
	(function () {
		var hm = document.createElement("script");
		hm.src = "//hm.baidu.com/hm.js?9591e9948bc859b87d2d503643188da7";
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(hm, s);
	})();
}
</script>

<!-- InstanceBeginEditable name="MyJavascript" -->
<!-- 自定义Javascript -->
<script type="text/javascript" language="javascript">
  function init(){
  }

  /**
   * 转换
   */
  function transfer() {
	var flag = window.confirm("是否转换?");
    if (!flag)
      return ;
	
	var waiting=document.getElementById("waiting");
    if(waiting)
	  waiting.style.display="";

	var form = document.getElementById("transferForm");
	if (form != null) {
	  form.submit();
	  var button = document.getElementById("transferButton");
	  if (button != null)
	    button.disabled="disabled";
	}
  }
</script>
<!-- InstanceEndEditable --> 

</body>
<!-- InstanceEnd --></html>