// JavaScript Document
var qualification_id;
var qualification_name;
function init(){
//	addWidgetOperation();
	
	qualification_id = request["qualification_id"];
	if(qualification_id) {
		getQualificationInfo();
	}

	//获取公告信息
	getSubjectList(4,"subject_notice");
}
function getQualificationInfo(){
	var setting = {operateType: "获取证书信息"};
	var sendData = {
		objectName: 'Qualification',
		action: 'readInfo',
		qualification_id: qualification_id
	};
	var callback = {
		beforeSend: function(){
			$("#qualification_info").html("<div class='col-md-12 col-sm-12'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function(data){
			var record=data["record"];
			$("#qualification_info").html("");
            if (record) {
                //显示资质信息
                showQualificationInfo(record,data.right);
            }
			
			/*if(tek.right.isCanWrite(parseInt(data.right))){
                $("#group-edit-btn").removeClass("hidden");
            }
            if(tek.right.isCanDelete(parseInt(data.right))){
                $("#group-remove-btn").removeClass("hidden");
            }*/
		},
		error: function (data, message) {
            $("#qualification_info").html("<font color='red'>"+message+"</font>");
        }
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示证书信息
function showQualificationInfo(record,right){
	if(!record){
		return ;
	}
	var html = '';
	var field;
	if(record.name){
		qualification_name = record.name;
		html += '<div class="pull-left ui-head bg-red bold">' + record.name + '</div>';
	}
	html += '<div class="widget ui-body br-red">'
		+ '<div class="w-head">';
	if(record.qualification_status){
		field = record.qualification_status;
		html += '<div class="pull-right">'+ (field.show || '') + '</div>';
	}
	html += '<div class="clearfix"></div>'
		+ '</div>'
		+ '<div class="w-body comments-widget">'
		+ '<div class="comment">'
//		+ '<div class="col-md-2 col-sm-2 comment-img">'
//		+ '<a href="#"><img src="../../style/extend/img/ui-315/1.jpg" alt="" class="img-responsive" /></a>'
//		+ '</div>'
		+ '<div class="col-md-10 col-sm-10">';
	if(record.qualification_remark){
		field = record.qualification_remark;
		html += '<div>' + (field.show || '') + '</div>'
	}
	if(record.qualification_authorizer){
		field = record.qualification_authorizer;
		html += '<div>认证单位：<a href="javascript:;">' + (field.show || '') + '</a></div>';
	}
	if(record.qualification_type){
		field = record.qualification_type;
		html += '<div>'+field.display + '：'+ (field.show || '') + '</div>';
	}
	if(record.qualification_grade){
		field = record.qualification_grade;
		html += '<div>'+field.display + '：'+ (field.show || '') + '</div>';
	}
	html += '</div>'
		+ '<div class="clearfix"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>'
		+ '</div>'
		+ '<div class="w-foot">'
		/*+ '<div class="pull-left">500人 已获得认证</div>'*/
		+ '<div class="pull-right">'
		
	if(tek.right.isCanAdmin(parseInt(right))){
		html +=  '<div class="pull-left dropdown"><a href="#" class=" btn btn-primary btn-xs dropdown-toggle " data-toggle="dropdown">审核<i class="fa fa-sort-down"></i></a> &nbsp; '
			+ '<ul class="dropdown-menu " role="menu">'
			+ '<li><a href="javascript:;" onclick=changeStatus("'+record.id+'",-1)>停止</a></li>'
			+ '<li><a href="javascript:;" onclick=changeStatus("'+record.id+'",1)>正常</a></li>'
			+ '<li><a href="javascript:;" onclick=changeStatus("'+record.id+'",0)>申请</a></li>'
			+ '</ul></div>'
	}
	if(tek.right.isCanWrite(parseInt(right))){
		html += '<a class="btn btn-warning btn-xs" href="edit.html?qualification_id='+ record.id +'&show-close=1&refresh-opener=1" target="_blank">编辑</a>&nbsp;&nbsp;&nbsp;';
	}
	if(tek.right.isCanDelete(parseInt(right))){
		html += '<a class="btn btn-danger btn-xs" href="javascript:;">删除</a>&nbsp;&nbsp;&nbsp;';
	}
	html += '</div>'
		+ '<div class="clearfix"></div>'
		+ '</div>'
		+ '</div>';


	var target = document.getElementById("qualification_info");
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

//审核
function changeStatus(id, status){
	var setting = {operateType: '审核资质'};
	var sendData = {
		objectName: 'Qualification',
		action: 'setInfo',
		command: 'audit',
		qualification_id: id,
		qualification_status: status
	};
	var callback = {
		beforeSend: function(){
			//显示等待提示信息
			var html = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在修改状态...</p>";
			tek.macCommon.waitDialogShow("修改状态", html);
		},
		success: function(data){
			tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >"+data.message+"！</p>");
			tek.macCommon.waitDialogHide(1500);
			/*setTimeout(function(){
				location.reload();
			},3000);*/
		},
		error: function(data, errorMsg){
			tek.macCommon.waitDialogShow(null, "<p class='text-center' style='color:red' >"+data.message+"！</p>");
		},
		complete: function () {
			
			
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}
//上传证书
function addCertificate(){
	var url = tek.common.getRootPath() + "http/imark/certificates/add.html?certificates_qualification="+ qualification_id;
	url += "&user_id="+myId;
	window.open(url);
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

/* 加入widget的按钮操作 */
function addWidgetOperation(){
	/* Close */
	$(".widget a.w-close").click(function(e){
		e.preventDefault();

		/* Widget variable */
		var widget = $(this).parent().parent().parent().parent(".widget");
		widget.hide(100);
					
	});	

	/* Minimize & Maximize */
	$(".widget a.w-mimax").click(function(e){
		
		e.preventDefault();

		/* Widget variable */
		var widget = $(this).parent().parent().parent().parent(".widget");
		var wBody = widget.children(".w-body");

		wBody.toggle(200);
					
	});
	$(function(){
		$(".w-scroll").niceScroll({
			cursorcolor : "rgba(0,0,0,0.2)",
			cursorwidth : "5px"
		});
	});
}