<!-- 
    ȡ����Ȩ�����ز��������û���¼��ҳ�����Ƕ����ļ���
	
	���ñ�����
		token ---- ��¼����Ȩ�뼰��Ȩ��Կ������net.tekinfo.remoting���еĶ���������ݲ���ʱ������token.getTokenCode()��Ϊ��Ȩ�������
		isLogin ---- �Ƿ��Ѿ���¼	
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
	final String KEY_CALLBACK_URL = "callback-url"; // ���������ص���ַ
	final String KEY_CALLBACK_PARAMS = "callback-params"; // ���������ص�����
	final String KEY_SHOW_CLOSE = "show-close"; // ���������Ƿ���ʾ���رա���ť
	final String KEY_REFRESH_OPENER = "refresh-opener"; // ���������Ƿ�ˢ��openerҳ��
	
	// �ж��Ƿ������Ȩ��
	String clientToken = (String) session.getAttribute("clientToken");    //�ͻ�����Ȩ��
	if (clientToken == null) {
		clientToken = "tekinfo_web";
		session.setAttribute("clientToken", clientToken);
	}
	
	String clientSecret = (String) session.getAttribute("clientSecret");                                      //�ͻ�����Ȩ��Կ
	if (clientSecret == null) {
		clientSecret = "TYzlp31GBx";
		session.setAttribute("clientSecret", clientSecret);
	}
		
	//String signatureMethod = LoginRemoting.SIGNATURE_FETHOD_HMACSHA1;    //ǩ������;
	//String timeStamp = "" + System.currentTimeMillis();                 //ʱ���
	//String nonce = "" + System.currentTimeMillis();                     //���ֵ
	String clientOS = HttpUtility.GetGuestInfo(request);
	String clientIp = HttpUtility.GetGuestIp(request);                          //�ͻ���IP��ַ
	
	Token token = (Token) session.getAttribute(AbstractServlet.SESSION_TOKEN_RESULT);    //��Ȩ��
	Host host=null;
	
	boolean isLogin = false;    //�Ƿ��¼
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

		// 1���������cookie���Զ���¼
		String username = HttpUtility.GetCookieValueWithDecode(request, hostManager.getTekInfo(), LoginServlet.KEY_LOGIN);
		String password = HttpUtility.GetCookieValueWithDecode(request, hostManager.getTekInfo(), LoginServlet.KEY_PASSWORD);
				
		if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) {
			// �û���¼
			/*StringBuilder data = new StringBuilder();    //��������
			data.append("clientIp=").append(clientIp)
					.append("&clientOS=").append(clientOS)
					.append("&clientToken=").append(clientToken)
					.append("&nonce=").append(nonce)
					.append("&loginName=").append(username)
					.append("&password=").append(password)
					.append("&signatureMethod=").append(signatureMethod)
					.append("&timeStamp=").append(timeStamp);
					
			StringBuilder secret = new StringBuilder();    //��Կ
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
					// ��¼�ɹ�
					token = tokenResult;
					isLogin = true;
					my.initial(tokenResult.getMy());
					
					session.setAttribute("token", token);
					//session.setAttribute("ul", username);    //���ܺ�ĵ�¼��
					//session.setAttribute("up", password);    //���ܺ������
				} // end if (tokenResult.getCode() == Result.RESULT_OK)
			} // end if (tokenResult != null && tokenResult.getCode() == Result.RESULT_OK)
		} // end if (username != null && !username.isEmpty() && password != null && !password.isEmpty())
	
		if (!isLogin) {
			// 2��������¼
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
				//session.removeAttribute("ul");    //ɾ����¼������
				//session.removeAttribute("up");    //ɾ����������
			}
		} // end if (!isLogin)
	} // end if (token == null)
	
	if (token == null) {
		// û�л�ȡ����Ȩ�룬���ش���ҳ
		out.println("Token is null!");
		return ;
		//response.sendRedirect("error.jsp");
	}

%>
