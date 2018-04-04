var winWidth = 0;
var CHANGE_WIDTH=768;
var subjectId;	//主题标识
var documentId;	//文档标识
var input;
var ueditor;

function init(){
	if(!tek.common.isLoggedIn()){
		goLogin();
	}

	input = request['input_type'];
	subjectId = request['subject_id'] || request['document_subject'];

	if(subjectId && subjectId.length > 0){
		 //$("#document_title").html("主题附件标题");
	}

	documentId = request['document_id'];

	if(documentId && documentId.length > 0){
		editDocument();
	}else{
		addDocument();
	}

	getWidth();
    if(winWidth < CHANGE_WIDTH){
        $('#summernote_pc').summernote({
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
}

function getWidth(){
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if(winWidth < CHANGE_WIDTH){
      //  $('#pc').hide();
      //  $('#phone').show();
        $('#summernote_phone').summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            lang:'zh-CN',
            focus: true,
            airMode: true
        });
    }else{
       // $('#pc').show();
      //  $('#phone').hide();
		$('#summernote_phone').summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            lang:'zh-CN',
            focus: true,
        });
    }
}
window.onresize = getWidth;

/*文档编辑页面 支持图文混编、文件上传*/

//文件上传的方式，新增：addInfo  编辑: setInfo
var DOCUEMNT_UPLOAD_TYPE = {action: "addInfo", id: "0"};

/* 新建文档域 */
function addDocument(){
	//设置上传文件的方式
    DOCUEMNT_UPLOAD_TYPE["action"] = "addInfo";
    DOCUEMNT_UPLOAD_TYPE["id"] = subjectId;

	getEditDocument();	//获取新增域
}

//文档input新增（ajaxFileUpload提交）
function addDocumentFormBtn(targetId){
	var form = document.getElementById(targetId);
	if(!form){
		return ;
	}

	var myData = {
		objectName: "Document",
		action: "addInfo",
		contentType: "input",
		subject_id: subjectId,
		'clear-temp': 1
	}

	var contentHTML = encodeURIComponent($('#summernote_pc').summernote('code'));
	if(contentHTML){
		myData["document_input"] = contentHTML.replace(/"/g,"'");
	}
	if(form.doc_code && form.doc_code.value){
		myData['doc_code'] = form.doc_code.value;
	}
	if(form.doc_name && form.doc_name.value){
		myData['doc_name'] = form.doc_name.value;
	}
	if(form.doc_author && form.doc_author.value){
		myData['doc_author'] = form.doc_author.value;
	}
	if(form.doc_summary && form.doc_summary.value){
		myData['doc_summary'] = form.doc_summary.value;
	}

	//显示提示信息
	var html = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 文档新建保存中，请稍候!</p>";
	tek.macCommon.waitDialogShow(null, html);

	$.ajaxFileUpload({
		async: false,
		url: tek.common.getRootPath() + 'servlet/document', //上传文件的服务端
		secureuri: false,	//是否启用安全提交
		dataType: 'json',
		type: 'post',
		fileElementId: '0',	//表示文件域ID
		data: myData,
		success: function(data){
			if (data) {
                if (data.code == 0) {
                    //显示消息
                    var msg = "<p class='text-center'>" + data.message + "</p>";

                    // 操作成功
                    if (typeof updateOpener != "undefined" && !!updateOpener) {
                        // 刷新父页面
                        tek.refresh.refreshOpener();
                    }

                    
                        var timerMsg = "页面<font id='counter' color='red'></font>秒后自动关闭";
                        tek.macCommon.waitDialogShow(null, msg, timerMsg, 2);
                        tek.macCommon.waitDialogHide(3000, "window.close()");

                } else {
                    var error = "<p class='text-center'><font color='red'>" + data.code + " - " + tek.dataUtility.stringToHTML(data.message) + "</font></p>";
                    tek.macCommon.waitDialogShow(null, error);
                }//end if(data.code==0)
            } else {
                tek.macCommon.waitDialogShow(null, "<p class='text-center'><font color='red'>执行失败![data=null]</font></p>");
            }//end if(data)
		},
		error: function(request){
			var error = "<p class='text-center'><font color='red'>操作失败！[" + request.status + "-" + request.statusText + "]</font></p>";
            tek.macCommon.waitDialogShow(null, error); 
		},
		complete: function(){

		}
	})
}


/* 编辑文档域 */
//编辑文档
function editDocument(){
	showEditDocumentContent();	//显示编辑文档内容
	getEditDocument();	//获取编辑域
}
//显示编辑文档内容
function showEditDocumentContent() {
    /*$("#document_form_toggle").show();	//显示开关按钮
    $("#tijiaoanniu").attr("onClick", "javascript:editDocumentFormBtn('document_form');");
    $("#document_title").html("主题附件<span class='text-info'>（编辑）</span>");
*/
 	$("#tijiaoanniu").attr("onClick", "javascript:editDocumentFormBtn('document_form');");
    //设置上传文件的方式
    DOCUEMNT_UPLOAD_TYPE["action"] = "setInfo";
    DOCUEMNT_UPLOAD_TYPE["id"] = documentId;

    //编辑内容为文字
    if (input == "input") {
        //显示输入
        //changeDocType("contentType");
        //不可修改文件类型
        $("#contentType").attr("disabled", "disabled");

        //显示加载等待图标
        var waitImg = "<div class='padd text-center' id='wait_load_edit'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>"
        $("#document_form_text").append(waitImg);
        //显示要编辑的额原内容
        var openurl = "download/download.jsp?doc_id=" + documentId;
        $.get(openurl, function (data) {
            if (data) {
                data = tek.dataUtility.checkLoadHTML(data);
                // $('#document_content').summernote('code', data);

                $('#summernote_pc').summernote('code',data);
                //ueditor.setContent(data);
            }//end if(data != null)
            $("#wait_load_edit").remove();	//移除加载等待图标节点
        });
    } else {
        //显示上传文件
        //changeDocType("uploadType");
        //$("#uploadType").attr("disabled", "disabled");
    }
}
//文档input编辑（ajaxFileUpload提交）
function editDocumentFormBtn(targetId) {
    var form = document.getElementById(targetId);
    if (!form)
        return;
    var mydata = {};
    mydata["objectName"] = "Document";
    mydata["action"] = "setInfo";
    mydata["contentType"] = "input";
    mydata["clear-temp"] = 1;

    // var content = $('#document_content').summernote('code');
    var contentHTML = encodeURIComponent($('#summernote_pc').summernote('code'));

    if (contentHTML && input == "input")
        mydata["document_input"] = contentHTML.replace(/"/g, "'");

    if (form.doc_id && form.doc_id.value)
        mydata["doc_id"] = form.doc_id.value;
    if (form.doc_code && form.doc_code.value)
        mydata["doc_code"] = form.doc_code.value;

    if (form.doc_name && form.doc_name.value)
        mydata["doc_name"] = form.doc_name.value.replace(/"/g, "'");
    if (form.doc_author && form.doc_author.value)
        mydata["doc_author"] = form.doc_author.value.replace(/"/g, "'");
    //暂时先不要关键字的编辑
    //if(form.doc_keywords && form.doc_keywords.value)
    //	mydata["doc_keywords"] = form.doc_keywords.value;
    if (form.doc_summary && form.doc_summary.value)
        mydata["doc_summary"] = form.doc_summary.value.replace(/"/g, "'");
    /*if (form.doc_blob && form.doc_blob.value)
        mydata["doc_blob"] = form.doc_blob.value;*/

    //if($("input[name='contentType']:checked").val()=="url"){
//		if(form.doc_path && form.doc_path.value)
//			mydata["doc_path"]=form.doc_path.value;
//	} else {
//		mydata["doc_path"]="";
//	}

    //显示提示信息
    var html = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 文档修改保存中，请稍候!</p>";
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

                    // 操作成功
                    if (typeof updateOpener != "undefined" && !!updateOpener) {
                        // 刷新父页面
                        tek.refresh.refreshOpener();
                    }

                    var timerMsg = "页面<font id='counter' color='red'></font>秒后自动关闭";
                    tek.macCommon.waitDialogShow(null, msg, timerMsg, 2);
                    tek.macCommon.waitDialogHide(3000, "window.close()");

                   
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
        }
    });
}





//获取文档新建、编辑域   --新建域不传入任何参数
function getEditDocument(){
	var setting = {async: false, operateType: '获取文档新建/编辑域'};

	var sendData = {objectName: "Document"};
	if(documentId && input){
		sendData["action"] = "getEdit";
		sendData["doc_id"] = documentId;
		sendData["blob"] = 1;
	}else if(subjectId){
		sendData["action"] = "getNew";
		sendData["subject_id"] = subjectId;
	}

	var callback = {
		success: function(data){
			$("#document_form_field").empty();

			var record = data["record"];
			if(record){
				showEditDocument(record, documentId, input);	//显示新建(只传入record)、编辑域
			}
		},
		error: function(data, errorMsg){
			$("#document_form_field").html(errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示编辑域   --新建文档、编辑文档通用
function showEditDocument(record, id, input){
	if(record){
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
        /*html += "<div class='padd hidden'><div class='row'><div class='col-md-12'><div class='docTitle'>";
        //名字  --编辑、新建显示
        if (record.doc_name) {
            html += "<input name='doc_name' id='doc_name' class='document-control' value='" + (record.doc_name.show || "") + "' placeholder='标题' type='text'>";
        }

        html += "</div></div></div></div>";*/

        $("#document_form_field").html(html);

        if(record.doc_name){
            var htmlName = "<input name='doc_name'  id='doc_name' class='document-control' value='" + (record.doc_name.show || "") + "' placeholder='输入文档标题' type='text'>";
            $("#addDocumentSpan").html(htmlName);
        }
	}
}