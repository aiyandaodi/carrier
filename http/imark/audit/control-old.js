function initial() {
	
	tek.core.getURLRequest();
	
	tek.common.getUser();
	
	showUser(); //tekinfo.js
	
	if (tek.common.isLoggedIn()) {
		//if (tek.user.isNormal(parseInt(mySecurity)) && (tek.role.isAuditor(myRole) || tek.role.isCustomerService(myRole))) {
			showUserInfo();
			tek.serverTimer.show();
		//} else {
		//	tek.macCommon.waitDialogShow(null, "你不是系统审计员或客服人员，无法使用当前功能！");
		//	tek.macCommon.waitDialogHide(1500, 'goBack()');
		//}
	} else {
		tek.macCommon.waitDialogShow("<font color='red'>请先登录</font>", "正在跳转登录页面...", null, 0);
		tek.macCommon.waitDialogHide(1500, 'goLogin()');
	}
	
	var error = request["error"];
	
	if (error && error.length > 0)
		showError(tek.dataUtility.stringToHTML(decodeURIComponent(error)));
	
	var message = request["message"];
	if (message && message.length > 0)
		showMessage(tek.dataUtility.stringToHTML(decodeURIComponent(message)));
	
	if (typeof init == "function")
		init();
	
	/** 友盟统计 - 永远放在最后**/
	if(typeof addCnzzYmeng  == "function")
		addCnzzYmeng();
	/** 百度统计  - 永远放在最后**/
	if(typeof addBaiduTongji  == "function")
		addBaiduTongji();
		
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

//调用资质／资格认证。type=0,机构资质认证；type=1,个人资格认证
function openCertificates(type){
	var callBackUrl=window.location.href;
	
	var jsurl=tek.common.getRootPath()+"http/imark/js/imark.js";
	var url=tek.common.getRootPath()+"http/imark/certificates/list.html?callback-url="+callBackUrl;
	//alert("url="+url+";path="+window.location.pathname+";href="+window.location.href);encodeURIComponent
	var param="&open_class=organization_manager&open_sub_class=organization_certificates";
	
	if(type==1){//个人认证
		param="&open_class=human_resource&open_sub_class=certificates";
	}
	
	window.location.href=url+param;
}