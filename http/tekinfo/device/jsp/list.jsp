<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8"%>
<!--
说明：Device的列表程序
参数：browse -- 0表示普通列表，1表示浏览列表
     order -- 排序
     desc -- 是否倒序
     skip -- 查询的起始位置，默认为0。
     count -- 一次显示数量。
     quick-search  -- 快速检索的输入内容。
-->
<html xmlns="http://www.w3.org/1999/xhtml"><!-- #BeginTemplate "/Templates/list.dwt.jsp" --><!-- DW6 -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel= "Shortcut Icon"   href= "../../../../favicon.ico"/>
<link rel= "Bookmark"   href= "../../../../favicon.ico"/>
<script language="javascript" type="text/javascript" src="../../../common/jquery/1.8.1/jquery-1.8.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../../../common/tek/js/refresh.js"></script>
<!-- #BeginEditable "head" -->
<!-- 自己的head -->
<meta name="keywords" content="device,server,manager,list,端口" />
<meta name="description" content="device,server,manager,list,端口" />
<link rel="stylesheet" type="text/css" href="../../../common/tek/css/list.css" />
<!--[if IE]> <link href="../../common/css/listIE.css" rel="stylesheet" type="text/css" media="screen" /><![endif]-->
<link rel="stylesheet" type="text/css" href="list.css" />

<title>端口设备</title>
<!-- #EndEditable -->
</head>

<body>
<%@ page import="net.tekinfo.http.ObjectPrint" %>
<%@ page import="net.tekinfo.http.Parameters" %>
<%@ page import="net.tekinfo.object.ObjectOp" %>
<%@ page import="net.tekinfo.remoting.Field" %>
<%@ page import="net.tekinfo.remoting.ObjectRm" %>
<%@ page import="net.tekinfo.remoting.ObjectResult" %>
<%@ page import="net.tekinfo.remoting.Record" %>
<%@ page import="net.tekinfo.system.Right" %>
<%@ page import="net.tekinfo.util.DataUtility" %>
<%@ page import="net.tekinfo.util.StringHash" %>

<%@ page import="java.util.Enumeration" %>
<!-- #BeginEditable "import" -->
<!-- 自己的import类 -->
<%@ page import="net.tekinfo.remoting.resource.DeviceRm" %>
<%@ page import="net.tekinfo.resource.Device" %>
<!-- #EndEditable -->

  <div id="main">
<%@ include file="../../../config.jsp" %>
<!-- #BeginEditable "include" -->
<!-- 包含的jsp -->
<!-- #EndEditable -->

<%
	Parameters parameters = null;
	ObjectRm remoting = null;
%>
<!-- #BeginEditable "init" -->
<!-- 初始化信息 -->
<%
	parameters = new Parameters(token.getTokenCode(), clientIp, request);
	remoting = new DeviceRm();
%>
<!-- #EndEditable -->
<%
	final int PAGE_COUNT = 20;    //默认一页显示数量
	final String PARA_SELECTED_ID = "selected-id";    //选中的对象标识
	
	StringHash p = parameters.getParameters();
	
	String quickSearch = parameters.getParameter(ObjectOp.PARA_QUICKSEARCH);
	boolean isBrowse = DataUtility.StringToBoolean(parameters.getParameter("browse")); // 是否是浏览
	String browseField = parameters.getParameter("browse-field"); // 浏览的域名
	
	int skip = DataUtility.StringToInt(parameters.getParameter(ObjectOp.PARA_SKIP));
	int count = DataUtility.StringToInt(parameters.getParameter(ObjectOp.PARA_COUNT));
	String order = parameters.getParameter(ObjectOp.PARA_ORDER);
	boolean desc = DataUtility.StringToBoolean(parameters.getParameter(ObjectOp.PARA_DESC));
%>
<!-- #BeginEditable "param" -->
<!-- 定义其他参数 -->
<!-- #EndEditable -->
<%
	if(count == 0){
		count = PAGE_COUNT;
		p.put(ObjectOp.PARA_COUNT,count);
	}

	ObjectResult result = null;
%>
<!-- #BeginEditable "result" -->
<!-- 取得result -->
<%
	result = remoting.getList(token.getTokenCode(), clientIp, parameters.getParameters(), quickSearch,
			order, desc, skip, count);
%>
<!-- #EndEditable -->	
<%	if (result == null) {
		out.println("<div class='msg'>操作失败!</div>");
		return;
	} // end if (result == null)

	int total = DataUtility.StringToInt(result.getValue());    //信息总数
	int right = result.getRight();    //权限
%>
<!-- #BeginEditable "url" -->
<!-- 添加自己的url参数 -->
<!-- #EndEditable -->

    <!-- 自定义form -->
    <form id="form1" name="form1" method="post" accept-charset="<%=charset%>" style="display:none"></form>

    <script language="javascript">
      var selected=new Array();    //选中的对象标识
      var allIds=new Array();    //当前页的所有对象标识
<%
	String[] sel = DataUtility.StringToArray(parameters.getParameter(PARA_SELECTED_ID), ";");
	if (sel != null && sel.length > 0) {
		for (String str : sel) {
			if (str != null && !str.isEmpty())
				out.println("selected.push('" + str + "');");
		}
	} // end if (sel != null && sel.length > 0)
%>
	</script>
<%
	// 刷新form
	ObjectPrint objectPrint = new ObjectPrint();
	String refreshForm = objectPrint.printRefreshForm(parameters, charset, PARA_SELECTED_ID);
	if (refreshForm != null)
		out.println(refreshForm);
%>

    <div id="menu">
<!-- #BeginEditable "search" -->
<!-- 检索框 -->
<!-- #EndEditable -->
  
      <!-- 菜单 -->
<%
	if (!isBrowse) {
		// 非浏览，显示菜单
%>
      <ul class="menu">
<!-- #BeginEditable "menu" -->
<!-- 菜单 -->
<%
	boolean delete = Right.IsCanDelete(right);
	
	if (Right.IsCanCreate(right)) {
%>
    <li class="menuout" onmouseover="this.className='menuover'" onmouseout="this.className='menuout'" onclick="add();"><a href="#">新建</a></li>
    <script language="javascript">
      /**
       * 新建
       */
      function add() {
        var form = document.getElementById("form1");
        if (form != null) {
          form.innerHTML="";
          form.target="_blank";
          form.action = "add.jsp";
          if(navigator.userAgent.indexOf('MSIE')>=0)
		    document.charset="<%=charset %>";
          
          var showClose = document.createElement("input");
          showClose.id = "<%= KEY_SHOW_CLOSE %>";
          showClose.name = "<%= KEY_SHOW_CLOSE %>";
          showClose.type = "hidden";
          showClose.value = "1";
          form.appendChild(showClose);

          var refreshOpener = document.createElement("input");
          refreshOpener.id = "<%= KEY_REFRESH_OPENER %>";
          refreshOpener.name = "<%= KEY_REFRESH_OPENER %>";
          refreshOpener.type = "hidden";
          refreshOpener.value = "1";
          form.appendChild(refreshOpener);
  
          form.submit();
        }
      }
	</script>
<%
	} // end if (Right.IsCanCreate(right))

	if (delete) {
%>
        <li class="menuout" onMouseOver="this.className='menuover'" onMouseOut="this.className='menuout'" onclick="removeList();"><a href="#">删除</a></li>
        <script language="javascript">
          /**
           * 删除
           */
          function removeList() {
            var form = document.getElementById("form1");
            if (form == null)
              return;

            var remove = window.confirm("是否删除?");
            if (!remove)
              return ;
 
            form.innerHTML="";
            form.action = "removeList.jsp";
            form.target="_self";
            if(navigator.userAgent.indexOf('MSIE')>=0)
              document.charset="<%= charset %>";

            var ids=document.createElement("input");
            ids.id = "object-ids";
            ids.name = "object-ids";
            ids.type = "hidden";
	        var selvalue="";
            var delim=false;
            for (var i=0; i<selected.length; i++) {
              if (selected[i]) {
                if (delim)
                  selvalue+=";";
			    else
                  delim=true;
	            selvalue+=selected[i];
              }
	        }
            if (selvalue.length <=0) {
              alert("没有选择删除信息!");
	          return ;
            }
            ids.value = selvalue;
            form.appendChild(ids);

            var callbackURL = document.createElement("input");
            callbackURL.id = "<%= KEY_CALLBACK_URL %>";
            callbackURL.name = "<%= KEY_CALLBACK_URL %>";
            callbackURL.type = "hidden";
            callbackURL.value = "<%= request.getRequestURL().toString() %>";
            form.appendChild(callbackURL);

            var callbackParams = document.createElement("input");
            callbackParams.id = "<%= KEY_CALLBACK_PARAMS %>";
            callbackParams.name = "<%= KEY_CALLBACK_PARAMS %>";
            callbackParams.type = "hidden";
            callbackParams.value = "";
            form.appendChild(callbackParams);

            form.submit();

            selected.length=0;
            var allElem=document.getElementById("selectAll");
            if (allElem) {
              allElem.checked="";
              sel(allElem);
            }
          }
        </script>
<%
	} // end if (delete)
%>
        <li class="menuout" onMouseOver="this.className='menuover'" onMouseOut="this.className='menuout'" onclick="refreshWithWaiting('<%= charset %>');"><a href="#">刷新</a></li>
<!-- #EndEditable -->
      <!-- end .menu -->
      </ul>
<%
	} // end if (!isBrowse)
%>
    <!-- end #menu -->
    </div>
<!-- #BeginEditable "option" -->
<!-- 添加自己的选项内容 -->
<!-- #EndEditable -->
    <div id="listitem">
    <!-- 列表 -->
<%
	if (result.getCode() == Result.RESULT_OK) {
		Record[] records = result.getRecords();
		
		if (records != null && records.length > 0) {
			boolean isFirst = true;
			
			for (int n = 0; n < records.length; n++) {
				if (records[n] == null)
					continue;
				
				long id = records[n].getId();
				String name = records[n].getName();

				Field[] fields = records[n].getFields();
				if (fields != null) {
					if(isFirst){
						//输出标题栏
						out.println("<ul id='listorder'>");
						out.print("<li class='first-column'>");
%>
<!-- #BeginEditable "first-title" -->
<!-- 第一列列名标题行显示内容 -->
&nbsp;&nbsp;
<!-- #EndEditable -->
<%
						out.println("</li>");
						
						// 选择框
						if (!isBrowse) {
							out.println("<li class='selectinfo' onclick='selParent(this);'>");
							out.println("<input type='checkbox' id='selectAll' name='selectAll' value='0' onclick='sel(this);'/>");
							out.println("</li>");
						}
						
						// 列名
						for (Field field : fields) {
							if (field == null || field.getName() == null)
								continue;
						
							String fieldName = field.getName();
							if (fieldName == null || fieldName.isEmpty())
								continue;
%>
<!-- #BeginEditable "title-field-name" -->
<!-- 判断域名 -->
<%
							if (fieldName == null)
								continue;
%>
<!-- #EndEditable -->
<%
							out.print("<li class='" + fieldName + "'>");
%>
<!-- #BeginEditable "column-name" -->
<!-- 列名 -->
<%
							out.print("<a href=\"javascript:list('" + skip + "', ");
							if(count > 0 && count != PAGE_COUNT)
								out.print("'" + count + "'");
							else
								out.println("null");
							out.print(", '"+ fieldName + "', '");
							if (fieldName != null && fieldName.equals(order))
								out.print(!desc);
							else
								out.print(desc);
							out.print("');\">");
							out.print("<span>" + field.getDisplay() + "</span>");
							out.println("</a>");
%>
<!-- #EndEditable -->
<%
							out.println("</li>");
						} //end for (Field field:fields)
						out.print("<li class='last-column'>");
%>
<!-- #BeginEditable "last-title" -->
<!-- 最后一列列名标题行显示内容 -->
&nbsp;&nbsp;
<!-- #EndEditable -->
<%
						out.println("</li>");
						out.println("</ul>");
						isFirst = false;
					} //if(isFirst)
					
					out.print("<ul id='info_");
					out.print(id);
					out.print("' class='");
					if ((n % 2) == 0)
						out.print("item1");
					else
						out.print("item2");
					out.println("' onclick='clickRow(this);'>");
					
					out.print("<li class='first-column'>");
%>
<!-- #BeginEditable "first-item" -->
<!-- 第一列数据行显示内容 -->
&nbsp;&nbsp;
<!-- #EndEditable -->
<%
					out.println("</li>");

                    // 选择框
					if (!isBrowse) {
						out.println("<li class='selectinfo' onclick='selParent(this, event);'>");
						out.print("<input type='checkbox' id='select" + id + "' name='select" + id + "' value='" + id + "' onclick='sel(this, event);'");
						if (sel != null && sel.length > 0) {
							for (String str : sel) {
								long lid = DataUtility.StringToLong(str);
								if (lid == id)
									out.print(" checked='checked'");
							}
						}
						out.println("/>");
						out.println("</li>");
					} // end if (!isBrowse)
					
					for (int i = 0; i < fields.length; i++) { //输出内容
						if (fields[i] == null)
							continue;

						String fieldName = fields[i].getName();
						if (fieldName == null || fieldName.isEmpty())
							continue;
%>
<!-- #BeginEditable "info-field-show" -->
<!-- 显示数据内容 -->
<%
						out.print("<li class='" + fieldName + "'>");
						boolean link = false;    // &nbsp;
						
						if (fieldName.equals(Device.FIELD_NAME)) {
							// fieldName为读取/浏览域
							link = true;
							
							out.print("<a");
							if (isBrowse) {
								out.print(" onclick=\"browse('");
								out.print(id);
								out.print("', '");
								out.print(name);
								out.print("');\"");
							} else {
								out.print(" onclick=\"javascript:window.open('read.jsp?");
								out.print(Device.FIELD_ID);
								out.print("=");
								out.print(id);
								out.print("&");
								out.print(Device.FIELD_NAME);
								out.print("=");
								out.print(name);
								out.print("&");
								out.print(KEY_SHOW_CLOSE);
								out.print("=1');\"");
							}
							out.print(">");
						}
						
						// 输出显示值
						String s = fields[i].getShow();
						if(s == null || s.isEmpty())
							s = "&nbsp;&nbsp;";
						out.print(s);
						
						if(link)
							out.println("</a>");

						// 记录当前单元格的值。id="info标识+字段名"
						out.print("<input type='hidden' id='");
						out.print(id);
						out.print(fieldName);
						out.print("' value='");
						out.print(fields[i].getValue());
						out.println("'/>");
						
						out.println("</li>");
%>
<!-- #EndEditable -->
<%
					} //end for (int i = 0; i < fields.length; i++)

					out.print("<li class='last-column'>");
%>
<!-- #BeginEditable "last-item" -->
<!-- 最后一列数据行显示内容 -->
&nbsp;&nbsp;
<!-- #EndEditable -->
<%
					out.println("</li>");
					out.println("</ul>");
				} //end if (fields!=null)

			} // end for (int n = 0; n < records.length; n++)
			
			// 设置js当前页的info标识
			if (!isBrowse) {
				out.println("<script language='javascript'>");
				for (Record record : records) {
					if (record != null)
						out.println("allIds.push('" + record.getId() + "');");
				} // end for (Record record : records)
				out.println("</script>");
			}
%>
<!-- #BeginEditable "browse" -->
<!-- 选择浏览信息的操作 -->
    <script language="javascript" type="text/javascript">
      /**
       * 选择地址
       */
      function browse(id, name) {
        window.opener.selectDevice(id, name);
      }
	</script>
<!-- #EndEditable -->
<%
		} else {
			out.println("<div class='msg'>没有数据!</div>");
		} // end if (records != null && records.length > 0) else
	} // end if (result != null && result.getCode() == Result.RESULT_OK
	else
	{
		out.print("<div class='msg'>");
		out.print(result.getCode());
		out.print(" : ");
		out.print(result.getMessage());
		out.println("</div>");
	}	
%>
    <!-- end.listitem-->
    </div>
    
    <!-- 列表信息数 -->
<%
	if (total > 0) {
%>
    <div id="list-count">
      <%=skip+1%>/<%=total%>
    <!-- end #list-count --></div>
<%
	} // end if (total > 0)
%>
    
    <!-- 翻页按钮 -->
    <div id="turn">
      <ul class="menu">
<%
  	if(total > count && skip > 0) {
		// 首页
		out.print("<li><a href=\"javascript:list(");
		out.print("'0',");
		if(count > 0)
			out.print("'" + count + "'");
		else
			out.print(PAGE_COUNT);
		out.print(", '" + order + "', '" + desc + "');\"");
    	out.println(">首页</a></li>");

		out.print("<li><a href=\"javascript:list(");
		int prevskip = 0;
		if(skip > count)
			prevskip = skip - count;
		out.print("'" + prevskip + "',");
		if(count > 0)
			out.print("'" + count + "'");
		else
			out.print(PAGE_COUNT);
		out.print(", '" + order + "', '" + desc + "');\"");
    	out.println(">上一页</a></li>");
	}
	
	if(total > count && count > 0 && total > (count + skip)) {
		// 下一页
		out.print("<li><a href=\"javascript:list(");
		out.print("'" + (skip + count) + "',");
		if(count > 0)
			out.print("'" + count + "'");
		else
			out.print(PAGE_COUNT);
		out.print(", '" + order + "', '" + desc + "');\"");
    	out.println(">下一页</a></li>");

		// 末页
		out.print("<li><a href=\"javascript:list(");
		if (count > 0) {
			if ((total%count) == 0)
				out.print("'" + (total - count) + "',");
			else
				out.print("'" + ((total / count) * count) + "',");
		} else
			out.print("'" + (((total - 1) / PAGE_COUNT) + 1) + "',");
		if(count > 0)
			out.print("'" + count + "'");
		else
			out.print(PAGE_COUNT);
		out.print(", '" + order + "', '" + desc + "');\"");
    	out.println(">末页</a></li>");
	}
%>
      <!-- end.menu-->
      </ul>
    <!-- end .turn -->
    </div>
    
    <script language="javascript" type="text/javascript">
      /**
       * 列表
       * 
       * @param skip
       *           条数
       * @param count
       *           记录数
       * @param order
       *           排列域
       * @param desc
       *           是否倒叙
       */
      function list(skip, count, order, desc) {
        var form = document.getElementById("form1");
        if (form == null)
          return;
	
        form.innerHTML="";
	 
        form.action="<%=request.getRequestURI()%>";
	    form.target="_self";
        if(navigator.userAgent.indexOf('MSIE')>=0)
          document.charset="<%=charset %>";

        //skip
        if (skip) {
          var skipElem = document.createElement("input");
          skipElem.id = "<%= ObjectOp.PARA_SKIP %>";
          skipElem.name = "<%= ObjectOp.PARA_SKIP %>";
          skipElem.type = "hidden";
          skipElem.value = skip;
          form.appendChild(skipElem);
        }
        //count
        if (count) {
          var countElem = document.createElement("input");
          countElem.id = "<%= ObjectOp.PARA_COUNT %>";
          countElem.name = "<%= ObjectOp.PARA_COUNT %>";
          countElem.type = "hidden";
          countElem.value = count;
          form.appendChild(countElem);
        }
        //order
        if (order) {
          var orderElem = document.createElement("input");
          orderElem.id = "<%= ObjectOp.PARA_ORDER %>";
          orderElem.name = "<%= ObjectOp.PARA_ORDER %>";
          orderElem.type = "hidden";
          orderElem.value = order;
          form.appendChild(orderElem);
        }
        //desc
        if (desc) {
          var descElem = document.createElement("input");
          descElem.id = "<%= ObjectOp.PARA_DESC %>";
          descElem.name = "<%= ObjectOp.PARA_DESC %>";
          descElem.type = "hidden";
          descElem.value = desc;
          form.appendChild(descElem);
        }
		
		//select-id
        var selectElem = document.createElement("input");
        selectElem.id = "<%= PARA_SELECTED_ID %>";
        selectElem.name = "<%= PARA_SELECTED_ID %>";
        selectElem.type = "hidden";

		var selvalue="";
		var delim=false;
		for (var i=0; i<selected.length; i++) {
          if (selected[i]) {
            if (delim)
              selvalue+=";";
			else
              delim=true;
			selvalue+=selected[i];
          }
		}
        selectElem.value = selvalue;
        form.appendChild(selectElem);
<%= objectPrint.printJSInputParameters(p, parameters, ObjectOp.PARA_SKIP, ObjectOp.PARA_COUNT, ObjectOp.PARA_ORDER, ObjectOp.PARA_DESC, PARA_SELECTED_ID) %>
        form.submit();
      }
	  
	  /**
	   * 选择信息
	   * 
	   * @param check
	   *           check组件。
	   */
      function selParent(elem, e) {
        if(!elem)
          return;

        var children=elem.getElementsByTagName("input");
        if(children && children.length>0) {
          for(var i in children) {
            if(children[i] && children[i].type=="checkbox") {
              if(children[i].checked)
                children[i].checked="";
              else
                children[i].checked="checked";
              sel(children[i], e);

              break;
            }
          }
        }
      }          

      /**
	   * 选择信息
	   * 
	   * @param check
	   *           check组件。
	   */
	  function sel(check, e) {
        if (!check)
          return;

        if(check.value=="0") {
          //全部

		  for (var i=0; i<allIds.length; i++) {
			if (!allIds[i])
			  continue;

            var index=isArrayContain(selected, allIds[i]);
			if (check.checked) {
			  if (index<0)
			    selected.push(allIds[i]);
              var inp=document.getElementById("select"+allIds[i]);
			  if (inp)
			    inp.checked="checked";

            } else {
			  if (index>=0)
			    delete selected[index];
              var inp=document.getElementById("select"+allIds[i]);
			  if (inp)
			    inp.checked="";
			}
		  } // end for (var i=0; i<allIds.length; i++)

		} else {
			// 指定info
            var index=isArrayContain(selected, check.value);
			if (check.checked) {
			  if (index<0)
			    selected.push(check.value);

            } else {
			  if (index>=0)
			    delete selected[index];
			}
		} // end if(check.value=="0") else
		
	    if (e && e.stopPropagation) {
          e.stopPropagation();
		} else
          window.event.cancelBubble=true;
	  }
	  
	  /**
	   * array数组中是否包含elem元素。
	   *
	   * @param array
	   *           数组
	   * @param elem
	   *           元素
	   * @return 如果包含，返回数组下标，否则返回-1。
	   */
	  function isArrayContain(array, elem) {
        if (!array || !elem)
		  return -1;
		
		for (var i=0; i<array.length; i++) {
          if (array[i]==elem)
		    return i;
		}
		
		return -1;
	  }
    </script>
  
<!-- #BeginEditable "other" -->
<!-- 其他内容 -->
<!-- #EndEditable -->
  <!-- end #main -->
  </div>
<%@ include file="../../../common/tek/jsp/shield.jsp" %>
</body>
<!-- #EndTemplate --></html>
