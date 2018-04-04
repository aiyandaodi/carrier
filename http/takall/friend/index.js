// JavaScript Document
var MOTTO;	//人生格言
var ICON;	//用户头像
var RECORDS = {}	//我关注的列表信息
var SKIP = 0;					//列表起始值
var COUNT = 5;					//每页显示的个数
var TOTAL = 0;					//总数
var currentPage;
var totalPage;
var isContinueLoad = true;		//是否可以
var isBlack = false;
function init(){
	/* 点击编辑备注信息 */
    $('#editName').click(function(){
		$('.aName').css('display','none');
		$('.inputName').css('display','block')
		$('.inputName').val($('.aName').html())
		$('.inputName').focus();
		$('.inputName').css({
			border: '1px solid #ada8a8',
			background: '#fff'
		});
		
	})
    /* 失去焦点input隐藏 */
	$('.inputName').focusout(function(){
		$('.aName').html($('.inputName').val());
		$('.inputName').css('display','none')
		$('.aName').css('display','inline-block');
	})
	

    /** 加入触屏事件 **/
    //showMessage("t="+typeof isTouchScreenDevice );
    if(typeof isTouchScreenDevice == "function"){
        isTouchScreenDevice();
    }
	
	getFriendList("friend_owner");	//获取关注好友列表
	getFriendList("friend_other");	//获取粉丝列表
	
	//获取公告信息
	getSubjectList(4,"subject_notice");
	//获取问答信息
	getSubjectList(1,"subject_question");
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
		desc: 1
		
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
						showFriendList(record[i]);

					}
				}else if(friendArgu == "friend_other"){
					for(var i in record){
						if(record[i].friend_status.value == -1){
							showFansList(record[i],"friend_black");
						}else{
							showFansList(record[i],"friend_other");
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
                $("#"+friendArgu).html("<div class='col-md-12 col-sm-12 center'>没有更多内容！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#"+friendArgu).html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback); 
}


//显示我关注的好友列表信息
function showFriendList(record){
	if(!record){
		return;
	}
	var html = '';
	var field;
	
	html += '<div class="col-md-12 col-sm-4" id="ui-item-' + record.id + '">'
		+ '<div class="item">'
		+ '<div class="head clearfix">'
	if(record.friend_other){
		field = record.friend_other;
		readUser(field.value);	//获取用户id头像
		getProfileInfo(field.value);//获取用户人生格言
		
		if(ICON){
			html += '<img src="' + ICON + '" alt="" class="img-responsive" />'
		}
	}
	html += '<h2 class="clearfix">';
	if(record.friend_name){
		field = record.friend_name;
		html += '<a href="#" class="aName">' + tek.dataUtility.stringToHTML(field.show || '') + '</a>'
			+ '<input class="col-md-10 inputName" type="text" />'
			+ '<a class="col-md-2 pull-right" href="javascript:;"></a>'
	}
	
	if(MOTTO){
		html += '<p> ' + MOTTO + '</p>'
	}
	html += '</h2>'
		+ '</div>'
		+ '<div class="content">'
		+ '<ul class="list-unstyled">'
		+ '<li>'
	
	html += '<a href="javascript:;" class="btn btn-default" onclick=cancelAttention("' + record.id + '","friend_owner")>取消关注</a>'
	
	if(record.friend_status){
		field = record.friend_status;
		if(field.value == -1){
			html += '&nbsp;<a href="#" class="btn btn-danger">请求解除黑名单</a>';
		}
		
	}
	
	
	html +=  '</li>'
		+ '</ul></div></div></div>'
	
	var target = document.getElementById("friend_owner");
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	}
}

//显示关注我的好友列表信息
function showFansList(record, friendType){
	if(!record){
		return;
	}
	var html = '';
	var field;
	
	html += '<div class="col-md-12 col-sm-4" id="ui-item-' + record.id + '">'
		+ '<div class="item">'
		+ '<div class="head clearfix">'
	if(record.friend_owner){
		field = record.friend_owner;
		readUser(field.value);	//获取用户id头像
		getProfileInfo(field.value);//获取用户人生格言
		
		if(ICON){
			html += '<img src="' + ICON + '" alt="" class="img-responsive" />'
		}
	}
	html += '<h2 class="clearfix">';
	if(record.friend_ownername){
		field = record.friend_ownername;
		html += '<a href="#" class="aName">' + tek.dataUtility.stringToHTML(field.show || '') + '</a>'
			+ '<input class="col-md-10 inputName" type="text" />'
			+ '<a class="col-md-2 pull-right" href="javascript:;"></a>'
	}
	
	if(MOTTO){
		html += '<p> ' + MOTTO + '</p>'
	}
	html += '</h2>'
		+ '</div>'
		+ '<div class="content">'
		+ '<ul class="list-unstyled">'
		+ '<li>'
	if(friendType == "friend_other" && RECORDS){
		var friend_id;
		for(var i in RECORDS){
			if(RECORDS[i].friend_other.value == record.friend_owner.value){
				friend_id = RECORDS[i].id;
			}
		}
		if(friend_id){
			html += '<a href="javascript:;" class="btn btn-default bothAttention-' + record.id + '" onclick=cancelAttention("' + friend_id + '","' + record.id + '")>互相关注</a>&nbsp;'
				+ '<a href="javascript:;" class="btn btn-default hide payAttention-' + record.id + '" onclick=payAttention("' + record.friend_ownername.show + '")>加关注</a>&nbsp;'
		}else{
			html += '<a href="javascript:;" class="btn btn-default hide bothAttention-' + record.id + '" onclick=cancelAttention("' + record.id + '","friend_other")>互相关注</a>&nbsp;'
				+ '<a href="javascript:;" class="btn btn-default payAttention-' + record.id + '" onclick=payAttention("' + record.friend_owner.value + '","' + record.friend_owner.show + '")>加关注</a>&nbsp;'
		}
		html += '<a href="javascript:;" class="btn btn-danger" onclick=addFriendBlack("' + record.id + '")>加入黑名单</a>';
	}
	if(friendType == "friend_black"){
		html += '<a href="javascript:;" onclick=removeBlack("' + record.id + '","' + record.friend_owner.value + '") class="btn btn-danger">移除黑名单</a>';
	}
	html +=  '</li>'
		+ '</ul></div></div></div>'
	
	var target = document.getElementById(friendType);
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	}
}
//获取对方好友列表
/*function getIsFriendList(id){
	var setting = {async:false, operateType: "获取关注好友列表"};
	
	var sendData = {
		objectName: 'Friend',
		action: 'getList',
		friend_owner: id,
		friend_status: '-1'
	};
	var callback = {
		success: function (data) {
            var record = data["record"];
            if (record) {
                //显示关注列表信息
                record = !record.length ? [record] : record;   
                for(var i in record){
                	if(record[i].friend_other && record[i].friend_other.value == myId){
                		isBlack = true;
                	}
                } 
            }else{
            	isBlack = false;
            } 
        },
        error: function(data, errorMsg){

        }
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}
*/
//取消关注，删除记录
function cancelAttention(id, friendType){
	var target = document.getElementById('ui-item-' + id);
	if (!target){
		return;
	}
	
	var remove = window.confirm("确定要取消关注吗?");
    if (!remove){
		return;
	}
    var setting = {operateType: "取消关注"};
	var sendData = {
		objectName: "Friend",
		action: "removeInfo",
		friend_id: id
	};
	var callback = {
		beforeSend: function () {
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 请稍候!</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
			if(friendType == "friend_owner"){
				target.remove();
			}else {
				$(".payAttention-"+friendType).removeClass('hide');
				$(".bothAttention-"+friendType).addClass('hide');
			}
			
			
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null,errorMsg);
		},
		complete: function () {

			setTimeout(function () {
				//等待图层隐藏
				tek.macCommon.waitDialogHide();
			}, 2000);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);    
}
//加入黑名单
function addFriendBlack(id){
	var target = document.getElementById('ui-item-' + id);
	if(!target){
		return ;
	}
	var remove = window.confirm("确定要加入黑名单?");
	if(!remove){
		return ;
	}
	var setting = {operateType: "加入黑名单，修改操作"};
	var sendData = {
		objectName: "Friend",
		action: "setInfo",
		friend_id: id,
		friend_status: -1
	};
	var callback = {
		beforeSend: function(){
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在提交...</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
		success: function(data){
			tek.macCommon.waitDialogShow(null, "<p class='text-center'>" + data.message + "</p>");
			
			target.remove();
		},
		error: function(data, errorMsg){
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
		comlplete: function(){
			setTimeout(function () {
				//等待图层隐藏
				tek.macCommon.waitDialogHide();
			}, 2000);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback); 
	
}

//移除黑名单
function removeBlack(id, friendOther){
	var target = document.getElementById('ui-item-' + id);
	if(!target){
		return ;
	}
	if(RECORDS){
		var isAttention = false;
		for(var i in RECORDS){
			if(RECORDS[i].friend_other.value == friendOther){
				isAttention = true;
			}
		}
	}

	var remove = window.confirm("确定要从黑名单移除吗？");
	if(!remove){
		return ;
	}
	var setting = {operateType: '移出黑名单，修改操作'};
	var sendData = {
		objectName: "Friend",
		action: "setInfo",
		friend_id: id
	};
	if(isAttention){
		sendData["friend_status"] = 1;
	}else{
		sendData["friend_status"] = 0;
	}
	var callback = {
		beforeSend: function(){
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在提交...</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
		success: function(data){
			tek.macCommon.waitDialogShow(null, "<p class='text-center'>" + data.message + "</p>");
			
			target.remove();

		},
		error: function(data, errorMsg){
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
		comlplete: function(){
			setTimeout(function () {
				//等待图层隐藏
				tek.macCommon.waitDialogHide();
			}, 2000);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback); 
}
//添加关注
function payAttention(id, name){
	
	var setting = {
		operateType: '提交关注'
	};
	var mydata = tek.common.getSerializeObjectParameters("friend_form") || {};	//转为json
	var mydata = {
		objectName: "Friend",
		action: "addInfo",
		friend_name: name,
		friend_other: id,
		friend_ownername: myName
	}
	
	var callback = {
       	beforeSend: function () {
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在提交...</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
        success: function (data) {
        	tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
            tek.macCommon.waitDialogHide(1500);
			
			
			setTimeout(function(){
				location.reload();
			},1500)
			
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, mydata, callback);
	
	
}

//获取个人信息,人生格言
function getProfileInfo(id){
	var setting = {async: false, operateType: "获取个人信息"};
	var sendData = {
		objectName: "Profile",
		action: "getList",
		profile_owner: id
	}
	var callback = {
		success: function(data){
			MOTTO = '';
			var record = data.record;
			if(record){
				record = !record.length ? [record] : record;
				var profileMotto;
				for(var i in record){
					if(record[i].profile_motto){
						profileMotto = tek.dataUtility.stringToHTML(record[i].profile_motto.value || '');
					}
				}
				if(profileMotto){
					MOTTO = profileMotto;
				}
			}
		},
		error: function(data,errorMsg){
					
		}
	
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
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
					ICON = '../../ican/person/images/penson.jpg';
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


/**
 * 显示默认的列表翻页按钮
 *
 * @param data
 *           检索结果
 */
function showCustomListTurn(data) {
	var elem=document.getElementById("page");
	if (!elem)
		return;
	
	elem.innerHTML="";
	
	var skip=mydata["skip"];
	if(!skip){
		skip=0;
		mydata["skip"]=skip;
	}
	skip=parseInt(skip);
	if(!skip)
		skip=0;
		
	count=mydata["count"];
	  
	if(!count){
		count=PAGE_COUNT;
		mydata["count"]=count;
	}
	
	count=parseInt(count);
	if(!count)
		count=0;
	
	var total=parseInt(data.value);
	if(!total)
		total=0;

    //显示页码html信息文本 
	elem.innerHTML = tek.turnPage.getPagination(skip,count,total);
  	
	currentPage = tek.turnPage.getCurrentPageNumber(skip,count);
	totalPage = tek.turnPage.getTotalPageNumber(total,count);
	
	if(currentPage<totalPage){
		isContinueLoad = true;
		$("#more_page").removeClass("hidden");   //加载瀑布流完成后显示下一页按
		$("#ajax-load-div").addClass("hidden");
	}else{
		isContinueLoad = false;
		$("#more_page").addClass("hidden"); 
		$("#ajax-load-div").addClass("hidden");
	}
}


//监听滚动条
$(window).scroll(function(){
	if(!isContinueLoad)
		return ;

	if(($(this).scrollTop() + 2) >= ($(document).height()-$(this).height())){
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		$("#more_page").addClass("hidden");
		changePage(null,(currentPage*count));
	}//end  if...
});

//下一页按钮，翻到下一页
function morePage(){
	if(currentPage<totalPage) {
		if(!$("#test-list").is(":visible"))
			$(".wminimize").click();
		
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		$("#more_page").addClass("hidden");
		changePage(null,(currentPage*count));
	}else{
		$("#ajax-load-div").removeClass("hidden");
		$("#more_page").addClass("hidden");
	}
}//end morePage()

function changePage(id, skip){
  SKIP = skip;
  getFriendList();
}







