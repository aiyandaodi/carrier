printField_String// JavaScript Document
//输出不同字段的html显示值（编辑），需要StringBuffer支持，common/js/common.js

// 返回字段显示的html字符串
// functionname - 如果值发生改变，事件处理函数名。可以为null。
// id - 字段所属对象标识
// name - 字段名
// display - 字段本地显示名
// value - 字段值
// disabled - 是否禁止编辑
function printField_String(functionname,id,name,display,value,disabled){
	var sb = new StringBuffer();
	
	sb.append(printBefore(name,display));
	
	sb.append(printInput(functionname,id,name,value,disabled));
	
	sb.append(printAfter());
	
	return sb.toString(); 
}

// 返回还有选择字段显示的html字符串
// functionname - 如果值发生改变，事件处理函数名。可以为null。
// id - 字段所属对象标识
// name - 字段名
// display - 字段本地显示名
// value - 字段值
function printField_Select(functionname,id,name,display,value,optionValue,optionShow){
	var sb = new StringBuffer();
	
	sb.append(printBefore(name,display));
	
	sb.append(printSelect(functionname,id,name,value,optionValue,optionShow));
	
	sb.append(printAfter());
	
	return sb.toString(); 
}

// 返回字段显示的html的前导字符串
// name - 字段名
// display - 字段本地显示名
function printBefore(name,display){
	var sb = new StringBuffer();
	
	sb.append(" <ul id='");
	sb.append(name);
	sb.append("_info' class='");
	sb.append(name);
	sb.append("_info'>");
	
	sb.append("<li id='");
	sb.append(name);
	sb.append("_title' class='");
	sb.append(name);
	sb.append("_title'>");
	sb.append(display);
	sb.append("</li>");
	
	sb.append("<li id='");
	sb.append(name);
	sb.append("_input' class='");
	sb.append(name);
	sb.append("_input'>");
	
	return sb.toString(); 
}

// 返回字段显示的html的结束字符串
// name - 字段名
// display - 字段本地显示名
function printAfter(){
	var sb = new StringBuffer();
	
	sb.append("</li></ul>");
	
	return sb.toString(); 
}

// 返回字段显示的html字符串
// functionname - 如果值发生改变，事件处理函数名。可以为null。
// id - 字段所属对象标识
// name - 字段名
// value - 字段值
// disabled - 是否禁止编辑
function printInput(functionname,id,name,value, disabled){
	var sb = new StringBuffer();
	
	sb.append("<input type='text' id='");
	sb.append(name);
	sb.append("' class= '");
	sb.append(name);
	sb.append("' name= '");
	sb.append(name);
	sb.append("' value='");
	sb.append(value);
	sb.append("'");
	if(functionname!=null && id!=0){
		sb.append(" onchange='javascript:");
		sb.append(functionname);
		sb.append("(\"");
		sb.append(id);
		sb.append("\",this);'");
	}
	
	if(disabled)
	  sb.append(" disabled='disabled'");
	
	sb.append("/>");
	
	return sb.toString(); 
}

// 返回select字段显示的html字符串
// name - 字段名
// value - 字段值
// optionValue - 数组，可选值
// optionShow - 数组，显示内容
function printSelect(functionname,id,name,value,optionValue,optionShow){
	var sb = new StringBuffer();
	
	sb.append("<select id='");
	sb.append(name);
	sb.append("' name='");
	sb.append(name);
	sb.append("'");
			
	if(functionname!=null && id!=0){
		sb.append(" onchange='javascript:");
		sb.append(functionname);
		sb.append("(\"");
		sb.append(id);
		sb.append("\",this);'");
	}
	sb.append(">");
			
	if(optionValue.length==optionShow.length){
		for(i=0;i<optionValue.length;i++){
			sb.append("<option value='");
			sb.append(optionValue[i]);
			sb.append("'");
			
			if(value==optionValue[i])
				sb.append(" selected");
		
			sb.append(">");
			sb.append(optionShow[i]);
			sb.append("</option>");
		} //end for(int i=0;i<optionValue.length;i++)
	}
	sb.append("</select>");
	
	//alert(sb.toString());
	return sb.toString(); 
}