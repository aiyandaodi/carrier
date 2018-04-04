// JavaScript Document
/**************************************************
 *	操作记录主页面 index.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================
var page;
var current=1;
var total=0;
var updatepage=0;
var searchModel=0;
var maxCount=5;
var maxPage=5;//每屏幕显示页码数
var fromPage=1;
var endPage=5;
var selected=new Array();    //选中的对象标识
var allIds=new Array();    //当前页的所有对象标识
	
//=====================================================Function===============================	
function init(){	
	if(myId && myId > 0){
		showMessage("显示操作记录");
		showTarget = document.getElementById("object_records");
		if(showTarget)
			listRecord (null,true,0,maxCount);
		else
			showError("没有定义显示空间，无法显示帐号列表信息！");
	}else{
		showMessage("用户没有登录");
		login();
	}	
}

//点击换页
function change(mark,searchModel,elem){
	if(mark=="Pre") current--;
	else if(mark=="Next") current++;
	else current=parseInt(mark);
	
	if(current==fromPage-1){
		if(current!=0&&fromPage>=1){
			if((endPage-fromPage) != 4) {
				endPage = current;
				fromPage = endPage-maxPage+1;
			}else{
				fromPage--;
				endPage--;
			}
			
			showpagebutton(fromPage,endPage);
		}//end if(current!=0)
	} else {
		if(current==endPage+1){
			if(current!=(page+1)&&endPage<=page){
				fromPage++;endPage++;
				showpagebutton(fromPage,endPage);
			}//end if(current!=0)
			
			current=endPage;
		}
	}
	
	if(searchModel==1)
		quickSearch(null,false,(current-1)*maxCount,maxCount);
	else
		listRecord(null,true,(current-1)*maxCount,maxCount);
}


//显示页码按钮
function showpagebutton(fromPage,endPage){
	var pagestr=new StringBuffer();
	//src="../images/view-sort-ascending.png"
	$("#page").html("");
	pagestr.append("<li style='float:left' onClick=");
	pagestr.append("quickChange('Pre',");
	pagestr.append(searchModel);// 
	pagestr.append(",event)><img height='25px' src='");
	pagestr.append(tek.common.getRootPath());
	pagestr.append("http/images/prev-pages.png'  /></li>");
	pagestr.append("<li style='float:left' onClick=");
	pagestr.append("change('Pre',");
	pagestr.append(searchModel);// 
	pagestr.append(",event)><img height='25px' src='");
	pagestr.append(tek.common.getRootPath());
	pagestr.append("http/images/go-prev.png'  /></li>");
	
	var j;
				
	for(j=fromPage;j<=endPage;j++){
		pagestr.append("<li onClick=change("); 
		pagestr.append(j); pagestr.append(",");
		pagestr.append(searchModel);
		pagestr.append(",event)><a id='a");
		pagestr.append(j);
		pagestr.append("'  href='#'>");
		pagestr.append(j);
		pagestr.append("</a></li>");
	}
		
	pagestr.append("<li style='float:left' onClick=");
	pagestr.append("change('Next',");
	pagestr.append(searchModel);
	pagestr.append(",event)><img height='25px' src='");
	pagestr.append(tek.common.getRootPath());
	pagestr.append("http/images/go-next.png'  /></li>");
	pagestr.append("<li style='float:left' onClick=");
	pagestr.append("quickChange('Next',");
	pagestr.append(searchModel);
	pagestr.append(",event)><img height='25px' src='");
	pagestr.append(tek.common.getRootPath());
	pagestr.append("http/images/next-pages.png'  /></li>");
	  
	$("#page").append(pagestr.toString());
		
}

//点击快速换页
function quickChange(mark,searchModel,elem){
	if(mark=="Pre"){
		current=fromPage-maxPage;
		fromPage=fromPage-maxPage;
		endPage=endPage-maxPage;
	}else if(mark=="Next"){
		current=endPage+1;
		fromPage=fromPage+maxPage;
		endPage=endPage+maxPage;
	} 
	
	if(fromPage<=0)fromPage=1;
	if(endPage<=0)endPage=fromPage+maxPage-1;
	if(endPage>=page)endPage=page;
	if(fromPage>=page)fromPage=endPage-maxPage+1;
	if(fromPage<=0)fromPage=1;
	if(current<=0){current=1;fromPage=1;}
	if(current>=page){current=page;endPage=page;}
	
	
	if(searchModel==1)
		quickSearch(null,false,(current-1)*maxCount,maxCount);
	else
		listRecord(null,true,(current-1)*maxCount,maxCount);
	
	if(fromPage>endPage) fromPage=current;
	
	if((endPage-fromPage) != 4) {
		if(endPage != page)
			endPage=fromPage+maxPage-1;	
	}

	showpagebutton(fromPage,endPage);
}
		
//响应分页处理
function listRecord (list_order,list_desc,list_skip,list_count){
	
	if(!list_order || list_order.length<1)
		list_order="record_time";
	
	if(!list_desc)
		list_desc=false;
	
	if(!list_skip)
		list_skip=(current-1)*maxCount;
	
	if(!list_count || list_count==0)
		list_count=maxCount;
	
	var params={};    //Ajax取得列表信息的调用参数
    var key=new Array();
    key.push("record_");
    key.push("skip");
    key.push("order");
    key.push("desc");
    params=getRequestParams(key,request,params,true);
    params["objectName"]="ObjectRecord";
    params["action"]="getList";
    params["order"]=list_order;
    params["desc"]=list_desc;
    params["skip"]=list_skip;
    params["count"]=list_count;
	
	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		//async:true,
		data: params,
		error: function(request) {
			var sb=new StringBuffer();
			sb.append("读取帐号列表失败!");
			if(request){
				sb.append(" - ");
				sb.append(request.status);
				sb.append(" : ");
				sb.append(request.response);
			}
			showError(sb.toString());
		},
		success: function(data) {
			if (data.code==0){
				var record=data["record"];

				if (record){
					$("#operationRecord").html("");	
					allIds.length=0;

					if(record.length){
						
						for(var i in record){
							showRecord(record[i]);
						} 
						// end for(var i in record)

					}else{
						showRecord(record);
					} //end if if(record.length) else
					
					if(parseInt(total)<=0||updatepage) {
						total=data.value;
						page=Math.ceil(total/maxCount);
						if(page<maxPage)endPage=page;
						showpagebutton(fromPage,endPage);
						updatepage=0;
					}
				} //end if (record)
				else{
					showMessage("没有搜索到符合条件的记录");
				}
				
				$("#page li a").attr("style","");
				var selectedId="#a"+current;
				$(selectedId).attr("style","background-color:#EEEEEE !important;");
		
			}else{
				showError(data.code+data.message);
			} //end if (data.code==0) else
		}
	});	
}
	
//显示记录
function showRecord(record){
	var sb=new StringBuffer();
	if(record){
		sb.append("<li><h6><a target='_blank' href='");
		sb.append(tek.common.getRootPath());
		sb.append("http/tekinfo/record/read.html?record_id=");
		sb.append(record.id);
		sb.append("'>");
		sb.append(record.record_object.show);
		sb.append("</a></h6><p>")
		sb.append(record.record_time.show); 
		sb.append("&nbsp&nbsp");
		sb.append(record.record_user.show);
		sb.append("&nbsp&nbsp&nbsp&nbsp");
		sb.append(record.record_name.show);
		sb.append("</p>");
		
		sb.append("<p>操作命令：");
		sb.append(record.record_command.show);
		sb.append("&nbsp&nbsp</p>");
		
		sb.append("<p class='record-os-label'>操作平台：");
		if (record.record_os) {
          var array=stringToArray(record.record_os.show,";");
		  if(array&&array.length>=3){
		    if(array[0]){
		      sb.append("<span class='label label-warning'>");
		      sb.append(array[0]);
			  sb.append("</span>");
		    }
		    if(array[1]){
			  sb.append("<span class='label label-success'>");
			  sb.append(array[1]);
			  sb.append("</span>");
		    }
		    if(array[2]){
			  sb.append("<span class='label label-info'>");
			  sb.append(array[2]);
			  sb.append("</span>");
		    }
		  }
		} 
		sb.append("&nbsp&nbsp</p>");
		
		sb.append("<p>操作内容：");
		sb.append(record.record_name.show);
		sb.append("</p></li>")

		$("#operationRecord").append(sb.toString());
  	}else{
		$("#operationRecord").html("搜索结果为空！");
	} //end if(record)else
}

//-------------------------------------------------------End------------------------------------------------------------------
