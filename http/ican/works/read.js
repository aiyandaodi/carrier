// JavaScript Document
var works_id;
function init(){

    works_id = request["works_id"];
    if(works_id){
        readWorksInfo();
    }

    //获取公告信息
    getSubjectList(4,"subject_notice");
}
function readWorksInfo(){
    var setting = {operateType: "读取人生经历信息"};
    var sendData = {
        objectName: "Works",
        action: "readInfo",
        works_id: works_id
    };
    var callback = {
        beforeSend: function () {
            var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
            $("#works-content").html(html);
        },
        success: function (data) {
            var record = data["record"];
            if (record) {
                $("#works-content").html('')
                record = !record.length ? [record] : record;
                for(var i in record){
                    showWorksInfo(record[i], data.right);
                }
            } else {
                $("#works-content").html("该信息不存在");
            }
        },
        error: function (data, errorMsg) {
            $("#works-content").html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

//显示人生经历信息
function showWorksInfo(record, right){
    if(!record){
        return ;
    }
    var html = '';
    var field;
    html += '<div class="ui-head">';
    if(record.name){
        html += '<h3>' + record.name + '</h3>';
    }
    if(tek.right.isCanDelete(parseInt(right))){
        html += '<a href="javascript:;" onclick=removeWorks("' + record.id + '","' + record.name + '") class="btn btn-red"><i class="fa fa-trash-o"></i></a>'
    }
    if(tek.right.isCanWrite(parseInt(right))){
        html += '<a href="edit.html?works_id=' + record.id + '&show-close=1&refresh-opener=1" target="_blank" class="btn btn-lblue"><i class="fa fa-edit"></i></a>'
    }
    html += '</div>'
        + '<div class="clearfix"></div>'
        + '<div class="ui-list">'
        + '<p>';
    if(record.works_start){
        field = record.works_start;
        html += '<div class="col-md-6 col-sm-6">' + (field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</div>';
    }
    if(record.works_end){
        field = record.works_end;
        html += '<div class="col-md-6 col-sm-6">' + (field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</div>';
    }
    if(record.works_type){
        field = record.works_type;
        html += '<div class="col-md-6 col-sm-6">' + (field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</div>';
    }
    if(record.works_orgname){
        field = record.works_orgname;
        html += '<div class="col-md-6 col-sm-6">' + (field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</div>';
    }
    if(record.works_counts){
        field = record.works_counts;
        html += '<div class="col-md-6 col-sm-6">' + (field.display || '') + '：' + tek.dataUtility.stringToHTML(field.show || '') + '</div>';
    }
    if(record.works_color){
        field = record.works_color;
        html += '<div class="col-md-6 col-sm-6">' + (field.display || '') + '：<span style="background:#' + field.value + '"></div>';
    }

    html += '<div class="clearfix"></div>'
        + '</p>'
        + '</div>';
    if(record.works_remark){
        field = record.works_remark;
        html += '<div  class="ui-para br-lblue">'
            + '<p><span style="font-weight: bold">' + (field.display || '') + '：</span><br>' 
            + tek.dataUtility.stringToHTML(field.show || '') + '</p>'
            + '</div>';
    }

    html += '</div>';
    
    var target = document.getElementById("works-content");
    if (target){
        target.insertAdjacentHTML('BeforeEnd', html);
    } 
}


function removeWorks(id,name){

    var remove = window.confirm("确定要删除吗?");
    if (!remove){
        return;
    }
    var setting = {operateType: "删除经历"};
    var sendData = {
        objectName: "Works",
        action: "removeInfo",
        works_id: works_id
    };
    var callback = {
        beforeSend: function () {
            var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 正在删除!</p>";
            tek.macCommon.waitDialogShow(null, msg);
        },
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
            
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null,errorMsg);
        },
        complete: function () {

            setTimeout(function () {
                //等待图层隐藏
                tek.macCommon.waitDialogHide();
                window.close();
            }, 2000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);   
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

