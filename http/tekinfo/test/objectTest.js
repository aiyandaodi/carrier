// JavaScript Document

/**
 * 开始测试
 * 
 */
function test() {
  var html="<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在测试...";
  tek.macCommon.waitDialogShow(null, html, null, 2);

  $("#message").html("");
  $("#table").html("");

  var params={};
  params["action"]="objectTest";
  params["input-stream"]="file";
  
  $.ajaxFileUpload({
      type: "post", 
      async:false,
	  fileElementId:"file", //表示文件域ID
	  secureuri:false,  //是否启用安全提交
      url: tek.common.getRootPath()+"servlet/test",
      dataType: "json",
      data: params,
      success: function(data) {
          if(data) {
            if (data.code==0) {
              // 操作成功
              if(data.message)
                $("#message").html(tek.dataUtility.stringToHTML(data.message));
			  
              var html="";
			  html+="<div>测试用例数：" + data.value + "</div>";
			  var errHTML="<div>测试未通过：<font color='red'>";
			  
			  var tableHTML="<table border='1' class='col-md-12'>";
			  
			  var records=data.record;
			  if(records) {
				  var number=1;
				  var oneId=1;
				  var twoId=1;
				  var threeId=1;
				  
				  if(records.length) {
					for(var i in records) {
					  if(!records[i])
					    continue;
						
					  var type;
					  if(records[i] && records[i]["case_type"])
					    type=records[i]["case_type"].value;
					  if(!type)
					    continue;
                      
					  var id;
					  var parentId;
					  
					  if(type=="result" || type=="change" || type=="read") {
					    // 一类
						id="test-"+(oneId++);
						parentId=0;
					  } else if (type=="read") {
					    // 二类
					    id="test-"+oneId+"-"+(twoId++);
					    parentId="test-"+oneId;
					  } else {
						// 三类
					    id="test-"+oneId+"-"+twoId+"-"+(threeId++);
						
						for(var j=parseInt(i)+1; j<records.length; j++){
						  if(!records[j] || !records[j]["case_type"])
						    continue;
						  
						  var t=records[j]["case_type"].value;
						  if(t=="result" || t=="change" || type=="read") {
							parentId="test-"+oneId;
							break;
						  } else if (t=="read") {
    					    parentId="test-"+oneId+"-"+twoId;
							break;
						  }
 						}
					  }
					  
					  tableHTML=showRecord(records[i], tableHTML, number, id, parentId);
					  
					  if(type=="result") {
						if(!records[i]["case_result"] || records[i]["case_result"].value!=1)
						  errHTML+=number+", ";
					    number++;
					  }
					}
				  } else {
				  	tableHTML=showRecord(records, tableHTML, oneId, oneId);
				  }
			  }
			  
			  tableHTML+="</table>";
			  errHTML+="</font></div>";

			  html+=errHTML;
			  html+=tableHTML;
			  
			  $("#table").html(html);
			  
            } else {
              // 操作错误
              var error="<font color='red'>";
              if(data.code)
                error+=data.code;
              error+=" - ";
              if(data.message)
                error+=tek.dataUtility.stringToHTML(data.message);
              error+="</font>";
              $("#message").html(error);              
            } // end if (data.code==0) else
            
          } else {
            $("#message").html("<font color='red'>操作失败![data=null]</font>");
          } // end if(data) else
      },

      error: function(request) {
          var error="<font color='red'>操作错误![";
          if(request.status)
            error+=request.status;
          error+=" - ";
          if(request.response)
            error+=request.response;
          error+="]</font>";
          $("#message").html(error);
      },
	  
	  complete: function() {
		  tek.macCommon.waitDialogHide();
	  }
  });
}

// 显示测试
function showRecord(record, html, number, id, parentId) {
  if (!record)
    return html;
  if(!record["case_type"])
    return html;
  
  html+="<tr";
  if(parentId)
    html+=" class='"+parentId+"' style='display:none;'";
  html+=" onclick='change(this, true);' data='"+id+"'>";
  
  var typeValue=record["case_type"].value;
  html+="<td";
  if(typeValue=="result")
    html+=" class='case_number' style='text-align=center;'>" + number;
  else
    html+=">";
  html+="</td>";
  
  // 测试结果
  if(record["case_result"]) {
	var result=record["case_result"].show;
	if(result)
      result=tek.dataUtility.stringToHTML(result);
	else
	  result="";
    html+="<td class='col-xs-1 case_result case_result_"+record["case_result"].value+"'>"+result+"</td>";
  } else
    html+="<td class='col-xs-1 case_result'></td>";
  
  // 类型
  var type=record["case_type"].show;
  if(type)
    type=tek.dataUtility.stringToHTML(type);
  else
    type="";
  html+="<td class='col-xs-1 case_type case_type_"+typeValue+"'>"+type+"</td>";
  
  // 测试说明
  var remark="";
  if(record["case_remark"]) {
    remark=record["case_remark"].show;
    if(remark)
      remark=tek.dataUtility.stringToHTML(remark);
    else
      remark="";
  }
  html+="<td class='case_remark case_type_"+record["case_type"].value+"'>"+remark+"</td>";
  html+="</tr>";

  // URL
  if(record["case_url"]) {
    var url=record["case_url"].show;
	if(url) {
      html+="<tr class='"+id+"' style='display:none;'>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'>";
      url=tek.dataUtility.stringToHTML(url);
      html+=url+"</td>";
      html+="</tr>";
	}
  }

  // message
  if(record["case_message"]) {
    var message=record["case_message"].show;
    if(message) {
      html+="<tr class='"+id+"' style='display:none;'>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'>";
      html+=tek.dataUtility.stringToHTML(message);
      html+="</td>";
      html+="</tr>";
	}
  }
  
  return html;
}

function change(elem, flag) {
//alert($(elem).html());
  $("."+$(elem).attr("data")).each(function() {
      if(flag && $(this).css("display")=="none") {
        $(this).css("display","");
	  } else {
        $(this).css("display","none");
        $("."+$(elem).attr("data")).each(function() {
			change($(this), false);
		});
	  }
  });
}
