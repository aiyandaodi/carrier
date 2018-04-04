/***************************************************************************************************
 * 说明： 【【【【【为了兼容，暂时保留。不建议使用，后期删除】】】】】
 *   该JS文件用于使用macadmin-5.0样式生成的标准化对象编辑页面。
 * 要求：
 *   需要加载dataUtility.js、mac-common.js、core.js
 *-------------------------------------------------------------------------------------------------
 * 页面需要实现的操作和方法：
 *     function tek.macEdit.initialCustomButton(); - 自定义底部按钮。（如果不定义该函数，将显示默认按钮）
 *     function tek.macEdit.customOperation(data,parent); - 自定义的编辑页面。（如果不定义该函数，将显示默认的编辑页面）
 *     function tek.macEdit.appendCustomEditField(field,record,sb); - 自定义域显示。如果为空，自动调用默认实现
 *     function tek.macEdit.getObjectOptionParam(fieldname); - 自定义取得fieldname字段的对象列表信息的ajax调用参数（如果存在对象域，需要实现该函数）
 *     function tek.macEdit.getObjectOptionUrl(fieldname); - 自定义取得fieldname字段的对象列表信息的ajax调用url（如果存在对象域，需要实现该函数）
 *     function tek.macEdit.customSelectObjectOption(fieldname,id,name); - 自定义选择对象查询结果的处理。
 *     function tek.macEdit.checkCallbackURL(url,data); - 自定义检查回调地址的操作。返回修正后的回调地址
 *------------------------------------------------------------------------------------------------
 * 公共函数：
 *     function tek.macEdit.initialButton(parentId); - 初始化底部按钮（提交）
 *     function tek.macEdit.getEdit(ajaxURL,params,items,parentId); - 读取对象信息使用mac样式显示。
 *     function tek.macEdit.getEditUI(record,items,sb); - 使用mac样式生成读取页面的字符串。
 *     function tek.macEdit.editInfo(ajaxURL,ajaxParams) - 编辑信息
 ***************************************************************************************************/

var tek = window.tek || new Object();    //用于系统定义的静态方法或属性
tek.macEdit=new Object();    // 定义相关的参数、函数

/**
 * 初始化底部按钮（提交）
 * 
 * @param parentId
 *           父元素标识
 */
tek.macEdit.initialButton=function(parentId) {
  if((typeof tek.macEdit.initialCustomButton)=="function"){
    // 执行页面自定义的初始化按钮函数
    tek.macEdit.initialCustomButton(parentId);
  }else{
    tek.macEdit.initialDefaultButton(parentId);
  }
}

/**
 * 初始化默认的底部按钮（提交）
 * 
 * @param parentId
 *           父元素标识
 */
tek.macEdit.initialDefaultButton=function(parentId) {
  var sb="<button type='submit' id='submitBtn' class='btn btn-danger'>提交</button>";
  
  if(!tek.dataUtility.isNull(showClose) && showClose==1){
    //显示关闭按钮
    sb+="<button type='button' id='closeBtn' class='btn btn-info' onclick='tek.common.closeWithConfirm();'>关闭</button>";
  } else if (!tek.dataUtility.isNull(callbackURL)){
    //显示返回按钮
    sb+="<button type='button' id='callbackBtn' class='btn btn-success' onclick='tek.common.callbackWithConfirm(callbackURL)'>返回</button>";
  } else {
    // 显示“提交”、“重置”
    sb+="<button type='reset' class='btn btn-success'>重置</button>";
  }

  $("#"+parentId).html(sb);
}

/**
 * 取得编辑域
 * 需要加载common.js、dataUtility.js文件
 *
 * @param ajaxURL
 *           取得列表信息的Servlet地址
 * @param params
 *           取得列表信息参数对象
 * @param items
 *           显示字段数组
 * @param parent
 *           显示信息的父元素ID
 */
tek.macEdit.getEdit=function(ajaxURL,params,items,parentId){
  var parent=document.getElementById(parentId);
  if(!parent)
    return;

  // 显示读取数据等待框
  var html="<img src='"+tek.common.getRelativePath()+"http/images/waiting-small.gif'/>&nbsp;正在获取数据...";
  tek.macEdit.showReadMessage(html,parent);

  var p={};
  p["type"]="post";
  p["async"]=true;
  p["url"]=ajaxURL;
  p["params"]=params;
  p["success"]=function(data) {
      parent.innerHTML="";
      // 自定义操作
      if(typeof(tek.macEdit.customOperation)=="function") {
        // 默认输入框
        tek.macEdit.customOperation(data,parent);
      } else {
        // 自定义输入框
        tek.macEdit.defaultOperation(data,parent);
      }
  };
  p["error"]=function(data,message) {
      parent.innerHTML="";
      tek.macEdit.showReadMessage(message,parent);
  };
  tek.common.ajax2(p);
}

/**
 * 生成默认输入框
 * 
 * @param data
 *           AJAX返回数据
 * @param parent
 *           父元素
 */
tek.macEdit.defaultOperation=function(data,parent){
  // 显示编辑框
  var record=data["record"];
  if(record){
    var r;
    if(record.length)
      r=record[0];
    else
      r=record;

    var sb=new StringBuffer();
    sb=tek.macEdit.getEditUI(r,items,sb);
    parent.innerHTML=sb.toString();
  }
}

/**
 * 在编辑元素内显示信息
 *
 * @param msg
 *           显示信息
 * @param parent
 *           父元素
 */
tek.macEdit.showReadMessage=function(msg,parent){
  if(!msg || !parent)
    return;

  parent.innerHTML="<div class='loading center loading-style'>"+msg+"</div>";
}

/**
 * 使用mac样式生成编辑页面的字符串
 * 需要加载common.js、dataUtility.js文件
 * 如果包含日期域，还需要加载normal.js、../calendar/all.js、../calendar/qmcalendar.js、../calendar/qmlunar.js文件，页面需要加入日历标签:<div id="calendar_div" class="bd" style="margin: 20px 5px 6px 0px; border:double 2px solid; width: 180px; position:absolute; display:none;z-index:10;" onblur="$(this).hide();" tabindex=2></div>
 *
 * @param record
 *           从Servlet取得的对象信息
 * @param items
 *           显示的字段数组
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。如果为空，函数回自动创建一个新的StringBuffer变量)
 * @return 返回StringBuffer字符串。
 */
tek.macEdit.getEditUI=function(record,items,sb){
  if(!record || !items || items.length<=0)
    return sb;

  if(!sb)
    sb=new StringBuffer();

  for(var i=0; i<items.length; i++)
    tek.macEdit.appendEditField(record[items[i]],record, sb);

  return sb;
}

/**
 * 使用mac样式追加指定域的编辑框的字符串
 * 需要加载common.js、dataUtility.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param record
 *           从Servlet取得的对象信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendEditField=function(field,record,sb){
  if((typeof tek.macEdit.appendCustomEditField)=="function"){
    // 执行页面自定义的初始化按钮函数
    tek.macEdit.appendCustomEditField(field,record,sb);
  } else {
    tek.macEdit.appendDefaultEditField(field,record,sb);
  }
}

/**
 * 使用mac样式追加指定域的默认形式的编辑框的字符串
 * 需要加载common.js、dataUtility.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param record
 *           从Servlet取得的对象信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendDefaultEditField=function(field,record,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;

  var show=field.show;    //域显示值
  if(show && show.length>0)
    show=tek.dataUtility.stringToInputHTML(show);
  else
    show="";
    
  sb.append("<div id='");
  sb.append(fieldname);
  sb.append("-form-group' class='form-group'>");
  
  tek.macEdit.appendNameField(field,sb);
  
  sb.append("<div class='col-xs-9'>");// style='overflow:hidden'>");
  
  var format=field.format;
  if (format==2 || format==16) {
    // 单选
    tek.macEdit.appendSingleField(field,sb);
  } else if (format==32 || format==33) {
    // 多选
    tek.macEdit.appendCheckboxField(field,sb);
  } else if (format==18 || format==20) {
    // 下拉框
    tek.macEdit.appendSelectField(field,sb);
  } else if (format==8 || format==9) {
    // 日期
    tek.macEdit.appendDatetimeField(field,sb);
  } else if (format==10) {
    // 时间
    //printTime(field, print);
  } else if (format==0x01) {
    // 密码
    tek.macEdit.appendPasswordField(field,sb);
  } else if (format==128) {
    // 对象
    tek.macEdit.appendObjectField(field,sb);
  } else if (format==40) {
    // 文件
    //printBlob(field, print);
  } else if (format==11) {
    // 多行文本
    tek.macEdit.appendTextAreaField(field,sb);
  } else {
    // 单行文本
    tek.macEdit.appendTextField(field,sb);
  }
  sb.append("</div>");

  sb.append("</div>");

  return sb;
}

/**
 * 使用mac样式追加编辑页面域名的字符串
 * 需要加载common.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendNameField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;

  sb.append("<label class='col-xs-3' style='overflow:hidden' for='"); // 去掉了 .control-label
  sb.append(fieldname);
  sb.append("'>");
  var display=field.display;    //本地化域名
  if(display && display.length>0)
    sb.append(display);
  else
    sb.append("&nbsp;");
  sb.append("</label>");

  return sb;
}

/**
 * 使用mac样式追加编辑页面文本输入框的字符串
 * 需要加载common.js、dataUtility.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendTextField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;

  var show=field.show;    //域显示值
  if(show && show.length>0)
    show=tek.dataUtility.stringToInputHTML(show);
  else
    show="";
    
  sb.append("<input type='text' id='");
  sb.append(fieldname);
  sb.append("' name='");
  sb.append(fieldname);
  sb.append("' class='form-control' value='");
  sb.append(show);
  sb.append("'/>");

  return sb;
}

/**
 * 使用mac样式追加编辑页面多行文本输入框的字符串
 * 需要加载common.js、dataUtility.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendTextAreaField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;
  if(!fieldname || fieldname.length<=0)
    return sb;

  var display=field.display;
  if(!display || display.length<=0)
    dislay="&nbsp;";
  var show=field.show;    //域显示值
  if(show && show.length>0)
    show=tek.dataUtility.stringToInputHTML(show);
  else
    show="";
    
  sb.append("<textarea id='");
  sb.append(fieldname);
  sb.append("' name='");
  sb.append(fieldname);
  sb.append("' class='form-control'");
  if (field.editable && field.editable=="false")
    sb.append(" disabled='disabled'");
  sb.append(">");
  sb.append(show);
  sb.append("</textarea>");

  return sb;
}

/**
 * 使用mac样式追加编辑页面密码输入框的字符串
 * 需要加载common.js、dataUtility.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendPasswordField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;
    
  sb.append("<input type='password' id='");
  sb.append(fieldname);
  sb.append("' name='");
  sb.append(fieldname);
  sb.append("' class='form-control' value=''");
  sb.append("/>");
  
  return sb;
}

/**
 * 使用mac样式追加编辑页面密码输入框的字符串（显示密码强度）
 * 需要加载common.js、dataUtility.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendDetailPasswordField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;
  
  sb.append("<input type='password' id='");
  sb.append(fieldname);
  sb.append("' name='");
  sb.append(fieldname);
  sb.append("' class='form-control' value=''");
  sb.append(" placeholder='支持字符：数字、字母及常用符号'");
  sb.append(" onkeyup='checkPasswordStrong(this);'/>");
  
  sb.append("<div>");
  sb.append("密码强度&nbsp;");
  sb.append("<span id='weak' style='background-color:#dde1df;font-size:12px'>&nbsp;&nbsp;&nbsp;&nbsp;弱&nbsp;&nbsp;&nbsp;&nbsp;</span>");
  sb.append("<span id='normal' style='background-color:#dde1df;font-size:12px'>&nbsp;&nbsp;&nbsp;&nbsp;中&nbsp;&nbsp;&nbsp;&nbsp;</span>");
  sb.append("<span id='strong' style='background-color:#dde1df;font-size:12px'>&nbsp;&nbsp;&nbsp;&nbsp;强&nbsp;&nbsp;&nbsp;&nbsp;</span>");
  sb.append("</div>");
  
  return sb;
}

/**
 * 检查密码强度
 * 
 * @param input
 *           密码输入标签
 */
tek.macEdit.checkPasswordStrong=function(input) {
  $("#weak,#normal,#strong").css("background","#dde1df");
  
  var password=input.value;
  if(password && password!=""){
    var strong=tek.macEdit.getPasswordStrong(password);
    switch(strong){
    case 1:
      //中密码
      $("#normal").css("background","#EEAD0E");
      break;
    case 2:
      //强密码
      $("#strong").css("background","#00EE00");
      break;
    default:
      //弱密码
      $("#weak").css("background","#f87d7d");
      break;
    } // end switch(strong)
  }
}

/**
 * 使用mac样式追加编辑页面单选框的字符串
 * 需要加载common.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendSingleField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;

  var value=field.value;    //域值
  var selects = field.selects;
  var shows = field.shows;
  if (!selects || selects.length<=0 || !shows || shows.length<=0 || selects.length!=shows.length)
    return sb;

  for(var i=0; i<selects.length; i++) {
    if (!selects[i] || selects[i].length<=0
        || !shows[i] || shows[i].length<=0)
      continue;
    sb.append("<div class='col-xs-6' style=' overflow:hidden; padding:0px 5px'>");    
    sb.append("<input type='radio' class='col-xs-1' style='width:15%; float:left;' ");
    sb.append(" id='");
    sb.append(fieldname);
    sb.append("-");
    sb.append(selects[i]);
    sb.append("' name='");
    sb.append(fieldname);
    sb.append("'");
    sb.append(" value='");
    sb.append(selects[i]);
    sb.append("'");
    if(selects[i]==value)
      sb.append(" checked='checked'");
    //if (!field.isEditable())
    //print.append(" disabled='disabled'");
    sb.append("/>");
    sb.append("<label class='col-xs-11'  style='float:left; width:85%; overflow:hidden' for='");
    sb.append(fieldname);
    sb.append("-");
    sb.append(selects[i]);
    sb.append("'>");
    sb.append(shows[i]);
    sb.append("</label>");
    sb.append("</div>");
  } // end for(var i=0; i<selects.length; i++)

  return sb;
}

/**
 * 使用mac样式追加编辑页面多选框的字符串
 * 需要加载common.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendCheckboxField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;

  var value=field.value;    //域值
  var selects = field.selects;
  var shows = field.shows;
  if (!selects || selects.length<=0 || !shows || shows.length<=0 || selects.length!=shows.length)
    return sb;

  var type=0;    // 0-字符串型；1-数值型
  if(tek.dataUtility.isNumber(value))
    type=1;

  for(var i=0; i<selects.length; i++) {
    if (!selects[i] || selects[i].length<=0
        || !shows[i] || shows[i].length<=0)
      continue;
    sb.append("<div class='col-xs-6' style=' overflow:hidden; padding:0px 5px'>");    
    sb.append("<input type='checkbox' class='col-xs-1' style='width:15%; float:left;' ");
    sb.append(" id='");
    sb.append(fieldname);
    sb.append("-");
    sb.append(selects[i]);
    sb.append("' name='");
    sb.append(fieldname);
    sb.append("'");
    sb.append(" value='");
    sb.append(selects[i]);
    sb.append("'");
    if(selects[i]==value || (type==1 && selects[i]!=0 && ((value&selects[i])==selects[i])))
      sb.append(" checked='checked'");
    //if (!field.isEditable())
    //print.append(" disabled='disabled'");
    if(type==1)
      sb.append(" onclick='tek.macEdit.clickCheckbox(this);'");
    sb.append("/>");
    sb.append("<label class='col-xs-11'  style='float:left; width:85%; overflow:hidden' for='");
    sb.append(fieldname);
    sb.append("-");
    sb.append(selects[i]);
    sb.append("'>");
    sb.append(shows[i]);
    sb.append("</label>");
    sb.append("</div>");
  } // end for(var i=0; i<selects.length; i++)

  return sb;
}

/**
 * 点击数值型多选框
 */
tek.macEdit.clickCheckbox=function(elem) {
  if(!elem)
    return;
  
  var p=elem.parentNode.parentNode;
  if(!p)
    return;

  var arr=$(p).find("input[type='checkbox']");
  if(arr && arr.length>0) {
    var selValue=elem.value;
    for(var i=0; i<arr.length; i++) {
      if(selValue==0){
        if(arr[i].value!=0)
          arr[i].checked="";
        else
          arr[i].checked="checked";
      } else {
        if(arr[i].value==0)
          arr[i].checked="";
      }
    }
  }
}

/**
 * 使用mac样式追加编辑页面下拉框的字符串
 * 需要加载common.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendSelectField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;

  var value=field.value;    //域值
  var selects = field.selects;
  var shows = field.shows;
  if (!selects || selects.length<=0 || !shows || shows.length<=0 || selects.length!=shows.length)
    return sb;

  sb.append("<select id='");
  sb.append(fieldname);
  sb.append("'");
  sb.append(" name='");
  sb.append(fieldname);
  sb.append("' class='form-control'");
  //if (!field.isEditable())
  //print.append(" disabled='disabled'");
  sb.append(">");

  for(var i=0; i<selects.length; i++) {
    if (!selects[i] || selects[i].length<=0
        || !shows[i] || shows[i].length<=0)
      continue;
    
    sb.append("<option value='");
    sb.append(selects[i]);
    sb.append("' class='form-control'");
    if((i==0 && (tek.dataUtility.isNull(value) || value=="")) || selects[i]==value)
      sb.append(" selected='selected'");
    sb.append(">");
    sb.append(shows[i]);
    sb.append("</option>");
  } // end for(var i=0; i<selects.length; i++)

  sb.append("</select>");

  return sb;
}


/**
 * 使用mac样式追加编辑页面时间输入框的字符串
 * 需要加载common.js、normal.js、../calendar/all.js、../calendar/qmcalendar.js、../calendar/qmlunar.js文件
 * 页面需要加入日历标签:<div id="calendar_div" class="bd" style="margin: 20px 5px 6px 0px; border:double 2px solid; width: 180px; position:absolute; display:none;z-index:10;" onblur="$(this).hide();" tabindex=2></div>
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendDatetimeField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;
  if(!fieldname || fieldname.length<=0)
    return sb;

  var display=field.display;
  if(!display || display.length<=0)
    dislay="&nbsp;";
  var show=field.show;
  if(!show || show.length<=0)
    show="";

  sb.append("<input type='text' id='");
  sb.append(fieldname);
  sb.append("' name='");
  sb.append(fieldname);
  sb.append("' class='form-control' value='");
  sb.append(show);
  sb.append("' onfocus='calendarShow(this);'/>");

  return sb;
}

/**
 * 使用mac样式追加编辑页面对象输入框的字符串
 * 需要加载common.js、dataUtility.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macEdit.appendObjectField=function(field,sb){
  if(!field || !sb)
    return sb;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;

  var show=field.show;    //域显示值
  if(show && show.length>0)
    show=tek.dataUtility.stringToInputHTML(show);
  else
    show="";
  
  sb.append("<input type='hidden' id='");
  sb.append(fieldname);
  sb.append("' class='form-control' value='");
  sb.append(field.value);
  sb.append("'/>");
  sb.append("<input type='text' id='");
  sb.append(fieldname);
  sb.append("-input' class='form-control dropdown-toggle' value='");
  sb.append(show);
  sb.append("' data-toggle='dropdown' autocomplete='off' onFocus='tek.macEdit.changeObjectOption(event,\"");
  sb.append(fieldname);
  sb.append("\",this.value);' onKeyUp='tek.macEdit.changeObjectOption(event,\"");
  sb.append(fieldname);
  sb.append("\",this.value);'/>");
  sb.append("<ul id='");
  sb.append(fieldname);
  sb.append("-option' class='dropdown-menu col-xs-12' style='margin-left:15px;'>");
  sb.append("</ul>");

  return sb;
}

tek.macEdit.searchLastTime=0;   // 自动检索延迟时间点

/**
 * 
 * 响应检索对象信息。延迟调用tek.macEdit.changeObjectOption函数。
 *
 * @param event
 *           事件
 * @param fieldname
 *           域名
 * @param val
 *           检索值
 */
tek.macEdit.changeObjectOption=function(evt,fieldname, val) {
  evt = evt ? evt : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
  if(evt){
    tek.macEdit.searchLastTime=evt.timeStamp;
    setTimeout(function(){    //设时延迟0.5s执行
        if(tek.macEdit.searchLastTime-evt.timeStamp==0)
          tek.macEdit.searchObjectOption(fieldname,val);
    },500);
  }
}

/**
 * 
 * 检索对象信息。
 *
 * @param fieldname
 *           域名
 * @param val
 *           检索值
 */
tek.macEdit.searchObjectOption=function(fieldname, val){
  if(val && val.length>0){
    $("#"+fieldname+"-option").show();

    var sb="<li class='center'><img src='"+tek.common.getRelativePath()+"http/images/waiting-small.gif'/>&nbsp;正在获取数据...</li>";
    $("#"+fieldname+"-option").html(sb);

    var ajaxParams;
    if(typeof(tek.macEdit.getObjectOptionParam)=="function")
      ajaxParams=tek.macEdit.getObjectOptionParam(fieldname);

    var ajaxURL;
    if(typeof(tek.macEdit.getObjectOptionUrl)=="function")
      ajaxURL=tek.macEdit.getObjectOptionUrl(fieldname);
    if(!ajaxURL)
      ajaxURL=tek.common.getRootPath()+"servlet/tobject";
    
    if(!ajaxParams || !ajaxURL){
      $("#"+fieldname+"-option").html("<li class='center'><font color='red'>无法得到检索参数!</font></li>");
      return;
    }
    
    var maxcount=5;
    ajaxParams["count"]=maxcount;
    ajaxParams["quick-search"]=encodeURIComponent(val);

    var params={};
    params["type"]="post";
    params["async"]=true;
    params["url"]=ajaxURL;
    params["params"]=ajaxParams;
    params["success"]=function(data) {
        // 操作成功
        var records=data["record"];
        if(records) {
          var sb=new StringBuffer();
          if (records.length) {
            // 多条数据
            for(var i in records)
              tek.macEdit.appendObjectOptionRecord(records[i],fieldname,sb);
            if(records.length>maxcount){
              // 检索结果多余maxcount，显示“...”
              sb.append("<li>...</li>");
            }
          } else {
            // 一条数据
            tek.macEdit.appendObjectOptionRecord(records,fieldname,sb);
            $("#"+fieldname).val(records.id);
          }
          $("#"+fieldname+"-option").html(sb.toString());
        } else {
          $("#"+fieldname+"-option").html("<li class='center'>没有数据!</li>");
        }
    };
    params["error"]=function(data,message) {
        $("#"+fieldname+"-option").html(message);
    };
    tek.common.ajax2(params);

  } else {
    $("#"+fieldname).val("0");
    $("#"+fieldname+"-option").hide();
  }
}

/**
 * 追加对象记录信息
 */
tek.macEdit.appendObjectOptionRecord=function(record,fieldname,sb) {
  if(record && record.id && record.name){
    sb.append("<li><a href='#' onClick='selectObjectOption(\"");
    sb.append(fieldname);
    sb.append("\", \"");
    sb.append(record.id);
    sb.append("\", \"");
    sb.append(record.name);
    sb.append("\")'>");
    sb.append(record.name);
    sb.append("</a></li>");
  }
}

/**
 * 选择对象查询结果的处理。
 *
 * @param fieldname
 *           执行对象查询的字段名
 * @param id
 *           选择的对象信息标识
 * @param name
 *           选择的对象信息名称
 */
tek.macEdit.selectObjectOption=function(fieldname,id,name){
  $("#"+fieldname+"-input").val(name);
  $("#"+fieldname).val(id);
  $("#"+fieldname+"-option").hide();
  
  if(typeof(tek.macEdit.customSelectObjectOption)=="function")
    tek.macEdit.customSelectObjectOption(fieldname,id,name);
}

/**
 * 编辑信息
 * 需要加载dataUtility.js、common.js文件
 *
 * @param ajaxURL
 *           ajax地址
 * @param ajaxParams
 *           ajax参数 
 */
tek.macEdit.editInfo=function(ajaxURL, ajaxParams) {
  //显示等待图层
  var html="<img src='"+tek.common.getRelativePath()+"http/images/waiting-small.gif'/>&nbsp;正在提交...";
  tek.macCommon.waitDialogShow(null, html);
  $("#waiting-modal-dialog").modal("show",null,2);

  var params={};
  params["type"]="post";
  params["async"]=true;
  params["url"]=ajaxURL;
  params["params"]=ajaxParams;
  params["success"]=function(data) {
      // 操作成功
      if(typeof(updateOpener)!="undefined" && updateOpener==1){
        // 刷新父页面
        tek.refresh.refreshOpener();
      } // end if(updateOpener==1)
    if (typeof showClose != "undefined" && showClose == 1) {
      // 关闭
      var timer = "页面<font id='counter' color='red'></font>秒后自动关闭";
      tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message), timer, 2);
      tek.macCommon.waitDialogHide(3000, "window.close()");

    } else if (typeof callbackURL != "undefined" && !!callbackURL) {
      // 跳转
      var timer = "页面<font id='counter' color='red'></font>秒后自动跳转";
      tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message), timer, 2);
      if (typeof(tek.macEdit.checkCallbackURL) == "function")
        tek.macEdit.callbackURL = tek.macEdit.checkCallbackURL(callbackURL, data);
      tek.macCommon.waitDialogHide(3000, "location.href='" + callbackURL + "'");

    } else {
      tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message));
    } // end if else
  };
  params["error"]=function(data,message) {
    tek.macCommon.waitDialogShow(null, message);
  };
  tek.common.ajax2(params);
}
