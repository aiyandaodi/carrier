// JavaScript Document
 
 var objectName = new Array; 
 var i=0;

function init(){
	showOpenClass("object");
	showSubClass("object_list");

	//showMessage("显示帐号列表");
	var table = document.getElementById("objects_table");
	if(table){
		listRecord();
	}else{
	    showError("没有定义表格，无法显示帐号列表信息！");
	}
  //$("#select0").removeAttr("checked");
}

		
//响应分页处理
function listRecord() {
	var html=new StringBuffer();
    html.append("<div class='center'><img src='");
    html.append(tek.common.getRootPath());
    html.append("http/images/waiting-small.gif'/> 正在获取数据...</div>");
    $("#table-msg").html(html.toString());
	
	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/sys",
		dataType: "json",
		//async:true,
		data: {
			action:"getObjectNames",	
		},
		error: function(request) {	
			var error=new StringBuffer();
			error.append("<font color='red'>");
			error.append("读取对象失败[");
			error.append(request.status);
			error.append(" - ");
			error.append(request.responseText);
			error.append("]");
			error.append("</font>");
			$("#table-msg").html(error.toString());
		},
		success: function(data) {
			if(data){
				if (data.code==0){
					$("#table-msg").html("");
					var objectNames=data.value;

					if (objectNames){
						$("#object_tbody").html("");	
						objectName = objectNames.split(";");

						if(objectName.length){
							objectNameSort=objectName.sort()
							for(var i in objectNameSort){
								showName(objectNameSort[i]);
							} // end for(var i in objectNameSort)
						}//end if(objectName.length)
						else{
							showName(objectNameSort);
						} //end if if(record.length) else
						
						if(parseInt(data.value)<=0) {
							page=Math.ceil(total);
							if(page<maxPage)endPage=page;
							showpagebutton(fromPage,endPage);
						}
					} //end if (objectNames)
					else{
						$("#table-msg").html("没有数据!");
					}//end if (objectNames) else
					
					$("#page li a").attr("style","");
					var selectedId="#a"+current;
					$(selectedId).attr("style","background-color:#EEEEEE !important;");
			
				}//end if (data.code==0) else
				else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append("[");
					error.append(data.code);
					error.append(" - ");
					error.append(data.message);
					error.append("]");
					error.append("</font>");
					$("#table-msg").html(error.toString());
				} //end if (data.code==0) else
			}//end if(data)
			else{
				 $("#table-msg").html("<font color='red'>操作失败![data=null]</font>");
			}//end if(data) else
		}//end success: function(data)
	});	
}

var key = new Array();
var value = new Array();

function showName(objectName){
	var sb=new StringBuffer();
	if(objectName){
		var loc=objectName.indexOf("=");
        if(loc>0){
			var v1=objectName.substring(0, loc);
			var v2=objectName.substring(loc+1);
			key.push(v1);
			value.push(v2);
        }
		sb.append("<tr id='");
		sb.append(v1);
		sb.append("-show'><td id='");
		sb.append(v1);
		sb.append("'>");
		
		sb.append("<a href='obj.html?objectName=");
		sb.append(v1);
		sb.append("'>");
		sb.append(v1);
		sb.append("</a>")
		sb.append("</td><td>");
		sb.append(v2);
		sb.append("</td></tr>")
		$("#object_tbody").append(sb.toString());
		
  	}else{
		$("#object_tbody").html("没有数据！");
	} //end if(record)else
}

function myRefresh(){	
	key.length=0;
	value.length=0;
	init();
} 

/**
 * 判断输入字符，“回车”自动检索
 */
function inputEnter(evt) {
	evt = evt ? evt : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
	var key = evt.keyCode ? evt.keyCode : evt.which;
	if (key == 13) {
		quickSearch();
		if(window && window.event && window.event.returnValue)
			window.event.returnValue=false;
	}
	if (evt && evt.stopPropagation)
		evt.stopPropagation();
	else if(window && window.event && window.event.cancelBubble)
		window.event.cancelBubble=true;
}

//快速检索函数		  
function quickSearch(){
	 var quickSearchValue = document.getElementById("quickSearchKey").value;
	 quickSearchValue=quickSearchValue.trim();//去除搜索关键字中的空格
	 if(!quickSearchValue||quickSearchValue=="")searchModel=0;
	 else searchModel=1;
	 var j=0;

	if(searchModel){
		$("#object_tbody").html("");
		for(var i in key){
			if(key[i].toLowerCase().search(quickSearchValue.toLowerCase())== -1&&value[i].search(quickSearchValue)== -1){
				$("#"+key[i]).hide();
				$("#"+key[i]+"-show").hide();
			}//end if(key[i].toLowerCase().search(quickSearchValue.toLowerCase())== -1&&value[i].search(quickSearchValue)== -1)
			else{
				var sb1=new StringBuffer();
				var loc1=key[i].toLowerCase().indexOf(quickSearchValue.toLowerCase());
				var loc2=value[i].indexOf(quickSearchValue);
				if(loc1>=0){
					j++;
					sb1.append("<tr id='");
					sb1.append(key[i]);
					sb1.append("-show'><td id='");
					sb1.append(key[i]);
					sb1.append("'>");
					sb1.append("<a href='obj.html?objectName=");
					sb1.append(key[i]);
					sb1.append("'>");
					sb1.append(key[i].substring(0, loc1));
					sb1.append("<font color='#FF0000'>");
					sb1.append(key[i].substring(loc1, loc1 + quickSearchValue.length));
					sb1.append("</font>");
					sb1.append(key[i].substring(loc1 + quickSearchValue.length));
					sb1.append("</a>")
					sb1.append("</td><td>");
					sb1.append(value[i]);
					sb1.append("</td></tr>")
					$("#object_tbody").append(sb1.toString());
				}//end if(loc1>=0)
				else if(loc2>=0){
					j++;
					sb1.append("<tr id='");
					sb1.append(key[i]);
					sb1.append("-show'><td id='");
					sb1.append(key[i]);
					sb1.append("'>");
					sb1.append("<a href='obj.html?objectName=");
					sb1.append(key[i]);
					sb1.append("'>");
					sb1.append(key[i]);
					sb1.append("</a>")
					sb1.append("</td><td>");
					sb1.append(value[i].substring(0, loc2));
					sb1.append("<font color='#FF0000'>");
					sb1.append(value[i].substring(loc2, loc2 + quickSearchValue.length));
					sb1.append("</font>");
					sb1.append(value[i].substring(loc2 + quickSearchValue.length));
					sb1.append("</td></tr>");
					$("#object_tbody").append(sb1.toString());
				}//end if(loc2>=0)
			}//end if(key[i].toLowerCase().search(quickSearchValue.toLowerCase())== -1&&value[i].search(quickSearchValue)== -1) else
		}//end for (var i in key)
		if(j==0)$("#object_tbody").append("没有数据!");
	}//end (searchModel)
	else{
		myRefresh();
	}//end (searchModel) else
}
