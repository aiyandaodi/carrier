// JavaScript Document
/**************************************************
 *	编辑试卷页面 edit.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================
var test_id;  //获取试卷id
var groupId; //获取小组
//显示字段数组
var items = new Array("exams_test_name","exams_test_grade","exams_test_score","exams_test_read","exams_test_write","exams_test_exam","exams_test_start","exams_test_end","exams_test_duration","exams_test_status","exams_test_method","exams_test_level","exams_test_summary","option_library","option_type_single","option_type_multiple");
var libraryNum = 0;
//=====================================================Function===============================
/**
 * 初始化
 */
function init(){
  test_id=request["exams_test_id"];
  groupId=request["group_id"];
  
  tek.macEdit.initialCustomButton("btn");
  
  editNew(test_id); 
}
  
//获得显示的字段
function editNew(test_id){
	
	var params={};
	params["objectName"]="ExamsTest";
	params["action"]="getEdit";
	params["exams_test_id"]=test_id;
  
	getTestEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"add-info");

}


//提交信息
function setNewInfo(test_id){
	var mydata=tek.common.getSerializeObjectParameters("set_form") || {};	//转为json
	mydata["objectName"] = "ExamsTest";
	mydata["action"] = "setInfo";
	mydata["exams_test_id"]=test_id;
  
	if(groupId && groupId != ""){
		  mydata["exams_test_group"]=groupId;
	}
	mydata["exams_test_owner"] = myId;
	
	//考试结果级别
	var TestLevel = mydata["exams_test_level"];
	if(TestLevel && TestLevel != ""){
		var levelSb = new StringBuffer();
		
		//获取及格最低分
		var lowScore =  $("#exams_test_level-low").val();
		if(!lowScore){
			showMessage("没有填写最低分！");
			var lowInput = document.getElementById("exams_test_level-low");
			lowInput.focus();
			
			return;
		}
		
		//获取优秀最低分
		var highScore = $("#exams_test_level-high").val();
		//获取良好最低分
		var middleScore = $("#exams_test_level-middle").val();
		
		levelSb.append("high=");
		if(tek.dataUtility.stringToInt(highScore)){
			levelSb.append(highScore);
		}
		levelSb.append(";");
		
		levelSb.append("middle=");
		if(tek.dataUtility.stringToInt(middleScore)){
			levelSb.append(middleScore);
		}
		levelSb.append(";");
		
		levelSb.append("low=");
		if(tek.dataUtility.stringToInt(lowScore)){
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
		
		//单选题s题数
		var singleCount = tek.dataUtility.stringToInt($("#option_type_single-count").val());
		var singleScore = tek.dataUtility.stringToInt($("#option_type_single-score").val());
		if(singleCount>0 && singleScore>0){
			 var  value = singleCount+","+singleScore;
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
		
		//多选题
		var multipleCount = tek.dataUtility.stringToInt($("#option_type_multiple-count").val());
		var multipleScore = tek.dataUtility.stringToInt($("#option_type_multiple-score").val());
		if(multipleCount>0 && multipleScore>0){
			 var  value = multipleCount+","+multipleScore;
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
	console.log(mydata)
	tek.macEdit.editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);
}

//获取编辑信息
function getTestEdit(ajaxURL,params,items,parentId){
	var parent=document.getElementById(parentId);
	if(!parent)
	  return;
  
	//显示读取数据等待框
	var html= new StringBuffer();
	html.append("<img src='");
	html.append(tek.common.getRelativePath());
	html.append("http/images/waiting-small.gif'/>&nbsp;正在获取数据...");
	tek.macEdit.showReadMessage(html.toString(),parent);
  
	$.ajax({
		type: "post",
		url: ajaxURL,
		dataType: "json",
		async:true,
		data: params,
		beforeSend: function() {
			parent.innerHTML="";
		},
		success:function(data){
		  if(data){
			if (data.code==0){
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
				
				/*var $duration = $("#datetimepicker-exams_test_duration");
				if($duration){
					$duration.datetimepicker({
						format: 'HH:mm:ss'
					});
				}*/
				
				
			  } else {
				// 自定义输入框
				tek.macEdit.defaultOperation(data,parent);
			  }
			} else {
			  var error=new StringBuffer();
			  error.append("<font color='red'>");
			  if(data.code)
				error.append(data.code);
			  error.append(" - ");
			  if(data.message)
				error.append(tek.dataUtility.stringToHTML(data.message));
			  error.append("</font>");
			  tek.macEdit.showReadMessage(error.toString(),parent);
			}
			
		  } else {
			tek.macEdit.showReadMessage("<font color='red'>操作失败![data=null]</font>",parent);
		  }
		},
  
		error: function(request) {
		  var error=new StringBuffer();
		  error.append("<font color='red'>");
		  error.append("操作失败![");
		  if(request.status)
			error.append(request.status);
		  error.append(" - ");
		  if(request.response)
			error.append(request.response);
		  error.append("]");
		  error.append("</font>");
		  tek.macEdit.showReadMessage(error.toString(),parent);
		}
	});
}

//自定义输入框
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
		  	for(var i=0; i<items.length; i++){
			  	if(items[i]=="option_library" || items[i]=="option_type_single" || items[i]=="option_type_multiple"){
			  		continue;
			  	}
			  	
    	  	  appendCustomEditField(record[items[i]],record, sb);	
		  	}
		  
		  //显示题库部分
		  var html = "";
		  if(record.option_library){
			  html = getLibraryToHtml(record);
			  if(html)
			  	sb.append(html);
		  }
		  	
		  parent.innerHTML=sb.toString();

		}
	}

}

//题库信息转换为html
function getLibraryToHtml(record){
	if(!record)
		return;
	
	var fieldLib = record.option_library;
	var fieldSig = record.option_type_single;
	var fieldMul = record.option_type_multiple;
	
	if(!fieldLib || !fieldSig || !fieldMul)
		return;
	var fieldname = fieldLib.name;    //域名
	var fieldSigname = fieldSig.name;    //域名
	var fieldMulname = fieldMul.name;    //域名
		
	if(!fieldLib.value || !fieldSig.value || !fieldMul.value)
		return;
	
	var arrVal = tek.dataUtility.stringToArray(fieldLib.value, "|");
	var arrShow = tek.dataUtility.stringToArray(fieldLib.show, "|");
	var arrVal_single = tek.dataUtility.stringToArray(fieldSig.value, "|");
	var arrVal_multiple = tek.dataUtility.stringToArray(fieldMul.value, "|");
	var html = "";
	if((arrVal.length >0) && (arrVal.length == arrVal_single.length)
		&& (arrVal_single.length == arrVal_multiple.length)){
		libraryNum = arrVal.length-1;
		var index = "";
		for(var i=0;i<arrVal.length;i++){
			
			if(i>0){
				index=i;
			}
				
			html += "<div id='"+fieldname+"-form-group"+index+"' class='form-group'>";
			html += "<label class='col-xs-3' style='overflow:hidden' for='"+fieldname+index+"'>"+fieldLib.display+"</label>";
			//显示题库的名字
			html += "<div class='col-xs-9'>";
			html += "<input id='"+fieldname+index+"' class='form-control' value='"+arrVal[i]+"' type='hidden'>";//存随机题库的id
			
			if(arrShow){
				if(index){
					html += "<input id='"+fieldname+"-input"+index+"' class='form-control dropdown-toggle' value='"+arrShow[i]+"' data-toggle='dropdown' autocomplete='off' onfocus='changeObjectOption(event,&quot;option_library&quot;,this.value,"+index+");' onkeyup='changeObjectOption(event,&quot;option_library&quot;,this.value,"+index+");' type='text'>";
				}else{
					html += "<input id='"+fieldname+"-input"+index+"' class='form-control dropdown-toggle' value='"+arrShow[i]+"' data-toggle='dropdown' autocomplete='off' onfocus='tek.macEdit.changeObjectOption(event,&quot;option_library&quot;,this.value);' onkeyup='tek.macEdit.changeObjectOption(event,&quot;option_library&quot;,this.value);' type='text'>";
				}
																																												// changeObjectOption(event,&quot;option_library"+libraryNum+"&quot;,this.value,"+libraryNum+")
			}
			
			
			html += "<ul id='"+fieldname+"-option"+index+"' class='dropdown-menu col-xs-12' style='margin-left:15px;'></ul>";
			html += "</div>";
			/*html += "<div class='col-xs-2'>";
			html += "<a href='javascript:void(0);' onclick='deleteLibrary("+index+")'>删除</a>";
			html += "</div>";*/
			/*html += "<div id='"+fieldname+"_remark"+index+"' class='col-xs-9'></div>";*/
			html += "</div>";
			
			//显示单选题
			if(arrVal_single[i]){
				var arr = tek.dataUtility.stringToArray(arrVal_single[i], ",");
				if(arr && arr.length==2){
					html += "<div id='"+fieldSigname+"-form-group"+index+"' class='form-group'>";
					html += "<label class='col-xs-3' style='overflow:hidden' for='"+fieldSigname+index+"'>单选题</label>";
					html += "<div class='col-xs-9'>";
					html += "<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>";
					html += "<input class='form-control' style='width:30%; float:left;margin:2px 0px;' id='"+fieldSigname+"-count"+index+"' name='"+fieldSigname+index+"' value='"+arr[0]+"' type='text'>";
					html += "<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>题数</label>";
					html += "</div>";
					html += "<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>";
					html += "<input class='form-control' style='width:30%; float:left;margin:2px 0px;' id='"+fieldSigname+"-score"+index+"' name='"+fieldSigname+index+"' value='"+arr[1]+"' type='text'>";
					html += "<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>每题分数</label>";
					html += "</div>";
					html += "</div></div>";
				}
			}
			
			if(arrVal_multiple[i]){
				var arr = tek.dataUtility.stringToArray(arrVal_multiple[i], ",");
				if(arr && arr.length==2){
					html += "<div id='"+fieldMulname+"-form-group"+index+"' class='form-group'>";
					html += "<label class='col-xs-3' style='overflow:hidden' for='"+fieldMulname+index+"'>多选题</label>";
					html += "<div class='col-xs-9'>";
					html += "<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>";
					html += "<input class='form-control' style='width:30%; float:left;margin:2px 0px;' id='"+fieldMulname+"-count"+index+"' name='"+fieldMulname+index+"' value='"+arr[0]+"' type='text'>";
					html += "<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>题数</label>";
					html += "</div>";
					html += "<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>";
					html += "<input class='form-control' style='width:30%; float:left;margin:2px 0px;' id='"+fieldMulname+"-score"+index+"' name='"+fieldMulname+index+"' value='"+arr[1]+"' type='text'>";
					html += "<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>每题分数</label>";
					html += "</div>";
					html += "</div></div>";
				}
			}
		}
	}
	return html;

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
			
			var lowScore;
			var middleScore;
			var highScore;
			if(field.show){
				var scoreHash={};
				scoreHash = tek.dataUtility.stringToHash(field.show); 
				
				lowScore = scoreHash["low"];
				middleScore = scoreHash["middle"];
				highScore = scoreHash["high"];
			}
			
			sb.append("<div class='col-xs-9'>");
				sb.append("<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>");
					sb.append("<input type='text' class='form-control' style='width:30%; float:left;margin:2px 0px;' id='exams_test_level-high' name='exams_test_level' value='");
					if(highScore){
						sb.append(highScore);
					}
					sb.append("'>");
					sb.append("<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>优秀最低分</label>");
				sb.append("</div>");
				sb.append("<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>");
					sb.append("<input type='text' class='form-control' style='width:30%; float:left;margin:2px 0px;' id='exams_test_level-middle' name='exams_test_level' value='");
					if(middleScore){
						sb.append(middleScore);
					}
					sb.append("'>");
					sb.append("<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>良好最低分</label>");
				sb.append("</div>");
				sb.append("<div class='col-xs-12' style='overflow:hidden; padding:0px 5px'>");
					sb.append("<input type='text' class='form-control' style='width:14.5%; float:left;margin:2px 0px;' id='exams_test_level-low' name='exams_test_level' value='");
					if(lowScore){
						sb.append(lowScore);
					}
					sb.append("'>");
					sb.append("<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>及格最低分");
					sb.append("<span style='color:#c9302c;'>*必填</span>");
					sb.append("</label>");
					
				sb.append("</div>");
			sb.append("</div>");
		sb.append("</div>");
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
	  if(fieldname == "exams_test_duration"){
		 //value = formatSeconds(field.value);
		 value = parseInt(field.value)/60;
		 sb.append(value);
	  }else{
		 sb.append(show);
	  }
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
	  
	  sb.append("<div class='col-xs-9'>");// style='overflow:hidden'>");
	  
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
	
	var count;
	var score;
	if(show){
		var array={};
		array = tek.dataUtility.stringToArray(show,","); 
		
		if(array.length==2){
			count = tek.dataUtility.stringToInt(array[0]);
			score = tek.dataUtility.stringToInt(array[1]);
		}
	}
	
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
				sb.append("' value='");
				if(count>0){
					sb.append(count);
				}
				sb.append("'>");
				sb.append("<label class='col-xs-11' style='float:left; width:70%; overflow:hidden'>题数</label>");
			sb.append("</div>");
			sb.append("<div class='col-xs-6' style='overflow:hidden; padding:0px 5px'>");
				sb.append("<input type='text' class='form-control' style='width:30%; float:left;margin:2px 0px;' id='");
				sb.append(fieldname);
				sb.append("-score' name='");
				sb.append(fieldname);
				sb.append("' value='");
				if(score>0){
					sb.append(score);	
				}
				sb.append("'>");
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


function formatSeconds(value) {
	var theTime = parseInt(value);// 秒
	var theTime1 = 0;// 分
	var theTime2 = 0;// 小时

	if(theTime >= 60) {
		theTime1 = parseInt(theTime/60);
		theTime = parseInt(theTime%60);
		if(theTime1 >= 60) {
			theTime2 = parseInt(theTime1/60);
			theTime1 = parseInt(theTime1%60);
		}
	}
	
	var sb = new StringBuffer();
	var result;
	if(theTime > 0) {
		if(parseInt(theTime)<10){
			sb.append("0");
		}
		sb.append(parseInt(theTime));
	}else{
		sb.append("00");
	}
	
	result = sb.toString();
	sb = new StringBuffer();
	
	if(theTime1 > 0) {
		if(parseInt(theTime1)<10){
			sb.append("0");
		}
		sb.append(parseInt(theTime1));
		sb.append(":");
		sb.append(result);
	}else{
		sb.append("00");
		sb.append(":");
		sb.append(result);
	}
	
	result = sb.toString();
	sb = new StringBuffer();
	
	if(theTime2 > 0) {
		if(parseInt(theTime2)<10){
			sb.append("0");
		}
		sb.append(parseInt(theTime2));
		sb.append(":");
		sb.append(result);
	}else{
		sb.append("00");
		sb.append(":");
		sb.append(result);
	}
	
	return sb.toString();
} 

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
	if(index>0)	{
		$("#option_library-form-group"+index).append("<div id='option_library_remark"+index+"' class='col-xs-offset-3 col-xs-9'></div>");
		$("#option_library_remark"+index).html("");
	}else{
		$("#option_library-form-group").append("<div id='option_library_remark' class='col-xs-offset-3 col-xs-9'></div>");
		$("#option_library_remark").html("");
	}
	
	
	//获取单选题题数
	getLibraryContainQuetions(id, 2,"单选题",index);
	//获取多选题题数
	getLibraryContainQuetions(id, 4,"多选题",index);
}

tek.macEdit.customSelectObjectOption = function (fieldname, id, name){
	if(!fieldname && !id && !name)
		return;
	$("#option_library-form-group").append("<div id='option_library_remark' class='col-xs-offset-3 col-xs-9'></div>");
	
	//清楚之前的数据
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
			if(index>0){
        		$("#option_library_remark"+index).append("<label class='col-xs-12' style='float:left; width:100%; overflow:hidden'>（此题库"+name+""+data.value+"道）</label>");
			}else{
				$("#option_library_remark").append("<label class='col-xs-12' style='float:left; width:100%; overflow:hidden'>（此题库"+name+""+data.value+"道）</label>");
			}
        },
        error: function (data, errorMsg) {
            showError(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

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
	/*html += "<div id='option_library_remark"+libraryNum+"' class='col-xs-9'></div>";*/
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
					if (records.length > maxcount){
						html += "<li>...</li>";
					}
					if(index>0){
						$("#" + fieldname + "-option"+index).html(html);
					}
					else{
						$("#" + fieldname + "-option").html(html);
					}
				} else {
					if(index>0){
						$("#" + fieldname + "-option"+index).html("<li class='center'>没有数据!</li>");
					}
					else{
						$("#" + fieldname + "-option").html("<li class='center'>没有数据!</li>");
					}
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

	if(index>0){
		if (record && record.id && record.name) {
			html += "<li><a href='#' onClick='selectObjectOption(\"" + fieldname + "\", \"" + record.id + "\", \"" + record.name + "\", \"" + index + "\")'>"
				+ record.name + "</a></li>";
		}
	}else{
		if (record && record.id && record.name) {
			html += "<li><a href='#' onClick='selectObjectOption(\"" + fieldname + "\", \"" + record.id + "\", \"" + record.name + "\",0)'>"
				+ record.name + "</a></li>";
		}
	}
	return html;
};	

function selectObjectOption(fieldname, id, name,index) {
	if(index>0){
		$("#" + fieldname + "-input"+index).val(name);
		$("#" + fieldname+index).val(id);
		$("#" + fieldname + "-option"+index).hide();
	}else{
		$("#" + fieldname + "-input").val(name);
		$("#" + fieldname).val(id);
		$("#" + fieldname + "-option").hide();
	}
	
	if (typeof customSelectObjectOption == "function")
    	customSelectObjectOption(fieldname, id, name,index);
};

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


//显示错误的信息
function showError(message) {
    var html = "<label class='col-xs-12' style='float:left; width:100%; overflow:hidden'>"+message+"</label>";
    $("#option_library_remark").html(html);
}
//-----------------------------------------------------End-------------------------------------

//-----------------------------------------------------End-------------------------------------