// JavaScript Document
//=====================================================Parameter==============================
var group_id;
var SKIP = 0;					//列表起始值
var COUNT = 5;					//每页显示的个数
var TOTAL = 0;					//小组数
var ICON;   //用户头像
var isFirst = true;
//=====================================================Function===============================
function init(){
    if(request["group_id"] && request["group_id"] != null)
        group_id = request["group_id"];

    if (group_id) {
        readGroupInfo(group_id);
        //获取组员列表
        getMembers();
        //获取主题列表
        getSubjects();
        //获取题库列表
        getLibrarys();
        //获取考试列表
        getTests();
		//获取问答列表
		getQuestions();

        $("#moreA").attr('href','../member/index.html?group_id='+group_id);
    } else {
        tek.macCommon.waitDialogShow(null, "没有传入要读取小组ID")
    }
    
}
/*---------------------------------------------- subject start ---------------------------------*/
/*新建主题*/
function addSubject(){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var url = tek.common.getRootPath()+"http/takall/subject/add-type.html?group_id="+group_id+"&show-close=1&refresh-opener=1";
    window.open(url,"_blank");
}

/* 读取主题信息 */
function getSubjects(){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    } 
    var setting = {operateType: "获取主题列表"};
    var sendData = {
        objectName: "Subject",
        action: "getList",
        group_id:group_id,
        count: COUNT,
        skip: SKIP
    };

    var callback = {
        beforeSend: function () {
            $("#subject_content").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            if (tek.right.isCanCreate(parseInt(data.right))){
                $("#subject-add-btn").removeClass("hidden");
                $("#subject-add-btn").attr("onClick","addSubject()");
            }
            if(tek.right.isCanRead(parseInt(data.right))||
               tek.right.isCanWrite(parseInt(data.right))||
               tek.right.isCanDelete(parseInt(data.right))){
                $("#subject-opera").removeClass("hidden");
            }
            TOTAL = parseInt(data.value);   //保存总数
            //显示【下一页】按钮
            if (TOTAL > COUNT)
                $("#more_page").removeClass("hidden");
            
            var record = data["record"];
            if (record) {
                $("#subject_content").html("");
                record = !record.length ? [record] : record;
                for (var i in record){
                    showSubjectInfo(record[i],data.right);
                }
                    
            } else {
                $("#subject_content").html("<div class='col-md-12 col-sm-12 center'>没有小组信息！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#subject_content").html(errorMsg);
        },
        complete: function () {
            //显示分页
            tek.turnPage.show("subjectPage", SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

}

/*显示主题信息*/
function showSubjectInfo(record, right){
   
    if(record){
        var html = "";
        var field;
        if(record.subject_type){
            var show = record.subject_type.show || '';

            html += "<tr onclick=trReadSubject('"+ record.id +"','" + show + "')>";
        }
        var items = new Array("subject_owner","subject_name", "subject_start", "subject_type");

        for(var i in items){
            var item = items[i];
            html += "<td>";
            if(record[item]){
                field = record[item];
                html += tek.dataUtility.stringToHTML(field.show || "");
            }
            html += "</td>";
        }
        html += "<td>";
        /*if(tek.right.isCanRead(parseInt(right))){
            html += "<a class='btn btn-xs btn-default' target='_blank' title='查看' href='";
            html += tek.common.getRootPath();
            html += "http/takall/subject/read-qa.html?subject_id=";
            html += record.id;
            html += "&show-close=1&refresh-opener=1'>";
            html += "<i class='fa fa-check'></i></a>";
        }*/
        if(tek.right.isCanWrite(parseInt(right)) && record.subject_type.show != '问答'){
            /*html += "<a class='btn btn-xs btn-default' target='_blank' title='编辑' href='";
            html += tek.common.getRootPath();
            html += "http/ican/library/edit.html?exams_library_id=";
            html += record.id;
            html += "&show-close=1&refresh-opener=1'>";
            html += "<i class='fa fa-pencil'></i></a>";*/
            html += "<a class='btn btn-xs btn-default editA" + record.id + "'  href='javascript:;' style='padding: 1px 7px;' title='编辑'>";
            
            html += "<i class='fa fa-pencil'></i></a>";
        }

        if(tek.right.isCanWrite(parseInt(right))){
            /*html += "<a class='btn btn-xs btn-default bindA' href='javascript:;' style='padding: 1px 7px;' title='删除' onclick='removeSuQuestionInfo(\"";
            html += record.id;
            html += "\")'>";*/
            html += "<a class='btn btn-xs btn-default bindA" + record.id + "'  href='javascript:;' style='padding: 1px 7px;' title='删除'>";
            
            html += "<i class='fa fa-times'></i></a>";
        }
        html += "</td>";

        html += "</tr>";

        var target = document.getElementById("subject_content");
        if(target){
            target.insertAdjacentHTML("BeforeEnd",html);
        }

        $(".bindA"+record.id).on("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            removeSubjectInfo(record.id);
        })
        $(".editA"+record.id).on("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            editSubjectInfo(record.id);
        })
            
    }
}
/*读取主题信息*/
function trReadSubject(subject_id, subjectType){
    if(subjectType == '问答'){
        var url = tek.common.getRootPath() + "http/takall/subject/read-qa.html?subject_id=" + subject_id;
    }else if(subjectType == '影集'){
        var url = tek.common.getRootPath() + "http/takall/subject/read-photos.html?subject_type=2&subject_id=" + subject_id;
    }else if(subjectType == '百科'){
        var url = tek.common.getRootPath() + "http/takall/subject/read-wiki.html?subject_id=" + subject_id;
    }else if(subjectType == '公告'){
        var url = tek.common.getRootPath() + "http/takall/subject/read-notice.html?subject_id=" + subject_id;
    }
    

    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}
/*编辑主题信息*/
function editSubjectInfo(subject_id){
    var url = tek.common.getRootPath() + "http/takall/subject/edit.html?subject_id=" + subject_id;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}
/*删除主题*/
function removeSubjectInfo(id){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var remove = window.confirm("确定删除主题?");
    if (!remove)
        return;

    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var setting = {operateType: "删除主题"};
    var sendData = {
        objectName: "Subject",
        action: "removeInfo",
        subject_id: id
    }

    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "小组删除成功!");
            getSubjects();
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
/*---------------------------------------------- subject end -----------------------------------*/
/*---------------------------------------------- group start -----------------------------------*/
/*读取小组信息*/
function readGroupInfo(group_id){
    var target = document.getElementById('group-info');
    if(!target)
        return;

    var setting = {operateType: "获取小组信息"};
    var sendData = {
        objectName: "Group",
        action: "readInfo",
        group_id:group_id,
        icon:1
    };

    var callback = {
        beforeSend: function () {
            $("#group-info").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            if (tek.right.isCanWrite(parseInt(data.right))){
                $("#group-edit-btn").removeClass("hidden");
                $("#group-edit-btn").attr("onClick","editInfo()");
            }
            if(tek.right.isCanDelete(parseInt(data.right))) {
                $("#group-remove-btn").removeClass("hidden");
                $("#group-remove-btn").attr("onClick","removeInfo()");
            }

            var record = data["record"];
            if (record) {
                $("#group-info").html("");
                //显示小组信息
                showGroupInfo(record);
            } else {
                $("#group-info").html("<div class='col-md-12 col-sm-12 center'>没有小组信息！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#group-info").html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

/*显示小组信息*/
function showGroupInfo(record){
    if (record) {
        var html = "";
        var field;
        var items = new Array("group_name","group_code", "group_owner", "group_speak", "group_listen",  "group_member_memberright", "createTime","modifyTime");

        $("#group-icon").attr("src", record.icon || '../../ican/person/images/penson.jpg');
        for (var i in items){
            var item = items[i];
            if(!item)
                break;

            if(record[item]){
                field = record[item];
                html += "<div class='col-md-3 col-sm-6 col-xs-6 col-mob col-pad'>";
                html += "<div class='ui-item'>";
                html += "<h4>"+field.display+"</h4>";
                html += "<h5>"+tek.dataUtility.stringToHTML(field.show || '')+"</h5>";
                html += "</div>";
                html += "</div>";
            }
        }

        html += "<div class='clearfix'></div>";
        html += "<hr/>";
        if(record.group_remark){
            field = record.group_remark;
            html += "<p>" + tek.dataUtility.stringToHTML(field.show || '') + "</p>";
        }
        

        var target = document.getElementById("group-info");
        if (target)
            target.insertAdjacentHTML('BeforeEnd', html);
    }
}

/*编辑小组*/
function editInfo(){
    var url = tek.common.getRootPath()+"http/takall/group/edit.html?group_id="+group_id+"&show-close=1&refresh-opener=1";
    window.open(url,"_blank");
}

/*删除小组*/
function removeInfo(){
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

/*---------------------------------------------- group end -----------------------------------*/
/*---------------------------------------------- member start --------------------------------*/
/*新建组员*/
function addMember(){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var url = tek.common.getRootPath()+"http/takall/member/add.html?group_id="+group_id+"&show-close=1&refresh-opener=1";
    window.open(url,"_blank");
}

/*取得组员列表*/
function getMembers(){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var setting = {operateType: "获取小组列表"};
    var sendData = {
        objectName: "Member",
        action: "getList",
        group_id:group_id,
		count: COUNT,
		skip: SKIP
    };

    var callback = {
        beforeSend: function () {
            $("#member-list").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            if (tek.right.isCanCreate(parseInt(data.right))){
                $("#member-add-btn").removeClass("hidden");
                $("#member-add-btn").attr("onClick","addMember()");
            }
            if(tek.right.isCanWrite(parseInt(data.right)) || tek.right.isCanDelete(parseInt(data.right))){
                $("#member-opera").removeClass("hidden");
            }
			TOTAL = parseInt(data.value);	//保存总数
			//显示【下一页】按钮
			if (TOTAL > COUNT)
				$("#more_page").removeClass("hidden");
			
            var record = data["record"];
            if (record) {
                $("#member-list").html("");
                record = !record.length ? [record] : record;
                for (var i in record){
                    showMemberInfo(record[i],data.right);
                    if(isFirst){

                        showRightMemberInfo(record[i]);
                    }
                }
                isFirst = false;    

                
            } else {
                $("#member-list").html("<div class='col-md-12 col-sm-12 center'>没有小组信息！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#member-list").html(errorMsg);
        },
		complete: function () {
			//显示分页
            tek.turnPage.show("members", SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
		}
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

/*显示小组信息*/
function showMemberInfo(record,right){
    if(record){
        var html = "";
        var field;

        html += "<tr onclick=trReadMember('"+ record.id +"')>";
        var items = new Array("member_name","member_mobile","member_email","member_member_right","member_status");
        for (var i in items){
            var item = items[i];
            html += "<td>";
            if(record[item]){
                field = record[item];
                html += tek.dataUtility.stringToHTML(field.show ||'');
            }
            html += "</td>";
        }

        html += "<td>";

        if(tek.right.isCanWrite(parseInt(right))){
            
            html += "<a class='btn btn-xs btn-default editA" + record.id + "'  href='javascript:;' style='padding: 1px 7px;' title='编辑'>";
            html += "<i class='fa fa-pencil'></i></a>";
        }

        if(tek.right.isCanWrite(parseInt(right))){
            
            html += "<a class='btn btn-xs btn-default bindA" + record.id + "'  href='javascript:;' style='padding: 1px 7px;' title='删除'>";
            html += "<i class='fa fa-times'></i></a>";
        }

        html += "</td>";
        html += "</tr>";

        var target = document.getElementById("member-list");
        if(target){
            target.insertAdjacentHTML("BeforeEnd",html);
        }

        $(".bindA"+record.id).on("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            removeMemberInfo(record.id);
        })
        $(".editA"+record.id).on("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            editMemberInfo(record.id);
        })
		
		$("#memberIndex").attr("href",tek.common.getRootPath() + "http/takall/member/index.html?group_id=" + group_id);
    }
}
/*读取组员信息*/
function trReadMember(member_id){
    var url = tek.common.getRootPath() + "http/takall/member/read.html?member_id=" + member_id;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}
/*编辑组员信息*/
function editMemberInfo(member_id){
    var url = tek.common.getRootPath() + "http/takall/member/edit.html?member_id=" + member_id;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}

/*删除组员*/
function removeMemberInfo(member_id){
    if(!member_id){
        tek.macCommon.waitDialogShow(null, "未找到组员标识", 1500 ,0);
        return;
    }

    var remove = window.confirm("确定删除组员?");
    if (!remove)
        return;

    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var setting = {operateType: "删除组员"};
    var sendData = {
        objectName: "Member",
        action: "removeInfo",
        member_id: member_id
    }

    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "组员删除成功!");
            getMembers();
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

/*右侧组员信息显示*/
function showRightMemberInfo(record){
    if(record){
        var html = "";
        var field;
        html += '<div class="chat-member">';
        html += '<div class="img-container">';
        html += ' <a target="_blank" href="../member/read.html?member_id='+ record.id +'&show-close=1&refresh-opener=1">';
        if(record.member_user){
            field = record.member_user;
            readUser(field.value);
        }
        html += '<img class="mg-responsive" src="' + (ICON || '../../ican/person/images/penson.jpg') + '" alt="" />';
        html += '</a>';
        html += '</div>';
        if(record['member_name']){
            field = record['member_name'];
            html += '<h4><a target="_blank" href="../member/read.html?member_id='+ record.id +'&show-close=1&refresh-opener=1">' + tek.dataUtility.stringToHTML(field.show ||'') + '</a></h4>';
        }
        if(record['member_credit']){
            field = record['member_credit'];
            html += '<p>' + tek.dataUtility.stringToHTML(field.display ||'') + '：' + tek.dataUtility.stringToHTML(field.show ||'') + '</p>';
        }
        if(record['member_latest']){
            field = record['member_latest'];
            html += '<p>' + tek.dataUtility.stringToHTML(field.display ||'') + '：' + tek.dataUtility.stringToHTML(field.show ||'') + '</p>';
        }
        html += '<div class="clearfix"></div>';
        html += '</div>';
        var target = document.getElementById("chat-contact");
        if(target){
            target.innerHTML += html;
        }
    }
}
//获取用户信息
function readUser(id){
    var setting = {async:false, operateType: "读取用户信息"};
    var sendData = {
        objectName: "User",
        action: "readInfo",
        user_id: id,
        icon: 1
    };
    var callback = {
        success: function (data) {
            var record = data["record"];

            if (record) {
                record = !!record.length ? record[0] : record;
                if(record.icon){
                    ICON = record.icon
                }else{
                    ICON = '';
                }
                
            } 
        },
        error: function (data, errorMsg) {
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

/*---------------------------------------------- member end ----------------------------------*/

/*-----------------------------------------------question start ------------------------------*/
/*取得问答列表*/
function getQuestions(){
	if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }
	
	var setting = {operateType: "获取题库列表"};
    var sendData = {
        objectName: "Subject",
        action: "getList",
        group_id:group_id,
		count: COUNT,
		skip: SKIP,
		subject_type: 1
    };
	var callback = {
        beforeSend: function () {
            $("#question_list").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            if (tek.right.isCanCreate(parseInt(data.right))){
                $("#question-add-btn").removeClass("hidden");
                $("#question-add-btn").attr("onClick","addQuestion()");
            }
            if(tek.right.isCanRead(parseInt(data.right))||
                tek.right.isCanWrite(parseInt(data.right))||
                tek.right.isCanDelete(parseInt(data.right))){
                $("#question-opera").removeClass("hidden");
            }
			
			TOTAL = parseInt(data.value);	//保存总数
			//显示【下一页】按钮
			if (TOTAL > COUNT)
				$("#more_page").removeClass("hidden");
			
            var record = data["record"];
            if (record) {
                $("#question_list").html("");
                record = !record.length ? [record] : record;
                for (var i in record){
                    showQuestionInfo(record[i],data.right);
				}
            } else {
                $("#question_list").html("<div class='col-md-12 col-sm-12 center'>没有问答信息！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#question_list").html(errorMsg);
        },
		complete: function () {
			//显示分页
			tek.turnPage.show("questionPage", SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
		}
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
/*显示问答*/
function showQuestionInfo(record, right){
	if(record){
		var html = "";
		var field;
		html += "<tr onclick=trReadQuestion('"+ record.id +"')>";
		var items = new Array("subject_author","subject_name","subject_status","subject_date");
		for(var i in items){
			var item = items[i];
			html += "<td>";
			if(record[item]){
				field = record[item];
				html += tek.dataUtility.stringToHTML(field.show || "");
			}
			html += "</td>";
		}
		html += "<td>";
		
        if(tek.right.isCanWrite(parseInt(right))){
            
            html += "<a class='btn btn-xs btn-default bindA" + record.id + "'  href='javascript:;' style='padding: 1px 7px;' title='删除'>";
            
            html += "<i class='fa fa-times'></i></a>";
        }
		html += "</td>";

        html += "</tr>";

        var target = document.getElementById("question_list");
        if(target){
			target.insertAdjacentHTML("BeforeEnd",html);
		}

        $(".bindA"+record.id).on("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            removeSuQuestionInfo(record.id);
        })
            
	}

    
}
/*新建问答*/
function addQuestion(){
	if(!group_id){
		tek.macCommon.waitDialogShow(nul, "未找到小组表标识", 1500, 0);
		return;
	}
	
	var url = tek.common.getRootPath() + "http/takall/subject/add-qa.html?group_id=" + group_id;
	url += '&subject_type=1&show-close=1&refresh-opener=1&refresh-opener-func=refreshSubject';
	window.open(url);
}
/*读取问答信息*/
function trReadQuestion(subject_id){
    var url = tek.common.getRootPath() + "http/takall/subject/read-qa.html?subject_id=" + subject_id;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}

/*删除问答*/
function removeSuQuestionInfo(subject_id){
	if(!subject_id){
		tek.macCommon.waitDialogShow(null, "未找到问题标识", 1500, 0);
		return;
	}
	
	var remove = window.confirm("确定删除问题？");
	if(!remove){
		return ;
	}
	var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16' /> &nbsp; 正在珊瑚...";
	tek.macCommon.waitDialogShow(null, html, null, 2);
	
	var setting = {operateType: "删除问答？"};
	var sendData = {
		objectName: "Subject",
		action: "removeInfo",
		subject_type: 1,
		subject_id: subject_id
	}
	var callback = {
		success: function(data){
			tek.macCommon.waitDialogShow(null, "问答删除成功");
			getQuestions();
		},
		error: function(data, message){
			tek.macCommon.waitDialogShow(null, message);
		},
		complete: function(){
			tek.macCommon.waitDialogHide(1500);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

/*-----------------------------------------------question end---------------------------------*/
/*---------------------------------------------- library start -------------------------------*/
/*新建题库*/
function addLibrary(){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var url = tek.common.getRootPath()+"http/ican/library/add.html?group_id="+group_id+"&show-close=1&refresh-opener=1";
    window.open(url,"_blank");
}

/*取得题库列表*/
function getLibrarys(){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var setting = {operateType: "获取题库列表"};
    var sendData = {
        objectName: "ExamsLibrary",
        action: "getList",
        group_id:group_id,
		count: COUNT,
		skip: SKIP
    };

    var callback = {
        beforeSend: function () {
            $("#library-list").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            if (tek.right.isCanCreate(parseInt(data.right))){
                $("#library-add-btn").removeClass("hidden");
                $("#library-add-btn").attr("onClick","addLibrary()");
            }
            if(tek.right.isCanRead(parseInt(data.right))||
                tek.right.isCanWrite(parseInt(data.right))||
                tek.right.isCanDelete(parseInt(data.right))){
                $("#library-opera").removeClass("hidden");
            }
			
			TOTAL = parseInt(data.value);	//保存总数
			//显示【下一页】按钮
			if (TOTAL > COUNT)
				$("#more_page").removeClass("hidden");
			
            var record = data["record"];
            if (record) {
                $("#library-list").html("");
                record = !record.length ? [record] : record;
                for (var i in record)
                    showLibraryInfo(record[i],data.right);
            } else {
                $("#library-list").html("<div class='col-md-12 col-sm-12 center'>没有小组信息！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#library-list").html(errorMsg);
        },
		complete: function () {
			//显示分页
			tek.turnPage.show("library", SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
		}
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

/*显示题库*/
function showLibraryInfo(record,right){
    if(record){
        var html = "";
        var field;

        html += "<tr onclick=trReadLibrary('"+ record.id +"')>";
        var items = new Array("exams_library_name","exams_library_grade","exams_library_group","exams_library_end");
        for (var i in items){
            var item = items[i];
            html += "<td>";
            if(record[item]){
                field = record[item];
                html += tek.dataUtility.stringToHTML(field.show ||'');
            }
            html += "</td>";
        }

        html += "<td>";
        
        if(tek.right.isCanWrite(parseInt(right))){
            
            html += "<a class='btn btn-xs btn-default editA" + record.id + "'  href='javascript:;' style='padding: 1px 7px;' title='编辑'>";
            html += "<i class='fa fa-pencil'></i></a>";
        }

        if(tek.right.isCanWrite(parseInt(right))){
            
            html += "<a class='btn btn-xs btn-default bindA" + record.id + "'  href='javascript:;' style='padding: 1px 7px;' title='删除'>";
            html += "<i class='fa fa-times'></i></a>";
        }

        html += "</td>";
        html += "</tr>";

        var target = document.getElementById("library-list");
        if(target){
            target.insertAdjacentHTML("BeforeEnd",html);
        }

        $(".bindA"+record.id).on("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            removeLibraryInfo(record.id);
        })
        $(".editA"+record.id).on("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            editLibraryInfo(record.id);
        })
    }

}
/*读取题库信息*/
function trReadLibrary(exams_library_id){
    var url = tek.common.getRootPath() + "http/ican/library/read.html?exams_library_id=" + exams_library_id;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}
/*编辑题库信息*/
function editLibraryInfo(exams_library_id){
    var url = tek.common.getRootPath() + "http/ican/library/edit.html?exams_library_id=" + exams_library_id;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}
/*删除题库*/
function removeLibraryInfo(exams_library_id){
    if(!exams_library_id){
        tek.macCommon.waitDialogShow(null, "未找到题库标识", 1500 ,0);
        return;
    }

    var remove = window.confirm("确定删除题库?");
    if (!remove)
        return;

    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var setting = {operateType: "删除题库"};
    var sendData = {
        objectName: "ExamsLibrary",
        action: "removeInfo",
        exams_library_id: exams_library_id
    }

    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "组员删除成功!");
            getLibrarys();
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
/*---------------------------------------------- library end ---------------------------------*/
/*---------------------------------------------- test start -------------------------------*/
/*新建考试*/
function addTest(){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var url = tek.common.getRootPath()+"http/ican/test/add.html?group_id="+group_id+"&show-close=1&refresh-opener=1";
    window.open(url,"_blank");
}

/*取得考试列表*/
function getTests(){
    if(!group_id){
        tek.macCommon.waitDialogShow(null, "未找到小组表标识", 1500 ,0);
        return;
    }

    var setting = {operateType: "获取考试列表"};
    var sendData = {
        objectName: "ExamsTest",
        action: "getList",
        group_id:group_id,
		count: COUNT,
		skip: SKIP
    };

    var callback = {
        beforeSend: function () {
            $("#test-list").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            if (tek.right.isCanCreate(parseInt(data.right))){
                $("#test-add-btn").removeClass("hidden");
                $("#test-add-btn").attr("onClick","addTest()");
            }
			/*if(tek.user.isNormal(mySecurity)&&(tek.role.isAuditor(myRole)||tek.role.isCustomerService(myRole))){
				$("#test-add-btn").removeClass("hidden");
                $("#test-add-btn").attr("onClick","addTest()");
			}*/
            if(tek.right.isCanRead(parseInt(data.right))||
                tek.right.isCanWrite(parseInt(data.right))||
                tek.right.isCanDelete(parseInt(data.right))){
                $("#test-opera").removeClass("hidden");
            }
			TOTAL = parseInt(data.value);	//保存总数
			//显示【下一页】按钮
			if (TOTAL > COUNT)
				$("#more_page").removeClass("hidden");
			
            var record = data["record"];
            if (record) {
                $("#test-list").html("");
                record = !record.length ? [record] : record;
                for (var i in record)
                    showTestInfo(record[i],data.right);
            } else {
                $("#test-list").html("<div class='col-md-12 col-sm-12 center'>没有小组信息！</div>");
            }
        },
        error: function (data, errorMsg) {
            $("#test-list").html(errorMsg);
        },
		complete: function(){
			tek.turnPage.show("test", SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
		}
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

/*显示考试*/
function showTestInfo(record,right){
    if(record){
        var html = "";
        var field;

        // html += "<tr>";
        html += "<tr onclick=trReadTest('"+ record.id +"')>";
        var items = new Array("exams_test_name","exams_test_grade");
        for (var i in items){
            var item = items[i];
            html += "<td>";
            if(record[item]){
                field = record[item];
                html += tek.dataUtility.stringToHTML(field.show ||'');
            }
            html += "</td>";
        }

        if(record["exams_test_duration"]){
            field = record["exams_test_duration"];
            var time = getTimeBySecond(field.value);
            html += "<td>";
            html += time;
            html += "</td>";
        }

        html += "<td>";
        if(record["exams_test_start"]||record["exams_test_end"]){
            html += tek.dataUtility.stringToHTML(record["exams_test_start"].show ||'');
			//html += "<br/>"
            html += "-";
		//	html += "<br/>"
            html += tek.dataUtility.stringToHTML(record["exams_test_end"].show ||'');
        }
        html += "</td>";

        html += "<td>";
        
        if(tek.right.isCanWrite(parseInt(right))){
            
            html += "<a class='btn btn-xs btn-default editA" + record.id + "'  href='javascript:;' style='padding: 1px 7px;' title='编辑'>";
            html += "<i class='fa fa-pencil'></i></a>";
        }

        if(tek.right.isCanWrite(parseInt(right))){
            
            html += "<a class='btn btn-xs btn-default bindA" + record.id + "'  href='javascript:;' style='padding: 1px 7px;' title='删除'>";
            html += "<i class='fa fa-times'></i></a>";
        }
        html += "</td>";

        html += "</tr>";

        var target = document.getElementById("test-list");
        if(target){
            target.insertAdjacentHTML("BeforeEnd",html);
        }

        $(".bindA"+record.id).on("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            removeTestInfo(record.id);
        })
        $(".editA"+record.id).on("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            editTestInfo(record.id);
        })
    }

}
/*读取考试信息*/
function trReadTest(exams_test_id){
    var url = tek.common.getRootPath() + "http/ican/test/read.html?exams_test_id=" + exams_test_id;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}
/* 编辑考试 */
function editTestInfo(exams_test_id){
    var url = tek.common.getRootPath() + "http/ican/test/edit.html?exams_test_id=" + exams_test_id;
    url += "&group_id=" + group_id;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}
/*删除考试*/
function removeTestInfo(exams_test_id){
    if(!exams_test_id){
        tek.macCommon.waitDialogShow(null, "未找到考试标识", 1500 ,0);
        return;
    }

    var remove = window.confirm("确定删除考试?");
    if (!remove)
        return;

    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var setting = {operateType: "删除考试"};
    var sendData = {
        objectName: "ExamsTest",
        action: "removeInfo",
        exams_test_id: exams_test_id
    }

    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "考试删除成功!");
            getTests();
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
/*---------------------------------------------- library end ---------------------------------*/
//转换时间
function getTimeBySecond(stringTime){
    if(!stringTime)
        return;

    var second = parseInt(stringTime);// 秒
    var minute = 0;// 分
    var hour = 0;// 小时
    // alert(theTime);
    if(second > 60) {
        minute = parseInt(second/60);
        second = parseInt(second%60);

        if(minute > 60) {
            hour = parseInt(minute/60);
            minute = parseInt(minute%60);
        }
    }

    var result = ""+parseInt(second)+"秒";

    if(minute > 0) {
        result = ""+parseInt(minute)+"分"+result;
    }
    if(hour > 0) {
        result = ""+parseInt(hour)+"小时"+result;
    }

    return result;
}
//翻页 turn-page.js必须实现方法
tek.turnPage.turn = function (eleId, skip) {
	skip = parseInt(skip);
	if (!isFinite(skip) || skip < 0)
		return;

	SKIP = skip;
	if(eleId == 'library'){
		getLibrarys();
	}else if(eleId == 'test'){
		getTests();
	}else if(eleId == 'members'){
		getMembers();
	}else if(eleId == 'questionPage'){
		getQuestions();
	}else if(eleId == 'subjectPage'){
        getSubjects();
    }
	
};
