<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@ page contentType="text/html; charset=utf-8"%>
<!--
创建数据库表
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="robots" content="noindex"/>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta http-equiv="content-language" contect = "zh_CN"/>

  <title>生成数据库表</title>
  
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
  


  <!-- Favicon -->
  <link rel="Shortcut Icon" href="../../../../favicon.ico"/>
  <link rel="Bookmark" href="../../../../favicon.ico"/>

  <script type="text/javascript" src="../../../common/jquery/2.1.4/jquery.min.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/dataUtility.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/common.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/core.js"></script>
  <script type="text/javascript" src="../../../common/tek/js/mac-common.js"></script>

  <script type="text/javascript">
    $(document).ready(function() {
        initial();
    });
  </script>
</head>

<body>
<%@ include file="../../../config.jsp" %>

<%@ page import="java.util.Map.Entry" %>
<%@ page import="java.util.Iterator" %>

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.remoting.DatabaseRemoting" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.system.Credentials" %>
<%@ page import="net.tekinfo.system.Host" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

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
  </div><!-- end.conjtainer -->
</div>

<!--<div class="content">-->
<!-- Form area -->
<div class="admin-form">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <!-- .widget worange starts -->
        <div class="widget worange" id="login_div" >
          <!-- Widget head -->
          <div class="widget-head" >
            <i class="icon-lock"></i> 创建数据库中的表 
          </div><!-- end .widget-head -->
          <div class="widget-content">
            <div class="padd">
<%
	if (!isLogin) {
		// 没有权限
		out.println("没有权限!");
		return ;
	}
	
	//Host host = hostManager.getHost(token.getTokenCode(), DataUtility.IpToLong(clientIp), null);
	if (host == null || !host.isAlive()) {
		// 没有权限
		out.println("没有权限!");
		return ;		
	}
	
	Credentials credentials = host.getCredentials();
	if (credentials == null) {
		// 没有权限
		out.println("没有权限!");
		return ;		
	}
	
	User user = credentials.getUser();
	if (user == null || !user.isSupervisor(host)) {
		// 没有权限
		out.println("没有权限!");
		return ;		
	}
	
	DatabaseRemoting dr = new DatabaseRemoting();
	Result stringResult = dr.getTableNames(token.getTokenCode(), clientIp);
	if (stringResult != null) {
		if (stringResult.getCode() == Result.RESULT_OK) {
			String[] tableNames = DataUtility.StringToArray(stringResult.getValue(), ",");
			if (tableNames != null && tableNames.length > 0) {
				// 创建表
				Result intResult = dr.createTables(token.getTokenCode(), clientIp, tableNames);
				if (intResult != null) {
					if (intResult.getCode() == Result.RESULT_OK)
						out.println("建表成功!<br/>");
					else
						out.println("建表失败!<br/>");
					String msg = intResult.getMessage();
					if (msg != null) {
						msg = msg.replaceAll("\r\n", "<br/>");
						out.println(msg);
					}
				} else
					out.println("创建表失败!<br/>");
			} else {
				out.println("未取到表名称!<br/>");
			} // end if (tableNames != null && tableNames.length > 0) else
		} else {
			out.println("取得表名称失败!<br/>");
			String msg = stringResult.getMessage();
			if (msg != null) {
				msg = msg.replaceAll("\r\n", "<br/>");
				out.println(msg);
			}
		} // end if (stringResult.getCode() == Result.RESULT_OK) else 
	} else
		out.println("取得表名称失败！<br/>");

	String callbackURL = HttpUtility.GetParameter(request, "callbackURL");                   //返回地址
	if (callbackURL == null || callbackURL.isEmpty())
		callbackURL = "index.jsp";
	String callbackParams = HttpUtility.GetParameter(request, "callbackParams");             //返回参数
%>
              <form action="<%= callbackURL %>" id="callback" name="callback" method="post" style="display:none">
<%
	StringHash p = DataUtility.StringToInfo(callbackParams, "&");
	if (p != null) {
		Iterator<Entry<String, String>> iterator = p.entrySet().iterator();
		if (iterator != null) {
			while (iterator.hasNext()) {
				Entry<String, String> entry = iterator.next();
%>
                <input type="hidden" id="<%= entry.getKey() %>" name="<%= entry.getKey() %>" value="<%= entry.getValue() %>"/>
<%
			}
		} // end if (iterator != null)
	} // end if (p != null)
%>
              </form>
			</div><!-- end .padd -->
          </div><!-- end .widget-content -->
        </div>  <!-- end. widget worange -->
        <div class="col-lg-12" align="center"  >
          <span id="timer-msg"  style="text-align:center" ></span>
        </div>
      </div> <!--end .col-md-12 -->
    </div><!--end .row -->
  </div><!--end .containe -->
</div><!--end .admin-form -->

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
              <div class="col-xs-12 col-sm-2 col-md-1">
                <img src="../../../images/clock-64.png" width="48" alt="时间" />
              </div>
            
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
        </p>
      </div>
      
      <div class="col-right col-md-6">
        <p class="pull-right">Powered by <a href="http://www.tekinfo.net" title="tekinfo" target="_blank"><img src="../../../tekinfo/logo/tekinfo-color-tradmark-128.png" height="26" alt="tekinfo"/></a>
            ｜ Supported by <a href="http://www.takall.com" title="TAKALL" target="_blank"><img src="../../../takall/logo/takall-128.png" height="18" alt="TAKALL"/></a></p>
      </div>
      
    </div>
  </div>
</footer>
<!-- Footer ends -->

<form id="call_form" name="call_form" method="post" accept-charset="UTF-8" style="display:none"></form>

<!-- Scroll to top -->
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
  tek.core.getURLRequest();
  tek.common.getUser();
  
  if(typeof (init)== "function")
    init();
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

<script type="text/javascript" language="javascript">
function init(){
	document.title="创建数据库表";
	showMessage("创建数据库表...");	
	showMessage("<a href='javascript:tek.core.goPage();'>返回管理界面</a>");
}
</script>
</body>
</html>