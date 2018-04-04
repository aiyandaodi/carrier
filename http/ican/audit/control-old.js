

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
