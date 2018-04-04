/*************************************/
// 蒙版等待界面操作的js
//
// 相关文件：../common/jsp/shield.jsp
/*************************************/

/**
 * 初始化等待图标
 *
 * @param imgSrc
 *           等待图标路径（如果为空，使用默认图标）
 * @param imgWidth
 *           等待图标宽度
 * @param imgHeight
 *           等待图标高度
 */
function initWaiting(imgSrc, imgWidth, imgHeight) {
  var img=document.getElementById("waitingImg");
  if (img) {
    if (imgSrc)
      img.style.src=imgSrc;
	  
	if (imgWidth && imgHeight) {
      img.width=parseInt(imgWidth);
	  img.height=parseInt(imgHeight);
	}
  }
}

/**
 * 初始化界面尺寸
 *
 */
function initLocation() {
  $("#shield").fadeTo(1, 0.5);

  var shield=document.getElementById("shield");
  if (shield) {
	shield.style.left="0px";
	shield.style.top="0px";
	var offW, offH;
	if (document.documentElement) {
      offW=document.documentElement.offsetWidth;
      offH=document.documentElement.offsetHeight;
	} else {
      offW=document.body.offsetWidth;
      offH=document.body.offsetHeight;
	}
    shield.style.width=offW+"px";
    shield.style.height=offH+"px";		

    shield.style.display="none";

	var img=document.getElementById("waitingImg");
	if (img) {
      var w=img.width;
	  var h=img.height;
	  if (!w || !h) {
        var image=new Image();
        image.src=img.style.src;
		w=image.width;
		h=image.height;
	  }
      img.style.left=(offW/2-w/2)+"px";
      img.style.top=(offH/2-h/2)+"px";
      //img.style.display="none";
	}
  }
}

/**
 * 启动操作等待界面
 *
 */
function startWaiting() {
  initLocation();
  $("#shield").show();
  $("#waitingImg").show();
}

/**
 * 结束操作等待界面
 */
function endWaiting() {
  $("#shield").hide();
  $("#waitingImg").hide();
}

/**
 * 提交Form，并显示等待框
 * 
 * @param formId
 *           提交form标识
 * @param cs
 *           字符编码
 */
function submitWithWaiting(formId, cs) {
  var form=document.getElementById(formId);
  if (form) {
    if(cs && navigator.userAgent.indexOf('MSIE')>=0)
      document.charset=cs;
    form.submit();
	
	startWaiting();
  }
}

/**
 * 刷新，并显示等待框
 *
 * @param cs
 *           charset值
 */
function refreshWithWaiting(cs) {
    var form=document.getElementById("refreshForm");
    if (form) {
      submitWithWaiting("refreshForm", cs);
    } else {
      //if (window.navigator.userAgent.indexOf('Chrome') < 0)
        window.location.reload();
      //else
        //alert("当前浏览器无法刷新，建议您使用IE或Firefox!");
    } // end if (from) else
}
