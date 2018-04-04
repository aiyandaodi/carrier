// JavaScript Document
var skip = 0;
var count = 3;
var currentPage;
var totalPage;
var isContinueLoad = true;		//是否可以
function init(){
	if(tek.common.isLoggedIn()){
		getQualificationList(skip);	//获取证书信息
	}

	//获取公告信息
	getSubjectList(4,"subject_notice");
}
//获取证书信息
function getQualificationList(skip){
	var target = document.getElementById('qualification_list');
	if(!target){
		return ;
	}
	
	var ajaxURL = tek.common.getRootPath() + "servlet/tobject";
	var setting = {operateType: "获取资质信息"};
	var params = {};
	params["objectName"] = "Qualification";
	params["action"] = "getList";
	params["skip"] = skip;
	params["order"] = "createTime";
	params["desc"] = 1;
	params["count"] = count;
	
	var callback = {
		beforeSend: function(){
			$("#qualification_list").append("<div id='waiting-img' class='col-md-12 text-center col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />正在加载数据...</div>");
		},
		success: function(data){
			if(data.code == 0){
				var record = data["record"];
				if(record){
					$("#waiting-img").remove();
					record = !record.length ? [record] : record;
					for(var i in record){
						//显示资质信息
						showQualificationInfo(record[i],data.right);
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
					$("#qualification_list").html("<div class='col-md-12 col-sm-12 center'>没有资质信息！</div>");
				}
			}
		},
		error: function(data, errorMsg){
			$("#qualification_list").html(errorMsg);
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
}


//显示资质信息
function showQualificationInfo(record,right){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	html += '<div class="ui-outer">'
		+ '<div class="container-fluid">'
		+ '<div class="row">'
		/*+ '<div class="col-md-3 col-sm-3 col-xs-3 col-pad">'
		+ '<div class="ui-logo">'
		+ '<a href="../../ican/organization/read.html"><img src="../../style/extend/img/ui-206/1.png" alt="" class="img-responsive" /></a>'
		+ '</div>'
		+ '</div>'*/
		+ '<div class="col-md-10 col-sm-10 col-xs-10 col-pad">'
		+ '<div class="ui-content">';
	
	if(record.qualification_name){
		field = record.qualification_name;
		html += '<h4><a href="read.html?qualification_id=' + record.id + '&refresh-opener=1" target="_blank">' + (field.show || '') + '</a></h4>'
	}
	html += '<p>本资格由北京易商迅达科技有限公司认证.被大多数互联网公司采用</p>';
	if(record.qualification_grade){
		field = record.qualification_grade;
		html += field.display + ': &nbsp;<span><b>' + (field.show || '') +'</b></span>'
	}
	if(record.qualification_status){
		field = record.qualification_status;
		html += '<span>' + field.display + ': &nbsp;' + (field.show || '') +'</span>'
	}
	
	html +=  '</div>'
		+ '</div>'
		+ '<div class="col-md-2 col-sm-2 col-xs-2 col-pad">'
		+ '<div class="ui-btn">'
		+ '<a href="read.html?qualification_id=' + record.id + '&show-close=1&refresh-opener=1" class="btn btn-info ui-green" target="_blank">读取</a>'
		+ '<br class="br" />'
		+ '<a href="read.html" class="btn btn-darkgreen ui-green" target="_blank">申报</a>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
	

	
	var target = document.getElementById("qualification_list");
	if(target){
		target.insertAdjacentHTML("BeforeEnd",html);
	}
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
  	getQualificationList(skip);
  	
}// JavaScript Document