// JavaScript Document

/**
 * 更新时间格式输入值
 * 
 * @param fieldName
 *           域名
 * @param format
 *           时间格式
 * @param variable
 *           域数据类型
 */
function updateTime(fieldName, format, variable) {
  var field=document.getElementById(fieldName);

  var yyyy=document.getElementById(fieldName+"yyyy");
  var MM=document.getElementById(fieldName+"MM");
  var dd=document.getElementById(fieldName+"dd");
  if(!field || !yyyy || !MM || !dd)
    return;

  var HH=document.getElementById(fieldName+"HH");
  var mm=document.getElementById(fieldName+"mm");
  var ss=document.getElementById(fieldName+"ss");

  var value;
  
  if(format=="yyyy-MM-dd"){
    // 年月日
	if(variable=="string") {
	  value=yyyy.value+"-"+MM.value+"-"+dd.value;
    } else {
      var date=new Date(yyyy.value, MM.value, dd.value);
	  value=date.getTime();
	}

  } else {
    // 年月日时分秒
    if(!HH || !mm || !ss)
      return ;

	if(variable=="string") {
	  value=yyyy.value+"-"+MM.value+"-"+dd.value+" "+HH.value+":"+mm.value+":"+ss.value;
	} else {
      var date=new Date(yyyy.value, MM.value, dd.value, HH.value, mm.value, ss.value);
	  value=date.getTime();
	}
  }
  
  if(!value)
    value="";
  field.value=value;
}
