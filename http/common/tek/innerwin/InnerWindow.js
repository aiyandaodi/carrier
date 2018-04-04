/**
 * InnerWindow.js
 * 页面内嵌窗口类.
 * 窗口是在一个页面上层嵌入的另一个页面，并允许对该嵌入页面进行移动、缩放、最大化、最小化、关闭等操作。
 *
 * 使用示例:
 *   1、创建显示指定页面的窗口：
 *     showInnerPage("inner", url, "test", 0, 0, 200, 200, document.body);
 *
 *   2、自定义窗口：
 *     var layer=createInnerWindow("test", document.body);
 *     layer.setStyle(InnerWindow.STYLE_NORMAL);
 *     layer.setNoResize(false);
 *     layer.setNoClose(false);
 *     layer.innerHtml("测试");
 *     layer.setLocation("100px", "100px");
 *     layer.setSize(50, 50);
 *     layer.show();
 */

var minOverIcon="/ipsay/http/common/js/window/icon/min_over.png";
var minOutIcon="/ipsay/http/common/js/window/icon/min_out.png";
var minDownIcon="/ipsay/http/common/js/window/icon/min_down.png";
var maxOverIcon="/ipsay/http/common/js/window/icon/max_over.png";
var maxOutIcon="/ipsay/http/common/js/window/icon/max_out.png";
var maxDownIcon="/ipsay/http/common/js/window/icon/max_down.png";
var resizeOverIcon="/ipsay/http/common/js/window/icon/resize_over.png";
var resizeOutIcon="/ipsay/http/common/js/window/icon/resize_out.png";
var resizeDownIcon="/ipsay/http/common/js/window/icon/resize_down.png";
var closeOverIcon="/ipsay/http/common/js/window/icon/close_over.png";
var closeOutIcon="/ipsay/http/common/js/window/icon/close_out.png";
var closeDownIcon="/ipsay/http/common/js/window/icon/close_down.png";

InnerWindow.BORDER_WIDTH=2; // 窗口boder宽度

InnerWindow.STYLE_NONE=0x00; // 窗口样式：0x00 - 不显示顶部标题栏和底部状态栏
InnerWindow.STYLE_TOP=0x01; // 窗口样式：只显示顶部标题栏
//InnerWindow.STYLE_BOTTOM=0x02; // 窗口样式：只显示底部状态栏
//InnerWindow.STYLE_NORMAL=0x03; // 窗口样式：显示顶部标题栏和底部状态栏

InnerWindow.RESIZETYPE_NONE=0x00; // 尺寸调整类型：禁止调整
InnerWindow.RESIZETYPE_LOCATION=0x01; // 尺寸调整类型：允许调整位置
InnerWindow.RESIZETYPE_MOVE=0x02; // 尺寸调整类型：允许调整尺寸
InnerWindow.RESIZETYPE_NORMAL=0x03; // 尺寸调整类型：允许调整位置和尺寸

InnerWindow.DRAGTYPE_NONE=0x00; // 当前拖拽类型：不拖拽
InnerWindow.DRAGTYPE_MOVE=0x01; // 当前拖拽类型：移动
InnerWindow.DRAGTYPE_TOP=0x11; //当前拖拽类型：调整顶部调整高度
InnerWindow.DRAGTYPE_TOPRIGHT=0x12; // 当前拖拽类型：调整右上角尺寸
InnerWindow.DRAGTYPE_RIGHT=0x13; // 当前拖拽类型：调整右侧调整宽度
InnerWindow.DRAGTYPE_BOTTOMRIGHT=0x14; // 当前拖拽类型：调整右下角尺寸
InnerWindow.DRAGTYPE_BOTTOM=0x15; // 当前拖拽类型：调整底部调整高度
InnerWindow.DRAGTYPE_BOTTOMLEFT=0x16; // 当前拖拽类型：调整左下角尺寸
InnerWindow.DRAGTYPE_LEFT=0x17; // 当前拖拽类型：调整左侧调整宽度
InnerWindow.DRAGTYPE_TOPLEFT=0x18; // 当前拖拽类型：调整左上角尺寸

InnerWindow.LOCATION_LEFT="left"; // 窗口x坐标位置：左
InnerWindow.LOCATION_CENTER="center"; // 窗口x坐标位置：中间
InnerWindow.LOCATION_RIGHT="right"; // 窗口x坐标位置：右
InnerWindow.LOCATION_TOP="top"; // 窗口y坐标位置：顶部
InnerWindow.LOCATION_MIDDLE="middle"; // 窗口y坐标位置：中间
InnerWindow.LOCATION_BOTTOM="bottom"; // 窗口y坐标位置：底部

InnerWindow.WINDOWTYPE_NORMAL=0x00; // 当前窗口类型：正常
InnerWindow.WINDOWTYPE_MINMIZE=0x01; // 当前窗口类型：最小化
InnerWindow.WINDOWTYPE_MAXIMIZE=0x02; // 当前窗口类型：最大化

var windows=new Array(); // 活动图层数组
var activeWindow; // 当前活动的窗口

document.onmousemove=mouseMove;
document.onmouseup=mouseUp;

/**
 * 取得指定名称的窗口
 *
 * @param name
 *           窗口名称
 */
function getInnerWindow(name) {
  if (name && (typeof(name)=="string")) {
    for (var i=0; i<windows.length; i++) {
      if (windows[i] && windows[i].name==name)
        return windows[i];
    }
  }
}

/**
 * 取得全部窗口名称
 *
 */
function getInnerWindowNames() {
  var names=new Array();
  
  for (var i=0; i<windows.length; i++) {
    if (windows[i])
	  names.push(windows[i].name)
  }
  
  return names;
}

/**
 * 取得指定名称的窗口
 * 
 * @param name
 *           窗口名称
 * @param parent
 *           父标签（可以是element或id, 如果为空默认为document.body）
 */
function createInnerWindow(name, parent) {  
  var win=getInnerWindow(name);
  
  if (!win) {
    win=new InnerWindow(name, parent);
    windows[windows.length]=win;
  }
  
  return win;
}

/**
 * 创建内嵌窗口
 * 
 * @param name
 *           窗口名称
 * @param parent
 *           父标签（可以是element或id, 如果为空默认为document.body）
 */
function InnerWindow(name, parent) {
  // 私有属性
  this.name=name;
  this.style=InnerWindow.STYLE_NORMAL; // 窗口样式. 可以是InnerWindow.STYLE_NONE、InnerWindow.STYLE_TOP、InnerWindow.STYLE_BOTTOM、InnerWindow.STYLE_NORMAL
  this.resizeType=InnerWindow.RESIZETYPE_NORMAL; // 尺寸调整类型
  this.noClose=false; // 不显示关闭按钮
  this.locationX; // 窗口X坐标位置.
  this.locationY; // 窗口Y坐标位置
  this.parent; // 父元素
  
  this.dragType=InnerWindow.DRAGTYPE_NONE; // 当前拖拽类型.
  this.dragX; // 拖拽起始X坐标
  this.dragY; // 拖拽起始Y坐标
  
  this.windowType=InnerWindow.WINDOWTYPE_NORMAL; // 尺寸类型
  this.resizeLeft; // 还原X坐标
  this.resizeTop; // 还原Y坐标
  this.resizeWidth; // 还原宽度
  this.resizeHeight; // 还原高度

  if (parent) {
    if (typeof(parent)=="string")
	  this.parent=document.getElementById(parent);
	else
	  this.parent=parent;
  }
  
  if (!this.parent)
    this.parent=document.body;

  // 方法属性声明
  /**
   * 取得窗口的元素id
   */
  this.getId=function() {
    return this.name;
  }
  
  /**
   * 取得窗口标题栏的元素id
   */
  this.getTopId=function() {
    return this.name+"Top";
  }
  
  /**
   * 取得窗口内容区域的元素id
   */
  this.getContentId=function() {
    return this.name+"Content";
  }
  
  /**
   * 取得窗口状态栏的元素id
   
  this.getBottomId=function() {
    return this.name+"Bottom";
  }*/
  
  /**
   * 取得窗口标题栏的元素id
   */
  this.getTitleId=function() {
    return this.name+"Title";
  }
  
  /**
   * 取得窗口工具按钮栏的元素id
   */
  this.getToolbarId=function() {
    return this.name+"Toolbar";
  }
  
  /**
   * 取得窗口最小化按钮元素id
   */
  this.getMinmizeId=function() {
	return this.name+"Minmize";  
  }

  /**
   * 取得窗口最大化按钮元素id
   */
  this.getMaximizeId=function() {
	return this.name+"Maximize";
  }

  /**
   * 取得窗口还原按钮元素id
   */
  this.getResizeId=function() {
	return this.name+"Resize";
  }

  /**
   * 取得窗口关闭按钮元素id
   */
  this.getCloseId=function() {
	return this.name+"Close";
  }

  /**
   * 取得蒙版元素id
   */
  this.getShieldId=function() {
	return this.name+"-shield";
  }

  /**
   * 是否显示顶部标题栏
   * 
   * @return 如果显示, 返回true; 否则, 返回false.
   */
  this.haveTop=function() {
    if ((this.style & InnerWindow.STYLE_TOP)==InnerWindow.STYLE_TOP)
      return true;
    else
      return false;
  }

  /**
   * 是否显示底部状态栏
   * 
   * @return 如果显示, 返回true; 否则, 返回false.
   
  this.haveBottom=function() {
    if ((this.style & InnerWindow.STYLE_BOTTOM)==InnerWindow.STYLE_BOTTOM)
      return true;
    else
      return false;
  }*/

  /**
   * 取得当前鼠标点的拖拽类型
   *
   * @param evt
   *           事件
   */
  this.getDragType=function(evt) {
	if (this!=activeWindow || this.windowType!=InnerWindow.WINDOWTYPE_NORMAL)
	  return 0;
	
    var type=0;
  
    evt = evt ? evt : window.event;
    var source=getSource(evt);
    var offset=getOffset(evt);
    if (!source || !offset)
      return type;

    var offsetX=parseInt(offset.offsetX);
    var offsetY=parseInt(offset.offsetY);
    var width=parseInt(source.width);
    var height=parseInt(source.height);

    if ((this.resizeType & InnerWindow.RESIZETYPE_LOCATION) == InnerWindow.RESIZETYPE_LOCATION) {
      if (evt && source.id==this.getId()) {
        if (offsetY<=InnerWindow.BORDER_WIDTH) {
          if (offsetX<=InnerWindow.BORDER_WIDTH) {
            // 调整左上角尺寸
            type=InnerWindow.DRAGTYPE_TOPLEFT;
          } else if ((width-offsetX)<=InnerWindow.BORDER_WIDTH) {
            // 调整右上角尺寸
            type=InnerWindow.DRAGTYPE_TOPRIGHT;
          } else {
            // 调整顶部高度
            type=InnerWindow.DRAGTYPE_TOP;
          }

        } else if ((width-offsetX)<=InnerWindow.BORDER_WIDTH) {
          if ((height-offsetY)<=InnerWindow.BORDER_WIDTH) {
            // 调整右下角尺寸
            type=InnerWindow.DRAGTYPE_BOTTOMRIGHT;
          } else {
            // 调整右侧宽度
            type=InnerWindow.DRAGTYPE_RIGHT;
          }

        } else if (offsetX<=InnerWindow.BORDER_WIDTH) {
          if ((height-offsetY)<=InnerWindow.BORDER_WIDTH) {
            // 调整左下角尺寸
            type=InnerWindow.DRAGTYPE_BOTTOMLEFT;
          } else {
            // 调整左侧宽度
            type=InnerWindow.DRAGTYPE_LEFT;
          }
		
        } else {
          if ((height-offsetY)<=InnerWindow.BORDER_WIDTH) {
            // 调整底部高度
            type=InnerWindow.DRAGTYPE_BOTTOM;
		  }
	    } // end if (offsetY<=maxlen) else
      } // end  if (evt)
    } // end if (!noResize)

    if (this.dragType<=InnerWindow.DRAGTYPE_NONE) {
      if ((this.resizeType & InnerWindow.RESIZETYPE_MOVE) == InnerWindow.RESIZETYPE_MOVE) {
        if ((source.id==this.getTopId() && (offsetY-InnerWindow.BORDER_WIDTH)<=source.height)
		    || (source.id==this.getTitleId() && offsetY<=source.height)) {
          //移动
          type=InnerWindow.DRAGTYPE_MOVE;
        }
	  } // end if (!this.noResize)
    } // end if (this.dragType<=InnerWindow.DRAGTYPE_NONE)

    return type;
  }
  
  /**
   * 将当前窗口放置在最顶层
   */
  this.setBlur=function() {
	if (this==activeWindow)
	  return;

    for (var i=0; i<windows.length; i++) {
      if (!windows[i])
	    continue;

	  windows[i].endDrag();	
      var elem=getChildElementById(this.parent, windows[i].getId());
	  if (elem)
	    elem.style.zIndex=elem.style.zIndex-1;
	}
	
	activeWindow=this;
    var activeElem=getChildElementById(this.parent, this.getId())
	if (activeElem)
	  activeElem.style.zIndex=windows.length+10+1;
  }

  /**
   * 设置尺寸调整按钮
   */
  this.setResizeButton=function() {
    var minElem=$("#"+this.getMinmizeId());
    var maxElem=$("#"+this.getMaximizeId());
    var resizeElem=$("#"+this.getResizeId());

    if ((this.windowType&InnerWindow.WINDOWTYPE_MINMIZE)==InnerWindow.WINDOWTYPE_MINMIZE) {
      // 最小化
      minElem.hide();
      maxElem.hide();
    
	  if ((this.resizeType&InnerWindow.RESIZETYPE_LOCATION)==InnerWindow.RESIZETYPE_LOCATION)
        resizeElem.show();
      else
	    resizeElem.hide();

    } else if ((this.windowType&InnerWindow.WINDOWTYPE_MAXIMIZE)==InnerWindow.WINDOWTYPE_MAXIMIZE) {
      // 最大化
      minElem.hide();
      maxElem.hide();

	  if ((this.resizeType&InnerWindow.RESIZETYPE_LOCATION)==InnerWindow.RESIZETYPE_LOCATION)
        resizeElem.show();
      else
	    resizeElem.hide();

    } else {
      // 正常
      resizeElem.hide();

	  if ((this.resizeType&InnerWindow.RESIZETYPE_LOCATION)==InnerWindow.RESIZETYPE_LOCATION) {
        maxElem.show();
        minElem.show();
	  } else {
        maxElem.hide();
        minElem.hide();
	  }
    }
  }

  var html="<ul id='"+this.getId()+"' name='"+this.getId()+"'style='position:absolute;left:0px;top:0px;width:0px;height:0px;margin:0;padding:0;text-align:center;text-decoration:none;list-style-type:none;border:"+InnerWindow.BORDER_WIDTH+"px solid #CCC;display:none;' onmousedown='getInnerWindow(\""+name+"\").startDrag(event)'; onmouseup='getInnerWindow(\""+name+"\").endDrag(event)'; onmousemove='getInnerWindow(\""+name+"\").drag(event)' onmouseover='getInnerWindow(\""+name+"\").drag(event)';>";
  // 标题栏
  html+="<li id='"+this.getTopId()+"' style='width:100%;min-height:30px;height:30px;'>";
  html+="<div id='"+this.getTitleId()+"' style='float:left;height:100%;font-family:微软雅黑;font-size:small;'></div>";
  html+="<table id='"+this.getToolbarId()+"' style='float:right;width:auto;height:100%;margin-top:5px;margin-right:3px;margin-bottom:5px;'>";
  html+="<tr>";
  html+="<td id='"+this.getMinmizeId()+"'><img width='21px' height='19px' src='../../js/window/"+minOutIcon+"' alt='最小化' onmouseover='javascript:this.src=\""+minOverIcon+"\";' onmouseout='javascript:this.src=\""+minOutIcon+"\";' onclick='getInnerWindow(\""+name+"\").setMinmize();' style='martin-right:5px;'/></td>";
  html+="<td id='"+this.getResizeId()+"' style='display:none;'><img width='21px' height='19px' src='../../js/window/"+resizeOutIcon+"' alt='还原' onmouseover='javascript:this.src=\""+resizeOverIcon+"\";' onmouseout='javascript:this.src=\""+resizeOutIcon+"\";' onclick='getInnerWindow(\""+name+"\").setResize();'></td>";
  html+="<td id='"+this.getMaximizeId()+"'><img width='21px' height='19px' src='../../js/window/"+maxOutIcon+"' alt='最大化' onmouseover='javascript:this.src=\""+maxOverIcon+"\";' onmouseout='javascript:this.src=\""+maxOutIcon+"\";' onclick='getInnerWindow(\""+name+"\").setMaximize();'></td>";
  html+="<td id='"+this.getCloseId()+"'><img width='21px' height='19px' src='../../js/window/"+closeOutIcon+"'alt='关闭' onmouseover='javascript:this.src=\""+closeOverIcon+"\";' onmouseout='javascript:this.src=\""+closeOutIcon+"\";' onclick='getInnerWindow(\""+name+"\").close();'></td>";
  html+="</tr>";
  html+="</table>";
  html+="</li>";
  // 内容
  html+="<li id='"+this.getContentId()+"' style='width:100%;height:100%;'></li>";
  // 状态栏
  //html+="<li id='"+this.getBottomId()+"' style='width:100%;height:15px;'></li>";
  html+="</ul>";

  var div=document.createElement("div");
  div.innerHTML=html;
  this.parent.appendChild(div);
  
/*  var elem=getElementRect(this.parent);
  if (elem) {
    var shield=document.createElement("div");
	shield.id=this.getShieldId();
	shield.name=this.getShieldId();
	shield.style.position="absolute";
	shield.style.left="0px";
	shield.style.top="0px";
	shield.style.width=elem.width;
	shield.style.height=elem.height;
	shield.style.backgroundColor="#9CF";
	shield.style.opacity=0.5;
	shield.style.zIndex=2;
	shield.style.display="none";
    this.parent.appendChild(shield);
  }*/
}

/**
 * 设置标题
 *
 * @param title
 *           标题
 */
InnerWindow.prototype.setTitle=function(title) {
  $("#"+this.getTitleId()).html(title);
}

/**
 * 设置样式
 *
 * @param style
 *           活动图层样式：InnerWindow.STYLE_NONE - 不显示顶部标题栏和底部状态栏, InnerWindow.STYLE_TOP - 只显示顶部标题栏
 */
InnerWindow.prototype.setStyle=function(style) {
  this.style=style;

  var topElem=getChildElementById(this.parent, this.getTopId());
  if (topElem) {
	var ch=topElem.childNodes;
	
    if (this.haveTop()) {
      for (var i=0; i<ch.length; i++) {
        if (ch[i])
		  ch[i].style.display="block";
	  }
	  
	} else {
      for (var i=0; i<ch.length; i++) {
        if (ch[i])
		  ch[i].style.display="none";
	  }
	} // end if (this.haveTop()) else
  } // end if (topElem)
  
  /*var bottomElem=getChildElementById(this.parent, this.getBottomId());
  if (bottomElem) {
    var ch=bottomElem.childNodes;
    if (this.haveBottom()) {
      for (var i=0; i<ch.length; i++) {
        if (ch[i])
		  ch[i].style.display="block";
	  }
	  
	} else {
      for (var i=0; i<ch.length; i++) {
        if (ch[i])
		  ch[i].style.display="none";
	  }
	} // end if (this.haveBottom()) else
  } // end if (bottomElem)*/
}

/**
 * 设置尺寸调整类型
 * 
 * @param resizeType
 *           尺寸调整类型. 可以是InnerWindow.RESIZETYPE_NONE、InnerWindow.RESIZETYPE_LOCATION、InnerWindow.RESIZETYPE_MOVE、InnerWindow.RESIZETYPE_NORMAL
 */
InnerWindow.prototype.setResizeType=function(resizeType) {
  this.resizeType=resizeType;
  this.setResizeButton();
}

/**
 * 设置是否不显示关闭按钮
 * 
 * @param noClose
 *           是否不显示关闭按钮
 */
InnerWindow.prototype.setNoClose=function(noClose) {
  this.noClose=noClose;	

  var closeElem=getChildElementById(this.parent, this.getCloseElemId());
  if (closeElem) {
    if (noClose)
	  closeElem.style.display="none";
    else
      closeElem.style.display="block";
  }
}

/**
 * 设置活动窗口的背景
 *
 * @param background
 *           背景颜色或背景图片
 */
InnerWindow.prototype.setBackground=function(background) {
  $("#"+this.getId()).css("background", background);
}

/**
 * 设置窗口内容的背景
 *
 * @param background
 *           背景颜色或背景图片
 */
InnerWindow.prototype.setContentBackground=function(background) {
  $("#"+this.getContentId()).css("background", background);
}

/**
 * 开始拖拽
 *
 * @param evt
 *           事件
 */
InnerWindow.prototype.startDrag=function(evt) {
  this.setBlur();
  
  if (this.dragType>InnerWindow.DRAGTYPE_NONE)
    return ;

  this.dragType=this.getDragType(evt);

  if (this.dragType>InnerWindow.DRAGTYPE_NONE) {
    if (evt) {
      this.dragX=evt.clientX;
	  this.dragY=evt.clientY;
      
	  var shield=getChildElementById(this.parent, this.getShieldId());
	  if (shield)
        shield.style.display="block";
		
      getChildElementById(this.parent, this.getId()).style.opacity=0.5;
      // 隐藏contentId元素，防止出现iframe使鼠标事件无效
	  getChildElementById(this.parent, this.getContentId()).style.display="none";
	}
  } // end if (dragType>0)
}

/**
 * 结束拖拽
 *
 * @param evt
 *           事件
 */
InnerWindow.prototype.endDrag=function(evt) {
  this.dragType=InnerWindow.DRAGTYPE_NONE;

  var shield=getChildElementById(this.parent, this.getShieldId());
  if (shield)
    shield.style.display="block";

  getChildElementById(this.parent, this.getId()).style.opacity=1;
  // 隐藏contentId元素，防止出现iframe使鼠标事件无效
  getChildElementById(this.parent, this.getContentId()).style.display="block";
}

/**
 * 拖拽
 *
 * @param evt
 *           事件
 */
InnerWindow.prototype.drag=function(evt) {
  if (!this.dragType || parseInt(this.dragType)<=InnerWindow.DRAGTYPE_NONE) {
    if (this==activeWindow) {
      var cursor;
      var type=parseInt(this.getDragType(evt));

      if (type==InnerWindow.DRAGTYPE_MOVE) {
        // 移动
        cursor="move";
      } else if (type==InnerWindow.DRAGTYPE_TOP) {
        // 调整顶部高度
        cursor="n-resize";
      } else if (type==InnerWindow.DRAGTYPE_TOPRIGHT) {
        // 调整右上角尺寸
        cursor="ne-resize";
      } else if (type==InnerWindow.DRAGTYPE_RIGHT) {
        // 调整右侧宽度
        cursor="e-resize";
      } else if (type==InnerWindow.DRAGTYPE_BOTTOMRIGHT) {
        // 调整右下角尺寸
        cursor="se-resize";
      } else if (type==InnerWindow.DRAGTYPE_BOTTOM) {
        // 调整底部高度
        cursor="s-resize";
      } else if (type==InnerWindow.DRAGTYPE_BOTTOMLEFT) {
        // 调整左下角尺寸
        cursor="sw-resize";
      } else if (type==InnerWindow.DRAGTYPE_LEFT) {
        // 调整左侧宽度
        cursor="w-resize";
      } else if (type==InnerWindow.DRAGTYPE_TOPLEFT) {
        // 调整左上角尺寸
        cursor="nw-resize";
      } else {
        cursor="default";
      }
      if (cursor)
        document.body.style.cursor=cursor;
    }
  } // end if (dragType && parseInt(dragType)<=0)
	
  if (!this.dragType || parseInt(this.dragType)<=0)
    return;

  evt = evt ? evt : window.event;
  if (!evt)
    return ;

    var source=getSource(evt);
    if (!source)
      return;

    var offsetX=evt.clientX-this.dragX;
    var offsetY=evt.clientY-this.dragY;
 
    var win=getChildElementById(this.parent, this.getId());
    if (win) {
      var left=parseInt(win.style.left);
      var top=parseInt(win.style.top);
      var width=parseInt(win.style.width);
      var height=parseInt(win.style.height);

      var newLeft;
      var newTop;
      var newWidth;
      var newHeight;

      if (this.dragType==InnerWindow.DRAGTYPE_MOVE) {
        // 移动
        newLeft=left+offsetX;
        newTop=top+offsetY;
        newWidth=width;
        newHeight=height;

      } else if (this.dragType==InnerWindow.DRAGTYPE_TOP) {
        // 调整顶部高度
        newLeft=left;
        newTop=top+offsetY;
        newWidth=width;
        newHeight=height-offsetY;
	  
      } else if (this.dragType==InnerWindow.DRAGTYPE_TOPRIGHT) {
        // 调整右上角尺寸
        newLeft=left;
        newTop=top+offsetY;
        newWidth=width+offsetX;
        newHeight=height-offsetY;
	  
      } else if (this.dragType==InnerWindow.DRAGTYPE_RIGHT) {
        // 调整右侧宽度
        newLeft=left;
        newTop=top;
        newWidth=width+offsetX;
        newHeight=height;

      } else if (this.dragType==InnerWindow.DRAGTYPE_BOTTOMRIGHT) {
        // 调整右下角尺寸
        newLeft=left;
        newTop=top;
        newWidth=width+offsetX;
        newHeight=height+offsetY;

      } else if (this.dragType==InnerWindow.DRAGTYPE_BOTTOM) {
        // 调整底部高度
        newLeft=left;
        newTop=top;
        newWidth=width;
        newHeight=height+offsetY;

      } else if (this.dragType==InnerWindow.DRAGTYPE_BOTTOMLEFT) {
        // 调整左下角尺寸
        newLeft=left+offsetX;
        newTop=top;
        newWidth=width-offsetX;
        newHeight=height+offsetY;
  
      } else if (this.dragType==InnerWindow.DRAGTYPE_LEFT) {
        // 调整左侧宽度
        newLeft=left+offsetX;
        newTop=top;
        newWidth=width-offsetX;
        newHeight=height;
      } else if (this.dragType==InnerWindow.DRAGTYPE_TOPLEFT) {
        // 调整左上角尺寸
        newLeft=left+offsetX;
        newTop=top+offsetY;
        newWidth=width-offsetX;
        newHeight=height-offsetY;
      }

    var minW=InnerWindow.BORDER_WIDTH*2;
    var minH=0;
    if (this.haveTop())
      minH+=parseInt($("#"+this.getTopId(this.name)).height());
    //if (this.haveBottom())
    //  minH+=parseInt($("#"+this.getBottomId(this.name)).height());

    var rect=getElementRect(this.parent);
    if (newWidth>minW && newHeight>(minH-1) && newLeft
	    && rect.left<=newLeft && rect.top<=newTop && rect.right>=(newLeft+newWidth+InnerWindow.BORDER_WIDTH*2) && rect.bottom>=(newTop+newHeight+InnerWindow.BORDER_WIDTH*2)) {
      this.setLocation(newLeft, newTop);
      this.setSize(newWidth, newHeight);
      this.dragX=evt.clientX;
      this.dragY=evt.clientY;
    }
  } // end if (window)
}

/**
 * 追加html字符串到getContentId()元素中
 *
 * @param html
 *           html字符串
 */
InnerWindow.prototype.html=function(html) {
  var content=getChildElementById(this.parent, this.getContentId());
  if (content)
    content.innerHTML=html;
}

/**
 * 显示窗口
 */
InnerWindow.prototype.show=function() {
  this.setBlur();

  var elem=getChildElementById(this.parent, this.getId());
  if (!elem)
    return;

  var parentRect=getElementRect(this.parent);
  if (!parentRect)
    return ;

  if (this.locationX==InnerWindow.LOCATION_LEFT)
    elem.style.left=parseInt(parentRect.left)+"px";
  else if (this.locationX==InnerWindow.LOCATION_CENTER)
    elem.style.left=(parseInt(parentRect.left)+parseInt(parentRect.width)/2-parseInt(elem.style.width)/2-InnerWindow.BORDER_WIDTH)+"px";
  else if (this.locationX==InnerWindow.LOCATION_RIGHT)
    elem.style.left=(parseInt(parentRect.right)-parseInt(elem.style.width)-InnerWindow.BORDER_WIDTH*2)+"px";

  if (this.locationY==InnerWindow.LOCATION_TOP)
    elem.style.top=parseInt(parentRect.top)+"px";
  else if (this.locationY==InnerWindow.LOCATION_MIDDLE)
    elem.style.top=(parseInt(parentRect.top)+parseInt(parentRect.height)/2-parseInt(elem.style.height)/2-InnerWindow.BORDER_WIDTH)+"px";
  else if (this.locationY==InnerWindow.LOCATION_BOTTOM)
    elem.style.top=(parseInt(parentRect.bottom)-parseInt(elem.style.height)-InnerWindow.BORDER_WIDTH*2)+"px";

  elem.style.display="block";
}

/**
 * 隐藏窗口
 */
InnerWindow.prototype.hide=function() {
  var elem=getChildElementById(this.parent, this.getId());
  if (elem)
    elem.style.display="none";
}

/**
 * 关闭窗口
 */
InnerWindow.prototype.close=function() {
  var removeNum;
  var act=-1;
  var zIndex=-1;
  
  for (var i=0; i<windows.length; i++) {
    if (!windows[i])
	  continue;
	  
	if (windows[i].getId()==this.getId()) {
      removeNum=i;
	} else {
      var elem=getChildElementById(this.parent, this.getId());
      if (elem && elem.style.zIndex>zIndex) {
		act=i;
		zIndex=elem.style.zIndex;  
	  }
	}
  }
  
  if (act>=0)
    windows[act].setBlur();

  if (removeNum>=0) {
    delete windows[removeNum];
	var elem=getChildElementById(this.parent, this.getId());
    if (elem)
      elem.parentNode.removeChild(elem);
  }
}

/**
 * 设置窗口坐标.
 *
 * @param left
 *           X坐标或位置（InnerWindow.LOCATION_LEFT, InnerWindow.LOCATION_CENTER、InnerWindow.LOCATION_RIGHT)
 * @param top
 *           Y坐标或位置（InnerWindow.LOCATION_TOP, InnerWindow.LOCATION_MIDDLE、InnerWindow.LOCATION_BOTTOM)
 */
InnerWindow.prototype.setLocation=function(left, top) {
  var win=getChildElementById(this.parent, this.getId());
  if (!win)
    return;

  var parentRect=getElementRect(this.parent);
  if (!parentRect)
    return;

  if (isNaN(left)) {
    this.locationX=left;
  } else {
    left=parseInt(left);
    if (left<parentRect.left)
      left=parentRect.left;
    win.style.left=left+"px";
    this.locationX=null;
  }
  
  if (isNaN(top)) {
    this.locationY=top;
  } else {
    top=parseInt(top);
    if (top<parentRect.top)
      top=parentRect.top;
    win.style.top=top+"px";
    this.locationY=null;
  }
}

/**
 * 设置活动图层尺寸
 *
 * @param width
 *           活动图层宽度
 * @param height
 *           活动图层高度
 */
InnerWindow.prototype.setSize=function(width, height) {
  width=parseInt(width);
  height=parseInt(height);

  var h=0;
  
  var topElem=getChildElementById(this.parent, this.getTopId());
  if (topElem)
    h+=parseInt(topElem.style.height);
  /*var bottomElem=getChildElementById(this.parent, this.getBottomId());
  if (bottomElem)
    h+=parseInt(bottomElem.style.height);*/
  
  var idElem=getChildElementById(this.parent, this.getId());
  if (idElem) {
    var pRect=getElementRect(this.parent);
    if (pRect && pRect.width<width)
      width=pRect.width;
	idElem.style.width=width+"px";

	var contentElem=getChildElementById(this.parent, this.getContentId());
    if (h>height) {
      if (contentElem)
	    contentElem.style.height="0px";
	  idELem.style.height=h+"px";
    } else {
      if (contentElem)
	    contentElem.style.height=(height-h)+"px";
      idElem.style.height=height+"px";
    }
  }
}

/**
 * 最小化
 */
InnerWindow.prototype.setMinmize=function() {
  if (this.noResize)
    return;

  var win=getChildElementById(this.parent, this.getId());
  var toolbar=getChildElementById(this.parent, this.getToolbarId());
  var title=getChildElementById(this.parent, this.getTitleId());
  var top=getChildElementById(this.parent, this.getTopId());
  //var bottom=getChildElementById(this.parent, this.getBottomId());
  if (!win || !toolbar || !title || !top)
    return;

  var winRect=getElementRect(win);
  var toolbarRect=getElementRect(toolbar);
  var titleRect=getElementRect(title);
  var topRect=getElementRect(top);
  //var bottomRect=getElementRect(bottom);

  this.resizeLeft=winRect.left
  this.resizeTop=winRect.top;
  this.resizeWidth=winRect.width;
  this.resizeHeight=winRect.height;
  
  var minLeft=winRect.right-titleRect.width-toolbarRect.width-InnerWindow.BORDER_WIDTH*2;
  if (minLeft<winRect.left)
    minLeft=winRect.left;
  this.setLocation(minLeft, winRect.top);

  var minWidth=titleRect.width+toolbarRect.width;
  var minHeight=topRect.height;//+bottomRect.height;
  this.setSize(minWidth, minHeight);
  
  this.windowType=InnerWindow.WINDOWTYPE_MINMIZE;
  this.setResizeButton();
}

/**
 * 最大化
 */
InnerWindow.prototype.setMaximize=function() {
  if (this.noResize)
    return;

  var elem=getChildElementById(this.parent, this.getId());
  if (elem) {
    var elemRect=getElementRect(elem);
    var parentRect=getElementRect(this.parent);

	this.resizeLeft=elemRect.left
	this.resizeTop=elemRect.top;
	this.resizeWidth=elemRect.width;
	this.resizeHeight=elemRect.height;
	
	this.setLocation((parentRect.left+InnerWindow.BORDER_WIDTH), (parentRect.top+InnerWindow.BORDER_WIDTH));
	this.setSize(parentRect.width, parentRect.height);
  
    this.windowType=InnerWindow.WINDOWTYPE_MAXIMIZE;
    this.setResizeButton();
  }
}

/**
 * 还原
 */
InnerWindow.prototype.setResize=function() {
  if (this.noResize)
    return;

  var elem=getChildElementById(this.parent, this.getId());
  if (elem) {
	this.setLocation(this.resizeLeft, this.resizeTop);
	this.setSize(this.resizeWidth, this.resizeHeight);
  
    this.windowType=InnerWindow.WINDOWTYPE_NORMAL;
    this.setResizeButton();
  }
}

/**
 * 取得鼠标相对于事件元素的相对坐标
 *
 * @param evt
 *           事件
 */
function getOffset(evt) {
  evt=evt?evt:window.event;

  if (evt) {
    var box=(evt.target || evt.srcElement).getBoundingClientRect();
    if (box)
      return {"offsetX":evt.clientX-box.left, "offsetY":evt.clientY-box.top};
  }
}

/**
 * 取得鼠标相对于事件元素
 *
 * @param evt
 *           事件
 */
function getSource(evt) {
  evt=evt?evt:window.event;
  if (!evt)
    return;

  if (evt.srcElement) {
	var source=evt.srcElement;
    var rect=source.getBoundingClientRect();
	if (rect)
	  return {"id":source.id, "width":(rect.right-rect.left), "height":(rect.bottom-rect.top)};
	  
  } else if (evt.target) {
    var source=evt.target;
    var rect=source.getBoundingClientRect();
    if (rect)
	  return {"id":source.id, "width":rect.width, "height":rect.height};
  }
}

/**
 * 从parent元素下查找标识为id的元素
 *
 * @param parent
 *           父元素
 * @param id
 *           元素标识
 */
function getChildElementById(parent, id) {
  if (!parent || !id)
    return null;

  var children=parent.childNodes;

  if (children!=null && children.length>0) {
    for (var i=0; i<children.length; i++) {
      if (!children[i])
	    continue;

      var elem;
	  if (children[i].id==id)
	    elem=children[i];
      else
	    elem=getChildElementById(children[i], id);
      
	  if (elem)
	    return elem;
	}
  }
  
  return null;
}

/**
 * 取得指定元素的尺寸
 *
 * @param elem
 *           元素
 */
function getElementRect(elem) {
  if (!elem)
    return
	  
  var rect=elem.getBoundingClientRect();
  if (rect) {
    var o=new Object();
	o.left=rect.left;
	o.right=rect.right ? rect.right : (o.left+rect.width);
	o.top=rect.top;
	o.bottom=rect.bottom ? rect.bottom : (o.top+rect.height);
	o.width=rect.width ? rect.width : (o.right-o.left);
	o.height=rect.height ? rect.height : (o.bottom-o.top);
	
	return o;
  }
}

/**
 * 鼠标移动
 * 
 * @param evt
 *           事件
 */
function mouseMove(evt) {
  if (activeWindow)
    activeWindow.drag(evt);
}

/**
 * 鼠标释放
 * 
 * @param evt
 *           事件
 */
function mouseUp(evt) {
  if (activeWindow)
    activeWindow.endDrag(evt);
}

/**
 * 打开一个窗口显示指定页
 * 
 * @param iframeName
 *           iframe名称（不能为空）
 * @param url
 *           指定页URL地址（可以为空，通过from提交）
 * @param name
 *           窗口名称
 * @param left
 *           窗口X坐标或位置. 位置值可以是：InnerWindow.LOCATION_CENTER、InnerWindow.LOCATION_TOPRIGHT、InnerWindow.LOCATION_BOTTOMRIGHT、InnerWindow.LOCATION_BOTTOMLEFT、InnerWindow.LOCATION_TOPLEFT.
 * @param top
 *           窗口Y坐标. 如果left参数表上位置, top参数值无效.
 * @param width
 *           窗口宽度
 * @param height
 *           窗口高度
 * @param parent
 *           窗口的父元素. 如果为空，默认为document.body
 * @return 返回窗口对象
 */
function getPageWindow(iframeName, url, name, left, top, width, height, parent) {
  var layer=createInnerWindow(name, parent);
  //layer.setTitle("测试");
  layer.setStyle(InnerWindow.STYLE_TOP);
  layer.setResizeType(InnerWindow.RESIZETYPE_MOVE);
  layer.setLocation(left, top);
  layer.setSize(width, height);
  layer.setBackground("#cae3f6");
  layer.setContentBackground("#f0f9ff");
  
  var html="<iframe id='"+iframeName+"' name='"+iframeName+"' frameborder='no' border='0' marginwidth='0' marginheight='0' allowtransparency='yes' style='width:100%;height:97%;'";
  if (url)
    html+=" src='"+url+"'";
  html+="></iframe>";
  layer.html(html);

  return layer;
}