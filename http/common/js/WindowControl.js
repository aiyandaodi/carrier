//窗口控制类。需要LayerControl.js
//请调用前定义：
//var winimg_logo   --  logo标示url(icons/logo/tekinfo-minilogo.gif)
//var winimg_restore  --  恢复起始大小的图标url(icons/toolbar/restore16.gif)
//var winimg_toMax  --  最大化图标url(icons/toolbar/toMax16.gif)
//var winimg_toMin  --  最小化图标url(icons/toolbar/toHide16.gif)
//var winimg_resize --  更改大小图标url(icons/toolbar/resize.gif)
var winimg_logo="../images/tekinfo-minilogo.gif";
var winimg_restore="../images/restore16.gif";
var winimg_toMax="../images/toMax16.gif";
var winimg_toMin="../images/toHide16.gif";
var winimg_resize ="../images/resize.gif";

function setWindowImage(logo,restore,toMax,toMin,resize)
{
	winimg_logo=logo;
	winimg_restore=restore;
	winimg_toMax=toMax;
	winimg_toMin=toMin;
	winimg_resize=resize;
}

function WindowControl(winName)
{
  return WindowsControl(winName,0x04,1);
}

//winName -- 窗口名字
//status -- 状态：0 没有标题栏，状态栏：0x01 有标题栏；0x02-有状态栏;

function WindowControl(winName,status,borderWidth)
{
	
	//alert("it="+isHaveTitle+";ib="+isHaveStatusbar);

        var isHaveTitle=false;
        var isHaveStatusbar=false;
        if ( (status & 0x01)==0x01 )
          isHaveTitle=true;
        if ( (status & 0x02)==0x02 )
          isHaveStatusbar=true;
          
	this.name=winName;
	
	var titleHeight=0;
	var bottomHeight=0;
	var window_title,window_main,window_bottom;
	
	if (isHaveTitle)
	{
		titleHeight=18;
		document.writeln("<div id='window_title_"+winName+"' style='position:absolute; left:-120px; top:-200px; width:0; height:0; z-index:10';visibility: hide;>");
		document.writeln("</div>");	
		var cmd="window_title=new LayerControl('window_title_"+winName+"');";
		eval(cmd);
		
		window_title.write("<table width='100%' height='"+titleHeight+"' border='0' cellspacing='0' cellpadding='0' bgcolor='#C0C0C0'>"+
				"<tr>"+
				"<td align='left' width='50'><img src='"+winimg_logo+"' border='0' onclick='javascript:window.open(\"http://www.takall.com\");'></td>"+
			    "<td onmousedown='javascript:window_dragWindow(\""+winName+"\",event);'"+ 
			     //  " onmousemove='javascript:window_moveWindow(\""+winName+"\");'"+
			       " onmouseup='javascript:window_dropWindow();'"+

		   		   " ondblClick='javascript:window_alterWindow(\""+winName+"\");'"+
				   " style='cursor:move'"+
		   		">&nbsp;</td>"+
				
				"<td width='18' align='center' valign='middle'"+
								" onClick='javascript:window_toOriginal(\""+winName+"\");'>"+
								"<img src='"+winimg_restore+"' border='0'  width='16' height='16'>"+
							"</td>"+
				"<td width='18' align='center' valign='middle'"+
								" onClick='javascript:window_toMax(\""+winName+"\");'>"+
								" <img src='"+winimg_toMax+"' border='0'  width='16' height='16'>"+
							"</td>"+
				"<td width='18' align='center' valign='middle'"+
								" onClick='javascript:window_toMin(\""+winName+"\");'>"+
								"<img src='"+winimg_toMin+"' border='0'  width='16' height='16'>"+
								"</td>"+
				"</tr>"+
				"</table>");
	}
	
	document.writeln("<div id='window_main_"+winName+"' style='position:absolute; left:-120px; top:-200px; width:0;  height:0; z-index:10';visibility: hide;></div>");
	var cmd="window_main=new LayerControl('window_main_"+winName+"');";
	eval(cmd);

	window_main.write("<iframe id='iframe_"+winName+"' width='0' height='0' scrolling='auto' frameborder='"+borderWidth+"' ></iframe>");
	
	if (isHaveStatusbar)
	{
		bottomHeight=14;
		document.writeln("<div id='window_bottom_"+winName+"' style='position:absolute; left:-120px; top:-200px; width:0;  height:0; z-index:10';visibility: hide;>");
		document.writeln("</div>");	
		var cmd="window_bottom=new LayerControl('window_bottom_"+winName+"');";
		
		eval(cmd);

		var s_bottom="<table width='100%' height='100%' border='0' cellspacing='0' cellpadding='0' bgcolor='#D7D7D7'>"+
				"<tr>"+
				"<td align='right' valign='bottom'>"+
					"<img src='"+winimg_resize+"' border='0'  width='16' height='16'"+
					"  style='cursor:se-resize'"+ 
					" onmousedown='javascript:window_startResize(\""+winName+"\");'"+ 
 			        " onmouseup='javascript:window_stopResize();'>"+
				"</td>"+
				"</tr>"+
				"</table>";
				//alert(s_bottom);
		window_bottom.write(s_bottom);
	}
	
  this.xpos=getLeft;
  this.ypos=getTop;
  this.getLeft=getLeft;
  this.getTop=getTop;
  this.getWidth=getWidth;
  this.getHeight=getHeight;


  this.startDrag=startDrag;
  this.stopDrag=stopDrag;
  
  this.moveTo=moveTo;  
  this.moveByMouse=moveByMouse;  
  this.reSize=reSize;
  this.enLarge=enLarge;
  this.reWidth=reWidth;
  this.reHeight=reHeight;
  
  this.startResize=startResize;
  this.stopResize=stopResize;
  this.resizeByMouse=resizeByMouse;
  
  this.getWindowWidth= window_main.getWindowWidth;
  this.getWindowHeight= window_main.getWindowHeight;

  this.alterMax=alterMax;
  this.toMax=toMax;
  this.toOriginal=toOriginal;
  //隐藏窗口
  this.hide=hide;
  //显示窗口
  this.show=show;
  //载入url
  this.load=layerLoad;
  
  var ns4 = (document.layers)? true:false;
	var doc_all;
	var doc_style;
	if(ns4)
	{
		doc_all="";
		doc_style="";
	}
	else
	{
		//doc_all="all.";
		doc_all="";
		doc_style="style.";
	}

  function getLeft()
  {
  	if (window_title)
		return window_title.getLeft();
	else
		return window_main.getLeft();
  }
  
  function getTop()
  {
  	if (window_title)
		return window_title.getTop();
	else
		return window_main.getTop();
  }
  
  function getHeight()
  {
  	var height=window_main.getHeight();
  	
  	if (window_title)
		height=(parseInt(height)+parseInt(titleHeight));
	if (window_bottom)
		height=(parseInt(height)+parseInt(bottomHeight));

	return height;
  }
  
  function getWidth()
  {
  	return window_main.getWidth();
  }
  
  function getWindowWidth()
  {
  	return window_main.getWindowWidth();
  }
  function getWindowHeight()
  {
  	return window_main.getWindowHeight();
  }

  function layerLoad(newurl)
  {
  	var cmd="document.getElementById(\""+doc_all+"iframe_"+winName+"\").src=\""+newurl+"\"";
    eval(cmd);
  }
  
  function reSize(w,h)
  {
	reWidth(w);    	
   	reHeight(h);
  }
  
  function enLarge(w,h)
  {
    var neww=(parseInt(getWidth())+parseInt(w));
    var newh=(parseInt(getHeight())+parseInt(h));
    reSize(neww,newh);
  }
  
  var original_x,original_y,original_w,original_h;
  var isMax;
  function toMax()
  {
  	if(!isMax)
	{
	  	original_x=getLeft();
		original_y=getTop();
		original_w=getWidth();
		original_h=getHeight();
	  	var neww=getWindowWidth();
    	var newh=getWindowHeight();
		
    	reSize(neww,newh);
		moveTo(0,0);
		isMax=true;
	}
  }
  
  function toOriginal()
  {
  	if (isMax)
	{
		reSize(original_w,original_h);
		moveTo(original_x,original_y);
		isMax=false;
	}
  }
  
  function alterMax()
  {
  	if (isMax)
		toOriginal();
	else
		toMax();
  }
  
  function reWidth(w)
  {
	if (window_title)	
		window_title.reWidth(w);
	window_main.reWidth(w);
	if (window_bottom)
		window_bottom.reWidth(w);
		
	var cmd="document.getElementById(\""+doc_all+"iframe_"+winName+"\")."+doc_style+"width="+(parseInt(w))+";";
	eval(cmd);
  }
  
  function reHeight(h)
  {
  	var mainheight=(parseInt(h)-parseInt(titleHeight)-parseInt(bottomHeight));

	if (window_title)
	    window_title.reHeight(titleHeight);
	window_main.reHeight(mainheight);
	if (window_bottom)
	{
		var x=parseInt(window_bottom.getLeft());
		var y=(parseInt(getTop())+parseInt(h)-parseInt(bottomHeight));
		
		window_bottom.reHeight(bottomHeight);
		window_bottom.moveTo(x,y);
	}

	var cmd="document.getElementById(\""+doc_all+"iframe_"+winName+"\")."+doc_style+"height="+(mainheight)+";";
	eval(cmd);
  }
  
  var drag_x=0,drag_y=0;
  var isDrag=false;;
  function startDrag(evt)
  {
	  evt = evt ? evt : (window.event ? window.event : null);
  	  if (!isDrag)
	  {
		isDrag=true;
   		drag_x=parseInt(evt.clientX)-parseInt(window_title.getLeft());
		drag_y=parseInt(evt.clientY)-parseInt(window_title.getTop());
	  }
  }
  
  function stopDrag()
  {
  	isDrag=false;
  }
  
  var isResize=false;
  function startResize()
  {
  	isResize=true;
  }
  function stopResize()
  {
  	isResize=false;
  }
  
  function resizeByMouse(evt)
  {
  	if(isResize)
	{
		evt = evt ? evt : (window.event ? window.event : null);
	  	var x=getLeft();
		var y=getTop();
		var w=(parseInt(evt.clientX)-parseInt(x));
		var h=(parseInt(evt.clientY)-parseInt(y));
		reSize(w,h);
	}
  }
  
  function moveByMouse(evt)
  {
  	if(isDrag)
	{
		evt = evt ? evt : (window.event ? window.event : null);
		var cur_x=parseInt(evt.clientX)-parseInt(drag_x);
		var cur_y=parseInt(evt.clientY)-parseInt(drag_y);

		moveTo(cur_x,cur_y);
	}
  }
  
  function moveTo(x,y)
  {
  	if (window_title)
		window_title.moveTo(x,y);
	var y_main=parseInt(y)+parseInt(titleHeight);
	window_main.moveTo( x,y_main );
	
	y_bottom=parseInt(y)+(parseInt(getHeight())-parseInt(bottomHeight));
//alert("y="+y+";gh="+getHeight()+";bh="+bottomHeight+";y_main="+y_main+";wy="+window_main.getHeight()+";yb="+y_bottom);
	if (window_bottom)
		window_bottom.moveTo( x,y_bottom );
  }
  
  function show()
  {
  	if (window_title)
		window_title.show();
	window_main.show();
	if (window_bottom)
		window_bottom.show();
  }
  
  function hide()
  {
  	if (window_title)
		window_title.hide();
	window_main.hide();
	if (window_bottom)
		window_bottom.hide();
  }
} //end function WindowControl


//存放window的数组
var window_Array=new Array();

function newWindow(winame,isTitle,isBottom)
{
	window_Array[window_Array.length]=new WindowControl(winame,isTitle,isBottom);
}

function getWindowObject(winname)
{
	for(var i=0;i<window_Array.length;i++)
		if (window_Array[i].name==winname)
			return window_Array[i];
	return null;
}


//newWindow("winTest",true,true);

//getWindowObject("winTest").reSize(500,300);
//getWindowObject("winTest").moveTo(100,100);
//getWindowObject("winTest").load("index.jsp");

function window_toMax(winName)
{
	getWindowObject(winName).toMax();
}

function window_toMin(winName)
{
	getWindowObject(winName).hide();
}

function window_toOriginal(winName)
{
	getWindowObject(winName).toOriginal();
}

function window_alterWindow(winName)
{
	getWindowObject(winName).alterMax();
}

var currentWindow;

function window_moveWindow(evt)
{
	evt = evt ? evt : (window.event ? window.event : null);
	var winobj=getWindowObject(currentWindow);
	winobj.moveByMouse(evt);
}

function window_dragWindow(winName,evt)
{
	evt = evt ? evt : (window.event ? window.event : null);
	currentWindow=winName;

	var winobj=getWindowObject(winName);
	winobj.startDrag(evt);

	document.onmouseup = window_dropWindow;
	document.onmousemove = window_moveWindow;
	document.ondragstart = window_mouseStop;
}

function window_dropWindow()
{
	var winobj=getWindowObject(currentWindow);
	winobj.stopDrag();
}

function window_startResize(winName)
{
	currentWindow=winName;
	
	var winobj=getWindowObject(winName);
	winobj.startResize();
	document.onmouseup=window_stopResize;
	document.onmousemove=window_resize;
	document.ondragstart = window_mouseStop;
}

function window_stopResize()
{
	var winobj=getWindowObject(currentWindow);
	winobj.stopResize();
}

function window_resize(evt)
{
	evt = evt ? evt : (window.event ? window.event : null);
	var winobj=getWindowObject(currentWindow);
	winobj.resizeByMouse(evt);
}

function window_mouseStop(evt) 
{
	evt = evt ? evt : (window.event ? window.event : null);
    evt.returnValue = false
}

ns4 = (document.layers)? true:false;
ie4 = (document.all)? true:false;
function getWindowWidth()
{
    var innerWidth;
    if (ns4)
      innerWidth=window.innerWidthidth;
    else
      innerWidth=document.body.clientWidth;

	return innerWidth;
}
  
function getWindowHeight()
{
		var innerHeight;
		if (ns4)
			innerHeight=window.innerHeight;
		else
			innerHeight=document.body.clientHeight;
  		return innerHeight;
}
