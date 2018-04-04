// JavaScript Document

/**
 * 初始化默认的底部按钮（提交）
 * 
 * @param parentId
 *           父元素标识
 */
function initialButton(parentId) {
  var sb=new StringBuffer();
  sb.append("<button type='button' id='submitBtn' class='btn btn-danger' onclick='backup()'>备份</button>");
 
  if(showClose==1){
    //显示关闭按钮
    sb.append("<button type='button' id='closeBtn' class='btn btn-info' onclick='tek.common.closeWithConfirm();'>关闭</button>");
  } else if (callbackURL){
    //显示返回按钮
    sb.append("<button type='button' id='callbackBtn' class='btn btn-success' onclick='tek.common.callbackWithConfirm(callbackURL)'>返回</button>");
  } else {
    // 显示“提交”、“重置”
    sb.append("<button type='reset' class='btn btn-success'>重置</button>");
  }

  $("#"+parentId).html(sb.toString());
}

/**
 * 备份
 */
function backup(){
  $("#message").html("");
  var mydata=tek.common.getSerializeObjectParameters("input-form") || {};	//转为json
  
  var start=mydata["start"];
  if(start){
    start=decodeURIComponent(start);
    var date=tek.dataUtility.stringToMinDate(start,"yyyy-MM-dd");
    if(date)
      mydata["start"]=date.getTime();
  }

  var end=mydata["end"];
  if(end){
    end=decodeURIComponent(end);
		var date=tek.dataUtility.stringToMaxDate(start,"yyyy-MM-dd");
		if(date)
			mydata["end"]=date.getTime();
  }

  mydata["action"]="backup";

  // 等待框	
  var message = "<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/>  正在备份...";
 
  tek.macCommon.waitDialogShow(null, message, null, 2);

  $.ajax({
      type: "post", 
      async:true,
      url: tek.common.getRootPath()+"servlet/database",
      dataType: "json",
	  data: mydata,
      success: function(data) {
          if(data) {
            if (data.code==0) {
              // 操作成功
              $("#message").html(tek.dataUtility.stringToHTML(data.message));

              seconds=3;
             tek.macCommon.waitDialogShow(null, "备份完成!", null, 1);
             tek.macCommon.waitDialogHide(1500);

            } else {
              // 操作错误
              seconds=3;
              var error=new StringBuffer();
              error.append(data.code);
              error.append(" - ");
              error.append(tek.dataUtility.stringToHTML(data.message));
              tek.macCommon.waitingMessage(error.toString());
              setTimeout("tek.macCommon.timeCounting()",1000);
            } // end if (data.code==0) else
			  
          } else {
            seconds=3;
            tek.macCommon.waitingMessage("操作失败![data=null]");
            setTimeout("tek.macCommon.timeCounting()",1000);
          } // end if(data) else
      },

      error: function(request) {
          seconds=3;
          var error=new StringBuffer();
          error.append("操作失败![");
          error.append(request.status);
          error.append(" - ");
          error.append(request.response);
		  error.append("]");
		  tek.macCommon.waitingMessage(error.toString());
          setTimeout("tek.macCommon.timeCounting()",1000);
      },
		
      complete: function() {
      }
  });
}

/**
 * 是否备份全部对象
 */
function backupAll(elem) {
  if(elem.checked)
    $("#object-names").attr("disabled", "disabled");
  else
    $("#object-names").removeAttr("disabled");
}
