//一个控制layer的类
// Example:
//  var l_test=new LayerControl(layerTest,"layerTest");
//  l_test.moveTo(30,50,0);
//  l_test.write("Hello!");
//  layerMoveByMouse(l_test);

  
function LayerControl(layerName)
{
    
  ns4 = (document.layers)? true:false;
  ie4 = (document.all)? true:false;
//if (navigator.appName.indexOf("scape")>0 )
//	ns4=true;
//else
//	ie4=true;
//	alert("ns="+ns4+";ie="+ie4);
  var layerObj;
  this.name=layerName;
  
  var isHaveFrame=false; //是否有内置的框架
  var doc_all;
  var doc_style;
  
  if (ns4)
  {
    eval("layerObj=document."+layerName);
    doc_all="";
    doc_style="";
  }
  else
  {
    eval("layerObj=document.all."+layerName+".style");
    doc_all="all.";
    doc_style="style.";
  //  eval("this.width=document.all."+layerName+".style.width");
  }

  this.xpos=getLeft;
  this.ypos=getTop;
  this.getLeft=getLeft;
  this.getTop=getTop;
  this.getWidth=getWidth;
  this.getHeight=getHeight;
  
  
  //控制位置的属性。
  //moveTo(x,y,diff)
  //x,y是位置参数,diff是和x,y描述的点的位差
  this.moveTo=moveLayerTo;  
  this.moveBy=moveLayerBy;  
  this.reSize=reSize;
  this.enLarge=enLarge;
  this.reWidth=reWidth;
  this.reHeight=reHeight;
  
  this.getWindowWidth= getWindowWidth;
  this.getWindowHeight= getWindowHeight;
  //写窗口内容
  // write(text);
  this.write=layerWrite;
  //隐藏窗口
  this.hide=layerHide;
  //显示窗口
  this.show=layerShow;
  //载入url
  this.load=layerLoad;
  
  function getWidth()
  {
  	return layerObj.width;
  }
  function getHeight()
  {
  	return layerObj.height;
  }
  function getLeft()
  {
  	return 	layerObj.left;
  }
  function getTop()
  {
  	return layerObj.top;
  }

  function enLarge(w,h)
  {
    var neww=layerObj.w+w;
    var newh=layerObj.h+h;
    reSize(neww,newh);
  }
  function reSize(w,h)
  {
	reWidth(w);    	
    	reHeight(h);
  }
  
  function reWidth(w)
  {
  	width=w;	
  	layerObj.width=width;
  	if (isHaveFrame)
  	{
  	  var cmd="document."+doc_all+"iframe_"+layerName+"."+doc_style+"width="+width;
	  eval(cmd);	
  	}
  }
  function reHeight(h)
  {
    height=h;
    layerObj.height=height;
    if (isHaveFrame)
    {
  	  var cmd="document."+doc_all+"iframe_"+layerName+"."+doc_style+"height="+height;
	  eval(cmd);	
    }
  }
  
  function moveByMouse()
  {
    moveLayerToDiff(event.clientX,event.clientY,5);
  }
  
  function moveLayerBy(xdiff,ydiff)
  {
    xpos=(parseInt(layerObj.left)+xdiff);
    ypos=(parseInt(layerObj.top)+ydiff);
    
    layerObj.left=xpos;
    layerObj.top=ypos;
  }
  
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
  
  function moveLayerTo(x,y)
  {
    if (ns4)
    { 
      innerWidth=parseInt(window.innerWidthidth);
      innerHeight=parseInt(window.innerHeight);
    }
    else
    {
      innerWidth=parseInt(document.body.clientWidth);
      innerHeight=parseInt(document.body.clientHeight);
    }
   
    var xpos,ypos;
    if (x > (parseInt(innerWidth) - parseInt(layerObj.width)) )
    {
      xpos=parseInt(innerWidth) + parseInt(document.body.scrollLeft) - parseInt(layerObj.width);
    }
    else
    {
      xpos=document.body.scrollLeft + x;
    }

    if ( y > (parseInt(innerHeight) - parseInt(layerObj.height)) )
    {
      ypos=parseInt(innerHeight) + parseInt(document.body.scrollTop) - parseInt(layerObj.height);
    
    }
    else
    {
      ypos=parseInt(document.body.scrollTop) + parseInt(y);
      
    }

    layerObj.left=parseInt(xpos);
    layerObj.top=parseInt(ypos);
  }
    
  function layerWrite(text) 
  {
    if (ns4) 
    {
    	var newobj=document.layers[layerName].document;

        newobj.open();
        newobj.write(text);
        newobj.close();
    }
    else
    {
    	document.all[layerName].innerHTML = text
    }
    isHaveFrame=false;
  }
  
  function layerHide()
  {
    if (ns4)
    {
    	layerObj.visibility = "hide";
    }
    else
    {
    	layerObj.visibility = "hidden";
    }
  }
  
  function layerShow() 
  {
    if (ns4)
    {
    	layerObj.visibility = "show";
    }
    else
    {
    	layerObj.visibility = "visible";
    }
  }
  
  function layerLoad(newurl)
  {
    var cmd="<iframe id='iframe_"+layerName+"'"+
    	" src='"+newurl+"' scrolling='auto' frameborder='1'"+
    	" marginwidth='0' marginheight='0'"+
    	" width='"+getWidth()+"'"+
    	" height='"+getHeight()+"'"+
    	" ></iframe>";
    layerWrite(cmd);
    
        
    //cmd="alert(document.all.iframe_"+layerName+".src);";
    //eval(cmd);
    isHaveFrame=true;
  }
}


//窗口跟随鼠标移动
function layerMoveByMouse(pobj)
{
    document.onmousemove = moveByMouse;
    document.onclick=stopMoveByMouse;
    
    function moveByMouse()
    {
      pobj.moveTo(event.clientX,event.clientY);
    }
}

function stopMoveByMouse()
{
  document.onmousemove = null;
}