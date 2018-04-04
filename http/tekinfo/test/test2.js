// JavaScript Document

/**
 * 加载
 * 
 */
function webTestLoad() {
  var html="<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在加载...";
  tek.macCommon.waitDialogShow(null, html, null, 2);

  $("#message").html("");
  $("#table").html("");

  var params={};
  params["action"]="webTestLoad";
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
			  
			  var tableHTML="<table border='1' style='margin:5px auto;'>";
			  
			  var records=data.record;
			  if(records) {
				if(records.length) {
				  for(var i in records) {
				    if(records[i])
    			      tableHTML=showRecord(records[i], tableHTML, (parseInt(i)+1));
				  }
				} else {
				  tableHTML=showRecord(records, tableHTML, 1);
				}
			  } // end if(records)
			  
			  tableHTML+="</table>";

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
function showRecord(record, html, number) {
  if (!record)
    return html;
  
  html+="<tr id='test-"+number+"'>";
  
  html+="<td class='case_number' style='text-align=center;'>" + number + "</td>";
  
  // 测试结果
  var result=0;
  if(record["case_result"])
	result=record["case_result"].value;

  // 测试说明
  var remark="";
  if(record["case_remark"]) {
    remark=record["case_remark"].show;
    if(remark)
      remark=tek.dataUtility.stringToHTML(remark);
    else
      remark="";
  }
  html+="<td class='case_remark'>"+remark+"</td>";
  
  // 按钮
  html+="<td class='case_btn center'>";

  if(result==1 && record["case_url"] && record["case_message"]) {
    var url=record["case_url"].show;
    var message=record["case_message"].show;
    if(url) {
      html+="<button class='btn-danger' onclick='change("+number+");'>变更数据</button>";
      html+="<button id='open-"+number+"' class='btn-success openPage hide' onclick='openPage("+number+", \""+url+"\",\""+message+"\");'>打开网页</button>";
	}
  }
  html+="</td>";

  html+="</tr>";
  
  //html+="<tr><td colspan='3' class='row'><table border='1' class='col-xs-12'><tr><td>1</td><td>2</td></tr><tr><td>A</td><td>B</td></tr></table></td></tr>";
  
  return html;
}

// 测试
// number - 测试用例编号
function change(number) {
  var sub=document.getElementById("test-sub");
  if(sub)
    sub.parentNode.removeChild(sub);
	
  $(".openPage").addClass("hide");

  var html="<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在变更数据...";
  tek.macCommon.waitDialogShow(null, html, null, 2);

  var params={};
  params["action"]="webTest";
  params["input-stream"]="file";
  params["number"]=number;
  
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
			  var html="<tr id='test-sub'><td colspan='3' class='row'>";
			  
              if(data.message)
                html+="<div>"+tek.dataUtility.stringToHTML(data.message)+"</div>";
			  
			  html+="<table border='1' class='col-xs-12'>";
			  
			  var flag=true;    // 是否全部操作成功
			  var records=data.record;
			  if(records) {
				if(records.length) {
				  for(var i in records) {
				    if(records[i])
    			      html=showChangeRecord(records[i], html);
				  }
				} else {
				  html=showChangeRecord(records, html);
				  if (record["case_result"] && record["case_result"].value!=1 && record["case_type"]
				      && (record["case_type"].value=="logout" || record["case_type"].value=="login" || record["case_type"].value=="change")) {
                    flag=false;
				  }
				}
			  } // end if(records)
			  
			  if(flag)
				$("#open-"+number).removeClass("hide");
			  
			  html+="</table>";
			  
			  html+="</td></tr>";
			  $("#test-"+number).after(html);
			  
            } else {
              // 操作错误
    		  var error="<tr id='test-sub'><td colspan='3' class='row'>";
              error+="<font color='red'>";
              if(data.code)
                error+=data.code;
              error+=" - ";
              if(data.message)
                error+=tek.dataUtility.stringToHTML(data.message);
              error+="</font>";
  			  error+="</td></tr>";
			  $("#test-"+number).after(error);
            } // end if (data.code==0) else
            
          } else {
			var error="<tr id='test-sub'><td colspan='3' class='row'>";
            error+="<font color='red'>操作失败![data=null]</font>";
			error+="</td></tr>";
		    $("#test-"+number).after(error);
          } // end if(data) else
      },

      error: function(request) {
          var error="<tr id='test-sub'><td colspan='3' class='row'><font color='red'>操作错误![";
          if(request.status)
            error+=request.status;
          error+=" - ";
          if(request.response)
            error+=request.response;
          error+="]</font></td></tr>";
		  $("#test-"+number).after(error);
      },
	  
	  complete: function() {
		  tek.macCommon.waitDialogHide();
	  }
  });
}

// 显示测试
function showChangeRecord(record, html) {
  if (!record)
    return html;
  
  html+="<tr>";
  
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
  var typeValue=record["case_type"].value;
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
      html+="<tr>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'>";
      url=tek.dataUtility.stringToHTML(url);
      html+=url+"</td>";
      html+="</tr>";
	}
  } // end if(record["case_url"])

  // message
  if(record["case_message"]) {
    var message=record["case_message"].show;
    if(message) {
      html+="<tr>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'></td>";
      html+="<td class='case_type_"+typeValue+"'>";
      html+=tek.dataUtility.stringToHTML(message);
      html+="</td>";
      html+="</tr>";
	}
  }
  
  html+="</tr>";
  
  return html;
}

// 打开测试页面
// number - 测试用例编号
function openPage(number,url,user) {
  // 1、注销
  var html="<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在退出登录...";
  tek.macCommon.waitDialogShow(null, html, null, 2);

  var logoutSetting = {async: false, operateType: "注销用户"};
  var logoutSendData = {action: "logout"};

  var logoutCallback = {
      complete: function() {
          // 2、登录
          var array=tek.dataUtility.stringToArray(user,",");
          if(array && array.length>=2) {
            var html="<font color='red'>未定义登录用户！（"+user+"）</font>";
            tek.macCommon.waitDialogShow(null, html, null, 0);

            var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在登录...";
	        tek.macCommon.waitDialogShow(null, html, null, 2);
  
            var loginSetting = {async: true, operateType: "本地登录"};
  
            var params={};
	  	    params["action"]="login";
		    params["userlogin"]=encodeURIComponent(array[0]);
		    params["password"]=encodeURIComponent(array[1]);

            var loginCallback = {
              success: function (data) {
	              tek.macCommon.waitDialogHide();

                  // 3、打开页面
	              window.open(url, "_blank");
              },
		      error: function (data, message) {
			      tek.macCommon.waitDialogShow(null, message, null, 0);
              }
            };

            tek.common.ajax(tek.common.getRootPath() + "servlet/login", loginSetting, params, loginCallback);
		  } else {
			// 匿名用户，直接打开测试页面
            tek.macCommon.waitDialogHide();
            window.open(url, "_blank");
		  }
	  }
  };

  tek.common.ajax(tek.common.getRootPath() + "servlet/login", logoutSetting, logoutSendData, logoutCallback);
}
