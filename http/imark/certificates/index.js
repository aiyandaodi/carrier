// JavaScript Document
var skip = 0;
var count = 10;
var currentPage;
var totalPage;
var isContinueLoad = true;		//是否可以
var is_favorite = false;	//是否已收藏
var favorite_id = '';			//收藏的id;
var user_id;
function init(){
	user_id = request["user_id"] || myId;
	if(tek.common.isLoggedIn() && user_id){
		getCertificatesList(skip);	//获取证书信息
	}

	getSubjectList(4, "subject_notice");	//获取公告信息
}
//获取证书信息
function getCertificatesList(skip){
	var target = document.getElementById('certificates_list');
	if(!target){
		return ;
	}
	
	var ajaxURL = tek.common.getRootPath() + "servlet/tobject";
	var setting = {operateType: "获取证书信息"};
	var params = {};
	params["objectName"] = "Certificates";
	params["action"] = "getList";
	params["skip"] = skip;
	params["certificates_user"] = user_id;
	params["order"] = "createTime";
	params["desc"] = 1;
	params["blob"] = 1;
	params["count"] = count;
	
	var callback = {
		beforeSend: function(){
			$("#certificates_list").append("<div id='waiting-img' class='col-md-12 text-center col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />正在加载数据...</div>");
		},
		success: function(data){
			if(data.code == 0){
				var record = data["record"];
				if(record){
					$("#waiting-img").remove();
					record = !record.length ? [record] : record;
					for(var i in record){
						//显示证书信息
						showCertificateInfo(record[i],data.right);
					}
					
					var total=parseInt(data.value);
					if(!total)
						total=0;
					currentPage = tek.turnPage.getCurrentPageNumber(skip,count);
					totalPage = tek.turnPage.getTotalPageNumber(total,count);
					if(currentPage<totalPage){
						isContinueLoad = true;
					}else{
						isContinueLoad = false;
					}
					
				}else{
					$("#certificates_list").html("<div class='col-md-12 col-sm-12 center'>没有证书信息！</div>");
				}
			}
		},
		error: function(data, errorMsg){
			$("#certificates_list").html(errorMsg);
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
}


//显示证书信息
function showCertificateInfo(record,right){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	
	html += '<div class="col-sm-6 col-xs-12">'
		+ '<div class="ui-246">'
		+ '<div class="ui-heading">'

	if(record.blob){
		var path = record.blob.path;
		var name = record.blob.filename;
		html += '<a href="read.html?certificates_id=' + record.id + '" target="_blank"><img class="img-responsive img-thumbnail" src="' + tek.common.getRootPath() + 'http/tekinfo/system/download.jsp?file-path=' +encodeURIComponent(path)+ '&file-name=' + encodeURIComponent(name) + '" /></a>'
	}
		/*+ '<div class="ui-image">'
		+ '<a href="#">'
		+ '<img class="img-responsive" src="images/1.jpg" alt="#"/>'
		+ '</a>';
	html += '<h4>';
	if(record.certificates_getter){
		field = record.certificates_getter.show || '';
		html += '<a href="read.html?certificates_id=' + record.id + '" target="_blank">' + record.name + '<span>' + tek.dataUtility.stringToHTML(field) + '</span></a>' ;
	}
	html += '</h4>'
		+ '</div>';
	if(record.certificates_status){
		field = record.certificates_status.show || '';
		html += '<div class="ui-date">' + tek.dataUtility.stringToHTML(field) + '</div>';
			
	}*/
	html += '</div>'
		+ '<div class="clearfix"></div>';
	
	html += '<div class="ui-content">'
		+ '<ul>';
	if(record.certificates_name){
		field = record.certificates_name;
		html += '<li><a href="read.html?certificates_id=' + record.id + '" target="_blank">' + tek.dataUtility.stringToHTML(field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</a></li>'
	}
	if(record.certificates_code){
		field = record.certificates_code;
		html += '<li>' + tek.dataUtility.stringToHTML(field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</li>'
	}
	if(record.certificates_start){
		field = record.certificates_start;
		html += '<li>' + tek.dataUtility.stringToHTML(field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</li>'
	}
	if(record.certificates_end){
		field = record.certificates_end;
		html += '<li>' + tek.dataUtility.stringToHTML(field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</li>'
	}
	if(record.certificates_status){
		field = record.certificates_status;
		html += '<li>' + tek.dataUtility.stringToHTML(field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</li>'
			
	}
	html += '</ul>';
	html += '<br/>';
	if(record.certificates_qualification){
		field = record.certificates_qualification;
		html += '<p>' + tek.dataUtility.stringToHTML(field.display || '') + '：<a href="../qualification/read.html?qualification_id=' + field.value + '" target="_blank"> '+ tek.dataUtility.stringToHTML(field.show || '') + '</a>'
	}
	html += '<a href="javascript:void(0)" id="star-' + record.id + '" onClick=javascript:addFavoriteBtn("'+ record.id +'","'+ record.name +'") class="pull-right"><i class="fa fa-star icon-color"></i></a>'
		+ '<a href="#" class="pull-right"><i class="fa fa-share-alt icon-color"></i></a><p>';
	html += '</div>';
	html += '</div>'
		+ '</div>';
		
	var target = document.getElementById("certificates_list");
	if(target){
		target.insertAdjacentHTML("BeforeEnd",html);
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

function changePage(id, skip){
 	// mydata["skip"]=skip;
  	getCertificatesList(skip);
  	
}
// 新建证书
function addCertificate(){
	var url = "add.html?user_id="+user_id;
	url += "&show-close=1&refresh-opener=1";
	window.open(url);
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
	html += '<div class="pull-right">';
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
		favorite_linkName: 'Certificates',
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