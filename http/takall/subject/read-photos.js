// JavaScript Document

var SUBJECT_RIGHT = 0; //主题权限
var SUBJECT_QA_GROUP;  //主题所属小组

var SUBJECT_QA_OWNER; //问答拥有者
var isShowSameSubject = false; //是否已经读取相关主题
var isShowRecommendSubject = false; // 是否已经读取推荐主题
var subjectId;
var request = tek.common.getRequest();
var TOTAL; //文档总数
var SKIP = 0; //数据条数
var COUNT = 5; //每页显示条数
var IMGSRC = '';
var carouselNum = 0;  //图片轮播计数
var isBoolean = true;
/*初始化*/
function init(){
	subjectId = request["subject_id"];
	if(subjectId && subjectId.length > 0){
		readSubject();
	}else{
		showError("主题未找到!");
	}
	
	//获取文档新建域
	//getEditDocument();
	/*获取本地登录用户信息*/
	/*tek.common.getUser();
	readUser(myId,"reply_icon");
	$("#reply_author").html(myName);*/

	/* Minimize & Maximize */
	$(".widget a.w-mimax").click(function(e){
		
		e.preventDefault();

		/* Widget variable */
		/*var widget = $(this).parent().parent().parent().parent(".widget");
		var wBody = widget.children(".w-body");
		console.log(wBody);
		wBody.toggle(200);*/
		if($(".text_content").height() == 80){
			$('.text_content').animate({height: '100%'});
		}else{
			$('.text_content').animate({height: '80px'});
		}
					
	});
	$("#user_name").html(myName);
	getListReply();	//获取回复信息列表
	autosize(document.querySelectorAll('textarea'));
}

//------------------------------------------------------
//显示主题信息
function showSubjectInfo(record){
	if(!record){
		return;
	}
	
	//标题
	$("#subject_name").html(tek.dataUtility.stringToHTML(record.name));
	// $("#edit_subject_name").attr('value',tek.dataUtility.stringToHTML(record.name));
	//内容摘要
	if (record.subject_summary) {
		 var show = record.subject_summary.show || "";
        $("#subject_summary").html(tek.dataUtility.stringToHTML(show));
		
		
    }


	if(SUBJECT_OWNER){
		readUser(SUBJECT_OWNER.value, '.reply_icon');
		
	}
	
	//作者
	if(record.subject_author){
		$("#subject_author").html(SUBJECT_AUTHOR.show);
	}
	//发布时间
	if(record.subject_date && record.modifyTime){
		if(record.subject_date.show == record.modifyTime.show){
			var show = record.subject_date.show || "";
			var firstTime = record.subject_date.value;
			$("#subject_date").html(tek.dataUtility.stringToHTML(show));
		}else{
			var show = record.modifyTime.show || "";
			var firstTime = record.modifyTime.value;
			$("#subject_date").html( tek.dataUtility.stringToHTML(show));
		}
		var date = new Date().getTime();
		/*if(isEdit && date-firstTime < 1000*60*60){
			$("#editBtn").removeClass("hide");
		}else{
			$("#editBtn").addClass("hide");
		}*/
	}
	
	
	
	//目录
	/*if(SUBJECT_CATALOG){
		var target = document.querySelector('.catalog');
		var catalog = SUBJECT_CATALOG.split(";");
		var html = "";
		for(var i in catalog){
			if(catalog[i]){
				html += '<li><a href="javascript:;">- ' + catalog[i] + '</a></li>';
			}                
		}
		target.insertAdjacentHTML('BeforeEnd', html);
	}*/
	//标签
	if(SUBJECT_TAGS){
		var target = document.querySelector('.tag');
		var tags = SUBJECT_TAGS.split(";");
		var html = "";
		for(var i in tags){
			if(tags[i]){
				html += '<li><a href="javascript:;">' + tags[i] + '</a></li>';
			}                
		}
		target.insertAdjacentHTML('BeforeEnd', html);
	}
	
}

//显示错误的信息
function showError(message) {
   
	var msg = message || "主题未找到！"
	tek.macCommon.waitDialogShow(null, msg);
	tek.macCommon.waitDialogHide(1500);
}
//显示等待加载图标
function showWaitingImg(displayWaiting) {
    var html = "";
    if (displayWaiting == true) {
        html += "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' alt='waiting...'/>";
    }
   //$("#subject_info_ul_1").html("<li class='loading center loading-style'>" + html + "</li>");
   if (tek.user.isNormal(mySecurity)) {
    $("#subject_summary").html("<div class='loading center'>" + html + "</div>");
   }
    /*var nhtml = "<div id='waiting_icon' class='loading-big center'>" + html + "</div>";
    $("#subject_content").html(nhtml);*/
}

//===================================================================================================

//读取相册文档信息
function readImageDocument() {
	if (!subjectId){
		showError("主题未找到");
	}
	var target = document.getElementById('bs-carousel-1');
    if (!target){
		return;
	}
        
	var setting = {async: true,operateType: "读取相册"};
	var sendData = {
		objectName: "Document",
		action: "getList",
		subject_id: subjectId,
		count: COUNT,
		skip: SKIP,
		desc: 1, //倒序排列值为1，否则为0
		order: "createTime",
		condition: encodeURIComponent("doc_mime LIKE '%image%' OR doc_mime LIKE '%jpeg%'") //读取相册文件
		
	};
	var callback = {
		beforeSend: function(){
 			$("#carousel-inner").html("<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></p>");
        },
		success: function (data) {
			//保存文档总数
			TOTAL = parseInt(data.value);
			
			$("#carousel-inner").html('')
			var record = data["record"];
			if (record) {
 				record = !record.length ? [record] : record;
				// for(var i in record){
					//显示文件内容
					showDocument(record, target);
					
					//保存当前显示的文档的id，用于显示回复
					//current_document_id = record.id || "";
					
				// }
			} else {
                target.innerHTML = "<div class='loading center text-muted'>暂时没有相册信息！</div>";
			}
		},
		error: function (data, errorMsg) {
			showError(errorMsg);
		},
		complete: function () {
			//显示分页
            tek.turnPage.show("photos", SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
			
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
//读取文件文档信息
function readHtmlDocument() {
	if (!subjectId){
		showError("主题未找到");
	}
	var target = document.getElementById('widget-content');
    if (!target){
		return;
	}
        
	var setting = {async: true,operateType: "读取相册"};
	var sendData = {
		objectName: "Document",
		action: "getList",
		subject_id: subjectId,
		// count: COUNT,
		skip: 0,
		desc: 1, //倒序排列值为1，否则为0
		order: "createTime",
		condition: encodeURIComponent("doc_mime LIKE '%text%' OR doc_mime LIKE '%htm%'") //读取文本文件
	};
	var callback = {
		beforeSend: function(){
 			$("#widget-content").html("<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></p>");
        },
		success: function (data) {
			//保存文档总数
			TOTAL = parseInt(data.value);
			
			//target.innerHTML = "";
			$("#widget-content").html('')
			var record = data["record"];
			if (record) {
 				record = !record.length ? [record] : record;
				// for(var i in record){
					//显示文件内容
					showDocument(record, target);
					
					//保存当前显示的文档的id，用于显示回复
					//current_document_id = record.id || "";
					
				// }
			} else {
                //target.innerHTML = "<div class='loading center text-muted'>暂时没有文档记录！</div>";
			}
		},
		error: function (data, errorMsg) {
			showError(errorMsg);
		},
		complete: function () {
			//设置 页面显示的数据条数
			if(SKIP < TOTAL && SKIP+COUNT < TOTAL){
				SKIP += COUNT;
				$("#moreBtn").removeClass("hide");
			}else {
				SKIP = TOTAL;
				$("#moreBtn").addClass("hide");
			}
			
			
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
//显示文档信息
function showDocument(record, target) {
	if(!record || !target){
		return;
	}
	var num = 0;
	for(var i in record){
		var docMime = !!record[i].doc_mime ? record[i].doc_mime.show : "";
		var docType;
		if (docMime) {
			docMime = tek.dataUtility.getMimeType(docMime);
			docType = docMime.split("/")[0];
		}
		switch (docType) {
			//显示文本文件内容
			case "text":
				num += 1;
				if(num == 1){
					showTextDocument(record[i]);
					showTextDocumentName(record[i], true);
				}else{
					showTextDocumentName(record[i]);
				};
				//读取用户头像信息
				readUser(record[i].doc_owner.value, ".icon-"+record[i].id );
				break;
			//显示图片文件内容
			case "image":
				showImageDocument(record[i]);
				break;
			//显示音频文件内容
			case "audio":
				break;
			//显示视频文件内容
			case "video":
				break;
			//显示
			case "application":
				break;
			default:
				break;
		}//end switch(docType)
		
	}
	$("#documents_counts").html(num);
}

//显示文档名字
function showTextDocumentName(record,isFirst){
	if(!record){
		return ;
	}
	var html = '';
	if(isFirst){
		html += '<div class="widget active">';
	}else{
		html += '<div class="widget">';
	}
	html += '<div class="w-head head-' + record.id + '">'
		+ '<h3 class="pull-left">'
		+ '<img  alt="" class="img-responsive icon-' + record.id + '">'
		+ '<span>' + record.doc_owner.show + '，</span>'
		+ '<span>' + record.name + '</span>'
		+ '</h3>'

		+ '<div class="pull-right">'							
		+ '<div class="w-links dropdown">';

	if(record.modifyTime){
		var show = record.modifyTime.show || '';
	}
	html += '<span>' + show + '</span> '							
		+ '</div>'							
		+ '</div>'							
		+ '<div class="clearfix"></div>'
		+ '</div>'
		+ '<div class="w-body comments-widget">'
		+ '<div class="clearfix"></div>'	
		+ '</div>'	
		+ '</div>';						
					
						
	$("#text-content").append(html);	



	/*加载文档内容 显现/隐藏 切换*/
	$(".head-"+record.id).click(function(e){
		e.preventDefault();
		$('#text-content').find('.widget').each(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
			}
		});
		$(this).parent('.widget').addClass('active');
		if($('#comment-id-' + record.id).length > 0){
			$("#w-body-" + record.id).toggle(200);
		}else{
			showTextDocument(record);
		}
					
	});
}
//显示文本文件内容	--包含text html; isSync=true 同步，否则异步
function showTextDocument(record, isSync){
	if(!record){
		return ;
	}
	var docMime = !!record.doc_mime ? record.doc_mime.show : "";

	var docType;
	if (docMime) {
		docMime = tek.dataUtility.getMimeType(docMime);
		docType = docMime.split("/")[1];
	}

	if (!isSync || isSync != true) {
		isSync = false;
	}

	$.ajaxSetup({
		async: isSync	//false-取消异步
	});
	$("#widget-content").html("<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' alt='waiting...'/></p>");
	var openurl = "download/download.jsp?doc_id=" + record.id;
	$.get(openurl, function(data){
		if(data != null){
			//处理要显示的html或非html文件
			if (docType && docType == "html") {
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

			if(tek.user.isNormal(mySecurity)){
				var html = '';
				html += '<div class="widget"><div class="w-head head-' + record.id + '">'
					+ '<h3 class="pull-left">'
					+ '<img alt="" class="img-responsive icon-' + record.id + '">'
					+ '<span>' + record.doc_owner.show + '，</span>'
					+ '<span>' + record.name + '</span>'
					+ '</h3>'

					+ '<div class="pull-right">'							
					+ '<div class="w-links dropdown">';

				if(record.modifyTime){
					var show = record.modifyTime.show || '';
				}
				html += '<span>' + show + '</span> '							
					+ '</div>'							
					+ '</div>'							
					+ '<div class="clearfix"></div>'
					+ '</div>';

				html += '<div class="w-body comments-widget">'
					+'<div class="comment">'
					+ '<div class="comment-details" style="text-indent:2em;" id="comment-id-' + record.id + '">'
					// + '<p class="text_content" style="height: 80px;overflow: hidden;">'
					+ data
					// + '</p>'
					+ '</div>'
					+ '</div>';
					
				html += '<div class="clearfix"></div>'	
					+ '</div></div>'	
			}
			$("#widget-content").html(html);

			$(".text-content img").addClass("carousel-inner img-responsive img-rounded");
			$(".text-content p img").addClass("carousel-inner img-responsive img-rounded");
			$(".text-content div img").addClass("carousel-inner img-responsive img-rounded");

			readUser(record.doc_owner.value, ".icon-"+record.id );
		}
	})
	 	
}


//显示图片文件内容
function showImageDocument(record){
	if(!record){
		return ;
	}
	var url = "download/download.jsp?doc_id=" + record.id;
	if(isBoolean){
		isBoolean = false;
		var html1 = '<li data-target="#bs-carousel-1" data-slide-to="' + carouselNum + '" class="active"></li>'
		var html2 ='<div class="item active"><img class="carousel-inner img-responsive img-rounded doc_img" src="' + url + '" alt=""></div>'
	}else{
		var html1 = '<li data-target="#bs-carousel-1" data-slide-to="' + carouselNum + '"></li>'
		var html2 ='<div class="item"><img class="carousel-inner img-responsive img-rounded doc_img" src="' + url + '" alt=""></div>'
	}
	carouselNum++;
	$("#carousel-indicators").append(html1);
	$("#carousel-inner").append(html2);
	console.log($("#carousel-inner").html())
}



//翻页 turn-page.js必须实现方法
tek.turnPage.turn = function (eleId, skip) {
	skip = parseInt(skip);
	if (!isFinite(skip) || skip < 0)
		return;

	SKIP = skip;
	if(eleId == 'photos'){
		$("#carousel-indicators").html('');
		$("#carousel-inner").html('');
		isBoolean = true;
		carouselNum = 0;
		readImageDocument();
	}
	
};








