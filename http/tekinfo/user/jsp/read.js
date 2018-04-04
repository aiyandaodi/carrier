//javascript document

    //页面修改
	function currentInfo(){
		$("#current_user").html(myName);
		$("#user_info").html(myName+"的信息");
		$("#user_name1").html(myName);
		$("#user_group").html(myName+"的小组");
		$("#user_space").html(myName+"的空间");
		}
    
    //用户信息	
	function readUser(){
		$.ajax({
			type: "post",
			url: "../../../servlet/tobject",
			dataType: "json",
			async:false,
			data: {
				objectName:"User",
				action:"readInfo",
				"user_id":myId,
				//my:1,
				icon:1, 
				//blob:1,
				},
		success:function(data){
			//alert(record);
			if(!data && data.code!=0)
			return;
			var record=data["record"];
			if(!record)
				return;	
			//头像		
			var url=record.icon;
			if(url){
				 if(document.getElementById("my_icon")){
			     	document.getElementById("my_icon").src=url;
				 }
			}
			   
			//最近登录时间
			//var flag=record.user_lastestTime;
			//alert(flag);
			if(record.user_latestTime) {
			   var user_latestTime=record.user_latestTime.show;
			  // alert(user_latestTime);
			   if(user_latestTime)
			       $("#user_latestTime").html(user_latestTime);
			}
			   
			//最近登录IP
			if(record.user_latestIp){
			   var user_latestIp=record.user_latestIp.show;
			   //alert(user_latestIp);
			   if(user_latestIp)
			      $("#user_latestIp").html(user_latestIp);
			}
			
			//当前登录时间
			$("#user_currentTime").html(myLoginTime);
			
			
			//当前登录IP
			$("#user_currentIp").html(myLoginIp);
			
			//是否在线
			//if(record.user_online){
			//   var user_online=record.user_online.show;
			//   if(user_online)
			//      document.getElementById("user_online").innerHTML=user_online;
			//}
			//alert(record.user_code);
			
			//用户编码
			if(record.user_code){
				var user_code=record.user_code.show;
				if(record.user_code)
				   $("#user_code").html(user_code);
				}
			
			//alert(record.user_name);
			//用户姓名
			if(record.user_name){
			   var user_name=record.user_name.show;
			   //alert(user_name);
			   if(user_name)
			      $("#user_name2").html(user_name);
			}
			   
			//性别
			if(record.user_sex){
			   var user_sex=record.user_sex.show;
			   if(user_sex)
			      $("#user_sex").html(user_sex);
			}
			   
			//出生日期
			if(record.user_birthday){
			   var user_birthday=record.user_birthday.show;
			  // alert(record.user_birthday.value);
			   if(user_birthday)
			      $("#user_birthday").html(user_birthday);
			}
			
			//安全等级
			if(record.user_security){
				var user_security=record.user_security.show;
				if(user_security)
				   $("#user_security").html(user_security);
				}
				
			//用户状态
			if(record.user_status){
				var user_status=record.user_status.show;
				if(user_status)
				   $("#user_status").html(user_status);
				}
				
			//有效时间start	
			if(record.user_start){
				var user_start=record.user_start.show;
				//alert(user_start);
				if(user_start)
				   $("#user_start").html(user_start);
				}
				
			//有效时间end
			if(record.user_end){
				var user_end=record.user_end.show;
				if(user_end)
				   $("#user_end").html(user_end);
				}
			 
			//所属客户端
			if(record.user_client){
				var user_client=record.user_client.show;
				if(user_client)
				   $("#user_client").html(user_client);
				}
	
			//if (data.code==0){
			//var my_icon=data[""];
			//var user_code=data.record.user_code.show;
			//alert(user_code);
			
			//} 
			//else
			//alert(data.message);
			//var user_name=data["user_name"];
			
			//var blob=1;
			//}
		
		},
		error: function(request) {
			//showMessage("登录操作失败!");
			alert("error");
			showMessage("操作失败!"+request.status+request.response);
		}
	});	
	
	}
	
	//主题显示
	function readSubject(){
		var target = document.getElementById("subject");
		if(!target)
			return;
		var mydata={};
		
		mydata["objectName"]="Subject";
		mydata["action"]="getList";
		mydata["order"] = "createTime";
		mydata["count"] = 10;	
		mydata["desc"] = 1;
		mydata["subject_owner"] = myId;
		//alert(myId);
		$.ajax({
			type: "post",
			url: "../../../servlet/tobject",
			dataType: "json",
			async:false,
			data: mydata,
			success: function(data) {
				//alert(JSON.stringify(data));
				target.innerHTML = "";
				if (data.code==0){
					//var total = parseInt(data.value);
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showSubject(record[i],target);
							}else{
								showSubject(record,target);
						}//end if(record.length)
					}//end if(record)
				}  //end if (data.code==0)
			},//end success: function(data)
			error: function(request) {
			//showMessage("操作失败!");
				alert("error");
				showMessage("操作失败!"+request.status+request.response);
		}
	});	
	}
	
	//显示主题
	function showSubject(record,target){
	   if(record){
		   var sb = new StringBuffer();
		   
		   sb.append("<li>");
		   sb.append("<a href='../../../../subject/index/?subject_id=");
		   sb.append(record.id);
		   sb.append("'>");
		   if(record.subject_author){
			   sb.append(record.subject_author.show);
			   sb.append(" : ");
			   }
		   sb.append(record.name);
		   sb.append("</a>");
		   
		   sb.append("<p>");
		   if(record.subject_summary){
				var summary = record.subject_summary.show;
			    if(summary && summary.length > 80){
					sb.append(summary.substring(0,80)+" . . .");
			     }else
					sb.append(summary);
				}
		sb.append("</p>");
		
		sb.append("</li>");
	
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());
	  }	
  }
	
	
	//小组显示
	//获取小组的列表数据
	function getGroup(){
		var target = document.getElementById('group');
		if(!target)
			return;
		var mydata={};
		mydata["objectName"]="Group";
		mydata["action"]="getList";
		mydata["order"] = "createTime";
		mydata["count"] = 10;	
		mydata["desc"] = 1;
		mydata["join"]=1;
		//alert(JSON.stringify(mydata)); 
		$.ajax({
			async: true,
			type: "post",
			url: "../../../servlet/tobject",
			dataType: "json",
			data: mydata,
			error: function(request) {
				showMessage("操作失败!"+request.status+request.response);
				},
			success: function(data) {
				//alert(JSON.stringify(data));
				target.innerHTML = "";
				if (data.code==0){
					var total = parseInt(data.value);
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record){
								var member_right = getMembers(record[i].id);
								//alert(member_right);
								showGroup(record[i],parseInt(i),target,member_right);
								//alert(record[i].id);
							}
						}else{
							var member_right = getMembers(record.id);
							showGroup(record,0,target,member_right);
						}//end if(record.length)
					}//end if(record)
				}  //end if (data.code==0)
			} //end success: function(data)
	   });		
   }
   
   //显示小组	
   function showGroup(record,index,target,right){
	   if(record){
		   var sb = new StringBuffer();
		   //alert(member_user);
		   if(right>=8){
			    sb.append("<li>");
		   	   sb.append("<i class='fa fa-key'></i>");
		       sb.append("<a href='../../../../subject/index/?group_id=");
		       sb.append(record.id);
			   /alert(record.id);
		       sb.append("'>");
		       sb.append(record.name);
		       sb.append("</a>");
		       sb.append("</li>");
		   }
		   else{
			   sb.append("<li>");
		       sb.append("<i class='fa fa-leaf'></i>");
		       sb.append("<a href='../../../../subject/index/?group_id=");
		       sb.append(record.id);
		       sb.append("'>");
		       sb.append(record.name);
		       sb.append("</a>");
		       sb.append("</li>");
			   
			   }
		   
		   if(target)
		      target.insertAdjacentHTML('BeforeEnd',sb.toString());	  
	  }	   
  }	
  
  //获取小组的成员
  function getMembers(groupId){
	  //alert("efwe");
	  var mydata={};
	  mydata["objectName"] = "Member";
	  mydata["action"] = "getList";
	  mydata["count"] = 1;
	  mydata["user_id"] = myId;
	  mydata["group_id"] = groupId;	//指定小组下的id
	  var member_right;
		//alert(JSON.stringify(mydata)); 
		$.ajax({
			async: false,
			type: "post",
			url: "../../../servlet/tobject",
			dataType: "json",
			data: mydata,
			error: function(request) {
				showMessage("操作失败!"+request.status+request.response);
				},
			success: function(data) {
				//alert(JSON.stringify(data));
				if (data.code==0){
					//var total = parseInt(data.value);
					var record = data["record"];
					if(record){
						member_right = record.member_member_right.value;
						
					}//end if(record)
				}  //end if (data.code==0)
			} //end success: function(data)
	   });	
		return member_right;
			
	  }
  
  
  	//空间显示
	//获取空间的列表数据
	function getSpace(){
		var target = document.getElementById('space');
		if(!target)
			return;
		var mydata={};
		mydata["objectName"]="Space";
		mydata["action"]="getList";
		mydata["order"] = "createTime";
		mydata["count"] = 10;	
		mydata["desc"] = 1;
		mydata["join"] = 1;
		
		//mydata["space_owner"] = myId;
		
		//alert(JSON.stringify(mydata)); 
		$.ajax({
			async: true,
			type: "post",
			url: "../../../servlet/tobject",
			dataType: "json",
			data: mydata,
			error: function(request) {
				showMessage("操作失败!"+request.status+request.response);
				},
			success: function(data) {
				//alert(JSON.stringify(data));
				target.innerHTML = "";
				if (data.code==0){
					//alert(data.code);
					var total = parseInt(data.value);
					var record = data["record"];
					if(record){
						//alert(record.length);
						if(record.length){
							//alert(record.length);
							for(var i in record) {
								var partner_right = getPartners(record[i].id);
								showSpace(record[i],parseInt(i),target,partner_right);
							}
						}else{
							var partner_right = getPartners(record.id);
							showSpace(record,0,target,partner_right);
						}//end if(record.length)
					}//end if(record)
				}  //end if (data.code==0)
			} //end success: function(data)
	   });		
   }
   
   //显示空间	
   function showSpace(record,index,target,right){
	   if(record){
		   var sb = new StringBuffer();

		   if(right == 100){
		   sb.append("<li>");
		   sb.append("<i class='fa fa-key'></i>");
		   sb.append("<a href='../../../../space/index/?space_id=");
		   sb.append(record.id);
		   sb.append("'>");
		   //sb.append("<span class='label ");
		   //if(index % 2 == 0)
		   //   sb.append("label-info");
		   //else
		   //   sb.append("label-warning");
		   //sb.append("'><i class='icon-cloud'></i>"+(index+1)+"</span>   ");
		   sb.append(record.name);
		   sb.append("</a>");
		   sb.append("</li>");
		   }
		   if(right == 1){
			   sb.append("<li>");
			   sb.append("<i class='fa fa-leaf'></i>");
		   	   sb.append("<a href='../../../../space/index/?space_id=");
		       sb.append(record.id);
		       sb.append("'>");
		       sb.append(record.name);
		       sb.append("</a>");
		       sb.append("</li>");
		   }

		   if(target)
		      target.insertAdjacentHTML('BeforeEnd',sb.toString());
	  }	
  }	
  
 //获取空间的Partners
  function getPartners(spaceId){
	  //alert("efwe");
	  var mydata={};
	  mydata["objectName"] = "Partner";
	  mydata["action"] = "getList";
	  mydata["count"] = 1;
	  mydata["user_id"] = myId;
	  mydata["group_id"] = spaceId;	//指定小组下的id
	  var partner_right;
		//alert(JSON.stringify(mydata)); 
		$.ajax({
			async: false,
			type: "post",
			url: "../../../servlet/tobject",
			dataType: "json",
			data: mydata,
			error: function(request) {
				showMessage("操作失败!"+request.status+request.response);
				},
			success: function(data) {
				//alert(JSON.stringify(data));
				if (data.code==0){
					//var total = parseInt(data.value);
					var record = data["record"];
					if(record){
						partner_right = record.partner_status.value;
						//alert(partner_right);
					}//end if(record)
				}  //end if (data.code==0)
			} //end success: function(data)
	   });	
		return partner_right;
			
	  } 