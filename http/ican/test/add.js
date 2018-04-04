// JavaScript Document
/**************************************************
 *	新建试卷页面 add.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================
var groupId;
//显示字段数组
var items = new Array("exams_test_name","exams_test_grade","exams_test_score","exams_test_read","exams_test_write","exams_test_exam","exams_test_start","exams_test_end","exams_test_duration","exams_test_status","exams_test_method","exams_test_level","exams_test_summary","option_library","option_type_single","option_type_multiple");
var libraryNum = 0;
//=====================================================Function===============================
function init(){
  if(request["group_id"]){
	  groupId = request["group_id"];
  }
	  
  tek.macEdit.initialCustomButton("btn");
  if(tek.user.isNormal(mySecurity)&&(tek.role.isAuditor(myRole)||tek.role.isCustomerService(myRole))){
	  //groupId =0;
	  $("#library-info-div").removeClass("hidden");
	  addNew();
  }else if(groupId){
	  $("#library-info-div").removeClass("hidden");
	  addNew();
  }else{
	  getMyjoinGroupList();
  }
}

//获得显示的字段
function addNew(){
	var params={};
	params["objectName"]="ExamsTest";
	params["action"]="getNew";
	params["group_id"]=groupId;

	getTestEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"add-info"); 
}

function getTestEdit(ajaxURL,ajaxParams,items,parentId){
  var parent=document.getElementById(parentId);
  if(!parent)
    return;
  //显示等待图层
  var html = "<img src='"+tek.common.getRelativePath()+
  "http/images/waiting-small.gif'/>&nbsp;正在获取数据......";
  tek.macCommon.waitDialogShow(null,html,null,2);
  
  var setting = {operateType: "新建考试"};
  var sendData = ajaxParams;
  var callback = {
		success: function (data) {
			// 自定义操作
			if(typeof(customOperation)=="function") {
				// 默认输入框
				customOperation(data,parent);
				
				var $start = $("#datetimepicker-exams_test_start");
				if($start){
					$start.datetimepicker({
						locale: 'zh-cn',
						format: 'YYYY-MM-DD HH:mm:ss'
					});
				}
				
				var $end = $("#datetimepicker-exams_test_end");
				if($end){
					$end.datetimepicker({
						locale: 'zh-cn',
						format: 'YYYY-MM-DD HH:mm:ss'
					});
				}
			} else {
				// 自定义输入框
				tek.macEdit.defaultOperation(data,parent);
			}
		},
		error: function (data, message) {
			tek.macCommon.waitDialogShow(null, message);
		},
		complete: function () {
			tek.macCommon.waitDialogHide(1000);
		}
  };
  
  tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


//自定显示框
function customOperation(data,parent){
	var r=data["record"];
	if(r){
		var record;
		if(r.length)
		  record=r[0];
		else
		  record=r;
	  
		if(record){
		  var sb=new StringBuffer();
		  //sb=getEditUI(record,items,sb);
		  for(var i=0; i<items.length; i++){
    	  	  appendCustomEditField(record[items[i]],record, sb);	
		  }
		  parent.innerHTML=sb.toString();
		}
	}

}

//自定义显示区域
function appendCustomEditField(field,record,sb){
	
	if(!field || !sb)
	  return sb;
	var fieldname=field.name;    //域名
	if(!fieldname || fieldname.length<=0)
	  return sb;
  
	var show=field.show;    //域显示值
	if(show && show.length>0)
	  show=tek.dataUtility.stringToInputHTML(show);
	else
	  show="";
	 
	if(fieldname=="exams_test_level"){		
		sb.append("<div id='");
		sb.append(fieldname);
		sb.append("-form-group' class='form-group'>");
			sb.append("<label class='col-xs-3' style='overflow:hidden' for='");
			sb.append(fieldname);
			sb.append("'>");
			sb.append(field.display);
			sb.append("</label>");
			sb.append("<div class='col-xs-9'>");
				sb.append("<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>");
					sb.append("<input type='text' class='form-control' style='width:30%; float:left;margin:2px 0px;' id='exams_test_level-high' name='exams_test_level' value=''>");
					sb.append("<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>优秀最低分</label>");
				sb.append("</div>");
				sb.append("<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>");
					sb.append("<input type='text' class='form-control' style='width:30%; float:left;margin:2px 0px;' id='exams_test_level-middle' name='exams_test_level' value=''>");
					sb.append("<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>良好最低分</label>");
				sb.append("</div>");
				sb.append("<div class='col-xs-12' style='overflow:hidden; padding:0px 5px'>");
					sb.append("<input type='text' class='form-control' style='width:14.5%; float:left;margin:2px 0px;' id='exams_test_level-low' name='exams_test_level' value=''>");
					sb.append("<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>及格最低分");
					sb.append("<span style='color:#c9302c;'>*必填</span>");
					sb.append("</label>");
					
				sb.append("</div>");
			sb.append("</div>");
		sb.append("</div>");
	}else if((fieldname=="option_type_single")||(fieldname=="option_type_multiple")){
		appendCustomField(field,record,sb);
	}else if(field.format==8||field.format==9){
	  sb.append("<div id='");
	  sb.append(fieldname);
	  sb.append("-form-group' class='form-group'>");
	  sb.append(tek.macEdit.appendNameField(field)); 
	  sb.append("<div class='col-xs-9 input-group date' id='datetimepicker-");
	  sb.append(fieldname);
	  sb.append("'>");
	  
	  sb.append("<input type='text' id='");
	  sb.append(fieldname);
	  sb.append("' name='");
	  sb.append(fieldname);
	  sb.append("' class='form-control' value='");
	  //sb.append(show);
	  sb.append("'/>");
	  if(fieldname!="exams_test_duration"){
		  sb.append("<span class='input-group-addon'>");
		  /*if(fieldname=="exams_test_duration"){
			  sb.append("<span class='glyphicon glyphicon-time'></span>");
		  }else{*/
		  sb.append("<span class='fa fa-calendar'></span>"); 
		  /*}*/
		  sb.append("</span>");
	  }
	  
	  sb.append("</div>");
	
	  sb.append("</div>");
	}else {
	  sb.append("<div id='");
	  sb.append(fieldname);
	  sb.append("-form-group' class='form-group'>");
	  
	  sb.append(tek.macEdit.appendNameField(field));
	  
	  sb.append("<div class='col-xs-9'>");
	  
	  var format=field.format;
	  if (format==2 || format==16) {
		// 单选
		sb.append(tek.macEdit.appendSingleField(field));
	  } else if (format==32 || format==33) {
		// 多选
		sb.append(tek.macEdit.appendCheckboxField(field));
	  } else if (format==18 || format==20) {
		// 下拉框
		sb.append(tek.macEdit.appendSelectField(field));
	  } else if (format==10) {
		// 时间
		//printTime(field, print);
	  } else if (format==0x01) {
		// 密码
		sb.append(tek.macEdit.appendPasswordField(field));
	  } else if (format==128) {
		// 对象
		sb.append(tek.macEdit.appendObjectField(field));
	  } else if (format==40) {
		// 文件
		//printBlob(field, print);
	  } else if (format==11) {
		// 多行文本
		sb.append(tek.macEdit.appendTextAreaField(field));
	  } else {
		// 单行文本
		sb.append(tek.macEdit.appendTextField(field));
	  } 
	  sb.append("</div>");
	
	  sb.append("</div>");
	}
  
	return sb;
}

//自定义显示字段区域
function appendCustomField(field,record,sb){
	if(!field || !sb)
	  return sb;
  
	var fieldname=field.name;    //域名
	if(!fieldname || fieldname.length<=0)
	  return sb;
  
	var show=field.show;    //域显示值
	if(show && show.length>0)
	  show=tek.dataUtility.stringToInputHTML(show);
	else
	  show="";
	
	sb.append("<div id='");
	sb.append(fieldname);
	sb.append("-form-group' class='form-group'>");
		sb.append("<label class='col-xs-3' style='overflow:hidden' for='");
		sb.append(fieldname);
		sb.append("'>");
		sb.append(field.display);
		sb.append("</label>");
		sb.append("<div class='col-xs-9'>");
			sb.append("<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>");
				sb.append("<input type='text' class='form-control' style='width:30%; float:left;margin:2px 0px;' id='");
				sb.append(fieldname);
				sb.append("-count' name='");
				sb.append(fieldname);
				sb.append("' value=''>");
				sb.append("<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>题数</label>");
			sb.append("</div>");
			sb.append("<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>");
				sb.append("<input type='text' class='form-control' style='width:30%; float:left;margin:2px 0px;' id='");
				sb.append(fieldname);
				sb.append("-score' name='");
				sb.append(fieldname);
				sb.append("' value=''>");
				sb.append("<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>每题分数</label>");
			sb.append("</div>");
		sb.append("</div>");
	sb.append("</div>");  
}

  
//取得fieldname字段的对象列表信息的ajax调用参数
tek.macEdit.getObjectOptionParam = function(fieldname){
	var params = {};
	params["objectName"] = "ExamsLibrary";
	params["action"] = "getList";
	params["condition"] = "exams_library_group="+groupId;

	return params;
}

//提交信息
function addNewInfo(){
	if(!myId)
		return;
	var mydata=tek.common.getSerializeObjectParameters("add_form") || {};	//转为json
	console.log(mydata);
	mydata["objectName"] = "ExamsTest";
	mydata["action"] = "addInfo";
	mydata["group_id"]=groupId;
	mydata["exams_test_owner"] = myId;
	
	//考试结果级别
	var TestLevel = mydata["exams_test_level"];
	if(TestLevel && TestLevel != ""){
		var levelSb = new StringBuffer();
		
		//获取及格最低分
		var lowScore =  $("#exams_test_level-low").val();
		if(!lowScore){
			tek.macEdit.showMessage("没有填写最低分！");
			var lowInput = document.getElementById("exams_test_level-low");
			lowInput.focus();
			
			return;
		}
		
		//获取优秀最低分
		var highScore = $("#exams_test_level-high").val();
		//获取良好最低分
		var middleScore = $("#exams_test_level-middle").val();
		
		levelSb.append("high=");
		if(tek.dataUtility.stringToInt(highScore)>0){
			levelSb.append(highScore);
		}
		levelSb.append(";");
		
		levelSb.append("middle=");
		if(tek.dataUtility.stringToInt(middleScore)>0){
			levelSb.append(middleScore);
		}
		levelSb.append(";");
		
		levelSb.append("low=");
		if(tek.dataUtility.stringToInt(lowScore)>0){
			levelSb.append(lowScore);
		}
		levelSb.append(";");
		
		if(levelSb.toString()){
			mydata["exams_test_level"] = levelSb.toString();
		}
	}
	
	//转换时间格式
	var TestStart=mydata["exams_test_start"];
	if(TestStart){
		TestStart=decodeURIComponent(TestStart);
		mydata["exams_test_start"] = getLongDateByStringDate(TestStart);
	}
	
	var TestEnd=mydata["exams_test_end"];
	if(TestEnd){
		TestEnd=decodeURIComponent(TestEnd);
		mydata["exams_test_end"] = getLongDateByStringDate(TestEnd);
	}
	
	var Duration=mydata["exams_test_duration"];
	if(Duration){
		Duration=decodeURIComponent(Duration);
		//mydata["exams_test_duration"] = getLongTimeByStringTime(Duration);
		mydata["exams_test_duration"] = parseInt(Duration)*60;
	}
    
	var value = $("#option_library").val();
	if(value!=null)
		mydata["option_library"] = value;
		
	
	var optionType = new StringBuffer();
	//随机单选题型
	var TypeSingle = mydata["option_type_single"];
	if(TypeSingle && TypeSingle != ""){
		var singleSb = new StringBuffer();
		
		//获取及格最低分
		var singleCount = tek.dataUtility.stringToInt($("#option_type_single-count").val());
		var singleScore = tek.dataUtility.stringToInt($("#option_type_single-score").val());
		if(singleCount>0 && singleScore>0){
			 var  value = singleCount+","+singleScore;
			 console.log(value);
			 mydata["option_type_single"] = value;
			 optionType.append("2;");
		}else{
			 mydata["option_type_single"] = "0,0";	
		}
	}
	
	//随机多选题型
	var TypeMultiple = mydata["option_type_multiple"];
	if(TypeMultiple && TypeMultiple != ""){
		var multipleSb = new StringBuffer();
		
		//获取及格最低分
		var multipleCount = tek.dataUtility.stringToInt($("#option_type_multiple-count").val());
		var multipleScore = tek.dataUtility.stringToInt($("#option_type_multiple-score").val());
		if(multipleCount>0 && multipleScore>0){
			 var  value = multipleCount+","+multipleScore;
			 console.log(value);
			 mydata["option_type_multiple"] = value;
			 optionType.append("4;");
		}else{
			 mydata["option_type_multiple"] = "0,0";
		}
	}
	mydata["option_type_fillblanks"] = "0,0";
	mydata["option_type_composition"] = "0,0";
	
	if(optionType){
		mydata["option_type"]= getLongTypeByStringType(optionType.toString());
	}
	
	for(var i=0;i<libraryNum;i++){
		var index = i+1;
		var value = $("#option_library"+index).val();
		if(value!=null){
			mydata["option_library"] = mydata["option_library"]+"|"+value;
		
			var type ="";
			var singleCount = tek.dataUtility.stringToInt($("#option_type_single-count"+index).val());
			var singleScore = tek.dataUtility.stringToInt($("#option_type_single-score"+index).val());
			if(singleCount>0 && singleScore>0){
				 var  value = singleCount+","+singleScore;
				 mydata["option_type_single"] = mydata["option_type_single"]+"|"+value;
				 type += "2;";
			}
			var multipleCount = tek.dataUtility.stringToInt($("#option_type_multiple-count"+index).val());
			var multipleScore = tek.dataUtility.stringToInt($("#option_type_multiple-score"+index).val());
			if(multipleCount>0 && multipleScore>0){
				 var  value = multipleCount+","+multipleScore;
				 mydata["option_type_multiple"] = mydata["option_type_multiple"]+"|"+value;
				 type += "4;";
			}
			
			mydata["option_type"]= mydata["option_type"] +"|"+getLongTypeByStringType(type);
			mydata["option_type_fillblanks"] = mydata["option_type_fillblanks"]+"|"+"0,0";
			mydata["option_type_composition"] = mydata["option_type_composition"]+"|"+"0,0";
		}
	}
	tek.macEdit.editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);	
}

//获取当前用户加入的小组
function getMyjoinGroupList(){
	var mydata = {};
	mydata["objectName"] = "Group";
	mydata["action"] = "getJoinGroupList";
	mydata["json"] = 1;
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/group",
		dataType: "json",
		data: mydata,
		beforeSend:function(){
			$("#group-info-div").append("<div id='waiting-img' class='col-md-12 col-sm-12 center'><img style='margin-top:10px;' src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' /></div>");
		},
		success: function(data) {
			//成功去除等待框
			$("#waiting-img").remove();
			
			if(data){
				if(data.code==0){
					var record = data["record"];
					if(record){
						var sb = new StringBuffer();
						sb.append("<form name='add-form' id='add-form' action=\"javascript:selectLibraryGroup('add-form');\" role='form'>");
						sb.append("<h4 class='title'>&nbsp;</h4>");
						sb.append("<div class='col-md-12 '>");
						sb.append("<div class='widget-content'>");
						
						sb.append("<div class='admin-form center'>");
						sb.append("<div class='form-group'>");
						
						sb.append("<label class='col-md-3' for='add_subject_group_select'>");
						sb.append("<span>选择小组：</span>");
						sb.append(" </label>");
						sb.append("<div class='col-md-6'>");	
						sb.append("<select class='form-control' id='add_library_group_select' name='add_library_group_select'>");
						//小组列表
						sb.append("</select>");
						sb.append("</div>");
						
						sb.append("<div class='col-md-3'>");
						sb.append("<button class='btn btn-success' type='submit'> 确 定</button> ");
						sb.append("</div>");
						
						sb.append("<div class='clearfix'></div>");
						sb.append("</div>");	
						sb.append("</div>");
						
						sb.append("</div>");
						sb.append("</div>");
						sb.append("<div class='clearfix'></div>")
						sb.append("<h4 class='title'>&nbsp;</h4>");
						
						sb.append("</form>");
						
						$("#group-info-div").html(sb.toString()); 
						
						
						var selectTarget = document.getElementById('add_library_group_select');
						if(record.length){
							for(var i in record)
								showMyjoinGroupListContent(record[i],selectTarget);
						}else{
							showMyjoinGroupListContent(record,selectTarget);
							selectLibraryGroup('add-form');
						}//end if(record.length)
				    }else{
						//未加入任何小组
						var sb = new StringBuffer();
						sb.append("<div class='admin-form center'>");
						sb.append("<h3 class='title'>");
						sb.append("未加入任何小组！ ");
						sb.append("</h3>");
						sb.append("</div>");
						$("#group-info-div").html(sb.toString());
					}//end if(record)
			    }else{
					if(data.right && data.right == 0){
						if(!myId || myId<=0)
							return goLogin();
					}
					//未加入任何小组
					var sb = new StringBuffer();
					sb.append("<div class='admin-form center'>");
					sb.append("<h3 class='title'><font color='red'>");
					sb.append(data.code);
					sb.append(" - ");
					sb.append(data.message);
					sb.append("</font></h3>");
					sb.append("</div>");
					$("#group-info-div").html(sb.toString());	
				}//end if (data.code==0)
		    }else{
				$("#group-info-div").html("<font color='red'>执行失败![data=null]</font>");
			}// end if(data)
		}, //end success: function(data)
		error: function(request) {
			var error=new StringBuffer();
			error.sppend("<font color='red'>");
			error.append("操作失败！[");
			error.append(request.status);
			error.append(" - ");
			error.append(request.statusText);
			error.append("]");
			error.append("</font>");
			$("#group-info-div").html(error.toString()); 
		},
		complete:function(){
		}
	});	
}


//显示加入的小组
function showMyjoinGroupListContent(record,selectTarget){
	if(record && selectTarget){
		var option = document.createElement('option');	
		option.value = record.id;
		if(selectTarget.innerHTML=="")
			option.checked="checked";
		option.innerHTML = record.name;	
		selectTarget.appendChild(option);
	}
}

//选择新建主题下要建的小组
function selectLibraryGroup(targetId){
	var form = document.getElementById(targetId);
	if(!form)
		return;
	var value = form.add_library_group_select.value;
	if(value && value != ""){
		groupId = value;
		$("#group-info-div").addClass("hidden");
		$("#library-info-div").removeClass("hidden");
		addNew();
	}
}

//时间类型转换
function getLongTimeByStringTime(stringTime){
	if(!stringTime)
		return;
		
	if(stringTime.indexOf(":") > 0){
		var timeArr = stringTime.split(":");
		var seconds;
		if(timeArr.length==3){
			seconds=parseInt(timeArr[0])*3600+parseInt(timeArr[1])*60+parseInt(timeArr[2])*1;
		}else if(timeArr.length==2){
			seconds=parseInt(timeArr[1])*60+parseInt(timeArr[2])*1;
		}else if(timeArr.length==1){
			seconds=parseInt(timeArr[2])*1;
		}

		//seconds = tek.dataUtility.stringToInt(seconds);
		
		return seconds;
	}
}

//日期类型转换
function getLongDateByStringDate(stringDate){
	var newStringDate = stringDate;
	if(newStringDate){
		if(newStringDate.indexOf("+") > 0)
			newStringDate = replaceMyString(newStringDate,"+"," ");
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

//转换随机题类型
function getLongTypeByStringType(type){
	if(!type)
		return;
	var option_type = 0x00;
	if(type.indexOf("1")>=0)
		option_type = option_type | 0x01;
	if(type.indexOf("2")>=0)
		option_type = option_type | 0x02;
	if(type.indexOf("4")>=0)
		option_type = option_type | 0x04;
	if(type.indexOf("8")>=0)
		option_type = option_type | 0x08;
	if(type.indexOf("16")>=0)
		option_type = option_type | 0x10;

	return option_type;
}

//---------------------------------------------获取可选题库列表-------------------------
function addLibrary(){
	var parent = document.getElementById("add-info");
	if(!parent)
		return;
	libraryNum++;
	var html = "";
	html += "<div id='option_library-form-group"+libraryNum+"' class='form-group'>";
	html += "<label class='col-xs-3' style='overflow:hidden' for='option_library"+libraryNum+"'>随机试题的题库</label>";
	html += "<div class='col-xs-9'>";
	html += "<input id='option_library"+libraryNum+"' class='form-control' value='' type='hidden'>";//存随机题库的id
	html += "<input id='option_library-input"+libraryNum+"' class='form-control dropdown-toggle' value='' data-toggle='dropdown' autocomplete='off' onfocus='changeObjectOption(event,&quot;option_library"+libraryNum+"&quot;,this.value,"+libraryNum+");' onkeyup='changeObjectOption(event,&quot;option_library&quot;,this.value,"+libraryNum+");' type='text'>";
	html += "<ul id='option_library-option"+libraryNum+"' class='dropdown-menu col-xs-12' style='margin-left:15px;'></ul>";
	html += "</div>";
	/*html += "<div class='col-xs-2'>";
	html += "<a href='javascript:void(0);' onclick='deleteLibrary("+libraryNum+")'>删除</a>";
	html += "</div>";*/
	html += "<div id='option_library_remark"+libraryNum+"' class='col-xs-9'></div>";
	html += "</div>";
	
	html += "<div id='option_type_single-form-group"+libraryNum+"' class='form-group'>";
	html += "<label class='col-xs-3' style='overflow:hidden' for='option_type_single"+libraryNum+"'>单选题</label>";
	html += "<div class='col-xs-9'>";
	html += "<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>";
	html += "<input class='form-control' style='width:30%; float:left;margin:2px 0px;' id='option_type_single-count"+libraryNum+"' name='option_type_single"+libraryNum+"' value='' type='text'>";
	html += "<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>题数</label>";
	html += "</div>";
	html += "<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>";
	html += "<input class='form-control' style='width:30%; float:left;margin:2px 0px;' id='option_type_single-score"+libraryNum+"' name='option_type_single"+libraryNum+"' value='' type='text'>";
	html += "<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>每题分数</label>";
	html += "</div>";
	html += "</div></div>";
	
	html += "<div id='option_type_multiple-form-group"+libraryNum+"' class='form-group'>";
	html += "<label class='col-xs-3' style='overflow:hidden' for='option_type_multiple"+libraryNum+"'>多选题</label>";
	html += "<div class='col-xs-9'>";
	html += "<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>";
	html += "<input class='form-control' style='width:30%; float:left;margin:2px 0px;' id='option_type_multiple-count"+libraryNum+"' name='option_type_multiple"+libraryNum+"' value='' type='text'>";
	html += "<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>题数</label>";
	html += "</div>";
	html += "<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>";
	html += "<input class='form-control' style='width:30%; float:left;margin:2px 0px;' id='option_type_multiple-score"+libraryNum+"' name='option_type_multiple"+libraryNum+"' value='' type='text'>";
	html += "<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>每题分数</label>";
	html += "</div>";
	html += "</div></div>";
	
	$("#add-info").append(html);
}


function changeObjectOption(event, fieldname, val,index) {

	event = event || window.event;
	if (event) {
		searchTimeStamp = event.timeStamp;
		setTimeout(function () {    //设时延迟0.5s执行
			if (searchTimeStamp - event.timeStamp == 0)
				searchObjectOption(fieldname, val ,index);
		}, 500);
	}
};


function searchObjectOption(fieldname, val ,index) {
	if (val && val.length > 0) {
		$("#" + fieldname + "-option"+index).show();

		var loadingImg = "<li class='center'><img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...</li>";
		$("#" + fieldname + "-option"+index).html(loadingImg);

		var sendData;
		if (typeof tek.macEdit.getObjectOptionParam == "function")
			sendData = tek.macEdit.getObjectOptionParam(fieldname);

		var ajaxURL;
		if (typeof tek.macEdit.getObjectOptionUrl == "function")
			ajaxURL = tek.macEdit.getObjectOptionUrl(fieldname);
		if (!ajaxURL)
			ajaxURL = tek.common.getRootPath() + "servlet/tobject";

		if (!sendData || !ajaxURL) {
			$("#" + fieldname + "-option"+index).html("<li class='center'><font color='red'>无法得到检索参数!</font></li>");
			return;
		}

		var maxcount = 5;
		sendData["count"] = maxcount;
		sendData["quick-search"] = encodeURIComponent(val);

		var setting = {};//operateType: "检索输入信息"};

		var callback = {
			success: function (data) {
				// 操作成功
				var records = data["record"];
				if (records) {
					// 对象数组化
					records = tek.type.isArray(records) ? records : [records];

					var html = "";
					for (var i in records)
						html += appendObjectOptionRecord(records[i], fieldname,index);

					// 检索结果多余maxcount，显示“...”
					if (records.length > maxcount)
						html += "<li>...</li>";

					$("#" + fieldname + "-option"+index).html(html);
				} else {
					$("#" + fieldname + "-option"+index).html("<li class='center'>没有数据!</li>");
				}
			},
			error: function (data, message) {
				$("#" + fieldname + "-option"+index).html(message);
			}
		};

		tek.common.ajax(ajaxURL, setting, sendData, callback);
	} else {
		$("#" + fieldname+index).val("0");
		$("#" + fieldname + "-option"+index).hide();
	}
};
	
	
function appendObjectOptionRecord(record, fieldname,index) {
	var html = "";

	if (record && record.id && record.name) {
		html += "<li><a href='#' onClick='selectObjectOption(\"" + fieldname + "\", \"" + record.id + "\", \"" + record.name + "\", \"" + index + "\")'>"
			+ record.name + "</a></li>";
	}

	return html;
};	

function selectObjectOption(fieldname, id, name,index) {
	$("#" + fieldname + "-input"+index).val(name);
	$("#" + fieldname+index).val(id);
	$("#" + fieldname + "-option"+index).hide();
	
	if (typeof customSelectObjectOption == "function")
    	customSelectObjectOption(fieldname, id, name,index);
};

//删除题库
function deleteLibrary(){
	//删除题库区域
	$('#option_library-form-group'+libraryNum).remove();
	$('#option_type_single-form-group'+libraryNum).remove();
	$('#option_type_multiple-form-group'+libraryNum).remove();
	
	libraryNum--;
}
/*function getLibraryList(){
	if(!groupId){
		tek.macCommon.waitDialogShow(null, "没有选择选组信息!");
		return;
	}
	
	var setting = {
        operateType: '获取题库列表'
    };
    var sendData = {
		objectName: 'ExamsLibrary', 
		action: 'getList', 
		group_id : groupId,
		order: 'createTime',
		desc:1
	};
	
    var callback = {
        success: function(data) {
            //tek.macCommon.waitDialogShow("<font color='red'>操作成功</font>", "获取题库列表成功!", null, 0);
            //tek.macCommon.waitDialogHide(2000);
			
			// 操作成功
			showLibraryData(data);
        },
        error: function(data, errorMsg) {
            tek.macCommon.waitDialogShow("<font color='red'>" + errorMsg + "</font>",null, 0);
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath()+"servlet/tobject", setting, sendData, callback);
			
	
}*/

/**
 * 显示数据
 * @param {Object} data 服务器Servlet返回的数据结果
 */
/*function showLibraryData(data){
	// 清空原数据
	$("#library-info").html("");

	// 取得record并数组化
	var records = records || data["record"];
	if (!records) {
		$("#library-info").html("没有数据!");
		return;
	}
	records = tek.type.isArray(records) ? records : [records];

	if (!tek.type.isArray(records) || records.length <= 0) {
		$("#library-info").html("没有数据!");
		return;
	}

	
	var html ="";
	html += "<div class='col-xs-12'>";
	for (var i in records){
		var record = records[i];
		if(record.id && record.name){
			html += "<div class='col-xs-6'>";
			html += "<input id='exams_library_name-"+record.id+"' class='col-xs-1' name='exams_library_name' type='checkbox' onchange='clickLibCheckbox(this)'>";
			html += "<label class='col-xs-11' for='exams_library_name-"+record.id+"'>"+record.name+"</label>";
			html += "</div>";
		}
	}
	html += "</div>";
	$("#library-info").html(html);
};*/


//选择题库
/*function selectLibrary(){
	//取得选中的题库的id
	
}*/

//点击题库多选框
function clickLibCheckbox(inputEle) {
	if (!tek.type.isElement(inputEle))
		return;

	var p = inputEle.parentNode.parentNode;
	if (!p)
		return;

	var arr = $(p).find("input[type='checkbox']");
	if (arr && arr.length > 0) {
		var selValue = inputEle.value;
		for (var i = 0; i < arr.length; i++) {
			if (selValue == 0) {
				if (arr[i].value != 0)
					arr[i].checked = "";
				else
					arr[i].checked = "checked";
			} else {
				if (arr[i].value == 0)
					arr[i].checked = "";
			}
		}
	}
};

//-----------------------------------------------------------------------------------
// 执行页面自定义的初始化按钮函数  --mac-edit.js中调用中调用
tek.macEdit.initialCustomButton = function (parentId) {
	var html = "<button type='submit' id='submitBtn' class='btn btn-danger'>提交</button>";

	if (showClose == 1) {
		//显示关闭按钮
		html += "<button type='button' id='closeBtn' class='btn btn-info' onclick='tek.common.closeWithConfirm();'>关闭</button>";
	} else if (callbackURL) {
		//显示返回按钮
		html += "<button type='button' id='callbackBtn' class='btn btn-success' onclick='tek.common.callbackWithConfirm(callbackURL)'>返回</button>";
	} else {
		// 显示“提交”、“重置”
		html += "<button type='reset' class='btn btn-success col-xs-3'>重置</button>";
	}

	$("#" + parentId).html(html);
};

 /**
   * 选择对象查询结果的处理
   * @param {String} fieldname 执行对象查询的字段名
   * @param {String} id 选择的对象信息标识
   * @param {String} name 选择的对象信息名称
   */
function customSelectObjectOption(fieldname, id, name,index){
	if(!fieldname && !id && !name)
		return;
	if(index>0){
		$("#option_library-form-group"+index).append("<div id='option_library_remark"+index+"' class='col-xs-9'></div>");
	}
	else{
		$("#option_library-form-group").append("<div id='option_library_remark' class='col-xs-9'></div>");
	}
	
	//获取单选题题数
	getLibraryContainQuetions(id, 2,"单选题",index);
	//获取多选题题数
	getLibraryContainQuetions(id, 4,"多选题",index);
}

tek.macEdit.customSelectObjectOption = function (fieldname, id, name){

	if(!fieldname && !id && !name){
		return;
	}
	$("#option_library-form-group").append("<div id='option_library_remark' class='col-xs-9'></div>");
	$("#option_library_remark").html("");
	//获取单选题题数
	getLibraryContainQuetions(id, 2,"单选题",0);
	//获取多选题题数
	getLibraryContainQuetions(id, 4,"多选题",0);
}


//题库包含题型的数量
function getLibraryContainQuetions(library_id, type, name,index) {
    var setting = {operateType: "获取发布者发布主题数"};
    var sendData = {
        objectName: "ExamsQuestion",
        action: "getTotal",
        exams_library_id:library_id,
		exams_question_type:type
    };
    var callback = {
        success: function (data) {
			if(index>0)
        		$("#option_library_remark"+index).append("<label class='col-xs-12' style='float:left; width:100%; overflow:hidden'>（此题库"+name+""+data.value+"道）</label>");
			else
				$("#option_library_remark").append("<label class='col-xs-12' style='float:left; width:100%; overflow:hidden'>（此题库"+name+""+data.value+"道）</label>");
        },
        error: function (data, errorMsg) {
            showError(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示错误的信息
function showError(message) {
    var html = "<label class='col-xs-12' style='float:left; width:100%; overflow:hidden'>"+message+"</label>";
    $("#option_library_remark").html(html);
}
//-----------------------------------------------------End-------------------------------------
