// JavaScript Document
// control.js
var LATEST_CALL_PATH;

// 调用后台管理子进程
// path - 相对根目录的路径（不包含文件名）
function callSubServicePage(path){
	if(path){
		if(LATEST_CALL_PATH){
			if (typeof unloadList == "function")
					unloadList();
					
			$("script[src='"+LATEST_CALL_PATH+"list.js']").remove();
		}
		
		//记载载入路径
		LATEST_CALL_PATH=tek.common.getRootPath()+path;
		
		callURL=LATEST_CALL_PATH+"i-list.html";
		callJS=LATEST_CALL_PATH+"list.js";
		//alert(callURL);
		$("#service_page").load(callURL, function() {
			//载入该页面的js
			$.getScript(callJS,function(){
				if (typeof init == "function")
					init();
			});
		})
	}
}

//---------------------------------------------------------------------------------------------------
//后台管理程序
//显示当前打开的链接（一级）
//如果有传递参数 open_class,则打开该参数指定链接。
//如果没有，则打开传递的参数
function showOpenClass(target) {
	var openClass=request["open_class"];
	if(!openClass)
		openClass=target;
		
    appendOpenClass(openClass, "open");
}

//显示当前打开的链接（二级）
//如果有传递参数 open_sub_class,则打开该参数指定链接。
//如果没有，则打开传递的参数
function showSubClass(target) {
	var openSubClass=request["open_sub_class"];
	if(!openSubClass)
		openSubClass=target;
	
	var oUls = document.getElementById("nav").getElementsByTagName("ul");
	for(var i in oUls){
		var oLis = oUls[i].childNodes;
		for(var j in oLis){
			if(oLis[j].className == 'current'){
				oLis[j].className = '';
			}
		}
	}
    appendOpenClass(openSubClass, "current");
}

/**
 * 显示当前打开的链接
 * target - 指定tag 名字
 * className - 指定打开标识的class名字
 */
function appendOpenClass(target, className) {
    if (target) {
        var obj = document.getElementById(target);
        if (obj) {
            if (!className || className.length < 1 || className == "undefined")
                className = "open";

            if (obj.className && obj.className.length > 0)
                obj.className += " " + className;
            else
                obj.className = className;
        } //end if(obj)
    } //end if(target)
}


// 取得待审核机构
function showApplyOrgTotal(id, type) {
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={};
	var sendData={};
	sendData["objectName"]="Organization";
	sendData["action"]="getTotal";
	sendData["organization_type"]=type;
	sendData["organization_status"]=ORGANIZATION_STATUS["applay"];
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			if(total)
				$("#"+id).html(total);
		}
	};
    tek.common.ajax(url, setting, sendData, callback);
}

// 取得待审核专家
function showApplyExpertTotal() {
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={};
	var sendData={};
	sendData["objectName"]="Expert";
	sendData["action"]="getTotal";
	sendData["expert_status"]=EXPERT_STATUS["applay"];
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			if(total)
				$("#apply-expert-total").html(total);
		}
	};
    tek.common.ajax(url, setting, sendData, callback);
}

// 取得待审核用户
function showApplyUserTotal() {
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={};
	var sendData={};
	sendData["objectName"]="User";
	sendData["action"]="getTotal";
	sendData["user_security"]=0;
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			if(total)
				$("#apply-user-total").html(total);
		}
	};
    tek.common.ajax(url, setting, sendData, callback);
}

// 取得机构总数
function showOrganizationTotal() {
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={};
	var sendData={};
	sendData["objectName"]="Organization";
	sendData["action"]="getTotal";
	sendData["organization_status"]=ORGANIZATION_STATUS["normal"];
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			if(total)
				$("#organization-total").html(total);
		}
	};
    tek.common.ajax(url, setting, sendData, callback);
}

// 取得专家总数
function showExpertTotal() {
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={};
	var sendData={};
	sendData["objectName"]="Expert";
	sendData["action"]="getTotal";
	sendData["expert_status"]=EXPERT_STATUS["normal"];
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			if(total)
				$("#expert-total").html(total);
		}
	};
    tek.common.ajax(url, setting, sendData, callback);
}

// 取得用户总数
function showUserTotal() {
    var url=tek.common.getRootPath()+"servlet/tobject";
	var setting={};
	var sendData={};
	sendData["objectName"]="User";
	sendData["action"]="getTotal";
	sendData["user_security"]=16;
	var callback={};
	callback["success"]=function(data) {
		if(data) {
			var total=data.value;
			if(total)
				$("#user-total").html(total);
		}
	};
    tek.common.ajax(url, setting, sendData, callback);
}
