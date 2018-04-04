// JavaScript Document
var PAGE_COUNT=10;    //默认一页显示数量

//显示字段数组
var items = new Array("answer_code","answer_name","answer_answerkey","answer_answercode","answer_start","answer_end","answer_object","answer_objectid","answer_flag");

//获得显示的字段
function addNew(){
  var params={};
  params["objectName"]="MobileAnswer";
  params["action"]="getNew";
  //params["user_id"]=request["user_id"];
  getEdit(tek.common.getRootPath()+"servlet/tobject",params,items,"add-info");
}


//提交信息
function addNewInfo(){
	var mydata=getSerializeObjectParameters("add_form") || {};	//转为json
	mydata["objectName"] = "MobileAnswer";
	mydata["action"] = "addInfo";
	//mydata["user_id"] = request["user_id"];
	editInfo(tek.common.getRootPath()+"servlet/tobject",mydata);
}

function appendCustomEditField(field,record,sb) {
   if(field &&　field.name=="account_device")
   {
     var fieldname=field.name;    //域名
     var show=field.show;    //域显示值
     if(show && show.length>0)
        show=stringToInputHTML(show);
     else
        show="";
     sb.append("<div class='form-group'>");
     appendNameField(field,sb);
     sb.append("<div class='col-lg-9'>");
	 $.ajax({
      type: "post",
      url: tek.common.getRootPath()+"servlet/tobject",
      dataType: "json",
      async:false,
      data:{
		 "objectName":"Device",
		 "action":"getList",
		 "skip":0,
		 "count":PAGE_COUNT		 
	  },
	  success:function(data){
       if(data){
          if (data.code==0){
            // 自定义操作
			  sb.append("<select id='");
              sb.append(field.name);
              sb.append("'");
              sb.append(" name='");
              sb.append(field.name);
              sb.append("' class='form-control'");
              sb.append(">");
	        var record=data["record"];
            if(record){
              if(record.length) {
				  for(var i=0; i<record.length; i++) 
			  	    appendOption2(record[i],record.show, sb);
					    sb.append("</select>");
			  } else {
				    appendOptionone(record,null, sb);
			  }
       		}
			else{
                   sb.append("</select>");
			}
		  } else {
			  var error=new StringBuffer();
			  error.append("<font color='red'>");
			  error.append(data.code);
			  error.append(" - ");
			  error.append(stringToHTML(data.message));
			  error.append("</font>");
		      sb.append(error.toString());
		  }	
		} else {
            sb.append("<font color='red'>操作失败![data=null]</font>")
        }
      },

      error: function(request) {
        var error=new StringBuffer();
		error.append("<font color='red'>");
        error.append("操作失败![");
        error.append(request.status);
        error.append(" - ");
        error.append(request.response);
		error.append("]");
		error.append("</font>");
		sb.append(error.toString());
      }
	 });
	    sb.append("</div>");
        sb.append("</div>");
   }
   else
   {
	   appendDefaultEditField(field,record,sb)
   }
}

//多条device数据
function appendOption2(record,now,sb){
	if(!record)
		return;
    sb.append("<option value='");
    sb.append(record.id);
    sb.append("' class='form-control'");
    sb.append(">");
    sb.append(record.name);
    sb.append("</option>");	
}

//一条device数据时
function appendOptionone(record,now,sb){
	if(!record)
		return;
    sb.append("<option value='");
    sb.append(record.id);
    sb.append("' class='form-control'");
    sb.append(">");
    sb.append(record.name);
    sb.append("</option>");	
	sb.append("</select>");
}
