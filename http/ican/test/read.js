var testId; //问题的类型
var groupId; //小组的标识
//var EVERY_ROW_SHOW = 5;	//每行显示的个数
var currentPage;
var totalPage;
var count=5;
var topic_mydata={};
var isContinueLoad = false;		//是否可以继

//选题分值
var select_score = 0;
var selected_score = 0;
var selecteds=new Array();    //选中的对象标
var option_score = 0;//随机题总分
//var GROUP_COUNT=5; 
var PAGE_COUNT=5;
var libraryId ; //选题题库的标识
var libraryName ; //选题题库的名称
var params = {};

var SKIP = 0;					//列表起始值
var COUNT = 6;					//每页显示的个数
var TOTAL = 0;					//小组数

//------------------------------------------------------------------ ExamsTest -----------------------------------------------//
/**
 * 初始化
 */
function init(){
	testId=request["exams_test_id"];
	groupId=request["group_id"];
	readTest();
	
}

//读取试卷
function readTest(){	
	if(!testId)
		return;
		
	var mydata={};
	mydata["objectName"]="ExamsTest";
	mydata["action"]="readInfo";
	mydata["exams_test_id"]=testId;
	mydata["count"]=1;
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend:function(){
			$("#test-info").html("<div class='col-md-12 col-sm-12 center'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function(data) {
			if (data) {
				if (data.code==0){
					//判断权限显示按钮
					if(tek.right.isCanWrite(data.right)||tek.right.isCanDelete(data.right)){
						$("#test-btn").removeClass("hidden");
						if(tek.right.isCanWrite(data.right))
							$("#test-edit-btn").removeClass("hidden");
						if(tek.right.isCanDelete(data.right))
							$("#test-delete-btn").removeClass("hidden");
					}
					
					var record=data["record"];
					if (record) {
						//显示试卷信息
						showTestInfo(record,data.right);
					}
				}else{
					var sb = new StringBuffer();
					sb.append("<font color='red'>");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(tek.dataUtility.stringToHTML(data.message));
					sb.append("</font>");
					$("#test-info").html(sb.toString());
				}  //end if (data.code==0)
			} else {
				$("#test-info").html("<font color='red'>操作失败![data=null]</font>");
			}
 	    }, //end success: function(data)
		error: function(request) {
			var sb = new StringBuffer();
			sb.append("<font color='red'>");
			sb.append("操作失败！[");
			sb.append(request.status);
			sb.append(" - ");
			sb.append(request.statusText);
			sb.append("]</font>");
			$("#test-info").html(sb.toString());
        }
	});
}

//显示试卷信息
function showTestInfo(record,right){
	if(record){
		var field;
		//显示试卷的名称
		field = record.exams_test_name;
		if(field && field.show)
			$("#exams_test_name").html(field.show||"");
		field = record.exams_test_owner;
		if(field && field.show)
			$("#exams_test_owner").html(field.show||"");
		
		var sb = new StringBuffer();
		/*sb.append("<div class='col-md-12'>");
			sb.append("标签");
			sb.append("<span class='exam-tags'>移动</span>");
			sb.append("<span class='exam-tags'>北京地区</span>");
			sb.append("<span class='exam-tags'>代维项</span>");
			sb.append("<span class='exam-tags'>基础</span>");
		sb.append("</div>");*/
		sb.append("<div class='col-md-6'>");
		field = record.exams_test_grade;
		if(field && field.value){
			sb.append(field.display);
		    sb.append("&nbsp;&nbsp;");
			sb.append(field.value);
		    sb.append("级");
	    }
		sb.append("</div>");
		sb.append("<div class='col-md-6'>");
		field = record.exams_test_status;
		if(field && field.show){
			sb.append(field.display);
			sb.append("&nbsp;&nbsp;");
			sb.append(field.show||"");
        }
		sb.append("</div>");
		sb.append("<div class='col-md-6'>");
		field = record.exams_test_score;
		if(field && field.show){
			sb.append(field.display);
			sb.append("&nbsp;&nbsp;");
			sb.append(field.show);
			sb.append("分");
		}
		sb.append("</div>");
		sb.append("<div class='col-md-6'>");
		field = record.exams_test_duration;
		if(field && field.value){
			sb.append(field.display);
			sb.append("&nbsp;&nbsp;");
			//秒转换为分钟
			var time = getTimeBySecond(field.value);
			if(time)
				sb.append(time);
		}
		sb.append("</div>");
		/*sb.append("<div class='col-md-6'>");
		if(record.exams_test_type.display)
			sb.append(record.exams_test_type.display);
		sb.append("&nbsp;&nbsp;");
		if(record.exams_test_type.show)
			sb.append(record.exams_test_type.show);
		sb.append("</div>");*/
		sb.append("<div class='col-md-6'>");
		field = record.exams_test_group;
		if(field && field.show){
			sb.append(field.display);
			sb.append("&nbsp;&nbsp;");
			sb.append(field.show);
		}
		sb.append("</div>");
		sb.append("<div class='col-md-6'>");
		field = record.exams_test_read;
		if(field && field.show){
			sb.append(field.display);
			sb.append("&nbsp;&nbsp;");
			sb.append(field.show);
		}
		sb.append("</div>");     
		sb.append("<div class='col-md-6'>");
		field = record.exams_test_exam;
		if(field && field.show){
			sb.append(field.display);
			sb.append("&nbsp;&nbsp;");
			sb.append(field.show);
		}
		sb.append("</div>");
		sb.append("<div class='col-md-6'>");
		field = record.exams_test_write;
		if(field && field.show){
			sb.append(field.display);
			sb.append("&nbsp;&nbsp;");
			sb.append(field.show);
		}
		sb.append("</div>");
		sb.append("<div class='col-md-6'>");
		field = record.exams_test_method;
		if(field && field.show){
			sb.append(field.display);
			sb.append("&nbsp;&nbsp;");
			sb.append(field.show);
		}
		sb.append("</div>");
		sb.append("<div class='col-md-12'>");
		sb.append("有效时间");
		sb.append("&nbsp;&nbsp;");
		field = record.exams_test_start;
		if(field && field.show){
			sb.append(field.show);
			sb.append(" ~ ");
		}
		field = record.exams_test_end;
		if(field && field.show)
			sb.append(field.show);
		sb.append("</div>");
		sb.append("<div class='col-md-12'><hr /></div>");
		/*sb.append("<div class='col-md-12'>");
		if(record.option_score.display)
			sb.append(record.option_score.display);
		sb.append("&nbsp;&nbsp;");
		if(record.option_score.show)
			sb.append(record.option_score.show);
		sb.append("</div>");*/
		/*sb.append("<div class='col-md-12'>");
		if(record.option_count.display)
			sb.append(record.option_count.display);
		sb.append("&nbsp;&nbsp;");
		if(record.option_count.show)
			sb.append(record.option_count.show);
		sb.append("</div>");*/
		field = record.option_library;
		var field_single = record.option_type_single;
		var field_multiple = record.option_type_multiple;
		console.log(field);
		if(field && field.value){
			var arrVal = tek.dataUtility.stringToArray(field.value, "|");
			var arrShow = tek.dataUtility.stringToArray(field.show, "|");
			var arrVal_single = tek.dataUtility.stringToArray(field_single.value, "|");
			var arrVal_multiple = tek.dataUtility.stringToArray(field_multiple.value, "|");
			if((arrVal.length >0) && (arrVal.length == arrVal_single.length)
			&& (arrVal_single.length == arrVal_multiple.length)){
				
				for(var i=0;i<arrVal.length;i++){
					//显示题库 
					sb.append("<div class='col-md-6'>");
					if(field.display)
						sb.append(field.display);
					sb.append("&nbsp;&nbsp;");
					if(arrShow && arrShow[i]){
						sb.append(arrShow[i]);
						libraryName =arrShow[i];
					}
				    sb.append("</div>");
					//显示题库类型
					sb.append("<div class='col-md-12'>");
					if(record.option_type)
						sb.append(record.option_type.display);
					sb.append("&nbsp;&nbsp;");

						
					sb.append("<span class='exam-radio'><i class='fa  fa-dot-circle-o'></i>单选题（");
					if(field_single){
						sb.append(getCountAndScore(arrVal_single[i]));
					}
					sb.append("）</span>");
					sb.append("<span class='exam-checkbox'><i class='fa fa-check-square-o'></i>多选题（");
					if(field_multiple){
						sb.append(getCountAndScore(arrVal_multiple[i]));
					}
					sb.append("）</span>");
					sb.append("</div>");
				}
			}
		}
		//选题题库的标识
		if(record.option_library.value){
			libraryId = record.option_library.value;
			showLibrarylist(record.option_library);
		}
		//显示可选题的分数
		var flag = false;
		if(record.exams_test_score){
			flag = getSelectableScore(record.exams_test_score.value);
		}
			
		//判断试卷的类型，是否显示固定题
		if(flag== true && record.option_library.value && tek.right.isCanWrite(right))
			getTopicList(false);
		
		
		$("#test-info").html(sb.toString());
		totalScore();
	}
}

//编辑试卷
function editTest(){
	if(!testId&&!groupId)
		return;
		
	var url=new StringBuffer();
	url.append(tek.common.getRootPath());
	url.append("http/ican/test/edit.html?exams_test_id=");
	url.append(testId);
	url.append("&show-close=1");
	url.append("&refresh-opener=1");

	window.open(url.toString(), "_blank");
	
}

//删除试卷
function deleteTest(){	
	if(!testId)
		return;
		
	var remove=window.confirm("确定删除");//(这个提示还加不加？)
	if (!remove)
	  return ;
	$.ajax({
	  type: "post",
	  url: tek.common.getRootPath()+"servlet/tobject",
	  dataType: "json",
	  data: {
		  objectName:"ExamsTest",
		  action:"removeInfo",
		  "exams_test_id":testId,
	  },
	
	  success: function(data) {
		if(data){
			if (data.code==0){
			    // 操作成功
	            if(typeof(updateOpener)!="undefined" && updateOpener==1){
	                // 刷新父页面
	                tek.refresh.refreshOpener();
	            } 
			  
			  	if(typeof(showClose)!="undefined" && showClose==1){
	                // 关闭
	                var timerMsg=new StringBuffer();
	                timerMsg.append("页面<font id='counter' color='red'>");
	                timerMsg.append("</font>秒后自动关闭");;
					tek.macCommon.waitDialogShow(null,tek.dataUtility.stringToHTML(data.message));

              	}else {
					tek.macCommon.waitDialogShow(null,tek.dataUtility.stringToHTML(data.message));
              	} // end if else

			}else{
			  	tek.macCommon.waitDialogShow(null,data.message);
			}
		}else{
			tek.macCommon.waitDialogShow(null,"删除错误!");
		}
	  },
	
	  error: function(request) {
		    tek.macCommon.waitDialogShow(null,"删除操作失败!"+request.status+" - "+request.response);
	  },
	  complete: function() {
			tek.macCommon.waitDialogHide(1000, "window.close()");
	  }
	});
}

//计算可选分数
function getSelectableScore(test_score){
    if(test_score<=0)
		return;
		
	var  selectable = parseInt(test_score)-option_score;
	if(selectable==0)
		return false;
	if(selectable>0&&selectable<=test_score){
		$("#selectable-score").html(selectable);
		return true;
	}
	
}
//计算已选的总分数
function totalScore(){
	if(!testId){
		return;
	}
	var params = {};	
	params["objectName"]="ExamsTopic";
	params["action"]="getList";
	params["order"] = "createTime";
	params["desc"] = 1;
	params["exams_test_id"] = testId;
	params["select"] = "SUM(exams_topic_score) exams_topic_score";
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: params,
		beforeSend: function() {
			
		},
		success: function(data) {
			if(data) {
				if(data.code == 0){
					if(data.record){
						$('#selected-score').html(data.record.exams_topic_score.show);
					}else{
						$('#selected-score').html('0.00');
					}
				}
			}else{
            	//$("#topic-list").html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
	    	//$("#topic-list").html("<font color='red'>操作失败</font>");
        }
	});	
	
}

//取得随机题类型下的题数和每题的分数
function getCountAndScore(type_value){
	if(!type_value)
		return;
	var arr = tek.dataUtility.stringToArray(type_value,",");
	if(arr.length==2){
		if(tek.dataUtility.stringToInt(arr[0])>0 && tek.dataUtility.stringToInt(arr[1]) >0){
			option_score += parseInt(arr[0])*parseInt(arr[1]);
			return tek.dataUtility.stringToInt(arr[0])+"道，每题"+tek.dataUtility.stringToInt(arr[1])+"分";
		}else{
			return;	
		}
	}else{
		return;	
	}
	
}

//转换时间
function getTimeBySecond(stringTime){
	if(!stringTime)
		return;
	
	var second = parseInt(stringTime);// 秒
	var minute = 0;// 分
	var hour = 0;// 小时
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
//------------------------------------------------------------------ ExamsTopic -----------------------------------------------//

//获取固定题列表
function getTopicList(change_page){
	if(!testId)
		return;
	$("#topic-info").removeClass("hidden");
	
	var target = document.getElementById('topic-list');
	if(!target)
		return;
		
	topic_mydata["objectName"]="ExamsTopic";
	topic_mydata["action"]="getList";
	topic_mydata["order"] = "createTime";
	topic_mydata["desc"] = 1;
	topic_mydata["exams_test_id"] = testId;
	
	if(count)
		topic_mydata["count"] = count;
	else {
		topic_mydata["count"] = PAGE_COUNT;
		count = PAGE_COUNT;
	}
	
	if(change_page==false){
		topic_mydata["count"] = PAGE_COUNT;
		topic_mydata["skip"] = 0;
	}
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: topic_mydata,
		beforeSend: function() {
			if(change_page==false)
				target.innerHTML = "";
		},
		success: function(data) {
			if(data) {
				if(data.code==0){
					var record = data["record"];
					if(record){
						if(record.length){
							for(var i in record)
								showTopicList(record[i],target);
						}else{
								showTopicList(record,target);
						}//end if(record.length)
						
						//显示分页
						showCustomListTurn(data);
						//显示已选分数
						$("#selecting-score").html(selected_score);
						
					}//end if(record)
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(tek.dataUtility.stringToHTML(data.message));
					error.append("</font>");
					$("#topic-list").html(error.toString());
				}//end if(data.code==0)
			}else{
            	$("#topic-list").html("<font color='red'>执行失败</font>");
            } //end if(data)
		},//end success: function(data)
		error: function() {
	    	$("#topic-list").html("<font color='red'>操作失败</font>");
        }
	});	
}

//显示固定题列表
function showTopicList(record,target){
	if(record){
		var field;
		var sb = new StringBuffer();
		
		sb.append("<div class='col-md-12' id='topic-");
		if(record.id)
			sb.append(record.id);
		sb.append("'>");
		sb.append("<div class='question-item'>");
		sb.append("<input onclick='selt(this, event)' type='checkbox' style='display:none;'>");
		sb.append("<a class='item-heading' href='javascript:;' onclick='readQuestion(\"");
		field = record.exams_topic_question;
		if(field && field.value){
			sb.append(field.value);
		}
		sb.append("\")'>");
		field = record.exams_topic_name;
		if(field && field.show)
			sb.append(field.show);
		sb.append("</a>");
		sb.append("<span class='heading-date'  ondblclick='editTopicScore(this,\"");
		if(record.id)
			sb.append(record.id);
		sb.append("\")' id='selected-score-");
		if(record.id)
			sb.append(record.id);
		sb.append("'>");
		field = record.exams_topic_score;
		if(field && field.show){
			sb.append(field.show);
			var score = parseInt(field.show);
			selected_score = selected_score+score;
		}
		sb.append("</span>分");
		sb.append("<div class='item-btn btn-group'>");
		sb.append("<button class='btn btn-xs btn-default' onclick='deleteTopic(\"");
		if(record.id)
			sb.append(record.id);
		sb.append("\")'><i class='fa fa-times'></i> </button>");
		sb.append("</div>");
		sb.append("</div>");
		sb.append("</div>");
	
		if(target)
			target.insertAdjacentHTML('BeforeEnd',sb.toString());	
	}
}

/**
 * 显示默认的列表翻页按钮
 *
 * @param data
 *           检索结果
 */
//tek.macList.showCustomListTurn = function (data){
//	var skip = macList.params["skip"];
//	if (!skip) {
//		skip = 0;
//		macList.params["skip"] = skip;
//	}
//
//	var count = macList.params["count"];
//	if (!count) {
//		count = macList.PAGE_COUNT;
//		macList.params["count"] = count;
//	}
//
//	tek.turnPage.show("topic-page", skip, count, data.value, macList.groupCount);
//}

//删除固定题
function deleteTopic(topic_id){
	var remove=window.confirm("确定删除该题?");//(这个提示还加不加？)
	if (!remove)
	  return ;
	
	var AjaxURL = tek.common.getRootPath() + "servlet/tobject";
	var setting = {
		async: false,
		operateType: "删除固定题"
	};
	var sendData = {
            objectName: "ExamsTopic",
            action: "removeInfo",
            exams_topic_id: topic_id,
    };
	
	var callback = {
		success: function(data) {
			/*//减去当前分数
			var score = $("#selected-score-"+topic_id).text();
			selected_score = selected_score-score;
			$("#selected-score").html(selected_score);
			
			var sb = new StringBuffer();
			sb.append("#topic-");
			sb.append(topic_id);
			//删除该节点
			$(sb.toString()).remove();*/
			selected_score = 0;
			getTopicList(false);
			totalScore();
		},
		error: function(data, errorMsg) {
			//显示错误信息
			tek.macCommon.waitDialogShow(null, errorMsg);
		},
		complete: function(data) {
			tek.macCommon.waitDialogHide(1000);
			
			//showCustomListTurn(data);
	    }
	};
	tek.common.ajax(AjaxURL, setting, sendData, callback);
} 

//编辑固定题
function editTopicScore(thisScore,topic_id){
	//获取分值
	var oldhtml = thisScore.innerHTML;
	var newobj = document.createElement('input');
	//创建新的input元素
	newobj.type = 'text';
	//为新增元素添加类型
	newobj.onblur = function(){
		//当触发时判断新增元素值是否为空，为空则不修改，并返回原有值
		var score = oldhtml;
		if(this.value&&this.value!=oldhtml){
			//保存分值
			score = this.value;
		} else{
			score = this.value ? this.value : oldhtml;
		}
		
		$(this).parent().html(oldhtml);
		
		var difference = parseInt(score)-parseInt(oldhtml);
		
		if(score!=oldhtml)
			setTopicInfo(topic_id,score,difference);
	}
	
	thisScore.innerHTML = '';
	thisScore.appendChild(newobj);
	newobj.focus();
}

//保存修改之前的固定题分数
function saveTopicPreValue(input,e){
	var value = $(input).val();
	if(value)
		$(input).attr("preValue",value);
}

//取得修改后的固定题分数
function getTopicScore(input, e){
	//该项是否被选中
	var $children = $(input).parent().parent().children();
	var $first = $children.first();
	var checkbox = $first.get(0);
	
	if(checkbox.checked){
		var pre_value = $(input).attr("preValue");
		var curr_value = $(input).val();
		var dif = parseInt(curr_value)-parseInt(pre_value);
		if(dif!=0){
			select_score = select_score+dif;
			$("#all-score").html(select_score);
		}
	}
}

//息编辑固定题信息
function setTopicInfo(topic_id,topic_score,difference){
	if(!topic_id)
		return;
	
	var mydata={};
	mydata["objectName"] = "ExamsTopic";
	mydata["action"] = "setInfo";
	mydata["exams_topic_id"]=topic_id;
	if(topic_score)
		mydata["exams_topic_score"]=topic_score;	
	  
	EditTopicInfo(tek.common.getRootPath()+"servlet/tobject",mydata,topic_id,difference);
}

//提交固定题编辑信息
function EditTopicInfo(ajaxURL, ajaxParams,topic_id,difference) {
	//显示等待图层
	var html=new StringBuffer();
	html.append("<img src='");
	html.append(tek.common.getRelativePath());
	html.append("http/images/waiting-small.gif'/>&nbsp;正在提交...");
  	tek.macCommon.waitDialogShow(null,html.toString());
  
	$.ajax({
		type: "post", 
		async:true,
		url: ajaxURL,
		dataType: "json",
		data: ajaxParams,
		success: function(data) {
			if(data) {
			  if (data.code==0) {
				  tek.macCommon.waitDialogShow(null,tek.dataUtility.stringToHTML(data.message));
				  //修改成功
				  $("#selected-score-"+topic_id).html(ajaxParams["exams_topic_score"]);
				  //修改总分
				  selected_score = selected_score+difference;
				  $("#selecting-score").html(selected_score);
			  } else {
				  // 操作错误
				  var error=new StringBuffer();
				  error.append("<font color='red'>");
				  if(data.code)
					error.append(data.code);
				  error.append(" - ");
				  if(data.message)
					error.append(tek.dataUtility.stringToHTML(data.message));
				  error.append("</font>");
				  tek.macCommon.waitDialogShow(null,error.toString());
			  } // end if (data.code==0) else
	
			} else {
				tek.macCommon.waitDialogShow(null,"<font color='red'>操作失败![data=null]</font>");
			} // end if(data) else
		},
  
		error: function(request) {
			var error=new StringBuffer();
			error.append("<font color='red'>");
			error.append("操作错误![");
			if(request.status)
			  error.append(request.status);
			error.append(" - ");
			if(request.response)
			  error.append(request.response);
			error.append("]");
			error.append("</font>");
			tek.macCommon.waitDialogShow(null,error.toString());
		},
  
		complete: function() {
			tek.macCommon.waitDialogHide(1000);
		}
	});
 
}

function selt(check, e) {
  if (!check)
    return;
    // 指定info
    var index=isArrayContain(selecteds, check.value);
	//获取当前对象的分数
	var score = 0;
	var $span = $(check).next().next();
	if($span){
		var $input = $span.children();
		if($input)
			score = parseInt($input.val());
	}
	
    if (check.checked) {
	  select_score = select_score+score;
	  $("#all-score").html(select_score);
      if (index<0){
        selecteds.push(check.value);
	  }
    } else {
	  select_score = select_score-score;
	  $("#all-score").html(select_score);
      if (index>=0){
        delete selecteds[index];
	  }
    }

  e = e ? e : ((window.event) ? window.event : "");    //兼容IE和Firefox获得keyBoardEvent对象
  if (e && e.stopPropagation)
    e.stopPropagation();
  else if(window && window.event && window.event.cancelBubble)
    window.event.cancelBubble=true;
}


/**
 * array数组中是否包含elem元素。
 *
 * @param array
 *           数组
 * @param elem
 *           元素
 * @return 如果包含，返回数组下标，否则返回-1。
 */
function isArrayContain(array, elem) {
  if (!array || !elem)
    return -1;

  for (var i=0; i<array.length; i++) {
    if (array[i]==elem)
      return i;
  }

  return -1;
}

//换页
function changePage(id, skip){
  params["skip"]=skip;
  getQuestionList();
}

function showCustomListTurn(data) {
	var elem=document.getElementById("topic-page");
	if (!elem)
		return;
	
	elem.innerHTML="";
	
	var skip=topic_mydata["skip"];
	if(!skip){
		skip=0;
		topic_mydata["skip"]=skip;
	}
	skip=parseInt(skip);
	if(!skip)
		skip=0;
		
	count=topic_mydata["count"];
	  
	if(!count){
		count=PAGE_COUNT;
		topic_mydata["count"]=count;
	}
	
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
		$("#topic_more_page").removeClass("hidden");   //加载瀑布流完成后显示下一页按
		$("#topic-ajax-load-div").addClass("hidden");
	}else{
		isContinueLoad = false;
		$("#topic_more_page").addClass("hidden"); 
		$("#topic-ajax-load-div").addClass("hidden");
	}
}



//监听滚动条
$(window).scroll(function(){
	if(!isContinueLoad)
		return ;

	if(($(this).scrollTop() + 2) >= ($(document).height()-$(this).height())){
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		$("#topic_more_page").addClass("hidden");
		changeTopicPage(null,(currentPage*count));
	}//end  if...
});
	
//下一页按钮，翻到下一页
function morePage(){
	if(currentPage<totalPage) {
		if(!$("#topic-list").is(":visible"))
			$(".wminimize").click();
		
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		$("#topic_more_page").addClass("hidden");
		changeTopicPage(null,(currentPage*count));
	}else{
		$("#topic-ajax-load-div").removeClass("hidden");
		$("#topic_more_page").addClass("hidden");
	}
}//end morePage()

function changeTopicPage(id, skip){
  topic_mydata["skip"]=skip;
  getTopicList(true);
}

//------------------------------------------------------------------ ExamsQuestion -----------------------------------------------//
function showLibrarylist(field){
	if (!field || !field.name)
		return html;

	var fieldname = field.name;    //域名 字段值
	var display = field.display || "&nbsp;";    //本地化域名  字段显示的名字
	var show = !!field.show ? tek.dataUtility.stringToHTML(field.show) : "";    //域显示值
	
	var html = "";
	html += "<form name='add-form' id='add-form' action=\"javascript:selectLibrary('add-form');\" role='form'>";
	html += "<h4 class='title'>&nbsp;</h4>";
	html += "<div class='col-md-12 '>";
	html += "<div class='widget-content'>";
	
	html += "<div class='admin-form center'>";
	html += "<div class='form-group'>";
	
	html += "<label class='col-md-3' for='add_subject_group_select'>";
	html += "<span>选择题库：</span>";
	html += " </label>";
	html += "<div class='col-md-6'>";
	html += "<select class='form-control' id='add_library_group_select' name='add_library_group_select'>";
	if(!!field.value){
		var arrVal = tek.dataUtility.stringToArray(field.value, "|");	
		var arrShow = tek.dataUtility.stringToArray(field.show, "|");	
		if(arrShow){
			if((arrVal.length == arrShow.length)&&(arrVal.length>0)){
				for(var i=0;i<arrVal.length;i++){
					html += "<option value='"+arrVal[i]+"'>"+arrShow[i]+"</option>";
				}
			}
		}
		
	}
	html += "</select>";
	html += "</div>";
	
	html += "<div class='col-md-3'>";
	html += "<button class='btn btn-success' type='submit'>确 定</button>";
	html += "</div>";
	
	html += "<div class='clearfix'></div>";
	html += "</div>";	
	html += "</div>";
	
	html += "</div>";
	html += "</div>";
	html += "<div class='clearfix'></div>";
	html += "<h4 class='title'>&nbsp;</h4>";
	
	html += "</form>";
	
	$("#library-list").append(html);
}

function getLibrary(){
	if($("#page").html())
		$("#page").html("");
	//显示题库
	$("#library-list").removeClass("hide");
}

function selectLibrary(targetId){
	var form = document.getElementById(targetId);
	if(!form)
		return;
	var value = form.add_library_group_select.value;
	if(value && value != ""){
		//$("#group-info-div").addClass("hidden");
		//$("#library-info-div").removeClass("hidden");
		$("#library-list").addClass("hide");
		$("#question-list").removeClass("hide");
		libraryId = value;
		getQuestionList();
	}
}

//翻页 turn-page.js必须实现方法
tek.turnPage.turn = function (eleId, skip) {
	skip = parseInt(skip);
	if (!isFinite(skip) || skip < 0)
		return;

	SKIP = skip;
	getQuestionList();
};

//获取问题列表
function getQuestionList(){
	if(!libraryId)
		return;
	if(libraryName)
		$("#myModalLabel").text(libraryName);
    
	var $target = $("#question-list");
	if(!$target)
		return;
	
	select_score = 0;
	$("#all-score").html(select_score);	
	selecteds = new Array();
	
	params["objectName"]="ExamsQuestion";
	params["action"]="getList";
	params["exams_library_id"]=libraryId;
	params["count"]=COUNT;
	params["skip"]=SKIP;
	params["desc"] = 1;
	params["test_select"] = 1;
	params["test_id"] = testId;
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: params,
		beforeSend:function(){
			$target.append("<li id='question-waiting-img' style='text-align:center;'><img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/></li>");	
		},
		success: function(data) {
			//成功之后去除等待框
			$("#question-waiting-img").remove();
			
			if (data.code==0){
				TOTAL = parseInt(data.value);	//保存总数
				//显示【下一页】按钮
				if (TOTAL > COUNT)
					$("#more_page").removeClass("hidden");
					
				var record = data["record"];
				if(record){
					$("#question-list").html("");
					
					var target = $target[0];
					if(record.length){
						for(var i in record){
							showQuestionList(record[i],target);
						}
					}else{
						showQuestionList(record,target);
					}
					
					//显示添加的按钮
					$("#lib-btn").removeClass("hide");
				}else{
					$target.html("");
					$target.append("<li class='answer-data-message' style='text-align:center;list-style:none;'>没有数据！</li>");	
				}//end if(record)
			}else{
				$target.append("<li class='answer-data-message' style='text-align:center;'>"+data.message+"</li>");	
			} //end if (data.code==0)
		}, //end success: function(data)
		error: function(request) {
			var sb = new StringBuffer();
			sb.append("<font class='answer-data-message' color='red'>");
			sb.append("操作失败！[");
			sb.append(request.code);
			sb.append(" - ");
			sb.append(stringToHTML(request.message));
			sb.append("]</font>");
			$target.append(sb.toString());
		},
		complete: function () {
			//显示分页
			tek.turnPage.show("page", SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
		}
	});	
}

/*显示问题列表*/
function showQuestionList(record,target){
	if(record){
		var field;
		var sb = new StringBuffer();
		sb.append("<div class='col-md-12'>");
		sb.append("<div class='question-item'>");
		sb.append("<input onclick='selt(this, event)' type='checkbox' value='");
		if(record.id)
			sb.append(record.id);
		sb.append("'>");
		sb.append("<a class='item-heading' id='question-name-");
		if(record.id)
			sb.append(record.id);
		sb.append("' href='javascript:;' onclick='readQuestion(\"");
		if(record.id)
			sb.append(record.id);
		sb.append("\")'>");
		field = record.exams_question_name;
		if(field && field.show)
			sb.append(field.show);
		sb.append("</a>");
		sb.append("<span class='heading-date'>");
		sb.append("<input class='question-score' id='score-");
		if(record.id)
			sb.append(record.id);
		sb.append("' type='text' value='2' onfocus='saveTopicPreValue(this,event)'  onchange='getTopicScore(this,event)'/></span>分");
		sb.append("</div>");
		sb.append("</div>");
		
		
		if(target){
			target.insertAdjacentHTML("beforeEnd",sb.toString());
		}	
	}
}

//添加固定题列表
function addTopicList(){
	if(!testId)
		return;
	
	//没选添加的记录	
	if (!selecteds || selecteds.length <=0) {
		tek.macCommon.waitDialogShow(null,"没有选中待添加记录");
		tek.macCommon.waitDialogHide(1000);
    	return ;
 	}
	
	//隐藏题库
	$("#question-list").addClass("hide");
	//关闭弹框
	$("#close-modal").trigger("click");
	
	var objectIds=new StringBuffer();
	for (var i=0; i<selecteds.length; i++) {
	  if (selecteds[i] && selecteds[i]>0){
		//添加固定题
		addTopicInfo(selecteds[i],i+1);
	  }
	}	
	
	//重新获取固定题列表
	$("#topic-list").html("");
	selected_score = 0;
	getTopicList(false);
	
}
 	

$('#myModal').on('hide.bs.modal', function () {
  $("#question-list").html('');
})
//添加固定题
function addTopicInfo(question_id,index){
	if(!testId&&!question_id)
		return;
	//取得固定题的分值
	var score = $("#score-"+question_id).val();
	var question_name = $("#question-name-"+question_id).text();

	var topic_params = {};
	topic_params["objectName"] = "ExamsTopic";
	topic_params["action"] = "addInfo";
	topic_params["exams_topic_question"] = question_id;
	topic_params["exams_topic_score"] = score;
	topic_params["exams_test_id"] = testId;
	if(question_name)
		topic_params["exams_topic_name"] = question_name;
	
	//显示等待图层
	var html=new StringBuffer();
	html.append("<img src='");
	html.append(tek.common.getRelativePath());
	html.append("http/images/waiting-small.gif'/>&nbsp;正在添加第");
	html.append(index);
	html.append("条...");
	tek.macCommon.waitDialogShow(null,html.toString());
  
	$.ajax({
		type: "post", 
		async:false,
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: topic_params,
		success: function(data) {
			if(data) {
			  if (data.code==0) {
				// 操作成功
				totalScore(); //重新计算已选的总分数
				tek.macCommon.waitDialogHide(1000);
				tek.macCommon.waitDialogShow(null,tek.dataUtility.stringToHTML(data.message));


				
			  } else {
				// 操作错误
				var error=new StringBuffer();
				error.append("<font color='red'>");
				if(data.code)
				  error.append(data.code);
				error.append(" - ");
				if(data.message)
				  error.append(tek.dataUtility.stringToHTML(data.message));
				error.append("</font>");
				tek.macCommon.waitDialogShow(null,error.toString());
			  } // end if (data.code==0) else
	
			} else {
			  tek.macCommon.waitDialogShow(null,"<font color='red'>操作失败![data=null]</font>");
			} // end if(data) else
		},
  
		error: function(request) {
			var error=new StringBuffer();
			error.append("<font color='red'>");
			error.append("操作错误![");
			if(request.status)
			  error.append(request.status);
			error.append(" - ");
			if(request.response)
			  error.append(request.response);
			error.append("]");
			error.append("</font>");
			tek.macCommon.waitDialogShow(null,error.toString());
		},
  
		complete: function() {
			tek.macCommon.waitDialogHide(1000);
		}
	});
}

//读取问题信息
function readQuestion(question_id){
	if(!question_id){
		return;
	}
		
	/*var url=new StringBuffer();
	url.append(tek.common.getRootPath());
	url.append("http/ipassin/question/add.html?question_id=");
	url.append(question_id);
	url.append("&action=read");
	url.append("&show-close=1");
	url.append("&refresh-opener=1");*/
	var html = tek.common.getRootPath() + "http/ican/question/read.html?exams_question_id=" + question_id;
	html += "&show-close=1&refresh-opener=1"
	window.open(html);
}

