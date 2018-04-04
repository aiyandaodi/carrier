// JavaScript Document
var profile_id;
var ICON;
function init(){

	// tek.common.getUser()
	// console.log(myName)
	
	uicontent_header();
	
	readUser(myId);	//读取用户信息
	$("#my_icon").attr("src",ICON)
	getProfileInfo(myId, "profile_info") //获取用户扩展信息

	getWorksInfo();	//获取人生经历信息
	
	getCertificatesInfo();	//获取资格证书
	owl_start();

	//getResumeInfo();	//获取简历信息
	getFriendList("friend_owner");	//获取关注好友列表
	getFriendList("friend_other");	//获取粉丝列表
	getGroupList();	//获取小组列表
}
//用户信息	
function readUser(id) {
	var setting = {async:false, operateType: "读取用户信息"};
	var sendData = {
		objectName: "User",
		action: "readInfo",
		user_id: id,
		icon: 1
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#user_info").html(html);
		},
		success: function (data) {
			var record = data["record"];
			ICON = '';
			if (record) {
				record = !!record.length ? record[0] : record;
				if(record.icon){
					ICON = record.icon;
				}else{
					ICON = 'images/penson.jpg';
				}
				
			} 
		},
		error: function (data, errorMsg) {
			
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
/* 显示用户信息 */
/*function showUserReadInfo(record){
	if (!record){
		return;
	}
	var html = '';
	var field;
	//头像
	if (record.icon) {
		$("#my_icon").attr("src", record.icon);
		ICON = record.icon
	}else{
		ICON = "";
       // $('#my_icon').attr('src','../../hdw.top/images/default/default-3.jpg');
    }
	//用户姓名
	if (record.user_name) {
		field = record.user_name.show || '';
		html += '<div class="hero-title"> <b class="lightblue">' + tek.dataUtility.stringToHTML(field) + '</b></div>';
	}
	if(record.user_remark){
		field = record.user_remark.show || '';
		html += '<p>' + tek.dataUtility.stringToHTML(field) + '</p>';
	}
	
	$("#user_info").html(html);
}*/
//编辑用户头像
function iconEdit() {
	var url = tek.common.getRootPath() + "http/tekinfo/user/icon-edit.html?user_id=" + myId;
	window.open(url);
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


					if (tek.right.isCanWrite(parseInt(data.right))) {
						$("#editInfo").removeClass('hide');
						$("#editInfo").attr('href','read.html?profile_id=' + record.id+'&show-close=1&refresh-opener=1');

						$("#editShort").removeClass('hide');

					}

				}else if(userType == "friend_owner"){
					showFriendList(record, "friend_owner");
				}else if(userType == "friend_other"){
					showFriendList(record, "friend_other");
				}
				
			} else{
				// $(".user-Name").html(myName);

				if(userType == "profile_info"){
					var html = '<h4 class="user-Name"><i class="fa fa-user"></i> &nbsp;' +myName + '</h4>'
					html += '尚未添加个人信息！&nbsp;'
					html += '<h4 class="text-right"><a href="add.html?show-close=1&refresh-opener=1" target="_blank" class="btn btn-primary">立即添加</a></h4>'
					$("#profile_info").html(html);
				}else{
					$("#"+userType).html("没有更多信息！");
				}
				
			}
		},
		error: function (data, errorMsg) {
			$("#profile_info").html(errorMsg);
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
	if(record.name){
		html += '<h4 class="user-Name"><i class="fa fa-user"></i> &nbsp;<a target="_blank" href="read.html?profile_id=' + record.id + '">' + record.name + '</a></h4>'
	}
	if(record.profile_resident){
		field = record.profile_resident;
		html += '<h4><i class="fa fa-map-marker"></i> &nbsp;' + tek.dataUtility.stringToHTML(field.show || '') + '</h4>';
	}
	if(record.profile_degree){
		field = record.profile_degree;
		html += '<h4><i class="fa fa-graduation-cap"></i> &nbsp;' + tek.dataUtility.stringToHTML(field.show || '') + '</h4>';
	}
	if(record.profile_mode){
		field = record.profile_mode;
		html += '<h4><i class="fa fa-building"></i> &nbsp;' + tek.dataUtility.stringToHTML(field.show || '') + '</h4>';
	}
	if(record.profile_owner.value == myId){
		html += '<h4 class="text-right"><a href="edit.html?profile_id=' + record.id + '&show-close=1&refresh-opener=1" target="_blank" class="btn btn-xs btn-primary">编辑资料</a></h4>';
	}
	html += '<div class="clearfix"></div>';
	$("#profile_info").html(html);

	if(record.profile_motto){
		field = record.profile_motto;
		$("#short-value").html(field.value);
	}
}

/* 自我评价部分 动画展示 */
function uicontent_header(){
	$(".ui-content h4").each(function(){
		var max = $(this).attr("data-valuemax");
		$(this).prop('Counter', 0 ).animate({ width: max + "%", Counter: max }, {			//Min value 0 and Max value attribute value	
			duration: 2000,
			easing: 'swing',
			step: function () {
			  $(this).children("span").text(Math.ceil(this.Counter) + "%");		//Count Number
			}
		});
	});
}
/* 每日格言 */
function editShort(){
	$('#everyShort').modal();
}
/* 保存每日格言 */
function saveShort(){
	$('#everyShort').modal('hide');
	
	var setting = {};//operateType: "提交编辑信息"};
	var params = {};
	params["objectName"] = "Profile";
	params["action"] = "setInfo";
	params["profile_id"] = profile_id;
	var profileMotto = $("#short-value").val();
	params["profile_motto"] = decodeURIComponent(profileMotto);
	
	var callback = {
		beforeSend: function(){
			//显示等待图层
			var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在提交...";
			tek.macCommon.waitDialogShow(null, html, null, 2);
		},
		success: function(data){
			if(data.code == 0){
				var html = data.message;
				tek.macCommon.waitDialogShow(null, html, null, 1);
				tek.macCommon.waitDialogHide(1500);
			}
			// setTimeout(location.reload(),1500);
		},
		error: function(data, errorMsg){
			tek.macCommon.waitDialogShow(null, errorMsg, null, 1);
		},
		complete: function(){
			
		}
	}
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
	
}

//获取人生经历信息
function getWorksInfo(){
	var setting = {operateType: "获取人生经历信息"};
	var sendData = {
		objectName: "Works",
		action: "getList",
		works_owner: myId,
		count: 5
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#works-content").html(html);
		},
		success: function (data) {
			var record = data["record"];
			if (record) {
				$(".works-more").removeClass('hide');
				$("#works-content").html('');
				record = !record.length ? [record] : record;
				for(var i in record){
					showWorksInfo(record[i]);
				}
			} else {
				$("#works-content").html("<div style='margin-top:10px;margin-left:30px;'>未添加人生经历！&nbsp;&nbsp;<a class='addA' href='javascript:;' onclick='addWorks()'><i class='fa fa-plus'></i>创建人生经历</a></div>");
				$(".more-works").css('display','none');
			}
		},
		error: function (data, errorMsg) {
			$("#works-content").html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
//显示人生经历信息
function showWorksInfo(record){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	html += '<div class="ui-item clearfix">';
	if(record.works_color){
		field = record.works_color;
		html += '<a class="pull-left" href="#"><i class="fa fa-heart-o bg-success" style="background: #' + field.value + '"></i></a>';
	}
	html += '<p>';
	if(record.works_start){
		field = record.works_start;
		html += '<span>' + tek.dataUtility.stringToHTML(field.show || '') + '</span><br/>';
	}
	if(record.name){
		html += tek.dataUtility.stringToHTML(record.name);
	}
	html += '</p>'
		+ '<div class="clearfix"></div>'
		+ '</div>';

	var target = document.getElementById("works-content");
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	} 
}
// 新建证书
function addWorks(){
	var url = tek.common.getRootPath() + "http/ican/works/add.html?user_id="+myId;
	url += "&show-close=1&refresh-opener=1";
	window.open(url);
}
//获取资格证书
function getCertificatesInfo(){
	var setting = {async:false, operateType: "获取资格证书信息"};
	var sendData = {
		objectName: "Certificates",
		action: "getList",
		certificates_user: myId,
		blob: 1
	};
	var callback = {
		/*beforeSend: function () {
			var html = "<div class='center'><img id="imgSrc" src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#certificates-content").html(html);
		},*/
		success: function (data) {
			var record = data["record"];
			if (record) {
				$(".cer-more").removeClass('hide');
				record = !record.length ? [record] : record;
				for(var i in record){
					showCertificatesInfo(record[i], data.right);
				}
			} else {
				$(".nodata").html("<div class='center'>尚未获得资格证书!&nbsp;&nbsp;<a class='addA' href='javascript:;' onclick='addCertificate()'><i class='fa fa-plus'></i>添加证书</a></div>");
				$(".owl-nav").addClass('hide');
			}
		},
		error: function (data, errorMsg) {
			$("#certificates-content").html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
//显示资格证书信息
function showCertificatesInfo(record, right){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	html += '<div class="item">'
	if(record.blob){
		var path = record.blob.path;
		var name = record.blob.filename;
		html += '<a href="'+tek.common.getRootPath()+'http/imark/certificates/read.html?certificates_id=' + record.id + '" target="_blank"><img class="img-responsive img-thumbnail" src="' + tek.common.getRootPath() + 'http/tekinfo/system/download.jsp?file-path=' +encodeURIComponent(path)+ '&file-name=' + encodeURIComponent(name) + '" /></a>'
	}
	html += '<div class="certificates-text">'
	if(record.certificates_name){
		field = record.certificates_name;
		html += '<h4><a href="'+tek.common.getRootPath()+'http/imark/certificates/read.html?certificates_id='
			+record.id+'" target="_blank">' + tek.dataUtility.stringToHTML(field.show || '') + '</a></h4>'
	}
	if(record.certificates_start){
		field = record.certificates_start;
		html += '<small><i class="fa fa-calendar"></i>&nbsp;' + tek.dataUtility.stringToHTML(field.show || '');
	}
	if(record.certificates_end){
		field = record.certificates_end;
		html += '至' + tek.dataUtility.stringToHTML(field.show || '') + '&nbsp;';
	}
	html += '</small>';
	if(record.certificates_qualification){
		field = record.certificates_qualification;
		html += '<p>'+ field.display + ': ' + tek.dataUtility.stringToHTML(field.show || '') + '</p>';
	}
	if(tek.right.isCanRead(parseInt(right))){
		html += '<a href="'+tek.common.getRootPath()+'http/imark/certificates/read.html?certificates_id=' + record.id + '" target="_blank" class="btn btn-info btn-xs">查看</a>'
	}
	html += '</div>'
	html +='</div>'
	
	var target = document.getElementById('certificates-content');
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	} 

}

// 新建证书
function addCertificate(){
	var url = tek.common.getRootPath() + "http/imark/certificates/add.html?user_id="+myId;
	url += "&show-close=1&refresh-opener=1";
	window.open(url);
}
/* 证书轮播图 */
function owl_start(){
	$(".owl-carousel").owlCarousel({
		slideSpeed : 500,
		rewindSpeed : 1000,
		mouseDrag : true,
		stopOnHover : true
	});
	$(".owl-nav-prev").click(function(){
		$(".owl-carousel").trigger('owl.prev');
	});
	$(".owl-nav-next").click(function(){
		$(".owl-carousel").trigger('owl.next');
	});
}

// 获取简历信息
function getResumeInfo(){
	var setting = {operateType: '获取简历信息'};
	var sendData = {
		objectName: 'Resume',
		action: 'getList',
		resume_owner: myId,
		count: 1,
		blob: 1
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center' id='waitImg' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#resume_Info").append(html);
		},
		success: function (data) {
			var record = data["record"];
			if (record) {
				$("#waitImg").remove()
				record = !record.length ? [record] : record;
				for(var i in record){
					showResumeInfo(record[i]);
				}
			} else {
				$("#resume_Info").html("尚未添加简历！&nbsp;&nbsp;<a class='addA' href='javascript:;' onclick='addResume()'><i class='fa fa-plus'></i>创建人生经历</a>");
			}
		},
		error: function (data, errorMsg) {
			$("#resume_Info").html(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}
//显示简历信息
function showResumeInfo(record){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	if(record.blob){
		var path = record.blob.path;
		var name = record.blob.filename;
	}
	html += '<div class="page-header">'
	if(record.name){
		html += '<h1 style="display: inline-block">' + record.name + '</small></h1>'
	}
	
	html += '</div>';


	var resumeMime = !!record.resume_mime ? record.resume_mime.show : "";

	var resumeType;
	if (resumeMime) {
		resumeMime = tek.dataUtility.getMimeType(resumeMime);
		resumeType = resumeMime.split("/")[1];
	}
	

	$.ajaxSetup({
		async: false //false-取消异步
	});

	var openurl = tek.common.getRootPath() + "http/tekinfo/system/download.jsp?file-path=" +encodeURIComponent(path) + '&file-name=' + encodeURIComponent(name);
	
	$.get(openurl, function (data) {
		if (data != null) {
			
			//处理要显示的html或非html文件
			if (resumeType && resumeType == "html") {
				if ((data.toLowerCase().indexOf("<html") >= 0) || (data.toLowerCase().indexOf("</html>") >= 0))
					data = data.substring(data.indexOf("<html>") + 6, data.lastIndexOf("<"));

				if ((data.toLowerCase().indexOf("<title") >= 0) && (data.toLowerCase().indexOf("</title>") >= 0))
					data = data.replace(/(<title).*?(<\/title>)/gi, "");

				if ((data.toLowerCase().indexOf("<meta") >= 0))
					data = data.replace(/(<meta ).*?(\/>)/gi, "");

			} else {
				//将文本换成html
				//data = tek.dataUtility.stringToHTML(data);
				data = data.replace(/ (?! )/gi, " ").replace(/  /gi, "  ");
			}
			
			html += '<p>' + data + '</p>';

			var target = document.getElementById('resume_Info');
            //插入回复数据
    		target.insertAdjacentHTML('BeforeEnd', html); 
			
			
		}

	});
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
		count: 5,
		skip: 0,
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
				$(".friend-more").removeClass('hide');
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
				
                    
            } else {
                $(".content").html("<div class='col-md-12 col-sm-12 center'>没有更多信息！</div>");
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

			html += '<div class="col-md-2 col-sm-2 col-xs-4 col-pad">';
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

//获取小组列表
function getGroupList(){
//    var target = document.getElementById('group_list');
//    if(!target)
//        return;

    var setting = {operateType: "获取小组列表"};
    var sendData = {
        objectName: "Group",
        action: "getList",
        count: 5,
        order:"createTime",
        desc: 1,
        join: 1,
        user_id: myId
    };

    var callback = {
        beforeSend: function () {
            $("#group_list").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            // if (tek.right.isCanWrite(parseInt(data.right)))
            /*$("#group_modify_btn").removeClass("hidden");*/

            var record = data["record"];
            if (record) {
				$(".group-more").removeClass('hide');
                $("#group_list").html("");
                //显示小组列表
                record = !record.length ? [record] : record;
                for(var i in record)
                    showGroupList(record[i], data.right);
            } else {
                $("#group_list").html("<div class='col-md-12 col-sm-12 center'>没有小组信息！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#group_list").html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示小组列表
function showGroupList(record,right){
    if (record) {
        var html = "";
        var field;

        html += "<div class='ui-info clearfix'>";
        // html += "<a class='group-icon' href='read.html?group_id=" + record.id + "&show-close=1&refresh-opener=1' target='_blank'><img src='";
        // html += record.icon || '../../images/happy.png';
        // html += "' alt='' class='img-responsive' /></a>";

        html += "<div class='ui-details'>";
        html += "<div class='container-fluid'>";
        html += "<div class='row'>";
        /*小组名称*/
        if(record["group_name"]){
            field = record["group_name"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+field.display+"</h4>";
            html += "<h5><a href='"+tek.common.getRootPath()+"http/takall/group/read.html?group_id=" + record.id + "&show-close=1&refresh-opener=1' target='_blank'>"+tek.dataUtility.stringToHTML(field.show || '')+"</a></h5>";
            html += "</div>";
            html += "</div>";
        }
        /*成员数*/
        html += "<div class='col-md-4 col-sm-4 col-xs-4  col-pad'>";
        html += "<div class='ui-item'>";
        html += "<h4>成员数</h4>";
        html += "<h5>5</h5>";
        html += "</div>";
        html += "</div>";
        /*发言属性*/
        if(record["group_speak"]) {
            field = record["group_speak"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+ field.display +"</h4>";
            html += "<h5>"+ tek.dataUtility.stringToHTML(field.show || '') +"</h5>";
            html += "</div>";
            html += "</div>";
        }
        /*阅读属性*/
        if(record["group_listen"]) {
            field = record["group_listen"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+ field.display +"</h4>";
            html += "<h5>"+ tek.dataUtility.stringToHTML(field.show || '') +"</h5>";
            html += "</div>";
            html += "</div>";
        }
        /*加入小组属性*/
        if(record["group_join"]) {
            field = record["group_join"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+ field.display +"</h4>";
            html += "<h5>"+ tek.dataUtility.stringToHTML(field.show || '') +"</h5>";
            html += "</div>";
            html += "</div>";
        }
        /*更新时间*/
        if(record["modifyTime"]){
            field = record["modifyTime"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+ field.display +"</h4>";
            html += "<h5>"+ tek.dataUtility.stringToHTML(field.show || '') +"</h5>";
            html += "</div>";
            html += "</div>";
        }


        html += "</div>";
        html += "</div>";
        html += "</div>";
        html += "<div class='ui-social'>";
        if (tek.right.isCanWrite(parseInt(right))){
            html += "<a href='"+tek.common.getRootPath()+"http/takall/group/edit.html?group_id=";
            html += record.id;
            html += "&show-close=1&refresh-opener=1' target='_blank' class='ui-tooltip' data-toggle='tooltip' data-placement='top' title='编辑'><i class='fa fa-pencil bg-lblue'></i></a>";
        }
        /*if(tek.right.isCanRead(parseInt(right))){
             html += "<a href='javascript:;' onclick='readInfo(\"";
            html += record.id;
            html += "\")' class='ui-tooltip' data-toggle='tooltip' data-placement='top' title='查看'><i class='fa fa-file bg-lblue'></i></a>";
        }*/
        if(tek.right.isCanDelete(parseInt(right))){
            html += "<a href='javascript:;' onclick='removeInfo(\"";
            html += record.id;
            html += "\")' class='ui-tooltip' data-toggle='tooltip' data-placement='top' title='删除'>";
            html += "<i class='fa fa-trash-o bg-lblue'></i></a>";
        }
        
        html += "</div>";
        html += "</div>";

        var target = document.getElementById("group_list");
        if (target)
            target.insertAdjacentHTML('BeforeEnd', html);
    }
}

/*删除小组*/
function removeInfo(group_id){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var remove = window.confirm("确定删除小组?");
    if (!remove)
        return;

    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var setting = {operateType: "删除小组"};
    var sendData = {
        objectName: "Group",
        action: "removeInfo",
        group_id: group_id
    }

    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "小组删除成功!");
            getGroupList();
        },
        error: function (data, message) {
            tek.macCommon.waitDialogShow(null, message);
        },
        complete: function () {
            tek.macCommon.waitDialogHide(1500);
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//=======================================function===================================
/* 获取跳转路径 */
function callpage(path){
	if(path){
		var html = tek.common.getRootPath() + path + "?user_id=" + myId;
		location.href = html;
	}
}