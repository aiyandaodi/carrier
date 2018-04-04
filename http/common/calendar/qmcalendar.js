function QMCalendar(ae)
{
this.constructor=arguments.callee;
this.agE(ae);
this.ge();
}

QMCalendar.prototype.agE=function(bh)
{

//var jF=bh.date||new Date;	
var jF = new Date;
this.pc=jF.getMonth()+1;
this.oK=jF.getFullYear();

this.eC=bh.dom;
this.hR=bh.dom.ownerDocument;
//alert(this.eC);		//HTMLDIVELEMENT
//alert(this.hR)		//HTMLDocument
//this.eC.innerHTML="this.eC.innerHTML";
this.aRZ=bh.rankYear&&bh.rankYear[0]||1900;
this.aRX=bh.rankYear&&bh.rankYear[1]||2050;
//alert(this.aRZ);		2001
//alert(this.aRX);		2050
this.GZ=now();
//alert(this.GZ);
var arm=QMCalendar.cFl;

this.moCss=bh.css||arm.alr;
//alert(this.moCss);
this.bos=bh.onspecaildate||arm.cEZ;
this.boy=bh.onmouseover||arm.bmy;
this.boC=bh.onclick||arm.aEp;
this.boA=bh.onmouseout||arm.bmz;
//alert(this.bos)

};

QMCalendar.cFl={
cEZ:function(){return""},

bmy:function(dS,fm,fJ,as)
{
var bI=as.className,
jH=new RegExp("("+this.moCss.EXPIREDDAY+")","ig");
if(!jH.test(bI))
{
as.className+=" "+this.moCss.HOVERDAY;
}
this.cvb(dS,fm,fJ,as);
},

bmz:function(dS,fm,fJ,as)
{
as.className=as.getAttribute("orgclass");
this.bHC();
},

aEp:function(){},

alr:{
CALENDAR:"calendar",
NORMALDAY:"normalday",
TODAY:"today",
CURRENTDAY:"fn_list",
INVALIDATEDDAY:"invalidateday pointer",
EXPIREDDAY:"graytext",
WEEKTTITLE:"week_title graytext",
HOVERDAY:"hover attbg pointer",
REMIND:"remind pointer",
REMIND_EXPIRED:"remind_expired pointer",
REMIND_EVERYDAY:"remind pointer",
REMIND_EVERYWEEK:"remind pointer",
REMIND_EVERYMONTH:"remind pointer",
REMIND_EVERYYEAH:"remind pointer"
}
};


QMCalendar.prototype.ge=function()
{
var ad=this,
bBC=QMCalendar.aJ.aVY,
dz=[
bBC.replace({
type:"Year",
typename:"年",
id:ad.GZ,
value:ad.oK,
content:bBC.replace({
type:"Month",
typename:"月",
id:ad.GZ,
value:ad.pc
},"data")
}),
ad.bbX()
];

ad.eC.innerHTML=QMCalendar.aJ.aWm.replace({
content:dz.join(""),
"class":ad.moCss.CALENDAR
});


var aZH=S("table_"+ad.GZ,ad.hR);

function boa(ag)
{
var ap=getEventTarget(ag),
vh;
while(ap&&ap!=aZH&&!ap.getAttribute("day"))
{
ap=ap.parentNode;
}
if(ap!=aZH)
{
ad.bHC();
vh=parseInt(ap.getAttribute("day"));
if(vh>0)
{
callBack.call(ad,
{
click:ad.boC,
mouseover:ad.boy,
mouseout:ad.boA
}[ag.type],[ad.oK,ad.pc,vh,ap]
);
}
else if(ag.type=='click')
{
ad.bFM(vh==-1?-1:1,0);
}
}
}

addEvents(aZH,
{
click:boa,
mouseover:boa,
mouseout:boa
}
);

var eH=[[0,-1],"prevYear_",
[0,1],"nextYear_",
[-1,0],"prevMonth_",
[1,0],"nextMonth_"];
for(am=eH.length-1;am>0;am-=2)
{
(function()
{
var cN=am;
S(eH[cN]+ad.GZ,ad.hR).onclick=function(){
ad.bFM.apply(ad,eH[cN-1]);
};
})();
}
};

QMCalendar.prototype.bbX=function()
{
var adC=this.pc,
avh=this.oK;
if(--adC<=0)
{
adC=12;
avh--;
}
var bbz=calDays(avh,adC),
afA=(new Date(this.oK,this.pc-1,1)).getDay(),
bI="",
adl=[],
zV=[],
cZ=QMCalendar.aJ,
jc=cZ.cio,
aMJ=this.moCss;


for(var am=0,aG=cZ.aAe.length;am<aG;am++)
{
zV.push(jc.replace({
"class":aMJ.WEEKTTITLE,
content:cZ.aAe.charAt(am)
}));
}
adl.push(cZ.arW.replace({
content:zV.join("")
}));


zV=[];
for(am=1;am<=afA;am++)
{
zV.push(jc.replace({
"class":aMJ.INVALIDATEDDAY,
day:-1,
content:bbz+am-afA
}));
}

var lS=0,
JV=false,
vh=calDays(this.oK,this.pc),
bI=aMJ.NORMALDAY,
agu=bI;
am=afA;
while(!JV)
{
for(;am<=6;am++)
{
++lS;

agu=bI;
if(!JV)
{
agu=this.bos(this.oK,this.pc,lS);
}

zV.push(jc.replace({
"class":agu,
day:JV?0:lS,
content:lS
}));
if(vh==lS)
{

lS=0;
JV=true;
bI=aMJ.INVALIDATEDDAY;

}
}
am=0;
adl.push(cZ.arW.replace({
content:zV.join("")
}));
zV=[];
}
return cZ.aYp.replace({
id:this.GZ,
content:adl.join("")
});

};

QMCalendar.prototype.bFM=function(cdp,ccQ)
{
var On=this.pc+cdp,
ub=this.oK+ccQ;
if(On<1)
{
On=12;
--ub;
}
else if(On>12)
{
On=1;
++ub;
}
if(ub>=this.aRZ&&ub<=this.aRX)
{
this.oK=ub;
this.pc=On;
this.ge();
}
};


QMCalendar.aJ={
aAe:"日一二三四五六",

aWm:T('<table class="$class$" cellpadding=0 cellspacing=0 border=0 width="100%" align=center valign=top>$content$</table>'),

aVY:TE(['<tr>',
'<td class="title_year attbg bd">',
'$@$sec data$@$',
'<span class="selecter">',
'<img src="'+tek.common.getRelativePath()+'http/common/calendar/nextfd.gif" id="prev$type$_$id$" title="前一$typename$"/>',
'<span style="margin:0 3px;"><span>$value$</span>$typename$</span>',
'<img src="'+tek.common.getRelativePath()+'http/common/calendar/prefd.gif" id="next$type$_$id$"  title="下一$typename$"/>',
'</span>',
'$@$endsec$@$',
'$content$',
'</td>',
'</tr>']),

aYp:T(['<tr><td align=center width=100%>',
'<table id="table_$id$" class="datelist" cellpadding=0 cellspacing=0 border=0 width=100%>$content$</table></td></tr>']),

arW:T('<tr align=center>$content$</tr>'),



cio:T('<td class="day $class$" orgclass="day $class$" day="$day$">$content$</td>'),

cgp:T(
"<div class='toolbg bd' style='height:auto;width:61px;padding:4px 6px 2px 6px;line-height:18px'>$sShow$<br><b>$term$ $lf$ $sf$</b></div>")
};




QMCalendar.prototype.cvb=function(dS,fm,fJ,as)
{

if(!Lunar)
{
return;
}
if(!this.boZ)
{
var bT=this.boZ=this.hR.createElement("div");

bT.style.zIndex=102;
bT.style.position="absolute";
bT.style.display="none";
this.hR.body.appendChild(bT);
}

var ad=this;
this.aSz=setTimeout(function()
{
var FT=new Lunar(new Date(dS,fm-1,fJ)),
bT=ad.boZ,
bV=calcPos(as);
bT.style.left=Math.max(bV[1]-75,0)+"px";
bT.style.top=bV[2]+"px";
FT.initFestival();
bT.innerHTML=QMCalendar.aJ.cgp.replace({
sShow:FT.sShow,
term:FT.sSolarTerm,
lf:FT.oLunarFestival.join(" "),
sf:FT.oSolarFestival.join(" ")
}
);
show(bT,1);
ad.aSz=0;
},300);
};




QMCalendar.prototype.bHC=function()
{
if(this.aSz)
{
clearTimeout(this.aSz);
this.aSz=0;
}
show(this.boZ,0);
};


QMCalendar.compareToday=function(dS,fm,fJ)
{
var akG=new Date,
VO=getTop().formatNum,
axK=[akG.getFullYear(),VO(akG.getMonth()+1,2),VO(akG.getDate(),2)].join(""),
HI=[dS,VO(fm,2),VO(fJ,2)].join("");
return HI<axK?-1:(HI==axK?0:1);
};


