<!--
    �û���¼��������ش��롣JSP��¼ҳ�潫���ļ�Ƕ�룬ʵ���û���¼�Ĵ���
	����Ѿ���¼���������κβ�������������а���username��password�������û���¼�����򣬽���������¼��
	
	ʹ�ò�����
		username ---- ��¼��
		password ---- ��¼����
	���ñ�����
		token ---- ��¼����Ȩ�뼰��Ȩ��Կ������net.tekinfo.remoting���еĶ���������ݲ���ʱ������token.getTokenCode()��Ϊ��Ȩ�������
		isLogin ---- �Ƿ��Ѿ���¼
		loginMsg ---- ��¼�󣬷��ص���ʾ��Ϣ
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
	String loginMsg = null;                             //��¼������Ϣ

	LoginRemoting lr = new LoginRemoting();
	if (token != null) {
		if (!isLogin) {
			// ������¼��ע��
			/*StringBuilder data = new StringBuilder();    //��������
			data.append("clientToken=").append(clientToken)
					.append("&accessToken=").append(token.getTokenCode())
					.append("&signatureMethod=").append(signatureMethod)
					.append("&timeStamp=").append(timeStamp)
					.append("&nonce=").append(nonce)
					.append("&clientIp=").append(clientIp);
			
			StringBuilder secret = new StringBuilder();    //��Կ
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
				//session.removeAttribute("ul");    //ɾ����¼������
				//session.removeAttribute("up");    //ɾ����������
			}
		} // end if (isLogin) else
	} // end if (token != null)

	if (!isLogin) {
		String username = HttpUtility.GetParameter(request, "username");    // ��¼��
		String password = HttpUtility.GetParameter(request, "password");    // ��¼����

		if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) {
			// �û���¼
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
	
			/*StringBuilder data = new StringBuilder();    //��������
			data.append("clientIp=").append(clientIp)
					.append("&clientOS=").append(clientOS)
					.append("&clientToken=").append(clientToken)
					.append("&nonce=").append(nonce)
					.append("&loginName=").append(secretUser)
					.append("&password=").append(secretPwd)
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
			
			//TokenResult tokenResult = lr.userLogin(clientToken, secretUser, secretPwd, "zh", 
			//		signatureMethod, signature, timeStamp, nonce, clientOS, clientIp, User.ONLINE_ONLINE, null);
			TokenResult tokenResult = lr.userLogin(clientToken, secretUser, secretPwd, "zh", 
					clientOS, clientIp, User.ONLINE_ONLINE, 0L, null, null);
			if (tokenResult != null) {
				if (tokenResult.getCode() == Result.RESULT_OK) {
					// ��¼�ɹ�
					token = tokenResult;
					isLogin = true;
					my.initial(tokenResult.getMy());
					
					session.setAttribute(AbstractServlet.SESSION_TOKEN_RESULT, tokenResult);
					//session.setAttribute("ul", secretUser);    //���ܺ�ĵ�¼��
					//session.setAttribute("up", secretPwd);    //���ܺ������
				} else if (tokenResult.getCode() == Result.RESULT_ERROR_UPDATE_CLIENT) {
					// ͬ���������û���¼
					my.initial(tokenResult.getMy());
				} // end else if (tokenResult.getCode() == Result.RESULT_ERROR_UPDATE_CLIENT)
				
				loginMsg = tokenResult.getMessage();
			} // end if (tokenResult != null && tokenResult.getCode() == Result.RESULT_OK)
			
		} else {
			String userToken = HttpUtility.GetParameter(request, "userToken");    // �û���Ȩ��
			String clientToken = HttpUtility.GetParameter(request, "clientToken");    // �ͻ��˱���

			if (userToken != null &&  !userToken.isEmpty() && clientToken != null && !clientToken.isEmpty()) {
				// ���û���¼
				TokenResult tokenResult = lr.bindLogin(tokenCode, userToken, "zh", clientOS, clientIp, User.ONLINE_ONLINE) {
				if (tokenResult != null) {
					if (tokenResult.getCode() == Result.RESULT_OK) {
						// ��¼�ɹ�
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
		// ע��
		/*StringBuilder data = new StringBuilder();    //��������
		data.append("clientToken=").append(clientToken)
				.append("&accessToken=").append(token.getTokenCode())
				.append("&signatureMethod=").append(signatureMethod)
				.append("&timeStamp=").append(timeStamp)
				.append("&nonce=").append(nonce)
				.append("&clientIp=").append(clientIp);
						
		StringBuilder secret = new StringBuilder();    //��Կ
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
			// ע���ɹ�
			my.initial();
				
			token = null;
			isLogin = false;
			session.removeAttribute(AbstractServlet.SESSION_TOKEN_RESULT);
		} // end if (result != null && result.getCode() == Result.RESULT_OK)
	} // end if (logout && isLogin && token != null)

	if (token == null) {
		// ������¼
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
				
			//session.removeAttribute("ul");    //ɾ����¼������
			//session.removeAttribute("up");    //ɾ����������
		}
	} // end if (token == null)
	
	if (token == null) {
		// û�л�ȡ����Ȩ�룬���ش���ҳ
		if (loginMsg != null)
			out.println(loginMsg + "<br>");
			
		out.println("��Ȩ�����!<br>");
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