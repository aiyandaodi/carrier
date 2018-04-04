// JavaScript Document
var certificates_id;
function init(){
//	addWidgetOperation();
	
	certificates_id = request["certificates_id"];
	if(certificates_id) {
		getCertificatesInfo();
	}
	getSubjectList(4, "subject_notice");	//获取公告信息
}
function getCertificatesInfo(){
	var setting = {operateType: "获取证书信息"};
	var sendData = {
		objectName: 'Certificates',
		action: 'readInfo',
		certificates_id: certificates_id,
		blob: 1
	};
	var callback = {
		beforeSend: function(){
			$("#certificate_info").html("<div class='col-md-12 col-sm-12'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function(data){
			var record=data["record"];
			$("#certificate_info").html("");
            if (record) {
                //显示证书信息
                showCertificateInfo(record,data.right);
            }
			
			/*if(tek.right.isCanWrite(parseInt(data.right))){
                $("#group-edit-btn").removeClass("hidden");
            }
            if(tek.right.isCanDelete(parseInt(data.right))){
                $("#group-remove-btn").removeClass("hidden");
            }*/
		},
		error: function (data, message) {
            $("#certificate_info").html("<font color='red'>"+message+"</font>");
        }
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示证书信息
function showCertificateInfo(record,right){
	if(!record){
		return ;
	}
	
	var html = '';
	var field;
	if(record.name){
		html += '<div class="pull-left ui-head bg-lblue bold">' + record.name + '</div>';
	}
	html += '<div class="widget ui-body">'
		+ '<div class="w-head">';
	
	if(record.certificates_getter){
		field = record.certificates_getter;
		html += '<h3 class="pull-left">'
			+ '<a href="#">' + (field.show || '') + '</a>'
			+ '</h3>';
	}
	if(record.certificates_status){
		field = record.certificates_status;
		html += '<div class="pull-right">'+ (field.show || '') + '</div>';
	}
	html += '<div class="clearfix"></div>'
		+ '</div>'
		+ '<div class="w-body comments-widget">'
		+ '<div class="comment">';
	if(record.blob){
		var path = record.blob.path;
		var name = record.blob.filename;
		html += '<div class="col-md-2 col-sm-2 comment-img">'
			+ '<a href="#"><img src="' + tek.common.getRootPath() + 'http/tekinfo/system/download.jsp?file-path=' +encodeURIComponent(path)+ '&file-name=' + encodeURIComponent(name) + '" alt="" class="img-responsive" /></a>'
			+ '</div>';
	}
		
		
	html += '<div class="col-md-10 col-sm-10">';
	if(record.certificates_code){
		field = record.certificates_code;
		html += '<div>证书编号：' + (field.show || '') + '</div>'
	}
	if(record.certificates_end){
		field = record.certificates_end;
		html += '<div>有效期至：' + (field.show || '') + '</div>'
	}
	if(record.certificates_qualification){
		field = record.certificates_qualification;
		html += '<div>所属资质：<a href="../qualification/read.html">' + (field.show || '') + '</a></div>'
	}
	html += '</div>'
		+ '<div class="clearfix"></div>'
		+ '</div>'
		+ '<div class="clearfix"></div>'
		+ '</div>'
		+ '<div class="w-foot">';
	if(record.certificates_type){
		field = record.certificates_type;
		html += '<div class="pull-left">' + (field.show || '') + '</div>'
	}
	html += '<div class="pull-right dropdown">'
		+ '<a href="#" class="dropdown-toggle " data-toggle="dropdown"><i class="fa fa-gear"></i></a> &nbsp; '
		+ '<ul class="dropdown-menu bg-lblue " role="menu">';
	if(tek.right.isCanAdmin(parseInt(right))){
		html += '<li><a href="#">审核</a></li>';
	}
	if(tek.right.isCanWrite(parseInt(right))){
		html += '<li><a href="edit.html?certificates_id='+ record.id +'&show-close=1&refresh-opener=1" target="_blank">编辑</a></li>';
	}
	if(tek.right.isCanDelete(parseInt(right))){
		html += '<li><a href="#">删除</a></li>';
	}
	html += '</ul>'
		+ '</div>'
		+ '<div class="clearfix"></div>'
		+ '</div>'
		+ '</div>';
	
	var target = document.getElementById("certificate_info");
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