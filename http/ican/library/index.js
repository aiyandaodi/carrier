// JavaScript Document
/**************************************************
 *    题库首页面 library/index/index.js
 *
 *
 *
 **************************************************/
 //=====================================================Parameter=============================
var EVERY_ROW_SHOW = 9;	//每行显示的个数
var PAGE_COUNT = 9;
var skip;
var currentPage = 1;
var totalPage;
var COUNT=PAGE_COUNT;
var mydata={};
var isContinueLoad = true;		//是否可以
var request = tek.common.getRequest();
//=====================================================Function===============================
//---------------------------------------------题库-----------------------------------
function init(){
  	getLibrary(0);//加载题库
}

//加载题库
function getLibrary(skip){
	var target = document.getElementById('library-list');
	if(!target)
		return;
		
	var mydata = {};
	mydata["objectName"]="ExamsLibrary";
	mydata["action"]="getList";
	mydata["count"] = COUNT;
	mydata["skip"] = skip;
	mydata["order"] = "createTime";
	mydata["desc"] = 1;
	
	if(request["group_id"] && request["group_id"] != null)
		mydata["exams_library_group"] = request["group_id"];
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			$("#library-list").append("<div id='waiting-img' class='col-md-12 col-sm-12 center'><img style='margin-top:10px;' src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function(data) {
			//成功去除等待框
			$("#waiting-img").remove();
			
			if(data) {
				//判断创建权
				if (tek.right.isCanCreate(data.right))
					$("#library-button").removeClass("hidden");
					
				if(data.code==0){
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showLibraryList(record[i],target);
						}else{
								showLibraryList(record,target);
						}//end if(record.length)
					}//end if(record)
					
					// 显示翻页按钮
        			//showCustomListTurn(data);


        			var total=parseInt(data.value);
					if(!total)
						total=0;
					
					//显示页码html信息文本 
					//elem.innerHTML = tek.turnPage.getPagination(skip,count,total);
				  	
					currentPage = tek.turnPage.getCurrentPageNumber(skip,COUNT);
					totalPage = tek.turnPage.getTotalPageNumber(total,COUNT);
					console.log(currentPage)
					if(currentPage<totalPage){
						isContinueLoad = true;
						/*$("#more_page").removeClass("hidden");   //加载瀑布流完成后显示下一页按
						$("#ajax-load-div").addClass("hidden");*/
					}else{
						isContinueLoad = false;
						/*$("#more_page").addClass("hidden"); 
						$("#ajax-load-div").addClass("hidden");*/
					}

				}else{
					$("#library-list").html("<span class='text-muted center'>" + data.code + "-" + data.message + "</span>");
				}//end if(data.code==0)
			}else{
            	$("#library-list").html("<span class='text-muted center'>操作失败![data=null]</span>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
	    	var error = "操作失败![" + request.status + " - " + (request.response || request.statusText) + "]";
			$("#library-list").html("<span class='text-muted center'>" + error.toString() + "</span>");
        }
	});	
	
}	

//显示题库列表
function showLibraryList(record,target){
	if(record && target){
		var field;
		var html = "";
		
		html += "<div class='col-md-6 col-sm-12 col-xs-12 col-mob'>";
		html += "<div class='ui-item'>";
		html += "<div class='ui-last'></div>";
		html += "<div class='ui-middle'></div>";
		html += "<div class='ui-first'></div>";
		html += "<div class='ui-top'>";
		html += "<h3>";
		html += "<a href='javascript:;'  onclick='readLibrary(\"";
		if(record.id){
			html += record.id;
		}
		html += "\");'>";
		if(record.name){
			html += record.name;
		}
		html += "</a>";
		html += "</h3>";
		
		html += "</div>";
		html += "<div class='ui-hover' onclick='readLibrary(\"";
		if(record.id){
			html += record.id;
		}
		html += "\");'>";
		html += "<div class='ui-hcontent'>";
		html += "<ul class='ul-circle'>";
		html += "<li>";
		if(record.exams_library_grade){
			field = record.exams_library_grade;
			html += field.display;
		    html += "：";
			html += tek.dataUtility.stringToHTML(field.show || '');
	    }
		html += "</li>";
		html += "<li>";
		if(record.exams_library_group){
			field = record.exams_library_group;
			html += field.display;
		    html += "：";
			html += tek.dataUtility.stringToHTML(field.show || '');
	    }else{
			html += "系统题库";	
		}
		html += "</li>";
		html += "<li>";
		if(record.exams_library_end){
			field = record.exams_library_end;
			html += field.display;
		    html += "：";
			html += tek.dataUtility.stringToHTML(field.show || '');
	    }
		html += "</li>";
		html += "</ul>"; 
		html += "</div>";
		html += "</div>";
		html += "</div>";
		html += "</div>";
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',html);
	}
}

//显示题库列表
function showLibraryList1(record,target){
	if(record && target){
		var field;
		var sb=new StringBuffer();
		sb.append("<div class='col-md-4 container-fluid'>");
	    sb.append("<div class='ui-item'>");
		sb.append("<div class='ui-content'>");
		sb.append("<h3>");
		sb.append("<a href='#'  onclick='readLibrary(\"");
		if(record.id)
			sb.append(record.id);
		sb.append("\");'>");
		if(record.name)
			sb.append(record.name);
		sb.append("</a>"); 
		sb.append("<span class='pull-right library-item library-owner'><i class='fa fa-user'></i> ");
		field = record.exams_library_owner;
		if(field && field.show)
			sb.append(field.show);
		sb.append("</span>");
		sb.append("</h3>");
		sb.append("<div class='row'>");
		sb.append("<div class='col-md-12 col-sm-12'>");
		sb.append("<span class='library-item'>难度");
		field = record.exams_library_grade;
		if(field && field.show){
			sb.append(field.display);
		    sb.append("<span class='red'>");
			sb.append(field.show);
		    sb.append("级</span>");
	    }
		sb.append("</span>");
		sb.append("</div>");
		sb.append("<div class='col-md-12 col-sm-12'>");
		sb.append("<span class='library-item'>");
		field = record.exams_library_group;
		if(field && field.show){
			sb.append(field.display);
		    sb.append("<span class='red' title='");
			sb.append(field.show);
			sb.append("'>");
		    sb.append("<a href='javascript:;' onclick='readGroup(\"");
			sb.append(field.value);
		     sb.append("\")'>");
			var group_name = field.show || "";
			if(group_name && group_name.length > 17)
				sb.append(group_name.substring(0,14)+"...");
			else
				sb.append(group_name);
			sb.append("</a></span>");
        }else{
			sb.append("<span class='red' title='");
			sb.append("' style='margin-left: 0px;'>");
			sb.append("系统题库");
			sb.append("</span>");
		}
		sb.append("</span>");
		sb.append("</div>");
		sb.append("<div class='col-md-12 col-sm-12'>");
		sb.append("<sapn class='library-item'>");
		field = record.exams_library_end;
		if(field && field.show){
			sb.append(field.display);
			sb.append("<span class='red'>");
			sb.append(field.show);
			sb.append("</span>");
	    }
		sb.append("</span>");
		sb.append("</div>");
		sb.append("</div>");
		sb.append("</div>");
		sb.append("</div>");
		sb.append("</div>");
					  
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());		
	}
}


/*读取小组*/
function readGroup(groupId){
	var url=tek.common.getRootPath()+
	"http/takall/group/read.html?group_id="+groupId;

	window.open(url, "_blank");
}

/*读取题库*/
function readLibrary(exams_library_id){
	if(!exams_library_id)
		return;
		
	var url=tek.common.getRootPath()+"http/ican/library/read.html?exams_library_id="+exams_library_id+"&show-close=1&refresh-opener=1";

	window.open(url, "_blank");
}

/*添加题库*/
function addLibrary(){
	var url=tek.common.getRootPath()+
	"http/ipassin/library/add.html?"+
	"show-close=1&refresh-opener=1"+
    "&refresh-opener-func=refreshSubject";
	if(request["group_id"] && request["group_id"] != null){
		url = url+"&group_id="+group_id;
	}

	window.open(url, "_blank");
}

/************************************************瀑布流*************************************/
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
	
	var skip=mydata["skip"];
	if(!skip){
		skip=0;
		mydata["skip"]=skip;
	}
	skip=parseInt(skip);
	if(!skip)
		skip=0;
		
	/*COUNT=mydata["count"];
	  
	if(!COUNT){
		COUNT=PAGE_COUNT;
		mydata["count"]=COUNT;
	}*/
	
	COUNT=parseInt(COUNT);
	if(!COUNT)
		COUNT=0;
	
	var total=parseInt(data.value);
	if(!total)
		total=0;
	
	//显示页码html信息文本 
	elem.innerHTML = tek.turnPage.getPagination(skip,count,total);
  	
	//currentPage = tek.turnPage.getCurrentPageNumber(skip,count);
	totalPage = tek.turnPage.getTotalPageNumber(total,count);

	if(currentPage<totalPage){
		isContinueLoad = true;
		$("#more_page").removeClass("hidden");   //加载瀑布流完成后显示下一页按
		$("#ajax-load-div").addClass("hidden");
	}else{
		isContinueLoad = false;
		$("#more_page").addClass("hidden"); 
		$("#ajax-load-div").addClass("hidden");
	}
	//刷新瀑布流显示
	//setTimeout("flowFlushDisplay()", 500);
}


//监听滚动条
$(window).scroll(function(){
	if(!isContinueLoad){
		return ;
	}
	if(($(this).scrollTop() + 2) >= ($(document).height()-$(this).height())){
		//根据需要在此做些什么
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		//$("#more_page").addClass("hidden");

		changePage(null,(currentPage*COUNT));

	}
});

//下一页按钮，翻到下一页
function morePage(){
	if(currentPage<totalPage) {
		if(!$("#library-list").is(":visible"))
			$(".wminimize").click();
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		$("#more_page").addClass("hidden");
		changePage(null,(currentPage*COUNT));
	}else{
		$("#ajax-load-div").removeClass("hidden");
		$("#more_page").addClass("hidden");
	}
}

function changePage(id, skip){
 	// mydata["skip"]=skip;
  	getLibrary(skip);
  	
}// JavaScript Document