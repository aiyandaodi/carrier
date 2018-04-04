/**
 * Created by zhkj on 2017/3/16.
 */
// JavaScript Document
var COUNT = 10;
var group_id;
var ICON;	//用户头像
function init(){
	if(request["group_id"] && request["group_id"] != null){
		group_id = request["group_id"];
	}
	if(group_id){
		// 获得小组信息
		getGroupInfo();
		//获得组员信息
		getMemberInfo();
	}else{
		tek.common.waitDialogShow(null, "没有传入要读取的小组ID");
	}
   
}
// 获得小组信息
function getGroupInfo(){
	var setting = {operateType: "获取组员信息"};
	var params = {};
	params['objectName'] = 'Group';
	params['action'] = 'getList';
	// params['count'] = COUNT;
	params['skip'] = 0;
	params['group_id'] = group_id;

	var callback = {
		beforeSent: function(){
			$('#group-name').html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function(data){
			if(data.code == 0){
				var record = data["record"];
				if(record){
					$('#group-name').html("");
					$("#dLabel").attr("src", record.icon || '../../style/extend/img/ui-81/1.jpg');
					if(record['group_name']){
						var name = record['group_name'].show || "";
					}
					$('#group-name').html(tek.dataUtility.stringToHTML(name));
					$('#group-name').attr('href', '../group/read.html?group_id=' + group_id);

				}else{
					$('#group-name').html("<div class='col-md-12 col-sm-12 center'>没有小组信息！</div>")
				}
			}
			
		},
		error: function(data, errorMsg){
			$('#member-info').html(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
}
// 读取组员信息
function getMemberInfo(){
	var setting = {operateType: "获取组员信息"};
	tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";

	tek.macList.params = {};
	tek.macList.params['objectName'] = 'Member';
	tek.macList.params['action'] = 'getList';
	// params['count'] = COUNT;
	tek.macList.params['skip'] = 0;
	tek.macList.params['group_id'] = group_id;

	var callback = {
		beforeSent: function(){
			$('#member-info').html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
		},
		success: function(data){
			if(data.code == 0){
				var record = data["record"];
				if(record){
					$('#member-info').html("");
					record = !record.length ? [record] : record;
					for(var i in record){
						//显示组员信息
						showMemberInfo(record[i], data.right);
					}
					
				}else{
					$('#member-info').html("<div class='col-md-12 col-sm-12 center'>没有组员信息！</div>")
				}
			}
			
		},
		error: function(data, errorMsg){
			$('#member-info').html(errorMsg);
		}
	};

	tek.common.ajax(tek.macList.ajaxURL, setting, tek.macList.params, callback);
}

//显示组员信息
function showMemberInfo(record, right){
	if(record){
		var html = "";
		var field;
		html += '<div class="col-md-4 ">';
		html += '<div class="item">';
		html += '<div class="head clearfix">';
		if(record['member_user']){
			field = record['member_user'];
			readUser(field.value);
		}
		html += '<img src="' + (ICON || '../../style/extend/img/ui-81/1.jpg') + '" alt="" class="img-responsive" />';
		if(record['member_name']){
			field = record['member_name'];
			html += '<h2><a href="read.html?member_id=' + record.id + '">' + tek.dataUtility.stringToHTML(field.show || '') + '</a>';
		}
		if(record['member_status']){
			field = record['member_status'];
			html += '<span>' + tek.dataUtility.stringToHTML(field.show || '') + '</span></h2>'
		}
		html += '<div class="ui-social">';
		if(tek.right.isCanWrite(parseInt(right))){
			html +='<a href="edit.html?member_id='+ record.id +'" class="ui-tooltip" data-toggle="tooltip" data-placement="top" title="编辑"><i class="fa fa-pencil bg-lblue"></i></a>';
		}
		/*if(tek.right.isCanRead(parseInt(right))){
			html += '<a href="read.html?member_id=' + record.id + '" class="ui-tooltip" data-toggle="tooltip" data-placement="top" title="查看"><i class="fa fa-file bg-lblue"></i></a>';
		}*/
		if(tek.right.isCanDelete(parseInt(right))){
            html += '<a href="#" class="ui-tooltip" data-toggle="tooltip" data-placement="top" title="删除"><i class="fa fa-trash-o bg-lblue"></i></a>';
        }
        html += '</div>';
        html += '</div>';
        html += '<div class="content">';
        html += '<ul class="list-unstyled">';
        if(record['member_mobile']){
        	field = record['member_mobile'];
        	html += '<li><a href="#"><i class="fa fa-phone bg-red"></i> ' + tek.dataUtility.stringToHTML(field.show || '') + '</a></li>';
        }
        if(record['member_email']){
        	field = record['member_email'];
        	html += '<li><a href="#"><i class="fa fa-envelope bg-green"></i> ' + tek.dataUtility.stringToHTML(field.show || '') + '</a></li>';
        }
        if(record['member_member_right']){
        	field = record['member_member_right'];
        	html += '<li><a href="#"><i class="fa fa-unlock-alt bg-purple"></i> ' + tek.dataUtility.stringToHTML(field.show || '') + '</a></li>';
        }
        if(record['member_remark']){
        	field = record['member_remark'];
        	html += '<li><a href="#"><i class="fa fa-bookmark bg-blue"></i> ' + tek.dataUtility.stringToHTML(field.show || '') + '</a></li>'
        }
        html += '</ul>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        var target = document.getElementById("member-info");
        if(target){
            target.insertAdjacentHTML("BeforeEnd",html);
        }
	}
}

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
function quickSearch(searchText){
	var params =  tek.dataUtility.objectCopy(tek.macList.params,params);
	params["quick-search"] = encodeURIComponent(searchText);
	// params["action"] = 'getSearch';
	var setting = {operateType: ''};
	var callback = {
		success: function (data){
			// 操作成功
			if(data.code == 0){
				var record = data["record"];
				if(record){
					$('#member-info').html("");
					record = !record.length ? [record] : record;
					for(var i in record){
						//显示组员信息
						showMemberInfo(record[i], data.right);
					}
					
				}else{
					$('#member-info').html("<div class='col-md-12 col-sm-12 center'>没有组员信息！</div>")
				}
			}
			
		},
		error: function (data, errorMsg){
		}
	};
	tek.common.ajax(tek.macList.ajaxURL,setting,params,callback);
}

function readUser(id){
	var setting = {async:false, operateType: "读取用户信息"};
	var sendData = {
		objectName: "User",
		action: "readInfo",
		user_id: id,
		icon: 1
	};
	var callback = {
		success: function (data) {
			var record = data["record"];

			if (record) {
				record = !!record.length ? record[0] : record;
				if(record.icon){
					ICON = record.icon
				}else{
					ICON = '';
				}
				
			} 
		},
		error: function (data, errorMsg) {
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}