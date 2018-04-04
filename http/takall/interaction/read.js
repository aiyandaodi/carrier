// JavaScript Document
var SELECTED_ITEM=null;
var RECORDS = {};		//我关注的好友列表信息
var ISFRIEND = false;	//对方是否关注我,默认false
var FRIEND_ID ;		//对方关注我的id；
var currentPage;  //当且页码
var totalPage;		//总共页数
var count=7;
var skip = 0;
var mydata={};
var isContinueLoad = true;		//是否可以
var is_favorite = false;	//是否已收藏
var favorite_id = '';			//收藏的id;
var ICON;
var interaction_id;
function init(){
	moodInit();

	interaction_id = request["interaction_id"];
	if(interaction_id){
		getInteractionInfo();//获取动态信息
	}

	//获取好友关注信息
	getFriendList();
	//获取公告信息
	getSubjectList(4,"subject_notice");
	//获取问答信息
//	getSubjectList(1,"subject_question");

	//getFavoriteSetList();	//获取收藏夹信息

	/* 监听textarea的变化 */
	$('textarea').bind('input propertychange', function(){  
		if($("#interaction_remark").val() != ""){  
			$("#submitBtn").css({
				opacity: 1,
				filter: 'alpha(opacity=100)'
			})
			$("#submitBtn").removeAttr("disabled");
		}else{  
			$("#submitBtn").css({
				opacity: 0.4,
				filter: 'alpha(opacity=40)'
			}) 
			$("#submitBtn").attr("disabled","disabled");
		};  
	}); 
}


//获取动态信息
function getInteractionInfo(){
	var target = document.getElementById('interaction_list');
    if(!target){
		return;
	}
	
	var setting = {operateType: "获取动态信息"};
	
	mydata = {
		objectName: 'Interaction',
		action: 'readInfo',
		interaction_id: interaction_id
	}
	
	var callback = {
        beforeSend: function () {
			$("#interaction_list").append("<div id='waiting-img' class='col-md-12 col-sm-12 center'><img style='margin-top:10px;' src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            //成功去除等待框
			$("#waiting-img").remove();
			
            var record = data["record"];
            if (record) {
                //显示动态信息
                record = !record.length ? [record] : record;
                for(var i in record){
					showInteractionInfo(record[i], data.right);
				}
                    
				
				
            } else {
                $("#interaction_list").html("<div class='col-md-12 col-sm-12 center'>信息不存在！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#interaction_list").html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, mydata, callback);
}

//显示动态信息
function showInteractionInfo(record, right){
	if(!record){
		return;
	}
	var html = '';
	var field;
	html += '<div class="ui-item clearfix" id="ui-item-' + record.id + '">'
		+ '<div class="ui-right">'
		+ '<div class="ui-rcontent">'
		+ '<div class="pull-right">';
	if(record.interaction_owner){
		field = record.interaction_owner;
		//获取对方的关注列表有没有我
		getIsFriendList(field.value);
		
		if(field.value == myId && record.interaction_status){
			var status = record.interaction_status.value;
			html += '<span class="dropdown rightBtn">'
				+'<select id="" class="btn btn-gray" onchange=changeInteractionStatus(this.value,"' + record.id + '")>'
				+'<option class="btn-default" value="-1" ' + (status == '-1' ? 'selected' : '')+ '>停止</option>'
				+'<option class="btn-default" value="1" ' + (status == '1' ? 'selected' : '')+ '>发布</option>'
				+'</select>'
				+ '</span> '
		}else{
			if(!RECORDS.length){
				html +='<a class="btn btn-default pull-right  rightBtn payAttention-' + field.value + '" onclick=payAttention("' + (field.value || '') + '","' + 		(field.show || '') + '")><i class="fa fa-plus"></i>&nbsp;&nbsp;关注</a> ';
					
			}else{
				var records_id;
				for(var i in RECORDS){
					if(RECORDS[i].friend_other.value == field.value){
						records_id = RECORDS[i].id;
					}
				}
				if(records_id && ISFRIEND){
					html +='<a class="btn btn-default pull-right hide rightBtn payAttention-' + field.value + '" onclick=payAttention("' + (field.value || '') + '","' + (field.show || '') + '")><i class="fa fa-plus"></i>&nbsp;&nbsp;关注</a> '
					+ '<a class="btn btn-default bg-gray hide pull-right rightBtn cancelAttention-' + field.value + '" onclick=cancelAttention("' + records_id + '","' + field.value + '")><i class="fa fa-check"></i>&nbsp;&nbsp;已关注</a>'
					+ '<a class="btn btn-default bg-gray  pull-right rightBtn bothAttention-' + field.value + '" onclick=cancelAttention("' + records_id + '","' + field.value + '")><i class="fa fa-exchange"></i>&nbsp;&nbsp;互相关注</a>';


				}else if(records_id){
					html +='<a class="btn btn-default pull-right hide rightBtn payAttention-' + field.value + '" onclick=payAttention("' + (field.value || '') + '","' + (field.show || '') + '")><i class="fa fa-plus"></i>&nbsp;&nbsp;关注</a> '
					+ '<a class="btn btn-default bg-gray  pull-right rightBtn cancelAttention-' + field.value + '" onclick=cancelAttention("' + records_id + '","' + field.value + '")><i class="fa fa-check"></i>&nbsp;&nbsp;已关注</a>'
					+ '<a class="btn btn-default bg-gray hide pull-right rightBtn bothAttention-' + field.value + '" onclick=cancelAttention("' + records_id + '","' + field.value + '")><i class="fa fa-exchange"></i>&nbsp;&nbsp;互相关注</a>'
				}else {
					html +='<a class="btn btn-default pull-right  rightBtn payAttention-' + field.value + '" onclick=payAttention("' + (field.value || '') + '","' + (field.show || '') + '")><i class="fa fa-plus"></i>&nbsp;&nbsp;关注</a> '
					+ '<a class="btn btn-default bg-gray hide pull-right rightBtn cancelAttention-' + field.value + '" onclick=cancelAttention("' + records_id + '","' + field.value + '")><i class="fa fa-check"></i>&nbsp;&nbsp;已关注</a>'
					+ '<a class="btn btn-default bg-gray hide pull-right rightBtn bothAttention-' + field.value + '" onclick=cancelAttention("' + records_id + '","' + field.value + '")><i class="fa fa-exchange"></i>&nbsp;&nbsp;互相关注</a>'
				}
			}
			
		}
	}
	html += '</div>'
	if(record.interaction_owner){
		field = record.interaction_owner;
		html += '<h4>';
		readUser(field.value);
		if(ICON){
			html += '<a href="#" class="ui-icon imgMobile"><img class="img-responsive pull-left user-icon-' + record.id + '" src="'+ICON+'"></a>'
			
		}
		html += '<a href="#" class="user-name">' + tek.dataUtility.stringToHTML(field.show || '') + '</a></h4>';
	}
	if(record.interaction_remark){
		field = record.interaction_remark;
		html += '<p id="content-' + record.id + '">' + tek.dataUtility.stringToHTML(field.show || '') + '</p>';
	}
	
	html += '<div class="ui-btns">'
	
		+ '<hr/>'
		+ '<a href="javascript:void(0)" onClick="javascript:addSupport(this);"><i class="fa fa-thumbs-o-up"></i>&nbsp;赞<span class="supportCount"></span></a>&nbsp;&nbsp;'
		+ '<a href="javascript:void(0)" id="openA" onClick=openComment(this,"'+record.id+'","'+record.interaction_owner.show+'")><i class="fa fa-commenting-o"></i>&nbsp;评论<span></span></a>&nbsp;&nbsp;'
		+ '<a href="javascript:void(0)" onClick="javascript:shareInteraction();"><i class="fa fa-share-alt"></i>&nbsp;分享</a>&nbsp;&nbsp;'
		+ '<a href="javascript:void(0)" id="star-' + record.id + '" onClick=javascript:addFavoriteBtn("'+ record.id +'","'+ record.interaction_remark.show +'")><i class="fa fa-star-o"></i>&nbsp;收藏</a>';

		
	html += '<div class="pull-right">'
	/*if(tek.right.isCanWrite(parseInt(right))){
		html += '<a href="javascript:void(0)" onclick=editInteraction("' + record.id + '")><i class="fa fa-edit"></i></a> &nbsp;';
	}*/
	if(tek.right.isCanDelete(parseInt(right))){
		html += '<a href="javascript:void(0)" onClick=removeInteraction("' + record.id + '")><i class="fa fa-trash"></i></a> &nbsp;';
	}
	html += '</div>'
		+ '<div class="clearfix"></div>'
		+ '</div>';
	
	
	html += '<div class="ui-comment ui-comment-'+ record.id+' clearfix">'
		/*+ '<a class="pull-left col-sm-12" href="#">显示之前的评论</a>'
		
		
		+ '<div class="col-sm-12 user-comment">'
		+ '<a href="#"><img class="img-responsive pull-left"  src="image/girl.png"></a>'
		+ '<h4 class="pull-left"><a href="#">习明心</a></h4>'
		+ '<div class="pull-right">'
		+ '<span>3小时前</span>&nbsp;'
		+ '<span class="dropdown">'
		+ '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></a>'
		+ '<ul class="dropdown-menu" role="menu">'
		+ '<li><a href="javascript:void(0)"><i class="fa fa-flag"></i>&nbsp;举报</a></li>'
		+ '</ul>'
		+ '</span>'
		+ '</div>'
		+ '<div class="clearfix"></div>'
		+ '<div class="user-comment-content">'
		+ '<p>新的考试办法出台，考生Sed ut pers pici atis unde omnis iste natus error sit volup tatem accu sant ium dolo rem que lau dant ium totam rem ape ria mbo注意了</p>'
		+ '<a href="javascript:void(0)" class="user-support" onClick="javascript:addReplySupport(this)">赞</a>&nbsp;'
		+ '<a href="javascript:void(0)" class="user-support" onClick="javascript:openReply(this)">回复</a>&nbsp;|&nbsp;'
		+ '<a href="javascript:supportList();" class="user-support reply-support-num">赞（<span>6</span>）</a>'
		+ '<hr>'
		+ '<form>'
			+ '<div class="input-group">'
				+ '<input type="text" class="form-control" placeholder="写下你的评论...">'
				+ '<div class="input-group-btn">'
					+ '<button class="btn btn-primary" type="button">send</button>'
				+ '</div>'
			+ '</div>'
		+ '</form>'
		+ '</div>'*/
		+ '</div>'
		
		
	
	
	html += '</div></div></div>';
	
	var target = document.getElementById("interaction_list");
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	}
   /* if(record.interaction_owner){
		readUser(record.interaction_owner.value,'.user-icon-'+record.id);
	} */ 

	openComment("#openA",record.id,record.interaction_owner.show);

}


//更改动态的状态
function changeInteractionStatus(status, id){
	
	var setting = {operateType: "更改状态"};
	var sendData = {
		objectName: "Interaction",
		action: "setInfo",
		interaction_id: id,
		interaction_status: status	//状态
		
	};

	var callback = {
		beforeSend: function () {
			//显示等待提示信息
			var html = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在修改状态...</p>";
			tek.macCommon.waitDialogShow("修改状态", html);
		},
		success: function (data) {
			//存储当前状体
			//INTERACTION_STATUS = status;

			tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >状态修改成功！</p>");
		},
		error: function (data, errorMsg) {
		},
		complete: function () {
			tek.macCommon.waitDialogHide(2000);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}




function postNew(){
	$("#post_hint").addClass("hide");
	$("#my_photo").removeClass("hide");	
	$("#my_title").removeClass("hide");
	$("#post_text").removeClass("hide");
	$("#post_text").focus();
}
//选中心情
function moodInit(){
	$('.ui-296 ul li').on('click',function(){
		$(this).toggleClass('active');
		$(this).siblings('li').removeClass('active');
	})
}
//点赞的用户列表
function supportList(){
	$('#message-supportList').modal();
}
//为动态点赞
function addSupport(index){
	$(index).children('i').attr('class','fa fa-thumbs-up').addClass('active');
	$(index).attr('onClick','javascript:removeSupport(this)');
	var str=$(index).children('span.supportCount').html();
	if(!str){
		$(index).html('<i class="fa fa-thumbs-o-up"></i>&nbsp;赞(<span class="supportCount"></span>)');
		$(index).children('span.supportCount').html(1);
	}else{
		$(index).children('span.supportCount').html(parseInt(str)+1);
	}
	
}
//取消点赞
function removeSupport(index){
	$(index).children('i').attr('class','fa fa-thumbs-o-up');
	$(index).attr('onClick','javascript:addSupport(this)');
	var str=$(index).children('span.supportCount').html();
	
	if(parseInt(str) == 1){
		$(index).html('<i class="fa fa-thumbs-o-up"></i>&nbsp;赞<span class="supportCount"></span>');
	}else{
		$(index).children('span.supportCount').html(parseInt(str)-1);
	}
}
//添加收藏
function addFavoriteBtn(linkId, name){
	$("#favorite-modal-dialog").modal('show');
	getFavoriteSetList(linkId, name);
}
//获取收藏夹信息
function getFavoriteSetList(linkId, name){
	var setting = {operateType: "获取收藏集信息"};
	var sendData = {
		objectName: "FavoriteSet",
		action: "getList",
		favorite_set_owner: myId
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#favorite-modal-dialog-body").html(html);
		},
		success: function (data) {
			var record = data["record"];
			if (record) {
				$("#favorite-modal-dialog-body").html('')
				record = !record.length ? [record] : record;
				for(var i in record){
					showFavoriteSetInfo(record[i], linkId, name);
				}
			} else {
				$("#favorite-modal-dialog-body").html("尚未添加收藏夹！");
			}
		},
		error: function (data, errorMsg) {
			$("#favorite-modal-dialog-body").html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback); 
}
//显示收藏夹信息
function showFavoriteSetInfo(record, linkId, name){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	html += '<div class="item clearfix">'
		+ '<div class="pull-left">';
	if(record.name){
		html += '<h4>' + tek.dataUtility.stringToHTML(record.name) + '</h4>';
	}
	html += '</div>';
	html += '<div class="pull-right">'

	getFavoriteList(record.id, linkId);
	if(is_favorite){
		html += '<a class="" href="javascript:;" id="is_favorite_' + record.id + '" onclick=removeFavorite("' + favorite_id + '","' + record.id + '")>已收藏</a>'
			 + '<a class="hide" href="javascript:;" id="favorite_set_' + record.id + '" onclick=addFavorite("' + record.id + '","' + linkId + '","' + name + '")>收藏</a>'
	}else{
		html += '<a class="hide" href="javascript:;" id="is_favorite_' + record.id + '" onclick=removeFavorite("' + favorite_id + '","' + record.id + '")>已收藏</a>'
			+ '<a class="" href="javascript:;" id="favorite_set_' + record.id + '" onclick=addFavorite("' + record.id + '","' + linkId + '","' + name + '")>收藏</a>'
	}
	
	html += '</div>'
		+ '</div>';

	var target = document.getElementById("favorite-modal-dialog-body");
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	}
}
//创建收藏夹
function addFavoriteSet(){
	var url = tek.common.getRootPath() + 'http/ican/favorite/add-set.html?show-close=1&refresh-opener=1';
	window.open(url);
}
//添加收藏
function addFavorite(setId, linkId, name){
	var setting = {operateType: '添加收藏'};
	var sendData = {
		objectName: 'Favorite',
		action: 'addInfo',
		favorite_set_id: setId,
		favorite_linkName: 'Interaction',
		favorite_name: name,
		favorite_linkid: linkId
	};
	var callback = {
		success: function(data){
			if(data.code==0){
				var value = data.value;
				if(value && value.length >= 12){
					favorite_id =  value.substr(12);
				}

	            $("#favorite_set_"+setId).addClass('hide');
	            $("#is_favorite_"+setId).removeClass('hide');
	            $("#is_favorite_"+setId).attr('onclick','removeFavorite("' + favorite_id + '","' + setId + '")');
	            // $("#star-"+linkId).html('<i class="fa fa-star icon-color"></i>');
			}

	
            // $("#favorite_set_"+setId).html('已收藏');
            // $("#star-"+linkId).html('<i class="fa fa-star icon-color"></i>&nbsp;已收藏');
		},
		error: function(data, errorMsg){
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + errorMsg + "</p>");
		},
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);

}
//获取收藏家下内容列表
function getFavoriteList(setId, linkId){
	var setting = {async:false, operateType: '获取收藏夹下内容列表'};
	var sendData = {
		objectName: 'Favorite',
		action: 'getList',
		favorite_set_id: setId
	};
	var callback = {
		success: function(data){
			is_favorite = false;
			favorite_id = '';
			var record = data['record'];
			if(record){
				record = !record.length ? [record] : record;
				for(var i in record){
					if(record[i].favorite_linkId && record[i].favorite_linkId.value == linkId){
						is_favorite = true;
						favorite_id = record[i].id;
					}
				}
			}
		},
		error: function(data, errorMsg){

		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

//取消收藏
function removeFavorite(id, setId){
	
	var setting = {operateType: '删除收藏'};
	var sendData = {
		objectName: 'Favorite',
		action: 'removeInfo',
		favorite_id: id
	};
	var callback = {
		
		success: function (data) {
			// tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
			
			//target.remove();
			$("#favorite_set_" + setId).removeClass('hide');
			$("#is_favorite_" + setId).addClass('hide');
			
			
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null,errorMsg);
		},
		complete: function () {

		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}
//关注
function payAttention(id, name){
	if(!id || !name){
		return ;
	}
	getNewFriend(id, name);
	
}

//获取关注好友新建域
function getNewFriend(id, name){
	var setting = {async: false, operateType: '获取好友新建/编辑域'};

	var sendData = {
		objectName: "Friend",
		action: "getNew",
		friend_owner: myId
	};

	var callback = {
		success: function(data){
//			$("#document_form_field").empty();

			var record = data["record"];
			if(record){
//				showFriendInfo(record);	//显示新建(只传入record)、编辑域
				var str='<p>关注Ta:</p>'
					+'<form id="friend_form">'
					+ '<input type="hidden" name="friend_name" id="friend_name" value="' + name + '" />'
					+ '<input type="hidden" name="friend_other" id="friend_other" value="' + id + '" />'
					+ '<input type="hidden" name="friend_ownername" id="friend_ownername" value="' + myName + '" />'
					+ '<textarea rows="3" class="form-control" style="resize:vertical" name="friend_remark" id="friend_remark" placeholder="您好，我是'+ myName +'。我对您非常感兴趣，认识一下吧!"></textarea>'
					+ '<div class="text-center sendBtn" ><a href="javascript:submitSend();" class="btn btn-primary">发送</a>'
					+ '&nbsp;&nbsp;'
					+ '<a href="javascript:;" data-dismiss="modal" class="btn btn-default ">取消</a></div>'
					+'</form>';
				showMessage(str);
				
			}
		},
		error: function(data, errorMsg){
			tek.macCommon.waitDialogShow(null, errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
function showFriendInfo(record){
	
}
//提交关注
function submitSend(){
	$("#message-modal-dialog").modal('hide');
	
	var setting = {
		operateType: '提交关注'
	};
	var mydata = tek.common.getSerializeObjectParameters("friend_form") || {};	//转为json

    mydata["objectName"] = "Friend";
    mydata["action"] = "addInfo";
	if(!mydata["friend_remark"]){
		mydata["friend_remark"] = $("#friend_remark").attr("placeholder");
	}
	if(ISFRIEND){
		mydata["friend_status"] = 1;
	}
	if(mydata["friend_other"]){
		var id = mydata["friend_other"];
	}
	
	var callback = {
       	beforeSend: function () {
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在提交...</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
        success: function (data) {
        	tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
            tek.macCommon.waitDialogHide(1500);
			
			/*if(ISFRIEND){
				$(".payAttention-" + id).addClass('hide');
				$(".cancelAttention-" + id).addClass('hide');
				$(".bothAttention-" + id).removeClass('hide');
			}else{
				$(".payAttention-" + id).addClass('hide');
				$(".cancelAttention-" + id).removeClass('hide');
				$(".bothAttention-" + id).addClass('hide');
			}*/
			if(ISFRIEND){
				setFriendInfo(id,1); //互相关注，更改状态为有效1
			}
//			setTimeout(function(){
				location.reload();
//			},1500)
			
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, mydata, callback);
	
	
}

//取消关注，删除记录
function cancelAttention(id,otherId){
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
			
			
			$(".payAttention-" + otherId).removeClass('hide');
			$(".cancelAttention-" + otherId).addClass('hide');
			$(".bothAttention-" + otherId).addClass('hide');
			
			setFriendInfo(otherId, 0);	//改为申请状态
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

//获取好友关注
function getFriendList(){
	var setting = {async:false, operateType: '获取好友关注列表'};
	var mydata = {
		objectName: "Friend",
		action: 'getList',
		friend_owner: myId
	}
	var callback = {
		success: function(data){
			var record = data["record"];
			if (record) {
                //显示关注信息
                RECORDS = !record.length ? [record] : record;  
            } 
		},
		error: function(data,msg){
			
		}
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, mydata, callback);
}

//获取发布动态者的好友列表
function getIsFriendList(id){
	var setting = {
		async: false,
		operateType: '获取好友关注列表'
	};
	var mydata = {
		objectName: "Friend",
		action: "getList",
		friend_owner: id
	};
	var callback = {
		success: function(data){
			var record = data["record"];
			if(record){
				record = !record.length ? [record] : record;
			}
			for(var i in record){
				if(record[i].friend_other.value == myId){
					ISFRIEND = true;
					FRIEND_ID = record[i].id;
				}
			}
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, mydata, callback);
}

//互相关注，默默更改状态为有效1
function setFriendInfo(id, status){
	var setting = {async: false,operateType: '修改好友状态'};
	var mydata = {
		objectName: "Friend",
		action: 'setInfo',
		friend_owner: id,
		friend_id: FRIEND_ID,
		friend_status: status
	};
	var callback = {
		success: function(data){
			console.log("修改成功");
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, mydata, callback);
}
//编辑动态信息
function editInteraction(id){
	
	interactionId = id;
	
	var contentHTML = $("#content-"+id).html();
	$('#interaction_remark').html(contentHTML);
	$('#interaction_remark').focus();
	
	
	
}
//删除动态
function removeInteraction(id){
	/*SELECTED_ITEM=index;
	var str='<p>是否确定删除该动态？</p>'
		+'<a href="javascript:sureRemove();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
	showMessage(str);
	*/
	var target = document.getElementById('ui-item-' + id);
	if (!target)
		return;

	var remove = window.confirm("确定删除吗?");
    if (!remove)
        return;
	
	var setting = {operateType: "确认删除"};
	var sendData = {
		objectName: "Interaction",
		action: "removeInfo",
		interaction_id: id
	};
	var callback = {
		beforeSend: function () {
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 请稍候!</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
			
			setTimeout(function () {
				//等待图层隐藏
				window.close();
			}, 2000);
			
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
function sureRemove(){
	$(SELECTED_ITEM).parents('.ui-item').remove();
	showMessage('删除成功');
}
//分享动态
function shareInteraction(){
	var str='<p>分享理由：</p>'
		+'<form>'
		+'<textarea class="form-control" style="resize:vertical">O(∩_∩)O分享一条有趣的动态给大家~</textarea><p></p>'
		+'<a href="javascript:submitShare();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>'
		+'</form>';
	showMessage(str);
}
function submitShare(){
	showMessage('分享成功');	
}
//=======================================================评论================================
//提交评论
function addReply(id, linkName){
	var target = document.getElementById('reply-form-'+id);
	if(!target){
		return alert("系统错误！ 请与管理员联系！");
	}
	var setting = {operateType: '提交评论'};
	var sendData = {
		objectName: 'ObjectReply',
		action: 'addInfo',
		object_reply_linkId: id,
		object_reply_remark: $("#object_reply_remark-"+id).val(),
		object_reply_name: target.object_reply_name.value,
		object_reply_user: myId
	}
	if(linkName){
		sendData["object_reply_linkName"] = linkName
	}
	if(sendData["object_reply_remark"] == "" || !sendData.object_reply_remark ){
		target.object_reply_remark.placeholder = "请输入你的评论";
		target.object_reply_remark.focus();
		
		//错误提示
		tek.macCommon.waitDialogShow(null, "内容不能为空", null, 0);
		tek.macCommon.waitDialogHide(3000);
		
		return;
	}
	var callback = {
		success: function(data){
			tek.macCommon.waitDialogShow(null, data.message, null, 0);
			target.object_reply_remark.value = "";

			// setTimeout(location.reload(),1500);

		},
		error: function(data, errorMsg){

		},
		complete: function(){
			setTimeout(function(){
				tek.macCommon.waitDialogHide();
			},1500)
		}
	};
	tek.common.ajax(tek.common.getRootPath()+"servlet/tobject", setting, sendData, callback);
}
//显示评论
function openComment(index,id,name){
	$(index).parent().siblings('.ui-comment').slideToggle(200);
	// if(isGetReplyList){
	// 	getReplyList(id);
	// 	isGetReplyList = false;
	// }
	var target = document.querySelector('.ui-comment-'+id);
	target.innerHTML = '';
	getReplyList(id,name);
	var html = '';
	html += '<div class="my-comment">'
		+ '<form id="reply-form-'+id+'">'
			+ '<div class="input-group">'
//				+ '<span class="input-group-addon"><i class="fa fa-user-circle"></i></span>'
				+ '<input type="hidden" value="'+myName+'回复'+name+':" class="form-control" id="object_reply_name-'+id+'" name="object_reply_name">'
				+ '<input type="text" class="form-control" id="object_reply_remark-'+id+'" name="object_reply_remark" placeholder="写下你的评论...">'
				+ '<div class="input-group-btn">'
					+ '<button class="btn btn-primary" type="button" onclick=addReply("'+id+'","Interaction")>评论</button>'
				+ '</div>'
			+ '</div>'
		+ '</form>'
		+ '</div>';

	//var target = document.querySelector('.ui-comment-'+id);
	if(target){
		target.insertAdjacentHTML("BeforeEnd",html);
	}
}
function getReplyList(id,name, wrapDiv){
	var setting = {async:false, operateType: '获取评论信息'};
	var sendData = {
		objectName: 'ObjectReply',
		action: 'getList',
		object_reply_linkId: id
	};
	var callback = {
		beforeSend: function(){
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$(".ui-comment-"+id).html(html);
		},
		success: function(data){

			$(".ui-comment-"+id).html('');
			var record = data.record;
			if(record){
				record = !record.length ? [record] : record;
				for(var i in record){
					showReplyList(record[i], id,name,wrapDiv);
				}
				
			}
		},
		error: function(data, errorMsg){

		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

//显示评论
function showReplyList(record,linkId,name,wrapDiv){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	html += '<div class="col-sm-12 user-comment" id="user-comment-' + record.id + '">';
	if(record.object_reply_user){
		field = record.object_reply_user;
		readUser(field.value);
		if(ICON){
			html += '<a href="#"><img class="img-responsive pull-left" id="icon-' + record.id + '"  src="'+ICON+'"></a>';
		}
		// html += '<h4 class="">'+tek.dataUtility.stringToHTML(field.show || '')+'</h4>'
	}
	if(wrapDiv){
		html += '<h4 class="">'+tek.dataUtility.stringToHTML(record.object_reply_name.show || '')+'</h4>'
	}else{
		html += '<h4 class="">'+tek.dataUtility.stringToHTML(record.object_reply_user.show || '')+'</h4>'
	}
	
	if(record.modifyTime){
		field = record.modifyTime;
		html += '<span class="timeSpan">' + tek.dataUtility.stringToHTML(timestampFormat(field.value) || '') + '</span>&nbsp'
			
	}
	html += '<div class="clearfix"></div>'
		+ '<div class="user-comment-content">';
	if(record.object_reply_remark){
		field = record.object_reply_remark;
		html += '<p>' + tek.dataUtility.stringToHTML(field.show || '') + '</p>';
	}
	html += '<a href="javascript:void(0)" class="user-support" onClick="javascript:addReplySupport(this)">赞</a>&nbsp;'
	 	+ '<a href="javascript:void(0)" class="user-support" onClick="javascript:openReply(this)">回复</a>&nbsp;';
	if(record.object_reply_user.value == myId ){

		html += '<a href="javascript:;" onClick=removeReply("' + record.id + '") class="user-support reply-support-num">删除</a>'
	}
	html += '<form id="reply-form-'+record.id+'">'
		+ '<div class="input-group">'
		+ '<input type="text" class="form-control" placeholder="回复内容..." id="object_reply_remark-'+record.id+'" name="object_reply_remark">'
		+ '<input type="hidden" value="'+myName+'回复'+name+'" class="form-control" id="object_reply_name" name="object_reply_name">'
		+ '<div class="input-group-btn">'
		+ '<button class="btn btn-primary" type="button" onclick=addReply("'+record.id+'","ObjectReply")>回复</button>'
		+ '</div>'
		+ '</div>'
		+ '</form>'
	
	html += '</div></div>';

	if(wrapDiv){
		var target = document.getElementById(wrapDiv);
	}else{
		var target = document.querySelector('.ui-comment-'+linkId);
	}
	
	if(target){
		target.insertAdjacentHTML("BeforeEnd",html);
	}
	/*if(record.object_reply_user){
		readUser(record.object_reply_user.value,'#icon-'+record.id);
	} */

	getReplyList(record.id,record.object_reply_user.show, 'user-comment-'+record.id);
}
//删除评论
function removeReply(id){
	var target = document.getElementById('user-comment-' + id);
	if (!target)
		return;

	var remove = window.confirm("确定删除吗?");
    if (!remove)
        return;
	
	var setting = {operateType: "删除回复"};
	var sendData = {
		objectName: "ObjectReply",
		action: "removeInfo",
		object_reply_id: id
	};
	var callback = {
		beforeSend: function () {
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 请稍候!</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
			
			target.remove();
			
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
//回复评论
function openReply(index){
	$(index).siblings('form').fadeToggle(200);
}
//为用户评论点赞
function addReplySupport(index){
	var str=$(index).siblings('a.reply-support-num').children('span').html();
	$(index).siblings('a.reply-support-num').children('span').html(parseInt(str)+1);
	$(index).attr('onClick','javascript:removeReplySupport(this)');
}
//取消用户评论点赞
function removeReplySupport(index){
	var str=$(index).siblings('a.reply-support-num').children('span').html();
	$(index).siblings('a.reply-support-num').children('span').html(parseInt(str)-1);
	$(index).attr('onClick','javascript:addReplySupport(this)');
}



//用户信息	
function readUser(userId) {
	var setting = {async:false,operateType: "读取用户信息"};
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
			ICON='';
			if (record) {
				record = !!record.length ? record[0] : record;
				if(record.icon){
					// $(imgId).attr('src',record.icon)
					ICON = record.icon;
				}else{
					// $(imgId).attr('src','images/1.jpg')
					ICON = 'images/1.jpg'
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


/************************************************瀑布流*************************************/






//格式化时间（3）js转时间为昨天 今天 刚刚 
function timestampFormat(dateStr) {
  function zeroize(num) {
    return (String(num).length == 1 ? '0' : '') + num;
  }
  var timestamp = dateStr / 1000;
  var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
  var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

  var Y = tmDate.getFullYear(),
    m = tmDate.getMonth() + 1,
    d = tmDate.getDate();
  var H = tmDate.getHours(),
    i = tmDate.getMinutes(),
    s = tmDate.getSeconds();
  if (timestampDiff < 60) { // 一分钟以内
    return "刚刚";
  } else if (timestampDiff < 3600) { // 一小时前之内
    return Math.floor(timestampDiff / 60) + "分钟前";
  } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return '今天' + zeroize(H) + ':' + zeroize(i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return '昨天' + zeroize(H) + ':' + zeroize(i);
    } else if (curDate.getFullYear() == Y) {
      return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    } else {
      return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    }
  }
}