var 
gsAgent=navigator.userAgent.toLowerCase(),
gsAppVer=navigator.appVersion.toLowerCase(),
gsAppName=navigator.appName.toLowerCase(),
gbIsOpera=gsAgent.indexOf("opera")>-1,
gbIsKHTML=gsAgent.indexOf("khtml")>-1
||gsAgent.indexOf("konqueror")>-1||gsAgent.indexOf("applewebkit")>-1,
gbIsWebKit=gsAgent.indexOf("applewebkit")>-1,
gbIsChrome=gbIsWebKit&&gsAgent.indexOf("chrome")>-1,
gbIsSafari=gbIsWebKit&&!gbIsChrome&&gsAgent.indexOf("applewebkit")>-1,
gbIsIE=(gsAgent.indexOf("compatible")>-1&&!gbIsOpera)
||gsAgent.indexOf("msie")>-1,
gbIsTT=gbIsIE?(gsAppVer.indexOf("tencenttraveler")!=-1?1:0):0,
gbIsQBWebKit=gbIsWebKit?(gsAppVer.indexOf("qqbrowser")!=-1?1:0):0,
gbIsQBIE=gbIsIE,
gbIsFF=gsAgent.indexOf("gecko")>-1&&!gbIsKHTML,
gbIsNS=!gbIsIE&&!gbIsOpera&&!gbIsKHTML&&(gsAgent.indexOf("mozilla")==0)
&&(gsAppName=="netscape"),
gbIsAgentErr=!(gbIsOpera||gbIsKHTML||gbIsSafari||gbIsIE||gbIsTT
||gbIsFF||gbIsNS),
gbIsWin=gsAgent.indexOf("windows")>-1||gsAgent.indexOf("win32")>-1,
gbIsVista=gbIsWin&&(gsAgent.indexOf("nt 6.0")>-1||gsAgent.indexOf("windows vista")>-1),
gbIsWin7=gbIsWin&&gsAgent.indexOf("nt 6.1")>-1,
gbIsMac=gsAgent.indexOf("macintosh")>-1||gsAgent.indexOf("mac os x")>-1,
gbIsLinux=gsAgent.indexOf("linux")>-1,
gbIsAir=gsAgent.indexOf("adobeair")>-1,
gnIEVer=/MSIE (\d+.\d+);/i.test(gsAgent)&&parseFloat(RegExp["$1"]),
gsFFVer=/firefox\/((\d|\.)+)/i.test(gsAgent)&&RegExp["$1"],
gsSafariVer=""+/version\/((\d|\.)+)/i.test(gsAgent)&&RegExp["$1"],
gsChromeVer=""+(/chrome\/((\d|\.)+)/i.test(gsAgent)&&RegExp["$1"]),
gsQBVer=""+(/qqbrowser\/((\d|\.)+)/i.test(gsAgent)&&RegExp["$1"]),
alf="_For_E_Built";


function getTop()
{
	var _oSelfFunc = arguments.callee;
	if (!_oSelfFunc._moTop)
	{
		try{
			_oSelfFunc._moTop=window!=parent?(parent.getTop?parent.getTop():parent.parent.getTop()):window;
		}
		catch(_oError){
			_oSelfFunc._moTop=window;
		}
	}
return _oSelfFunc._moTop;
}

try{
	window.top=getTop();
}catch(e){
	eval("var top=getTop();");
}


function yo(aU,mT)
{
return typeof aU=="function"?aU.apply(this,mT||[]):null;
}


function callBack(aU,mT)
{
if(!window.Console)
{
try
{
return yo.call(this,aU,mT);
}
catch(aD)
{
debug(aD.message);
}
}
else
{
return yo.call(this,aU,mT);
}
}

function waitFor(UF,Ih,
tk,na)
{
var jZ=0,
pL=tk||500,
TP=(na||10*500)/pL;

function aBF(nd)
{
try
{
Ih(nd)
}
catch(aD)
{
debug(aD);
}
};

(function()
{
try
{
if(UF())
{
return aBF(true);
}
}
catch(aD)
{
}

if(jZ++>TP)
{
return aBF(false);
}

setTimeout(arguments.callee,pL);
})();
}


function isLeapYear(dQ)
{
return(dQ%400==0||(dQ%4==0&&dQ%100!=0));
}


function calDays(dQ,fw)
{
return[null,31,null,31,30,31,30,31,31,30,31,30,31][fw]||(isLeapYear(dQ)?29:28);
}


function now()
{
return+new Date;
}


function regFilter(RI)
{
return RI.replace(/([\^\.\[\$\(\)\|\*\+\?\{\\])/ig,"\\$1");
}


function E(tW,Dk,aol,zs)
{
if(!tW)
{
return;
}

if(tW.length!=null)
{
var av=tW.length,
jx;

if(zs<0)
{
jx=av+zs;
}
else
{
jx=zs<av?zs:av;
}

for(var i=(aol||0);i<jx;i++)
{
try
{
if(Dk(tW[i],i,av)===false)
{
break;
}
}
catch(aD)
{
debug([aD.message,"<br>line:",aD.lineNumber,'<br>file:',aD.fileName,"<br>",Dk]);
}
}
}
else
{
for(var i in tW)
{
try
{
if(Dk(tW[i],i)===false)
{
break;
}
}
catch(aD)
{
debug([aD.message,"<br>",Dk],61882714);
}
}
}
}


function S(ar,cR)
{
try
{
return(cR&&(cR.document||cR)||document).getElementById(ar);
}
catch(aD)
{
return null;
}
}


function GelTags(ja,aS)
{
var BF=(aS||document).getElementsByTagName(ja);
if(BF)
{
BF[alf]=true;
}
return BF;

}


function show(sB,mh,cR)
{
var cv=(typeof(sB)=="string"?S(sB,cR):sB);
if(cv)
{
cv.style.display=(mh?"":"none");
}
else if(!cR&&typeof(sB)=="string")
{

}
return cv;
}

var Show=show;


function calcPos(aS,alI)
{
var cS=0,
fU=0,
bH=0,
cb=0;

if(aS&&aS.tagName)
{
var cv=aS.parentNode,
aiA=cv&&cv.offsetParent,
aDQ=aS.offsetParent,
cxQ;

fU+=aS.offsetLeft;
cS+=aS.offsetTop;
bH=aS.offsetWidth;
cb=aS.offsetHeight;

while(aiA)
{
if(aDQ==cv)
{
fU+=cv.offsetLeft;
cS+=cv.offsetTop;
aDQ=aiA;
}

fU-=cv.scrollLeft;
cS-=cv.scrollTop;



cv=cv.parentNode;
aiA=cv.offsetParent;
}

}

return alI=="json"
?{top:cS,bottom:cS+cb,left:fU,
right:fU+bH,width:bH,height:cb}
:[cS,fU+bH,cS+cb,fU,bH,cb];
}


function T(gP,lc)
{
return new T.rO(gP,lc);
}

function TE(gP,lc)
{
var aj=getTop();
if(aj.QMTmplChecker)
{
var aD=(new aj.QMTmplChecker(gP.join?gP:[gP],
lc)).getErrors();
if(aD.length)
{
debug(aD.join("\n"),"code");
}
}
return new T.rO(gP,lc,"exp");
}

T.rO=function(gP,lc,al)
{
this.uG=gP.join?gP.join(""):gP.toString();
this.pT=lc||"$";
this.Sf=al=="exp"
?this.Se
:this.Sd;
};

T.rO.prototype=
{
toString:function()
{
return this.uG;
},

replace:function(hP,mR)
{
return this.Sf(hP,mR);
},

Sd:function(hP,Tm)
{
var ad=this,
nd=ad.pT,
kW=ad.Ci,
uS=ad.QO,
BT=!kW;

if(BT)
{

kW=ad.Ci=ad.uG.split(ad.pT);
uS=ad.QO=ad.Ci.concat();
}

for(var i=1,au=kW.length;i<au;i+=2)
{
uS[i]=ad.rQ(BT?(kW[i]=kW[i].split("."))
:kW[i],hP,Tm,nd);
}

return uS.join("");
},

Se:function(hP,mR)
{
var ad=this,
lv;

if(!ad.Dr)
{
ad.Sp();
}

if(mR)
{
var qs=ad.CY[mR];
if(qs)
{
lv=typeof qs!="function"
?ad.CY[mR]=ad.Cx(qs)
:qs;
}
}
else
{
lv=ad.Dr;
}

try
{
return lv&&lv(hP,ad.HO,
ad.rQ,ad.pT)||"";
}
catch(aD)
{
return aD.message;
}
},




Sp:function()
{
var ad=this,
gS=0,
fE=[],
uF=[],
uY=[],
RQ=ad.CY=[],
nd=ad.pT,
nb=new RegExp(["","(.*?)",""].join(regFilter(nd)),"g"),
qg="_afG('$1'.split('.'),_oD,_aoD,_aoR)",
oV=ad.HO=ad.uG.split(["","@",""].join(nd)),
cC;

for(var i=0,au=oV.length;i<au;i++)
{
cC=oV[i];

if(i%2==0)
{
fE.push("_oR.push(_aoT[",i,"].replace(_oD,_aoD));");
oV[i]=T(cC,nd);
}
else if(cC=="else")
{
fE.push("}else{");
}
else if(cC=="endsec")
{
if(uY.length)
{
var az=uY.pop();
RQ[az[0]]=fE.slice(az[1]);
}
}
else if(cC=="endfor")
{
uF.length&&fE.push("}_oD=_oS",uF.pop(),";");
}
else if(cC=="endif")
{
fE.push("}");
}
else if(cC.indexOf("else if(")==0)
{
fE.push("}",cC.replace(nb,qg),"{");
}
else if(cC.indexOf("if(")==0)
{
fE.push(cC.replace(nb,qg),"{");
}
else if(cC.indexOf("for(")==0)
{
uF.push(++gS);
fE.push(
"var _sI",gS,",_oD",gS,",_oS",gS,"=_oD;",
cC.replace(nb,
["_sI",gS," in (_oD",gS,"=",qg,")"].join("")),
"{",
"_oD=_oD",gS,"[_sI",gS,"];",
"if(!_oD){continue;}",
"_oD._parent_=_oS",gS,";",
"_oD._idx_=_sI",gS,";"
);
}
else if(cC.indexOf("sec ")==0)
{
uY.push([cC.split(" ").pop(),fE.length]);
}
else if(cC.indexOf("eval ")==0)
{
fE.push("_oR.push(",cC.substr(5).replace(nb,qg),");");
}
}

ad.Dr=ad.Cx(fE);

return fE;
},

Cx:function(Ty)
{
try
{
return eval(
[
'([function(_aoD,_aoT,_afG,_aoR){var _oR=[],_oD=_aoD;',
Ty.join(""),
'return _oR.join("");}])'
].join("")
)[0];
}
catch(hS)
{
return function(){return"compile err!"};
}
},

rQ:function(vg,hP,To,Lk)
{
var au=vg.length,
bZ,
gC;

if(au>1)
{
try
{
gC=hP;
for(var i=0;i<au;i++)
{
bZ=vg[i];
if(bZ=="_root_")
{
gC=To;
}
else
{
gC=gC[bZ];
}
}
}
catch(aD)
{
gC="";
}
}
else
{
gC={
"_var_":Lk,
"_this_":hP
}[bZ=vg[0]]||hP[bZ];
}

return gC;
}
};



function AJ(hb,al,Gf,qb)
{
if(hb&&Gf)
{
if(hb.addEventListener)
{
hb[qb?"removeEventListener":"addEventListener"](
al,Gf,false
);
}
else if(hb.attachEvent)
{
hb[qb?"detachEvent":"attachEvent"]("on"+al,
Gf
);
}
else
{
hb["on"+al]=qb?null:Gf;
}
}

return hb;
}


function addEvent(hb,al,auG,qb)
{
if(hb&&(hb.join||hb[alf]))
{
E(hb,function(ak)
{
AJ(ak,al,auG,qb);
}
);
}
else
{
AJ(hb,al,auG,qb);
}

return hb;
}


function addEvents(hb,agV,qb)
{
E(agV,function(AW,al)
{
addEvent(hb,al,AW,qb);
}
);
return hb;
}


function getEventTarget(ag)
{
return ag&&(ag.srcElement||ag.target);
}


function formatNum(lS,aYw)
{

var wu=(isNaN(lS)?0:lS).toString(),
avb=aYw-wu.length;
return avb>0?[new Array(avb+1).join("0"),wu].join(""):wu;
}



function setValue(e,v){
	document.getElementById(e).value=v;
}
function initNoteCalender(bh)
{
	var ah=getTop();
	waitFor(function()
	{
	return ah.QMCalendar;
	},
	function(aE)
	{
		if(aE)
		{
			var Zl=(bh.begin||"1900,1").split(","),
			aza=parseInt(Zl[0],10),
			ayZ=parseInt(Zl[1],10),
			avk=bh.daydatalist.split("|"),
			uZ=bh.datestr||"",
			alr={
			CALENDAR:"calendar",
			NORMALDAY:"normalday",
			TODAY:"today",
			CURRENTDAY:"fn_list",
			INVALIDATEDDAY:"invalidateday pointer",
			EXPIREDDAY:"graytext",
			WEEKTTITLE:"week_title graytext",
			HOVERDAY:"hover attbg pointer",
			REMIND:"remind pointer",
			REMIND_EXPIRED:"bold remind pointer",
			REMIND_EVERYDAY:"remind pointer",
			REMIND_EVERYWEEK:"remind pointer",
			REMIND_EVERYMONTH:"remind pointer",
			REMIND_EVERYYEAH:"remind pointer"
			},

			UL=ah.formatNum;
			var afG=function(dS,fm,fJ)
			{
			var ju=(dS-aza)*12+(fm-ayZ),
			ki=new RegExp("\\b"+fJ+"\\b");
			return ki.test(avk[ju])?1:0;
			};

			var aeO=function(dS,fm,fJ)
			{
				var bI="",
				sm=afG(dS,fm,fJ),
				FK=ah.QMCalendar.compareToday(dS,fm,fJ);

				if(sm)
				{
				bI+=alr.REMIND;
				if(FK<0)
				{
				bI=" "+alr.REMIND_EXPIRED;
				}
				}

				if(uZ==[dS,UL(fm,2),UL(fJ,2)].join(""))
				{

				bI+=" "+alr.CURRENTDAY;
				}


				if(FK==0)
				{
				bI+=" "+alr.TODAY;
				bI=bI.replace(/(attbg|fn_list)/ig,"");
				}

			return bI;
			};

			var JO=function(dS,fm,fJ,as)
			{
				if(fm<10)
					fm="0"+fm;
				if(fJ<10)
					fJ="0"+fJ;
				var t=dS+"-"+fm+"-"+fJ;
				setValue($("#calendar_div").attr("target-elem"),t);
			};

			if(uZ.length==6)
			{
				uZ+="01";
			};
			
			var t = new ah.QMCalendar({
			dom:S("calendar_div"),
			css:alr,
			date:uZ?new Date(uZ.substr(0,4),uZ.substr(4,2)-1,uZ.substr(6,2)):new Date(),
			onclick:JO,
			onspecaildate:aeO
			});

		}

	});
}

//自定义方法：显示日历
function calendarShow(elem){
	$('#calendar_div').removeAttr("target-elem");
	$('#calendar_div').attr("target-elem",elem.id);
	$('#calendar_div').css({top:$(elem).offset().top+10,left:$(elem).offset().left})	
	$('#calendar_div').show();
	$('#calendar_div').focus();		
}

/**
 * 自定义方法：日历失去焦点，如果焦点在calendar以外，隐藏calendar，否则，保持不变（针对IE）
 */
function calendarBlur(elem) {
  var active=document.activeElement;
  if(active) {
    var hide=true;
    do {
      if(active==elem){
        hide=false;
        break;
      }

      active=active.parentNode;
    } while (active && active!=document.body);

    if(hide)
      $(elem).hide();
    else
      $(elem).focus();
  }
}