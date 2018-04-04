//获取新建默认值
function getNew(){
    var data={};
    data["objectName"] = "Contact";
    data["action"] = "readContact";
    data["contact_id"] =contact_id;
    
    $.ajax({
        type:"post",
        url:"../../../servlet/contact",
        dataType:"json",
        data:data,
        success:function(data) {
            if(data){
                if(data.code==0){
					$("#loading").hide();
                   showData(data);
                }else{
                    var error=new StringBuffer();
                    error.append(data.code);
                    error.append(" - ");
                    error.append(stringToHTML(data.message));
                    $("#loading").html(error.toString());
                }
            }else{
                var error=new StringBuffer();
                error.append("操作错误！");
                $("#loading").html(error.toString());
            }
        },
        error:function(request){
            var error=new StringBuffer();
            error.append("操作失败![");
            error.append(request.status);
            error.append(" - ");
            error.append(request.response);
            error.append("]");
            $("#loading").html(error.toString());
        }
    })
}
// 将获得的数据放入编辑框

 function showData(data) {
	
    	 $("#conid").append("<input type='hidden' value='"+data["record"]["id"]+"' name='contact_id' id='contact_id'/> ");
     $("#contact_name").val(data["record"]["contact_name"]["value"]);
	 $("#contact_title").val(data["record"]["contact_title"]["value"]);
	 selectEd("contact_sex",data["record"]["contact_sex"]["value"]);
	 $("#contact_birthday").val(data["record"]["contact_birthday"]["value"]);
	 selectEd("contact_country",data["record"]["contact_country"]["show"]);
	 selectEd("contact_language",data["record"]["contact_language"]["show"]);
	 
	 $("#contact_unit").val(data["record"]["contact_unit"]["value"]);
	 
	  $("#contact_department").val(data["record"]["contact_department"]["value"]);
	    $("#contact_position").val(data["record"]["contact_position"]["value"]);
		  $("#contact_remark").val(data["record"]["contact_remark"]["value"]);
	
	
	  if(data["record"]["ContactEmail-value"]!=0) {	 
		if(data["record"]["ContactEmail-value"]==1)  {
	   getEdit(data["record"]["ContactEmail-record"]["id"],data["record"]["ContactEmail-record"]["name"],data["record"]["ContactEmail-record"]["email_address"]["value"],true);
			
		}else {
	   getEdit(data["record"]["ContactEmail-record"][0]["id"],data["record"]["ContactEmail-record"][0]["name"],data["record"]["ContactEmail-record"][0]["email_address"]["value"],true);	
	   if(data["record"]["ContactEmail-value"]>1) {
		     for(var i=1;i<data["record"]["ContactEmail-value"];i++) {
				   getEdit(data["record"]["ContactEmail-record"][i]["id"],data["record"]["ContactEmail-record"][i]["name"],data["record"]["ContactEmail-record"][i]["email_address"]["value"],false)
				 
			 }
	   }
	   }
			 
	  }else {
		    getEdit(1,"","",true);	
		  
	  }
	     if(data["record"]["ContactTelephone-value"]!=0) {
			 
			 	if(data["record"]["ContactTelephone-value"]==1)  {
					  var id=data["record"]["ContactTelephone-record"]["id"];
					getEditTele(id,data["record"]["ContactTelephone-record"]["name"],data["record"]["ContactTelephone-record"]["telephone_intercode"]["value"],data["record"]["ContactTelephone-record"]["telephone_number"]["value"],data["record"]["ContactTelephone-record"]["telephone_areacode"]["value"],true);  
						var value=data["record"]["ContactTelephone-record"]["telephone_type"]["value"];
					 shift(value,"contact_telephone-"+id+"-telephone_type","tele-"+id);
										}else {
						  var id=data["record"]["ContactTelephone-record"][0]["id"];
				
	getEditTele(id,data["record"]["ContactTelephone-record"][0]["name"],data["record"]["ContactTelephone-record"][0]["telephone_intercode"]["value"],data["record"]["ContactTelephone-record"][0]["telephone_number"]["value"],data["record"]["ContactTelephone-record"][0]["telephone_areacode"]["value"],true);  	
	
		var val=data["record"]["ContactTelephone-record"][0]["telephone_type"]["value"];
	               
					
					    shift(val,"contact_telephone-"+id+"-telephone_type","tele-"+id);
					
				  for(var i=1;i<data["record"]["ContactTelephone-value"];i++) {
					  var id=data["record"]["ContactTelephone-record"][i]["id"];
		getEditTele(id,data["record"]["ContactTelephone-record"][i]["name"],data["record"]["ContactTelephone-record"][i]["telephone_intercode"]["value"],data["record"]["ContactTelephone-record"][i]["telephone_number"]["value"],data["record"]["ContactTelephone-record"][i]["telephone_areacode"]["value"],false);  
		              	var val=data["record"]["ContactTelephone-record"][i]["telephone_type"]["value"];
					    shift(val,"contact_telephone-"+id+"-telephone_type","tele-"+id);	 
          
		  
		  		
	
					}
				  
			  }
			 
		 }else {
			 	getEditTele(1,"","","","",true);  	
			 
			 
		 }
		      if(data["record"]["ContactAddress-value"]!=0) { 
			    if(data["record"]["ContactAddress-value"]==1) {
				 merge(data["record"]["ContactAddress-record"],true);
			      
			   }else {
				    merge(data["record"]["ContactAddress-record"][0],true);
			     for(var i=1;i<data["record"]["ContactAddress-value"];i++) {
					 
					   merge(data["record"]["ContactAddress-record"][i],false);
				 }
			   }
			  
			  }else {
				getEditAddress(1,"","",true);  	  
			  }
			  
			  
			  //遍历即时通编辑框
			  
			  
		 if(data["record"]["ContactInstance-value"]!=0) { 
			      if(data["record"]["ContactInstance-value"]==1) {
				 getEditInstance(data["record"]["ContactInstance-record"]["id"],data["record"]["ContactInstance-record"]["name"],data["record"]["ContactInstance-record"]["instance_address"]["value"],data["record"]["ContactInstance-record"]["instance_type"]["show"],data["record"]["ContactInstance-record"]["instance_type"]["value"],true);
			      
			   }else {
				    getEditInstance(data["record"]["ContactInstance-record"][0]["id"],data["record"]["ContactInstance-record"][0]["name"],data["record"]["ContactInstance-record"][0]["instance_address"]["value"],data["record"]["ContactInstance-record"][0]["instance_type"]["show"],data["record"]["ContactInstance-record"][0]["instance_type"]["value"],true);
			     for(var i=1;i<data["record"]["ContactInstance-value"];i++) {
					 getEditInstance(data["record"]["ContactInstance-record"][i]["id"],data["record"]["ContactInstance-record"][i]["name"],data["record"]["ContactInstance-record"][i]["instance_address"]["value"],data["record"]["ContactInstance-record"][i]["instance_type"]["show"],data["record"]["ContactInstance-record"][i]["instance_type"]["value"],false);
				 }
			   }
			  
		 }else {
	 getEditInstance(1,"","","qq","QQ",true);		 
			 
		 }
		  
 }
	 
	 
 
 //获得即时通编辑框
 
 
   function getEditInstance(intanceNum,name,address,type,value,first) { 
 
          var s='    <div  class="form-group" name="instance_'+intanceNum+'" id="instance_'+intanceNum+'"> <div class="col-lg-2"><input type="hidden" name="contact_instance-'+intanceNum+'-instance_type" id="contact_instance-'+intanceNum+'-instance_type" value="'+type+'" /><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="instant-'+intanceNum+'" value="">'+value+'<span class="caret"></span> </button> <ul class="dropdown-menu" role="menu"><li><a href="javascript:selectInstant(\'Facebook\',\'contact_instance-'+intanceNum+'-instance_type\',\'instant-'+intanceNum+'\')">Facebook</a></li><li><a href="javascript:selectInstant(\'GoogleTalk\',\'contact_instance-'+intanceNum+'-instance_type\',\'instant-'+intanceNum+'\')">GoogleTalk</a></li><li><a href="javascript:selectInstant(\'MSN\',\'contact_instance-'+intanceNum+'-instance_type\',\'instant-'+intanceNum+'\')">MSN</a></li><li><a href="javascript:selectInstant(\'QQ\',\'contact_instance-'+intanceNum+'-type\',\'instant-'+intanceNum+'\')">QQ</a></li><li><a href="javascript:selectInstant(\'XMPP\',\'contact_instance-'+intanceNum+'-instance_type\',\'instant-'+intanceNum+'\')">XMPP</a></li><li><a href="javascript:selectInstant(\'Yahoo\',\'contact_instance-'+intanceNum+'-instance_type\',\'instant-'+intanceNum+'\')">Yahoo</a></li><li><a href="javascript:selectInstant(\'skype\',\'contact_instance-'+intanceNum+'-instance_type\',\'instant-'+intanceNum+'\')">skype</a></li></ul></div><div class="col-lg-2"><input type="text" class="form-control"  name="contact_instance-'+intanceNum+'-instance_name" id="contact_instance-'+intanceNum+'-instance_name" placeholder="备注" value="'+name+'"/></div><div class="col-lg-6"><input type="text" class="form-control" name="contact_instance-'+intanceNum+'-instance_address" placeholder="请输入账号" value="'+address+'"/></div><a href="javascript:addInstance()"><i class="fa fa-plus-circle fa-2x"></i></a>';
		  
		  
		    if(!first) {
	   s=s+' <a href="javascript:removeInstance(\'instance_'+intanceNum+'\')"><i class="fa fa-minus-circle fa-2x" style="color:red;" ></i></a></div>';
	   }else{
           s=s+'</div>';     
	   }
		  
		
	   $("#instance").append(s);
  
   
   
   }
 
 
 
 //获得地址编辑框
 function getEditAddress(AddressNum,name,addre,first) {
	   var s=' <div  class="form-group" name="address-'+AddressNum+'">  <label class="control-label col-lg-2" for="contact_address_'+AddressNum+'">地址</label>  <div class="col-lg-2"> <input type="text" class="form-control"  name="contact_address-'+AddressNum+'-address_name" id="contact_address-'+AddressNum+'-address_name" placeholder="备注" value="'+name+'"/> </div><div class="col-lg-6"><input type="text" class="form-control" name="contact_address-'+AddressNum+'-addr"  id="contact_address-'+AddressNum+'-addr" placeholder="请输入地址" readonly    value="'+addre+'" />  <div id="hidenInput-'+AddressNum+'"></div></div>       <a href="javascript:detail(\''+AddressNum+'\')"><i class="fa  fa-file-text fa-2x" title="详细地址"></i></a>          <a href="javascript:cli()"><i class="fa fa-plus-circle fa-2x"></i></a>';             
	   
	   if(!first) {
	   s=s+'<a href="javascript:rem(\'address-'+AddressNum+'\')"><i class="fa fa-minus-circle fa-2x" style="color:red;" ></i></a></div>';
	   }else{
           s=s+'</div>';     
	   }
		$("#address").append(s);
	
 }
 
 
 function merge(data,first) {
	/*  var v=data["address_country"]["value"]+" "+data["address_state"]["value"]+" "+data["address_city"]["value"]+" "+data["address_street"]["value"]+" "+data["address_landmark"]["value"]+" "+data["address_zip"]["value"];*/
	 		   var address_country_value=data["address_country"]["show"];
			 
			
		   contactAddressId=data["id"];
  	 v=v+'<input type="hidden" value="'+address_country_value+'" name="contact_address-'+contactAddressId+'-address_country"  id="contact_address-'+contactAddressId+'-address_country"     selectIndex="'+selectedIndex("address_country",address_country_value)+'" />';
		 dabao(address_country_value,"address_country");

	    var address_state=data["address_state"]["value"];
		dabao(address_state,"address_state");
		 var address_city=data["address_city"]["value"];
		  dabao(address_city,"address_city");
		  var address_street=data["address_street"]["value"];
		  dabao(address_street,"address_street");
		   var address_landmark=data["address_landmark"]["value"];
		   dabao(address_landmark,"address_landmark");
			
		    var address_zip=data["address_zip"]["value"];
			
			dabao(address_zip,"address_zip");
			
			
			
		 
			var c=address_country_value+" "+address_state+" "+address_city+" "+address_street+" "+address_landmark+" "+address_zip;
		  getEditAddress(contactAddressId,data["name"],c,first);
		    $("#hidenInput-"+contactAddressId).empty();
		    $("#hidenInput-"+contactAddressId).append(v);
		
			v="";
		
 }
 
 
 function shift(value,typeValue,icon) {
	           var val;
					if(value=='0') {
						val="电话";
					}else if(value=='1') {
						val="手机";
					}else if(value=='2') {
						val="传真";
					}
			   select(val,typeValue,icon); 
 }
 
 
//获得邮件编辑框
function getEdit(emailNum,name,EmailAddress,first) {
  
	
		var s='  <div  class="form-group" name="email_'+emailNum+'"> <label class="control-label col-lg-2" for="contact_remark">邮箱</label>  <div class="col-lg-2"><input type="text" class="form-control" name="contact_email-'+emailNum+'-email_name"  id="contact_email-'+emailNum+'-email_name" placeholder="备注" value="'+name+'"/></div><div class="col-lg-6 parentCls_'+emailNum+'"><input type="text" class="form-control inputElem_'+emailNum+'" name="contact_email-'+emailNum+'-email_address" id="contact_email-'+emailNum+'-email_address" placeholder="请输入邮箱" value="'+EmailAddress+'"/> </div><a href="javascript:addEmail()"><i class="fa fa-plus-circle fa-2x"></i></a> ';
	       if(!first) {
	   s=s+'<a href="javascript:remEmail(\'email_'+emailNum+'\')"><i class="fa fa-minus-circle fa-2x" style="color:red;" ></i></a>  </div>';
	   }else{
           s=s+'</div>';     
	   }
		$("#email").append(s);
			new EmailAutoComplete({},'.inputElem_'+emailNum,'.parentCls_'+emailNum);
		
	
	
}

//获得电话编辑框
function getEditTele(telephoneNum,name,intercodeValue,numberValue,areacodeValue,first) {
	
		
	  var s=' <div  class="form-group" name="telephone_'+telephoneNum+'"><div class="col-lg-2"> <input type="hidden" name="contact_telephone-'+telephoneNum+'-telephone_type" id="contact_telephone-'+telephoneNum+'-telephone_type" value="0" /><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="tele-'+telephoneNum+'" value="">电话<span class="caret"></span> </button><ul class="dropdown-menu" role="menu"><li><a href="javascript:select(\'手机\',\'contact_telephone-'+telephoneNum+'-telephone_type\',\'tele-'+telephoneNum+'\')">手机</a></li><li><a href="javascript:select(\'传真\',\'contact_telephone-'+telephoneNum+'-telephone_type\',\'tele-'+telephoneNum+'\')">传真</a></li> <li><a href="javascript:select(\'电话\',\'contact_telephone-'+telephoneNum+'-telephone_type\',\'tele-'+telephoneNum+'\')">电话</a></li> </ul> </div><div class="col-lg-2"><input type="text" class="form-control"  name="contact_telephone-'+telephoneNum+'-telephone_name" id="contact_telephone-'+telephoneNum+'-telephone_name" placeholder="备注" value="'+name+'"/></div><div class="col-lg-6" id="te"><input type="text" class="form-control" style=" width:67px;float:left" placeholder="国际区号" name="contact_telephone-'+telephoneNum+'-telephone_intercode" id="contact_telephone-'+telephoneNum+'-telephone_intercode" value="'+intercodeValue+'"><span style="float:left">-</span><input type="text" class="form-control" style=" width:120px;float:left" placeholder="电话号码" name="contact_telephone-'+telephoneNum+'-telephone_number" id="contact_telephone-'+telephoneNum+'-telephone_number" value="'+numberValue+'"/><span style="float:left">-</span><input type="text" class="form-control"  name="contact_telephone-'+telephoneNum+'-telephone_areacode" id="contact_telephone-1-telephone_areacode" placeholder="区号" style=" width:60px;" value="'+areacodeValue+'"/></div><a href="javascript:addTelephone()"><i class="fa fa-plus-circle fa-2x"></i></a>';	
		 
		  if(!first) {
	         s=s+'<a href="javascript:removeTelephone(\'telephone_'+telephoneNum+'\')"><i class="fa fa-minus-circle fa-2x" style="color:red;" ></i></a> </div>';
	   }else{
           s=s+'</div>';     
	   }
		 
		 
		 $("#telephone").append(s);
	

	
	}

//obj为select对象，result表示某个选项的值
function selectEd(obj,results) {
 

	var objSelect = document.getElementById(obj);
	for(var i=0;i<objSelect.options.length;i++ ){
     if(objSelect.options[i].value==results){
          objSelect.options[i].selected=true;
        return;
         }
	  
	}
   
	  


	
}


function selectedIndex(obj,results) {
    	var objSelect = document.getElementById(obj);
	for(var i=0;i<objSelect.options.length;i++ ){
     if(objSelect.options[i].text==results){
          
        return i;
         }
	  
	}
	
}


	

function editAdd(obj) {
	
	
}





//保存新建信息
function addInfo(){

   
  
        
   

    seconds=3;
	
		var data=getSerializeObjectParameters("add_form") || {};	//转为json
		
		
		    var addressReg=/^contact_address-+\d+-address_name$/;
		     var emailReg=/^contact_email-+\d+-email_name$/;
			    var teleReg=/^contact_telephone-+\d+-telephone_name$/;
				  var instanReg=/^contact_instance-+\d+-instance_name$/;
		   for(var o in data){  
          if(addressReg.test(o)) {
		
			 var v=o.replace("address_name","addr");
		
		if(data[v].length!=0&&(data[o]==null||data[o].length==0)) {
			data[o]=data["contact_name"]+"的地址";
		}else if(data[v].length==0&&data[o].length!=0)	 {
			showMsg("对比起，请填写备注下面的相关地址信息！！！",v);
			
		}
			  
		  }
		   if(emailReg.test(o)) {
			  var v=o.replace("contact_email-","");
			    v=v.replace("-email_name","");
			
		if(data["contact_email-"+v+"-email_address"].length!=0&&(data[o]===null||data[o].length==0)) {
		
		
				data[o]=data["contact_name"]+"的邮箱";
				
		      }else if(data["contact_email-"+v+"-email_address"].length==0&&data[o].length!=0) {
			
			    showMsg("对比起，请填写备注下面的相关邮箱信息！！！","contact_email-"+v+"-email_address");
			    return;
			  }
			  
		  }
		  
		     if(teleReg.test(o)) {
				 		 var v=o.replace("telephone_name","telephone_number");
			
		if(data[v].length!=0&&(data[o]===null||data[o].length==0)) {
				data[o]=data["contact_name"]+"的电话";
		      }else if(data[v].length==0&&data[o].length!=0) {
				  showMsg("对比起，请填写备注下面的相关电话信息!!!",v);
				   return;
			  }
			  
		  }
		  
		     if(instanReg.test(o)) {
				 	 var v=o.replace("instance_name","instance_address");
				
		if(data[v].length!=0&&(data[o]===null||data[o].length==0)) {
				data[o]=data["contact_name"]+"的即时通";
		      }else if(data[v].length==0&&data[o].length!=0) {
				 showMsg("对比起，请填写备注下面的相关即时通信息!!!",v);
				 return;
		      }
			  
		  }
     
     
      }  
	
	
	
		var html= new StringBuffer();
        html.append("<img src='../add/");
        html.append(getRelativePath());
        html.append("http/images/waiting-small.gif'/> 正在提交数据...");
        showWaittingMessage(html.toString());
		
		
		
		
	
	      data["objectName"] ="Contact";
		
       data["action"] = "editContact";
     	
    $.ajax({
        type: "post",
        url: "../../../servlet/contact",
        dataType: "json",
        data: data,
        success: function(data) {
			$("#loading").hide();
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
                showWaittingMessage("操作成功!", timerMsg.toString());
                timeCounting("window.close()");

              } else if(callbackURL&&callbackURL.length>0) {
                // 跳转
				
                var timerMsg=new StringBuffer();
                timerMsg.append("页面<font id='counter' color='red'>");
                timerMsg.append("</font>秒后自动跳转");
                waittingMessage("操作成功!", timerMsg.toString());
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
        error: function() {
            var error=new StringBuffer();
            error.append("操作失败!");
            showWaittingMessage(error.toString());
            setTimeout("timeCounting()",1000);
        }
    });

}
//处理提交信息 


function handle(data) {
	 
}




$('#datetimepicker').datetimepicker({
    format: 'yyyy-MM-dd',
    language: 'en',
    pickDate: true,
    pickTime: false
});

function showMsg(msg,obj) {
 
	
	 document.getElementById(obj).focus(); 
   	document.getElementById("showAlert").innerHTML=msg;
	
	
}

function callbackWithConfirm() {

  window.location

	
	
}



//生成默认按钮
function initialDefaultButton(parentId) {
    var sb=new StringBuffer();
    sb.append("<button type='submit' id='submitBtn' class='btn btn-danger' style='margin-right: 10px'>提交</button>");

    if(showClose==1){
        //显示关闭按钮
        sb.append("<button type='button' id='closeBtn' class='btn btn-info' onclick='tek.common.closeWithConfirm();'>关闭</button>");
    } else if (callbackURL){
        //显示返回按钮
        sb.append("<button type='button' id='callbackBtn' class='btn btn-success' onclick='tek.common.callbackWithConfirm()'>返回</button>");
    } else {
        // 显示“提交”、“重置”
        sb.append("<button type='reset' class='btn btn-success'>重置</button>");
    }

    $("#"+parentId).html(sb.toString());
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

// 刷新打开本窗口的opener窗口.
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

// 刷新opener窗口后关闭自己。
function refreshOpenerAndCloseMe(){
    refreshOpener();
    closeWin();
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

/**
 * 关闭当前页面，在关闭前确认
 */
function closeWithConfirm(){
	var closeConfirm = confirm("确定关闭页面？");
	if(closeConfirm)
		window.close();
}

function showReadMessage(msg,parent){
    if(!msg || !parent)
        return;

    var html=new StringBuffer();
    html.append("<div class='loading center loading-style'>");
    html.append(msg);
    html.append("</div>");
//    alert(html);
    document.getElementById(parent).innerHTML=html.toString();
//    $("#"+parent).innerHTML=html.toString();
}