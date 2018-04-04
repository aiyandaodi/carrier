// JavaScript Document


/**
* 列表用户
*/
function list(skip, count,order,desc){
 	var listitemObj= document.getElementById("listitem");
	if(listitemObj)
		listitemObj.innerHTML = "";
			
	var mydata={};
	mydata["objectName"]="User";
	mydata["action"]="getList";
	
	mydata["skip"]=skip;
	mydata["count"]=count;
	if(order){
		mydata["order"]=order;
		if(desc)
			mydata["desc"]=1;
	}//en if(order)
	var quickSearch;
	var qs=document.getElementById("quick-search");
	if(qs && qs.value != "" && qs.value != "用户查询"){
		mydata["quick-search"] = encodeURI(qs.value);
		quickSearch = qs.value;
	}
	mydata["icon"] = 1;
	//alert(JSON.stringify(mydata));
	$.ajax({
		async: true,
		type: "post",
		url: "../../../servlet/tobject",
		dataType: "json",
		data: mydata,
	
		error: function(request) {
		},
		success: function(data) {
			//alert(JSON.stringify(data));
			var currentSkip = parseInt(skip);
			var totalCount = parseInt(data.value);
			var pageCount = parseInt(count);
			if(data.code == 0){
				var record = data["record"];
				if(record){
					if(record.length){
						for(var i in record){
							showList(record[i],quickSearch);
						}
					}else{
						showList(record,quickSearch);
					}//end if(record,length)
				}//end if(record)
			}
			showTurnPageAndCount(currentSkip,totalCount,pageCount);
		} //end success: function(data)
	});
}

function showList(record,quickSearch){
	if(record){
		var sb = new StringBuffer();
		sb.append("<ul id='user_");
		sb.append(record.id);
		sb.append("' class='item_area icon item1' name='item'>");
		
		//
		sb.append("<li class='confix'>");
		sb.append("<span class='user_online'>");
		if(record.user_online)
			sb.append(record.user_online.show);
		sb.append("</span>");
		sb.append("<span class='user_security'>");
		if(record.user_security)
			sb.append(record.user_security.show);
		sb.append("</span>");
		
		sb.append("<a class='user_name' target='_blank' href='../../../user/index/read/index.html?user_id=");
		sb.append(record.id);
		sb.append("&user_name=");
		sb.append(record.name);
		sb.append("&show-close=1");
		sb.append("'>");
		//快速查询值为红色字体
		var loc = -1;
		if(quickSearch && quickSearch != ""){
			loc = record.name.indexOf(quickSearch);
			if (loc >= 0) {
				sb.append(record.name.substring(0, loc));
				sb.append("<font color='#FF0000'>");
				sb.append(record.name.substring(loc, loc + quickSearch.length));
				sb.append("</font>");
				sb.append(record.name.substring(loc + quickSearch.length));
			} else 
				sb.append(record.name);
		} else{
			sb.append(record.name);
		}//end if(quickSearch && quickSearch != "")
		sb.append("</a>");
		sb.append("</li><!--end.confix-->");
		
		//
		sb.append("<li class='user_code_index_title field_title'>");
		if(record.user_code)
			sb.append(record.user_code.display+": ");
		sb.append("</li>");
		sb.append("<li class='user_code' ");
		if(record.user_code){
			sb.append(" title='");
			sb.append(record.user_code.value);
			sb.append("' >");
			sb.append(record.user_code.value);
		}else
			sb.append(">");
		sb.append("</li>");
		
		//
		sb.append("<li class='user_sex_index_title field_title'>");
		if(record.user_sex)
			sb.append(record.user_sex.display+": ");
		sb.append("</li>");
		sb.append("<li class='user_sex' ");
		if(record.user_sex){
			sb.append(" title='");
			sb.append(record.user_sex.show);
			sb.append("' >");
			sb.append(record.user_sex.show);
		}else
			sb.append(">");
		sb.append("</li>");
		
		//
		sb.append("<li class='user_birthday_index_title field_title'>");
		if(record.user_birthday)
			sb.append(record.user_birthday.display+": ");
		sb.append("</li>");
		sb.append("<li class='user_birthday' ");
		if(record.user_birthday){
			sb.append(" title='");
			sb.append(record.user_birthday.show);
			sb.append("' >");
			sb.append(record.user_birthday.show);
		}else
			sb.append(">");
		sb.append("</li>");
		
		//
		sb.append("<li class='user_onlineTime_index_title field_title' > ");
		if(record.user_onlineTime)
			sb.append(record.user_onlineTime.display+": ");
		sb.append("</li>");
		sb.append("<li class='user_onlineTime'");
		if(record.user_onlineTime){
			sb.append(" title='");
			sb.append(record.user_onlineTime.show);
			sb.append("' >");
			sb.append(record.user_onlineTime.show);
		}else
			sb.append(">");
		sb.append("</li>");
		
		//
		sb.append("<li class='user_latestTime_index_title field_title' > ");
		if(record.user_latestTime)
			sb.append(record.user_latestTime.display+": ");
		sb.append("</li>");
		sb.append("<li class='user_latestTime'");
		if(record.user_latestTime){
			sb.append(" title='");
			sb.append(record.user_latestTime.show);
			sb.append("' >");
			sb.append(record.user_latestTime.show);
		}else
			sb.append(">");
		sb.append("</li>");
		
		//
		sb.append("<li class='user_latestIp_index_title field_title' > ");
		if(record.user_latestIp)
			sb.append(record.user_latestIp.display+": ");
		sb.append("</li>");
		sb.append("<li class='user_latestIp'");
		if(record.user_latestIp){
			sb.append(" title='");
			sb.append(record.user_latestIp.show);
			sb.append("' >");
			sb.append(record.user_latestIp.show);
		}else
			sb.append(">");
		sb.append("</li>");
		
		sb.append("<li class='user_other' > ");
		sb.append("</li>");
		
		//
		sb.append("<li class='avatar'>");
		sb.append("<a target='_blank' href='../read/index.html?user_id=");
		sb.append(record.id);
		sb.append("&user_name=");
		sb.append(record.name);
		sb.append("&show-close=1");
		sb.append("'>");
		sb.append("<img src='../../../user/index/js/");
		if(record.icon)
			sb.append(record.icon);
		sb.append("' />");
		sb.append("</li><!-- end.avatar-->");
		sb.append("<li class='arrow'></li>");
		sb.append("<li class='last-column'></li>");
		sb.append("</ul>");
		
		var listitemObj= document.getElementById("listitem");
		if(listitemObj){
			listitemObj.insertAdjacentHTML('BeforeEnd', sb.toString());
		}
	}//end if(record)
}

/**
* 显示翻页
*/
function showTurnPageAndCount(currentSkip,totalCount,pageCount){
	//alert(totalCount+"---"+pageCount+"---"+currentSkip);
		
	if(currentSkip > totalCount)
		return;
		
	var turnMenuObj= document.getElementById("turn-menu");
	if(!turnMenuObj)
		return ;
	turnMenuObj.innerHTML = "";
		
	var sb = new StringBuffer();
	//首页	
	if(totalCount > pageCount && currentSkip > 0){
		sb.append("<li>");
		sb.append("<a href='javascript:void(0);' onclick=\"list(");
		sb.append(0);
		sb.append(",");
		sb.append(pageCount);
		sb.append(",'");
		sb.append(PAGE_ORDER);
		sb.append("',");
		sb.append(PAGE_DESC);
		sb.append(");\" >");
		sb.append("首页");
		sb.append("</a>");
		sb.append("</li>");
		
		//上一页
		sb.append("<li>");
		sb.append("<a href='javascript:void(0);' onclick=\"list(");
		if(currentSkip > pageCount)
			sb.append((currentSkip - pageCount));
		else
			sb.append(0);
		sb.append(",");
		sb.append(pageCount);
		sb.append(",'");
		sb.append(PAGE_ORDER);
		sb.append("',");
		sb.append(PAGE_DESC);
		sb.append(");\" >");
		sb.append("上一页");
		sb.append("</a>");
		sb.append("</li>");
	}
	//下一页
	if(totalCount > pageCount && pageCount >0 && totalCount > (currentSkip+pageCount)){
		sb.append("<li>");
		sb.append("<a href='javascript:void(0);' onclick=\"list(");
		sb.append((currentSkip+pageCount));
		sb.append(",");
		sb.append(pageCount);
		sb.append(",'");
		sb.append(PAGE_ORDER);
		sb.append("',");
		sb.append(PAGE_DESC);
		sb.append(");\" >");
		sb.append("下一页");
		sb.append("</a>");
		sb.append("</li>");
		
		//末页
		sb.append("<li>");
		sb.append("<a href='javascript:void(0);' onclick=\"list(");
		if((totalCount%pageCount) == 0)	//整除
			sb.append((totalCount-pageCount));
		else
			sb.append(Math.floor(totalCount / pageCount) * pageCount);
		sb.append(",");
		sb.append(pageCount);
		sb.append(",'");
		sb.append(PAGE_ORDER);
		sb.append("',");
		sb.append(PAGE_DESC);
		sb.append(");\" >");
		sb.append("末页");
		sb.append("</a>");
		sb.append("</li>");
	}
	turnMenuObj.innerHTML = sb.toString();
	
	//
	var listCountObj= document.getElementById("list-count");
	if(!listCountObj)
		return ;
	listCountObj.innerHTML = (currentSkip+1)+"/"+totalCount;
}
