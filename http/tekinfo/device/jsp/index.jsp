<!-- 
内容：端口设备列表页面
参数：order - 排列字段名
     desc - 是否倒叙
     list_page - 显示页号
     browse - 是否是浏览
     select_id - 当前选择标识
     select_name - 当前选择名称
     callbackFunc - 修改选择信息调用的opener页面的js函数名
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link   rel= "Shortcut Icon"   href= "../../../favicon.ico"/>
<link   rel= "Bookmark"   href= "../../../favicon.ico"/>
<link href="style.css" rel="stylesheet" type="text/css" media="screen" />
<link href="list.css" rel="stylesheet" type="text/css" media="screen" />
<title>端口设备列表</title>
</head>

<body>
<%@ include file="../../../config.jsp" %>
 

<%@ page import="java.util.Enumeration" %>
<%@ page import="java.util.Hashtable" %>

<%@ page import="net.tekinfo.http.HttpUtility" %>
<%@ page import="net.tekinfo.object.Command" %>
<%@ page import="net.tekinfo.object.Unit" %>
<%@ page import="net.tekinfo.remoting.Result" %>
<%@ page import="net.tekinfo.resource.Device" %>
<%@ page import="net.tekinfo.resource.DeviceOp" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<div>
  <form id="form1" name="form1" method="post">
  </form>
</div>

<%
	DeviceOp op = new DeviceOp(token.getTokenCode(), clientIp, null,new Result());
	
	int right = op.getRight();
	if (!Right.IsCanList(right)) {
		// 没有权限
		out.println("<div class='msg'>没有权限!</div>");
		return ;
	}
	
	boolean browse = DataUtility.StringToBoolean(HttpUtility.GetParameter(request, "browse"));    //是否是浏览
	long select_id = DataUtility.StringToLong(HttpUtility.GetParameter(request, "select_id"));    //当前选择标识
	String select_name = HttpUtility.GetParameter(request, "select_name");                        //当前选择名称
	String callbackFunc = HttpUtility.GetParameter(request, "callbackFunc");                      //回调函数名
	if (browse && (callbackFunc == null || callbackFunc.isEmpty())) {
	  out.println("<div class='msg'>无法确定回调地址!</div>");
	  return ;
	}
	
	if (!browse) {
		// 菜单
		out.println("<ul class='menu'>");

		if (Right.IsCanCreate(right)) {
%>
    <li><a href="javascript:add()">新建</a></li>
    <script language="javascript">
      /**
       * 新建
       */
      function add() {
        var form = document.getElementById("form1");
        if (form != null) {
          form.innerHTML="";
  	  
          form.action = "add.jsp";
		  form.target="_self";
          
          var callbackURL = document.createElement("input");
          callbackURL.id = "<%= KEY_CALLBACK_URL %>";
          callbackURL.name = "<%= KEY_CALLBACK_URL %>";
          callbackURL.type = "hidden";
          callbackURL.value = "<%= request.getRequestURL().toString() %>";
          form.appendChild(callbackURL);
          
          form.submit();
        }
      }
    </script>
<%
		} // end if (Right.IsCanCreate(right))
		out.println("</ul>");
	} // end if (!browse)
%>

  <!-- 列表显示 -->
  <div class="list">
<%
	String order = HttpUtility.GetParameter(request, "order");                                //检索排列域名
	boolean desc = DataUtility.StringToBoolean(HttpUtility.GetParameter(request, "desc"));    //是否倒叙
	int count = 20;                                                                 //一页显示的记录数
	int list_page = DataUtility.StringToInt(HttpUtility.GetParameter(request, "list_page"));    //页号
	if (list_page <= 0)
		list_page = 1;
	int skip = (list_page - 1) * count;
	Object[] obs = op.search("", order, desc, skip, count);
	if (obs == null) {
		String msg = op.getHost().getForegroundMessage(true);
		if (msg != null)
			out.println("<div class='msg'>" + msg.replaceAll("\n", "<br/>") + "</div>");
		
		return ;
	} // end if (result != null) else

	if (obs.length == 0) {
		// 无数据
		out.println("<div class='msg'>没有数据!</div>");
		return ;
	}
	
	boolean title = false;
	for (int i = 0; i < obs.length; i++) {
		if (obs[i] == null)
			continue;
		
		StringHash info = (StringHash) obs[i];
		Field[] fields = op.getFields(op.getObject(),Command.COMMAND_LIST, info,true);
		if (fields == null || fields.length <= 0)
			continue;

		if (!title) {
			out.println("<ul id='listorder'>");
			out.println("<li class='first-column'></li>");
			for (int j = 0; j < fields.length; j++) {
				if (fields[j] == null)
					continue;
			
				out.print("<li class='" + fields[j].getName() + "'>");
				out.print("<a href=\"#\" onclick=\"list('" + list_page + "', '" + fields[j].getName() + "', '" + !desc + "')\"><span>" + fields[j].getDisplay() + "</span></a>");
				out.println("</li>");
			}
			out.println("</ul>");
			
			title = true;
		} // end for (int j = 0; j < fields.length; j++)

		Device device = new Device(info);
		long objectId = device.getId();
		out.println("<ul class='item'>");
		out.println("<li class='first-column'>");
		if (browse) {
			// 浏览。显示单选按钮
			out.print("<input type='radio' id='select_info' name='select_info' value='");
			out.print(objectId);
			out.print("' onclick=\"browseSelect('");
			out.print(objectId);
			out.print("', '");
			out.print(device.getName());
			out.print("')\"");
			if (select_id == objectId)
				out.println(" checked='checked'");
			out.print("/>");
		}
		out.println("</li>");
		int infoRight = device.getRight(op.getHost());
		// 信息
		for (int k = 0; k < fields.length; k++) {
			if (fields[k] == null || fields[k].getName() == null)
				continue;
			
			out.println("<li class='" + fields[k].getName() + "'>");
			
			String name = fields[k].getName();
			if (!browse && name.equals(op.getObject().getNameIdentity())
					&& objectId > 0 && Right.IsCanRead(infoRight))
				out.print("<a href='#' onclick=\"action('read', '" + objectId + "')\">" + fields[k].getShow() + "</a>");
			else
				out.println(fields[k].getShow());
				
			out.println("</li>");
		} // end for (int j = 0; j < fields.length; j++)
		out.println("</ul>");
	} // end for (int i = 0; i < records.length; i++)

	// 总数
	int total = op.getTotal(op.getCondition());
	if (total > count) {
%>
    <!-- 翻页菜单 -->
    <ul class="menu">
<%
		if (list_page > 1) {
%>
      <li><a href="#" onclick="list('1', '<%= order %>', '<%= desc %>')">首页</a></li>
      <li><a href="#" onclick="list('<%= list_page - 1 %>', '<%= order %>', '<%= desc %>')">上一页</a></li>
<%
		}
		
		int last = total / count;
		if ((last * count) < total)
			last++;
		if (list_page < last) {
%>
      <li><a href="#" onclick="list('<%= list_page + 1 %>', '<%= order %>', '<%= desc %>')">下一页</a></li>
      <li><a href="#" onclick="list('<%= last %>', '<%= order %>', '<%= desc %>')">末页</a></li>
<%
		}
%>
      <li>
        <select onchange="list(this.value, '<%= order %>', '<%= desc %>')">
<%
		for (int i = 1; i <= last; i++) {
			out.print("<option value='" + i + "'");
			if (i == list_page)
				out.print(" selected");
			out.println(">" + i + "</option>");
		}
%>
        </select>
      </li>
<%
	} // end if (total > count)
%>
    <!-- end .menu -->
    </ul>
  <!-- end .list -->
  </div>
  
<%
	if (browse) {
		// 浏览页面的选择按钮
		out.println("<ul class='button'>");
		out.println("<li>");
		out.println("<input type='button' onclick='browseOk()' value='确定'/>");
		out.println("<input type='button' onclick='javascript:window.close()' value='关闭'/>");
		out.println("</li>");
		out.println("</ul>");
	} // end if (browse) 浏览页按钮
%>
</body>

<script language="javascript">
<%
	if (browse) {
		// 浏览页面js
%>
  var selectedId;
  var selectedName;
<%
		if (select_id > 0)
			out.println("selectedId='" + select_id + "';");
		if (select_name != null && !select_name.isEmpty())
			out.println("selectedName='" + select_name + "';");
%>
  /**
   * 浏览页面选择信息
   */
  function browseSelect(id, name) {
    selectedId = id;
    selectedName = name;
  }

  /**
   * 将选中的选项值传回调用页面
   */
  function browseOk() {
    if (selectedId && selectedName)
      window.opener.<%= callbackFunc %>(selectedId, selectedName);
    close();
  }
  
<%
		if (total == 1) {
			// 只有一条记录，自动选择
			if (obs != null && obs.length == 1 && obs[0] != null) {
				Device device = new Device((StringHash) obs[0]);
				out.println("browseSelect('" + device.getId() + "', '" + device.getName() + "');");
			}
			out.println("browseOk();");
		} // end if (total == 1)
	
	} else {
		// 列表页面js
%>
    /**
     * 操作
	 * 
	 * @param method
	 *           操作名称
	 * @param id
	 *           对象标识
     */
    function action(method, id) {
      var form = document.getElementById("form1");
      if (form == null)
	    return ;

      form.innerHTML="";

	  if (method=="read") {
	    form.action="read.jsp";
	    form.target="_self";
	  } else if (method=="edit") {
	    form.action = "edit.jsp";
	    form.target="_self";
	  } else if (method=="remove") {
        var remove = window.confirm("是否删除?");
        if (!remove)
          return ;
        form.action = "remove.jsp";
	    form.target="_self";
	  } else
	    return ;

      var device = document.createElement("input");
      device.id = "device_id";
      device.name = "device_id";
      device.type = "hidden";
      device.value = id;
      form.appendChild(device);
	  
      var callbackURL = document.createElement("input");
      callbackURL.id = "<%= KEY_CALLBACK_URL %>";
      callbackURL.name = "<%= KEY_CALLBACK_URL %>";
      callbackURL.type = "hidden";
      callbackURL.value = "<%= request.getRequestURL().toString() %>";
      form.appendChild(callbackURL);
	  
      form.submit();
    }
<%
	} // end if (browse) else
%>
  
  /**
   * 列表
   * 
   * @param page
   *           跳转到页号
   * @param order
   *           排列域
   * @param desc
   *           是否倒叙
   */
  function list(page, order, desc) {
    var form = document.getElementById("form1");
    if (form == null)
      return;
    form.innerHTML="";
    form.action = "";

    //页号
    if (page != null) {
      var p = document.createElement("input");
      p.id = "list_page";
      p.name = "list_page";
      p.type = "hidden";
      p.value = page;
      form.appendChild(p);
    }
    //排列域
    if (order != null) {
      var o = document.createElement("input");
      o.id = "order";
      o.name = "order";
      o.type = "hidden";
      o.value = order;
      form.appendChild(o);
    }
    //是否倒叙
    if (desc != null) {
      var d = document.createElement("input");
      d.id = "desc";
      d.name = "desc";
      d.type = "hidden";
      d.value = desc;
      form.appendChild(d);
    }
<%
	Enumeration<String> e = request.getParameterNames();
	if (e != null) {
		while (e.hasMoreElements()) {
			String key = e.nextElement();
			if (key == null || key.isEmpty() || key.equals("list_page")
					|| key.equals("order") || key.equals("desc"))
				continue;
			
			String value = HttpUtility.GetParameter(request, key);
			if (value != null) {
%>
    var h = document.createElement("input");
    h.id = "<%= key %>";
    h.name = "<%= key %>";
    h.type = "hidden";
    h.value = "<%= value %>";
    form.appendChild(h);
<%
			}
		}
	} // end if (e != null)

    if (browse) {
%>
	//是否浏览
	var b=document.createElement("input");
    b.id="browse";
    b.name="browse";
    b.type="hidden";
    b.value="<%= browse %>";
    form.appendChild(b);
	
    //当前选中标识
    if(selectedId) {
      var sid=document.createElement("input");
      sid.id="select_id";
      sid.name="select_id";
      sid.type="hidden";
      sid.value=selectedId;
      form.appendChild(sid);
    }

    //当前选择名称
    if (selectedName) {
      var sname=document.createElement("input");
      sname.id="select_name";
      sname.name="select_name";
      sname.type="hidden";
      sname.value=selectedName;
      form.appendChild(sname);
    }
<%
	} // end if (browse) js
%>
    form.submit();
  }
</script>
</html>
