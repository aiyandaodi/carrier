<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
转数Document Blob为UTF-8编码
-->

<html xmlns="http://www.w3.org/1999/xhtml"><!-- InstanceBegin template="/Templates/mac-admin-readbook-info.dwt" codeOutsideHTMLIsLocked="false" -->
<head>
  <meta name="robots" content="noindex"/>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta http-equiv="content-language" contect = "zh_CN"/>

  <!-- InstanceBeginEditable name="doctitle" -->
  <!-- Title and other stuffs -->
  <title>文档转换为UTF-8格式</title>
  <!-- InstanceEndEditable -->
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
 
  <meta name="keywords" content="读书 网络 社交 图片 相册 影像 文学 办公 协同 开源 求知 旅行 精品 支付 认证 慢生活 浪漫 优雅 探索 不平则鸣 readbook network Social photo video art office automation joint alliance Communication Authenticate Payment Discovery Curiosity Where　there　is　injustice；there　will　be　an　outcry"/>
  <meta name="description" content="读书 网络 社交 图片 相册 影像 文学 办公 协同 开源 求知 旅行 精品 支付 认证 慢生活 浪漫 优雅 探索 解惑 不平则鸣 readbook network Social photo video art office automation joint alliance Communication Authenticate Payment Discovery Curiosity Where　there　is　injustice；there　will　be　an　outcry"/>
  <meta name="author" content="Tekinfo[http://www.tekinfo.net]"/>

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
  
  <link rel="stylesheet" href="../../../style/macadmin/css/tekinfo-custom.css"/>

  <link rel="stylesheet" href="../../../common/readbook/readbook.css"/>

  <!-- InstanceBeginEditable name="MyCSS" -->

  <!-- InstanceEndEditable -->

  <!-- Favicon -->
  <link rel="Shortcut Icon" href="../../../../favicon.ico"/>
  <link rel="Bookmark" href="../../../../favicon.ico"/>

  <script type="text/javascript" src="../../../common/jquery/2.1.4/jquery.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/dataUtility.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/common.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
  <script type="text/javascript" src="../../../common/js/normal.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/serverTimer.js"></script>
  
  <script type="text/javascript" src="../../../common/readbook/readbook.js"></script>

  <!-- InstanceBeginEditable name="HeadScript" -->

  <!-- InstanceEndEditable -->

  <script type="text/javascript">
    $(document).ready(function() {
	  initial();
    });
  </script>
</head>

<body>
<!-- InstanceBeginEditable name="Body Top" -->
<%@ include file="../../../config.jsp" %>

<%@ page import="com.takall.remoting.subject.DocumentTransferRm" %>

<%@ page import="java.util.Map.Entry" %>
<%@ page import="java.util.Iterator" %>

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.remoting.Result" %>
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
      <a href="../../../../" class="navbar-brand hidden-lg"><img src="../../../images/logo-blue/readbook-128.png" height="28" alt="READBOOK" longdesc="http://www.readbook.com" style="margin-top:-10px"></a>
    </div><!-- end .navbar-header -->
    
    <!-- Navigation starts -->
    <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">
      <!-- InstanceBeginEditable name="MainMenu" -->
   
      <!-- InstanceEndEditable -->
      
      <!-- Links -->
      <ul class="nav navbar-nav pull-right">
        <li id="label_register" class="pull-right">
          <a href="javascript:register();">
            <i class="fa fa-info"></i>
            <span id="user-register">注册</span>
          </a>
        </li>
        
        <li id="label_login" class="pull-right">
          <a href="javascript:login();">
            <i class="fa fa-sign-in"></i>
            <span id="user-login">登录</span>
          </a>
        </li>
        
        <li id="label_user" class="dropdown pull-right" style="display:none;">
          <a data-toggle="dropdown" class="dropdown-toggle" href="#">
            <i class="fa fa-user"></i>
            <span id="user-name">用户名</span>
            <b class="caret"></b>
          </a>
          
          <!-- Dropdown menu -->
          <ul class="dropdown-menu">
            <li id="user_account">
              <a href="javascript:myUser();">
                <i class="fa fa-user-secret"></i>
                <span>我的账户</span>
              </a>
            </li>
            <li id="user_profile">
              <a href="javascript:logout();">
                <i class="fa fa-sign-out"></i>
                <span>退出系统</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div><!-- end.conjtainer -->
</div>

<!--<div class="content">-->
<!-- InstanceBeginEditable name="MAINCONTENT" -->
<!-- Form area -->
<div class="admin-form">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <!-- .widget worange starts -->
        <div class="widget worange" id="login_div">
          <!-- Widget head -->
          <div class="widget-head">
            <i class="icon-lock"></i> BLOB数据编码转换为UTF-8
          </div><!-- end .widget-head -->

          <div class="widget-content">
            <div class="padd">
<%
	if (!isLogin || (my.getSecurity() < User.USER_ADMIN)) {
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

	boolean transfer = DataUtility.StringToBoolean(parameters.getParameter("transfer"));
	if (transfer) {
		DocumentTransferRm remoting = new DocumentTransferRm();
		Result result = remoting.transferBlob(token.getTokenCode(), clientIp, parameters.getParameters());
		if (result != null) {
			out.println("转换完成!<br/>");
			out.println(DataUtility.StringToHtml(result.getMessage()));
		} else
			out.println("转换错误!<br/>");
	}
%>
    <form action="" id="transferForm" name="transferForm" method="post">
      <input type="hidden" name="transfer" value="1"/>
      <div id="waiting" class="center" style="display:none;">正在转换...</div>
      <div class="center">
        <input id="transferButton" name="transferButton" type="button" onclick="transferBlob()" value="开始转换"/>
      </div>
    </form>
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

<!-- Matter -->
<div class="matter">
  <div class="container">
    <!-- 显示操作信息 -->
    <div class="row">
      <div class="col-md-12">
        <div class="widget">
          <div class="widget-head">
            <div class="pull-left">系统信息</div>
            <!-- InstanceBeginEditable name="InfoMenu" -->
                  <!-- InfoMenu -->
				  <!-- InstanceEndEditable -->
            <div class="widget-icons pull-right">
            </div>  
            <div class="clearfix"></div>
          </div><!--end .widget-head-->
          
          <div class="widget-content" style="margin:5px 10px;">
            <div class="row">
              <div class="col-xs-12 col-sm-2 col-md-1">
                <img src="../../../images/clock-64.png" width="48" alt="时间" />
              </div>
            
              <div class="col-xs-12 col-sm-5 col-md-5">
                <div class="row">
                  <div class="col-xs-4 col-sm-5 col-lg-3 text-right">服务器时间:</div>
                  <div id="serverTime" class="col-xs-8 col-sm-7 col-lg-9 text-left"></div>
                </div>
            
                <div class="row">
                  <div class="col-xs-4 col-sm-5 col-lg-3 text-right">客户端时间:</div>
                  <div id="clientTime" class="col-xs-8 col-sm-7 col-lg-9 text-left"></div>
                </div>
              </div><!--end .col-md-6-->
          
              <div class="col-xs-12 col-sm-5 col-md-5">
                <div class="row">
                  <div class="col-xs-4 col-sm-5 col-lg-3 text-right">建议和意见:</div>
                  <div class="col-xs-8 col-sm-7 col-lg-9 text-left"><a style="word-wrap:break-word;" href="mailto:editor@readbook.com">editor@readbook.com</a></div>
                </div>
            
                <div class="row">
                  <div class="col-xs-4 col-sm-5 col-lg-3 text-right">技术和支持:</div>
                  <div class="col-xs-8 col-sm-7 col-lg-9 text-left"><a style="word-wrap:break-word;" href="mailto:editor@readbook.com">support@readbook.com</a></div>
                </div>
              </div><!--end .col-md-6-->
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
<!--</div> end .content -->

<!-- Footer starts -->
<footer>
  <div class="container">
    <div class="row">
      <div class="col-left col-md-6">
        <!-- Copyright info -->
        <p class="copy" style="margin-top:4px;">
          Copyright &copy; 2000-forever <a href="http://www.readbook.com">READBOOK.COM</a> | 
          京ICP备05051218号 |
          
          <script type="text/javascript">
		    var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
			document.write(unescape("%3Cspan id='cnzz_stat_icon_2447799'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s6.cnzz.com/stat.php%3Fid%3D2447799%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E"));
          </script> |
          <!-- 百度 统计代码 -->
<script type="text/javascript">
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fbdc498404707ddef5aca424933f984d9' type='text/javascript'%3E%3C/script%3E"));
</script>
        </p>
      </div>
      
      <div class="col-right col-md-6">
        <p class="pull-right">Powered by <a href="http://www.tekinfo.net" title="tekinfo" target="_blank"><img src="../../../logo.tekinfo/tekinfo-tradmark-128.png" height="26" alt="tekinfo"/></a>
            ｜ Supported by <a href="http://www.takall.com" title="TAKALL" target="_blank"><img src="../../../logo.takall/takall-128.png" height="18" alt="TAKALL"/></a></p>
      </div>
      
    </div>
  </div>
</footer>
<!-- Footer ends -->

<form id="call_form" name="call_form" method="post" accept-charset="UTF-8" style="display:none"></form>

<!-- Scroll to top -->
<span class="favorite" onclick="tek.common.addFavorite('Readbook', tek.common.getRootPath());" onmouseover="javascript:$('.favorite').show();" onmouseout="javascript:$('.favorite').hide();">
  <img src="../../../readbook/readbook.com/images/readbook-qrcode-128.png" width="128" height="128" alt="READBOOK.COM" longdesc="http://www.readbook.com" />
</span>
<span class="toshare" onclick="javascript:$('#share-modal-dialog').modal('show',null,0);" onmouseover="showQrCode();" onmouseout="javascript:$('.favorite').hide();">
  <a href="javascript:;"><i class="fa fa-share"></i></a>
</span>
<span class="totop">
  <a href="javascript:;"><i class="fa fa-chevron-up"></i></a>
</span>

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
  </div><!-- end .modal-dialog -->
</div>

<!-- 分享代码 -->
<div id="share-modal-dialog" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button id="closeLogin1" type="button" class="close" data-dismiss="modal" aria-hidden="true"  onclick="javascript:;">×</button>
        <h3 id="share-modal-dialog-title" class="">一键分享到其他站点：</h3>
      </div>
      <div id="share-modal-dialog-body" class="modal-body">
        <div class="subject-share" id="subject-share">
          <!-- JiaThis Button BEGIN -->
          <label class="col-lg-2" style="width:auto; padding-top:8px;">分享到：</label>
          <div class="col-lg-10">
            <div class="jiathis_style_32x32">
              <a class="jiathis_button_qzone"></a>
              <a class="jiathis_button_tsina"></a>
              <a class="jiathis_button_tqq"></a>
              <a class="jiathis_button_weixin"></a>
              <a class="jiathis_button_renren"></a>
              <a href="http://www.jiathis.com/share" class="jiathis jiathis_txt jtico jtico_jiathis" target="_blank"></a>
              <a class="jiathis_counter_style"></a>
            </div>
          </div>
          <div class="clearfix"></div>
          <script type="text/javascript" src="http://v3.jiathis.com/code/jia.js?uid=1401863530169688" charset="utf-8"></script>
        </div><!--end.subject-share -->
        <div class="clearfix"></div>
        <!-- JiaThis Button END -->
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
var jiathis_config;
$("#share-modal-dialog").on("shown.bs.modal", function () {
	jiathis_config = {
		summary:document.title,
		title:document.title,
		url:window.location.href
	};
});

function showMessage(msg){
	var obj = document.getElementById("message");
	if(obj){
	  obj.insertAdjacentHTML('BeforeEnd', "<p>"+msg+"</p>");
	  obj.focus();
	}
	else
	  alert(msg);
}

function showError(msg){
	var obj = document.getElementById("message");
	if(obj){
	  obj.insertAdjacentHTML('BeforeEnd', "<p style='color:red'>"+msg+"</p>");
	  obj.focus();
	}
	else
	  alert(msg);
}

function initial(){
	getUser();
	getRequest();
	
	showUser();
	
	if(myId && myId > 0){
		var obj = document.getElementById("user_name");
		if(obj){
			obj.innerHTML=myName+"@"+myLoginIp;
		}
		var obj = document.getElementById("user_account");
		if(obj){
			obj.innerHTML="<a href='javascript:myUser();'>我的账户</a>";
		}
		var obj = document.getElementById("user_profile");
		if(obj){
			obj.innerHTML="<a href='javascript:logout();'>退出系统</a>";
		}
	}

	showServerTime();

	if(typeof (init)== "function"){
		init();
	}
}

/**
 * callUrl -- 调用该页面
 * callBackUrl -- 执行完成后返回的页面
 * callBackParams -- 返回页面后的参数
 *
 **/
function callPage(callUrl,callBackUrl,callBackParams) {
	var form = document.getElementById("call_form");//

	if (form == null || callUrl==null){
		showError("程序有错误，请和管理员联系！");

	}else{
		form.innerHTML="";
		form.action = decodeURIComponent(callUrl);
		form.target="_self";
		form.method="get";
		if(isIE())
			document.charset="UTF-8";
			
		if(callBackUrl && callBackUrl!="undefined" && callBackUrl!="null" ){
			var callbackURL = document.createElement("input");
			callbackURL.id = "callback-url";
			callbackURL.name = "callback-url";
			callbackURL.type = "hidden";
			callbackURL.value = callBackUrl;
			
			form.appendChild(callbackURL);
			
			if(callBackParams && callBackParams.length>1){
				var callbackParams = document.createElement("input");
				callbackParams.id = "callback-params";
				callbackParams.name = "callback-params";
				callbackParams.type = "text";
				callbackParams.value = callBackParams;
				form.appendChild(callbackParams);
			} //end if(callBackParams && callBackParams.length>1)
		} //end if(callbackURL && callbackURL!="undefined" && callbackURL!="null" )
		
		form.submit();
      }
}

$(function () {
    /* Bar Chart starts */
    var d1 = [];
    for (var i = 0; i <= 20; i += 1)
        d1.push([i, parseInt(Math.random() * 30)]);

    var d2 = [];
    for (var i = 0; i <= 20; i += 1)
        d2.push([i, parseInt(Math.random() * 30)]);


    var stack = 0, bars = true, lines = false, steps = false;
    
    function plotWithOptions() {
		if (typeof($.plot)=="function") {
			$.plot($("#bar-chart"), [ d1, d2 ], {
				series: {
					stack: stack,
					lines: { show: lines, fill: true, steps: steps },
					bars: { show: bars, barWidth: 0.8 }
				},
				grid: {
					borderWidth: 0, hoverable: true, color: "#777"
				},
				colors: ["#ff6c24", "#ff2424"],
				bars: {
					  show: true,
					  lineWidth: 0,
					  fill: true,
					  fillColor: { colors: [ { opacity: 0.9 }, { opacity: 0.8 } ] }
				}
			});
		}
    }

    plotWithOptions();
    
    $(".stackControls input").click(function (e) {
        e.preventDefault();
        stack = $(this).val() == "With stacking" ? true : null;
        plotWithOptions();
    });
    $(".graphControls input").click(function (e) {
        e.preventDefault();
        bars = $(this).val().indexOf("Bars") != -1;
        lines = $(this).val().indexOf("Lines") != -1;
        steps = $(this).val().indexOf("steps") != -1;
        plotWithOptions();
    });

    /* Bar chart ends */
});

/* Curve chart starts */
$(function () {
    var sin = [], cos = [];
    for (var i = 0; i < 14; i += 0.5) {
        sin.push([i, Math.sin(i)]);
        cos.push([i, Math.cos(i)]);
    }

	var plot;
	if (typeof($.plot)=="function") {
 		plot = $.plot($("#curve-chart"),
           [ { data: sin, label: "sin(x)"}, { data: cos, label: "cos(x)" } ], {
               series: {
                   lines: { show: true, fill: true},
                   points: { show: true }
               },
               grid: { hoverable: true, clickable: true, borderWidth:0 },
               yaxis: { min: -1.2, max: 1.2 },
               colors: ["#1eafed", "#1eafed"]
             });
	}
	
    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #000',
            padding: '2px 8px',
            color: '#ccc',
            'background-color': '#000',
            opacity: 0.9
        }).appendTo("body").fadeIn(200);
    }

    var previousPoint = null;
    $("#curve-chart").bind("plothover", function (event, pos, item) {
        $("#x").text(pos.x.toFixed(2));
        $("#y").text(pos.y.toFixed(2));

        if ($("#enableTooltip:checked").length > 0) {
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    
                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                    
                    showTooltip(item.pageX, item.pageY, 
                                item.series.label + " of " + x + " = " + y);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;            
            }
        }
    }); 

    $("#curve-chart").bind("plotclick", function (event, pos, item) {
        if (item) {
            $("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
			if (plot)
	            plot.highlight(item.series, item.datapoint);
        }
    });
});
/* Curve chart ends */
</script>

<!-- InstanceBeginEditable name="MyJavascript" -->
<script type="text/javascript" language="javascript">
  function init(){
  }

  /**
   * 转换Blob
   */
  function transferBlob() {
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

<!-- Google 统计代码 -->
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-18589860-1']);
  _gaq.push(['_setDomainName', 'readbook.com']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>

</body>
<!-- InstanceEnd --></html>