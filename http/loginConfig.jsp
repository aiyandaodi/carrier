<!--
    用户登录操作的相关代码。JSP登录页面将该文件嵌入，实现用户登录的处理。
	如果已经登录，不进行任何操作；如果参数中包含username、password，进行用户登录；否则，进行匿名登录。
	
	使用参数：
		username ---- 登录名
		password ---- 登录密码
	可用变量：
		token ---- 登录的授权码及授权密钥。调用net.tekinfo.remoting包中的对象进行数据操作时，必须token.getTokenCode()作为授权码参数。
		isLogin ---- 是否已经登录
		loginMsg ---- 登录后，返回的提示信息
-->



<%@ page import="java.util.StringTokenizer" %>

<%@ page import="net.tekinfo.algorithm.AlgorithmFactory" %>
<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.remoting.LoginRemoting" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.remoting.TokenResult" %>
<%@ page import="net.tekinfo.servlet.AbstractServlet" %>
<%@ page import="net.tekinfo.system.TekInfo" %>
<%@ page import="net.tekinfo.system.TekInfoProperties" %>
<%@ page import="net.tekinfo.system.Token" %>
<%@ page import="net.tekinfo.util.DataUtility" %>

<%
	String loginMsg = null;                             //登录返回信息

	LoginRemoting lr = new LoginRemoting();
	if (token != null) {
		if (!isLogin) {
			// 匿名登录，注销
			/*StringBuilder data = new StringBuilder();    //数据明文
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
			}*/
				
			//Result result = lr.anonymousLogout(clientToken, token.getTokenCode(),
			//		signatureMethod, signature, timeStamp, nonce, clientIp);
			Result result = lr.anonymousLogout(clientToken, token.getTokenCode(),
					clientIp);
			if (result != null && result.getCode() == Result.RESULT_OK) {
				token = null;
				isLogin = false;
				session.removeAttribute(AbstractServlet.SESSION_TOKEN_RESULT);
				//session.removeAttribute("ul");    //删除登录名属性
				//session.removeAttribute("up");    //删除密码属性
			}
		} // end if (isLogin) else
	} // end if (token != null)

	if (!isLogin) {
		String username = HttpUtility.GetParameter(request, "username");    // 登录名
		String password = HttpUtility.GetParameter(request, "password");    // 登录密码

		if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) {
			// 用户登录
			String algorithm = null;
			String key = null;
			
			if (tekinfo != null) {
				algorithm = tekinfo.getAlgorithmName("webservice");
				key = tekinfo.getAlgorithmCipher("webservice");
			}
			
			String secretUser = null;
			String secretPwd = null;
			try {
				secretUser = AlgorithmFactory.Encode(algorithm, key, username);
				secretPwd = AlgorithmFactory.Encode(algorithm, key, password);
			} catch (Exception e) {
				e.printStackTrace();
			}
	
			/*StringBuilder data = new StringBuilder();    //数据明文
			data.append("clientIp=").append(clientIp)
					.append("&clientOS=").append(clientOS)
					.append("&clientToken=").append(clientToken)
					.append("&nonce=").append(nonce)
					.append("&loginName=").append(secretUser)
					.append("&password=").append(secretPwd)
					.append("&signatureMethod=").append(signatureMethod)
					.append("&timeStamp=").append(timeStamp);
					
			StringBuilder secret = new StringBuilder();    //密钥
			secret.append(clientSecret).append("&");
					
			String signature = null;
			try {
				byte[] bytes = AlgorithmFactory.GetMacSignature(signatureMethod, 
						secret.toString(), 
						data.toString().getBytes());
				signature = AlgorithmFactory.BytesToBase64(bytes);
			} catch (Exception e) {
				e.printStackTrace();
			}*/
			
			//TokenResult tokenResult = lr.userLogin(clientToken, secretUser, secretPwd, "zh", 
			//		signatureMethod, signature, timeStamp, nonce, clientOS, clientIp, User.ONLINE_ONLINE, null);
			TokenResult tokenResult = lr.userLogin(clientToken, secretUser, secretPwd, "zh", 
					clientOS, clientIp, User.ONLINE_ONLINE, 0L, null, null);
			if (tokenResult != null) {
				if (tokenResult.getCode() == Result.RESULT_OK) {
					// 登录成功
					token = tokenResult;
					isLogin = true;
					my.initial(tokenResult.getMy());
					
					session.setAttribute(AbstractServlet.SESSION_TOKEN_RESULT, tokenResult);
					//session.setAttribute("ul", secretUser);    //加密后的登录名
					//session.setAttribute("up", secretPwd);    //加密后的密码
				} else if (tokenResult.getCode() == Result.RESULT_ERROR_UPDATE_CLIENT) {
					// 同步服务器用户登录
					my.initial(tokenResult.getMy());
				} // end else if (tokenResult.getCode() == Result.RESULT_ERROR_UPDATE_CLIENT)
				
				loginMsg = tokenResult.getMessage();
			} // end if (tokenResult != null && tokenResult.getCode() == Result.RESULT_OK)
			
		} else {
			String userToken = HttpUtility.GetParameter(request, "userToken");    // 用户授权码
			String clientToken = HttpUtility.GetParameter(request, "clientToken");    // 客户端编码

			if (userToken != null &&  !userToken.isEmpty() && clientToken != null && !clientToken.isEmpty()) {
				// 绑定用户登录
				TokenResult tokenResult = lr.bindLogin(tokenCode, userToken, "zh", clientOS, clientIp, User.ONLINE_ONLINE) {
				if (tokenResult != null) {
					if (tokenResult.getCode() == Result.RESULT_OK) {
						// 登录成功
						token = tokenResult;
						isLogin = true;
						my.initial(tokenResult.getMy());
									
						session.setAttribute(AbstractServlet.SESSION_TOKEN_RESULT, tokenResult);
					}
								
					loginMsg = tokenResult.getMessage();
				}
			} // end if (userToken != null &&  !userToken.isEmpty() && clientToken != null && !clientToken.isEmpty())
		} // end if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) else
		
		if (isLogin) {
%>
	  <script language="javascript">
		if(parent)
			parent.changeUser(<%=my.getSecurity()%>);
	  </script>
<%
		}
	} // end if (!isLogin)

	boolean logoutUser = DataUtility.StringToBoolean(HttpUtility.GetParameter(request, "logoutUser"));
	if (logoutUser && isLogin && token != null) {
		// 注销
		/*StringBuilder data = new StringBuilder();    //数据明文
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
		}*/
		
		//Result result = lr.userLogout(clientToken, token.getTokenCode(), signatureMethod, signature, timeStamp,
		//		nonce, clientIp);
		Result result = lr.userLogout(clientToken, token.getTokenCode(), clientIp);
		if (result != null && result.getCode() == Result.RESULT_OK) {
			// 注销成功
			my.initial();
				
			token = null;
			isLogin = false;
			session.removeAttribute(AbstractServlet.SESSION_TOKEN_RESULT);
		} // end if (result != null && result.getCode() == Result.RESULT_OK)
	} // end if (logout && isLogin && token != null)

	if (token == null) {
		// 匿名登录
		/*StringBuilder data = new StringBuilder();
		data.append("clientIp=").append(clientIp)
				.append("&clientOS=").append(clientOS)
				.append("&clientToken=").append(clientToken)
				.append("&nonce=").append(nonce)
				.append("&signatureMethod=").append(signatureMethod)
				.append("&timeStamp=").append(timeStamp);
		String key = clientSecret + "&";
	
		String signature = null;
		try {
			byte[] bytes = AlgorithmFactory.GetMacSignature(signatureMethod, 
					key.toString(), data.toString().getBytes());
			signature = AlgorithmFactory.BytesToBase64(bytes);
		} catch (Exception e) {
			e.printStackTrace();
		}*/
		
		//TokenResult tokenResult = lr.anonymousLogin(clientToken, my.getLanguage(),
		//		signatureMethod, signature, timeStamp,  nonce, clientOS, clientIp);
		TokenResult tokenResult = lr.anonymousLogin(clientToken, my.getLanguage(),
				clientOS, clientIp, null, null);
		if (tokenResult != null) {
			if (tokenResult.getCode() == Result.RESULT_OK) {
				token = tokenResult;
				isLogin = false;
				session.setAttribute(AbstractServlet.SESSION_TOKEN_RESULT, tokenResult);
			}
				
			//session.removeAttribute("ul");    //删除登录名属性
			//session.removeAttribute("up");    //删除密码属性
		}
	} // end if (token == null)
	
	if (token == null) {
		// 没有获取到授权码，返回错误页
		if (loginMsg != null)
			out.println(loginMsg + "<br>");
			
		out.println("授权码错误!<br>");
		return ;
		//response.sendRedirect("error.jsp");
	}
	
	if (my != null) {
%>
  <script language="javascript">
	if(parent)
		parent.changeUser(<%=my.getSecurity()%>);
  </script>
<%
	} // end if (my != null)
%>