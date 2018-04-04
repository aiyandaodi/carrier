// JavaScript Document
/**************************************************
 *	操作记录主页面 index.js
 *	
 *	
 *	
 **************************************************/
 /*
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
	pagestr.append(",event)><img height='25px' src='../../../images/prev-pages.png'  /></li>");
	pagestr.append("<li style='float:left' onClick=");
	pagestr.append("change('Pre',");
	pagestr.append(searchModel);// 
	pagestr.append(",event)><img height='25px' src='../../../images/go-prev.png'  /></li>");
	
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
	pagestr.append(",event)><img height='25px' src='../../../images/go-next.png'  /></li>");
	pagestr.append("<li style='float:left' onClick=");
	pagestr.append("quickChange('Next',");
	pagestr.append(searchModel);// 
	pagestr.append(",event)><img height='25px' src='../../../images/next-pages.png'  /></li>");
	  
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
	

	//alert("list_order="+list_order);
	//alert("list_desc="+list_desc);
	//alert("list_count="+list_count);
	//alert("list_skip="+list_skip);
	$.ajax({
		type: "post",
		url: "../../../servlet/tobject",
		dataType: "json",
		//async:true,
		data: {
			objectName:"ObjectRecord",
			action:"getList",
			
			order:list_order,
			desc:list_desc,
			skip:list_skip,
			count:list_count
		},
		error: function(request) {
			//alert(url);
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
			//alert(JSON.stringify(data));
			//alert("data.value="+data.value);
			if (data.code==0){
				var record=data["record"];
				//alert("record="+record);
				if (record){
					$("#operationRecord").html("");	
					allIds.length=0;
					//alert("record.length="+record.length);
					if(record.length){
						
						for(var i in record){
							showRecord(record[i]);
					
						} 
						// end for(var i in record)
						//alert("hahddd"+allIds.length);
					}else{
						showRecord(record);
						//allIds.push(record.id);
					} //end if if(record.length) else
					
					if(parseInt(total)<=0||updatepage) {
						//alert("showpagebutton");
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
				//alert(selectedId);
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
		sb.append("<li><h6><a target='_blank' href='../../../record/read/?record_id=");
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
*/



// JavaScript Document
var total = 0;									//记录总条数
var EVERY_ROW_SHOW = 5;	//每行显示的个数
var currentPage;
var totalPage;
var total = 0;									//记录总条数
var IS_SCROLL = false;							//判断是否是滚
var Arrow = false;                              //判断排序箭头
var desc;
var order;

function init(){
	//当前浏览器为手机浏览器时隐藏列表切换按钮
	if(document.body.clientWidth>400)
	{
		$("#index-list").css("display","block");
	}		 
	
    $("#table-columns").html("");
	$("#ajax-load-div").addClass("hidden");
	var sb=new StringBuffer();
	var tableList=document.getElementById("list-table");
	sb.append("<div class='subject-content' id='table-infos'  style='margin-top:30px;'>");
	sb.append("</div>");
	tableList.insertAdjacentHTML('afterEnd',sb.toString());
	desc = 1;
	order = "record_time";
		
	if(myId && myId > 0){
		showTarget = document.getElementById("object_records");
		if(showTarget){
			initParams();
    		getList();
		}
	}else{
		showMessage("用户没有登录");
		login();
	}	
}

//下一页按钮，翻到下一页
function morePage(){
	if(currentPage<totalPage) {
		changePage(null,(currentPage*params["count"]));
		//alert(nowPage);
		$("#more_page").addClass("hidden");
	}else{	
		$("#ajax-load-div").removeClass("hidden");
		$("#more_page").addClass("hidden");
	}
}//end morePage()

/**
 * 添加列数据
 *
 * @param field
 *           列数据
 * @param record
 *           信息
 * @param data
 *           信息
 * @param sb
 *           标签字符串
 */
function appendCustomListField(field,record,data,sb) {
  if(!field || !record || !data || !sb)
    return;
  
  var fieldName=field.name;
  if(!fieldName)
    return;

  var show=field.show;
  if(!show)
    show="";

  if(fieldName=="user_online"){
	var status=field.value;
	if(status==0x20){
      sb.append("<span class='label label-success'>");
      sb.append(show);
      sb.append("</span>");
	} else {
      sb.append("<span class='label label-danger'>");
      sb.append(show);
      sb.append("</span>");
	}

  } else {
	// 普通列数据
    appendDefaultListField(field,record,data,sb);
  } // end else
}

//查看对象记录
function readRecord(record_id){
  window.open("../read/index.html?record_id="+record_id+"&show-close=1&refresh-opener=1");
}

/**
 * 列表形式显示数据
 *
 * @param records
 *           检索所有数据
 * @param data
 *           检索结果
 */
function showCustomListRecords(records,data) {
	if(!records){
	     $("#table-infos").html("");
		 document.getElementById("table-infos").style.height = 0 + 'px';
		 $("#table-msg").html("没有数据!");
		 $("#more_page").addClass("hidden"); 
		 $("#ajax-load-div").addClass("hidden");
		 return;
	}
	
    /*// 1、设置列名行
	if(records.length) {
	    // 多条数据
		showCustomListColumns(records[0]);
    }else{
        // 一条数据
        showCustomListColumns(records);
	}

	// 2、设置排序
	for(var i in columns) {
		var elem=document.getElementById("img_"+columns[i]);
		if(!elem)
			continue;
		if(params["order"]==columns[i]){
			elem.style.display="";
	
			var desc=params["desc"];
			if(desc==1 || desc=="1" || desc=="true" || desc==true)
	 			elem.src=dascendingPath;
			else
	  			elem.src=ascendingPath;  
		}else
		elem.style.display="none";
	} // end for(var i in columns)
*/
	// 3、设置数据
	var elem=document.getElementById("table-infos");
	
	if(!elem)
		return;
	//显示索引
	showSubject(records,elem);
	showWarterFlow();	//瀑布流
	//setTimeout("showWarterFlow()",100);
	IS_SCROLL = false;
	
}

//显示数据
function showSubject(records,elem){
	if(records){
		if(records.length){
			var isLastRecord = false;
			for(var i in records){
				if(i == parseInt(records.length)-1)
					isLastRecord = true;
				showSubjectIndex(records[i],elem,parseInt(i),isLastRecord);
			} //end for(var i in records)
		}else{
			showSubjectIndex(records,elem,0,true);
		}  //end else
	}//end if(records)						 				
}

//显示瀑布流
function showSubjectIndex(record,target,index,isLastRecord){
	if(record){
		var id=record.id;
		if(!id)
			id="";
		var name=record.name;
		if(!name)
			name="";
		var sb = new StringBuffer();
		sb.append("<div id='changeline' class='subject-content-col col-md-4 col-sm-4' style='left:"+(index*300)+"px;'>");
		sb.append("<div class='widget-head' style='cursor: pointer' onClick='javascript:readRecord(\"");
  		sb.append(id);
  		sb.append("\");'>");
		sb.append("<a href='#'>");
		//显示操作对象
		var object=record.record_object.show;
		if(!object)
			object="";
		sb.append(object);
		
		sb.append("   -   ");
		//显示操作命令
		var command = record.record_command.show;
		if(!command)
			command="";
		sb.append(command);
		sb.append("</a>");
		sb.append("</div>");
		
		sb.append("<h6 >");
		//显示操作者
		var user=record.record_user.show;
		if(!user)
			user = "";
		sb.append("<div class='row record_model'>");
		sb.append("<div class='col-xs-4 col-md-4 record_model_by'>");
		sb.append("操作者：");
		sb.append("</div>");
		sb.append("<div class='col-xs-8 col-md-8 record_model_name'>");
		sb.append(user);
		sb.append("</div>");
		sb.append("</div>");
		//sb.append("<br/>");
		//显示操作时间
		var time;
		if(record.record_time)
			time = record.record_time.show;
		if(!time)
			time = "";
		sb.append("<div class='row record_model'>");
		sb.append("<div class='col-xs-4 col-md-4 record_model_by'>");
		sb.append("操作时间：");
		sb.append("</div>");
		sb.append("<div class='col-xs-8 col-xs-8 col-md-8 record_model_name'>");
		sb.append(time);
		sb.append("</div>");
		sb.append("</div>");
		//显示操作系统
		//var os = record.record_os.show;
		var array;
		if(record.record_os)
			array=stringToArray(record.record_os.show,";");
		//os.toString();	
		//if(os){ 
			//var osArr = os.split(";");
		if(array&&array.length>=3){
			sb.append("<div class='row record_model'>");
			sb.append("<div class='col-xs-4 col-md-4 record_model_by'>");
			sb.append("操作设备：");
			sb.append("</div>");
			sb.append("<div class='col-xs-8 col-md-8 record_model_name'>");
			sb.append(array[0]);
			sb.append("</div>");
			sb.append("</div>");
			sb.append("<div class='row record_model'>");
			sb.append("<div class='col-xs-4 col-md-4 record_model_by'>");
			sb.append("操作系统：");
			sb.append("</div>");
			sb.append("<div class='col-xs-8 col-md-8 record_model_name'>");
			sb.append(array[1]);
			sb.append("</div>");
			sb.append("</div>");
			sb.append("<div class='row record_model'>");
			sb.append("<div class='col-xs-4 col-md-4 record_model_by'>");
			sb.append("浏览器：");
			sb.append("</div>");
			sb.append("<div class='col-xs-8 col-md-8 record_model_name'>");
			sb.append(array[2]);
			//sb.append("asdfhasjkfdhaskfjasdkfjas;fjsadlfjaslfjsa;lfjasfhaklhjafakjsfajflksa;jfslkj");
			sb.append("</div>");
			sb.append("</div>");
		}
		//显示来源ip
		var ip;
		if(record.record_ip)
			ip = record.record_ip.show;
		if(!ip)
			ip = "";
		sb.append("<div class='row record_model'>");
		sb.append("<div class='col-xs-4 col-md-4 record_model_by'>");
		sb.append("IP地址：");
		sb.append("</div>");
		sb.append("<div class='col-xs-8 col-md-8 record_model_name'>");
		sb.append(ip);
		sb.append("</div>");
		sb.append("</div>");
		var longitude;
		if(record.record_longitude)
			longitude = parseInt(record.record_longitude.show);
		var latitude;
		if (record.record_latitude)
			latitude = parseInt(record.record_latitude.show);
		var height;
		if (record.record_height)
			height = parseInt(record.record_height.show);

		if(longitude == 0)
			longitude = "";
		if(latitude == 0)
			latitude = "";
		if(height == 0)
			height = "";
		if(longitude&&latitude&&height)
		{
			sb.append("<div style='margin-left:5px;padding-left:10px;'>");
			sb.append("经度："+longitude+"  "+"纬度："+latitude+"  "+"高度："+height);
			sb.append("</div>");
		}
		sb.append("</h6>")
		  
		if(isLastRecord){
			showWarterFlow();//显示瀑布流
			} //end if(isLastRecord)
		sb.append("<div class='widget-foot text-right'>");
		var device;
		if (record.record_device)
			device = record.record_device.show;
		//var device = "mobile phone";
		
		if(!device)
			device = "";
		sb.append(device);
		sb.append("</div>");
		sb.append("<div class='clearfix'></div>");
		sb.append("</div>");
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
	}//end if(record)
}

/**
 * 按order列排序。
 *
 * @param order
 *           排序字段名
 */
/*function changeCustomOrder(changeOrder){
	if(params["order"]==changeOrder){
		var oldDesc=params["desc"];
		if(oldDesc==1 || oldDesc=="1" || oldDesc==true || oldDesc=="true")
			params["desc"]=0;
		else
			params["desc"]=1;
	}else
		params["desc"]=0;
	
	if(changeOrder){
		params["order"]=changeOrder;
		//order=changeOrder;
		//desc=params["desc"];
	}
	
	
	for(var i in columns){
		if(changeOrder == columns[i]){
			//$("#"+columns[i]+"_arrowdown").removeClass("hidden");
			if(Arrow == true){
				$("#"+columns[i]+"_arrowdown").addClass("hidden");
				$("#"+columns[i]+"_arrowup").removeClass("hidden");
				Arrow = false;
			}else{
				$("#"+columns[i]+"_arrowup").addClass("hidden");
				$("#"+columns[i]+"_arrowdown").removeClass("hidden");
				Arrow = true;
			}
		}  //end if(changeOrder == columns[i])
		else{
			$("#"+columns[i]+"_arrowdown").addClass("hidden");
			$("#"+columns[i]+"_arrowup").addClass("hidden");
		}
	}   //end for(var i in columns)

	
	
	params["skip"]=0;
	
	$("#table-infos").html("");
	getList();
}*/


/**
 * 显示默认的列表翻页按钮
 *
 * @param data
 *           检索结果
 */
function showCustomListTurn(data) {
	var elem=document.getElementById("page");
	if (!elem)
	 	return;
	
	elem.innerHTML="";
	
	var skip=params["skip"];
	if(!skip){
		skip=0;
		params["skip"]=skip;
	}
	skip=parseInt(skip);
	if(!skip)
		skip=0;
	
	var count=params["count"];  
	if(!count){
		count=PAGE_COUNT;
		params["count"]=count;
	}
	count=parseInt(count);
	if(!count)
		count=0;

	var total=parseInt(data.value);
	if(!total)
		total=0;
	  
	var sb=new StringBuffer();
	
	currentPage=Math.floor(skip/count)+1;    // 当前页号
	totalPage=Math.floor(total/count);    // 总页数
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
	elem.innerHTML=sb.toString();  
	if(currentPage<totalPage){
		$("#more_page").removeClass("hidden");   //加载瀑布流完成后显示下一页按
		$("#ajax-load-div").addClass("hidden");
	}else{
		$("#more_page").addClass("hidden"); 
		$("#ajax-load-div").addClass("hidden");
	}  
}

/**
 *刷新按钮对应的函数，刷新页面中的数据
 *
 */
 /*
function refreshRecord(){
  params["skip"]=0;
  $("#table-infos").html("");
  getList();
}
*/

//监听滚动条
$(window).scroll(function(){
	if (IS_SCROLL)
		return ;
		
	if(($(window).scrollTop() + 10  )>= ($(document).height()-$(window).height())){
		window.scrollTo(0,parseInt($(window).scrollTop())-20);
		
		if(params["skip"] >= total && total > 0){
			stopLoad();
			return ;	
		}
		
		IS_SCROLL = true;	//滚动加载
		//MY_TURN_PAGE.change("Next",null);	//下一页
		//document.getElementById("Next").onclick(); 
		if(currentPage<totalPage) {
			changePage(null,(currentPage*params["count"]));
			$("#more_page").addClass("hidden");
		}else{	
			$("#ajax-load-div").removeClass("hidden");
			$("#more_page").addClass("hidden");
		}
		//morePage();
	}//end  if...
});
