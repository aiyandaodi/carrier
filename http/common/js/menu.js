var menuArray=new Array();
var menuGo=new Array();
var menuHint=new Array();
var menuCount=0;
var menuWidth=60;

function addMenuItem( name, url, hint)
{
	menuArray[menuCount]=name;
	menuGo[menuCount]=url;
	menuHint[menuCount]=hint;
	menuCount++;
}

function getMenuTd()
{
	var i;
	var s="";
	for (i=0;i<menuCount;i++)
	{
		s+="<td nowrap align='center' width='"+menuWidth+"'>"+
			"<a href='"+menuGo[i]+"' onmouseover=javascript:showHintInfo('"+
			menuHint[i]+
			"') onmouseout='javascript:closeReady();'>"+
			menuArray[i]+"</a>"+
			"</td>";
	}
	return s;
}