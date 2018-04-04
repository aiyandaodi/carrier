<%@ page contentType="text/html; charset=utf-8" language="java" import="java.sql.*" errorPage="" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>注销</title>
</head>

<body>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.Map.Entry" %>

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%@ include file="../../../config.jsp" %>

<%
	if (isLogin && token != null) {
		StringBuilder data = new StringBuilder();    //数据明文
		data.append("clientToken=").append(clientToken)
				.append("&accessToken=").append(token.getTokenCode())
				.append("&signatureMethod=").append(signatureMethod)
				.append("&timeStamp=").append(timeStamp)
				.append("&nonce=").append(nonce)
				.append("&clientIp=").append(clientIp);
						
		StringBuilder secret = new StringBuilder();    //密钥
		secret.append(clientSecret).append("&").append(token.getTokenSecret());
		
		String signature = null;		
		try {
			byte[] bytes = AlgorithmFactory.GetMacSignature(signatureMethod, 
					secret.toString(), 
					data.toString().getBytes());
			signature = AlgorithmFactory.BytesToBase64(bytes);
		} catch (Exception e) {
			e.printStackTrace();
		}
				
		LoginRemoting remoting = new LoginRemoting();
		Result result = remoting.userLogout(clientToken, token.getTokenCode(), signatureMethod, signature, timeStamp,
				nonce, clientIp);
		if (result != null && result.getCode() == Result.RESULT_OK) {
			token = null;
			isLogin = false;
			my.initial();
			session.removeAttribute("token");
		}
	}

	String callbackURL = HttpUtility.GetParameter(request, KEY_CALLBACK_URL);
	if (callbackURL == null || callbackURL.isEmpty())
		callbackURL = "../index.jsp";
	String callbackParams = HttpUtility.GetParameter(request, KEY_CALLBACK_PARAMS);
%>
  <form id="callback" name="callback" action="<%= callbackURL %>" method="post">
<%
	StringHash parameters = DataUtility.StringToInfo(callbackParams, "&");
	if (parameters != null) {
		Iterator<Entry<String, String>> iterator = parameters.entrySet().iterator();
		while (iterator.hasNext()) {
			Entry<String, String> entry = iterator.next();
%>
    <input type="hidden" id="<%= entry.getKey() %>" name="<%= entry.getKey() %>" value="<%= entry.getValue() %>"/>
<%
		}
	}
%>
  </form>
  <script language="javascript">
    document.callback.submit();
  </script>
</body>
</html>
