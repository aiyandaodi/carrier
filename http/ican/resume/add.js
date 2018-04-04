var winWidth = 0;
var CHANGE_WIDTH=768;
var resumeId; //文档标识
var ueditor;

function init(){
    if(!tek.common.isLoggedIn()){
        goLogin();
    }

    resumeId = request['resume_id'];

    if(resumeId && resumeId.length > 0){
         $("#resume_title").html("主题附件标题");
         editDocument();
    }else{
        addDocument();
    }

    
    $('#summernote_pc').summernote({
        height: 500,                 // set editor height
        minHeight: 600,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        lang: 'zh-CN',
        airMode: true,
        placeholder: '输入正文',
        focus: true                  // set focus to editable area after initializing summernote
    });
    
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
//window.onresize = getWidth;

/*文档编辑页面 支持图文混编、文件上传*/

//文件上传的方式，新增：addInfo  编辑: setInfo
var RESUME_UPLOAD_TYPE = {action: "addInfo", id: "0"};

/* 新建文档域 */
function addDocument(){
    //设置上传文件的方式
    RESUME_UPLOAD_TYPE["action"] = "addInfo";
    // RESUME_UPLOAD_TYPE["id"] = subjectId;

    getEditDocument();  //获取新增域
}

//文档input新增（ajaxFileUpload提交）
function addResumeFormBtn(targetId){
    var form = document.getElementById(targetId);
    if(!form){
        return ;
    }

    var myData = {
        objectName: "Resume",
        action: "addInfo",
        contentType: "input",
        'upload-temp': 1
    }

    var contentHTML = encodeURIComponent($('#summernote_pc').summernote('code'));
    if(contentHTML){
        myData["blob-input"] = contentHTML.replace(/"/g,"'");
    }
    if(form.resume_code && form.resume_code.value){
        myData['resume_code'] = form.resume_code.value;
    }
    if(form.resume_name && form.resume_name.value){
        myData['resume_name'] = form.resume_name.value;
    }
    //显示提示信息
    var html = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 文档新建保存中，请稍候!</p>";
    tek.macCommon.waitDialogShow(null, html);

    $.ajaxFileUpload({
        async: false,
        url: tek.common.getRootPath() + 'servlet/tobject', //上传文件的服务端
        secureuri: false,   //是否启用安全提交
        dataType: 'json',
        type: 'post',
        fileElementId: '0', //表示文件域ID
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
    showEditDocumentContent();  //显示编辑文档内容
    getEditDocument();  //获取编辑域
}
//显示编辑文档内容
function showEditDocumentContent() {
    var path = request['filepath'];
    var name = request['filename'];

    $("#tijiaoanniu").attr("onClick", "javascript:editDocumentFormBtn('resume_form');");
    //设置上传文件的方式
    RESUME_UPLOAD_TYPE["action"] = "setInfo";
    RESUME_UPLOAD_TYPE["id"] = resumeId;

    //显示输入
    //changeDocType("contentType");
    //不可修改文件类型
    $("#contentType").attr("disabled", "disabled");

    //显示加载等待图标
    var waitImg = "<div class='padd text-center' id='wait_load_edit'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>"
    $("#document_form_text").append(waitImg);
    //显示要编辑的额原内容
    var openurl = tek.common.getRootPath() + "http/tekinfo/system/download.jsp?file-path=" +path + '&file-name=' + name;
    $.get(openurl, function (data) {
        if (data) {
            data = tek.dataUtility.checkLoadHTML(data);
            // $('#document_content').summernote('code', data);

            $('#summernote_pc').summernote('code',data);
            //ueditor.setContent(data);
        }//end if(data != null)
        $("#wait_load_edit").remove();  //移除加载等待图标节点
    });
    
}
//文档input编辑（ajaxFileUpload提交）
function editDocumentFormBtn(targetId) {
    var form = document.getElementById(targetId);
    if (!form)
        return;
    var mydata = {};
    mydata["objectName"] = "Resume";
    mydata["action"] = "setInfo";
    mydata["contentType"] = "input";
    mydata["upload-temp"] = 1;
    mydata["resume_id"] = resumeId;

    // var content = $('#document_content').summernote('code');
    var contentHTML = encodeURIComponent($('#summernote_pc').summernote('code'));

    if (contentHTML)
        mydata["blob-input"] = contentHTML.replace(/"/g, "'");

    if (form.resume_code && form.resume_code.value)
        mydata["resume_code"] = form.resume_code.value;

    if (form.resume_name && form.resume_name.value)
        mydata["resume_name"] = form.resume_name.value.replace(/"/g, "'");

    //显示提示信息
    var html = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 文档修改保存中，请稍候!</p>";
    tek.macCommon.waitDialogShow(null, html);

    $.ajaxFileUpload({
        async: false,
        url: tek.common.getRootPath() + 'servlet/tobject', //上传文件的服务端
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

    var sendData = {objectName: "Resume"};
    if(resumeId){
        sendData["action"] = "getEdit";
        sendData["resume_id"] = resumeId;
        sendData["blob"] = 1;
    }else {
        sendData["action"] = "getNew";
    }

    var callback = {
        success: function(data){
            $("#resume_form_field").empty();

            var record = data["record"];
            if(record){
                showEditResume(record, resumeId);    //显示新建(只传入record)、编辑域
            }
        },
        error: function(data, errorMsg){
            $("#resume_form_field").html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示编辑域   --新建文档、编辑文档通用
function showEditResume(record, id){
    console.log(record)
    if(record){
        var html = "";
        //标识  --编辑文档显示
        if (id) {
            html += "<div class='form-group hidden'>"
                + "<label class='col-xs-4 col-sm-3 col-md-2' for='item_doc_id'>标识</label>"
                + "<div class='col-xs-8 col-sm-9 col-md-10'>"
                + "<input name='resume_id' id='resume_id' class='form-control' type='hidden' value='" + id + "' /> "
                + "</div>"
                + "<div class='clearfix'></div></div>";
        }
        //编码  --新建文档显示
        if (record.resume_code) {
            var field = record.resume_code;

            html += "<div class='form-group hidden'>"
                + "<label class='col-xs-4 col-sm-3 col-md-2' for='item_" + field.name + "'>" + field.display + "</label>"
                + "<div class='col-xs-8 col-sm-9 col-md-10'>"
                + "<input name='" + field.name + "' id='" + field.name + "' class='form-control' type='hidden' value='" + (tek.dataUtility.stringToInputHTML(field.show) || "") + "' /> "
                + "</div>"
                + "<div class='clearfix'></div></div>";
        }
       
        $("#resume_form_field").html(html);
        
        if(record.resume_name){
            var htmlName = "<input name='resume_name'  id='resume_name' class='resume-control' value='" + (record.resume_name.show || "") + "' placeholder='输入简历名称' type='text'>";
            
            $("#addResumeSpan").html(htmlName);
        }

    }
}