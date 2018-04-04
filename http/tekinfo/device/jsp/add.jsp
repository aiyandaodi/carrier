<!-- 
内容：新建端口设备输入页面
参数：callback-url - 回调地址
     callback-params - 回调参数
     show-close - 是否显示"关闭"菜单项
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="../../../common/tek/css/add.css" rel="stylesheet" type="text/css" media="screen" />
<script type="text/javascript" src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>
<script type="text/javascript" src="../../../common/js/normal.js"></script>
<script type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
<script>
  $(document).ready(function() {
    checkMenu();
  });
</script>
<title>Device 端口设备 - 新建</title>
</head>

<body>
  <div id="main">
<%@ include file="../../../config.jsp" %>
 
<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.remoting.Field" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.resource.DeviceRm" %>
<%@ page import="net.tekinfo.resource.Device" %>

<%@ page import="java.util.Hashtable" %>

<%
	Parameters parameters = new Parameters(token.getTokenCode(), clientIp, request);
	
	String callbackURL = parameters.getParameter(KEY_CALLBACK_URL);           //返回地址
	String callbackParams = parameters.getParameter(KEY_CALLBACK_PARAMS);     //返回参数

	DeviceRm remoting = new DeviceRm();
	ObjectResult result = remoting.getNew(token.getTokenCode(), clientIp, parameters.getParameters());

	if (result == null) {
		out.println("<div class='msg'>操作失败!</div>");
		return;
	}

	ObjectPrint objectPrint = new ObjectPrint();
%>

  <!-- 菜单 -->
  <ul id="menu">
    <div class="title">新建端口设备</div>
    <div class="menu1">
<%
	if (callbackURL != null && !callbackURL.isEmpty() && !callbackURL.equals("null")) {
		out.println(objectPrint.printCallbackForm(callbackURL, callbackParams, charset));
		out.println(new StringBuilder("<li class='menuout' onMouseOver='this.className=\"menuover\"' onMouseOut='this.className=\"menuout\"' onclick=\"submitWithWaiting('callback', '").append(charset).append("');\"><a href='#'>返回</a></li>"));
	} else {
		boolean showclose = DataUtility.StringToBoolean(parameters.getParameter(KEY_SHOW_CLOSE));
		if (showclose)
			out.println("<li class='menuout' onMouseOver='this.className=\"menuover\"' onMouseOut='this.className=\"menuout\"' onclick=\"javascript:window.close();\"><a href='#'>关闭</a></li>");
	}
%>
    <!-- end .menu1 -->
    </div>
  <!-- end .menu -->
  </ul>

<%
	if (result.getCode() != Result.RESULT_OK) {
		// 操作错误
		String msg = result.getMessage();
		if (msg != null && !msg.isEmpty()) {
			msg = HttpUtility.StringToHTML(msg);
			out.println(new StringBuilder("<div class='msg'>").append(msg).append("</div>"));
		}

	} else {
		Record[] records = result.getRecords();
		if (records != null && records.length > 0 && records[0] != null) {
%>

  <!-- 输入框 -->
  <div id="info">
    <form action="addCheck.jsp" id="addForm" name="addForm" method="post" accept-charset="<%= charset %>">
<%
			// 字段
			Field [] fields = records[0].getFields();
			if (fields != null && fields.length > 0) {
				HttpUtility.SetValues(parameters, fields);

				Hashtable<String, Field> fieldHash = new Hashtable<String, Field>();
				for (Field f : fields) {
					if (f != null && f.getName() != null)
						fieldHash.put(f.getName(), f);
				}
				
				// 名称
				String nameValue = null;
				Field nameField = fieldHash.get(Device.FIELD_NAME);
				if (nameField != null) {
					out.println("<ul id='name' class='field'>");
					String name = nameField.getName();
					nameValue = parameters.getParameter(name);
					if (nameValue == null || nameValue.equals("null"))
						nameValue = nameField.getShow();
					out.println("<li class='title'>" + nameField.getDisplay() + ":</li>");
					out.print("<li class='value'>");
					out.print("<input type='text' id='" + name + "' name='" + name + "' style='text-align:right'");
					if (nameValue != null)
						out.print(" value='" + nameValue + "'");
					out.println("/>");
					out.println("</li>");
					out.println("</ul>");
				}
			
				// 端口类型
				String typeValue = null;
				Field typeField = fieldHash.get(Device.FIELD_TYPE);
				if (typeField != null) {
					out.println("<ul id='type' class='field'>");
					String name = typeField.getName();
					typeValue = parameters.getParameter(name);
					if (typeValue == null || typeValue.equals("null"))
						typeValue = typeField.getValue();
					out.println("<li class='title'>" + typeField.getDisplay() + ":</li>");
					out.println("<li class='value'>");
					out.println("<select id='" + name + "' name='" + name + "' onchange=\"typeChange(this)\">");
					String[] selects = typeField.getSelects();
					String[] shows = typeField.getShows();
					if (selects != null && shows != null && selects.length == shows.length) {
						for (int i = 0; i < selects.length; i++) {
							out.print("<option value='" + selects[i] + "'");
							if (typeValue != null && typeValue.equals(selects[i]))
								out.print(" selected='selected'");
							out.println(">" + shows[i] + "</option>");
						}
					} // end if (selects != null && shows != null && selects.length == shows.length)
					out.println("</select>");
					out.println("</li>");
					out.println("</ul>");
				} // end if (typeField != null)
			
				// IP地址
				String ipValue = null;
				Field ipField = fieldHash.get(Device.FIELD_IP);
				if (ipField != null) {
					out.print("<ul id='ip' class='field'");
					if (typeValue != null && (DataUtility.StringToInt(typeValue) == Device.TYPE_TCP))
						out.print(" style='display:block'");
					else
						out.print(" style='display:none'");
					out.println(">");
					String name = ipField.getName();
					ipValue = parameters.getParameter(name);
					if (ipValue == null || ipValue.equals("null"))
						ipValue = ipField.getShow();
					out.println("<li class='title'>" + ipField.getDisplay() + ":</li>");
					out.print("<li class='value'>");
					out.print("<input type='text' id='" + name + "' name='" + name + "' style='text-align:right'");
					if (ipValue != null)
						out.print(" value='" + ipValue + "'");
					out.println("/>");
					out.println("</li>");
					out.println("</ul>");
				}
		
				// 端口号
				String portValue = null;
				Field portField = fieldHash.get(Device.FIELD_PORT);
				if (portField != null) {
					out.println("<ul id='port' class='field'>");
					String name = portField.getName();
					portValue = parameters.getParameter(name);
					if (portValue == null || portValue.equals("null"))
						portValue = portField.getShow();
					out.println("<li class='title'>" + portField.getDisplay() + ":</li>");
					out.println("<li class='value'>");
					out.print("<input type='text' id='" + name + "' name='" + name + "' style='text-align:right'");
					if (portValue != null)
						out.print(" value='" + portValue + "'");
					out.println("/>");
					out.println("</li>");
					out.println("</ul>");
				}
				
				// 每秒位数
				String baudrateValue = null;
				Field baudreateField = fieldHash.get(Device.FIELD_BAUDRATE);
				if (baudreateField != null) {
					out.println("<ul id='baudrate' class='field'");
					if (DataUtility.StringToInt(typeValue) == Device.TYPE_COM)
						out.print(" style='display:block'");
					else
						out.print(" style='display:none'");
					out.println(">");
					String name = baudreateField.getName();
					baudrateValue = parameters.getParameter(name);
					if (baudrateValue == null || baudrateValue.equals("null"))
						baudrateValue = baudreateField.getValue();
					out.println("<li class='title'>" + baudreateField.getDisplay() + ":</li>");
					out.println("<li class='value'>");
					out.println("<select id='" + name + "' name='" + name + "'>");
					String[] selects = baudreateField.getSelects();
					String[] shows = baudreateField.getShows();
					if (selects != null && shows != null && selects.length == shows.length) {
						for (int i = 0; i < selects.length; i++) {
							out.print("<option value='" + selects[i] + "'");
							if (baudrateValue != null && baudrateValue.equals(selects[i]))
								out.print(" selected='selected'");
							out.println(">" + shows[i] + "</option>");
						}
					} // end if (selects != null && shows != null && selects.length == shows.length)
					out.println("</select>");
					out.println("</li>");
					out.println("</ul>");
				} // end if (baudreateField != null)
			
				// 数据位
				String databitsValue = null;
				Field databitsField = fieldHash.get(Device.FIELD_DATABITS);
				if (databitsField != null) {
					out.print("<ul id='databits' class='field'");
					if (DataUtility.StringToInt(typeValue) == Device.TYPE_COM)
						out.print(" style='display:block'");
					else
						out.print(" style='display:none'");
					out.println(">");
					String name = databitsField.getName();
					databitsValue = parameters.getParameter(name);
					if (databitsValue == null || databitsValue.equals("null"))
						databitsValue = databitsField.getValue();
					out.println("<li class='title'>" + databitsField.getDisplay() + "</li>");
					out.println("<li class='value'>");
					out.print("<select id='" + name + "' name='" + name + "'>");
					String[] selects = databitsField.getSelects();
					String[] shows = databitsField.getShows();
					if (selects != null && shows != null && selects.length == shows.length) {
						for (int i = 0; i < selects.length; i++) {
							out.print("<option value='" + selects[i] + "'");
							if (databitsValue != null && databitsValue.equals(selects[i]))
								out.print(" selected='selected'");
							out.println(">" + shows[i] + "</option>");
						}
					} // end if (selects != null && shows != null && selects.length == shows.length)
					out.println("</select>");
					out.println("</li>");
					out.println("</ul>");
				} // end if (databitsField != null)
		
				// 流控制
				String flowControlValue = null;
				Field flowcontrolField = fieldHash.get(Device.FIELD_FLOWCONTROL);
				if (flowcontrolField != null) {
					out.print("<ul id='flowcontrol' class='field'");
					if (DataUtility.StringToInt(typeValue) == Device.TYPE_COM)
						out.print(" style='display:block'");
					else
						out.print(" style='display:none'");
					out.println(">");
					String name = flowcontrolField.getName();
					flowControlValue = parameters.getParameter(name);
					if (flowControlValue == null || flowControlValue.equals("null"))
						flowControlValue = flowcontrolField.getValue();
					out.println("<li class='title'>" + flowcontrolField.getDisplay() + "</li>");
					out.println("<li class='value'>");
					out.print("<select id='" + name + "' name='" + name + "'>");
					String[] selects = flowcontrolField.getSelects();
					String[] shows = flowcontrolField.getShows();
					if (selects != null && shows != null && selects.length == shows.length) {
						for (int i = 0; i < selects.length; i++) {
							out.print("<option value='" + selects[i] + "'");
							if (flowControlValue != null && flowControlValue.equals(selects[i]))
								out.print(" selected='selected'");
							out.println(">" + shows[i] + "</option>");
						}
					} // end if (selects != null && shows != null && selects.length == shows.length)
					out.println("</select>");
					out.println("</li>");
					out.println("</ul>");
				} // end if (flowcontrolField != null)
		
				// 校验方式
				String parityValue = null;
				Field parityField = fieldHash.get(Device.FIELD_PARITY);
				if (parityField != null) {
					out.print("<ul id='parity' class='field'");
					if (DataUtility.StringToInt(typeValue) == Device.TYPE_COM)
						out.print(" style='display:block'");
					else
						out.print(" style='display:none'");
					out.println(">");
					String name = parityField.getName();
					parityValue = parameters.getParameter(name);
					if (parityValue == null || parityValue.equals("null"))
						parityValue = parityField.getShow();
					out.println("<li class='title'>" + parityField.getDisplay() + "</li>");
					out.println("<li class='value'>");
					out.print("<select id='" + name + "' name='" + name + "'>");
					String[] selects = parityField.getSelects();
					String[] shows = parityField.getShows();
					if (selects != null && shows != null && selects.length == shows.length) {
						for (int i = 0; i < selects.length; i++) {
							out.print("<option value='" + selects[i] + "'");
							if (parityValue != null && parityValue.equals(selects[i]))
								out.print(" selected='selected'");
							out.println(">" + shows[i] + "</option>");
						}
					} // end if (selects != null && shows != null && selects.length == shows.length)
					out.println("</select>");
					out.println("</li>");
					out.println("</ul>");
				} // end if (parityField != null)
		
				// 停止位
				String stopbitsValue = null;
				Field stopbitsField = fieldHash.get(Device.FIELD_STOPBITS);
				if (stopbitsField != null) {
					out.print("<ul id='stopbits' class='field'");
					if (DataUtility.StringToInt(typeValue) == Device.TYPE_COM)
						out.print(" style='display:block'");
					else
						out.print(" style='display:none'");
					out.println(">");
					String name = stopbitsField.getName();
					stopbitsValue = parameters.getParameter(name);
					if (stopbitsValue == null || stopbitsValue.equals("null"))
						stopbitsValue = stopbitsField.getValue();
					out.println("<li class='title'>" + stopbitsField.getDisplay() + "</li>");
					out.println("<li class='value'>");
					out.print("<select id='" + name + "' name='" + name + "'>");
					String[] selects = stopbitsField.getSelects();
					String[] shows = stopbitsField.getShows();
					if (selects != null && shows != null && selects.length == shows.length) {
						for (int i = 0; i < selects.length; i++) {
							out.print("<option value='" + selects[i] + "'");
							if (stopbitsValue != null && stopbitsValue.equals(selects[i]))
								out.print(" selected='selected'");
							out.println(">" + shows[i] + "</option>");
						}
					} // end if (selects != null && shows != null && selects.length == shows.length)
					out.println("</select>");
					out.println("</li>");
					out.println("</ul>");
				} // end if (stopbitsField != null) 
			
				// 设备类型
				String iniValue = null;
				Field iniField = fieldHash.get(Device.FIELD_INI);
				if (iniField != null) {
					out.println("<ul id='ini' class='field'>");
					String name = iniField.getName();
					iniValue = parameters.getParameter(name);
					if (iniValue == null || iniValue.equals("null"))
						iniValue = iniField.getValue();
					out.println("<li class='title'>" + iniField.getDisplay() + "</li>");
					out.println("<li class='value'>");
					out.println("<select id='" + name + "' name='" + name + "' onchange=\"typeIni(this)\">");	
					String[] selects = iniField.getSelects();
					String[] shows = iniField.getShows();
					if (selects != null && shows != null && selects.length == shows.length) {
						for (int i = 0; i < selects.length; i++) {
							out.print("<option value='" + selects[i] + "'");
							if (iniValue != null && iniValue.equals(selects[i]))
								out.print(" selected='selected'");
							out.println(">" + shows[i] + "</option>");
						}
					} // end if (selects != null && shows != null && selects.length == shows.length)
					out.println("</select>");
					out.println("</li>");
					out.println("</ul>");
				}
				
				// 短信发送速率
				String speedValue = null;
				Field speedField = fieldHash.get(Device.FIELD_SENDSPEED);
				if (speedField != null) {
					out.print("<ul id='speed' class='field'");
					if (iniValue.equals(Device.INI_AT)
							|| iniValue.equals(Device.INI_GPRS_AT))
						out.print(" style='display:block'");
					else
						out.print(" style='display:none'");
					out.println(">");
					String name = speedField.getName();
					speedValue = parameters.getParameter(name);
					if (speedValue == null || speedValue.equals("null"))
						speedValue = speedField.getShow();
					out.println("<li class='title'>" + speedField.getDisplay() + ":</li>");
					out.print("<li class='value'>");
					out.print("<input type='text' id='" + name + "' name='" + name + "' style='text-align:right'");
					if (speedValue != null)
						out.print(" value='" + speedValue + "'");
					out.println("/>");
					out.println("</li>");
					out.println("</ul>");
				}
		
				// 是否有效
				String validValue = null;
				Field validField = fieldHash.get(Device.FIELD_VALID);
				if (validField != null) {
					out.println("<ul id='valid' class='field'>");
					String name = validField.getName();
					validValue = parameters.getParameter(name);
					if (validValue == null || validValue.equals("null"))
						validValue = validField.getValue();
					out.println("<li class='title'>" + validField.getDisplay() + "</li>");
					String[] selects = validField.getSelects();
					String[] shows = validField.getShows();
					if (selects != null && shows != null && selects.length == shows.length) {
						for (int i = 0; i < selects.length; i++) {
							out.println("<li class='value'>");
							out.print("<input type='radio' id='" + name + "' name='" + name + "' value='" + selects[i] + "'");
							if (validValue != null && validValue.equals(selects[i]))
								out.print(" checked='checked'");
							out.println("/>" + shows[i]);
							out.println("</li>");
						}
					} // end if (selects != null && shows != null && selects.length == shows.length)
					out.println("</ul>");
				} // end if (validField != null)
			} // end if (fields != null && fields.length > 0)


			// 其他参数
			if (callbackURL != null && !callbackURL.isEmpty())
				out.println(new StringBuilder("<input type='hidden' id='").append(KEY_CALLBACK_URL).append("' name='").append(KEY_CALLBACK_URL).append("' value='").append(callbackURL).append("'/>"));
			if (callbackParams != null && !callbackParams.isEmpty())
				out.println(new StringBuilder("<input type='hidden' id='").append(KEY_CALLBACK_PARAMS).append("' name='").append(KEY_CALLBACK_PARAMS).append("' value='").append(callbackParams).append("'/>"));
			boolean refreshOpener = DataUtility.StringToBoolean(parameters.getParameter(KEY_REFRESH_OPENER));    //是否刷新opener页
			out.println(new StringBuilder("<input type='hidden' id='refresh-opener' name='refresh-opener' value='").append(refreshOpener).append("'/>"));
			boolean showClose = DataUtility.StringToBoolean(parameters.getParameter(KEY_SHOW_CLOSE));    //是否刷新opener页
			out.print("<input type='hidden' id='");
			out.print(KEY_SHOW_CLOSE);
			out.print("' name='");
			out.print(KEY_SHOW_CLOSE);
			out.print("' value='");
			out.print(showClose);
			out.println("'/>");
%>
      <!-- 按钮 -->
      <ul class='button'>
            <li><input type="button" id="addButton" name="addButton" onclick="submitWithWaiting('addForm', '<%= charset %>')" value="确定"/></li>
      </ul>
    </form>
    <!-- end #info -->
    </div>

  <script language="javascript">
    /**
     * 调用选择页面
     *
     * @param fieldName
     *           选择字段名
     */
    function browse(fieldName) {
    }

    /**
	 * 端口类型改变
	 */
	function typeChange(obj) {
	  if (obj == null)
	    return ;
      
	  var ip = document.getElementById("ip");
	  var baudrate = document.getElementById("baudrate");
	  var databits = document.getElementById("databits");
	  var flowcontrol = document.getElementById("flowcontrol");
	  var stopbits = document.getElementById("stopbits");
	  var parity = document.getElementById("parity");
	  
      if (obj.value == "1") {
		// 串口
		if (ip != null)
		  ip.style.display = "none";
		
		if (baudrate != null)
		  baudrate.style.display = "block";
		if (databits != null)
		  databits.style.display = "block";
		if (flowcontrol != null)
		  flowcontrol.style.display = "block";
		if (stopbits != null)
		  stopbits.style.display = "block";
		if (parity != null)
		  parity.style.display = "block";

	  } else if (obj.value == "17") {
		// TCP端口
		if (ip != null)
		  ip.style.display = "block";
		
		if (baudrate != null)
		  baudrate.style.display = "none";
		if (databits != null)
		  databits.style.display = "none";
		if (flowcontrol != null)
		  flowcontrol.style.display = "none";
		if (stopbits != null)
		  stopbits.style.display = "none";
		if (parity != null)
		  parity.style.display = "none";
	  }
	}
	
	/**
	 * 设备类型改变
	 */
	function typeIni(obj) {
	  if (obj == null)
	    return ;
      
	  var speed = document.getElementById("speed");
	  
      if (obj.value=="<%= Device.INI_AT %>"
          || obj.value=="<%= Device.INI_GPRS_AT %>") {
		// 手机短信
		if (speed)
		  speed.style.display = "block";

	  } else {
		// TCP端口
		if (speed)
		  speed.style.display = "none";
	  }
	}
  </script>
<%				
		} // end if (records != null && records.length > 0 && records[0] != null)
	} // end if (result.getCode() != Result.RESULT_OK) else
%>
  <!-- end #main -->
  </div>

<%@ include file="../../../common/tek/jsp/shield.jsp" %>
</body>
</html>
