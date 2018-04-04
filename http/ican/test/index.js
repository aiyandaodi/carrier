var EVERY_ROW_SHOW = 9;	//每行显示的个数
var currentPage;
var totalPage;
var count=7;
var mydata={};
var isContinueLoad = true;		//是否可以
var request = tek.common.getRequest();
function init(){
  //是否显示 新建试题按钮
//	if(myId&&myId>0)
//		$("#test-button").removeClass("hidden");
	
	getTestList(0);
 
}

//获取试卷列表
function getTestList(skip){
	var target = document.getElementById('test-list');
	if(!target)
		return;
		
	mydata["objectName"]="ExamsTest";
	mydata["action"]="getList";
	mydata["count"] = count;
	mydata["order"] = "exams_test_grade ASC";
	mydata["condition"]="exams_test_status=1";
	mydata["skip"] = skip;
	if(request["exams_test_grade"])
		mydata["exams_test_grade"]=request["exams_test_grade"];
		
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			$("#test-list").append("<div id='waiting-img' class='col-md-12 col-sm-12 center'><img style='margin-top:10px;' src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function(data) {
			//成功去除等待框
			$("#waiting-img").remove();
			
			if(data) {
				if(data.code==0){
					//判断权限显示按钮
					if(tek.right.isCanCreate(data.right)){
						$("#test-button").removeClass("hidden");
					}
					
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showTestList(record[i],target);
						}else{
								showTestList(record,target);
						}//end if(record.length)
					}//end if(record)
					
					// 显示翻页按钮
        			//showCustomListTurn(data);
					
					var total=parseInt(data.value);
					if(!total)
						total=0;
					currentPage = tek.turnPage.getCurrentPageNumber(skip,count);
					totalPage = tek.turnPage.getTotalPageNumber(total,count);
					if(currentPage<totalPage){
						isContinueLoad = true;
					}else{
						isContinueLoad = false;
					}
					
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(tek.dataUtility.stringToHTML(data.message));
					error.append("</font>");
					$("#test-list").html(error.toString());
				}//end if(data.code==0)
			}else{
            	$("#test-list").html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
	    	$("#test-list").html("<font color='red'>操作失败</font>");
        }
	});	
	
}	

function showTestList(record,target){
	if(record && target){
		var field;
		var html = "";
		
		html += "<div class='col-md-6 col-sm-12 col-xs-12 col-mob'>";
		html += "<div class='ui-item'>";
		
		html += "<div class='ui-last'></div>"
		     + "<div class='ui-middle'></div>"
		     + "<div class='ui-first'></div>";
		html += "<div class='ui-top'>";
		html += "<h3><a href='#'>";
		if(record.exams_test_name){
			field = record.exams_test_name;
			html += tek.dataUtility.stringToHTML(field.show ||'');
		}
		html += "</a></h3>";
		/*html += "<p>";
		if(record.exams_test_summary){
			field = record.exams_test_summary;
			html += tek.dataUtility.stringToHTML(field.show ||'');
		}
		html += "</p>";*/
		html += "<ul class='ul-circle'>";
		html +=	"<li>";
		if(record.exams_test_score){
			field = record.exams_test_score;
			html += field.display ||'';
			html += ":";
			html += tek.dataUtility.stringToHTML(field.show ||'');
		}
		html += "</li>";
		html += "<li>";
		if(record.exams_test_duration){
			field = record.exams_test_duration;
			html += field.display ||'';
			html += ":";
			html += getTimeBySecond(field.value);
		}
		html += "</li>";
		html +=	"<li>";
		html += "有效时间:";
		field = record.exams_test_start;
		if(field && field.show){
			html += field.show;
		}
		html += " - ";
		field = record.exams_test_end;
		if(field && field.show){
			html += field.show;
		}
		html += "</li>";
		html += "</ul>";
		html += "<div class='pull-right'>";
		html += "<a href='edit.html?exams_test_id="+record.id+"&group_id="; 
		field = record.exams_test_group;
		if(field && field.value){
			html += field.value;
		}
		html += "&refresh-opener=1&show-close=1' target='_blank' class='btn btn-warning'>编辑</a>";
		html +=	"<a href='javascript:void(0);' class='btn btn-success'";
		fieldmethod = record.exams_test_method;
		fieldjoin = record.join_status;
		if(fieldmethod && fieldmethod.value && fieldjoin && fieldjoin.value){
			if(fieldjoin.value==8 && fieldmethod.value==1)
				html += " disabled='disabled'";
			
			html += " onclick='startTest(\"";
			if(record.id){
				html += record.id;
			}
			html += "\");'>";
			if(fieldjoin.value==8 && fieldmethod.value>1)
				html += "重考";
			else
				html += fieldjoin.show||"";
		}
		html += "</a>";
		html += "</div>";
		html += "</div>";
		
		html += "</div>";
		html += "</div>";	
		
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',html);
	}
	
}

//转换时间
function getTimeBySecond(stringTime){
	if(!stringTime)
		return;
	
	var second = parseInt(stringTime);// 秒
	var minute = 0;// 分
	var hour = 0;// 小时
	// alert(theTime);
	if(second > 60) {
		minute = parseInt(second/60);
		second = parseInt(second%60);
		
		if(minute > 60) {
			hour = parseInt(minute/60);
			minute = parseInt(minute%60);
		}
	}
	
	var result = ""+parseInt(second)+"秒";
	
	if(minute > 0) {
		result = ""+parseInt(minute)+"分"+result;
	}
	if(hour > 0) {
		result = ""+parseInt(hour)+"小时"+result;
    }
	
	return result; 
}

/*开始考试*/
function addTest(){
	var url=new StringBuffer();
	url.append(tek.common.getRootPath());
	url.append("http/ican/test/add.html");
	url.append("?show-close=1");
	url.append("&refresh-opener=1");

	window.open(url.toString(), "_blank");	
}

/*开始考试*/
function startTest(test_id){
	if(!test_id)
		return;
		
	var url=new StringBuffer();
	url.append(tek.common.getRootPath());
	url.append("http/ican/paper/add.html?test_id=");
	url.append(test_id);
	//url.append("&show-close=1");
	url.append("&refresh-opener=1");

	window.open(url.toString(), "_blank");	
}

/*读取考试*/
function readTest(test_id,group_id){	
	if(!test_id)
		return;
		
	var url=new StringBuffer();
	url.append(tek.common.getRootPath());
	url.append("http/ican/test/read.html?test_id=");
	url.append(test_id);
	url.append("&group_id=");
	url.append(group_id);
	url.append("&show-close=1");
	url.append("&refresh-opener=1");

	window.open(url.toString(), "_blank");	
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
		
	count=mydata["count"];
	  
	if(!count){
		count=PAGE_COUNT;
		mydata["count"]=count;
	}
	
	count=parseInt(count);
	if(!count)
		count=0;
	
	var total=parseInt(data.value);
	if(!total)
		total=0;

    //显示页码html信息文本 
	elem.innerHTML = tek.turnPage.getPagination(skip,count,total);
  	
	currentPage = tek.turnPage.getCurrentPageNumber(skip,count);
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
}


//监听滚动条
$(window).scroll(function(){
	if(!isContinueLoad)
		return ;

	if(($(this).scrollTop() + 2) >= ($(document).height()-$(this).height())){
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		$("#more_page").addClass("hidden");
		changePage(null,(currentPage*count));
	}//end  if...
});

//下一页按钮，翻到下一页
function morePage(){
	if(currentPage<totalPage) {
		if(!$("#test-list").is(":visible"))
			$(".wminimize").click();
		
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		$("#more_page").addClass("hidden");
		changePage(null,(currentPage*count));
	}else{
		$("#ajax-load-div").removeClass("hidden");
		$("#more_page").addClass("hidden");
	}
}//end morePage()

function changePage(id, skip){
  mydata["skip"]=skip;
  getTestList(skip);
}