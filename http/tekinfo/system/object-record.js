// JavaScript Document
function showMessage(msg,target){
	var obj = document.getElementById(target);
	if(obj)
		obj.insertAdjacentHTML('BeforeEnd',msg);
	else
		alert(msg);
}
function showMessage(msg){
	var obj = document.getElementById("message");
	if(obj)
		obj.insertAdjacentHTML('BeforeEnd',msg);
	else
		alert(msg);
}

var SHOW_COUNT = 10;	//每次显示的个数
var OBJECT_RECORD_LIST = "object-record-list";	
var SHOW_PAGES_BY_GROUP = 10;	//每组显示的页数 		


//翻页显示
// 参数： every--每次显示的个数
//		total---总共的个数
//		target--翻页显示位置
//		target2--主题显示的位置
function changePage(every,total,target,target2){
	//alert(every);
	//总数大于每次显示的时候，才会出现多页
	if(total >= every){
		if(every == 0){	//空数据
			pages = 1;
		}else{
			var pages = Math.floor(total/every);
			if(Math.floor(total%every) > 0)
				pages += 1;
		}
		var groupCount = Math.floor(pages/SHOW_PAGES_BY_GROUP);
		if(groupCount == 0)
			groupCount =1;
		else{
			if(Math.floor(pages%SHOW_PAGES_BY_GROUP) > 0)
				groupCount +=1;
		}
		//alert("total:"+total+" every:"+every+" pages:"+pages+"groupCount:"+groupCount);
		showChangePage(every,pages,total,1,groupCount,target,target2);
	}
}
//显示翻页于页面上
// 参数： every--每次显示的个数
//      pages--总的页数
//		total---总共的个数
//		currentGroup--当前组
//		groupCount--组数
//		target--显示位置
function showChangePage(every,pages,total,currentGroup,groupCount,target,target2){
	
	var sb = new StringBuffer();
	//alert(show_pagse);
	//如果当前组是第一组或者只有一组
	if(groupCount == 1 || currentGroup == 1){
		sb.append("<li title='上一组");
		sb.append("' class='active' >");
	}else{
		sb.append("<li title='上一组");
		sb.append("' onclick=showChangePage('");
		sb.append(every);
		sb.append("',");
		sb.append(pages);
		sb.append(",");
		sb.append(total);
		sb.append(",");
		sb.append(currentGroup-1);
		sb.append(",");
		sb.append(groupCount);
		sb.append(",'");
		sb.append(target);
		sb.append("','");
		sb.append(target2);
		sb.append("');>");
	}	
	sb.append("<a href='javascript:'>上一组");
	sb.append("</a></li>");
	
	//最后一组或只有一组
	if(currentGroup==groupCount || groupCount == 1){
		//显示页面
		var index = 0;
		for(var i = (currentGroup-1)*SHOW_PAGES_BY_GROUP;i < pages;i++){
			var isActive = false; 	//当前页
			if(i==objectRecordListCurrent-1)
				isActive = true;
			index++;
			if(isActive)
				sb.append("<li class='active' title='第"+(i+1)+"页' onclick=changePageBtn('");
			else
				sb.append("<li title='第"+(i+1)+"页' onclick=changePageBtn('");
			sb.append(index);
			sb.append("','");
			sb.append(target);
			sb.append("',");
			sb.append(i+1);
			sb.append(",");
			sb.append(every);
			sb.append(",");
			sb.append(pages);
			sb.append(",");
			sb.append(total);
			sb.append(",'");
			sb.append(target2);
			sb.append("');>");
			sb.append("<a href='javascript:'>");
			sb.append(i+1);
			sb.append("</a></li>");
		}
	}else{
		//显示页面
		var index = 0;
		for(var i = (currentGroup-1)*SHOW_PAGES_BY_GROUP;i < (currentGroup-1)*SHOW_PAGES_BY_GROUP+SHOW_PAGES_BY_GROUP;i++){
			var isActive = false; 	//当前页
			if(i==objectRecordListCurrent-1)
				isActive = true;
			index++;
			if(isActive)
				sb.append("<li class='active' title='第"+(i+1)+"页' onclick=changePageBtn('");
			else
				sb.append("<li title='第"+(i+1)+"页' onclick=changePageBtn('");
			sb.append(index);
			sb.append("','");
			sb.append(target);
			sb.append("',");
			sb.append(i+1);
			sb.append(",");
			sb.append(every);
			sb.append(",");
			sb.append(pages);
			sb.append(",");
			sb.append(total);
			sb.append(",'");
			sb.append(target2);
			sb.append("');>");
			sb.append("<a href='javascript:'>");
			sb.append(i+1);
			sb.append("</a></li>");
		}
	}
	//alert(currentGroup);
	//只有一组或者最后一组
	if(groupCount == 1 || currentGroup == groupCount){
		sb.append("<li title='下一组");
		sb.append("' class='active' >");
	}else{
		sb.append("<li title='下一组");
		sb.append("' onclick=showChangePage('");
		//显下上一组
		sb.append(every);
		sb.append("',");
		sb.append(pages);
		sb.append(",");
		sb.append(total);
		sb.append(",");
		sb.append(currentGroup+1);
		sb.append(",");
		sb.append(groupCount);
		sb.append(",'");
		sb.append(target);
		sb.append("','");
		sb.append(target2);
		sb.append("');>");
	}
	sb.append("<a href='javascript:'>下一组");
	sb.append("</a></li>");
	
	//提示
	sb.append("<li class='active'><a>每组");
	sb.append(SHOW_PAGES_BY_GROUP);
	sb.append("页,当前第");
	sb.append(currentGroup);
	sb.append("组，共"+groupCount+"组</a></li>");
	
	var obj = document.getElementById(target);
	if(obj){
		$("#"+target).empty();
		obj.insertAdjacentHTML('BeforeEnd', sb.toString());
	}
}

//翻页处理
// 参数:toPage 选中的页面
// 	every---每页显示的个数
//  total---总个数'
//  target---翻页显示的位置
//  target2---主题显示的位置
var objectRecordListCurrent = 1;

function changePageBtn(li_index,target,toPage,every,pages,total,target2){
	//alert(pages);
	var list_start = 0;
	//指定组下的主题
	if(target2 == OBJECT_RECORD_LIST){
		//判断（条件）：选择显示的页面的不是当前已经显示的页面，并且显示首页或者尾页时不能点击上一页或者下一页
		if(objectRecordListCurrent != toPage){
		
			list_start = every*(toPage-1);
						
			//alert(list_start);
			//重新查询
			var every_count = getObjectRecordList(record_object,list_start,every,record_objectid,"object-record-list");
			
			objectRecordListCurrent = toPage;	//重新设置当前页
			
			//设置翻页css属性
			var lis = document.getElementById(target).getElementsByTagName("li");
			for(var i = 0 ;i < lis.length;i++){
				if(i!= 0 && i!= lis.length-1 && i!= lis.length-2)	//不改变组翻页
					lis[i].className = "";	
			}
			lis[li_index].className = "active";
		}
		else
		   return;
	
	}
}

//获取对象记录的条数
function getObjectRecordCount(record_object,record_objectid){
	var count = 0;
	var mydata={};
	mydata["objectName"]="ObjectRecord";
	mydata["action"]="getTotal";

	mydata["order"]="modifyTime";
	mydata["skip"]=0;
	mydata["desc"] = true;
	
	mydata["record_object"] = record_object;
	mydata["record_objectid"] = record_objectid;
	
	$.ajax({
		async: false,
		type: "post",
		url: "../servlet/tobject",
		dataType: "json",
		data: mydata,
		error: function(request) {
            showMesage("读取主题Subject失败!"+request);
        },
		success: function(data) {
			//alert(data.code+data.message);
			//alert(JSON.stringify(data));
			if (data.code==0){
				count = data.value;
			}  //end if (data.code==0)
			else{
				showMessage(data.code+data.message);
			}
 	    } //end success: function(data)
	});
	return count;
}

//对象记录
function getObjectRecordList(record_object,list_start,show_count,record_objectid,target){
	var count = 0;
	var mydata={};
	mydata["objectName"]="ObjectRecord";
	mydata["action"]="getList";

	mydata["order"]="modifyTime";
	mydata["skip"]=list_start;
	mydata["desc"] = true;
	
	if(show_count && show_count != 0){
		mydata["count"] = show_count;	
	}
	
	mydata["record_object"] = record_object;
	mydata["record_objectid"] = record_objectid;
	
	$.ajax({
		async: false,
		type: "post",
		url: "../servlet/tobject",
		dataType: "json",
		data: mydata,
		error: function(request) {
            showMesage("读取主题Subject失败!"+request);
        },
		success: function(data) {
			//alert(data.code+data.message);
			//alert(JSON.stringify(data));
			//alert(tek.right.isCanAdmin(data.right));
			$("#"+target).empty();			//清空
			if (data.code==0){
				var record = data["record"];
				if(record){
					if(record.length){
						for(var i in record){
							var flag =showObjectRecordList(record[i],target);
							if(flag)
								count ++;
						}
					}else{
						var flag =showObjectRecordList(record,target);
						if(flag)
							count ++;
					}
				}// end record
			}  //end if (data.code==0)
			else{
				showMessage(data.code+data.message);
			}
 	    } //end success: function(data)
	});
	return count;
}

function showObjectRecordList(record,target){
	//alert(JSON.stringify(record));
	var flag = false;
	if(record){
		var sb = new StringBuffer();
		
		//记录时间
		sb.append("<tr>");
		
		sb.append("<td>");
		sb.append(record.record_time.show);
		sb.append("</td>");
		
		//操作者
		sb.append("<td>");
		//管理员和自己可读
		if(isCanReadUser(record.record_user.value) || myId == record.record_user.value){
			sb.append("<a href='javascript:void(0);' onclick='openThisUser(");
			sb.append(record.record_user.value);
			sb.append(")' >");
		}
		sb.append(record.record_user.show);
		if(isCanReadUser(record.record_user.value) || myId == record.record_user.value){
			sb.append("</a>");
		}
		sb.append("</td>");
	
		//操作命令
		sb.append("<td>");
		if(record.record_command.show == "read")
			sb.append("读取（");
		else if(record.record_command.show == "edit")
			sb.append("编辑（");
		else if(record.record_command.show == "add")
			sb.append("创建（");
		else if(record.record_command.show == "list")
			sb.append("列表（");
		else if(record.record_command.show == "remove")
			sb.append("删除（");
		sb.append(record.record_command.show);
		sb.append("）</td>");
		
		//记录对象
		sb.append("<td>");
		sb.append(record.record_object.show);
		sb.append("</td>");
		
		//对象名字
		sb.append("<td>");
		var linkFlag = false;
		if(record.record_object.show == "Subject"){
			sb.append("<a href='javascript:openThisSubject(");
			linkFlag = true;
		}else if(record.record_object.show == "Member"){
			sb.append("<a href='javascript:openThisMember(");
			linkFlag = true;
		}else if(record.record_object.show == "User"){
			sb.append("<a href='javascript:openThisUser(");
			linkFlag = true;
		}else if(record.record_object.show == "Group"){
			sb.append("<a href='javascript:void(0);' onclick='openThisGroup(");
			linkFlag = true;
		}
		if(linkFlag){
			sb.append(record.record_objectid.value);
			sb.append(")' >");
		}
		sb.append(record.record_objectid.show);
		if(linkFlag){
			sb.append("</a>");
		}
		sb.append("</td>");
		
		//操作内容
		sb.append("<td>");
		sb.append(record.record_remark.show);
		sb.append("</td>");
		
		//经度，纬度，高度
		sb.append("<td style='text-align:center;'>( ");
		sb.append(record.record_longitude.show);
		sb.append(" , ");
		sb.append(record.record_latitude.show);
		sb.append(" , ");
		sb.append(record.record_height.show);
		sb.append(" )</td>");
		
		//IP
		sb.append("<td>");
		sb.append(record.record_ip.show);
		sb.append("</td>");
		
		sb.append("</tr>");
		
		sb.append("<tr>");
		//操作平台
		sb.append("<td colspan='8'>");
		sb.append(record.record_os.show);
		sb.append("<br/><br/><br/><br/></td>");
		
		sb.append("</tr>");
		
		var obj = document.getElementById(target);
		if(obj)
			obj.insertAdjacentHTML('BeforeEnd',sb.toString());
		
		flag = true;
	}
	return flag;
}

//
function openThisSubject(subjectId){
	if(subjectId){
		var url = "subject-open.html?subject_id="+subjectId+"&cache="+Math.floor(Math.random()*1000000);
		window.open(url,"_blank");	
	}
}

function openThisMember(member_id){
	if(member_id){
		var url = "member-read.html?member_id="+member_id+"&cache="+Math.floor(Math.random()*1000000);
		window.open(url,"_blank");	
	}
}
function openThisUser(user_id){
	if(user_id){
		var url = "user-read.html?user_id="+user_id+"&cache="+Math.floor(Math.random()*1000000);
		window.open(url,"_blank");	
	}
}
function openThisGroup(group_id){
	if(group_id){
		var url = "group-open.html?group_id="+group_id+"&cache="+Math.floor(Math.random()*1000000);
		window.open(url,"_blank");	
	}
}

//读取到导航栏信息
function getObjectRecordName(record_object,list_start,record_objectid,target){
	var count = 0;
	var mydata={};
	mydata["objectName"]="ObjectRecord";
	mydata["action"]="getList";

	mydata["order"]="modifyTime";
	mydata["skip"]=list_start;
	mydata["desc"] = true;
	
	mydata["count"] = 1;	

	mydata["record_object"] = record_object;
	mydata["record_objectid"] = record_objectid;
	
	$.ajax({
		async: false,
		type: "post",
		url: "../servlet/tobject",
		dataType: "json",
		data: mydata,
		error: function(request) {
            showMesage("读取主题Subject失败!"+request);
        },
		success: function(data) {
			//alert(data.code+data.message);
			//alert(JSON.stringify(data));
			$("#"+target).empty();			//清空
			if (data.code==0){
				var record = data["record"];
				if(record){
						$("#"+target).append("<a href=\"javascript:tekRefresh();\">"+record.record_objectid.show+"</a><span class='divider'>/</span>");
				}// end record
			}  //end if (data.code==0)
			else{
				showMessage(data.code+data.message);
			}
 	    } //end success: function(data)
	});
	return count;
}


//判断当前用户是否有权限读取其他用户
function isCanReadUser(userId){
	var flag = false;
	
	var mydata={};
	mydata["objectName"]="User";
	mydata["action"]="getIdRight";  //getIdright
	
	mydata["user_id"] =userId;
	
	$.ajax({
			async: false,
			type: "post",
			url: "../servlet/tobject",
			dataType: "json",
			data: mydata,
			error: function(request) {
				showMesage("读取主题Subject失败!"+request);
			},
			success: function(data) {
				//alert(JSON.stringify(data));
				if (data.code==0){
					right = data.value;	//获取权限值
					flag = tek.right.isCanAdmin(right);
				}  //end if (data.code==0)
			} //end success: function(data)
	});
	//alert(flag);
	return flag;
}