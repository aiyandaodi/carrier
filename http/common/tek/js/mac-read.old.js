/***************************************************************************************************
 * 说明：                                                                               
 *   该JS文件用于使用macadmin-5.0样式生成的标准化对象读取页面。                                     
 * 要求：
 *   需要加载dataUtility.js、mac-common.js
 *-------------------------------------------------------------------------------------------------
 * 页面需要实现的操作和方法：
 *     function tek.macRead.customOperation(data); - 自定义数据操作。例如：处理按钮等。
 *     function tek.macRead.getCustomReadUI(record,items,parent); - 使用mac样式生成默认读取页面的字符串。
 *------------------------------------------------------------------------------------------------
 * 公共参数&函数：
 *     function tek.macRead.readInfo(ajaxURL,params,items,parentId); - 读取对象信息使用mac样式显示。
 *     function tek.macRead.getReadUI(record,items,sb); - 使用mac样式生成读取页面的字符串。
 *     function tek.macRead.removeInfo(ajaxURL,ajaxParams,name) - 删除信息
 ***************************************************************************************************/

var tek = window.tek || new Object();    //用于系统定义的静态方法或属性
tek.macRead=new Object();    // 定义相关的参数、函数

/**
 * 读取对象信息
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
tek.macRead.readInfo=function(ajaxURL,params,items,parentId){
  var parent=document.getElementById(parentId);
  if(!parent)
    return;

  // 显示读取等待
  var html="<img src='"+tek.common.getRelativePath()+"http/images/waiting-small.gif'/>&nbsp;正在获取数据...";
  tek.macRead.showReadMessage(html,parent);

  var p={};
  p["type"]="post";
  p["async"]=true;
  p["url"]=ajaxURL;
  p["params"]=params;
  
  p["success"]=function(data){
      parent.innerHTML="";
      // 自定义操作
      if(typeof(tek.macRead.customOperation)=="function")
        tek.macRead.customOperation(data);
      
      // 显示数据
      var r;

      var record=data["record"];
      if(record){
        if(record.length){
          if(record[0])
            r=record[0];
        } else
          r=record;
      }

      if(r){
        // 自定义操作
        if(typeof(tek.macRead.getCustomReadUI)=="function") {
          // 默认输入框
          tek.macRead.getCustomReadUI(r,items,parent);
        } else {
          // 自定义输入框
          tek.macRead.getDefaultReadUI(r,items,parent);
        }
      }else{
        tek.macRead.showReadMessage("没有数据!",parent);
      }
  };
  p["error"]=function(data,message) {
      parent.innerHTML="";
      tek.macRead.showReadMessage(message,parent);
  };
  tek.common.ajax2(p);
}

/**
 * 在编辑元素内显示信息
 */
tek.macRead.showReadMessage=function(msg,parent){
  if(!msg || !parent)
    return;
  
  parent.innerHTML="<div class='loading center loading-style'>"+msg+"</div>";
}

/**
 * 使用mac样式生成默认读取页面的字符串。
 * 需要加载common.js、dataUtility.js文件
 *
 * @param record
 *           从Servlet取得的对象信息
 * @param items
 *           显示的字段数组
 */
tek.macRead.getDefaultReadUI=function(record,items,parent){
  if(!record || !items || items.length<=0 || !parent)
    return null;

  var sb=new StringBuffer();
  for(var i=0; i<items.length; i++){
    if(typeof(tek.macRead.appendCustomReadField)=="function"){
      // 自定义输入框
      tek.macRead.appendCustomReadField(record[items[i]],record,sb);
    }else{
      // 默认输入框
      tek.macRead.appendDefaultReadField(record[items[i]],record,sb);
    }
  }

  parent.innerHTML=sb.toString();
}

/**
 * 使用mac样式追加指定域的默认读取框的字符串
 * 需要加载common.js、dataUtility.js文件
 *
 * @param field
 *           从Servlet取得的对象域信息
 * @param record
 *           从Servlet取得的对象信息
 * @param sb
 *           待生成的HTML字符串(StringBuffer类型。)
 */
tek.macRead.appendDefaultReadField=function(field,record,sb){
  if(!field || !sb)
    return null;

  var fieldname=field.name;    //域名
  if(!fieldname || fieldname.length<=0)
    return sb;

  var display=field.display;    //本地化域名
  if(!display || display.length<=0)
    display="&nbsp;";

  var show=field.show;    //域显示值
  if(show && show.length>0)
    show=tek.dataUtility.stringToHTML(show);
  else
    show="";

  sb.append("<div id='");
  sb.append(fieldname);
  sb.append("' class='form-group'>");
  sb.append("<label class='control-label col-xs-5 col-lg-5'>");
  sb.append(display);
  sb.append("</label><div class='col-xs-7 col-lg-7' style='padding-top:7px;word-break:break-all;'>");
  sb.append("<span>");
  sb.append(show);
  sb.append("</span></div></div>");

  return sb;
}

/**
 * 删除信息
 * 需要加载dataUtility.js、common.js文件
 *
 * @param ajaxURL
 *           ajax地址
 * @param ajaxParams
 *           ajax参数 
 * @param name
 *           删除的信息名称 
 */
tek.macRead.removeInfo=function(ajaxURL, ajaxParams, name) {
  var str="确定删除";
  if(name && name.length>0)
    str+=" '"+name+"' ";
  str+="?";
  var remove=window.confirm(str);
  if (!remove)
    return ;

  //显示等待图层
  var html = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在删除...";
  tek.macCommon.waitDialogShow(null, html, null, 2);

  var params={};
  params["async"]=false;
  params["type"]="post";
  params["url"]=ajaxURL;
  params["params"]=ajaxParams;
  params["success"]=function(data) {
      // 操作成功

      if(!tek.dataUtility.isNull(updateOpener) && updateOpener==1){
        // 刷新父页面
        tek.refresh.refreshOpener();
      }

    if (typeof showClose != "undefined" && showClose == 1) {
      // 关闭
      tek.macCommon.waitDialogShow(null, "删除成功!", "页面<font id='counter' color='red'></font>秒后自动关闭", 2);
      tek.macCommon.waitDialogHide(3000, "window.close()");

    } else if (typeof callbackURL != "undefined" && !!callbackURL) {
      // 跳转
      tek.macCommon.waitDialogShow(null, "删除成功!", "页面<font id='counter' color='red'></font>秒后自动跳转", 2);
      tek.macCommon.waitDialogHide(3000, "location.href='" + callbackURL + "';");

    } else {
      tek.macCommon.waitDialogShow("删除成功!");
      tek.macCommon.waitDialogHide(3000);
    }
  };
  params["error"]=function(data,message) {
    tek.macCommon.waitDialogShow(null, message);
  };

  tek.common.ajax2(params);
}
