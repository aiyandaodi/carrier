// JavaScript Document

var SUBJECT_RIGHT = 0; //主题权限
var SUBJECT_GROUP=0;  //主题所属小组
var SUBJECT_TYPE;	//主题类型
var SUBJECT_OWNER; //问答拥有者

var isEdit = true;	//主题是否可编辑
var subjectId;
var request = tek.common.getRequest();
var TOTAL; //文档总数
var SKIP = 0; //数据条数
var COUNT = 5; //每页显示条数
var IMGSRC = '';
var NUM = 1;
//相关主题栏配置
var SAME_SUBJECT_COUNT = 5;	//显示主题数
var isShowSameSubject = false; //是否已经读取相关主题

//读取信息
function readSubject(){
	if(!subjectId){
		return showError("主题未找到");
	}
	
	var setting = {operateType: "读取主题信息"};
	var sendData = {
		objectName: 'Subject',
		action: 'readInfo',
		subject_id: subjectId,
		icon: 1,
		"field-detail": 1,
		blob: 1
	};
	var callback = {
		beforeSend: function(){
			showWaitingImg(true); //显示等待加载
		},
		success: function(data){
			//获取当前主题的权限
			SUBJECT_RIGHT = parseInt(data.right);
			
			if(isEdit && tek.right.isCanWrite(SUBJECT_RIGHT)){
				$("#editBtn").removeClass('hide');
				$('#change-subject-status').removeClass('hide');
			}else{
				isEdit = false;
			}
			
			var record = data["record"];
			var name = record["name"];
			if(record){
				record = !record.length ? record: record[0];
				
				//设置页面标题
				document.title = record.name;
				
				//保存主题信息到全局变量
				saveSubjectInfo2Parameter(record);
				
				//显示主题信息
				showSubjectInfo(record);
				
                //相册页面读取相册
                if(request['subject_type'] == 2){
                    readImageDocument();
                }
				//回答列表
				readHtmlDocument();
               
				//获取回复列表
                // getListReply();
			}else{
				showError("记录不存在");
			}
		},
		error: function(data, errorMsg){
			showError(errorMsg);
		},
		complete: function(){
			 //管理员 或 主题拥有者不能参与赞成或反对
            if (mySecurity >= 0x20 || (SUBJECT_OWNER && SUBJECT_OWNER.value == myId)) {
                $("#subject_recommended_em").parents("a").removeAttr("onclick");
                $("#subject_anti_em").parents("a").removeAttr("onclick");
            }//end if(...)

            readSubjectAppend();
		    $(window).scroll(function () {
		        readSubjectAppend();
		    });
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	
}

//保存主题信息到全局变量
function saveSubjectInfo2Parameter(record){
	if(!record){
		return;
	}
	//保存作者
	if(record.subject_author){
		SUBJECT_AUTHOR = {"show": tek.dataUtility.stringToHTML(record.subject_author.show), "value": tek.dataUtility.stringToHTML(record.subject_author.value)}
	}
	//保存主题名称
	if(record.name){
		SUBJECT_NAME = record.name;
	}
	//保存小组标识
	if(record.subject_group){
		SUBJECT_GROUP = tek.dataUtility.stringToHTML(record.subject_group.value);
	}
	//保存主题状态
	if(record.subject_status){
		SUBJECT_STATUS = parseInt(record.subject_status.value);
	}
	//保存主题类型
	if(record.subject_type){
		SUBJECT_TYPE = record.subject_type.show;
	}
	//保存主题目录
	if(record.subject_catalog){
		SUBJECT_CATALOG = tek.dataUtility.stringToHTML(record.subject_catalog.show);
	}
	//保存主题标签
	if(record.subject_tags){
		SUBJECT_TAGS = tek.dataUtility.stringToHTML(record.subject_tags.show);
	}
	//保存内容摘要
	if (record.subject_summary) {
		 SUBJECT_SUMMARY = record.subject_summary.show;
		
    }
	
	//保存主题拥有者
	if(record.subject_owner){
		SUBJECT_OWNER = {"show": tek.dataUtility.stringToHTML(record.subject_owner.show), "value": tek.dataUtility.stringToHTML(record.subject_owner.value)}
		
		if(SUBJECT_OWNER.value == myId){
			$("#commitBtn").html("补充提交");
			
		}

        getProfileInfo(SUBJECT_OWNER.value);
        if(SUBJECT_OWNER.value == myId){
            $("#is_friend").addClass('hide');
        }else{
            getFriendList(SUBJECT_OWNER.value, SUBJECT_OWNER.show);
            getIsFriendList(SUBJECT_OWNER.value);
        }
        
	}
	
	//参与人数
    if (record.subject_participate) {
        $("#subject_participate_em").html(record.subject_participate.show);
    } else {
        $("#subject_participate_em").empty();
    }

    //访问量次数
    if (record.accessCount) {
        $("#subject_access_count_em").html(tek.dataUtility.stringToHTML(record.accessCount.show));
    } else {
        $("#subject_access_count_em").empty();
    }

    //推荐人数
    if (record.subject_recommended) {
        $("#subject_recommended_em").html(record.subject_recommended.show);
        tuijian_number = record.subject_recommended.show;		//保存推荐人数
    } else {
        $("#subject_recommended_em").empty();
    }

    //反对人数
    if (record.subject_anti) {
        $("#subject_anti_em").html(record.subject_anti.show);
        fandui_number = record.subject_anti.show;			//保存反对人数
    } else {
        $("#subject_anti_em").empty();
    }
}


//相关主题
function readSubjectAppend() {
    if (!isShowSameSubject) {
        if (tek.common.isShowArea("same-subject")) {
            isShowSameSubject = true;
            //相关主题栏 装入内容
            showSameSujectContent();
        }
    }

    
}

//显示相关主题栏内容
function showSameSujectContent(){
    //获取相关的主题
    getSameTagsSubjectList();
}

//获取相关的主题
function getSameTagsSubjectList(){
    var target = document.getElementById("same-subject");
    if(!target){
        return ;
    }
    var setting = {operateType: "获取相关主题"};
    var sendData = {
        objectName: "Subject",
        action: 'getList',
        subject_status: 1,
        subject_group: SUBJECT_GROUP || "",
        order: "createTime",
        count: SAME_SUBJECT_COUNT,  //要显示相关主题条数
        skip: 0,
        desc: 1
    };
    if(SUBJECT_TYPE == '问答'){
        sendData['subject_type'] = 1;
       var url = tek.common.getRootPath() + 'http/takall/subject/read-qa.html';
    }else if(SUBJECT_TYPE == '影集'){
        sendData['subject_type'] = 2;
       var url = tek.common.getRootPath() + 'http/takall/subject/read-photos.html';
    }else if(SUBJECT_TYPE == '百科'){
        sendData['subject_type'] = 3;
       var url = tek.common.getRootPath() + 'http/takall/subject/read-wiki.html';
    }else if(SUBJECT_TYPE == '公告'){
        sendData['subject_type'] = 4;
      var  url = tek.common.getRootPath() + 'http/takall/subject/read-notice.html';
    }
    
    
    var callback = {
        beforeSend: function(){
            // target.className = "subject-li-none";
            target.innerHTML = "<p class='text-center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />请稍等...</p>";
        },
        success: function (data) {
            target.innerHTML = "";
            var record = data["record"];
            if (record) {
                record = !record.length ? [record] : record;
                var count = 0;
                for(var i in record){
                	if(record[i].id != subjectId){
                		//显示文件内容
                    	showRightWideSubjectListInfo(record[i], target, url);
                    	count++;
                	}
                    
                    
                    //保存当前显示的文档的id，用于显示回复
                    //current_document_id = record.id || "";
                    
                }
                $("#documents_counts").html(count);
            } else {
                target.innerHTML = "<div class='loading center text-muted'>没有数据！</div>";
            }
        },
        error: function (data, errorMsg) {
            target.innerHTML = "";
            showError(errorMsg);
        },
        complete: function () {
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示右侧 相关主题、推荐主题 列表信息
function showRightWideSubjectListInfo(record, target, url) {
    if (record) {
        var html = '<div class="blog-author well">'
                + '<div class="blog-author-img">'
                + '<a href="#"><img alt="" class="img-responsive img-thumbnail" id="icon-' + record.id + '" /></a>'
                + '</div>'
                + '<div class="blog-author-content">'
                + '<h5><a target="_blank" href="' + url + '?subject_id=' + record.id + '&subject_type='+ record.subject_type.value +'">'
                + (record.subject_author ? tek.dataUtility.stringToHTML(record.subject_author.show) + " : " : "") 
                +' <span>' + tek.dataUtility.stringToHTML(record.name) + '</span></a></h5>'

                + '<p>';
        if (record.subject_summary) {
            var summary = tek.dataUtility.stringToHTML(record.subject_summary.show);
            summary = tek.dataUtility.stringToHTML(summary).replace(/ (?! )/gi, " ").replace(/  /gi, "  ");
            html += (summary && summary.length > 100) ? summary.substring(0, 97) + " . . ." : summary;
        }
        html += '</p></div>'
            + '<div class="clearfix"></div>'
            + '</div>';

        if (target){
            target.insertAdjacentHTML('BeforeEnd', html);
        }

       readUser(record.subject_owner.value, "#icon-"+record.id );
    }
}