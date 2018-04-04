//主题回复相关
var reply_right = 0; //回复权限
var reply_index = 0; //显示回复的序号
var reply_skip = 0; //回复目录起始数
var reply_total = 0; //回复总条数
var reply_DefaultCountPerPage = 5; //默认每页显示的条数                  
var reply_currentCount = reply_DefaultCountPerPage;  //当前每页显示的条数

var tuijian_number = 0; //推荐人数
var fandui_number = 0; //反对人数
var this_user_attitude = 0;//判断当前用户是否参与赞成或者反对，0未参与，1已参与推荐，-1已参与反对



//主题回复列表，是否具有管理权限判断  --管理权限标志：rightFlag（管理员：rightFlag=true，非管理员：rightFlag=false）
function getListReply(rightFlag) {
    //列表域标签：target
    var target = document.getElementById('reply-div-ul');
    if (!target)
        return;

    var setting = {async: false, operateType: "获取主题回复列表"};
    var sendData = {
        objectName: "Reply",
        action: "getList",
        reply_subject: subjectId,
        // reply_document: current_document_id,
        count: reply_currentCount,
        skip: reply_skip,
        desc: 1,
        order: "createTime"
    };
    if (!rightFlag)
        sendData["reply_status"] = 1;//筛选条件：显示“正常”的回复（1正常  0申请  -1禁止）//非管理员只要回复状态为“正常”的//管理员要显示全部，次句注掉

    var callback = {
        beforeSend: function () {
            reply_right = 0;
            reply_total = 0;
            //reply_index = reply_skip;   //设置序号
            target.innerHTML = "<div class='loading center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>";
        },
        success: function (data) {
            reply_right = parseInt(data.right);//获取当前回复的权限
            reply_total = data.value;   //记录总条数
            $("#reply_counts").html(data.value);
            target.innerHTML = "";
            var records = data["record"];
            if (records) {
                records = !records.length ? [records] : records;
                for (var i in records){
                    showReplyInfo(records[i], target);
                }
            } else {
                target.innerHTML = "<div class='loading center text-muted'>暂时没有评论记录！</div>";
                $("#reply-page").css('display', 'none');
            }
        },
        error: function (data, errorMsg) {
            if (data && data.code != 0) {
                target.innerHTML = "<div class='loading center text-muted'>" + errorMsg + "</div>";
            } else {
                target.innerHTML = "";
                showError(errorMsg);
            }
        },
        complete: function () {
            if (typeof MY_TURN_PAGE == "object") {
                var config = {};
                config["pageShowId"] = "reply-page";
                MY_TURN_PAGE.config(config);    //初始化数据
                MY_TURN_PAGE.turnPage(reply_total, sendData.count); //翻页
            }
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示回复记录
function showReplyInfo(record, target) {
    if (!record || !target)
        return;

    if (reply_right > 0 && (reply_right & 2) == 2) {
        $("#show_subject_reply").css("display", "block");
    } else {
        return;
    }

    var html = '';
    var field;
    html += '<div class="blog-comment-item">';
    if(record.reply_owner){
        field = record.reply_owner;
        readUser(field.value);
    }
    html += '<div class="comment-author-image">'
        + '<a href="#"><img src="' + (ICON || 'images/1.jpg') + '" alt="" class="img-responsive img-thumbnail" /></a>'
        + '</div>';
    html += '<div class="comment-details">'
        + '<h5><a href="javascript:;">' + tek.dataUtility.stringToHTML(field.show || '') + '</a>';
    if(record.modifyTime){
        field = record.modifyTime;
        html += '<small>' + tek.dataUtility.stringToHTML(field.show || '') + '</small>';
    }
    html += '</h5>';
    if(record.reply_remark){
        field = record.reply_remark;
        html += '<p id="reply_remark_' + record.id + '">' + tek.dataUtility.stringToHTML(field.show || '') + '</p>';
    }

    html += '</div></div>';

    //回复操作
    if (tek.right.isCanAdmin(SUBJECT_RIGHT)) {
        //是管理员
        html += "<div id='reply_caozuo' class='pull-right bottom-border-thic'>";
        if (record.reply_status.value == -1) {
            html += "<a href='#'><span id='reply_jiejin' class='pull-right' onmouseover=\"style='cursor:pointer;'\" onclick='reply_jinzhi(\"" + record.id + "\",1);'>解禁</span></a>";
        } else if (record.reply_status.value == 1) {
            html += "<a href='#'><span id='reply_stop' class='pull-right' onmouseover=\"style='cursor:pointer;'\" onclick='reply_jinzhi(\"" + record.id + "\",-1);'>禁止</span></a>";
        }
        html += "<a href='#;'><span id='reply_delete' class='pull-right' onmouseover=\"style='cursor:pointer;'\" onclick='reply_delete(\"" + record.id + "\");'>删除</span></a>";
        if (record.reply_owner.value == myId) {
            html += "<a href='#'><span id='reply_edit' class='pull-right' onmouseover=\"style='cursor:pointer;'\" onclick='reply_edit(\"" + record.id + "\");'>编辑</span></a>";
        }
        html += "</div>";
    } else if (record.reply_owner.value != "0" && record.reply_owner.value == myId) {
        //当前用户是回复人，且不是匿名
        html += "<div id='reply_caozuo' class='pull-right bottom-border-thic'>"
            + "<a href='#'><span id='reply_delete' class='pull-right' onclick='reply_delete(\"" + record.id + "\");'>删除</span></a>"
            + "<a href='#'><span id='reply_edit' class='pull-right' onclick='reply_edit(\"" + record.id + "\");'>编辑</span></a>"
            + "</div>";
    } else if (record.reply_owner.value == "0") {
        //匿名用户
        niming = 1;
    }

    html += "<div class='clearfix'></div>"
        + "</div></div>";

    //插入回复数据
    target.insertAdjacentHTML('BeforeEnd', html);
}




//回复主题
function addReply() {
    if (!subjectId)
        return;
    var addForm = document.getElementById('reply-form');
    if (!addForm)
        return;
    var value = addForm.reply_content.value;
    if (value.trim() == "") {
        addForm.reply_content.value = '';
        addForm.reply_content.focus();
        addForm.reply_content.placeholder = "请输入回复内容！";
        return;
    }

    var setting = {operateType: "提交主题回复"};
    var sendData = {
        objectName: "Reply",
        action: "addInfo",
        reply_subject: subjectId,
        reply_remark: value
    };
    var callback = {
        url: tek.common.getRootPath() + "servlet/reply",
        beforeSend: function () {
            //等待图层显示
            var html = "<p class='text-center text-nuted'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 请稍候...</p>";
            tek.macCommon.waitDialogShow("回复", html);
        },
        success: function (data) {
            addForm.reply_content.value = "";	//清空

            //刷新回复列表
            refreshReplyList();

            tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >回复成功！</p>");
        },
        error: function (data, errorMsg) {
            showError(errorMsg);
        },
        complete: function () {
            //等待图层隐藏
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/reply", setting, sendData, callback);
}

//刷新回复列表
function refreshReplyList() {
    //重置回复列表参数
    resetReplyVariable();
    //列表主题回复
    getListReply(tek.right.isCanAdmin(SUBJECT_RIGHT));
}


//重置回复列表参数
function resetReplyVariable() {
   // reply_index = 0;                //显示序号
    //reply_skip = 0;         //回复当前起始数

    if (MY_TURN_PAGE && typeof MY_TURN_PAGE == "object") {
        MY_TURN_PAGE.currentPage = 1;       //重置
        MY_TURN_PAGE.currentFromPage = 1;   //重置
    }
}
//重新查询
function getMyList() {
    reply_skip = MY_TURN_PAGE.skip;
    //列表主题回复
    getListReply(tek.right.isCanAdmin(SUBJECT_RIGHT));
}

//回复删除
function reply_delete(reply_id_1) {
    if (!reply_id_1)
        return;
    if (!window.confirm("确定删除该回复?"))
        return;

    var setting = {async: false, operateType: "删除回复的记录"};
    var sendData = {
        objectName: "Reply",
        action: "removeInfo",
        reply_id: reply_id_1
    };
    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "删除成功！");
            //列表主题回复
            getListReply(tek.right.isCanAdmin(SUBJECT_RIGHT));
        },
        error: function (data, errorMsg) {
            showError(errorMsg);
        },
        complete: function () {
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/reply", setting, sendData, callback);
}

//回复的再次编辑 域的显示
function reply_edit(reply_id_1) {
    var value = $("#reply_remark_" + reply_id_1).html();
    value = tek.dataUtility.stringToInputHTML(value);
    //一般存储回车是<br>,但是在teatarea中是\n，所以需要转换一下
    value = tek.dataUtility.htmlToString(value);

    var textarea = "<textarea id='reply_content_1' name='reply_content' class='form-control' onkeyPress='javascript:ctrlEnter_1(event,\"" + reply_id_1 + "\");' rows='3' oninput='OnInput(event)' onpropertychange='OnPropChanged(event)'></textarea></br>"
        + "<button id='button_submit_1' class='btn btn-success' style='margin-right:5px;' type='submit' onclick='addReply_1(\"" + reply_id_1 + "\");'><i class='fa fa-comment'></i> 确 定</button>"
        + "<button id='button_cancel_1' class='btn btn-danger' style='margin-left:5px;' type='submit' onclick='cancelReply_1();'><i class='fa fa-comment'></i> 取 消</button>";

    //显示等待图层
    tek.macCommon.waitDialogShow("修改", textarea, "");

    $("#reply_content_1").html(value).focus();
    $("#reply_content").focus();
}
//回复的再次编辑 的取消操作
function cancelReply_1() {
    //隐藏等待图层
    tek.macCommon.waitDialogHide();
}

//回复的再次编辑 //以下两个函数解决：$("#reply_content_1").html()获取内容的及时更新
function OnInput(event) {
    $("#reply_content_1").html(event.target.value);
}
// Internet Explorer
function OnPropChanged(event) {
    if (event.propertyName.toLowerCase() == "value") {
        $("#reply_content_1").html(event.target.value);
    }
}

//回复的再次编辑 的提交操作
function addReply_1(reply_id_1) {
    var setting = {async: false, operateType: "提交回复记录的修改"};
    var sendData = {
        objectName: "Reply",
        action: "setInfo",
        reply_id: reply_id_1,
        reply_remark: $("#reply_content_1").text()
    };
    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "<p class='text-center text-nuted' >修改成功！</p>");
            //列表主题回复
            getListReply(tek.right.isCanAdmin(SUBJECT_RIGHT));
        },
        error: function (data, errorMsg) {
            showError(errorMsg);
        },
        complete: function () {
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/reply", setting, sendData, callback);
}

//回复的再次编辑 编辑框的快捷回复操作：ctrl+enter
function ctrlEnter_1(event, reply_id_1) {
    $("#reply_content").blur();
    var Sys = tek.common.getBrowser();
    if (Sys.firefox) {
        if (event.ctrlKey && event.keyCode == 13) addReply_1(reply_id_1);
    } else {
        if (event.ctrlKey && event.keyCode == 10) addReply_1(reply_id_1);
    }
}
//匿名用户回复需要登录        ***********************暂时没用到，因为匿名用户，回复区域reply_content不显示
$("#reply_content").click(function () {
    if (!tek.common.isLoggedIn()) {
        callLogin();//模版自带函数
    }
});

//----------------------------------------------------------------
//回复禁止、回复解禁
function reply_jinzhi(reply_id_1, attitude_2) {
    if (attitude_2 == 1) {//-->解禁  attitude_2==1
        $("#reply_stop").removeClass("hidden");
        $("#reply_jiejin").addClass("hidden");
        if (!window.confirm("确定解禁该回复?"))
            return;
    } else {//-->禁止  attitude_2==-1
        $("#reply_stop").addClass("hidden");
        $("#reply_jiejin").removeClass("hidden");
        if (!window.confirm("确定禁止该回复?"))
            return;
    }

    var setting = {async: false, operateType: "设置回复记录的状态"};
    var sendData = {
        objectName: "Reply",
        action: "setInfo",
        reply_id: reply_id_1,
        reply_status: attitude_2
    };
    var callback = {
        success: function (data) {
            var msg = "";
            if (attitude_2 == 1) msg = "<p class='text-center text-nuted' >解禁成功！</p>";
            if (attitude_2 == -1) msg = "<p class='text-center text-nuted' >禁止成功！</p>";
            tek.macCommon.waitDialogShow(null, msg);
            //刷新回复列表
            refreshReplyList()
        },
        error: function (data, errorMsg) {
            showError(errorMsg);
        },
        complete: function () {
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/reply", setting, sendData, callback);
}