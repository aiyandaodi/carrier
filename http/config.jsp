<!-- 
    取得授权码的相关操作。非用户登录的页面必须嵌入该文件。
	
	可用变量：
		token ---- 登录的授权码及授权密钥。调用net.tekinfo.remoting包中的对象进行数据操作时，必须token.getTokenCode()作为授权码参数。
		isLogin ---- 是否已经登录	
-->


<%@ include file="initial.jsp" %>

<%@ page import="java.util.StringTokenizer" %>

<%@ page import="net.tekinfo.algorithm.AlgorithmFactory" %>
<%@ page import="net.tekinfo.remoting.LoginRemoting" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.remoting.Record" %>
<%@ page import="net.tekinfo.remoting.Field" %>
<%@ page import="net.tekinfo.remoting.TokenResult" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.servlet.AbstractServlet" %>
<%@ page import="net.tekinfo.system.TekInfo" %>
<%@ page import="net.tekinfo.system.Token" %>
<%@ page import="net.tekinfo.system.User" %>
<%@ page import="net.tekinfo.system.Host" %>

<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.http.HttpUtility" %>

<%
	final String KEY_CALLBACK_URL = "callback-url"; // 参数键：回调地址
	final String KEY_CALLBACK_PARAMS = "callback-params"; // 参数键：回调参数
	final String KEY_SHOW_CLOSE = "show-close"; // 参数键：是否显示“关闭”按钮
	final String KEY_REFRESH_OPENER = "refresh-opener"; // 参数键：是否刷新opener页面
	
	// 判断是否存在授权码
	String clientToken = (String) session.getAttribute("clientToken");    //客户端授权码
	if (clientToken == null) {
		clientToken = "tekinfo_web";
		session.setAttribute("clientToken", clientToken);
	}
	
	String clientSecret = (String) session.getAttribute("clientSecret");                                      //客户端授权密钥
	if (clientSecret == null) {
		clientSecret = "TYzlp31GBx";
		session.setAttribute("clientSecret", clientSecret);
	}
		
	//String signatureMethod = LoginRemoting.SIGNATURE_FETHOD_HMACSHA1;    //签名方法;
	//String timeStamp = "" + System.currentTimeMillis();                 //时间戳
	//String nonce = "" + System.currentTimeMillis();                     //随机值
	String clientOS = HttpUtility.GetGuestInfo(request);
	String clientIp = HttpUtility.GetGuestIp(request);                          //客户端IP地址
	
	Token token = (Token) session.getAttribute(AbstractServlet.SESSION_TOKEN_RESULT);    //授权码
	Host host=null;
	
	boolean isLogin = false;    //是否登录
	if (token != null) {
		long longIp = DataUtility.IpToLong(clientIp);
		
		host=hostManager.getHost(token.getTokenCode(),longIp,null);
		if(host!=null){
			host.setClientOs(clientOS);
		}
		
		isLogin = hostManager.isLogin(token.getTokenCode(), longIp, null);
		if (!isLogin) {
			boolean anonymous = hostManager.isAnonymousLogin(token.getTokenCode(), longIp, null);
			if (!anonymous) {
				token = null;
			}
		}

		if (token != null)
			my.initial(((TokenResult)token).getMy());
	} //end if (token != null) 

	if (token == null) {
		LoginRemoting lr = new LoginRemoting();

		// 1、如果存在cookie，自动登录
		String username = HttpUtility.GetCookieValueWithDecode(request, hostManager.getTekInfo(), LoginServlet.KEY_LOGIN);
		String password = HttpUtility.GetCookieValueWithDecode(request, hostManager.getTekInfo(), LoginServlet.KEY_PASSWORD);
				
		if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) {
			// 用户登录
			/*StringBuilder data = new StringBuilder();    //数据明文
			data.append("clientIp=").append(clientIp)
					.append("&clientOS=").append(clientOS)
					.append("&clientToken=").append(clientToken)
					.append("&nonce=").append(nonce)
					.append("&loginName=").append(username)
					.append("&password=").append(password)
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
			
			//TokenResult tokenResult = lr.userLogin(clientToken, username, password, language, 
			//		signatureMethod, signature, timeStamp, nonce, clientOS, clientIp, User.ONLINE_ONLINE, null);
			TokenResult tokenResult = lr.userLogin(clientToken, username, password, language, 
					clientOS, clientIp, User.ONLINE_ONLINE, 0L, null, null);
			if (tokenResult != null) {
				if (tokenResult.getCode() == Result.RESULT_OK) {
					// 登录成功
					token = tokenResult;
					isLogin = true;
					my.initial(tokenResult.getMy());
					
					session.setAttribute("token", token);
					//session.setAttribute("ul", username);    //加密后的登录名
					//session.setAttribute("up", password);    //加密后的密码
				} // end if (tokenResult.getCode() == Result.RESULT_OK)
			} // end if (tokenResult != null && tokenResult.getCode() == Result.RESULT_OK)
		} // end if (username != null && !username.isEmpty() && password != null && !password.isEmpty())
	
		if (!isLogin) {
			// 2、匿名登录
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
			//		signatureMethod, signature, timeStamp,  nonce, clientOS, clientIp, null);
			TokenResult tokenResult = lr.anonymousLogin(clientToken, my.getLanguage(),
					clientOS, clientIp, null, null);
			if (tokenResult != null && tokenResult.getCode() == Result.RESULT_OK) {
				my.initial(tokenResult.getMy());
				token = tokenResult;
				session.setAttribute("token", token);
				//session.removeAttribute("ul");    //删除登录名属性
				//session.removeAttribute("up");    //删除密码属性
			}
		} // end if (!isLogin)
	} // end if (token == null)
	
	if (token == null) {
		// 没有获取到授权码，返回错误页
		out.println("Token is null!");
		return ;
		//response.sendRedirect("error.jsp");
	}

%>
