var subjectId;
var tuijian_number = 0; //推荐人数
var fandui_number = 0; //反对人数
var this_user_attitude = 0;//判断当前用户是否参与赞成或者反对，0未参与，1已参与推荐，-1已参与反对
var ICON;   //用户头像
var ISFRIEND = false;   //对方是否关注我,默认false
// function init(){
//     subjectId = request['subject_id'];
// }
/*设置态度 推荐/反对 */
function thumbsUp(attr){
	if(!subjectId){
		return ;
	}
	attr = parseInt(attr);
	this_user_attitude = parseInt($("#attitude").val());
	if(this_user_attitude === attr){
		return ;
	}
	var setting = {async: false, operateType: "设置推荐或反对态度"};
	var sendData = {
		objectName: "Subject",
		action: "setInfo",
		subject_id: subjectId
	};
	switch (this_user_attitude) {
        //当前用户已推荐
        case 1:
            //由推荐改成-1反对
            if (attr == -1) {
                if (tuijian_number > 0){
                	tuijian_number--;
                } 
                sendData['subject_recommended'] = tuijian_number;
                fandui_number++;
				sendData['subject_anti'] = fandui_number;
                this_user_attitude = attr;
            }
            break;
        //当前用户已反对
        case -1:
            //由反对改成1推荐
            if (attr == 1) {
                if (fandui_number > 0){
                	fandui_number--;
                	sendData['subject_anti'] = fandui_number;
                } 
                tuijian_number++;
				sendData['subject_recommended'] = tuijian_number;
                this_user_attitude = attr;
            }
            break;
        //当前用户无态度
        case 0:
         	//1推荐
            if(attr == 1){
				tuijian_number++;
				sendData['subject_recommended'] = tuijian_number;
			}else{
				fandui_number++;
				sendData['subject_anti'] = fandui_number;
			}

            this_user_attitude = attr;
            break;
        default:
            break;
    }

	var callback = {
		success: function(data){
			/*tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >" + data.message + "</p>");
			tek.macCommon.waitDialogHide(1500);*/
            $("#attitude").val(attr);
            $("#subject_recommended_em").html(tuijian_number);
            $("#subject_anti_em").html(fandui_number);
		},
		error: function(data, errorMsg){

		},
		complete: function(){

		}
	};

	 tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//用户信息  
function readUser(userId, imgId) {
    var setting = {operateType: "读取用户信息"};
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
                    $(imgId).attr('src', record.icon);
                }else{
                   $(imgId).attr('src', '../../ican/person/images/penson.jpg');
                }
                
            } 
        },
        error: function (data, errorMsg) {
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
    
}
//获取用户扩展信息
function getProfileInfo(id){
    var setting = {operateType: '获取用户扩展信息'};
    var sendData = {
        objectName: 'Profile',
        action: 'getList',
        profile_owner: id
    };
    var callback = {
        success: function(data){
            var record = data['record'];
            record = !! record.length ? record[0]:record;
            if(record.profile_describe){
                var field = record.profile_describe;
                $("#profile_describe").html(tek.dataUtility.stringToHTML(field.show || ''));

            }
        },
        error: function(data, errorMsg){
            console.log(errorMsg)
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

//获取好友关注
function getFriendList(id, name){
    var setting = {async:false, operateType: '获取好友关注列表'};
    var mydata = {
        objectName: "Friend",
        action: 'getList',
        friend_owner: myId
    }
    var callback = {
        success: function(data){
            console.log(data)
            var record = data["record"];
            if (record) {
                //显示关注信息
               record = !record.length ? [record] : record;  
                for(var i in record){
                    if(record[i].friend_other){
                        var value = record[i].friend_other.value;
                        if(value == id){
                            $("#is_friend").html('<a href="javascript:;" class="btn btn-default"><i class="fa fa-checked"></i>已关注</a>');
                        }else{
                            $("#is_friend").html('<a href="javascript:;" onclick=payAttention("'+id+'","' + name + '") class="btn btn-primary"><i class="fa fa-plus"></i>加关注</a>');
                        }
                    }
                }
            }else{
                 $("#is_friend").html('<a href="javascript:;" onclick=payAttention("'+id+'","' + name + '") class="btn btn-primary"><i class="fa fa-plus"></i>&nbsp;加关注</a>');
            } 
        },
        error: function(data,msg){
            
        }
    }
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, mydata, callback);
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
//          $("#document_form_field").empty();

            var record = data["record"];
            if(record){
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
//提交关注
function submitSend(){
    $("#message-modal-dialog").modal('hide');
    
    var setting = {
        operateType: '提交关注'
    };
    var mydata = tek.common.getSerializeObjectParameters("friend_form") || {};  //转为json

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
            /*if(ISFRIEND){
                setFriendInfo(id,1); //互相关注，更改状态为有效1
            }*/
//          setTimeout(function(){
                location.reload();
//          },1500)
            
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
        }
    };
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