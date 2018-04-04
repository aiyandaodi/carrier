// JavaScript Document
/**************************************************
 *	小组读取页面 index.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================


var mainInfo;        
var  seconds=3;

    //
//=====================================================Function===============================
//-----------------------------------------group---------------------------------------
//读取小组信息
function readServiceProviderInfo(){
		
	
	

	var mydata={};
	mydata["objectName"]="Contact";
	mydata["action"]="readContact";
	mydata["contact_id"]=contact_id;
	mydata["count"]=1;
	
	
	$.ajax({
		async: true,
		type: "post",
		url: "../../../servlet/contact",
		dataType: "json",
		data: mydata,
		beforeSend:function(){
			$("#group-info-content").html("<li class='msg center'><img src='../../contac/js/images/ajax-loader.gif' /></li>");
		},
		success: function(data) {
			if (data) {
				if (data.code==0){
					
					if(IsCanWrite(data.right))
						$("#servletProvider_modify_btn").removeClass("hidden");
					
					var record=data["record"];
					if (record) {
						
						//显示服务主机信息
					showGroupInfo(record);
					//列表主机下的用户
					
						
						/*if(typeof mySecurity != "undefined" && mySecurity >= 0x40){	//管理员
							getListMember();	//列表组员
							getListContact();	//列表通讯录
						}else
							checkCurrentUserIsMember();		//判断当前用户是否是组员*/
					}
				}else{
					//未加入任何小组
					var sb = new StringBuffer();
					sb.append("<font color='red'>");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(stringToHTML(data.message));
					sb.append("</font>");
					$("#group-info-content").html(sb.toString());
				}  //end if (data.code==0)
			} else {
				$("#group-info-content").html("<font color='red'>操作失败！[data=null]</font>");
			}
 	    }, //end success: function(data)
		error: function(request) {
			var sb = new StringBuffer();
			sb.append("<font color='red'>");
			sb.append("操作失败！[");
			sb.append(request.code);
			sb.append(" - ");
			sb.append(stringToHTML(request.message));
			sb.append("]</font>");
			showError(sb.toString());
        }
	});
}
function back2() {
	  window.opener.location.href = window.opener.location.href;
 window.closeWin();

  
}

function refreshOpener(){
    // 可能存在frame页面,所以要引用top窗口.
    var win = top.window;
    try{
        // 刷新.
        if(win.opener)  win.opener.location.reload();
    }catch(ex){
        // 防止opener被关闭时代码异常。
    }
}
function editInfo(){
	var url=new StringBuffer();
	url.append("edit.html?contact_id=");
	url.append(contact_id);
	url.append("&show_close=1&refresh_opener=1");
	window.open(url.toString());
}

// 关闭窗口.
function closeWin(){
    // 可能存在frame页面,所以要引用top窗口.
    var win = top.window;
    try{
        // 聚焦.
        if(win.opener)  win.opener.focus();
        // 避免IE的关闭确认对话框.
        win.opener = null;
    }catch(ex){
        // 防止opener被关闭时代码异常。
    }finally{
        win.close();
    }
}


//删除联系人
function deleContace() {
	

	
	var ajaxURL = "../../../servlet/contact";
	
	var ajaxParams = {};
	
	
	ajaxParams["objectName"] = "Contact";
	ajaxParams["action"] = "removeContact";
	ajaxParams["contact_id"] = contact_id;
		var closeConfirm = confirm("确定关闭页面？");
	if(!closeConfirm)
	    return;
		
	  
  showMessage("<img src='../../contac/js/"+getRelativePath()+"http/images/waiting.gif' width='16'/>  正在删除...");

  $.ajax({
      type: "post",
      url: ajaxURL,
      dataType: "json",
      data: ajaxParams,

      success: function(data) {
        	
            if(data) {
			    if (data.code==0) {
					
			   if(updateOpener==1){
				  
                // 刷新父页面
			
                tekRefreshOpener();
                                    } // end if(updateOpener==1)
                    
              if(showClose==1){
                // 关闭
				
                var timerMsg=new StringBuffer();
                timerMsg.append("页面<font id='counter' color='red'>");
                timerMsg.append("</font>秒后自动关闭");
                showWaittingMessage("保存成功!", timerMsg.toString());
                timeCounting("window.close()");

              } else if(callbackURL&&callbackURL.length>0) {
                // 跳转
				
                var timerMsg=new StringBuffer();
                timerMsg.append("页面<font id='counter' color='red'>");
                timerMsg.append("</font>秒后自动跳转");
                showWaittingMessage("删除成功!", timerMsg.toString());
                timeCounting("location.href='"+callbackURL+"'");
				 }
                } else {
                    // 操作错误
                     var error=new StringBuffer();
                    error.append(data.code);
                    error.append(" - ");
                    error.append(stringToHTML(data.message));
                    showWaittingMessage(error.toString());
                    setTimeout("timeCounting()",1000);
                } 
              
					 
					
					
					
              
            } else{
                showWaittingMessage("操作失败![data=null]");
                setTimeout("timeCounting()",1000);
            }
	  },

      error: function(request) {
          var error=new StringBuffer();
		  error.append("<font color='red'>");
          error.append("删除失败![");
		  if(request.status)
            error.append(request.status);
          error.append(" - ");
		  if(request.response)
            error.append(request.response);
          error.append("]");
		  error.append("</font>");
		  waittingMessage(error.toString());
          timeCounting();
	  }
  });

}


//隐藏图层
function hideContactAndMemberWidget(){
	$("#contact-widget").slideUp(100);	
//	$("#member-widget").slideUp(100);
}

//显示小组信息
function showGroupInfo(record){
	if(record){
		//小组的名字
	document.title=record.name;
		
		$("#group-name-title").html(record.name);
		$("#current_servletProvider").html("联系人："+record.name);
	/*	$("#group-name-title2").html("小组<span class='text-info'>["+record.name+"]</span>下的主题");
		$("#group-name-title3").html("小组<span class='text-info'>["+record.name+"]</span>下的组员");
		
		$("#group-name-title4").html("小组<span class='text-info'>["+record.name+"]</span>");
		
		$("#add-subjects-a").attr("href","../../subject/add/?subject_group="+record.id+"&refresh_opener=1");	//新建主题
		$("#add-subjects-a").attr("target","_blank");			
		
		$("#add-member-a").attr("href","../../member/add/index.html?group_id="+record.id+"&show_close=1&refresh_opener=1");	//新建组员
		$("#add-member-a").attr("target","_blank");			
		
		
		$("#add-contact-a").attr("href","../../contact/add/index.html?group_id="+record.id+"&show_close=1&refresh_opener=1");	//新建联系人
		$("#add-contact-a").attr("target","_blank");	*/
		
		//小组的图标
	
			
				
		var sb = new StringBuffer();
		
	
		
		if(record.contact_code){
			sb.append("<li>");
			sb.append(record.contact_code.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_code.show);
			sb.append("</span>");
			sb.append("</li>");
		}
		
		if(record.contact_title){
			sb.append("<li>");
			sb.append(record.contact_title.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_title.show);
			sb.append("</span>");
			sb.append("</li>");
		}
		
		if(record.contact_name){
			sb.append("<li>");
			sb.append(record.contact_name.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_name.show);
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
			sb.append("</li>");
		}
		
		if(record.contact_birthday){
			sb.append("<li>");
			sb.append(record.contact_birthday.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_birthday.show);
			sb.append("</span>");
			sb.append("</li>");
		}
		
		if(record.contact_language){
			sb.append("<li>");
			sb.append(record.contact_language.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_language.show);
			sb.append("</span>");
			sb.append("</li>");
		}
		
		if(record.contact_country){
			sb.append("<li>");
			sb.append(record.contact_country.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_country.show);
			sb.append("</span>");
			sb.append("</li>");
			
			
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
		
		if(record.contact_department){
			sb.append("<li>");
			sb.append(record.contact_department.display);
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_department.show);
			sb.append("</span>");
			sb.append("</li>");
		}
		
		if(record.contact_position){
				sb.append("<li>");
			sb.append(record.contact_position.display);
		
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_position.show);
			sb.append("</span>");
			sb.append("</li>");
			
		
		}
			if(record.contact_user){
					sb.append("<li>");
			sb.append(record.contact_user.display);
		
			sb.append(" : ");
			sb.append("<span>");
			sb.append(record.contact_user.show);
			sb.append("</span>");
			sb.append("</li>");
			
		
		}
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
		
		    mainInfo = new StringBuffer();
		 	if(record["ContactAddress-value"]!=0){
				  mainInfo.append("<li>地址");
			mainInfo.append(" : ");
			if(record["ContactAddress-value"]==1) {
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"]["name"]);
			mainInfo.append("</span>   ");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"]["address_country"]["show"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"]["address_state"]["value"]);
			mainInfo.append("</span></br>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"]["address_city"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"]["address_street"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"]["address_landmark"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"]["address_zip"]["value"]);
			mainInfo.append("</span>");
				
				
			}else {
			for(var i=0;i<record["ContactAddress-value"];i++) {	
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"][i]["name"]);
			mainInfo.append("</span>   ");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"][i]["address_country"]["show"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"][i]["address_state"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"][i]["address_city"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"][i]["address_street"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"][i]["address_landmark"]["value"]);
			mainInfo.append("</span>");
			mainInfo.append("<span>");
			mainInfo.append(record["ContactAddress-record"][i]["address_zip"]["value"]);
			mainInfo.append("</span></br>");
	
				
				
			}
			
			}
		 		mainInfo.append("</li>");
		
		}else {
			  mainInfo.append("<li>");
			mainInfo.append("地址:");
			mainInfo.append(" : ");
			mainInfo.append("<span>");
			mainInfo.append("空");
			mainInfo.append("</span>");
			mainInfo.append("</li>");
			
			
		}
		
		
		
		 	if(record["ContactEmail-value"]!=0){ 
			
			
				if(record["ContactEmail-value"]==1) {
		        putEmail(record["ContactEmail-record"]);
				
				
			}else {
			for(var i=0;i<record["ContactEmail-value"];i++) {	
		
		   putEmail(record["ContactEmail-record"][i]);
			
			
			  }
			}
			
			
			}else {
			  mainInfo.append("<li>");
			mainInfo.append("邮箱:");
			mainInfo.append(" : ");
			mainInfo.append("<span>");
			mainInfo.append("空");
			mainInfo.append("</span>");
			mainInfo.append("</li>");
			
			
		}
		
		
		//遍历电话
		
		 	if(record["ContactTelephone-value"]!=0){ 
			
			
				if(record["ContactTelephone-value"]==1) {
		        putTele(record["ContactTelephone-record"]);
				
				
			}else {
			for(var i=0;i<record["ContactTelephone-value"];i++) {	
		
		   putTele(record["ContactTelephone-record"][i]);
			
			
			  }
			}
			
			
			}else {
			  mainInfo.append("<li>");
			mainInfo.append("电话:");
			mainInfo.append(" : ");
			mainInfo.append("<span>");
			mainInfo.append("空");
			mainInfo.append("</span>");
			mainInfo.append("</li>");
			
			
		}
		
		//遍历全时通
			if(record["ContactInstance-value"]!=0){ 
			
			
				if(record["ContactInstance-value"]==1) {
		        putInstance(record["ContactInstance-record"]);
				
				
			}else {
			for(var i=0;i<record["ContactInstance-value"];i++) {	
		
		   putInstance(record["ContactInstance-record"][i]);
			
			
			  }
			}
			
			
			}else {
			  mainInfo.append("<li>");
			mainInfo.append("电话:");
			mainInfo.append(" : ");
			mainInfo.append("<span>");
			mainInfo.append("空");
			mainInfo.append("</span>");
			mainInfo.append("</li>");
			
			
		}
	
		
		
		 
		 
		$("#mainInfo").html(mainInfo.toString());

		$("#group-info-content").html(sb.toString());
		
	}
}

function putEmail(obj) {
	        mainInfo.append("<li>邮箱");
			mainInfo.append(" : ");
          	mainInfo.append("<span>");
			mainInfo.append(obj["email_name"]["value"]);
			mainInfo.append("</span>   ");
			mainInfo.append("<span>");
			mainInfo.append(obj["email_address"]["value"]);
			mainInfo.append("</span>   ");
				mainInfo.append("<a href='#'><span class='fa fa-send (alias)' style='color:#2A86C3;' title='发送邮件'>");
		
			mainInfo.append("</span></a>   ");
			
				mainInfo.append("<a href='#'><span class='fa fa-random'  title='历史通信'>");
		
			mainInfo.append("</span></a>");
			mainInfo.append("</li>");	
	      
	
}


function putTele(obj) {
	
	        mainInfo.append("<li>电话");
			mainInfo.append(" : ");
          	mainInfo.append("<span>");
			mainInfo.append(obj["telephone_name"]["value"]);
			mainInfo.append("</span>   ");
			mainInfo.append("<span>");
			mainInfo.append(obj["telephone_type"]["value"]);
			mainInfo.append("</span>   ");
			mainInfo.append("<span>");
			mainInfo.append(obj["telephone_phone"]["value"]);
			mainInfo.append("</span>   ");
				mainInfo.append("<a href='#'><span class='fa fa-send (alias)' style='color:#2A86C3;' title='发送邮件'>");
		
			mainInfo.append("</span></a>   ");
			
				mainInfo.append("<a href='#'><span class='fa fa-random'  title='历史通信'>");
		
			mainInfo.append("</span></a>");
			mainInfo.append("</li>");	
	
	
}


function putInstance(obj) {
	
	        mainInfo.append("<li>即时通");
			mainInfo.append(" : ");
          	mainInfo.append("<span>");
			mainInfo.append(obj["instance_name"]["value"]);
			mainInfo.append("</span>   ");
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




function showWaittingMessage(msg,timerMsg){
    if(!msg)
        msg="";
    $("#waitting-msg").html(msg);

    if(!timerMsg)
        timerMsg="";
    $("#timer-msg").html(timerMsg);
    $('#waitting-modal-dialog').modal('show',null,2);
}

function timeCounting(stat){
    seconds--;

    if(seconds>0) {
        $("#counter").html(seconds);
        setTimeout("timeCounting(\""+stat+"\")",1000);
    } else {
        if(stat)
            eval(stat);
        $("#waitting-modal-dialog").modal("hide");
    }
}


//-----------------------------------------subject---------------------------------------


//-----------------------------------------------------End-------------------------------------