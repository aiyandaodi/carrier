// JavaScript Document
var sendData = {};
var flag = true;
function init(){
	
	getWorksList();	//获取人生经历信息、
	readUser();	//读取用户信息
}

//获取人生经历列表信息
function getWorksList(){
	var setting = {operateType: "获取人生经历列表信息"};
	sendData["objectName"] = "Works";
	sendData["action"] = "getList";
	sendData["works_owner"] = myId;
	sendData["order"] = "works_start";
	sendData["desc"] = "0";
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#works-content").html(html);
		},
		success: function (data) {
			var record = data["record"];
			if (record) {
				$("#works-content").html('')
				record = !record.length ? [record] : record;
				for(var i in record){
					showWorksInfo(record[i]);
				}
			} else {
				$("#works-content").html("未添加人生经历信息！");
			}
		},
		error: function (data, errorMsg) {
			$("#works-content").html(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}


//显示人生经历信息
function showWorksInfo(record){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	html += '<div class="ui-item clearfix">'
	if(record.works_start){
		field = record.works_start;
		html += '<div class="ui-left">'
			+ '<h3>' + tek.dataUtility.stringToHTML(field.show || '') + '</h3>'
			+ '</div>';
	}
	html += '<div class="ui-right">'
		+ '<a href="#" class="ui-icon"><i class="fa fa-user bg-red"></i></a>'
		+ '<div class="ui-rcontent">'
	if(record.works_color){
		field = record.works_color;
		html += '<div class="pull-right">'
			+ '<a href="javascript:;" title="经历色彩" onclick=getColorList("' + field.value + '")><span style="width:15px;height:15px;border-radius:50%;display:inline-block;background:#' + field.value + '"></span></a>'
			+ '</div>'
	}
	html += '<p>'
	if(record.name){
		html += '<a target="_blank" href="read.html?works_id=' + record.id + '&show-close=1&refresh-opener=1">' + tek.dataUtility.stringToHTML(record.name) + '</a>'
			
	}
	if(record.works_type){
		field = record.works_type;
		html += '&nbsp;&nbsp;,&nbsp;<span>' + tek.dataUtility.stringToHTML(field.show || '') + '</span>'
	}
	html += '</p>';
	if(record.works_remark){
		field = record.works_remark.show || '';
		if(field && field.length>20){
			field = field.substring(0,20) + '......';
		}
		html += '<p class="works-remark">' + tek.dataUtility.stringToHTML(field) + '</p>'
	}
	html += '<div class="clearfix"></div></div>'
		+ '</div>';
	html += '</div>';
	var target = document.getElementById("works-content");
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	} 
}

//根据颜色类别显示经历
function getColorList(value){
	if(flag){
		sendData["works_color"] = value;
		flag = false;
	}else{
		delete sendData.works_color;
		flag = true;
	}
	getWorksList();
}

//获取用户信息
function readUser() {
	var setting = {operateType: "读取用户信息"};
	var sendData = {
		objectName: "User",
		action: "readInfo",
		user_id: myId,
		icon: 1
	};
	var callback = {
		success: function (data) {
			var record = data["record"];

			if (record) {
				record = !!record.length ? record[0] : record;
				if(record.icon){
					$('#dLabel').attr('src',record.icon);
				}else{
					$('#dLabel').attr('src','../../ican/person/images/penson.jpg');
				}
				if(record.name){
					var html = '<a href="javascript:;">' + record.name + '</a>';
					$('#userName').html(html)
				}
				
			} 
		},
		error: function (data, errorMsg) {
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	
}
//搜索信息
function quickSearch(searchText) {
	sendData["skip"] = 0;
	sendData["quick-search"] = encodeURIComponent(searchText);
	if(sendData["works_color"]){
		delete sendData.works_color;
	}
	getWorksList();
};

function quickSearchEnter(event) {
	event = event || window.event;    //兼容IE和Firefox获得keyBoardEvent对象
	var key = event.keyCode ? event.keyCode : event.which;
	if (key == 13) {
		quickSearch($("#quickSearchKey").val());
		if (window && window.event && window.event.returnValue)
			window.event.returnValue = false;
	}
	if (event && event.stopPropagation)
		event.stopPropagation();
	else if (window && window.event && window.event.cancelBubble)
		window.event.cancelBubble = true;
};