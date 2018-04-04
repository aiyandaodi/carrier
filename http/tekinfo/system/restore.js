// JavaScript Document
  var showClose;    // 是否关闭
  var callbackURL;    // 回调地址
  var updateOpener;    //是否刷新父页面

  /**
   * 初始化
   */
  function init(){
    showClose=request["show-close"];
    if(showClose
	    && (showClose==1 || showClose==true))
      showClose=1;
	else
	  showClose=0;

    callbackURL=request["callback-url"];
    if(callbackURL)
      callbackURL=decodeURIComponent(callbackURL);
	
	updateOpener=request["refresh-opener"];
	if(updateOpener
	    && (updateOpener==1 || updateOpener==true))
	  updateOpener=1;
	else
	  updateOpener=0;

    tek.common.getUser();	
	if (mySecurity>=0x40){
      initialButton("btn");
	} else {
      // 没有权限
	  $("#input-form").hide();
      showReadMessage("没有权限!",document.getElementById("message"));
	}
	
    //日历初始化
    initNoteCalender( {
	    type: "note",
   	    daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
	    datestr: "",
    	begin: "2010,1"
    });
  }
/**
 * 初始化默认的底部按钮（提交）
 * 
 * @param parentId
 *           父元素标识
 */
function initialButton(parentId) {
  var sb=new StringBuffer();
  sb.append("<button type='button' id='submitBtn' class='btn btn-danger' onclick='restore()'>还原</button>");
 
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
function restore(){
  $("#message").html("");
  var mydata=getSerializeObjectParameters("input-form") || {};	//转为json
    
	/*var start=mydata["start"];
	if(start){
		start=decodeURIComponent(start);
		var date=stringToMinDate(start,"yyyy-MM-dd");
		if(date)
			mydata["start"]=date.getTime();
	}*/
	
  mydata["action"]="restore";

  // 等待框	
  showwaitingMessage("<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/>  正在还原...");
  $("#waiting-modal-dialog").modal("show",null,2);

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
              $("#message").html(stringToHTML(data.message));

              seconds=3;
              showwaitingMessage("还原成功!");
              setTimeout("$('#waiting-modal-dialog').modal('hide');",1000);

            } else {
              // 操作错误
              seconds=3;
              var error=new StringBuffer();
              error.append(data.code);
              error.append(" - ");
              error.append(stringToHTML(data.message));
              showwaitingMessage(error.toString());
              setTimeout("timeCounting()",1000);
            } // end if (data.code==0) else
			  
          } else {
            seconds=3;
            showwaitingMessage("操作失败![data=null]");
            setTimeout("timeCounting()",1000);
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
		  showwaitingMessage(error.toString());
          setTimeout("timeCounting()",1000);
      },
		
      complete: function() {
      }
  });
}
