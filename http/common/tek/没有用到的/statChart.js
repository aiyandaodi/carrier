/***************************************************************************************************
 * 说明：                                                                               
 *   该JS文件用于使用macadmin-5.0样式生成的标准化统计图页面。（需要加载dataUtility.js）                                     
 *-------------------------------------------------------------------------------------------------
 * 页面需要初始化的参数：
 *     timeFields - 时间域名数组。例如：
 *                  timeFields=new Array();
 *                  timeFields.push('qrcertify_time');
 *------------------------------------------------------------------------------------------------
 * 公共参数&函数：
 *     function statChart(ajaxURL, ajaxParams); - 生成统计图。
 *     function waitingMessage(msg,timerMsg); - 设置等待框显示信息显示。
 *     function timeCounting(stat,seconds); - 倒计时，结束时执行stat语句。
 ***************************************************************************************************/
  
var timeFields=new Array();    // 时间域名数组

/**
 * 生成统计图
 *
 * @param ajaxURL
 *           ajax地址
 * @param ajaxParams
 *           ajax参数
 */
function statChart(ajaxURL, ajaxParams) {
  var html= new StringBuffer();
  html.append("<img src='../../js/");
  html.append(tek.common.getRelativePath());
  html.append("http/images/waiting-small.gif'/> 正在生成统计图...");
  waitingMessage(html.toString());
  $("#waiting-modal-dialog").modal("show",null,2);

  var groupField=$("#group-field").val();
  var reportField=$("#report-field").val();
  if (!groupField || !reportField || groupField==reportField){
    // 报告域、统计域错误
    waitingMessage("<font color='red'>报告域或统计域错误!</font>");
    timeCounting();
    return;
  }
  
  var charType=$("input[name='chart_type']:checked").val();
  if(!charType){
    // 统计图错误
    waitingMessage("<font color='red'>未选择统计图!</font>");
    timeCounting();
    return;
  }

  var params=objectCopy(ajaxParams,objectCopy(request));
  
  params["group-field"]=groupField;
  params["report-field"]=reportField;
  params["chart_type"]=charType;
  
  if($("#time-mode-div").css("display")!="none") {
    // 设置时间判断参数
    var startYear=$("#startYear").val();
    var startMonth=$("#startMonth").val();
    var startDay=$("#startDay").val();
    var endYear=$("#endYear").val();
    var endMonth=$("#endMonth").val();
    var endDay=$("#endDay").val();

    var start,end;
	
	var timeMode=$("input[name='time-mode']:checked").val();
	if(timeMode==40){
      // 按年
	  start=getMinTimeInMillis(startYear);
	  end=getMaxTimeInMillis(endYear);
	  
	}else if(timeMode==36){
      // 按月
	  startMonth=startMonth-1;
	  endMonth=endMonth-1;
	  start=getMinTimeInMillis(startYear,startMonth);
	  end=getMaxTimeInMillis(endYear,endMonth);
	}else if(timeMode==33){
      // 按日
	  startMonth=startMonth-1;
	  endMonth=endMonth-1;
	  start=getMinTimeInMillis(startYear,startMonth,startDay);
	  end=getMaxTimeInMillis(endYear,endMonth,endDay);
	}
	
	if(!start || !end || start>=end){
      waitingMessage("<font color='red'>时间输入错误!</font>");
      timeCounting();
      return;
	}
	
	params["time-mode"]=timeMode;
	params["time-start"]=start;
	params["time-end"]=end;
  }

  $.ajax({
    type: "post",
    url: ajaxURL,
    dataType: "json",
    data: params,

    success: function(data) {
        if(data){
          if (data.code==0) {
			// 操作成功
			var blob=data.blob;
			if(blob){
			  $("#stat-condition").hide();

			  var sb=new StringBuffer();
			  sb.append("<img src='../../js/");
			  sb.append(tek.common.getRelativePath());
			  sb.append("http/system/download.jsp?file-path=");
			  sb.append(encodeURIComponent(blob.path+"/"+blob.filename));
		      sb.append("'/>");
			  sb.append("<div style='text-align:center;'>");
			  sb.append("<img style='margin:5px 10px;' src='../../js/");
              sb.append(tek.common.getRelativePath());
              sb.append("http/images/zoomOut-24.gif' name='zoomOut' onClick='statistic(-1);'/>");
			  sb.append("<img style='margin:5px 10px;' src='../../js/");
              sb.append(tek.common.getRelativePath());
			  sb.append("http/images/zoomIn-24.gif' name='zoomIn' onClick='statistic(1);'/>");
			  sb.append("</div>");
              $("#stat-img").html(sb.toString());

              $("#waiting-modal-dialog").modal("hide");
            }else{
              waitingMessage("<font color='red'>无法获取统计图!</font>");
              timeCounting();
			}
			
		  } else{
			// 操作错误
            var error=new StringBuffer();
            error.append("<font color='red'>");
            if(data.code)
              error.append(data.code);
            error.append(" - ");
            if(data.message)
              error.append(stringToHTML(data.message));
            error.append("</font>");
            waitingMessage(error.toString());
            timeCounting();
          }
        } else{
            waitingMessage("<font color='red'>操作失败![data=null]</font>");
            timeCounting();
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
        waitingMessage(error.toString());
        timeCounting();
    },
	
	complete: function() {
	}
  });
}

/**
 * 改变分组域
 */
function changeGroupField() {
  var field=$("#group-field").val();
  
  var flag=false;
  
  if(field&&timeFields){
    for(var i in timeFields){
      if(timeFields[i]==field){
        flag=true;
		break;
	  }
	}
  }
  
  if(flag){
	$("#time-mode-div").show();
    $("#start-div").show();
    $("#end-div").show();
  } else {
	$("#time-mode-div").hide();
    $("#start-div").hide();
    $("#end-div").hide();
  }
}

/**
 * 改变报告域
 */
function changeReportField() {
  var field=$("#report-field").val();
  if(field=="default"){
    $("#chart_type_pie").show();
	$("#chart_type_pie_label").show();
    $("#chart_type_ring").show();
    $("#chart_type_ring_label").show();
    $("#chart_type_line").hide();
    $("#chart_type_line_label").hide();
    var charType=$("input[name='chart_type']:checked").val();
	if(charType==$("#chart_type_line").val())
      $("#chart_type_pie").attr("checked","checked");

  }else{
    $("#chart_type_pie").hide();
    $("#chart_type_pie_label").hide();
    $("#chart_type_ring").hide();
    $("#chart_type_ring_label").hide();
    $("#chart_type_line").show();
    $("#chart_type_line_label").show();
    var charType=$("input[name='chart_type']:checked").val();
	if(charType==$("#chart_type_pie").val() || charType==$("#chart_type_ring").val())
      $("#chart_type_bar").attr("checked","checked");
  }
}

/**
 * 选择统计时间模式
 *
 * @param timeMode
 *           时间模式值（40 - 按年；36 - 按月；33 - 按日）
 */
function selectTimeMode(timeMode) {
  if(timeMode==40) {
    //按年
    $("#startMonth").val("");
    $("#startMonth").attr("disabled","disabled");
    $("#startDay").val("");
    $("#startDay").attr("disabled","disabled");

    $("#endMonth").val("");
    $("#endMonth").attr("disabled","disabled");
    $("#endDay").val("");
    $("#endDay").attr("disabled","disabled");
  } else if(timeMode==36) {
    //按月
    $("#startMonth").removeAttr("disabled");
    $("#startDay").val("");
    $("#startDay").attr("disabled","disabled");

    $("#endMonth").removeAttr("disabled");
    $("#endDay").val("");
    $("#endDay").attr("disabled","disabled");
  } else if(timeMode==33) {
    //按日
    $("#startMonth").removeAttr("disabled");
    $("#startDay").removeAttr("disabled");

    $("#endMonth").removeAttr("disabled");
    $("#endDay").removeAttr("disabled");
  }
}

/**
 * 设置等待框显示信息显示
 *
 * @param msg
 *           提示信息
 * @param timerMsg
 *           倒计时信息
 */
function waitingMessage(msg,timerMsg){
  if(!msg)
    msg="";
  $("#waiting-msg").html(msg);

  if(!timerMsg)
    timerMsg="";
  $("#waiting-timer-msg").html(timerMsg);
}

/**
 * 倒计时，结束时执行stat语句。
 * id="counter"元素的值是倒计时的秒数。
 *
 * @param stat
 *           执行的语句。可以为空
 * @param seconds
 *           倒计时秒数（如果为空，默认3秒）
 */
function timeCounting(stat,seconds){
  if(seconds||seconds==0)
    seconds=parseInt(seconds);
  else
    seconds=2;

  if(seconds&&seconds>0) {
    $("#counter").html(seconds);
    seconds--;
    var sb=new StringBuffer();
    sb.append("timeCounting(");
    sb.append("\"");
    sb.append(stat);
    sb.append("\",");
    sb.append(seconds);
    sb.append(")");
    setTimeout(sb.toString(),1000);
  } else {
    if(stat)
      eval(stat);
    $("#waiting-modal-dialog").modal("hide");
  }
}
