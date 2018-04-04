<!-- 
内容：端口设备选择页面
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="style.css" rel="stylesheet" type="text/css" media="screen" />
<title>选择端口设备</title>
</head>

<body>
<%@ include file="../../../config.jsp" %>
 

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.object.Command" %>
<%@ page import="net.tekinfo.remoting.Field" %>
<%@ page import="net.tekinfo.remoting.Record" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="com.takall.resource.Device" %>
<%@ page import="com.takall.resource.DeviceOp" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%
	String callbackFunc = HttpUtility.GetParameter(request, "callbackFunc");
	if (callbackFunc == null || callbackFunc.isEmpty()) {
	  out.println("<div class='msg'>无法确定回调地址!</div>");
	  return ;
	}
	
	String id = HttpUtility.GetParameter(request, "device_id");
%>
  <p><h2>选择端口设备</h2></p>
  <hr/>
<%
	DeviceOp op = new DeviceOp(token.getTokenCode(), clientIp, new Result());
	
	int right = op.getRight();
	if (!Right.IsCanList(right)) {
		// 没有权限
		out.println("<div class='msg'>没有权限!</div>");
		return ;
	}
	
	String base = "";
	int skip = 0;
	int ONCE_COUNT = 200;
	
	Object[] obs = op.search(op.getCondition(), null, false, skip, ONCE_COUNT);
	while (obs != null && obs.length > 0) {
		int length = obs.length;
			
		for (int i = 0; i < length; i++) {
			if (obs[i] == null)
				continue;
			
			StringHash info = (StringHash) obs[i];		
			String deviceId = info.get(Device.FIELD_ID);
			String deviceName = info.get(Device.FIELD_NAME);
					
			out.print("<input type='radio' id='device' name='device' value='");
			out.print(deviceId);
			out.print("' onclick=\"selected('");
			out.print(deviceId);
			out.print("', '");
			out.print(deviceName);
			out.print("')\"");
			if (id != null && id.equals(deviceId))
				out.println(" checked='checked'");
			out.print(">");
			out.print(deviceName);
			out.println("</input>");
			out.println("<br />");
		} // end for (int i = 0; i < records.length; i++)
			
		skip += length;
		obs = op.search(op.getCondition(), null, false, skip, ONCE_COUNT);
	} // end while (result != null && result.getCode() == Result.RESULT_OK)
%>
    <!-- 按钮 -->
    <ul class='button'>
      <li>
        <input type="button" onclick="ok()" value="确定"/>
        <input type="button" onclick="javascript:window.close()" value="关闭"/>
      </li>
    </ul>

<script language="javascript">
  var selectedId;
  var selectedName;
  
  /**
   * 设置选择值
   */
  function selected(id, name) {
    selectedId = id;
    selectedName = name;
  }

  /**
   * 将选中的选项值传回调用页面
   */
  function ok() {
    window.opener.<%= callbackFunc %>(selectedId, selectedName);
    close();
  }
</script>
</body>
</html>
