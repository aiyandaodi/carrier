// JavaScript Document
var showClose;    // 是否关闭
var callbackURL;    // 回调地址
var updateOpener;    //是否刷新父页面
var service_provider_id;  //获取组织机构id
var message_account_id;
$().ready(function() {
		
	showClose=request["show-close"];
	service_provider_id=request["service_provider_id"];
	if(showClose && (showClose==1 || showClose==true)){
		showClose=1;
	}else{
		showClose=0;
	}
	callbackURL=request["callback-url"];
	message_account_id=request["message_account_id"];

	
    if(callbackURL){
		callbackURL=callbackURL+"?show_close=1&refresh-opener=1";
  
		if(message_account_id) {
			callbackURL=callbackURL+"&message_account_id="+message_account_id;
		}
	    callbackURL=decodeURIComponent(callbackURL);
	   	alert(callbackURL);
	
	}
	updateOpener=request["refresh-opener"];
	if(updateOpener && (updateOpener==1 || updateOpener==true)){
		updateOpener=1;
	}else{
		updateOpener=0;
	}
	//tek.macEdit.initialButton("btn");
	
	$("#add_form").validate({  
		rules: {
			service_provider_code: "required",
			service_provider_name: {
				required: true,
			},
			service_provider_url: {
				required: true,
				dns:true,
			},
			service_provider_port:{
				required: true, 
				number:true,
			}

		},
		messages: {
			service_provider_code: "请填写名称.中文/英文字母或数字(6位以上)",
			service_provider_name: {
				required: "请填写名称.中文/英文字母或数字(6位以上)",

			},
			service_provider_url: {
				required: "请填写域名或者ip地址",
				dns: "域名或者ip地址格式不对",
			},
			service_provider_port: {
				required: "请填写主机提高服务的端口(数字)",
				number:"端口号必须都为数字"
			}

		}
	});
 
 
	jQuery.validator.addMethod("dns", function(value, element) {   

		return this.optional(element) || (checkIP(value));
		
	}, "请正确填写您的邮政编码");
 
 
 
});


/*	function init(){
if(myId && myId>0){
		var obj=document.getElementById("slide-photo");
		if(obj)
			obj.style.display="none";	
	}else{
		//window.setTimeout("promptLogin()",59000);	//delayseconde
	}*/

function checkIP(val)
{

    var ipArray,ip,j;
    ip = val;

    if(/[A-Za-z_-]/.test(ip)){
        if (ip.indexOf(" ")>=0){
            ip = ip.replace(/ /g,"");

        }
        if (ip.toLowerCase().indexOf("http://")==0){
            ip = ip.slice(7);

        }
        if(!/^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|(io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp))$/.test(ip)){
          //  alert("不是正确的域名");

            return false;
        }
		   return true;
    }
    else{
        ipArray = ip.split(".");
        j = ipArray.length
        if(j!=4)
        {
            //alert("不是正确的IP");

            return false;
        }

        for(var i=0;i<4;i++)
        {
            if(ipArray[i].length==0 || ipArray[i]>255)
            {
              //  alert("不是正确的IP");

                return false;
            }
        }
		  return true;
    }
	 
}

function addNewInfo(){
	var sendData = tek.common.getSerializeObjectParameters("add_form") || {};	//转为json

	sendData["objectName"] = "ServiceProvider";
	sendData["action"] = "addInfo";
	/*
	 if (tek.type.isEmpty(sendData["option_objectId"]))
	 sendData["option_objectId"] = "0";

	 if (tek.type.isEmpty(sendData["option_owner"]))
	 sendData["option_owner"] = "0";
	 */
	if (tek.type.isEmpty(sendData["service_provider_name"])) {
		tek.macCommon.waitDialogShow(null, "配置名不能为空");
		tek.macCommon.waitDialogHide(3000);
		return;
	}

	tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);
}


function changePro(obj) {

  	  var value=obj.options[obj.selectedIndex].value;
	  if(value=='0') { 
	  $("#service_provider_protocol_other").css("display","block");
	    $("#service_provider_protocol_other").addClass("required");
	   
		 
	  }else {
		 
		     $("#service_provider_protocol_other").removeClass("required");
		  $("#service_provider_protocol_other").empty();
		 
		  $("#service_provider_protocol_other").css("display","none");
	  }
	
}