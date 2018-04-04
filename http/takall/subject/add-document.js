var winWidth = 0;
var CHANGE_WIDTH=768;
var subjectId; //主题标识
var documentId; //文档标识
var input = "noinput";
function init(){
    getWidth();
    if(winWidth < CHANGE_WIDTH){
        $('#summernote_phone').summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            lang:'zh-CN',
            focus: true,
            airMode: true
        });
    }else {
        $('#summernote_pc').summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            lang: 'zh-CN',
            focus: true                  // set focus to editable area after initializing summernote
        });
    }
	
	
	/*if(!tek.common.isLoggedIn()){
		goLogin();
	}*/
	//input = request["input_type"];
	subjectId = request['subject_id'];
	//addDocument();
}

function getWidth(){
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if(winWidth < CHANGE_WIDTH){
        $('#pc').hide();
        $('#phone').show();
        $('#summernote_phone').summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            lang:'zh-CN',
            focus: true,
            airMode: true
        });
    }else{
        $('#pc').show();
        $('#phone').hide();
    }
}
window.onresize = getWidth;


//新建文档
/*function addDocument() {
    getEditDocument();		//获取新增域
}*/

function addDocumentFormBtn(){
	//
	var form = document.getElementById('add_form');
		
    if (!form){
		return;
	}	
	var setting = {operateType:'提交回复信息'};
	var mydata = {};
	mydata["objectName"] = "Document";
	mydata["action"] = "addInfo";
	mydata["contentType"] = "input";
	mydata["subject_id"] = subjectId;
	//mydata["clear-temp"] = 1;
	
	var contentHTML = encodeURIComponent($('#summernote_pc').summernote('code'));
	if (contentHTML){
		mydata["document_input"] = contentHTML.replace(/"/g, "'");
	}
    //if (form.doc_code && form.doc_code.value){
//		mydata["doc_code"] = encodeURIComponent(form.doc_code.value);
	//}
    if (form.doc_name && form.doc_name.value){
		mydata["doc_name"] = encodeURIComponent(form.doc_name.value);
	}  
    if (form.doc_author && form.doc_author.value){
		mydata["doc_author"] = encodeURIComponent(form.doc_author.value);
	}  
    
	console.log(mydata);
	//显示提示信息
	var html = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在提交，请稍后！</p>";
	tek.macCommon.waitDialogShow(null, html);
	/*$.ajaxFileUpload({
		async: false,
		url: tek.common.getRootPath() + 'servlet/document', //上传文件的服务u端
		secureuri: false, //是否启用安全提交
		dataType: 'json', //数据类型
		fileElementId: '0', //表示文件域ID
		data: mydata,
		success: function(data){
			if(data){
				if(data.code == 0){
					//显示消息
					var msg = "<p class='text-center>" + data.message + "</p>";
					tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >成功！</p>");
					// 操作成功
					location.reload(1500);
				}else {
                    var error = "<p class='text-center'><font color='red'>" + data.code + " - " + tek.dataUtility.stringToHTML(data.message) + "</font></p>";
                    tek.macCommon.waitDialogShow(null, error);
                }
			}else {
				tek.macCommon.waitDialogShow(null, "执行失败");
				
            }
		},
        error: function (data,errorMsg) {
//           var error = "<p class='text-center'><font color='red'>操作失败！[" + request.status + "-" + request.statusText + "]</font></p>";
           tek.macCommon.waitDialogShow(null, errorMsg);
        },
        complete: function () {
        }
	})*/


	var callback = {
		beforeSend: function(){
			var html = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在提交，请稍后！</p>";
			tek.macCommon.waitDialogShow(null, html);
		},
		success: function(data){
			if(data){
				if(data.code == 0){
					//显示消息
					var msg = "<p class='text-center>" + data.message + "</p>";
					tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >成功！</p>");
					// 操作成功
					location.reload(1500);
				}else {
                    var error = "<p class='text-center'><font color='red'>" + data.code + " - " + tek.dataUtility.stringToHTML(data.message) + "</font></p>";
                    tek.macCommon.waitDialogShow(null, error);
                }
			}else{
				tek.macCommon.waitDialogShow(null, "执行失败");
            }
		},
		error: function(data, errorMsg){
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
		complete: function(){
			
		}
	}
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/document", setting, mydata, callback);

	
}

//获取新建、编辑域  --新建域不传入任何参数
function getEditDocument() {
    var setting = {async: false, operateType: "获取文档新建/编辑域"};
    var sendData = {objectName: "Document"};
    if (documentId && input) {
        sendData["action"] = "getEdit";
        sendData["doc_id"] = documentId;
        sendData["blob"] = 1;
    } else if (subjectId) {
        sendData["action"] = "getNew";
        sendData["subject_id"] = subjectId;
    }
    var callback = {
        success: function (data) {
            $("#document_form_field").empty();

            var record = data["record"];
            if (record) {
                showEditDocument(record, documentId, input);  //显示新建(只传入record)、编辑域，
            }
        },
        error: function (data, errorMsg) {
            $("#document_form_field").html(errorMsg);
			$(".reply-content").addClass('hide');
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


//显示编辑域    --新建文档、编辑文档通用
function showEditDocument(record, id, input) {
    if (record) {
        var html = "";
        //标识  --编辑文档显示
        if (id) {
            html += "<div class='form-group hidden'>"
                + "<label class='col-xs-4 col-sm-3 col-md-2' for='item_doc_id'>标识</label>"
                + "<div class='col-xs-8 col-sm-9 col-md-10'>"
                + "<input name='doc_id' id='doc_id' class='form-control' type='hidden' value='" + id + "' /> "
                + "</div>"
                + "<div class='clearfix'></div></div>";
        }

        //编码  --新建文档显示
        if (record.doc_code) {
            var field = record.doc_code;

            html += "<div class='form-group hidden'>"
                + "<label class='col-xs-4 col-sm-3 col-md-2' for='item_" + field.name + "'>" + field.display + "</label>"
                + "<div class='col-xs-8 col-sm-9 col-md-10'>"
                + "<input name='" + field.name + "' id='" + field.name + "' class='form-control' type='hidden' value='" + (tek.dataUtility.stringToInputHTML(field.show) || "") + "' /> "
                + "</div>"
                + "<div class='clearfix'></div></div>";
        }

        //文件名  --编辑文档显示
        if (record.blob) {
            var id = "doc_blob";
            if (input == "noinput") {
                $("#uploadFile0").attr({id: "doc_blob", name: "doc_blob"});
                id = "doc_blob1";
            }

            html += "<div class='form-group hidden'>"
                + "<label class='col-xs-4 col-sm-3 col-md-2' for='item_doc_blob'>文件名</label>"
                + "<div class='col-xs-8 col-sm-9 col-md-10'>"
                + "<input name='" + id + "' id='" + id + "' class='form-control' type='hidden' value='" + (record.blob.filename || "") + "' onclick='this.select();' style='color:red;' />"
                + "</div>"
                + "<div class='clearfix'></div></div>";
        }

        html += "<div class='padd hidden'><div class='row'><div class='col-md-12'><div class='docTitle'>";
        //名字  --编辑、新建显示
        if (record.doc_name) {
            html += "<input name='doc_name' id='doc_name' class='document-control' value='" + (record.doc_name.show || "") + "' placeholder='标题' type='text'>";
        }
        //作者  --编辑、新建显示
        if (record.doc_author) {
             html += "<input name='doc_author' id='doc_author' class='document-control' value='" + (record.doc_author.show || "") + "' placeholder='作者' type='text'>";
        }
        html += "</div></div></div></div>";

        //概要  --编辑、新建显示
        // if (record.doc_summary) {
        //     html += "<div class='padd'><div class='alert alert-summary'>"
        //         + "<textarea name='doc_summary' id='doc_summary' class='summary-control' placeholder='概要' rows='4'>"
        //         + (tek.dataUtility.stringToInputHTML(record.doc_summary.show) || "")
        //         + "</textarea>"
        //         + "</div></div>";
        // }

        $("#document_form_field").html(html);
    }
}


//读取文本文档
function readHtmlDocument() {
	if (!subjectId){
		showError("主题未找到");
	}
	var target = document.getElementById('chat_content');
    if (!target){
		return;
	}
        
	var setting = {operateType: "读取文本文档"};
	var sendData = {
		objectName: "Document",
		action: "getList",
		subject_id: subjectId,
		count: COUNT,
		skip: SKIP,
		desc: 1, //倒序排列值为1，否则为0
		order: "createTime",
		//condition: encodeURIComponent("doc_mime LIKE '%text%' OR doc_mime LIKE '%htm%'") //读取文本文件
	};
	var callback = {
		success: function (data) {
			//保存文档总数
			TOTAL = parseInt(data.value);
			
			//target.innerHTML = "";
			var record = data["record"];
			if (record) {
 				record = !record.length ? [record] : record;
				for(var i in record){
					//显示文本文件内容
					showTextDocument(record[i], target,data.right);
					
					
					readUser(record[i].doc_owner.value,"#doc_icon"+(++i));
					
					//保存当前显示的文档的id，用于显示回复
					current_document_id = record.id || "";
					
				}
			} else {
                target.innerHTML = "<div class='loading center text-muted'>暂时没有回复记录！</div>";
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
function showTextDocument(record, target,right) {
	if(!record || !target){
		return;
	}
	var html = "";
	if(record.doc_owner && record.doc_owner.value == SUBJECT_OWNER.value){
		html += '<div class="chat-box chat-in" id="chat-box-' + record.id + '">';
		
	}else{
		html += '<div class="chat-box chat-out" id="chat-box-' + record.id + '">'
			
	}

	
	html += '<div class="message1">'
		+ '<h5>'
	    + '<img class="img-responsive" src="" id="doc_icon' + NUM + '" alt="" />';
	
	if(record.doc_owner){
		var show = record.doc_owner.show || '';
		html += '<span class="name-responsive">' + tek.dataUtility.stringToHTML(show) + '</span>';
		
	}
	html +='<div class="clearfix"></div>'
	html +='</h5>';
	if(record.createTime && record.modifyTime){
		if(record.createTime.show == record.modifyTime.show){
			var show = record.createTime.show || '';
			var firstTime = record.createTime.value;
		}else{
			
			var show = record.modifyTime.show || '';
			var firstTime = record.modifyTime.value;
		}
		//html += '<h5><i class="fa fa-clock-o"></i>&nbsp; ' + tek.dataUtility.stringToHTML(show) + '</h5>';
	}
		
	var docMime = !!record.doc_mime ? record.doc_mime.show : "";

	var docType;
	if (docMime) {
		docMime = tek.dataUtility.getMimeType(docMime);
		docType = docMime.split("/")[1];
	}
	
	/*if (!isSync || isSync != true) isSync = false;*/

	$.ajaxSetup({
		async: false //false-取消异步
	});
	var openurl = "download/download.jsp?doc_id=" + record.id;
	
	$.get(openurl, function (data) {
		if (data != null) {
			
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
			
			html += "<div id='doc-" + record.id + "'>"
			html += "<div style='position:relative;min-height:50px;'>";
			if(data.length>200){
				html += "<div class='text-content" + NUM + " padding-s' style='height:100px;overflow:hidden'>" + data + "</div>"
			}else{
				html += "<div class='text-content" + NUM + " padding-s' >" + data + "</div>"
			}
			html += "</div>"
			html += "</div>";
			if(data.length > 200){
				html += '<div class="text-center"><a href="javascript:;" class="showText' + NUM +'" onclick="showContent('+ NUM +')">展开全文<i class="fa fa-angle-double-down"></i></a></div>'
					+ '<div class="text-right"><a href="javascript:;" class="hideText' + NUM + ' hide" onclick="hideContent('+ NUM +')">收起<i class="fa fa-angle-double-up"></i></a></div>';
				
			}
			
			var date = new Date().getTime();
			if(date-firstTime < 1000*60*60){
				if(record.doc_owner.value == myId){
					html += "<div class='"+(record.doc_owner.value === SUBJECT_OWNER.value ? "text-left":"text-right")+"'><a href='javascript:;' title='编辑' class='hideText' onclick=editDocument('"+record.id+"')><i class='fa fa-edit'></i></a>&nbsp;&nbsp;";
				}
			}
			
			if(tek.right.isCanAdmin(parseInt(right)) || record.doc_owner.value == myId){
				
				html += '<a href="javascript:;" title="删除" class="hideText" onclick=removeDocument(\"'+record.id+'\")><i class="fa fa-trash-o"></i></a></div>';
			}
			
			html += '</div>'
				+ '<div class="clearfix"></div>'
				+ '</div>';
            //插入回复数据
    		target.insertAdjacentHTML('BeforeEnd', html); 
			
			//显示或隐藏文档翻页图层
			//showOrHideDocumentTurnPage();
			
		}
		
		$(".padding-s img").addClass("carousel-inner img-responsive img-rounded");
		$(".padding-s p img").addClass("carousel-inner img-responsive img-rounded");
		$(".padding-s div img").addClass("carousel-inner img-responsive img-rounded");

	});
	NUM++;
}


//删除文档
function removeDocument(docId) {
	var target = document.getElementById('chat-box-' + docId);
	if (!target)
		return;

	var remove = window.confirm("确定删除吗?");
    if (!remove)
        return;
	
	var setting = {operateType: "确认删除"};
	var sendData = {
		objectName: "Document",
		action: "removeInfo",
		doc_id: docId
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
			tek.macCommon.waitDialogHide();
			showError(errorMsg);
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

/* 展开文档 */
function showContent(num){
	$('.text-content'+num).animate({height: '100%'});/*.animate()是jQuery的动画函数，在此，我们可以修改DOM元素的CSS样式，实现元素的动态改*/
	$('.showText'+num).addClass('hide');
	$('.hideText'+num).removeClass('hide');
}
/* 收起文档 */
function hideContent(num){
	$('.text-content'+num).animate({height: '100px'});/*.animate()是jQuery的动画函数，在此，我们可以修改DOM元素的CSS样式，实现元素的动态改*/
	$('.hideText'+num).addClass('hide');
	$('.showText'+num).removeClass('hide');
}

function editDocument(id){
	/*var date = new Date().getTime();
	if(date-time > 1000*60*60){
		alert("时间超过1小时，不能编辑");
		return ;
	}*/
	documentId = id;
	//获取文档编辑域
	getEditDocument();
	var contentHTML = $("#doc-"+id).html();
	$('#summernote_pc').summernote('code',contentHTML);
	$('#summernote_pc').summernote('focus',true);
	
	$("#add_form").find(".padding-s").css({'overflow':'auto','height':'auto'});
	/*修改时d，隐藏该条数据*/
	$("#chat-box-"+id).css('display','none');
	/*隐藏提交按钮*/
	$("#commitBtn").addClass('hide');
	/*显示修改信息的按钮*/
	$("#editCommitBtn").removeClass('hide');
	$("#cancelCommitBtn").removeClass('hide');
}
/*取消编辑*/
function cancelEditDocumentBtn(){
	/*取消修改时，恢复显示该条数据*/
	$("#chat-box-"+documentId).css('display','block');
	$(".padding-s").css('overflow','hidden');
	/*显示提交按钮*/
	$("#commitBtn").removeClass('hide');
	/*隐藏修改信息的按钮*/
	$("#editCommitBtn").addClass('hide');
	$("#cancelCommitBtn").addClass('hide');
	/*清空回复区内容*/
	$('#summernote_pc').summernote('code','');
}

/*提交编辑文档*/
function editDocumentFormBtn(id){
	var form = document.getElementById('add_form');
		
    if (!form){
		return;
	}	
	var mydata = {};
    mydata["objectName"] = "Document";
    mydata["action"] = "setInfo";
    mydata["contentType"] = "input";
	
	var contentHTML = encodeURIComponent($('#summernote_pc').summernote('code'));
	if (contentHTML){
		mydata["document_input"] = contentHTML.replace(/"/g, "'");
	}
	
	if (form.doc_id && form.doc_id.value)
        mydata["doc_id"] = form.doc_id.value;
    if (form.doc_code && form.doc_code.value)
        mydata["doc_code"] = form.doc_code.value;

    if (form.doc_name && form.doc_name.value)
        mydata["doc_name"] = form.doc_name.value.replace(/"/g, "'");
    if (form.doc_author && form.doc_author.value)
        mydata["doc_author"] = form.doc_author.value.replace(/"/g, "'");
	
	//显示提示信息
    var html = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 修改保存中，请稍候!</p>";
    tek.macCommon.waitDialogShow(null, html);
	
	$.ajaxFileUpload({
        async: false,
        url: tek.common.getRootPath() + 'servlet/document', //上传文件的服务端
        secureuri: false,  //是否启用安全提交
        dataType: 'json',   //数据类型
        type: 'post',
        fileElementId: '0', //表示文件域ID
        data: mydata,
        success: function (data, status) {
            if (data) {
                if (data.code == 0) {
                    //显示消息
                    var msg = "<p class='text-center'>" + data.message + "</p>";
					tek.macCommon.waitDialogShow(null, msg, null, 1);
					

                } else {
                    var error = "<p class='text-center'><font color='red'>" + data.code + " - " + tek.dataUtility.stringToHTML(data.message) + "</font></p>";
                    tek.macCommon.waitDialogShow(null, error);
                }//end if(data.code==0)
            } else {
                tek.macCommon.waitDialogShow(null, "<p class='text-center'><font color='red'>执行失败![data=null]</font></p>");
            }//end if(data)
        },
        error: function (request) {
            var error = "<p class='text-center'><font color='red'>操作失败！[" + request.status + "-" + request.statusText + "]</font></p>";
            tek.macCommon.waitDialogShow(null, error);
        },
        complete: function () {
			setTimeout(function(){
				location.reload();
			},1500)
        }
    });
}




