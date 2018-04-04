//=====================================================Parameter==============================
//显示字段数组
var exams_library_id;

var selected=new Array();    //选中的对象标识
var allIds=new Array();    //当前页的所有对象标识
var skip;
var EVERY_ROW_SHOW = 5;	//每行显示的个数
var currentPage;
var totalPage;
var count=5;
var questionData={};
var isContinueLoad = false;		//是否可以继
var request = tek.common.getRequest();
//=====================================================Function===============================
function init(){
	tek.macList.ajaxURL = tek.common.getRootPath() + "servlet/tobject";
    if(request["exams_library_id"] && request["exams_library_id"] != null)
        exams_library_id = request["exams_library_id"];

    if (exams_library_id) {
        //editNew(exams_library_id);
        getLibrary();
        getQuestionList(0,2,"list");
    } else {
        tek.macCommon.waitDialogShow(null, "没有传入要题库ID")
    }

    $('.dropdown-toggle').dropdown();
}
/*---------------------------------------------- question start -------------------------------*/
/*编辑问题*/
function addQuestion(){
    var exams_question_type = $("#question-type").val();
    var url= tek.common.getRootPath()+
        "http/ican/question/add.html?exams_library_id="+
        exams_library_id+"&exams_question_type="+exams_question_type+"&show-close=1&refresh-opener=1";

    window.open(url, "_blank");
}

/*显示试题答案*/
function showAnswerList(question_id){
    if(!question_id)
        return;
    var id = "#question-"+question_id+"  .library-answer";
    var $answer = $(id);
    if($answer.is(":visible")){
        $answer.hide("slow");
    }else{
        $answer.show("slow");
    }
}
/*取得题库信息*/
function getLibrary(){
    var setting = {operateType: "获取题库信息"};
    var sendData = {
        objectName: "ExamsLibrary",
        action: "readInfo",
        exams_library_id:exams_library_id
    };

    var callback = {
        beforeSend:function(){
            $("#group-info").html("<div class='col-md-12 col-sm-12'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
        },
        success: function (data) {
            var record=data["record"];
            if (record) {
                //显示小组信息
                showLibraryInfo(record);
            }
			
			if(tek.right.isCanWrite(parseInt(data.right))){
                $("#group-edit-btn").removeClass("hidden");
            }
            if(tek.right.isCanDelete(parseInt(data.right))){
                $("#group-remove-btn").removeClass("hidden");
            }
        },
        error: function (data, message) {
            $("#group-info").html("<font color='red'>"+message+"</font>");
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
/*取得试题列表*/
function getQuestionList(skip,question_type,way){
    if(!exams_library_id){
        return;
    }

    if(question_type){
        exams_question_type = question_type;
    }

    selected=new Array();
    allIds=new Array();

    var $target = $("#question-list");
    if(!$target){
        return;
    }
   
    if(way=="list") {
        $target.html("");
    }

    var setting = {operateType: "获取问题列表"};
    var mydata = {
        objectName: "ExamsQuestion",
        action: "getList",
        exams_library_id: exams_library_id,
        exams_question_type:exams_question_type,
        skip: skip,
        order:"createTime",
        desc: 1
    };

    if(count){
        mydata["count"] = count;
    }
    
    var callback = {
        beforeSend: function () {
            $target.append("<li id='waiting-img' style='text-align:center;list-style:none;'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/></li>");
        },
        success: function (data) {
            $("#waiting-img").remove();
			
			if(tek.right.isCanDelete(parseInt(data.right))){
                $("#select_all").removeClass("hidden");
            }
            var record = data["record"];
            if(record){
                record = !record.length ? [record] : record;
                //显示问题列表
                for(var i in record){
                    showQuestion(record[i], data.right);
                }
                //显示分页
                showCustomListTurn(skip,data);

               // $(".library-question").removeClass("hidden");
                $("#tekinfo_footer").css("position","relative");
            }else{
                if(data.value==0){
                    $("#page-"+exams_question_type).html("");
                }
                $target.append("<li class='answer-data-message' style='text-align:center;list-style:none;'>没有数据！</li>");
                $("#page").addClass("hidden");
                $("#more_page_2").addClass("hidden");
                $(".library-question").addClass("hidden");
                $("#ajax-load-div").addClass("hidden");
            }//end if(record)
			
			
        },
        error: function (data, errorMsg) {
            $target.html("<li style='text-align:center;'>" + errorMsg + "</li>");
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, mydata, callback);
}

/*显示题库信息*/
function showLibraryInfo(record){
    if(record){
        var field;
        var html = '<div class="col-md-3 col-sm-6 col-xs-12 col-mob col-pad"><div class="ui-item"><h4>';
        field = record.exams_library_name;
        if(field && field.show){
            html += field.display || '';
            html += '</h4><h5>';
            html += field.show || '';

            $("#group-remove-btn").attr("onclick","removeInfo('"+ field.show +"')");
        }
        html += '</h5></div></div>';

        html += '<div class="col-md-3 col-sm-6 col-xs-12 col-mob col-pad"><div class="ui-item"><h4>';
        field = record.exams_library_grade;
        if(field && field.show){
            html += field.display || '';
            html += '</h4><h5>';
            html += (field.show || '') + '级';
        }
        html += '</h5></div></div>';

        html += '<div class="col-md-3 col-sm-6 col-xs-12 col-mob col-pad"><div class="ui-item"><h4>';
        field = record.exams_library_group;
        if(field && field.show){
            html += field.display || '';
            html += '</h4><h5>';
            html += field.show || '';
        }
        html += '</h5></div></div>';

        html += '<div class="col-md-3 col-sm-6 col-xs-12 col-mob col-pad"><div class="ui-item"><h4>';
        field = record.exams_library_read;
        if(field && field.show){
            html += field.display || '';
            html += '</h4><h5>';
            html += field.show || '';
        }
        html += '</h5></div></div>';

        html += '<div class="col-md-3 col-sm-6 col-xs-12 col-mob col-pad"><div class="ui-item"><h4>';
        field = record.exams_library_write;
        if(field && field.show){
            html += field.display || '';
            html += '</h4><h5>';
            html += field.show || '';
        }
        html += '</h5></div></div>';

        html += '<div class="col-md-3 col-sm-6 col-xs-12 col-mob col-pad"><div class="ui-item"><h4>';
        field = record.exams_question_end;
        if(field && field.show){
            html += field.display || '';
            html += '</h4><h5>';
            html += field.show || '';
        }
        html += '</h5></div></div>';

        $("#group-info").html(html);
    }

}
/*显示问题列表*/
function showQuestion(record, right){
    if(record){
        var field;
        var html = "<div class='col-md-12' id='question-";
        if(record.id){
            html += record.id;
        }
        html += "'>";

        html += "<div class='library-question'>";
        html += "<input id='select";
        if(record.id){
            html += record.id;
        }
        html += "' type='checkbox' value='";
        if(record.id){
            html += record.id;
        }
        html += "' onclick=\"tek.macList.sel(this, event)\">"+
        "<a href='javascript:void(0);' class='question-heading' onclick='showAnswerList(\"";
        if(record.id){
            html += record.id;
        }

        html += "\");'><span>";
        field = record.exams_question_name;
        if(field && field.show){
            html += field.show || "";
        }
        html += "</span>";
        field = record.exams_question_end;
        if(field && field.show){
            html += "<span style='color: rgb(92, 158, 145);'>(";
            html += field.display;
            html += ":";
            html += field.show || "";
            html += ")</span>";
        }
        html += "</a>";

        
        html += "<div class='btn-group pull-right'>";
        if(tek.right.isCanRead(parseInt(right))){
            html += "<button class='btn btn-xs btn-default' onclick='readQuestion(\"";
            if(record.id){
                html += record.id;
            }
            html += "\");'><i class='fa fa-check'></i></button>";
        }
        if(tek.right.isCanWrite(parseInt(right))){

            html += "<button class='btn btn-xs btn-default' onclick='editQuestion(\"";
            if(record.id){
                html += record.id;
            }
        }
        if(tek.right.isCanDelete(parseInt(right))){
            html += "\");'><i class='fa fa-pencil'></i> </button>"+
            "<button class='btn btn-xs btn-default' onclick='deleteQuestionInfo(\"";
            if(record.id){
                html += record.id;
            }
            html += "\",\"";
            field = record.exams_question_name;
            if(field && field.show){
                html += field.show || "";
            }
            html += "\")'><i class='fa fa-times'></i> </button>";
        }
        
        
        

        html += "</div>";
        html += "<div class='padd library-answer'>";
        html += "<div class='row' id='answer-list-";
        if(record.id)
            html += record.id;
        html +="'>"+
        "</div>"+
        "</div>"+
        "</div>"+
        "</div>";

        var target = document.getElementById("question-list");
        if (target)
            target.insertAdjacentHTML('BeforeEnd', html);

        //获取问题答案
        if(record.id){
            readAnswerList(record.id);
        }
    }
}

/*读取问题*/
function readQuestion(question_id){
    if(!question_id&&!exams_library_id)
        return;

    var url= tek.common.getRootPath()+
        "http/ican/question/read.html?exams_library_id="+
        exams_library_id+"&exams_question_id="+question_id;

    window.open(url, "_blank");
}

/*编辑问题*/
function editQuestion(question_id){
    if(!question_id&&!exams_library_id)
        return;

    var url= tek.common.getRootPath()+
        "http/ican/question/edit.html?exams_library_id="+
        exams_library_id+"&exams_question_id="+question_id+"&show-close=1&refresh-opener=1";

    window.open(url, "_blank");
}
/*删除问题*/
function deleteQuestionInfo(question_id, question_name){

	if(!question_id){
  		tek.macCommon.waitDialogShow(null, "未找到问题表标识", 1500 ,0);
  		return ;
  	}  
 
    var remove = window.confirm("确定删除试题?");
    if (!remove)
        return;

    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var setting = {operateType: "删除试题"};
    var sendData = {
        objectName: "ExamsQuestion",
        action: "removeInfo",
        exams_question_id: question_id
    }

    var callback = {
        success: function (data) {
            tek.macCommon.waitDialogShow(null, "试题删除成功!");
            var value = $("#question-type").val();
            getQuestionList(0, value, 'list');
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
//批量删除问题
function removeQuestionList(){
	var params = {
		objectName: "ExamsQuestion",
        action: "removeList"
	}
//	tek.macList.removeList(params);
	
	if (!tek.macList.ajaxURL || !params) {
		return tek.macCommon.waitDialogShow(null, "未指定URL或参数！");
	}
	
	if (!tek.macList.selected || tek.macList.selected.length <= 0) {
		return tek.macCommon.waitDialogShow(null, "没有选中待删除记录!");
	}

	var objectIds = "";
	var count = 0;
	for (var i = 0; i < tek.macList.selected.length; i++) {
		if (tek.macList.selected[i] && tek.macList.selected[i] > 0) {
			if (count > 0)
				objectIds += ";";
			objectIds += tek.macList.selected[i];
			count++;
		}
	}
	params["object-ids"] = objectIds;

	var remove = window.confirm("确定删除选中的" + count + "条信息？");
	if (!remove)
		return;

	var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting.gif' width='16'/> &nbsp;正在删除...";
	tek.macCommon.waitDialogShow(null, html, null, 2);

	var setting = {};//operateType: "批量删除选中的信息"};

	var callback = {
		success: function (data) {
			tek.macCommon.waitDialogShow(null, "试题删除成功!");
			var value = $("#question-type").val();
            getQuestionList(0, value, 'list');
		},
		error: function (data, message) {
			tek.macCommon.waitDialogShow(null, message);
		},
		complete: function () {
			tek.macCommon.waitDialogHide(1500);
		}
	};

	tek.common.ajax(tek.macList.ajaxURL, setting, params, callback);
	
	
}



/*编辑题库*/
function editInfo(){
    if(!exams_library_id){
        return ;
    }
    var url = 'edit.html?exams_library_id=' + exams_library_id;
    url += '&show-close=1&refresh-opener=1';
    window.open(url, "_blank");
}
/*删除题库*/
function removeInfo(name){
	if(!exams_library_id){
  		tek.macCommon.waitDialogShow(null, "未找到题库表标识", 1500 ,0);
  		return ;
  	}  
 
    var remove = window.confirm("确定删除题库?");
    if (!remove){
        return;
	}
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
            if(data){
                if (data.code==0){
                    // 操作成功
                    if(request["refresh-opener"] && request["refresh-opener"] == 1){
                        // 刷新父页面
                        tek.refresh.refreshOpener();
                    } 
                    tek.macCommon.waitDialogShow(null, "题库删除成功!");
                }else{
                    tek.macCommon.waitDialogShow(null,data.message);
                }
            }

           // tek.macCommon.waitDialogShow(null, "题库删除成功!");
           // getGroupList();
        },
        error: function (data, message) {
            tek.macCommon.waitDialogShow(null, message);
        },
        complete: function () {
            tek.macCommon.waitDialogHide(1000, "window.close()");
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
/*---------------------------------------------- question end -------------------------------*/
/*---------------------------------------------- answer start -------------------------------*/
/*读取答案列表*/
function readAnswerList(question_id){
    if(!question_id)
        return;

    var setting = {operateType: "获取答案列表"};
    var sendData = {
        objectName: "ExamsAnswer",
        action: "getList",
        exams_question_id:question_id,
        desc: 1
    };

    var callback = {
        beforeSend: function () {
            $("#answer-list-"+question_id).html("<li id='waiting-img' class='center'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/></li>");
        },
        success: function (data) {
            $("#waiting-img").remove();

            var record = data["record"];
            if(record){
                if(record.length){
                    for(var i in record){
                        appendAnswerField(record[i],question_id);
                    }
                }else{
                    appendAnswerField(record,question_id);
                }
            }else{
                /*var html = "<a href='javascript:void(0);' data-toggle='modal' data-target='#addAnswerModal' onclick='addAnswer("+question_id+")' >";
                html += "<i class='fa fa-plus' style='margin-right: 8px;'></i>答案</a>";
                $("#answer-list-"+question_id).html(html);*/
                $("#answer-list-"+question_id).html("<li class='answer-data-message' style='text-align:center;'>没有数据！</li>");
            }
        },
        error: function (data, errorMsg) {
            $("#answer-list-"+question_id).html("<li style='text-align:center;'>" + errorMsg + "</li>");
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

function appendAnswerField(record,question_id){
    if(record){
        var field;
        var html = "<div class='col-md-3 col-sm-6'>"+
            "<span>";
        field = record.exams_answer_name;
        if(field && field.show){
            html += field.show || "";
        }
        field = record.exams_answer_correct;
        if(field && (field.value==1)){
            html += "<i class='fa fa-check'></i>";
        }
        html += "</span>";
        html += "</div>";

        $("#answer-list-"+question_id).append(html);
    }

}

/*---------------------------------------------- answer end -------------------------------*/
//==================================================数据类型的转换==================================================//
function getLongDateByStringDate(stringDate){
    var newStringDate = stringDate;
    if(newStringDate){
        newStringDate = replaceMyString(newStringDate,"-","/");
        if(newStringDate){
            if(newStringDate.indexOf(":") <= 0)
                newStringDate += " 00:00:00"
        }else{
            newStringDate = stringDate;
        }
    }

    var dateDate = new Date(newStringDate);
    return dateDate.getTime();
}

//字符串替换
function replaceMyString(str,oldStr,newStr){
    var ns = str;
    if(str){
        do{
            ns = ns.replace(oldStr,newStr);
        }while(ns.indexOf(oldStr) > -1);
    }
    return ns;
}
//单选题、多选题切换类型
function changetype(value){

    isContinueLoad = false;

    if(value===2){
        $("#choose").text("单选题");
        $("#question-type").val(value);
        getQuestionList(0,value,"list");
        $("#changeA").html("多选题");
        $("#changeA").attr("onclick","changetype(4)");

    }else if(value===4){
        $("#choose").text("多选题");
        $("#question-type").val(value);
        getQuestionList(0,value,"list");
        $("#changeA").html("单选题");
        $("#changeA").attr("onclick","changetype(2)");
    }
    $("#page").removeClass("hidden");
    //isContinueLoad = true;
}
//===============================================================================================================//
/**
 * 显示默认的列表翻页按钮
 *
 * @param data
 *           检索结果
 */
function showCustomListTurn(skip,data) {
    var elem=document.getElementById("page");
    if (!elem)
        return;

    elem.innerHTML="";

   /* var skip=questionData["skip"];
    if(!skip){
        skip=0;
        questionData["skip"]=skip;
    }
    skip=parseInt(skip);
    if(!skip)
        skip=0;*/

    //count=questionData["count"];

    //if(!count){
    //    count=PAGE_COUNT;
    //    questionData["count"]=count;
    //}

    count=parseInt(count);
    if(!count)
        count=0;
    var total=parseInt(data.value);
    if(!total)
        total=0;

    //显示页码html信息文本
    elem.innerHTML = tek.turnPage.getPagination(skip,count,total);

    currentPage = tek.turnPage.getCurrentPageNumber(skip,count);
    totalPage = tek.turnPage.getTotalPageNumber(total,count);

    if(currentPage<totalPage){
        isContinueLoad = true;
        $("#more_page_2").removeClass("hidden");   //加载瀑布流完成后显示下一页按
        $("#ajax-load-div").addClass("hidden");
    }else{
        isContinueLoad = false;
        $("#more_page_2").addClass("hidden");
        $("#ajax-load-div").removeClass("hidden");
    }
}

//全选操作
function selAll(elem, e) {
    if(!elem)
        return;
    var children=document.getElementById("question-list").getElementsByTagName("input");
    if(children && children.length>0) {
        for(var i in children) {
            if(children[i] && children[i].type=="checkbox") {
                if(!elem.checked)
                    children[i].checked="";
                else
                    children[i].checked="checked";

                tek.macList.sel(children[i], e);
            }
        }
    }

}

//选择操作
function selt(check, e) {
    if (!check)
        return;
    // 指定info
    var index=isArrayContain(selected, check.value);
    if (check.checked) {
        if (index<0)
            selected.push(check.value);
    } else {
        if (index>=0)
            delete selected[index];
    }

    e = e ? e : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
    if (e && e.stopPropagation)
        e.stopPropagation();
    else if(window && window.event && window.event.cancelBubble)
        window.event.cancelBubble=true;
}

/**
 * array数组中是否包含v （内部方法，不对外暴露）
 * @param {Array} array 数组
 * @param {String} v 元素id值
 * @return {Number} 如果包含，返回数组下标，否则返回-1。
 */
var isArrayContain = function (array, v) {
    if (!array || !v)
        return -1;

    for (var i = 0; i < array.length; i++) {
        if (array[i] == v)
            return i;
    }

    return -1;
};

//监听滚动条
$(window).scroll(function(){
    if(!isContinueLoad)
        return ;

    if(($(this).scrollTop() + 2) >= ($(document).height()-$(this).height())){
        isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
        $("#page").addClass("hidden");
        changePage(null,(currentPage*count));;
       
    }
});

//下一页按钮，翻到下一页
function morePage(){
    if(currentPage<totalPage) {
        if(!$("#question-content").is(":visible"))
            $(".wminimize").click();

        isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
        $("#page").addClass("hidden");
        changePage(null,(currentPage*count));
    }else{
        $("#ajax-load-div").removeClass("hidden");
        $("#page").addClass("hidden");
        $("#more_page_2").addClass("hidden");
    }
	
	
	
			
}

function changePage(id, skip){
    //questionData["skip"]=skip;
    var type = $("#question-type").val();
    getQuestionList(skip,type,"page");
}


