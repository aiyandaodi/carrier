// 基本JS函数

/**
 * 创建Form元素。并添加到body节点下。
 *
 * @param formId
 *           Form标识名
 * @param charset
 *           字符编码
 */
function createForm(formId, charset) {
  var form=document.createElement("form");
  form.id=formId;
  form.name=formId;
  form.method="post";
  form.acceptCharset=charset;
  form.style.display="none";
  if(navigator.userAgent.indexOf('MSIE')>=0)
    document.charset=charset;
  document.body.appendChild(form);
  return form;
}

/**
 * 检查菜单项，如果没有，则隐藏菜单条。
 * 适用于标准add、edit、read页面
 */
function checkMenu() {
  var menuitem=$("#menu .menu1 li");
  if (menuitem && menuitem.length > 0)
    $("#menu").show();
  else
    $("#menu").hide();
}

/**
 * 加载页面。（需要载入jquery-1.8.1.min.js）
 * 该方法调用$(elem).load方法。在调用前，执行$.ajaxSetup({ cache: false });语句清除缓存。
 *
 * @param elem
 *           指定元素的字符串。即：$(elem)
 * @param url
 *           调用load方法的url参数
 * @param data
 *           调用load方法的data参数（可省略）
 * @param complete
 *           调用load方法的complete返回函数（可省略）
 */
function jquery_load(elem, url, data, complete) {
  $.ajaxSetup({ cache: false });
  $(elem).load(url, data, complete);
}

/**
 * 关闭当前页面（或窗口）
 *
 * @param refreshFrame
 *          当前页面是弹出窗口时有效，表示是否刷新页面
 * @param cs
 *           charset字符集。refreshFrame为true时有效。
 */
function winClose(refreshFrame, cs) {
  if(frameElement) {
    if(refreshFrame) {
      // 刷新页面
      if(frameElement.api.opener.refreshWithWaiting)
        frameElement.api.opener.refreshWithWaiting(cs);
      else if(frameElement.api.opener.tekRefresh)
        frameElement.api.opener.tekRefresh(cs);
      else
        frameElement.api.opener.window.location.reload();
    } else {
      // 不刷新页面，关闭弹出窗口。
      frameElement.api.close();
    }
  } else {
    window.close();
  }
}

/**
 * 关闭当前页面，在关闭前确认
 *
 * @param refreshFrame
 *          当前页面是弹出窗口时有效，表示是否刷新页面
 * @param cs
 *           charset字符集。refreshFrame为true时有效。
 */
function closeWithConfirm(refreshFrame, cs){
  var closeConfirm=confirm("确定关闭页面？");
  if(closeConfirm)
    winClose(refreshFrame,cs);
}

/**
 * 返回前一页面，在返回前确认
 *
 * @param callbackURL
 *           返回页面URL
 */
function callbackWithConfirm(callbackURL){
  if(callbackURL){
    var callbackConfirm=confirm("确定返回前一页面？");
    if(callbackConfirm)
      location.href=callbackURL;
  }
}

/**
 * 取得指定IFrame的自适应高度
 * 
 * @param iframeElem
 *           iframe元素
 */
function getIframeScrollHeight(iframeElem) {
  if(!iframeElem)
    return 0;

  var height;
  var bHeight=0;
  if(iframeElem && iframeElem.contentWindow && iframeElem.contentWindow.document && iframeElem.contentWindow.document.body)
    bHeight=iframeElem.contentWindow.document.body.scrollHeight;
  var dHeight=0;
  if(iframeElem && iframeElem.contentWindow && iframeElem.contentWindow.document && iframeElem.contentWindow.document.documentElement)
    dHeight=iframeElem.contentWindow.document.documentElement.scrollHeight;

  height = Math.min(bHeight, dHeight);

  return height;
}

/**
 * 取得浏览器类型
 *
 * @return 返回obj对象。obj["explorer-type"] - 浏览器类型
 */
function getUserAgent() {
  var obj={};
  var ua = navigator.userAgent.toLowerCase();

  var array=ua.match(/msie ([\d.]+)/);
  if(array && array.length>0)
    obj["explorer-type"]="IE";
  else {
    array=ua.match(/firefox\/([\d.]+)/);
    if(array && array.length>0)
      obj["explorer-type"]="Firefox";
    else {
      array=ua.match(/chrome\/([\d.]+)/);
      if(array && array.length>=2)
        obj["explorer-type"]="Chrome";
      else {
        array=ua.match(/opera\/([\d.]+)/);
        if(array && array.length>=2)
          obj["explorer-type"]="Opera";
        else {
          array=ua.match(/version\/([\d.]+)/);
          if(array && array.length>=2)
            obj["explorer-type"]="Safari";
        } // end if(array && array.length>=2) else
      } // end if(array && array.length>=2) else
    } // end if(array && array.length>0) else
  } // end if(array && array.length>0) else
  
  return obj;
}

var rootPath;    // 当前页面跟路径（包含工程名）

/**
 * 取得根URL。（http://domain:port/rootname）
 *
 * @return 返回根URL。
 */
function getRootPath() {
  if(!rootPath) {
    var sb=new StringBuffer();
  
    var full=window.location.href;
    if(full){
      var loc=full.indexOf("?");
      if(loc && loc>=0)
        full=full.substring(0, loc);
    }
    var pathname=window.location.pathname;

    sb.append(full.substring(0, full.lastIndexOf(pathname)));
    sb.append("/");

    var p=pathname;
    if(p.charAt(0)=="/")
      p=p.substring(1);
    var arr=p.split("/");
    if(arr && arr.length>0) {
      if(arr[0]!="" && arr[0]!="http" && arr[0]!="https" && arr[0].indexOf(".")<0) {
        sb.append(arr[0]);
        sb.append("/");
      }
    }
    rootPath=sb.toString();
  }
  
  return rootPath;
}

var relativePath;    // 当前页面相对于工程目录的路径

/**
 * 取得当前页面相对于工程目录的相对路径。
 * 例如：当前页面路径为“/takall/http/index.html”，则返回“../”。
 *
 * @return 返回相对的“../”字符串。
 */
function getRelativePath() {
  if(!relativePath) {
    var sb=new StringBuffer();

    var pathname=window.location.pathname;

    var p=pathname;
    if(p.charAt(0)=="/")
      p=p.substring(1);

    var first=true;
    var loc=0;
    do {
      loc=p.indexOf("/");
      if(loc>0){
        if(!first || p.substring(0, loc)=="http") {
          sb.append("../");
        }
        first=false;
        p=p.substring(loc + 1);
      }
    } while (loc>0);
    relativePath=sb.toString();
  }
  return relativePath;
}

/**
 * 取得串行化参数
 *
 * @param id
 *           串行化元素标识
 * @return 返回串行化参数字符串。
 */
function getSerializeStringParameters(id){
	var param=$("#"+id).serialize();
	if(param)
	  param=param.replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));

	return param;
}

/**
 * 取得串行化参数
 *
 * @param id
 *           串行化元素标识
 * @return 返回串行化参数对象。
 */
function getSerializeObjectParameters(id){
  var param=getSerializeStringParameters(id);
  if(param){
    var mydata={};

    var array = param.split("&");
    for(var i=0;i<array.length;i++){
      var array2 = array[i].split("=");

      var old=mydata[array2[0]];
      if(old && old.length>0)
        mydata[array2[0]] = old+";"+array2[1];
      else
        mydata[array2[0]] = array2[1];
    }

    return mydata;
  }
}

/**
 * 在URL后面增加随机参数，保证IE浏览器不使用缓存页面
 *
 * @param url
 *           URL链接
 */
function appendRandomParam(url) {
  if (!url)
    return url;

  var loc=url.lastIndexOf("?");
  if(loc>=0) {
    if (loc<url.length-1)
      url+="&";
  } else
    url+="?";
  url+="cache="+Math.floor(Math.random()*100000);

  return url;
}

/**
 * 取得指定IP所在地。
 * 注意：需要加载common.js
 *
 * @param ip
 *           IP地址。如果为空，返回本机信息。
 * @return 返回所在地信息对象。（object["ip"] - IP地址；object["country"] - 国家）
 */
function getIpLocation(ip) {
  var obj;
  
  var urlstr=new StringBuffer();
  urlstr.append("http://api.wipmania.com/");
  if(ip) {
    urlstr.append("/");
	urlstr.append(ip);
  }
  
  var params={};
  params["action"]="agent";
  params["redirect-url"]=urlstr.toString();
  
  $.ajax({
	  async: false,
      type: "post",
      url: "./../../../servlet/sys",
      dataType: "html",
      data: params,

      success:function(data){
        var lip;
		var lcountry;
		
        if(data && (typeof(data)=="string")) {
		  var array=data.split("<br>");
		  if(array && array.length>0) {
			if(ip) {
              // 指定IP
			  lip=ip;
              if(array[0])
	            lcountry=array[0];
			} else {
			  // 未指定IP
			  if(array.length>=2) {
			    lip=array[0];
			    lcountry=array[1];
			  }
			}
		  } // end if(array && array.length)
        } // end if(data && (typeof(data)=="string"))

        obj={};
		if(lip)
          obj["ip"]=lip;
		if(lcountry)
		  obj["country"]=lcountry;
      },

      error: function(request) {
      }
  });
  
  return obj;
}

/**
 * 收藏
 *
 * @param title - 标题
 * @param url - URL地址
 */
function addFavorite(title, url) {
  try {
    window.external.addFavorite(url, title);
  } catch (e) {
    try {
      window.sidebar.addPanel(title, url, "");
    }
    catch (e) {
      alert("抱歉，您所使用的浏览器无法完成此操作。\r\n加入收藏失败，请使用Ctrl+D进行添加");
    }
  }
}

	
/**
 * 判断键盘敲击键，必须是数字
 * 
 * @param evt
 *           事件
 */
function numberOnly(evt) {
  evt = evt ? evt : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
  if (evt) {
    if((evt.keyCode<48 || evt.keyCode>57) && evt.keyCode!=13)
      evt.keyCode = 0;
  }
}