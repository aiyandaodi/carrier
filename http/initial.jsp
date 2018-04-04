<jsp:useBean id="my" scope="session" class="net.tekinfo.remoting.MyInfo" />

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.service.ServiceManager" %>
<%@ page import="net.tekinfo.servlet.LoginServlet" %>
<%@ page import="net.tekinfo.system.HostManager" %>
<%@ page import="net.tekinfo.system.TekInfo" %>

<%@ page import="java.util.Locale" %>

<%
	HostManager hostManager = null;
	TekInfo tekinfo = null;
	
	hostManager = HostManager.getInstance();
	synchronized(hostManager) {
	tekinfo = hostManager.getTekInfo();
	if (tekinfo== null) {
	   tekinfo = TekInfo.getInstance(); 
	   
		String sep=System.getProperty("file.separator");
		String urlRoot = request.getContextPath();
		System.out.println("SYS:UrlRoot="+urlRoot);
		String servletRoot1;
		String httpRoot1; 
		//String wapRoot1;
		if (urlRoot.endsWith("/"))
		{
			//httpRoot1=urlRoot+"http";
			httpRoot1=urlRoot;//+"http";
			//wapRoot1=urlRoot+"wap";
			//servletRoot1=urlRoot+"servlet";
			servletRoot1=urlRoot+"http";
		} else {
		    //httpRoot1=urlRoot+"/http";
		    httpRoot1=urlRoot;//+"/http";
		    //wapRoot1=urlRoot+"/wap";
			//servletRoot1=urlRoot+"/servlet";
			servletRoot1=urlRoot+"/http";
		}
		 
		System.out.println("SYS: HttpRoot1="+httpRoot1);
		
		//HttpSession session = request.getSession();
		ServletContext servletContext =session.getServletContext();
		String m_pathRoot =  servletContext.getRealPath("/");
		//out.println("ROOT="+m_pathRoot);
		System.out.println("SYS:PathRoot="+m_pathRoot);
		if (m_pathRoot.endsWith(sep))
			m_pathRoot = m_pathRoot.substring(0, m_pathRoot.length()-1);
		
		String m_config = m_pathRoot + sep + "config" + sep + "tekinfo.xml";
		System.out.println("SYS:config xml="+m_config);

		tekinfo.initial(m_config, m_pathRoot, servletRoot1, httpRoot1);

		hostManager.setTekInfo(tekinfo);
		hostManager.initial();
		
		// 系统服务管理器
		ServiceManager serviceManager = ServiceManager.getInstance();
		serviceManager.setTekInfo(tekinfo);
		serviceManager.setBackgroundMessage(tekinfo.getLog());
		serviceManager.initial();
	} // end if (hostManager.getTekInfo() == null)
}
	
	String charset = my.getCharset();
	if(charset == null) {
		if (tekinfo != null) {
			charset = tekinfo.getLocaleManager().getCharacterEncoding();
		}
	}
 	request.setCharacterEncoding(charset);
	
	String language = null;
	
	if (tekinfo != null) {
		language = HttpUtility.GetCookieValueWithDecode(request, tekinfo,
				LoginServlet.KEY_LANGUAGE); // 使用语言
		
		if (language == null) {
			language = my.getLanguage();
		
			if (language == null) {
				Locale locale = tekinfo.getLocaleManager().getLocale();
				if (locale != null)
					language = locale.getLanguage();
				if (language == null)
					language = "zh";
			}

			if (language != null)
				HttpUtility.CreateCookieWithEncode(response, tekinfo,
						LoginServlet.KEY_LANGUAGE, language);
		} // end if (language == null)
	} // end if (tekinfo != null)
%>
