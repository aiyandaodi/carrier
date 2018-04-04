// JavaScript Document
var showClose;    // 是否关闭
var callbackURL;    // 回调地址
var updateOpener;    //是否刷新父页面
var service_provider_id;  //获取组织机构id

var items = new Array("service_provider_code", "service_provider_name", "service_provider_url", "service_provider_port", 
	"service_provider_protocol", "service_provider_version", "service_provider_param", "service_provider_appid", "service_provider_status", "service_provider_default");

/**
* 初始化
*/
function init(){
	showClose=request["show-close"];
	service_provider_id=request["service_provider_id"];
	if(showClose
		&& (showClose==1 || showClose==true))
	  showClose=1;
	else
	  showClose=0;

	callbackURL=request["callback-url"];
	if(callbackURL)
	  callbackURL=decodeURIComponent(callbackURL);

	updateOpener=request["refresh-opener"];
	if(updateOpener
		&& (updateOpener==1 || updateOpener==true))
	  updateOpener=1;
	else
	  updateOpener=0;

	tek.macEdit.initialButton("btn");
	
	getEditInfo();


}


$().ready(function() {
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

function getEditInfo(){
	var params = {};
	params["objectName"] = "ServiceProvider";
	params["action"] = "getEdit";
	params["service_provider_id"] = service_provider_id;

	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "set-info");
}


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

//提交信息
function commitInfo(){
	var mydata=tek.common.getSerializeObjectParameters("set_form") || {};	//转为json

	
	
	mydata["objectName"]="ServiceProvider";
	mydata["action"]="setInfo";
	mydata["service_provider_id"]=request["service_provider_id"];
	
	tek.macEdit.editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);
}