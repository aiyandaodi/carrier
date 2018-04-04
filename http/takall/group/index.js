/**
 * Created by zhkj on 2017/3/17.
 */
// JavaScript Document
//=====================================================Parameter==============================
var COUNT = 5;
//=====================================================Function===============================
function init(){
    //获取小组列表
    getGroupList();
	
	getSubjectList();
}

//获取小组列表
function getGroupList(){
    var target = document.getElementById('list');
    if(!target)
        return;

    var setting = {operateType: "获取小组列表"};
    var sendData = {
        objectName: "Group",
        action: "getList",
        count: COUNT,
        order:"createTime",
        desc: 1,
        join: 1
    };

    var callback = {
        beforeSend: function () {
            $("#list").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            // if (tek.right.isCanWrite(parseInt(data.right)))
            /*$("#group_modify_btn").removeClass("hidden");*/

            var record = data["record"];
            if (record) {
                $("#list").html("");
                //显示小组列表
                record = !record.length ? [record] : record;
                for(var i in record)
                    showGroupList(record[i], data.right);
            } else {
                $("#list").html("<div class='col-md-12 col-sm-12 center'>没有小组信息！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#list").html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示小组列表
function showGroupList(record,right){
    if (record) {
        var html = "";
        var field;

        html += "<div class='ui-info clearfix'>";
        html += "<a class='group-icon' href='read.html?group_id=" + record.id + "&show-close=1&refresh-opener=1' target='_blank'><img src='";
        html += record.icon || '../../images/happy.png';
        html += "' alt='' class='img-responsive' /></a>";

        html += "<div class='ui-details'>";
        html += "<div class='container-fluid'>";
        html += "<div class='row'>";
        /*小组名称*/
        if(record["group_name"]){
            field = record["group_name"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+field.display+"</h4>";
            html += "<h5><a href='read.html?group_id=" + record.id + "&show-close=1&refresh-opener=1' target='_blank'>"+tek.dataUtility.stringToHTML(field.show || '')+"</a></h5>";
            html += "</div>";
            html += "</div>";
        }
        /*成员数*/
        html += "<div class='col-md-4 col-sm-4 col-xs-4  col-pad'>";
        html += "<div class='ui-item'>";
        html += "<h4>成员数</h4>";
        html += "<h5>5</h5>";
        html += "</div>";
        html += "</div>";
        /*发言属性*/
        if(record["group_speak"]) {
            field = record["group_speak"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+ field.display +"</h4>";
            html += "<h5>"+ tek.dataUtility.stringToHTML(field.show || '') +"</h5>";
            html += "</div>";
            html += "</div>";
        }
        /*阅读属性*/
        if(record["group_listen"]) {
            field = record["group_listen"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+ field.display +"</h4>";
            html += "<h5>"+ tek.dataUtility.stringToHTML(field.show || '') +"</h5>";
            html += "</div>";
            html += "</div>";
        }
        /*加入小组属性*/
        if(record["group_join"]) {
            field = record["group_join"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+ field.display +"</h4>";
            html += "<h5>"+ tek.dataUtility.stringToHTML(field.show || '') +"</h5>";
            html += "</div>";
            html += "</div>";
        }
        /*更新时间*/
        if(record["modifyTime"]){
            field = record["modifyTime"];
            html += "<div class='col-md-4 col-sm-4 col-xs-4 col-pad'>";
            html += "<div class='ui-item'>";
            html += "<h4>"+ field.display +"</h4>";
            html += "<h5>"+ tek.dataUtility.stringToHTML(field.show || '') +"</h5>";
            html += "</div>";
            html += "</div>";
        }


        html += "</div>";
        html += "</div>";
        html += "</div>";
        html += "<div class='ui-social'>";
        if (tek.right.isCanWrite(parseInt(right))){
            html += "<a href='edit.html?group_id=";
            html += record.id;
            html += "&show-close=1&refresh-opener=1' target='_blank' class='ui-tooltip' data-toggle='tooltip' data-placement='top' title='编辑'><i class='fa fa-pencil bg-lblue'></i></a>";
        }
        /*if(tek.right.isCanRead(parseInt(right))){
             html += "<a href='javascript:;' onclick='readInfo(\"";
            html += record.id;
            html += "\")' class='ui-tooltip' data-toggle='tooltip' data-placement='top' title='查看'><i class='fa fa-file bg-lblue'></i></a>";
        }*/
        if(tek.right.isCanDelete(parseInt(right))){
            html += "<a href='javascript:;' onclick='removeInfo(\"";
            html += record.id;
            html += "\")' class='ui-tooltip' data-toggle='tooltip' data-placement='top' title='删除'>";
            html += "<i class='fa fa-trash-o bg-lblue'></i></a>";
        }
        
        html += "</div>";
        html += "</div>";

        var target = document.getElementById("list");
        if (target)
            target.insertAdjacentHTML('BeforeEnd', html);
    }
}

/*读取小组*/
function readInfo(group_id){
    var url = tek.common.getRootPath()+"http/takall/group/read.html?group_id="+group_id;
    window.open(url,"_blank");
}

/*删除小组*/
function removeInfo(group_id){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var remove = window.confirm("确定删除小组?");
    if (!remove)
        return;

    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var setting = {operateType: "删除小组"};
    var sendData = {
        objectName: "Group",
        action: "removeInfo",
        group_id: group_id
    }

    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "小组删除成功!");
            getGroupList();
        },
        error: function (data, message) {
            tek.macCommon.waitDialogShow(null, message);
        },
        complete: function () {
            tek.macCommon.waitDialogHide(1500);
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取主题公告信息
function getSubjectList(){
	var ajaxURL = tek.common.getRootPath() + "servlet/tobject";
	var setting = {operateType: "获取主题信息"};
	var params = {};
	params["objectName"] = "Subject";
	params["action"] = "getList";
	params["skip"] = 0;
	params["order"] = "createTime";
	params["desc"] = 1;
	params["count"] = 5;
	params["subject_type"] = 4;
	
	
	var callback = {
		beforeSend: function(){
			$("#subject_notice").append("<div id='waiting-img' class='col-md-12 text-center col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />正在加载数据...</div>");
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
						showSubjectInfo(record[i]);
					}
				}else{
					$("#subject_notice").html("<div class='col-md-12 col-sm-12 center'>没有主题信息！</div>");
				}
			}
		},
		error: function(data, errorMsg){
			$("#subject_notice").html(errorMsg);
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
}

//显示主题信息
function showSubjectInfo(record){
	if(!record){
		return ;
	}
	var html = "";
	var field;
	html += '<div class="item">'
		+ '<h3><a href="' + tek.common.getRootPath() + 'http/takall/subject/read-notice.html?subject_id=' + record.id + '" target="_blank">' + record.name + '</a></h3>'
		+ '<div class="meta">';
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
	
	var target = document.getElementById("subject_notice");
	if(target){
		target.insertAdjacentHTML("BeforeEnd",html);
	}
}



