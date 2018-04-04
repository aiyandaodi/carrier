function Lunar(lZ)
{
this.constructor=arguments.callee;

lZ=lZ||new Date;

this.nSolarYear=lZ.getFullYear();
this.nSolarMonth=lZ.getMonth()+1;
this.nSolarDay=lZ.getDate();

var am,Xv=0,nu=0,
ckw=new Date(1900,0,31),
sy=(lZ-ckw)/86400000;
this.nDayCyl=sy+40;
this.nMonCyl=14;
for(am=1900;am<2050&&sy>0;am++)
{
nu=Lunar.yearDays(am);
sy-=nu;
this.nMonCyl+=12;
}
if(sy<0)
{
sy+=nu;
am--;
this.nMonCyl-=12;
}
this.nYear=am;
this.nYearCyl=am-1864;
Xv=Lunar.leapMonth(am);
this.bLeap=false;
for(am=1;am<13&&sy>0;am++)
{
if(Xv>0&&am==Xv+1&&this.bLeap==false)
{
--am;
this.bLeap=true;
nu=Lunar.leapDays(this.nYear);
}
else
{
nu=Lunar.monthDays(this.nYear,am);
}
if(this.bLeap&&am==Xv+1)
{
this.bLeap=false;
}
sy-=nu;
if(!this.bLeap)
{
this.nMonCyl++
}
}
if(sy==0&&Xv>0&&am==Xv+1)
{
if(this.bLeap)
{
this.bLeap=false;
}
else
{
this.bLeap=true;
--am;
--this.nMonCyl;
}
}
if(sy<0)
{
sy+=nu;
--am;
--this.nMonCyl;
}
this.nMonth=am;
this.nDay=sy+1;
}


Lunar.prototype.initFestival=function()
{
var Fx=Lunar.acq;

this.sY=Fx.ciU[(this.nYear-4)%12];

this.sM=Fx.bNv[this.nMonth];

this.sD=Lunar.getLunarDay(this.nDay);
if(this.nDay==1)
{
this.sShow=(this.bLeap?'闰':'')+this.sM+'月'+(Lunar.monthDays(this.nYear,this.nMonth)==29?'小':'大');
}
else
{

this.sShow=this.sM+"月"+this.sD;
}

this.ChineseEraYear=Fx.blw(this.nYearCyl);
this.ChineseEraMonth=Fx.blw(this.nMonCyl);
this.ChineseEraDay=Fx.blw(this.nDayCyl);


for(var am=0;am<2;am++)
{
var mL=Fx.cfl(this.nSolarYear,(this.nSolarMonth-1)*2+am);
if(mL==this.nSolarDay)
{
this.sSolarTerm=Fx.cnA[(this.nSolarMonth-1)*2+am];
}
}

this.oSolarFestival=[];

for(var am in Fx.bNj)
{
if(Fx.bNj[am].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
if(Number(RegExp.$1)==this.nSolarMonth&&Number(RegExp.$2)==this.nSolarDay)
{
this.oSolarFestival.push(RegExp.$4+' ');
}
}

var bUy=(new Date(this.nSolarYear,this.nSolarMonth-1)).getDay();
for(var am in Fx.bLk)
{
if(Fx.bLk[am].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
{
if(Number(RegExp.$1)==this.nSolarMonth)
{
var cgm=Number(RegExp.$2),
bBZ=Number(RegExp.$3);
if((bUy>bBZ?7:0)+7*(cgm-1)+bBZ+1-bUy==this.nSolarDay)
{
this.oSolarFestival.push(RegExp.$5+' ');
}
}
}
}

this.oLunarFestival=[];

for(var am in Fx.bMy)
{
if(Fx.bMy[am].match(/^(\d{2})(.{2})([\s\*])(.+)$/))
{
if(Number(RegExp.$1)==this.nMonth&&Number(RegExp.$2)==this.nDay)
{
this.oLunarFestival.push(RegExp.$4+' ');
}
if(Number(RegExp.$1)==1&&Number(RegExp.$2)==0)
{


if(this.nSolarDay==31)
{
var boj=new Lunar(new Date(this.nSolarYear,2-1,1));
}
else
{
var boj=new Lunar(new Date(this.nSolarYear,this.nSolarMonth-1,this.nSolarDay+1));
}
if(boj.nDay==1&&boj.nMonth==1)
{
this.oLunarFestival.push(RegExp.$4+' ');
}
}
}
}
}





Lunar.yearDays=function(dS)
{
var am,bRm=348
for(am=0x8000;am>0x8;am>>=1)
bRm+=(Lunar.acq.aJN[dS-1900]&am)?1:0;
return(bRm+Lunar.leapDays(dS));
}


Lunar.leapDays=function(dS)
{
if(this.leapMonth(dS))
return(Lunar.acq.aJN[dS-1900]&0x10000)?30:29;
else return 0;
}


Lunar.leapMonth=function(dS)
{
return Lunar.acq.aJN[dS-1900]&0xf;
}


Lunar.monthDays=function(dS,fm)
{
return(Lunar.acq.aJN[dS-1900]&(0x10000>>fm))?30:29;
}


Lunar.acq={
blw:function(lI)
{
return this.ckb[lI%10]+this.cpi[lI%12];
},

cfl:function(dS,ctk)
{
var csU=new Date((31556925974.7*(dS-1900)+this.cnb[ctk]*60000)+Date.UTC(1900,0,6,2,5));
return csU.getUTCDate();
},

aJN:[
0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0
],

ckb:["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],

cpi:["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],

ciU:["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"],

cnA:["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"],

cnb:[0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758],

chX:['日','一','二','三','四','五','六','七','八','九'],

bNv:['','正','二','三','四','五','六','七','八','九','十','十一','腊'],

cip:['初','十','廿','卅','　'],

bMy:[
"0101*春节",
"0115 元宵节",
"0505 端午节",
"0707 七夕节",
"0815 中秋节",
"0909 重阳节",
"1208 腊八节",
"1224 小年",
"0100*除夕"
],
bLk:[
"0520 母亲节",
"0630 父亲节",
"1144 感恩节"
],
bNj:[
"0101*元旦",
"0214 情人节",
"0308 妇女节",
"0312 植树节",
"0401 愚人节",
"0501 劳动节",
"0504 青年节",
"0601 儿童节",
"0701 建党节",
"0801 建军节",
"0910 教师节",
"1001*国庆节",
"1225 圣诞节"
]
};


Lunar.lunarDateToSolar=function(aJW,aJR,bYB,brM)
{
var aqD=0;
var bSo=Lunar.leapMonth(aJW);


for(var ok=1900;ok<aJW;ok++)
{
aqD+=Lunar.yearDays(ok);
}

if(aJR>bSo)
{
aqD+=Lunar.leapDays(aJW);
}
else if(brM&&(bSo==aJR))
{
aJR++;
}
for(var Cv=1;Cv<aJR;Cv++)
{
aqD+=Lunar.monthDays(aJW,Cv);
}
aqD+=(bYB-1);
return new Date(aqD*86400000+(+new Date(1900,0,31)));
}


Lunar.calLunarDays=function(dS,fm,brM)
{
var bTF=!dS||!fm?30:Lunar.monthDays(dS,fm),
bSn=Lunar.leapDays(dS,fm);
if(brM&&bSn>0)
{
bTF=bSn;
}
return bTF;
}



Lunar.getLunarMonth=function(fm)
{
return Lunar.acq.bNv[fm];
}

Lunar.getLunarDay=function(fJ)
{
var bUl=Math.floor(fJ/10),
bSm=fJ%10;
if(bSm)
{
return Lunar.acq.cip[bUl]+Lunar.acq.chX[bSm]
}
else
{
return['','初十','二十','三十'][bUl];
}
}

Lunar.isChangeToLeapMonth=function(ub,On)
{
var nS=arguments.callee.ctE;
if(!nS)
{
nS=arguments.callee.ctE=new Lunar();
}
return nS.bLeap&&nS.nYear==ub&&nS.nMonth==On;
}
