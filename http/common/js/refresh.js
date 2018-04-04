/**
 * 设置指定控件状态为“无效”
 * 
 * @param objs
 *           控件ID数组
 */
function setDisabled(objs) {
  if (objs == null || objs.length <= 0)
    return ;

  var i = 0;
  for (i = 0; i < objs.length; i++) {
    if (objs[i] == null)
      continue;
    
    var obj = document.getElementById(objs[i]);
    if (obj != null)
      obj.disabled="disabled";
  }
}

/**
 * 设置指定控件状态为"有效"
 * 
 * @param objs
 *           控件数组
 */
function setEnabled(objs) {
  if (objs == null || objs.length <= 0)
    return ;

  var i = 0;
  for (i = 0; i < objs.length; i++) {
    if (objs[i] == null)
      continue;
    
    var obj = document.getElementById(objs[i]);
    if (obj != null)
      obj.disabled="";
  }
}

/**
 * 刷新
 *
 * @param cs
 *           charset值
 */
function tekRefresh(cs) {
  // 刷新父页面
  if(typeof(tekRefreshOpener)=="function"){
    /*********多重父页面暂时有问题**********/
//    tekRefreshOpener(cs);
  }else{
    if(request){
      var ref=request["refresh-opener"];
      if(ref==1 || ref==true)
        tekRefreshOpener(cs);
    }
  }

  var form=document.getElementById("refreshForm");
  if (form) {
    submitForm("refreshForm", cs);
  } else {
    if(typeof("customRefresh")=="function") {
      // 存在自定义刷新函数
      customRefresh(cs);
    } else {
    //if (window.navigator.userAgent.indexOf('Chrome') < 0)
      setTimeout("window.location.reload();", 500);
    /*else{
      var div = document.createElement("div"); 
      div.style.textAlign="center";

      div.style.fontSize="small";
      div.style.color="red";
      div.innerHTML="当前浏览器无法刷新，建议您使用IE或Firefox!";
      document.getElementById('main').appendChild(div);	
    }*/
    } // end if(typeof("customRefresh")=="function") else
  } // end if (from) else
}

/**
 * 刷新opener页面
 *
 * @param cs
 *           charset值
 * @param func
 *           刷新函数名（例如“refresh()”，不包含window.opener）
 */
function tekRefreshOpener(cs, func) {
  if(frameElement && frameElement.api) {
    // 弹出框刷新父页面
    if (func && eval("typeof(frameElement.api.opener."+func+")")=="function")
      eval("frameElement.api.opener."+func);
    else if(frameElement.api.opener.refreshWithWaiting)
      frameElement.api.opener.refreshWithWaiting(cs);
    else if(frameElement.api.opener.tekRefresh)
      frameElement.api.opener.tekRefresh(cs);
    else
      frameElement.api.opener.window.location.reload();

  } else {
    if(window.opener) {
      if(window.opener!=window) {
        // window.opener刷新
        if (func && eval("typeof(window.opener."+func+")")=="function") {
          eval("window.opener."+func+"();");
        }else if (typeof(window.opener.tekRefresh)=="function") {
          // 执行tekRefresh()刷新
          window.opener.tekRefresh(cs);

        } else {
          //if (window.navigator.userAgent.indexOf('Chrome') < 0)
            window.opener.location.reload();
          /*else{
            var div = document.createElement("div"); 
            div.style.textAlign="center";
            div.style.fontSize="small";
            div.style.color="red";
            div.innerHTML="当前浏览器无法刷新，建议使用Firefox浏览器获得最佳体验!";
            document.getElementById('main').appendChild(div);
          } // end if (window.navigator.userAgent.indexOf('Chrome') < 0) else*/
        } // end  if (typeof(window.opener.refresh)=="function") else
      } // end if(window.opener!=window)

    } else if (parent != window) {
      // parent刷新
      if (func && eval("typeof(parent."+func+")")=="function") {
        eval("parent."+func);
      }else if (typeof(parent.tekRefresh)=="function") {
        // 执行refresh()刷新
        parent.tekRefresh(cs);
      } else {
        //if (window.navigator.userAgent.indexOf('Chrome') < 0)
          parent.location.reload();
        /*else{
          var div = document.createElement("div");
          div.style.textAlign="center";
          div.style.fontSize="small";
          div.style.color="red";
          div.innerHTML="当前浏览器无法刷新，建议使用Firefox浏览器获得最佳体验!";
          document.getElementById('main').appendChild(div);	
        } // end if (window.navigator.userAgent.indexOf('Chrome') < 0) else*/
      } // end  if (typeof(window.opener.refresh)=="function") else
    } // end if(window.opener) else
  } // end if(frameElement) else
}

/**
 * 提交指定form
 *
 * @param formId
 *           <form>的id名
 * @param cs
 *           charset值
 * @param disabled
 *           设置不可点击的按钮名称的数组（例如：new Array("addButton")）
 */
function submitForm(formId, cs, disabled) {
  var form=document.getElementById(formId);
  if (form) {
    if(cs && navigator.userAgent.indexOf('MSIE')>=0)
      document.charset=cs;
    form.submit();
    
    if (disabled)
      setDisabled(disabled);
  }
}