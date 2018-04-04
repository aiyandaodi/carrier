

var timerID ;

function tzone(os, ds, cl)
{
    this.ct = new Date(0) ; // datetime
    this.os = os ; // GMT offset
    this.ds = ds ; // has daylight savings
    this.cl = cl ; // font color
}

function UpdateClocks()
{
var ct = new Array(
new tzone(-10, 0, 'silver'),
new tzone(-9, 0, 'silver'),
new tzone(-8, 0, 'silver'),
new tzone(-8, 0, 'silver'),
new tzone(-8, 0, 'silver'),
new tzone(-8, 0, 'silver'),
new tzone(-7, 0, 'silver'),
new tzone(-7, 0, 'silver'),
new tzone(-7, 0, 'silver'),
new tzone(-7, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-6, 0, 'silver'),
new tzone(-5, 1, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-5, 0, 'silver'),
new tzone(-4, 1, 'silver'),
new tzone(-4, 1, 'silver'),
new tzone(-3.5, 0, 'silver'),
new tzone(-3, 0, 'silver'),
new tzone(-3, 1, 'silver'),
new tzone(-3, 1, 'silver'),
new tzone(-3, 1, 'silver'),
new tzone(-3, 1, 'silver'),
new tzone(0, 0, 'silver'),
new tzone(0, 0, 'silver'),
new tzone(0, 0, 'silver'),
new tzone(0, 0, 'silver'),
new tzone(0, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+1, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+2, 0, 'silver'),
new tzone(+3, 0, 'silver'),
new tzone(+3, 0, 'silver'),
new tzone(+3, 0, 'silver'),
new tzone(+3, 0, 'silver'),
new tzone(+3, 0, 'silver'),
new tzone(+3, 0, 'silver'),
new tzone(+3, 0, 'silver'),
new tzone(+3, 0, 'silver'),
new tzone(+3, 0, 'silver'),
new tzone(+3.5, 0, 'silver'),
new tzone(+4, 0, 'silver'),
new tzone(+4.5, 0, 'silver'),
new tzone(+5, 0, 'silver'),
new tzone(+5, 0, 'silver'),
new tzone(+5, 0, 'silver'),
new tzone(+5, 0, 'silver'),
new tzone(+5.5, 0, 'silver'),
new tzone(+5.5, 0, 'silver'),
new tzone(+5.5, 0, 'silver'),
new tzone(+5.75, 0, 'silver'),
new tzone(+6, 0, 'silver'),
new tzone(+6.5, 0, 'silver'),
new tzone(+7, 0, 'silver'),
new tzone(+7, 0, 'silver'),
new tzone(+7, 0, 'silver'),
new tzone(+8, 0, 'silver'),
new tzone(+8, 0, 'silver'),
new tzone(+8, 0, 'silver'),
new tzone(+8, 0, 'silver'),
new tzone(+8, 0, 'silver'),
new tzone(+8, 0, 'silver'),
new tzone(+8, 0, 'silver'),
new tzone(+8, 0, 'silver'),
new tzone(+9, 0, 'silver'),
new tzone(+9, 0, 'silver'),
new tzone(+9.5, 0, 'silver'),
new tzone(+10, 0, 'silver'),
new tzone(+10, 0, 'silver'),
new tzone(+10, 1, 'silver'),
new tzone(+10, 1, 'silver'),
new tzone(+10, 1, 'silver'),
new tzone(+9.5, 1, 'silver'),
new tzone(+12, 0, 'silver'),
new tzone(+12, 0, 'silver'),
new tzone(+12, 0, 'silver'),
new tzone(+12, 1, 'silver'),
new tzone(+12.75, 1, 'silver'),
new tzone(+14, 0, 'silver')
    ) ;

    var dt = new Date() ; // [GMT] time according to machine clock
    var startDST = new Date(dt.getFullYear(), 3, 1) ;

    while (startDST.getDay() != 0)
        startDST.setDate(startDST.getDate() + 1) ;

    var endDST = new Date(dt.getFullYear(), 9, 31) ;

    while (endDST.getDay() != 0)
        endDST.setDate(endDST.getDate() - 1) ;

    var ds_active ; // DS currently active
    if (startDST < dt && dt < endDST)
        ds_active = 1 ;
    else
        ds_active = 0 ;

// Adjust each clock offset if that clock has DS and in DS.

    for(n=0 ; n<ct.length ; n++)
        if (ct[n].ds == 1 && ds_active == 1) ct[n].os++ ;

// compensate time zones

    var printstr = "";

    gmdt = new Date() ;
    for (n=0 ; n<ct.length ; n++) {
        ct[n].ct = new Date(gmdt.getTime() + ct[n].os * 3600 * 1000) ;
    }

var newyork=document.getElementById("Clockk34");
if (newyork)
  newyork.innerHTML = ClockString(ct[43].ct);//纽约夏令时改为43，其它为34
var beijing=document.getElementById("Clockk122");
if (beijing)
  beijing.innerHTML = ClockString(ct[122].ct);//北京
var tokyo=document.getElementById("Clockk22");
if (tokyo)
  tokyo.innerHTML = ClockString(ct[130].ct);//东京
var sydney=document.getElementById("Clockk133");
if (sydney)
  sydney.innerHTML = ClockString(ct[133].ct);//悉尼夏令时改为133，其它改为130
var london=document.getElementById("Clockk54");
if (london)
  london.innerHTML = ClockString(ct[56].ct);//伦敦 夏令改为56,其他时间改为54
var chicago=document.getElementById("Clockk23");
if (chicago)
  chicago.innerHTML = ClockString(ct[20].ct);//芝加哥

    timerID = window.setTimeout("UpdateClocks()", 1001) ;
}


function ClockString(dt)
{
    var stemp, ampm ;
    var dt_year = dt.getUTCFullYear() ;
    var dt_month = dt.getUTCMonth() + 1 ;
    var dt_day = dt.getUTCDate() ;
    var dt_hour = dt.getUTCHours() ;
    var dt_minute = dt.getUTCMinutes() ;
    var dt_second = dt.getUTCSeconds() ;
    dt_year = dt_year.toString() ;

if (dt_hour < 10)
        dt_hour = '0' + dt_hour ;

    if (dt_minute < 10)
        dt_minute = '0' + dt_minute ;

    if (dt_second < 10)
        dt_second = '0' + dt_second ;


    stemp = dt_hour + ":" + dt_minute + ":" + dt_second;
    return stemp ;
}


window.onload=UpdateClocks;
