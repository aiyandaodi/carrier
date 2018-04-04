/**
 * InnerWindow.js
 * ҳ����Ƕ������.
 * ��������һ��ҳ���ϲ�Ƕ�����һ��ҳ�棬������Ը�Ƕ��ҳ������ƶ������š���󻯡���С�����رյȲ�����
 *
 * ʹ��ʾ��:
 *   1��������ʾָ��ҳ��Ĵ��ڣ�
 *     showInnerPage("inner", url, "test", 0, 0, 200, 200, document.body);
 *
 *   2���Զ��崰�ڣ�
 *     var layer=createInnerWindow("test", document.body);
 *     layer.setStyle(InnerWindow.STYLE_NORMAL);
 *     layer.setNoResize(false);
 *     layer.setNoClose(false);
 *     layer.innerHtml("����");
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

InnerWindow.BORDER_WIDTH=2; // ����boder���

InnerWindow.STYLE_NONE=0x00; // ������ʽ��0x00 - ����ʾ�����������͵ײ�״̬��
InnerWindow.STYLE_TOP=0x01; // ������ʽ��ֻ��ʾ����������
//InnerWindow.STYLE_BOTTOM=0x02; // ������ʽ��ֻ��ʾ�ײ�״̬��
//InnerWindow.STYLE_NORMAL=0x03; // ������ʽ����ʾ�����������͵ײ�״̬��

InnerWindow.RESIZETYPE_NONE=0x00; // �ߴ�������ͣ���ֹ����
InnerWindow.RESIZETYPE_LOCATION=0x01; // �ߴ�������ͣ��������λ��
InnerWindow.RESIZETYPE_MOVE=0x02; // �ߴ�������ͣ���������ߴ�
InnerWindow.RESIZETYPE_NORMAL=0x03; // �ߴ�������ͣ��������λ�úͳߴ�

InnerWindow.DRAGTYPE_NONE=0x00; // ��ǰ��ק���ͣ�����ק
InnerWindow.DRAGTYPE_MOVE=0x01; // ��ǰ��ק���ͣ��ƶ�
InnerWindow.DRAGTYPE_TOP=0x11; //��ǰ��ק���ͣ��������������߶�
InnerWindow.DRAGTYPE_TOPRIGHT=0x12; // ��ǰ��ק���ͣ��������Ͻǳߴ�
InnerWindow.DRAGTYPE_RIGHT=0x13; // ��ǰ��ק���ͣ������Ҳ�������
InnerWindow.DRAGTYPE_BOTTOMRIGHT=0x14; // ��ǰ��ק���ͣ��������½ǳߴ�
InnerWindow.DRAGTYPE_BOTTOM=0x15; // ��ǰ��ק���ͣ������ײ������߶�
InnerWindow.DRAGTYPE_BOTTOMLEFT=0x16; // ��ǰ��ק���ͣ��������½ǳߴ�
InnerWindow.DRAGTYPE_LEFT=0x17; // ��ǰ��ק���ͣ��������������
InnerWindow.DRAGTYPE_TOPLEFT=0x18; // ��ǰ��ק���ͣ��������Ͻǳߴ�

InnerWindow.LOCATION_LEFT="left"; // ����x����λ�ã���
InnerWindow.LOCATION_CENTER="center"; // ����x����λ�ã��м�
InnerWindow.LOCATION_RIGHT="right"; // ����x����λ�ã���
InnerWindow.LOCATION_TOP="top"; // ����y����λ�ã�����
InnerWindow.LOCATION_MIDDLE="middle"; // ����y����λ�ã��м�
InnerWindow.LOCATION_BOTTOM="bottom"; // ����y����λ�ã��ײ�

InnerWindow.WINDOWTYPE_NORMAL=0x00; // ��ǰ�������ͣ�����
InnerWindow.WINDOWTYPE_MINMIZE=0x01; // ��ǰ�������ͣ���С��
InnerWindow.WINDOWTYPE_MAXIMIZE=0x02; // ��ǰ�������ͣ����

var windows=new Array(); // �ͼ������
var activeWindow; // ��ǰ��Ĵ���

document.onmousemove=mouseMove;
document.onmouseup=mouseUp;

/**
 * ȡ��ָ�����ƵĴ���
 *
 * @param name
 *           ��������
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
 * ȡ��ȫ����������
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
 * ȡ��ָ�����ƵĴ���
 * 
 * @param name
 *           ��������
 * @param parent
 *           ����ǩ��������element��id, ���Ϊ��Ĭ��Ϊdocument.body��
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
 * ������Ƕ����
 * 
 * @param name
 *           ��������
 * @param parent
 *           ����ǩ��������element��id, ���Ϊ��Ĭ��Ϊdocument.body��
 */
function InnerWindow(name, parent) {
  // ˽������
  this.name=name;
  this.style=InnerWindow.STYLE_NORMAL; // ������ʽ. ������InnerWindow.STYLE_NONE��InnerWindow.STYLE_TOP��InnerWindow.STYLE_BOTTOM��InnerWindow.STYLE_NORMAL
  this.resizeType=InnerWindow.RESIZETYPE_NORMAL; // �ߴ��������
  this.noClose=false; // ����ʾ�رհ�ť
  this.locationX; // ����X����λ��.
  this.locationY; // ����Y����λ��
  this.parent; // ��Ԫ��
  
  this.dragType=InnerWindow.DRAGTYPE_NONE; // ��ǰ��ק����.
  this.dragX; // ��ק��ʼX����
  this.dragY; // ��ק��ʼY����
  
  this.windowType=InnerWindow.WINDOWTYPE_NORMAL; // �ߴ�����
  this.resizeLeft; // ��ԭX����
  this.resizeTop; // ��ԭY����
  this.resizeWidth; // ��ԭ���
  this.resizeHeight; // ��ԭ�߶�

  if (parent) {
    if (typeof(parent)=="string")
	  this.parent=document.getElementById(parent);
	else
	  this.parent=parent;
  }
  
  if (!this.parent)
    this.parent=document.body;

  // ������������
  /**
   * ȡ�ô��ڵ�Ԫ��id
   */
  this.getId=function() {
    return this.name;
  }
  
  /**
   * ȡ�ô��ڱ�������Ԫ��id
   */
  this.getTopId=function() {
    return this.name+"Top";
  }
  
  /**
   * ȡ�ô������������Ԫ��id
   */
  this.getContentId=function() {
    return this.name+"Content";
  }
  
  /**
   * ȡ�ô���״̬����Ԫ��id
   
  this.getBottomId=function() {
    return this.name+"Bottom";
  }*/
  
  /**
   * ȡ�ô��ڱ�������Ԫ��id
   */
  this.getTitleId=function() {
    return this.name+"Title";
  }
  
  /**
   * ȡ�ô��ڹ��߰�ť����Ԫ��id
   */
  this.getToolbarId=function() {
    return this.name+"Toolbar";
  }
  
  /**
   * ȡ�ô�����С����ťԪ��id
   */
  this.getMinmizeId=function() {
	return this.name+"Minmize";  
  }

  /**
   * ȡ�ô�����󻯰�ťԪ��id
   */
  this.getMaximizeId=function() {
	return this.name+"Maximize";
  }

  /**
   * ȡ�ô��ڻ�ԭ��ťԪ��id
   */
  this.getResizeId=function() {
	return this.name+"Resize";
  }

  /**
   * ȡ�ô��ڹرհ�ťԪ��id
   */
  this.getCloseId=function() {
	return this.name+"Close";
  }

  /**
   * ȡ���ɰ�Ԫ��id
   */
  this.getShieldId=function() {
	return this.name+"-shield";
  }

  /**
   * �Ƿ���ʾ����������
   * 
   * @return �����ʾ, ����true; ����, ����false.
   */
  this.haveTop=function() {
    if ((this.style & InnerWindow.STYLE_TOP)==InnerWindow.STYLE_TOP)
      return true;
    else
      return false;
  }

  /**
   * �Ƿ���ʾ�ײ�״̬��
   * 
   * @return �����ʾ, ����true; ����, ����false.
   
  this.haveBottom=function() {
    if ((this.style & InnerWindow.STYLE_BOTTOM)==InnerWindow.STYLE_BOTTOM)
      return true;
    else
      return false;
  }*/

  /**
   * ȡ�õ�ǰ�������ק����
   *
   * @param evt
   *           �¼�
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
            // �������Ͻǳߴ�
            type=InnerWindow.DRAGTYPE_TOPLEFT;
          } else if ((width-offsetX)<=InnerWindow.BORDER_WIDTH) {
            // �������Ͻǳߴ�
            type=InnerWindow.DRAGTYPE_TOPRIGHT;
          } else {
            // ���������߶�
            type=InnerWindow.DRAGTYPE_TOP;
          }

        } else if ((width-offsetX)<=InnerWindow.BORDER_WIDTH) {
          if ((height-offsetY)<=InnerWindow.BORDER_WIDTH) {
            // �������½ǳߴ�
            type=InnerWindow.DRAGTYPE_BOTTOMRIGHT;
          } else {
            // �����Ҳ���
            type=InnerWindow.DRAGTYPE_RIGHT;
          }

        } else if (offsetX<=InnerWindow.BORDER_WIDTH) {
          if ((height-offsetY)<=InnerWindow.BORDER_WIDTH) {
            // �������½ǳߴ�
            type=InnerWindow.DRAGTYPE_BOTTOMLEFT;
          } else {
            // ���������
            type=InnerWindow.DRAGTYPE_LEFT;
          }
		
        } else {
          if ((height-offsetY)<=InnerWindow.BORDER_WIDTH) {
            // �����ײ��߶�
            type=InnerWindow.DRAGTYPE_BOTTOM;
		  }
	    } // end if (offsetY<=maxlen) else
      } // end  if (evt)
    } // end if (!noResize)

    if (this.dragType<=InnerWindow.DRAGTYPE_NONE) {
      if ((this.resizeType & InnerWindow.RESIZETYPE_MOVE) == InnerWindow.RESIZETYPE_MOVE) {
        if ((source.id==this.getTopId() && (offsetY-InnerWindow.BORDER_WIDTH)<=source.height)
		    || (source.id==this.getTitleId() && offsetY<=source.height)) {
          //�ƶ�
          type=InnerWindow.DRAGTYPE_MOVE;
        }
	  } // end if (!this.noResize)
    } // end if (this.dragType<=InnerWindow.DRAGTYPE_NONE)

    return type;
  }
  
  /**
   * ����ǰ���ڷ��������
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
   * ���óߴ������ť
   */
  this.setResizeButton=function() {
    var minElem=$("#"+this.getMinmizeId());
    var maxElem=$("#"+this.getMaximizeId());
    var resizeElem=$("#"+this.getResizeId());

    if ((this.windowType&InnerWindow.WINDOWTYPE_MINMIZE)==InnerWindow.WINDOWTYPE_MINMIZE) {
      // ��С��
      minElem.hide();
      maxElem.hide();
    
	  if ((this.resizeType&InnerWindow.RESIZETYPE_LOCATION)==InnerWindow.RESIZETYPE_LOCATION)
        resizeElem.show();
      else
	    resizeElem.hide();

    } else if ((this.windowType&InnerWindow.WINDOWTYPE_MAXIMIZE)==InnerWindow.WINDOWTYPE_MAXIMIZE) {
      // ���
      minElem.hide();
      maxElem.hide();

	  if ((this.resizeType&InnerWindow.RESIZETYPE_LOCATION)==InnerWindow.RESIZETYPE_LOCATION)
        resizeElem.show();
      else
	    resizeElem.hide();

    } else {
      // ����
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
  // ������
  html+="<li id='"+this.getTopId()+"' style='width:100%;min-height:30px;height:30px;'>";
  html+="<div id='"+this.getTitleId()+"' style='float:left;height:100%;font-family:΢���ź�;font-size:small;'></div>";
  html+="<table id='"+this.getToolbarId()+"' style='float:right;width:auto;height:100%;margin-top:5px;margin-right:3px;margin-bottom:5px;'>";
  html+="<tr>";
  html+="<td id='"+this.getMinmizeId()+"'><img width='21px' height='19px' src='../../js/window/"+minOutIcon+"' alt='��С��' onmouseover='javascript:this.src=\""+minOverIcon+"\";' onmouseout='javascript:this.src=\""+minOutIcon+"\";' onclick='getInnerWindow(\""+name+"\").setMinmize();' style='martin-right:5px;'/></td>";
  html+="<td id='"+this.getResizeId()+"' style='display:none;'><img width='21px' height='19px' src='../../js/window/"+resizeOutIcon+"' alt='��ԭ' onmouseover='javascript:this.src=\""+resizeOverIcon+"\";' onmouseout='javascript:this.src=\""+resizeOutIcon+"\";' onclick='getInnerWindow(\""+name+"\").setResize();'></td>";
  html+="<td id='"+this.getMaximizeId()+"'><img width='21px' height='19px' src='../../js/window/"+maxOutIcon+"' alt='���' onmouseover='javascript:this.src=\""+maxOverIcon+"\";' onmouseout='javascript:this.src=\""+maxOutIcon+"\";' onclick='getInnerWindow(\""+name+"\").setMaximize();'></td>";
  html+="<td id='"+this.getCloseId()+"'><img width='21px' height='19px' src='../../js/window/"+closeOutIcon+"'alt='�ر�' onmouseover='javascript:this.src=\""+closeOverIcon+"\";' onmouseout='javascript:this.src=\""+closeOutIcon+"\";' onclick='getInnerWindow(\""+name+"\").close();'></td>";
  html+="</tr>";
  html+="</table>";
  html+="</li>";
  // ����
  html+="<li id='"+this.getContentId()+"' style='width:100%;height:100%;'></li>";
  // ״̬��
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
 * ���ñ���
 *
 * @param title
 *           ����
 */
InnerWindow.prototype.setTitle=function(title) {
  $("#"+this.getTitleId()).html(title);
}

/**
 * ������ʽ
 *
 * @param style
 *           �ͼ����ʽ��InnerWindow.STYLE_NONE - ����ʾ�����������͵ײ�״̬��, InnerWindow.STYLE_TOP - ֻ��ʾ����������
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
 * ���óߴ��������
 * 
 * @param resizeType
 *           �ߴ��������. ������InnerWindow.RESIZETYPE_NONE��InnerWindow.RESIZETYPE_LOCATION��InnerWindow.RESIZETYPE_MOVE��InnerWindow.RESIZETYPE_NORMAL
 */
InnerWindow.prototype.setResizeType=function(resizeType) {
  this.resizeType=resizeType;
  this.setResizeButton();
}

/**
 * �����Ƿ���ʾ�رհ�ť
 * 
 * @param noClose
 *           �Ƿ���ʾ�رհ�ť
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
 * ���û���ڵı���
 *
 * @param background
 *           ������ɫ�򱳾�ͼƬ
 */
InnerWindow.prototype.setBackground=function(background) {
  $("#"+this.getId()).css("background", background);
}

/**
 * ���ô������ݵı���
 *
 * @param background
 *           ������ɫ�򱳾�ͼƬ
 */
InnerWindow.prototype.setContentBackground=function(background) {
  $("#"+this.getContentId()).css("background", background);
}

/**
 * ��ʼ��ק
 *
 * @param evt
 *           �¼�
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
      // ����contentIdԪ�أ���ֹ����iframeʹ����¼���Ч
	  getChildElementById(this.parent, this.getContentId()).style.display="none";
	}
  } // end if (dragType>0)
}

/**
 * ������ק
 *
 * @param evt
 *           �¼�
 */
InnerWindow.prototype.endDrag=function(evt) {
  this.dragType=InnerWindow.DRAGTYPE_NONE;

  var shield=getChildElementById(this.parent, this.getShieldId());
  if (shield)
    shield.style.display="block";

  getChildElementById(this.parent, this.getId()).style.opacity=1;
  // ����contentIdԪ�أ���ֹ����iframeʹ����¼���Ч
  getChildElementById(this.parent, this.getContentId()).style.display="block";
}

/**
 * ��ק
 *
 * @param evt
 *           �¼�
 */
InnerWindow.prototype.drag=function(evt) {
  if (!this.dragType || parseInt(this.dragType)<=InnerWindow.DRAGTYPE_NONE) {
    if (this==activeWindow) {
      var cursor;
      var type=parseInt(this.getDragType(evt));

      if (type==InnerWindow.DRAGTYPE_MOVE) {
        // �ƶ�
        cursor="move";
      } else if (type==InnerWindow.DRAGTYPE_TOP) {
        // ���������߶�
        cursor="n-resize";
      } else if (type==InnerWindow.DRAGTYPE_TOPRIGHT) {
        // �������Ͻǳߴ�
        cursor="ne-resize";
      } else if (type==InnerWindow.DRAGTYPE_RIGHT) {
        // �����Ҳ���
        cursor="e-resize";
      } else if (type==InnerWindow.DRAGTYPE_BOTTOMRIGHT) {
        // �������½ǳߴ�
        cursor="se-resize";
      } else if (type==InnerWindow.DRAGTYPE_BOTTOM) {
        // �����ײ��߶�
        cursor="s-resize";
      } else if (type==InnerWindow.DRAGTYPE_BOTTOMLEFT) {
        // �������½ǳߴ�
        cursor="sw-resize";
      } else if (type==InnerWindow.DRAGTYPE_LEFT) {
        // ���������
        cursor="w-resize";
      } else if (type==InnerWindow.DRAGTYPE_TOPLEFT) {
        // �������Ͻǳߴ�
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
        // �ƶ�
        newLeft=left+offsetX;
        newTop=top+offsetY;
        newWidth=width;
        newHeight=height;

      } else if (this.dragType==InnerWindow.DRAGTYPE_TOP) {
        // ���������߶�
        newLeft=left;
        newTop=top+offsetY;
        newWidth=width;
        newHeight=height-offsetY;
	  
      } else if (this.dragType==InnerWindow.DRAGTYPE_TOPRIGHT) {
        // �������Ͻǳߴ�
        newLeft=left;
        newTop=top+offsetY;
        newWidth=width+offsetX;
        newHeight=height-offsetY;
	  
      } else if (this.dragType==InnerWindow.DRAGTYPE_RIGHT) {
        // �����Ҳ���
        newLeft=left;
        newTop=top;
        newWidth=width+offsetX;
        newHeight=height;

      } else if (this.dragType==InnerWindow.DRAGTYPE_BOTTOMRIGHT) {
        // �������½ǳߴ�
        newLeft=left;
        newTop=top;
        newWidth=width+offsetX;
        newHeight=height+offsetY;

      } else if (this.dragType==InnerWindow.DRAGTYPE_BOTTOM) {
        // �����ײ��߶�
        newLeft=left;
        newTop=top;
        newWidth=width;
        newHeight=height+offsetY;

      } else if (this.dragType==InnerWindow.DRAGTYPE_BOTTOMLEFT) {
        // �������½ǳߴ�
        newLeft=left+offsetX;
        newTop=top;
        newWidth=width-offsetX;
        newHeight=height+offsetY;
  
      } else if (this.dragType==InnerWindow.DRAGTYPE_LEFT) {
        // ���������
        newLeft=left+offsetX;
        newTop=top;
        newWidth=width-offsetX;
        newHeight=height;
      } else if (this.dragType==InnerWindow.DRAGTYPE_TOPLEFT) {
        // �������Ͻǳߴ�
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
 * ׷��html�ַ�����getContentId()Ԫ����
 *
 * @param html
 *           html�ַ���
 */
InnerWindow.prototype.html=function(html) {
  var content=getChildElementById(this.parent, this.getContentId());
  if (content)
    content.innerHTML=html;
}

/**
 * ��ʾ����
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
 * ���ش���
 */
InnerWindow.prototype.hide=function() {
  var elem=getChildElementById(this.parent, this.getId());
  if (elem)
    elem.style.display="none";
}

/**
 * �رմ���
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
 * ���ô�������.
 *
 * @param left
 *           X�����λ�ã�InnerWindow.LOCATION_LEFT, InnerWindow.LOCATION_CENTER��InnerWindow.LOCATION_RIGHT)
 * @param top
 *           Y�����λ�ã�InnerWindow.LOCATION_TOP, InnerWindow.LOCATION_MIDDLE��InnerWindow.LOCATION_BOTTOM)
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
 * ���ûͼ��ߴ�
 *
 * @param width
 *           �ͼ����
 * @param height
 *           �ͼ��߶�
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
 * ��С��
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
 * ���
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
 * ��ԭ
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
 * ȡ�����������¼�Ԫ�ص��������
 *
 * @param evt
 *           �¼�
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
 * ȡ�����������¼�Ԫ��
 *
 * @param evt
 *           �¼�
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
 * ��parentԪ���²��ұ�ʶΪid��Ԫ��
 *
 * @param parent
 *           ��Ԫ��
 * @param id
 *           Ԫ�ر�ʶ
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
 * ȡ��ָ��Ԫ�صĳߴ�
 *
 * @param elem
 *           Ԫ��
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
 * ����ƶ�
 * 
 * @param evt
 *           �¼�
 */
function mouseMove(evt) {
  if (activeWindow)
    activeWindow.drag(evt);
}

/**
 * ����ͷ�
 * 
 * @param evt
 *           �¼�
 */
function mouseUp(evt) {
  if (activeWindow)
    activeWindow.endDrag(evt);
}

/**
 * ��һ��������ʾָ��ҳ
 * 
 * @param iframeName
 *           iframe���ƣ�����Ϊ�գ�
 * @param url
 *           ָ��ҳURL��ַ������Ϊ�գ�ͨ��from�ύ��
 * @param name
 *           ��������
 * @param left
 *           ����X�����λ��. λ��ֵ�����ǣ�InnerWindow.LOCATION_CENTER��InnerWindow.LOCATION_TOPRIGHT��InnerWindow.LOCATION_BOTTOMRIGHT��InnerWindow.LOCATION_BOTTOMLEFT��InnerWindow.LOCATION_TOPLEFT.
 * @param top
 *           ����Y����. ���left��������λ��, top����ֵ��Ч.
 * @param width
 *           ���ڿ��
 * @param height
 *           ���ڸ߶�
 * @param parent
 *           ���ڵĸ�Ԫ��. ���Ϊ�գ�Ĭ��Ϊdocument.body
 * @return ���ش��ڶ���
 */
function getPageWindow(iframeName, url, name, left, top, width, height, parent) {
  var layer=createInnerWindow(name, parent);
  //layer.setTitle("����");
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