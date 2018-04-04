// JavaScript Document
function init(){
	/** 载入页面顶部信息 **/
	$("#tekinfo_banner").load(tek.common.getRootPath() + "http/ican/html/owner.html",function(){
		$.getScript(tek.common.getRootPath() + "http/ican/html/owner.js",function(){
			if(typeof initHeader == "function"){
				initHeader();
			}
		});
		$("#resume").addClass("active");
		
		$("#tekinfo_banner").css("position","relative");
		$("#tekinfo_banner").show();
	});

	getResumeList();	//获取简历信息
}

//获取简历信息
function getResumeList(){
	var setting = {operateType: '获取简历信息'};
	var sendData = {
		objectName: 'Resume',
		action: 'getList',
		resume_owner: myId,
		blob: 1
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center' id='waitImg' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#resume_list").append(html);
		},
		success: function (data) {
			var record = data["record"];
			if (record) {
				$("#waitImg").remove()
				record = !record.length ? [record] : record;
				for(var i in record){
					showResumeList(record[i]);
				}
			} else {
				$("#resume_list").html("尚未添加简历！&nbsp;<a href='add.html?show-close=1&refresh-opener=1' target='_blank' class='pull-right'><i class='fa fa-plus'></i>创建简历</a></a>");

			}
		},
		error: function (data, errorMsg) {
			$("#resume_list").html(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

//显示简历列表
function showResumeList(record){
	if(!record){
		return ;
	}
	
	var html = '';
	var field ;
	html += '<div class="ui-item clearfix">'
		+ '<div class="ui-rcontent clearfix">';
	if(record.createTime){
		field = record.createTime;
		html += '<div class="pull-right"><span>' + tek.dataUtility.stringToHTML(field.show || '') + '</span></div>';
	}
	if(record.name){
		html += '<h4><a href="javascript:;" onclick=readResumeInfo("' + record.id + '")>' + tek.dataUtility.stringToHTML(record.name) + '</a></h4>';
	}
	
	html += '</div></div><hr>';

	var target = document.getElementById("resume_list");
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	} 
}

//读取简历信息
function readResumeInfo(id){
	if(!id){
		return ;
	}
	var setting = {operateType: '读取简历信息'};
	var sendData = {
		objectName: 'Resume',
		action: 'readInfo',
		resume_id: id,
		blob: 1
	};
	var callback = {
		success: function(data){
			$("#resume_info").removeClass('hide');
			$("#resume_list").addClass('hide');
			var record = data["record"];
			if (record) {
				record = !record.length ? [record] : record;
				for(var i in record){
					showResumeInfo(record[i], data.right);
				}
			} else {
				$("#resume_info").html("信息不存在!");
			}
		},
		error: function (data, errorMsg) {
			$("#resume_info").html(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}
//显示简历信息
function showResumeInfo(record, right){
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
	if(tek.right.isCanDelete(parseInt(right))){
		html += '<button class="btn btn-link pull-right" onclick=removeResume("' + record.id + '")><i class="fa fa-trash-o"></i></button>'
	}
	if(tek.right.isCanWrite(parseInt(right))){
		html += '<a class="btn btn-link pull-right" target="_blank" href="add.html?resume_id=' + record.id + '&filepath=' + encodeURIComponent(path) + '&filename=' + encodeURIComponent(name) + '&show-close=1&refresh-opener=1"><i class="fa fa-edit"></i></a>'
	}
	html += '</div>';


	var resumeMime = !!record.resume_mime ? record.resume_mime.show : "";

	var resumeType;
	if (resumeMime) {
		resumeMime = tek.dataUtility.getMimeType(resumeMime);
		resumeType = resumeMime.split("/")[1];
	}
	
	/*if (!isSync || isSync != true) isSync = false;*/

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

			var target = document.getElementById('resume_content');
            //插入回复数据
    		target.insertAdjacentHTML('BeforeEnd', html); 
			
			
		}

	});
}
//返回简历列表
function backResumeList(){
	$("#resume_list").removeClass('hide');
	$("#resume_info").addClass('hide');
	$("#resume_content").html('');
}

// 删除简历
function removeResume(id){
	var remove=window.confirm("确定删除简历吗");
  	if (!remove){
  		return ;
  	}
    

	var setting = {operateType: '删除简历'};
	var sendData = {
		objectName: 'Resume',
		action: 'removeInfo',
		resume_id: id
	};
	var callback = {
		beforeSend: function () {
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 请稍候!</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
		
			
			setTimeout(function () {
				//刷新页面
				location.reload();
			}, 2000);
			
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null,errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}