/***************************************************************************************************
 * 说明：【【【【【为了兼容，暂时保留。不建议使用，后期删除】】】】】
 *   该JS文件用于使用macadmin-5.0样式生成的标准化列表页面。
 * 要求：
 *   需要加载common.js、dataUtility.js、turn-page.js、mac-common.js
 *-------------------------------------------------------------------------------------------------
 * 页面需要初始化的参数：
 * tek.macList公共参数&函数：
 *     var tek.macList.ajaxURL - 取得列表信息的URL路径。例如："../../tobject"
 *     var tek.macList.params - 用于Ajax操作取得列表信息的参数。例如：
 *                              params={};
 *                              params["objectName"]="SubjectTag";
 *                              params["action"]="getList";
 *                              params["skip"]=0;
 *                              params["count"]=PAGE_COUNT;
 *     var tek.macList.columns - 显示列数字。例如：
 *                               columns=new Array();    //显示列
 *                               columns.push('tag_code');
 *                               columns.push('tag_name');
 *                               columns.push('tag_type');
 *     var tek.macList.searchs - 可快速检索的域名数组
 *     var tek.macList.selected - 当前页选中的列表信息标识数组。
 *     var tek.macList.allIds - 当前页所有列表信息标识数组。
 *------------------------------------------------------------------------------------------------
 * 页面需要实现的操作和函数：
 *     function tek.macList.appendListOperation(record,data,sb); - 生成指定行信息的“操作”按钮。如果没有操作，可以不实现该函数。
 *     function tek.macList.refreshList() - 自定义刷新页面。如果不实现。自动调用默认函数。
 *------------------------------------------------------------------------------------------------
 * 自定义列表根据需要，可以自定义下面函数：
 *     function tek.macList.appendCustomListField(field,record,data,sb); - 自定义列单元格显示。如果不实现，自动调用默认函数。
 *     function tek.macList.showCustomListRecords(records,data); - 自定义列表显示样式。
 *     function tek.macList.showCustomListTurn(data) - 自定义翻页按钮显示样式。
 *     function tek.macList.customIsCanOrder(fieldname) - 自定义指定列是否支持排序。如果不实现，默认全部支持。
 *     function tek.macList.customOtherOperation(data); - 自定义其他操作。在生成列表完成后调用
 *------------------------------------------------------------------------------------------------
 * 公共参数&函数：
 *     var tek.macList.PAGE_COUNT - 默认一页显示数量。
 *     var tek.macList.GROUP_COUNT - 默认一次显示页数。
 *     var tek.macList.params - 当前检索条件对象。
 *                              params["skip"]=当前跳过信息数
 *                              params["count"]=一次取得信息最大数
 *                              params["order"]=当前排序列
 *                              params["desc"]=当前是否倒序
 *     var tek.macList.selected - 当前选中的信息标识
 *     var tek.macList.allIds - 当前页的所有信息标识
 *     function tek.macList.getList(); - 使用当前设置的参数重新生成列表信息。
 *     function tek.macList.quickSearch(text); - 快速查询包含text字符串的信息。
 *     function tek.macList.changeOrder(order); - 按指定列排序
 *     function tek.macList.quickSearchEnter(evt) - 快速检索文本框敲击键盘事件处理。（输入“回车”，执行快速检索操作）
 *     function tek.macList.removeInfo(id, name, ajaxParams) - 删除指定标识的信息
 *     function tek.macList.removeList(ajaxParams) - 批量删除选中的用户记录
 *
 ***************************************************************************************************/

var tek = window.tek || new Object();    //用于系统定义的静态方法或属性
tek.macList=new Object();    // 定义相关的参数、函数

tek.macList.PAGE_COUNT=10;    //默认一页显示数量
tek.macList.GROUP_COUNT=10;    // 默认一次显示组数

tek.macList.ajaxURL;    //取得列表信息的Servlet地址
tek.macList.params={};    // 当前参数
tek.macList.columns=new Array();    // 显示的域名数组
tek.macList.searchs=new Array();    // 快速查询字段数组
tek.macList.groupCount=tek.macList.GROUP_COUNT;    // 一组显示页数

tek.macList.ascendingPath=tek.common.getRelativePath()+"/http/images/view-sort-ascending.png";    // 正序图标路径
tek.macList.dascendingPath=tek.common.getRelativePath()+"/http/images/view-sort-descending.png";    // 到下图标路径

tek.macList.selected=new Array();    //选中的对象标识
tek.macList.allIds=new Array();    //当前页的所有对象标识

/**
 * 删除数据后，如果当前页没有数据，调整参数，显示前一页数据
 *
 * @param removeCount
 *            成功删除的数据条数
 */
tek.macList.removeCheck=function(removeCount){
  if(!removeCount)
    return;

  removeCount=parseInt(removeCount);
  if(removeCount<=0)
    return;

  if(tek.macList.allIds && tek.macList.allIds.length==removeCount && tek.macList.params["skip"]>0){
    // 显示前一页
    var preskip=tek.macList.params["skip"]-tek.macList.params["count"];
    if(preskip<0)
      preskip=0;
    tek.macList.params["skip"]=preskip;
  }
}

/**
 * 取得对象信息
 */
tek.macList.getList=function() {
  tek.macList.selected=new Array();
  tek.macList.allIds=new Array();
  
  if(!tek.macList.params)
    tek.macList.params={};
  
  if(typeof(tek.macList.showCustomListRecords)!="function"){
    var infoElem=document.getElementById("table-infos");
    if(infoElem)
      infoElem.innerHTML="";
  }
  
  var html="<div class='center'><img src='"+tek.common.getRelativePath()+"http/images/waiting-small.gif'/>&nbsp;正在获取数据...</div>";
  $("#table-msg").html(html);
  
  var params={};
  params["type"]="post";
  params["async"]=true;
  params["url"]=tek.macList.ajaxURL;
  params["params"]=tek.macList.params;
  params["success"]=function(data) {
      tek.macList.showData(data);
      
      // 自定义其他操作
      if(typeof(tek.macList.customOtherOperation)=="function")
        tek.macList.customOtherOperation(data);
  };
  params["error"]=function(data,message) {
      $("#table-msg").html(message);
  };
  tek.common.ajax2(params);
}

/**
 * 显示数据
 *
 * @param data
 *           数据结果
 */
tek.macList.showData=function(data) {
  // 操作成功
  // 清空原数据
  $("#table-msg").html("");
  
  var records=data["record"];
  if(typeof(tek.macList.showCustomListRecords)=="function")
    tek.macList.showCustomListRecords(records,data);
  else
    tek.macList.showListRecords(records,data);

  // 3、设置翻页按钮
  if((typeof tek.macList.showCustomListTurn)=="function"){
    // 自定义翻页按钮
    tek.macList.showCustomListTurn(data);
  }else{
    // 默认翻页按钮
    tek.macList.showDefaultListTurn(data);
  } // end else
}

/**
 * 列表形式显示数据
 *
 * @param records
 *           检索所有数据
 * @param data
 *           检索结果
 */
tek.macList.showListRecords=function(records,data) {
  if(!records) {
    $("#table-msg").html("没有数据!");
    return;
  }
  
  // 1、设置列名行
  if (records.length) {
    // 多条数据
    tek.macList.showListColumns(records[0]);
  } else {
    // 一条数据
    tek.macList.showListColumns(records);
  }

  // 2、设置排序
  for(var i in tek.macList.columns) {
    var elem=document.getElementById("img_"+tek.macList.columns[i]);
    if(!elem)
      continue;
    
    if(tek.macList.params["order"]==tek.macList.columns[i]){
      elem.style.display="";
     
      var desc=tek.macList.params["desc"];
      if(desc==1 || desc=="1" || desc=="true" || desc==true)
        elem.src=tek.macList.dascendingPath;
      else
        elem.src=tek.macList.ascendingPath;
    }else
      elem.style.display="none";
  } // end for(var i in columns)
  
  // 3、设置数据
  var elem=document.getElementById("table-infos");
  if(!elem)
    return;
  
  if (records.length) {
    // 多条数据
    for(var i in records)
      tek.macList.showListInfo(records[i],data,elem);
  } else {
    // 一条数据
    tek.macList.showListInfo(records,data,elem);
  }
}

/**
 * 显示列名
 *
 * @param record
 *           数据
 */
tek.macList.showListColumns=function(record) {
  var tr=document.getElementById("table-columns");
  if(!tr)
    return;
  
  if(tr.innerHTML.length>0){
    var elem=document.getElementById("select-all");
    if(elem)
      elem.checked="";
    //$("#select-all").attr("checked","");
    return;
  }
  //tr.innerHTML="";

  var sb=new StringBuffer();

  // 选择框
  sb.append("<th id='column-first-title' class='column-first' style='cursor:pointer' onMouseOver=\"tek.macList.columnMouseOver(this);\" onMouseOut=\"tek.macList.columnMouseOut(this);\" onClick='tek.macList.selParent(this);'>");
  sb.append("<input value=\"0\" id=\"select-all\" type=\"checkbox\" onclick=\"tek.macList.sel(this, event)\"/>");
  sb.append("</th>");
  
  if((typeof tek.macList.columns) != "object" || !tek.macList.columns || tek.macList.columns.length<=0) {
    // 未定义显示列，显示所有列
    for (var name in record) {
      if(record[name] && record[name].display)
        tek.macList.columns.push(record[name].name);
    }
  }
  
  for(var i in tek.macList.columns) {
    if(!tek.macList.columns[i])
      continue;
    
    var field=record[tek.macList.columns[i]];
    if(!field)
      continue;
    
    sb.append("<th id='column-");
    sb.append(tek.macList.columns[i]);
    sb.append("-title' class='column-");
    sb.append(tek.macList.columns[i]);
    sb.append("'");

    if ((typeof(tek.macList.customIsCanOrder)!="function") || tek.macList.customIsCanOrder(tek.macList.columns[i])) {
      sb.append(" style='cursor:pointer' onClick=\"tek.macList.changeOrder('");
      sb.append(tek.macList.columns[i]);
      sb.append("');\"");
    }
    sb.append(" onMouseOver=\"tek.macList.columnMouseOver(this);\" onMouseOut=\"tek.macList.columnMouseOut(this);\">");
    sb.append("<img height=\"20px\" src=\"\" id=\"img_");
    sb.append(tek.macList.columns[i]);
    sb.append("\"/>");
    sb.append(field.display);
    if(typeof(tek.macList.searchs)=="object"){
      for(var j = 0; j < tek.macList.searchs.length; j++){
        if(tek.macList.searchs[j] === field["name"]){
          sb.append("<i class='fa fa-search fa-search-th' title='该列可快速检索'></i>");
          break;
        }
      }
    }
    sb.append("</th>");
  }
  
  sb.append("<th id='column-last-title' class='column-last'>操作</th>");

  tr.insertAdjacentHTML('BeforeEnd', sb.toString());
}
  
/**
 * 添加一条列表数据
 *
 * @param record
 *           信息
 * @param data
 *           信息
 * @param parent
 *           显示信息的父元素
 */
tek.macList.showListInfo=function(record,data,parent) {
  var id=record.id;
  var name=record.name;

  // 设置allIds
  var exist=false;
  for(var i=0; i<tek.macList.allIds.length; i++){
    if(tek.macList.allIds[i]==id){
      exist=true;
      break;
    }
  }
  if(!exist)
    tek.macList.allIds.push(id);

  var sb=new StringBuffer();
  
  sb.append("<tr>");

  // 选择框
  sb.append("<td class='column-first' style='cursor:pointer' onclick='tek.macList.selParent(this, event);'>");
  sb.append("<input value='");
  sb.append(id);
  sb.append("' id='select");
  sb.append(id);
  sb.append("' type='checkbox' onclick='tek.macList.sel(this, event)'>");
  sb.append("</td>");

  // 列信息
  for(var i in tek.macList.columns)
    tek.macList.appendListField(record[tek.macList.columns[i]],record,data,sb);

  // 操作
  sb.append("<td class='column-last'>");
  if(typeof(tek.macList.appendListOperation)=="function")
    tek.macList.appendListOperation(record,data,sb);
  else
    sb.append("&nbsp;");
  sb.append("</td>");
  
  sb.append("</tr>");

  parent.insertAdjacentHTML('BeforeEnd', sb.toString());
}

/**
 * 添加列数据
 *
 * @param field
 *           列数据
 * @param record
 *           信息
 * @param data
 *           信息
 * @param sb
 *           标签字符串
 */
tek.macList.appendListField=function(field,record,data,sb) {
  if(!field)
    return;

  sb.append("<td class='column-");
  sb.append(field.name);
  sb.append("'>");

  if((typeof tek.macList.appendCustomListField)=="function"){
    // 自定义列信息
    tek.macList.appendCustomListField(field,record,data,sb);
  }else{
    tek.macList.appendDefaultListField(field,record,data,sb);
  } // end else

  sb.append("</td>");
}

/**
 * 添加普通列数据
 *
 * @param field
 *           列数据
 * @param record
 *           信息
 * @param data
 *           信息
 * @param sb
 *           标签字符串
 */
tek.macList.appendDefaultListField=function(field,record,data,sb){
  //模糊查询
  var fieldName=field.name;
  var show=field.show;

  var qs=decodeURIComponent(tek.macList.params["quick-search"]);
  if(qs && qs.length>0 && tek.macList.searchs && show && show.length>0){
    var arr=tek.dataUtility.stringToArray(qs," ");
    if(arr && arr.length>0){
      for (var j in tek.macList.searchs){
        if(fieldName!=tek.macList.searchs[j])
          continue;
        
        var rep=new Array();
        for(var k in arr) {
          var loc=-1;
          while((loc=show.toLowerCase().indexOf(arr[k].toLowerCase()))>=0) {
            var str=show.substring(0, loc)+"#";
            for(var m=0; m<(rep.length); m++)
              str+="*";
            str+="#"+show.substring(loc + arr[k].length);

            var s="<font color='#FF0000'>"+show.substring(loc, loc + arr[k].length)+"</font>";
            rep.push(s);

            show=str;
          }
        } // endfor(var k in arr)

        for(var n=0; n<rep.length; n++){
          var key="#";
          for(var m=0; m<n; m++)
            key+="*";
          key+="#";
          show=show.replace(key, rep[n]);
        }
        
        break;
      } // end for(var k in arr)
    } // end if(arr && arr.length>0)
  } // end if(qs && qs.length>0 && searchs && show.length>0)

  sb.append(show);
}

/**
 * 显示默认的列表翻页按钮
 *
 * @param data
 *           检索结果
 */
tek.macList.showDefaultListTurn=function(data) {
  var skip=tek.macList.params["skip"];
  if(!skip){
    skip=0;
    tek.macList.params["skip"]=skip;
  }

  var count=tek.macList.params["count"];
  if(!count){
    count=tek.macList.PAGE_COUNT;
    tek.macList.params["count"]=count;
  }

  tek.turnPage.show("page", skip, count, data.value, tek.macList.groupCount);
}

/**
 * 选择信息
 * 
 * @param elem
 *           checkbox的父节点。
 * @param e
 *           操作事件
 */
tek.macList.selParent=function(elem, e) {
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
        tek.macList.sel(children[i], e);

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
 * @param e
 *           操作事件
 */
tek.macList.sel=function(check, e) {
  if (!check)
    return;

  if(check.value=="0") {
    //全部
    for (var i=0; i<tek.macList.allIds.length; i++) {
      if (!tek.macList.allIds[i])
        continue;

      var index=tek.macList.isArrayContain(tek.macList.selected, tek.macList.allIds[i]);
      if (check.checked) {
        if (index<0)
          tek.macList.selected.push(tek.macList.allIds[i]);
        var inp=document.getElementById("select"+tek.macList.allIds[i]);
        if (inp)
          inp.checked="checked";

      } else {
        if (index>=0)
          delete tek.macList.selected[index];
        var inp=document.getElementById("select"+tek.macList.allIds[i]);
        if (inp)
          inp.checked="";
      }
    } // end for (var i=0; i<tek.macList.allIds.length; i++)

  } else {
    // 指定info
    var index=tek.macList.isArrayContain(tek.macList.selected, check.value);
    if (check.checked) {
      if (index<0)
        tek.macList.selected.push(check.value);
    } else {
      if (index>=0)
        delete tek.macList.selected[index];
    }
  } // end if(check.value=="0") else

  e = e ? e : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
  if (e && e.stopPropagation)
    e.stopPropagation();
  else if(window && window.event && window.event.cancelBubble)
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
tek.macList.isArrayContain=function(array, elem) {
  if (!array || !elem)
    return -1;

  for (var i=0; i<array.length; i++) {
    if (array[i]==elem)
      return i;
  }

  return -1;
}

/**
 * 换页
 *
 * @param id
 *           显示该翻页控件的标签id（用于区分多个翻页控件）
 * @param skip
 *           跳过记录数。
 */
tek.turnPage.turn=function(id, skip){
  tek.macList.params["skip"]=skip;
  tek.macList.getList();
}

/**
 * 快速检索
 *
 * @param text
 *           快速检索内容
 */
tek.macList.quickSearch=function(text){
  tek.macList.params["skip"]=0;
  tek.macList.params["quick-search"]=encodeURIComponent(text);

  tek.macList.getList();
}

/**
 * 按order列排序。
 *
 * @param order
 *           排序字段名
 */
tek.macList.changeOrder=function(order){
  if(tek.macList.params["order"]==order){
    var oldDesc=tek.macList.params["desc"];
    if(oldDesc==1 || oldDesc=="1" || oldDesc==true || oldDesc=="true")
      tek.macList.params["desc"]=0;
    else
      tek.macList.params["desc"]=1;
  }else
    tek.macList.params["desc"]=0;
  
  tek.macList.params["order"]=order;

  tek.macList.getList();
}

/**
 * 快速检索文本框敲击键盘事件处理。（如果输入“回车”，执行快速检索操作）
 *
 * @param evt
 *           键盘敲击事件 
 */
tek.macList.quickSearchEnter=function(evt) {
  evt = evt ? evt : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
  var key = evt.keyCode ? evt.keyCode : evt.which;
  if (key == 13) {
    tek.macList.quickSearch($("#quickSearchKey").val());
    if(window && window.event && window.event.returnValue)
      window.event.returnValue=false;
  }
  if (evt && evt.stopPropagation)
    evt.stopPropagation();
  else if(window && window.event && window.event.cancelBubble)
    window.event.cancelBubble=true;
}

/**
 * 鼠标移入列标签
 *
 * @param elem
 *           列元素
 */
tek.macList.columnMouseOver=function(elem){
  if(elem)
    $("."+elem.className).css("background", "#f3f3f3");
}

/**
 * 鼠标移出列标签
 *
 * @param elem
 *           列元素
 */
tek.macList.columnMouseOut=function(elem){
  if(elem && elem.className)
    $("."+elem.className).css("background", "");	
}


/**
 * 刷新列表数据
 */
tek.macList.customRefresh=function(){
  var elem=document.getElementById("table-infos");
  if(elem)
    elem.innerHTML="";

  if(typeof(tek.macList.refreshList)=="function")
    tek.macList.refreshList();
  else
    tek.macList.getList();
}

/**
 * 删除指定标识的信息
 * 需要加载dataUtility.js、common.js文件
 *
 * @param id
 *           删除标识（必须是字符串）
 * @param name
 *           删除名称
 * @param ajaxParams
 *           ajax参数 
 */
tek.macList.removeInfo=function(id, name, ajaxParams) {
  if(!ajaxParams){
    return tek.macCommon.waitDialogShow(null, "未指定URL或参数！");
  }

  var remove=window.confirm("确定删除“"+name+"”?");
  if (!remove)
   return;

  var html = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
  tek.macCommon.waitDialogShow(null, html, null, 2);
  
  var params={};
  params["type"]="post";
  params["async"]=true;
  params["url"]=tek.macList.ajaxURL;
  params["params"]=ajaxParams;
  params["success"]=function(data) {
    tek.macCommon.waitDialogHide();
      tek.macList.removeCheck(1);
      tek.macList.getList();
  };
  params["error"]=function(data,message) {
     tek.macCommon.waitDialogShow(null, message);
  };
  params["message"]="删除";
  tek.common.ajax2(params);
}

/**
 * 批量删除选中的用户记录
 * 需要加载dataUtility.js、common.js文件
 *
 * @param ajaxParams
 *           ajax参数 
 */
tek.macList.removeList=function(ajaxParams) {
  if(!tek.macList.ajaxURL || !ajaxParams){
    return tek.macCommon.waitDialogShow(null, "未指定URL或参数！");
  }
  
  if (!tek.macList.selected || tek.macList.selected.length <=0) {
    return tek.macCommon.waitDialogShow(null, "没有选中待删除记录!");
  }

  var objectIds="";
  var count=0;
  for (var i=0; i<tek.macList.selected.length; i++) {
    if (tek.macList.selected[i] && tek.macList.selected[i]>0){
      if(count>0)
        objectIds+=";";
      objectIds+=tek.macList.selected[i];
      count++;
    }
  }
  ajaxParams["object-ids"]=objectIds;

  var remove=window.confirm("确定删除选中的"+count+"条信息？");
  if (!remove)
    return ;

  var html = "<img src='" + tek.common.getRelativePath() + "http/images/waiting.gif' width='16'/> &nbsp;正在删除...";
  tek.macCommon.waitDialogShow(null, html, null, 2);
  
  var params={};
  params["type"]="post";
  params["async"]=true;
  params["url"]=tek.macList.ajaxURL;
  params["params"]=ajaxParams;
  params["success"]=function(data) {
    tek.macCommon.waitDialogHide();
      tek.macList.removeCheck(data.value);
      tek.macList.getList();
  };
  params["error"]=function(data,message) {
    tek.macCommon.waitDialogShow(null, message);
  };
  params["message"]="删除";
  tek.common.ajax2(params);
}
