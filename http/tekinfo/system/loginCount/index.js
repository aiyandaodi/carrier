// JavaScript Document
    var PAGE_COUNT=10;
	var groupCount=10;
	var page;
	//var current=1;
	var searchModel=0; 
	var tempRecord = new Array();
	var currRecord = new Array();  // 当前数据
	var countType=1;//当前登录计数模式，1为ip计数，2为用户登录计数
	var count=PAGE_COUNT;
	var skip = 0;
	var quickSearchValue=0;
	var limitCount=0;//用于统计点击 禁用button的次数
	
	var param={};//ajax读取数据传参 
	var searchCount=1;//判断table为空时查询次数
	 
function init2(){
  var table = document.getElementById("objects_table");
  if(table)
    listRecordOrder ();
  else
    $("#table-msg").html("没有定义表格，无法显示帐号列表信息！");
  
  limit();
}
	
function listRecordOrder (){
	if(searchModel==0)  
	  {  
		listRecord();}
	else {
		listRecord();//会整个刷新，但缺少search的过滤
		quickSearch();}
}

function limit(){
	if(limitCount%2==1){//显示全部信息，limitBtn没有被选中
		param["all"]=1;
		document.getElementById("limitBtn").style.background = "#CCC"; 
		document.getElementById("limitBtn").style.border="#999";
	}else{//只显示禁用信息，limitBtn选中
		param["all"]=null;
		document.getElementById("limitBtn").style.background = "#D9534F"; 
		document.getElementById("limitBtn").style.border="#D43F3A";
		clickOut("limitBtn");
	}
	limitCount++;
	if(countType==1)
		ipCount();
	else
		userCount();
		
}

function ipCount(){
	searchCount=1;
	countType=1;
	ipCountChange();
	clickOut("ipBtn")
	listRecordOrder();//刷新列表
}
function userCount(){
	searchCount=1;
	countType=2;
	userCountChange();
	clickOut("userBtn");
	listRecordOrder();
}

function clearAll(){
	searchCount=1;
	param["clear"]=1;
	listRecordOrder();
}
			
//响应分页处理
function listRecord (){
  $("#object_tbody").html("");
  var html=new StringBuffer();
  html.append("<div class='center'><img src='");
  html.append(tek.common.getRootPath());
  html.append("http/images/waiting-small.gif'/> 正在获取数据...</div>");
  $("#table-msg").html(html.toString());
	
  var p={};
  p["async"]=false;
  p["type"]="post";
  p["url"]=tek.common.getRootPath()+"servlet/database";
  param["action"]="getLoginCounts";
  param["type"]=countType;
  p["params"]=param;
  p["success"]=function(data) {
      //操作成功
      var record=data["record"];
      if (record) {
        tempRecord=record;
        currRecord=record;	
        param["clear"]=null;
        showList(0);
        showListTurn(0);
        
      } else {
        $("#table-msg").html("没有数据");
      }
  };
  p["error"]=function(data,message) {
      $("#table-msg").html(message);
  };
  
  tek.common.ajax2(p);
}

function deleteUser(countID){
	var remove=window.confirm("确定删除该条信息？");
	if (!remove)
		return ;
		
	$("#waiting-modal-dialog").modal("show",null,2);
	var params={};
	params["action"]="removeLoginCount";
	params["type"]=countType;
	params["count_id"]=countID;
	$.ajax({
		 async : false,
			type: "post",
			url: tek.common.getRootPath()+"servlet/database",
			dataType: "json",
			data: params,
			success: function(data) {			
				if(data) {
					if (data.code==0) {
						//操作成功
						//$("#table-msg").html("");
						listRecordOrder();//刷新列表
						tek.macCommon.waitingMessage("删除成功");
						tek.macCommon.timeCounting();
					} else {
						// 操作错误
						var error=new StringBuffer();
						error.append("<font color='red'>");
						if(data.code)
							error.append(data.code);
						error.append(" - ");
						if(data.message)
							error.append(stringToHTML(data.message));
						error.append("</font>");
						tek.macCommon.waitingMessage(error.toString());
						tek.macCommon.timeCounting();
					}
				} else {
					tek.macCommon.waitingMessage("<font color='red'>操作失败![data=null]</font>");
					tek.macCommon.timeCounting();
				}
			},
			error: function(request) {
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append("操作错误![");
					if(request.status)
						error.append(request.status);
					error.append(" - ");
					if(request.response)
						error.append(request.response);
					error.append("]");
					error.append("</font>");
					tek.macCommon.waitingMessage(error.toString());
					tek.macCommon.timeCounting();
			}
		});


}

function showList(skip) {
	
	$("#object_tbody").html("");
	if (typeof(currRecord.length) == "undefined"){
			if(currRecord.count_id.value==-1)
				currRecord.count_id.show="localhost";
			var str=new StringBuffer();
			str.append("<tr><td>");
			str.append(currRecord.count_id.show);
			str.append("</td><td>");
			str.append(currRecord.count_times.value);
			str.append("</td><td>");
			str.append(currRecord.count_latest.show);
			str.append("</td><td style='text-align:center'>");
			str.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteUser(\"");
			str.append(currRecord.count_id.value);
			str.append("\");'>");
			str.append("<b class='icon-remove'>删除</b> </button> ");
			str.append("</td></tr>");
	
			$("#object_tbody").append(str.toString());

		}else{
		
			var length=((currRecord.length-skip)>count) ? count : (currRecord.length-skip);
			if(length>0){
				for(var i =0;i<length;i++){
					if(currRecord[i+skip].count_id.value==-1)
						currRecord[i+skip].count_id.show="localhost";
					var str=new StringBuffer();
					str.append("<tr><td>");
					str.append(currRecord[i+skip].count_id.show);
					str.append("</td><td>");
					str.append(currRecord[i+skip].count_times.value);
					str.append("</td><td>");
					str.append(currRecord[i+skip].count_latest.show);
					str.append("</td><td style='text-align:center'>");
					str.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteUser(\"");
					str.append(currRecord[i+skip].count_id.value);
					str.append("\");'>");
					str.append("<b class='icon-remove'>删除</b> </button> ");
					str.append("</td></tr>");
	
					$("#object_tbody").append(str.toString());
				}
			}
		}
	$("#table-msg").html("");
}


	function myRefresh(){	
		searchCount=1;
		listRecordOrder();//刷新列表
	} 
	 /**
		   * 判断输入字符，"回车"自动检索
		   */
	function inputEnter(evt) {
		
            evt = evt ? evt : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
            var key = evt.keyCode ? evt.keyCode : evt.which;
            if (key == 13)
              quickSearch();//page*

            if (evt && evt.stopPropagation)
              evt.stopPropagation();
            else
              window.event.cancelBubble=true;
		  }
		  
	function quickSearch(){
         var sb=new StringBuffer();
		
		 var countID_all = new Array;
         quickSearchValue = document.getElementById("quickSearchKey").value;
		 quickSearchValue=quickSearchValue.trim().toLowerCase();//去除搜索关键字中的空格
		 if(!quickSearchValue||quickSearchValue==""){
			 searchModel=0;searchCount=2}
		 else{ searchModel=1;searchCount=1}
		 
		 currRecord=new Array();
		 if(document.getElementById("object_tbody").rows[0]==null&&searchCount<2){
			searchCount++;
			$("#table-msg").html("没有数据");	 
			return;
		 }
		
		 if(searchModel){
			 if(typeof(tempRecord.length) == "undefined"){
				$("#object_tbody").html("");
				 if(tempRecord.count_id.show.toLowerCase().indexOf(quickSearchValue)!= -1){ 
					var loc=tempRecord.count_id.show.indexOf(quickSearchValue);
					var str=new StringBuffer();
					str.append("<tr><td>");
					str.append(tempRecord.count_id.show.substring(0, loc));
					str.append("<font color='#FF0000'>");
				    str.append(tempRecord.count_id.show.substring(loc, loc + quickSearchValue.length));
				    str.append("</font>");
					str.append(tempRecord.count_id.show.substring(loc + quickSearchValue.length));
					str.append("</td><td>");
					str.append(tempRecord.count_times.value);
					str.append("</td><td>");
					str.append(tempRecord.count_latest.show);
					str.append("</td><td style='text-align:center'>");
					str.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteUser(\"");
					str.append(tempRecord.count_id.value);
					str.append("\");'>");
					str.append("<b class='icon-remove'>删除</b> </button> ");
					str.append("</td></tr>");
	
					$("#object_tbody").append(str.toString());
				 }else{
					 $("#table-msg").html("没有数据");	 
					 $("#object_tbody").html("");	 
				 }
			}else{
				for (var i in tempRecord){
				   countID_all.push(tempRecord[i].count_id.show);
				}
				for( i in countID_all)
				 {
				   if(countID_all[i].toLowerCase().indexOf(quickSearchValue)!= -1)
						 currRecord.push(tempRecord[i]);
				 }
				 var flag=false;//用来判断是否查询到数据
				$("#object_tbody").html("");
				var length=((currRecord.length-skip)>count) ? count : (currRecord.length-skip);
				if(length>0){
					for(var i =0;i<length;i++){
						var loc=currRecord[i].count_id.show.indexOf(quickSearchValue);
						if(loc!=-1) flag=true;
						var str=new StringBuffer();
						str.append("<tr><td>");
						str.append(currRecord[i].count_id.show.substring(0, loc));
						str.append("<font color='#FF0000'>");
						str.append(currRecord[i].count_id.show.substring(loc, loc + quickSearchValue.length));
						str.append("</font>");
						str.append(currRecord[i].count_id.show.substring(loc + quickSearchValue.length));
						str.append("</td><td>");
						str.append(currRecord[i].count_times.value);
						str.append("</td><td>");
						str.append(currRecord[i].count_latest.show);
						str.append("</td><td style='text-align:center'>");
						str.append("<button class='btn btn-xs btn-danger' onClick='javascript:deleteUser(\"");
						str.append(currRecord[i].count_id.value);
						str.append("\");'>");
						str.append("<b class='icon-remove'>删除</b> </button> ");
						str.append("</td></tr>");
		
						$("#object_tbody").append(str.toString());
					}// end for(var i=0;i<lentgth;i++)
				}//end if(length>0)
				if(flag==false) 
					$("#table-msg").html("没有数据");	 
			}//end if(typeof(tempRecord.length) == "undefined") else
				showListTurn(0);
		}else{//if(searchModal)else
			listRecordOrder();
		 }
    }
function showhand(elem) {
  if(tek.common.isIE())
    elem.style.cursor="hand"; 
  else
    elem.style.cursor="pointer";
}

function showListTurn(skip){
  var elem=document.getElementById("page");
  if (!elem)
    return;

  elem.innerHTML="";

  
  var sb=new StringBuffer();
//  var total=currRecord.length;
  var total=0;
  if (typeof(currRecord.length) == "undefined") { 
  	total=1;
  }	else{
	  total=currRecord.length;
	  }
 // alert(total);
  var currentPage=Math.floor(skip/count)+1;    // 当前页号
  var totalPage=Math.floor(total/count);    // 总页数
  if(totalPage<=0 || (total%count)>0)
    totalPage+=1;
  
  var remain=currentPage%groupCount;
  var startPage;
  var endPage;
  if(remain!=0){
    startPage=currentPage-remain+1;
	endPage=currentPage+groupCount-remain;
	if(endPage>totalPage)
	  endPage=totalPage;
  }else{
    startPage=currentPage-groupCount+1;
	endPage=currentPage;
  }
  if(startPage<=0)
    startPage=1;
  if(endPage<=0)
    endPage=1;

  // 页号
  sb.append("<li style='float:left'>");
  sb.append("<div style='padding:5px 12px'>");
  sb.append(currentPage);
  sb.append("/");
  sb.append(totalPage);
  sb.append("页,共");
  sb.append(total);
  sb.append("条</div>");
  sb.append("</li>");
  
 
  // 上一组
  sb.append("<li style='float:left;' title='上一组'");
  if(startPage>groupCount) {
    sb.append(" onClick='changePage(");
	
    var prevGroupSkip=(startPage-2)*count;
    if(prevGroupSkip<0)
      prevGroupSkip=0;
    sb.append(prevGroupSkip);
    sb.append(");'");
	sb.append(" onMouseOver='showhand(this);'");
  } // end if(page>groupCount)
  sb.append(">");
  sb.append("<span class='label label-info turn-page-active'><i class='fa fa-2x fa-arrow-circle-left'></i></span>");
  sb.append("</li>");

  // 上一页
  sb.append("<li style='float:left' title='上一页'");
  if(currentPage>1){
    sb.append(" onClick='");
    sb.append("changePage(");
	
    var prevskip=(currentPage-2)*count;
    if(prevskip<0)
      prevskip=0;
    sb.append(prevskip);
    sb.append(");'");
    sb.append(" onMouseOver='showhand(this);'");
  } // end if(page>1)
  sb.append("><span class='label label-info turn-page-active'><i class='fa fa-2x fa-arrow-circle-o-left'></i> </span>");
  sb.append("</li>");

  // 当前组页码
  for(var i=startPage;i<=endPage;i++){
    sb.append("<li");
    if(i==currentPage){
      sb.append(" class='active'");
 	}else{
      // 非当前页
      sb.append(" onClick='changePage(");
	
      sb.append((i-1)*count);
      sb.append(");'");
	  sb.append(" onMouseOver='showhand(this);'");
	}
	sb.append(">");
    sb.append("<span>");
    sb.append(i);
    sb.append("</span>");
    sb.append("</li>");
  } // end for(var i=startPage;i<=endPage;i++)
  
  // 下一页
  sb.append("<li style='float:left' title='下一页'");
  if(currentPage<totalPage) {
    sb.append(" onClick='");
    sb.append("changePage(");
	
	sb.append((currentPage*count));
    sb.append(");'");
	sb.append(" onMouseOver='showhand(this);'");
  }
  sb.append("><span class='label label-info turn-page-active'><i class='fa fa-2x fa-arrow-circle-o-right'></i> </span>");
  sb.append("</li>");

  // 下一组
  sb.append("<li style='float:left;' title='下一组'");
  if(endPage<totalPage) {
	sb.append(" onClick='");
    sb.append("changePage(");
	
    sb.append((endPage*count));
    sb.append(");'");
	sb.append(" onMouseOver='showhand(this);'");
  }
  sb.append("><span class='label label-info turn-page-active'><i class='fa fa-2x fa-arrow-circle-right'></i></span>");
  sb.append("</li>");

	elem.innerHTML=sb.toString();
}

function changePage(skip){
	$("#object_tbody").html("");
	showList(skip);
	showListTurn(skip);
}

function ipCountChange(){
	var ipBtn = document.getElementById("ipBtn");    
	ipBtn.style.background = "#8B8B00"; 
	//ipBtn.style.border="#D43F3A";
	var userBtn = document.getElementById("userBtn");    
	userBtn.style.background = "#CCC"; 
	userBtn.style.border="#999";
	$("#countType").html("IP地址");
}

function userCountChange(){
	var userBtn = document.getElementById("userBtn");    
	userBtn.style.background = "#8B8B00"; 
	//userBtn.style.border="#D43F3A";
	var ipBtn = document.getElementById("ipBtn");    
	ipBtn.style.background = "#CCC"; 
	ipBtn.style.border="#999";
	$("#countType").html("登录名");	
}

function clickOut(btnID){//按钮点击后凸起
	document.getElementById(btnID).style.borderRight= "1px groove buttonshadow";
	document.getElementById(btnID).style.borderBottom="1px groove buttonshadow";
	document.getElementById(btnID).style.borderLeft="1px groove buttonshadow";
	document.getElementById(btnID).style.borderTop="1px groove buttonshadow"; 
}
