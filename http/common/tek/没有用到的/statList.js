/***************************************************************************************************
 * 说明：                                                                               
 *   该JS文件用于使用macadmin-5.0样式生成的标准化统计列表页面。（需要加载dataUtility.js）                                     
 *-------------------------------------------------------------------------------------------------
 * 页面需要初始化的参数：
 *     timeFields - 时间域名数组。例如：
 *                  timeFields=new Array();
 *                  timeFields.push('qrcertify_time');
 *------------------------------------------------------------------------------------------------
 * 公共参数&函数：
 *     function statList(ajaxURL, ajaxParams); - 生成统计表。
 *     function waitingMessage(msg,timerMsg); - 设置等待框显示信息显示。
 *     function timeCounting(stat,seconds); - 倒计时，结束时执行stat语句。
 ***************************************************************************************************/
 
var timeFields=new Array();    // 时间域名数组

/**
 * 生成统计表
 *
 * @param ajaxURL
 *           ajax地址
 * @param ajaxParams
 *           ajax参数
 */
function statList(ajaxURL, ajaxParams) {
  var html= new StringBuffer();
  html.append("<img src='../../js/");
  html.append(tek.common.getRelativePath());
  html.append("http/images/waiting-small.gif'/> 正在生成统计表...");
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
  
  var params=objectCopy(ajaxParams,objectCopy(request));

  params["group-field"]=groupField;
  params["report-field"]=reportField;
  params["group-total"]=$("input[name='group-total']:checked").val();
  params["report-total"]=$("input[name='report-total']:checked").val();
  params["report-percent"]=$("input[name='report-percent']:checked").val();
  
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
            $("#stat-condition").hide();
            showStatList(data.value,data.record);
            $("#waiting-modal-dialog").modal("hide");

		  } else{
			// 操作错误
            var error=new StringBuffer();
            error.append("<font color='red'>");
            error.append(data.code);
            error.append(" - ");
            error.append(stringToHTML(data.message));
            error.append("<font color='red'>");
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
        error.append("操作错误![");
        error.append(request.status);
        error.append(" - ");
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
 * 显示统计表数据
 *
 * @param title
 *           标题
 * @param records
 *           数据
 */
function showStatList(title,records) {
  if (records){
    var sb=new StringBuffer();
	sb.append("<table border='1' align='center' cellspacing='0' cellpadding='0' bordercolor='#cccccc' style='overflow:scroll;'>");
	
	var size=getStatInfoColumnSize(records);
    if(title&&size&&size>0){
      // 标题
      sb.append("<tr><td colspan='");
	  sb.append(size);
	  sb.append("' style='font-weight:bold;'>");
	  sb.append(title);
	  sb.append("</td></tr>");
	}
	
    if (records.length) {
      // 多条数据
      showStatInfoColumns(records[0],sb);
	  
      for(var i in records)
	    showStatInfo(records[i],sb);
    } else {
      // 一条数据
      showStatInfoColumns(records,sb);
	  showStatInfo(records,sb);
    }
	
	sb.append("</table>");
    $("#stat-table").html(sb.toString());
 
  } else {
    $("#stat-modal-dialog-body").html("没有数据!");
	timeCounting();
  } // end if (record) else
}

/**
 * 取得统计表列数
 */
function getStatInfoColumnSize(records){
  var size=0;
  
  var rec;
  if (records.length)
    rec=records[0];
  else
    rec=records;

  for(var key in rec){
    if(key && key!="id" && key!="name")
	  size++;
  }
  
  return size;
}

/**
 * 设置统计表列名
 */
function showStatInfoColumns(record,sb){
  sb.append("<tr>");
  
  for(var key in record){
    if(!key || key=="id" || key=="name")
	  continue;

    var field=record[key];

	sb.append("<td style='min-width:100px;'>");
	if(field && field.display)
      sb.append(field.display);
    else
	  sb.append("  ");
    sb.append("</td>");
  }
  
  sb.append("</tr>");
}

/**
 * 设置统计表列值
 */
function showStatInfo(record,sb){
  sb.append("<tr>");
  
  for(var key in record){
    if(!key || key=="id" || key=="name")
	  continue;

    var field=record[key];

	sb.append("<td>");
	if(field&&field.show)
      sb.append(field.show);
    else
	  sb.append("  ");
    sb.append("</td>");
  }
  
  sb.append("</tr>");
}

/**
 * 改变报告域
 */
function changeGroupField() {
  var field=$("#group-field").val();
  if(field=="qrcertify_time") {
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
 * 等待框显示信息显示
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
 * 倒计时，结束时执行stat语句。<br/>
 * id="counter"元素的值是倒计时的秒数，<br/>
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
