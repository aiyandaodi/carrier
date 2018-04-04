var seconds;

var fields={};    // 可选字段
var reportNumber=0;    // 报表计数

/**
 * 初始化报表
 */
function initialReport() {
  getListFields();
  
  if (fields){
    for (var name in fields)
	  appendOutputField(name);
  }
}

/**
 *
 */
function getListFields() {
  $("#waiting-modal-dialog-title").html("");
  var html=new StringBuffer();
  html.append("<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/> 正在获取数据...");
  $("#waiting-msg").html(html.toString());
  $("#waiting-modal-dialog").modal("show",null,2);
  
  
  var params=getInitParams();
  params["action"]="getFields";

  $.ajax({
	  async: false,
      type: "post", 
      url: tek.common.getRootPath()+"servlet/tobject",
      dataType: "json",
      data: params,
      success: function(data) {
          if(data) {
            if (data.code==0) {
              // 操作成功
              fields=data["record"];
			  if (fields) {
                for (var name in fields){
				  if(!fields[name].name)
				    fields[name]=undefined;
				}
			  }
			  
              $("#waiting-modal-dialog").modal("hide");
            
			} else {
              // 操作错误
              seconds=2;
              var error=new StringBuffer();
              error.append(data.code);
              error.append(" - ");
              error.append(tek.dataUtility.stringToHTML(data.message));
	          $("#waiting-msg").html(error.toString());
            } // end if (data.code==0) else
			
          } else {
            seconds=2;
            $("#waiting-msg").html("操作失败![data=null]");
          } // end if(data) else
      },

      error: function(request) {
		  seconds=2;
          var error=new StringBuffer();
          error.append("操作失败![");
          error.append(request.status);
          error.append(" - ");
          error.append(request.response);
          error.append("]");
          $("#waiting-msg").html(error.toString());
        },
		
        complete: function() {
        }
	});
}

/**
 * 添加字段条件
 */
function addConditionField() {
  $("#waiting-modal-dialog-title").html("添加条件");
  $("#waiting-msg").html("");

  if(fields) {
    var html=new StringBuffer();
    html.append("<select id='select-field' class='form-control'>");
	for (var name in fields) {
	  var field=fields[name];
	  if(field && field.display) {
        html.append("<option value='");
		html.append(name);
		html.append("'>");
		html.append(field.display);
		html.append("</option>");
	  }
	}
    html.append("</select>");
    html.append("<button class=\"btn btn-success\" onclick=\"appendConditionField($('#select-field').val());\">确定</button>");
    $("#waiting-msg").html(html.toString());
    $("#waiting-modal-dialog").modal("show",null,0);
  
  } else {
    $("#waiting-msg").html("没有有效字段!");
    $("#waiting-modal-dialog").modal("show",null,0);
    setTimeout("timeCounting()",2000);
  }
}

/**
 * 增加检索条件
 *
 * @param fieldName
 *           域名
 */
function appendConditionField(fieldName) {
  if(fields) {
    var field=fields[fieldName];
	
	if (field) {
	  reportNumber++;
	  
	  var idname=reportNumber;

      var html=new StringBuffer();
	  	  
      html.append("<div id='field-condition-");
      html.append(idname);
      html.append("' class='col-lg-12 field-condition' field-name='");
	  html.append(fieldName);
	  html.append("'>");

      html.append("<label class='control-label col-lg-2' for='report-condition'>");
	  //if(children && children.length>1)
	  //  html.append("并且");
	  html.append("</label>");
	  // 字段display
	  html.append("<div class='col-lg-2'><input type='text' id='field-condition-");
      html.append(idname);
      html.append("' class='form-control center' value='");
      html.append(field.display);
      html.append("' disabled='disabled'/></div>");

      var format=field.format;
	  if(format==0x02) {
        // 布尔值
		html=appendSelectConditionField(field, idname, html);

	  } else if (format==0x08 || format==0x09){
	    // 时间
		html=appendDateConditionField(field, idname, html);
		
	  } else if (format==0x10 || format==0x11 ||　format==0x12 || format==0x14
	      || format==0x20 || format==0x21 || format== 0x22 || format==0x24) {
	    // 单选、多选
		html=appendSelectConditionField(field, idname, html);
		
	  } else {
		// 默认格式
		html=appendDefaultConditionField(field, idname, html);
	  }

      // 删除按钮
      html.append("<div class='col-lg-1'>");
      html.append("<i class='fa fa-ban fa-3x' onclick='removeConditionField(\"field-condition-");
	  html.append(reportNumber);
	  html.append("\");'></i>");
	  html.append("</div>");
      html.append("<div class='col-lg-1'><label class='control-label'></label></div>");
      html.append("</div>");
	  
      $("#field-condition").append(html.toString());
	  $('#field-condition').slideDown();
	  
	  if (format==0x08 || format==0x09){
	    $("#datetimepicker-"+idname+"-start").datetimepicker({
            format: 'yyyy-MM-dd',
            language: 'cn',
            pickDate: true,
            pickTime: false
        });

        $("#datetimepicker-"+idname+"-end").datetimepicker({
            format: 'yyyy-MM-dd',
            language: 'cn',
            pickDate: true,
            pickTime: false
        });
	  }
	} // end if (field)
  } // end if(fields)
  
  $("#waiting-modal-dialog").modal("hide");
}

/**
 * 添加选择格式的字段条件
 *
 * @param field
 *           JSON字段
 * @param idname
 *           id（fieldname+number）
 * @param html
 *           输出html
 * @return 返回html。
 */
function appendSelectConditionField(field, idname, html) {
  if(!field || !html)
    return html;

  var fieldName=field.name;
  var fieldDisplay=field.display;
  var selects=field.selects;
  var shows=field.shows;
  
  html.append("<div class='col-lg-2'>");
  html.append("<select class='form-control' id='field-condition-select-");
  html.append(idname);
  html.append("' name='field-condition-select-");
  html.append(idname);
  html.append("'>");
  html.append("<option value='='>等于</option>");
  html.append("<option value='!='>不等于</option>");
  html.append("</select>");
  html.append("</div>");
  html.append("<div class='col-lg-4'>");
  html.append("<select class='form-control' id='field-condition-value-");
  html.append(idname);
  html.append("' name='field-condition-value-");
  html.append(idname);
  html.append("'>");
  
  if(selects && shows && selects.length==shows.length){
    for(var i=0; i<selects.length; i++){
      html.append("<option value='");
      html.append(selects[i]);
	  html.append("'>");
	  html.append(shows[i]);
	  html.append("</option>");
	}
  }
  html.append("</select>");
  html.append("</div>");

  return html;
}

/**
 * 添加时间格式的字段条件
 *
 * @param field
 *           JSON字段
 * @param num
 *           id（fieldname+number）
 * @param html
 *           输出html
 * @return 返回html。
 */
function appendDateConditionField(field, idname, html) {
  if(!field || !html)
    return html;

  var fieldName=field.name;
  var fieldDisplay=field.display;

  html.append("<div class='col-lg-1'><label class='control-label col-right'>从：</label></div>");
  html.append("<div class='col-lg-2'>");
  html.append("<div id='datetimepicker-");
  html.append(idname);
  html.append("-start' class='input-append input-group'>");
  html.append("<input data-format='yyyy-MM-dd' id='field-condition-value-start-");
  html.append(idname);
  html.append("' name='field-condition-value-start-");
  html.append(idname);
  html.append("' type='text' class='form-control' placeholder='开始时间'/>");
  html.append("<span class='input-group-addon add-on'>");
  html.append("<i data-time-icon='fa fa-times' data-date-icon='fa fa-calendar' class='fa fa-calendar'></i>");
  html.append("</span>");
  html.append("</div>");
  html.append("</div>");
  html.append("<div class='col-lg-1'><label class='control-label col-right'>到：</label></div>");
  html.append("<div class='col-lg-2'>");
  html.append("<div id='datetimepicker-");
  html.append(idname);
  html.append("-end' class='input-append input-group'>");
  html.append("<input data-format='yyyy-MM-dd' id='field-condition-value-end-");
  html.append(idname);
  html.append("' name='field-condition-value-end-");
  html.append(idname);
  html.append("' type='text' class='form-control' placeholder='结束时间'/>");
  html.append("<span class='input-group-addon add-on'>");
  html.append("<i data-time-icon='fa fa-times' data-date-icon='fa fa-calendar' class='fa fa-calendar'></i>");
  html.append("</span>");
  html.append("</div>");
  html.append("</div>");
  
  return html;
}

/**
 * 添加默认格式的字段条件
 *
 * @param field
 *           JSON字段
 * @param idname
 *           id（fieldname+number）
 * @param html
 *           输出html
 * @return 返回html。
 */
function appendDefaultConditionField(field, idname, html) {
  if(!field || !html)
    return html;

  var fieldName=field.name;
  var fieldDisplay=field.display;

  html.append("<div class='col-lg-2'>");
  html.append("<select class='form-control' id='field-condition-select-");
  html.append(idname);
  html.append("' name='field-condition-select-");
  html.append(idname);
  html.append("'>");
  html.append("<option value=' LIKE ' selected='selected'>包含</option>");
  html.append("<option value=' NOT LIKE '>不包含</option>");
  html.append("<option value='='>等于</option>");
  html.append("<option value='!='>不等于</option>");
  html.append("<option value='>'>大于</option>");
  html.append("<option value='>='>大于等于</option>");
  html.append("<option value='<'>小于</option>");
  html.append("<option value='<='>小于等于</option>");
  html.append("</select>");
  html.append("</div>");
  html.append("<div class='col-lg-4'><input type='text' id='field-condition-value-");
  html.append(idname);
  html.append("' name='field-condition-value-");
  html.append(idname);
  html.append("' class='form-control' placeholder='条件值' value=''/></div>");

  return html;
}

/**
 * 删除指定标识的条件标签
 * 
 * @param id
 *           标签id
 */
function removeConditionField(id) {
  $("#"+id).remove();
}

/**
 * 添加输出字段
 */
function addOutputField() {
  $("#waiting-modal-dialog-title").html("添加输出字段");
  $("#waiting-msg").html("");

  if(fields) {
    var html=new StringBuffer();
    html.append("<select id='select-field' class='form-control'>");
	for (var name in fields) {
	  var field=fields[name];
	  if(field && field.display) {
        html.append("<option value='");
		html.append(name);
		html.append("'>");
		html.append(field.display);
		html.append("</option>");
	  }
	}
    html.append("</select>");
    html.append("<button class=\"btn btn-success\" onclick=\"appendOutputField($('#select-field').val());\">确定</button>");
    $("#waiting-msg").html(html.toString());
    $("#waiting-modal-dialog").modal("show",null,0);
  
  } else {
    $("#waiting-msg").html("没有有效字段!");
    $("#waiting-modal-dialog").modal("show",null,0);
    setTimeout("timeCounting()",2000);
  }
}

/**
 * 增加输出字段
 *
 * @param fieldName
 *           域名
 */
function appendOutputField(fieldName) {
  if(fields) {
    var field=fields[fieldName];
	
	if (field) {
      var display=field.display;
	  
	  if (fieldName=="custom"){
	    reportNumber++;
		fieldName+="-"+reportNumber;
	  }
	  
      var html=new StringBuffer();
      html.append("<div id='field-output-");
	  html.append(fieldName);
	  html.append("' class='col-lg-12 field-output' field-name='");
	  html.append(fieldName);
	  html.append("'>");
	  // 按钮
      html.append("<div class='col-lg-2'>");
      html.append("<div class='col-right'>");
      html.append("<i class='fa fa-arrow-circle-o-down fa-3x' onclick='moveDownFieldOuput(\"field-output-");
	  html.append(fieldName);
	  html.append("\");'></i>");
      html.append("<i class='fa fa-arrow-circle-o-up fa-3x' onclick='moveUpFieldOutput(\"field-output-");
	  html.append(fieldName);
	  html.append("\");'></i>");
      html.append("</div>");
      html.append("</div>");
	  // label字段display
      html.append("<div class='col-lg-2'><input type='text' id='field-condition-");
	  html.append(fieldName);
	  html.append("' class='form-control center' value='");
	  html.append(display);
	  html.append("' disabled='disabled'/></div>");
	  // 自定义字段名
      html.append("<div class='col-lg-2'><input type='text' id='field-output-display-");
	  html.append(fieldName);
	  html.append("' name='field-output-display-");
	  html.append(fieldName);
	  html.append("' class='form-control' placeholder='显示名' value='");
	  html.append(display);
	  html.append("'/></div>");
	  // 输出公式
	  html.append("<label class='control-label col-lg-1'>计算式=</label>");
	  html.append("<div class='col-lg-3'><input type='text' id='field-output-compute-");
	  html.append(fieldName);
	  html.append("' name='field-output-compute-");
	  html.append(fieldName);
	  html.append("' class='form-control' value='");
	  //html.append("{");
	  //html.append(fieldName);
	  //html.append("}");
	  html.append("'");
	  if(!fieldName.indexOf("custom-")==0)
	    html.append(" disabled='disabled'");
	  html.append("/></div>");
      html.append("<div class='col-lg-1'>");
      html.append("<i class='fa fa-ban fa-3x' onclick='removeConditionField(\"field-output-");
	  html.append(fieldName);
	  html.append("\");'></i>");
      html.append("</div>");
      html.append("<div class='col-lg-1'><label class='control-label'></label></div>");
      html.append("</div>");
	  
      $("#field-output").append(html.toString());
	  $('#field-output').slideDown();
	} // end if (field)
  } // end if(fields)
  
  $("#waiting-modal-dialog").modal("hide");
}

/**
 * 上移指定id的输出字段
 *
 * @param id
 *           标签id
 */
function moveUpFieldOutput(id) {
  var elem=$("#"+id);
  if(!elem)
    return ;

  var prev=elem.prev(".field-output");
  if(prev && (typeof(prev.html())!="undefined"))
    prev.before(elem);
}

/**
 * 下移指定id的输出字段
 *
 * @param id
 *           标签id
 */
function moveDownFieldOuput(id) {
  var elem=$("#"+id);
  if(!elem)
    return ;

  //alert($("#field-output").html());
  var next=elem.next(".field-output");
  if(next && (typeof (next.html())!="undefined"))
    next.after(elem);
}

/**
 * 添加计算公式字段
 */
function addComputeField() {
  $("#waiting-modal-dialog-title").html("添加计算统计");
  $("#waiting-msg").html("");

  if(fields) {
    var html=new StringBuffer();
    html.append("<select id='select-field' class='form-control'>");


    var children=$("#field-output").children(".field-output");
    if (children && children.length>0){
      for(var i=0; i<children.length; i++){
        if(!children[i])
	      continue;
      
        var elem=$("#"+children[i].id);
	    if(!elem)
	      continue;

        var fieldName=elem.attr("field-name");    // 字段名
        var field=fields[fieldName];
	    if(field && field.display) {
          html.append("<option value='");
		  html.append(fieldName);
		  html.append("'>");
          html.append(field.display);
 		  html.append("</option>");
        }
	  }
	}

    html.append("</select>");
    html.append("<button class=\"btn btn-success\" onclick=\"appendComputeField($('#select-field').val());\">确定</button>");
    $("#waiting-msg").html(html.toString());
    $("#waiting-modal-dialog").modal("show",null,0);
  
  } else {
    $("#waiting-msg").html("没有有效字段!");
    $("#waiting-modal-dialog").modal("show",null,0);
    setTimeout("timeCounting()",2000);
  }
}

/**
 * 增加计算统计字段
 *
 * @param fieldName
 *           域名
 */
function appendComputeField(fieldName) {
  if(fields) {
    var field=fields[fieldName];
	
	if (field) {
      var display=field.display;
	  
      reportNumber++;
      var idname=fieldName+"-"+reportNumber;
	  
      var html=new StringBuffer();

      html.append("<div id='field-compute-");
	  html.append(idname);
	  html.append("' class='col-lg-12 field-compute' field-name='");
	  html.append(fieldName);
	  html.append("' idname='");
	  html.append(idname);
	  html.append("'>");
      html.append("<div class='col-lg-2'>");
      html.append("<div class='col-right'>");
      html.append("<i class='fa fa-arrow-circle-o-down fa-3x' onclick='moveDownFieldCompute(\"field-compute-");
	  html.append(idname);
	  html.append("\");'></i>");
      html.append("<i class='fa fa-arrow-circle-o-up fa-3x' onclick='moveUpFieldCompute(\"field-compute-");
	  html.append(idname);
	  html.append("\");'></i>");
      html.append("</div>");
      html.append("</div>");
      html.append("<div class='col-lg-2'><input type='text' id='field-compute-");
	  html.append(idname);
      html.append("' class='form-control center' value='");
	  html.append(display);
	  html.append("' disabled='disabled'/></div>");
      html.append("<div class='col-lg-3'><input type='text' id='field-compute-display-");
	  html.append(idname);
	  html.append("' name='field-compute-display-");
	  html.append(idname);
	  html.append("' class='form-control' placeholder='显示名' value='");
	  html.append(display);
	  html.append("'/></div>");
      html.append("<div class='col-lg-3'>");
      html.append("<select class='form-control' id='field-compute-select-");
	  html.append(idname);
	  html.append("' name='field-compute-select-");
	  html.append(idname);
	  html.append("'>");

	  if(field.format==0 && (!isNaN(parseFloat(field.value)) || !isNaN(parseFloat(field.show)))) {
        // 数值
		html.append("<option value='SUM'>求和</option>");
        html.append("<option value='AVERAGE'>平均数</option>");
        html.append("<option value='MAX'>最大值</option>");
        html.append("<option value='MIN'>最小值</option>");
	  }
      html.append("<option value='COUNTA'>计数</option>");
      html.append("</select>");
      html.append("</div>");
      html.append("<div class='col-lg-1'>");
      html.append("<i class='fa fa-ban fa-3x' onclick='removeConditionField(\"field-compute-");
	  html.append(idname);
	  html.append("\");'></i>");
      html.append("</div>");
      html.append("<div class='col-lg-1'><label class='control-label'></label></div>");
      html.append("</div>");
	  
      $("#field-compute").append(html.toString());
	  $('#field-compute').slideDown();
	} // end if (field)
  } // end if(fields)
  
  $("#waiting-modal-dialog").modal("hide");
}

/**
 * 上移指定id的计算字段
 *
 * @param id
 *           标签id
 */
function moveUpFieldCompute(id) {
  var elem=$("#"+id);
  if(!elem)
    return ;

  var prev=elem.prev(".field-compute");
  if(prev && (typeof(prev.html())!="undefined"))
    prev.before(elem);
}

/**
 * 下移指定id的计算字段
 *
 * @param id
 *           标签id
 */
function moveDownFieldCompute(id) {
  var elem=$("#"+id);
  if(!elem)
    return ;

  var next=elem.next(".field-compute");
  if(next && (typeof (next.html())!="undefined"))
    next.after(elem);
}

/**
 * 生成报表
 */
function createReport() {
  $("#waiting-modal-dialog-title").html("");
  var html=new StringBuffer();
  html.append("<img src='../../listReport/images/waiting-small.gif'/> 正在生成报表...");
  $("#waiting-msg").html(html.toString());
  $("#waiting-modal-dialog").modal("show",null,2);
  
  var params=objectCopy(request);
  params["action"]="report";
  
  // 标题
  var title=$("#report-title").val();
  if(title)
    params["title"]=title;

  // 条件
  params=getReportCondition(params);
  
  // 输出字段
  params=getReportFields(params);
  
  // 计算字段
  params=getReportCompute(params);

  $.ajax({
	  //async: false,
      type: "post", 
      url: "./../../servlet/tobject",
      dataType: "json",
      data: params,
      success: function(data) {
          if(data) {
            if (data.code==0) {
              // 操作成功
			  seconds=2;
              window.open(tek.common.getRootPath()+"tekinfo/system/download.jsp?file-path="+encodeURIComponent(data.value), "_blank");

	          $("#waiting-msg").html("操作成功!");
              setTimeout("timeCounting()",1000);
            
			} else {
              // 操作错误
              seconds=2;
              var error=new StringBuffer();
              error.append(data.code);
              error.append(" - ");
              error.append(tek.dataUtility.stringToHTML(data.message));
	          $("#waiting-msg").html(error.toString());
              setTimeout("timeCounting()",1000);
            } // end if (data.code==0) else
			
          } else {
            seconds=2;
            $("#waiting-msg").html("操作失败![data=null]");
			setTimeout("timeCounting()",1000);
          } // end if(data) else
      },

      error: function(request) {
		  seconds=2;
          var error=new StringBuffer();
          error.append("操作失败![");
          error.append(request.status);
          error.append(" - ");
          error.append(request.response);
          error.append("]");
          $("#waiting-msg").html(error.toString());
		  setTimeout("timeCounting()",1000);
        },
		
        complete: function() {
        }
  });
}

/**
 * 取得报表条件
 */
function getReportCondition(params) {
  if (!params)
    return params;
	
  var children=$("#field-condition").children(".field-condition");
 
  if (children && children.length>0){
    var condition=new StringBuffer();
	
	var and=false;
    for(var i=0; i<children.length; i++){
      if(!children[i])
	    continue;
      
	  var fieldName=$("#"+children[i].id).attr("field-name");    // 条件域名
	  if(!fieldName || fieldName=="")
	    continue;

	  var idname;    // 唯一id
      var id=children[i].id;
	  var loc=id.lastIndexOf("-");
	  if(loc>0)
	    idname=id.substring(loc+1);
      if(!idname)
	    continue;
		      
	  var field=fields[fieldName];
	  if(!field)
	    continue;
	  
	  var sql=new StringBuffer();
	  
      var format=field.format;
	  if(format==0x02
	  　　　 ||format==0x10 || format==0x11 ||　format==0x12 || format==0x14
	      || format==0x20 || format==0x21 || format== 0x22 || format==0x24) {
        // 下拉选择
		var relation=$("#field-condition-select-"+idname).val();
		var value=$("#field-condition-value-"+idname).val();
		if(relation && relation.length>0 && value && value.length>0) {
		  sql.append(fieldName);
		  sql.append(relation);
		  sql.append("'");
		  sql.append(value);
		  sql.append("'");
		}
	  } else if (format==0x08 || format==0x09){
	    // 时间
		var lstart;
		var lend;
		
		var start=$("#field-condition-value-start-"+idname).val();
		if(start && start.length>0){
		  var dstart=stringToMinDate(start, "yyyy-MM-dd");
		  if(dstart)
		    lstart=dstart.getTime();
		}
		var end=$("#field-condition-value-end-"+idname).val();
		if(end && end.length>0){
		  var dend=stringToMaxDate(end, "yyyy-MM-dd");
		  if(dend)
		    lend=dend.getTime();
		}
		
		if(lstart){
		  sql.append(fieldName);
		  sql.append(">=");
		  sql.append(lstart);
		}
		
		if(lend){
		  if(lstart)
		    sql.append(" AND ");
		  sql.append(fieldName);
		  sql.append("<=");
		  sql.append(lend);
		}
		
		
	  } else {
		// 默认格式
		var relation=$("#field-condition-select-"+idname).val();
		var value=$("#field-condition-value-"+idname).val();

		if(relation && relation.length>0 && value && value.length>0) {
		  sql.append(fieldName);
		  sql.append(relation);
		  sql.append("'");
		  if(relation.indexOf("LIKE")>=0)
		    sql.append("%");
		  sql.append(value);
		  if(relation.indexOf("LIKE")>=0)
		    sql.append("%");
		  sql.append("'");
		}
	  } // end if(format==) else
	  
	  if(sql) {
	    if(and)
		  condition.append(" AND ");
		else
		  and=true;
		condition.append(sql.toString());
	  }
	} // end for(var i=0; i<children.length; i++)
	
	params["report-condition"]=encodeURIComponent(condition.toString());
  } // end if (children && children.length>0)
  
  return params;
}

/**
 * 取得输出字段
 */
function getReportFields(params) {
  if (!params)
    return params;

  var fields=new StringBuffer();
  
  var children=$("#field-output").children(".field-output");
  if (children && children.length>0){
	var delim=false;
    for(var i=0; i<children.length; i++){
      if(!children[i])
	    continue;
      
	  var fieldName=$("#"+children[i].id).attr("field-name");    // 字段名
	  if(!fieldName || fieldName=="")
	    continue;

      if(delim)
        fields.append(";");
	  else
	    delim=true;
      fields.append(fieldName);
	  
	  params[fieldName+"-display"]=$("#field-output-display-"+fieldName).val();
	  params[fieldName+"-compute"]=$("#field-output-compute-"+fieldName).val();
	} // end for(var i=0; i<children.length; i++)
  } // end if (children && children.length>0)
  
  params["report-fields"]=fields.toString();
  
  return params;
}

/**
 * 取得计算字段
 */
function getReportCompute(params) {
  if (!params)
    return params;

  var fields=new StringBuffer();
  
  var children=$("#field-compute").children(".field-compute");
  if (children && children.length>0){
	var delim=false;
    for(var i=0; i<children.length; i++){
      if(!children[i])
	    continue;
      
	  var elem=$("#"+children[i].id);
	  if(!elem)
	    continue;

	  var fieldName=elem.attr("field-name");    // 字段名
	  var idname=elem.attr("idname");
	  if(!fieldName || fieldName=="" || !idname || idname=="")
	    continue;

      if(delim)
        fields.append(";");
	  else
	    delim=true;
      fields.append(idname);
	  
	  params[idname+"-display"]=$("#field-compute-display-"+idname).val();
	  var compute=new StringBuffer();
	  compute.append($("#field-compute-select-"+idname).val());
	  compute.append("({");
	  compute.append(fieldName);
	  compute.append("})");
	  params[idname+"-compute"]=compute.toString();
	} // end for(var i=0; i<children.length; i++)
  } // end if (children && children.length>0)
  
  params["report-computes"]=fields.toString();
  
  return params;
}

/**
 * 取得初始参数
 */
function getInitParams() {
  var params=objectCopy(request);
  if(!params["command"])
    params["command"]="list";

  return params;	
}

/**
 * 倒计时，结束时执行stat语句。	
 * id="counter"元素的值是倒计时的秒数，<br/>
 *
 * @param stat
 *           执行的语句。可以为空
 */
function timeCounting(stat){
	seconds--;

	if(seconds>0) {
		$("#counter").html(seconds);
		setTimeout("timeCounting(\""+stat+"\")",1000);
	} else {
		if(stat)
			eval(stat);
		$("#waiting-modal-dialog").modal("hide");
	}
}
