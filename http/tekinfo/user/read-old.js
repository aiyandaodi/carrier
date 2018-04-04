// JavaScript Document
/**************************************************
 *	用户读取页面 index.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================
var DefaultCountPerPage = 3;	 //每页默认显示条数
var DefaultCountPerGroup = 2;	 //每组默认显示的条数

var subject_skip = 0;
var subject_total = 0; 		//记录总条数初始化
var subject_count = DefaultCountPerPage;	 //当前每页显示的条数
var currentFromPage = 1;	 //当前显示的页码起始值

var group_skip = 0;		//查询起始位置
var group_count = 3;	//每页显示个数
var group_total = 0;	//总共的个数

//=====================================================Function===============================
//--------------------------------------读取用户信息---------------------------------------
//用户信息	
function readUser(){
	var mydata = {};
	mydata["objectName"] = "User";
	mydata["action"] = "readInfo";
	mydata["user_id"] = userId;
	mydata["icon"] = 1;
			
	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		async: true,
		data: mydata,
		beforeSend: function() {
			var html=new StringBuffer();
			html.append("<div class='center'><img src='");
			html.append(tek.common.getRootPath());
			html.append("http/images/waiting-small.gif'/> 正在获取数据...</div>");
			$("#user_basic_info").html(html.toString());
		},
		success: function(data){
			if(data){
				if(data.code==0) {
					var record = data["record"];
					if(tek.right.isCanWrite(data.right)){
						$("#my_icon").attr("onclick","iconEdit()");
						$("#user_photo > span").removeClass("hidden").attr("onclick","iconEdit()");

						var editTarget = document.getElementById("editBut");
						if(editTarget){
							var sb = new StringBuffer();
							sb.append("<a class='btn alert alert-info' onclick='editUser()'><i class='fa fa-edit'>编辑</i></a>");
							editTarget.insertAdjacentHTML('BeforeEnd',sb.toString());
						}
					} //end if((data.right & 8)==8)
					if(record) {
						if(record.length)
							record = record[0];
						
						showUserInfo(record);
					} else {
						$("#user_info").html("<font>没有数据！</font>");
					}//end if(record) else
				} else {
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append("[");
					error.append(data.code);
					error.append(" - ");
					error.append(data.message);
					error.append("]");
					error.append("</font>");
					$("#user_info").html(error.toString());
				}//end if (data.code==0) else
			} else {
				$("#user_info").html("<font color='red'>操作失败![data=null]</font>");
			}//end if(data) else
		},//end success: function(data)
		error: function(request) {
			var error=new StringBuffer();
			error.append("<font color='red'>");
			error.append("读取对象失败[");
			error.append(request.status);
			error.append(" - ");
			error.append(request.responseText);
			error.append("]");
			error.append("</font>");
			$("#user_info").html(error.toString());
		},
	});
}

function showUserInfo(record){
	if(record){
		//头像		
		var url=record.icon;
		if(url){
			var icon=document.getElementById("my_icon");
			if(icon)
				icon.src=url;
		}

		//最近登录时间
		if(record.user_latestTime) {
			var user_latestTime=record.user_latestTime.show;
			if(user_latestTime)
			   $("#user_latestTime").html(user_latestTime);
		}

		//最近登录IP
		if(record.user_latestIp){
		   var user_latestIp=record.user_latestIp.show;
		   if(user_latestIp)
			  $("#user_latestIp").html(user_latestIp);
		}

		//当前登录时间 当前登录IP
		if(userId == myId){
			$("#user_currentTime").html(myLoginTime); //时间
			$("#user_currentIp").html(myLoginIp); //IP
		}else{
			$("#currentTime").html(null);
			$("#currentIp").html(null);
		}

		//是否在线
		//if(record.user_online){
		//   var user_online=record.user_online.show;
		//   if(user_online)
		//      document.getElementById("user_online").innerHTML=user_online;
		//}
		
		//-----------------基本信息-------------
		var sb = new StringBuffer();
		
		//用户编码
		if(record.user_code){
			sb.append("<div class='form-group'><label class='control-label col-xs-4' for='user_code'>用户编码</label>");
			sb.append("<div class='col-xs-8' style='padding-top:7px'><span id='user_code'>");
			if(record.user_code.show)
				sb.append(record.user_code.show);
			sb.append("</span></div></div>");
		}
		
		//用户姓名
		if(record.user_name){
			sb.append("<div class='form-group'><label class='control-label col-xs-4' for='user_name2'>用户姓名</label>");
			sb.append("<div class='col-xs-8' style='padding-top:7px'><span id='user_name2'>");
			if(record.user_name.show) {
				sb.append(record.user_name.show);
				$("#current_user").html(record.user_name.show);
			}
			sb.append("</span></div></div>");
		}
			   
		//性别
		if(record.user_sex){
			sb.append("<div class='form-group'><label class='control-label col-xs-4' for='user_sex'>用户性别</label>");
			sb.append("<div class='col-xs-8' style='padding-top:7px'><span id='user_sex'>");
			if(record.user_sex.show)
				sb.append(record.user_sex.show);
			sb.append("</span></div></div>");
		}
		
		//出生日期
		if(record.user_birthday){
			sb.append("<div class='form-group'><label class='control-label col-xs-4' for='user_birthday'>用户生日</label>");
			sb.append("<div class='col-xs-8' style='padding-top:7px'><span id='user_birthday'>");
			if(record.user_birthday.show)
				sb.append(record.user_birthday.show);
			sb.append("</span></div></div>");
		}
		
		//安全等级
		if(record.user_security){
			sb.append("<div class='form-group'><label class='control-label col-xs-4' for='user_security'>安全等级</label>");
			sb.append("<div class='col-xs-8' style='padding-top:7px'><span id='user_security'>");
			if(record.user_security.show)
				sb.append(record.user_security.show);
			sb.append("</span></div></div>");
		}
		
		//用户状态
		if(record.user_status){
			sb.append("<div class='form-group'><label class='control-label col-xs-4' for='user_status'>用户状态</label>");
			sb.append("<div class='col-xs-8' style='padding-top:7px'><span id='user_status'>");
			if(record.user_status.show)
				sb.append(record.user_status.show);
			sb.append("</span></div></div>");
		}
		
		//有效时间
		if(record.user_start || record.user_end){
			sb.append("<div class='form-group'><label class='control-label col-xs-4' for='user_valid_time'>有效时间</label>");
			sb.append("<div class='col-xs-8' style='padding-top:7px'><span id='user_valid_time'>");
			//有效时间start
			if(record.user_start.show)
			   sb.append(record.user_start.show);
			sb.append("  --  ");
			//有效时间end
			if(record.user_end.show)
			   sb.append(record.user_end.show); 
			sb.append("</span></div></div>");
		}
			 
		//所属客户端
		if(record.user_client){
			sb.append("<div class='form-group'><label class='control-label col-xs-4' for='user_client'>所属客户端</label>");
			sb.append("<div class='col-xs-8' style='padding-top:7px'><span id='user_client'>");
			if(record.user_client.show)
			   sb.append(record.user_client.show);
			sb.append("</span></div></div>");
		}
		
		//说明
		if(record.user_remark){
			sb.append("<div class='form-group'><label class='control-label col-xs-4' for='user_client'>说 明</label>");
			sb.append("<div class='col-xs-8' style='padding-top:7px'><span id='user_client'>");
			if(record.user_remark.show)
			   sb.append(record.user_remark.show);
			sb.append("</span></div></div>");
		}
		
		if($("#user_basic_info")[0])
			$("#user_basic_info").html(sb.toString());
	}
}

//编辑用户
function editUser(){
	var url="edit.html?user_id="+userId+"&show-close=1&refresh-opener=1";
	window.open(url);
}

//编辑用户头像
function iconEdit(){
	var url="icon-edit.html?user_id="+userId;
    window.open(url);
}

//---------------------------------------------显示主题----------------------------------------
//获取主题列表
function listSubject(){
	var target = document.getElementById("subject-list");
	if(!target){
		showError("主题显示区错误，请和管理员联系");
			return;
	}
	
	var mydata={};
	
	mydata["objectName"]="Subject";
	mydata["action"]="getList";
	mydata["order"] = "createTime";
	mydata["count"] = DefaultCountPerPage;
    //mydata["count"] = 10;	
	mydata["desc"] = 1;
	mydata["subject_owner"] = userId;
	mydata["skip"] = subject_skip;
	
	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		async:true,
		data: mydata,
		beforeSend: function() {	
			var html=new StringBuffer();
			html.append("<div class='center'><img src='");
			html.append(tek.common.getRootPath());
			html.append("http/images/waiting-small.gif'/> 正在获取数据...</div>");
			$("#subject-list").html(html.toString());
		},
		success: function(data) {
			if(data){
				if (data.code==0){
					//记录总条数
					subject_total = data.value;
					
					//清空主题列表显示区域
					target.innerHTML = "";
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showSubject(record[i],target);
						}else
							showSubject(record,target);
					} else {
						$("#subject-list").html("<font>没有数据！</font>");
					}  //end if(record) else
				} else {
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append("[");
					error.append(data.code);
					error.append(" - ");
					error.append(data.message);
					error.append("]");
					error.append("</font>");
					$("#subject-list").html(error.toString());
				}  //end if (data.code==0) else
			} else {
				$("#subject-list").html("<font color='red'>操作失败![data=null]</font>");
			}//end if(data) else
		}, //end success: function(data)
	   	error: function(request) {
			var error=new StringBuffer();
			error.append("<font color='red'>");
			error.append("读取对象失败[");
			error.append(request.status);
			error.append(" - ");
			error.append(request.responseText);
			error.append("]");
			error.append("</font>");
			$("#subject-list").html(error.toString());
		},
		complete: function(){
			tek.turnPage.show("subject-page", subject_skip, subject_count, subject_total,DefaultCountPerGroup,false,false,false,false);//false,false,false,false
		}
	});	
}
	
//显示主题
function showSubject(record,target){
	if(record){
		var sb = new StringBuffer();
		sb.append("<li>");
		
		sb.append("<a target='_blank' href='");
		sb.append(tek.common.getRootPath());
		sb.append("http/takall/subject/read/index.html?subject_id=");
		sb.append(record.id);
		sb.append("&show-close=1&refresh-opener=1' target'_blank'>");
		if(record.subject_author){
		   sb.append(record.subject_author.show);
		   sb.append(" : ");
		}
		sb.append(record.name);
		sb.append("</a>");
		
        if(record.subject_status){
          sb.append("<span class='label label-self");
          var status=record.subject_status.value;
          if(status==0)
            sb.append(" label-warning");
          else if(status==1)
            sb.append(" label-success");
          else if(status==-1)
            sb.append(" label-default");
          sb.append("'>");
          sb.append(record.subject_status.show);
          sb.append("</span>");
		}
		
		sb.append("<p>");
		if(record.subject_summary){
			var summary = record.subject_summary.show;
			if(summary && summary.length > 80)
				sb.append(summary.substring(0,77)+"...");
			else
				sb.append(summary);
		}
		sb.append("</p>");
		
		sb.append("</li>");
		
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
	}
}


//------------------------------------------------小组显示----------------------------------
//获取小组的列表数据
function listGroup(){
	var target = document.getElementById('group');
	if(!target){
		showError("小组显示区错误，请和管理员联系");
		return;
	}
	
	var mydata={};
	mydata["objectName"]="Member";
	mydata["action"]="getList";
	mydata["order"] = "member_code";
	mydata["user_id"] = userId;
	mydata["count"] = group_count;
	mydata["skip"] = group_skip;
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			var html=new StringBuffer();
			html.append("<div class='center'><img src='");
			html.append(tek.common.getRootPath());
			html.append("http/images/waiting-small.gif'/> 正在获取数据...</div>");
			$("#group").html(html.toString());
			//重置
			group_total = 0;	
		},
		success: function(data) {
			target.innerHTML = "";
			if(data){
				if (data.code==0){
					group_total = parseInt(data.value);	//保存总数
					
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record){
								showGroupList(record[i],target);
							}
						}else{
							showGroupList(record,target);
						}
					}//end if(record)
					else{
						$("#group").html("<font>没有数据！</font>");	
					}//end if(record) else
				}  //end if (data.code==0)
				else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append("[");
					error.append(data.code);
					error.append(" - ");
					error.append(data.message);
					error.append("]");
					error.append("</font>");
					$("#group").html(error.toString());
				}//end if(data.code==0) else
			}//end if(data)
			else{
				$("#group").html("<font color='red'>操作失败![data=null]</font>");
			}//end if(data) else
		}, //end success: function(data)
		error: function(request) {
			var error=new StringBuffer();
			error.append("<font color='red'>");
			error.append("读取对象失败[");
			error.append(request.status);
			error.append(" - ");
			error.append(request.responseText);
			error.append("]");
			error.append("</font>");
			$("#group").html(error.toString());
		}, 
		complete:function(){
			tek.turnPage.show("group-page", group_skip, group_count, group_total,DefaultCountPerGroup,false,false,false,false);//false,true,false,true
		},
	});		
}

//显示小组	
function showGroupList(record,target){
	if(record && target){
		var sb = new StringBuffer();
		sb.append("<li>");
		
		sb.append("<i class='fa fa-user ");
		var status = record.member_status;
		if(status){		
			if(status.value == 100){
				sb.append(" alert-danger ");
			}else {
				sb.append(" alert-link ");
			}
		}	
		sb.append("'></i>");
				
		if(record.member_group){
			sb.append("<a target='_blank' href='");
			sb.append(tek.common.getRootPath());
			sb.append("http/takall/group/read.html?group_id=");
			sb.append(record.member_group.value);
			sb.append("' target'_blank'>");
			sb.append(record.member_group.show);
			sb.append("</a>");
		}else{
			sb.append("错误小组");
		}
		sb.append("</li>");
			
		target.insertAdjacentHTML('BeforeEnd',sb.toString());	  
	}
}


//------------------------------------------------小组操作记录----------------------------------
//获取操作记录  -- 分 当前用户的最新操作记录 | 该用户最新操作的主题记录
function listRecord(){
	var target = document.getElementById('record');
	if(!target){
		showError("记录显示区错误，请和管理员联系");
		return;
	}
	
	var mydata={};
	mydata["objectName"]="ObjectRecord";
	mydata["action"]="getList";
	mydata["user_id"] = userId;
	mydata["order"] = "record_code";
	mydata["desc"] = 1;
	mydata["count"] = 18;
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			var html=new StringBuffer();
			html.append("<div class='center'><img src='");
			html.append(tek.common.getRootPath());
			html.append("http/images/waiting-small.gif'/> 正在获取数据...</div>");
			$("#record").html(html.toString());
			//重置
			record_total = 0;	
		},
		success: function(data) {
			target.innerHTML = "";
			if(data){
				if (data.code==0){
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showRecord(record[i],target);
							
							//显示更多按钮	
							if(data.value>record.length) {
								$("#more > a").attr("href",tek.common.getRootPath()+"http/tekinfo/record/index.html?order=createTime&desc=1&user_id="+userId);
								$("#more").removeClass("hide");
							}
						}else{
							showRecord(record,target);
						}
					} else {	//else if(record)
			            showReadMessage("无记录", target);
					}
				}  //end if (data.code==0)
				else{
					var error=new StringBuffer();
						error.append("<font color='red'>");
						error.append("[");
						error.append(data.code);
						error.append(" - ");
						error.append(data.message);
						error.append("]");
						error.append("</font>");
						$("#record").html(error.toString());
				}//end if(data.code==0) else
			}//end if(data)
			else{
				$("#record").html("<font color='red'>操作失败![data=null]</font>");
			}//end if(data) else
		}, //end success: function(data)
		error: function(request) {
			var error=new StringBuffer();
			error.append("<font color='red'>");
			error.append("读取对象失败[");
			error.append(request.status);
			error.append(" - ");
			error.append(request.responseText);
			error.append("]");
			error.append("</font>");
			$("#record").html(error.toString());
		}, 
		complete:function(){
		},
	});		
}
  
//显示操作记录
function showRecord(record,target){
	if(record && target){
		var sb = new StringBuffer();
		
		sb.append("<tr onclick='recordInfo(\"");
		sb.append(record.id);
		sb.append("\")'>");
		
		sb.append("<td>");
		sb.append("<i class='fa fa-arrow-right'></i>");
		sb.append("  ");
		//sb.append("操作：");
		if(record.record_object){
			sb.append(record.record_object.show);
		}
		sb.append("-");
		if(record.record_command){
			sb.append(record.record_command.show);
		}
		sb.append(" ");
		sb.append("</td>");

		sb.append("<td>");
		//sb.append("记录对象：");
		if(record.record_objectid){
			sb.append(record.record_objectid.show);
		}
		sb.append(" ");
		sb.append("</td>");
		
		sb.append("<td>");
		//sb.append("记录时间：");
		if(record.record_time){
			sb.append(record.record_time.show);
		}
		sb.append(" ");
		sb.append("</td>");
		
		/*sb.append("<td>");
		//sb.append("位置：");
		if(record.record_location){
			sb.append(record.record_location.show);
		}
		sb.append("</td>");*/
		
		sb.append("</tr>");
		
		target.insertAdjacentHTML('BeforeEnd',sb.toString());
	}
}

//查看记录详情
function recordInfo(recordId) {
	var url=new StringBuffer();
	url.append(tek.common.getRootPath());
	url.append("http/tekinfo/record/read.html?record_id=");
	url.append(recordId);
	url.append("&show-close=1&refresh-opener=1");
    window.open(url.toString());
}

//------------------------------------------------------其他 Function--------------------------------------------------

//翻页 --用于turn-page.js中
function changePage(id,skip){
	if(id=="subject-page"){
		//改变列表起始位置
		subject_skip = skip;
		if(typeof listSubject != "undefined" && typeof listSubject == "function")
			listSubject();	//重新查询
		else
			alert("缺少listSubject方法！");
	}else if(id=="group-page"){
		//改变列表起始位置
		group_skip = skip;
		if(typeof listGroup != "undefined" && typeof listGroup == "function")
			listGroup();	//重新查询
		else
			alert("缺少listGroup方法！");
	}
}
//-------------------------------------------------------End------------------------------------------------------------------
