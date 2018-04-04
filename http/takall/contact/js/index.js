// JavaScript Document
/**************************************************
 *	主题首页面 index.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================
//var subject_group;
var contact_id;
var group_name;

var order;
var desc;
var count;
var isGroup;	//是否指定小组
var displayWay=-1; //显示方式判断参数
//=====================================================Function===============================
function init(){
	if(request){
		if(!contact_id)
			contact_id=request["contact_id"];

		count = request["count"];
	
	}
	
	
	//初始化盒子
    $("#table-columns").html("");
	$("#ajax-load-div").addClass("hidden");
	
	

	//是否显示 新建 主题按钮
	if(myId&&myId>0)
		$("#addSubjectBtn").css("display","inline-table");
	
	//初始化主题显示方式
	initSubjectDisplayMode(displayWay)
	
	//mac-list.js的初始化参数
	initParams();
	
	//请求有主题标签时直接获取主题列表
	if(!request["subject_tags"])
		getList();
	
	
}

//是否显示小组的相关信息
function isShowGroupInfo(isGroupFlag) {
	if(!isGroupFlag)
		return;
	
	if(isGroupFlag == true){	//指定小组
	    $("#header-container").removeClass('hidden');
		$("#group-info-div").removeClass('hidden');
		
		$("#current-group-a").attr("href",getRootPath()+"http/takall/group/read.html?group_id="+group_id);
		$("#current-group-name").html(group_name);
		
		if(myId&&myId>0){
			$("#button-section").css("display","inline-block");
			getApplySubjectList();			//获取带审核的主题列表
			getApplyMemberList();			//获取带审核的组员列表
			getLastestAddedMemberList();	//获取最近新增的组员
		}
		
		getGroupInfo(); 				//小组信息
   	}else{
	 	$("#header-container").addClass('hidden');	
		$("#group-info-div").addClass('hidden');
	}
}

//初始化主题显示方式
function initSubjectDisplayMode(displayWayFlag) {	
 
	//为手机浏览器时隐藏列表切换按钮
	if(document.body.clientWidth>400)
		$("#index-list").css("display","block");
		
	$("#index-icon").css("background-color","#F8F8F8");
	$("#index-index").css("background-color","#F8F8F8");
	$("#index-list").css("background-color","#F8F8F8");
	
	var sb=new StringBuffer();
	var tableList=document.getElementById("list-table");
	if(displayWayFlag==1){//图标主题
		sb.append("<div class='flow-container subject-content' id='table-infos'>");
		sb.append("</div>");
		tableList.insertAdjacentHTML('afterEnd',sb.toString());
		
		$("#index-icon").css("background-color","#CCC");
	} else if(displayWayFlag==0){//列表主题
		sb.append("<tbody id='table-infos'  name='table-infos'>");
		sb.append("</tbody>");
		tableList.insertAdjacentHTML('beforeEnd',sb.toString());
	   
		$("#index-list").css("background-color","#CCC");
	}else {
		sb.append("<div class='flow-container subject-content' id='table-infos'>");
		sb.append("</div>");
		tableList.insertAdjacentHTML('afterEnd',sb.toString());
		
		$("#index-index").css("background-color","#CCC");
	}
}

//下一页按钮，翻到下一页
function morePage(){
	
	if(currentPage<totalPage) {
		if(!$("#subject-content").is(":visible"))
			$(".wminimize").click();
		
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		$("#more_page").addClass("hidden");
		changePage(null,(currentPage*count));
	}else{
		$("#ajax-load-div").removeClass("hidden");
		$("#more_page").addClass("hidden");
	}
}//end morePage()

//切换显示方式
function goChange(id,way){
	//判断是否为当前的切换方式
	if(displayWay==way)
		return;
		
	displayWay=way;
	
	var my = document.getElementById("table-infos");
    if (my != null)
        my.parentNode.removeChild(my);
	 
	init();
}
	 

//新建主题按钮
function addContact(){
	var url=new StringBuffer();
	url.append("add.html?");

	url.append("refresh-opener=1");
    url.append("&refresh-opener=1");

	window.open(url.toString(), "_blank");
}


//-----------------------------------------------------小组操作------------------------------------------------
//获取所有的小组
function getAllGroup(count){
	//初始化小组列表显示区域 
	initListGroup("dropdown-subject-list-li")
	
	if(myId && myId > 0){
		getListMemberGroup(count);	//列表当前用户加入的小组
	}else{
		getListRandomGroup();	//随机获取组	
	}	
}

//初始化小组列表显示区域  --
function initListGroup(parent) {
	if(!parent)
		return;
	
	var $a = $("#"+parent+"> a");
	if(!$a[0])
		return;
		
	$a.attr({"href":"#","data-toggle":"dropdown"}); 
}

//列表当前用户加入的小组
function getListMemberGroup(count){
	var target = document.getElementById("subject-list-li");
	if(!target)
		return ;
	
	var mydata={};
	mydata["objectName"]="Group";
	mydata["action"]="getJoinGroupList";
	mydata["order"] = "createTime";
	if(count && typeof count == "number")
		mydata["count"] = count;	
	else	
		mydata["count"] = 9;
	mydata["desc"] = 1;
	mydata["user_id"] = myId;	//指定用户
	
	$.ajax({
		async: true,
		type: "post",
		url: getRootPath()+"servlet/group",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			target.innerHTML = "";
		},
		success: function(data) {
			if(data){
				if(data.code==0){
					var total = parseInt(data.value);
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showListMemberGroup(record[i],parseInt(i),target);
						}else{
							showListMemberGroup(record,0,target);
						}//end if(record.length)
					}else{
						//不是组员
						getListRandomGroup();	//随机获取组	
					}//end if(record)
					
					//if(total > mydata.count){
						var sb = new StringBuffer();
						sb.append("<hr />");
						sb.append("<div class='drop-foot'>");
						sb.append("<a onclick='showGroupSubject();' >所有主题</a>");
						sb.append("</div>");
					
						$("#subect-list-li-more").html(sb.toString());
					//}
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#subject-list-li").html(error.toString());
				}//end if (data.code==0)
		    }else{
		   	   $("#subject-list-li").html("<font color='red'>执行失败</font>");
			}//end if (data)
		} ,//end success: function(data)
		error: function() {
			   $("#subject-list-li").html("<font color='red'>操作失败</font>");
        }
	});	
}

//显示加入的小组	
function showListMemberGroup(record,index,target){
	if(record && target){
		var sb = new StringBuffer();
		
		sb.append("<p>");
		sb.append("<a onclick=\"showGroupSubject('");
		if(record.id)	   
			sb.append(record.id);
		sb.append("');\" title='");
		sb.append(record.name);
		sb.append("' >");
		
		sb.append("<span class='label ");
		if(index % 2 == 0)
			sb.append("label-info");
		else
			sb.append("label-warning");
		sb.append("'><i class='icon-cloud'></i>"+(index+1)+"</span>");
		if(record.name)
			sb.append(record.name);
		sb.append("</a>");
		sb.append("</p>");
	
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
	}	
}

//显示小组主题数据
function showGroupSubject(groupId,groupName) {
	//判断是否为同一个小组
	if(group_id && group_id==groupId)
		return;
   
	params["skip"]=0;
	
	group_id=groupId;
   
   	var my = document.getElementById("table-infos");
    if (my != null)
        my.parentNode.removeChild(my);
		
	init();
}

//随机获取组
function getListRandomGroup(){
	var target = document.getElementById("subject-list-li");
	if(!target)
		return ;
	
	var mydata={};
	mydata["objectName"]="Group";
	mydata["action"]="getList";
	mydata["order"] = "createTime";
	mydata["count"] = 9;
	mydata["desc"] = 1;
	mydata["random"] = 1;	//指定用户
	
	$.ajax({
		async: true,
		type: "post",
		url: getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			target.innerHTML = "";
		},
		success: function(data) {
			if(data){
				if(data.code==0){
					var total = parseInt(data.value);
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showListRandomGroup(record[i],parseInt(i),target);
						}else{
								showListRandomGroup(record,0,target);
						}//end if(record.length)
					}else{
						//不是组员	
						if(target)
							target.insertAdjacentHTML('BeforeEnd',"<p class='text-muted'>没有数据！</p>");
					}//end if(record)
					
					//if(total > mydata.count){
						var sb = new StringBuffer();
						sb.append("<hr />");
						sb.append("<div class='drop-foot'>");
						sb.append("<a target='_blank' onclick='showGroupSubject();' >所有主题</a>");
						sb.append("</div>");
					
						$("#subect-list-li-more").html(sb.toString());
					//}
			    }else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					$("#subject-list-li").html(error.toString());
				}  //end if (data.code==0)
			}else{
            	$("#subject-list-li").html("<font color='red'>执行失败</font>");
            } //end if (data)
		}, //end success: function(data)
		error: function() {
			$("#subject-list-lil").html("<font color='red'>操作失败</font>");
        }
	});	
}

//显示随机的小组	
function showListRandomGroup(record,index,target){
	if(record && target){
		var sb = new StringBuffer();
		
		sb.append("<p>");
		
		sb.append("<a href='javascript:;' onclick=\"showGroupSubject('"); 
		if(record.id)  
			sb.append(record.id);
		sb.append("');\" title='");
		sb.append(record.name);
		sb.append("' >");
		
		sb.append("<span class='label ");
		if(index % 2 == 0)
			sb.append("label-info");
		else
			sb.append("label-warning");
		sb.append("'><i class='icon-cloud'></i>"+(index+1)+"</span>   ");
		if(record.name)
			sb.append(record.name);
		sb.append("</a>");
		sb.append("</p>");
	
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
	}	
}	

//------------------------------------------------tags.menu----------------------------------------------------
//获取所有的类型
function getAllType(){
	var target=document.getElementById('tag_menu_tab');
	if(!target)
		return;
	
	var mydata={};
	mydata["objectName"]="SubjectTag";
	mydata["action"]="getAllTypes";
	mydata["tag_object"]="Subject";
	
	$.ajax({
		async: true,
		type: "post",
		url: getRootPath()+"servlet/subjecttag",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			target.innerHTML = "";	//清空
		},
		success: function(data) {
			if(data){
				if (data.code==0){
					var target1=document.getElementById("tag_menu_content");
					if(target1)
						target1.innerHTML = "";	//清空
					var record=data["record"];
					if (record) {
						if (record.length) {
							for (var i in record){
								showSubjectType(record[i],parseInt(i),target);
								showSubjectTags(record[i].tag_type.value,parseInt(i));
							}
						}else{
							showSubjectType(record,0,target);
							showSubjectTags(record.tag_type.value,0);
						}
					} //end if (record)
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#tag_menu_content").html(error.toString());
				}//end if (data.code==0)
			}else{
            	$("#tag_menu_content").html("<font color='red'>执行失败</font>");
            } //end if (data)
		} ,//end success: function(data)
		error: function() {
			$("#tag_menu_content").html("<font color='red'>操作失败</font>");
        }
	});
}

//显示类型
function showSubjectType(record,index,target){
	if(record){
		var sb = new StringBuffer();
		
		sb.append("<a class='btn");
		if(index == 0){
			 sb.append(" active");
		}
		sb.append("' onmouseover='mOverType(");
		sb.append(""+index);
		sb.append(");' >");
		if(record.tag_type)
			sb.append(record.tag_type.value);
		sb.append("</a>");
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
	}	
}

//显示标签
function showSubjectTags(subjectType,index){
	var target=document.getElementById("tag_menu_content");
	if(!target)
		return;

	var ulObj = document.createElement("ul");
	if(index == 0)
		ulObj.style.display = "block";
	else
		ulObj.style.display = "none";
	target.appendChild(ulObj);	//新建ul
	
	var mydata={};
	mydata["objectName"]="SubjectTag";
	mydata["action"]="getList";
	mydata["tag_object"]="Subject";
	mydata["tag_type"]=subjectType;
	
	$.ajax({
		async: false,
		type: "post",
		url: getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
		},
		success: function(data) {
			if (data) {
				 if(data.code==0){
				 	var record=data["record"];
					if(record){
						if(record.length){ 
							for (var i in record) {
								showSubjectTagsContent(record[i],subjectType,ulObj);	
						    }
						}else{
							showSubjectTagsContent(record,subjectType,ulObj);
						}
					} //end if (record)
				 }else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#tag_menu_content").html(error.toString());
				}//end if(data.code==0)
			}else{
           		$("#tag_menu_content").html("<font color='red'>执行失败</font>");
          } //end if(data)
		},//end success: function(data)
		error: function() {
			$("#tag_menu_content").html("<font color='red'>操作失败</font>");
        }
	});
}

//选择标签
function selectTag(subjectType,subjectTag){	
	if(!subjectType || !subjectTag)
		return ;
    
	if(currentSelectedTagsCount >= maxSelectedTagsCount){
		alert("最多允许选择["+maxSelectedTagsCount+"]个标签！");
		return ;	
	}

	var ulObj = document.getElementById('selected-subject-tag-ul');
	if(!ulObj)
		return;
	var lis = ulObj.getElementsByTagName("li");
	var isExist = false;	//判断是否存在
	var liCount = 0;
	if(lis && lis.length > 0){
		liCount = lis.length;
		for(var i=0;i < lis.length;i++){
			if(typeof lis[i] == "object"){
				var attr = lis[i].getAttribute("data-attr");
				if(!attr)
					continue;
				if(subjectTag == attr){
					isExist = true;
					break;
				}
			}//end if(typeof lis[i] == "object")		
		}//end for(var i=0;i < lis.length;i++)	
	}//end if(lis && lis.length > 0)
	if(isExist)
		return;
	else{
		if(liCount == 0){
			var newLi = document.createElement("li");
			newLi.innerHTML = "已选标签：";
			ulObj.appendChild(newLi);
		}
		var newLi1 = document.createElement("li");
		var sb = new StringBuffer();
		sb.append("<a class='btn' href='javascript:;' onclick=\"removeTag('");
		sb.append(subjectType);
		sb.append("','");
		sb.append(subjectTag);
		sb.append("');\" >");
		sb.append(subjectTag);
		sb.append("<i class='fa fa-times'></i></a>");
		
		newLi1.innerHTML = sb.toString();
		newLi1.setAttribute("data-attr",subjectTag);
		ulObj.appendChild(newLi1);
		
		currentSelectedTagsCount++;		//选中标签数+1
		
		resetWholeVariable();	//重置全局变量
		//quickSearchFormSubmit(false);	//重新查询
	}	
}

//移除标签
function removeTag(subjectType,subjectTag){
	if(!subjectType || !subjectTag)
		return ;
	var ulObj = document.getElementById('selected-subject-tag-ul');
	if(!ulObj)
		return;
	var lis = ulObj.getElementsByTagName("li");
	var liCount = 0;
	if(lis && lis.length > 0){
		var ul;			//li的父节点
		var removeLi;	//要移除的节点
		for(var i=0;i < lis.length;i++){
			if(typeof lis[i] == "object"){
				liCount++;	//统计个数
				var attr = lis[i].getAttribute("data-attr");
				if(!attr)
					continue;
				if(subjectTag == attr){
					var ul = lis[i].parentNode; 	//父节点
					if(ul)
						removeLi = lis[i];			//要移除的节点
				}//end if(subjectTag == attr)
			}//end if(typeof lis[i] == "object")		
		}//end for(var i=0;i < lis.length;i++)	
		
		if(ul && removeLi){
			//移除节点
			ul.removeChild(removeLi);		//移除节点	
			liCount--;
			currentSelectedTagsCount--;		//选中标签数-1
		}
	}//end if(lis && lis.length > 0)
	
	if(liCount <= 1){	//没有选择标签
		ulObj.innerHTML = "";
	}
	resetWholeVariable();	//重置全局变量
}

//重置的变量
function  resetWholeVariable(){
	params["skip"]=0;
	
	$("#table-infos").html("");
	
	var selectedTags = getAllSelectedTags();	//获取选中的标签
	if(selectedTags && selectedTags.length > 0){
		params["subject_tags"] = selectedTags;
	}else{
		params["subject_tags"] = selectedTags;
	}
	
	if(currentSeelectedCatalogCode && currentSeelectedCatalogCode.length >0){
		params["catalog_code"] = currentSeelectedCatalogCode;	//选中的目录编码
	}
	else{
		params["catalog_code"] = currentSeelectedCatalogCode;
	}
	getList();
}

//切换标签
function mOverType(index){
	var tagObj = document.getElementById('tag_menu_tab');
	var contentObj = document.getElementById('tag_menu_content');
	
	if(!tagObj || !contentObj)
		return ;
		
	var as = tagObj.getElementsByTagName("a");
	var uls = contentObj.getElementsByTagName("ul");
	if(as && as.length >0){
		for(var i =0 ;i<as.length;i++){
			if(typeof as[i] == "object"){
				if(i == index){
					as[i].className = "btn active";
					if(typeof uls[i] == "object")
						uls[i].style.display = "block";
				}else{
					as[i].className = "btn";
					if(typeof uls[i] == "object")
						uls[i].style.display = "none";
				}
			}//end if(typeof as[i] == "object")	
		}//end for(var i =0 ;i<as.length;i++)
	}//end if(as && as.length >0)
}

//标签显示切换开关
function toggleTags(){
	if($("#tag_menu").is(":hidden")){
		$("#toggle_tags").css("background-color","#CCC");
	}else{
		$("#toggle_tags").css("background-color","#F8F8F8");
	}
	
	$("#tag_menu").toggle(500);	
}
//----------------------------------end tags.menu---------------------------------------------------


//----------------------------------start catalog.menu------------------------------------------------
//iframe 框架调用 选择目录
function selectCatalog(code,name,notfresh){
	if(!code || !name)
		return ;
	var ulObj = document.getElementById('selected-subject-catalog-ul');
	if(!ulObj)
		return;
	
	//判断是否存在
	var lis = ulObj.getElementsByTagName("li");
	var isExist = false;	//判断是否存在
	if(lis && lis.length > 0){
		liCount = lis.length;
		for(var i=0;i < lis.length;i++){
			if(typeof lis[i] == "object"){
				var attr = lis[i].getAttribute("data-attr");
				if(!attr)
					continue;
				if(code == attr){
					isExist = true;
					break;
				}
			}//end if(typeof lis[i] == "object")		
		}//end for(var i=0;i < lis.length;i++)	
	}//end if(lis && lis.length > 0)
	if(isExist)
		return;
	
	ulObj.innerHTML = "";	//清空
		
	var newLi = document.createElement("li");
	newLi.innerHTML = "已选目录：";
	ulObj.appendChild(newLi);

	var newLi1 = document.createElement("li");
	var sb = new StringBuffer();
	sb.append("<a class='btn' href='javascript:;' onclick=\"removeCatalog('");
	sb.append(code);
	sb.append("','");
	sb.append(name);
	sb.append("');\" >");
	sb.append(name);
	sb.append("<i class='fa fa-times'></i></a>");
	
	newLi1.innerHTML = sb.toString();
	newLi1.setAttribute("data-attr",code);
	ulObj.appendChild(newLi1);
	
	currentSeelectedCatalogCode = code;	//保存选中的目录code
	if(!notfresh || notfresh=="null")
		resetWholeVariable();	//重置全局变量
	//quickSearchFormSubmit(false);	//重新查询
}

//快速查询
function quickSearchFormSubmit(){
	var quickSearch = $("#searchText").val();

	params["skip"]=0;
	params["quick-search"]=quickSearch;

	$("#table-infos").html("");
	getList();
}

//移除选中的目录
function removeCatalog(code,name){
	var ulObj = document.getElementById('selected-subject-catalog-ul');
	if(!ulObj)
		return;
	ulObj.innerHTML = "";	//清空
	
	currentSeelectedCatalogCode = "";	//清空
	//quickSearchFormSubmit(false);	//重新查询
 	resetWholeVariable();	//重置全局变量
}

//目录显示切换开关
function toggleCatalog(){
	
	if($("#catalog_menu").is(":hidden"))
	{
		$("#toggle_catalog").css("background-color","#CCC");
	}else{
		$("#toggle_catalog").css("background-color","#F8F8F8");
	}
	
	$("#catalog_menu").toggle(500);	
}
//----------------------------------end catalog.menu---------------------------------------------------


//--------------------------------- 待审主题、组员 and 新增组员 -----------------------------------------
//获取带审核的主题列表
function getApplySubjectList(){
	var target = document.getElementById('apply-subject-list');
	if(!target)
		return;
		
	var mydata={};
	mydata["objectName"]="Subject";
	mydata["action"]="getList";
	mydata["count"] = 5;
	mydata["order"] = "crealist-tableteTime";
	mydata["desc"] = 1;
	
	mydata["subject_status"] = 0;	//待审核的主题
	mydata["group_id"] = group_id;
	
	$.ajax({
		async: true,
		type: "post",
		url: getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			target.innerHTML = "";
		},
		success: function(data) {
			if(data) {
				if(data.code==0){
					$("#apply-subject-count").html(data.value);	//显示个数
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showApplySubjectList(record[i],target);
						}else{
								showApplySubjectList(record,target);
						}//end if(record.length)
					}//end if(record)
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#apply-subject-list").html(error.toString());
				}//end if(data.code==0)
			}else{
            	$("#apply-subject-list").html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
	    	$("#apply-subject-list").html("<font color='red'>操作失败</font>");
        }
	});	
	
}	

//显示待审主题列表
function showApplySubjectList(record,target){
	if(record && target){
		var sb=new StringBuffer();
		
		sb.append("<li>");
		sb.append("<h6>");
		sb.append("<a href='../../contac/js/"+getRootPath()+"http/takall/subject/index/read/index.html?subject_id=");
		if(record.id)
			sb.append(record.id);
		sb.append("' target='_blank'>");
		if(record.name)
		sb.append(record.name);
		sb.append("</a>");
		sb.append("<span class='label-self label label-warning pull-right' style='margin-top:3px;'>");
		if(record.createTime){
			var createTime = changeTime(record.createTime.show);	//若是今天的，只显示时间
			sb.append(createTime);
		}else if(record.subject_group){	//所属小组
			sb.append(record.subject_group.show);	
		}
		sb.append("</span>");
		sb.append("</h6>");
		sb.append("<div class='clearfix'></div>");
		sb.append("<hr />");
		sb.append("</li>");
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());		
	}
}

//获取带审核的组员列表
function getApplyMemberList(){
	var target = document.getElementById('apply-member-list');
	if(!target)
		return;
	
	var mydata={};
	mydata["objectName"]="Member";
	mydata["action"]="getList";
	
	mydata["count"] = 5;
	mydata["order"] = "createTime";
	mydata["desc"] = 1;
	
	mydata["member_status"] = 0;	//待审核的组员
	mydata["group_id"] = group_id;
	
	$.ajax({
		async: true,
		type: "post",
		url: getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			target.innerHTML = "";
		},
		success: function(data) {
			if(data){
				if (data.code==0){
					$("#apply-member-count").html(data.value);	//显示个数
					
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showApplyMemberList(record[i],target);
						}else{
								showApplyMemberList(record,target);
						}//end if(record.length)
						if(target && (count > 0 && parseInt(data.value) > count)){
							var sb = new StringBuffer();
							sb.append("<li>");
							sb.append("<div class='drop-foot'>");
							sb.append("<a href='../../contac/js/");
							sb.append(getRootPath());
							sb.append("http/takall/member/jsp/index.jsp?order=createTime&desc=1&count=");
							sb.append(data.value);
							if(mydata.member_group && mydata.member_group.toString().length >0){
								sb.append("&group_id=");
								sb.append(mydata.member_group);
							}
							sb.append("' target='_blank'>");
							sb.append("查看更多</a>");
							sb.append("</div>");
							sb.append("<li>");
							target.insertAdjacentHTML('BeforeEnd',sb.toString());
						}// 
					}//end if(record)
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#apply-member-list").html(error.toString());
				}//end if(data.code==0)
		    }else{
            	 $("#apply-member-list").html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
			$("#apply-member-list").html("<font color='red'>操作失败</font>");
        }
	});	
	
}	

//显示待审组员列表
function showApplyMemberList(record,target){
	if(record && target){
		var sb = new StringBuffer();
		
		sb.append("<li>");
		sb.append("<h6>");
		sb.append("<a href='../../contac/js/");
		sb.append(getRootPath());
		sb.append("http/takall/member/jsp/read.jsp?member_id=");
		if(record.id)
			sb.append(record.id);
		sb.append("' target='_blank'>");
		if(record.name)
		sb.append(record.name);
		sb.append("</a>");
		sb.append("<span class='label-self label label-warning pull-right' style='margin-top:3px;'>");
		if(record.createTime){
			var createTime = changeTime(record.createTime.show);	//若是今天的，只显示时间
			sb.append(createTime);
		}else if(record.member_group){	//所属小组
			sb.append(record.member_group.show);
		}
		sb.append("</span>");
		sb.append("</h6>");
		sb.append("<div class='clearfix'></div>");
		sb.append("<hr />");
		sb.append("</li>");
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());		
	}
}

//获取最近新增的组员
function getLastestAddedMemberList(){
	var target = document.getElementById('lastest-added-member-list');
	if(!target)
		return;
	
	var count = 5;
	
	var mydata={};
	mydata["objectName"]="Member";
	mydata["action"]="getList";
	
	if(count > 0)
		mydata["count"] = count;
	mydata["order"] = "createTime";
	mydata["desc"] = 1;
	mydata["group_id"] = group_id;
	
	if(!myLatestedTime)
		return;
	var newTime = TimeStringToJSTimeString(myLatestedTime);
	var timeObj = new Date(newTime);
	mydata["condition"]="createTime >= "+timeObj.getTime();	//创建时间大于用户最近一次登录的时间
	
	$.ajax({
		async: true,
		type: "post",
		url: getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			target.innerHTML = "";
		},
		success: function(data) {
			if(data){
				if (data.code==0){
					$("#lastest-added-member-count").html(data.value);	//显示个数
					
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showLastestAddedMemberList(record[i],target);
						}else{
								showLastestAddedMemberList(record,target);
						}//end if(record.length)
						if(target && (count > 0 && parseInt(data.value) > count)){
							var sb = new StringBuffer();
							sb.append("<li>");
							sb.append("<div class='drop-foot'>");
							sb.append("<a href='../../contac/js/");
							sb.append(getRootPath());
							sb.append("http/takall/member/jsp/index.jsp?order=createTime&desc=1&count="+data.value+"' target='_blank' >");
							sb.append("查看更多</a>");
							sb.append("</div>");
							sb.append("<li>");
							target.insertAdjacentHTML('BeforeEnd',sb.toString());
						}// 
					}//end if(record)
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#lastest-added-member-list").html(error.toString());
				}//end if(data.code==0)
			}else{
            	$("#lastest-added-member-list").html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
			$("#lastest-added-member-list").html("<font color='red'>操作失败</font>");
        }
	});	
}

//显示新增的组员列表
function showLastestAddedMemberList(record,target){
	if(record && target){
		var sb = new StringBuffer();
		
		sb.append("<li>");
		sb.append("<h6>");
		sb.append("<a href='../../contac/js/");
		sb.append(getRootPath());
		sb.append("http/takall/member/read.jsp?member_id=");
		if(record.id)
			sb.append(record.id);
		sb.append("' target='_blank'>");
		if(record.name)
			sb.append(record.name);
		sb.append("</a>");
		sb.append("<span class='label-self label label-warning pull-right' style='margin-top:3px;'>");
		if(record.createTime){
			var createTime = changeTime(record.createTime.show);	//若是今天的，只显示时间
			sb.append(createTime);
		}else if(record.member_group){	//所属小组
			sb.append(record.member_group.show);	
		}
		sb.append("</span>");
		sb.append("</h6>");
		sb.append("<div class='clearfix'></div>");
		sb.append("<hr />");
		sb.append("</li>");
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());		
	}
}

//将xxxx-xx-xx xx:xx:xx 转换为 xxxx/xx/xx xx:xx:xx
function TimeStringToJSTimeString(timeStr){
	if(!timeStr)
		return timeStr;
	while(timeStr.indexOf("-") > -1){
		timeStr = timeStr.replace("-","/");
	}
	return timeStr;
}

//显示时间方式 --今天显示时间，非今天显示日期 
function changeTime(timeStr){
	var date = new Date();
	var sb = new StringBuffer();
	sb.append(date.getFullYear());
	sb.append("-");
	var month = date.getMonth()+1;
	if(month < 10)
		month = "0"+month;
	sb.append(month);
	sb.append("-");
	sb.append(date.getDate());
	var today = sb.toString();
	
	var timeStrArr = timeStr.split(" ");
	if(timeStrArr[0] == today)
		return timeStrArr[1];
	else 
		return timeStrArr[0];
}


//------------------------------------------小组信息--------------------------------------------
//获取小组的信息
function getGroupInfo(){
	var target = document.getElementById('group-info-div-content');
	if(!target)
		return ;
		
	var mydata={};
	mydata["objectName"]="Group";
	mydata["action"]="readInfo";
	mydata["group_id"] = group_id;
	
	$.ajax({
		async: true,
		type: "post",
		url: getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			target.innerHTML = "";	//清空
		},
		success: function(data) {
			if(data){
				if(data.code==0){
					var record = data["record"];
					if(record){
						if(record.length){
							showGroupInfo(record[0],target);
						}else{
							showGroupInfo(record,target);
						}//end if(record.length)
					}//end if(record)
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#group-info-div-content").html(error.toString());
				}//end if(data.code==0)
			}else{
            	$("#group-info-div-content").html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
			$("#group-info-div-content").html("<font color='red'>操作失败</font>");
        }
	});		
}

//显示小组信息
function showGroupInfo(record,target){
	if(record){
		if(record.group_subjects)
			$("#total-subject-count-a").html(record.group_subjects.value);	//显示主题个数
		if(record.group_members)
			$("#total-member-count-a").html(record.group_members.value);	//显示组员个数
		
		var sb = new StringBuffer();
		
		//编码
		if(record.group_code){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_code.display)
			sb.append(record.group_code.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_code.show)
			sb.append(record.group_code.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		//名字
		if(record.group_name){
			if(!group_name) {
				group_name = record.group_name.show;
				document.title=group_name;
				$("#current-group-name").html(group_name);
			}
			
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_name.display)
			sb.append(record.group_name.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_name.show)
			sb.append(record.group_name.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		//信用
		if(record.group_credit){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_credit.display)
			sb.append(record.group_credit.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_credit.show)
			sb.append(record.group_credit.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		//状态
		if(record.group_status){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_status.display)
			sb.append(record.group_status.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_status.show)
			sb.append(record.group_status.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		//创建时间
		if(record.createTime){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.createTime.display)
			sb.append(record.createTime.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.createTime.show)
			sb.append(record.createTime.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		//修改时间
		if(record.modifyTime){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.modifyTime.display)
			sb.append(record.modifyTime.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.modifyTime.show)
			sb.append(record.modifyTime.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		
		//主题发布属性
		if(record.group_speak){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_speak.display)
			sb.append(record.group_speak.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_speak.show)
			sb.append(record.group_speak.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		
		//主题阅读属性
		if(record.group_listen){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_listen.display)
			sb.append(record.group_listen.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_listen.show)
			sb.append(record.group_listen.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		
		//加入小组属性
		if(record.group_join){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_join.display)
			sb.append(record.group_join.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_join.show)
			sb.append(record.group_join.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		
		//组员对组员的默认权限
		if(record.group_member_memberright){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_member_memberright.display)
			sb.append(record.group_member_memberright.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_member_memberright.show)
			sb.append(record.group_member_memberright.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		
		//主题数
		if(record.group_subjects){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_subjects.display)
			sb.append(record.group_subjects.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_subjects.show)
			sb.append(record.group_subjects.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		
		//成员数
		if(record.group_members){
			sb.append("<div class='col-md-6'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_members.display)
			sb.append(record.group_members.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_members.show)
			sb.append(record.group_members.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-6
		}
		
		//最近访问数
		if(record.group_latestTime){
			sb.append("<div class='col-md-12'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			sb.append(record.group_latestTime.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			sb.append(record.group_latestTime.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-12
		}
		
		//QRCode 编码
		if(record.group_qrcode){
			sb.append("<div class='col-md-12'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_qrcode.display)
			sb.append(record.group_qrcode.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_qrcode.show)
			sb.append(record.group_qrcode.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-12
		}
		
		//备注
		if(record.group_remark){
			sb.append("<div class='col-md-12'>");
			sb.append("<div class='row'>");
			sb.append("<div class='col-xs-4 text-align'>");
			if(record.group_remark.display)
			sb.append(record.group_remark.display);
			sb.append(" ：</div>");
			sb.append("<div class='col-xs-8'>");
			if(record.group_remark.show)
			sb.append(record.group_remark.show);
			sb.append("</div>");
			sb.append("</div>");	//end.row
			sb.append("</div>");  //end .col-md-12
		}
		
		sb.append("<div class='clearfix'></div>");
			
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
	}
}


//-----------------------------------------------------End-------------------------------------