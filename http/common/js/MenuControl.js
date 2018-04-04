//example
//newMenu("menu_main",false);
//var menu_main=getMenuControl("menu_main");
//mpmenu1=new menu_main.mMenu('File','','self','','','','');
//msub1=new menu_main.mMenuItem('New','','self',false,'','1','../image/new.gif','0','0','0');
//msub1.addsubItem(new menu_main.mMenuItem('File','','self',false,'File',null,'../image/win16.gif','0','0','0'));
//msub1.addsubItem(new menu_main.mMenuItem('Webpage','','self',false,'Webpage',null,'../image/blank.gif','16','16','0'));
//msub1.addsubItem(new menu_main.mMenuItem('Shortcut','','self',false,'Shortcut',null,'../image/blank.gif','16','16','0'));
//mpmenu1.addItem(msub1);
//mpmenu1.addItem(new menu_main.mMenuItem('Open','','self',false,'Open',null,'../image/open.gif','0','0','0'));
//mpmenu1.addItem(new menu_main.mMenuItem('Save','','self',false,'Save',null,'../image/save.gif','0','0','0'));
//mpmenu2=new menu_main.mMenu('Edit','','self','','','','');
//mpmenu2.addItem(new menu_main.mMenuItem('Undo','','self',false,'Undo',null,'../image/undo.gif','0','0','0'));
//mpmenu2.addItem(new menu_main.mMenuItem('Forward','','self',false,'Forward',null,'../image/redo.gif','0','0','0'));
//mpmenu2.addItem(new menu_main.mMenuItem('Copy','','self',false,'Copy',null,'../image/copy.gif','0','0','0'));
//mpmenu3=new menu_main.mMenu('Help','','self','','','','');
//mpmenu3.addItem(new menu_main.mMenuItem('Help','','self',false,'Help',null,'../image/help.gif','0','0','0'));
//mpmenu3.addItem(new menu_main.mMenuItem('Homepage','','self',false,'Homepage',null,'../image/home.gif','0','0','0'));
//mpmenu3.addItem(new menu_main.mMenuItem('Mail','','self',false,'Mail',null,'../image/mail.gif','0','0','0'));
//mpmenu3.addItem(new menu_main.mMenuItem('Search','','self',false,'',null,'../image/view.gif','0','0','0'));
//mpmenu3=new menu_main.mMenu('tekinfo','alert("tekinfo");','jscript','','','','');
//menu_main.mwritetodocument();

var menu_background;  //菜单背景图片
var menu_hr; //菜单线图
var mmenucolor='#ffffff'; //mmenucolor='Menu';
var mfontcolor='MenuText';
var mmenuoutcolor='#B5BED6';
var mmenuincolor='#B5BED6';
var mmenuoutbordercolor='#000000';
var mmenuinbordercolor='#000000';
var mmidoutcolor='#8D8A85';
var mmidincolor='#8D8A85';
var mmenuovercolor='MenuText';
var mmenuunitwidth=65;
var mmenuitemwidth=120;
var mmenuheight=20;
//存放menu的数组
var menu_Array=new Array();

if(!/msie/i.test(navigator.userAgent))
{
    Event.prototype.__defineGetter__("srcElement",function(){
		var node=this.target;
		while(node.nodeType != 1)node=node.parentNode;
		return node;
	});
	Event.prototype.__defineGetter__("fromElement",function(){
        var node;
        if(this.type == "mouseover")
            node = this.relatedTarget;
        else if(this.type == "mouseout")
            node = this.target;
        if(!node)return;
        while(node.nodeType != 1)node=node.parentNode;
        return node;
    });
    Event.prototype.__defineGetter__("toElement",function(){
        var node;
        if(this.type == "mouseout")
            node = this.relatedTarget;
        else if(this.type == "mouseover")
            node = this.target;
        if(!node)return;
        while(node.nodeType != 1)node=node.parentNode;
        return node;
    });
}

function newMenu(menuName,isVertical)
{
	menu_Array[menu_Array.length]=new MenuControl(menuName,isVertical);
}

function getMenuObject(menuName)
{
	for(var i=0;i<menu_Array.length;i++){
		if (menu_Array[i].name==menuName)
			return menu_Array[i];
	}
	return null;
}

function MenuControl(menuName,isVertical)
{
  var mmenus    = new Array();
  var misShow   = new Boolean(); 
  misShow=false;
  var misdown   = new Boolean();
  misdown=false;
  var mnumberofsub=0;
  var musestatus=false;
  
  
  mitemedge='0';
  msubedge='1';
  
  
  mmenuwidth='100%';
  mmenuadjust=0;
  mmenuadjustV=-4;
  mfonts='font-family: Verdana; font-size: 8pt; color: MenuText; ';
  mcursor='default';
  var mpopTimer = 0;
  
  var blankMenuStatus="toolbar=no,location=no,directories=no,status=yes,menubar=no,resizable=yes,scrollbars=yes,dependent";
  
  this.name=menuName;
  if (isVertical)
  	setVertical();
  
  
  this.setVertical=setVertical;
  this.setHorizon=setHorizon;
  
  this.mMenu=mMenu;
  this.mMenuItem=mMenuItem;
 
  this.mwritetodocument=mwritetodocument;
  this.getwritetodocumenttext=getwritetodocumenttext;
  this.mMenu.prototype.addItem = mMenuAddItem;
  this.mMenuItem.prototype.addsubItem = mMenuAddItem;
  this.mmenu_over=mmenu_over;
  this.mmenuitem_over=mmenuitem_over;
  this.mmenu_out=mmenu_out;
  this.mmenuitem_out=mmenuitem_out;
  this.mmenu_down=mmenu_down;
  this.mmenuitem_down=mmenuitem_down;
  this.mmenu_up=mmenu_up;
  this.mmenuitem_up=mmenuitem_up;
  this.mshowsubmenu=mshowsubmenu;
  this.mexec=mexec;
  this.mexec2=mexec2;
  this.mexec3=mexec3;
  this.mallhide=mallhide;
  this.stophide=stophide;
  this.mpopTimer=mpopTimer;
  
  function setVertical()
  {
    isVertical=true;
  
    mitemedge='1';
    mmenuwidth='80';
    mmenuheight=20;
    mmenuadjustV=0;
  }

function setHorizon()
{
  isVertical=false;
  
  mitemedge='0';
  mmenuwidth='100%';
  mmenuheight=30;
  mmenuadjustV=-4;
}

function stoperror()
{
  return true;
}

window.onerror=stoperror;

function mpopOut() 
{
  mpopTimer = setTimeout(menuName+'.mallhide()', 500);
}

function getReal(el, type, value) 
{
	temp = el;
	while ((temp != null) && (temp.tagName != "BODY")) 
	{
		if (eval("temp." + type) == value) 
		{
			el = temp;
			return el;
		}
		temp = temp.parentElement;
	}
	return el;
}


function mMenuRegister(menu) 
{
  mmenus[mmenus.length] = menu
  return (mmenus.length - 1)
}


function mMenuItem(caption,command,target,isline,statustxt,level,img,sizex,sizey,pos)
{
	this.items = new Array();
	this.caption=caption;
	this.command=command;
	this.target=target;
	this.isline=isline;
	this.statustxt=statustxt;
	
	if(level!=null)
	{
		mnumberofsub++;
		this.hasc=mnumberofsub;
	}
	this.level=level;
	this.img=img;
	this.sizex=sizex;
	this.sizey=sizey;
	this.pos=pos;
}

function mMenu(caption,command,target,img,sizex,sizey,pos)
{
	this.items = new Array();
	this.caption=caption;
	this.command=command;
	this.target=target;
	this.img=img;
	this.sizex=sizex;
	this.sizey=sizey;
	this.pos=pos;
	this.id=mMenuRegister(this);
}

function mMenuAddItem(item)
{
  this.items[this.items.length] = item
  item.parent = this.id;
  this.children=true;
 // alert("t="+this.caption+";ti="+this.items[this.items.length-1].caption+";l="+this.items.length+
  //";i="+item.caption);
}

function mtoout(src)
{
	
  if(!isVertical)
    	src.style.border='solid 1';
  src.style.borderLeftColor=mmenuoutbordercolor;
  src.style.borderRightColor=mmenuinbordercolor;
  src.style.borderTopColor=mmenuoutbordercolor;
  src.style.borderBottomColor=mmenuinbordercolor;
  src.style.backgroundColor=mmenuoutcolor;
  src.style.color=mmenuovercolor;
}
function mtoin(src)
{
  if(!isVertical)
	src.style.border='solid 1';
  src.style.borderLeftColor=mmenuinbordercolor;
  src.style.borderRightColor=mmenuoutbordercolor;
  src.style.borderTopColor=mmenuinbordercolor;
  src.style.borderBottomColor=mmenuoutbordercolor;
  src.style.backgroundColor=mmenuincolor;
  src.style.color=mmenuovercolor;
}

function mnochange(src)
{
  src.style.borderLeftColor=mmenucolor;
  src.style.borderRightColor=mmenucolor;
  src.style.borderTopColor=mmenucolor;
  src.style.borderBottomColor=mmenucolor;
  
  src.style.backgroundColor='';
  
  src.style.color=mfontcolor;
  if(!isVertical)
	src.style.border='solid 0';
}

function mallhide()
{
	for(var nummenu=0;nummenu<mmenus.length;nummenu++)
	{
		var themenu=document.getElementById(menuName+'_mMenu'+nummenu);
		var themenudiv=document.getElementById(menuName+'_mmenudiv'+nummenu);
	
                mnochange(themenu);
                mmenuhide(themenudiv);
        }
        for(nummenu=1;nummenu<=mnumberofsub;nummenu++)
        {  
        	var thesub=document.getElementById(menuName+'_msubmenudiv'+nummenu);   
        	msubmenuhide(thesub);
        	
        	mnochange(document.getElementById(menuName+'_mp'+nummenu));
        	document.getElementById(menuName+"_mitem"+nummenu).style.color=mfontcolor;
        }
}

function mmenuhide(menuid)
{
  menuid.style.visibility='hidden';
  misShow=false;
}

function msubmenuhide(menuid)
{
  menuid.style.visibility='hidden';
}

function mmenushow(menuname,pid)
{
  var menuid = document.getElementById(menuname);
  if (isVertical)
  {
  	menuid.style.left=document.getElementById(menuName+"_mposflag").offsetLeft+mmenuadjust+parseInt(mmenuwidth);
  	menuid.style.top=document.getElementById(menuName+"_mposflag").offsetTop+pid.offsetTop+mmenuadjustV;
  }
  else
  {
  	menuid.style.left=document.getElementById(menuName+"_mposflag").offsetLeft+pid.offsetLeft+mmenuadjust;
  	menuid.style.top=document.getElementById(menuName+"_mposflag").offsetTop+
  			document.getElementById(menuName+"_mmenutable").offsetHeight+mmenuadjustV;
  }
  if(mmenuitemwidth+parseInt(menuid.style.left)>document.body.clientWidth+document.body.scrollLeft)
	menuid.style.left=document.body.clientWidth+document.body.scrollLeft-mmenuitemwidth;
  menuid.style.visibility='visible';
  misShow=true;
}

function mshowsubmenu(menuname,pname,rname)
{
  var menuid = document.getElementById(menuname);
  var pid = document.getElementById(pname);
  var rid = document.getElementById(rname);
  
  menuid.style.left=pid.offsetWidth+rid.offsetLeft;
  menuid.style.top=pid.offsetTop+rid.offsetTop-3;
  if(mmenuitemwidth+parseInt(menuid.style.left)>document.body.clientWidth+document.body.scrollLeft)
    menuid.style.left=document.body.clientWidth+document.body.scrollLeft-mmenuitemwidth;
  menuid.style.visibility='visible';
}

function mmenu_over(menuname,x,evt)
{
  evt = evt ? evt : (window.event ? window.event : null);

  toel = getReal(evt.toElement, "className", "smallfont");
  fromel = getReal(evt.fromElement, "className", "smallfont");
 
  if (toel==fromel) 
  	return;
	
  //if(x==3)
  //{
  //	misShow = false;
  	
  //	mallhide();
  //	mtoout(eval(menuName+"_mMenu"+x));
  //}
  //else
 // {
	mallhide();
  	mtoin(document.getElementById(menuName+"_mMenu"+x));
  	mmenushow(menuname,document.getElementById(menuName+"_mMenu"+x));
 // }  //end if(x==3)
  
  clearTimeout(mpopTimer);
  
} //end function mmenu_over(menuid,x)

function stophide()
{
	clearTimeout(mpopTimer);
}

function mmenu_out(x,evt)
{
  evt = evt ? evt : (window.event ? window.event : null);
  toel = getReal(evt.toElement, "className", "smallfont");
  fromel = getReal(evt.fromElement, "className", "smallfont");
  if (toel == fromel) 
  	return;
  if (misShow)
  	mtoin(document.getElementById(menuName+"_mMenu"+x));
  else
	mnochange(document.getElementById(menuName+"_mMenu"+x));
	
  mpopOut();
}

function mmenu_down(menuname,x)
{
  if(misShow)
  {
  	mmenuhide(document.getElementById(menuname));
  	mtoout(document.getElementById(menuName+"_mMenu"+x));
  }
  else
  {
  	mtoin(document.getElementById(menuName+"_mMenu"+x));
  	mmenushow(menuname,document.getElementById(menuName+"_mMenu"+x));
  	misdown=true;
  }
}

function mmenu_up()
{
  misdown=false;
}

function mmenuitem_over(menuname,item,x,j,i,evt)
{ 
  evt = evt ? evt : (window.event ? window.event : null);
  var menuid = document.getElementById(menuname);
  
  toel = getReal(evt.toElement, "className", "smallfont");
  fromel = getReal(evt.fromElement, "className", "smallfont");
  if (toel == fromel) 
  	return;
  	
  srcel = getReal(evt.srcElement, "className", "smallfont");
  for(nummenu=1;nummenu<=mnumberofsub;nummenu++)
  {  
       	var thesub=document.getElementById(menuName+'_msubmenudiv'+nummenu);
        if(!(menuid==thesub || menuid.style.tag>=thesub.style.tag ) )
        {
        	msubmenuhide(thesub);
        	mnochange(document.getElementById(menuName+'_mp'+nummenu));
        	document.getElementById(menuName+"_mitem"+nummenu).style.color=mfontcolor;
        }
  } //end for(nummenu=1;nummenu<=mnumberofsub;nummenu++)
  
  if(item)
  	document.getElementById(menuName+"_mitem"+item).style.color=mmenuovercolor;
//alert("m="+misdown+";i="+item)
  if(misdown||item)
  {
	mtoin(srcel);
  }
  else
  {
  	mtoout(srcel);
  }
  
  if(x==-1)
  	mthestatus=eval(menuName+"_msub"+j+".items[i].statustxt");
  	//mthestatus=eval("msub"+j+".items[i].statustxt");
  if(j==-1)
  	mthestatus=mmenus[x].items[i].statustxt;
  if(mthestatus!="")
  {
	musestatus=true;
	window.status=mthestatus;
  }
  
  clearTimeout(mpopTimer);
}

function mmenuitem_out(hassub,evt)
{
  evt = evt ? evt : (window.event ? window.event : null);
  toel = getReal(evt.toElement, "className", "smallfont");
  fromel = getReal(evt.fromElement, "className", "smallfont");
  if (toel == fromel) 
  	return;
  srcel = getReal(evt.srcElement, "className", "smallfont");
  
  if(!hassub)
  	mnochange(srcel);
  if(musestatus)
  	window.status="";
  mpopOut();
}

function mmenuitem_down(evt)
{
  evt = evt ? evt : (window.event ? window.event : null);
  srcel = getReal(evt.srcElement, "className", "smallfont");
  mtoin(srcel);
  misdown=true;
}
function mmenuitem_up(evt)
{
  evt = evt ? evt : (window.event ? window.event : null);
  srcel = getReal(evt.srcElement, "className", "smallfont");
  mtoout(srcel)
  misdown=false;
}

function isJscriptCommand(command)
{
	if(command!=null 
	   && (command.indexOf('jscript:')==0 || command.indexOf('javascript:')==0))
		return true;
	return false;	
}

function mexec3(j,i)
{
  var cmd;
  //var msubV = eval("msub"+j);
  var msubV = eval(menuName+"_msub"+j);
  
  if( (msubV.items[i].target=="jscript") ||
      (msubV.items[i].target=="javascript")
    )
  {  
	cmd=msubV.items[i].command;
  }
  else
    cmd = "window.open('"+msubV.items[i].command+"','"+msubV.items[i].target+"','"+blankMenuStatus+"')";
  	
  eval(cmd);
}


function mexec2(x)
{
  var cmd;
  if(mmenus[x].target=="jscript")
  {
    cmd=mmenus[x].command;
  }
  else
  {
      cmd = "window.open('"+mmenus[x].command+"','"+mmenus[x].target+"','"+blankMenuStatus+"')";
  }
 
  eval(cmd);
}

function mexec(x,i)
{
  var cmd;
  if(mmenus[x].items[i].target=="jscript"
		|| isJscriptCommand(mmenus[x].items[i].command) )
  {
    cmd=mmenus[x].items[i].command;
  }
  else
  {
 //   if(mmenus[x].items[i].target=="blank")
      cmd = "window.open('"+mmenus[x].items[i].command+"','"+mmenus[x].items[i].target+"','"+blankMenuStatus+"')";
   // else
     // cmd = mmenus[x].items[i].target+".location=\""+mmenus[x].items[i].command+"\"";
  }
  
  eval(cmd);
}

function mbody_click(evt)
{
  evt = evt ? evt : (window.event ? window.event : null);
  if (misShow)
  {
	srcel = getReal(evt.srcElement, "className", "smallfont");
	for(var x=0;x<=mmenus.length;x++)
	{
		if(srcel.id==menuName+"_mMenu"+x)
		return;
	}
	for(x=1;x<=mnumberofsub;x++)
	{
		if(srcel.id==menuName+"_mp"+x)
		return;
	}
	mallhide();
  }
}

document.onclick=mbody_click;

function mwritetodocument()
{
	document.write(getwritetodocumenttext());
}

function getwritetodocumenttext()
{
  var mwb=1;
  var stringx = '<div id="'+menuName+'_mposflag" style="position:absolute;z-index:99"></div>'+
  	'<table id="'+menuName+'_mmenutable" border="0" cellpadding="3" cellspacing="2" width='+mmenuwidth+
  	' height='+mmenuheight+' bgcolor='+mmenucolor+
	' onselectstart="event.returnValue=false"'+
        ' style="cursor:'+mcursor+';'+mfonts+
        ' border-left: '+mwb+'px solid '+mmenuoutbordercolor+';'+
        ' border-right: '+mwb+'px solid '+mmenuinbordercolor+'; '+
        'border-top: '+mwb+'px solid '+mmenuoutbordercolor+'; '+
        'border-bottom: '+mwb+'px solid '+mmenuinbordercolor+'; padding:0px"><tr>';
  for(var x=0;x<mmenus.length;x++)
  {
    var thismenu=mmenus[x];
    var imgsize="";
    if( thismenu.sizex!="0" || thismenu.sizey!="0")
      imgsize=" width="+thismenu.sizex+" height="+thismenu.sizey;
    var ifspace="";
    if(thismenu.caption!="")
    	ifspace="&nbsp;";
    stringx += "<td nowrap class=smallfont id="+menuName+"_mMenu"+x+" style='border: "+mitemedge+"px solid "+mmenucolor+
    	"' width="+mmenuunitwidth+"px onmouseover="+menuName+".mmenu_over('"+menuName+"_mmenudiv"+x+
        "',"+x+",event) onmouseout=\""+menuName+".mmenu_out("+x+
        ",event);\""+
        " onmousedown="+menuName+".mmenu_down('"+menuName+"_mmenudiv"+x+"',"+x+")";
        
    if(thismenu.command!="")
       	stringx += " onmouseup="+menuName+".mmenu_up();"+menuName+".mexec2("+x+");";
    else
        stringx += " onmouseup="+menuName+".mmenu_up()";
        
    if(thismenu.pos=="0")
    {
    	stringx += " align=center><img align=absmiddle src='"+thismenu.img+"'"+imgsize+">"+ifspace+thismenu.caption+"</td>";	
    }
    else 
    {
    	if(thismenu.pos=="1")
    	{
        	stringx += " align=center>"+thismenu.caption+ifspace+"<img align=absmiddle src='"+thismenu.img+"'"+imgsize+"></td>";	
        }
        else 
        {
        	if(thismenu.pos=="2")
        		stringx += " align=center background='"+thismenu.img+"'>&nbsp;"+thismenu.caption+"&nbsp;</td>";	
                else
                        stringx += " align=center>&nbsp;"+thismenu.caption+"&nbsp;</td>";
                stringx += "";
        } //end if(thismenu.pos=="1") else
    }  //end if(thismenu.pos=="0") else
    if (isVertical)
    	stringx += "</tr><tr>";
  } //end for(var x=0;x<mmenus.length;x++)
  
  if (isVertical)
  	stringx+="</tr></table>";
  else
  	stringx+="<td class=smallfont width=*>&nbsp;</td></tr></table>";
                     
  for(var x=0;x<mmenus.length;x++)
  {
  	thismenu=mmenus[x];
        //if(x==3)
        //	stringx+='<div id='+menuName+'_mmenudiv'+x+' style="visiable:none"></div>';
        //else
       // {
        	stringx+='<div id='+menuName+'_mmenudiv'+x+
                        ' style="cursor:'+mcursor+';position:absolute;'+
                        'width:'+mmenuitemwidth+'px; z-index:'+(x+100);
                if(mmenuinbordercolor != mmenuoutbordercolor && msubedge=="0")
                        stringx+=';border-left: 1px solid '+mmidoutcolor+
                	        ';border-top: 1px solid '+mmidoutcolor;

                stringx+=';border-right: 1px solid '+mmenuinbordercolor+
                        ';border-bottom: 1px solid '+mmenuinbordercolor+';visibility:hidden" onselectstart="event.returnValue=false">\n'+
                     	'<table background="'+menu_background+'" width="100%" border="0" height="100%" align="center" cellpadding="0" cellspacing="2" '+
                     	'style="'+mfonts+' border-left: 1px solid '+mmenuoutbordercolor;
                	
               	if(mmenuinbordercolor!=mmenuoutbordercolor&&msubedge=="0")
                  	stringx+=';border-right: 1px solid '+mmidincolor+
                     		';border-bottom: 1px solid '+mmidincolor;
                     		
                stringx+=';border-top: 1px solid '+mmenuoutbordercolor+
                     		';padding: 4px" bgcolor='+mmenucolor+'>\n';
                     		
                for(var i=0;i<thismenu.items.length;i++)
                {
                	var thismenuitem=thismenu.items[i];
                	var imgsize="";
                     	if( thismenuitem.sizex!="0" || thismenuitem.sizey!="0" )
                     	        imgsize=" width="+thismenuitem.sizex+" height="+thismenuitem.sizey;
                     	var ifspace="";
                     	if(thismenuitem.caption!="") //if(thismenu.caption!="")
                     		ifspace="&nbsp;";
                     	if(thismenuitem.hasc!=null)
                     	{
                     		stringx += "<tr><td id="+menuName+"_mp"+thismenuitem.hasc+" class=smallfont style='border: "+mitemedge+"px solid "+mmenucolor+
                     			"' width=100% onmouseout="+menuName+".mmenuitem_out(true,event) onmouseover=\""+menuName+".mmenuitem_over('"+menuName+"_mmenudiv"+x+
                     			"','"+thismenuitem.hasc+"',"+x+",-1,"+i+",event);"+menuName+".mshowsubmenu('"+menuName+"_msubmenudiv"+thismenuitem.hasc+"','"+menuName+"_mp"+thismenuitem.hasc+"','"+menuName+"_mmenudiv"+x+"');\""+
                     			"><table id="+menuName+"_mitem"+thismenuitem.hasc+" cellspacing='0' cellpadding='0' border='0' width='100%' style='"+mfonts+"'><tr><td  class=menufont";
                     			
                     		if(thismenuitem.pos=="0")
                     		{
                     	        	stringx += "><img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+">"+ifspace+thismenuitem.caption+"</td><td";	
                     	        }
                     	        else 
                     	        {
                     	        	if(thismenuitem.pos=="1")
                     	        	{
                     	            		stringx += ">"+thismenuitem.caption+ifspace+"<img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+"></td><td";
                     	          	}
                     	          	else 
                     	          	{
                     	          		if(thismenuitem.pos=="2")
                     	            			stringx += "background='"+thismenuitem.img+"'>"+thismenuitem.caption+"</td><td background='"+thismenuitem.img+"'";
                     	          		else
                     	            			stringx += ">"+thismenuitem.caption+"</td><td";
                     	          	}//end if(thismenuitem.pos=="1") else
                     	        }//end if(thismenuitem.pos=="0") else
                     		
                     		stringx += " align=right width='1'><font face='Webdings' style='font-size: 6pt'>4</font></td></tr></table></td></tr>\n";
                     		
                     	} //end if(thismenuitem.hasc!=null)
                     	else
                     	{
                     		if(!thismenuitem.isline)
                     		{
                     			stringx += "<tr><td class=smallfont style='border: "+mitemedge+"px solid "+mmenucolor+
                     				"' width=100% height=15px onmouseover=\""+menuName+".mmenuitem_over('"+menuName+"_mmenudiv"+x+
                     				"',false,"+x+",-1,"+i+",event);\" onmouseout=\""+menuName+".mmenuitem_out(false,event);\" onmousedown="+menuName+".mmenuitem_down(event) onmouseup=";
 					stringx += menuName+".mmenuitem_up(event);"+menuName+".mexec("+x+","+i+"); ";
 					if(thismenuitem.pos=="0")
				  	{
                     	            		stringx += "><img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+">"+ifspace+thismenuitem.caption+"</td></tr>";	
                     	          	}
                     	          	else 
                     	          	{	
                     	          		if(thismenuitem.pos=="1")
                     	          		{
                     	            			stringx += ">"+thismenuitem.caption+ifspace+"<img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+"></td></tr>";	
                     	          		}
                     	          		else
                     	          		{
                     	          			if(thismenuitem.pos=="2")
                     	            				stringx += "background='"+thismenuitem.img+"'>"+thismenuitem.caption+"</td></tr>";	
                     	          			else
                     	            				stringx += ">"+thismenuitem.caption+"</td></tr>";
                     	          		} //end if(thismenuitem.pos=="1") else
 					} //end if(thismenuitem.pos=="0")
 				} //end if(!thismenuitem.isline)
 				else
 				{
                     			stringx+='<tr><td height="1" background="'+menu_hr+'" onmousemove="'+menuName+'.stophide();"><img height="1" width="1" src="none.gif" border="0"></td></tr>\n';
                     		} //end if(!thismenuitem.isline) else
                     		
                     	} //end if(thismenuitem.hasc!=null) else
                     	
                }  //end for(var i=0;i<thismenu.items.length;i++)
                stringx+='</table>\n</div>';
	//} //end if(x==3) else
  } //end for(var x=0;x<mmenus.length;x++)

  for(var j=1;j<=mnumberofsub;j++)
  {    
	thisitem = eval(menuName+"_msub"+j);

	stringx+='<div id='+menuName+'_msubmenudiv'+j+
        	' style="tag:'+thisitem.level+';cursor:'+mcursor+';position:absolute;'+
                'width:'+mmenuitemwidth+'px; height:'+mmenuheight+'px; z-index:'+(j+200);
        if(mmenuinbordercolor != mmenuoutbordercolor && msubedge=="0")
        	stringx+=';border-left: 1px solid '+mmidoutcolor+
                        ';border-top: 1px solid '+mmidoutcolor;

        stringx+=';border-right: 1px solid '+mmenuinbordercolor+
        	';border-bottom: 1px solid '+mmenuinbordercolor+';visibility:hidden" onselectstart="event.returnValue=false">\n'+
                '<table background="'+menu_background+'" width="100%" border="0" height="100%" align="center" cellpadding="0" cellspacing="2" '+
                'style="'+mfonts+' border-left: 1px solid '+mmenuoutbordercolor;

        if(mmenuinbordercolor!=mmenuoutbordercolor&&msubedge=="0")
                stringx+=';border-right: 1px solid '+mmidincolor+
                     	';border-bottom: 1px solid '+mmidincolor;
        
        stringx+=';border-top: 1px solid '+mmenuoutbordercolor+
              	';padding: 4px" bgcolor='+mmenucolor+'>\n';
              	
	for(var i=0;i<thisitem.items.length;i++)
	{
        	var thismenuitem=thisitem.items[i];
        	
                var imgsize="";
                if(thismenuitem.sizex!="0" || thismenuitem.sizey!="0")
                	imgsize=" width="+thismenuitem.sizex+" height="+thismenuitem.sizey;
                var ifspace="";
                
                if(thismenuitem.caption!="")//if(thismenu.caption!="")
                	ifspace="&nbsp;";
                if(thismenuitem.hasc!=null)
                {
                	stringx += "<tr><td id="+menuName+"_mp"+thismenuitem.hasc+" class=smallfont style='border: "+mitemedge+"px solid "+mmenucolor+
                     		"' width=100% onmouseout=\""+menuName+".mmenuitem_out(true,event);\" onmouseover=\""+menuName+".mmenuitem_over('"+menuName+"_msubmenudiv"+j+
                     		"','"+thismenuitem.hasc+"',-1,"+j+","+i+",event);"+menuName+".mshowsubmenu('"+menuName+"_msubmenudiv"+thismenuitem.hasc+"','"+menuName+"_mp"+thismenuitem.hasc+"','"+menuName+"_msubmenudiv"+j+"');\""+
                     		"><table id="+menuName+"_mitem"+thismenuitem.hasc+" cellspacing='0' cellpadding='0' border='0' width='100%' style='"+mfonts+"'><tr><td ";
                    	
						if(thismenuitem.pos=="0")
                    	{
                     		stringx += "><img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+">"+ifspace+thismenuitem.caption+"</td><td ";
                     	}
                     	else
                     	{
                     		if(thismenuitem.pos=="1")
                     		{
                     	        	stringx += ">"+thismenuitem.caption+ifspace+"<img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+"></td><td";
                     	        }
                     	        else
                     	        {
                     	            	if(thismenuitem.pos=="2")
                     	            		stringx += "background='"+thismenuitem.img+"'>"+thismenuitem.caption+"</td><td background='"+thismenuitem.img+"'";	
                     	          	else
                     	          		stringx += ">"+thismenuitem.caption+"</td><td";
								} //end   if(thismenuitem.pos=="1") else                   	          
                     	}//end if(thismenuitem.pos=="0") else
						
						stringx += " align=right width='1'><font face='Webdings' style='font-size: 6pt'>4</font></td></tr></table></td></tr>\n";
                
				} //end if(thismenuitem.hasc!=null)
                else 
                {
                	if(!thismenuitem.isline)
                	{
                     		stringx += "<tr><td class=smallfont style='border: "+mitemedge+"px solid "+mmenucolor+
                     			"' width=100% height=15px onmouseover=\""+menuName+".mmenuitem_over('"+menuName+"_msubmenudiv"+j+
                     			"',false,-1,"+j+","+i+",event);\" onmouseout=\""+menuName+".mmenuitem_out(false,event);\" onmousedown="+menuName+".mmenuitem_down(event) onmouseup=";
                     			stringx += menuName+".mmenuitem_up(event);"+menuName+".mexec3("+j+","+i+"); ";
 				if(thismenuitem.pos=="0")
 				{
                     	            stringx += "><img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+">"+ifspace+thismenuitem.caption+"</td></tr>";	
                     	        }
                     	        else
                     	        {
                     	        	if(thismenuitem.pos=="1")
                     	        	{
                     	            		stringx += ">"+thismenuitem.caption+ifspace+"<img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+"></td></tr>";	
                     	        	}
                     	        	else
                     	        	{
                     	        		if(thismenuitem.pos=="2")
                     	            			stringx += "background='"+thismenuitem.img+"'>"+thismenuitem.caption+"</td></tr>";	
                     	          		else
                     	            			stringx += ">"+thismenuitem.caption+"</td></tr>";
                     	      		} //end if(thismenuitem.pos=="1") else
                     	      	} //end if(thismenuitem.pos=="0") else
                     	} //end if(!thismenuitem.isline)
                     	else
                     	{
                     		stringx+='<tr><td class=smallfont height="1" background="'+menu_hr+'" onmousemove="'+menuName+'.stophide();"><img height="1" width="1" src="none.gif" border="0"></td></tr>\n';
                     	} //end if(!thismenuitem.isline) else
                } //end if(thismenuitem.hasc!=null) else
		
	} //end for(var i=0;i<thisitem.items.length;i++)
  	stringx+='</table>\n</div>'
  } //end for(var j=1;j<=mnumberofsub;j++)
  
  return "<div align='left'>"+stringx+"</div>"
} //end function mwritetodocument()


}//end function MenuControl
