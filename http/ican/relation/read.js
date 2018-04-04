var ICON;	//用户头像
var COUNT = 5;	//显示个数
var SKIP = 0;
var TOTAL = 0;					//总数
var currentPage;
var totalPage;
var isContinueLoad = true;		//是否可以
function init(){
	
	if(tek.common.isLoggedIn()){
		readUser(myId);	//读取用户头像信息
		getProfileInfo(myId, "profile_info");	//获取用户扩展信息

		getFriendList("friend_owner");	//获取关注好友列表
		getFriendList("friend_other");	//获取粉丝列表

		//获取公告信息
		getSubjectList(4,"subject_notice");
		//获取问答信息
		getSubjectList(1,"subject_question");
	}
	
}
//获取用户扩展信息
function getProfileInfo(id, userType){
	var setting = {async:false, operateType: "读取用户扩展信息"};
	var sendData = {
		objectName: "Profile",
		action: "getList",
		profile_owner: id
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center' id='imgSrc'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#"+userType).append(html);
		},
		success: function (data) {
			var record = data["record"];
		
			if (record) {
				$("#imgSrc").remove();
				record = !!record.length ? record[0] : record;
				if(userType == "profile_info"){

					$("#"+userType).html('');
					showProfileInfo(record);
				}else if(userType == "friend_owner"){
					showFriendList(record, "friend_owner");
				}else if(userType == "friend_other"){
					showFriendList(record, "friend_other");
				}
				
			} else {
				$("#"+userType).text("没有用户信息！");
			}
		},
		error: function (data, errorMsg) {
			$("#"+userType).html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
//显示用户扩展信息
function showProfileInfo(record){
	if (!record){
		return;
	}
	var html = '';
	var field;
	
	if(ICON){
		html += '<a href="' + tek.common.getRootPath() + 'http/ican/person/read.html?profile_id=' + record.id +'&show-close=1&refresh-opener=1" target="_blank">'
			+ '<img id="user_icon" src="' + ICON + '" alt="" class="img-respoonsive" />'
			+ '</a>';
	}
	html += '<div class="ui-content">'
	if(record.name){
		html += '<h3>' + record.name;
	}
	/*if(record.profile_describe){
		field = record.profile_describe;
		html += '&nbsp;&nbsp;<span>' + tek.dataUtility.stringToHTML(field.show || '') + '</span>';
	}*/
	html += '</h3>';

	if(record.profile_motto){
		field = record.profile_motto;
		html += '<p>' + tek.dataUtility.stringToHTML(field.value || '') + '</p>';
	}
	html += '<ul class="ul-circle">'
	if(record.profile_jobarea){
		field = record.profile_jobarea;
		html += '<li>' + tek.dataUtility.stringToHTML(field.show || '') + '</li>';
	}
	if(record.profile_degree){
		field = record.profile_degree;
		html += '<li>' + tek.dataUtility.stringToHTML(field.show || '') + '</li>';
	}
	if(record.profile_mode){
		field = record.profile_mode;
		html += '<li>' + tek.dataUtility.stringToHTML(field.show || '') + '</li>';
	}
	html += '</ul>';
	/*html += '<div class="ui-social">'
         + '<a href="#"><img src="../../images/social/readbook.png" class="img-thumbnail"></a>'
         + '<a href="#"><img src="../../images/social/weibo.png" class="img-thumbnail"></a>'
         + '<a href="#"><img src="../../images/social/huaban.png" class="img-thumbnail"></a>'
         + '<a href="#"><img src="../../images/social/qq-512.png" class="img-thumbnail"></a>'
         + '</div>';*/
	$("#profile_info").html(html);
}
//获取关注好友列表
function getFriendList(friendArgu){
	var target = document.getElementById(friendArgu);
    if(!target){
		return;
	}
	
	var setting = {async:false, operateType: "获取关注好友列表"};
	
	var sendData = {
		objectName: 'Friend',
		action: 'getList',
		count: COUNT,
		skip: SKIP,
		order: 'createTime',
		desc: 1,
	}
	sendData[friendArgu] = myId;
	var callback = {
        beforeSend: function () {
            $("#"+friendArgu).html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            var record = data["record"];
            if (record) {
                $("#"+friendArgu).html("");
                //显示关注列表信息
                record = !record.length ? [record] : record;
				if(friendArgu == "friend_owner"){
					RECORDS = record;
					for(var i in record){
						if(record[i].friend_other){
							getProfileInfo(record[i].friend_other.value, "friend_owner");
						}
					}

				}else if(friendArgu == "friend_other"){
					for(var i in record){
						if(record[i].friend_owner){
							getProfileInfo(record[i].friend_owner.value, "friend_other");
						}
					}
				}
				//分页
				var total=parseInt(data.value);
				if(!total)
					total=0;
				currentPage = tek.turnPage.getCurrentPageNumber(SKIP,COUNT);
				totalPage = tek.turnPage.getTotalPageNumber(TOTAL,COUNT);
				if(currentPage<totalPage){
					isContinueLoad = true;
				}else{
					isContinueLoad = false;
				}
                    
            } else {
                $("#"+friendArgu).html("<div class='col-md-12 col-sm-12 center'>没有关注信息！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#"+friendArgu).html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback); 
}




//显示我关注的列表信息
function showFriendList(record, friendType){
	if(!record){
		return ;
	}
	var html = "";
	var field;
	var items = new Array("profile_name", "profile_sex", "profile_resident", "profile_motto", "profile_mode");
	if(record.profile_owner){
		readUser(record.profile_owner.value);
	}
	html += '<div class="ui-info clearfix">'
	if(ICON){
		html += '<img src="' + ICON + '" alt="" class="img-responsive">'
		
	}
	html += '<div class="ui-details">'
		+ '<div class="container-fluid">'
		+ '<div class="row">';
	for(var i in items){
		var item = items[i];
		if(!item){
			break;
		}
		if(record[item]){
			field = record[item];

			html += '<div class="col-md-4 col-sm-4 col-xs-4 col-pad">';
			html += '<div class="ui-item">';
			html += '<h4>' + (field.display || '') + '</h4>';
			html += '<h5>' + tek.dataUtility.stringToHTML(field.show || '') + '</h5>';
			html += '</div>';
			html += '</div>';
		}

	}
	html += '</div></div></div></div>';
	var target = document.getElementById(friendType);
	if(target){
		target.insertAdjacentHTML('BeforeEnd', html);
	}
}

//用户信息	
function readUser(userId) {
	var setting = {async: false, operateType: "读取用户信息"};
	var sendData = {
		objectName: "User",
		action: "readInfo",
		user_id: userId,
		icon: 1
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#user_basic_info").html(html);
		},
		success: function (data) {
			var record = data["record"];

			if (record) {
				record = !!record.length ? record[0] : record;
				if(record.icon){
					ICON = record.icon;
				}else{
					ICON = '../person/images/penson.jpg';
				}
				
			} 
		},
		error: function (data, errorMsg) {
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);	
}


//获取主题公告信息
function getSubjectList(type,target){
	var ajaxURL = tek.common.getRootPath() + "servlet/tobject";
	var setting = {operateType: "获取主题信息"};
	var params = {};
	params["objectName"] = "Subject";
	params["action"] = "getList";
	params["skip"] = 0;
	params["order"] = "createTime";
	params["desc"] = 1;
	params["count"] = 5;
	params["subject_type"] = type;
	
	
	var callback = {
		beforeSend: function(){
			$("#target").append("<div id='waiting-img' class='col-md-12 text-center col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />正在加载数据...</div>");
		},
		success: function(data){
			//alert($("#subject_content").html())
			if(data.code == 0){
				var record = data["record"];
				if(record){
					$("#waiting-img").remove();
					record = !record.length ? [record] : record;
					for(var i in record){
						//显示主题信息
						showSubjectInfo(record[i],target);
					}
				}else{
					$("#target").html("<div class='col-md-12 col-sm-12 center'>没有主题信息！</div>");
				}
			}
		},
		error: function(data, errorMsg){
			$("#target").html(errorMsg);
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
}

//显示主题信息
function showSubjectInfo(record,target){
	if(!record){
		return ;
	}
	var html = "";
	var field;
	html += '<div class="item">';
	if(target == "subject_notice"){
		html += '<h3><a href="' + tek.common.getRootPath() + 'http/takall/subject/read-notice.html?subject_id=' + record.id + '" target="_blank">' + record.name + '</a></h3>'
	}
	else if(target == "subject_question"){
		html += '<h3><a href="' + tek.common.getRootPath() + 'http/takall/subject/read-qa.html?subject_id=' + record.id + '" target="_blank">' + record.name + '</a></h3>'
	} 
	html += '<div class="meta">';
	if(record.createTime){
		field = record.createTime.show || '';
		html += '<i class="fa fa-calendar"></i>' + tek.dataUtility.stringToHTML(field) + '&nbsp;&nbsp;';
	}
	if(record.subject_owner){
		field = record.subject_owner.show || '';
		html += '<i class="fa fa-user"></i></i>' + tek.dataUtility.stringToHTML(field);
	}
	if(record.subject_summary){
		field = record.subject_summary.show || '';
		html += '<p>' + tek.dataUtility.stringToHTML(field) + '</p>'
	}
	html += '</div>';
	
	var target = document.getElementById(target);
	if(target){
		target.insertAdjacentHTML("BeforeEnd",html);
	}
}
