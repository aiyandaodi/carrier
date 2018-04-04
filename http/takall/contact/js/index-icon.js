// JavaScript Document
/**************************************************
 *	主题首页面 index-icon.js
 *	
 *	   功能：辅助mac-list.js用于 subject/index/index.html页面主题显示
 *	
 **************************************************/
//=====================================================Parameter=============================
//var total = 0;						//记录总条数

var currentSelectedTagsCount = 0;	//当前选中的标签数
var maxSelectedTagsCount = 5;		//最大允许选中的标签数
var currentSeelectedCatalogCode ;	//当前选中的主题目录var EVERY_ROW_SHOW = 5;	//每行显示的个数
var EVERY_ROW_SHOW = 5;	//每行显示的个数
var currentPage;
var totalPage;

var isContinueLoad = true;		//是否可以继续
//=====================================================Function===============================
//mac-list.js的初始化参数
function initParams() {	  
	ajaxURL=getRootPath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
	
	// params={};    //Ajax取得列表信息的调用参数

	 var key=new Array();
  key.push("tag_");
  key.push("type");
  params=getRequestParams(key,request,params,true);
  params["objectName"]="Contact";
  params["action"]="getList";
  params["ContactTelephone-sub"]=1;
   params["ContactAddress-sub"]=1;
    params["ContactInstance-sub"]=1;
	 params["ContactEmail-sub"]=1;
  params["skip"]=0;
	//是否获取主题图标
	if(displayWay==(-1) || displayWay==1)
		params["icon"] = 1;	
	else
		params["icon"] = 0;
		
	//查询条件：指定小组
	if(contact_id && group_id.length > 0)
		params["contact_id"] = contact_id;
	
	//查询条件：计数
	if(count)
		params["count"] = count;
	else {
		params["count"] = PAGE_COUNT;
		count = PAGE_COUNT;
	}
	
	//查询条件：排序字段
	if(order && order.length > 0)	
		params["order"] = order;
	else {
		params["order"] = "createTime DESC";
		
	}
	
	//查询条件：排序方式
	
	
	//快速查询
	var quickSearch;
	var searchForm = document.getElementById("searchForm");
	if(searchForm && searchForm.searchText)
		quickSearch = searchForm.searchText.value;
	if(quickSearch && quickSearch.length >0)
		params["quick-search"] = encodeURI(quickSearch);
		
	//快速查询字段
	searchs=new Array();    // 快速检索域
	searchs.push("contact_name");
	searchs.push("contact_title");
	searchs.push("contact_sex");
	searchs.push("contact_unit");
    searchs.push("contact_department");
	searchs.push("contact_position");
	searchs.push("contact_user");

	//显示列名字段
	 columns=new Array();    //显示列
  columns.push('contact_name');
  columns.push('contact_title');
  columns.push('contact_sex');
  columns.push('contact_unit');
  columns.push('contact_department');
   columns.push('contact_position');
    columns.push('contact_user');
	
	//瀑布流参数初始化
	flowInitParams("table-infos");
}

//-------------------------------------------index icon list 显示方式------------------------------------------------
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
		
		document.getElementById("noContact").style.display ="";
	
		return;
	}
	
    // 1、设置列名行
	var rec = (records.length) ? records[0] : records;
	if(displayWay==0){
		showListColumns(rec); //默认方式显示列名
	}else if((displayWay==1) || (displayWay==-1)){
		showCustomListColumns(rec);  //自定义方式显示列名
	}

	// 2、设置列名排序
	for(var i in columns) {
		var elem=document.getElementById("img_"+columns[i]);
		if(!elem)
			continue;
		if(order==columns[i]){
			elem.style.display="";
			elem.src = (parseInt(desc)==1 || desc=="true" || desc==true) ?  dascendingPath : ascendingPath; 
		}else{
			elem.style.display="none";
		}
	} // end for(var i in columns)

	// 3、设置数据
	var elem=document.getElementById("table-infos");
	if(!elem)
		return;
	
	//显示主题列表
	if(displayWay==0){//列表方式
		if(records.length){// 多条数据
			for(var i in records)
	    		showListInfo(records[i],data,elem);  //mac-list.js中函数
		}else{// 一条数据
		    showListInfo(records,data,elem);
		}
	}else{//图标、索引方式
		showSubject(records,elem);
	}
}

//显示列名
function showCustomListColumns(record) {
	var tr=document.getElementById("table-columns");
	if(!tr)
    	return;
  
	if(tr.innerHTML.length>0){
    	var elem=document.getElementById("select-all");
		if(elem)
			elem.checked="";
    	return;
  	}

  	var sb=new StringBuffer();
	
  	for(var i in columns){
		if(!columns[i])
	 		continue;
    
		var field=record[columns[i]];
		if(!field)
			continue;

		sb.append("<th id='column-");
		sb.append(columns[i]);
		sb.append("-title' class='column-");
		sb.append(columns[i]);
		sb.append("' style='cursor:pointer' onClick=\"changeCustomOrder('");
		sb.append(columns[i]);
		sb.append("');\" onMouseOver=\"columnMouseOver(this);\" onMouseOut=\"columnMouseOut(this);\">");
		sb.append("<img height=\"20px\" src=../../contac/js/\"\" id=\"img_");
		sb.append(columns[i]);
		sb.append("\"/>");
		if(field.display)
			sb.append(field.display);
		sb.append("</th>");
  	}
  
  	tr.insertAdjacentHTML('BeforeEnd', sb.toString());
}

//显示数据 -- 图标、索引方式
function showSubject(records,elem){
	if(!records)
		return;
	
	var quickSearch = decodeURIComponent(params["quick-search"]);
	//图标方式显示
	if(displayWay==1){
		if(records.length){
			for(var i in records){
				showSubjectIcon(records[i],elem,parseInt(i),quickSearch);
			}		
		}else{
			showSubjectIcon(records,elem,0,quickSearch);
		}//end if(records.length)
	}else if(displayWay==(-1)){	//索引方式显示	 
		if(records.length){
			for(var i in records){
				showSubjectIndex(records[i],elem,parseInt(i),quickSearch);
			}
		}else{
			showSubjectIndex(records,elem,0,quickSearch);
		}//end if(records.length)
	}
	
	//刷新瀑布流布局显示
	flowFlushDisplay();		 				
}

//--------------------------icon------------
//主题以图标方式显示
function showSubjectIcon(record,target,index,quickSearch){
	if(record){
		var sb = new StringBuffer();
		
		sb.append("<div class='flow-item-box col-md-4 col-sm-4' style='text-align:center;padding-top:0.5%;'>");
		
		//<!--图片-->
		sb.append("<div class='bthumb2 widget-content'>"); 
		
		sb.append("<a target='_blank' href='../../contac/js/");
		sb.append(getRootPath());
		sb.append("http/takall/subject/read/?subject_id=");
		if(record.id) 
			sb.append(record.id);
		sb.append("' >"); 
		sb.append("<div class='bthumb2 widget-content bthumb2-overflow'  id='subject-bthumb2-overflow' style='text-align:center;position:relative;'>"); 
		sb.append("<img class='subject-icon rp-image' src='../../contac/js/");
		if(record.icon && record.icon.length > 0)
 		     sb.append(record.icon);
		else
			 sb.append("images/default_img.png");
		sb.append("' width='100%' onload='javascript:flowFlushDisplay();'/><br/>");
			
		sb.append("</div>");
		sb.append("</a>");
		
		sb.append("</div>");
		
		//<!--标题-->
		sb.append("<span class='center'>");
		sb.append("<h4 class='title btn-group box-title-h3'>");
		sb.append("<a target='_blank' href='../../contac/js/");
		sb.append(getRootPath());
		sb.append("http/takall/subject/read/?subject_id=");
		if(record.id)
			sb.append(record.id);
		sb.append("'> ");
		
		//快速检索
		sb.append(quickSearchKeywordFilter(record.contact_name, searchs, quickSearch));
		
		sb.append("</a>");
		sb.append("</h4>");
		sb.append("</span>");
		
		
		sb.append("<div class='clearfix'></div>");
		sb.append("</div>"); //end flow-item-box col-md-4 col-sm-4
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
	}//end if(record)
}

//--------------------------index------------
//主题以索引方式显示
function showSubjectIndex(record,target,index,quickSearch){
	if(record){
		var id=record.id;
		if(!id)
			id="";
			
		var sb = new StringBuffer();
		sb.append("<div class='flow-item-box col-md-4 col-sm-4' style='cursor:pointer;' onMouseOver=\"showIcon('");
		sb.append(id);
		sb.append("')\"");
		 sb.append("onMouseOut=\"hideIcon('");
		 sb.append(id);
		 sb.append("')\"");	
		sb.append(">");
		
		//<!--标题-->
		sb.append("<h4 class='title btn-group box-title-h3'>");
		sb.append("<a target='_blank' href='../../contac/js/");
		sb.append(getRootPath());
		sb.append("http/takall/subject/read/?subject_id=");
		sb.append(id);
		sb.append("'> ");
		
		if(record.subject_author)
			sb.append(quickSearchKeywordFilter(record.subject_author, searchs, quickSearch)+":");
		
		//快速检索
		sb.append(quickSearchKeywordFilter(record.contact_name, searchs, quickSearch));
		
		sb.append("</a>");
		sb.append("</h4>");
		
		//<!--发布者头像-->
		var subjectOwnerValue = "";
		var subjectOwnerShow = "";
		if(record.subject_owner){
			subjectOwnerValue = record.subject_owner.value; 
		 	subjectOwnerShow = record.subject_owner.show;
		}//end if(record.subject_owner)ff
		sb.append("<div style='float:right;display: none'  id='icon");
		sb.append(id);
		sb.append("' >");
		sb.append("<a><span class='fa  fa-envelope-o' style='cursor:pointer;' title='发送信息' onclick='send('");
		sb.append(id);
		sb.append("') >   ");
		sb.append("</span></a>  ");
		
		sb.append("<a><span class='fa  fa-search-plus' style='cursor:pointer;' title='详细' onclick=\"readInfo('");
		sb.append(id);
		sb.append("')\" >   ");
		sb.append("</span></a>  ");
			sb.append("<a><span class='fa  fa-pencil' style='cursor:pointer;' title='编辑' onclick=\"editInfo('");
		sb.append(id);
		sb.append("')\" >    ");
		sb.append("</span></a>  ");
			sb.append("<a><span class='fa  fa-trash-o' style='cursor:pointer;' title='删除' onclick=\"removeAppointInfo('");
		sb.append(id);
		sb.append("','");
		sb.append(record.contact_name.value);
		sb.append("')\" >")
		sb.append("</span></a>");
		sb.append("</div>");
		//<!--图片-->
		sb.append("<div class=\"row\">");
	    sb.append("<div class='bthumb2 widget-content col-md-6'>"); 
		sb.append("<a target='_blank' href='../../contac/js/");
		sb.append(getRootPath());
		sb.append("http/takall/subject/read/?subject_id="); 
		sb.append(id);
		sb.append("' >"); 
		sb.append("<div class='bthumb2 widget-content bthumb2-overflow' id='subject-bthumb2-overflow' onload=''>"); 
		
		
	     sb.append("<img id='subject-img-' src='../../contac/js/img/contacts.png' width='100%' class='img-responsive' onload='javascript:flowFlushDisplay();'/>");

			
		sb.append("</div>");
		sb.append("</a>");
		
		sb.append("</div>");
		
		sb.append("<div class='col-md-6'>");
		 if(record.contact_title){
			sb.append("<li>");
			sb.append(record.contact_title.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_title.show);
			sb.append("</span>");
			sb.append("</li>");
		}
	
		if(record.contact_sex){
			sb.append("<li>");
			sb.append(record.contact_sex.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_sex.show);
			sb.append("</span>");
			sb.append('</li>');
		}
		
		if(record.contact_unit){
			sb.append("<li>");
			sb.append(record.contact_unit.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_unit.show);
			sb.append("</span>");
			sb.append("</li>");
		
		}
		 	sb.append("</div>");
		sb.append("</div>");
	   		sb.append("<div class=\"row\">");
		if(record.contact_department){
		sb.append("<div class='col-md-6'>"); 
			sb.append("<li>");
			sb.append(record.contact_department.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_department.show);
			sb.append("</span>");
			sb.append("</li>");
			sb.append("</div>");
		}
		
		if(record.contact_position){
				sb.append("<div class='col-md-6'>"); 
				sb.append("<li>");
			sb.append(record.contact_position.display);
		
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_position.show);
			sb.append("</span>");
			sb.append("</li>");
			sb.append("</div>");
		
		}
	
        sb.append("</div>");
		 
		//<!--标签-->
	
		sb.append("<div class='paging'>");
		sb.append("<span class='tag-title' title='标签'><i class='fa fa-tag'></i></span>");
		
		if(record.subject_tags){
			var subjectTags = quickSearchKeywordFilter(record.subject_tags, searchs, quickSearch);
			if(subjectTags){
				var array = subjectTags.split(";");
				if(array && array.length > 0){
					for(var i = 0;i < array.length;i++){
						if(array[i]){
							if(isTagSelected(array[i])){
								sb.append("<span class='btn btn-sm tag-ball tag-selected' href='javascript:;' >");	
								sb.append(array[i]);
								sb.append("</span>");
							}else{
								sb.append("<a class='btn btn-sm tag-ball' href='javascript:;' ");
								if(record.subject_type){
									sb.append(" onclick=\"selectTag('");
									sb.append(record.subject_type.value);
									sb.append("',this.innerHTML);\" ");
								}
								sb.append(" >");	
								sb.append(array[i]);
								sb.append("</a>");
							}
						}
					} //end for(var i = 0;i < array.length;i++)
				} //end if(array && array.length > 0)
			} //end 	if(subjectTags)
		} //end if(record.subject_tags)
		sb.append("<div class='clearfix'></div>");
		sb.append("</div>");
		
		//<!--基本信息->
		sb.append("<div class=''>");
		
		
		
		
		
		
		
			if(record.contact_object){
					sb.append("<li>");
			sb.append(record.contact_object.display);
		
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_object.show);
			sb.append("</span>");
			sb.append("</li>");
			
		
		}
			if(record.contact_objectid){
					sb.append("<li>");
			sb.append(record.contact_objectid.display);
		
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_objectid.show);
			sb.append("</span>");
			sb.append("</li>");
			
		
		}
			if(record.contact_remark){
					sb.append("<li>");
			sb.append(record.contact_remark.display);
		
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_remark.show);
			sb.append("</span>");
			sb.append("</li>");
			
		
		}
		  
		 	if(record["ContactAddress-value"]!=0){
				  sb.append("<li>地址");
			sb.append(" : ");
			if(record["ContactAddress-value"]==1) {
			sb.append("<span>");
			sb.append(record["ContactAddress-record"]["name"]);
			sb.append("</span>&nbsp;&nbsp;&nbsp;");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"]["address_country"]["show"]);
			sb.append("</span>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"]["address_state"]["value"]);
			sb.append("</span></br>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"]["address_city"]["value"]);
			sb.append("</span>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"]["address_street"]["value"]);
			sb.append("</span>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"]["address_landmark"]["value"]);
			sb.append("</span>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"]["address_zip"]["value"]);
			sb.append("</span>");
				
				
			}else {
			for(var i=0;i<record["ContactAddress-value"];i++) {	
			sb.append("<span>");
			
			sb.append(record["ContactAddress-record"][i]["name"]);
		
			sb.append("</span>&nbsp;&nbsp;&nbsp;");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"][i]["address_country"]["show"]);
			sb.append("</span>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"][i]["address_state"]["value"]);
			sb.append("</span>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"][i]["address_city"]["value"]);
			sb.append("</span>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"][i]["address_street"]["value"]);
			sb.append("</span>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"][i]["address_landmark"]["value"]);
			sb.append("</span>");
			sb.append("<span>");
			sb.append(record["ContactAddress-record"][i]["address_zip"]["value"]);
			sb.append("</span></br>");
	
				
				
			}
			
			}
		 		sb.append("</li>");
		
		}else {
			  sb.append("<li>");
			sb.append("地址:");
			sb.append(" : ");
			sb.append("<span>");
			sb.append("空");
			sb.append("</span>");
			sb.append("</li>");
			
			
		}
		
		
		
		 	if(record["ContactEmail-value"]!=0){ 
			
			
				if(record["ContactEmail-value"]==1) {
		        putEmail(record["ContactEmail-record"],sb);
				
				
			}else {
			for(var i=0;i<record["ContactEmail-value"];i++) {	
		
		   putEmail(record["ContactEmail-record"][i],sb);
			
			
			  }
			}
			
			
			}else {
			  sb.append("<li>");
			sb.append("邮箱:");
			sb.append(" : ");
			sb.append("<span>");
			sb.append("空");
			sb.append("</span>");
			sb.append("</li>");
			
			
		}
		
		
		//遍历电话
		
		 	if(record["ContactTelephone-value"]!=0){ 
			
			
				if(record["ContactTelephone-value"]==1) {
		        putTele(record["ContactTelephone-record"],sb);
				
				
			}else {
			for(var i=0;i<record["ContactTelephone-value"];i++) {	
		
		   putTele(record["ContactTelephone-record"][i],sb);
			
			
			  }
			}
			
			
			}else {
			  sb.append("<li>");
			sb.append("电话:");
			sb.append(" : ");
			sb.append("<span>");
			sb.append("空");
			sb.append("</span>");
			sb.append("</li>");
			
			
		}
		
		//遍历全时通
			if(record["ContactInstance-value"]!=0){ 
			
			
				if(record["ContactInstance-value"]==1) {
		        putInstance(record["ContactInstance-record"],sb);
				
				
			}else {
			for(var i=0;i<record["ContactInstance-value"];i++) {	
		
		   putInstance(record["ContactInstance-record"][i],sb);
			
			
			  }
			}
			
			
			}else {
			  sb.append("<li>");
			sb.append("即时通:");
			sb.append(" : ");
			sb.append("<span>");
			sb.append("空");
			sb.append("</span>");
			sb.append("</li>");
			
			
		}
	
		
		sb.append("</div>");
	
	   //显示信息结束
         
		 
		 		//<!--所属小组-->
		
		
		sb.append("<div class='clearfix'></div>");
		sb.append("</div>"); //end flow-item-box col-md-4 col-sm-4
		
		
		if(target) {
		           
						target.insertAdjacentHTML('BeforeEnd',sb.toString());
		}
		
	
	}//end if(record)
}

function putEmail(obj,mainInfo) {
	        mainInfo.append("<li>邮箱");
			mainInfo.append(" : ");
          	mainInfo.append("<span>");
			mainInfo.append(obj["email_name"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(obj["email_address"]["value"]);
			mainInfo.append("</span>   ");
				mainInfo.append("<a href='#'><span class='fa fa-send (alias)' style='color:#2A86C3;' title='发送邮件'>");
		
			mainInfo.append("</span></a>   ");
			
				mainInfo.append("<a href='#'><span class='fa fa-random'  title='历史通信'>");
		
			mainInfo.append("</span></a>");
			mainInfo.append("</li>");	
	      
	
}


function putTele(obj,mainInfo) {
	
	        mainInfo.append("<li>电话");
			mainInfo.append(" : ");
          	mainInfo.append("<span>");
			mainInfo.append(obj["telephone_name"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(obj["telephone_type"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(obj["telephone_phone"]["value"]);
			mainInfo.append("</span>   ");
				mainInfo.append("<a href='#'><span class='fa fa-send (alias)' style='color:#2A86C3;' title='发送邮件'>");
		
			mainInfo.append("</span></a>   ");
			
				mainInfo.append("<a href='#'><span class='fa fa-random'  title='历史通信'>");
		
			mainInfo.append("</span></a>");
			mainInfo.append("</li>");	
	
	
}


function putInstance(obj,mainInfo) {
	
	        mainInfo.append("<li>即时通");
			mainInfo.append(" : ");
          	mainInfo.append("<span>");
			mainInfo.append(obj["instance_name"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(obj["instance_type"]["value"]);
			mainInfo.append("</span>   ");
			mainInfo.append("<span>");
			mainInfo.append(obj["instance_address"]["value"]);
			mainInfo.append("</span>   ");
				mainInfo.append("<a href='#'><span class='fa fa-send (alias)' style='color:#2A86C3;' title='发送信息'>");
		
			mainInfo.append("</span></a>   ");
			
				mainInfo.append("<a href='#'><span class='fa fa-random'  title='历史通信'>");
		
			mainInfo.append("</span></a>");
			mainInfo.append("</li>");	
	
	
}



//判断标签是否被选中
function isTagSelected(tag){
	var ulObj = document.getElementById('selected-subject-tag-ul');
	if(!ulObj)
		return false;
		
	var lis = ulObj.getElementsByTagName("li");
	var isExist = false;	//判断是否存在
	if(lis && lis.length > 0){
		for(var i=0;i < lis.length;i++){
			if(lis[i] && typeof lis[i] == "object"){
				var attr = lis[i].getAttribute("data-attr");
				if(!attr)
					continue;
				if(tag && tag == attr){
					isExist = true;
					break;
				}
			}//end if(typeof lis[i] == "object")		
		}//end for(var i=0;i < lis.length;i++)	
	}//end if(lis && lis.length > 0)
	
	return isExist;	
}

//鼠标达到名片范围时图标显示
function showIcon(id) {
	

	document.getElementById("icon"+id).style.display="";
}

//鼠标离开某个区域时 隐藏图标
function hideIcon(id) {
 	
	document.getElementById("icon"+id).style.display="none";
}

//获取发布者的头像
function getSubjectOwnerIcon(subjectId,userId,userName){
	var mydata={};
	mydata["objectName"]="User";
	mydata["action"]="readInfo";
	mydata["user_id"] = userId;
	mydata["icon"] = "1";
		
	$.ajax({
		async: true,
		type: "post",
		url: getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		error: function(request) {
		},
		success: function(data) {
			if(data.code==0){
				var record=data["record"];
				if(record){
					var sb = new StringBuffer();
					sb.append("<a target='_blank' href='../../contac/js/");
					sb.append(getRootPath());
					sb.append("http/tekinfo/user/read.html?user_id=");
					if(record.id)
						sb.append(record.id);
					sb.append("' title='");
					if(record.name)
						sb.append(record.name);
					sb.append("'>");
					if(record.icon && record.icon.length > 0){
						sb.append("<img width='40' height='40' src='../../contac/js/");
						if(record.icon)
							sb.append(record.icon);
						sb.append("' />");
					}else{
						if(record.name)
							sb.append(record.name);
					}
					sb.append("</a>");
					$("#box-subject-owner-"+subjectId).html(sb.toString());
			   }else{
					var sb = new StringBuffer();
					sb.append("<a target='_blank' href='../../contac/js/");
					sb.append(getRootPath());
					sb.append("http/tekinfo/user/read.html?user_id=");
					sb.append(userId);
					sb.append("' title='");
					sb.append(userName);
					sb.append("'>");
					sb.append(userName);
					sb.append("</a>");
					$("#box-subject-owner-"+subjectId).html(sb.toString());
				} //end if (record)**/
		    }else{
				var sb = new StringBuffer();
				sb.append("<a target='_blank' href='../../contac/js/");
				sb.append(getRootPath());
				sb.append("http/tekinfo/user/read.html?user_id=");
				sb.append(userId);
				sb.append("' title='");
				sb.append(userName);
				sb.append("'>");
				sb.append(userName);
				sb.append("</a>");
				$("#box-subject-owner-"+subjectId).html(sb.toString());
			}//end if (data.code==0)
		} //end success: function(data)
	});
}

//--------------------------list------------
//添加数据操作 --主题以列表方式显示时调用
function appendListOperation(record,data,sb) {
	if(!record || !data || !sb)
		return;
	
	var id=record.id;
	
	sb.append("<span id='operate-");
	if(id){
		sb.append(id);
	}
	sb.append("'>");
	
	sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readInfo(\"");
	if(id){
		sb.append(id);
	}
	sb.append("\");'>");
	sb.append("<ib class='icon-ok'>查看</b> </button>");
	
	if(mySecurity >= 0x40){
		sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editInfo(\"");
		if(id){
			sb.append(id);
		}
		sb.append("\");'>");
	
		sb.append("<b class='icon-pencil'>编辑</b> </button>" );
	
		sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:deleteInfo(\"");
		if(id){
			sb.append(id);
		}
		sb.append("\",\"");
		if(record.name){
			sb.append(record.name);
		}
		sb.append("\");'>");
		sb.append("<b class='icon-remove'>删除</b> </button>");
	}
	sb.append("</span>");
}


//----------------------------------------list方式显示的操作方法---------------------------------------------
//查看用户
function readInfo(id){ 
	window.open("../read/?subject_id="+id+"&show-close=1&refresh-opener=1");
}
			
//编辑用户
function editInfo(id){ 
	window.open("../edit/?subject_id="+id+"&show-close=1&refresh-opener=1");
} 


//删除用户
function deleteInfo(id, name){
	var params={};
	params["objectName"]="Subject";
	params["action"]="removeInfo";
	params["subject_id"]=id;
	
	removeInfo(id,name, getRootPath()+"servlet/tobject", params);
}


//------------------------------------------index、icon方式显示的操作方法----------------------------------------------------
/**
 * 按order列排序。
 *
 * @param order
 *           排序字段名
 */
function changeCustomOrder(changeOrder){
	if(order==changeOrder){
		if(desc==1 || desc=="1" || desc==true || desc=="true")
			desc=0;
		else
			desc=1;
	}else
		desc=0;
	
	if(changeOrder){
		params["order"]=changeOrder;
		order=changeOrder;
		params["desc"]=desc;
	}
	
	if(changeOrder == "subject_date"){
		if(params["desc"]==0){
			params["order"] = "subject_date, createTime";
		}else{
			params["desc"]=0;
			params["order"] = "subject_date DESC, createTime DESC"
		}
	}
	
	params["skip"]=0;
	alert("go to it");
	$("#table-infos").html("");
	getList();
}


//------------------------------------------通用方法（mac-list.js调用）-------------------------------------------------
/**
 * 显示默认的列表翻页按钮
 *
 * @param data
 *           检索结果
 */
function showCustomListTurn(data) {
	if(displayWay==0){
		$("#more_page").addClass("hidden"); 
		$("#ajax-load-div").addClass("hidden");
		showDefaultListTurn(data);
		return;
	}
	
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
	count=params["count"];
	  
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
	sb.append("页 共");
	sb.append(total);
	sb.append("条</div>");
	sb.append("</li>");
	
	elem.innerHTML=sb.toString();  
  
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
	setTimeout("flowFlushDisplay()", 500);
}


//---------------------------------------------通用方法（index.js调用）-------------------------------------
/**
*	获取所有选中的标签
*
*	@return 返回所有选中的标签，多个标签用';'隔开
*	
*/
function getAllSelectedTags(){
	var tags = new StringBuffer();	//
	var ulObj = document.getElementById('selected-subject-tag-ul');
	if(!ulObj)
		return;
	
	var lis = ulObj.getElementsByTagName("li");
	var flag = true;
	if(lis && lis.length > 0){
		currentSelectedTagsCount = 0;	//重新计算标签个数
		for(var i=0;i < lis.length;i++){
			if(typeof lis[i] == "object"){
				var attr = lis[i].getAttribute("data-attr");
				if(!attr)
					continue;
				}//end if(typeof lis[i] == "object")	
				currentSelectedTagsCount++;	//当前选中的标签数
				if(flag){	
					tags.append(attr);
					flag = false;
				}else{
					tags.append(";");
					tags.append(attr);
				}
		}//end for(var i=0;i < lis.length;i++)	
	}//end if(lis && lis.length > 0)

	return tags.toString();
}

//显示内容
function showSubjectTagsContent(record,subjectType,ulObj){
	if(record){
		var sb = new StringBuffer();
		
		sb.append("<li>");
		
		sb.append("<a href='javascript:void(0);' style='color:");
		if(record.tag_user.value!=0&&record.tag_group.value==0)
		{
		   sb.append("#5bc0de");
		}
		else if(record.tag_group.value!=0&&record.tag_user.value==0)
		{
		   sb.append("#eec198");
		}
		else if(record.tag_user.value==0&&record.tag_group.value==0)
		{
		   sb.append("#333");
		}
		sb.append(";' onclick=\"selectTag('");
		if(subjectType)
			sb.append(subjectType);
		sb.append("',");
		sb.append("this.innerHTML");
		sb.append(");\" >");
		if(record.name){	  
		   sb.append(record.name);	
		}
		sb.append("</a>");
		
		sb.append("</li>");
		
		if(ulObj)
			ulObj.insertAdjacentHTML('BeforeEnd',sb.toString());
		if(decodeURIComponent(request["subject_tags"])&&decodeURIComponent(request["subject_tags"])==record.name){
			selectTag(subjectType,record.name);
		}
			
	}//end if(record)
}


//------------------------------------------------------通用函数（适用于本js文件）-------------------------------
//快速检索字段凸显过滤函数
// checkRecordIteam：被检查的record字段对象；searchRecordItemArray：检索record字段数组；keyword：检索关键字
function quickSearchKeywordFilter(checkRecordItem, searchRecordItemArray, keyword){
	if(!searchRecordItemArray || toString.apply(searchRecordItemArray)!=="[object Array]" || !keyword || keyword=="undefined")
		return checkRecordItem.show;
	
	for(var i=0; i<searchRecordItemArray.length; i++){
		if(checkRecordItem.name == searchRecordItemArray[i]){
			var reg = new RegExp(keyword, "gi");
			var replaceText = "<font color='#F00'>" + keyword + "</font>";
			return checkRecordItem.show.replace(reg, replaceText);
		}
	}
	return checkRecordItem.show;
}



//-----------------------------------------------------End-------------------------------------